import React from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { RecommendationAction } from "../types/recommendation";

const ICON_MAP: Record<
  RecommendationAction["category"],
  keyof typeof Ionicons.glyphMap
> = {
  mind: "heart-outline",
  body: "walk-outline",
  quick: "flash-outline",
};

function formatDuration(min: number, max: number) {
  return min === max ? `${min} phút` : `${min}–${max} phút`;
}

interface Props {
  action: RecommendationAction;
  done: boolean;
  onToggle: () => void;
}

export default function RecommendationCard({
  action,
  done,
  onToggle,
}: Props) {
  const expValue = action.exp ?? 0;

  return (
    <Pressable
      onPress={() => {
        console.log("Pressable onPress triggered for action:", action.id); // Thêm log
        onToggle();
      }}
      style={({ pressed }) => [
        styles.card,
        done && styles.cardDone,
        pressed && { opacity: 0.85 },
      ]}
    >
      <View style={styles.iconWrap}>
        <Ionicons
          name={ICON_MAP[action.category]}
          size={22}
          color={done ? "#6AA84F" : "#555"}
        />
      </View>

      <View style={styles.content}>
        <Text style={styles.time}>
          ⏱ {formatDuration(action.duration.min, action.duration.max)} · +{expValue} EXP
        </Text>

        <Text style={[styles.title, done && styles.titleDone]}>
          {action.title}
        </Text>

        <Text style={styles.desc}>{action.description}</Text>
      </View>

      <Ionicons
        name={done ? "checkmark-circle" : "ellipse-outline"}
        size={26}
        color={done ? "#6AA84F" : "#999"}
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 22,
    marginBottom: 14,
    elevation: 2,
    borderWidth: 1,
    borderColor: "#6AA84F",
  },
  cardDone: {
    backgroundColor: "#f3ffe8",
  },
  iconWrap: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: "#ebffda",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 14,
  },
  content: { flex: 1 },
  time: {
    fontSize: 12,
    color: "#6AA84F",
    marginBottom: 2,
  },
  title: {
    fontSize: 15,
    fontWeight: "500",
    color: "#222",
    marginBottom: 4,
  },
  titleDone: {
    textDecorationLine: "line-through",
    color: "#6AA84F",
  },
  desc: {
    fontSize: 13,
    color: "#999",
  },
});