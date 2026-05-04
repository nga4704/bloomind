import {
  doc,
  setDoc,
  getDoc,
  deleteDoc,
  collection,
  getDocs,
  query,
  where,
  orderBy,
  serverTimestamp,
} from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { nanoid } from "nanoid/non-secure";
import { firestore } from "../../../services/firebase/firebaseConfig";
import { JournalBlock } from "../types/journal";
import { buildPreviewData, hasImageBlock } from "./journal.helpers";
import {getLocalDateKey} from "./journal.helpers";
import { Timestamp } from "firebase/firestore";

export const saveJournal = async ({
  journalId,
  date,
  blocks,
}: {
  journalId?: string;
  date: Date;
  blocks: JournalBlock[];
}) => {
  const user = getAuth().currentUser;
  if (!user) throw new Error("Not authenticated");

  const id = journalId ?? nanoid();

  const ref = doc(firestore, "users", user.uid, "journals", id);

  const { previewTitle, previewContent } = buildPreviewData(blocks);

  await setDoc(
    ref,
    {
      id,
      userId: user.uid,
      date,
      year: date.getFullYear(),
      month: date.getMonth() + 1,
      day: date.getDate(),
      dateKey: getLocalDateKey(date),

      blocks,
      previewTitle,
      previewContent,
      hasImage: hasImageBlock(blocks),

      updatedAt: serverTimestamp(),
      ...(journalId ? {} : { createdAt: serverTimestamp() }),
    },
    { merge: true }
  );

  return id;
};

/* ================= GET BY DATE ================= */
export const getJournalByDate = async (date: Date) => {
  const user = getAuth().currentUser;
  
  if (!user) return null;

  const dateKey = getLocalDateKey(date);

  const q = query(
    collection(firestore, "users", user.uid, "journals"),
    where("dateKey", "==", dateKey)
  );

  const snap = await getDocs(q);

  if (snap.empty) return null;

  return snap.docs[0].data();
};

/* GET LIST */
export const getJournalsByYear = async (year: number) => {
  const user = getAuth().currentUser;
  if (!user) return [];

  const q = query(
    collection(firestore, "users", user.uid, "journals"),
    where("year", "==", year),
    orderBy("date", "desc")
  );

  const snap = await getDocs(q);
  return snap.docs.map((d) => d.data());
};

/* GET DETAIL */
export const getJournalById = async (id: string) => {
  const user = getAuth().currentUser;
  if (!user) return null;

  const ref = doc(firestore, "users", user.uid, "journals", id);
  const snap = await getDoc(ref);

  return snap.exists() ? snap.data() : null;
};

/* DELETE */
export const deleteJournal = async (id: string) => {
  const user = getAuth().currentUser;
  if (!user) return;

  const ref = doc(firestore, "users", user.uid, "journals", id);
  await deleteDoc(ref);
};