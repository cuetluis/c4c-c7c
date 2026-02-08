import React from 'react';
import {View, TextInput, StyleSheet} from 'react-native';

const Input = ({value, setValue, placeholder, secureTextEntry}) => {
    return (
        <View style = {styles.container}>
            <TextInput 
                value = { value }
                onChangeText = { setValue }
                placeholder = { placeholder }
                secureTextEntry = { secureTextEntry }
                style = { styles.input }
            />
        </View>
    );
}

export default Input

const styles = StyleSheet.create({
    container: {
      width: '100%',
      justifyContent: 'center',
      padding: 20,
      backgroundColor: '#fff',
    },
    title: {
      fontSize: 28,
      fontWeight: 'bold',
      marginBottom: 30,
      textAlign: 'center',
    },
    input: {
        backgroundColor: 'white',
        borderWidth: 1,
        borderColor: '#ddd',
        padding: 15,
        borderRadius: 10,
        color: 'black'
    }
});