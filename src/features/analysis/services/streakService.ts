import { collection, getDocs } from "firebase/firestore";
import { firestore } from "../../../services/firebase/firebaseConfig";
import { StreakMonthData } from "../types/analysis.types";

function formatLocalDate(d: Date) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function getMonday(date: Date) {
  const d = new Date(date);
  const day = d.getDay(); // 0 = CN
  const diff = day === 0 ? -6 : 1 - day;
  d.setDate(d.getDate() + diff);
  d.setHours(0, 0, 0, 0);
  return d;
}

export async function getWeekStreak(uid: string, referenceDate = new Date()) {
  const todayStr = formatLocalDate(new Date());

  /* ================== WEEK RANGE ================== */
  const monday = getMonday(referenceDate);

  const weekDates: string[] = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    weekDates.push(formatLocalDate(d));
  }

  /* ================== LOAD ALL MOODS ================== */
  const snapshot = await getDocs(
    collection(firestore, "users", uid, "moodLogs")
  );

  const allDates: string[] = [];
  snapshot.forEach((doc) => {
    allDates.push(doc.id); // YYYY-MM-DD
  });

  allDates.sort(); // QUAN TRỌNG

  const moodSet = new Set(allDates);

  /* ================== DAYS IN THIS WEEK ================== */
  const days = weekDates.map((date) => ({
    date,
    hasMood: moodSet.has(date),
    moodId: moodSet.has(date) ? snapshot.docs.find(d => d.id === date)?.data().moodId ?? null : null,
    isFuture: date > todayStr,
  }));

  /* ================== CURRENT STREAK (TRONG TUẦN ĐANG XEM) ================== */
  let current = 0;
  for (let i = days.length - 1; i >= 0; i--) {
    if (days[i].hasMood) current++;
    else break;
  }

  /* ================== LONGEST STREAK THEO TUẦN (TOÀN BỘ QUÁ KHỨ) ================== */
  const weekMap = new Map<string, string[]>();

  allDates.forEach((dateStr) => {
    const d = new Date(dateStr);
    const mondayKey = formatLocalDate(getMonday(d));
    if (!weekMap.has(mondayKey)) weekMap.set(mondayKey, []);
    weekMap.get(mondayKey)!.push(dateStr);
  });

  let longest = 0;

  weekMap.forEach((dates) => {
    dates.sort();
    let temp = 0;
    let maxInWeek = 0;

    for (let i = 0; i < dates.length; i++) {
      if (i === 0) {
        temp = 1;
      } else {
        const prev = new Date(dates[i - 1]);
        const curr = new Date(dates[i]);
        const diff =
          (curr.getTime() - prev.getTime()) / (1000 * 60 * 60 * 24);

        if (diff === 1) temp++;
        else temp = 1;
      }
      maxInWeek = Math.max(maxInWeek, temp);
    }

    longest = Math.max(longest, maxInWeek);
  });

  return {
    current,
    longest,
    totalEntries: days.filter((d) => d.hasMood).length,
    days,
  };
}

function calcLongestStreakFromDates(dateStrings: string[]): number {
  if (dateStrings.length === 0) return 0;

  const dates = dateStrings
    .map((d) => new Date(d))
    .sort((a, b) => a.getTime() - b.getTime());

  let longest = 1;
  let temp = 1;

  for (let i = 1; i < dates.length; i++) {
    const diff =
      (dates[i].getTime() - dates[i - 1].getTime()) /
      (1000 * 60 * 60 * 24);

    if (diff === 1) {
      temp++;
      longest = Math.max(longest, temp);
    } else {
      temp = 1;
    }
  }

  return longest;
}


export async function getStreakMonth(
  uid: string,
  month: number,
  year: number
): Promise<StreakMonthData> {
  const ref = collection(firestore, "users", uid, "moodLogs");
  const snap = await getDocs(ref);

  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const days: {
    hasMood: boolean;
    moodId: string | null;
    isFuture: boolean;
  }[] = Array.from({ length: daysInMonth }, (_, i) => {
    const date = new Date(year, month, i + 1);
    date.setHours(0, 0, 0, 0);

    return {
      hasMood: false,
      moodId: null,
      isFuture: date > today,
    };
  });

  const allDates: string[] = [];
  let totalEntries = 0;

  snap.forEach((doc) => {
    allDates.push(doc.id);

    const [y, m, d] = doc.id.split("-").map(Number);
    if (y === year && m - 1 === month) {
      days[d - 1].hasMood = true;
      days[d - 1].moodId = doc.data().moodId ?? null;
      totalEntries++;
    }
  });

  /* ===== LONGEST STREAK (TOÀN BỘ LỊCH SỬ) ===== */
  const longest = calcLongestStreakFromDates(allDates);

  /* ===== CURRENT STREAK (TỪ HÔM NAY) ===== */
  let todayIndex = days.findIndex((_, i) => {
    const d = new Date(year, month, i + 1);
    d.setHours(0, 0, 0, 0);
    return d.getTime() === today.getTime();
  });

  if (todayIndex === -1) {
    todayIndex = days.length - 1;
  }

  let current = 0;
  for (let i = todayIndex; i >= 0; i--) {
    if (days[i].hasMood) current++;
    else break;
  }

  return {
    current,
    longest,
    totalEntries,
    days,
  };
}
