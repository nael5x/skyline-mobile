import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  query,
  where,
  orderBy,
  limit,
} from "firebase/firestore";
import { db } from "@/config/firebase";
import { Order, OrderStatus } from "@/types";
import { Linking } from "react-native";

const COLLECTION = "orders";

export async function createOrder(
  data: Omit<Order, "id">
): Promise<string> {
  const docRef = await addDoc(collection(db, COLLECTION), {
    ...data,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  });
  return docRef.id;
}

export async function getOrderById(id: string): Promise<Order | null> {
  const snap = await getDoc(doc(db, COLLECTION, id));
  if (!snap.exists()) return null;
  return { id: snap.id, ...snap.data() } as Order;
}

export async function getOrdersByUser(userId: string): Promise<Order[]> {
  const q = query(
    collection(db, COLLECTION),
    where("userId", "==", userId),
    orderBy("createdAt", "desc")
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }) as Order);
}

export async function getAllOrders(
  statusFilter?: OrderStatus
): Promise<Order[]> {
  let q;
  if (statusFilter) {
    q = query(
      collection(db, COLLECTION),
      where("status", "==", statusFilter),
      orderBy("createdAt", "desc")
    );
  } else {
    q = query(
      collection(db, COLLECTION),
      orderBy("createdAt", "desc")
    );
  }
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }) as Order);
}

export async function updateOrderStatus(
  orderId: string,
  newStatus: OrderStatus,
  note?: string
): Promise<void> {
  const orderDoc = await getDoc(doc(db, COLLECTION, orderId));
  if (!orderDoc.exists()) throw new Error("Order not found");

  const current = orderDoc.data() as Order;
  const statusHistory = [
    ...(current.statusHistory || []),
    { status: newStatus, timestamp: Date.now(), note },
  ];

  await updateDoc(doc(db, COLLECTION, orderId), {
    status: newStatus,
    statusHistory,
    updatedAt: Date.now(),
  });
}

export async function cancelOrder(orderId: string): Promise<void> {
  await updateOrderStatus(orderId, "cancelled", "Cancelled by user");
}

export function sendWhatsAppOrder(
  phone: string,
  orderSummary: string
): void {
  const encoded = encodeURIComponent(orderSummary);
  const url = `https://wa.me/${phone.replace(/\+/g, "")}?text=${encoded}`;
  Linking.openURL(url);
}
