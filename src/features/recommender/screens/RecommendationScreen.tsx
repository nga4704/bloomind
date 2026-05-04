import React, { useEffect, useLayoutEffect, useState, useCallback } from "react";
import {
  ScrollView,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  View,
} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Feather } from "@expo/vector-icons";

import { useAuth } from "../../../services/firebase/AuthContext";
import RecommendationCard from "../components/RecommendationCard";

import { MoodLog } from "../types/mood";
import { RecommendationAction } from "../types/recommendation";
import { fetchTodayMoodLog } from "../services/moodLogsService";
import { analyzeMood } from "../services/moodAnalysis";
import { generateRecommendations } from "../services/recommender";

import {
  fetchRecommendationStatus,
  toggleRecommendationDone,
} from "../services/recommendationStatusService";

import { RootStackParamList } from "../../../app/navigation/types";

type Props = NativeStackScreenProps<
  RootStackParamList,
  "Recommendation"
>;

/* ================= DATE ================= */
function getTodayKeyLocal() {
  const now = new Date();
  const yyyy = now.getFullYear();
  const mm = String(now.getMonth() + 1).padStart(2, "0");
  const dd = String(now.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

export default function RecommendationScreen({ navigation, route }: Props) {
  const { user } = useAuth();

  const [loading, setLoading] = useState(true);
  const [todayMood, setTodayMood] = useState<MoodLog | null>(null);
  const [analysis, setAnalysis] = useState("");
  const [doneIds, setDoneIds] = useState<string[]>([]);
  const [actions, setActions] = useState<RecommendationAction[]>([]);
  const [hasInteracted, setHasInteracted] = useState(false);

  const todayKey = getTodayKeyLocal();

  /* ================= HEADER ================= */
  useLayoutEffect(() => {
    navigation.setOptions({
      title: "Gợi ý hôm nay",
      headerLeft: () => (
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={{ marginLeft: 16 }}
        >
          <Feather name="arrow-left" size={24} color="#333" />
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  /* ================= LOAD MOOD ================= */
  useEffect(() => {
    if (route.params?.todayMood) {
      setTodayMood(route.params.todayMood);
      setLoading(false);
      return;
    }

    const fetchMood = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        const log = await fetchTodayMoodLog(user.uid);
        setTodayMood(log);
      } catch {
        setTodayMood(null);
      } finally {
        setLoading(false);
      }
    };

    fetchMood();
  }, [route.params, user]);

  /* ================= ANALYSIS ================= */
  useEffect(() => {
    if (loading) {
      setAnalysis("Đang tải dữ liệu tâm trạng ⏳");
      return;
    }

    if (!todayMood) {
      setAnalysis("Bạn chưa có dữ liệu hôm nay 🌱");
      return;
    }

    const insight = analyzeMood(todayMood);
    setAnalysis(insight.summary);
  }, [todayMood, loading]);

  /* ================= RECOMMEND ================= */
  useEffect(() => {
    if (!todayMood) {
      setActions([]);
      return;
    }

    const fetchActions = async () => {
      try {
        const result = await generateRecommendations(todayMood);
        setActions(result);
      } catch {
        setActions([]);
      }
    };

    fetchActions();
  }, [todayMood]);

  /* ================= LOAD STATUS ================= */
  useEffect(() => {
    if (!user || hasInteracted) return;

    const loadStatus = async () => {
      try {
        const res = await fetchRecommendationStatus(user.uid, todayKey);
        setDoneIds(res.doneIds);
      } catch {}
    };

    loadStatus();
  }, [user, todayKey, hasInteracted]);

  /* ================= TOGGLE ================= */
  const handleToggle = async (action: RecommendationAction) => {
    if (!user) return;

    setHasInteracted(true);

    const alreadyDone = doneIds.includes(action.id);
    const expValue = action.exp ?? 0;

    // optimistic UI
    setDoneIds(prev =>
      alreadyDone
        ? prev.filter(id => id !== action.id)
        : [...prev, action.id]
    );

    try {
      await toggleRecommendationDone(
        user.uid,
        todayKey,
        action.id,
        expValue,
        alreadyDone
      );
    } catch {
      // rollback nếu lỗi
      setDoneIds(prev =>
        alreadyDone
          ? [...prev, action.id]
          : prev.filter(id => id !== action.id)
      );
    }
  };

  /* ================= UI ================= */
  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ paddingBottom: 30 }}
    >
      {/* 💛 ANALYSIS */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>💛 Tâm trạng hôm nay</Text>
        <Text style={styles.analysis}>{analysis}</Text>
      </View>

      {/* ⏳ LOADING */}
      {loading && (
        <ActivityIndicator style={{ marginTop: 40 }} size="large" />
      )}

      {/* ❌ NO MOOD */}
      {!loading && !todayMood && (
        <View style={styles.emptyBox}>
          <Text style={styles.empty}>
            Hãy ghi lại tâm trạng để nhận gợi ý nhé 🌱
          </Text>

          <TouchableOpacity
            style={styles.primaryBtn}
            onPress={() =>
              navigation.navigate("MoodTracking", { mode: "create" })
            }
          >
            <Text style={styles.primaryText}>Ghi mood</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* 😌 NO ACTION */}
      {!loading && todayMood && actions.length === 0 && (
        <Text style={styles.empty}>Chưa có gợi ý phù hợp 😌</Text>
      )}

      {/* 🎯 ACTIONS */}
      {!loading &&
        todayMood &&
        actions.map(item => (
          <View key={item.id} style={styles.actionWrapper}>
            <RecommendationCard
              action={item}
              done={doneIds.includes(item.id)}
              onToggle={() => handleToggle(item)}
            />
          </View>
        ))}
    </ScrollView>
  );
}

/* ================= STYLES ================= */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fffbf2",
    padding: 16,
  },

  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,

    // shadow nhẹ
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },

  cardTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 6,
  },

  analysis: {
    fontSize: 14,
    color: "#555",
    lineHeight: 20,
  },

  emptyBox: {
    marginTop: 40,
    alignItems: "center",
  },

  empty: {
    fontSize: 14,
    color: "#999",
    textAlign: "center",
    marginBottom: 12,
  },

  primaryBtn: {
    backgroundColor: "#FFB84D",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 12,
  },

  primaryText: {
    color: "#fff",
    fontWeight: "600",
  },

  actionWrapper: {
    marginBottom: 12,
  },
});