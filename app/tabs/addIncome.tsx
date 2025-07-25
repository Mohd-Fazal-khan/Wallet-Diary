import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { db, auth } from "@/firebase/firebaseConfig";
import { collection, addDoc } from "firebase/firestore";
import { useRouter } from "expo-router";
import NavigationBarManager from "../componets/NavigationBarManager";
import { SafeAreaView } from "react-native-safe-area-context";

export default function AddSalary() {
  const [salary, setSalary] = useState("");
  const [source, setSource] = useState("");
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  const router = useRouter();

  const handleAddSalary = async () => {
    if (!salary || !source) {
      Alert.alert("Error", "Please fill in all fields.");
      return;
    }

    try {
      const user = auth.currentUser;
      if (user) {
        const incomeRef = collection(db, "users", user.uid, "income");

        await addDoc(incomeRef, {
          salary: parseFloat(salary),
          source,
          date: date.toISOString().split("T")[0],
          createdAt: new Date(),
        });

        Alert.alert("Success", "Income added successfully!");
        router.push("/tabs/home");
      }
    } catch (error) {
      Alert.alert("Error", "Something went wrong.");
      console.error(error);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <NavigationBarManager />
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <Text style={styles.heading}>Add Money</Text>

        <View style={styles.card}>
          <Text style={styles.label}>Amount</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter Amount"
            keyboardType="numeric"
            value={salary}
            onChangeText={setSalary}
            placeholderTextColor="#999"
          />

          <Text style={styles.label}>Source</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. Salary"
            value={source}
            onChangeText={setSource}
            placeholderTextColor="#999"
          />

          <Text style={styles.label}>Date</Text>
          <TouchableOpacity
            style={styles.input}
            onPress={() => setShowDatePicker(true)}
          >
            <Text style={{ color: "#333" }}>{date.toLocaleDateString()}</Text>
          </TouchableOpacity>

          {showDatePicker && (
            <DateTimePicker
              value={date}
              mode="date"
              display="default"
              onChange={(event, selectedDate) => {
                setShowDatePicker(false);
                if (selectedDate) {
                  setDate(selectedDate);
                }
              }}
            />
          )}

          <TouchableOpacity style={styles.button} onPress={handleAddSalary}>
            <Text style={styles.buttonText}>Add Money</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  heading: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    color: "#2d8bef",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 15,
    padding: 20,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    color: "#555",
    fontWeight: "600",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 12,
    padding: 12,
    marginBottom: 15,
    backgroundColor: "#f9f9f9",
    color: "#333",
  },
  button: {
    backgroundColor: "#2d8bef",
    padding: 15,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});
