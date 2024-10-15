import { View, Text, Image, StyleSheet, Alert } from 'react-native';
import React, { useState, useEffect } from 'react';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import axios from 'axios';
import * as Speech from 'expo-speech';
import { TapGestureHandler, LongPressGestureHandler } from 'react-native-gesture-handler';

const Science = () => {
  
  const [imageUri, setImageUri] = useState(null);
  const [labels, setLabels] = useState(null);
  const [instruction, setInstruction] = useState(null);

  const [speech, setSpeech] = useState('');

  const fetchSpeechData = async (id) => {
    try {
      const response = await axios.get(`http://192.168.57.110:3000/speech/${id}`);
      console.log('Speech Data Response:', response.data); // Log response
      if (response.data) {
        setSpeech(response.data.speech);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to fetch speech data');
      console.error(error); // Log error
    }
  };

  const speak = async (text) => {
    if (text) {
      Speech.speak(text, {
        language: 'en', 
        rate: 1, 
      });
    }
  };

  useEffect(() => {
    fetchSpeechData(7); 

    if (speech) {
      speak(speech); 
    }
  }, [speech]);

  // Request camera and media library permissions on component mount
  useEffect(() => {
    (async () => {
      const cameraStatus = await ImagePicker.requestCameraPermissionsAsync();
      const mediaLibraryStatus = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (cameraStatus.status !== 'granted' || mediaLibraryStatus.status !== 'granted') {
        Alert.alert('Permissions required to use this feature.');
      }
    })();
  }, []);

  // Function to analyze the image using Google Vision API
  const analyzeImage = async () => {
    try {
      if (!imageUri) {
        Alert.alert('Please select or take a photo first');
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
      const labelAnnotations = apiResponse.data.responses[0].labelAnnotations;

      if (labelAnnotations && labelAnnotations.length > 0) {
        const detectedLabel = labelAnnotations[0].description;
        setLabels([detectedLabel]);

        // Fetch instruction from the backend
        const instructionResponse = await axios.get(`http://192.168.57.110:3000/instruction/${detectedLabel}`);
        const instructionData = instructionResponse.data;
        setInstruction(instructionData);

        // Speak out the instruction and warnings in a male voice
        const speechText = `Instruction: ${instructionData.instruction}. Warnings: ${instructionData.warnings}`;
        Speech.speak(speechText, {
          voice: 'com.apple.ttsbundle.Daniel-compact', // Example for iOS male voice
          pitch: 1,
          rate: 1,
        });
      } else {
        Alert.alert("No labels detected. Try another image.");
        setLabels([]);
        setInstruction(null);
      }
    } catch (error) {
      console.error('Error analyzing image:', error.response ? error.response.data : error.message);
      Alert.alert("Error analyzing image. Please try again later.");
    }
  };

  const handleSinglePress = () => {
    // Handle single press to take a photo
    takePhoto();
  };

  const handleDoublePress = () => {
    // Handle double press to choose an image from gallery
    chooseImage();
  };

  const handleLongPress = () => {
    // Handle long press to analyze the image
    analyzeImage();
  };

  // Function to handle taking a photo
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
    } catch (error) {
      console.log('Error taking photo:', error);
    }
  };

  // Function to handle choosing an image from gallery
  const chooseImage = async () => {
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });
      if (!result.canceled) {
        setImageUri(result.assets[0].uri);
      }
    } catch (error) {
      console.log('Error selecting image:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Scientific Object Detection</Text>

      {imageUri && <Image source={{ uri: imageUri }} style={styles.image} />}

      {/* Tap Gesture Handler for single press */}
      <TapGestureHandler onActivated={handleSinglePress}>
        <View style={styles.gestureArea}>
          <Text style={styles.gestureText}>Tap to Take a Photo</Text>
        </View>
      </TapGestureHandler>

      {/* Tap Gesture Handler for double press */}
      <TapGestureHandler numberOfTaps={2} onActivated={handleDoublePress}>
        <View style={styles.gestureArea}>
          <Text style={styles.gestureText}>Double Tap to Choose from Gallery</Text>
        </View>
      </TapGestureHandler>

      {/* Long Press Gesture Handler */}
      <LongPressGestureHandler onActivated={handleLongPress}>
        <View style={styles.gestureArea}>
          <Text style={styles.gestureText}>Long Press to Analyze Image</Text>
        </View>
      </LongPressGestureHandler>

      {labels && labels.length > 0 && (
        <View style={styles.resultContainer}>
          <Text style={styles.resultTitle}>Detected Label:</Text>
          <Text style={styles.resultLabel}>{labels[0]}</Text>

          {instruction && (
            <View style={styles.instructionContainer}>
              <Text style={styles.instructionText}>Instruction: {instruction.instruction}</Text>
              <Text style={styles.warningText}>Warnings: {instruction.warnings}</Text>
            </View>
          )}
        </View>
      )}
    </View>
  );
};

export default Science;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f4f4f4',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  image: {
    width: 200,
    height: 200,
    borderRadius: 10,
    marginBottom: 20,
    borderWidth: 2,
    borderColor: '#ddd',
  },
  gestureArea: {
    backgroundColor: '#e7e7e7',
    padding: 15,
    borderRadius: 8,
    marginTop: 10,
    width: '80%',
    alignItems: 'center',
  },
  gestureText: {
    fontSize: 18,
    color: '#333',
  },
  resultContainer: {
    marginTop: 30,
    paddingHorizontal: 10,
    paddingVertical: 15,
    backgroundColor: '#fff',
    borderRadius: 10,
    width: '100%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  resultTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  resultLabel: {
    fontSize: 20,
    color: '#333',
  },
  instructionContainer: {
    marginTop: 15,
    width: '100%',
    backgroundColor: '#f8f9fa',
    padding: 15,
    borderRadius: 10,
  },
  instructionText: {
    fontSize: 18,
    color: '#333',
  },
  warningText: {
    fontSize: 16,
    color: '#dc3545',
    marginTop: 10,
  },
});
