import { View, Text, StyleSheet, Pressable, Image } from "react-native";
import Feather from "@expo/vector-icons/Feather";
import { StreakMonthData } from "../types/analysis.types";
import { moodData } from "../utils/moodData";
import dayjs from "dayjs";
import { useNavigation } from "@react-navigation/native";

interface Props {
    year: number;
    month: number; // 0..11
    streak: StreakMonthData;
}

const weekDays = ["T2", "T3", "T4", "T5", "T6", "T7", "CN"];

export default function StreakMonthCard({ year, month, streak }: Props) {
    const navigation = useNavigation<any>();
    const todayStr = dayjs().format("YYYY-MM-DD");

    /** ===== CALCULATE OFFSET =====
     * dayjs().day(): 0 (CN) -> 6 (T7)
     * convert to Monday-based index (T2 = 0)
     */
    const firstDayIndex = dayjs(new Date(year, month, 1)).day();
    const startOffset = firstDayIndex === 0 ? 6 : firstDayIndex - 1;

    return (
        <View style={styles.card}>
            {/* ===== HEADER ===== */}
            <View style={styles.headerRow}>
                <Feather name="zap" size={18} />
                <Text style={styles.title}>Chuỗi liên tiếp</Text>
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

            {/* ===== WEEK HEADER ===== */}
            <View style={styles.weekHeader}>
                {weekDays.map((d) => (
                    <Text key={d} style={styles.weekDayText}>{d}</Text>
                ))}
            </View>

            {/* ===== CALENDAR ===== */}
            <View style={styles.calendar}>
                {/* OFFSET EMPTY CELLS */}
                {Array.from({ length: startOffset }).map((_, i) => (
                    <View key={`empty-${i}`} style={styles.dayWrapper} />
                ))}

                {/* DAYS */}
                {streak.days.map((d, idx) => {
                    const day = idx + 1;
                    const dateStr = dayjs(new Date(year, month, day)).format("YYYY-MM-DD");
                    const isToday = dateStr === todayStr;

                    const mood = d.moodId
                        ? moodData.find((m) => m.id === d.moodId)
                        : null;

                    return (
                        <View key={day} style={styles.dayWrapper}>
                            <Pressable
                                disabled={d.isFuture}
                                onPress={() => {
                                    if (d.isFuture) return;

                                    if (d.hasMood) {
                                        navigation.navigate("MoodHistory", { date: dateStr });
                                    } else {
                                        navigation.navigate("MoodTracking", {
                                            date: dateStr,
                                            mode: "create",
                                        });
                                    }
                                }}
                                style={[
                                    styles.dayCell,
                                    d.isFuture && styles.futureCell,
                                    isToday && styles.todayCell,
                                ]}
                            >
                                {d.hasMood && mood ? (
                                    <Image source={mood.icon} style={styles.moodIcon} />
                                ) : !d.isFuture ? (
                                    <Feather name="plus" size={16} color="#999" />
                                ) : null}
                            </Pressable>

                            {/* DAY NUMBER */}
                            <Text style={[styles.dayText, isToday && styles.todayText]}>
                                {day}
                            </Text>
                        </View>
                    );
                })}
            </View>
        </View>
    );
}

/* ================== SUB COMPONENT ================== */
function Stat({
    icon,
    label,
    value,
    color,
}: {
    icon: any;
    label: string;
    value: number;
    color: string;
}) {
    return (
        <View style={[styles.statBox, { backgroundColor: color }]}>
            <Feather name={icon} size={16} />
            <Text style={styles.statLabel}>{label}</Text>
            <Text style={styles.statValue}>{value}</Text>
        </View>
    );
}

/* ================== STYLES ================== */
const styles = StyleSheet.create({
    card: {
        backgroundColor: "#fff",
        padding: 16,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: "#e4e4e4",
    },

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

    statsRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 12,
    },
    statBox: {
        width: "32%",
        paddingVertical: 10,
        borderRadius: 10,
        alignItems: "center",
    },
    statLabel: { fontSize: 12, color: "#666" },
    statValue: { fontSize: 16, fontWeight: "700" },

    /* ===== WEEK HEADER ===== */
    weekHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 6,
    },
    weekDayText: {
        width: "13%",
        textAlign: "center",
        fontSize: 12,
        fontWeight: "600",
        color: "#888",
    },

    /* ===== CALENDAR ===== */
    calendar: {
        flexDirection: "row",
        flexWrap: "wrap",
    },

    dayWrapper: {
        width: `${100 / 7}%`,
        alignItems: "center",
        marginBottom: 10,
    },

    dayCell: {
        width: 36,
        height: 36,
        aspectRatio: 1,
        borderRadius: 999,
        borderWidth: 1,
        borderColor: "#e8e8e8",
        justifyContent: "center",
        alignItems: "center",
    },

    futureCell: {
        backgroundColor: "#F3F4F6",
    },

    todayCell: {
        borderColor: "#5c5c5c",
    },

    moodIcon: {
        width: 30,
        height: 30,
        resizeMode: "contain",
    },

    dayText: {
        fontSize: 11,
        color: "#333",
        marginTop: 2,
    },

    todayText: {
        fontWeight: "700",
        color: "#515151",
    },
});
