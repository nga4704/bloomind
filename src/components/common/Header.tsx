import React from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons"; // Hoặc thư viện icon bạn đang dùng

// Hàm format date English
const getFormattedDate = () => {
  const today = new Date();

  const options: Intl.DateTimeFormatOptions = {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  };

  return today.toLocaleDateString("en-US", options);
};

const Header = () => {
  const hasStreak = true; // Thay đổi giá trị này để kiểm tra trạng thái
  const streakCount = 7; // Số ngày streak

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.headerContainer}>
        {/* Left: Avatar + Username */}
        <View style={styles.userSection}>
          <Image
            source={require("../../../assets/images/avatar.png")}
            style={styles.avatar}
          />

          <View>
            <Text style={styles.username}>chingchong.90226</Text>
            <Text style={styles.date}>{getFormattedDate()}</Text>
          </View>
        </View>

        {/* Right: Streak Icon */}
        <View style={styles.streakSection}>
          <View style={[
            styles.streakContainer,
            hasStreak ? styles.streakActive : styles.streakInactive
          ]}>
            <Ionicons 
              name="flame" 
              size={20} 
              color={hasStreak ? "#FFFFFF" : "#FF6B35"} 
            />
            <Text style={[
              styles.streakCount,
              hasStreak ? styles.streakCountActive : styles.streakCountInactive
            ]}>
              {streakCount}
            </Text>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    // backgroundColor: "#FAF9F5",
  },

  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingBottom: 5,
    paddingTop: 8,
  },

  userSection: {
    flexDirection: "row",
    alignItems: "center",
  },

  avatar: {
    width: 50,
    height: 50,
    borderRadius: 27,
    marginRight: 14,
  },

  username: {
    fontSize: 16,
    fontWeight: "700",
    color: "#2E2E2E",
  },

  date: {
    marginTop: 2,
    fontSize: 12,
    color: "#6F6F6F",
    fontWeight: "500",
  },

  streakSection: {
    alignItems: "flex-end",
  },

  streakContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    minWidth: 44,
  },

  streakActive: {
    backgroundColor: "#FF6B35", // Màu đỏ khi có streak
  },

  streakInactive: {
    backgroundColor: "#FFFFFF", // Màu trắng khi chưa có streak
    borderWidth: 1,
    borderColor: "#E5E5E5",
  },

  streakCount: {
    fontSize: 14,
    fontWeight: "700",
    marginLeft: 4,
  },

  streakCountActive: {
    color: "#FFFFFF", // Chữ trắng khi có streak
  },

  streakCountInactive: {
    color: "#FF6B35", // Chữ cam khi chưa có streak
  },
});

export default Header;