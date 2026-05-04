// src/feature/mood/services/mood.service.ts
import { getAuth } from "firebase/auth";
import {
  collection,
  getDocs, doc, getDoc,
  query,
  where,
  limit,
} from "firebase/firestore";
import { firestore } from "../../../services/firebase/firebaseConfig";
import dayjs from "dayjs";

export const getMoodByDate = async (date: Date) => {
  const user = getAuth().currentUser;
  if (!user) return null;

  const dateKey = dayjs(date).format("YYYY-MM-DD");

  const q = query(
    collection(firestore, "users", user.uid, "moodLogs"),
    where("date", "==", dateKey),
    limit(1)
  );

  const snap = await getDocs(q);

  if (snap.empty) return null;

  const data = snap.docs[0].data();

  return {
    id: data.moodId,
    label: data.moodLabel,
    detailMoods: data.detailMoods || [],
  };
};

export const getTodayMood = async (uid: string, date: string) => {
  const ref = doc(firestore, "users", uid, "moodLogs", date);
  const snap = await getDoc(ref);

  if (!snap.exists()) return null;

  return snap.data();
};