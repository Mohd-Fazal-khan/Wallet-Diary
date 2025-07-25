import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Alert,
} from "react-native";
import { useState, useEffect, useCallback } from "react";
import { Ionicons } from "@expo/vector-icons";
import { auth, db } from "@/firebase/firebaseConfig";
import {
  collection,
  getDocs,
  query,
  where,
  doc,
  deleteDoc,
} from "firebase/firestore";
import dayjs from "dayjs";
import { SafeAreaView } from "react-native-safe-area-context";
import NavigationBarManager from "../componets/NavigationBarManager";
import { RFValue } from "react-native-responsive-fontsize";
import { router } from "expo-router";

const Transaction = () => {
  const [selectedTab, setSelectedTab] = useState("Today");
  const [transactions, setTransactions] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchData = useCallback(async () => {
    try {
      const user = auth.currentUser;
      if (!user) {
        console.warn("User not logged in");
        return;
      }

      const userId = user.uid;
      const today = dayjs();
      let start, end;

      if (selectedTab === "Today") {
        start = today.startOf("day").toDate();
        end = today.endOf("day").toDate();
      } else if (selectedTab === "Weekly") {
        start = today.startOf("week").toDate();
        end = today.endOf("week").toDate();
      } else if (selectedTab === "Monthly") {
        start = today.startOf("month").toDate();
        end = today.endOf("month").toDate();
      }

      const expensesRef = collection(db, "users", userId, "expenses");

      const q = query(
        expensesRef,
        where("createdAt", ">=", start),
        where("createdAt", "<=", end)
      );

      const snapshot = await getDocs(q);
      const results = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setTransactions(results);
    } catch (error) {
      console.error("Error fetching transactions:", error);
    }
  }, [selectedTab]);

  const handleDelete = async (id) => {
    Alert.alert(
      "Confirm Delete",
      "Are you sure you want to delete this transaction?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              const user = auth.currentUser;
              if (!user) {
                console.warn("User not logged in");
                return;
              }

              await deleteDoc(doc(db, "users", user.uid, "expenses", id));
              setTransactions((prev) => prev.filter((txn) => txn.id !== id));
            } catch (error) {
              console.error("Error deleting transaction:", error);
            }
          },
        },
      ]
    );
  };

  const filteredTransactions = transactions.filter((txn) => {
    const query = searchQuery.toLowerCase();
    return (
      txn.item?.toLowerCase().includes(query) ||
      txn.category?.toLowerCase().includes(query)
    );
  });

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <NavigationBarManager />
      <View style={styles.container}>
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={RFValue(20)} color="#2d8bef" />
          <TextInput
            placeholder="Search items"
            placeholderTextColor="gray"
            style={styles.searchInput}
            value={searchQuery}
            onChangeText={setSearchQuery}
            allowFontScaling={false}
          />
        </View>

        <View style={styles.navabar}>
          {["Today", "Weekly", "Monthly"].map((tab) => (
            <TouchableOpacity
              key={tab}
              style={[
                styles.navbartitle,
                selectedTab === tab && styles.navbartitleSelected,
              ]}
              onPress={() => setSelectedTab(tab)}
              activeOpacity={1}
            >
              <View style={styles.textWrapper}>
                <Text
                  style={[
                    styles.navtext,
                    selectedTab === tab && styles.navtextSelected,
                  ]}
                  allowFontScaling={false}
                  adjustsFontSizeToFit
                  numberOfLines={1}
                >
                  {tab}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
        >
          {filteredTransactions.length === 0 ? (
            <Text style={styles.noResults}>No transactions found</Text>
          ) : (
            filteredTransactions.map((item) => (
              <View key={item.id} style={styles.card}>
                <View style={styles.cardHeader}>
                  <Ionicons name="wallet" size={RFValue(30)} color="#2d8bef" />
                  <View style={styles.cardContent}>
                    <View>
                      <Text
                        style={styles.title}
                        allowFontScaling={false}
                        adjustsFontSizeToFit
                        numberOfLines={1}
                      >
                        {item.item || "No title"}
                      </Text>
                      <Text
                        style={styles.descrption}
                        allowFontScaling={false}
                        adjustsFontSizeToFit
                        numberOfLines={1}
                      >
                        {item.category}
                      </Text>
                    </View>
                    <View style={{ alignItems: "flex-end" }}>
                      <Text
                        style={styles.trans}
                        allowFontScaling={false}
                        adjustsFontSizeToFit
                        numberOfLines={1}
                      >
                        -₹{item.amount}
                      </Text>
                      <Text
                        style={styles.descrption}
                        allowFontScaling={false}
                        adjustsFontSizeToFit
                        numberOfLines={1}
                      >
                        {item.createdAt
                          ? dayjs(
                              item.createdAt.seconds
                                ? new Date(item.createdAt.seconds * 1000)
                                : new Date(item.createdAt)
                            ).format("DD MMM, HH:mm")
                          : "No date"}
                      </Text>
                    </View>
                  </View>
                </View>
                <View style={styles.actionButtons}>
                  <TouchableOpacity
                    style={styles.editButton}
                    onPress={() =>
                      router.push({
                        pathname: "/componets/EditTransaction",
                        params: { trans: JSON.stringify(item) },
                      })
                    }
                  >
                    <Ionicons
                      name="create-outline"
                      size={RFValue(18)}
                      color="white"
                    />
                    <Text
                      style={styles.buttonText}
                      allowFontScaling={false}
                      adjustsFontSizeToFit
                      numberOfLines={1}
                    >
                      Edit
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.deleteButton}
                    onPress={() => handleDelete(item.id)}
                  >
                    <Ionicons
                      name="trash-outline"
                      size={RFValue(18)}
                      color="white"
                    />
                    <Text
                      style={styles.buttonText}
                      allowFontScaling={false}
                      adjustsFontSizeToFit
                      numberOfLines={1}
                    >
                      Delete
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))
          )}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default Transaction;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: RFValue(10),
  },
  scrollView: {
    marginTop: RFValue(10),
  },
  searchContainer: {
    flexDirection: "row",
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "gray",
    borderRadius: 5,
    alignItems: "center",
    paddingLeft: 10,
    paddingVertical: RFValue(5),
  },
  searchInput: {
    marginLeft: 10,
    flex: 1,
    fontSize: RFValue(14),
  },
  navabar: {
    flexDirection: "row",
    paddingTop: RFValue(10),
  },
  navbartitle: {
    backgroundColor: "#666",
    padding: RFValue(5),
    paddingHorizontal: RFValue(15),
    marginLeft: 10,
    borderRadius: 50,
  },
  navbartitleSelected: {
    backgroundColor: "#2d8bef",
  },
  textWrapper: {
    flexShrink: 1,
    minWidth: 0,
  },
  navtext: {
    color: "white",
    fontSize: RFValue(14),
    flexShrink: 1,
    minWidth: 0,
    textAlign: "center",
  },
  navtextSelected: {
    fontWeight: "bold",
  },
  card: {
    marginTop: RFValue(10),
    padding: RFValue(15),
    borderRadius: 10,
    backgroundColor: "white",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
    marginBottom: RFValue(15),
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
  },
  cardContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    flex: 1,
    paddingLeft: 15,
  },
  title: {
    fontSize: RFValue(14),
    fontWeight: "bold",
    flexShrink: 1,
  },
  descrption: {
    color: "gray",
    fontSize: RFValue(12),
    flexShrink: 1,
  },
  trans: {
    color: "red",
    fontSize: RFValue(13),
    flexShrink: 1,
    textAlign: "right",
  },
  noResults: {
    marginTop: 40,
    textAlign: "center",
    color: "gray",
    fontStyle: "italic",
    fontSize: RFValue(14),
  },
  actionButtons: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 10,
  },
  editButton: {
    backgroundColor: "#2d8bef",
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
    marginRight: 10,
  },
  deleteButton: {
    backgroundColor: "red",
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: "white",
    marginLeft: 5,
    fontSize: RFValue(12),
  },
});
