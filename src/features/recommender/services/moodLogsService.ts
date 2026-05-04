// services/moodLogsService.ts
import { doc, getDoc, collection, getDocs, DocumentData, Timestamp } from "firebase/firestore";
import { firestore } from "../../../services/firebase/firebaseConfig";
import { MoodLog } from "../types/mood";

/**
 * Chuyển Date thành string "YYYY-MM-DD"
 */
function formatDateToYMD(date: Date) {
  return date.getFullYear() + "-" +
         String(date.getMonth() + 1).padStart(2, "0") + "-" +
         String(date.getDate()).padStart(2, "0");
}

/**
 * Lấy mood log của user theo ngày
 */
export async function fetchMoodLogByDate(uid: string, dateStr: string): Promise<MoodLog | null> {
  try {
    const ref = doc(firestore, "users", uid, "moodLogs", dateStr);
    const snap = await getDoc(ref);
    if (!snap.exists()) return null;

    const data = snap.data() as DocumentData;
    return {
      date: dateStr,
      moodId: data.moodId,
      moodLabel: data.moodLabel,
      note: data.note || "",
      activities: data.activities || [],
      detailMoods: data.detailMoods || [],
    };
  } catch (err) {
    console.error("🔥 Error fetching mood log:", err);
    return null;
  }
}

/**
 * Lấy tất cả mood logs của user
 */
export async function fetchAllMoodLogs(uid: string): Promise<MoodLog[]> {
  try {
    const snap = await getDocs(collection(firestore, "users", uid, "moodLogs"));
    const logs: MoodLog[] = snap.docs.map(d => {
      const data = d.data();
      const dateStr = d.id; // doc id = date
      return {
        date: dateStr,
        moodId: data.moodId,
        moodLabel: data.moodLabel,
        note: data.note || "",
        activities: data.activities || [],
        detailMoods: data.detailMoods || [],
      };
    });
    return logs;
  } catch (err) {
    console.error("🔥 Error fetching all mood logs:", err);
    return [];
  }
}

/**
 * Lấy mood log hôm nay
 */
export async function fetchTodayMoodLog(uid: string): Promise<MoodLog | null> {
  try {
    const todayStr = formatDateToYMD(new Date());
    const ref = doc(firestore, "users", uid, "moodLogs", todayStr);
    const snap = await getDoc(ref);
    if (!snap.exists()) {
      console.log("📌 No mood log for today yet");
      return null;
    }
    console.log("📌 Fetched today mood log:", snap.data());
    return {
      date: todayStr,
      moodId: snap.data()?.moodId,
      moodLabel: snap.data()?.moodLabel,
      note: snap.data()?.note || "",
      activities: snap.data()?.activities || [],
      detailMoods: snap.data()?.detailMoods || [],
    };
  } catch (err) {
    console.error("🔥 Error fetching mood log:", err);
    return null;
  }
}

