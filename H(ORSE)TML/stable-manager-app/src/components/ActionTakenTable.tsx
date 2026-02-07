import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';

const ActionTakenTable = ({ actions }) => {
    const renderItem = ({ item }) => (
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
                keyExtractor={(item) => item.id.toString()}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#ffffff',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 16,
    },
    itemContainer: {
        padding: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#cccccc',
    },
    actionText: {
        fontSize: 18,
    },
    timestampText: {
        fontSize: 14,
        color: '#888888',
    },
    notesText: {
        fontSize: 14,
        color: '#555555',
    },
});

export default ActionTakenTable;