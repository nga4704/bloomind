import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  useWindowDimensions,
} from "react-native";
import Feather from "@expo/vector-icons/Feather";

import { moodData } from "../../../utils/moodData";

interface Props {
  todayMood: {
    id: string;
    label: string;
    detailMoods?: string[];
  } | null;

  onPressEmpty: () => void;
  onEdit: () => void;
  onRecommend: () => void;
}

const MoodTodayCard: React.FC<Props> = ({
  todayMood,
  onPressEmpty,
  onEdit,
  onRecommend,
}) => {
  const { width } = useWindowDimensions();
  const isDesktop = width >= 768;

  const moodItem = todayMood
    ? moodData.find((m) => m.id === todayMood.id)
    : null;

  return (
    <View style={styles.wrapper}>
      <View style={styles.card}>
        {/* LEFT */}
        <View style={styles.left}>
          <View style={styles.topRow}>
            <Feather name="clock" size={16} color="#777" />
            <Text style={styles.daysText}>Hôm nay</Text>
          </View>

          <Text style={styles.title}>
            {todayMood
              ? moodItem?.label
              : "Hôm nay bạn cảm thấy thế nào?"}
          </Text>

          {todayMood ? (
            <TouchableOpacity
              style={styles.ctaBtn}
              onPress={onRecommend}
            >
              <Text style={styles.ctaText}>
                Gợi ý hoạt động
              </Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={styles.ctaBtn}
              onPress={onPressEmpty}
            >
              <Text style={styles.ctaText}>
                Chọn tâm trạng →
              </Text>
            </TouchableOpacity>
          )}
        </View>

        {/* RIGHT IMAGE (ALWAYS RIGHT) */}
        <View style={styles.right}>
          <Image
            source={
              todayMood && moodItem?.icon
                ? moodItem.icon
                : require("../../../assets/images/iconBanner.png")
            }
            style={[
              styles.image,
              isDesktop && styles.imageDesktop,
            ]}
          />
        </View>

        {/* EDIT */}
        {todayMood && (
          <TouchableOpacity
            style={styles.editBtn}
            onPress={onEdit}
          >
            <Feather name="edit-2" size={14} color="#555" />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default MoodTodayCard;

/* ================== STYLES ================== */

const styles = StyleSheet.create({
  /* CENTER WEB */
  wrapper: {
    width: "100%",
    alignItems: "center",
    paddingHorizontal: 16,
  },

  card: {
    width: "100%",
    // maxWidth: 2000,
    marginTop: 20,
    marginBottom: 20,
    padding: 20,
    borderRadius: 28,
    backgroundColor: "#e9fcd1",

    flexDirection: "row",
    alignItems: "center",

    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 4,
  },

  left: {
    flex: 1,
    paddingRight: 20,
  },

  topRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    gap: 6,
  },

  daysText: {
    fontSize: 14,
    color: "#777",
  },

  title: {
    fontSize: 16,
    fontWeight: "700",
    color: "#333",
    marginBottom: 18,
  },

  ctaBtn: {
    backgroundColor: "#fff",
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: 24,
    alignSelf: "flex-start",

    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },

  ctaText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#444",
  },

  /* RIGHT FIX */
  right: {
    justifyContent: "center",
    alignItems: "flex-end", // 🔥 ép sát phải
  },

  image: {
    width: 100,
    height: 100,
    resizeMode: "contain",
  },

  imageDesktop: {
    width: 180,
    height: 180,
  },

  editBtn: {
    position: "absolute",
    top: 16,
    right: 16,
    backgroundColor: "#fff",
    padding: 8,
    borderRadius: 20,
  },
});