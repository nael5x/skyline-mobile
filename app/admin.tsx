import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import colors from "@/constants/colors";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";
import { getAllOrders, updateOrderStatus } from "@/services/orderService";
import { getDashboardStats } from "@/services/dashboardService";
import { seedIfEmpty } from "@/services/seedService";
import { Order, OrderStatus, DashboardStats } from "@/types";

const STATUS_COLORS: Record<OrderStatus, string> = {
  pending: "#F59E0B",
  confirmed: "#3B82F6",
  printing: "#8B5CF6",
  ready: "#10B981",
  delivered: "#059669",
  cancelled: "#EF4444",
};

const NEXT_STATUS: Partial<Record<OrderStatus, OrderStatus>> = {
  pending: "confirmed",
  confirmed: "printing",
  printing: "ready",
  ready: "delivered",
};

export default function AdminScreen() {
  const { t, isRTL, language } = useLanguage();
  const { user, isAdmin } = useAuth();
  const insets = useSafeAreaInsets();
  const topPad = Platform.OS === "web" ? 16 : insets.top + 16;

  const [tab, setTab] = useState<"dashboard" | "orders" | "tools">("dashboard");
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [seeding, setSeeding] = useState(false);
  const [statusFilter, setStatusFilter] = useState<OrderStatus | "all">("all");

  useEffect(() => {
    if (!isAdmin) return;
    loadData();
  }, [isAdmin]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [s, o] = await Promise.all([getDashboardStats(), getAllOrders()]);
      setStats(s);
      setOrders(o);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (orderId: string, newStatus: OrderStatus) => {
    try {
      await updateOrderStatus(orderId, newStatus);
      await loadData();
    } catch {
      Alert.alert("Error", "Failed to update order status");
    }
  };

  const handleSeed = async () => {
    setSeeding(true);
    try {
      const result = await seedIfEmpty();
      if (result.seeded) {
        Alert.alert("Done", `Seeded ${result.categories} categories and ${result.products} products`);
      } else {
        Alert.alert("Info", "Data already exists, skipping seed");
      }
    } catch (e: any) {
      Alert.alert("Error", e.message);
    } finally {
      setSeeding(false);
    }
  };

  if (!isAdmin) {
    return (
      <View style={[styles.container, { paddingTop: topPad, alignItems: "center", justifyContent: "center" }]}>
        <Feather name="shield-off" size={48} color={colors.light.mutedForeground} />
        <Text style={styles.noAccessText}>Admin access required</Text>
        <TouchableOpacity style={styles.backBtn2} onPress={() => router.back()}>
          <Text style={styles.backBtn2Text}>{t("back")}</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const filteredOrders =
    statusFilter === "all"
      ? orders
      : orders.filter((o) => o.status === statusFilter);

  const StatCard = ({
    icon,
    label,
    value,
    color,
  }: {
    icon: string;
    label: string;
    value: string | number;
    color: string;
  }) => (
    <View style={[styles.statCard, { borderLeftColor: color, borderLeftWidth: 4 }]}>
      <View style={[styles.statIcon, { backgroundColor: `${color}20` }]}>
        <Feather name={icon as any} size={20} color={color} />
      </View>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );

  return (
    <View style={[styles.container, { paddingTop: topPad }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Feather name={isRTL ? "arrow-right" : "arrow-left"} size={24} color={colors.light.text} />
        </TouchableOpacity>
        <Text style={styles.title}>Admin Dashboard</Text>
        <TouchableOpacity onPress={loadData}>
          <Feather name="refresh-cw" size={20} color={colors.light.primary} />
        </TouchableOpacity>
      </View>

      <View style={styles.tabRow}>
        {(["dashboard", "orders", "tools"] as const).map((t) => (
          <TouchableOpacity
            key={t}
            style={[styles.tabBtn, tab === t && styles.tabBtnActive]}
            onPress={() => setTab(t)}
          >
            <Text style={[styles.tabBtnText, tab === t && styles.tabBtnTextActive]}>
              {t === "dashboard" ? "Dashboard" : t === "orders" ? "Orders" : "Tools"}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {loading ? (
        <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
          <ActivityIndicator size="large" color={colors.light.primary} />
        </View>
      ) : tab === "dashboard" ? (
        <ScrollView contentContainerStyle={styles.dashContent}>
          <View style={styles.statsGrid}>
            <StatCard icon="shopping-bag" label="Total Orders" value={stats?.totalOrders || 0} color="#3B82F6" />
            <StatCard icon="dollar-sign" label="Revenue" value={`₺${(stats?.totalRevenue || 0).toFixed(0)}`} color="#059669" />
            <StatCard icon="clock" label="Pending" value={stats?.pendingOrders || 0} color="#F59E0B" />
            <StatCard icon="users" label="Customers" value={stats?.totalCustomers || 0} color="#8B5CF6" />
          </View>

          <View style={styles.todayCard}>
            <Text style={styles.todayTitle}>Today</Text>
            <View style={styles.todayRow}>
              <View style={styles.todayItem}>
                <Text style={styles.todayValue}>{stats?.todayOrders || 0}</Text>
                <Text style={styles.todayLabel}>Orders</Text>
              </View>
              <View style={styles.todayDivider} />
              <View style={styles.todayItem}>
                <Text style={styles.todayValue}>₺{(stats?.todayRevenue || 0).toFixed(0)}</Text>
                <Text style={styles.todayLabel}>Revenue</Text>
              </View>
            </View>
          </View>

          {stats?.topProducts && stats.topProducts.length > 0 && (
            <View style={styles.topCard}>
              <Text style={styles.topTitle}>Top Products</Text>
              {stats.topProducts.map((p, i) => (
                <View key={p.productId} style={styles.topRow}>
                  <Text style={styles.topRank}>#{i + 1}</Text>
                  <Text style={styles.topName}>{p.name}</Text>
                  <Text style={styles.topSold}>{p.sold} sold</Text>
                </View>
              ))}
            </View>
          )}
        </ScrollView>
      ) : tab === "orders" ? (
        <View style={{ flex: 1 }}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterRow}>
            {(["all", "pending", "confirmed", "printing", "ready", "delivered", "cancelled"] as const).map(
              (s) => (
                <TouchableOpacity
                  key={s}
                  style={[
                    styles.filterBtn,
                    statusFilter === s && {
                      backgroundColor: s === "all" ? colors.light.primary : STATUS_COLORS[s as OrderStatus],
                    },
                  ]}
                  onPress={() => setStatusFilter(s)}
                >
                  <Text
                    style={[
                      styles.filterBtnText,
                      statusFilter === s && { color: "#FFF" },
                    ]}
                  >
                    {s === "all" ? "All" : t(s as any) || s}
                  </Text>
                </TouchableOpacity>
              )
            )}
          </ScrollView>
          <FlatList
            data={filteredOrders}
            keyExtractor={(o) => o.id}
            contentContainerStyle={{ padding: 16, paddingBottom: 40 }}
            renderItem={({ item: order }) => {
              const next = NEXT_STATUS[order.status];
              return (
                <View style={styles.orderCard}>
                  <View style={styles.orderHeader}>
                    <Text style={styles.orderIdText}>
                      #{order.id.slice(-8).toUpperCase()}
                    </Text>
                    <View
                      style={[
                        styles.statusBadge,
                        { backgroundColor: `${STATUS_COLORS[order.status]}20` },
                      ]}
                    >
                      <Text
                        style={[
                          styles.statusBadgeText,
                          { color: STATUS_COLORS[order.status] },
                        ]}
                      >
                        {t(order.status as any) || order.status}
                      </Text>
                    </View>
                  </View>
                  <Text style={styles.orderDate}>
                    {new Date(order.createdAt).toLocaleString()}
                  </Text>
                  <Text style={styles.orderItems2}>
                    {order.items.length} items • ₺{order.totalAmount.toFixed(2)}
                  </Text>
                  {next && (
                    <TouchableOpacity
                      style={[
                        styles.advanceBtn,
                        { backgroundColor: STATUS_COLORS[next] },
                      ]}
                      onPress={() => handleStatusUpdate(order.id, next)}
                    >
                      <Feather name="arrow-right" size={14} color="#FFF" />
                      <Text style={styles.advanceBtnText}>
                        {t(next as any) || next}
                      </Text>
                    </TouchableOpacity>
                  )}
                </View>
              );
            }}
            ListEmptyComponent={
              <Text style={styles.emptyText}>No orders found</Text>
            }
          />
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.dashContent}>
          <TouchableOpacity
            style={[styles.toolBtn, seeding && { opacity: 0.7 }]}
            onPress={handleSeed}
            disabled={seeding}
          >
            {seeding ? (
              <ActivityIndicator color="#FFF" />
            ) : (
              <>
                <Feather name="database" size={20} color="#FFF" />
                <Text style={styles.toolBtnText}>Seed Products to Firestore</Text>
              </>
            )}
          </TouchableOpacity>
          <Text style={styles.toolHint}>
            Uploads your local product catalog and categories to Firebase. Only runs if database is empty.
          </Text>
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.light.background },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontFamily: "Inter_700Bold",
    color: colors.light.text,
  },
  tabRow: {
    flexDirection: "row",
    marginHorizontal: 20,
    backgroundColor: colors.light.muted,
    borderRadius: 12,
    padding: 4,
    marginBottom: 16,
  },
  tabBtn: { flex: 1, paddingVertical: 10, borderRadius: 10, alignItems: "center" },
  tabBtnActive: { backgroundColor: colors.light.card },
  tabBtnText: {
    fontSize: 13,
    fontFamily: "Inter_500Medium",
    color: colors.light.mutedForeground,
  },
  tabBtnTextActive: { color: colors.light.primary, fontFamily: "Inter_600SemiBold" },
  dashContent: { padding: 20, paddingBottom: 40 },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    marginBottom: 20,
  },
  statCard: {
    backgroundColor: colors.light.card,
    borderRadius: 14,
    padding: 14,
    width: "47%",
    borderWidth: 1,
    borderColor: colors.light.border,
  },
  statIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  statValue: {
    fontSize: 22,
    fontFamily: "Inter_700Bold",
    color: colors.light.text,
  },
  statLabel: {
    fontSize: 12,
    fontFamily: "Inter_400Regular",
    color: colors.light.mutedForeground,
    marginTop: 2,
  },
  todayCard: {
    backgroundColor: colors.light.card,
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.light.border,
    marginBottom: 20,
  },
  todayTitle: {
    fontSize: 16,
    fontFamily: "Inter_600SemiBold",
    color: colors.light.text,
    marginBottom: 12,
  },
  todayRow: { flexDirection: "row", alignItems: "center" },
  todayItem: { flex: 1, alignItems: "center" },
  todayValue: {
    fontSize: 24,
    fontFamily: "Inter_700Bold",
    color: colors.light.primary,
  },
  todayLabel: {
    fontSize: 12,
    fontFamily: "Inter_400Regular",
    color: colors.light.mutedForeground,
    marginTop: 4,
  },
  todayDivider: {
    width: 1,
    height: 40,
    backgroundColor: colors.light.border,
  },
  topCard: {
    backgroundColor: colors.light.card,
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.light.border,
  },
  topTitle: {
    fontSize: 16,
    fontFamily: "Inter_600SemiBold",
    color: colors.light.text,
    marginBottom: 12,
  },
  topRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    borderBottomWidth: 0.5,
    borderBottomColor: colors.light.border,
  },
  topRank: {
    fontSize: 14,
    fontFamily: "Inter_700Bold",
    color: colors.light.primary,
    width: 30,
  },
  topName: {
    flex: 1,
    fontSize: 14,
    fontFamily: "Inter_500Medium",
    color: colors.light.text,
  },
  topSold: {
    fontSize: 13,
    fontFamily: "Inter_500Medium",
    color: colors.light.mutedForeground,
  },
  filterRow: { paddingHorizontal: 16, maxHeight: 44, marginBottom: 8 },
  filterBtn: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: colors.light.muted,
    marginRight: 8,
  },
  filterBtnText: {
    fontSize: 13,
    fontFamily: "Inter_500Medium",
    color: colors.light.mutedForeground,
  },
  orderCard: {
    backgroundColor: colors.light.card,
    borderRadius: 14,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.light.border,
  },
  orderHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  },
  orderIdText: {
    fontSize: 15,
    fontFamily: "Inter_600SemiBold",
    color: colors.light.text,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statusBadgeText: {
    fontSize: 12,
    fontFamily: "Inter_600SemiBold",
  },
  orderDate: {
    fontSize: 12,
    fontFamily: "Inter_400Regular",
    color: colors.light.mutedForeground,
    marginBottom: 4,
  },
  orderItems2: {
    fontSize: 14,
    fontFamily: "Inter_500Medium",
    color: colors.light.text,
    marginBottom: 10,
  },
  advanceBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
    borderRadius: 10,
    gap: 6,
  },
  advanceBtnText: {
    fontSize: 13,
    fontFamily: "Inter_600SemiBold",
    color: "#FFF",
  },
  emptyText: {
    fontSize: 14,
    fontFamily: "Inter_500Medium",
    color: colors.light.mutedForeground,
    textAlign: "center",
    marginTop: 40,
  },
  noAccessText: {
    fontSize: 16,
    fontFamily: "Inter_500Medium",
    color: colors.light.mutedForeground,
    marginTop: 16,
    marginBottom: 24,
  },
  backBtn2: {
    backgroundColor: colors.light.primary,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 32,
  },
  backBtn2Text: {
    fontSize: 15,
    fontFamily: "Inter_600SemiBold",
    color: "#FFF",
  },
  toolBtn: {
    backgroundColor: colors.light.primary,
    borderRadius: 12,
    paddingVertical: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },
  toolBtnText: {
    fontSize: 15,
    fontFamily: "Inter_600SemiBold",
    color: "#FFF",
  },
  toolHint: {
    fontSize: 13,
    fontFamily: "Inter_400Regular",
    color: colors.light.mutedForeground,
    textAlign: "center",
    marginTop: 12,
    lineHeight: 20,
  },
});
