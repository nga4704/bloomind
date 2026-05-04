import { View, Text, TouchableOpacity, Image, StyleSheet } from "react-native";
import { useState } from "react";
import { moodData } from "../utils/moodData";
import { ACTIVITIES } from "../utils/activities";
import { Feather } from "@expo/vector-icons";

interface Props {
  data: {
    moodId: string;
    label: string;
    activities: { id: string; count:number; percent: number }[];
  }[];
}

export default function MoodActivityCard({ data }: Props) {
  const [selectedMood, setSelectedMood] = useState(data[0]);
  const [open, setOpen] = useState(false);

  const moodInfo = moodData.find((m) => m.id === selectedMood.moodId);

  return (
    <View style={styles.container}>
      {/* HEADER */}
      <View style={styles.headerRow}>
        <Feather name="star" size={18}  />
        <Text style={styles.headerText}>Tâm trạng & Hoạt động</Text>
      </View>

      {/* SELECT MOOD BOX */}
      <TouchableOpacity onPress={() => setOpen(!open)} style={styles.selectBox}>
        <View style={styles.moodRow}>
          {moodInfo && (
            <Image source={moodInfo.icon} style={styles.moodIcon} resizeMode="contain" />
          )}
          <Text style={styles.moodLabel}>{selectedMood.label}</Text>
        </View>

        <Feather name={open ? "chevron-up" : "chevron-down"} size={20} color="#555" />
      </TouchableOpacity>

      {/* DROPDOWN */}
      {open && (
        <View style={styles.dropdown}>
          {data.map((mood) => {
            const icon = moodData.find((m) => m.id === mood.moodId)?.icon;

            return (
              <TouchableOpacity
                key={mood.moodId}
                onPress={() => {
                  setSelectedMood(mood);
                  setOpen(false);
                }}
                style={[
                  styles.dropdownItem,
                  selectedMood.moodId === mood.moodId && styles.dropdownItemActive,
                ]}
              >
                {icon && <Image source={icon} style={styles.dropdownIcon} />}
                <Text style={styles.dropdownText}>{mood.label}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
      )}

      <View style={{ height: 16 }} />

      {/* ACTIVITIES GRID */}
      <View style={styles.activityGrid}>
        {selectedMood.activities.map((ac) => (
          <ActivityItem key={ac.id} id={ac.id} percent={ac.percent} count={ac.count} />
        ))}
      </View>
    </View>
  );
}

function ActivityItem({ id, percent, count }: { id: string; percent: number; count: number }) {
  const info = ACTIVITIES.find((a) => a.id === id);

  return (
    <View style={styles.activityItem}>
      <View style={[styles.activityIconWrap, { backgroundColor: info?.color ?? "#eee" }]}>
        <Feather name={info?.icon as any} size={24} color="#333" />

        <View style={styles.badge}>
          <Text style={styles.badgeText}>{count}</Text>
        </View>
      </View>

      <Text style={styles.percentText}>{percent}%</Text>
      <Text style={styles.activityLabel}>{info?.label ?? id}</Text>
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    marginVertical:10,
    padding: 16,
    backgroundColor: "#fff",
    borderRadius: 16,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
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

  selectBox: {
    padding: 12,
    backgroundColor: "#f7f7f7",
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  moodRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  moodIcon: {
    width: 30,
    height: 30,
    marginRight: 8,
  },
  moodLabel: {
    fontSize: 16,
    fontWeight: "600",
  },

  dropdown: {
    backgroundColor: "#f8f8f8",
    padding: 10,
    borderRadius: 12,
    marginTop: 8,
    gap: 8,
  },
  dropdownItem: {
    padding: 10,
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  dropdownItemActive: {
    backgroundColor: "#eaeaea",
  },
  dropdownIcon: {
    width: 24,
    height: 24,
    marginRight: 8,
  },
  dropdownText: {
    fontSize: 15,
  },

  activityGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  activityItem: {
    width: "30%",
    alignItems: "center",
  },
  activityIconWrap: {
    width: 58,
    height: 58,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 6,
  },
  badge: {
    position: "absolute",
    top: -2,
    right: -2,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "#796ef0",
    alignItems: "center",
    justifyContent: "center",
  },
  badgeText: {
    fontSize: 12,
    color: "#fff",
    fontWeight: "700",
  },

  percentText: {
    fontSize: 14,
    fontWeight: "600",
  },
  activityLabel: {
    fontSize: 13,
    marginTop: 2,
    color: "#555",
    textAlign: "center",
  },
});
