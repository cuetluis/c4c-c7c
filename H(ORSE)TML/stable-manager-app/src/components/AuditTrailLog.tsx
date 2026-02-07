import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { AuditTrailEntry } from '../types'; // Assuming you have an AuditTrailEntry type defined

const AuditTrailLog: React.FC<{ entries: AuditTrailEntry[] }> = ({ entries }) => {
    const renderItem = ({ item }: { item: AuditTrailEntry }) => (
        <View style={styles.entryContainer}>
            <Text style={styles.entryText}>{item.timestamp}</Text>
            <Text style={styles.entryText}>{item.user}</Text>
            <Text style={styles.entryText}>{item.action}</Text>
        </View>
    );

    return (
        <View style={styles.container}>
            <FlatList
                data={entries}
                renderItem={renderItem}
                keyExtractor={(item) => item.id.toString()}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        padding: 16,
    },
    entryContainer: {
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
    entryText: {
        fontSize: 16,
    },
});

export default AuditTrailLog;