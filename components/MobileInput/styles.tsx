import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    padding: 40,
  },
  closeButton: {
    position: "absolute",
    top: 50,
    left: 25,
  },
  error:{
    color: "red",
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    color: "#333",
    fontWeight: "500",
    paddingTop: 100,
  },
  subtitle: {
    fontSize: 14,
    color: "#666",
    lineHeight: 20,
    paddingTop: 40,
  },
  dropdownContainer: {
    marginBottom: 24,
    position: "relative",
    paddingTop: 24,
  },
  dropdownButton: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 12,
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderRadius: 8,
    borderColor: "#d1d1d1",
    cursor: "pointer",
    width: "100%",
  },
  dropdownContent: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  flag: {
    fontSize: 20,
  },
  countryName: {
    fontSize: 16,
    color: "#1a1a1a",
    paddingLeft: 8,
  },
  chevron: {
    fontSize: 16,
    color: "#25D366",
  },
  dropdownList: {
    position: "absolute",
    top: 74,
    left: 0,
    right: 0,
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#d1d1d1",
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    zIndex: 1000,
  },
  scrollView: {
    maxHeight: 240,
  },
  countryItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    gap: 12,
  },
  countryItemName: {
    flex: 1,
    fontSize: 16,
    color: "#1a1a1a",
  },
  countryCode: {
    fontSize: 14,
    color: "#666",
  },
  phoneInputContainer: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 24,
  },
  codeInput: {
    width: 80,
  },
  codeText: {
    paddingVertical: 12,
    paddingHorizontal: 12,
    backgroundColor: "#f5f5f5",
    borderBottomWidth: 2,
    borderBottomColor: "#d1d1d1",
    textAlign: "center",
    fontSize: 16,
    color: "#1a1a1a",
  },
  numberInput: {
    flex: 1,
  },
  numberText: {
    paddingVertical: 12,
    paddingHorizontal: 12,
    backgroundColor: "#f5f5f5",
    borderBottomWidth: 2,
    borderBottomColor: "#d1d1d1",
    fontSize: 16,
    color: "#1a1a1a",
  },
  nextButton: {
    backgroundColor: "#25D366",
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
    paddingHorizontal: 32,
    marginBottom: 24,
  },
  nextButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600",
  },
  bottomIcons: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 16,
  },
  iconButton: {
    padding: 8,
  },
  icon: {
    fontSize: 24,
    color: "#999",
  },
});
export default styles;
