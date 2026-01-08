import React from "react";
import { FlatList, Text, View } from "react-native";
import styles from "./styles";

type MessageType = {
  _id: string;
  chatId: string;
  senderId: string;
  receiverId: string;
  text: string;
  sent: boolean;
  status?: string;
  createdAt: string;
};

type PreviousChatsProps = {
  messages: MessageType[];
  scrollRef?: React.RefObject<any>;
};

function PreviousChats({ messages, scrollRef }: PreviousChatsProps) {
  const formatDate = (date: string) => {
    return new Date(date).toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
    });
  };

  const renderTicks = (status = "sent") => {
    if (status === "sent") return "✓";
    if (status === "delivered") return "✓✓";
    if (status === "seen") return "✓✓ (blue)";
  };

  return (
    <FlatList
      ref={scrollRef}
      data={messages}
      keyboardShouldPersistTaps="handled"
      keyExtractor={(item) => item._id}
      contentContainerStyle={{ paddingBottom: 80 }}
      renderItem={({ item }) => (
        <View
          style={[
            styles.messageBubble,
            item.sent ? styles.sentMessage : styles.receivedMessage,
          ]}
        >
          <Text style={styles.messageText}>{item.text}</Text>
          <Text style={styles.messageTime}>{`${formatDate(
            item.createdAt
          )} ${renderTicks(item.status)}`}</Text>
        </View>
      )}
    />
  );
}

export default PreviousChats;
