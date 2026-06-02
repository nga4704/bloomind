import {
  doc,
  getDoc,
  setDoc,
  increment,
} from "firebase/firestore";

import { firestore } from "../../../services/firebase/firebaseConfig";

function getRef(userId: string, date: string) {
  return doc(
    firestore,
    "users",
    userId,
    "recommendationStatus",
    date
  );
}

export async function fetchRecommendationStatus(
  userId: string,
  date: string
) {
  const ref = getRef(userId, date);
  const snap = await getDoc(ref);

  if (!snap.exists()) {
    return {
      doneActionIds: [],
      skippedActionIds: [],
      earnedExp: 0,
      accuracy: 0,
    };
  }

  return snap.data();
}

export async function toggleDone(
  userId: string,
  date: string,
  actionId: string,
  exp: number,
  totalRecommendations = 5
) {
  const ref = getRef(userId, date);

  const snap = await getDoc(ref);

  const data = snap.exists()
    ? snap.data()
    : {};

  const done: string[] =
    data.doneActionIds || [];

  const earned: number =
    data.earnedExp || 0;

  const already =
    done.includes(actionId);

  const updated = already
    ? done.filter(
        (id) => id !== actionId
      )
    : [...done, actionId];

  const delta = already
    ? -exp
    : exp;

  const accuracy =
    totalRecommendations === 0
      ? 0
      : Number(
          (
            (updated.length /
              totalRecommendations) *
            100
          ).toFixed(2)
        );

  await setDoc(
    ref,
    {
      doneActionIds: updated,
      earnedExp: Math.max(
        0,
        earned + delta
      ),
      accuracy,
    },
    { merge: true }
  );

  await setDoc(
    doc(
      firestore,
      "users",
      userId
    ),
    {
      exp: increment(delta),
    },
    { merge: true }
  );
}