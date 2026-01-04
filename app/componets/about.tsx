import {
  Dimensions,
  Image,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React from "react";
import NavigationBarManager from "./NavigationBarManager";

const { width } = Dimensions.get("window"); 

const About = () => {
  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="black" barStyle="light-content" />
      <NavigationBarManager />
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <View style={styles.logoWrapper}>
            <Image
              source={require("../../assets/images/logo.png")}
              style={styles.logo}
            />
          </View>

          <Text style={styles.headerTitle}>Wallet Diary</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>About</Text>

        <Text style={styles.text}>
          Welcome to Wallet Diary - your all-in-one solution to take control of
          your finances effortlessly. Developed by{" "}
          <Text style={styles.bold}>CodeDept</Text>, our goal is to make money
          management simple and enjoyable for everyone.
        </Text>

        <Text style={styles.text}>
          Whether you&apos;re tracking daily expenses, planning a monthly
          budget, or saving for a dream goal, Wallet Diary gives you the tools to
          stay on top of your finances. With real-time insights, easy-to-read
          reports, and a clean, user-friendly interface, managing your money has
          never been easier.
        </Text>

        <View style={styles.optionSection}>
          <Text style={styles.optionTitle}>Why Choose Wallet Diary ?</Text>
          <Text style={styles.optionItem}>
            ✅ Secure and private — your data stays only with you
          </Text>
          <Text style={styles.optionItem}>
            ✅ Smart categorization of expenses and income
          </Text>
          <Text style={styles.optionItem}>
            ✅ Detailed reports and spending analysis
          </Text>
          <Text style={styles.optionItem}>
            ✅ Daily, weekly, and monthly tracking
          </Text>
          <Text style={styles.optionItem}>
            ✅ Simple and intuitive design for fast entry
          </Text>
          <Text style={styles.optionItem}>
            ✅ No ads, no clutter — just what you need
          </Text>
        </View>

        <Text style={styles.text}>
          At <Text style={styles.bold}>CodeDept</Text>, we believe financial
          freedom starts with awareness. Our mission is to empower individuals
          with the tools they need to manage their money wisely and confidently.
        </Text>

        <Text style={styles.text}>
          Start your journey towards better financial health with Wallet Diary
          today.
        </Text>
      </ScrollView>
    </View>
  );
};

export default About;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f4f4f4",
  },
  header: {
    backgroundColor: "#2d8bef",
    paddingTop: width * 0.12,
    paddingBottom: width * 0.06,
    paddingHorizontal: width * 0.04,
    flexDirection: "row",
    alignItems: "center",
    position: "relative",
  },
  backButton: {
    position: "absolute",
    top: width * 0.12,
    left: width * 0.04,
    zIndex: 10,
  },
  headerContent: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  logoWrapper: {
    width: width * 0.25,
    height: width * 0.25,
    borderRadius: (width * 0.25) / 2,
    backgroundColor: "#ffffff",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: width * 0.02,
    elevation: 4,
  },
  logo: {
    width: width * 0.18,
    height: width * 0.18,
    resizeMode: "contain",
  },
  headerTitle: {
    fontSize: width * 0.07,
    fontWeight: "bold",
    color: "#ffffff",
  },
  scrollContent: {
    padding: width * 0.05,
    paddingBottom: width * 0.1,
  },
  title: {
    fontSize: width * 0.055,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: width * 0.04,
  },
  text: {
    fontSize: width * 0.045,
    lineHeight: width * 0.065,
    textAlign: "justify",
    marginBottom: width * 0.03,
    color: "#333",
  },
  bold: {
    fontWeight: "bold",
  },
  optionSection: {
    marginBottom: width * 0.04,
  },
  optionTitle: {
    fontSize: width * 0.05,
    fontWeight: "bold",
    marginBottom: width * 0.02,
    color: "#2d8bef",
  },
  optionItem: {
    fontSize: width * 0.045,
    lineHeight: width * 0.065,
    marginBottom: width * 0.015,
  },
});
