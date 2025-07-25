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

import React, { useCallback, useState } from "react";
import DropDownPicker from "react-native-dropdown-picker";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Ionicons } from "@expo/vector-icons";
import { useRouter, useLocalSearchParams } from "expo-router";

import { collection, addDoc, doc, updateDoc } from "firebase/firestore";
import { auth, db } from "../../firebase/firebaseConfig";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import NavigationBarManager from "../componets/NavigationBarManager";

const { width, height } = Dimensions.get("window");

const EditTransaction = () => {
  const router = useRouter();
  const navigation = useNavigation();
  const { trans } = useLocalSearchParams();
  const expenseData = JSON.parse(trans);

  console.log(expenseData);

  const [amount, setAmount] = useState(expenseData.amount.toString());
  const [item, setItem] = useState(expenseData.item || "");
  const [notes, setNotes] = useState(expenseData.notes || "");
  const [category, setCategory] = useState(expenseData.category || null);
  const [date, setDate] = useState(
    expenseData.date ? new Date(expenseData.date) : new Date()
  );
  const [amountColor, setAmountColor] = useState("gray");
  const [itemColor, setItemColor] = useState("gray");
  const [notesColor, setNotesColor] = useState("gray");
  const [categoryColor, setCategoryColor] = useState("gray");

  useFocusEffect(
    useCallback(() => {
      setAmountColor("gray");
      setItemColor("gray");
      setNotesColor("gray");
      setCategoryColor("gray");
    }, [])
  );

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

  const handleUpdate = async () => {
    try {
      if (!amount || !item || !category) {
        Alert.alert("Error", "Please fill all required fields.");
        return;
      }

      const user = auth.currentUser;
      if (!user) return;

      const docRef = doc(db, "users", user.uid, "expenses", expenseData.id);

      await updateDoc(docRef, {
        amount: parseFloat(amount),
        item: item,
        notes: notes,
        category: category,
        date:date.toISOString().split("T")[0], // Save as ISO string
      });

      Alert.alert("Success", "Transaction updated successfully!");
      router.push("/tabs/transaction");
      // ✅ Correct tab name (case-sensitive)
    } catch (error) {
      console.error("Error updating document: ", error);
      Alert.alert("Error", "Something went wrong while updating.");
    }
  };

  return (
    <SafeAreaView style={{ flex: 1,backgroundColor:'white'}}>
      <NavigationBarManager />

      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          style={{ flex: 1 }}
        >
          <ScrollView contentContainerStyle={{ padding: width * 0.05 }}>
            <View style={styles.container}>
              <Text style={styles.title}>Edit Expense</Text>

              <View style={styles.formcontainer}>
                <Text style={styles.formtitle}>Amount</Text>
                <TextInput
                  placeholder="0.00"
                  keyboardType="numeric"
                  placeholderTextColor="black"
                  value={amount}
                  onChangeText={(text) => {
                    setAmount(text);
                    setAmountColor("black");
                  }}
                  style={[styles.amountinput, { color: amountColor }]}
                />
              </View>

              <View style={styles.formcontainer}>
                <Text style={styles.formtitle}>Item</Text>
                <TextInput
                  placeholder="e.g. Sugar"
                  placeholderTextColor="black"
                  value={item}
                  onChangeText={(text) => {
                    setItem(text);
                    setItemColor("black");
                  }}
                  style={[styles.amountinput, { color: itemColor }]}
                />
              </View>

              <View style={[styles.formcontainer, { zIndex: open ? 1000 : 1 }]}>
                <Text style={styles.formtitle}>Select Category</Text>
                <DropDownPicker
                  open={open}
                  value={category}
                  items={items}
                  setOpen={setOpen}
                  setValue={(callback) => {
                    const value = callback(category);
                    setCategory(value);
                    setCategoryColor("black");
                  }}
                  setItems={setItems}
                  placeholder="Select a category"
                  style={[styles.dropdown, { borderColor: "gray" }]}
                  labelStyle={{ color: categoryColor, fontSize: width * 0.04 }}
                  placeholderStyle={{ color: "gray", fontSize: width * 0.04 }}
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
                  onChangeText={(text) => {
                    setNotes(text);
                    setNotesColor("black");
                  }}
                  style={[styles.notesinput, { color: notesColor }]}
                  textAlignVertical="top"
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

              <TouchableOpacity style={styles.finalbtn} onPress={handleUpdate}>
                <Text style={styles.finalbtnText}>Edit Expense</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
};

export default EditTransaction;

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
    fontWeight:"bold",
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
  //   label: {
  //     // color: "black",
  //     fontSize: width * 0.04,
  //   },
  placeholder: {
    color: "black",
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
