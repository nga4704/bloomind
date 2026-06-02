import MoodSummaryCard from "../components/MoodSummaryCard";
import TrendCard from "../components/TrendCard";
import { ScrollView, View } from "react-native";
import PeriodSelector from "../components/PeriodSelector";
import { useState, useEffect } from "react";
import MoodActivityCard from "../components/MoodActivityCard";
import MoodWeekdayBarChart from "../components/MoodWeekdayBarChart";
import MoodYearMiniMonths, { MoodByDay } from "../components/MoodYearMiniMonths";
import { auth } from "../../../services/firebase/firebaseConfig";

import { getMoodSummary } from "../services/moodSummaryService";
import { getTrendByRange, getTrendWithCompare } from "../services/trendService";
import { getMoodActivityByRange } from "../services/moodActivityService";
import { getMoodByRange } from "../services/moodWeekdayService";
import { getMoodByYear } from "../services/moodYearService";
import { getStreakYear } from "../services/streakYearService";

import {
  MoodSummaryData,
  MoodItemInMonth,
  TrendData,
} from "../types/analysis.types";

interface MoodActivityItem {
  moodId: string;
  label: string;
  activities: { id: string; count: number; percent: number }[];
}

export default function YearAnalysisScreen() {
  const [year, setYear] = useState(new Date().getFullYear());

  const start = new Date(year, 0, 1);
  const end = new Date(year, 11, 31, 23, 59, 59);

  const prevStart = new Date(year - 1, 0, 1);
  const prevEnd = new Date(year - 1, 11, 31);

  const [trend, setTrend] = useState<TrendData | null>(null);
  const [moodSummary, setMoodSummary] = useState<MoodSummaryData | null>(null);

  // MINI YEAR
  const [moodByYearMini, setMoodByYearMini] = useState<MoodByDay[][]>([]);
  const [streakYear, setStreakYear] = useState<any>(null);

  // WEEKDAY BAR CHART
  const [moodByYearWeekday, setMoodByYearWeekday] =
    useState<MoodItemInMonth[]>([]);

  const [moodActivities, setMoodActivities] =
    useState<MoodActivityItem[]>([]);

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) return;

    getMoodByYear(user.uid, year).then(setMoodByYearMini);
    getStreakYear(user.uid, year).then(setStreakYear);

    getMoodSummary(user.uid, start, end).then(setMoodSummary);

    getTrendByRange(user.uid, start, end).then(setTrend);
    getTrendWithCompare(
      user.uid,
      start,
      end,
      prevStart,
      prevEnd
    ).then(setTrend);

    getMoodActivityByRange(user.uid, start, end)
      .then(setMoodActivities);

    getMoodByRange(user.uid, "year", 0, year)
      .then(setMoodByYearWeekday);

  }, [year]);

  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <PeriodSelector
        label={`Năm ${year}`}
        onPrev={() => setYear((y) => y - 1)}
        onNext={() => setYear((y) => y + 1)}
      />

      <View style={{ height: 16 }} />

      {/* MINI YEAR CHART */}
      <MoodYearMiniMonths
        year={year}
        moodByYear={moodByYearMini}
        streak={streakYear}
        onPressMonth={(m) => {
          console.log("Open month", m + 1);
        }}
      />

      {moodSummary && <MoodSummaryCard data={moodSummary} />}
      {trend && <TrendCard trend={trend} />}

      {/* WEEKDAY BAR */}
      <MoodWeekdayBarChart
        month={0}
        year={year}
        moodByMonth={moodByYearWeekday}
      />

      {moodActivities.length > 0 && (
        <MoodActivityCard data={moodActivities} />
      )}
    </ScrollView>
  );
}
