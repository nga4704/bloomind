import React, { useState, useMemo, useEffect } from "react";
import { ScrollView, View } from "react-native";

import MoodSummaryCard from "../components/MoodSummaryCard";
import StreakCard from "../components/StreakCard";
import TrendCard from "../components/TrendCard";
import MoodChangeChart from "../components/MoodChangeChart";
import MoodActivityCard from "../components/MoodActivityCard";
import PeriodSelector from "../components/PeriodSelector";

import { moodData } from "../utils/moodData";
import { auth } from "../../../services/firebase/firebaseConfig";
import { getWeekStreak } from "../services/streakService";
import { StreakData, MoodSummaryData } from "../types/analysis.types";
import { getWeekMoodChange } from "../services/moodChangeService";
import { getMoodSummary } from "../services/moodSummaryService";
import { getTrendByRange } from "../services/trendService";
import { TrendData } from "../types/analysis.types";
import { getTrendWithCompare } from "../services/trendService";
import { getMoodActivityByRange } from "../services/moodActivityService";

interface MoodActivityItem {
  moodId: string;
  label: string;
  activities: { id: string; count: number; percent: number }[];
}

function getMonday(date: Date) {
  const d = new Date(date);
  const day = (d.getDay() + 6) % 7;
  d.setDate(d.getDate() - day);
  d.setHours(0, 0, 0, 0);
  return d;
}

const formatDate = (d: Date) => `${d.getDate()}/${d.getMonth() + 1}`;

export default function WeekAnalysisScreen() {
  const [weekStreak, setWeekStreak] = useState<StreakData | null>(null);
  const [moodChange, setMoodChange] = useState<{
    values: number[];
    average: number;
    stableRate: number;
  } | null>(null);
  const [moodSummary, setMoodSummary] =
    useState<MoodSummaryData | null>(null);

  const [offset, setOffset] = useState(0);
  const [trend, setTrend] = useState<TrendData | null>(null);

  const [moodActivities, setMoodActivities] =
    useState<MoodActivityItem[]>([]);

  /* ================== TÍNH TUẦN ================== */
  const { start, end } = useMemo(() => {
    const mondayThisWeek = getMonday(new Date());
    const s = new Date(mondayThisWeek);
    s.setDate(mondayThisWeek.getDate() - offset * 7);

    const e = new Date(s);
    e.setDate(s.getDate() + 6);

    return { start: s, end: e };
  }, [offset]);

  const label = useMemo(() => {
    let l = `${formatDate(start)} - ${formatDate(end)}`;
    if (offset === 0) return `Tuần này (${l})`;
    if (offset === 1) return `Tuần trước (${l})`;
    return `Cách đây ${offset} tuần (${l})`;
  }, [start, end, offset]);

  const prevStart = new Date(start);
  prevStart.setDate(start.getDate() - 7);

  const prevEnd = new Date(end);
  prevEnd.setDate(end.getDate() - 7);


  /* ================== DATA ================== */
  useEffect(() => {
    const user = auth.currentUser;
    if (!user) return;

    getWeekStreak(user.uid, start).then(setWeekStreak);
    getWeekMoodChange(user.uid, offset).then(setMoodChange);
    getMoodSummary(user.uid, start, end).then(setMoodSummary);
    getTrendWithCompare(
      user.uid,
      start,
      end,
      prevStart,
      prevEnd
    ).then(setTrend);

    getMoodActivityByRange(user.uid, start, end)
      .then(setMoodActivities);
  }, [offset, start, end]);

  /* ================== MAP DATA ================== */
  // const moodActivityData: MoodActivityItem[] = useMemo(() => {
  //   if (!moodSummary) return [];

  //   return moodSummary.moodActivities.map((item) => {
  //     const mood = moodData.find((m) => m.id === item.moodId);
  //     return {
  //       moodId: item.moodId,
  //       label: mood?.label ?? item.moodId,
  //       activities: item.activities,
  //     };
  //   });
  // }, [moodSummary]);

  /* ================== UI ================== */
  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <PeriodSelector
        label={label}
        onPrev={() => setOffset((v) => v + 1)}
        onNext={() => setOffset((v) => Math.max(0, v - 1))}
      />

      <View style={{ height: 16 }} />

      {weekStreak && <StreakCard streak={weekStreak} />}

      {moodChange && (
        <MoodChangeChart
          data={moodChange}
          weekStartDate={start}
        />
      )}

      {moodSummary && <MoodSummaryCard data={moodSummary} />}
      {trend && <TrendCard trend={trend} />}
      {moodActivities.length > 0 && (
        <MoodActivityCard data={moodActivities} />
      )}

    </ScrollView>
  );
}
