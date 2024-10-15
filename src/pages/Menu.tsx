import { View, Text, StyleSheet, Alert } from 'react-native'
import React, { useEffect, useState } from 'react'
import Menuc from '../component/Menuc'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { useNavigation } from '@react-navigation/native'
import { Audio } from 'expo-av'
import axios from 'axios'
import * as Speech from 'expo-speech';

const Menu = () => {
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
    fetchSpeechData(5); 

    if (speech) {
      speak(speech); 
    }
  }, [speech]);


  const navigation = useNavigation();

    const handleSingleTap = () => {
        navigation.navigate('Menu');
    };

    const handleDoubleTap = () => {
        navigation.navigate('upload');
    };

    const handleLongPress = () => {
        navigation.navigate('DetectObject');
    };
  return (
    <View>
      <Menuc/>
          <View  style={styles.buttonContainer}>
                <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Menu')}>
                    <Text style={styles.buttonText}>Sciencetific </Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('upload')}>
                
                    <Text style={styles.buttonText}>Geomatric</Text>
            
                </TouchableOpacity>
                <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('DetectObject')}>
                    <Text style={styles.buttonText}>Currency</Text>
                </TouchableOpacity>
                
          </View>     
        
    </View>
  )
}

export default Menu

const styles = StyleSheet.create({
  container: {
      flex: 1,
      backgroundColor: '#D6D6D6', 
      justifyContent: 'center',
      alignItems: 'center',
  },
  micee: {
      justifyContent: 'center',
      alignItems: 'center',
      flex: 1,
  },
  mice: {
      width: 500, 
      height: 500,
  },
  buttonContainer: {
      marginBottom: 50,
      width: '100%',
      justifyContent: 'space-around',
      alignItems: 'center',
      flexDirection: 'row',
      paddingTop:60
  },
  button: {
      backgroundColor: 'black',
      padding: 10,
      borderRadius: 5,
      width:110,
      height:90,
      justifyContent:'center'
  },
  buttonText: {
      color: '#fff',
      fontSize: 16,
      justifyContent:'center'
  },
});