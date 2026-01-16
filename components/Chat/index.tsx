import { useUser } from "@/providers/UserContextProvider";
import { useSocket } from "@/providers/WebSocketProvider";
import axiosInstance from "@/utils/axiosInstance";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useLocalSearchParams, useNavigation } from "expo-router";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Alert, View } from "react-native";
import ChatInput from "./ChatInput";
import EmojiPicker from "./EmojiPicker";
import PreviousChats from "./PreviousChats";
import styles from "./styles";

type MessageStatus = "sent" | "delivered" | "seen";

type MessageType = {
  _id: string;
  chatId: string;
  tempId?: string;
  senderId: string;
  receiverId: string;
  text?: string;
  imageUrl?: string;
  status: MessageStatus;
  createdAt: string;
};

function Chat() {
  const params = useLocalSearchParams<{ uuid: string }>();
  const navigation = useNavigation();
  const { user } = useUser();
  const chatIdRef = useRef("");
  const { socket } = useSocket();
  const scrollRef = useRef<any>(null);
  const [contacts, setContacts] = useState<any[]>([]);
  const messageQueueRef = useRef<any[]>([]);

  const currentChat = contacts.find((contact) => contact._id === params.uuid);
  const [message, setMessage] = useState<string | "">("");
  const [showEmojiPicker, setShowEmojiPicker] = useState<boolean>(false);
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [uploading, setUploading] = useState<boolean>(false);

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

    return () => {
      // Emit chat_closed when component unmounts or chat changes
      if (socket && currentChat?._id) {
        socket.emit("chat_closed");
      }
    };
  }, [currentChat?._id, user?._id]);

  const onOpenChat = async () => {
    try {
      const response = await axiosInstance.get<MessageType[]>(
        `/chats/${user?._id}/${currentChat?._id}/messages`
      );

      const formattedMessages: MessageType[] = response.data.map(
        (msg: any) => ({
          _id: msg._id,
          chatId: msg.chatId,
          senderId: msg.senderId,
          receiverId: msg.receiverId,
          text: msg.text,
          status: msg.status,
          createdAt: msg.createdAt,
        })
      );

      setMessages(formattedMessages);

      // Notify server that chat is opened
      if (socket) {
        socket.emit("chat_opened", { otherUserId: currentChat?._id });
      }

      if (response.data.length > 0) {
        chatIdRef.current = response.data[0].chatId;

        // Check if there are any unread messages from the other user
        const unreadMessages = response.data.filter(
          (msg: any) =>
            msg.senderId === currentChat?._id && msg.status !== "seen"
        );

        // Mark messages as seen if there are unread messages
        if (unreadMessages.length > 0 && socket) {
          const chatId = response.data[0].chatId;
          socket.emit("message_seen", {
            chatId: chatId,
            senderId: currentChat?._id,
            receiverId: user?._id,
          });
          // console.log(`Marking ${unreadMessages.length} messages as seen`);
        }
      }
    } catch (error) {
      console.error("Error opening chat:", error);
    }
  };

  useLayoutEffect(() => {
    if (currentChat?.name) {
      navigation.setOptions({
        title: currentChat.name,
      });
    }
  }, [currentChat]);

  useEffect(() => {
    setTimeout(() => {
      scrollRef.current?.scrollToEnd?.({ animated: true });
    }, 100);
  }, [messages]);

  useEffect(() => {
    if (!socket) return;

    const handleConnect = () => {
      // console.log("Socket connected");

      // Resend queued messages
      if (messageQueueRef.current.length > 0) {
        messageQueueRef.current.forEach((msg) => {
          socket.emit("sendMessage", msg);
        });
        messageQueueRef.current = [];
      }

      // Reopen chat if we were viewing one
      if (currentChat?._id) {
        socket.emit("chat_opened", { otherUserId: currentChat._id });
      }
    };

    const handleDisconnect = () => {
      // console.log("Socket disconnected");

      // Mark all non-sent messages as pending
      setMessages((prev) =>
        prev.map((msg) =>
          msg.senderId === user?._id && msg.status !== "seen"
            ? { ...msg, status: "sent" }
            : msg
        )
      );
    };

    const handleConnectError = (error: any) => {
      // console.error("Socket connection error:", error);
    };

    socket.on("connect", handleConnect);
    socket.on("disconnect", handleDisconnect);
    socket.on("connect_error", handleConnectError);

    return () => {
      socket.off("connect", handleConnect);
      socket.off("disconnect", handleDisconnect);
      socket.off("connect_error", handleConnectError);
    };
  }, [socket, currentChat?._id, user?._id]);

  useEffect(() => {
    if (!socket || !currentChat?._id || !user?._id) return;

    const handleReceiveMessage = (msg: MessageType) => {
      // Only process messages from the current chat
      if (msg.senderId !== currentChat?._id) return;

      if (!chatIdRef.current) {
        chatIdRef.current = msg.chatId;
      }

      setMessages((prev) => {
        // Check if message already exists
        const exists = prev.some(
          (m) => m._id === msg._id || m.tempId === msg.tempId
        );
        if (exists) return prev;

        return [
          ...prev,
          {
            _id: msg._id,
            chatId: msg.chatId,
            senderId: msg.senderId,
            receiverId: msg.receiverId,
            text: msg.text,
            status: msg.status,
            createdAt: msg.createdAt,
          },
        ];
      });

      // Automatically mark as seen since chat is open
      socket.emit("message_seen", {
        chatId: msg.chatId,
        senderId: msg.senderId,
        receiverId: user?._id,
      });

      // console.log("Marked message as seen:", msg._id);
    };

    const handleStatusUpdate = (data: {
      tempId: string;
      messageId: string;
      status: MessageStatus;
    }) => {
      setMessages((prev) =>
        prev.map((msg) => {
          if (msg.tempId === data.tempId) {
            return { ...msg, status: data.status, _id: data.messageId };
          }
          return msg;
        })
      );
    };

    const handleMessagesSeen = ({
      chatId,
      receiverId,
    }: {
      chatId?: string;
      receiverId?: string;
    }) => {
      // console.log("Messages seen event received:", { chatId, receiverId, myId: user?._id });

      setMessages((prev) =>
        prev.map((msg) => {
          // Update messages I sent that were seen by the receiver
          const isMySentMessage = msg.senderId === user?._id;
          const isToThisReceiver =
            msg.receiverId === receiverId ||
            msg.receiverId === currentChat?._id;
          const isInThisChat = chatId ? msg.chatId === chatId : true;
          const notAlreadySeen = msg.status !== "seen";

          if (
            isMySentMessage &&
            isToThisReceiver &&
            isInThisChat &&
            notAlreadySeen
          ) {
            // console.log(`Updating message ${msg._id} to seen`);
            return { ...msg, status: "seen" };
          }
          return msg;
        })
      );
    };

    const handleMessageError = ({
      tempId,
      error,
    }: {
      tempId: string;
      error: string;
    }) => {
      // console.error("Message error:", error);
      // You can show an error indicator in the UI
      setMessages((prev) =>
        prev.map((msg) =>
          msg.tempId === tempId ? { ...msg, status: "sent" } : msg
        )
      );
    };

    socket.on("receiveMessage", handleReceiveMessage);
    socket.on("message_status_update", handleStatusUpdate);
    socket.on("messages_seen", handleMessagesSeen);
    socket.on("message_error", handleMessageError);

    return () => {
      socket.off("receiveMessage", handleReceiveMessage);
      socket.off("message_status_update", handleStatusUpdate);
      socket.off("messages_seen", handleMessagesSeen);
      socket.off("message_error", handleMessageError);
      socket.emit("chat_closed");
    };
  }, [socket, currentChat?._id, user?._id]);

  if (!currentChat) {
    return null;
  }

  const sendImage = async (imageUri: string) => {
    setUploading(true);
    console.log("reached");
    

    try {
      // 1. Upload image to server
      const formData = new FormData();
      const filename = imageUri.split("/").pop() || "image.jpg";

      formData.append("image", {
        uri: imageUri,
        name: filename,
        type: "image/jpeg",
      } as any);

      console.log(formData);
      
      const uploadResponse = await axiosInstance.post(
        "/upload-image",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      const imageUrl = uploadResponse.data.imageUrl; // e.g., "/uploads/123456-photo.jpg"

      // 2. Send message with image URL
      const tempId = `${Date.now()}-${Math.random()}`;
      const newMessage: MessageType = {
        _id: tempId,
        chatId: chatIdRef.current || "",
        tempId: tempId,
        senderId: user?._id!,
        receiverId: currentChat._id,
        text: message.trim(),
        imageUrl: imageUrl,
        status: "sent",
        createdAt: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, newMessage]);
      setMessage("");

      if (socket?.connected) {
        socket.emit("sendMessage", {
          tempId,
          senderId: user?._id,
          receiverId: currentChat._id,
          text: message.trim(),
          imageUrl: imageUrl,
        });
      }
    } catch (error) {
      Alert.alert("Error", "Failed to send image");
    } finally {
      setUploading(false);
    }
  };

  const sendMessage = () => {
    if (!user?._id || !currentChat?._id) return;
    if (!message.trim()) return;

    const tempId = `${Date.now()}-${Math.random()}`;
    const newMessage: MessageType = {
      _id: tempId,
      chatId: chatIdRef.current || "",
      tempId: tempId,
      senderId: user?._id,
      receiverId: currentChat?._id,
      text: message.trim(),
      status: "sent",
      createdAt: new Date().toISOString(),
    };

    const messageData = {
      tempId: newMessage.tempId,
      receiverId: currentChat._id,
      text: newMessage.text,
      senderId: user?._id,
    };

    // Add to UI immediately
    setMessages((prev) => [...prev, newMessage]);
    setMessage("");

    if (socket?.connected) {
      socket.emit("sendMessage", messageData);
    } else {
      // Queue message if not connected
      messageQueueRef.current.push(messageData);
      // console.log("Message queued, will send when reconnected");
    }
  };

  const handleEmojiSelect = (emoji: string) => {
    setMessage(message + emoji);
  };

  return (
    <View style={styles.container}>
      <PreviousChats messages={messages} scrollRef={scrollRef} />

      <ChatInput
        message={message}
        setMessage={setMessage}
        sendMessage={sendMessage}
        sendImage={sendImage}
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
