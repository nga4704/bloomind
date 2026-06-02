import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather, Ionicons } from "@expo/vector-icons";
import { useAuth } from "../../../services/firebase/AuthContext";
import { signOut } from "firebase/auth";
import { auth } from "../../../services/firebase/firebaseConfig";
import { useNavigation } from "@react-navigation/native";

export const ProfileScreen = () => {
  const { user } = useAuth();
  const navigation = useNavigation<any>();

  const handleLogout = async () => {
    Alert.alert("Đăng xuất", "Bạn có chắc muốn đăng xuất?", [
      { text: "Huỷ", style: "cancel" },
      {
        text: "Đăng xuất",
        style: "destructive",
        onPress: async () => {
          await signOut(auth);
        },
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container}>

        {/* HEADER */}
        <View style={styles.header}>
          <Text style={styles.title}>Cá nhân</Text>
          <TouchableOpacity onPress={() => navigation.navigate("EditProfile")}>
            <Feather name="edit-3" size={20} color="#333" />
          </TouchableOpacity>
        </View>

        {/* USER */}
        <View style={styles.userSection}>
          <Image
            source={
              user?.photoURL
                ? { uri: user.photoURL }
                : require("../../../assets/images/avatar.png")
            }
            style={styles.avatar}
          />
          <Text style={styles.name}>
            {user?.displayName || "Người dùng"}
          </Text>
          <Text style={styles.email}>{user?.email}</Text>
        </View>

        {/* SETTINGS */}
        <View style={styles.card}>
          <MenuItem icon="settings" label="Cài đặt" />
          <MenuItem icon="help-circle" label="Trợ giúp" />
        </View>

        {/* LOGOUT */}
        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
         <Text style={styles.logoutText}>Đăng xuất</Text>
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
};

const MenuItem = ({ icon, label }: any) => (
  <TouchableOpacity style={styles.menuItem}>
    <View style={styles.left}>
      <Feather name={icon} size={18} color="#333" />
      <Text style={styles.menuText}>{label}</Text>
    </View>
    <Ionicons name="chevron-forward" size={18} color="#999" />
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#fffbf2" },
  container: { padding: 20 },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  title: { fontSize: 20, fontWeight: "700" },

  userSection: {
    alignItems: "center",
    marginTop: 25,
    marginBottom: 20,
  },

  avatar: { width: 90, height: 90, borderRadius: 45 },

  name: { marginTop: 12, fontSize: 18, fontWeight: "600" },

  email: { fontSize: 13, color: "#777", marginTop: 4 },

  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    marginTop: 15,
    overflow: "hidden",
  },

  menuItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 0.5,
    borderColor: "#eee",
  },

  left: { flexDirection: "row", alignItems: "center" },

  menuText: { marginLeft: 12, fontSize: 15 },

  logoutBtn: {
    marginTop: 25,
    padding: 14,
    borderRadius: 12,
    backgroundColor: "#535353",
  },

  logoutText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "600",
  },
});