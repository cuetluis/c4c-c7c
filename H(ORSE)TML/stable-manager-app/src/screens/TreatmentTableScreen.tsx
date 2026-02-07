import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { Treatment } from '../types';
import { colors } from '../styles/colors';

const treatmentsData: Treatment[] = [
    { id: '1', name: 'Treatment A', description: 'Description for Treatment A' },
    { id: '2', name: 'Treatment B', description: 'Description for Treatment B' },
    { id: '3', name: 'Treatment C', description: 'Description for Treatment C' },
];

const TreatmentTableScreen = () => {
    const renderItem = ({ item }: { item: Treatment }) => (
        <View style={styles.itemContainer}>
            <Text style={styles.itemName}>{item.name}</Text>
            <Text style={styles.itemDescription}>{item.description}</Text>
        </View>
    );

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Available Treatments</Text>
            <FlatList
                data={treatmentsData}
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
        padding: 16,
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: 8,
        marginBottom: 8,
    },
    itemName: {
        fontSize: 18,
        fontWeight: '600',
        color: colors.text,
    },
    itemDescription: {
        fontSize: 14,
        color: colors.textSecondary,
    },
});

export default TreatmentTableScreen;