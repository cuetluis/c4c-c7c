import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';

const DailyObservationsList = ({ observations }) => {
    const renderItem = ({ item }) => (
        <View style={styles.itemContainer}>
            <Text style={styles.itemText}>{item.task}</Text>
            <Text style={styles.itemText}>{item.date}</Text>
        </View>
    );

    return (
        <View style={styles.container}>
            <FlatList
                data={observations}
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
    itemContainer: {
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
    itemText: {
        fontSize: 16,
    },
});

export default DailyObservationsList;