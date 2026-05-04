import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

interface Props {
  label: string;
  onPrev: () => void;
  onNext: () => void;
}

export default function PeriodSelector({ label, onPrev, onNext }: Props) {
  return (
    <View style={styles.container}>
      {/* Prev button */}
      <TouchableOpacity style={styles.circleBtn} onPress={onPrev}>
        <MaterialIcons name="keyboard-arrow-left" size={22} color="#0c3d36" />
      </TouchableOpacity>

      {/* Center label */}
      <View style={styles.centerBox}>
        <MaterialIcons name="calendar-today" size={16} color="#0c3d36" />
        <Text style={styles.label}>{label}</Text>
      </View>

      {/* Next button */}
      <TouchableOpacity style={styles.circleBtn} onPress={onNext}>
        <MaterialIcons name="keyboard-arrow-right" size={22} color="#0c3d36" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  circleBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#d0d0d0",
  },

  centerBox: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: "#d0d0d0",
    backgroundColor: "#fff",
  },

  label: {
    marginLeft: 6,
    color: "#0c3d36",
    fontSize: 14,
    fontWeight: "600",
  },
});
