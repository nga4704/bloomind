import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { collection, query, orderBy, getDocs } from "firebase/firestore";
import { auth, firestore } from "../../../services/firebase/firebaseConfig";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../types/chatbot";
import { SafeAreaView } from "react-native-safe-area-context";
import { deleteConversation } from "../services/chat.service";

interface Conversation {
  id: string;
  title: string;
  lastMessage: string;
  updatedAt: string;
}

type NavProp = NativeStackNavigationProp<
  RootStackParamList,
  "ChatHistory"
>;

const ChatHistoryScreen = () => {
  const navigation = useNavigation<NavProp>();
  const uid = auth.currentUser?.uid;

  const [data, setData] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  /* ================================
     LOAD DATA
  ================================= */
  const loadConversations = async () => {
    if (!uid) return;

    try {
      setLoading(true);

      const q = query(
        collection(firestore, "users", uid, "conversations"),
        orderBy("updatedAt", "desc")
      );

      const snap = await getDocs(q);

      const list = snap.docs.map((doc) => ({
        id: doc.id,
        title: doc.data().title || "Cuộc trò chuyện",
        lastMessage: doc.data().lastMessage || "",
        updatedAt:
          doc.data().updatedAt?.toDate()?.toLocaleString() || "",
      }));

      setData(list);
    } catch (err) {
      console.log("LOAD ERROR:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadConversations();
  }, [uid]);

  useFocusEffect(
    useCallback(() => {
      loadConversations();
    }, [uid])
  );

  /* ================================
     DELETE (KHÔNG dùng Alert nữa)
  ================================= */
  const handleDelete = async (conversationId: string) => {
    if (!uid) return;

    try {
      setDeletingId(conversationId);

      await deleteConversation(uid, conversationId);

      setData((prev) =>
        prev.filter((item) => item.id !== conversationId)
      );
    } catch (err) {
      console.log("❌ DELETE ERROR:", err);
    } finally {
      setDeletingId(null);
    }
  };

  /* ================================
     RENDER ITEM
  ================================= */
  const renderItem = ({ item }: { item: Conversation }) => {
    const isDeleting = deletingId === item.id;

    return (
      <View style={styles.item}>
        {/* LEFT - CHAT */}
        <TouchableOpacity
          style={styles.content}
          activeOpacity={0.7}
          disabled={isDeleting}
          onPress={() =>
            navigation.navigate(
              "Chatbot",
              { conversationId: item.id } as never
            )
          }
        >
          <Image
            source={require("../../../assets/images/chatbotAvatar.png")}
            style={styles.avatar}
          />

          <View style={{ flex: 1 }}>
            <Text style={styles.title}>{item.title}</Text>

            <Text numberOfLines={1} style={styles.lastMsg}>
              {item.lastMessage}
            </Text>

            <Text style={styles.time}>{item.updatedAt}</Text>
          </View>
        </TouchableOpacity>

        {/* RIGHT - DELETE */}
        <TouchableOpacity
          style={styles.deleteBtn}
          disabled={isDeleting}
          onPress={() => handleDelete(item.id)}
        >
          {isDeleting ? (
            <ActivityIndicator size="small" />
          ) : (
            <Ionicons
              name="trash-outline"
              size={20}
              color="#000"
            />
          )}
        </TouchableOpacity>
      </View>
    );
  };

  /* ================================
     UI
  ================================= */
  if (loading) {
    return (
      <SafeAreaView style={styles.center}>
        <ActivityIndicator size="large" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={data}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 16 }}
        renderItem={renderItem}
        ListEmptyComponent={
          <View style={styles.center}>
            <Text>Chưa có cuộc trò chuyện nào</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
};

export default ChatHistoryScreen;

/* ================================
   STYLES
================================ */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fffbf2",
  },

  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  item: {
    flexDirection: "row",
    padding: 16,
    marginBottom: 14,
    backgroundColor: "#fff",
    borderRadius: 16,
    alignItems: "center",
  },

  content: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },

  deleteBtn: {
    padding: 12,
    marginLeft: 8,
    borderRadius: 20,
    backgroundColor: "#f9f1ff",
  },

  avatar: {
    width: 42,
    height: 42,
    borderRadius: 50,
    marginRight: 14,
  },

  title: {
    fontSize: 15,
    fontWeight: "500",
  },

  lastMsg: {
    fontSize: 14,
    color: "#5C5C5E",
    marginTop: 2,
  },

  time: {
    fontSize: 12,
    color: "#9A9AA0",
    marginTop: 3,
  },
});