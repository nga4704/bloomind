import { doc, getDoc, setDoc, increment } from "firebase/firestore";
import { firestore } from "../../../services/firebase/firebaseConfig";

export async function fetchRecommendationStatus(
  userId: string,
  date: string
): Promise<{ doneIds: string[]; earnedExp: number }> {
  console.log("Fetching recommendation status for user:", userId, "date:", date); // Thêm log
  const ref = doc(firestore, "users", userId, "recommendationStatus", date);
  const snap = await getDoc(ref);

  if (!snap.exists()) {
    console.log("No existing status, returning defaults"); // Thêm log
    return { doneIds: [], earnedExp: 0 };
  }

  const data = snap.data();
  console.log("Fetched data:", data); // Thêm log
  return {
    doneIds: data.doneActionIds ?? [],
    earnedExp: data.earnedExp ?? 0,
  };
}

export async function toggleRecommendationDone(
  userId: string,
  date: string,
  actionId: string,
  exp: number,
  alreadyDone: boolean
) {
  console.log("Toggling recommendation for user:", userId, "action:", actionId, "alreadyDone:", alreadyDone); // Thêm log
  const statusRef = doc(
    firestore,
    "users",
    userId,
    "recommendationStatus",
    date
  );
  const userRef = doc(firestore, "users", userId);

  const snap = await getDoc(statusRef);

  let currentIds: string[] = [];
  let currentEarned = 0;

  if (snap.exists()) {
    const d = snap.data();
    currentIds = d.doneActionIds ?? [];
    currentEarned = d.earnedExp ?? 0;
  }

  const updatedIds = alreadyDone
    ? currentIds.filter(id => id !== actionId)
    : [...currentIds, actionId];

  const expChange = alreadyDone ? -exp : exp;

  console.log("Updating Firestore: updatedIds:", updatedIds, "expChange:", expChange); // Thêm log
  await setDoc(
    statusRef,
    {
      date,
      doneActionIds: updatedIds,
      earnedExp: Math.max(0, currentEarned + expChange),
    },
    { merge: true }
  );

  await setDoc(
    userRef,
    {
      exp: increment(expChange),
    },
    { merge: true }
  );
  console.log("Firestore update completed"); // Thêm log
}