import { useUser } from "@/providers/UserContextProvider";
import { useSocket } from "@/providers/WebSocketProvider";
import axiosInstance from "@/utils/axiosInstance";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as ImagePicker from "expo-image-picker";
import { useLocalSearchParams, useNavigation } from "expo-router";
import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import EmojiPicker from "./EmojiPicker";
import PreviousChats from "./PreviousChats";
import styles from "./styles";

type MessageType = {
  _id: string;
  chatId: string;
  senderId: string;
  receiverId: string;
  text: string;
  sent: boolean;
  createdAt: string;
};

function Chat() {
  const params = useLocalSearchParams<{ uuid: string }>();
  const navigation = useNavigation();
  const { user } = useUser();
  const { socket } = useSocket();
  const scrollRef = useRef<FlatList<MessageType> | null>(null);
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

  useEffect(() => {
    if (currentChat?._id && user?._id) {
      onOpenChat();
    }
  }, [currentChat, user]);

  const onOpenChat = async () => {
    const response = await axiosInstance.get<MessageType[]>(
      `/chats/${user?._id}/${currentChat?._id}/messages`
    );
    const formattedMessages: MessageType[] = response.data.map((msg: any) => ({
      _id: msg._id,
      chatId: msg.chatId,
      senderId: msg.senderId,
      receiverId: msg.receiverId,
      text: msg.text,
      sent: msg.senderId === user?._id,
      createdAt: msg.createdAt,
    }));

    setMessages(formattedMessages);
    // console.log(formattedMessages);
  };

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
    if (!socket || !currentChat?._id) return;

    const handleReceiveMessage = (msg: any) => {
      if (msg.senderId !== currentChat?._id) return;

      setMessages((prev) => [
        ...prev,
        {
          _id: msg._id,
          chatId: msg.chatId,
          senderId: msg.senderId,
          receiverId: msg.receiverId,
          text: msg.text,
          sent: false,
          createdAt: msg.createdAt,
        },
      ]);
    };

    socket.on("receiveMessage", handleReceiveMessage);
    return () => {
      socket.off("receiveMessage", handleReceiveMessage);
    };
  }, [socket, currentChat]);

  if (!currentChat) {
    return null;
  }

  const sendMessage = () => {
    if (message.trim()) {
      const newMessage = {
        _id: Date.now().toString(),
        chatId: "",
        senderId: user?._id!,
        receiverId: currentChat?._id!,
        text: message,
        sent: true,
        createdAt: new Date().toISOString(),
      };

      socket?.emit("sendMessage", {
        tempId: newMessage.createdAt,
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
      behavior="padding"
      keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
      style={styles.container}
    >
      <PreviousChats messages={messages} scrollRef={scrollRef} />

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
