import React, { useMemo } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { moodData } from "../utils/moodData";
import { Feather } from "@expo/vector-icons";

interface MoodByDay {
  day: number;
  moodId: string | null;
}

interface Props {
  month: number;
  year: number;
  moodByMonth: MoodByDay[]; 
  onPressBar?: (weekdayIndex: number, avg: number | null) => void;
}

const WEEK_LABELS = ["T2", "T3", "T4", "T5", "T6", "T7", "CN"];
const WEEK_NAMES = ["Thứ 2", "Thứ 3", "Thứ 4", "Thứ 5", "Thứ 6", "Thứ 7", "Chủ nhật"];
const MAX_MOOD_VALUE = 5; 

export default function MoodWeekdayBarChart({ month, year, moodByMonth, onPressBar }: Props) {
  // tính average mood cho từng weekday (Mon=0..Sun=6)
  const byWeekday = useMemo(() => {
    const sums = Array(7).fill(0);
    const counts = Array(7).fill(0);

    moodByMonth.forEach((d) => {
      if (!d) return;
      const date = new Date(year, month, d.day);
      const jsWeek = date.getDay(); // 0=Sun..6=Sat
      const weekday = jsWeek === 0 ? 6 : jsWeek - 1; // convert to Mon=0..Sun=6

      if (d.moodId) {
        const m = moodData.find((x) => x.id === d.moodId);
        if (m && typeof m.value === "number") {
          sums[weekday] += m.value;
          counts[weekday] += 1;
        }
      }
    });

    return sums.map((s, idx) => {
      const c = counts[idx];
      return c > 0 ? +(s / c).toFixed(2) : null;
    });
  }, [month, year, moodByMonth]);

  // tìm ngày tốt nhất / tệ nhất (tính trên giá trị trung bình)
  const { bestIdx, bestVal, worstIdx, worstVal } = useMemo(() => {
    let bestIdx: number | null = null;
    let worstIdx: number | null = null;
    let bestVal: number | null = null;
    let worstVal: number | null = null;

    byWeekday.forEach((v, idx) => {
      if (v === null) return;
      if (bestVal === null || v > bestVal) {
        bestVal = v;
        bestIdx = idx;
      }
      if (worstVal === null || v < worstVal) {
        worstVal = v;
        worstIdx = idx;
      }
    });

    return {
      bestIdx,
      bestVal,
      worstIdx,
      worstVal,
    };
  }, [byWeekday]);

  // max height px of chart area
  const CHART_HEIGHT = 120;

  return (
    <View style={styles.card}>
      {/* HEADER */}
      <View style={styles.headerRow}>
        <Feather name="bar-chart" size={18}  />
        <Text style={styles.headerText}>Tâm trạng trung bình</Text>
      </View>

      <View style={styles.chartRow}>

        {/* bars */}
        <View style={styles.barsColumn}>
          <View style={[styles.barsInner, { height: CHART_HEIGHT }]}>
            {byWeekday.map((avg, idx) => {
              const heightPercent = avg !== null ? (avg / MAX_MOOD_VALUE) : 0;
              const barHeight = Math.max(6, Math.round(heightPercent * CHART_HEIGHT)); // minimal visible
              return (
                <TouchableOpacity
                  key={idx}
                  activeOpacity={0.8}
                  style={styles.barWrapper}
                  onPress={() => onPressBar && onPressBar(idx, avg)}
                >
                  <View style={styles.barContainer}>
                    <View style={[styles.bar, { height: barHeight }]} />
                  </View>
                  <Text style={styles.barLabel}>{WEEK_LABELS[idx]}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      </View>

      {/* Best / Worst boxes */}
      <View style={styles.bestWorstRow}>
        <View style={styles.infoBox}>
          <Text style={styles.infoTitle}>Ngày tốt nhất</Text>
          {bestIdx !== null ? (
            <>
              <Text style={styles.infoMain}>{WEEK_NAMES[bestIdx]}</Text>
            </>
          ) : (
            <Text style={styles.infoEmpty}>–</Text>
          )}
        </View>

        <View style={styles.infoBox}>
          <Text style={styles.infoTitle}>Ngày tệ nhất</Text>
          {worstIdx !== null ? (
            <>
              <Text style={styles.infoMain}>{WEEK_NAMES[worstIdx]}</Text>
            </>
          ) : (
            <Text style={styles.infoEmpty}>–</Text>
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginVertical: 10,
    borderWidth:1,
    borderColor:'#e4e4e4ff',
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  headerText: {
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 6,
  },

  chartRow: { flexDirection: "row", alignItems: "flex-end" , marginTop:30},
  scaleColumn: {
    width: 28,
    alignItems: "center",
    marginRight: 8,
  },
  scaleLabel: { fontSize: 11, color: "#9CA3AF" },

  barsColumn: { flex: 1 },
  barsInner: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    paddingHorizontal: 4,
  },

  barWrapper: {
    width: "13%", 
    alignItems: "center",
  },

  barContainer: {
    width: "100%",
    alignItems: "center",
    justifyContent: "flex-end",
  },

  bar: {
    width: "70%",
    backgroundColor: "#b5ffd5ff",
    borderRadius: 6,
  },

  barLabel: {
    marginTop: 6,
    fontSize: 12,
    color: "#374151",
    textAlign: "center",
  },

  avgLabel: {
    fontSize: 10,
    color: "#6B7280",
    marginTop: 2,
  },

  bestWorstRow: {
    marginTop: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 8,
  },
  infoBox: {
    flex: 1,
    backgroundColor: "#f7f7f7",
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 12,
    alignItems: "center",
  },
  infoTitle: {
    fontSize: 12,
    color: "#6B7280",
    marginBottom: 6,
  },
  infoMain: {
    fontSize: 14,
    fontWeight: "700",
    color: "#111827",
  },
  infoSub: {
    fontSize: 12,
    color: "#374151",
    marginTop: 4,
  },
  infoEmpty: {
    fontSize: 14,
    color: "#9CA3AF",
  },
});
