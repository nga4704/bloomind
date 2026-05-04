import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import { auth } from "../../../services/firebase/firebaseConfig";

export const authService = {
  async login(email: string, password: string) {
    return await signInWithEmailAndPassword(auth, email, password);
  },

  async register(email: string, password: string) {
    return await createUserWithEmailAndPassword(auth, email, password);
  },
};