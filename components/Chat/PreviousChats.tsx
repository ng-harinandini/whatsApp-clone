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
  createdAt: string;
};

type PreviousChatsProps = {
  messages: MessageType[];
  scrollRef: React.RefObject<FlatList<MessageType> | null>;
};

function PreviousChats({ messages, scrollRef }: PreviousChatsProps) {
  const formatDate = (date: string) => {
    return new Date(date).toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
    });
  };
  return (
    <FlatList
      ref={scrollRef}
      data={messages}
      keyExtractor={(item) => item._id}
      contentContainerStyle={styles.messagesContent}
      keyboardShouldPersistTaps="handled"
      renderItem={({ item }) => (
        <View
          style={[
            styles.messageBubble,
            item.sent ? styles.sentMessage : styles.receivedMessage,
          ]}
        >
          <Text style={styles.messageText}>{item.text}</Text>
          <Text style={styles.messageTime}>{formatDate(item.createdAt)}</Text>
        </View>
      )}
    />
  );
}

export default PreviousChats;
