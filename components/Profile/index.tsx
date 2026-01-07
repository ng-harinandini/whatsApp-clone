import { useUser } from "@/providers/UserContextProvider";
import axiosInstance from "@/utils/axiosInstance";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import styles from "./styles";

function ProfileScreen() {
  const router = useRouter();
  const { setUser } = useUser();
  const [name, setName] = useState("John Doe");
  const [about, setAbout] = useState("Hey there! I am using WhatsApp");
  const [isEditingName, setIsEditingName] = useState(false);
  const [isEditingAbout, setIsEditingAbout] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleContinue = async () => {
    if (!name.trim()) {
      Alert.alert("Error", "Name cannot be empty");
      return;
    }

    if (!about.trim()) {
      Alert.alert("Error", "About cannot be empty");
      return;
    }
    setLoading(true);
    const phoneNumber = (await AsyncStorage.getItem("mobileNumber")) || "";
    const [phoneCode, phone] = phoneNumber.split(" ");
    const userData = { phoneCode, phone, name: name, status: about };
    try {
      const response = await axiosInstance.post("/users", userData);
      if (response?.status === 201) {
        setUser(response.data);
        await AsyncStorage.setItem("isVerified", "true");
        await AsyncStorage.setItem("userData", JSON.stringify(response.data));
        router.replace("/(protected)/(tabs)");
      }
    } catch (error: any) {
      if (error?.response?.status === 409) {
        Alert.alert("User Exists", error?.response.data.message);
      } else {
        Alert.alert("Error", "Unable to create user");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Profile</Text>
      </View>

      {/* Profile Picture Section */}
      <View style={styles.profileSection}>
        <View style={styles.avatarContainer}>
          <View style={styles.avatar}>
            <Ionicons name="person" size={60} color="#fff" />
          </View>
        </View>
      </View>

      {/* Name Section */}
      <View style={styles.infoSection}>
        <View style={styles.infoRow}>
          <View style={styles.infoLeft}>
            <Text style={styles.infoLabel}>Name</Text>
            {isEditingName ? (
              <TextInput
                style={styles.infoInput}
                value={name}
                onChangeText={setName}
                autoFocus
                maxLength={25}
                placeholder="Enter your name"
              />
            ) : (
              <Text style={styles.infoValue}>{name}</Text>
            )}
          </View>
          <TouchableOpacity onPress={() => setIsEditingName(!isEditingName)}>
            {isEditingName ? (
              <Ionicons name="checkmark" size={24} color="#00a884" />
            ) : (
              <MaterialIcons name="edit" size={20} color="#00a884" />
            )}
          </TouchableOpacity>
        </View>
        <Text style={styles.infoHint}>
          This is not your username or PIN. This name will be visible to your
          WhatsApp contacts.
        </Text>
      </View>

      {/* About Section */}
      <View style={styles.infoSection}>
        <View style={styles.infoRow}>
          <View style={styles.infoLeft}>
            <Text style={styles.infoLabel}>About</Text>
            {isEditingAbout ? (
              <TextInput
                style={styles.infoInput}
                value={about}
                onChangeText={setAbout}
                autoFocus
                maxLength={139}
                placeholder="Enter your about"
                multiline
              />
            ) : (
              <Text style={styles.infoValue}>{about}</Text>
            )}
          </View>
          <TouchableOpacity onPress={() => setIsEditingAbout(!isEditingAbout)}>
            {isEditingAbout ? (
              <Ionicons name="checkmark" size={24} color="#00a884" />
            ) : (
              <MaterialIcons name="edit" size={20} color="#00a884" />
            )}
          </TouchableOpacity>
        </View>
      </View>

      {/* Continue Button */}
      <Pressable
        onPress={handleContinue}
        style={[styles.button, loading && styles.buttonDisabled]}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Continue</Text>
        )}
      </Pressable>
    </ScrollView>
  );
}

export default ProfileScreen;
