// import {
//   View,
//   Text,
//   StyleSheet,
//   Animated,
//   Image,
//   Dimensions,
// } from "react-native";
// import { useEffect, useRef } from "react";
// import { useRouter } from "expo-router";

// import { onAuthStateChanged } from "firebase/auth";
// import { auth } from "@/firebase/firebaseConfig";

// const { width } = Dimensions.get("window");

// export default function SplashScreen() {
//   const fadeAnim = useRef(new Animated.Value(0)).current;
//   const scaleAnim = useRef(new Animated.Value(0.5)).current;
//   const router = useRouter();

//   useEffect(() => {
//     Animated.parallel([
//       Animated.timing(fadeAnim, {
//         toValue: 1,
//         duration: 1000,
//         useNativeDriver: true,
//       }),
//       Animated.spring(scaleAnim, {
//         toValue: 1,
//         tension: 10,
//         friction: 2,
//         useNativeDriver: true,
//       }),
//     ]).start();

//     const unsubscribe = onAuthStateChanged(auth, (user) => {
//       if (user) {
//         router.replace("/tabs/home");
//       } else {
//         router.replace("/login");
//       }
//     });

//     return () => unsubscribe();
//   }, []);

//   return (
//     <View style={styles.container}>
//       <Animated.View
//         style={[
//           styles.iconContainer,
//           {
//             opacity: fadeAnim,
//             transform: [{ scale: scaleAnim }],
//           },
//         ]}
//       >
//         <Image
//           source={require("../assets/images/logo.png")}
//           style={{ width: width * 0.6, height: width * 0.6 }}
//         />
//         <Text style={styles.appName}>Wallet Diary</Text>
//       </Animated.View>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "white",
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   iconContainer: {
//     alignItems: "center",
//   },
//   appName: {
//     color: "#2d8bef",
//     fontSize: width * 0.08,
//     fontWeight: "bold",
//     marginTop: 10,
//     letterSpacing: 1,
//   },
// });


// import {
//   View,
//   Text,
//   StyleSheet,
//   Animated,
//   Image,
//   Dimensions,
// } from "react-native";
// import { useEffect, useRef, useState } from "react";
// import { useRouter } from "expo-router";

// import { onAuthStateChanged } from "firebase/auth";
// import { auth } from "@/firebase/firebaseConfig";

// const { width } = Dimensions.get("window");

// export default function SplashScreen() {
//   const fadeAnim = useRef(new Animated.Value(0)).current;
//   const scaleAnim = useRef(new Animated.Value(0.5)).current;
//   const router = useRouter();

//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     // Run animation
//     Animated.parallel([
//       Animated.timing(fadeAnim, {
//         toValue: 1,
//         duration: 1000,
//         useNativeDriver: true,
//       }),
//       Animated.spring(scaleAnim, {
//         toValue: 1,
//         tension: 10,
//         friction: 2,
//         useNativeDriver: true,
//       }),
//     ]).start();

//     // Wait for Firebase auth state
//     const unsubscribe = onAuthStateChanged(auth, (user) => {
//       if (user) {
//         router.replace("/tabs/home");
//       } else {
//         router.replace("/login");
//       }
//       setLoading(false);
//     });

//     return () => unsubscribe();
//   }, []);

//   // Keep splash visible until loading finishes
//   if (loading) {
//     return (
//       <View style={styles.container}>
//         <Animated.View
//           style={[
//             styles.iconContainer,
//             {
//               opacity: fadeAnim,
//               transform: [{ scale: scaleAnim }],
//             },
//           ]}
//         >
//           <Image
//             source={require("../assets/images/logo.png")}
//             style={{ width: width * 0.6, height: width * 0.6 }}
//           />
//           <Text style={styles.appName}>Wallet Diary</Text>
//         </Animated.View>
//       </View>
//     );
//   }

//   return null; // once routed, nothing to show here
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "white",
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   iconContainer: {
//     alignItems: "center",
//   },
//   appName: {
//     color: "#2d8bef",
//     fontSize: width * 0.08,
//     fontWeight: "bold",
//     marginTop: 10,
//     letterSpacing: 1,
//   },
// });

import {
  View,
  Text,
  StyleSheet,
  Animated,
  Image,
  Dimensions,
  StatusBar,
} from "react-native";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "expo-router";

import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/firebase/firebaseConfig";

const { width } = Dimensions.get("window");

export default function SplashScreen() {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.5)).current;
  const router = useRouter();

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Run logo fade + scale animation
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 10,
        friction: 2,
        useNativeDriver: true,
      }),
    ]).start();

    // Wait for Firebase auth state
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      // Small delay to let animation finish smoothly
      setTimeout(() => {
        if (user) {
          router.replace("/tabs/home");
        } else {
          router.replace("/login");
        }
        setLoading(false);
      }, 600); // 0.6s delay
    });

    return () => unsubscribe();
  }, []);

  // Keep splash visible while checking auth
  if (loading) {
    return (
      <View style={styles.container}>
       <StatusBar backgroundColor="black" barStyle="light-content" />
        <Animated.View
          style={[
            styles.iconContainer,
            {
              opacity: fadeAnim,
              transform: [{ scale: scaleAnim }],
            },
          ]}
        >
          <Image
            source={require("../assets/images/logo.png")}
            style={{ width: width * 0.6, height: width * 0.6 }}
          />
          <Text style={styles.appName}>Wallet Diary</Text>
        </Animated.View>
      </View>
    );
  }

  return null; // Once routed, render nothing
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white", // ✅ match login background
    justifyContent: "center",
    alignItems: "center",
  },
  iconContainer: {
    alignItems: "center",
  },
  appName: {
    color: "#2d8bef",
    fontSize: width * 0.08,
    fontWeight: "bold",
    marginTop: 10,
    letterSpacing: 1,
  },
});
