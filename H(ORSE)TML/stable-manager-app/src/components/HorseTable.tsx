import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { Horse } from '../types'; // Assuming you have a Horse type defined in types/index.ts

interface HorseTableProps {
  horses: Horse[];
}

const HorseTable: React.FC<HorseTableProps> = ({ horses }) => {
  const renderItem = ({ item }: { item: Horse }) => (
    <View style={styles.row}>
      <Text style={styles.cell}>{item.name}</Text>
      <Text style={styles.cell}>{item.breed}</Text>
      <Text style={styles.cell}>{item.age}</Text>
      <Text style={styles.cell}>{item.owner}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={horses}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        ListHeaderComponent={
          <View style={styles.header}>
            <Text style={styles.headerText}>Name</Text>
            <Text style={styles.headerText}>Breed</Text>
            <Text style={styles.headerText}>Age</Text>
            <Text style={styles.headerText}>Owner</Text>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  row: {
    flexDirection: 'row',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#cccccc',
  },
  cell: {
    flex: 1,
    textAlign: 'center',
  },
  header: {
    flexDirection: 'row',
    backgroundColor: '#9CD479',
    padding: 10,
  },
  headerText: {
    flex: 1,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#ffffff',
  },
});

export default HorseTable;