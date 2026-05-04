import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import "@react-native-async-storage/async-storage";
import {
  FIREBASE_API_KEY,
  FIREBASE_AUTH_DOMAIN,
  FIREBASE_PROJECT_ID,
  FIREBASE_STORAGE_BUCKET,
  FIREBASE_MESSAGING_SENDER_ID,
  FIREBASE_APP_ID,
} from "@env";

const firebaseConfig = {
  apiKey: FIREBASE_API_KEY || "missing",
  authDomain: FIREBASE_AUTH_DOMAIN || "missing",
  projectId: FIREBASE_PROJECT_ID || "missing",
  storageBucket: FIREBASE_STORAGE_BUCKET || "missing",
  messagingSenderId: FIREBASE_MESSAGING_SENDER_ID || "missing",
  appId: FIREBASE_APP_ID || "missing",
};

const app = initializeApp(firebaseConfig);

// let analytics: ReturnType<typeof getAnalytics> | undefined;
// if (typeof window !== "undefined") {
//   try {
//     analytics = getAnalytics(app);
//   } catch (err) {
//     console.warn("Firebase analytics not initialized:", (err as Error).message);
//   }
// }
const firestore = getFirestore(app);
const auth = getAuth(app);

export { app, auth, firestore};
export default app;
