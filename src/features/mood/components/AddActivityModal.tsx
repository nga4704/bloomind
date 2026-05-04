// components/AddActivityModal.tsx
import React, { useState } from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  ScrollView,
} from "react-native";
import { Feather } from "@expo/vector-icons";

interface Props {
  visible: boolean;
  onClose: () => void;
  onAdd: (item: {
    id: string;
    label: string;
    icon: string;
    color: string;
  }) => void;
}

// Icon list
const featherIcons = [
  "camera",
  "tv",
  "target",
  "shopping-cart",
  "gift",
  "calendar",
  "clock",
    "droplet",
  "umbrella", "edit",  
  "message-square",
  "phone-call",
  "video",
  "users",
  "music",
  "youtube",
  "heart",
  "smile",
  "frown",
];

// Pastel color palette
const colors = [
  "#F8D7DA", // pastel red
  "#FDEBD0", // pastel orange
  "#FCF3CF", // pastel yellow
  "#D4EFDF", // pastel green
  "#D6EAF8", // pastel blue
  "#E8DAEF", // pastel purple
  "#F2F3F4", // gray
  "#EDEDED", // default
];

const AddActivityModal = ({ visible, onClose, onAdd }: Props) => {
  const [label, setLabel] = useState("");
  const [selectedIcon, setSelectedIcon] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string>("#EDEDED");

  const handleAdd = () => {
    if (!label || !selectedIcon) return;

    onAdd({
      id: label.toLowerCase().replace(/\s+/g, "-"),
      label,
      icon: selectedIcon,
      color: selectedColor,
    });

    setLabel("");
    setSelectedIcon(null);
    setSelectedColor("#EDEDED");
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.modalBox}>
          <Text style={styles.title}>Tạo hoạt động</Text>

          {/* Input */}
          <TextInput
            placeholder="Tên hoạt động..."
            value={label}
            onChangeText={setLabel}
            style={styles.input}
          />

          {/* Icon List */}
          <Text style={styles.subTitle}>Chọn icon:</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={{ marginVertical: 12 }}
          >
            {featherIcons.map((name) => (
              <TouchableOpacity
                key={name}
                onPress={() => setSelectedIcon(name)}
                style={[
                  styles.iconBox,
                  selectedIcon === name && styles.iconSelected,
                ]}
              >
                <Feather name={name as any} size={26} color="#333" />
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Color List */}
          {/* <Text style={styles.subTitle}>Chọn màu:</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={{ marginVertical: 8 }}
          >
            {colors.map((c) => (
              <TouchableOpacity
                key={c}
                onPress={() => setSelectedColor(c)}
                style={[
                  styles.colorCircle,
                  { backgroundColor: c },
                  selectedColor === c && styles.colorSelected,
                ]}
              />
            ))}
          </ScrollView> */}

          {/* Buttons */}
          <View style={styles.actions}>
            <TouchableOpacity onPress={onClose} style={styles.cancel}>
              <Text>Hủy</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={handleAdd} style={styles.addBtn}>
              <Text style={{ color: "#fff", fontWeight: "600" }}>Thêm</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default AddActivityModal;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.4)",
    padding: 20,
  },
  modalBox: {
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
  },
  subTitle: {
    marginTop: 10,
    fontWeight: "500",
    fontSize: 14,
    color: "#444",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    padding: 12,
    marginTop: 15,
    fontSize: 16,
  },
  iconBox: {
    padding: 12,
    borderRadius: 12,
    backgroundColor: "#f4f4f4",
    marginRight: 10,
  },
  iconSelected: {
    borderWidth: 2,
    borderColor: "#333",
    backgroundColor: "#eaeaea",
  },
  colorCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 10,
    borderWidth: 1,
    borderColor: "#ccc",
  },
  colorSelected: {
    borderWidth: 2,
    borderColor: "#333",
  },
  actions: {
    marginTop: 18,
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  cancel: {
    padding: 10,
    marginRight: 10,
  },
  addBtn: {
    backgroundColor: "#333",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
});
