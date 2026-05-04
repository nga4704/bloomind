import { useEffect, useState } from "react";
import { getAuth } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { firestore } from "../../../services/firebase/firebaseConfig";

export const useHomeUser = () => {
  const [userInfo, setUserInfo] = useState<{
    name: string;
    avatar?: string;
  } | null>(null);

  useEffect(() => {
    const load = async () => {
      const user = getAuth().currentUser;
      if (!user) return;

      const snap = await getDoc(doc(firestore, "users", user.uid));
      if (snap.exists()) {
        const data = snap.data();
        setUserInfo({
          name: data.displayName || "User",
          avatar: data.avatar,
        });
      }
    };

    load();
  }, []);

  return userInfo;
};
