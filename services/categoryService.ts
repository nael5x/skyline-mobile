import { Category } from "@/types";
import { apiGet } from "./apiClient";

type ApiCategory = {
  id: string;
  name: string;
  name_ar: string;
  name_tr: string;
  products_count: number;
};

type CategoriesPayload = {
  items: ApiCategory[];
  total: number;
};

function hasArabic(value?: string | null): boolean {
  return /[\u0600-\u06FF]/.test(value || "");
}

function multiLang(ar?: string | null, tr?: string | null, en?: string | null) {
  const arabic = ar || tr || en || "";
  const turkish = tr && !hasArabic(tr) ? tr : arabic;
  const english = en || arabic;

  return {
    ar: arabic,
    tr: turkish,
    en: english,
  };
}

function generateSlug(value: string): string {
  return String(value || "")
    .toLowerCase()
    .replace(/[^a-z0-9\u0600-\u06FF]+/g, "-")
    .replace(/^-|-$/g, "");
}

function getCategoryNameAr(item: ApiCategory): string {
  const id = String(item.id || item.name || "").trim();

  if (id === "machine") return "الماكينات";
  if (id === "raw_material") return "المواد الخام";

  return item.name_ar || item.name || "منتجات أخرى";
}

function getCategoryNameTr(item: ApiCategory): string {
  const id = String(item.id || item.name || "").trim();

  if (id === "machine") return "Makineler";
  if (id === "raw_material") return "Ham Maddeler";

  if (item.name_tr && !hasArabic(item.name_tr)) {
    return item.name_tr;
  }

  return getCategoryNameAr(item);
}

function toCategory(item: ApiCategory, index: number): Category {
  const arName = getCategoryNameAr(item);
  const trName = getCategoryNameTr(item);
  const now = Date.now();

  return {
    // مهم جدًا: لا نضع arName هنا
    // لازم يبقى id كما يأتي من API حتى فلترة machine و raw_material تعمل
    id: item.id || item.name_ar || item.name,

    name: multiLang(arName, trName, arName),
    slug: generateSlug(arName),

    iconUrl: undefined,
    imageUrl: undefined,

    color: "#243F73",
    parentId: undefined,

    sortOrder: index,
    isActive: true,
    productCount: Number(item.products_count) || 0,

    createdAt: now,
    updatedAt: now,
  };
}

export async function getAllCategories(): Promise<Category[]> {
  try {
    const data = await apiGet<CategoriesPayload>("/categories.php");
    return data.items.map(toCategory);
  } catch (error) {
    console.error("Error fetching categories from API:", error);
    return [];
  }
}

export async function getCategoryById(id: string): Promise<Category | null> {
  try {
    const categories = await getAllCategories();

    return (
      categories.find(
        (category) =>
          category.id === id ||
          category.slug === id
      ) || null
    );
  } catch (error) {
    console.error("Error fetching category by id from API:", error);
    return null;
  }
}

export async function addCategory(
  data: Omit<Category, "id">
): Promise<string> {
  console.warn("addCategory is disabled. Use the website admin panel.", data);

  throw new Error(
    "Adding categories from mobile app is disabled. Use the website admin panel."
  );
}

export async function updateCategory(
  id: string,
  data: Partial<Category>
): Promise<void> {
  console.warn("updateCategory is disabled. Use the website admin panel.", id, data);

  throw new Error(
    "Updating categories from mobile app is disabled. Use the website admin panel."
  );
}

export async function deleteCategory(id: string): Promise<void> {
  console.warn("deleteCategory is disabled. Use the website admin panel.", id);

  throw new Error(
    "Deleting categories from mobile app is disabled. Use the website admin panel."
  );
}