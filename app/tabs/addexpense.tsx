import {
  StyleSheet,
  Text,
  TextInput,
  View,
  TouchableOpacity,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  TouchableWithoutFeedback,
  Dimensions,
} from "react-native";
import React, { useState } from "react";
import DropDownPicker from "react-native-dropdown-picker";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Ionicons } from "@expo/vector-icons";
import { collection, addDoc } from "firebase/firestore";
import { auth, db } from "../../firebase/firebaseConfig";
import { SafeAreaView } from "react-native-safe-area-context";
import NavigationBarManager from "../componets/NavigationBarManager";
import { useRouter } from "expo-router";

const { width, height } = Dimensions.get("window");

const AddExpense = () => {
  const router = useRouter();

  const [amount, setAmount] = useState("");
  const [item, setItem] = useState("");
  const [notes, setNotes] = useState("");
  const [category, setCategory] = useState(null);
  const [date, setDate] = useState(new Date());
  const [show, setShow] = useState(false);

  const [open, setOpen] = useState(false);
  const [items, setItems] = useState([
    { label: "Food", value: "food" },
    { label: "Transport", value: "transport" },
    { label: "Shopping", value: "shopping" },
    { label: "Bills", value: "bills" },
    { label: "Rent", value: "rent" },
    { label: "Health", value: "health" },
    { label: "Education", value: "education" },
    { label: "Entertainment", value: "entertainment" },
    { label: "Travel", value: "travel" },
    { label: "Groceries", value: "groceries" },
    { label: "EMI / Loans", value: "emi" },
    { label: "Savings", value: "savings" },
    { label: "Others", value: "others" },
  ]);

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShow(false);
    setDate(currentDate);
  };

  const formattedDate = `${date.getDate()}/${(date.getMonth() + 1)
    .toString()
    .padStart(2, "0")}/${date.getFullYear()}`;

  const addExpense = async () => {
    if (!amount || !item || !category || !date) {
      Alert.alert("Error", "Please fill all required fields.");
      return;
    }

    try {
      const user = auth.currentUser;
      if (!user) return;

      const expenseRef = collection(db, "users", user.uid, "expenses");

      await addDoc(expenseRef, {
        amount: parseFloat(amount),
        item,
        category,
        notes,
        date: date.toISOString().split("T")[0],
        createdAt: new Date(),
      });

      Alert.alert("Success", "Expense added successfully!");

      setAmount("");
      setItem("");
      setCategory(null);
      setNotes("");
      setDate(new Date());
      router.push("/tabs/home");
    } catch (error) {
      console.error("Error adding expense:", error);
      Alert.alert("Error", "Something went wrong!");
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <NavigationBarManager />

      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          style={{ flex: 1 }}
        >
          <ScrollView contentContainerStyle={{ padding: width * 0.05 }}>
            <View style={styles.container}>
              <Text style={styles.title}>Add Expense</Text>

              <View style={styles.formcontainer}>
                <Text style={styles.formtitle}>Amount</Text>
                <TextInput
                  placeholder="0.00"
                  keyboardType="numeric"
                  placeholderTextColor="gray"
                  value={amount}
                  onChangeText={setAmount}
                  style={styles.amountinput}
                />
              </View>

              <View style={styles.formcontainer}>
                <Text style={styles.formtitle}>Item</Text>
                <TextInput
                  placeholder="e.g. Sugar"
                  placeholderTextColor="gray"
                  value={item}
                  onChangeText={setItem}
                  style={styles.amountinput}
                />
              </View>

              <View style={[styles.formcontainer, { zIndex: open ? 1000 : 1 }]}>
                <Text style={styles.formtitle}>Select Category</Text>
                <DropDownPicker
                  open={open}
                  value={category}
                  items={items}
                  setOpen={setOpen}
                  setValue={setCategory}
                  setItems={setItems}
                  placeholder="Select a category"
                  style={styles.dropdown}
                  labelStyle={styles.label}
                  placeholderStyle={styles.placeholder}
                  dropDownContainerStyle={styles.dropdownContainer}
                  listMode="MODAL"
                  modalProps={{ animationType: "slide" }}
                />
              </View>

              <View style={styles.formcontainer}>
                <Text style={styles.formtitle}>Notes (optional)</Text>
                <TextInput
                  placeholder="Add notes..."
                  placeholderTextColor="gray"
                  value={notes}
                  onChangeText={setNotes}
                  style={styles.notesinput}
                  textAlignVertical="top"
                  multiline={true} 
                  numberOfLines={4}
                />
              </View>

              <View style={styles.formcontainer}>
                <Text style={styles.formtitle}>Date</Text>
                <TouchableOpacity
                  onPress={() => setShow(true)}
                  style={styles.inputbtn}
                >
                  <Text style={{ fontSize: width * 0.04 }}>
                    {formattedDate}
                  </Text>
                  <Ionicons name="calendar" size={width * 0.06} color="gray" />
                </TouchableOpacity>

                {show && (
                  <DateTimePicker
                    value={date}
                    mode="date"
                    display="default"
                    onChange={onChange}
                  />
                )}
              </View>

              <TouchableOpacity style={styles.finalbtn} onPress={addExpense}>
                <Text style={styles.finalbtnText}>Add Expense</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
};

export default AddExpense;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    fontSize: width * 0.06,
    fontWeight: "bold",
  },
  formcontainer: {
    paddingTop: width * 0.05,
  },
  formtitle: {
    color: "black",
    fontWeight: "bold",
    marginBottom: 5,
    fontSize: width * 0.04,
  },
  amountinput: {
    width: "100%",
    height: width * 0.12,
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 5,
    padding: width * 0.03,
    backgroundColor: "white",
    fontSize: width * 0.04,
  },
  dropdown: {
    height: width * 0.12,
    borderColor: "gray",
    borderWidth: 1,
    marginTop: 10,
  },
  dropdownContainer: {
    borderColor: "gray",
    maxHeight: 200,
  },
  label: {
    color: "gray",
    fontSize: width * 0.04,
  },
  placeholder: {
    color: "gray",
    fontSize: width * 0.04,
  },
  notesinput: {
    width: "100%",
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 5,
    height: height * 0.15,
    padding: width * 0.03,
    backgroundColor: "white",
    fontSize: width * 0.04,
  },
  inputbtn: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    height: width * 0.12,
    backgroundColor: "white",
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 4,
    paddingHorizontal: width * 0.03,
    marginTop: 10,
  },
  finalbtn: {
    backgroundColor: "#2d8bef",
    padding: width * 0.04,
    alignItems: "center",
    borderRadius: 6,
    marginTop: width * 0.05,
  },
  finalbtnText: {
    color: "#ffffff",
    fontWeight: "bold",
    fontSize: width * 0.045,
  },
});
