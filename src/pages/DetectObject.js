import { View, Text, TouchableOpacity, Image, StyleSheet, Alert } from 'react-native';
import React, { useState, useEffect } from 'react';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import axios from 'axios';

const DetectObject = () => {
  const [imageUri, setImageUri] = useState(null);
  const [labels, setLabels] = useState(null);

  // Request camera permissions on component mount
  useEffect(() => {
    (async () => {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Camera permission is required to use this feature.');
      }
    })();
  }, []);

  const takePhoto = async () => {
    try {
      let result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });
      if (!result.canceled) {
        setImageUri(result.assets[0].uri);
      }
      console.log(result);
    } catch (error) {
      console.log('Error taking photo:', error);
    }
  };

  const analyzeImage = async () => {
    try {
      if (!imageUri) {
        alert('Please take a photo first');
        return;
      }
      const apiKey = "AIzaSyDsUxChPKhJURlI4ZEeadAadiC0xKeIHew";
      const apiURL = `https://vision.googleapis.com/v1/images:annotate?key=${apiKey}`;

      const base64ImageData = await FileSystem.readAsStringAsync(imageUri, {
        encoding: FileSystem.EncodingType.Base64,
      });
      const requestData = {
        requests: [
          {
            image: {
              content: base64ImageData,
            },
            features: [{ type: 'LABEL_DETECTION', maxResults: 5 }],
          },
        ],
      };

      const apiResponse = await axios.post(apiURL, requestData);
      console.log("API Response:", apiResponse.data);

      const labelAnnotations = apiResponse.data.responses[0].labelAnnotations;
      if (labelAnnotations && labelAnnotations.length > 0) {
        setLabels(labelAnnotations);
      } else {
        alert("No labels detected. Try another image.");
        setLabels([]);
      }
    } catch (error) {
      console.error(
        'Error analyzing image:',
        error.response ? error.response.data : error.message
      );
      Alert.alert("Error analyzing image. Please try again later.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Google Cloud Vision API</Text>
      {imageUri && <Image source={{ uri: imageUri }} style={{ width: 300, height: 300 }} />}
      
      <TouchableOpacity onPress={takePhoto} style={styles.button}>
        <Text style={styles.text}>Take a Photo</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={analyzeImage} style={styles.button}>
        <Text style={styles.text}>Analyze Image</Text>
      </TouchableOpacity>

      {labels && labels.length > 0 && (
        <View>
          <Text>Labels:</Text>
          {labels.map((label) => (
            <Text key={label.mid} style={styles.outputtext}>
              {label.description}
            </Text>
          ))}
        </View>
      )}
    </View>
  );
};

export default DetectObject;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 50,
    marginTop: 100,
  },
  button: {
    backgroundColor: '#DDDDDD',
    padding: 10,
    marginBottom: 10,
    marginTop: 20,
  },
  text: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  label: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 20,
  },
  outputtext: {
    fontSize: 18,
    marginBottom: 10,
  },
});
