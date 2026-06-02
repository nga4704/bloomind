import { MoodLog } from "../../../types/mood";
import { rankRecommendations } from "../core/hybridRanker";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { firestore } from "../../../services/firebase/firebaseConfig";
import { ACTIVITY_CATALOG } from "../data/activityCatalog";

function getTodayKey() {
  const d = new Date();
  return d.toISOString().split("T")[0];
}

/**
 * MAIN ENTRY
 */
export async function generateRecommendations(userId: string, mood: MoodLog) {
  const normalizedMood = {
    ...mood,
    moodId: mood.moodId || (mood as any).id || "neutral",
    activities: mood.activities || [],
    detailMoods: mood.detailMoods || [],
    note: mood.note || "",
  };
  const date = getTodayKey();

  const snapshotRef = doc(
    firestore,
    "users",
    userId,
    "recommendationSnapshots",
    date
  );

  const snap = await getDoc(snapshotRef);

  if (snap.exists()) {
    const data = snap.data();

    if (
      data?.rankedActions?.length > 0 &&
      data?.moodId === normalizedMood.moodId
    ) {
      return data.rankedActions;
    }
  }

  const ranked = rankRecommendations(normalizedMood);

  const safeRanked = ranked?.length ? ranked : ACTIVITY_CATALOG.slice(0, 3);

  await setDoc(snapshotRef, {
    moodId: mood.moodId,
    rankedActions: safeRanked,
    createdAt: new Date().toISOString(),
  });

  return safeRanked;
}