import { Feather } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import colors from "@/constants/colors";
import { useLanguage } from "@/context/LanguageContext";
import { getOrderById } from "@/services/orderService";
import { Order, OrderStatus } from "@/types";

const STATUS_FLOW: OrderStatus[] = [
  "pending",
  "confirmed",
  "printing",
  "ready",
  "delivered",
];

const STATUS_ICONS: Record<OrderStatus, string> = {
  pending: "clock",
  confirmed: "check-circle",
  printing: "printer",
  ready: "package",
  delivered: "truck",
  cancelled: "x-circle",
};

const STATUS_COLORS: Record<OrderStatus, string> = {
  pending: "#F59E0B",
  confirmed: "#3B82F6",
  printing: "#8B5CF6",
  ready: "#10B981",
  delivered: "#059669",
  cancelled: "#EF4444",
};

export default function OrderTrackingScreen() {
  const { t, isRTL, language } = useLanguage();
  const { id } = useLocalSearchParams<{ id: string }>();
  const insets = useSafeAreaInsets();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const topPad = Platform.OS === "web" ? 16 : insets.top + 16;

  useEffect(() => {
    if (id) {
      getOrderById(id)
        .then(setOrder)
        .finally(() => setLoading(false));
    }
  }, [id]);

  const getStatusIndex = (status: OrderStatus) =>
    STATUS_FLOW.indexOf(status);

  if (loading) {
    return (
      <View style={[styles.container, { paddingTop: topPad, alignItems: "center", justifyContent: "center" }]}>
        <ActivityIndicator size="large" color={colors.light.primary} />
      </View>
    );
  }

  if (!order) {
    return (
      <View style={[styles.container, { paddingTop: topPad, alignItems: "center", justifyContent: "center" }]}>
        <Text style={styles.errorText}>Order not found</Text>
      </View>
    );
  }

  const currentIdx = order.status === "cancelled" ? -1 : getStatusIndex(order.status);

  return (
    <ScrollView
      style={[styles.container, { paddingTop: topPad }]}
      contentContainerStyle={styles.content}
    >
      <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
        <Feather name={isRTL ? "arrow-right" : "arrow-left"} size={24} color={colors.light.text} />
      </TouchableOpacity>

      <Text style={styles.title}>{t("orderTracking") || "Order Tracking"}</Text>
      <Text style={styles.orderId}>#{order.id.slice(-8).toUpperCase()}</Text>

      {order.status === "cancelled" ? (
        <View style={[styles.statusBanner, { backgroundColor: "#FEE2E2" }]}>
          <Feather name="x-circle" size={24} color="#EF4444" />
          <Text style={[styles.statusBannerText, { color: "#EF4444" }]}>
            {t("cancelled")}
          </Text>
        </View>
      ) : (
        <View style={styles.timeline}>
          {STATUS_FLOW.map((status, idx) => {
            const isCompleted = idx <= currentIdx;
            const isCurrent = idx === currentIdx;
            const color = isCompleted
              ? STATUS_COLORS[status]
              : colors.light.mutedForeground;

            return (
              <View key={status} style={styles.timelineItem}>
                <View style={styles.timelineDotCol}>
                  <View
                    style={[
                      styles.dot,
                      {
                        backgroundColor: isCompleted ? color : "transparent",
                        borderColor: color,
                        borderWidth: 2,
                      },
                      isCurrent && styles.dotCurrent,
                    ]}
                  >
                    {isCompleted && (
                      <Feather
                        name={isCurrent ? (STATUS_ICONS[status] as any) : "check"}
                        size={14}
                        color="#FFF"
                      />
                    )}
                  </View>
                  {idx < STATUS_FLOW.length - 1 && (
                    <View
                      style={[
                        styles.line,
                        {
                          backgroundColor:
                            idx < currentIdx ? color : colors.light.border,
                        },
                      ]}
                    />
                  )}
                </View>
                <View style={[styles.timelineContent, { alignItems: isRTL ? "flex-end" : "flex-start" }]}>
                  <Text
                    style={[
                      styles.statusLabel,
                      isCompleted && { color, fontFamily: "Inter_600SemiBold" },
                    ]}
                  >
                    {t(status as any) || status}
                  </Text>
                  {isCurrent && order.statusHistory && (
                    <Text style={styles.statusTime}>
                      {new Date(
                        order.statusHistory.find((h) => h.status === status)?.timestamp || order.updatedAt
                      ).toLocaleString(language === "ar" ? "ar-SA" : language === "tr" ? "tr-TR" : "en-US")}
                    </Text>
                  )}
                </View>
              </View>
            );
          })}
        </View>
      )}

      <View style={styles.detailsCard}>
        <Text style={styles.detailsTitle}>{t("orderDetails")}</Text>
        {order.items.map((item, idx) => (
          <View key={idx} style={styles.itemRow}>
            <Text style={styles.itemName}>
              {typeof item.productName === "object"
                ? (item.productName as any)[language] || item.productName.en
                : item.productName}
            </Text>
            <Text style={styles.itemQty}>x{item.quantity}</Text>
            <Text style={styles.itemPrice}>₺{item.totalPrice.toFixed(2)}</Text>
          </View>
        ))}
        <View style={styles.divider} />
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>{t("subtotal")}</Text>
          <Text style={styles.summaryValue}>₺{order.subtotal.toFixed(2)}</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>{t("vat")} (20%)</Text>
          <Text style={styles.summaryValue}>₺{order.vatAmount.toFixed(2)}</Text>
        </View>
        {order.couponDiscount > 0 && (
          <View style={styles.summaryRow}>
            <Text style={[styles.summaryLabel, { color: "#059669" }]}>
              {t("couponCode")} ({order.couponCode})
            </Text>
            <Text style={[styles.summaryValue, { color: "#059669" }]}>
              -₺{order.couponDiscount.toFixed(2)}
            </Text>
          </View>
        )}
        <View style={styles.summaryRow}>
          <Text style={styles.totalLabel}>{t("total")}</Text>
          <Text style={styles.totalValue}>₺{order.totalAmount.toFixed(2)}</Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.light.background },
  content: { paddingHorizontal: 20, paddingBottom: 40 },
  backBtn: { marginBottom: 16, width: 40 },
  title: {
    fontSize: 22,
    fontFamily: "Inter_700Bold",
    color: colors.light.text,
    marginBottom: 4,
  },
  orderId: {
    fontSize: 14,
    fontFamily: "Inter_500Medium",
    color: colors.light.mutedForeground,
    marginBottom: 24,
  },
  errorText: {
    fontSize: 16,
    fontFamily: "Inter_500Medium",
    color: colors.light.mutedForeground,
  },
  statusBanner: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 12,
    gap: 12,
    marginBottom: 24,
  },
  statusBannerText: {
    fontSize: 16,
    fontFamily: "Inter_600SemiBold",
  },
  timeline: { marginBottom: 24 },
  timelineItem: { flexDirection: "row", minHeight: 64 },
  timelineDotCol: { alignItems: "center", width: 32 },
  dot: {
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
  },
  dotCurrent: {
    width: 34,
    height: 34,
    borderRadius: 17,
  },
  line: { width: 2, flex: 1, marginVertical: 4 },
  timelineContent: { flex: 1, paddingHorizontal: 12, paddingTop: 4 },
  statusLabel: {
    fontSize: 15,
    fontFamily: "Inter_500Medium",
    color: colors.light.mutedForeground,
  },
  statusTime: {
    fontSize: 12,
    fontFamily: "Inter_400Regular",
    color: colors.light.mutedForeground,
    marginTop: 2,
  },
  detailsCard: {
    backgroundColor: colors.light.card,
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.light.border,
  },
  detailsTitle: {
    fontSize: 16,
    fontFamily: "Inter_600SemiBold",
    color: colors.light.text,
    marginBottom: 12,
  },
  itemRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
  },
  itemName: {
    flex: 1,
    fontSize: 14,
    fontFamily: "Inter_500Medium",
    color: colors.light.text,
  },
  itemQty: {
    fontSize: 13,
    fontFamily: "Inter_400Regular",
    color: colors.light.mutedForeground,
    marginHorizontal: 12,
  },
  itemPrice: {
    fontSize: 14,
    fontFamily: "Inter_600SemiBold",
    color: colors.light.text,
  },
  divider: {
    height: 1,
    backgroundColor: colors.light.border,
    marginVertical: 12,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 4,
  },
  summaryLabel: {
    fontSize: 14,
    fontFamily: "Inter_400Regular",
    color: colors.light.mutedForeground,
  },
  summaryValue: {
    fontSize: 14,
    fontFamily: "Inter_500Medium",
    color: colors.light.text,
  },
  totalLabel: {
    fontSize: 16,
    fontFamily: "Inter_700Bold",
    color: colors.light.text,
    marginTop: 8,
  },
  totalValue: {
    fontSize: 16,
    fontFamily: "Inter_700Bold",
    color: colors.light.primary,
    marginTop: 8,
  },
});
