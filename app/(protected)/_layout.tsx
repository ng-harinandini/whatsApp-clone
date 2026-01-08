import { SocketProvider } from "@/providers/WebSocketProvider";
import { KeyboardAvoiderProvider } from "@good-react-native/keyboard-avoider";
import { Stack } from "expo-router";
import React from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";

function ProtectedLayout() {
  return (
    <SocketProvider>
      <KeyboardAvoiderProvider>
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
      </KeyboardAvoiderProvider>
    </SocketProvider>
  );
}

export default ProtectedLayout;
