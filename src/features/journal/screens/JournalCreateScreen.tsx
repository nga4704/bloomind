import React, { useState, useLayoutEffect, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  ImageBackground,
  Image,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Ionicons, Feather } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";

import { useBlurOnLeave } from "../hooks/useBlurOnLeave";
import {
  saveJournal,
  getJournalById,
} from "../services/journal.service";
import { JournalBlock } from "../types/journal";
import { nanoid } from "nanoid/non-secure";
import { uploadJournalImage } from "../services/image.service";
import { deleteJournal } from "../services/journal.service";
import { getMoodByDate } from "../../../features/mood/services/mood.service";
import { moodData } from "../../../utils/moodData";

const JournalCreateScreen = () => {
  useBlurOnLeave();

  const navigation: any = useNavigation();
  const route: any = useRoute();

  const journalId = route.params?.journalId;

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isDatePickerVisible, setDatePickerVisible] = useState(false);
  const [blocks, setBlocks] = useState<JournalBlock[]>([]);
  const [mood, setMood] = useState<any>(null);

  const moodItem = moodData.find((m) => m.id === mood?.id);

  /* ================= LOAD DATA (EDIT) ================= */
  useEffect(() => {
    if (!journalId) return;

    const load = async () => {
      const data = await getJournalById(journalId);
      if (!data) return;

      const titleBlock = data.blocks?.find(
        (b: any) =>
          b.type === "text" &&
          b.style?.variant === "title"
      );

      const bodyBlock = data.blocks?.find(
        (b: any) =>
          b.type === "text" &&
          b.style?.variant === "body"
      );

      setTitle(titleBlock?.text || "");
      setContent(bodyBlock?.text || "");

      const rawDate = data.date;
      let parsedDate = new Date();

      if (rawDate?.toDate) {
        parsedDate = rawDate.toDate();
      } else if (rawDate) {
        parsedDate = new Date(rawDate);
      }

      setSelectedDate(parsedDate);

      const imageBlocks =
        data.blocks?.filter((b: any) => b.type === "image") || [];
      setBlocks(imageBlocks);
    };

    load();
  }, [journalId]);

  useEffect(() => {
    const loadMood = async () => {
      const data = await getMoodByDate(selectedDate);
      setMood(data);
    };

    loadMood();
  }, [selectedDate]);

  /* ================= IMAGE ================= */
  const handleInsertImage = async (uri: string) => {
    try {
      alert("Đang upload ảnh...");
      const url = await uploadJournalImage(uri);

      setBlocks((prev) => [
        ...prev,
        {
          id: nanoid(),
          type: "image",
          url,
        },
      ]);

      alert("Đã thêm ảnh");
    } catch (e) {
      console.error(e);
      alert("Upload ảnh thất bại");
    }
  };

  /* ================= SAVE ================= */
  const handleSave = async () => {
    if (!title.trim() && !content.trim() && blocks.length === 0) {
      alert("Journal không thể trống");
      return;
    }

    const finalBlocks: JournalBlock[] = [];

    if (title.trim()) {
      finalBlocks.push({
        id: "title",
        type: "text",
        text: title.trim(),
        style: { variant: "title" },
      });
    }

    if (content.trim()) {
      finalBlocks.push({
        id: "content",
        type: "text",
        text: content.trim(),
        style: { variant: "body" },
      });
    }

    finalBlocks.push(...blocks);

    try {
      await saveJournal({
        journalId,
        date: selectedDate,
        blocks: finalBlocks,
      });

      alert(journalId ? "Đã cập nhật" : "Đã lưu");
      navigation.goBack();
    } catch (error) {
      console.error(error);
      alert("Lỗi khi lưu");
    }
  };

  /* ================= DELETE ================= */
  const handleDelete = async () => {
    if (!journalId) return;

    const confirm = window.confirm
      ? window.confirm("Bạn có chắc muốn xoá journal này?")
      : true;

    if (!confirm) return;

    try {
      await deleteJournal(journalId);
      alert("Đã xoá 🗑");
      navigation.goBack();
    } catch (e) {
      console.error(e);
      alert("Xoá thất bại ❌");
    }
  };

  /* ================= HEADER ================= */
  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: "",
      headerShadowVisible: false,
      headerStyle: { backgroundColor: "#fffbf2", paddingTop: 20, },
      headerTopInsetEnabled: true,
      headerStatusBarHeight: 20,
      headerLeft: () => (
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={{ paddingHorizontal: 8 }}
        >
          <Ionicons name="arrow-back" size={24} color="#1C1C1E" />
        </TouchableOpacity>
      ),

      headerRight: () => (
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <TouchableOpacity onPress={handleSave} style={styles.saveButton}>
            <Text style={styles.saveText}>Lưu</Text>
          </TouchableOpacity>

          {journalId && (
            <TouchableOpacity
              onPress={handleDelete}
              style={{ marginRight: 12 }}
            >
              <Ionicons name="trash-outline" size={22} color="#000" />
            </TouchableOpacity>
          )}
        </View>
      ),
    });
  }, [navigation, title, content, selectedDate, blocks]);

  /* ================= SAFE DATE ================= */
  const safeDate =
    selectedDate instanceof Date && !isNaN(selectedDate.getTime())
      ? selectedDate
      : new Date();

  const day = safeDate.getDate();

  const monthYear = safeDate.toLocaleString("vi-VN", {
    month: "long",
    year: "numeric",
  });

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <View style={styles.body}>
          {/* DATE */}
          <TouchableOpacity
            onPress={() => setDatePickerVisible(true)}
            style={styles.dateRow}
          >
            <View
              style={{ flexDirection: "row", alignItems: "center", flex: 1 }}
            >
              <View style={styles.dayWrapper}>
                <Text style={styles.dateNumber}>{day}</Text>
                <View style={styles.dayUnderline} />
              </View>

              <Text style={styles.dateText}>{monthYear}</Text>
              <Feather name="chevron-down" size={18} />
            </View>

            {moodItem && (
              <Image source={moodItem.icon} style={styles.moodIconLarge} />
            )}
          </TouchableOpacity>

          {/* DATE PICKER */}
          {isDatePickerVisible && (
            <DateTimePicker
              value={selectedDate}
              mode="date"
              display={Platform.OS === "ios" ? "spinner" : "default"}
              onChange={(event, date) => {
                setDatePickerVisible(false);
                if (date) setSelectedDate(date);
              }}
            />
          )}

          {/* TITLE */}
          <TextInput
            style={styles.titleInput}
            placeholder="Tiêu đề"
            value={title}
            onChangeText={setTitle}
          />

          {/* CONTENT */}
          <ImageBackground
            source={require("../../../assets/images/journal_bg.jpg")}
            style={styles.contentBg}
            imageStyle={styles.contentBgImage}
          >
            <TextInput
              style={styles.contentInput}
              placeholder="Bạn đang nghĩ gì ...."
              placeholderTextColor="#888"
              value={content}
              onChangeText={setContent}
              multiline
            />
          </ImageBackground>

          {/* IMAGE PREVIEW */}
          {blocks.map((b) =>
            b.type === "image" ? (
              <View key={b.id} style={{ marginTop: 10 }}>
                <Text>Image</Text>
              </View>
            ) : null
          )}
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default JournalCreateScreen;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fffbf2",
  },

  container: {
    flex: 1,
    backgroundColor: "#fffbf2",
  },

  body: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 80,
  },
  contentBg: {
    flex: 1,
    borderRadius: 16,
    overflow: "hidden",
    padding: 12,
    marginTop: 6,
  },

  contentBgImage: {
    opacity: 0.9,
    borderRadius: 16,
  },
  /* ================= HEADER BUTTON ================= */
  saveButton: {
    backgroundColor: "#CBF993",
    paddingHorizontal: 14,
    paddingVertical: 6,
    marginRight: 12,
    borderRadius: 10,
  },

  saveText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#65900B",
  },

  /* ================= DATE ================= */
  dayWrapper: {
    position: "relative",
    marginRight: 6,
  },

  dayUnderline: {
    position: "absolute",
    bottom: 2,
    left: 0,
    width: 18,
    height: 4,
    backgroundColor: "#CBF993",
    borderRadius: 2,
  },
  dateRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },

  dateNumber: {
    fontSize: 26,
    fontWeight: "700",
    color: "#2E2E2E",
    marginRight: 6,
  },
  moodIconLarge: {
    width: 40,
    height: 40,
    marginRight: 8,
  },
  dateText: {
    fontSize: 14,
    color: "#6E6E6E",
    marginRight: 6,
  },
  webOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.2)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 999,
  },

  webPickerBox: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 16,
    alignItems: "center",
    width: 260,
  },

  webInput: {
    padding: 10,
    borderRadius: 10,
    // border: "1px solid #ccc",
    width: "100%",
    marginBottom: 12,
  },

  webCloseBtn: {
    paddingVertical: 6,
  },
  /* ================= TITLE ================= */
  titleInput: {
    fontSize: 22,
    fontWeight: "700",
    color: "#1C1C1E",
    marginBottom: 8,
    padding: 0,
  },

  /* ================= CONTENT ================= */
  contentInput: {
    flex: 1,
    fontSize: 16,
    color: "#333",
    lineHeight: 26,
    textAlignVertical: "top",
  },

  /* ================= IMAGE PREVIEW ================= */
  imagePreviewBox: {
    marginTop: 12,
    borderRadius: 12,
    overflow: "hidden",
    backgroundColor: "#F5F5F5",
    padding: 10,
  },

  imagePreviewText: {
    fontSize: 13,
    color: "#777",
  },
});