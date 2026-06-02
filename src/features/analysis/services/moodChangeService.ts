import { collection, getDocs } from "firebase/firestore";
import { firestore } from "../../../services/firebase/firebaseConfig";
import { moodData } from "../utils/moodData";

/** Lấy thứ Hai của tuần (local time) */
function getMonday(date: Date) {
  const d = new Date(date);
  const day = (d.getDay() + 6) % 7; // Monday = 0
  d.setDate(d.getDate() - day);
  d.setHours(0, 0, 0, 0);
  return d;
}

/** FORMAT DATE LOCAL YYYY-MM-DD (KHÔNG DÙNG toISOString) */
function formatLocalDate(d: Date) {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export async function getWeekMoodChange(
  uid: string,
  offset = 0
): Promise<{
  values: number[];
  average: number;
  stableRate: number;
}> {
  // Thứ 2 của tuần cần lấy
  const monday = getMonday(new Date());
  monday.setDate(monday.getDate() - offset * 7);

  // Danh sách 7 ngày của tuần (LOCAL DATE)
  const weekDates: string[] = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    weekDates.push(formatLocalDate(d));
  }

  // Lấy toàn bộ moodLogs của user
  const snapshot = await getDocs(
    collection(firestore, "users", uid, "moodLogs")
  );

  // Map: "2025-12-21" -> moodValue (1..5)
  const moodMap = new Map<string, number>();

  snapshot.forEach((doc) => {
    const data = doc.data();
    const moodId = data.moodId;
    const mood = moodData.find((m) => m.id === moodId);

    if (mood) {
      // doc.id chính là "YYYY-MM-DD"
      moodMap.set(doc.id, mood.value);
    }
  });

  // values theo thứ tự T2 -> CN
  const values = weekDates.map((date) => moodMap.get(date) ?? 0);

  // =====================
  // AVERAGE (BỎ QUA NGÀY = 0)
  // =====================
  const validValues = values.filter((v) => v > 0);
  const average =
    validValues.length > 0
      ? Math.round(
          (validValues.reduce((a, b) => a + b, 0) / validValues.length) * 10
        ) / 10
      : 0;

  // =====================
  // STABLE RATE
  // =====================
  let stableCount = 0;
  let compareCount = 0;

  for (let i = 1; i < values.length; i++) {
    if (values[i] > 0 && values[i - 1] > 0) {
      compareCount++;
      if (values[i] === values[i - 1]) stableCount++;
    }
  }

  const stableRate =
    compareCount > 0 ? Math.round((stableCount / compareCount) * 100) : 0;

  return {
    values,
    average,
    stableRate,
  };
}
