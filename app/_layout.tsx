import { UserProvider } from "@/providers/UserContextProvider";
import { Slot } from "expo-router";
import { StatusBar } from "react-native";

export default function RootLayout() {
  return (
    <UserProvider>
      <StatusBar />
      <Slot />
    </UserProvider>
  );
}
