import { collection, getDocs } from "firebase/firestore";
import { firestore } from "../../../services/firebase/firebaseConfig";
import { moodData } from "../utils/moodData";

function formatYMD(d: Date) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

/* ================== TYPES ================== */
interface ActivityInfo {
  label: string;
  icon: string;
  color?: string;
}

interface ActivityCounter {
  [activityId: string]: number;
}

interface MoodActivityMap {
  [moodId: string]: ActivityCounter;
}

/* ================== MAIN ================== */
export async function getMoodActivityByRange(
  uid: string,
  start: Date,
  end: Date
) {
  const moodRef = collection(firestore, "users", uid, "moodLogs");
  const actRef = collection(firestore, "users", uid, "activities");

  const [moodSnap, actSnap] = await Promise.all([
    getDocs(moodRef),
    getDocs(actRef),
  ]);

  const startKey = formatYMD(start);
  const endKey = formatYMD(end);

  /* ===== LOAD ACTIVITY MASTER ===== */
  const activityMap: Record<string, ActivityInfo> = {};
  actSnap.forEach((doc) => {
    activityMap[doc.id] = doc.data() as ActivityInfo;
  });

  /* ===== COUNT ACTIVITIES BY MOOD ===== */
  const moodMap: MoodActivityMap = {};

  moodSnap.forEach((doc) => {
    const dateKey = doc.id;
    if (dateKey < startKey || dateKey > endKey) return;

    const { moodId, activities = [] } = doc.data();
    if (!moodId) return;

    if (!moodMap[moodId]) {
      moodMap[moodId] = {};
    }

    activities.forEach((actId: string) => {
      moodMap[moodId][actId] =
        (moodMap[moodId][actId] || 0) + 1;
    });
  });

  /* ===== FORMAT FOR UI ===== */
  return Object.entries(moodMap).map(([moodId, acts]) => {
    const total = Object.values(acts).reduce((a, b) => a + b, 0);
    const mood = moodData.find((m) => m.id === moodId);

    return {
      moodId,
      label: mood?.label ?? moodId,
      activities: Object.entries(acts).map(
        ([id, count]) => {
          const meta = activityMap[id];

          return {
            id,
            count,
            percent: Math.round((count / total) * 100),
            label: meta?.label ?? id,
            icon: meta?.icon ?? "help-circle",
            color: meta?.color ?? "#E5E7EB",
          };
        }
      ),
    };
  });
}
