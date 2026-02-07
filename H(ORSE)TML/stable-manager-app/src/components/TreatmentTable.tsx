import React from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { Treatment } from '../types'; // Assuming Treatment type is defined in types/index.ts

interface TreatmentTableProps {
  treatments: Treatment[];
  onSelectTreatment: (treatment: Treatment) => void;
}

const TreatmentTable: React.FC<TreatmentTableProps> = ({ treatments, onSelectTreatment }) => {
  const renderItem = ({ item }: { item: Treatment }) => (
    <TouchableOpacity onPress={() => onSelectTreatment(item)} style={styles.item}>
      <Text style={styles.itemText}>{item.name}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Available Treatments</Text>
      <FlatList
        data={treatments}
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
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  item: {
    padding: 16,
    borderWidth: 1,
    borderColor: '#79AED4',
    borderRadius: 8,
    marginBottom: 8,
    backgroundColor: '#9CD479',
  },
  itemText: {
    fontSize: 18,
  },
});

export default TreatmentTable;