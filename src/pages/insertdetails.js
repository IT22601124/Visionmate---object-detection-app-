import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet,TouchableOpacity } from 'react-native';
import axios from 'axios';
import * as Speech from 'expo-speech'; // Import Expo Speech module
import { useNavigation } from '@react-navigation/native';

const DataInsertForm = () => {
  const [id, setId] = useState('');
  const [speech, setSpeech] = useState('');
  const navigation = useNavigation();

  
  // Function to handle data submission
  const handleSubmit = async () => {
    if (!id || !speech) {
      Alert.alert('Error', 'Please fill all the fields');
      return;
    }

    try {
      const response = await axios.post('http://192.168.57.110:3000/insert', { id, speech });
      if (response.status === 200) {
        Alert.alert('Success', 'Data inserted successfully');
        setId('');
        setSpeech('');
      }
    } catch (error) {
      Alert.alert('Error', 'There was a problem inserting data');
    }
  };

  // Function to test the speech description
  const handleTestSpeech = () => {
    if (!speech) {
      Alert.alert('Error', 'Please enter a speech description');
      return;
    }
    Speech.speak(speech); // This will speak out the 'speech' text
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Insert Data</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter ID"
        value={id}
        onChangeText={setId}
        keyboardType="numeric"
      />
      <TextInput
        style={styles.input}
        placeholder="Enter Speech"
        value={speech}
        onChangeText={setSpeech}
      />
      <TouchableOpacity style={styles.testButton} onPress={handleTestSpeech}>
        <Text style={styles.testButtonText}>Test</Text>
      </TouchableOpacity>
       {/* Regular Submit Button */}
       <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        <Text style={styles.submitButtonText}>Submit</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('SpeechDataView')}>
        <Text style={styles.viewDataLink}>View Speech Data</Text>
      </TouchableOpacity>
       
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f8f9fa',
    justifyContent: 'center',
    gap:4
  }, viewDataLink: {
    color: '#007bff',
    fontSize: 16,
    textAlign: 'center',
    textDecorationLine: 'underline',
    marginTop: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#343a40',
  },
  input: {
    height: 50,
    borderColor: '#ced4da',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 20,
    fontSize: 18,
    backgroundColor: '#fff',
  },
  submitButton: {
    backgroundColor: '#007bff',
    padding: 15,
    borderRadius: 8,
    marginBottom: 40,
    alignItems: 'center',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  testButton: {
    backgroundColor: '#28a745',
    width: 100, // Increase size
    height: 100, // Increase size
    borderRadius: 90, // Make it circular (half of width/height)
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center', // Center align the button
    marginTop: 20,
  },
  testButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default DataInsertForm;
