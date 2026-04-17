import {
  collection,
  doc,
  getDocs,
  addDoc,
  updateDoc,
  query,
  where,
  orderBy,
  writeBatch,
} from "firebase/firestore";
import { db } from "@/config/firebase";
import { Notification, MultiLang } from "@/types";

const COLLECTION = "notifications";

export async function getNotificationsByUser(
  userId: string
): Promise<Notification[]> {
  const q = query(
    collection(db, COLLECTION),
    where("userId", "==", userId),
    orderBy("createdAt", "desc")
  );
  const snap = await getDocs(q);
  return snap.docs.map(
    (d) => ({ id: d.id, ...d.data() }) as Notification
  );
}

export async function getUnreadCount(userId: string): Promise<number> {
  const q = query(
    collection(db, COLLECTION),
    where("userId", "==", userId),
    where("isRead", "==", false)
  );
  const snap = await getDocs(q);
  return snap.size;
}

export async function sendNotification(
  userId: string,
  title: MultiLang,
  body: MultiLang,
  type: Notification["type"],
  orderId?: string
): Promise<string> {
  const docRef = await addDoc(collection(db, COLLECTION), {
    userId,
    title,
    body,
    type,
    isRead: false,
    orderId: orderId || null,
    createdAt: Date.now(),
  });
  return docRef.id;
}

export async function markAsRead(notificationId: string): Promise<void> {
  await updateDoc(doc(db, COLLECTION, notificationId), {
    isRead: true,
  });
}

export async function markAllAsRead(userId: string): Promise<void> {
  const q = query(
    collection(db, COLLECTION),
    where("userId", "==", userId),
    where("isRead", "==", false)
  );
  const snap = await getDocs(q);
  const batch = writeBatch(db);
  snap.docs.forEach((d) => {
    batch.update(d.ref, { isRead: true });
  });
  await batch.commit();
}
