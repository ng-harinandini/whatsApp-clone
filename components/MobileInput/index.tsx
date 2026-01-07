import { countries } from "@/utils/countriesData";
import AntDesign from "@expo/vector-icons/AntDesign";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import styles from "./styles";

type Country = {
  name: string;
  code: string;
  flag: string;
};

function MobileInput() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [selectedCountry, setSelectedCountry] = useState<Country>(countries[0]);
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [error, setError] = useState<string>("");

  const handleCountrySelect = (country: Country) => {
    setSelectedCountry(country);
    setIsOpen(false);
  };

  const handleNext = async () => {
    await AsyncStorage.setItem(
      "mobileNumber",
      `${selectedCountry.code} ${phoneNumber}`
    );
    router.push("/(public)/otp-input");
  };

  const handlePhoneNumberChange = (text: string) => {
    setPhoneNumber(text);
    if (text.length < 10) setError("Number must be at least 10 digits");
    if (text.length > 10) setError("Number must be 10 digits");
    else setError("");
  };

  return (
    <>
      <TouchableOpacity
        style={styles.closeButton}
        onPress={() => router.push("/(public)")}
      >
        <AntDesign name="close" size={20} color="black" />
      </TouchableOpacity>
      <View style={styles.container}>
        <Text style={styles.title}>Enter your phone number</Text>
        <Text style={styles.subtitle}>
          WhatsApp will need to verify your phone number. Carrier charges may
          apply.{" "}
        </Text>
        <View style={styles.dropdownContainer}>
          <TouchableOpacity
            style={styles.dropdownButton}
            onPress={() => setIsOpen(!isOpen)}
          >
            <View style={styles.dropdownContent}>
              <Text style={styles.flag}>{selectedCountry.flag}</Text>
              <Text style={styles.countryName}>{selectedCountry.name}</Text>
            </View>
            <Text style={styles.chevron}>{isOpen ? "▲" : "▼"}</Text>
          </TouchableOpacity>
          {isOpen && (
            <View style={styles.dropdownList}>
              <ScrollView style={styles.scrollView}>
                {countries.map((country, index) => (
                  <TouchableOpacity
                    key={index}
                    style={styles.countryItem}
                    onPress={() => handleCountrySelect(country)}
                  >
                    <Text style={styles.flag}>{country.flag}</Text>
                    <Text style={styles.countryItemName}>{country.name}</Text>
                    <Text style={styles.countryCode}>{country.code}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          )}
        </View>
        <View style={styles.phoneInputContainer}>
          <View style={styles.codeInput}>
            <TextInput
              value={selectedCountry.code}
              editable={false}
              style={styles.codeText}
            />
          </View>
          <View style={styles.numberInput}>
            <TextInput
              value={phoneNumber}
              onChangeText={handlePhoneNumberChange}
              keyboardType="phone-pad"
              style={styles.numberText}
            />
          </View>
        </View>
        {error && <Text style={styles.error}>{error}</Text>}

        <TouchableOpacity
          style={[styles.nextButton, { opacity: phoneNumber ? 1 : 0.5 }]}
          disabled={!phoneNumber || !!error}
          onPress={handleNext}
        >
          <Text style={styles.nextButtonText}>Next</Text>
        </TouchableOpacity>
      </View>
    </>
  );
}

export default MobileInput;
