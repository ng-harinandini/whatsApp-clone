import { Tabs } from "expo-router";

export default function TabsLayout() {
 
  return (
    <Tabs>
      <Tabs.Screen name="index" options={{ title: "Chats" }} />
      <Tabs.Screen name="status" options={{ title: "Status" }} />
      <Tabs.Screen name="channels" options={{ title: "Channel" }} />
      <Tabs.Screen name="calls" options={{ title: "Calls" }} />
    </Tabs>
  );
}
