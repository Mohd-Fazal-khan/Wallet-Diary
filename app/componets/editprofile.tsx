import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  Alert,
  SafeAreaView,
  ScrollView,
  TextInput,
  ActivityIndicator,
  Dimensions,
  StatusBar,
} from "react-native";
import React, { useEffect, useState } from "react";
import * as ImagePicker from "expo-image-picker";
import { auth, db } from "@/firebase/firebaseConfig";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { useRouter } from "expo-router";
import { updateProfile } from "firebase/auth";
import { Ionicons } from "@expo/vector-icons";
import axios from "axios";
import NavigationBarManager from "./NavigationBarManager";
import { NetworkProvider } from "../utils/NetworkProvider";

const { width } = Dimensions.get("window");

const Editprofile = () => {
  const [profileImage, setProfileImage] = useState(null);
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const user = auth.currentUser;

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        if (!user) return;

        const userDocRef = doc(db, "users", user.uid);
        const userSnapshot = await getDoc(userDocRef);

        if (userSnapshot.exists()) {
          const data = userSnapshot.data();
          setUsername(data.username || ""); // ✅ Correct Firestore field
          setProfileImage(data.profileImage || null);
        }
      } catch (error) {
        console.error("Error fetching user info:", error);
      }
    };

    fetchUserInfo();
  }, [user]);

  const uploadImageToCloudinary = async (imageUri) => {
    const formData = new FormData();
    formData.append("file", {
      uri: imageUri,
      type: "image/jpeg",
      name: "profile.jpg",
    });
    formData.append("upload_preset", "unsigned_preset");
    formData.append("cloud_name", "dhsvjvgec");

    try {
      const response = await axios.post(
        "https://api.cloudinary.com/v1_1/dhsvjvgec/image/upload",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      return response.data.secure_url;
    } catch (error) {
      console.error("Cloudinary upload error:", error);
      throw error;
    }
  };

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permission Required",
        "Permission to access gallery is needed!"
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      try {
        setLoading(true);
        const uploadUrl = await uploadImageToCloudinary(result.assets[0].uri);
        setProfileImage(uploadUrl);
        const userDocRef = doc(db, "users", user.uid);
        await updateDoc(userDocRef, { profileImage: uploadUrl });
        Alert.alert("Success", "Profile image updated!");
      } catch (error) {
        Alert.alert("Upload Failed", "Image upload failed.");
      } finally {
        setLoading(false);
      }
    }
  };

  const handleUpdate = async () => {
    try {
      if (!user) return;
      if (username.trim() === "") {
        Alert.alert("Validation Error", "Username cannot be empty.");
        return;
      }

      setLoading(true);

      await updateProfile(user, { displayName: username });
      const userDocRef = doc(db, "users", user.uid);
      await updateDoc(userDocRef, { username: username }); // ✅ Update Firestore username

      Alert.alert("Success", "Profile updated successfully!");
      router.replace("/tabs/home");
    } catch (error) {
      Alert.alert("Error", "Failed to update profile.");
      console.error("Update error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <NetworkProvider>
      <SafeAreaView style={{ flex: 1, backgroundColor: "#f0f4f8" }}>
       <StatusBar backgroundColor="black" barStyle="light-content" />   
        <NavigationBarManager />
        <ScrollView
          contentContainerStyle={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            padding: width * 0.05,
          }}
        >
          <View style={styles.card}>
            <TouchableOpacity onPress={pickImage} style={styles.imageContainer}>
              <Image
                style={styles.img}
                source={
                  profileImage
                    ? { uri: profileImage }
                    : require("../../assets/images/user.png")
                }
              />
              <View style={styles.cameraIcon}>
                <Ionicons name="camera" size={width * 0.05} color="#ffffff" />
              </View>
            </TouchableOpacity>

            <Text style={styles.title}>Edit Profile</Text>

            <Text style={styles.label}>Username</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your username"
              value={username}
              onChangeText={setUsername}
            />

            <Text style={styles.label}>Email (Not Editable)</Text>
            <Text style={styles.emailField}>{user?.email}</Text>

            <TouchableOpacity
              style={styles.saveButton}
              onPress={handleUpdate}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text style={styles.saveText}>Save Changes</Text>
              )}
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    </NetworkProvider>
  );
};

export default Editprofile;

const styles = StyleSheet.create({
  card: {
    width: "100%",
    backgroundColor: "#ffffff",
    borderRadius: 20,
    padding: width * 0.05,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
    marginBottom: width * 0.1,
  },
  imageContainer: {
    alignSelf: "center",
    position: "relative",
  },
  img: {
    height: width * 0.35,
    width: width * 0.35,
    borderRadius: (width * 0.35) / 2,
    marginVertical: width * 0.05,
    borderWidth: 3,
    borderColor: "#2d8bef",
  },
  cameraIcon: {
    position: "absolute",
    bottom: width * 0.03,
    right: width * 0.02,
    backgroundColor: "#2d8bef",
    borderRadius: 20,
    padding: width * 0.025,
    borderWidth: 1,
    borderColor: "#fff",
  },
  title: {
    fontSize: width * 0.065,
    fontWeight: "bold",
    color: "#2d8bef",
    marginBottom: width * 0.07,
    textAlign: "center",
  },
  label: {
    width: "100%",
    marginTop: width * 0.04,
    marginBottom: width * 0.02,
    fontWeight: "600",
    fontSize: width * 0.045,
    color: "#555",
  },
  input: {
    width: "100%",
    borderColor: "#ddd",
    borderWidth: 1,
    borderRadius: 12,
    padding: width * 0.035,
    backgroundColor: "#f9f9f9",
    fontSize: width * 0.04,
  },
  emailField: {
    width: "100%",
    padding: width * 0.035,
    backgroundColor: "#eaeaea",
    color: "#666",
    borderRadius: 12,
    fontSize: width * 0.04,
  },
  saveButton: {
    backgroundColor: "#2d8bef",
    padding: width * 0.045,
    marginTop: width * 0.07,
    width: "100%",
    borderRadius: 12,
    alignItems: "center",
    shadowColor: "#2d8bef",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  saveText: {
    color: "#ffffff",
    fontWeight: "bold",
    fontSize: width * 0.045,
  },
});
