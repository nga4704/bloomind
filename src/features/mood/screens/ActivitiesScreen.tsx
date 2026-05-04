// screens/ActivitiesScreen.tsx
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { useRoute, RouteProp } from "@react-navigation/native";
import AddActivityModal from "../components/AddActivityModal";

import { DETAIL_MOODS } from "../utils/detailMoods";
import { RootStackParamList } from "../../../app/navigation/types";
import { auth, firestore } from "../../../services/firebase/firebaseConfig";

import {
  collection,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
} from "firebase/firestore";

import dayjs from "dayjs";
import { saveOrUpdateMoodLog } from "../services/saveOrUpdateMoodLog";
import { addActivityToFirebase } from "../services/activityService";
import { ActivityItem } from "../utils/activities";

type RouteProps = RouteProp<RootStackParamList, "Activities">;

const ActivitiesScreen = ({ navigation }: any) => {
  const route = useRoute<RouteProps>();
  const { moodId, mode, date } = route.params || {};

  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [selected, setSelected] = useState<string[]>([]);
  const [notes, setNotes] = useState("");
  const [detailMoods, setDetailMoods] = useState<string[]>([]);
  const [showModal, setShowModal] = useState(false);

  const targetDate = date;
  const isEditToday = mode === "edit";

  /* ================= LOAD USER ACTIVITIES ================= */
  useEffect(() => {
    const loadActivities = async () => {
      const user = auth.currentUser;
      if (!user) return;

      const ref = collection(firestore, "users", user.uid, "activities");
      const q = query(ref, orderBy("createdAt", "asc"));
      const snap = await getDocs(q);

      const list: ActivityItem[] = snap.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          label: data.label,
          icon: data.icon,
          color: data.color,
          isDefault: data.isDefault ?? false,
        };
      });

      setActivities(list);
    };

    loadActivities();
  }, []);

  /* ================= LOAD TODAY LOG (EDIT MODE) ================= */
  useEffect(() => {
    if (!isEditToday || !targetDate) return;

    const loadLog = async () => {
      const user = auth.currentUser;
      if (!user) return;

      const ref = doc(firestore, "users", user.uid, "moodLogs", targetDate);
      const snap = await getDoc(ref);

      if (snap.exists()) {
        const data = snap.data();
        setDetailMoods(data.detailMoods || []);
        setSelected(data.activities || []);
        setNotes(data.note || "");
      }
    };

    loadLog();
  }, [isEditToday, targetDate]);

  /* ================= HANDLERS ================= */
  const toggleSelect = (id: string) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const toggleDetailMood = (item: string) => {
    setDetailMoods((prev) => {
      if (prev.includes(item)) return prev.filter((x) => x !== item);
      if (prev.length >= 3) return prev;
      return [...prev, item];
    });
  };

  const handleAddActivity = async (newItem: ActivityItem) => {
    const user = auth.currentUser;
    if (!user) return;

    await addActivityToFirebase(user.uid, newItem);

    setActivities((prev) => [...prev, newItem]);
  };

  const handleSave = async () => {
    const user = auth.currentUser;
    if (!user || !moodId) return;

    await saveOrUpdateMoodLog(user.uid, {
      moodId,
      moodLabel: moodId,
      detailMoods,
      activities: selected,
      note: notes,
      date: targetDate ?? dayjs().format("YYYY-MM-DD"),
    });

    Alert.alert(
      "Thành công",
      isEditToday
        ? "Mood hôm nay đã được cập nhật"
        : "Mood hôm nay đã được lưu"
    );

    navigation.navigate("MoodTrackingSaved");
  };

  /* ================= RENDER ================= */
  const renderActivityTag = (item: ActivityItem) => {
    const isSelected = selected.includes(item.id);

    return (
      <TouchableOpacity
        key={item.id}
        onPress={() => toggleSelect(item.id)}
        activeOpacity={0.8}
        style={[
          styles.activityTag,
          isSelected && styles.activityTagSelected,
        ]}
      >
        <Feather
          name={item.icon as any}
          size={20}
          color={isSelected ? "#484848" : "#7a7a7a"}
        />
        <Text
          style={[
            styles.activityLabel,
            isSelected && styles.activityLabelSelected,
          ]}
        >
          {item.label}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={{ paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
        {/* DETAIL MOOD */}
        <View style={styles.detailMoodSection}>
          <Text style={styles.detailQuestion}>
            Cảm xúc cụ thể?
            <Text style={styles.detailHint}> (Chọn tối đa 3)</Text>
          </Text>

          <View style={styles.detailTags}>
            {(DETAIL_MOODS[moodId ?? ""] || []).map((item) => {
              const active = detailMoods.includes(item);
              return (
                <TouchableOpacity
                  key={item}
                  style={[
                    styles.detailTag,
                    active && styles.detailTagActive,
                  ]}
                  onPress={() => toggleDetailMood(item)}
                >
                  <Text
                    style={[
                      styles.detailTagText,
                      active && styles.detailTagTextActive,
                    ]}
                  >
                    {item}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        <Text style={styles.title}>Hôm nay bạn đã làm gì?</Text>

        <View style={styles.grid}>
          {activities.map(renderActivityTag)}

          <TouchableOpacity
            style={styles.newTag}
            onPress={() => setShowModal(true)}
          >
            <Text>＋ Thêm</Text>
          </TouchableOpacity>
        </View>

        <TextInput
          placeholder="Bạn đang cảm thấy thế nào..."
          value={notes}
          onChangeText={setNotes}
          style={styles.input}
          multiline
        />
      </ScrollView>

      <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
        <Text style={styles.saveText}>Lưu</Text>
      </TouchableOpacity>

      <AddActivityModal
        visible={showModal}
        onClose={() => setShowModal(false)}
        onAdd={handleAddActivity}
      />
    </View>
  );
};

export default ActivitiesScreen;


/* ================= STYLES ================= */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
    backgroundColor: "#fffbf2",
  },

  /* Detail mood */
  detailMoodSection: { marginBottom: 24 },
  detailQuestion: { fontSize: 16, fontWeight: "400", marginBottom: 16 },
  detailHint: { fontSize: 14, color: "#888" },

  detailTags: {
    flexDirection: "row",
    flexWrap: "wrap",
  },

  detailTag: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 20,
    backgroundColor: "#fff",
    margin: 4,
  },

  detailTagActive: { backgroundColor: "#ffe1ec" },
  detailTagText: { fontSize: 14, color: "#555" },
  detailTagTextActive: { color: "#000", fontWeight: "500" },

  title: {
    fontSize: 16,
    fontWeight: "400",
    marginBottom: 16,
  },

  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "flex-start",
  },

  /* Activity tag (gộp từ ActivityTag.tsx) */
  activityTag: {
    flexDirection: "row",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 20,
    gap: 6,
    backgroundColor: "#fff",
    margin: 4,
  },

  activityTagSelected: {
    backgroundColor: "#DCFFCB",
  },

  activityLabel: {
    fontSize: 14,
    color: "#555",
  },

  activityLabelSelected: {
    color: "#000",
    fontWeight: "500",
  },

  newTag: {
    backgroundColor: "#fff",
    borderRadius: 20,
    paddingVertical: 11,
    paddingHorizontal: 16,
    margin: 4,
    borderWidth: 1,
    borderColor: "#a8a8a8",
    alignItems: "center",
    justifyContent: "center",
  },

  input: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 15,
    marginTop: 30,
    minHeight: 90,
    textAlignVertical: "top",
    fontSize: 15,
    borderWidth: 1,
    borderColor: "#acacac",
  },

  saveBtn: {
    margin: 20,
    backgroundColor: "#444",
    paddingVertical: 14,
    borderRadius: 30,
    alignItems: "center",
  },

  saveText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
});
