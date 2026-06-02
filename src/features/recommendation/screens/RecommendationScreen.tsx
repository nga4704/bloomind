import React, { useEffect, useState } from "react";
import { ScrollView, Text, View, ActivityIndicator, StyleSheet } from "react-native";
import { generateRecommendations } from "../services/recommendationService";
import RecommendationCard from "../components/RecommendationCard";
import { useAuth } from "../../../services/firebase/AuthContext";
import { toggleDone, fetchRecommendationStatus } from "../services/recommendationStatusService";

export default function RecommendationScreen({ route }: any) {
  const { user } = useAuth();
  const mood = route.params?.todayMood;

  const [actions, setActions] = useState<any[]>([]);
  const [doneIds, setDoneIds] = useState<string[]>([]);

  const date = new Date().toISOString().split("T")[0];

  useEffect(() => {
    if (!user?.uid || !mood) return;

    (async () => {
      try {
        // 1. load recommendations
        const recs = await generateRecommendations(user.uid, mood);
        setActions(recs || []);
        

        // 2. load done status
        const status = await fetchRecommendationStatus(user.uid, date);
        setDoneIds(status.doneActionIds || []);
      } catch (e) {
        console.log("ERROR:", e);
        setActions([]);
      }
    })();
  }, [user, mood]);

  const handleToggle = async (action: any) => {
    if (!user?.uid) return;

    await toggleDone(
      user.uid,
      date,
      action.id,
      action.exp || 0
    );

    const refreshed = await fetchRecommendationStatus(user.uid, date);
    setDoneIds(refreshed.doneActionIds || []);

    // refresh local state
    const updated = doneIds.includes(action.id)
      ? doneIds.filter(id => id !== action.id)
      : [...doneIds, action.id];

    setDoneIds(updated);
  };

  return (
    <ScrollView style={styles.container}>
      {actions.length === 0 ? (
        <Text style={{ marginTop: 40, textAlign: "center", color: "#888" }}>
          Không có gợi ý hôm nay 🌱
        </Text>
      ) : (
        actions.map((a) => (
          <RecommendationCard
            key={a.id}
            action={a}
            done={doneIds.includes(a.id)}
            onToggle={() => handleToggle(a)}
          />
        ))
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: "#FFFBF2",
  },

  title: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 12,
    color: "#222",
  },

  empty: {
    marginTop: 40,
    alignItems: "center",
  },

  emptyText: {
    color: "#888",
    fontSize: 14,
    textAlign: "center",
  },
});