import {
  Alert,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useState } from "react";
import { auth } from "@/firebase/firebaseConfig";
import { sendPasswordResetEmail } from "firebase/auth";
import { useRouter } from "expo-router";
import NavigationBarManager from "./NavigationBarManager";
import { NetworkProvider } from "../utils/NetworkProvider";
const { width } = Dimensions.get("window");

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const router = useRouter();

  const handlePasswordReset = async () => {
    if (!email.trim()) {
      Alert.alert("Error", "Please enter your email.");
      return;
    }

    try {
      await sendPasswordResetEmail(auth, email);
      Alert.alert(
        "Password Reset Email Sent",
        "Please check your email to reset your password."
      );
      router.replace("/login");
    } catch (error) {
      Alert.alert("Error", "Failed to send reset email. Please try again.");
      console.error("Password Reset Error: ", error);
    }
  };

  return (
       <NetworkProvider>
      <StatusBar backgroundColor="black" barStyle="light-content" />
      <NavigationBarManager />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.container}>
            <Text style={styles.title}>Forgot Password</Text>
            <Text style={styles.subtitle}>
              Enter your email to receive a password reset link.
            </Text>

            <TextInput
              style={styles.input}
              placeholder="Enter your email"
              keyboardType="email-address"
              placeholderTextColor="black"
              value={email}
              onChangeText={(value) => setEmail(value)}
            />

            <TouchableOpacity style={styles.btn} onPress={handlePasswordReset}>
              <Text
                style={styles.btntext}
                allowFontScaling={false}
                adjustsFontSizeToFit
                numberOfLines={1}
              >
                Send Reset Link
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.back}
              onPress={() => router.replace("/login")}
            >
              <Text style={styles.backtext}>Back to Login</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
     </NetworkProvider>
  );
};

export default ForgotPassword;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ffffff",
  },
  title: {
    fontSize: width * 0.06,
    fontWeight: "bold",
    marginBottom: 20,
  },
  subtitle: {
    fontSize: width * 0.04,
    textAlign: "center",
    marginBottom: 20,
    color: "gray",
  },
  input: {
    width: "100%",
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 5,
    marginTop: 10,
    padding: 10,
  },
  btn: {
    width: "100%",
    marginTop: 20,
    backgroundColor: "#2d8bef",
    height: 45,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
  },
  btntext: {
    fontSize: width * 0.045,
    color: "#ffffff",
  },
  back: {
    marginTop: 20,
  },
  backtext: {
    color: "#2d8bef",
    fontWeight: "bold",
  },
});
