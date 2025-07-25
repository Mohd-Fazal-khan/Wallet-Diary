import {
  Alert,
  Dimensions,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ActivityIndicator,
} from "react-native";
import React, { useCallback, useState } from "react";
import { useRouter } from "expo-router";

import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/firebase/firebaseConfig";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";
import { RFValue } from "react-native-responsive-fontsize";
import { useFocusEffect } from "@react-navigation/native";

export const options = {
  animation: "none",
};

const { width } = Dimensions.get("window");

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useFocusEffect(
    useCallback(() => {
      setEmail("");
      setPassword("");
      setShowPassword(false);
    }, [])
  );

  const router = useRouter();

  const handleLogin = async () => {
    setLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );

      if (!userCredential.user.emailVerified) {
        setLoading(false);
        Alert.alert(
          "Email Not Verified",
          "Please verify your email before logging in."
        );
        return;
      }

      await AsyncStorage.setItem("token", userCredential.user.uid);
      await AsyncStorage.setItem("isLoggedIn", JSON.stringify(true));
      console.log("User logged in!");
      router.replace("/tabs/home");
    } catch (error: any) {
      Alert.alert("Invalid credentials", "Please check your ID and password");
    } finally {
      setLoading(false);
    }
  };

  return (
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
          <Image
            style={styles.logo}
            source={require("../assets/images/logo.png")}
          />

          <View style={styles.text}>
            <Text
              style={styles.title}
              allowFontScaling={false}
              numberOfLines={2}
              adjustsFontSizeToFit
            >
              Welcome Back To Wallet Diary
            </Text>
            <Text
              style={styles.titletxt}
              allowFontScaling={false}
              numberOfLines={2}
              adjustsFontSizeToFit
            >
              Track your expenses smarter
            </Text>
          </View>

          <View style={styles.form}>
            <TextInput
              style={styles.input}
              placeholder="Email"
              keyboardType="email-address"
              placeholderTextColor="black"
              value={email}
              onChangeText={(value) => setEmail(value)}
            />
            <View style={styles.passwordContainer}>
              <TextInput
                style={styles.passwordInput}
                placeholder="Password"
                placeholderTextColor="black"
                secureTextEntry={!showPassword}
                value={password}
                onChangeText={(value) => setPassword(value)}
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                <Ionicons
                  name={showPassword ? "eye" : "eye-off"}
                  size={24}
                  color="gray"
                />
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              onPress={() => router.replace("/componets/ForgotPassword")}
            >
              <Text
                style={{ color: "#2d8bef", marginTop: 10, textAlign: "right" }}
                allowFontScaling={false}
              >
                Forgot Password?
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.btn, loading && { opacity: 0.6 }]}
              onPress={handleLogin}
              disabled={loading}
              activeOpacity={0.7}
            >
              {loading ? (
                <ActivityIndicator color="#ffffff" />
              ) : (
                <Text
                  style={styles.btntext}
                  allowFontScaling={false}
                  adjustsFontSizeToFit
                  numberOfLines={1}
                >
                  Login
                </Text>
              )}
            </TouchableOpacity>
          </View>

          <View style={styles.logfooter}>
            <Text
              style={styles.footerpalintxt}
              allowFontScaling={false}
              numberOfLines={2}
              adjustsFontSizeToFit
            >
              Don&apos;t have an account?{" "}
            </Text>
            <TouchableOpacity onPress={() => router.replace("/signup")}>
              <Text style={styles.logfootertext} allowFontScaling={false}>
                Sign up
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default Login;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: 40,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#ffffff",
  },
  logo: {
    width: width * 0.3,
    height: width * 0.3,
    resizeMode: "contain",
  },
  title: {
    fontSize: RFValue(22),
    fontWeight: "bold",
    flexShrink: 1,
    textAlign: "center",
  },
  titletxt: {
    fontSize: RFValue(16),
    color: "black",
    flexShrink: 1,
    textAlign: "center",
  },
  text: {
    marginTop: 10,
    alignItems: "center",
    paddingHorizontal: 20,
  },
  form: {
    marginTop: 40,
    width: "90%",
  },
  input: {
    width: "100%",
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 5,
    marginTop: 10,
    padding: 10,
    fontSize: RFValue(14),
    color: "black",
  },
  btn: {
    width: "100%",
    marginTop: 20,
    backgroundColor: "#2d8bef",
    height: 45,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
    paddingHorizontal: 12,
  },
  btntext: {
    fontSize: RFValue(18),
    color: "#ffffff",
    flexShrink: 1,
    textAlign: "center",
    minWidth: RFValue(50),
  },
  logfooter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
    paddingHorizontal: 10,
  },
  logfootertext: {
    color: "#2d8bef",
    fontWeight: "bold",
    fontSize: RFValue(14),
  },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginTop: 10,
  },
  passwordInput: {
    flex: 1,
    paddingVertical: 10,
    color: "black",
    fontSize: RFValue(14),
  },
  footerpalintxt: {
    color: "black",
    fontSize: RFValue(14),
    flexShrink: 1,
  },
});
