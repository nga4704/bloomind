import React, { useState } from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface MessageInputProps {
  onSend: (msg: string) => void;
}

const MessageInput = ({ onSend }: MessageInputProps) => {
  const [value, setValue] = useState("");

  const send = () => {
    const trimmed = value.trim();
    if (!trimmed) return;
    onSend(trimmed);
    setValue("");
  };

  return (
    <View style={styles.container}>

      {/* RECORD ICON */}
      {/* <TouchableOpacity style={styles.recordBtn}>
        <Ionicons name="mic-outline" size={22} color="#9AA5B1" />
      </TouchableOpacity> */}

      {/* INPUT */}
      <TextInput
        placeholder="Viết gì đó cho Bloomie..."
        placeholderTextColor="#9AA5B1"
        style={styles.input}
        value={value}
        onChangeText={setValue}
        multiline={false}              
        returnKeyType="send"            
        onSubmitEditing={send}          
        blurOnSubmit={false}
      />

      {/* SEND BUTTON */}
      <TouchableOpacity onPress={send} style={styles.btn}>
        <Ionicons name="send-outline" size={22} color="#9AA5B1" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    padding: 12,
    borderTopWidth: 1,
    borderTopColor: "#E4E6EB",
    backgroundColor: "#fff",
    alignItems: "center",
    // marginBottom:70
  },
  recordBtn: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: "#222",
  },
  btn: {
    paddingLeft: 12,
    paddingVertical: 4,
  },
});

export default MessageInput;