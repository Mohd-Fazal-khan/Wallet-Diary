import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  Dimensions,
  StatusBar,
} from "react-native";
import React from "react";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import NavigationBarManager from "./NavigationBarManager";

const { width } = Dimensions.get("window");

const TermsAndConditions = () => {
  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="black" barStyle="light-content" />
      <NavigationBarManager />
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <FontAwesome6
            name="file-contract"
            size={width * 0.15}
            color="#ffffff"
          />
          <Text style={styles.headerTitle}>Terms & Conditions</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.body}>
        <Text style={styles.subText}>Last updated: August 15, 2025</Text>
        <Text style={styles.text}>
          These terms and conditions apply to the Wallet Diary app (hereby
          referred to as &quot;Application&quot;) for mobile devices that was
          created by Code Dept (hereby referred to as &quot;Service
          Provider&quot;) as a Free service.
        </Text>

        <Text style={styles.text}>
          By downloading or using the Application, you agree to the following
          terms. Unauthorized copying, modification, translation, reverse
          engineering, or creation of derivative versions is prohibited. All
          related intellectual property rights remain the property of the
          Service Provider.
        </Text>

        <Text style={styles.text}>
          The Service Provider may modify the Application or charge for services
          at any time, with prior notice for any charges.
        </Text>

        <Text style={styles.subTitle}>Personal Data & Security</Text>
        <Text style={styles.text}>
          The Application stores and processes personal data you provide to
          deliver the Service. You are responsible for maintaining your phone’s
          security and access. Jailbreaking or rooting your device is strongly
          discouraged as it may compromise security and functionality.
        </Text>

        <Text style={styles.subTitle}>Internet & Network Usage</Text>
        <Text style={styles.text}>
          Some features require an active internet connection. The Service
          Provider is not responsible for limited functionality due to poor
          connection or exhausted data allowance.
        </Text>
        <Text style={styles.text}>
          If using mobile data, you are responsible for charges from your
          provider, including roaming fees. If you are not the bill payer, you
          confirm you have the bill payer’s permission.
        </Text>

        <Text style={styles.subTitle}>Device Responsibility</Text>
        <Text style={styles.text}>
          Keeping your device charged is your responsibility. The Service
          Provider is not liable if the Service becomes inaccessible due to a
          dead battery.
        </Text>

        <Text style={styles.subTitle}>Accuracy & Updates</Text>
        <Text style={styles.text}>
          While efforts are made to keep the Application updated and accurate,
          the Service Provider relies on third-party information and accepts no
          liability for loss resulting from reliance on the Application’s
          content.
        </Text>
        <Text style={styles.text}>
          You agree to accept updates when offered. The Service Provider may
          cease providing the Application at any time without notice. Upon
          termination, you must stop using and delete the Application.
        </Text>

        <Text style={styles.subTitle}>Changes to Terms</Text>
        <Text style={styles.text}>
          The Service Provider may update these Terms periodically. Continued
          use of the Application constitutes acceptance of the revised Terms.
        </Text>

        <Text style={styles.subTitle}>Contact Us</Text>
        <Text style={styles.text}>
          For questions about these Terms & Conditions, email
          support@codedept.in.
        </Text>
      </ScrollView>
    </View>
  );
};

export default TermsAndConditions;

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
    textAlign: "center",
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

  subText: {
    fontSize: width * 0.04,
    fontWeight: "600",
    marginBottom: width * 0.03,
    textAlign: "center",
    color: "#888",
  },
});
