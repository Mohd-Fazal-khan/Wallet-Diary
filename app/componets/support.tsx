import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  Dimensions,
  StatusBar,
} from "react-native";
import React from "react";
import { Ionicons } from "@expo/vector-icons";
import NavigationBarManager from "./NavigationBarManager";

const { width } = Dimensions.get("window");

const Support = () => {
  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="black" barStyle="light-content" />
      <NavigationBarManager />
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Ionicons name="headset" size={width * 0.15} color="#ffffff" />
          <Text style={styles.headerTitle}>Help & Support</Text>
        </View>
      </View>

   
      <ScrollView contentContainerStyle={styles.body}>
        <Text style={styles.text}>
          Need assistance or have a question? We’re here to help!
        </Text>
        <Text style={styles.text}>
          If you’re facing any issues, have suggestions, or need help using the
          app, feel free to reach out to our support team. At CodeDept, your
          experience matters, and we’re committed to providing fast and friendly
          support.
        </Text>

        <Text style={styles.subTitle}>Email Us</Text>
        <Text style={styles.detail}>support@codedept.in</Text>

        <Text style={styles.subTitle}>Support Hours</Text>
        <Text style={styles.detail}>
          Monday to Saturday – 9:00 AM to 6:00 PM (IST)
        </Text>

        <Text style={styles.text}>
          We typically respond within 24–48 hours.
        </Text>
        <Text style={styles.text}>
          Your feedback helps us improve, so don’t hesitate to get in touch!
        </Text>
      </ScrollView>
    </View>
  );
};

export default Support;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f8f8",
  },
  header: {
    backgroundColor: "#2d8bef",
    paddingTop: width * 0.12,
    paddingBottom: width * 0.05,
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
  headerTitle: {
    fontSize: width * 0.06,
    fontWeight: "bold",
    color: "#ffffff",
    marginTop: width * 0.02,
  },
  body: {
    padding: width * 0.05,
    paddingBottom: width * 0.1,
  },
  text: {
    textAlign: "justify",
    marginTop: width * 0.03,
    fontSize: width * 0.04,
    lineHeight: width * 0.055,
    color: "#333",
  },
  subTitle: {
    fontSize: width * 0.045,
    fontWeight: "bold",
    marginTop: width * 0.06,
    textAlign: "center",
    color: "#2d8bef",
  },
  detail: {
    fontSize: width * 0.04,
    textAlign: "center",
    marginTop: width * 0.02,
    color: "#333",
  },
});
