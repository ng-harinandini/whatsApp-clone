import { Stack } from "expo-router";
import React from "react";

function ProtectedLayout() {
  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen
        name="new-chat"
        options={{
          title: "Select Contact",
        }}
      />
    </Stack>
  );
}

export default ProtectedLayout;
