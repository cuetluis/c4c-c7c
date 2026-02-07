import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { ActionTaken } from '../types';
import { colors } from '../styles/colors';

const ActionTakenTableScreen = () => {
    const actions: ActionTaken[] = [
        { id: '1', action: 'Administered treatment A', timestamp: '2023-10-01 10:00', notes: 'Horse responded well' },
        { id: '2', action: 'Administered treatment B', timestamp: '2023-10-02 11:30', notes: 'No adverse reactions' },
        // Add more sample data as needed
    ];

    const renderItem = ({ item }: { item: ActionTaken }) => (
        <View style={styles.itemContainer}>
            <Text style={styles.actionText}>{item.action}</Text>
            <Text style={styles.timestampText}>{item.timestamp}</Text>
            <Text style={styles.notesText}>{item.notes}</Text>
        </View>
    );

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Actions Taken</Text>
            <FlatList
                data={actions}
                renderItem={renderItem}
                keyExtractor={item => item.id}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
        padding: 16,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: colors.primary,
        marginBottom: 16,
    },
    itemContainer: {
        backgroundColor: colors.card,
        padding: 12,
        marginVertical: 8,
        borderRadius: 8,
    },
    actionText: {
        fontSize: 18,
        color: colors.text,
    },
    timestampText: {
        fontSize: 14,
        color: colors.secondaryText,
    },
    notesText: {
        fontSize: 14,
        color: colors.secondaryText,
        fontStyle: 'italic',
    },
});

export default ActionTakenTableScreen;