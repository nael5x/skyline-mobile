import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import colors from "@/constants/colors";
import { CATEGORIES, getCategoryName, getProductName } from "@/constants/data";
import { CartItem, useCart } from "@/context/CartContext";
import { useLanguage } from "@/context/LanguageContext";

const VAT_RATE = 0.2;
const VALID_COUPONS: Record<string, number> = {
  PROMO2026: 10,
  SKYLINE10: 10,
  INDIRIM15: 15,
};

function CartItemCard({ item }: { item: CartItem }) {
  const { language, isRTL } = useLanguage();
  const { updateQuantity, removeItem } = useCart();
  const category = CATEGORIES.find((c) => c.id === item.product.categoryId);

  return (
    <View style={s.itemCard}>
      {/* Top row: name + delete */}
      <View style={[s.itemTop, isRTL && s.rowR]}>
        <Text style={[s.itemName, isRTL && s.rtl]} numberOfLines={2}>
          {getProductName(item.product, language)}
        </Text>
        <TouchableOpacity
          style={s.deleteBtn}
          onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); removeItem(item.product.id); }}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Feather name="x" size={16} color="#CCC" />
        </TouchableOpacity>
      </View>

      {/* Category badge */}
      {category && (
        <View style={[s.catBadge, { backgroundColor: (category.color ?? colors.light.primary) + "18" }]}>
          <Feather name={category.icon as any} size={10} color={category.color ?? colors.light.primary} />
          <Text style={[s.catBadgeText, { color: category.color ?? colors.light.primary }]}>
            {getCategoryName(category, language)}
          </Text>
        </View>
      )}

      {/* Bottom row: qty + subtotal */}
      <View style={[s.itemBottom, isRTL && s.rowR]}>
        <View style={s.qtyRow}>
          <TouchableOpacity
            style={s.qtyBtn}
            onPress={() => { Haptics.selectionAsync(); updateQuantity(item.product.id, item.quantity - 1); }}
          >
            <Feather name="minus" size={13} color={colors.light.primary} />
          </TouchableOpacity>
          <Text style={s.qtyNum}>{item.quantity}</Text>
          <TouchableOpacity
            style={s.qtyBtn}
            onPress={() => { Haptics.selectionAsync(); updateQuantity(item.product.id, item.quantity + 1); }}
          >
            <Feather name="plus" size={13} color={colors.light.primary} />
          </TouchableOpacity>
        </View>

        {/* Details note */}
        <View style={s.detailsBox}>
          <Feather name="file-text" size={11} color="#AAA" />
          <Text style={s.detailsText}>
            {language === "ar" ? "× 1000 قطعة / طبقة" : language === "tr" ? "× 1000 Adet / Paket" : "× 1000 pcs / pack"}
          </Text>
        </View>
      </View>
    </View>
  );
}

export default function CartScreen() {
  const { t, language, isRTL } = useLanguage();
  const { items, totalCount, clearCart } = useCart();
  const insets = useSafeAreaInsets();
  const topPad = Platform.OS === "web" ? 16 : insets.top;

  const [coupon, setCoupon] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);
  const [discountPct, setDiscountPct] = useState(0);

  const subtotal = totalCount * 250;
  const discount = Math.round(subtotal * discountPct / 100);
  const afterDiscount = subtotal - discount;
  const vat = Math.round(afterDiscount * VAT_RATE);
  const total = afterDiscount + vat;

  const fmt = (n: number) => n.toLocaleString("tr-TR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  const L = {
    title:         language === "ar" ? "سلة التسوق"          : language === "tr" ? "Alışveriş Sepeti"       : "Shopping Cart",
    clear:         language === "ar" ? "إفراغ السلة"          : language === "tr" ? "Sepeti Boşalt"          : "Clear Cart",
    couponTitle:   language === "ar" ? "هل لديك كوبون خصم؟"  : language === "tr" ? "Kupon Kodunuz Var Mı?"  : "Have a Coupon?",
    couponPlc:     language === "ar" ? "PROMO2026"            : language === "tr" ? "PROMO2026"              : "PROMO2026",
    apply:         language === "ar" ? "تطبيق"                : language === "tr" ? "Uygula"                 : "Apply",
    orderSummary:  language === "ar" ? "ملخص الطلب"           : language === "tr" ? "Sipariş Özeti"          : "Order Summary",
    itemsTotal:    language === "ar" ? "إجمالي المنتجات"      : language === "tr" ? "Ürünler Toplamı"        : "Products Total",
    vat:           language === "ar" ? "ضريبة KDV (20%)"      : language === "tr" ? "KDV (%20)"              : "VAT (20%)",
    delivery:      language === "ar" ? "رسوم التوصيل"         : language === "tr" ? "Teslimat Ücreti"        : "Delivery Fee",
    free:          language === "ar" ? "مجاناً"               : language === "tr" ? "Ücretsiz"               : "Free",
    grandTotal:    language === "ar" ? "الإجمالي الكلي"       : language === "tr" ? "Genel Toplam"           : "Grand Total",
    checkout:      language === "ar" ? "المتابعة للدفع"       : language === "tr" ? "Ödemeye Geç"            : "Proceed to Checkout",
    discount:      language === "ar" ? "الخصم"                : language === "tr" ? "İndirim"                : "Discount",
    priceNote:     language === "ar" ? "* الأسعار تقديرية - سيتم التأكيد عبر واتساب" : language === "tr" ? "* Fiyatlar tahminidir - WhatsApp üzerinden onaylanacaktır" : "* Prices are estimates - will be confirmed via WhatsApp",
  };

  const handleApplyCoupon = () => {
    const code = coupon.trim().toUpperCase();
    if (VALID_COUPONS[code]) {
      setAppliedCoupon(code);
      setDiscountPct(VALID_COUPONS[code]);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      Alert.alert("✅", `${language === "ar" ? "تم تطبيق خصم" : language === "tr" ? "İndirim uygulandı:" : "Discount applied:"} ${VALID_COUPONS[code]}%`);
    } else {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      Alert.alert("", language === "ar" ? "كوبون غير صحيح" : language === "tr" ? "Geçersiz kupon kodu" : "Invalid coupon code");
    }
  };

  const handleClearCart = () => {
    Alert.alert("", t("clearCartConfirm"), [
      { text: t("cancel"), style: "cancel" },
      { text: t("yes"), style: "destructive", onPress: () => { Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning); clearCart(); } },
    ]);
  };

  if (items.length === 0) {
    return (
      <View style={[s.empty, { paddingTop: topPad }]}>
        <View style={s.emptyIcon}>
          <Feather name="shopping-cart" size={52} color="#DDD" />
        </View>
        <Text style={s.emptyTitle}>{t("cartEmpty")}</Text>
        <Text style={s.emptyDesc}>{t("cartEmptyDesc")}</Text>
        <TouchableOpacity style={s.browseBtn} onPress={() => router.push("/(tabs)/products")} activeOpacity={0.85}>
          <Feather name="grid" size={15} color="#FFF" />
          <Text style={s.browseBtnText}>{t("continueShop")}</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={[s.container, { paddingTop: topPad }]}>
      {/* Header */}
      <View style={[s.header, isRTL && s.rowR]}>
        <View style={[s.headerLeft, isRTL && s.rowR]}>
          <Feather name="shopping-cart" size={18} color={colors.light.primary} />
          <Text style={s.headerTitle}>{L.title}</Text>
        </View>
        <TouchableOpacity onPress={handleClearCart} activeOpacity={0.7}>
          <View style={[s.clearBtn, isRTL && s.rowR]}>
            <Feather name="trash-2" size={13} color="#E63946" />
            <Text style={s.clearText}>{L.clear}</Text>
          </View>
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[s.scroll, { paddingBottom: Math.max(insets.bottom, 24) + 190 }]}
        keyboardShouldPersistTaps="handled"
      >
        {/* Items */}
        {items.map((item) => <CartItemCard key={item.product.id} item={item} />)}

        {/* Coupon */}
        <View style={s.couponCard}>
          <View style={[s.couponHeader, isRTL && s.rowR]}>
            <Feather name="tag" size={14} color="#E63946" />
            <Text style={s.couponTitle}>{L.couponTitle}</Text>
          </View>
          <View style={[s.couponRow, isRTL && s.rowR]}>
            <TextInput
              style={[s.couponInput, isRTL && s.rtl, appliedCoupon && s.couponInputApplied]}
              placeholder={L.couponPlc}
              placeholderTextColor="#CCC"
              value={coupon}
              onChangeText={setCoupon}
              autoCapitalize="characters"
              editable={!appliedCoupon}
            />
            <TouchableOpacity
              style={[s.applyBtn, appliedCoupon && s.applyBtnApplied]}
              onPress={appliedCoupon ? undefined : handleApplyCoupon}
              activeOpacity={0.8}
            >
              <Text style={s.applyBtnText}>{appliedCoupon ? `✓ ${discountPct}%` : L.apply}</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Order Summary */}
        <View style={s.summaryCard}>
          <View style={[s.summaryHeader, isRTL && s.rowR]}>
            <Feather name="bar-chart-2" size={14} color="#FFF" />
            <Text style={s.summaryHeaderText}>{L.orderSummary}</Text>
          </View>

          <View style={s.summaryBody}>
            <SRow label={L.itemsTotal} value={`${fmt(subtotal)} ₺`} isRTL={isRTL} />
            {discount > 0 && (
              <SRow label={`🎁 ${L.discount} (${discountPct}%)`} value={`- ${fmt(discount)} ₺`} isRTL={isRTL} color="#1B7A5A" />
            )}
            <SRow label={L.vat} value={`+ ${fmt(vat)} ₺`} isRTL={isRTL} />
            <SRow label={L.delivery} value={L.free} isRTL={isRTL} color="#1B7A5A" />

            <View style={s.divider} />

            <View style={[s.grandRow, isRTL && s.rowR]}>
              <Text style={s.grandLabel}>{L.grandTotal}</Text>
              <Text style={s.grandValue}>{fmt(total)} ₺</Text>
            </View>
          </View>
        </View>

        {/* Price note */}
        <Text style={[s.priceNote, { textAlign: isRTL ? "right" : "left" }]}>{L.priceNote}</Text>
      </ScrollView>

      {/* Sticky bottom checkout */}
      <View style={[s.bottomBar, { paddingBottom: Math.max(insets.bottom, 20) + 64 }]}>
        <TouchableOpacity
          style={s.checkoutBtn}
          onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium); router.push("/checkout"); }}
          activeOpacity={0.85}
        >
          <Feather name="check-circle" size={18} color="#FFF" />
          <Text style={s.checkoutBtnText}>{L.checkout}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

function SRow({ label, value, isRTL, color }: { label: string; value: string; isRTL: boolean; color?: string }) {
  return (
    <View style={[s.sRow, isRTL && s.rowR]}>
      <Text style={[s.sLabel, isRTL && s.rtl]}>{label}</Text>
      <Text style={[s.sValue, color ? { color } : null]}>{value}</Text>
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F5F7FA" },
  empty: { flex: 1, backgroundColor: "#F5F7FA", alignItems: "center", justifyContent: "center", paddingHorizontal: 32 },
  emptyIcon: { width: 96, height: 96, borderRadius: 48, backgroundColor: "#EEE", alignItems: "center", justifyContent: "center", marginBottom: 20 },
  emptyTitle: { fontSize: 20, fontFamily: "Inter_700Bold", color: "#222", marginBottom: 8, textAlign: "center" },
  emptyDesc: { fontSize: 14, color: "#888", textAlign: "center", lineHeight: 22, marginBottom: 28, fontFamily: "Inter_400Regular" },
  browseBtn: { backgroundColor: colors.light.primary, borderRadius: 14, paddingHorizontal: 24, paddingVertical: 14, flexDirection: "row", alignItems: "center", gap: 8 },
  browseBtnText: { fontSize: 15, fontFamily: "Inter_600SemiBold", color: "#FFF" },

  rowR: { flexDirection: "row-reverse" },
  rtl: { textAlign: "right" },

  header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 16, paddingVertical: 14, backgroundColor: "#FFF", borderBottomWidth: 1, borderBottomColor: "#EEE" },
  headerLeft: { flexDirection: "row", alignItems: "center", gap: 8 },
  headerTitle: { fontSize: 17, fontFamily: "Inter_700Bold", color: "#1B3A6B" },
  clearBtn: { flexDirection: "row", alignItems: "center", gap: 5, paddingHorizontal: 10, paddingVertical: 6, borderRadius: 8, borderWidth: 1, borderColor: "#E6394625", backgroundColor: "#E6394608" },
  clearText: { fontSize: 12, fontFamily: "Inter_500Medium", color: "#E63946" },

  scroll: { padding: 14, gap: 12 },

  itemCard: { backgroundColor: "#FFF", borderRadius: 14, padding: 14, shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 8, elevation: 3 },
  itemTop: { flexDirection: "row", alignItems: "flex-start", gap: 8, marginBottom: 8 },
  itemName: { flex: 1, fontSize: 13, fontFamily: "Inter_600SemiBold", color: "#1B3A6B", lineHeight: 18 },
  deleteBtn: { padding: 4 },
  catBadge: { flexDirection: "row", alignItems: "center", gap: 4, alignSelf: "flex-start", borderRadius: 6, paddingHorizontal: 8, paddingVertical: 3, marginBottom: 10 },
  catBadgeText: { fontSize: 10, fontFamily: "Inter_600SemiBold" },
  itemBottom: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  qtyRow: { flexDirection: "row", alignItems: "center", backgroundColor: "#F5F7FA", borderRadius: 20, paddingHorizontal: 4, paddingVertical: 2, borderWidth: 1, borderColor: "#E0E0E0" },
  qtyBtn: { width: 28, height: 28, borderRadius: 14, alignItems: "center", justifyContent: "center" },
  qtyNum: { fontSize: 14, fontFamily: "Inter_700Bold", color: "#222", minWidth: 24, textAlign: "center" },
  detailsBox: { flexDirection: "row", alignItems: "center", gap: 4 },
  detailsText: { fontSize: 11, color: "#AAA", fontFamily: "Inter_400Regular" },

  couponCard: { backgroundColor: "#FFF", borderRadius: 14, padding: 14, shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 8, elevation: 3 },
  couponHeader: { flexDirection: "row", alignItems: "center", gap: 6, marginBottom: 10 },
  couponTitle: { fontSize: 13, fontFamily: "Inter_700Bold", color: "#1B3A6B" },
  couponRow: { flexDirection: "row", gap: 8 },
  couponInput: { flex: 1, borderWidth: 1.5, borderColor: "#E0E0E0", borderRadius: 10, paddingHorizontal: 12, paddingVertical: 10, fontSize: 14, fontFamily: "Inter_600SemiBold", color: "#333", letterSpacing: 1 },
  couponInputApplied: { borderColor: "#1B7A5A", backgroundColor: "#F0FFF4" },
  applyBtn: { backgroundColor: "#1B3A6B", borderRadius: 10, paddingHorizontal: 18, alignItems: "center", justifyContent: "center" },
  applyBtnApplied: { backgroundColor: "#1B7A5A" },
  applyBtnText: { fontSize: 13, fontFamily: "Inter_700Bold", color: "#FFF" },

  summaryCard: { borderRadius: 14, overflow: "hidden", shadowColor: "#1B3A6B", shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.15, shadowRadius: 8, elevation: 4 },
  summaryHeader: { flexDirection: "row", alignItems: "center", gap: 8, backgroundColor: "#E63946", padding: 12 },
  summaryHeaderText: { fontSize: 14, fontFamily: "Inter_700Bold", color: "#FFF" },
  summaryBody: { backgroundColor: "#FFF", padding: 14, gap: 2 },
  sRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingVertical: 7, borderBottomWidth: 1, borderBottomColor: "#F5F5F5" },
  sLabel: { fontSize: 13, color: "#666", fontFamily: "Inter_400Regular" },
  sValue: { fontSize: 13, fontFamily: "Inter_600SemiBold", color: "#333" },
  divider: { height: 1, backgroundColor: "#EEE", marginVertical: 4 },
  grandRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingTop: 8 },
  grandLabel: { fontSize: 15, fontFamily: "Inter_700Bold", color: "#1B3A6B" },
  grandValue: { fontSize: 22, fontFamily: "Inter_700Bold", color: "#1B7A5A" },

  priceNote: { fontSize: 11, color: "#BBB", fontFamily: "Inter_400Regular", marginTop: -4 },

  bottomBar: { position: "absolute", bottom: 0, left: 0, right: 0, backgroundColor: "#FFF", paddingHorizontal: 16, paddingTop: 12, borderTopWidth: 1, borderTopColor: "#EEE", shadowColor: "#000", shadowOffset: { width: 0, height: -2 }, shadowOpacity: 0.08, shadowRadius: 8, elevation: 8 },
  checkoutBtn: { backgroundColor: "#1B7A5A", borderRadius: 14, paddingVertical: 15, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8, shadowColor: "#1B7A5A", shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.3, shadowRadius: 6, elevation: 4 },
  checkoutBtnText: { fontSize: 16, fontFamily: "Inter_700Bold", color: "#FFF" },
});
