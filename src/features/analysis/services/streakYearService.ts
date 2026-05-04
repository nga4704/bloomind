import { collection, getDocs } from "firebase/firestore";
import { firestore } from "../../../services/firebase/firebaseConfig";
import dayjs from "dayjs";
import { YearStreakData } from "./moodYearService";

function format(d: Date) {
  return dayjs(d).format("YYYY-MM-DD");
}

export async function getStreakYear(
  uid: string,
  year: number
): Promise<YearStreakData> {
  const snap = await getDocs(
    collection(firestore, "users", uid, "moodLogs")
  );

  const dates: string[] = [];

  snap.forEach((doc) => {
    if (doc.id.startsWith(`${year}-`)) {
      dates.push(doc.id);
    }
  });

  dates.sort();

  /* ===== TOTAL ===== */
  const totalEntries = dates.length;

  /* ===== LONGEST ===== */
  let longest = 0;
  let temp = 0;

  for (let i = 0; i < dates.length; i++) {
    if (i === 0) {
      temp = 1;
    } else {
      const prev = dayjs(dates[i - 1]);
      const curr = dayjs(dates[i]);
      if (curr.diff(prev, "day") === 1) temp++;
      else temp = 1;
    }
    longest = Math.max(longest, temp);
  }

  /* ===== CURRENT (TỪ HÔM NAY LÙI) ===== */
  let current = 0;
  let cursor = dayjs();

  while (dates.includes(cursor.format("YYYY-MM-DD"))) {
    current++;
    cursor = cursor.subtract(1, "day");
  }

  return {
    current,
    longest,
    totalEntries,
  };
}
