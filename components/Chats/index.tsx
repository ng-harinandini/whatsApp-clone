import { useUser } from "@/providers/UserContextProvider";
import axiosInstance from "@/utils/axiosInstance";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  Pressable,
  Text,
  View,
} from "react-native";
import styles from "./styles";

function Chats() {
  const router = useRouter();
  const { user } = useUser();
  const [loading, setLoading] = useState<boolean>(false);
  const [chats, setChats] = useState<any>([]);

  useEffect(() => {
    if (user?._id) {
      fetchChats();
    }
  }, []);

  const fetchChats = async () => {
    setLoading(true);
    console.log(user);

    const response = await axiosInstance.get(`/all/chats/${user?._id}`);
    console.log(response.data);
    setChats(response.data.chats || []);
    setLoading(false);
  };
  const formatDate = (date: string) => {
    return new Date(date).toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
    });
  };
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#25D366" />
      </View>
    );
  }
  return (
    <>
      <FlatList
        data={chats}
        keyExtractor={(item) => item.participantId}
        renderItem={({ item }) => (
          <Pressable
            onPress={() =>
              router.push(`/(protected)/chat/${item.participantId}`)
            }
          >
            <View style={styles.chatItem}>
              <Image source={{ uri: item.avatar }} style={styles.avatar} />

              <View style={styles.chatContent}>
                <Text style={styles.name}>{item.name}</Text>
                <Text numberOfLines={1} style={styles.lastMessage}>
                  {item.lastMessage}
                </Text>
              </View>

              <View style={styles.rightSection}>
                <Text style={styles.time}>
                  {formatDate(item.lastMessageTime)}
                </Text>

                {item.unreadCount > 0 && (
                  <View style={styles.unreadBadge}>
                    <Text style={styles.unreadText}>{item.unreadCount}</Text>
                  </View>
                )}
              </View>
            </View>
          </Pressable>
        )}
      />
      <Pressable
        style={styles.fab}
        onPress={() => router.push("/(protected)/new-chat")}
      >
        <MaterialIcons name="add" size={28} color="#fff" />
      </Pressable>
    </>
  );
}

export default Chats;
