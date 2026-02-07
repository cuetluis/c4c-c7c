import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import DailyObservationsList from '../components/DailyObservationsList';

const DailyObservationsScreen = () => {
    const observations = [
        { id: '1', task: 'Check horse feed', completed: false },
        { id: '2', task: 'Inspect horse health', completed: false },
        { id: '3', task: 'Clean stables', completed: false },
    ];

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Daily Observations</Text>
            <FlatList
                data={observations}
                renderItem={({ item }) => <DailyObservationsList observation={item} />}
                keyExtractor={item => item.id}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#9CD479',
        marginBottom: 20,
    },
});

export default DailyObservationsScreen;