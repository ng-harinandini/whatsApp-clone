import { SocketProvider } from "@/providers/WebSocketProvider";
import { Stack } from "expo-router";
import React from "react";

function ProtectedLayout() {
  return (
    <SocketProvider>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="new-chat"
          options={{
            title: "Select Contact",
          }}
        />
        <Stack.Screen name="chat/[uuid]" />
      </Stack>
    </SocketProvider>
  );
}

export default ProtectedLayout;
