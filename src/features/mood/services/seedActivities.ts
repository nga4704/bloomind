import { collection, doc, getDocs, setDoc } from "firebase/firestore";
import { firestore } from "../../../services/firebase/firebaseConfig";
import { ACTIVITIES } from "../../../utils/activities";

export const seedActivitiesIfNeeded = async (uid: string) => {
  const activitiesRef = collection(firestore, "users", uid, "activities");

  // Kiểm tra đã có activity chưa
  const snapshot = await getDocs(activitiesRef);

  if (!snapshot.empty) {
    console.log("Activities đã tồn tại, không cần seed");
    return;
  }

  console.log("Seeding default activities...");

  for (const item of ACTIVITIES) {
    await setDoc(doc(activitiesRef, item.id), {
      label: item.label,
      icon: item.icon,
      createdAt: new Date(),
      isDefault: true,
    });
  }

  console.log("🎉 Seed activities thành công");
};
