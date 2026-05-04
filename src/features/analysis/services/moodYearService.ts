import { collection, getDocs } from "firebase/firestore";
import { firestore } from "../../../services/firebase/firebaseConfig";
import dayjs from "dayjs";

/* ===== TYPES ===== */
export type MoodByDay = {
  day: number;
  moodId: string | null;
};

export interface YearStreakData {
  current: number;
  longest: number;
  totalEntries: number;
}

/* ================================
   GET MOOD BY YEAR (12 MONTHS)
================================ */
export async function getMoodByYear(
  uid: string,
  year: number
): Promise<MoodByDay[][]> {
  const snap = await getDocs(
    collection(firestore, "users", uid, "moodLogs")
  );

  // init 12 months
  const result: MoodByDay[][] = Array.from({ length: 12 }, () => []);

  snap.forEach((doc) => {
    const [y, m, d] = doc.id.split("-").map(Number);
    if (y !== year) return;

    result[m - 1].push({
      day: d,
      moodId: doc.data().moodId ?? null,
    });
  });

  // sort day in month
  result.forEach((month) =>
    month.sort((a, b) => a.day - b.day)
  );

  return result;
}
