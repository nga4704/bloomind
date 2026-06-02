import { collection, getDocs, doc, setDoc } from "firebase/firestore";
import { firestore } from "../../../services/firebase/firebaseConfig";
import { ActivityItem } from "../../../utils/activities";

export const fetchActivities = async (uid: string): Promise<ActivityItem[]> => {
  const ref = collection(firestore, "users", uid, "activities");
  const snapshot = await getDocs(ref);

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...(doc.data() as Omit<ActivityItem, "id">),
  }));
};

export const addActivityToFirebase = async (
  uid: string,
  item: ActivityItem
) => {
  await setDoc(
    doc(firestore, "users", uid, "activities", item.id),
    {
      label: item.label,
      icon: item.icon,
      createdAt: new Date(),
    }
  );
};