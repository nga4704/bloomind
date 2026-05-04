import { collection, getDocs } from "firebase/firestore";
import { firestore } from "../../../services/firebase/firebaseConfig";
import { MoodSummaryData } from "../types/analysis.types";

function formatYMD(date: Date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export async function getMoodSummary(
  uid: string,
  start: Date,
  end: Date
): Promise<MoodSummaryData> {
  const ref = collection(firestore, "users", uid, "moodLogs");
  const snap = await getDocs(ref);

  const startKey = formatYMD(start);
  const endKey = formatYMD(end);

  const counts: Record<string, number> = {};
  let total = 0;

  snap.forEach((doc) => {
    const docId = doc.id; // 👈 YYYY-MM-DD

    if (docId < startKey || docId > endKey) return;

    const moodId = doc.data().moodId;
    if (!moodId) return;

    counts[moodId] = (counts[moodId] ?? 0) + 1;
    total++;
  });

  const moodCounts = Object.entries(counts).map(([mood, count]) => ({
    mood,
    count,
    percent: total ? Math.round((count / total) * 100) : 0,
  }));

  return {
    totalEntries: total,
    moodCounts,
  };
}
