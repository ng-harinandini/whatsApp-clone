import { Drawer } from "expo-router/drawer";

export default function Layout() {
  return (
    <Drawer
      screenOptions={{
        headerShown: true,
      }}
    >
      <Drawer.Screen name="index" options={{ title: "Home" }} />
      <Drawer.Screen name="test1" options={{ title: "Test 1" }} />
      <Drawer.Screen name="test2" options={{ title: "Test 2" }} />
    </Drawer>
  );
}
