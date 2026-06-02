import React, { useEffect, useState } from "react";
import {
  ScrollView,
  Text,
  View,
  StyleSheet,
} from "react-native";

import { generateRecommendations } from "../services/recommendationService";

import RecommendationCard from "../components/RecommendationCard";

import { useAuth } from "../../../services/firebase/AuthContext";

import {
  toggleDone,
  fetchRecommendationStatus,
} from "../services/recommendationStatusService";

import {
  calculateAccuracy,
  calculatePrecisionAtK,
  calculateRecallAtK,
  calculateF1Score,
  calculateEngagementRate,
} from "../utils/recommendationMetrics";

export default function RecommendationScreen({
  route,
}: any) {
  const { user } = useAuth();

  const mood = route.params?.todayMood;

  const [actions, setActions] = useState<any[]>([]);
  const [doneIds, setDoneIds] = useState<string[]>([]);

  const date = new Date()
    .toISOString()
    .split("T")[0];

  const logMetrics = (
    recommendationCount: number,
    completedCount: number
  ) => {
    const accuracy = calculateAccuracy(
      recommendationCount,
      completedCount
    );

    const precision = calculatePrecisionAtK(
      recommendationCount,
      completedCount
    );

    const recall = calculateRecallAtK(
      recommendationCount,
      completedCount
    );

    const f1 = calculateF1Score(
      precision,
      recall
    );

    const engagement =
      calculateEngagementRate(
        recommendationCount,
        completedCount
      );

    console.log(
      "========== RECOMMENDATION METRICS =========="
    );

    console.log(
      "Recommended:",
      recommendationCount
    );

    console.log(
      "Completed:",
      completedCount
    );

    console.log(
      "Accuracy:",
      accuracy + "%"
    );

    console.log(
      "Precision@K:",
      precision
    );

    console.log(
      "Recall@K:",
      recall
    );

    console.log(
      "F1 Score:",
      f1
    );

    console.log(
      "Engagement Rate:",
      engagement + "%"
    );

    console.log(
      "==========================================="
    );
  };

  useEffect(() => {
    if (!user?.uid || !mood) return;

    (async () => {
      try {
        const recs =
          await generateRecommendations(
            user.uid,
            mood
          );

        setActions(recs || []);

        const status =
          await fetchRecommendationStatus(
            user.uid,
            date
          );

        const done =
          status.doneActionIds || [];

        setDoneIds(done);

        logMetrics(
          recs.length,
          done.length
        );
      } catch (e) {
        console.log(
          "Recommendation Error:",
          e
        );

        setActions([]);
        setDoneIds([]);
      }
    })();
  }, [user, mood]);

  const handleToggle = async (
    action: any
  ) => {
    if (!user?.uid) return;

    try {
      await toggleDone(
        user.uid,
        date,
        action.id,
        action.exp || 0
      );

      const refreshed =
        await fetchRecommendationStatus(
          user.uid,
          date
        );

      const done =
        refreshed.doneActionIds || [];

      setDoneIds(done);

      logMetrics(
        actions.length,
        done.length
      );
    } catch (error) {
      console.log(
        "Toggle recommendation error:",
        error
      );
    }
  };

  return (
    <ScrollView style={styles.container}>
      {actions.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyText}>
            Không có gợi ý hôm nay 🌱
          </Text>
        </View>
      ) : (
        actions.map((action) => (
          <RecommendationCard
            key={action.id}
            action={action}
            done={doneIds.includes(
              action.id
            )}
            onToggle={() =>
              handleToggle(action)
            }
          />
        ))
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFBF2",
    padding: 16,
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