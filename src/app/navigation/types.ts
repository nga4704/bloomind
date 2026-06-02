import { NavigatorScreenParams } from "@react-navigation/native";
import { MoodLog } from "../../types/mood";

/* Bottom Tabs */
export type BottomTabParamList = {
  Home: undefined;
  Analysis: undefined;
  Journal: undefined;
  Profile: undefined;
};

/* Root Stack */
export type RootStackParamList = {
  Splash: undefined;

  // Auth
  Login: undefined;
  EmailLogin: undefined;
  Register: undefined;

  // Main
  MainTabs: NavigatorScreenParams<BottomTabParamList>;

  // Profile
  EditProfile: undefined;

  // Mood
  MoodTracking: {
    mode?: "edit" | "create";
    date?: string;
  };
  Activities: {
    moodId: string;
    moodLabel?: string;
    mode?: "edit" | "create";
    date?: string;
  };
  MoodHistory: {
    date: string;
  };
  MoodTrackingSaved: undefined;

  // Analysis
  Analysis: undefined;
  MonthDetail: undefined;

  // Journal
  Journal: undefined;
  JournalDetail: undefined;
  JournalCreate: undefined;
  JournalEdit: undefined;

  // Chat
  Chatbot: {
  conversationId?: string;
};
  ChatHistory: undefined;

  // Recommendation
  Recommendation: {
    todayMood?: MoodLog;
  };
};

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}

export type NoParamRoute = {
  [K in keyof RootStackParamList]: undefined extends RootStackParamList[K]
    ? K
    : never;
}[keyof RootStackParamList];

export type HomeActionRoute =
  | "Journal"
  | "Analysis"
  | "Chatbot";