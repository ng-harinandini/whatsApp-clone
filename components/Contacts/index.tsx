import { contacts } from "@/utils/contactData";
import { useRouter } from "expo-router";
import React from "react";
import { FlatList, Image, Pressable, Text, View } from "react-native";
import styles from "../Chats/styles";

function ContactsScreen() {
  const router = useRouter();
  const handleRedirect = (uuid: string) => {
    console.log(uuid);

    router.push({
      pathname: "/(protected)/chat/[uuid]",
      params: { uuid },
    });
  };
  return (
    <FlatList
      data={contacts}
      keyExtractor={(item) => item.uuid}
      renderItem={({ item }) => (
        <View style={styles.chatItem}>
          <Image source={{ uri: item.avatar }} style={styles.avatar} />
          <Pressable onPress={() => handleRedirect(item.uuid)}>
            <View style={styles.chatContent}>
              <Text style={styles.name}>{item.name}</Text>
              <Text numberOfLines={1} style={styles.lastMessage}>
                {item.status}
              </Text>
            </View>
          </Pressable>
        </View>
      )}
    />
  );
}

export default ContactsScreen;
