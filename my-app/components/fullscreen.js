import React from 'react';
import { View, Image, StyleSheet, Dimensions } from 'react-native';

const screenWidth = Dimensions.get('window').width;

const FullWidthImage = () => {
  return (
    <View style={styles.container}>
      <Image
        source={require('../assets/images/logo.png')}
        // Use the full screen width and define a desired height
        style={[styles.image, { width: screenWidth, height: 200 }]} 
        resizeMode="stretch" // Stretches the image to fill the dimensions
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    
  },
});

export default FullWidthImage;