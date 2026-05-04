// components/RoundedButton.tsx
import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";

interface Props {
  title: string;
  color: string;
  onPress?: () => void;
}

export default function RoundedButton({ title, color, onPress }: Props) {
  return (
    <TouchableOpacity style={[styles.button, { backgroundColor: color }]} onPress={onPress}>
      <Text style={styles.text}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    width: "85%",
    paddingVertical: 16,
    borderRadius: 30,
    alignItems: "center",
    marginTop: 15,
  },
  text: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
  },
});
