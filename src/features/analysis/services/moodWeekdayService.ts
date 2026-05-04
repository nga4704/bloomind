import { collection, getDocs } from "firebase/firestore";
import { firestore } from "../../../services/firebase/firebaseConfig";

/* ================== TYPES ================== */
export interface MoodByDay {
  day: number;
  moodId: string | null;
}

/* ================== HELPERS ================== */
function formatYMD(d: Date) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

/* ================== MAIN ================== */
/**
 * mode:
 * - "month": dùng cho MonthAnalysisScreen
 * - "year":  dùng cho YearAnalysisScreen
 */
export async function getMoodByRange(
  uid: string,
  mode: "month" | "year",
  month: number, // 0..11 (bắt buộc, year cũng truyền đại 0)
  year: number
): Promise<MoodByDay[]> {
  const ref = collection(firestore, "users", uid, "moodLogs");
  const snap = await getDocs(ref);

  const start =
    mode === "month"
      ? new Date(year, month, 1)
      : new Date(year, 0, 1);

  const end =
    mode === "month"
      ? new Date(year, month + 1, 0)
      : new Date(year, 11, 31);

  const startKey = formatYMD(start);
  const endKey = formatYMD(end);

  const result: MoodByDay[] = [];

  snap.forEach((doc) => {
    const dateKey = doc.id;
    if (dateKey < startKey || dateKey > endKey) return;

    const day = Number(dateKey.slice(8, 10));
    const { moodId } = doc.data();

    result.push({
      day,
      moodId: moodId ?? null,
    });
  });

  return result;
}
