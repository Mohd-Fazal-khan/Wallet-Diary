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
import { Ionicons } from "@expo/vector-icons";
import {
  createUserWithEmailAndPassword,
  updateProfile,
  sendEmailVerification,
} from "firebase/auth";
import { auth, db } from "../firebase/firebaseConfig";
import { setDoc, doc } from "firebase/firestore";
import { RFValue } from "react-native-responsive-fontsize";
import { useFocusEffect } from "@react-navigation/native";

const { width } = Dimensions.get("window");

const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [registerLoading, setRegisterLoading] = useState(false);
  const [verifyLoading, setVerifyLoading] = useState(false);
  const router = useRouter();

  useFocusEffect(
    useCallback(() => {
      setEmail("");
      setPassword("");
      setUsername("");
      setShowPassword(false);
    }, [])
  );

  const validatePassword = (password: string) => {
    const regex =
      /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{6,}$/;
    return regex.test(password);
  };

  const register = async () => {
    try {
      if (!username.trim() || !email.trim() || !password.trim()) {
        Alert.alert("All fields are required");
        return;
      }

      if (!validatePassword(password)) {
        Alert.alert(
          "Weak Password",
          "Password must be at least 6 characters long, contain at least 1 uppercase letter, 1 number, and 1 special character."
        );
        return;
      }

      setRegisterLoading(true);

      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      await updateProfile(userCredential.user, { displayName: username });

      await setDoc(doc(db, "users", userCredential.user.uid), {
        username: username,
        email: email,
        profileImage: null,
      });

      await sendEmailVerification(userCredential.user);

      Alert.alert(
        "Verification email sent",
        "Please check your inbox and verify your email."
      );
    } catch (error: any) {
      if (error.code === "auth/email-already-in-use") {
        Alert.alert("Email already in use");
      } else if (error.code === "auth/weak-password") {
        Alert.alert("Password must be at least 6 characters");
      } else if (error.code === "auth/invalid-email") {
        Alert.alert("Invalid email address");
      } else {
        Alert.alert("Error", error.message);
      }
    } finally {
      setRegisterLoading(false);
    }
  };

  const checkEmailVerification = async () => {
    setVerifyLoading(true);
    await auth.currentUser?.reload();

    if (auth.currentUser?.emailVerified) {
      Alert.alert("Email verified successfully!");
      router.replace("/tabs/home");
    } else {
      Alert.alert("Email not verified yet. Please check your inbox.");
    }

    setVerifyLoading(false);
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
            <Text style={styles.title} allowFontScaling={false}>
              Welcome To Wallet Diary
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
              placeholder="Username"
              placeholderTextColor="black"
              autoCapitalize="none"
              value={username}
              onChangeText={(value) => setUsername(value)}
            />
            <TextInput
              style={styles.input}
              placeholder="Email"
              keyboardType="email-address"
              placeholderTextColor="black"
              autoCapitalize="none"
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
              style={[styles.btn, registerLoading && { opacity: 0.6 }]}
              onPress={register}
              disabled={registerLoading}
              activeOpacity={0.7}
            >
              {registerLoading ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text style={styles.btntext} allowFontScaling={false}>
                  Sign up
                </Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.btn, verifyLoading && { opacity: 0.6 }]}
              onPress={checkEmailVerification}
              disabled={verifyLoading}
              activeOpacity={0.7}
            >
              {verifyLoading ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text
                  style={styles.btntext}
                  allowFontScaling={false}
                  adjustsFontSizeToFit
                  numberOfLines={1}
                >
                  I have verified my email
                </Text>
              )}
            </TouchableOpacity>
          </View>

          <View style={styles.logfooter}>
            <Text
              style={styles.logplaintxt}
              allowFontScaling={false}
              numberOfLines={2}
              adjustsFontSizeToFit
            >
              Already have an account?{" "}
            </Text>
            <TouchableOpacity onPress={() => router.replace("/login")}>
              <Text style={styles.logfootertext} allowFontScaling={false}>
                Login
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default Signup;

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
    fontSize: RFValue(16),
    color: "#ffffff",
    flexShrink: 1,
    textAlign: "center",
    minWidth: RFValue(60),
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
  logplaintxt: {
    color: "black",
    fontSize: RFValue(14),
    flexShrink: 1,
  },
});
