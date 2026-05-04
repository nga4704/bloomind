import { collection, getDocs } from "firebase/firestore";
import { firestore } from "../../../services/firebase/firebaseConfig";
import { TrendData } from "../types/analysis.types";

const POSITIVE = ["happy", "peaceful"];
const NEGATIVE = ["sad", "anxious"];

function formatYMD(date: Date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export async function getTrendByRange(
  uid: string,
  start: Date,
  end: Date
): Promise<TrendData> {
  const ref = collection(firestore, "users", uid, "moodLogs");
  const snap = await getDocs(ref);

  const startKey = formatYMD(start);
  const endKey = formatYMD(end);

  let positiveDays = 0;
  let negativeDays = 0;

  snap.forEach((doc) => {
    const dateKey = doc.id; // YYYY-MM-DD

    if (dateKey < startKey || dateKey > endKey) return;

    const moodId = doc.data().moodId;
    if (!moodId) return;

    if (POSITIVE.includes(moodId)) positiveDays++;
    if (NEGATIVE.includes(moodId)) negativeDays++;
  });

  return {
    positiveDays,
    negativeDays,
  };
}

function calcChange(current: number, previous: number) {
  if (current > previous)
    return {
      change: current - previous,
      direction: "up" as const,
    };

  if (current < previous)
    return {
      change: previous - current,
      direction: "down" as const,
    };

  return {
    change: 0,
    direction: "same" as const,
  };
}

export async function getTrendWithCompare(
  uid: string,
  currentStart: Date,
  currentEnd: Date,
  previousStart: Date,
  previousEnd: Date
): Promise<TrendData> {
  const current = await getTrendByRange(
    uid,
    currentStart,
    currentEnd
  );

  const previous = await getTrendByRange(
    uid,
    previousStart,
    previousEnd
  );

  const pos = calcChange(
    current.positiveDays,
    previous.positiveDays
  );

  const neg = calcChange(
    current.negativeDays,
    previous.negativeDays
  );

  return {
    positiveDays: current.positiveDays,
    negativeDays: current.negativeDays,

    positiveChange: pos.change,
    positiveDirection: pos.direction,

    negativeChange: neg.change,
    negativeDirection: neg.direction,
  };
}