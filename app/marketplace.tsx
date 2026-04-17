import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  Linking,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { CONTACT_INFO } from "@/constants/data";
import { useLanguage } from "@/context/LanguageContext";

// ─── Data ─────────────────────────────────────────────────────────────────────
type MPItem = {
  id: string;
  category: "machines" | "materials";
  nameAr: string; nameEn: string; nameTr: string;
  descAr: string; descEn: string; descTr: string;
  price: number; originalPrice?: number;
  currency: "USD" | "TRY";
  badge?: string;
  icon: string;
  iconColor: string;
};

const ITEMS: MPItem[] = [
  // Machines
  {
    id: "m1", category: "machines",
    nameAr: "طابعة سبليماشن احترافية", nameEn: "Professional Sublimation Printer", nameTr: "Profesyonel Sublimasyon Yazıcı",
    descAr: "طابعة سبليماشن عريضة للطباعة على الأقمشة والبوليستر بجودة عالية", descEn: "Wide sublimation printer for fabric and polyester with high quality", descTr: "Yüksek kaliteli kumaş ve polyester baskı için geniş format sublimasyon yazıcı",
    price: 16500, originalPrice: 19500, currency: "USD", badge: "Özel Ürün", icon: "printer", iconColor: "#1B3A6B",
  },
  {
    id: "m2", category: "machines",
    nameAr: "بلوتر قطع احترافي", nameEn: "Professional Cutting Plotter", nameTr: "Profesyonel Kesim Plotteri",
    descAr: "بلوتر قطع دقيق للفينيل والملصقات والمواد المختلفة بسرعة عالية", descEn: "Precise cutting plotter for vinyl, stickers and various materials at high speed", descTr: "Vinil, etiket ve çeşitli materyaller için hassas kesim plotteri",
    price: 4200, originalPrice: 5800, currency: "USD", icon: "scissors", iconColor: "#2E5DA6",
  },
  {
    id: "m3", category: "machines",
    nameAr: "طابعة UV مسطحة", nameEn: "UV Flatbed Printer", nameTr: "UV Düz Tabla Yazıcı",
    descAr: "طابعة UV للطباعة المباشرة على الخشب والزجاج والأكريليك وأي سطح مسطح", descEn: "UV printer for direct printing on wood, glass, acrylic and any flat surface", descTr: "Ahşap, cam, akrilik ve herhangi bir düz yüzeye doğrudan baskı için UV yazıcı",
    price: 22000, originalPrice: 28000, currency: "USD", icon: "sun", iconColor: "#C9A847",
  },
  {
    id: "m4", category: "machines",
    nameAr: "آلة لمينيتور احترافية", nameEn: "Professional Laminator Machine", nameTr: "Profesyonel Laminatör Makinesi",
    descAr: "لمينيتور حراري وبارد لتصفيح المطبوعات بأبعاد حتى 160 سم", descEn: "Hot and cold laminator for laminating prints up to 160 cm wide", descTr: "160 cm genişliğe kadar baskıları laminatlamak için sıcak ve soğuk laminatör",
    price: 3800, originalPrice: 4500, currency: "USD", icon: "layers", iconColor: "#1B7A5A",
  },
  {
    id: "m5", category: "machines",
    nameAr: "ماكينة ختم حراري", nameEn: "Heat Press Machine", nameTr: "Isı Transfer Presi",
    descAr: "ماكينة ختم حراري للتيشيرتات والقبعات والأكواب ومختلف المنتجات الترويجية", descEn: "Heat press machine for T-shirts, hats, mugs and various promotional products", descTr: "Tişörtler, şapkalar, kupalar ve çeşitli promosyon ürünleri için ısı transfer presi",
    price: 850, originalPrice: 1100, currency: "USD", icon: "thermometer", iconColor: "#E63946",
  },
  {
    id: "m6", category: "machines",
    nameAr: "ماكينة طباعة DTF", nameEn: "DTF Printing Machine", nameTr: "DTF Baskı Makinesi",
    descAr: "طباعة DTF (Direct to Film) للتطبيق على جميع أنواع الأقمشة بألوان زاهية", descEn: "DTF (Direct to Film) printing for application on all fabric types with vivid colors", descTr: "Canlı renklerle tüm kumaş türlerine uygulama için DTF (Direct to Film) baskı",
    price: 7500, originalPrice: 9200, currency: "USD", badge: "جديد", icon: "zap", iconColor: "#5C3D82",
  },
  // Materials
  {
    id: "r1", category: "materials",
    nameAr: "حبر سبليماشن SKYJET", nameEn: "SKYJET Sublimation Ink", nameTr: "SKYJET Sublimasyon Mürekkep",
    descAr: "حبر سبليماشن عالي الجودة من SKYJET لجميع أنواع الطابعات - 1 لتر", descEn: "High quality SKYJET sublimation ink for all printer types - 1 liter", descTr: "Tüm yazıcı türleri için yüksek kaliteli SKYJET sublimasyon mürekkebi - 1 litre",
    price: 16, originalPrice: 20, currency: "USD", icon: "droplet", iconColor: "#E63946",
  },
  {
    id: "r2", category: "materials",
    nameAr: "ورق سبليماشن رول SKYJET", nameEn: "SKYJET Sublimation Paper Roll", nameTr: "SKYJET Sublimasyon Kağıt Rulo",
    descAr: "ورق سبليماشن عالي الامتصاص للطابعات العريضة - رول 100 متر × 160 سم", descEn: "High absorption sublimation paper for wide format printers - 100m × 160cm roll", descTr: "Geniş format yazıcılar için yüksek emicilik sublimasyon kağıdı - 100m × 160cm rulo",
    price: 85, originalPrice: 110, currency: "USD", badge: "10 روزن", icon: "file", iconColor: "#2E5DA6",
  },
  {
    id: "r3", category: "materials",
    nameAr: "فينيل لصق قابل للقطع", nameEn: "Cuttable Adhesive Vinyl", nameTr: "Kesim Yapışkan Vinil",
    descAr: "فينيل لصق ملون للبلوترات بعرض 120 سم - بكرات بألوان متعددة", descEn: "Colored adhesive vinyl for plotters 120 cm wide - rolls in multiple colors", descTr: "120 cm genişliğinde plotterlar için renkli yapışkan vinil - çoklu renk rulolar",
    price: 45, originalPrice: 60, currency: "USD", icon: "square", iconColor: "#1B7A5A",
  },
  {
    id: "r4", category: "materials",
    nameAr: "فينيل حراري HTV للقماش", nameEn: "HTV Heat Transfer Vinyl", nameTr: "HTV Isı Transfer Vinyili",
    descAr: "فينيل حراري عالي الجودة للتطبيق على الأقمشة بالحرارة بأشكال وألوان متعددة", descEn: "High quality heat transfer vinyl for fabric application in multiple shapes and colors", descTr: "Çoklu şekil ve renklerde kumaşa ısı uygulaması için yüksek kaliteli ısı transfer vinyili",
    price: 38, originalPrice: 50, currency: "USD", icon: "layers", iconColor: "#C9A847",
  },
  {
    id: "r5", category: "materials",
    nameAr: "كرتون كروما 300 جرام", nameEn: "Kroma Cardboard 300g", nameTr: "Kroma Karton 300g",
    descAr: "كرتون كروما عالي الجودة للطباعة الأوفست والرقمية بوزن 300 جرام/م²", descEn: "High quality Kroma cardboard for offset and digital printing 300g/m²", descTr: "Ofset ve dijital baskı için yüksek kaliteli 300g/m² Kroma karton",
    price: 120, currency: "TRY", icon: "package", iconColor: "#8B4513",
  },
  {
    id: "r6", category: "materials",
    nameAr: "فيلم DTF لطباعة النقل الحراري", nameEn: "DTF Film for Heat Transfer", nameTr: "DTF Isı Transfer Filmi",
    descAr: "فيلم DTF شفاف لطباعة النقل الحراري على الأقمشة - رول 30 متر × 60 سم", descEn: "Transparent DTF film for heat transfer printing on fabrics - 30m × 60cm roll", descTr: "Kumaşlara ısı transfer baskısı için şeffaf DTF filmi - 30m × 60cm rulo",
    price: 55, originalPrice: 70, currency: "USD", icon: "film", iconColor: "#5C3D82",
  },
];

type Tab = "all" | "machines" | "materials";

export default function MarketplaceScreen() {
  const { language, isRTL } = useLanguage();
  const insets = useSafeAreaInsets();
  const topPad = Platform.OS === "web" ? 16 : insets.top + 8;
  const [tab, setTab] = useState<Tab>("all");

  const L = {
    title:     language === "ar" ? "المستلزمات والماكينات"   : language === "tr" ? "Büyük Ticaret Platformu"       : "Trade Platform",
    subtitle:  language === "ar" ? "ماكينات واحتياجات الطباعة المتخصصة" : language === "tr" ? "Makineler, ham maddeler ve fiyat teklifleri" : "Machines, materials & price quotes",
    all:       language === "ar" ? "الكل"                    : language === "tr" ? "Tümü"                          : "All",
    machines:  language === "ar" ? "الماكينات والأجهزة"       : language === "tr" ? "Makineler ve Cihazlar"        : "Machines & Devices",
    materials: language === "ar" ? "المواد الخام"             : language === "tr" ? "Ham Maddeler"                 : "Raw Materials",
    details:   language === "ar" ? "اطلب عرض سعر"            : language === "tr" ? "Tüm Detayları Gör →"          : "Request Quote →",
    newBadge:  language === "ar" ? "جديد"                    : language === "tr" ? "Yeni"                         : "New",
  };

  const filtered = ITEMS.filter((item) =>
    tab === "all" ? true : item.category === tab
  );

  const getName = (item: MPItem) =>
    language === "ar" ? item.nameAr : language === "tr" ? item.nameTr : item.nameEn;
  const getDesc = (item: MPItem) =>
    language === "ar" ? item.descAr : language === "tr" ? item.descTr : item.descEn;

  const handleInquiry = (item: MPItem) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    const name = getName(item);
    const price = `${item.price} ${item.currency}`;
    const msg = language === "ar"
      ? `مرحباً، أريد الاستفسار عن:\n🛒 ${name}\n💰 السعر: ${price}\n\nأرجو إرسال عرض السعر والتفاصيل`
      : language === "tr"
      ? `Merhaba, aşağıdaki ürün hakkında bilgi almak istiyorum:\n🛒 ${name}\n💰 Fiyat: ${price}\n\nLütfen detayları ve fiyat teklifini gönderin`
      : `Hello, I'd like to inquire about:\n🛒 ${name}\n💰 Price: ${price}\n\nPlease send me details and a price quote`;
    Linking.openURL(`https://wa.me/${CONTACT_INFO.whatsapp}?text=${encodeURIComponent(msg)}`);
  };

  const formatPrice = (price: number, currency: "USD" | "TRY") =>
    currency === "USD"
      ? `${price.toLocaleString()} $`
      : `${price.toLocaleString()} ₺`;

  return (
    <View style={[s.container, { paddingTop: topPad }]}>
      {/* Header */}
      <View style={s.headerBg}>
        <View style={[s.headerRow, isRTL && s.rowR]}>
          <TouchableOpacity onPress={() => router.back()} style={s.backBtn}>
            <Feather name={isRTL ? "arrow-right" : "arrow-left"} size={22} color="#FFF" />
          </TouchableOpacity>
          <View style={s.headerCenter}>
            <Text style={s.headerTitle}>{L.title}</Text>
            <Text style={s.headerSub}>{L.subtitle}</Text>
          </View>
          <View style={{ width: 38 }} />
        </View>

        {/* Tabs */}
        <ScrollView
          horizontal showsHorizontalScrollIndicator={false}
          contentContainerStyle={[s.tabs, isRTL && s.rowR]}
        >
          {([["all", L.all], ["machines", L.machines], ["materials", L.materials]] as [Tab, string][]).map(([key, label]) => (
            <TouchableOpacity
              key={key}
              style={[s.tab, tab === key && s.tabActive]}
              onPress={() => { setTab(key); Haptics.selectionAsync(); }}
              activeOpacity={0.8}
            >
              <Text style={[s.tabText, tab === key && s.tabTextActive]}>{label}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <ScrollView
        contentContainerStyle={[s.scroll, { paddingBottom: Math.max(insets.bottom, 24) + 24 }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Stats row */}
        <View style={[s.statsRow, isRTL && s.rowR]}>
          <View style={s.stat}>
            <Text style={s.statNum}>{ITEMS.filter(i => i.category === "machines").length}</Text>
            <Text style={s.statLabel}>{L.machines}</Text>
          </View>
          <View style={s.statDivider} />
          <View style={s.stat}>
            <Text style={s.statNum}>{ITEMS.filter(i => i.category === "materials").length}</Text>
            <Text style={s.statLabel}>{L.materials}</Text>
          </View>
          <View style={s.statDivider} />
          <View style={s.stat}>
            <Text style={s.statNum}>WhatsApp</Text>
            <Text style={s.statLabel}>{language === "ar" ? "الطلب عبر" : language === "tr" ? "sipariş kanalı" : "order via"}</Text>
          </View>
        </View>

        {/* Product grid */}
        <View style={s.grid}>
          {filtered.map((item) => (
            <View key={item.id} style={s.card}>
              {/* Badge */}
              {item.badge && (
                <View style={s.badge}>
                  <Text style={s.badgeText}>{item.badge}</Text>
                </View>
              )}

              {/* Icon area */}
              <View style={[s.iconBox, { backgroundColor: item.iconColor + "18" }]}>
                <Feather name={item.icon as any} size={34} color={item.iconColor} />
              </View>

              {/* Info */}
              <Text style={[s.productName, isRTL && s.rtl]} numberOfLines={2}>{getName(item)}</Text>
              <Text style={[s.productDesc, isRTL && s.rtl]} numberOfLines={3}>{getDesc(item)}</Text>

              {/* Price */}
              <View style={[s.priceRow, isRTL && s.rowR]}>
                <Text style={s.price}>{formatPrice(item.price, item.currency)}</Text>
                {item.originalPrice && (
                  <Text style={s.originalPrice}>{formatPrice(item.originalPrice, item.currency)}</Text>
                )}
              </View>

              {/* CTA */}
              <TouchableOpacity
                style={s.cta}
                onPress={() => handleInquiry(item)}
                activeOpacity={0.85}
              >
                <Feather name="message-circle" size={14} color="#1B3A6B" />
                <Text style={s.ctaText}>{L.details}</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>

        {/* WhatsApp note */}
        <View style={[s.noteCard, isRTL && s.rowR]}>
          <View style={s.noteIcon}>
            <Feather name="message-circle" size={20} color="#25D366" />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={[s.noteTitle, isRTL && s.rtl]}>
              {language === "ar" ? "الطلب عبر واتساب" : language === "tr" ? "WhatsApp ile Sipariş" : "Order via WhatsApp"}
            </Text>
            <Text style={[s.noteText, isRTL && s.rtl]}>
              {language === "ar"
                ? "لطلب أي منتج أو الاستفسار عن الأسعار، تواصل معنا مباشرة عبر واتساب وسيرد عليك فريقنا في أقرب وقت"
                : language === "tr"
                ? "Herhangi bir ürün siparişi veya fiyat sorgusu için WhatsApp üzerinden doğrudan bizimle iletişime geçin"
                : "To order any product or inquire about prices, contact us directly via WhatsApp and our team will respond shortly"}
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F5F7FA" },
  rowR: { flexDirection: "row-reverse" },
  rtl: { textAlign: "right" },

  headerBg: {
    backgroundColor: "#FF5722",
    paddingBottom: 0,
  },
  headerRow: {
    flexDirection: "row", alignItems: "center",
    paddingHorizontal: 14, paddingVertical: 12,
  },
  backBtn: { padding: 8, borderRadius: 8 },
  headerCenter: { flex: 1, alignItems: "center" },
  headerTitle: { fontSize: 15, fontFamily: "Inter_700Bold", color: "#FFF" },
  headerSub: { fontSize: 11, color: "rgba(255,255,255,0.75)", fontFamily: "Inter_400Regular", marginTop: 2, textAlign: "center" },

  tabs: { flexDirection: "row", gap: 8, paddingHorizontal: 14, paddingVertical: 12 },
  tab: {
    paddingHorizontal: 14, paddingVertical: 7, borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.2)",
  },
  tabActive: { backgroundColor: "#FFF" },
  tabText: { fontSize: 12, color: "rgba(255,255,255,0.85)", fontFamily: "Inter_500Medium" },
  tabTextActive: { color: "#FF5722", fontFamily: "Inter_700Bold" },

  scroll: { padding: 14, gap: 14 },

  statsRow: {
    flexDirection: "row", alignItems: "center", justifyContent: "space-around",
    backgroundColor: "#FFF", borderRadius: 14, padding: 14,
    shadowColor: "#000", shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06, shadowRadius: 8, elevation: 3,
  },
  stat: { alignItems: "center", flex: 1 },
  statNum: { fontSize: 15, fontFamily: "Inter_700Bold", color: "#1B3A6B" },
  statLabel: { fontSize: 10, color: "#999", fontFamily: "Inter_400Regular", textAlign: "center", marginTop: 2 },
  statDivider: { width: 1, height: 28, backgroundColor: "#EEE" },

  grid: { flexDirection: "row", flexWrap: "wrap", gap: 10 },

  card: {
    width: "48%",
    backgroundColor: "#FFF", borderRadius: 14, padding: 12,
    shadowColor: "#000", shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07, shadowRadius: 8, elevation: 3,
    position: "relative",
  },
  badge: {
    position: "absolute", top: 10, right: 10, zIndex: 1,
    backgroundColor: "#FF5722", borderRadius: 6,
    paddingHorizontal: 6, paddingVertical: 2,
  },
  badgeText: { fontSize: 9, color: "#FFF", fontFamily: "Inter_700Bold" },

  iconBox: {
    width: "100%", height: 90, borderRadius: 10,
    alignItems: "center", justifyContent: "center",
    marginBottom: 10,
  },

  productName: { fontSize: 12, fontFamily: "Inter_700Bold", color: "#1B3A6B", marginBottom: 4, lineHeight: 16 },
  productDesc: { fontSize: 10, color: "#888", fontFamily: "Inter_400Regular", lineHeight: 14, marginBottom: 8 },

  priceRow: { flexDirection: "row", alignItems: "center", gap: 6, marginBottom: 10, flexWrap: "wrap" },
  price: { fontSize: 15, fontFamily: "Inter_700Bold", color: "#FF5722" },
  originalPrice: {
    fontSize: 11, color: "#BBB", fontFamily: "Inter_400Regular",
    textDecorationLine: "line-through",
  },

  cta: {
    backgroundColor: "#FF572215", borderRadius: 8,
    paddingVertical: 8, flexDirection: "row",
    alignItems: "center", justifyContent: "center", gap: 5,
    borderWidth: 1, borderColor: "#FF572230",
  },
  ctaText: { fontSize: 11, fontFamily: "Inter_700Bold", color: "#1B3A6B" },

  noteCard: {
    flexDirection: "row", gap: 12, alignItems: "flex-start",
    backgroundColor: "#F0FFF4", borderRadius: 14, padding: 14,
    borderWidth: 1, borderColor: "#C6F6D5",
  },
  noteIcon: {
    width: 38, height: 38, borderRadius: 10,
    backgroundColor: "#25D36615", alignItems: "center", justifyContent: "center",
  },
  noteTitle: { fontSize: 13, fontFamily: "Inter_700Bold", color: "#1B3A6B", marginBottom: 4 },
  noteText: { fontSize: 11, color: "#666", fontFamily: "Inter_400Regular", lineHeight: 16 },
});
