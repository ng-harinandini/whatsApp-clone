import { useRouter } from "expo-router";
import React from "react";
import { Text, View } from "react-native";

const ChannelsScreen = () => {
  const router = useRouter();
  return (
    <View>
      <Text>Channels</Text>
      <Text onPress={() => router.push("/(protected)/(top-tabs)")}>
        Go to Top Navigation Bar
      </Text>
      <Text onPress={() => router.push("/(protected)/(drawer)")}>
        Go to Drawer Navigation
      </Text>
    </View>
  );
};

export default ChannelsScreen;
