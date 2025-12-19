import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    textAlign: "center",
    marginBottom: 40,
    marginTop: 60,
  },
  subtitle: {
    fontSize: 14,
    color: "#555",
    textAlign: "center",
    marginBottom: 30,
  },
  phone: {
    fontWeight: "500",
    color: "#000",
  },
  codeContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: 30,
    marginBottom: 10,
  },
  codeBox: {
    width: 45,
    height: 50,
    borderBottomWidth: 2,
    justifyContent: "center",
    alignItems: "center",
  },
  codeText: {
    fontSize: 22,
    fontWeight: "600",
  },
  hint: {
    textAlign: "center",
    fontSize: 12,
    color: "#888",
    marginTop: 8,
  },
  actions: {
    marginTop: 40,
  },
  link: {
    fontSize: 15,
    color: "#25D366",
    marginVertical: 12,
  },
});
export default styles;
