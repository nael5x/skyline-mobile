import { Feather } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Haptics from "expo-haptics";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  Linking,
  Platform,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import colors from "@/constants/colors";
import { CATEGORIES, CONTACT_INFO, getCategoryName, getProductName } from "@/constants/data";
import { useCart } from "@/context/CartContext";
import { useLanguage } from "@/context/LanguageContext";
import { StoredOrder } from "./order-history";

const VAT_RATE = 0.2;

type PaymentMethod = "cash" | "bank";

export default function CheckoutScreen() {
  const { t, language, isRTL } = useLanguage();
  const { items, totalCount, clearCart } = useCart();
  const insets = useSafeAreaInsets();
  const topPad = Platform.OS === "web" ? 16 : insets.top;

  const [customerName, setCustomerName]   = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [city, setCity]                   = useState("");
  const [district, setDistrict]           = useState("");
  const [address, setAddress]             = useState("");
  const [notes, setNotes]                 = useState("");
  const [saveAddress, setSaveAddress]     = useState(false);
  const [payment, setPayment]             = useState<PaymentMethod>("cash");
  const [sending, setSending]             = useState(false);

  const subtotal = totalCount * 250;
  const vat      = Math.round(subtotal * VAT_RATE);
  const total    = subtotal + vat;
  const fmt = (n: number) => n.toLocaleString("tr-TR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  const L = {
    title:       language === "ar" ? "إتمام الدفع والطلب"     : language === "tr" ? "Ödeme ve Siparişi Tamamlama" : "Checkout",
    backToCart:  language === "ar" ? "العودة للسلة"            : language === "tr" ? "→ Sepete Dön"               : "← Back to Cart",
    delivery:    language === "ar" ? "بيانات التسليم والتواصل" : language === "tr" ? "Teslimat ve İletişim Bilgileri" : "Delivery & Contact Info",
    fullName:    language === "ar" ? "الاسم الكامل / الشركة"   : language === "tr" ? "Tam Adı / Şirket"           : "Full Name / Company",
    phone:       language === "ar" ? "رقم الهاتف"              : language === "tr" ? "Telefon Numarası"            : "Phone Number",
    country:     language === "ar" ? "البلد"                   : language === "tr" ? "Ülke"                       : "Country",
    city:        language === "ar" ? "المدينة"                 : language === "tr" ? "Şehir"                      : "City",
    district:    language === "ar" ? "الحي / المنطقة"          : language === "tr" ? "İlçe"                       : "District",
    fullAddress: language === "ar" ? "العنوان التفصيلي"        : language === "tr" ? "Açık Adres"                 : "Full Address",
    addrPlc:     language === "ar" ? "الشارع، المبنى، الطابق..." : language === "tr" ? "Sokak, Bina, Kat..."     : "Street, Building, Floor...",
    saveAddr:    language === "ar" ? "احفظ هذا العنوان في ملفي" : language === "tr" ? "Bu adresi profilime kaydet" : "Save this address",
    notesLabel:  language === "ar" ? "ملاحظات للمطبعة (اختياري)" : language === "tr" ? "Matbaa İçin Ek Notlar (İsteğe Bağlı)" : "Notes for Printing (Optional)",
    notesPlc:    language === "ar" ? "ألوان الطباعة أو مدد التوصيل..." : language === "tr" ? "Baskı renkleri veya teslimat süreleri hakkında notlar..." : "Print colors or delivery notes...",
    payMethod:   language === "ar" ? "طريقة الدفع"             : language === "tr" ? "Ödeme Yöntemi"              : "Payment Method",
    cash:        language === "ar" ? "الدفع النقدي (عند الاستلام أو المركز)" : language === "tr" ? "Nakit Ödeme (Kapıda veya Merkezde)" : "Cash Payment (On Delivery or At Center)",
    cashDesc:    language === "ar" ? "يتم تحصيل المبلغ عند تسليم المطبوعات" : language === "tr" ? "Basılı ürünleri teslim aldığınızda tutar tahsil edilecektir." : "Payment collected upon delivery of printed items.",
    bank:        language === "ar" ? "تحويل بنكي"               : language === "tr" ? "Banka Havalesi"             : "Bank Transfer",
    bankDesc:    language === "ar" ? "تتم المعالجة بعد تأكيد وصول الحوالة" : language === "tr" ? "Havanın ulaştığı onaylandıktan sonra işleme başlayacağız." : "Processing starts after transfer confirmation.",
    finalBill:   language === "ar" ? "الفاتورة النهائية"        : language === "tr" ? "Son Fatura"                 : "Final Bill",
    products:    language === "ar" ? "المنتجات"                 : language === "tr" ? "Ürünler"                    : "Products",
    tax:         language === "ar" ? "الضريبة"                  : language === "tr" ? "Vergi"                      : "Tax",
    grandTotal:  language === "ar" ? "الإجمالي الكلي"           : language === "tr" ? "Genel Toplam"               : "Grand Total",
    confirm:     language === "ar" ? "تأكيد الطلب الآن"         : language === "tr" ? "Siparişi Şimdi Onayla"      : "Confirm Order Now",
    secure:      language === "ar" ? "عملية الطلب آمنة تماماً"  : language === "tr" ? "Sipariş işlemi tamamen güvenli ve şifrelidir" : "Order process is completely secure",
  };

  const buildMessage = () => {
    const paymentStr = payment === "cash"
      ? (language === "ar" ? "نقدي عند الاستلام" : language === "tr" ? "Nakit Ödeme" : "Cash on Delivery")
      : (language === "ar" ? "تحويل بنكي" : language === "tr" ? "Banka Havalesi" : "Bank Transfer");

    const header = language === "ar" ? "🛒 طلب جديد - Skyline Group\n" : language === "tr" ? "🛒 Yeni Sipariş - Skyline Group\n" : "🛒 New Order - Skyline Group\n";

    const productsList = items.map((item) => {
      const cat = CATEGORIES.find((c) => c.id === item.product.categoryId);
      return `  • ${getProductName(item.product, language)} (${item.quantity}×)${cat ? " - " + getCategoryName(cat, language) : ""}`;
    }).join("\n");

    let msg = `${header}\n`;
    msg += `👤 ${customerName}\n`;
    msg += `📞 ${customerPhone}\n`;
    msg += `📍 ${city}${district ? " / " + district : ""}\n`;
    if (address.trim()) msg += `🏠 ${address}\n`;
    msg += `\n📦 ${L.products}:\n${productsList}\n`;
    msg += `\n💰 ${L.grandTotal}: ${fmt(total)} ₺\n`;
    msg += `💳 ${language === "ar" ? "الدفع" : language === "tr" ? "Ödeme" : "Payment"}: ${paymentStr}\n`;
    if (notes.trim()) msg += `\n📝 ${L.notesLabel}: ${notes}`;
    return msg;
  };

  const saveOrder = async () => {
    try {
      const existing = await AsyncStorage.getItem("order_history");
      const orders: StoredOrder[] = existing ? JSON.parse(existing) : [];
      orders.unshift({
        id: Date.now().toString(),
        date: new Date().toISOString(),
        customerName,
        customerPhone,
        customerCity: `${city}${district ? " / " + district : ""}`,
        notes: notes.trim(),
        items: items.map((i) => ({
          productId: i.product.id,
          productNameAr: i.product.nameAr,
          productNameEn: i.product.nameEn,
          productNameTr: i.product.nameTr,
          quantity: i.quantity,
          categoryId: i.product.categoryId,
        })),
      });
      await AsyncStorage.setItem("order_history", JSON.stringify(orders.slice(0, 50)));
    } catch {}
  };

  const handleConfirm = async () => {
    if (!customerName.trim() || !customerPhone.trim() || !city.trim()) {
      Alert.alert("", t("fillAllFields")); return;
    }
    setSending(true);
    try {
      const url = `https://wa.me/${CONTACT_INFO.whatsapp}?text=${encodeURIComponent(buildMessage())}`;
      await Linking.openURL(url);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      await saveOrder();
      clearCart();
      Alert.alert(t("orderSent"), t("orderSentDesc"), [{ text: "OK", onPress: () => router.replace("/(tabs)") }]);
    } catch {
      Alert.alert("Error", "Could not open WhatsApp");
    } finally {
      setSending(false);
    }
  };

  const ta = isRTL ? "right" : "left";
  const inputStyle = [s.input, { textAlign: ta }];

  return (
    <View style={[s.wrapper, { paddingTop: topPad }]}>
      {/* Header */}
      <View style={[s.header, isRTL && s.rowR]}>
        <TouchableOpacity onPress={() => router.back()} style={s.backBtn} activeOpacity={0.7}>
          <Feather name={isRTL ? "arrow-right" : "arrow-left"} size={20} color="#1B3A6B" />
        </TouchableOpacity>
        <Text style={s.headerTitle}>{L.title}</Text>
        <TouchableOpacity onPress={() => router.back()} activeOpacity={0.7}>
          <Text style={s.backText}>{L.backToCart}</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={[s.scroll, { paddingBottom: Math.max(insets.bottom, 24) + 20 }]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* ── Delivery & Contact ─── */}
        <View style={s.sectionHeader}>
          <Feather name="map-pin" size={13} color="#FFF" />
          <Text style={s.sectionHeaderText}>{L.delivery}</Text>
        </View>
        <View style={s.formCard}>
          <FieldLabel label={L.fullName} required isRTL={isRTL} />
          <TextInput style={inputStyle} placeholder="Nael Farfur" placeholderTextColor="#CCC" value={customerName} onChangeText={setCustomerName} />

          <FieldLabel label={L.phone} required isRTL={isRTL} />
          <TextInput style={inputStyle} placeholder="+90 555 000 0000" placeholderTextColor="#CCC" value={customerPhone} onChangeText={setCustomerPhone} keyboardType="phone-pad" />

          <View style={[s.row2, isRTL && s.rowR]}>
            <View style={s.half}>
              <FieldLabel label={L.country} isRTL={isRTL} />
              <TextInput style={inputStyle} placeholder="Türkiye" placeholderTextColor="#CCC" defaultValue="Türkiye" />
            </View>
            <View style={s.half}>
              <FieldLabel label={L.city} required isRTL={isRTL} />
              <TextInput style={inputStyle} placeholder="Örn: Gaziantep" placeholderTextColor="#CCC" value={city} onChangeText={setCity} />
            </View>
          </View>

          <FieldLabel label={L.district} isRTL={isRTL} />
          <TextInput style={inputStyle} placeholder="Örn: Şahinbey" placeholderTextColor="#CCC" value={district} onChangeText={setDistrict} />

          <FieldLabel label={L.fullAddress} isRTL={isRTL} />
          <TextInput style={[...inputStyle, s.textarea]} placeholder={L.addrPlc} placeholderTextColor="#CCC" value={address} onChangeText={setAddress} multiline numberOfLines={3} textAlignVertical="top" />

          {/* Save address toggle */}
          <View style={[s.toggleRow, isRTL && s.rowR]}>
            <Switch
              value={saveAddress}
              onValueChange={setSaveAddress}
              trackColor={{ false: "#DDD", true: "#1B3A6B" }}
              thumbColor={saveAddress ? "#C9A847" : "#FFF"}
            />
            <Text style={[s.toggleLabel, isRTL && s.rtl]}>{L.saveAddr}</Text>
          </View>

          {/* Notes */}
          <FieldLabel label={L.notesLabel} isRTL={isRTL} />
          <TextInput style={[...inputStyle, s.textarea]} placeholder={L.notesPlc} placeholderTextColor="#CCC" value={notes} onChangeText={setNotes} multiline numberOfLines={3} textAlignVertical="top" />
        </View>

        {/* ── Payment Method ─── */}
        <View style={s.sectionHeader}>
          <Feather name="credit-card" size={13} color="#FFF" />
          <Text style={s.sectionHeaderText}>{L.payMethod}</Text>
        </View>
        <View style={s.formCard}>
          <PayOption
            selected={payment === "cash"} onPress={() => setPayment("cash")}
            icon="💵" title={L.cash} desc={L.cashDesc} isRTL={isRTL}
          />
          <PayOption
            selected={payment === "bank"} onPress={() => setPayment("bank")}
            icon="🏦" title={L.bank} desc={L.bankDesc} isRTL={isRTL}
          />
        </View>

        {/* ── Final Bill ─── */}
        <View style={s.billCard}>
          <View style={[s.billHeader, isRTL && s.rowR]}>
            <Feather name="file-text" size={14} color="#FFF" />
            <Text style={s.billHeaderText}>{L.finalBill}</Text>
          </View>
          <View style={s.billBody}>
            <BRow label={L.products} value={`${fmt(subtotal)} ₺`} isRTL={isRTL} />
            <BRow label={L.tax} value={`+ ${fmt(vat)} ₺`} isRTL={isRTL} />
            <View style={s.divider} />
            <View style={[s.grandRow, isRTL && s.rowR]}>
              <Text style={s.grandLabel}>{L.grandTotal}</Text>
              <Text style={s.grandVal}>{fmt(total)} ₺</Text>
            </View>
          </View>

          <TouchableOpacity
            style={[s.confirmBtn, sending && s.confirmBtnDisabled]}
            onPress={handleConfirm}
            activeOpacity={0.85}
            disabled={sending}
          >
            <Feather name="check-circle" size={18} color="#FFF" />
            <Text style={s.confirmBtnText}>{sending ? "..." : L.confirm}</Text>
          </TouchableOpacity>

          <View style={[s.secureRow, isRTL && s.rowR]}>
            <Feather name="shield" size={12} color="#1B7A5A" />
            <Text style={s.secureText}>{L.secure}</Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

function FieldLabel({ label, required, isRTL }: { label: string; required?: boolean; isRTL: boolean }) {
  return (
    <View style={[{ flexDirection: isRTL ? "row-reverse" : "row", alignItems: "center", gap: 3, marginBottom: 6, marginTop: 8 }]}>
      <Text style={fl.label}>{label}</Text>
      {required && <Text style={fl.req}>*</Text>}
    </View>
  );
}
const fl = StyleSheet.create({
  label: { fontSize: 13, fontFamily: "Inter_500Medium", color: "#444" },
  req: { fontSize: 13, color: "#E63946", fontFamily: "Inter_700Bold" },
});

function PayOption({ selected, onPress, icon, title, desc, isRTL }: { selected: boolean; onPress: () => void; icon: string; title: string; desc: string; isRTL: boolean }) {
  return (
    <TouchableOpacity style={[po.card, selected && po.cardSelected, isRTL && po.rowR]} onPress={onPress} activeOpacity={0.8}>
      <View style={[po.radio, selected && po.radioSelected]}>
        {selected && <View style={po.radioDot} />}
      </View>
      <View style={po.info}>
        <Text style={[po.title, selected && po.titleSelected, isRTL && po.rtl]}>{icon} {title}</Text>
        <Text style={[po.desc, isRTL && po.rtl]}>{desc}</Text>
      </View>
    </TouchableOpacity>
  );
}
const po = StyleSheet.create({
  card: { flexDirection: "row", alignItems: "flex-start", gap: 12, borderWidth: 1.5, borderColor: "#E0E0E0", borderRadius: 12, padding: 12, marginBottom: 8, backgroundColor: "#FAFAFA" },
  cardSelected: { borderColor: "#1B3A6B", backgroundColor: "#1B3A6B08" },
  rowR: { flexDirection: "row-reverse" },
  radio: { width: 20, height: 20, borderRadius: 10, borderWidth: 2, borderColor: "#CCC", alignItems: "center", justifyContent: "center", marginTop: 2, flexShrink: 0 },
  radioSelected: { borderColor: "#1B3A6B" },
  radioDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: "#1B3A6B" },
  info: { flex: 1 },
  title: { fontSize: 13, fontFamily: "Inter_600SemiBold", color: "#444", marginBottom: 3 },
  titleSelected: { color: "#1B3A6B" },
  desc: { fontSize: 11, color: "#999", fontFamily: "Inter_400Regular", lineHeight: 15 },
  rtl: { textAlign: "right" },
});

function BRow({ label, value, isRTL }: { label: string; value: string; isRTL: boolean }) {
  return (
    <View style={[br.row, isRTL && br.rowR]}>
      <Text style={br.label}>{label}</Text>
      <Text style={br.value}>{value}</Text>
    </View>
  );
}
const br = StyleSheet.create({
  row: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingVertical: 7, borderBottomWidth: 1, borderBottomColor: "#F0F0F0" },
  rowR: { flexDirection: "row-reverse" },
  label: { fontSize: 13, color: "#666", fontFamily: "Inter_400Regular" },
  value: { fontSize: 13, fontFamily: "Inter_600SemiBold", color: "#333" },
});

const s = StyleSheet.create({
  wrapper: { flex: 1, backgroundColor: "#F5F7FA" },
  rowR: { flexDirection: "row-reverse" },
  rtl: { textAlign: "right" },

  header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 14, paddingVertical: 12, backgroundColor: "#FFF", borderBottomWidth: 1, borderBottomColor: "#EEE" },
  backBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: "#F5F7FA", alignItems: "center", justifyContent: "center" },
  headerTitle: { fontSize: 14, fontFamily: "Inter_700Bold", color: "#1B3A6B", flex: 1, textAlign: "center" },
  backText: { fontSize: 11, color: "#888", fontFamily: "Inter_500Medium" },

  scroll: { padding: 14, gap: 0 },

  sectionHeader: { flexDirection: "row", alignItems: "center", gap: 8, backgroundColor: "#222", padding: 12, borderTopLeftRadius: 12, borderTopRightRadius: 12, marginTop: 12 },
  sectionHeaderText: { fontSize: 12, fontFamily: "Inter_700Bold", color: "#FFF" },

  formCard: { backgroundColor: "#FFF", borderBottomLeftRadius: 12, borderBottomRightRadius: 12, padding: 14, marginBottom: 4, shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 6, elevation: 2 },

  input: { backgroundColor: "#FAFAFA", borderWidth: 1, borderColor: "#E0E0E0", borderRadius: 10, paddingHorizontal: 12, paddingVertical: 11, fontSize: 14, fontFamily: "Inter_400Regular", color: "#222", marginBottom: 4 },
  textarea: { height: 76, paddingTop: 10 },

  row2: { flexDirection: "row", gap: 10 },
  half: { flex: 1 },

  toggleRow: { flexDirection: "row", alignItems: "center", gap: 10, paddingVertical: 8 },
  toggleLabel: { fontSize: 13, color: "#444", fontFamily: "Inter_500Medium", flex: 1 },

  billCard: { backgroundColor: "#FFF", borderRadius: 14, overflow: "hidden", marginTop: 12, shadowColor: "#1B3A6B", shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.12, shadowRadius: 8, elevation: 4 },
  billHeader: { flexDirection: "row", alignItems: "center", gap: 8, backgroundColor: "#E63946", padding: 12 },
  billHeaderText: { fontSize: 14, fontFamily: "Inter_700Bold", color: "#FFF" },
  billBody: { padding: 14 },
  divider: { height: 1, backgroundColor: "#EEE", marginVertical: 6 },
  grandRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingTop: 4 },
  grandLabel: { fontSize: 15, fontFamily: "Inter_700Bold", color: "#1B3A6B" },
  grandVal: { fontSize: 24, fontFamily: "Inter_700Bold", color: "#1B7A5A" },

  confirmBtn: { backgroundColor: "#1B7A5A", borderRadius: 12, paddingVertical: 15, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8, margin: 14, marginTop: 10 },
  confirmBtnDisabled: { opacity: 0.6 },
  confirmBtnText: { fontSize: 15, fontFamily: "Inter_700Bold", color: "#FFF" },

  secureRow: { flexDirection: "row", alignItems: "center", gap: 6, justifyContent: "center", paddingBottom: 14 },
  secureText: { fontSize: 11, color: "#1B7A5A", fontFamily: "Inter_500Medium" },
});
