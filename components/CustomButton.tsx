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
        padding: 15,
        borderRadius: 5,
      }}
    >
      <Pressable onPress={onPress}>
        <Text>{btnText}</Text>
      </Pressable>
    </View>
  );
}
