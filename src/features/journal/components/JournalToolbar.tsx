import React, { useState } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Platform,
  Alert,
  Modal,
  Text,
} from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { Audio } from "expo-av";

const JournalToolbar = ({
  onInsertImage,
  onInsertAudio,
  onFormat,
  onBullet,
  onAddIcon,
}: any) => {
  const [recording, setRecording] = useState<any>(null);
  const [showEditor, setShowEditor] = useState(false);

  // -------------------------------
  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.8,
    });

    if (!result.canceled) {
      // onAddImage(result.assets[0].uri);
    }
  };

  // -------------------------------
  const handleImage = async () => {
    Alert.alert("Thêm ảnh", "Bạn muốn chọn hay chụp ảnh?", [
      {
        text: "Chọn ảnh",
        onPress: async () => {
          let result: any = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            quality: 0.8,
          });
          if (!result.canceled) onInsertImage(result.assets[0].uri);
        },
      },
      {
        text: "Chụp ảnh",
        onPress: async () => {
          let result: any = await ImagePicker.launchCameraAsync({
            quality: 0.8,
          });
          if (!result.canceled) onInsertImage(result.assets[0].uri);
        },
      },
      { text: "Hủy", style: "cancel" },
    ]);
  };

  // -------------------------------
  // RECORD AUDIO
  // -------------------------------
  const handleRecord = async () => {
    if (recording) {
      await recording.stopAndUnloadAsync();
      const uri = recording.getURI();
      setRecording(null);
      onInsertAudio(uri);
      Alert.alert("Đã lưu ghi âm!");
      return;
    }

    try {
      const { status } = await Audio.requestPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Cần quyền microphone");
        return;
      }

      const newRec = new Audio.Recording();
      await newRec.prepareToRecordAsync(Audio.RecordingOptionsPresets.HIGH_QUALITY);
      await newRec.startAsync();

      setRecording(newRec);
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <>
      {/* ---------- TEXT EDITOR PANEL ---------- */}
      {showEditor && (
        <View style={styles.editorPanel}>
          <Text style={styles.editorTitle}>Chỉnh sửa</Text>

          {/* STYLE */}
          <View style={styles.row}>
            <TouchableOpacity
              style={styles.editorBtn}
              onPress={() => onFormat("style", "bold")}
            >
              <MaterialCommunityIcons name="format-bold" size={20} />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.editorBtn}
              onPress={() => onFormat("style", "italic")}
            >
              <MaterialCommunityIcons name="format-italic" size={20} />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.editorBtn}
              onPress={() => onFormat("style", "underline")}
            >
              <MaterialCommunityIcons name="format-underline" size={20} />
            </TouchableOpacity>
          </View>

          {/* FONT SIZE */}
          <View style={styles.row}>
            <TouchableOpacity
              style={styles.editorBtn}
              onPress={() => onFormat("size", "decrease")}
            >
              <MaterialCommunityIcons name="format-font-size-decrease" size={20} />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.editorBtn}
              onPress={() => onFormat("size", "increase")}
            >
              <MaterialCommunityIcons name="format-font-size-increase" size={20} />
            </TouchableOpacity>
          </View>

          {/* ALIGN / BULLET */}
          <View style={styles.row}>
            <TouchableOpacity
              style={styles.editorBtn}
              onPress={() => onBullet()}
            >
              <MaterialCommunityIcons name="format-list-bulleted" size={20} />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.editorBtn}
              onPress={() => onFormat("align", "left")}
            >
              <MaterialCommunityIcons name="format-align-left" size={20} />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.editorBtn}
              onPress={() => onFormat("align", "center")}
            >
              <MaterialCommunityIcons name="format-align-center" size={20} />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.editorBtn}
              onPress={() => onFormat("align", "right")}
            >
              <MaterialCommunityIcons name="format-align-right" size={20} />
            </TouchableOpacity>
          </View>

          {/* COLORS */}
          <View style={[styles.row, styles.colorRow]}>
            {[
              "#FFB3BA",
              "#FFD6A5",
              "#FDFFB6",
              "#CAFFBF",
              "#b1cefe",
              "#cbc2ff",
            ].map((c, i) => (
              <TouchableOpacity
                key={i}
                onPress={() => onFormat("color", c)}
                style={[styles.colorDot, { backgroundColor: c }]}
              />
            ))}
          </View>


          <TouchableOpacity
            onPress={() => setShowEditor(false)}
            style={styles.closeBtn}
          >
            <Text style={styles.closeText}>Đóng</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* ---------- MAIN TOOLBAR ---------- */}
      <View style={styles.toolbarContainer}>
        <View style={styles.toolbarContent}>
          {/* IMAGE */}
          <TouchableOpacity onPress={handleImage} style={styles.iconButton}>
            <Ionicons name="image-outline" size={26} color="#333" />
          </TouchableOpacity>

          {/* AUDIO */}
          <TouchableOpacity onPress={handleRecord} style={styles.iconButton}>
            <MaterialCommunityIcons
              name={recording ? "microphone" : "microphone-outline"}
              size={28}
              color={recording ? "#E74C3C" : "#333"}
            />
          </TouchableOpacity>

          {/* TEXT EDITOR */}
          <TouchableOpacity
            onPress={() => setShowEditor(!showEditor)}
            style={styles.iconButton}
          >
            <MaterialCommunityIcons name="format-text-variant" size={28} color="#333" />
          </TouchableOpacity>


          {/* BULLET LIST */}
          <TouchableOpacity onPress={() => onBullet()} style={styles.iconButton}>
            <MaterialCommunityIcons name="format-list-bulleted" size={28} color="#333" />
          </TouchableOpacity>
        </View>
      </View>
    </>
  );
};

export default JournalToolbar;

const styles = StyleSheet.create({
  /* ================= TOOLBAR ================= */
  toolbarContainer: {
    position: "absolute",
    bottom: 16,
    left: 16,
    right: 16,

    backgroundColor: "#fff",
    borderRadius: 20,

    paddingVertical: 10,

    /* Shadow iOS */
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },

    /* Shadow Android */
    elevation: 6,
  },

  toolbarContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
  },

  iconButton: {
    padding: 12,
    borderRadius: 12,
  },

  /* ================= EDITOR PANEL ================= */
  editorPanel: {
    position: "absolute",
    bottom: 90,
    left: 0,
    right: 0,

    backgroundColor: "#fff",
    padding: 16,

    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,

    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: -4 },

    elevation: 10,
  },

  editorTitle: {
    fontWeight: "700",
    fontSize: 16,
    marginBottom: 14,
    color: "#1C1C1E",
    textAlign: "center",
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },

  /* ================= COLOR DOT ================= */
  colorDot: {
    width: 28,
    height: 28,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#E5E5EA",
  },
  colorRow: {
    paddingHorizontal: 12,
  },
  /* ================= BUTTON ================= */
  editorBtn: {
    flex: 1,
    marginHorizontal: 4,
    paddingVertical: 10,

    backgroundColor: "#F2F2F7",
    borderRadius: 12,

    alignItems: "center",
  },

  editorBtnText: {
    fontSize: 13,
    fontWeight: "500",
    color: "#333",
  },

  /* ================= CLOSE ================= */
  closeBtn: {
    marginTop: 10,
    alignItems: "center",
  },

  closeText: {
    color: "#000",
    fontWeight: "600",
  },
});