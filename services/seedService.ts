import { collection, addDoc, getDocs, query, limit } from "firebase/firestore";
import { db } from "@/config/firebase";
import { CATEGORIES } from "@/constants/data";
import { showAlert } from "@/utils/alert"; // استدعاء الأداة التي صنعناها للويب

export async function seedIfEmpty(): Promise<{ seeded: boolean; categories: number; products: number }> {
  try {
    console.log("Starting seed process...");
    
    // التأكد إذا كانت الفئات موجودة مسبقاً
    const catSnap = await getDocs(query(collection(db, "categories"), limit(1)));
    if (!catSnap.empty) {
      showAlert("تنبيه", "قاعدة البيانات تحتوي على بيانات بالفعل، لن يتم التكرار.");
      return { seeded: false, categories: 0, products: 0 };
    }

    let catCount = 0;
    let prodCount = 0;

    for (const cat of CATEGORIES) {
      const docRef = await addDoc(collection(db, "categories"), {
        name: { ar: cat.nameAr, tr: cat.nameTr, en: cat.nameEn },
        slug: cat.id,
        iconUrl: cat.icon || "",
        imageUrl: cat.image || "",
        color: cat.color || "#1B3A6B",
        sortOrder: catCount,
        isActive: true,
        productCount: cat.products.length,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      });
      catCount++;

      for (const prod of cat.products) {
        await addDoc(collection(db, "products"), {
          name: { ar: prod.nameAr, tr: prod.nameTr, en: prod.nameEn },
          description: { ar: prod.descAr, tr: prod.descTr, en: prod.descEn },
          shortDescription: { ar: prod.descAr.slice(0, 100), tr: prod.descTr.slice(0, 100), en: prod.descEn.slice(0, 100) },
          slug: prod.id,
          categoryId: docRef.id,
          tags: [],
          images: [],
          thumbnailUrl: "",
          basePrice: 100, // وضعنا سعر افتراضي 100 بدلاً من 0
          currency: "TRY",
          vatRate: 20,
          variants: [],
          stock: 100,
          lowStockThreshold: 10,
          trackInventory: true,
          totalSold: 0,
          totalRevenue: 0,
          viewCount: 0,
          wishlistCount: 0,
          rating: 0,
          reviewCount: 0,
          isDigital: false,
          freeShipping: false,
          isActive: true,
          isFeatured: true, // جعلناها true لتظهر في الصفحة الرئيسية
          isNew: true,
          isBestSeller: false,
          sortOrder: prodCount,
          createdAt: Date.now(),
          updatedAt: Date.now(),
        });
        prodCount++;
      }
    }

    // إضافة الكوبونات
    const coupons = [
      { code: "PROMO2026", discountPercent: 10, isActive: true, expiryDate: Date.now() + 365 * 86400000, usageLimit: 100, usedCount: 0 },
      { code: "SKYLINE10", discountPercent: 10, isActive: true, expiryDate: Date.now() + 365 * 86400000, usageLimit: 50, usedCount: 0 },
      { code: "INDIRIM15", discountPercent: 15, isActive: true, expiryDate: Date.now() + 365 * 86400000, usageLimit: 30, usedCount: 0 },
    ];
    for (const coupon of coupons) {
      await addDoc(collection(db, "coupons"), { ...coupon, createdAt: Date.now() });
    }

    showAlert("نجاح", `تم بنجاح إضافة ${catCount} فئات و ${prodCount} منتجات!`);
    return { seeded: true, categories: catCount, products: prodCount };

  } catch (error: any) {
    console.error("Seed Error:", error);
    showAlert("خطأ في البيانات", "المشكلة: " + error.message);
    return { seeded: false, categories: 0, products: 0 };
  }
}