import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { RootStackParamList } from "./types";

import { BottomTabNavigator } from "./BottomTabNavigator";

import { ProfileScreen, EditProfileScreen } from "../../features/profile";
import {JournalCreateScreen} from "../../features/journal";
import { ChatScreen, ChatHistoryScreen } from "../../features/chatbot";

import {
  MoodTrackingScreen,
  ActivitiesScreen,
  MoodTrackingSavedScreen,
} from "../../features/mood";

import {
  AnalysisScreen,
  MoodHistoryScreen,
} from "../../features/analysis";

import { RecommendationScreen } from "../../features/recommender";

const Stack = createNativeStackNavigator<RootStackParamList>();

export const MainNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="MainTabs"
        component={BottomTabNavigator}
        options={{ headerShown: false }}
      />

      <Stack.Screen name="EditProfile" component={EditProfileScreen}  options={{ title: "Chỉnh sửa profile" }}/>

      <Stack.Screen
        name="Chatbot"
        component={ChatScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen name="ChatHistory" component={ChatHistoryScreen}  options={{ title: "Lịch sử trò chuyện" }}/>

      <Stack.Screen name="MoodTracking" component={MoodTrackingScreen}  options={{ title: "Chọn cảm xúc" }}/>
      <Stack.Screen name="Activities" component={ActivitiesScreen}  options={{ title: "Chọn hoạt động" }}/>
      <Stack.Screen
        name="MoodTrackingSaved"
        component={MoodTrackingSavedScreen}
        options={{ headerShown: false }}
      />

      <Stack.Screen name="Analysis" component={AnalysisScreen}  options={{ title: "Thống kê cảm xúc" }}/>
      <Stack.Screen
        name="MoodHistory"
        component={MoodHistoryScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen name="JournalCreate" component={JournalCreateScreen}  options={{ title: "Viết nhật ký" }}/>
      <Stack.Screen
        name="Recommendation"
        component={RecommendationScreen}  options={{ title: "Đề xuất hoạt động" }}
      />
    </Stack.Navigator>
  );
};