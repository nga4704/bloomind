import { useCallback, useState } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { getAuth } from "firebase/auth";
import { collection, getDocs, query, where, limit } from "firebase/firestore";
import { firestore } from "../../../services/firebase/firebaseConfig";
import { getTodayKey } from "../../../utils/date";

export const useTodayMood = () => {
  const [todayMood, setTodayMood] = useState<any>(null);

  useFocusEffect(
    useCallback(() => {
      let mounted = true;

      const load = async () => {
        const user = getAuth().currentUser;
        if (!user) return;

        const q = query(
          collection(firestore, "users", user.uid, "moodLogs"),
          where("date", "==", getTodayKey()),
          limit(1)
        );

        const snap = await getDocs(q);
        if (!mounted) return;

        if (!snap.empty) {
          const data = snap.docs[0].data();
          setTodayMood({
            id: data.moodId,
            label: data.moodLabel,
            detailMoods: data.detailMoods || [],
          });
        } else {
          setTodayMood(null);
        }
      };

      load();
      return () => {
        mounted = false;
      };
    }, [])
  );

  return todayMood;
};
