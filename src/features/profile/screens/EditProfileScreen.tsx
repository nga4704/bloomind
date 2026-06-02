import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as ImagePicker from "expo-image-picker";
import { useAuth } from "../../../services/firebase/AuthContext";
import { firestore } from "../../../services/firebase/firebaseConfig";
import { doc, updateDoc } from "firebase/firestore";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../../app/navigation/types";
import { updateProfile, reload } from "firebase/auth";

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, "EditProfile">;
};

export const EditProfileScreen: React.FC<Props> = ({ navigation }) => {
  const { user } = useAuth();

  const [name, setName] = useState(user?.displayName || "");
  const [avatar, setAvatar] = useState(user?.photoURL || "");

  // chọn ảnh
  const pickImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permission.granted) {
      Alert.alert("Cần quyền truy cập ảnh");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7,
    });

    if (!result.canceled) {
      setAvatar(result.assets[0].uri);
    }
  };

  // save profile
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!user) return;

    try {
      setSaving(true);

      // 1. Update Auth
      await updateProfile(user, {
        displayName: name,
        photoURL: avatar,
      });

      // 2. Reload để cập nhật UI ngay
      await reload(user);

      // 3. Update Firestore
      await updateDoc(doc(firestore, "users", user.uid), {
        displayName: name,
        avatar: avatar,
      });

      Alert.alert("Thành công", "Hồ sơ đã được cập nhật");
      navigation.goBack();
    } catch (err: any) {
      console.log(err);
      Alert.alert("Lỗi", err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>

        {/* HEADER */}
        <Text style={styles.title}>Chỉnh sửa hồ sơ</Text>

        {/* AVATAR */}
        <TouchableOpacity onPress={pickImage} style={styles.avatarWrapper}>
          <Image
            source={
              avatar
                ? { uri: avatar }
                : require("../../../assets/images/avatar.png")
            }
            style={styles.avatar}
          />
          <Text style={styles.changeText}>Đổi ảnh đại diện</Text>
        </TouchableOpacity>

        {/* INPUT */}
        <View style={styles.card}>
          <Text style={styles.label}>Tên hiển thị</Text>
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={setName}
          />

          <Text style={styles.label}>Email</Text>
          <TextInput
            style={[styles.input, { backgroundColor: "#eee" }]}
            value={user?.email || ""}
            editable={false}
          />
        </View>

        {/* BUTTON */}
        <TouchableOpacity
          style={styles.button}
          onPress={handleSave}
          disabled={saving}
        >
          <Text style={styles.buttonText}>
            {saving ? "Đang lưu..." : "Lưu thay đổi"}
          </Text>
        </TouchableOpacity>

      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#fffbf2",
  },

  container: {
    padding: 20,
  },

  title: {
    fontSize: 22,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 20,
  },

  avatarWrapper: {
    alignItems: "center",
    marginBottom: 20,
  },

  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },

  changeText: {
    marginTop: 8,
    color: "#4CAF50",
  },

  card: {
    backgroundColor: "#F4F3EE",
    borderRadius: 20,
    padding: 16,
  },

  label: {
    fontSize: 13,
    color: "#777",
    marginTop: 10,
  },

  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    padding: 12,
    marginTop: 6,
  },

  button: {
    backgroundColor: "#333",
    padding: 14,
    borderRadius: 12,
    marginTop: 25,
  },

  buttonText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "600",
  },
});