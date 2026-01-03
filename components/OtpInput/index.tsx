import AsyncStorage from "@react-native-async-storage/async-storage";
import { Link, useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { Alert, Pressable, Text, TextInput, View } from "react-native";
import styles from "./styles";

export default function VerifyOtpScreen() {
  const router = useRouter();
  const inputRefs = useRef<TextInput[]>([]);
  const [otp, setOtp] = useState<string[]>(["", "", "", ""]);
  const [phoneNumber, setPhoneNumber] = useState<string | null>(null);

  useEffect(() => {
    AsyncStorage.getItem("mobileNumber").then((val) => {
      if (val) setPhoneNumber(val);
    });
  }, []);

  const handleTextChange = async (text: string, index: number) => {
    if (!/^\d?$/.test(text)) return;

    const newOtp = [...otp];
    newOtp[index] = text;
    setOtp(newOtp);

    // Move to next input
    if (text && index < otp.length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
    if (index === otp.length - 1 && text) {
      Alert.alert("OTP Verified Successfully!");
      router.push("/(public)/profile");
      // const phoneNumber = (await AsyncStorage.getItem("mobileNumber")) || "";
      // const [phoneCode, phone] = phoneNumber.split(" ");
      // const userData = { phoneCode, phone, name: "Amma" };
      // const response = await axiosInstance.post("/users", userData);
      // if (response?.data) {
      //   setUser(response.data);
      //   await AsyncStorage.setItem("userData", JSON.stringify(response.data));
      //   setTimeout(() => {
      //     router.replace("/(protected)/(tabs)");
      //   }, 1000);
      // }
    }
  };

  const handleKeyPress = (key: string, index: number) => {
    if (key === "Backspace" && index > 0 && otp[index] === "") {
      inputRefs.current[index - 1]?.focus();
      setOtp((prevOtp) => {
        const newOtp = [...prevOtp];
        newOtp[index - 1] = "";
        return newOtp;
      });
    }
  };

  return (
    <View style={styles.container}>
      {/* Title */}
      <Text style={styles.title}>Verify {phoneNumber}</Text>

      {/* Subtitle */}
      <Text style={styles.subtitle}>
        Sent an OTP to
        <Text style={styles.phone}> {phoneNumber}</Text>.{" "}
        <Link href="/(public)/mobile-input" style={{ color: "#25D366" }}>
          Wrong number?
        </Link>
      </Text>

      {/* Code boxes */}
      <View style={styles.codeContainer}>
        {otp.map((digit, index) => {
          return (
            <View
              key={index}
              style={[
                styles.codeBox,
                { borderColor: !!digit ? "#25D366" : "#888" },
              ]}
            >
              <TextInput
                ref={(ref) => {
                  if (ref) inputRefs.current[index] = ref;
                }}
                style={[styles.codeText]}
                value={digit}
                onChangeText={(text) => handleTextChange(text, index)}
                onKeyPress={({ nativeEvent }) =>
                  handleKeyPress(nativeEvent.key, index)
                }
                keyboardType="number-pad"
                maxLength={1}
                autoFocus={index === 0}
                textAlign="center"
              />
            </View>
          );
        })}
      </View>

      <Text style={styles.hint}>Enter 6-digit code</Text>

      {/* Actions */}
      <View style={styles.actions}>
        <Pressable onPress={() => Alert.alert("SMS sent successfully.")}>
          <Text style={styles.link}>Resend SMS</Text>
        </Pressable>
      </View>
    </View>
  );
}
