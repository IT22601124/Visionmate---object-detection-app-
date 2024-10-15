import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert } from 'react-native';
import axios from 'axios';
import * as Speech from 'expo-speech'; // Make sure you have expo-speech installed

const SpeechPlayer = () => {
  const [id, setId] = useState('');
  const [speech, setSpeech] = useState('');

  // Function to fetch speech data by ID
  const fetchSpeechData = async () => {
    try {
      const response = await axios.get(`http://192.168.57.110:3000/speech/${id}`);
      if (response.data) {
        setSpeech(response.data.speech);
        // Play the fetched speech
        Speech.speak(response.data.speech);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to fetch speech data');
    }
  };

  return (
    <View style={{ padding: 20 }}>
      <TextInput
        placeholder="Enter Speech ID"
        value={id}
        onChangeText={setId}
        keyboardType="numeric" // Assuming ID is numeric
        style={{
          borderWidth: 1,
          borderColor: '#ccc',
          borderRadius: 5,
          padding: 10,
          marginBottom: 20,
        }}
      />
      <Button title="Play Speech" onPress={fetchSpeechData} />
      {speech ? (
        <Text style={{ marginTop: 20 }}>Fetched Speech: {speech}</Text>
      ) : null}
    </View>
  );
};

export default SpeechPlayer;
