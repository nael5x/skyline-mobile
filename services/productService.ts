import { Product } from "@/types";
import { apiGet } from "./apiClient";

type ApiProduct = {
  id: number | string;
  source?: "products" | "store_catalog";
  code: string | null;
  category: string | null;
  category_tr: string | null;
  name: string | null;
  name_ar: string | null;
  name_tr: string | null;
  description: string | null;
  description_ar: string | null;
  description_tr: string | null;
  price: number;
  tax_rate: number;
  type: string;
  image_path: string | null;
  image_url: string | null;
  specifications: Record<string, any> | string | null;
  created_at: string | null;
};

type ProductsPayload = {
  items: ApiProduct[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
};

function hasArabic(value?: string | null): boolean {
  return /[\u0600-\u06FF]/.test(value || "");
}

function multiLang(ar?: string | null, tr?: string | null, en?: string | null) {
  const arabic = ar || tr || en || "";

  // إذا الترجمة التركية فيها عربي، نعتبرها ناقصة ونرجع للعربي
  const turkish = tr && !hasArabic(tr) ? tr : arabic;

  // لا يوجد عندنا إنجليزي حقيقي في قاعدة البيانات، لذلك لا نعرض التركي مكان الإنجليزي
  const english = en || arabic;

  return {
    ar: arabic,
    tr: turkish,
    en: english,
  };
}

export function generateSlug(name: string): string {
  return String(name || "")
    .toLowerCase()
    .replace(/[^a-z0-9\u0600-\u06FF]+/g, "-")
    .replace(/^-|-$/g, "");
}

function getStockFromSpecifications(
  specifications: ApiProduct["specifications"]
): number {
  if (!specifications || typeof specifications !== "object") {
    return 0;
  }

  const value =
    specifications["الكمية_بالعرض"] ??
    specifications["quantity"] ??
    specifications["qty"] ??
    0;

  return Number(value) || 0;
}

function toTimestamp(value: string | null): number {
  if (!value) return Date.now();

  const timestamp = new Date(value.replace(" ", "T")).getTime();
  return Number.isNaN(timestamp) ? Date.now() : timestamp;
}

function cleanTurkish(value?: string | null, fallback = ""): string {
  const text = String(value || "").trim();

  if (text && !hasArabic(text)) {
    return text;
  }

  return fallback;
}

function toProduct(item: ApiProduct): Product {
const arName = item.name_ar || item.name || item.category || item.code || "منتج";

const arDescription =
  item.description_ar ||
  item.description ||
  "سيتم إضافة وصف المنتج قريبًا.";

const trCategory = cleanTurkish(
  item.category_tr,
  "Ürün"
);

const trName = cleanTurkish(
  item.name_tr,
  item.code ? `${trCategory} - ${item.code}` : trCategory
);

const trDescription = cleanTurkish(
  item.description_tr,
  "Ürün açıklaması yakında eklenecek."
);

  const imageUrl = item.image_url || "";
  const createdAt = toTimestamp(item.created_at);

  const product = {
    id: String(item.id),

    name: {
  ar: arName,
  tr: trName,
  en: arName,
},

description: {
  ar: arDescription,
  tr: trDescription,
  en: arDescription,
},

shortDescription: {
  ar: arDescription,
  tr: trDescription,
  en: arDescription,
},
    slug: generateSlug(`${item.code || item.id}-${arName}`),

    categoryId: item.category || "",
    subCategoryId: undefined,

    tags: [item.category, item.category_tr, item.code].filter(Boolean),

    images: imageUrl ? [imageUrl] : [],
    thumbnailUrl: imageUrl,

    videoUrl: undefined,

    basePrice: Number(item.price) || 0,
    salePrice: undefined,
    discountPercent: undefined,
    discountExpiry: undefined,

    currency: "TRY",
    priceUnit: undefined,
    vatRate: Number(item.tax_rate) || 0,

    variants: [],

    stock: getStockFromSpecifications(item.specifications),
    lowStockThreshold: 0,
    trackInventory: false,

    sku: item.code || undefined,
    barcode: undefined,

    totalSold: 0,
    totalRevenue: 0,
    viewCount: 0,
    wishlistCount: 0,

    rating: 0,
    reviewCount: 0,

    weight: undefined,
    dimensions: undefined,

    isDigital: false,
    shippingClass: undefined,
    freeShipping: false,

    seoTitle: {
  ar: arName,
  tr: trName,
  en: arName,
},

seoDescription: {
  ar: arDescription,
  tr: trDescription,
  en: arDescription,
},
    seoKeywords: [item.category, item.category_tr, item.code].filter(Boolean),

    isActive: true,
    isFeatured: false,
    isNew: false,
    isBestSeller: false,

    sortOrder: Number(String(item.id).replace(/\D/g, "")) || 0,

    createdAt,
    updatedAt: createdAt,
    createdBy: undefined,
  };

  return product as Product;
}

export async function getAllProducts(): Promise<Product[]> {
  try {
    const data = await apiGet<ProductsPayload>("/products.php", {
      limit: 500,
    });

    return data.items.map(toProduct);
  } catch (error) {
    console.error("Error fetching products from API:", error);
    return [];
  }
}

export async function getProductById(id: string): Promise<Product | null> {
  try {
    const data = await apiGet<ApiProduct>("/product.php", {
      id,
    });

    return toProduct(data);
  } catch (error) {
    console.error("Error fetching product from API:", error);
    return null;
  }
}

export async function getProductsByCategory(
  categoryId: string
): Promise<Product[]> {
  try {
    if (!categoryId || categoryId === "all") {
      return getAllProducts();
    }

    const data = await apiGet<ProductsPayload>("/products.php", {
      category: categoryId,
      limit: 500,
    });

    return data.items.map(toProduct);
  } catch (error) {
    console.error("Error fetching products by category from API:", error);
    return [];
  }
}

export async function getFeaturedProducts(): Promise<Product[]> {
  const products = await getAllProducts();
  return products.slice(0, 10);
}

export async function getBestSellers(): Promise<Product[]> {
  const products = await getAllProducts();
  return products.slice(0, 10);
}

export async function addProduct(
  data: Omit<Product, "id">
): Promise<string> {
  console.warn("addProduct is disabled. Use the website admin panel.", data);
  throw new Error(
    "Adding products from mobile app is disabled. Use the website admin panel."
  );
}

export async function updateProduct(
  id: string,
  data: Partial<Product>
): Promise<void> {
  console.warn("updateProduct is disabled. Use the website admin panel.", id, data);
  throw new Error(
    "Updating products from mobile app is disabled. Use the website admin panel."
  );
}

export async function deleteProduct(id: string): Promise<void> {
  console.warn("deleteProduct is disabled. Use the website admin panel.", id);
  throw new Error(
    "Deleting products from mobile app is disabled. Use the website admin panel."
  );
}

export async function incrementViews(id: string): Promise<void> {
  console.log("incrementViews skipped for API product:", id);
}

export async function updateStock(
  id: string,
  newStock: number
): Promise<void> {
  console.warn("updateStock is disabled. Use the website admin panel.", id, newStock);
  throw new Error(
    "Updating stock from mobile app is disabled. Use the website admin panel."
  );
}

export async function uploadProductImage(
  productId: string,
  imageUri: string,
  fileName: string
): Promise<string> {
  console.warn("uploadProductImage is disabled. Use the website admin panel.", {
    productId,
    imageUri,
    fileName,
  });

  throw new Error(
    "Uploading product images from mobile app is disabled. Use the website admin panel."
  );
}