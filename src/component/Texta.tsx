import { View, Text, Animated, Easing, StyleSheet } from 'react-native';
import React, { useState, useEffect, useRef } from 'react';

const TEXTS = ['please', 'say', 'a command', 'to begin'];

const Texta = () => {
  const [index, setIndex] = useState(0);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const intervalId = setInterval(() => {
      setIndex((index) => (index + 1) % TEXTS.length);
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }).start(() => {
        fadeAnim.setValue(0);
      });
    }, 300); // every 3 seconds

    return () => clearInterval(intervalId);
  }, []);

  return (
    <View style={styles.conts}>
      <Animated.Text
        style={{ opacity: fadeAnim, fontSize: 24, fontWeight: 'bold' }}
      >
        {TEXTS[index]}
      </Animated.Text>
    </View>
  );
};

export default Texta;

const styles = StyleSheet.create({
  conts: {
     alignItems:'center',
     paddingTop:220
  },
 
})
