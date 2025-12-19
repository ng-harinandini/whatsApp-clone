import { contacts } from "@/utils/contactData";
import React from "react";
import { FlatList, Image, Text, View } from "react-native";
import styles from "../Chats/styles";

function NewChatScreen() {
  return (
    <FlatList
      data={contacts}
      keyExtractor={(item) => item.uuid}
      renderItem={({ item }) => (
        <View style={styles.chatItem}>
          <Image source={{ uri: item.avatar }} style={styles.avatar} />

          <View style={styles.chatContent}>
            <Text style={styles.name}>{item.name}</Text>
            <Text numberOfLines={1} style={styles.lastMessage}>
              {item.status}
            </Text>
          </View>
        </View>
      )}
    />
  );
}

export default NewChatScreen;
