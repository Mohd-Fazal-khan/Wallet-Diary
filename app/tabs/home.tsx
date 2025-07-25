import {
  Image,
  StyleSheet,
  Text,
  View,
  ScrollView,
  Dimensions,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useEffect, useState } from "react";
import { db, auth } from "@/firebase/firebaseConfig";
import PieChart from "react-native-pie-chart";
import { BarChart } from "react-native-chart-kit";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import * as ImagePicker from "expo-image-picker";
import {
  collection,
  doc,
  getDoc,
  onSnapshot,
  updateDoc,
} from "firebase/firestore";
import { getCurrencySymbolByLocation } from "../utils/currency";
import NavigationBarManager from "../componets/NavigationBarManager";
import { RFValue } from "react-native-responsive-fontsize";

const Home = () => {
  const [username, setUsername] = useState<string | null>(null);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [totalIncome, setTotalIncome] = useState(0);
  const [remaining, setRemaining] = useState(0);
  const [totalExpense, setTotalExpense] = useState(0);
  const [categoryChartData, setCategoryChartData] = useState<
    Record<string, number>
  >({});
  const [loading, setLoading] = useState(false);
  const [currencySymbol, setCurrencySymbol] = useState("$");
  const [incomeSources, setIncomeSources] = useState([]);

  const screenWidth = Dimensions.get("window").width - 50;
  const widthAndHeight = screenWidth * 0.5;

  const chartConfig = {
    backgroundGradientFrom: "#ffffff",
    backgroundGradientTo: "#ffffff",
    color: (opacity = 1) => `rgba(45, 139, 239, ${opacity})`,
    strokeWidth: 2,
    barPercentage: 0.5,
    useShadowColorFromDataset: false,
  };

  const user = auth.currentUser;

  const uploadImageToCloudinary = async (imageUri: string) => {
    const data = new FormData();
    data.append("file", {
      uri: imageUri,
      type: "image/jpeg",
      name: "profile.jpg",
    } as any);
    data.append("upload_preset", "unsigned_preset");

    try {
      let res = await fetch(
        "https://api.cloudinary.com/v1_1/dhsvjvgec/image/upload",
        {
          method: "POST",
          body: data,
        }
      );
      let json = await res.json();
      return json.secure_url;
    } catch (error) {
      console.error("Cloudinary upload error:", error);
      throw error;
    }
  };

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permission Required",
        "Permission to access gallery is needed!"
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      try {
        setLoading(true);
        const uploadUrl = await uploadImageToCloudinary(result.assets[0].uri);
        setProfileImage(uploadUrl);

        const userRef = doc(db, "users", user.uid);
        await updateDoc(userRef, { profileImage: uploadUrl });
      } catch (err) {
        Alert.alert("Upload Failed", "Image upload to Cloudinary failed.");
      } finally {
        setLoading(false);
      }
    }
  };

  const listenToIncomes = () => {
    if (!user) return;

    const incomesRef = collection(db, "users", user.uid, "income");

    const unsubscribe = onSnapshot(incomesRef, (snapshot) => {
      let totalIncomeCalc = 0;
      let sources = [];

      snapshot.forEach((docSnap) => {
        const data = docSnap.data();
        totalIncomeCalc += data.salary;
        sources.push({ source: data.source, amount: data.salary });
      });

      setTotalIncome(totalIncomeCalc);
      setIncomeSources(sources);
    });

    return unsubscribe;
  };

  const listenToExpenses = () => {
    if (!user) return;

    const expensesRef = collection(db, "users", user.uid, "expenses");

    const unsubscribe = onSnapshot(expensesRef, (snapshot) => {
      let calculatedExpense = 0;
      let categoryTotals: Record<string, number> = {};

      snapshot.forEach((docSnap) => {
        const data = docSnap.data();
        calculatedExpense += data.amount;

        const category = data.category || "Other";
        if (!categoryTotals[category]) {
          categoryTotals[category] = 0;
        }
        categoryTotals[category] += data.amount;
      });

      setTotalExpense(calculatedExpense);
      setCategoryChartData(categoryTotals);
    });

    return unsubscribe;
  };

  const labels = Object.keys(categoryChartData);
  const values = Object.values(categoryChartData);
  const colors = [
    "#fbd203",
    "#ffb300",
    "#ff9100",
    "#ff6c00",
    "#3cba54",
    "#db3236",
    "#4885ed",
  ];

  const total = values.reduce((sum, val) => sum + val, 0);
  const pieLabels = values.map((val) => {
    if (total === 0) return "0%";
    const percentage = (val / total) * 100;
    return `${percentage.toFixed(2)}%`;
  });

  const pieSeries = values.map((val, idx) => ({
    value: val,
    color: colors[idx % colors.length],
  }));

  const sortedEntries = Object.entries(categoryChartData)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  const barLabels = sortedEntries.map(([label]) => label);
  const barValues: number[] = sortedEntries.map(([, val]) => Number(val));

  const maxBarValue = Math.max(...barValues, 0);
  const roundedMax = Math.ceil(maxBarValue / 10) * 10;

  const barData = {
    labels: barLabels,
    datasets: [{ data: barValues }],
  };

  useEffect(() => {
    if (!user) return;

    setUsername(user.displayName);

    const fetchProfileImage = async () => {
      try {
        const userRef = doc(db, "users", user.uid);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          const userData = userSnap.data();
          setProfileImage(userData.profileImage || null);
        }
      } catch (error) {
        console.error("Error fetching profile image:", error);
      }
    };

    const fetchCurrency = async () => {
      const symbol = await getCurrencySymbolByLocation();
      setCurrencySymbol(symbol);
    };

    fetchProfileImage();
    fetchCurrency();

    const unsubscribeIncomes = listenToIncomes();
    const unsubscribeExpenses = listenToExpenses();

    return () => {
      unsubscribeIncomes && unsubscribeIncomes();
      unsubscribeExpenses && unsubscribeExpenses();
    };
  }, [user]);

  useEffect(() => {
    setRemaining(totalIncome - totalExpense);
  }, [totalIncome, totalExpense]);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <NavigationBarManager />
      <ScrollView contentContainerStyle={{ padding: 10 }}>
        <View style={styles.container}>
          <View style={styles.header}>
            <View>
              <Text style={styles.title}>Welcome Back,</Text>
              <Text style={styles.name}>{username}</Text>
            </View>
            <TouchableOpacity onPress={pickImage}>
              {loading ? (
                <ActivityIndicator
                  size="small"
                  color="#2d8bef"
                  style={styles.img}
                />
              ) : (
                <Image
                  style={styles.img}
                  source={
                    profileImage
                      ? { uri: profileImage }
                      : require("../../assets/images/user.png")
                  }
                />
              )}
            </TouchableOpacity>
          </View>

          <View style={styles.content}>
            <Text style={styles.total}>Total Balance</Text>
            <Text style={styles.totalexp}>
              {currencySymbol} {totalIncome > 0 ? remaining : totalIncome}
            </Text>

            <View style={styles.cardcontainer}>
              <View style={styles.card}>
                <Text style={styles.cardLabel}>Income</Text>
                <Text style={styles.cardAmount}>
                  {currencySymbol} {totalIncome}
                </Text>
              </View>

              <View style={styles.card}>
                <Text style={styles.cardLabel}>Expenses</Text>
                <Text style={styles.cardAmount}>
                  {currencySymbol} {totalExpense}
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.barContainer}>
            <Text style={styles.bartitle}>Expense by Category</Text>

            {total > 0 ? (
              <>
                <PieChart
                  widthAndHeight={widthAndHeight}
                  series={pieSeries}
                  cover={0.65}
                  style={styles.bar}
                />

                <ScrollView style={styles.legendScroll} nestedScrollEnabled>
                  <View style={styles.legend}>
                    {labels.map((label, index) => (
                      <View key={index} style={styles.legendItem}>
                        <Ionicons
                          name="ellipse"
                          size={RFValue(12)}
                          color={pieSeries[index]?.color || "#ccc"}
                        />
                        <View style={styles.legendTextWrapper}>
                          <Text
                            style={styles.legendText}
                            numberOfLines={0}
                            allowFontScaling={false}
                          >
                            {label} - {pieLabels[index]}
                          </Text>
                        </View>
                      </View>
                    ))}
                  </View>
                </ScrollView>
              </>
            ) : (
              <Text
                style={{ textAlign: "center", marginTop: 10, color: "gray" }}
              >
                No expenses to show in Pie Chart
              </Text>
            )}
          </View>

          <View style={styles.barContainer}>
            <Text style={styles.bartitle}>Expense Trends</Text>
            <View style={styles.barcard}>
              <BarChart
                style={styles.barchart}
                data={barData}
                width={screenWidth}
                height={400}
                yAxisLabel={currencySymbol}
                chartConfig={chartConfig}
                verticalLabelRotation={50}
                fromZero={true}
                yAxisSuffix=""
                yAxisInterval={10}
                segments={5}
              />
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Home;

const { width } = Dimensions.get("window");

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  title: { fontSize: RFValue(18), color: "#2d8bef" },
  name: { fontSize: RFValue(16), fontWeight: "bold" },
  img: {
    height: width * 0.12,
    width: width * 0.12,
    borderRadius: (width * 0.12) / 2,
  },
  content: {
    backgroundColor: "#2d8bef",
    padding: 20,
    margin: 10,
    borderRadius: 10,
  },
  total: { color: "#D6D5CB", fontSize: RFValue(14) },
  totalexp: { color: "white", fontSize: RFValue(32), fontWeight: "bold" },
  cardcontainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 20,
    width: "100%",
  },
  card: {
    backgroundColor: "#55A3F2",
    width: "49%",
    padding: 12,
    paddingVertical: 10,
    borderRadius: 8,
  },
  cardLabel: { color: "#D6D5CB", fontSize: RFValue(12), marginBottom: 4 },
  cardAmount: { color: "white", fontSize: RFValue(16), fontWeight: "bold" },
  barContainer: {
    padding: 10,
    margin: 10,
    backgroundColor: "white",
    borderRadius: 10,
  },
  bartitle: { fontSize: RFValue(16), fontWeight: "bold" },
  bar: { margin: 15, alignSelf: "center" },
  legendScroll: {
    maxHeight: 150,
  },
  legend: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    width: "48%",
    marginBottom: 10,
  },
  legendTextWrapper: { flex: 1, marginLeft: 5 },
  legendText: {
    padding: 5,
    fontSize: RFValue(12),
    color: "black",
    flexWrap: "wrap",
  },
  barcard: { marginTop: 15, overflow: "hidden" },
  barchart: { borderRadius: 10, overflow: "hidden" },
});
