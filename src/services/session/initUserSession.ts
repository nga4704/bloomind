import { doc, getDoc, setDoc } from "firebase/firestore";
import { firestore } from "../firebase/firebaseConfig";
import { seedActivitiesIfNeeded } from "../../features/mood/services/seedActivities";

export const initUserSession = async (uid: string, email?: string) => {
  try {
    const ref = doc(firestore, "users", uid);
    const snap = await getDoc(ref);

    if (!snap.exists()) {
      await setDoc(ref, {
        uid,
        email: email || "",
        createdAt: new Date().toISOString(),
        displayName: "",
        avatar: "",
        provider: "email",
        role: "user",
        disabled: false,
        aiProfile: null,
      });
    }

    // background job
    seedActivitiesIfNeeded(uid).catch(console.error);

  } catch (err) {
    console.log("initUserSession error:", err);
  }
};