import CustomButton from "@/components/CustomButton";
import { useRouter } from "expo-router";
import { Image, StyleSheet, Text, View } from "react-native";

const getStartedImage = require("@/assets/images/get-started.jpg");
export default function GetStartedScreen() {
  const router = useRouter();
  return (
    <View style={styles.container}>
      <Text style={styles.welcomeText}>Welcome to WhatsApp</Text>
      <View style={styles.imageWrapper}>
        <Image source={getStartedImage} style={{ width: 380, height: 400 }} />
      </View>
      <CustomButton
        btnText="AGREE AND CONTINUE"
        onPress={() => router.replace("/(public)/mobile-input")}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    paddingTop: 60,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#25D366",
  },
  imageWrapper: {
    paddingTop: 80,
  },
});
