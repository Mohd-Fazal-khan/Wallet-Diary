
import * as NavigationBar from "expo-navigation-bar";
import { useIsFocused } from "@react-navigation/native";
import { useEffect } from "react";

export default function NavigationBarManager() {
  const isFocused = useIsFocused();

  useEffect(() => {
    if (isFocused) {
      NavigationBar.setBackgroundColorAsync("#000000");
      NavigationBar.setButtonStyleAsync("light");
    }
  }, [isFocused]);

  return null; 
}