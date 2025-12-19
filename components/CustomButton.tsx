import { Pressable, Text, View } from "react-native";

export default function CustomButton({
  btnText,
  onPress,
}: {
  btnText: string;
  onPress: () => void;
}) {
  return (
    <View
      style={{
        marginTop: 60,
        backgroundColor: "#25D366",
        borderRadius: 5,
      }}
    >
      <Pressable style={{ padding: 15 }} onPress={onPress}>
        <Text style={{ color: "white", fontWeight: "bold" }}>{btnText}</Text>
      </Pressable>
    </View>
  );
}
