import React from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { RecommendationAction } from "../types/recommendation";

function formatDuration(min: number, max: number) {
  return min === max ? `${min} phút` : `${min}–${max} phút`;
}

/* ================= ICON LOGIC ================= */
function getIcon(action: RecommendationAction) {
  switch (action.id) {
    case "deep_rest":
      return "bed-outline";

    case "power_nap":
      return "moon-outline";

    case "grounding":
      return "leaf-outline";

    case "breathing":
      return "heart-outline";

    case "walk":
      return "walk-outline";

    case "journal_reflection":
      return "create-outline";

    case "music_relax":
      return "musical-notes-outline";

    case "gratitude":
      return "flower-outline";

    case "celebrate":
      return "trophy-outline";

    case "exercise":
      return "barbell-outline";

    case "stretching":
      return "body-outline";

    default:
      return "sparkles-outline";
  }
}

function getCategoryColor(category?: string) {
  switch (category) {
    case "mind":
      return "#7C5CFF";
    case "body":
      return "#4CAF50";
    case "quick":
      return "#FFB020";
    default:
      return "#999";
  }
}

export default function RecommendationCard({
  action,
  done,
  onToggle,
}: {
  action: RecommendationAction;
  done: boolean;
  onToggle: () => void;
}) {
  const color = getCategoryColor(action.category);
  const icon = getIcon(action);

  return (
    <Pressable
      onPress={onToggle}
      style={({ pressed }) => [
        styles.card,
        done && styles.cardDone,
        pressed && { transform: [{ scale: 0.98 }], opacity: 0.9 },
      ]}
    >
      {/* ICON */}
      <View style={[styles.iconWrap, { backgroundColor: color + "20" }]}>
        <Ionicons name={icon} size={18} color={color} />
      </View>

      {/* CONTENT */}
      <View style={styles.content}>
        <View style={styles.titleRow}>
          <Text style={[styles.title, done && styles.titleDone]}>
            {action.title}
          </Text>

          {done && (
            <Ionicons name="checkmark-circle" size={18} color="#4CAF50" />
          )}
        </View>

        {!!action.reason && (
          <Text style={styles.reason} numberOfLines={2}>
            {action.reason}
          </Text>
        )}

        <View style={styles.metaRow}>
          <View style={styles.pill}>
            <Ionicons name="time-outline" size={12} color="#386d3f" />
            <Text style={styles.pillText}>
              {formatDuration(action.duration?.min ?? 0, action.duration?.max ?? 0)}
            </Text>
          </View>

          <View style={[styles.pill, styles.expPill]}>
            <Ionicons name="flash-outline" size={12} color="#FFB020" />
            <Text style={[styles.pillText, { color: "#FFB020" }]}>
              +{action.exp ?? 0} EXP
            </Text>
          </View>
        </View>
      </View>

      {!done && <Ionicons name="ellipse-outline" size={20} color="#ccc" />}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 14,
    borderRadius: 18,
    marginBottom: 12,

    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 2,
  },

  cardDone: {
    backgroundColor: "#F3FFF4",
    borderWidth: 1,
    borderColor: "#D9F7DC",
  },

  iconWrap: {
    width: 38,
    height: 38,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },

  content: {
    flex: 1,
  },

  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  title: {
    fontSize: 15,
    fontWeight: "600",
    color: "#1f1f1f",
    flex: 1,
    paddingRight: 8,
  },

  titleDone: {
    textDecorationLine: "line-through",
    color: "#4CAF50",
  },

  reason: {
    fontSize: 12,
    color: "#777",
    marginTop: 4,
    lineHeight: 16,
  },

  metaRow: {
    flexDirection: "row",
    marginTop: 10,
    gap: 8,
  },

  pill: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f0ffe5",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 999,
    gap: 4,
  },

  expPill: {
    backgroundColor: "#FFF7E6",
  },

  pillText: {
    fontSize: 11,
    color: "#386d3f",
    fontWeight: "500",
  },
});