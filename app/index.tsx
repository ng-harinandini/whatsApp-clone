import AsyncStorage from "@react-native-async-storage/async-storage";
import { Redirect } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";

export default function Entry() {
  const [isVerified, setIsVerified] = useState<boolean | null>(null);

  useEffect(() => {
    AsyncStorage.getItem("isVerified").then((val) => {
      setIsVerified(val === "true");
    });
  }, []);

  if (isVerified === null) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator />
      </View>
    );
  }

  return isVerified ? (
    <Redirect href="/(protected)/(tabs)" />
  ) : (
    <Redirect href="/(public)" />
  );
}
