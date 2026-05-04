import React, { useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
} from "react-native";
import { moodData } from "../utils/moodData";
import { useNavigation } from "@react-navigation/native";
import Feather from "@expo/vector-icons/Feather";
// type
export type MoodByDay = { day: number; moodId: string | null };

interface Props {
  year: number;
  moodByYear: MoodByDay[][];
  streak?: {
    current: number;
    longest: number;
    totalEntries: number;
  };
  onPressMonth?: (monthIndex: number) => void;
}

const MONTH_NAMES_SHORT = [
  "Thg 1", "Thg 2", "Thg 3", "Thg 4", "Thg 5", "Thg 6",
  "Thg 7", "Thg 8", "Thg 9", "Thg 10", "Thg 11", "Thg 12"
];
const NUM_COLUMNS = 3;

export default function MoodYearMiniMonths({ year, moodByYear, streak, onPressMonth }: Props) {
  const navigation = useNavigation<any>();

  const months = useMemo(() => {
    const arr: MoodByDay[][] = [];
    for (let m = 0; m < 12; m++) {
      arr.push(moodByYear && moodByYear[m] ? moodByYear[m] : []);
    }
    return arr;
  }, [moodByYear]);

  const renderMonthCard = (monthIndex: number) => {
    const monthData = months[monthIndex] || [];
    const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();

    const firstDay = new Date(year, monthIndex, 1).getDay();
    const startIndex = firstDay === 0 ? 6 : firstDay - 1;

    const cells: (MoodByDay | null)[] = [];
    for (let i = 0; i < startIndex; i++) cells.push(null);
    for (let d = 1; d <= daysInMonth; d++) {
      const dayObj = monthData.find((x) => x.day === d);
      cells.push(dayObj ? dayObj : { day: d, moodId: null });
    }
    while (cells.length % 7 !== 0) cells.push(null);

    const dotColor = (cell: MoodByDay | null) => {
      if (!cell) return "#fff";
      if (!cell.moodId) return "#EEF2FF";
      const m = moodData.find((mm) => mm.id === cell.moodId);
      return (m && m.color) || "#D1D5DB";
    };

    return (
      <TouchableOpacity
        key={`mini-${monthIndex}`}
        activeOpacity={0.8}
        style={styles.miniCard}
        onPress={() => {
          if (onPressMonth) onPressMonth(monthIndex);
          else
            navigation.navigate("MonthDetail", {
              month: monthIndex + 1,
              year: year,
            });
        }}
      >
        <Text style={styles.miniTitle}>{MONTH_NAMES_SHORT[monthIndex]}</Text>

        <View style={styles.miniGrid}>
          {cells.map((cell, idx) => (
            <View key={idx} style={styles.miniCell}>
              <View style={[styles.dot, { backgroundColor: dotColor(cell) }]} />
            </View>
          ))}
        </View>
      </TouchableOpacity>
    );
  };

  const items = Array.from({ length: 12 }, (_, i) => i);

  return (
    <View style={styles.container}>
      {/* Year Streak */}
      {streak && (
        <View style={styles.streakCard}>

          {/* HEADER */}
          <View style={styles.headerRow}>
            <Feather name="zap" size={18} color="#333" />
            <Text style={styles.title}>Chuỗi ngày liên tiếp</Text>
          </View>

          {/* Top stats */}
          <View style={styles.streakStatsRow}>
            <View style={[styles.statBox, { backgroundColor: "#E7F6ED" }]}>
              <Feather name="clock" size={16} color="#4CAF50" />
              <Text style={styles.statLabel}>Hiện tại</Text>
              <Text style={styles.statValue}>{streak.current}</Text>
            </View>

            <View style={[styles.statBox, { backgroundColor: "#FFEAEA" }]}>
              <Feather name="award" size={16} color="#F44336" />
              <Text style={styles.statLabel}>Dài nhất</Text>
              <Text style={styles.statValue}>{streak.longest}</Text>
            </View>

            <View style={[styles.statBox, { backgroundColor: "#FFF7E1" }]}>
              <Feather name="check-circle" size={16} color="#FFC107" />
              <Text style={styles.statLabel}>Số lần ghi</Text>
              <Text style={styles.statValue}>{streak.totalEntries}</Text>
            </View>
          </View>

        </View>
      )}

      {/* Mini months */}
      <FlatList
        data={items}
        keyExtractor={(i) => `m-${i}`}
        numColumns={NUM_COLUMNS}
        columnWrapperStyle={styles.columnWrapper}
        renderItem={({ item }) => renderMonthCard(item)}
        scrollEnabled={false}
        contentContainerStyle={{ paddingBottom: 6 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
    backgroundColor: "#fff",
    borderRadius: 20
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  title: { fontSize: 16, fontWeight: "600", marginLeft: 8 },
  columnWrapper: {
    justifyContent: "center",
    columnGap: 8,
    rowGap: 8,
    marginBottom: 8,
  },
  miniCard: {
    flex: 1,
    maxWidth: "31%",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 8,
    alignItems: "center",
  },
  miniTitle: {
    fontSize: 12,
    fontWeight: "600",
    color: "#374151",
    alignSelf: "flex-start",
    marginBottom: 6,
    marginLeft: 6,
  },
  miniGrid: {
    width: "100%",
    flexDirection: "row",
    flexWrap: "wrap",
  },
  miniCell: {
    width: `${100 / 7}%`,
    paddingVertical: 2,
    alignItems: "center",
  },
  dot: {
    width: "45%",
    aspectRatio: 1,
    borderRadius: 999,
    backgroundColor: "#F3F4F6",
  },

  streakCard: {
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 12,
    marginBottom: 2,
  },
  streakTitle: { fontSize: 14, fontWeight: "600", marginBottom: 8 },
  streakStatsRow: { flexDirection: "row", justifyContent: "space-between" },
  statBox: {
    width: "32%",
    paddingVertical: 10,
    borderRadius: 12,
    alignItems: "center",
  },
  statLabel: { fontSize: 12, color: "#666", textAlign: "center", marginTop:4},
  statValue: { fontSize: 14, fontWeight: "600", marginTop: 2, textAlign: "center", },
});
