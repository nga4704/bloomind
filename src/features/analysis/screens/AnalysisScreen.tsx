import { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

import WeekAnalysisScreen from "./WeekAnalysisScreen";
import MonthAnalysisScreen from "./MonthAnalysisScreen";
import YearAnalysisScreen from "./YearAnalysisScreen";

export default function AnalysisScreen() {
  const [activeTab, setActiveTab] = useState<"week" | "month" | "year">("week");

  const renderScreen = () => {
    switch (activeTab) {
      case "week":
        return <WeekAnalysisScreen />;
      case "month":
        return <MonthAnalysisScreen />;
      case "year":
        return <YearAnalysisScreen />;
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#fffbf2", padding: 16 }}>
      {/* Tabs */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === "week" && styles.activeTab]}
          onPress={() => setActiveTab("week")}
        >
          <Text style={[styles.tabText, activeTab === "week" && styles.activeTabText]}>Tuần</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, activeTab === "month" && styles.activeTab]}
          onPress={() => setActiveTab("month")}
        >
          <Text style={[styles.tabText, activeTab === "month" && styles.activeTabText]}>Tháng</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, activeTab === "year" && styles.activeTab]}
          onPress={() => setActiveTab("year")}
        >
          <Text style={[styles.tabText, activeTab === "year" && styles.activeTabText]}>Năm</Text>
        </TouchableOpacity>
      </View>

      {/* Render screen */}
      <View style={{ marginTop: 30, flex: 1 }}>{renderScreen()}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  tabContainer: {
    marginTop: 20,
    flexDirection: "row",
    backgroundColor: "#ffffffff",
    borderRadius: 25,
    padding: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: "center",
    borderRadius: 20,
  },
  activeTab: {
    backgroundColor: "#535353ff",
    // borderWidth:1
  },
  tabText: {
    color: "#4a4a4a",
    fontSize: 15,
    fontWeight: "500",
  },
  activeTabText: {
    color: "#ffffffff",
    fontWeight: "600",
  },
});
