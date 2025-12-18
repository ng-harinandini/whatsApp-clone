import { Slot } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

export default function PublicLayout() {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Slot />
    </SafeAreaView>
  );
}
