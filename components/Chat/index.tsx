import { useUser } from "@/providers/UserContextProvider";
import { useSocket } from "@/providers/WebSocketProvider";
import axiosInstance from "@/utils/axiosInstance";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as ImagePicker from "expo-image-picker";
import { useLocalSearchParams, useNavigation, useRouter } from "expo-router";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { View } from "react-native";
import ChatInput from "./ChatInput";
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
  const router = useRouter();
  const { socket } = useSocket();
  const scrollRef = useRef<any>(null);
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
  };

  useLayoutEffect(() => {
    if (currentChat?.name) {
      navigation.setOptions({
        title: currentChat.name,
      });
    }
  }, [currentChat]);

  useEffect(() => {
    // Scroll to end when messages update
    setTimeout(() => {
      scrollRef.current?.scrollToEnd?.({ animated: true });
    }, 100);
  }, [messages]);

  useEffect(() => {
    if (!socket || !currentChat?._id) return;

    const handleReceiveMessage = (msg: any) => {
      if (msg.senderId !== currentChat?._id) return;

      socket.emit("message_delivered", {
        messageId: msg._id,
      });

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

  const handleCamera = () => {
    router.push("/(protected)/camera");
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
    <View style={styles.container}>
      <PreviousChats messages={messages} scrollRef={scrollRef} />

      <ChatInput
        message={message}
        setMessage={setMessage}
        sendMessage={sendMessage}
        setShowEmojiPicker={setShowEmojiPicker}
        currentChatId={currentChat?._id}
      />

      <EmojiPicker
        showEmojiPicker={showEmojiPicker}
        setShowEmojiPicker={setShowEmojiPicker}
        handleEmojiSelect={handleEmojiSelect}
      />
    </View>
  );
}

export default Chat;
