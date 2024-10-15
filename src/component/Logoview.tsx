import { View, Image, StyleSheet } from 'react-native'
import React from 'react'

const Logoview = () => {
  return (
    <View style={styles.container}>
      <Image
        style={styles.tinyLogo}
        source={require('D:/node/vision/src/assets/logo/VisionMate.png')}
      />
    </View>
  )
}

export default Logoview

const styles = StyleSheet.create({
  container: {
     alignItems:'center',
     
  },
  tinyLogo: {
    width: 300,
    height: 120,
  },
})
