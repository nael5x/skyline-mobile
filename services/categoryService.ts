import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
} from "firebase/firestore";
import { db } from "@/config/firebase";
import { Product } from "@/types"; // تأكد من أن نوع Product معرف في ملف types

const COLLECTION = "products";

// 1. جلب منتج واحد بواسطة الـ ID (هذا ما تحتاجه صفحة التفاصيل)
export async function getProductById(id: string): Promise<Product | null> {
  try {
    const snap = await getDoc(doc(db, COLLECTION, id));
    if (!snap.exists()) return null;
    return { id: snap.id, ...snap.data() } as Product;
  } catch (error) {
    console.error("Error fetching product by ID:", error);
    return null;
  }
}

// 2. جلب كل المنتجات
export async function getAllProducts(): Promise<Product[]> {
  try {
    const q = query(collection(db, COLLECTION));
    const snap = await getDocs(q);
    return snap.docs.map((d) => ({ id: d.id, ...d.data() }) as Product);
  } catch (error) {
    console.error("Error fetching all products:", error);
    return [];
  }
}

// 3. إضافة منتج جديد
export async function addProduct(data: Omit<Product, "id">): Promise<string> {
  const docRef = await addDoc(collection(db, COLLECTION), {
    ...data,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  });
  return docRef.id;
}