export interface MultiLang {
  ar: string;
  tr: string;
  en: string;
}

export interface Address {
  id: string;
  label: string;
  street: string;
  city: string;
  country: string;
  notes?: string;
  isDefault: boolean;
}

export type UserRole = "customer" | "admin";

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  language: "ar" | "tr" | "en";
  addresses: Address[];
  fcmToken?: string;
  createdAt: number;
  updatedAt: number;
}

export interface ProductVariantOption {
  optionId: string;
  value: MultiLang;
  priceModifier: number;
  stock: number;
}

export interface ProductVariant {
  variantId: string;
  label: MultiLang;
  options: ProductVariantOption[];
}

export interface Product {
  id: string;
  name: MultiLang;
  description: MultiLang;
  shortDescription: MultiLang;
  slug: string;
  categoryId: string;
  subCategoryId?: string;
  tags: string[];
  images: string[];
  thumbnailUrl: string;
  videoUrl?: string;
  basePrice: number;
  salePrice?: number;
  discountPercent?: number;
  discountExpiry?: number;
  currency: string;
  priceUnit?: string;
  vatRate: number;
  variants: ProductVariant[];
  stock: number;
  lowStockThreshold: number;
  trackInventory: boolean;
  sku?: string;
  barcode?: string;
  totalSold: number;
  totalRevenue: number;
  viewCount: number;
  wishlistCount: number;
  rating: number;
  reviewCount: number;
  weight?: number;
  dimensions?: { w: number; h: number; d: number };
  isDigital: boolean;
  shippingClass?: string;
  freeShipping: boolean;
  seoTitle?: MultiLang;
  seoDescription?: MultiLang;
  seoKeywords?: string[];
  isActive: boolean;
  isFeatured: boolean;
  isNew: boolean;
  isBestSeller: boolean;
  sortOrder: number;
  createdAt: number;
  updatedAt: number;
  createdBy?: string;
}

export interface Category {
  id: string;
  name: MultiLang;
  slug: string;
  iconUrl?: string;
  imageUrl?: string;
  color: string;
  parentId?: string;
  sortOrder: number;
  isActive: boolean;
  productCount: number;
  createdAt: number;
  updatedAt: number;
}

export type OrderStatus =
  | "pending"
  | "confirmed"
  | "printing"
  | "ready"
  | "delivered"
  | "cancelled";

export interface OrderItem {
  productId: string;
  productName: MultiLang;
  variantId?: string;
  variantLabel?: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  thumbnailUrl?: string;
}

export interface StatusHistoryEntry {
  status: OrderStatus;
  timestamp: number;
  note?: string;
}

export interface Order {
  id: string;
  userId: string;
  items: OrderItem[];
  subtotal: number;
  vatAmount: number;
  deliveryFee: number;
  couponCode?: string;
  couponDiscount: number;
  totalAmount: number;
  paymentMethod: "cash" | "bank_transfer";
  deliveryAddress: {
    street: string;
    city: string;
    country: string;
    notes?: string;
  };
  status: OrderStatus;
  statusHistory: StatusHistoryEntry[];
  notes?: string;
  whatsappSent: boolean;
  createdAt: number;
  updatedAt: number;
}

export interface Coupon {
  id: string;
  code: string;
  discountPercent: number;
  isActive: boolean;
  expiryDate: number;
  usageLimit: number;
  usedCount: number;
  createdAt: number;
}

export type NotificationType = "order_update" | "promotion" | "general";

export interface Notification {
  id: string;
  userId: string;
  title: MultiLang;
  body: MultiLang;
  type: NotificationType;
  isRead: boolean;
  orderId?: string;
  createdAt: number;
}

export interface AppSettings {
  companyInfo: {
    name: string;
    phone: string;
    email: string;
    address: string;
    socialLinks: Record<string, string>;
  };
  vatRate: number;
  deliveryFee: number;
  bankDetails: {
    bankName: string;
    iban: string;
    accountName: string;
  };
  maintenanceMode: boolean;
}

export interface DashboardStats {
  totalOrders: number;
  totalRevenue: number;
  todayOrders: number;
  todayRevenue: number;
  pendingOrders: number;
  totalCustomers: number;
  topProducts: { productId: string; name: string; sold: number }[];
}

export interface DailyStats {
  date: string;
  orders: number;
  revenue: number;
}

export interface CategoryStats {
  categoryId: string;
  name: string;
  orders: number;
  revenue: number;
}
