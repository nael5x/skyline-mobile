import React, { useEffect, useState } from "react";
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity, Platform,
  Alert,
} from "react-native";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { useLanguage } from "../context/LanguageContext";
import { useCart } from "../context/CartContext";

export interface StoredOrder {
  id: string;
  date: string;
  customerName: string;
  customerPhone: string;
  customerCity: string;
  items: Array<{
    productId: string;
    productNameAr: string;
    productNameEn: string;
    productNameTr: string;
    quantity: number;
    categoryId: string;
  }>;
  notes?: string;
}

export default function OrderHistoryScreen() {
  const { t, language } = useLanguage();
  const { addItem } = useCart();
  const insets = useSafeAreaInsets();
  const isRTL = language === "ar";
  const topPad = Platform.OS === "web" ? 16 : insets.top;
  const [orders, setOrders] = useState<StoredOrder[]>([]);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      const data = await AsyncStorage.getItem("order_history");
      if (data) setOrders(JSON.parse(data));
    } catch {}
  };

  const clearHistory = () => {
    Alert.alert(
      t("clearCart"),
      language === "ar"
        ? "هل تريد حذف جميع سجلات الطلبات؟"
        : language === "tr"
        ? "Tüm sipariş geçmişini silmek istiyor musunuz?"
        : "Do you want to delete all order history?",
      [
        { text: t("cancel"), style: "cancel" },
        {
          text: t("yes"), style: "destructive", onPress: async () => {
            await AsyncStorage.removeItem("order_history");
            setOrders([]);
          },
        },
      ]
    );
  };

  const formatDate = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleDateString(
      language === "ar" ? "ar-SY" : language === "tr" ? "tr-TR" : "en-US",
      { year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" }
    );
  };

  const getProductName = (item: StoredOrder["items"][0]) => {
    if (language === "ar") return item.productNameAr;
    if (language === "tr") return item.productNameTr;
    return item.productNameEn;
  };

  const renderOrder = ({ item, index }: { item: StoredOrder; index: number }) => (
    <View style={styles.orderCard}>
      <View style={[styles.orderHeader, isRTL && styles.rowReverse]}>
        <View style={styles.orderNumBadge}>
          <Text style={styles.orderNum}>#{orders.length - index}</Text>
        </View>
        <View style={{ flex: 1, marginHorizontal: 12 }}>
          <Text style={[styles.customerName, isRTL && styles.rtl]}>{item.customerName}</Text>
          <Text style={[styles.orderDate, isRTL && styles.rtl]}>{formatDate(item.date)}</Text>
        </View>
        <Feather name="check-circle" size={20} color="#25D366" />
      </View>

      <View style={styles.divider} />

      <View style={styles.itemsList}>
        {item.items.map((prod, pi) => (
          <View key={pi} style={[styles.productRow, isRTL && styles.rowReverse]}>
            <Feather name="package" size={14} color="#1B3A6B" />
            <Text style={[styles.productName, isRTL && { marginRight: 8, marginLeft: 0 }]}>
              {getProductName(prod)}
            </Text>
            <Text style={styles.productQty}>×{prod.quantity}</Text>
          </View>
        ))}
      </View>

      {item.notes ? (
        <View style={[styles.notesRow, isRTL && styles.rowReverse]}>
          <Feather name="info" size={14} color="#888" />
          <Text style={[styles.notesText, isRTL && { marginRight: 6, marginLeft: 0 }]}>{item.notes}</Text>
        </View>
      ) : null}
    </View>
  );

  return (
    <View style={[styles.container, { paddingTop: topPad }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Feather name={isRTL ? "arrow-right" : "arrow-left"} size={22} color="#1B3A6B" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t("orderHistory")}</Text>
        {orders.length > 0 ? (
          <TouchableOpacity onPress={clearHistory} style={styles.clearBtn}>
            <Feather name="trash-2" size={18} color="#E53E3E" />
          </TouchableOpacity>
        ) : (
          <View style={{ width: 38 }} />
        )}
      </View>

      {orders.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Feather name="clock" size={64} color="#DDD" />
          <Text style={[styles.emptyTitle, isRTL && styles.rtl]}>{t("noOrders")}</Text>
          <Text style={[styles.emptyDesc, isRTL && styles.rtl]}>{t("noOrdersDesc")}</Text>
          <TouchableOpacity style={styles.shopBtn} onPress={() => router.replace("/(tabs)/products")}>
            <Text style={styles.shopBtnText}>{t("continueShop")}</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={orders}
          renderItem={renderOrder}
          keyExtractor={(o) => o.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F5F7FA" },
  header: {
    flexDirection: "row", alignItems: "center", justifyContent: "space-between",
    paddingHorizontal: 16, paddingVertical: 14, backgroundColor: "#fff",
    borderBottomWidth: 1, borderBottomColor: "#EEE",
  },
  backBtn: { padding: 8 },
  headerTitle: { fontSize: 17, fontWeight: "700", color: "#1B3A6B" },
  clearBtn: { padding: 8 },
  listContent: { padding: 16, paddingBottom: 40 },
  orderCard: {
    backgroundColor: "#fff", borderRadius: 16, padding: 16, marginBottom: 14,
    shadowColor: "#000", shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06, shadowRadius: 8, elevation: 3,
  },
  orderHeader: { flexDirection: "row", alignItems: "center" },
  rowReverse: { flexDirection: "row-reverse" },
  orderNumBadge: {
    backgroundColor: "#1B3A6B", borderRadius: 8, paddingHorizontal: 10, paddingVertical: 4,
  },
  orderNum: { color: "#fff", fontWeight: "700", fontSize: 13 },
  customerName: { fontSize: 15, fontWeight: "700", color: "#1B3A6B" },
  orderDate: { fontSize: 12, color: "#888", marginTop: 2 },
  divider: { height: 1, backgroundColor: "#f0f0f0", marginVertical: 12 },
  itemsList: { gap: 6 },
  productRow: { flexDirection: "row", alignItems: "center" },
  productName: { flex: 1, fontSize: 14, color: "#333", marginLeft: 8 },
  productQty: { fontSize: 13, fontWeight: "600", color: "#C9A847" },
  notesRow: { flexDirection: "row", alignItems: "flex-start", marginTop: 10 },
  notesText: { fontSize: 13, color: "#666", flex: 1, marginLeft: 6 },
  emptyContainer: { flex: 1, alignItems: "center", justifyContent: "center", padding: 40 },
  emptyTitle: { fontSize: 20, fontWeight: "700", color: "#333", marginTop: 20, marginBottom: 8 },
  emptyDesc: { fontSize: 14, color: "#888", textAlign: "center", lineHeight: 22, marginBottom: 32 },
  shopBtn: {
    backgroundColor: "#1B3A6B", paddingHorizontal: 32, paddingVertical: 14,
    borderRadius: 50,
  },
  shopBtnText: { color: "#fff", fontWeight: "700", fontSize: 16 },
  rtl: { textAlign: "right" },
});
