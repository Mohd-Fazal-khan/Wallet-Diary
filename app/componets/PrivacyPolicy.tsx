import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  Dimensions,
  StatusBar,
} from "react-native";
import React from "react";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import NavigationBarManager from "./NavigationBarManager";

const { width } = Dimensions.get("window");

const PrivacyPolicy = () => {
  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="black" barStyle="light-content" />
      <NavigationBarManager />
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <MaterialIcons
            name="privacy-tip"
            size={width * 0.15}
            color="#ffffff"
          />
          <Text style={styles.headerTitle}>Privacy Policy</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.body}>
        <Text style={styles.subText}>Last updated: August 15, 2025</Text>
        <Text style={styles.text}>
          This privacy policy applies to the Wallet Diary app (hereby referred
          to as &quot;Application&quot;) for mobile devices that was created by Code Dept
          (hereby referred to as &quot;Service Provider&quot;) as a Free service. This
          service is intended for use &quot;AS IS&quot;.
        </Text>

        <Text style={styles.subTitle}>Information Collection and Use</Text>
        <Text style={styles.text}>
          The Application collects information when you download and use it.
          This information may include:
        </Text>
        <Text style={styles.detail}>• Your device&apos;s IP address</Text>
        <Text style={styles.detail}>
          • Pages visited in the Application, time/date of visit, and duration
        </Text>
        <Text style={styles.detail}>• Time spent on the Application</Text>
        <Text style={styles.detail}>
          • Operating system used on your mobile device
        </Text>

        <Text style={styles.text}>
          The Application collects your device&apos;s location to:
        </Text>
        <Text style={styles.detail}>
          • Provide personalized content, recommendations, and location-based
          services
        </Text>
        <Text style={styles.detail}>
          • Analyze usage trends and improve performance
        </Text>
        <Text style={styles.detail}>
          • Share anonymized location data with trusted third parties to enhance
          services
        </Text>

        <Text style={styles.text}>
          The Service Provider may use your information to contact you with
          important updates, notices, and promotions.
        </Text>

        <Text style={styles.subTitle}>Third Party Access</Text>
        <Text style={styles.text}>
          Only aggregated, anonymized data is shared with external services for
          improvement purposes. Information may also be disclosed:
        </Text>
        <Text style={styles.detail}>
          • As required by law or legal processes
        </Text>
        <Text style={styles.detail}>
          • To protect rights, safety, and investigate fraud
        </Text>
        <Text style={styles.detail}>
          • To trusted service providers who adhere to this privacy policy
        </Text>

        <Text style={styles.subTitle}>Opt-Out Rights</Text>
        <Text style={styles.text}>
          You can stop all information collection by uninstalling the
          Application via your device’s standard uninstall process.
        </Text>

        <Text style={styles.subTitle}>Data Retention Policy</Text>
        <Text style={styles.text}>
          User-provided data is retained as long as you use the Application and
          for a reasonable time thereafter. To request deletion, contact
          support@codedept.in.
        </Text>

        <Text style={styles.subTitle}>Children</Text>
        <Text style={styles.text}>
          The Application is not intended for children under 13. The Service
          Provider does not knowingly collect their personal information. If you
          believe such data has been collected, contact support@codedept.in.
        </Text>

        <Text style={styles.subTitle}>Security</Text>
        <Text style={styles.text}>
          The Service Provider implements physical, electronic, and procedural
          safeguards to protect your data.
        </Text>

        <Text style={styles.subTitle}>Changes</Text>
        <Text style={styles.text}>
          This policy may be updated periodically. Continued use of the
          Application signifies acceptance of any changes.
        </Text>

        <Text style={styles.subTitle}>Your Consent</Text>
        <Text style={styles.text}>
          By using the Application, you consent to the processing of your
          information as outlined in this Privacy Policy.
        </Text>

        <Text style={styles.subTitle}>Contact Us</Text>
        <Text style={styles.text}>
          For questions regarding privacy, email support@codedept.in
        </Text>
      </ScrollView>
    </View>
  );
};

export default PrivacyPolicy;

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
  detail: {
    fontSize: width * 0.04,
    textAlign: "justify",
    marginTop: width * 0.015,
    color: "#555",
    paddingLeft: width * 0.02,
  },

  subText: {
    fontSize: width * 0.04,
    fontWeight: "600",
    marginBottom: width * 0.03,
    textAlign: "center",
    color: "#888",
  },
});
