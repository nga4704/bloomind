import TrendCard from "../components/TrendCard";
import MoodSummaryCard from "../components/MoodSummaryCard";
import { ScrollView, View } from "react-native";
import PeriodSelector from "../components/PeriodSelector";
import { useState, useEffect } from "react";
import MoodActivityCard from "../components/MoodActivityCard";
import MoodWeekdayBarChart from "../components/MoodWeekdayBarChart";
import { getMoodSummary } from "../services/moodSummaryService";
import { auth } from "../../../services/firebase/firebaseConfig";
import { MoodSummaryData, MoodItemInMonth, TrendData } from "../types/analysis.types";
import { getTrendByRange } from "../services/trendService";
import { getTrendWithCompare } from "../services/trendService";
import { getMoodActivityByRange } from "../services/moodActivityService";
import { getMoodByRange } from "../services/moodWeekdayService";
import StreakMonthCard from "../components/StreakMonthCard";
import { StreakMonthData } from "../types/analysis.types";
import { getStreakMonth } from "../services/streakService";
interface MoodActivityItem {
  moodId: string;
  label: string;
  activities: { id: string; count: number; percent: number }[];
}

export default function MonthAnalysisScreen() {
  const now = new Date();

  const [monthIndex, setMonthIndex] = useState(now.getMonth()); // 0-11
  const [year, setYear] = useState(now.getFullYear());
  
  const start = new Date(year, monthIndex, 1);
  const end = new Date(year, monthIndex + 1, 0, 23, 59, 59);
  const [trend, setTrend] = useState<TrendData | null>(null);
  const [streakMonth, setStreakMonth] = useState<StreakMonthData | null>(null);
  const [moodByMonth, setMoodByMonth] = useState<MoodItemInMonth[]>([]);

  const handlePrev = () => {
    if (monthIndex === 0) {
      setMonthIndex(11);
      setYear((y) => y - 1);
    } else {
      setMonthIndex((m) => m - 1);
    }
  };

  const handleNext = () => {
    if (monthIndex === 11) {
      setMonthIndex(0);
      setYear((y) => y + 1);
    } else {
      setMonthIndex((m) => m + 1);
    }
  };
  const [moodSummary, setMoodSummary] = useState<MoodSummaryData | null>(null);

  const prevStart = new Date(year, monthIndex - 1, 1);
  const prevEnd = new Date(year, monthIndex, 0);

  const [moodActivities, setMoodActivities] =
    useState<MoodActivityItem[]>([]);

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) return;
    getStreakMonth(user.uid, monthIndex, year)
      .then(setStreakMonth);

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

    getMoodByRange(user.uid, "month", monthIndex, year)
      .then(setMoodByMonth);

  }, [monthIndex, year]);

  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <PeriodSelector
        label={`Tháng ${monthIndex + 1}, ${year}`}
        onPrev={handlePrev}
        onNext={handleNext}
      />

      <View style={{ height: 16 }} />
      {streakMonth && (
        <StreakMonthCard
          year={year}
          month={monthIndex}
          streak={streakMonth}
        />
      )}


      {moodSummary && <MoodSummaryCard data={moodSummary} />}
      {trend && <TrendCard trend={trend} />}

      <MoodWeekdayBarChart
        month={monthIndex}
        year={year}
        moodByMonth={moodByMonth}
      />


      {moodActivities.length > 0 && (
        <MoodActivityCard data={moodActivities} />
      )}
    </ScrollView>
  );
}
