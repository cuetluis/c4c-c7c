import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import HorseTable from '../components/HorseTable';

const HorseTableScreen = () => {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Horse Table</Text>
            <HorseTable />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
        padding: 16,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#9CD479',
        marginBottom: 16,
    },
});

export default HorseTableScreen;