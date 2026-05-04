import React, { useState, useMemo } from "react";
import { View, Text, StyleSheet, Dimensions, Image } from "react-native";
import Svg, { Path, Circle, Line } from "react-native-svg";
import { moodData } from "../utils/moodData";
import { Feather } from "@expo/vector-icons";

/* ================== PROPS ================== */
interface Props {
  data: {
    values: number[]; // T2 -> CN (0..6)
    average: number;
    stableRate: number;
  };
  weekStartDate: Date; // 👉 Thứ 2 của tuần đang xem
}

/* ================== HELPERS ================== */
function getMonday(date: Date) {
  const d = new Date(date);
  const day = (d.getDay() + 6) % 7;
  d.setDate(d.getDate() - day);
  d.setHours(0, 0, 0, 0);
  return d;
}

export default function MoodChangeChart({
  data,
  weekStartDate,
}: Props) {
  const totalWidth = Dimensions.get("window").width - 40;

  const height = 200;
  const padTop = 12;
  const padBottom = 12;
  const svgHeight = height + padTop + padBottom;
  const innerHeight = height;

  const leftIconsWidth = 30;
  const paddingX = 6;
  const rightExtra = 12;

  const chartWidth =
    totalWidth - leftIconsWidth - paddingX * 2 - rightExtra;

  const FULL = 7;
  const allLabels = ["T2", "T3", "T4", "T5", "T6", "T7", "CN"];

  /* ================== DATA ================== */
  const values = data.values.slice(0, 7);
  const fullWeekValues = new Array(FULL).fill(0);
  values.forEach((v, i) => (fullWeekValues[i] = v));

  /* ================== TODAY LOGIC ================== */
  const isThisWeek =
    getMonday(new Date()).getTime() ===
    getMonday(weekStartDate).getTime();

  const todayIndex = isThisWeek
    ? new Date().getDay() === 0
      ? 6
      : new Date().getDay() - 1
    : null;

  /* ================== STATE ================== */
  const [selectedIndex, setSelectedIndex] = useState<number | null>(
    null
  );

  const displayIndex =
    selectedIndex !== null ? selectedIndex : todayIndex;

  const displayValue =
    displayIndex !== null ? fullWeekValues[displayIndex] : 0;

  const displayMood =
    moodData.find((m) => m.value === displayValue) ?? null;

  /* ================== POSITION ================== */
  const stepX = chartWidth / (FULL - 1);

  const getMoodY = (v: number) => {
    const value = Math.max(1, Math.min(5, v));
    const step = innerHeight / 4;
    return padTop + (innerHeight - (value - 1) * step);
  };

  const buildPath = () => {
    let d = "";
    let last: number | null = null;

    fullWeekValues.forEach((v, i) => {
      if (v === 0) return;
      const x = paddingX + i * stepX;
      const y = getMoodY(v);

      if (last === null) {
        d += `M ${x},${y}`;
      } else {
        const px = paddingX + last * stepX;
        const py = getMoodY(fullWeekValues[last]);
        const mx = (px + x) / 2;
        d += ` C ${mx},${py} ${mx},${y} ${x},${y}`;
      }
      last = i;
    });

    return d;
  };

  const path = buildPath();

  const dateForIndex = (i: number) => {
    const d = new Date(weekStartDate);
    d.setDate(weekStartDate.getDate() + i);
    return `${String(d.getDate()).padStart(2, "0")}/${String(
      d.getMonth() + 1
    ).padStart(2, "0")}`;
  };

  /* ================== RENDER ================== */
  return (
    <View style={styles.card}>
      {/* HEADER */}
      <View style={styles.header}>
        <View style={styles.headerRow}>
          <Feather name="trending-up" size={18} />
          <Text style={styles.title}>Thay đổi tâm trạng</Text>
        </View>

        <View style={styles.currentMoodBox}>
          {displayMood?.icon && (
            <Image
              source={displayMood.icon}
              style={{ width: 28, height: 28 }}
            />
          )}
          <Text style={styles.moodTitle}>
            {displayMood?.label ?? "Chưa có dữ liệu"}
          </Text>
          {displayIndex !== null && (
            <Text style={styles.moodDate}>
              Ngày {dateForIndex(displayIndex)}
            </Text>
          )}
        </View>
      </View>

      {/* CHART */}
      <View style={styles.row}>
        {/* LEFT ICONS */}
        <View style={{ width: leftIconsWidth, height: svgHeight }}>
          {moodData.map((m) => (
            <Image
              key={m.id}
              source={m.icon}
              style={[
                styles.icon,
                { top: getMoodY(m.value) - 14 },
              ]}
            />
          ))}
        </View>

        {/* SVG */}
        <Svg
          width={totalWidth - leftIconsWidth}
          height={svgHeight}
        >
          {[1, 2, 3, 4, 5].map((lv) => (
            <Line
              key={lv}
              x1={paddingX}
              x2={paddingX + chartWidth}
              y1={getMoodY(lv)}
              y2={getMoodY(lv)}
              stroke="#E5E7EB"
            />
          ))}

          {/* vertical line */}
          {displayIndex !== null && (
            <Line
              x1={paddingX + displayIndex * stepX}
              x2={paddingX + displayIndex * stepX}
              y1={padTop}
              y2={padTop + innerHeight}
              stroke="#7A6FF0"
              strokeDasharray="4,4"
            />
          )}

          <Path
            d={path}
            stroke="#7A6FF0"
            strokeWidth={2}
            fill="none"
          />

          {fullWeekValues.map((v, i) => {
            if (v === 0) return null;
            const mood = moodData.find((m) => m.value === v);
            if (!mood) return null;
            return (
              <Circle
                key={i}
                cx={paddingX + i * stepX}
                cy={getMoodY(v)}
                r={selectedIndex === i ? 9 : 7}
                fill={mood.color}
                stroke="#FFF"
                strokeWidth={3}
                onPress={() =>
                  setSelectedIndex((prev) =>
                    prev === i ? null : i
                  )
                }
              />
            );
          })}
        </Svg>
      </View>

      {/* X LABELS */}
      <View style={styles.xLabels}>
        {allLabels.map((lb, i) => {
          const isToday = isThisWeek && i === todayIndex;
          return (
            <Text
              key={i}
              style={[
                styles.xLabel,
                isToday && styles.todayLabel,
              ]}
            >
              {lb}
            </Text>
          );
        })}
      </View>

      {/* FOOTER */}
      <View style={styles.footer}>
        <View style={styles.footerBox}>
          <Text>Trung bình</Text>
          <Text style={styles.footerValue}>
            {data.average}/5
          </Text>
        </View>
        <View style={styles.footerBox}>
          <Text>Ổn định</Text>
          <Text style={styles.footerValue}>
            {data.stableRate}%
          </Text>
        </View>
      </View>
    </View>
  );
}

/* ================== STYLES ================== */
const styles = StyleSheet.create({
  card: {
    backgroundColor: "#FFF",
    padding: 12,
    borderRadius: 18,
    marginVertical: 10,
    borderWidth:1,
    borderColor:'#e4e4e4ff',
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
  currentMoodBox: {
    alignItems: "flex-end",
  },
  moodTitle: {
    fontSize: 14,
    fontWeight: "600",
  },
  moodDate: {
    fontSize: 12,
    color: "#9CA3AF",
  },
  row: {
    flexDirection: "row",
    marginTop: 14,
  },
  icon: {
    position: "absolute",
    width: 28,
    height: 28,
  },
  xLabels: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
    paddingLeft: 36,
    paddingRight: 18,
  },
  xLabel: {
    fontSize: 12,
    color: "#6B7280",
  },
  todayLabel: {
    fontWeight: "700",
    color: "#0C3D36",
  },
  footer: {
    flexDirection: "row",
    marginTop: 16,
  },
  footerBox: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "#F9FAFB",
    padding: 12,
    borderRadius: 12,
    marginHorizontal: 4,
  },
  footerValue: {
    fontSize: 18,
    fontWeight: "700",
    color: "#7A6FF0",
  },
});
