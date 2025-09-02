import { auth, db } from "@/firebase/firebaseConfig";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import {
  deleteUser,
  EmailAuthProvider,
  reauthenticateWithCredential,
  signOut,
} from "firebase/auth";
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
} from "firebase/firestore";
import React, { useEffect, useState } from "react";
import {
  Alert,
  Dimensions,
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import NavigationBarManager from "../componets/NavigationBarManager";

const { width } = Dimensions.get("window");

const Profile = () => {
  const router = useRouter();

  const [username, setUsername] = useState(null);
  const [email, setEmail] = useState(null);
  const [profileImage, setProfileImage] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    const user = auth.currentUser;
    if (user) {
      setUsername(user.displayName);
      setEmail(user.email);

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

      fetchProfileImage();
    }
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      await AsyncStorage.removeItem("token");
      await AsyncStorage.removeItem("isLoggedIn");
      console.log("User logged out!");
      router.replace("/login");
    } catch (error) {
      console.error("Logout error:", error);
      Alert.alert("Logout Failed", "Something went wrong. Please try again.");
    }
  };

  const deleteUserData = async (userId) => {
    // Delete all expenses
    const expensesSnapshot = await getDocs(
      collection(db, "users", userId, "expenses")
    );
    for (const expenseDoc of expensesSnapshot.docs) {
      await deleteDoc(doc(db, "users", userId, "expenses", expenseDoc.id));
    }

    // Delete all income
    const incomeSnapshot = await getDocs(
      collection(db, "users", userId, "income")
    );
    for (const incomeDoc of incomeSnapshot.docs) {
      await deleteDoc(doc(db, "users", userId, "income", incomeDoc.id));
    }

    // Finally, delete the main user document
    await deleteDoc(doc(db, "users", userId));
  };

  const handleDelete = async () => {
    const user = auth.currentUser;

    if (!user || !user.email) {
      Alert.alert("Error", "No user is logged in.");
      return;
    }

    if (!password) {
      Alert.alert("Error", "Please enter your password.");
      return;
    }

    const credential = EmailAuthProvider.credential(user.email, password);

    try {
      // Reauthenticate user
      await reauthenticateWithCredential(user, credential);
      await deleteUserData(user.uid); // deletes expenses, income, and user doc
      await deleteUser(user);
      Alert.alert("Success", "Your account has been deleted.");
      router.replace("/login");
    } catch (error) {
      console.error(error);
      Alert.alert("Error", error.message);
    } finally {
      setModalVisible(false);
      setPassword("");
    }
  };

  return (
    <ScrollView
      style={styles.container}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingBottom: width * 0.1 }}
    >
      <SafeAreaView style={{ flex: 1 }}>
        <NavigationBarManager />

        <Text style={styles.title}>Settings</Text>
        <View style={styles.info}>
          <Image
            style={styles.img}
            source={
              profileImage
                ? { uri: profileImage }
                : require("../../assets/images/user.png")
            }
          />

          <View style={styles.userinfo}>
            <Text style={styles.username}>{username}</Text>
            <Text style={styles.useremail}>{email}</Text>
          </View>
        </View>

        <TouchableOpacity
          style={styles.editinfo}
          onPress={() => router.push("/componets/editprofile")}
        >
          <Ionicons name="person" size={width * 0.07} color="#2d8bef" />
          <View style={styles.editcontainer}>
            <Text style={styles.usertitle}>Edit Profile</Text>
            <Ionicons name="chevron-forward-outline" size={width * 0.04} />
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.editinfo}
          onPress={() => router.push("/componets/ExportScreen")}
        >
          <Ionicons name="share-outline" size={width * 0.07} color="#2d8bef" />
          <View style={styles.editcontainer}>
            <Text style={styles.usertitle}>Export Data</Text>
            <Ionicons name="chevron-forward-outline" size={width * 0.04} />
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.editinfo}
          onPress={() => router.push("/componets/about")}
        >
          <Ionicons
            name="information-circle-outline"
            size={width * 0.07}
            color="#2d8bef"
          />
          <View style={styles.editcontainer}>
            <Text style={styles.usertitle}>About</Text>
            <Ionicons name="chevron-forward-outline" size={width * 0.04} />
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.editinfo}
          onPress={() => router.push("/componets/support")}
        >
          <Ionicons
            name="help-circle-outline"
            size={width * 0.07}
            color="#2d8bef"
          />
          <View style={styles.editcontainer}>
            <Text style={styles.usertitle}>Help & Support</Text>
            <Ionicons name="chevron-forward-outline" size={width * 0.04} />
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.editinfo}
          onPress={() => router.push("/componets/TermsandCondition")}
        >
          <Ionicons
            name="document-text-outline"
            size={width * 0.07}
            color="#2d8bef"
          />
          <View style={styles.editcontainer}>
            <Text style={styles.usertitle}>Terms & Conditions</Text>
            <Ionicons name="chevron-forward-outline" size={width * 0.04} />
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.editinfo}
          onPress={() => router.push("/componets/PrivacyPolicy")}
        >
          <MaterialCommunityIcons
            name="shield-outline"
            size={width * 0.07}
            color="#2d8bef"
          />
          <View style={styles.editcontainer}>
            <Text style={styles.usertitle}>Privacy Policy</Text>
            <Ionicons name="chevron-forward-outline" size={width * 0.04} />
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.editinfo}
          onPress={() => router.push("/componets/Disclaimer")}
        >
          <Ionicons
            name="alert-circle-outline"
            size={width * 0.07}
            color="#2d8bef"
          />
          <View style={styles.editcontainer}>
            <Text style={styles.usertitle}>Disclaimer</Text>
            <Ionicons name="chevron-forward-outline" size={width * 0.04} />
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.btn} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={width * 0.06} color="red" />
          <Text style={styles.btntext}>Logout</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.btn}
          onPress={() => setModalVisible(true)}
        >
          <Ionicons name="log-out-outline" size={width * 0.06} color="red" />
          <Text style={styles.btntext}>Delete Account</Text>
        </TouchableOpacity>

        {/* Password Modal */}
        <Modal
          visible={modalVisible}
          animationType="slide"
          transparent
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalBackground}>
            <View style={styles.modalContainer}>
              <Text style={styles.modalTitle}>Enter your password</Text>
             <View style={styles.passwordContainer}>
                <TextInput
                  placeholder="Password"
                  secureTextEntry={!showPassword}
                  value={password}
                  onChangeText={setPassword}
                 style={styles.passwordInput}
                />
                <TouchableOpacity
                style={styles.eyeIcon}
                  onPress={() => setShowPassword((prev) => !prev)}
                >
                  <Ionicons
                    name={showPassword ? "eye-off-outline" : "eye-outline"}
                    size={24}
                    color="gray"
                  />
                </TouchableOpacity>
              </View>
              <TouchableOpacity
                style={styles.confirmButton}
                onPress={handleDelete}
              >
                <Text style={styles.confirmText}>Confirm Delete</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </SafeAreaView>
    </ScrollView>
  );
};

export default Profile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: width * 0.05,
  },
  title: {
    fontSize: width * 0.06,
    fontWeight: "bold",
  },
  info: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: width * 0.05,
  },
  img: {
    height: width * 0.15,
    width: width * 0.15,
    borderRadius: (width * 0.15) / 2,
  },
  userinfo: {
    marginLeft: width * 0.03,
  },
  username: {
    fontSize: width * 0.045,
    fontWeight: "bold",
  },
  useremail: {
    color: "gray",
    fontSize: width * 0.035,
  },
  editinfo: {
    flexDirection: "row",
    backgroundColor: "white",
    width: "100%",
    height: width * 0.15,
    marginTop: width * 0.05,
    borderRadius: 10,
    alignItems: "center",
    padding: width * 0.03,
  },
  usertitle: {
    fontSize: width * 0.04,
    fontWeight: "500",
    padding: width * 0.02,
  },
  editcontainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginLeft: width * 0.02,
    paddingRight: width * 0.03,
  },
  btn: {
    flexDirection: "row",
    width: "100%",
    marginTop: width * 0.05,
    backgroundColor: "white",
    height: width * 0.12,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
    padding: width * 0.03,
  },
  btntext: {
    fontSize: width * 0.045,
    fontWeight: "500",
    color: "red",
    marginLeft: width * 0.02,
  },
  modalBackground: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContainer: {
    width: "80%",
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 8,
    marginBottom: 15,
  },
  confirmButton: {
    backgroundColor: "red",
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
  },
  confirmText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "bold",
  },
  cancelButton: {
    padding: 12,
    borderRadius: 8,
  },
  cancelText: {
    textAlign: "center",
    color: "blue",
  },
  passwordContainer: {
  width: "100%",
  position: "relative",
  marginVertical: 10,
},

passwordInput: {
  width: "100%",
  paddingVertical: 10,
  paddingHorizontal: 40, // add right padding to make space for eye icon
  borderWidth: 1,
  borderColor: "#ccc",
  borderRadius: 8,
},

eyeIcon: {
  position: "absolute",
  right: 10,
  top: "50%",
  transform: [{ translateY: -12 }], // center icon vertically
},

});
