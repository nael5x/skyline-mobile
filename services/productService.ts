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
  orderBy,
  limit,
  increment,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from "@/config/firebase";
import { Product } from "@/types";

const COLLECTION = "products";

export async function getAllProducts(): Promise<Product[]> {
  const q = query(
    collection(db, COLLECTION),
    where("isActive", "==", true),
    orderBy("sortOrder", "asc")
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }) as Product);
}

export async function getProductById(id: string): Promise<Product | null> {
  const docRef = doc(db, COLLECTION, id);
  const snap = await getDoc(docRef);
  if (!snap.exists()) return null;
  return { id: snap.id, ...snap.data() } as Product;
}

export async function getProductsByCategory(
  categoryId: string
): Promise<Product[]> {
  const q = query(
    collection(db, COLLECTION),
    where("categoryId", "==", categoryId),
    where("isActive", "==", true),
    orderBy("sortOrder", "asc")
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }) as Product);
}

export async function getFeaturedProducts(): Promise<Product[]> {
  const q = query(
    collection(db, COLLECTION),
    where("isFeatured", "==", true),
    where("isActive", "==", true),
    limit(10)
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }) as Product);
}

export async function getBestSellers(): Promise<Product[]> {
  const q = query(
    collection(db, COLLECTION),
    where("isBestSeller", "==", true),
    where("isActive", "==", true),
    limit(10)
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }) as Product);
}

export async function addProduct(
  data: Omit<Product, "id">
): Promise<string> {
  const docRef = await addDoc(collection(db, COLLECTION), {
    ...data,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  });
  return docRef.id;
}

export async function updateProduct(
  id: string,
  data: Partial<Product>
): Promise<void> {
  await updateDoc(doc(db, COLLECTION, id), {
    ...data,
    updatedAt: Date.now(),
  });
}

export async function deleteProduct(id: string): Promise<void> {
  await deleteDoc(doc(db, COLLECTION, id));
}

export async function incrementViews(id: string): Promise<void> {
  await updateDoc(doc(db, COLLECTION, id), {
    viewCount: increment(1),
  });
}

export async function updateStock(
  id: string,
  newStock: number
): Promise<void> {
  await updateDoc(doc(db, COLLECTION, id), {
    stock: newStock,
    updatedAt: Date.now(),
  });
}

export async function uploadProductImage(
  productId: string,
  imageUri: string,
  fileName: string
): Promise<string> {
  const response = await fetch(imageUri);
  const blob = await response.blob();
  const imageRef = ref(storage, `products/${productId}/${fileName}`);
  await uploadBytes(imageRef, blob);
  return getDownloadURL(imageRef);
}

export function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}
