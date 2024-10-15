import { View, StyleSheet, Alert } from 'react-native';
import React, { useEffect, useState } from 'react';
import Logoview from './src/component/Logoview';
import Texta from './src/component/Texta';
import Cont from './src/component/Cont';
import { Audio } from 'expo-av';
import axios from 'axios';
import * as Speech from 'expo-speech'; 

const App = () => {
  const [speech, setSpeech] = useState('');

  const fetchSpeechData = async (id: number) => {
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

  const speak = async (text: string) => {
    if (text) {
      Speech.speak(text, {
        language: 'en', 
        rate: 1, 
      });
    }
  };

  useEffect(() => {
    fetchSpeechData(0); 

    if (speech) {
      speak(speech); 
    }
  }, [speech]);

  return (
    <View style={styles.container}>
      <Logoview />
      <Cont />
      <Texta />
    </View>
  );
};

export default App;

const styles = StyleSheet.create({
  container: {
   
  },
});
