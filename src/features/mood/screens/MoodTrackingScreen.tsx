// screens/MoodTrackingScreen.tsx
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
} from "react-native";
import { useNavigation, useRoute, RouteProp, } from "@react-navigation/native";
import { moodData, MoodItem } from "../../../utils/moodData";
import { RootStackParamList } from "../../../app/navigation/types";
import { auth, firestore } from "../../../services/firebase/firebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import dayjs from "dayjs";

type RouteProps = RouteProp<RootStackParamList, "MoodTracking">;

export const MoodTrackingScreen = ({ navigation }: any) => {
  // const navigation = useNavigation();
  // const route = useRoute();
  const route = useRoute<RouteProps>();
  const mode = route.params?.mode;
  const date = route.params?.date;

  // const { mode } = (route.params || {}) as { mode?: "edit" };

  const [selectedMood, setSelectedMood] = useState<string | null>(null);

  useEffect(() => {
    if (mode !== "edit" || !date) return;

    const loadMood = async () => {
      const user = auth.currentUser;
      if (!user) return;

      const ref = doc(firestore, "users", user.uid, "moodLogs", date);
      const snap = await getDoc(ref);

      if (snap.exists()) {
        setSelectedMood(snap.data().moodId);
      }
    };

    loadMood();
  }, [mode, date]);


  const handleNext = () => {
    if (!selectedMood) return;

    navigation.navigate("Activities", {
      moodId: selectedMood,
      mode, // truyền mode
    });
  };

  const currentMood: MoodItem | undefined =
    moodData.find((m) => m.id === selectedMood);

  return (
    <View style={styles.container}>
      {/* Selected mood preview */}
      <View style={styles.selectedMoodContainer}>
        {currentMood ? (
          <>
            <Image source={currentMood.icon} style={styles.selectedIcon} />
            <Text style={styles.selectedLabel}>{currentMood.label}</Text>
          </>
        ) : (
          <Text style={styles.placeholderText}>
            Chọn tâm trạng của bạn
          </Text>
        )}
      </View>

      <Text style={styles.subtitle}>Hôm nay bạn cảm thấy thế nào?</Text>

      {/* Mood options */}
      <View style={styles.moodContainer}>
        {moodData.map((mood) => {
          const isActive = selectedMood === mood.id;

          return (
            <TouchableOpacity
              key={mood.id}
              style={styles.moodItem}
              onPress={() => setSelectedMood(mood.id)}
            >
              <View
                style={[
                  styles.iconWrapper,
                  isActive && styles.iconWrapperActive,
                ]}
              >
                <Image source={mood.icon} style={styles.icon} />
              </View>

              <Text
                style={[
                  styles.moodText,
                  isActive && styles.activeMood,
                ]}
              >
                {mood.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <TouchableOpacity
        style={[styles.nextButton, !selectedMood && { opacity: 0.4 }]}
        disabled={!selectedMood}
        onPress={() => {
          if (!currentMood) return;

          navigation.navigate("Activities", {
            moodId: currentMood.id,
            moodLabel: currentMood.label,
            mode,
            date,
          });
        }}
      >
        <Text style={styles.nextText}>Tiếp theo</Text>
      </TouchableOpacity>
    </View>
  );
};

export default MoodTrackingScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fffbf2",
    paddingTop: 50,
    alignItems: "center",
  },

  selectedMoodContainer: {
    height: 170,
    justifyContent: "center",
    alignItems: "center",
  },

  selectedIcon: {
    // width: 160,
    height: 150,
    resizeMode: "contain",
  },

  selectedLabel: {
    // marginTop: 10,
    fontSize: 18,
    fontWeight: "700",
    color: "#333",
  },

  placeholderText: {
    fontSize: 16,
    color: "#AAA",
  },

  subtitle: {
    marginTop: 30,
    fontSize: 16,
    color: "#333",
  },

  moodContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    marginTop: 20,
    width: "85%",
  },

  moodItem: {
    width: "30%",
    alignItems: "center",
    marginVertical: 12,
  },

  iconWrapper: {
    width: 65,
    height: 65,
    borderRadius: 32,
    justifyContent: "center",
    alignItems: "center",
  },

  iconWrapperActive: {
    backgroundColor: "#fff",
    borderRadius: 50
  },

  icon: {
    width: 55,
    height: 55,
    resizeMode: "contain",
  },

  moodText: {
    marginTop: 8,
    fontSize: 14,
    color: "#555",
    fontWeight: "500",
  },

  activeMood: {
    color: "#000000ff",
    fontWeight: "700",
  },

  nextButton: {
    position: "absolute",
    bottom: 50,
    width: "70%",
    paddingVertical: 14,
    backgroundColor: "#454545",
    borderRadius: 30,
    alignItems: "center",
  },

  nextText: {
    fontSize: 17,
    color: "#fff",
    fontWeight: "600",
  },
});

