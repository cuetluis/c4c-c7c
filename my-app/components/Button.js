import React from 'react';
import {View, Text, StyleSheet, Pressable} from 'react-native';

const Button = ({onPress, text}) => {
    return (
        <Pressable onPress = {onPress} style={styles.container}>
            <Text style={styles.buttonText}>{text}</Text>
        </Pressable>
    );
};

export default Button;

const styles = StyleSheet.create({
    button: {
        backgroundColor: '#007AFF',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
        marginTop: 10,
      },
      buttonText: {
        color: '#0000',
        fontWeight: 'bold',
        fontSize: 16,
        color: "black"
      }
});