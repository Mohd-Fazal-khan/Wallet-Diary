import { initializeApp } from "firebase/app";
import {
  initializeAuth,
  getReactNativePersistence,
} from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyA1nVrV5TcLwyMZJP1o1gTxQQmsK8aU4BQ",
  authDomain: "expensive-fc90d.firebaseapp.com",
  projectId: "expensive-fc90d",
  storageBucket: "expensive-fc90d.firebasestorage.app",
  messagingSenderId: "1090336931308",
  appId: "1:1090336931308:web:e8ba0e91a4323df7c5d4c9",
  measurementId: "G-50W23HC232"
};


const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const analytics = getAnalytics(app);

const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});


export { auth ,db };

