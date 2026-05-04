import { authService } from "../services/authService";
import { firestore } from "../../../services/firebase/firebaseConfig";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { seedActivitiesIfNeeded } from "../../mood/services/seedActivities";

export const useLogin = () => {
  const login = async (email: string, password: string) => {
    if (!email || !password) {
      throw new Error("Missing email or password");
    }

    const res = await authService.login(email, password);
    const uid = res.user.uid;

    const userRef = doc(firestore, "users", uid);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      throw new Error("User not found in Firestore");
    }

    const userData = userSnap.data();

    if (userData.disabled === true) {
      throw new Error("Account disabled");
    }

    await updateDoc(userRef, {
      lastLogin: new Date().toISOString(),
    });

    await seedActivitiesIfNeeded(uid);

    return res.user;
  };

  return { login };
};