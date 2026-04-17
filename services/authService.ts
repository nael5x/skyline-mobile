import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  updateProfile,
  onAuthStateChanged,
  User as FirebaseUser,
} from "firebase/auth";
import {
  doc,
  setDoc,
  getDoc,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";
import { auth, db } from "@/config/firebase";
import { User, UserRole } from "@/types";

export async function register(
  email: string,
  password: string,
  name: string,
  phone: string,
  language: "ar" | "tr" | "en" = "ar"
): Promise<User> {
  const cred = await createUserWithEmailAndPassword(auth, email, password);
  await updateProfile(cred.user, { displayName: name });

  const userData: Omit<User, "id"> = {
    name,
    email,
    phone,
    role: "customer",
    language,
    addresses: [],
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };

  await setDoc(doc(db, "users", cred.user.uid), userData);

  return { id: cred.user.uid, ...userData };
}

export async function loginWithEmail(
  email: string,
  password: string
): Promise<User> {
  const cred = await signInWithEmailAndPassword(auth, email, password);
  const userDoc = await getDoc(doc(db, "users", cred.user.uid));

  if (!userDoc.exists()) {
    throw new Error("User data not found");
  }

  return { id: cred.user.uid, ...userDoc.data() } as User;
}

export async function logout(): Promise<void> {
  await signOut(auth);
}

export async function resetPassword(email: string): Promise<void> {
  await sendPasswordResetEmail(auth, email);
}

export function getCurrentFirebaseUser(): FirebaseUser | null {
  return auth.currentUser;
}

export async function getUserProfile(uid: string): Promise<User | null> {
  const userDoc = await getDoc(doc(db, "users", uid));
  if (!userDoc.exists()) return null;
  return { id: uid, ...userDoc.data() } as User;
}

export async function updateUserProfile(
  uid: string,
  data: Partial<Pick<User, "name" | "phone" | "language" | "addresses">>
): Promise<void> {
  await updateDoc(doc(db, "users", uid), {
    ...data,
    updatedAt: Date.now(),
  });
}

export async function isAdmin(uid: string): Promise<boolean> {
  const user = await getUserProfile(uid);
  return user?.role === "admin";
}

export function onAuthChange(callback: (user: FirebaseUser | null) => void) {
  return onAuthStateChanged(auth, callback);
}
