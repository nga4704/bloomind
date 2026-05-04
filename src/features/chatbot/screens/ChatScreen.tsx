import React, { useEffect, useRef, useState } from "react";
import {
  View,
  FlatList,
  Text,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";

import ChatBubble from "../components/ChatBubble";
import MessageInput from "../components/MessageInput";

import {
  createConversation,
  saveMessage,
  getMessagesByConversation,
  getRecentMessages,
  sendMessageToAI,
} from "../services/chat.service";

import { auth, firestore } from "../../../services/firebase/firebaseConfig";
import { RootStackParamList } from "../types/chatbot";

import { getTodayMood } from "../../mood/services/mood.service";
import { doc, updateDoc, getDoc } from "firebase/firestore";

interface Msg {
  id: string;
  text: string;
  sender: "user" | "bot";
}

const ChatScreen = () => {
  const navigation = useNavigation();
  const flatListRef = useRef<FlatList>(null);

  const uid = auth.currentUser?.uid;

  type ChatRouteProp = RouteProp<RootStackParamList, "Chatbot">;
  const route = useRoute<ChatRouteProp>();

  const initialConversationId = route.params?.conversationId ?? null;

  const [conversationId, setConversationId] = useState<string | null>(
    initialConversationId
  );

  const [messages, setMessages] = useState<Msg[]>([]);
  const [typing, setTyping] = useState(false);
  const [userProfile, setUserProfile] = useState("");

  /* ================================
     LOAD PROFILE
  ================================ */
  useEffect(() => {
    const loadProfile = async () => {
      if (!uid) return;

      const snap = await getDoc(doc(firestore, "users", uid));
      if (snap.exists()) {
        setUserProfile(snap.data().aiProfile || "");
      }
    };

    loadProfile();
  }, []);

  /* ================================
     LOAD HISTORY (ONLY ON OPEN)
  ================================ */
  useEffect(() => {
    if (!uid) return;
    if (!initialConversationId) return;

    const loadMessages = async () => {
      const oldMessages = await getMessagesByConversation(
        uid,
        initialConversationId
      );

      const formatted: Msg[] = oldMessages.map((m, index) => ({
        id: index.toString(),
        text: m.content,
        sender: m.role === "assistant" ? "bot" : "user",
      }));

      setMessages(formatted);
    };

    loadMessages();
  }, [initialConversationId]);

  /* ================================
     AUTO SCROLL
  ================================ */
  useEffect(() => {
    flatListRef.current?.scrollToEnd({ animated: true });
  }, [messages, typing]);

  /* ================================
     SEND MESSAGE
  ================================ */
  const onSend = async (text: string) => {
    if (!uid || !text.trim()) return;

    const userId = Date.now().toString();
    const botId = (Date.now() + 1).toString();

    // 1. optimistic UI
    setMessages((prev) => [
      ...prev,
      { id: userId, text, sender: "user" },
      { id: botId, text: "…", sender: "bot" },
    ]);

    setTyping(true);

    try {
      let convoId = conversationId;

      // 2. create conversation if needed
      if (!convoId) {
        convoId = await createConversation(uid, text);
        setConversationId(convoId);
      }

      // 3. SAVE USER MESSAGE (await FIX)
      await saveMessage(uid, convoId, "user", text, "system");

      // 4. history + mood
      const history = await getRecentMessages(uid, convoId);
      const today = new Date().toISOString().slice(0, 10);
      const mood = await getTodayMood(uid, today);

      // 5. AI call
      const res = await sendMessageToAI(
        text,
        history,
        mood,
        userProfile
      );

      // 6. save AI message (await FIX)
      await saveMessage(uid, convoId, "assistant", res.reply, "ai");

      // 7. update UI bot message
      setMessages((prev) =>
        prev.map((m) =>
          m.id === botId ? { ...m, text: res.reply } : m
        )
      );

      // 8. update title (safe)
      const convoRef = doc(
        firestore,
        "users",
        uid,
        "conversations",
        convoId
      );

      const snap = await getDoc(convoRef);
      const currentTitle = snap.data()?.title;

      if (
        res.title &&
        (!currentTitle || currentTitle.length < 15)
      ) {
        await updateDoc(convoRef, {
          title: res.title,
        });
      }

      // 9. update profile memory
      if (res.personality) {
        setUserProfile(res.personality);

        await updateDoc(doc(firestore, "users", uid), {
          aiProfile: res.personality,
        });
      }
    } catch (err) {
      console.log(err);

      setMessages((prev) =>
        prev.map((m) =>
          m.id === botId
            ? {
              ...m,
              text: "Mình đang gặp lỗi, thử lại sau nhé 🙏",
            }
            : m
        )
      );
    } finally {
      setTyping(false);
    }
  };

  /* ================================
     UI
  ================================ */
  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <SafeAreaView style={styles.container}>
        {/* HEADER */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} />
          </TouchableOpacity>

          <Text style={styles.title}>Trò chuyện với Bloomie</Text>

          <TouchableOpacity
            onPress={() => navigation.navigate("ChatHistory" as never)}
          >
            <Ionicons name="time-outline" size={24} />
          </TouchableOpacity>
        </View>

        {/* EMPTY STATE */}
        {messages.length === 0 && !typing && (
          <View style={styles.emptyContainer}>
            <Image
              source={require("../../../assets/images/chatbotAvatar.png")}
              style={styles.bloomieImage}
            />
            <Text style={styles.emptySubtitle}>
              Hãy chia sẻ cảm xúc của bạn 🌿
            </Text>
          </View>
        )}

        {/* CHAT LIST */}
        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <ChatBubble message={item.text} sender={item.sender} />
          )}
          contentContainerStyle={{ padding: 16 }}
        />

        {/* INPUT */}
        <MessageInput onSend={onSend} />
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
};

export default ChatScreen;

/* ================================
   STYLE
================================ */
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fffbf2" },

  header: {
    padding: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#fff",
  },

  title: { fontSize: 17, fontWeight: "600" },

  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  bloomieImage: { width: 100, height: 100 },

  emptySubtitle: {
    marginTop: 10,
    textAlign: "center",
    color: "#666",
  },
});