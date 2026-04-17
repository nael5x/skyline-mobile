import {
  collection,
  getDocs,
  query,
  where,
  orderBy,
} from "firebase/firestore";
import { db } from "@/config/firebase";
import { DashboardStats, DailyStats, Order } from "@/types";

export async function getDashboardStats(): Promise<DashboardStats> {
  const ordersSnap = await getDocs(collection(db, "orders"));
  const usersSnap = await getDocs(collection(db, "users"));

  const orders = ordersSnap.docs.map((d) => ({ id: d.id, ...d.data() }) as Order);

  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();

  const todayOrders = orders.filter((o) => o.createdAt >= todayStart);
  const pendingOrders = orders.filter((o) => o.status === "pending");

  const productSales: Record<string, { name: string; sold: number }> = {};
  for (const order of orders) {
    for (const item of order.items) {
      const key = item.productId;
      if (!productSales[key]) {
        const name =
          typeof item.productName === "object"
            ? (item.productName as any).en || (item.productName as any).ar
            : item.productName;
        productSales[key] = { name, sold: 0 };
      }
      productSales[key].sold += item.quantity;
    }
  }

  const topProducts = Object.entries(productSales)
    .map(([productId, { name, sold }]) => ({ productId, name, sold }))
    .sort((a, b) => b.sold - a.sold)
    .slice(0, 5);

  return {
    totalOrders: orders.length,
    totalRevenue: orders.reduce((sum, o) => sum + o.totalAmount, 0),
    todayOrders: todayOrders.length,
    todayRevenue: todayOrders.reduce((sum, o) => sum + o.totalAmount, 0),
    pendingOrders: pendingOrders.length,
    totalCustomers: usersSnap.size,
    topProducts,
  };
}

export async function getDailyStats(days: number = 7): Promise<DailyStats[]> {
  const now = new Date();
  const startDate = new Date(now.getTime() - days * 86400000);
  const startTs = startDate.getTime();

  const q = query(
    collection(db, "orders"),
    where("createdAt", ">=", startTs),
    orderBy("createdAt", "asc")
  );
  const snap = await getDocs(q);
  const orders = snap.docs.map((d) => d.data() as Order);

  const dailyMap: Record<string, DailyStats> = {};
  for (let i = 0; i < days; i++) {
    const d = new Date(now.getTime() - (days - 1 - i) * 86400000);
    const key = d.toISOString().split("T")[0];
    dailyMap[key] = { date: key, orders: 0, revenue: 0 };
  }

  for (const order of orders) {
    const key = new Date(order.createdAt).toISOString().split("T")[0];
    if (dailyMap[key]) {
      dailyMap[key].orders++;
      dailyMap[key].revenue += order.totalAmount;
    }
  }

  return Object.values(dailyMap);
}
