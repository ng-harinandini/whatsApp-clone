import { Dimensions, Platform, StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ECE5DD",
  },
  messagesContainer: {
    flex: 1,
    padding: 8,
  },
  messagesContent: {
    paddingBottom: 10,
  },
  messageBubble: {
    borderRadius: 8,
    padding: 8,
    paddingHorizontal: 12,
    marginHorizontal: 6,
    marginTop: 6,
    maxWidth: "75%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
    elevation: 1,
  },
  sentMessage: {
    alignSelf: "flex-end",
    backgroundColor: "#DCF8C6",
  },
  receivedMessage: {
    alignSelf: "flex-start",
    backgroundColor: "#FFFFFF",
  },
  imageMessageBubble: {
    padding: 4,
    paddingBottom: 8,
  },
  imageContainer: {
    position: "relative",
    borderRadius: 8,
    overflow: "hidden",
    marginBottom: 4,
  },
  messageImage: {
    width: 240,
    height: 240,
    borderRadius: 8,
  },
  imageLoadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1,
  },
  imageCaption: {
    paddingHorizontal: 4,
    paddingTop: 4,
  },

  // Time overlay for image-only messages (WhatsApp style)
  imageTimeOverlay: {
    position: "absolute",
    bottom: 8,
    right: 8,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
  },
  imageTimeText: {
    color: "#FFFFFF",
    fontWeight: "500",
  },

  messageText: {
    fontSize: 15,
    color: "#000",
  },
  messageTimeContainer: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-end",
    marginTop: 4,
  },
  messageTime: {
    fontSize: 11,
    color: "#667781",
  },
  ticksContainer: {
    marginLeft: 4,
  },

  // Full Screen Image Modal
  imageModalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.95)",
    justifyContent: "center",
    alignItems: "center",
  },
  imageModalCloseButton: {
    position: "absolute",
    top: 50,
    right: 20,
    zIndex: 10,
    padding: 10,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 25,
  },
  fullScreenImage: {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
  },

  inputBar: {
    flexDirection: "row",
    alignItems: "center",
    padding: 8,
    minHeight: 56,
    paddingBottom: 16,
    borderTopWidth: 1,
    borderTopColor: "#D1D1D1",
  },
  iconButton: {
    padding: 8,
  },
  inputContainer: {
    flex: 1,
    backgroundColor: "#edeae6ff",
    borderRadius: 20,
    borderColor: "#D1D1D1",
    borderWidth: 2,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    marginHorizontal: 8,
  },
  textInput: {
    flex: 1,
    paddingVertical: 8,
    fontSize: 16,
    color: "#000",
    maxHeight: 120,
    minHeight: 40,
    ...(Platform.OS === "web" && {
      outlineStyle: "none",
      outlineWidth: 0,
      boxShadow: "none",
    }),
  },
  attachButton: {
    padding: 4,
  },
  sendButton: {
    backgroundColor: "#25D366",
    borderRadius: 24,
    width: 48,
    height: 48,
    justifyContent: "center",
    alignItems: "center",
  },
  emojiModalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  emojiModalContent: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    height: Dimensions.get("window").height * 0.5,
  },
  emojiHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E5E5",
  },
  emojiHeaderText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#000",
  },
  closeButton: {
    padding: 4,
  },
  categoryTabs: {
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E5E5",
  },
  categoryTab: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginRight: 8,
    alignSelf: "flex-start",
  },
  categoryTabsContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  categoryTabActive: {
    borderBottomWidth: 3,
    borderBottomColor: "#25D366",
  },
  emojiGridContent: {
    alignItems: "flex-start",
    justifyContent: "flex-start",
  },
  categoryTabText: {
    fontSize: 15,
    color: "#667781",
    fontWeight: "500",
  },
  categoryTabTextActive: {
    color: "#25D366",
    fontWeight: "600",
  },
  emojiGrid: {
    paddingHorizontal: 4,
    paddingTop: 8,
  },
  emojiButton: {
    width: (Dimensions.get("window").width - 32) / 8,
    height: 48,
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 4,
  },
  emojiText: {
    fontSize: 32,
  },

  // Camera Styles
  ccontainer: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  cameraContainer: StyleSheet.absoluteFillObject,
  camera: StyleSheet.absoluteFillObject,
  shutterContainer: {
    position: "absolute",
    bottom: 44,
    left: 0,
    width: "100%",
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 30,
  },
  shutterBtn: {
    backgroundColor: "transparent",
    borderWidth: 5,
    borderColor: "white",
    width: 85,
    height: 85,
    borderRadius: 45,
    alignItems: "center",
    justifyContent: "center",
  },
  shutterBtnInner: {
    width: 70,
    height: 70,
    borderRadius: 50,
  },
  recording: {
    transform: [{ scale: 0.8 }],
    borderRadius: "50%",
  },
});

export default styles;
