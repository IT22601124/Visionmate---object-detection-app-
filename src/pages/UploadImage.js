import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
  TextInput,
  ScrollView,
  FlatList,
  Alert,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';

const AppContext = React.createContext();

// Upload Image Screen
const UploadImage = () => {
  const { navigate } = React.useContext(AppContext);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imageName, setImageName] = useState('');

  const pickImageAsync = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      alert('Sorry, we need camera roll permissions to make this work!');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: false,
      quality: 1,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
    }
  };

  const takePhotoAsync = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      alert('Sorry, we need camera permissions to take a photo!');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: false,
      quality: 1,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
    }
  };

  const createFormData = (uri, imageName) => {
    const fileName = uri.split('/').pop();
    const fileType = fileName.split('.').pop();

    const formData = new FormData();
    formData.append('image', {
      uri,
      name: fileName,
      type: `image/${fileType}`,
    });
    formData.append('name', imageName);

    return formData;
  };

  const postImage = async () => {
    if (!selectedImage) {
      alert('Please select or capture an image first');
      return;
    }

    if (!imageName) {
      alert('Please enter a name for the image');
      return;
    }

    const formData = createFormData(selectedImage, imageName);

    try {
      const response = await fetch('http://192.168.57.110:3001/images', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();
      if (response.ok) {
        alert(`Image uploaded successfully: ${result.imageName}`);
        navigate('DisplayImages');
      } else {
        alert('Image upload failed');
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Error uploading image');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      {selectedImage && (
        <Image source={{ uri: selectedImage }} style={styles.image} />
      )}

      <TextInput
        style={styles.input}
        placeholder="Enter Image Name"
        placeholderTextColor="#a9a9a9"
        value={imageName}
        onChangeText={setImageName}
      />

      <TouchableOpacity style={styles.galleryButton} onPress={pickImageAsync}>
        <Text style={styles.buttonText}>Select from Gallery</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.cameraButton} onPress={takePhotoAsync}>
        <Text style={styles.buttonText}>Take Photo</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.uploadButton} onPress={postImage}>
        <Text style={styles.buttonText}>Upload Image</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.displayButton}
        onPress={() => navigate('DisplayImages')}>
        <Text style={styles.buttonText}>Display Uploaded Images</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

// Update Image Screen
const UpdateImageScreen = () => {
  const { navigate, params } = React.useContext(AppContext);
  const { name } = params; // Get image name from route params
  const [selectedImage, setSelectedImage] = useState(null);
  const [newImageName, setNewImageName] = useState(name); // Default image name

  const pickImageAsync = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      alert('Sorry, we need camera roll permissions to make this work!');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: false,
      quality: 1,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
    }
  };

  const takePhotoAsync = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      alert('Sorry, we need camera permissions to take a photo!');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: false,
      quality: 1,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
    }
  };

  const createFormData = (uri, imageName) => {
    const fileName = uri.split('/').pop();
    const fileType = fileName.split('.').pop();

    const formData = new FormData();
    formData.append('image', {
      uri,
      name: fileName,
      type: `image/${fileType}`,
    });
    formData.append('name', imageName);

    return formData;
  };

  const updateImage = async () => {
    if (!selectedImage) {
      alert('Please select or capture an image first');
      return;
    }

    const formData = createFormData(selectedImage, newImageName);

    try {
      const response = await fetch(`http://192.168.57.110:3001/images/${name}`, {
        method: 'PUT',
        body: formData,
      });

      if (response.ok) {
        alert('Image updated successfully');
        navigate('DisplayImages');
      } else {
        alert('Image update failed');
      }
    } catch (error) {
      console.error('Error updating image:', error);
      alert('Error updating image');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      {selectedImage && (
        <Image source={{ uri: selectedImage }} style={styles.image} />
      )}

      <TextInput
        style={styles.input}
        placeholder="Enter New Image Name"
        placeholderTextColor="#a9a9a9"
        value={newImageName}
        onChangeText={setNewImageName}
      />

      <TouchableOpacity style={styles.galleryButton} onPress={pickImageAsync}>
        <Text style={styles.buttonText}>Select from Gallery</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.cameraButton} onPress={takePhotoAsync}>
        <Text style={styles.buttonText}>Take Photo</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.uploadButton} onPress={updateImage}>
        <Text style={styles.buttonText}>Update Image</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

// Display Images Screen
const DisplayImages = () => {
  const { navigate } = React.useContext(AppContext);
  const [images, setImages] = useState([]);

  const fetchImages = async () => {
    try {
      const response = await fetch('http://192.168.57.110:3001/images');
      const data = await response.json();
      setImages(data);
    } catch (error) {
      console.error('Error fetching images:', error);
    }
  };

  const deleteImage = async (name) => {
    try {
      const response = await fetch(`http://192.168.57.110:3001/images/${name}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setImages(images.filter(image => image.name !== name));
        alert('Image deleted successfully');
      } else {
        alert('Error deleting image');
      }
    } catch (error) {
      console.error('Error deleting image:', error);
    }
  };

  React.useEffect(() => {
    fetchImages();
  }, []);

  return (
    <FlatList
      data={images}
      keyExtractor={(item) => item.name}
      renderItem={({ item }) => (
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: `http://192.168.57.110:3001/images/${item.name}` }}
            style={styles.image}
          />
          <Text style={styles.imageText}>{item.name}</Text>
          <TouchableOpacity
            style={styles.updateButton}
            onPress={() =>
              navigate('UpdateImageScreen', { name: item.name })
            }>
            <Text style={styles.buttonText}>Update</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.deleteButton}
            onPress={() => deleteImage(item.name)}>
            <Text style={styles.buttonText}>Delete</Text>
          </TouchableOpacity>
        </View>
      )}
    />
  );
};

// Main App Component
export default function Ap() {
  const [currentScreen, setCurrentScreen] = useState('UploadImage');

  const navigate = (screen, params) => {
    setCurrentScreen(screen);
  };

  const renderCurrentScreen = () => {
    switch (currentScreen) {
      case 'UploadImage':
        return <UploadImage />;
      case 'DisplayImages':
        return <DisplayImages />;
      case 'UpdateImageScreen':
        return <UpdateImageScreen />;
      default:
        return <UploadImage />;
    }
  };

  return (
    <AppContext.Provider value={{ navigate }}>
      <View style={{ flex: 1 }}>
        {renderCurrentScreen()}
      </View>
    </AppContext.Provider>
  );
}

// Styles
const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    alignItems: 'center',
    padding: 16,
  },
  image: {
    width: 100,
    height: 100,
    marginBottom: 16,
    borderRadius: 8,
  },
  input: {
    width: '100%',
    height: 50,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    marginBottom: 16,
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  galleryButton: {
    backgroundColor: '#2196F3',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  cameraButton: {
    backgroundColor: '#4CAF50',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  uploadButton: {
    backgroundColor: '#FF9800',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  displayButton: {
    backgroundColor: '#9C27B0',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  imageContainer: {
    alignItems: 'center',
    marginVertical: 8,
  },
  imageText: {
    marginVertical: 8,
    fontSize: 16,
  },
  updateButton: {
    backgroundColor: '#FFC107',
    padding: 8,
    borderRadius: 5,
    marginVertical: 4,
  },
  deleteButton: {
    backgroundColor: '#F44336',
    padding: 8,
    borderRadius: 5,
    marginVertical: 4,
  },
});
