import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { AuditTrailLog } from '../components/AuditTrailLog';
import { colors } from '../styles/colors';

const AuditTrailScreen = () => {
    const auditData = [
        // Sample data structure for audit trail
        { id: '1', action: 'Added horse', user: 'User1', timestamp: '2023-10-01 10:00' },
        { id: '2', action: 'Updated treatment', user: 'User2', timestamp: '2023-10-02 11:30' },
        // Add more sample data as needed
    ];

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Audit Trail</Text>
            <FlatList
                data={auditData}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <AuditTrailLog action={item.action} user={item.user} timestamp={item.timestamp} />
                )}
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
});

export default AuditTrailScreen;