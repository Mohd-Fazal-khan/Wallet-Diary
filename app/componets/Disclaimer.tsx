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

const Disclaimer = () => {
  return (
    <View style={styles.container}>
     <StatusBar backgroundColor="black" barStyle="light-content" />
      <NavigationBarManager />

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Ionicons name="alert-circle" size={width * 0.15} color="#ffffff" />
          <Text style={styles.headerTitle}>Disclaimer</Text>
        </View>
      </View>

      {/* Body */}
      <ScrollView contentContainerStyle={styles.body}>
        <Text style={styles.subTitle}>Last updated: August 15, 2025</Text>

        <Text style={styles.sectionTitle}>Interpretation and Definitions</Text>
        <Text style={styles.subSectionTitle}>Interpretation</Text>
        <Text style={styles.text}>
          Words with an initial capital letter have meanings defined under the
          following conditions. These definitions apply whether they appear in
          singular or plural.
        </Text>

        <Text style={styles.subSectionTitle}>Definitions</Text>
        <Text style={styles.text}>For the purposes of this Disclaimer:</Text>
        <Text style={styles.text}>
          • <Text style={styles.bold}>Company</Text> (&quot;the Company&quot;, &quot;We&quot;, &quot;Us&quot;,
          or &quot;Our&quot;) refers to Wallet Diary.{"\n"}•{" "}
          <Text style={styles.bold}>Service</Text> refers to the Application.
          {"\n"}• <Text style={styles.bold}>You</Text> means the individual or
          entity accessing the Service.{"\n"}•{" "}
          <Text style={styles.bold}>Application</Text> means the software
          program provided by the Company downloaded on any device named Wallet
          Diary.
        </Text>

        <Text style={styles.sectionTitle}>Disclaimer</Text>
        <Text style={styles.text}>
          The information provided by the Service is for general purposes only.
          The Company assumes no responsibility for errors or omissions. We are
          not liable for direct, indirect, incidental, or consequential damages
          arising from use of the Service.
        </Text>

        <Text style={styles.sectionTitle}>External Links Disclaimer</Text>
        <Text style={styles.text}>
          The Service may contain links to external websites not provided or
          maintained by the Company. We do not guarantee their accuracy,
          relevance, timeliness, or completeness.
        </Text>

        <Text style={styles.sectionTitle}>Errors and Omissions Disclaimer</Text>
        <Text style={styles.text}>
          While efforts are made to keep the information current and accurate,
          errors can occur. The Company is not responsible for inaccuracies or
          results obtained from the use of this information.
        </Text>

        <Text style={styles.sectionTitle}>Fair Use Disclaimer</Text>
        <Text style={styles.text}>
          We may use copyrighted material under &quot;fair use&quot; for purposes such as
          criticism, comment, news reporting, teaching, and research. If you
          wish to use copyrighted material beyond fair use, you must obtain
          permission from the copyright owner.
        </Text>

        <Text style={styles.sectionTitle}>Views Expressed Disclaimer</Text>
        <Text style={styles.text}>
          Views expressed in the Service are those of the authors and do not
          necessarily represent the Company’s views. Comments are the sole
          responsibility of their authors.
        </Text>

        <Text style={styles.sectionTitle}>No Responsibility Disclaimer</Text>
        <Text style={styles.text}>
          The Service is not intended to provide legal, accounting, tax, or
          other professional advice. We are not liable for damages resulting
          from reliance on the Service’s information.
        </Text>

        <Text style={styles.sectionTitle}>
          &quot;Use at Your Own Risk&quot; Disclaimer
        </Text>
        <Text style={styles.text}>
          All information is provided &quot;as is&quot; without warranties of any kind.
          The Company will not be liable for any decision or action taken in
          reliance on this information.
        </Text>

        <Text style={styles.sectionTitle}>Contact Us</Text>
        <Text style={styles.text}>By email: support@codedept.in</Text>
      </ScrollView>
    </View>
  );
};

export default Disclaimer;

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
  },
  headerContent: {
    flex: 1,
    alignItems: "center",
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
  sectionTitle: {
    fontSize: width * 0.045,
    fontWeight: "bold",
    marginTop: width * 0.06,
    color: "#2d8bef",
    textAlign: "center",
  },
  subSectionTitle: {
    fontSize: width * 0.04,
    fontWeight: "bold",
    marginTop: width * 0.04,
    color: "#444",
  },
  text: {
    textAlign: "justify",
    marginTop: width * 0.02,
    fontSize: width * 0.04,
    lineHeight: width * 0.055,
    color: "#333",
  },
  subTitle: {
    fontSize: width * 0.04,
    fontWeight: "600",
    marginBottom: width * 0.03,
    textAlign: "center",
    color: "#888",
  },
  bold: {
    fontWeight: "bold",
  },
});
