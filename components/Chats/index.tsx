import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useRouter } from "expo-router";
import React from "react";
import { FlatList, Image, Pressable, Text, View } from "react-native";
import styles from "./styles";

function Chats() {
  const router = useRouter();
  return (
    <>
      <FlatList
        data={chats}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.chatItem}>
            <Image source={{ uri: item.avatar }} style={styles.avatar} />

            <View style={styles.chatContent}>
              <Text style={styles.name}>{item.name}</Text>
              <Text numberOfLines={1} style={styles.lastMessage}>
                {item.lastMessage}
              </Text>
            </View>

            <View style={styles.rightSection}>
              <Text style={styles.time}>{item.time}</Text>

              {item.unreadCount > 0 && (
                <View style={styles.unreadBadge}>
                  <Text style={styles.unreadText}>{item.unreadCount}</Text>
                </View>
              )}
            </View>
          </View>
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
const chats = [
  {
    id: "1",
    name: "Rahul Sharma",
    avatar: "https://i.pravatar.cc/150?img=1",
    lastMessage: "Bro, are you coming today?",
    time: "9:45 AM",
    unreadCount: 2,
    isOnline: true,
  },
  {
    id: "2",
    name: "Priya",
    avatar: "https://i.pravatar.cc/150?img=5",
    lastMessage: "Okay, I’ll send it by evening 👍",
    time: "8:30 AM",
    unreadCount: 0,
    isOnline: false,
  },
  {
    id: "3",
    name: "Office Group",
    avatar: "https://i.pravatar.cc/150?img=12",
    lastMessage: "Meeting moved to 4 PM",
    time: "Yesterday",
    unreadCount: 5,
    isOnline: false,
    isGroup: true,
  },
  {
    id: "4",
    name: "Mom ❤️",
    avatar: "https://i.pravatar.cc/150?img=8",
    lastMessage: "Did you eat?",
    time: "Yesterday",
    unreadCount: 0,
    isOnline: true,
  },
  {
    id: "5",
    name: "Arjun",
    avatar: "https://i.pravatar.cc/150?img=10",
    lastMessage: "Call me when free",
    time: "Mon",
    unreadCount: 1,
    isOnline: false,
  },
  {
    id: "6",
    name: "Travel Buddies",
    avatar: "https://i.pravatar.cc/150?img=15",
    lastMessage: "Tickets booked 🎉",
    time: "Sun",
    unreadCount: 0,
    isOnline: false,
    isGroup: true,
  },
];
