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

const styles = StyleSheet.create({
  offlineBanner: {
    backgroundColor: "red",
    padding: 10,
    alignItems: "center",
  },
  offlineText: {
    color: "white",
    fontWeight: "bold",
  },
});
