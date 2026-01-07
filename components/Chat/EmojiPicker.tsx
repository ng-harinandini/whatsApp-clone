import { EMOJI_CATEGORIES } from "@/utils/emojiData";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import React from "react";
import {
  FlatList,
  Modal,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import styles from "./styles";

type EmojiPickerProps = {
  showEmojiPicker: boolean;
  setShowEmojiPicker: (visible: boolean) => void;
  handleEmojiSelect: (emoji: string) => void;
};

function EmojiPicker({
  showEmojiPicker,
  setShowEmojiPicker,
  handleEmojiSelect,
}: EmojiPickerProps) {
  const [selectedCategory, setSelectedCategory] = React.useState<number>(0);
  return (
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
                    selectedCategory === index && styles.categoryTabTextActive,
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
                }}
              >
                <Text style={styles.emojiText}>{item}</Text>
              </TouchableOpacity>
            )}
          />
        </View>
      </View>
    </Modal>
  );
}

export default EmojiPicker;
