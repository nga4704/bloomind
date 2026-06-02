// services/auth/authService.ts
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import { auth } from "../firebase/firebaseConfig";

export const authService = {
  login(email: string, password: string) {
    return signInWithEmailAndPassword(auth, email, password);
  },

  register(email: string, password: string) {
    return createUserWithEmailAndPassword(auth, email, password);
  },
};