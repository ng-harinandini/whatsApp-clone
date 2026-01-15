import { useUser } from "@/providers/UserContextProvider";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { FlatList, Text, View } from "react-native";
import styles from "./styles";

type MessageType = {
  _id: string;
  chatId: string;
  senderId: string;
  receiverId: string;
  text: string;
  status?: string;
  createdAt: string;
};

type PreviousChatsProps = {
  messages: MessageType[];
  scrollRef?: React.RefObject<any>;
};

function PreviousChats({ messages, scrollRef }: PreviousChatsProps) {
  const { user } = useUser();
  const formatDate = (date: string) => {
    return new Date(date).toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
    });
  };

  const renderTicks = (status = "sent") => {
    if (status === "sent") {
      return <Ionicons name="checkmark" size={16} color="#8696a0" />;
    }
    if (status === "delivered" || status === "seen") {
      return (
        <View style={{ flexDirection: "row" }}>
          <Ionicons
            name="checkmark"
            size={16}
            color={status === "delivered" ? "#8696a0" : "#179ad2ff"}
          />
          <Ionicons
            name="checkmark"
            size={16}
            color={status === "delivered" ? "#8696a0" : "#179ad2ff"}
            style={{ marginLeft: -11 }}
          />
        </View>
      );
    }
  };

  return (
    <FlatList
      ref={scrollRef}
      data={messages}
      keyboardShouldPersistTaps="handled"
      keyExtractor={(item) => item._id}
      renderItem={({ item }) => {
        // console.log(item);
        const isMe = user?._id === item.senderId;
        return (
          <View
            style={[
              styles.messageBubble,
              isMe ? styles.sentMessage : styles.receivedMessage,
            ]}
          >
            <Text style={styles.messageText}>{item.text}</Text>
            <Text style={styles.messageTime}>
              {`${formatDate(item.createdAt)}`}{" "}
              {isMe ? renderTicks(item.status) : null}
            </Text>
          </View>
        );
      }}
    />
  );
}

export default PreviousChats;
