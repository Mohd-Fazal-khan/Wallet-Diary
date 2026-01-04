import React, { createContext, useEffect, useState } from "react";
import NetInfo from "@react-native-community/netinfo";
import { View, Text, StyleSheet } from "react-native";


export const NetworkContext = createContext();

export const NetworkProvider = ({ children }) => {
  const [isConnected, setIsConnected] = useState(true);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsConnected(state.isConnected && state.isInternetReachable);
    });

    return () => unsubscribe();
  }, []);

  return (
    <NetworkContext.Provider value={{ isConnected }}>
      {!isConnected && (
        <View style={styles.offlineBanner}>
          <Text style={styles.offlineText}>No Internet Connection</Text>
        </View>
      )}
      {children}
    </NetworkContext.Provider>
  );
};

// const styles = StyleSheet.create({
//   offlineBanner: {
//     backgroundColor: "red",
//     padding: 10,
//     alignItems: "center",
//   },
//   offlineText: {
//     color: "white",
//     fontWeight: "bold",
//   },
// });

// export const NetworkProvider = ({ children }) => {
//   const [isConnected, setIsConnected] = useState(true);

//   useEffect(() => {
//     const unsubscribe = NetInfo.addEventListener((state) => {
//       setIsConnected(state.isConnected && state.isInternetReachable);
//     });

//     return () => unsubscribe();
//   }, []);

//   return (
//     <NetworkContext.Provider value={{ isConnected }}>
//       <View style={styles.container}>
//         {!isConnected && (
//           <View style={styles.offlineBanner}>
//             <Text style={styles.offlineText}>No Internet Connection</Text>
//           </View>
//         )}
//         {children}
//       </View>
//     </NetworkContext.Provider>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#ffffff", // ✅ prevents black flash
//   },
//   offlineBanner: {
//     backgroundColor: "red",
//     padding: 10,
//     alignItems: "center",
//   },
//   offlineText: {
//     color: "white",
//     fontWeight: "bold",
//   },
// });


// import React, { useState, useEffect, createContext } from "react";
// import { View, Text, StyleSheet } from "react-native";
// import NetInfo from "@react-native-community/netinfo";

// export const NetworkContext = createContext({ isConnected: true });

// export const NetworkProvider = ({ children }) => {
//   const [isConnected, setIsConnected] = useState(true);

//   useEffect(() => {
//     const unsubscribe = NetInfo.addEventListener((state) => {
//       if (state.isConnected != null) {
//         // ✅ Default to true if isInternetReachable is null
//         setIsConnected(state.isConnected && (state.isInternetReachable ?? true));
//       }
//     });

//     return () => unsubscribe();
//   }, []);

//   return (
//     <NetworkContext.Provider value={{ isConnected }}>
//       {children}
//       {!isConnected && (
//         <View style={styles.offlineBanner}>
//           <Text style={styles.offlineText}>No Internet Connection</Text>
//         </View>
//       )}
//     </NetworkContext.Provider>
//   );
// };


const styles = StyleSheet.create({
  offlineBanner: {
    position: "absolute", // ✅ overlay, not block
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: "red",
    padding: 10,
    alignItems: "center",
    zIndex: 1000, // ✅ make sure it’s above tabs
  },
  offlineText: {
    color: "white",
    fontWeight: "bold",
  },
});
