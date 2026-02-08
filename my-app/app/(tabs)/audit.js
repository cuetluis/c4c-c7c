import React, { useState, useEffect } from "react";
import { View, Text, FlatList, StyleSheet, Alert, ScrollView} from 'react-native';
import { handleResponse } from '../../components/API'
import { API_URL } from '../../config/APIURL'
import { SafeAreaView } from 'react-native-safe-area-context'

const AuditScreen = () => {
    const [data, setData] = useState([]);

    useEffect(() => {
      loadData();
    }, []);

    const loadData = async () => {
      try {
        const response = await fetch(`${API_URL}/get-audits`);
        const json = await handleResponse(response);

        if (Array.isArray(json)) {
          setData(json);
        }
        else {
          setData([]);
        }
      } catch (err) {
        console.log(err);
        Alert.alert("Error", "Failed to reach audits");
      }
    }

    const renderItem = ({ item }) => (
      <View style={styles.row}>
        <View style={styles.cell}>
             <Text style={styles.dataText}>{item.user_id}</Text>
        </View>
        <View style={styles.cell}>
             <Text style={styles.dataText}>{item.table_changed}</Text>
        </View>
        <View style={styles.cell}>
             <Text style={styles.dataText}>{item.field_changed}</Text>
        </View>
        <View style={styles.cell}>
             <Text style={styles.dataText}>{item.before_value}</Text>
        </View>
        <View style={styles.cell}>
             <Text style={styles.dataText}>{item.after_value}</Text>
        </View>
        <View style={styles.cell}>
             <Text style={styles.dataText}>{item.timestamp}</Text>
        </View>
      </View>
    );

    return (
      <SafeAreaView style={styles.container}>
        <ScrollView horizontal={true} style={styles.scrollView}>
        <View>
          <View style={[styles.row, styles.header]}>
            <View style={styles.cell}>
              <Text style={styles.headerText}>User Id</Text>
            </View>
            <View style={styles.cell}>
              <Text style={styles.headerText}>Changed Table</Text>
            </View>
            <View style={styles.cell}>
              <Text style={styles.headerText}>Field Changed</Text>
            </View>
            <View style={styles.cell}>
              <Text style={styles.headerText}>Before Value</Text>
            </View>
            <View style={styles.cell}>
              <Text style={styles.headerText}>After Value</Text>
            </View>
            <View style={styles.cell}>
              <Text style={styles.headerText}>Timestamp</Text>
            </View>
          </View>
        
          <FlatList
            data={data}
            renderItem={renderItem}
            keyExtractor={(item) => item.id ? item.id.toString() : index.toString()}
          />
        </View>
        </ScrollView>
      </SafeAreaView>
    );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
    backgroundColor: '#fff',
  },
  title: {
      fontSize: 20, 
      fontWeight: 'bold', 
      padding: 10,
      textAlign: 'center'
  },
  scrollView: {
      flex: 1,
  },
  row: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderColor: "#ccc",
    alignItems: 'flex-start',
    width: 900,
  },
  header: {
      backgroundColor: '#f1f1f1',
      borderTopWidth: 1,
      borderTopColor: '#ccc',
  },
  cell: {
    width: 150,
    padding: 10,
  },
  headerText: {
      fontWeight: 'bold',
      fontSize: 15,
  },
  dataText: {
    fontSize: 14,
    color: '#333',
  },
});

export default AuditScreen;
