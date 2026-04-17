import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyAmd8EyJEZ6RX-q3bLOir93i0Ns9g6oNu4",
  authDomain: "skyline-group-93ed5.firebaseapp.com",
  projectId: "skyline-group-93ed5",
  storageBucket: "skyline-group-93ed5.firebasestorage.app",
  messagingSenderId: "98195112078",
  appId: "1:98195112078:web:24808a6dee8db4b5eb89df"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export default app;