import { FontAwesome6, Ionicons, MaterialIcons } from "@expo/vector-icons";
import { KeyboardAvoiderView } from "@good-react-native/keyboard-avoider";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import React from "react";
import { TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import styles from "./styles";

type ChatInputProps = {
  currentChatId: string;
  message: string;
  setMessage: React.Dispatch<React.SetStateAction<string>>;
  sendMessage: () => void;
  setShowEmojiPicker: React.Dispatch<React.SetStateAction<boolean>>;
};

function ChatInput({
  currentChatId,
  setShowEmojiPicker,
  message,
  setMessage,
  sendMessage,
}: ChatInputProps) {
  const router = useRouter();
  const handleLoadFromGallery = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status !== "granted") {
      alert("Media library permission is required");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      // sendMessage(result.assets[0].uri);
    }
  };

  const handleCamera = () => {
    router.push(`/(protected)/camera?id=${currentChatId}`);
  };

  return (
    <KeyboardAvoiderView avoidMode="whole-view" extraSpace={0}>
      <SafeAreaView edges={["bottom"]}>
        <View style={styles.inputBar}>
          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => setShowEmojiPicker(true)}
          >
            <FontAwesome6 name="face-smile" size={24} color="#667781" />
          </TouchableOpacity>

          <View style={styles.inputContainer}>
            <TextInput
              style={styles.textInput}
              placeholder="Message"
              placeholderTextColor="#8696A0"
              value={message}
              onChangeText={setMessage}
              multiline
            />
            <TouchableOpacity
              style={styles.attachButton}
              onPress={handleLoadFromGallery}
            >
              <MaterialIcons name="attachment" size={24} color="#667781" />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.attachButton}
              onPress={handleCamera}
            >
              <Ionicons name="camera" size={22} color="#667781" />
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={styles.sendButton}
            onPress={() => sendMessage()}
          >
            <MaterialIcons name="send" size={24} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </KeyboardAvoiderView>
  );
}

export default ChatInput;
