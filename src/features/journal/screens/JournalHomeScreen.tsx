import React, { useState, useCallback, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from "react-native";
import { Ionicons, Feather } from "@expo/vector-icons";
import { useNavigation, useFocusEffect } from "@react-navigation/native";

import { getJournalsByYear } from "../services/journal.service";
import { moodData } from "../../mood/utils/moodData";
import { getJournalByDate } from "../services/journal.service";
import { getMoodByDate } from "../../mood/services/mood.service";

const JournalHomeScreen = () => {
  const navigation: any = useNavigation();

  const [year, setYear] = useState(new Date().getFullYear());
  const [journals, setJournals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  /* ================= LOAD DATA ================= */
  useFocusEffect(
    useCallback(() => {
      const loadData = async () => {
        setLoading(true);
        const data = await getJournalsByYear(year);
        setJournals(data);
        setLoading(false);
      };

      loadData();
    }, [year])
  );

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* ================= HEADER ================= */}
        <View style={styles.headerRow}>
          <View style={styles.yearRow}>
            <TouchableOpacity onPress={() => setYear(year - 1)}>
              <Ionicons name="chevron-back" size={22} />
            </TouchableOpacity>

            <Text style={styles.yearText}>{year}</Text>

            <TouchableOpacity onPress={() => setYear(year + 1)}>
              <Ionicons name="chevron-forward" size={22} />
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={styles.addBtn}
            onPress={async () => {
              const today = new Date();

              const existing = await getJournalByDate(today);

              if (existing) {
                navigation.navigate("JournalCreate", {
                  journalId: existing.id,
                });
              } else {
                navigation.navigate("JournalCreate");
              }
            }}
          >
            <Feather name="edit-3" size={18} color="#65900B" />
          </TouchableOpacity>
        </View>

        {/* ================= CONTENT ================= */}
        {loading ? (
          <View style={{ padding: 16 }}>
            {[1, 2, 3].map((i) => (
              <View key={i} style={styles.skeletonCard} />
            ))}
          </View>
        ) : journals.length === 0 ? (
          <View style={styles.emptyBox}>
            <Image
              source={require("../../../assets/images/empty_journal.png")}
              style={styles.emptyImage}
              resizeMode="contain"
            />
            <Text style={styles.emptySub}>
              Hãy viết cảm xúc đầu tiên của bạn
            </Text>
          </View>
        ) : (
          journals.map((item) => (
            <JournalCard key={item.id} item={item} navigation={navigation} />
          ))
        )}
      </ScrollView>
    </View>
  );
};

export default JournalHomeScreen;

/* ================= CARD ================= */
const JournalCard = ({ item, navigation }: any) => {
  const [mood, setMood] = useState<any>(null);
  useEffect(() => {
    const loadMood = async () => {
      const date = new Date(item.year, item.month - 1, item.day);
      const data = await getMoodByDate(date);
      setMood(data);
    };

    loadMood();
  }, [item]);
  const moodItem = moodData.find(
  (m) => m.id === (mood?.moodId || mood?.id)
);

  const isToday = (() => {
    const today = new Date();
    return (
      item.day === today.getDate() &&
      item.month === today.getMonth() + 1 &&
      item.year === today.getFullYear()
    );
  })();
  return (
    <TouchableOpacity
      activeOpacity={0.7}
      style={[
        styles.card,
        isToday && {
          borderWidth: 1,
          borderColor: "#b4de80",
        },
      ]}
      onPress={() =>
        navigation.navigate("JournalCreate", { journalId: item.id })
      }
    >
      <View style={styles.dateRow}>
        <View style={{ flexDirection: "row", alignItems: "center", flex: 1 }}>
          <View style={styles.dayWrapper}>
            <Text style={styles.dayText}>{item.day}</Text>
            <View style={styles.dayUnderline} />
          </View>

          <Text style={styles.monthText}>Tháng {item.month}</Text>
        </View>

        {moodItem && (
          <Image source={moodItem.icon} style={styles.moodIcon} />
        )}
      </View>

      <Text style={styles.cardTitle} numberOfLines={1}>
        {item.previewTitle || "Không tiêu đề"}
      </Text>

      <Text style={styles.cardContent} numberOfLines={1}>
        {item.previewContent || ""}
      </Text>
    </TouchableOpacity>
  );
};

/* ================= STYLES ================= */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFCF2",
    marginTop:20
  },

  /* HEADER */
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    marginTop: 10,
  },

  yearRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  yearText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    backgroundColor: "#fff",
    paddingHorizontal: 20,
    paddingVertical: 6,
    borderRadius: 20,
    marginHorizontal: 12,
  },

  addBtn: {
    backgroundColor: "#CBF993",
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },

  /* CARD */
  card: {
    backgroundColor: "#fff",
    marginHorizontal: 16,
    marginTop: 12,
    padding: 16,
    borderRadius: 20,

    // shadowColor: "#000",
    // shadowOpacity: 0.05,
    // shadowRadius: 10,
    // shadowOffset: { width: 0, height: 4 },

    elevation: 3,
  },

  dateRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  dayWrapper: {
    position: "relative",
    marginRight: 6,
  },

  dayUnderline: {
    position: "absolute",
    bottom: 2,
    left: 0,
    width: 18,
    height: 4,
    backgroundColor: "#CBF993",
    borderRadius: 2,
  },
  dayText: {
    fontSize: 22,
    fontWeight: "700",
    color: "#2E2E2E",
    marginRight: 4,
  },

  monthText: {
    fontSize: 14,
    color: "#6E6E6E",
    marginRight: 6,
  },

  moodIcon: {
    width: 36,
    height: 36,
    marginLeft: 6,
  },

  cardContent: {
    fontSize: 14,
    color: "#555",
    marginTop: 8,
    lineHeight: 18,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: "#2E2E2E",
    marginTop: 4,
  },
  /* LOADING */
  skeletonCard: {
    height: 90,
    borderRadius: 20,
    backgroundColor: "#F3F3F3",
    marginBottom: 14,
  },

  /* EMPTY */
  emptyBox: {
    alignItems: "center",
    marginTop: 80,
  },
  emptyImage: {
    width: 180,
    height: 180,
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#666",
  },

  emptySub: {
    fontSize: 13,
    color: "#999",
    marginTop: 4,
  },
});