import { ImageSourcePropType } from "react-native";

/* ================== MOOD ================== */
export interface MoodItem {
  id: string;
  label: string;
  icon: ImageSourcePropType;
}

/* ================== SUMMARY ================== */
export interface MoodCountItem {
  mood: string;
  count: number;
  percent: number;
}

export interface MoodSummaryData {
  totalEntries: number;
  moodCounts: MoodCountItem[];
}

/* ================== TREND ================== */
export interface TrendData {
  positiveDays: number;
  negativeDays: number;

  positiveChange?: number;
  negativeChange?: number;

  positiveDirection?: "up" | "down" | "same";
  negativeDirection?: "up" | "down" | "same";
}

/* ================== MOOD CHANGE ================== */
export interface MoodChangeData {
  values: number[];
  average: number;
  stableRate: number;
}

/* ================== ACTIVITY ================== */
export interface LastMoodData {
  moodId: string;
  activities: {
    id: string;
    count: number;
    percent: number;
  }[];
}

/* ================== STREAK (WEEK) ================== */
export interface StreakDay {
  date: string;
  hasMood: boolean;
  moodId: string | null;
  isFuture: boolean;
}

export interface StreakData {
  current: number;
  longest: number;
  totalEntries: number;
  days: StreakDay[];
}

/* ================== STREAK (MONTH) ================== */
export interface StreakMonthDay {
  hasMood: boolean;
  moodId: string | null;
  isFuture: boolean;
}

export interface StreakMonthData {
  current: number;
  longest: number;
  totalEntries: number;
  days: StreakMonthDay[];
}

/* ================== MONTH / YEAR ================== */
export interface MoodItemInMonth {
  day: number;              // 1..31
  moodId: string | null;
}

export interface StreakYearData {
  current: number;
  longest: number;
  totalEntries: number;
  days: boolean[]; 
}

/* ================== MAIN ANALYSIS ================== */
export interface AnalysisData {
  totalEntries: number;
  moodCounts: MoodCountItem[];
  trend: TrendData;
  moodChange: MoodChangeData;

  lastMoods: LastMoodData[];

  streakMonth: StreakMonthData;
  moodByMonth: MoodItemInMonth[];

  streakYear?: StreakYearData;
}
