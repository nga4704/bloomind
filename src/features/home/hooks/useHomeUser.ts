import { useEffect, useState } from "react";
import { getAuth } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { firestore } from "../../../services/firebase/firebaseConfig";

interface HomeUser {
  uid: string;
  name: string;
  avatar?: string;
  exp?: number;
}

export const useHomeUser = () => {
  const [userInfo, setUserInfo] = useState<HomeUser | null>(null);

  useEffect(() => {
    const load = async () => {
      const user = getAuth().currentUser;

      if (!user) return;

      const snap = await getDoc(
        doc(firestore, "users", user.uid)
      );

      if (!snap.exists()) return;

      const data = snap.data();

      setUserInfo({
        uid: user.uid,
        name: data.displayName || "User",
        avatar: data.avatar,
        exp: data.exp ?? 0,
      });
    };

    load();
  }, []);

  return userInfo;
};