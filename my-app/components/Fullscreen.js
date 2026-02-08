import React from 'react';
import { Image, StyleSheet, Dimensions, SafeAreaViewBase } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context'

const screenWidth = Dimensions.get('window').width;
const run = require("../assets/images/hork_run.png");

const FullWidthImage = () => {
  return (
    <SafeAreaView style={styles.container}>
      <Image
        source={run}
        style={[styles.image, { width: screenWidth, height: 300, resizeMode: "contain" }]}
      />
    </SafeAreaView>
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
