import React from "react";
import { View, Text, StyleSheet, Image } from "react-native";

type Sender = "user" | "bot";

interface ChatBubbleProps {
  message: string;
  sender: Sender;
}

const ChatBubble: React.FC<ChatBubbleProps> = ({ message, sender }) => {
  const isUser = sender === "user";

  return (
    <View
      style={[
        styles.wrapper,
        isUser ? styles.userWrapper : styles.botWrapper,
      ]}
    >
      {!isUser && (
        <Image
          source={require("../../../assets/images/chatbotAvatar.png")}
          style={styles.avatar}
        />
      )}

      <View style={[styles.bubble, isUser ? styles.userBubble : styles.botBubble]}>
        <Text style={[styles.text, isUser ? styles.userText : styles.botText]}>
          {message}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    width: "100%",
    flexDirection: "row",
    alignItems: "flex-start",
    marginVertical: 6,
    paddingHorizontal: 4,
  },
  userWrapper: {
    justifyContent: "flex-end",
    flexDirection: "row",
  },
  botWrapper: {
    flexDirection: "row",
  },

  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 8,
    marginTop: 6,
  },

  bubble: {
    maxWidth: "75%",
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 18,
  },

  userBubble: {
    backgroundColor: "#d6d6ff",
    borderBottomRightRadius: 4,
  },
  botBubble: {
    backgroundColor: "#f9f1ff",
    borderBottomLeftRadius: 4,
  },

  text: {
    fontSize: 14,
    lineHeight: 20,
  },
  userText: {
    color: "#1d1d47ff",
  },
  botText: {
    color: "#222",
  },
});

export default ChatBubble;