import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

const HomeScreen = ({ navigation }) => {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Stable Manager</Text>
            <Button
                title="Horse Table"
                onPress={() => navigation.navigate('HorseTable')}
            />
            <Button
                title="Treatment Table"
                onPress={() => navigation.navigate('TreatmentTable')}
            />
            <Button
                title="Action Taken Table"
                onPress={() => navigation.navigate('ActionTakenTable')}
            />
            <Button
                title="Daily Observations"
                onPress={() => navigation.navigate('DailyObservations')}
            />
            <Button
                title="Audit Trail"
                onPress={() => navigation.navigate('AuditTrail')}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#9CD479',
    },
    title: {
        fontSize: 24,
        marginBottom: 20,
        color: '#79AED4',
    },
});

export default HomeScreen;