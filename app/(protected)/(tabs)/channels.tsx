import { useRouter } from "expo-router";
import React from "react";
import { Text, View } from "react-native";

const ChannelsScreen = () => {
  const router = useRouter();
  return (
    <View>
      <Text>Channels</Text>
      <Text onPress={() => router.push("/(protected)/(top-tabs)/first")}>
        Go to Top Navigation Bar
      </Text>
    </View>
  );
};

export default ChannelsScreen;
