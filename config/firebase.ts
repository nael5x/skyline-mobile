import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform } from "react-native";
import { initializeApp, FirebaseApp } from "firebase/app";
import { initializeAuth, getAuth, Auth } from "firebase/auth";
// @ts-ignore - getReactNativePersistence is not in the public types but is exported
import { getReactNativePersistence } from "firebase/auth";
import { getFirestore, Firestore } from "firebase/firestore";
import { getStorage, FirebaseStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyAmd8EyJEZ6RX-q3bLOir93i0Ns9g6oNu4",
  authDomain: "skyline-group-93ed5.firebaseapp.com",
  projectId: "skyline-group-93ed5",
  storageBucket: "skyline-group-93ed5.firebasestorage.app",
  messagingSenderId: "98195112078",
  appId: "1:98195112078:web:24808a6dee8db4b5eb89df"
};

export let firebaseInitError: Error | null = null;
export let firebaseConfigSummary = "";

let app: FirebaseApp | null = null;
let _auth: Auth | null = null;
let _db: Firestore | null = null;
let _storage: FirebaseStorage | null = null;

try {
  const missing = Object.entries(firebaseConfig)
    .filter(([, v]) => !v)
    .map(([k]) => k);

  firebaseConfigSummary = `apiKey:${firebaseConfig.apiKey ? "OK" : "MISSING"} | projectId:${firebaseConfig.projectId || "MISSING"} | appId:${firebaseConfig.appId ? "OK" : "MISSING"}`;

  if (missing.length > 0) {
    throw new Error(
      `Missing Firebase env vars: ${missing.join(", ")}. Check EAS environment variables.`
    );
  }

  app = initializeApp(firebaseConfig);

  if (Platform.OS === "web") {
    _auth = getAuth(app);
  } else {
    if (typeof getReactNativePersistence !== "function") {
      throw new Error(
        "getReactNativePersistence is not available. Metro may not be resolving firebase/auth correctly. Check metro.config.js."
      );
    }
    _auth = initializeAuth(app, {
      persistence: getReactNativePersistence(AsyncStorage),
    });
  }

  _db = getFirestore(app);
  _storage = getStorage(app);
} catch (e) {
  firebaseInitError = e instanceof Error ? e : new Error(String(e));
  console.error("Firebase init failed:", firebaseInitError);
}

export const auth = _auth as Auth;
export const db = _db as Firestore;
export const storage = _storage as FirebaseStorage;
export default app;