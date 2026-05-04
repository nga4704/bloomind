import { authService } from "../services/authService";
import { firestore } from "../../../services/firebase/firebaseConfig";
import { doc, setDoc } from "firebase/firestore";
import { seedActivitiesIfNeeded } from "../../mood/services/seedActivities";

export const useRegister = () => {
  const register = async (email: string, password: string) => {
    if (!email || !password) {
      throw new Error("Missing email or password");
    }

    const res = await authService.register(email, password);

    await setDoc(doc(firestore, "users", res.user.uid), {
      uid: res.user.uid,
      email,
      createdAt: new Date().toISOString(),
      displayName: "",
      avatar: "",
      provider: "email",
      role: "user",
    });

    await seedActivitiesIfNeeded(res.user.uid);

    return res.user;
  };

  return { register };
};