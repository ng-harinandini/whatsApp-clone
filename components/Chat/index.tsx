import { useUser } from "@/providers/UserContextProvider";
import { useSocket } from "@/providers/WebSocketProvider";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as ImagePicker from "expo-image-picker";
import { useLocalSearchParams, useNavigation } from "expo-router";
import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import EmojiPicker from "./EmojiPicker";
import styles from "./styles";

type MessageType = {
  id: number;
  text: string;
  sent: boolean;
  time: string;
};

function Chat() {
  const params = useLocalSearchParams<{ uuid: string }>();
  const navigation = useNavigation();
  const { user } = useUser();
  const { socket } = useSocket();
  const scrollRef = useRef<ScrollView>(null);
  const [contacts, setContacts] = useState<any[]>([]);

  const currentChat = contacts.find((contact) => contact._id === params.uuid);
  const [message, setMessage] = useState<string | "">("");
  const [showEmojiPicker, setShowEmojiPicker] = useState<boolean>(false);

  const [messages, setMessages] = useState<MessageType[]>([]);

  useEffect(() => {
    const loadContacts = async () => {
      const storedContacts = await AsyncStorage.getItem("contacts");
      if (storedContacts) {
        setContacts(JSON.parse(storedContacts));
      }
    };

    loadContacts();
  }, []);

  useLayoutEffect(() => {
    if (currentChat?.name) {
      navigation.setOptions({
        title: currentChat.name,
      });
    }
  }, [currentChat]);

  useEffect(() => {
    scrollRef.current?.scrollToEnd({ animated: true });
  }, [messages]);

  useEffect(() => {
    if (!socket) return;

    socket.on("receiveMessage", (data) => {
      setMessages((prev) => [
        ...prev,
        {
          id: prev.length + 1,
          text: data.text,
          sent: false,
          time: new Date().toLocaleTimeString("en-US", {
            hour: "numeric",
            minute: "2-digit",
          }),
        },
      ]);
    });
  }, [socket]);

  if (!currentChat) {
    return null;
  }

  const sendMessage = () => {
    if (message.trim()) {
      const newMessage = {
        id: messages.length + 1,
        text: message,
        sent: true,
        time: new Date().toLocaleTimeString("en-US", {
          hour: "numeric",
          minute: "2-digit",
        }),
      };

      socket?.emit("sendMessage", {
        receiverId: currentChat._id,
        text: newMessage.text,
        senderId: user?._id,
      });

      setMessages([...messages, newMessage]);
      setMessage("");
    }
  };

  const handleEmojiSelect = (emoji: string) => {
    setMessage(message + emoji);
  };

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

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={styles.container}
    >
      {/* Messages Area */}
      <ScrollView
        ref={scrollRef}
        style={styles.messagesContainer}
        contentContainerStyle={styles.messagesContent}
        keyboardShouldPersistTaps="handled"
      >
        {messages.map((msg) => (
          <View
            key={msg.id}
            style={[
              styles.messageBubble,
              msg.sent ? styles.sentMessage : styles.receivedMessage,
            ]}
          >
            <Text style={styles.messageText}>{msg.text}</Text>
            <Text style={styles.messageTime}>{msg.time}</Text>
          </View>
        ))}
      </ScrollView>

      {/* Input Bar */}
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
        </View>

        <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
          <MaterialIcons name="send" size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
      <EmojiPicker
        showEmojiPicker={showEmojiPicker}
        setShowEmojiPicker={setShowEmojiPicker}
        handleEmojiSelect={handleEmojiSelect}
      />
    </KeyboardAvoidingView>
  );
}

export default Chat;
