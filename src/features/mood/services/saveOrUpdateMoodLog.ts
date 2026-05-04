import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { firestore } from "../../../services/firebase/firebaseConfig";
import dayjs from "dayjs";

export interface MoodLogPayload {
  moodId: string;
  moodLabel: string;
  detailMoods?: string[];
  activities?: string[];
  note?: string;
  date: string;
}

export const saveOrUpdateMoodLog = async (
  uid: string,
  data: MoodLogPayload
) => {
  const ref = doc(
    firestore,
    "users",
    uid,
    "moodLogs",
    data.date 
  );

  await setDoc(
    ref,
    {
      ...data,
      updatedAt: serverTimestamp(),
    },
    { merge: true }
  );
};

