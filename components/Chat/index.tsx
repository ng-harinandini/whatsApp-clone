import { contacts } from "@/utils/contactData";
import { EMOJI_CATEGORIES } from "@/utils/emojiData";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useLocalSearchParams, useNavigation } from "expo-router";
import React, { useLayoutEffect, useState } from "react";
import {
    FlatList,
    KeyboardAvoidingView,
    Modal,
    Platform,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import styles from "./styles";

function Chat() {
  const params = useLocalSearchParams<{ uuid: string }>();
  const navigation = useNavigation();
  const currentChat = contacts.find((contact) => contact.uuid === params.uuid);
  const [message, setMessage] = useState<string | "">("");
  const [selectedCategory, setSelectedCategory] = useState<number>(0);
  const [showEmojiPicker, setShowEmojiPicker] = useState<boolean>(false);
  console.log(currentChat);

  const [messages, setMessages] = useState([
    { id: 1, text: "Hey! How are you?", sent: false, time: "10:30 AM" },
    {
      id: 2,
      text: "I'm good! Thanks for asking",
      sent: true,
      time: "10:32 AM",
    },
    {
      id: 3,
      text: "Working on something exciting today",
      sent: false,
      time: "10:33 AM",
    },
    { id: 4, text: "That sounds great!", sent: true, time: "10:35 AM" },
  ]);

  useLayoutEffect(() => {
    if (currentChat?.name) {
      navigation.setOptions({
        title: currentChat.name,
      });
    }
  }, [currentChat]);

  if (!currentChat) {
    return null;
  }

  const sendMessage = () => {
    if (message.trim()) {
      const newMessage = {
        id: messages.length + 1,
        text: message,
        sent: true,
        time: new Date().toLocaleTimeString("en-US", {
          hour: "numeric",
          minute: "2-digit",
        }),
      };
      setMessages([...messages, newMessage]);
      setMessage("");
    }
  };
  const handleEmojiSelect = (emoji: string) => {
    setMessage(message + emoji);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      {/* Messages Area */}
      <ScrollView
        style={styles.messagesContainer}
        contentContainerStyle={styles.messagesContent}
      >
        {messages.map((msg) => (
          <View
            key={msg.id}
            style={[
              styles.messageBubble,
              msg.sent ? styles.sentMessage : styles.receivedMessage,
            ]}
          >
            <Text style={styles.messageText}>{msg.text}</Text>
            <Text style={styles.messageTime}>{msg.time}</Text>
          </View>
        ))}
      </ScrollView>

      {/* Input Bar */}
      <View style={styles.inputBar}>
        <TouchableOpacity
          style={styles.iconButton}
          onPress={() => setShowEmojiPicker(true)}
        >
          <FontAwesome6 name="face-smile" size={24} color="#667781" />
        </TouchableOpacity>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.textInput}
            placeholder="Message"
            placeholderTextColor="#8696A0"
            value={message}
            onChangeText={setMessage}
            multiline
          />
          <TouchableOpacity style={styles.attachButton}>
            <MaterialIcons name="attachment" size={24} color="#667781" />
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
          <MaterialIcons name="send" size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
      <Modal
        visible={showEmojiPicker}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowEmojiPicker(false)}
      >
        <View style={styles.emojiModalOverlay}>
          <View style={styles.emojiModalContent}>
            {/* Header */}
            <View style={styles.emojiHeader}>
              <Text style={styles.emojiHeaderText}>Select Emoji</Text>
              <TouchableOpacity
                onPress={() => setShowEmojiPicker(false)}
                style={styles.closeButton}
              >
                <MaterialIcons name="close" size={24} color="#000" />
              </TouchableOpacity>
            </View>

            {/* Category Tabs */}
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.categoryTabs}
              contentContainerStyle={styles.categoryTabsContent}
            >
              {EMOJI_CATEGORIES.map((category, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.categoryTab,
                    selectedCategory === index && styles.categoryTabActive,
                  ]}
                  onPress={() => setSelectedCategory(index)}
                >
                  <Text
                    style={[
                      styles.categoryTabText,
                      selectedCategory === index &&
                        styles.categoryTabTextActive,
                    ]}
                  >
                    {category.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            {/* Emoji Grid */}
            <FlatList
              data={EMOJI_CATEGORIES[selectedCategory].emojis}
              keyExtractor={(item, index) => `${item}-${index}`}
              numColumns={8}
              contentContainerStyle={styles.emojiGridContent}
              style={styles.emojiGrid}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.emojiButton}
                  onPress={() => {
                    handleEmojiSelect(item);
                    setShowEmojiPicker(false);
                  }}
                >
                  <Text style={styles.emojiText}>{item}</Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
}

export default Chat;
