import React from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import Svg, { Circle, G } from "react-native-svg";
import { MoodSummaryData } from "../types/analysis.types";
import { moodData } from "../utils/moodData";
import { Feather } from "@expo/vector-icons";

interface Props {
  data: MoodSummaryData;
}

export default function MoodSummaryCard({ data }: Props) {
  const r = 80;
  const strokeWidth = 18;

  const C = 2 * Math.PI * r; // full circumference
  const H = C / 2; // half circle
  const totalPercent = data.moodCounts.reduce((s, it) => s + it.percent, 0);

  const normalized = data.moodCounts.map((m) => {
    const pct = totalPercent > 0 ? m.percent / totalPercent : 0;
    return {
      ...m,
      pct,
      length: Math.max(pct * H, 3),
    };
  });

  let accumulated = 0;

  return (
    <View style={styles.card}>
      {/* HEADER */}
      <View style={styles.headerRow}>
        <Feather name="pie-chart" size={18}  />
        <Text style={styles.title}>Đếm tâm trạng</Text>
      </View>
      <View style={styles.gaugeWrapper}>
        <Svg width={240} height={160}>
          <G rotation={-180} originX={120} originY={120}>

            {/* <G rotation={-90} originX={120} originY={120}> */}
            {/* background half circle */}
            <Circle
              cx={120}
              cy={120}
              r={r}
              stroke="#f0f0f0"
              strokeWidth={strokeWidth}
              fill="transparent"
              strokeDasharray={`${H}, ${C}`}
              strokeDashoffset={0}
              strokeLinecap="round"
            />

            {/* segments */}
            {normalized.map((m, idx) => {
              const mood = moodData.find((x) => x.id === m.mood);
              const color =
                mood?.color ??
                ["#FF9AA2", "#FFDAC1", "#E2F0CB", "#B5EAD7", "#C7CEEA"][idx % 5];

              const dashArray = `${m.length}, ${C}`;
              const dashOffset = accumulated * -1;

              accumulated += m.length;

              return (
                <Circle
                  key={m.mood}
                  cx={120}
                  cy={120}
                  r={r}
                  stroke={color}
                  strokeWidth={strokeWidth}
                  fill="transparent"
                  strokeDasharray={dashArray}
                  strokeDashoffset={dashOffset}
                  strokeLinecap="round"
                />
              );
            })}
          </G>
        </Svg>

        {/* center text */}
        <View style={styles.centerLabel}>
          <Text style={styles.totalNumber}>{data.totalEntries}</Text>
          <Text style={styles.totalLabel}>Tổng số</Text>
        </View>
      </View>

      {/* Mood rows */}
      {data.moodCounts.map((item) => {
        const mood = moodData.find((m) => m.id === item.mood);
        if (!mood) return null;

        const pct = totalPercent ? Math.round((item.percent / totalPercent) * 100) : 0;

        return (
          <View key={item.mood} style={styles.row}>
            <Image source={mood.icon} style={styles.icon} />
            <View style={{ flex: 1 }}>
              <Text style={styles.label}>{mood.label}</Text>
              <View style={styles.barBg}>
                <View
                  style={[
                    styles.barFill,
                    { width: `${pct}%`, backgroundColor: mood.color },
                  ]}
                />
              </View>
            </View>
            <Text style={styles.percent}>
              {item.count} / {pct}%
            </Text>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 16,
    marginVertical:10,
    borderWidth:1,
    borderColor:'#e4e4e4ff',
  },
    headerRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8
  },
  gaugeWrapper: {
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  centerLabel: {
    position: "absolute",
    top: 75,
    alignItems: "center",
  },
  totalNumber: {
    fontSize: 26,
    fontWeight: "700",
  },
  totalLabel: {
    fontSize: 13,
    marginTop: -4,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 14,
  },
  icon: {
    width: 36,
    height: 36,
    marginRight: 12,
  },
  label: {
    fontSize: 15,
    marginBottom: 4,
  },
  barBg: {
    width: "100%",
    height: 6,
    backgroundColor: "#eee",
    borderRadius: 6,
  },
  barFill: {
    height: 6,
    borderRadius: 6,
  },
  percent: {
    marginLeft: 8,
    fontSize: 13,
    fontWeight: "500",
    minWidth: 50,
    textAlign: "right",
  },
});
