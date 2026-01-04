import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { StatusBar } from "react-native";
import { NetworkProvider } from '../utils/NetworkProvider'

export default function Layout() {
  return (
    <NetworkProvider>
     <StatusBar backgroundColor="black" barStyle="light-content" />
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: "#2d8bef",
        }}
      >
        <Tabs.Screen
          name="home"
          options={{
            title: "Home",
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="home" size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="transaction"
          options={{
            title: "Transaction",
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="wallet" size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="addexpense"
          options={{
            title: "Add Expense",
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="add-circle" size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="addIncome"
          options={{
            title: "Add Money",
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="cash-outline" size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: "Settings",
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="person-circle" size={size} color={color} />
            ),
          }}
        />
      </Tabs>
    </NetworkProvider>
  );
}
