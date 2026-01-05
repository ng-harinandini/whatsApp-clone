import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { SafeAreaView } from "react-native-safe-area-context";
import First from ".";
import Second from "./second";
import Third from "./third";

const Tab = createMaterialTopTabNavigator();
export default function TopTabsLayout() {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Tab.Navigator
        screenOptions={{
          tabBarIndicatorStyle: { backgroundColor: "#25D366" },
          tabBarLabelStyle: { fontWeight: "600" },
        }}
      >
        <Tab.Screen
          name="index"
          component={First}
          options={{ title: "First" }}
        />
        <Tab.Screen
          name="second"
          component={Second}
          options={{ title: "Second" }}
        />
        <Tab.Screen
          name="third"
          component={Third}
          options={{ title: "Third" }}
        />
      </Tab.Navigator>
    </SafeAreaView>
  );
}
