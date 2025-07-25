import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  Alert,
  Dimensions,
} from "react-native";
import React, { useEffect, useState } from "react";
import { auth, db } from "@/firebase/firebaseConfig";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { SafeAreaView } from "react-native-safe-area-context";
import NavigationBarManager from "../componets/NavigationBarManager";

const { width } = Dimensions.get("window");

const Profile = () => {
  const router = useRouter();

  const [username, setUsername] = useState(null);
  const [email, setEmail] = useState(null);
  const [profileImage, setProfileImage] = useState(null);

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

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <NavigationBarManager />
      <View style={styles.container}>
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

        <TouchableOpacity style={styles.btn} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={width * 0.06} color="red" />
          <Text style={styles.btntext}>Logout</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
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
});
