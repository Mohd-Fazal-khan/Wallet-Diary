import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Dimensions,
  ActivityIndicator,
  StatusBar,
} from "react-native";
import React, { useState } from "react";
import DateTimePicker from "@react-native-community/datetimepicker";
import { exportTransactionsAsPDF } from "../utils/exportToPDF";
import NavigationBarManager from "./NavigationBarManager";
import { useRouter } from "expo-router";

const { width } = Dimensions.get("window");

const ExportScreen = () => {
  const [selectedOption, setSelectedOption] = useState("");
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleExport = async () => {
    if (selectedOption === "custom" && (!startDate || !endDate)) {
      Alert.alert("Please select a valid date range.");
      return;
    }

    setLoading(true);
    try {
      const success = await exportTransactionsAsPDF(
        selectedOption,
        startDate,
        endDate
      );
      if (success) {
        Alert.alert("Success", "Transactions exported successfully.");
        router.push("/tabs/home");
      }
    } catch (error) {
      Alert.alert("Error", "Failed to export transactions.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="black" barStyle="light-content" />
      <NavigationBarManager />
      <Text style={styles.title}>Export Options</Text>

      {["today", "weekly", "monthly", "custom"].map((option) => (
        <TouchableOpacity
          key={option}
          style={[
            styles.option,
            selectedOption === option && { backgroundColor: "#2d8bef" },
          ]}
          onPress={() => setSelectedOption(option)}
        >
          <Text
            style={[
              styles.optionText,
              selectedOption === option && { color: "white" },
            ]}
          >
            {option.charAt(0).toUpperCase() + option.slice(1)}
          </Text>
        </TouchableOpacity>
      ))}

      {selectedOption === "custom" && (
        <>
          <TouchableOpacity
            onPress={() => setShowStartDatePicker(true)}
            style={styles.datePicker}
          >
            <Text style={styles.dateText}>
              Select Start Date: {startDate.toDateString()}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setShowEndDatePicker(true)}
            style={styles.datePicker}
          >
            <Text style={styles.dateText}>
              Select End Date: {endDate.toDateString()}
            </Text>
          </TouchableOpacity>

          {showStartDatePicker && (
            <DateTimePicker
              value={startDate}
              mode="date"
              display="default"
              onChange={(event, selectedDate) => {
                setShowStartDatePicker(false);
                if (selectedDate) setStartDate(selectedDate);
              }}
            />
          )}

          {showEndDatePicker && (
            <DateTimePicker
              value={endDate}
              mode="date"
              display="default"
              onChange={(event, selectedDate) => {
                setShowEndDatePicker(false);
                if (selectedDate) setEndDate(selectedDate);
              }}
            />
          )}
        </>
      )}

      <TouchableOpacity
        style={[styles.exportButton, loading && { opacity: 0.6 }]}
        onPress={handleExport}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#ffffff" />
        ) : (
          <Text style={styles.exportText}>Export PDF</Text>
        )}
      </TouchableOpacity>
    </View>
  );
};

export default ExportScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: width * 0.05,
    justifyContent: "center",
    backgroundColor: "#ffffff",
  },
  title: {
    fontSize: width * 0.06,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: width * 0.1,
  },
  option: {
    padding: width * 0.04,
    borderWidth: 1,
    borderRadius: 10,
    marginBottom: width * 0.05,
  },
  optionText: {
    fontSize: width * 0.045,
    textAlign: "center",
  },
  datePicker: {
    padding: width * 0.04,
    borderWidth: 1,
    borderRadius: 10,
    marginBottom: width * 0.05,
  },
  dateText: {
    fontSize: width * 0.045,
    textAlign: "center",
  },
  exportButton: {
    backgroundColor: "#2d8bef",
    padding: width * 0.045,
    borderRadius: 10,
    alignItems: "center",
    marginTop: width * 0.1,
  },
  exportText: {
    color: "white",
    fontWeight: "bold",
    fontSize: width * 0.045,
  },
});
