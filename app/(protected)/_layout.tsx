import { SocketProvider } from "@/providers/WebSocketProvider";
import { Stack } from "expo-router";
import React from "react";
import { KeyboardProvider } from "react-native-keyboard-controller";
import { SafeAreaProvider } from "react-native-safe-area-context";

function ProtectedLayout() {
  return (
    <SocketProvider>
      <KeyboardProvider>
        <SafeAreaProvider>
          <Stack>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen
              name="new-chat"
              options={{
                title: "Select Contact",
              }}
            />
            <Stack.Screen name="chat/[uuid]" />
            <Stack.Screen name="(top-tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="(drawer)" options={{ headerShown: false }} />
            <Stack.Screen name="camera" options={{ headerShown: false }} />
          </Stack>
        </SafeAreaProvider>
      </KeyboardProvider>
    </SocketProvider>
  );
}

export default ProtectedLayout;
