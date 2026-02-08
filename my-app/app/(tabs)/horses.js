import React, { useState, useEffect } from "react";
import DropDownPicker from 'react-native-dropdown-picker';
import { initialFormState, breedItems } from '../../components/HorseData';
import * as HorseService from '../../components/API';
import {
  View,
  FlatList,
  Image,
  Text,
  TextInput,
  StyleSheet,
  Button,
  ScrollView,
  Alert,
  Modal,
  Switch,
  TouchableOpacity,
} from "react-native";

const HorseManagementScreen = () => {
  const [data, setData] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [form, setForm] = useState(initialFormState);
  const [breedOpen, setBreedOpen] = useState(false);

  const updateField = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const toggleSwitch = (key) => {
    setForm((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const json = await HorseService.fetchHorses();
      if (Array.isArray(json)) setData(json);
      else setData([]);
    } catch (err) {
      console.log(err);
      Alert.alert("Error", "Failed to load horses");
    }
  };

  const handleEdit = (item) => {
    setForm(item);
    setModalVisible(true);
  };

  const handleAddNew = () => {
    setForm(initialFormState);
    setModalVisible(true);
  };

  const handleDelete = async () => {
    Alert.alert("Confirm Delete", "Are you sure you want to remove this horse?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          try {
            await HorseService.deleteHorse(form.id);
            setData((prev) => prev.filter((item) => item.id !== form.id));
            setModalVisible(false);
            Alert.alert("Deleted", "Horse removed successfully.");
          } catch (error) {
            Alert.alert("Error", error.message);
          }
        }
      }
    ]);
  };

  const saveHorse = async () => {
    if (!form.name) {
      Alert.alert("Validation", "Name is required");
      return;
    }

    const payload = {};
    Object.keys(form).forEach((key) => {
      if (form[key] !== "" && form[key] !== null) {
        payload[key] = form[key];
      }
    });

    try {
      let result;
      const isUpdate = !!form.id;

      if (isUpdate) {
        result = await HorseService.updateHorse(form.id, payload);
      } else {
        result = await HorseService.addHorse(payload);
      }

      if (typeof result === "object" && result.error) {
        Alert.alert("Error", result.error);
        return;
      }

      if (isUpdate) {
        setData((prev) => prev.map((item) => (item.id === form.id ? form : item)));
      } else {
        loadData(); 
      }

      setModalVisible(false);
      Alert.alert("Success", isUpdate ? "Horse updated!" : "Horse added!");
      setForm(initialFormState);

    } catch (error) {
      Alert.alert("Network Error", error.message);
    }
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity onPress={() => handleEdit(item)} style={styles.row}>
      <View style={styles.cell}>
        <Image 
          source={{ uri: item.picture ? item.picture : null }}
          style={styles.image}
        />
      </View>
      <View style={styles.cell}>
        <Text style={styles.dataText}>{item.id}</Text>
      </View>
      <View style={styles.cell}>
        <Text style={styles.dataText}>{item.name}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.topButtonContainer}>
        <Button
          title="+ Add New Horse"
          onPress={handleAddNew}
          color="#007AFF"
        />
      </View>

      <View style={[styles.row, styles.header]}>
        <View style={styles.cell}>
          <Text style={styles.headerText}>Image</Text>
        </View>
        <View style={styles.cell}>
          <Text style={styles.headerText}>ID</Text>
        </View>
        <View style={styles.cell}>
          <Text style={styles.headerText}>Name</Text>
        </View>
      </View>

      <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={(item) => item.id ? item.id.toString() : Math.random().toString()}
      />

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalTitle}>
              {form.id ? "Edit Horse" : "Add New Horse"}
            </Text>

            <ScrollView style={{ width: "100%" }}>
              <Text style={styles.sectionHeader}>Basic Info</Text>
              <TextInput
                style={styles.input}
                placeholder="Name *"
                placeholderTextColor='#808080'
                value={form.name}
                onChangeText={(t) => updateField("name", t)}
              />
              <TextInput
                style={styles.input}
                placeholder="Picture URL"
                placeholderTextColor='#808080'
                value={form.picture}
                onChangeText={(t) => updateField("picture", t)}
              />
              <TextInput
                style={styles.input}
                placeholder="Biography"
                placeholderTextColor='#808080'
                value={form.biography}
                onChangeText={(t) => updateField("biography", t)}
              />
              
              <View style={{zIndex: 1000}}>
                <DropDownPicker
                  open={breedOpen}
                  value={form.breed}
                  items={breedItems}
                  setOpen={setBreedOpen}
                  setValue={(callback) => {
                    const value = callback(form.breed);
                    updateField("breed", value);
                  }}
                  placeholder="Select Breed"
                  listMode="MODAL"
                  style={styles.input}
                />
              </View>

              <View style={styles.rowInput}>
                <TextInput
                  style={[styles.input, { flex: 1, marginRight: 5 }]}
                  placeholder="Gender"
                  placeholderTextColor='#808080'
                  value={form.gender}
                  onChangeText={(t) => updateField("gender", t)}
                />
                <TextInput
                  style={[styles.input, { flex: 1 }]}
                  placeholder="Birth Year"
                  placeholderTextColor='#808080'
                  keyboardType="numeric"
                  value={String(form.birth_year || "")}
                  onChangeText={(t) => updateField("birth_year", t)}
                />
              </View>
              <TextInput
                style={styles.input}
                placeholder="Arrival Date (YYYY-MM-DD)"
                placeholderTextColor='#808080'
                value={form.arrival_date}
                onChangeText={(t) => updateField("arrival_date", t)}
              />
              <TextInput
                style={styles.input}
                placeholder="Pasture"
                placeholderTextColor='#808080'
                value={form.pasture}
                onChangeText={(t) => updateField("pasture", t)}
              />
              <TextInput
                style={styles.input}
                placeholder="Grooming Day"
                placeholderTextColor='#808080'
                value={form.grooming_day}
                onChangeText={(t) => updateField("grooming_day", t)}
              />

              <View style={styles.switchContainer}>
                <Text>Service Horse</Text>
                <Switch value={form.service_horse} onValueChange={() => toggleSwitch("service_horse")} />
              </View>
              <View style={styles.switchContainer}>
                <Text>Ex-Race Horse</Text>
                <Switch value={form.ex_race_horse} onValueChange={() => toggleSwitch("ex_race_horse")} />
              </View>
              <View style={styles.switchContainer}>
                <Text>Deceased</Text>
                <Switch value={form.deceased} onValueChange={() => toggleSwitch("deceased")} />
              </View>
              {form.deceased && (
                <TextInput
                  style={styles.input}
                  placeholder="Death Date (YYYY-MM-DD)"
                  placeholderTextColor='#808080'
                  value={form.death_date}
                  onChangeText={(t) => updateField("death_date", t)}
                />
              )}

              <Text style={styles.sectionHeader}>Medical</Text>
              <TextInput
                style={[styles.input, { height: 60 }]}
                multiline
                placeholder="Medical Notes"
                placeholderTextColor='#808080'
                value={form.medical_notes}
                onChangeText={(t) => updateField("medical_notes", t)}
              />

              <View style={styles.rowInput}>
                <TextInput
                  style={[styles.input, { flex: 1, marginRight: 5 }]}
                  placeholder="Left Eye"
                  placeholderTextColor='#808080'
                  value={form.left_eye}
                  onChangeText={(t) => updateField("left_eye", t)}
                />
                <TextInput
                  style={[styles.input, { flex: 1 }]}
                  placeholder="Right Eye"
                  placeholderTextColor='#808080'
                  value={form.right_eye}
                  onChangeText={(t) => updateField("right_eye", t)}
                />
              </View>

              <View style={styles.switchContainer}>
                <Text>Seen by Vet</Text>
                <Switch value={form.seen_by_vet} onValueChange={() => toggleSwitch("seen_by_vet")} />
              </View>
              <View style={styles.switchContainer}>
                <Text>Regular Treatment</Text>
                <Switch value={form.regular_treatment} onValueChange={() => toggleSwitch("regular_treatment")} />
              </View>
              <View style={styles.switchContainer}>
                <Text>Heart Murmur</Text>
                <Switch value={form.heart_murmur} onValueChange={() => toggleSwitch("heart_murmur")} />
              </View>
              <View style={styles.switchContainer}>
                <Text>Cushings Positive</Text>
                <Switch value={form.cushings_positive} onValueChange={() => toggleSwitch("cushings_positive")} />
              </View>
              <View style={styles.switchContainer}>
                <Text>Heaves</Text>
                <Switch value={form.heaves} onValueChange={() => toggleSwitch("heaves")} />
              </View>
              <View style={styles.switchContainer}>
                <Text>Anhidrosis</Text>
                <Switch value={form.anhidrosis} onValueChange={() => toggleSwitch("anhidrosis")} />
              </View>
              <View style={styles.switchContainer}>
                <Text>Shivers</Text>
                <Switch value={form.shivers} onValueChange={() => toggleSwitch("shivers")} />
              </View>

              <Text style={styles.sectionHeader}>Behavior</Text>
              <TextInput
                style={[styles.input, { height: 60 }]}
                multiline
                placeholder="Behavior Notes"
                placeholderTextColor='#808080'
                value={form.behavior_notes}
                onChangeText={(t) => updateField("behavior_notes", t)}
              />

              <View style={styles.switchContainer}>
                <Text>Bites</Text>
                <Switch value={form.bites} onValueChange={() => toggleSwitch("bites")} />
              </View>
              <View style={styles.switchContainer}>
                <Text>Kicks</Text>
                <Switch value={form.kicks} onValueChange={() => toggleSwitch("kicks")} />
              </View>
              <View style={styles.switchContainer}>
                <Text>Hard to Catch</Text>
                <Switch value={form.difficult_to_catch} onValueChange={() => toggleSwitch("difficult_to_catch")} />
              </View>
              <View style={styles.switchContainer}>
                <Text>Needle Problem</Text>
                <Switch value={form.problem_with_needles} onValueChange={() => toggleSwitch("problem_with_needles")} />
              </View>

              <Text style={styles.sectionHeader}>Farrier Info</Text>
              <View style={styles.switchContainer}>
                <Text>Seen by Farrier</Text>
                <Switch value={form.seen_by_farrier} onValueChange={() => toggleSwitch("seen_by_farrier")} />
              </View>
              <View style={styles.switchContainer}>
                <Text>Problem w/ Farrier</Text>
                <Switch value={form.problem_with_farrier} onValueChange={() => toggleSwitch("problem_with_farrier")} />
              </View>
              <View style={styles.switchContainer}>
                <Text>Sedation Needed</Text>
                <Switch value={form.sedation_for_farrier} onValueChange={() => toggleSwitch("sedation_for_farrier")} />
              </View>

              <Text style={styles.sectionHeader}>Feeding</Text>
              <View style={styles.switchContainer}>
                <Text>Requires Extra Feed</Text>
                <Switch value={form.requires_extra_feed} onValueChange={() => toggleSwitch("requires_extra_feed")} />
              </View>
              <View style={styles.switchContainer}>
                <Text>Requires Mash</Text>
                <Switch value={form.requires_mash} onValueChange={() => toggleSwitch("requires_mash")} />
              </View>

              <View style={styles.buttonRow}>
                {form.id ? (
                    <Button title="Delete" color="red" onPress={handleDelete} />
                ) : (
                    <Button title="Cancel" color="gray" onPress={() => setModalVisible(false)} />
                )}
                <Button title={form.id ? "Update" : "Save"} onPress={saveHorse} />
              </View>
              
              <View style={{ height: 60 }} />
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default HorseManagementScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 16,
    paddingTop: 50,
  },
  topButtonContainer: {
    marginBottom: 20,
    backgroundColor: "#eee",
    borderRadius: 8,
    padding: 5,
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalView: {
    width: "90%",
    height: "80%",
    backgroundColor: "white",
    borderRadius: 20,
    padding: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 15,
  },
  sectionHeader: {
    marginTop: 10, 
    marginBottom: 5,
    fontWeight: "bold",
    fontSize: 16
  },
  input: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 5,
    backgroundColor: "#f9f9f9",
    marginBottom: 10,
  },
  rowInput: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    width: '100%',
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginTop: 20,
    paddingBottom: 20,
  },
  header: {
    backgroundColor: "#f1f1f1",
    borderBottomWidth: 2,
    borderColor: "#333",
  },
  row: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderColor: "#ccc",
    alignItems: 'center'
  },
  cell: {
    flex: 1,
    padding: 12,
    justifyContent: "center",
  },
  headerText: {
    fontWeight: "bold",
    color: "#000",
    fontSize: 16,
  },
  dataText: {
    fontSize: 14,
    color: "#444",
  },
  image: {
    width: 50,
    height: 50,
    resizeMode: 'cover',
    borderRadius: 25,
  },
});