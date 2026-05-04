import { View, Text, StyleSheet, Pressable, Image } from "react-native";
import Feather from "@expo/vector-icons/Feather";
import { StreakData } from "../types/analysis.types";
import { useNavigation } from "@react-navigation/native";
import { moodData } from "../utils/moodData";
import dayjs from "dayjs";

interface Props {
  streak: StreakData;
}

export default function StreakCard({ streak }: Props) {
  const navigation = useNavigation<any>();
  const weekDays = ["T2", "T3", "T4", "T5", "T6", "T7", "CN"];
  const todayStr = dayjs().format("YYYY-MM-DD");

  return (
    <View style={styles.card}>
      {/* ===== HEADER ===== */}
      <View style={styles.headerRow}>
        <Feather name="zap" size={18} />
        <Text style={styles.title}>Chuỗi ngày liên tiếp</Text>
      </View>

      {/* ===== STATS ===== */}
      <View style={styles.statsRow}>
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

      {/* ===== WEEK ROW ===== */}
      <View style={styles.weekRow}>
        {streak.days.map((d, idx) => {
          const mood = d.moodId
            ? moodData.find((m) => m.id === d.moodId)
            : null;

          const disabled = d.isFuture;
          const isToday = d.date === todayStr;

          return (
            <Pressable
              key={idx}
              disabled={disabled}
              onPress={() => {
                if (disabled) return;

                if (d.hasMood) {
                  navigation.navigate("MoodHistory", {
                    date: d.date,
                  });
                } else {
                  navigation.navigate("MoodTracking", {
                    date: d.date,
                    mode: "create",
                  });
                }
              }}
              style={styles.cellWrapper}
            >
               {/* ===== WEEKDAY ===== */}
              <Text style={styles.dayText}>{weekDays[idx]}</Text>

              {/* ===== CELL ===== */}
              <View
                style={[
                  styles.cell,
                  disabled && styles.futureCell,
                  isToday && styles.todayCell,
                ]}
              >
                {d.hasMood && mood ? (
                  <Image source={mood.icon} style={styles.moodIcon} />
                ) : !disabled ? (
                  <Feather name="plus" size={16} color="#999" />
                ) : null}
              </View>

             
              {/* ===== DATE ===== */}
              <Text style={[styles.dateText, isToday && styles.todayText]}>
                {dayjs(d.date).format("DD")}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: "#e4e4e4ff",
  },

  /* ===== HEADER ===== */
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },

  /* ===== STATS ===== */
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  statBox: {
    width: "32%",
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
  },
  statLabel: {
    fontSize: 12,
    color: "#666",
    marginTop: 4,
    textAlign: "center",
  },
  statValue: {
    fontSize: 16,
    fontWeight: "700",
    marginTop: 2,
    textAlign: "center",
  },

  /* ===== WEEK ===== */
  weekRow: {
    flexDirection: "row",
    justifyContent: "center",
  },
  cellWrapper: {
    alignItems: "center",
    flex: 1,
    marginVertical: 10,
  },
  cell: {
    width: 30,
    height: 30,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 4,
    borderWidth: 1,
    borderColor: "#e8e8e8ff",
  },
  futureCell: {
    backgroundColor: "#F3F4F6",
  },

  /* ===== TODAY ===== */
  todayCell: {
    borderWidth: 1,
    borderColor: "#636363ff",
  },

  /* ===== TEXT ===== */
  dayText: {
    fontSize: 12,
    textAlign: "center",
    marginBottom:4
  },
  dateText: {
    fontSize: 11,
    color: "#999",
  },
  todayText: {
    color: "#414141ff",
    fontWeight: "600",
  },

  /* ===== ICON ===== */
  moodIcon: {
    width: 28,
    height: 28,
    resizeMode: "contain",
  },
});
