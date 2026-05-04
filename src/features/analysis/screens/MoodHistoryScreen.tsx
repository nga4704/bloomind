// MoodHistoryScreen.tsx
import React, { useEffect, useState, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { RouteProp, useRoute, useNavigation } from "@react-navigation/native";
import { Feather } from "@expo/vector-icons";
import { doc, getDoc } from "firebase/firestore";
import { auth, firestore } from "../../../services/firebase/firebaseConfig";
import { moodData } from "../utils/moodData";
import { ACTIVITIES } from "../utils/activities";
import dayjs from "dayjs";

type Params = {
  MoodHistory: {
    date: string; // YYYY-MM-DD
  };
};

export default function MoodHistoryScreen() {
  const route = useRoute<RouteProp<Params, "MoodHistory">>();
  const navigation = useNavigation();
  const { date } = route.params;

  const [loading, setLoading] = useState(true);
  const [moodLog, setMoodLog] = useState<{
    moodId: string;
    activities?: string[];
    detailMoods?: string[];
    note?: string;
  } | null>(null);

  const isToday = useMemo(
    () => dayjs(date).isSame(dayjs(), "day"),
    [date]
  );

  useEffect(() => {
    const loadMoodLog = async () => {
      const user = auth.currentUser;
      if (!user) return;

      const ref = doc(firestore, "users", user.uid, "moodLogs", date);
      const snap = await getDoc(ref);

      if (snap.exists()) {
        setMoodLog(snap.data() as any);
      }

      setLoading(false);
    };

    loadMoodLog();
  }, [date]);

  const mood = moodLog
    ? moodData.find((m) => m.id === moodLog.moodId)
    : null;

  if (loading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Feather
          name="chevron-left"
          size={22}
          onPress={() => navigation.goBack()}
        />

        <Text style={styles.headerTitle}>
          Lịch sử - {dayjs(date).format("DD/MM/YYYY")}
        </Text>

        {isToday && (
          <TouchableOpacity
            style={styles.editBtn}
            onPress={() =>
              navigation.navigate("MoodTracking", {
                mode: "edit",
                date,
              })
            }
          >
            <Feather name="edit-2" size={18} />
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.card}>
        {/* Mood */}
        <View style={styles.moodRow}>
          <View style={styles.moodCircle}>
            {mood?.icon ? (
              <Image source={mood.icon} style={styles.moodBigIcon} />
            ) : (
              <Feather name="smile" size={28} />
            )}
          </View>

          <View style={{ marginLeft: 12 }}>
            <Text style={styles.moodLabel}>
              {mood?.label || "Chưa chọn"}
            </Text>
            <Text style={styles.moodNoteDate}>
              {dayjs(date).format("DD/MM/YYYY")}
            </Text>
          </View>
        </View>

        {/* Detail moods */}
        <View style={{ marginTop: 18 }}>
          <Text style={styles.sectionTitle}>Cảm xúc cụ thể</Text>
          <View style={styles.emotionsRow}>
            {moodLog?.detailMoods?.length ? (
              moodLog.detailMoods.map((emo) => (
                <View key={emo} style={styles.emotionChip}>
                  <Text style={styles.emotionText}>{emo}</Text>
                </View>
              ))
            ) : (
              <Text style={styles.emptyText}>Không có</Text>
            )}
          </View>
        </View>

        {/* Activities */}
        <View style={{ marginTop: 18 }}>
          <Text style={styles.sectionTitle}>Hoạt động</Text>
          <View style={styles.activitiesRow}>
            {moodLog?.activities?.length ? (
              moodLog.activities.map((id) => {
                const act = ACTIVITIES.find((a) => a.id === id);
                return (
                  <View
                    key={id}
                    style={[
                      styles.activityChip,
                      { backgroundColor: act?.color || "#eee" },
                    ]}
                  >
                    <Feather
                      name={(act?.icon as any) || "circle"}
                      size={14}
                    />
                    <Text style={styles.activityLabel}>
                      {act?.label || id}
                    </Text>
                  </View>
                );
              })
            ) : (
              <Text style={styles.emptyText}>Không có</Text>
            )}
          </View>
        </View>

        {/* Note */}
        <View style={{ marginTop: 18 }}>
          <Text style={styles.sectionTitle}>Ghi chú</Text>
          <View style={styles.noteBox}>
            <Text style={styles.noteText}>
              {moodLog?.note || "Không có ghi chú"}
            </Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, backgroundColor: "#fffbf2" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  headerTitle: {
    marginLeft: 12,
    fontSize: 16,
    fontWeight: "600",
    flex: 1,
  },
  editBtn: {
    padding: 6,
  },
  loading: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
  },
  moodRow: { flexDirection: "row", alignItems: "center" },
  moodCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: "center",
    alignItems: "center",
  },
  moodBigIcon: { width: 80, height: 80, resizeMode: "contain" },
  moodLabel: { fontSize: 18, fontWeight: "700" },
  moodNoteDate: { color: "#6B7280", marginTop: 6 },

  sectionTitle: {
    fontSize: 13,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 8,
  },

  emotionsRow: { flexDirection: "row", flexWrap: "wrap" },
  emotionChip: {
    backgroundColor: "#E8F2FF",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    marginRight: 8,
    marginBottom: 8,
  },
  emotionText: { fontSize: 13 },

  activitiesRow: { flexDirection: "row", flexWrap: "wrap" },
  activityChip: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 12,
    marginRight: 8,
    marginBottom: 8,
    gap: 6,
  },
  activityLabel: { fontSize: 13 },

  emptyText: { color: "#9CA3AF" },

  noteBox: {
    backgroundColor: "#fbfbff",
    padding: 12,
    borderRadius: 8,
    minHeight: 64,
  },
  noteText: { color: "#374151" },
});
