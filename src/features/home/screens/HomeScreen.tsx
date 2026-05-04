import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Animated,
  Platform,
  useWindowDimensions,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

import { RootStackParamList, NoParamRoute } from "../../../app/navigation/types";

import MoodTodayCard from "../components/MoodTodayCard";
import { HomeHeader } from "../components/HomeHeader";
import { HomeActions } from "../components/HomeActions";

import { useHomeUser } from "../hooks/useHomeUser";
import { useTodayMood } from "../hooks/useTodayMood";

import { homeStyles as styles } from "../styles/home";
import { HOME_ASSETS } from "../../../types/contants/homeAssets";

import { RecommendationAction } from "../../recommender/types/recommendation";
import dayjs from "dayjs";

type NavigationType = NativeStackNavigationProp<RootStackParamList>;

const HomeScreen: React.FC = () => {
  const navigation = useNavigation<NavigationType>();

  const { width } = useWindowDimensions();
  const isWeb = Platform.OS === "web";

  const userInfo = useHomeUser();
  const todayMood = useTodayMood();

  const [recommendations, setRecommendations] =
    useState<RecommendationAction[]>([]);

  /* mascot animation */
  const floatAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, {
          toValue: -10,
          duration: 1800,
          useNativeDriver: true,
        }),
        Animated.timing(floatAnim, {
          toValue: 0,
          duration: 1800,
          useNativeDriver: true,
        }),
      ])
    );

    loop.start();
    return () => loop.stop();
  }, [floatAnim]);

  const onRecommend = () => {
    if (!todayMood) return;

    navigation.navigate("Recommendation", {
      todayMood: {
        date: new Date().toISOString().slice(0, 10),
        moodId: todayMood.id,
        moodLabel: todayMood.label,
        detailMoods: todayMood.detailMoods || [],
        note: "",
        activities: [],
      },
    });
  };

  const handleNavigate = (route: NoParamRoute) => {
    navigation.navigate(route);
  };
  const generateWeekData = () => {
    const start = dayjs().startOf("week").add(1, "day"); // T2

    return Array.from({ length: 7 }).map((_, i) => {
      const date = start.add(i, "day");

      return {
        date: date.format("YYYY-MM-DD"),
        hasMood: false,
        moodId: undefined,
        isFuture: date.isAfter(dayjs(), "day"),
      };
    });
  };
  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.container}>
          <HomeHeader userInfo={userInfo} />

          <MoodTodayCard
            todayMood={todayMood}
            // weekData={generateWeekData()} 
            onPressEmpty={() =>
              navigation.navigate("MoodTracking", { mode: "create" })
            }
            onEdit={() =>
              navigation.navigate("MoodTracking", { mode: "edit" })
            }
            onRecommend={onRecommend}
          />

          <HomeActions onNavigate={handleNavigate} />

          <View style={styles.mascotContainer}>
            <Animated.View
              pointerEvents="none"
              style={{ transform: [{ translateY: floatAnim }] }}
            >
              <Animated.Image
                source={HOME_ASSETS.mascot}
                style={{
                  width: width * 0.8,
                  height: width * 0.8,
                  resizeMode: "contain",
                }}
              />
            </Animated.View>
          </View>

          {/* Recommendation (optional future) */}
          {/* {recommendations.length > 0 && (
            <View style={{ padding: 16 }}>
              {recommendations.map((item) => (
                <RecommendationCard key={item.id} action={item} />
              ))}
            </View>
          )} */}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default HomeScreen;