import { useUser } from "@/providers/UserContextProvider";
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  Modal,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import styles from "./styles";

type MessageType = {
  _id: string;
  chatId: string;
  senderId: string;
  receiverId: string;
  text?: string;
  imageUrl?: string;
  status?: string;
  createdAt: string;
};

type PreviousChatsProps = {
  messages: MessageType[];
  scrollRef?: React.RefObject<any>;
};

function PreviousChats({ messages, scrollRef }: PreviousChatsProps) {
  const { user } = useUser();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [imageLoading, setImageLoading] = useState<{ [key: string]: boolean }>(
    {}
  );

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
    <>
      <FlatList
        ref={scrollRef}
        data={messages}
        keyboardShouldPersistTaps="handled"
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.messagesContent}
        renderItem={({ item }) => {
          const isMe = user?._id === item.senderId;
          const hasImage = !!item.imageUrl;
          const hasText = !!item.text;

          return (
            <View
              style={[
                styles.messageBubble,
                isMe ? styles.sentMessage : styles.receivedMessage,
                hasImage && styles.imageMessageBubble,
              ]}
            >
              {/* Image */}
              {hasImage && (
                <TouchableOpacity
                  onPress={() => setSelectedImage(item.imageUrl!)}
                  activeOpacity={0.9}
                >
                  <View style={styles.imageContainer}>
                    {imageLoading[item._id] && (
                      <View style={styles.imageLoadingOverlay}>
                        <ActivityIndicator size="small" color="#25D366" />
                      </View>
                    )}
                    <Image
                      source={{ uri: item.imageUrl }}
                      style={styles.messageImage}
                      resizeMode="cover"
                      onLoadStart={() =>
                        setImageLoading((prev) => ({
                          ...prev,
                          [item._id]: true,
                        }))
                      }
                      onLoadEnd={() =>
                        setImageLoading((prev) => ({
                          ...prev,
                          [item._id]: false,
                        }))
                      }
                      onError={() =>
                        setImageLoading((prev) => ({
                          ...prev,
                          [item._id]: false,
                        }))
                      }
                    />
                  </View>
                </TouchableOpacity>
              )}

              {/* Text (caption if image exists) */}
              {hasText && (
                <Text
                  style={[styles.messageText, hasImage && styles.imageCaption]}
                >
                  {item.text}
                </Text>
              )}

              {/* Time and Status */}
              <View
                style={[
                  styles.messageTimeContainer,
                  hasImage && !hasText && styles.imageTimeOverlay,
                ]}
              >
                <Text
                  style={[
                    styles.messageTime,
                    hasImage && !hasText && styles.imageTimeText,
                  ]}
                >
                  {formatDate(item.createdAt)}
                </Text>
                {isMe && (
                  <View style={styles.ticksContainer}>
                    {renderTicks(item.status)}
                  </View>
                )}
              </View>
            </View>
          );
        }}
      />

      {/* Full Screen Image Modal */}
      <Modal
        visible={!!selectedImage}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setSelectedImage(null)}
      >
        <View style={styles.imageModalOverlay}>
          <TouchableOpacity
            style={styles.imageModalCloseButton}
            onPress={() => setSelectedImage(null)}
          >
            <Ionicons name="close" size={32} color="#fff" />
          </TouchableOpacity>

          <Image
            source={{ uri: selectedImage || "" }}
            style={styles.fullScreenImage}
            resizeMode="contain"
          />
        </View>
      </Modal>
    </>
  );
}

export default PreviousChats;
