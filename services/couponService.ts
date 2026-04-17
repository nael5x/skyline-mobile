import {
  collection,
  doc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  increment,
} from "firebase/firestore";
import { db } from "@/config/firebase";
import { Coupon } from "@/types";

const COLLECTION = "coupons";

export async function validateCoupon(
  code: string
): Promise<{ valid: boolean; discount: number; message: string }> {
  const q = query(
    collection(db, COLLECTION),
    where("code", "==", code.toUpperCase()),
    where("isActive", "==", true)
  );
  const snap = await getDocs(q);

  if (snap.empty) {
    return { valid: false, discount: 0, message: "Invalid coupon code" };
  }

  const coupon = { id: snap.docs[0].id, ...snap.docs[0].data() } as Coupon;

  if (coupon.expiryDate && coupon.expiryDate < Date.now()) {
    return { valid: false, discount: 0, message: "Coupon has expired" };
  }

  if (coupon.usageLimit > 0 && coupon.usedCount >= coupon.usageLimit) {
    return { valid: false, discount: 0, message: "Coupon usage limit reached" };
  }

  return {
    valid: true,
    discount: coupon.discountPercent,
    message: `${coupon.discountPercent}% discount applied!`,
  };
}

export async function useCoupon(code: string): Promise<void> {
  const q = query(
    collection(db, COLLECTION),
    where("code", "==", code.toUpperCase())
  );
  const snap = await getDocs(q);
  if (!snap.empty) {
    await updateDoc(doc(db, COLLECTION, snap.docs[0].id), {
      usedCount: increment(1),
    });
  }
}

export async function getAllCoupons(): Promise<Coupon[]> {
  const snap = await getDocs(collection(db, COLLECTION));
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }) as Coupon);
}

export async function addCoupon(
  data: Omit<Coupon, "id">
): Promise<string> {
  const docRef = await addDoc(collection(db, COLLECTION), {
    ...data,
    createdAt: Date.now(),
  });
  return docRef.id;
}

export async function updateCoupon(
  id: string,
  data: Partial<Coupon>
): Promise<void> {
  await updateDoc(doc(db, COLLECTION, id), data);
}

export async function deleteCoupon(id: string): Promise<void> {
  await deleteDoc(doc(db, COLLECTION, id));
}
