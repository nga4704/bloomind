import { View, Text, StyleSheet } from "react-native";
import { TrendData } from "../types/analysis.types";
import Feather from "@expo/vector-icons/Feather";

interface Props {
  trend: TrendData;
}
function TrendIndicator({
  value,
  direction,
  goodWhenUp = true,
}: {
  value: number;
  direction: "up" | "down" | "same";
  goodWhenUp?: boolean;
}) {
  // ===== CASE: KHÔNG THAY ĐỔI =====
  if (direction === "same") {
    return (
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <Text
          style={{
            color: "#16A34A",
            fontWeight: "600",
          }}
        >
         = {value} ngày
        </Text>
      </View>
    );
  }

  // ===== CASE: TĂNG / GIẢM =====
  const isGood =
    (direction === "up" && goodWhenUp) ||
    (direction === "down" && !goodWhenUp);

  const color = isGood ? "#16A34A" : "#DC2626";

  return (
    <View style={{ flexDirection: "row", alignItems: "center" }}>
      <Feather
        name={direction === "up" ? "arrow-up" : "arrow-down"}
        size={14}
        color={color}
      />
      <Text
        style={{
          marginLeft: 4,
          color,
          fontWeight: "600",
        }}
      >
        {value} ngày
      </Text>
    </View>
  );
}


export default function TrendCard({ trend }: Props) {
  return (
    <View style={styles.card}>

      <View style={styles.headerRow}>
        <Feather name="smile" size={18} />
        <Text style={styles.title}>Xu hướng tổng thể</Text>
      </View>
      <Text style={styles.subtitle}>Bạn có bao nhiêu ngày vui vẻ?</Text>

      <View style={styles.row}>
        {/* Negative */}
        <View style={[styles.box, styles.boxBlue]}>
          <Feather name="frown" size={22} color="#0066CC" />
          <Text style={styles.number}>{trend.negativeDays} ngày</Text>
        </View>

        {/* Positive */}
        <View style={[styles.box, styles.boxYellow]}>
          <Feather name="smile" size={22} color="#E6B100" />
          <Text style={styles.number}>{trend.positiveDays} ngày</Text>
        </View>
      </View>

      <View style={styles.bottomRow}>
        {/* Ngày tiêu cực */}
        <View style={styles.bottomBox}>
          

          <TrendIndicator
            value={trend.negativeChange ?? 0}
            direction={trend.negativeDirection ?? "same"}
            goodWhenUp={false}
          />
          <Text style={styles.bottomTitle}>so với kỳ trước</Text>
        </View>

        {/* Ngày tích cực */}
        <View style={styles.bottomBox}>
          <TrendIndicator
            value={trend.positiveChange ?? 0}
            direction={trend.positiveDirection ?? "same"}
            goodWhenUp
          />
          <Text style={styles.bottomTitle}>so với kỳ trước</Text>
        </View>
      </View>
    </View>
  );
}


const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 16,
    marginVertical: 10,
    borderWidth:1,
    borderColor:'#e4e4e4ff',
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },

  subtitle: {
    fontSize: 13,
    marginTop: 4,
    marginBottom: 12,
  },

  row: {
    flexDirection: "row",
    marginBottom: 12,
  },

  box: {
    flex: 1,
    padding: 12,
    borderRadius: 12,
  },

  boxBlue: {
    backgroundColor: "#cee6ffff",
    marginRight: 2,
  },

  boxYellow: {
    backgroundColor: "#fff3c6ff",
  },

  number: {
    marginTop: 6,
    fontSize: 16,
    fontWeight: "500",
  },

  bottomRow: {
    flexDirection: "row",
    gap:8
  },

  bottomBox: {
    flex: 1,
    backgroundColor: "#F8F8F8",
    borderRadius: 12,
    padding: 12,
  },

  bottomTitle: {
    fontSize: 13,
    marginTop: 4,
  },

  bottomValue: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 6,
  },

  changeRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 2,
  },

  changeText: {
    fontSize: 12,
    marginLeft: 4,
  },
});
