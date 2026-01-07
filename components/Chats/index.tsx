import { useUser } from "@/providers/UserContextProvider";
import axiosInstance from "@/utils/axiosInstance";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useFocusEffect, useRouter } from "expo-router";
import React, { useCallback, useState } from "react";
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

  useFocusEffect(
    useCallback(() => {
      if (user?._id) fetchChats();
    }, [user?._id])
  );

  const fetchChats = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(`/all/chats/${user?._id}`);
      setChats(response.data.chats || []);
    } catch (e) {
      console.log(e);
      setChats([]);
    } finally {
      setLoading(false);
    }
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
        ListEmptyComponent={
          !loading && (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No chats found</Text>
              <Text style={styles.emptySubText}>Start a new conversation</Text>
            </View>
          )
        }
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
