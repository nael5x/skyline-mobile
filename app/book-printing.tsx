import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { router } from "expo-router";
import React, { useCallback, useState } from "react";
import {
  Linking,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { CONTACT_INFO } from "@/constants/data";
import { useLanguage } from "@/context/LanguageContext";

// ─── Pricing Data ─────────────────────────────────────────────────────────────
const BOOK_SIZES = ["A4 (21×29.7 cm)", "A5 (14.8×21 cm)", "B5 (17×24 cm)", "A3 (29.7×42 cm)", "Kare (21×21 cm)", "Özel Boyut"];

const INNER_PAPER_OPTIONS = ["80g Ofset", "90g Ofset", "100g Kuşe", "115g Kuşe", "130g Kuşe"];
const INNER_PAPER_PRICE_BW: Record<string, number> = {
  "80g Ofset": 0.15, "90g Ofset": 0.18, "100g Kuşe": 0.22, "115g Kuşe": 0.26, "130g Kuşe": 0.30,
};
const INNER_PAPER_PRICE_COLOR: Record<string, number> = {
  "80g Ofset": 0.42, "90g Ofset": 0.48, "100g Kuşe": 0.58, "115g Kuşe": 0.65, "130g Kuşe": 0.72,
};

const PRINT_COLORS = ["Siyah Beyaz", "Tam Renkli (CMYK)"];

const COVER_PAPER_OPTIONS = ["Kapaksız", "250g Krom Karton", "300g Krom Karton", "350g Krom Karton"];
const COVER_PRICE: Record<string, number> = {
  "Kapaksız": 0, "250g Krom Karton": 14, "300g Krom Karton": 18, "350g Krom Karton": 22,
};

const LAMINATION_OPTIONS = ["Yok", "Mat Laminasyon", "Parlak Laminasyon"];
const LAMINATION_PRICE: Record<string, number> = { "Yok": 0, "Mat Laminasyon": 5, "Parlak Laminasyon": 5 };

const BINDING_OPTIONS = ["Ciltlemesiz", "Tel Dikiş", "Termal Cilt", "Spiral Cilt", "Fransız Cilt", "Sert Kapak"];
const BINDING_PRICE: Record<string, number> = {
  "Ciltlemesiz": 0, "Tel Dikiş": 8, "Termal Cilt": 12, "Spiral Cilt": 15, "Fransız Cilt": 22, "Sert Kapak": 48,
};

// ─── Dropdown ─────────────────────────────────────────────────────────────────
function Dropdown({
  label, value, options, onChange, isRTL, placeholder,
}: {
  label: string; value: string; options: string[];
  onChange: (v: string) => void; isRTL: boolean; placeholder?: string;
}) {
  const [open, setOpen] = useState(false);
  const isPlaceholder = value === "";
  return (
    <View style={dd.wrap}>
      <Text style={[dd.label, isRTL && dd.rtl]}>{label}</Text>
      <TouchableOpacity
        style={[dd.trigger, open && dd.triggerOpen]}
        onPress={() => setOpen(!open)}
        activeOpacity={0.8}
      >
        <Text style={[dd.value, isPlaceholder && dd.placeholder, isRTL && dd.rtl]} numberOfLines={1}>
          {isPlaceholder ? (placeholder ?? "-- Seçin --") : value}
        </Text>
        <Feather name={open ? "chevron-up" : "chevron-down"} size={15} color="#999" />
      </TouchableOpacity>
      {open && (
        <View style={dd.menu}>
          {options.map((opt) => (
            <TouchableOpacity
              key={opt}
              style={[dd.option, value === opt && dd.optionActive]}
              onPress={() => { onChange(opt); setOpen(false); }}
            >
              <Text style={[dd.optionText, value === opt && dd.optionTextActive, isRTL && dd.rtl]}>
                {opt}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
}

// ─── Section Header ───────────────────────────────────────────────────────────
function SectionHeader({ icon, label, color }: { icon: string; label: string; color: string }) {
  return (
    <View style={[sh.row, { marginBottom: 12, marginTop: 4 }]}>
      <View style={[sh.dot, { backgroundColor: color }]} />
      <Text style={sh.label}>{label}</Text>
    </View>
  );
}
const sh = StyleSheet.create({
  row: { flexDirection: "row", alignItems: "center", gap: 8 },
  dot: { width: 4, height: 18, borderRadius: 2 },
  label: { fontSize: 13, fontFamily: "Inter_700Bold", color: "#1B3A6B" },
});

// ─── Main Screen ──────────────────────────────────────────────────────────────
export default function BookPrintingScreen() {
  const { language, isRTL } = useLanguage();
  const insets = useSafeAreaInsets();
  const topPad = Platform.OS === "web" ? 16 : insets.top + 8;

  const [bookSize, setBookSize]   = useState("");
  const [pageCount, setPageCount] = useState("");
  const [innerPaper, setInnerPaper]     = useState("");
  const [printColor, setPrintColor]     = useState("Siyah Beyaz");
  const [coverPaper, setCoverPaper]     = useState("Kapaksız");
  const [lamination, setLamination]     = useState("Yok");
  const [bindingType, setBindingType]   = useState("Ciltlemesiz");
  const [quantity, setQuantity]         = useState("1");

  const L = {
    title:       language === "ar" ? "طباعة الكتب والمجلات" : language === "tr" ? "Kitap ve Dergi Baskısı" : "Book & Magazine Printing",
    bookSize:    language === "ar" ? "حجم الكتاب"            : language === "tr" ? "Kitap Boyutu"           : "Book Size",
    pageCount:   language === "ar" ? "عدد الصفحات (الداخل)" : language === "tr" ? "Sayfa Sayısı (İç)"      : "Page Count (Interior)",
    innerSection:language === "ar" ? "المحتوى الداخلي"       : language === "tr" ? "İç İçerik"              : "Interior Content",
    innerPaper:  language === "ar" ? "نوع الورق الداخلي"     : language === "tr" ? "İç Kağıt Türü"          : "Interior Paper Type",
    printColor:  language === "ar" ? "لون الطباعة الداخلية"  : language === "tr" ? "İç Baskı Rengi"         : "Interior Print Color",
    coverSection:language === "ar" ? "الغلاف والتجليد"        : language === "tr" ? "Kapak ve Ciltleme"      : "Cover & Binding",
    coverPaper:  language === "ar" ? "ورق الغلاف"             : language === "tr" ? "Kapak Kağıdı"           : "Cover Paper",
    coverLam:    language === "ar" ? "تصفيح الغلاف"           : language === "tr" ? "Kapak Laminasyonu"      : "Cover Lamination",
    binding:     language === "ar" ? "نوع التجليد"            : language === "tr" ? "Ciltleme Türü"          : "Binding Type",
    quantity:    language === "ar" ? "الكمية (عدد)"           : language === "tr" ? "Miktar (Adet)"          : "Quantity (copies)",
    pdfNote:     language === "ar" ? "ملف الكتاب (PDF)"       : language === "tr" ? "Kitap Dosyası (PDF)"    : "Book File (PDF)",
    pdfHint:     language === "ar" ? "أرسل ملف PDF (الداخل + الغلاف) عبر واتساب بعد إرسال الطلب" : language === "tr" ? "Siparişten sonra PDF dosyanızı (İç + Kapak) WhatsApp'tan gönderiniz" : "Send your PDF file (Interior + Cover) via WhatsApp after placing the order",
    summary:     language === "ar" ? "ملخص الطلب"             : language === "tr" ? "Sipariş Özeti"          : "Order Summary",
    total:       language === "ar" ? "السعر الإجمالي"         : language === "tr" ? "Toplam Fiyat"           : "Total Price",
    perCopy:     language === "ar" ? "تكلفة النسخة الواحدة"   : language === "tr" ? "Kopya Başına"           : "Cost per Copy",
    send:        language === "ar" ? "أرسل الطلب عبر واتساب" : language === "tr" ? "Sepete Ekle (WhatsApp)" : "Order via WhatsApp",
    chooseSize:  language === "ar" ? "-- اختر الحجم --"       : language === "tr" ? "-- Boyut Seçin --"      : "-- Select Size --",
    choosePaper: language === "ar" ? "-- اختر الورق --"       : language === "tr" ? "-- Kağıt Seçin --"      : "-- Select Paper --",
    hint:        language === "ar" ? "الأسعار تقديرية، سيتواصل معك فريقنا لتأكيد السعر النهائي." : language === "tr" ? "Fiyatlar tahminidir. Ekibimiz nihai fiyat için sizinle iletişime geçecektir." : "Prices are estimates. Our team will confirm the final price.",
    innerPages:  language === "ar" ? "صفحات داخلية"           : language === "tr" ? "İç Sayfa"               : "Inner pages",
    cover:       language === "ar" ? "الغلاف"                 : language === "tr" ? "Kapak"                  : "Cover",
    lam:         language === "ar" ? "التصفيح"                : language === "tr" ? "Laminasyon"             : "Lamination",
    bind:        language === "ar" ? "التجليد"                : language === "tr" ? "Ciltleme"               : "Binding",
  };

  // ─── Calculation ────────────────────────────────────────────────────────────
  const calc = useCallback(() => {
    const pages = parseInt(pageCount) || 0;
    const qty   = parseInt(quantity) || 1;
    const isBW  = printColor === "Siyah Beyaz";
    const ppPage = innerPaper
      ? (isBW ? INNER_PAPER_PRICE_BW[innerPaper] : INNER_PAPER_PRICE_COLOR[innerPaper]) ?? 0
      : 0;
    const innerCost  = pages * ppPage;
    const coverCost  = COVER_PRICE[coverPaper] ?? 0;
    const lamCost    = (coverPaper !== "Kapaksız") ? (LAMINATION_PRICE[lamination] ?? 0) : 0;
    const bindCost   = BINDING_PRICE[bindingType] ?? 0;
    const perCopy    = innerCost + coverCost + lamCost + bindCost;
    const total      = perCopy * qty;
    return { innerCost, coverCost, lamCost, bindCost, perCopy, total };
  }, [pageCount, quantity, printColor, innerPaper, coverPaper, lamination, bindingType]);

  const result  = calc();
  const hasInput = (parseInt(pageCount) > 0) && innerPaper !== "";
  const fmt = (n: number) => n.toLocaleString("tr-TR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  const handleSend = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    const qty = parseInt(quantity) || 1;
    const msg = language === "ar"
      ? `مرحباً، أريد طلب طباعة كتاب/مجلة:\n📚 الحجم: ${bookSize || "غير محدد"}\n📄 الصفحات: ${pageCount}\n🖨 الورق الداخلي: ${innerPaper} - ${printColor}\n📕 الغلاف: ${coverPaper} | لمينيشن: ${lamination}\n🔗 التجليد: ${bindingType}\n📦 الكمية: ${qty} نسخة\n💰 السعر التقديري: ${fmt(result.total)} ₺\n⚠️ سأرسل ملف PDF قريباً`
      : language === "tr"
      ? `Merhaba, kitap/dergi baskısı siparişi vermek istiyorum:\n📚 Boyut: ${bookSize || "Belirtilmedi"}\n📄 Sayfa Sayısı: ${pageCount}\n🖨 İç Kağıt: ${innerPaper} - ${printColor}\n📕 Kapak: ${coverPaper} | Laminasyon: ${lamination}\n🔗 Ciltleme: ${bindingType}\n📦 Miktar: ${qty} adet\n💰 Tahmini Fiyat: ${fmt(result.total)} ₺\n⚠️ PDF dosyasını kısa süre içinde göndereceğim`
      : `Hello, I'd like to order book/magazine printing:\n📚 Size: ${bookSize || "Not specified"}\n📄 Pages: ${pageCount}\n🖨 Inner Paper: ${innerPaper} - ${printColor}\n📕 Cover: ${coverPaper} | Lamination: ${lamination}\n🔗 Binding: ${bindingType}\n📦 Quantity: ${qty} copies\n💰 Est. Price: ${fmt(result.total)} ₺\n⚠️ Will send PDF file shortly`;
    Linking.openURL(`https://wa.me/${CONTACT_INFO.whatsapp}?text=${encodeURIComponent(msg)}`);
  };

  const SRow = ({ label, value, hl }: { label: string; value: string; hl?: boolean }) => (
    <View style={s.sRow}>
      <Text style={s.sLabel}>{label}</Text>
      <Text style={[s.sValue, hl && s.sValueHL]}>{value}</Text>
    </View>
  );

  return (
    <View style={[s.container, { paddingTop: topPad }]}>
      {/* Header */}
      <View style={[s.header, isRTL && s.rowR]}>
        <TouchableOpacity onPress={() => router.back()} style={s.backBtn}>
          <Feather name={isRTL ? "arrow-right" : "arrow-left"} size={22} color="#1B3A6B" />
        </TouchableOpacity>
        <Text style={s.headerTitle}>{L.title}</Text>
        <View style={{ width: 38 }} />
      </View>

      <ScrollView
        contentContainerStyle={[s.scroll, { paddingBottom: Math.max(insets.bottom, 24) + 48 }]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* ── Form Card ──────────────────────────────────── */}
        <View style={s.card}>
          {/* Book size + page count */}
          <View style={s.row2}>
            <View style={[s.half, { zIndex: 40 }]}>
              <Dropdown
                label={L.bookSize} value={bookSize}
                options={BOOK_SIZES} onChange={setBookSize}
                isRTL={isRTL} placeholder={L.chooseSize}
              />
            </View>
            <View style={s.half}>
              <Text style={[s.fieldLabel, isRTL && s.rtl]}>{L.pageCount}</Text>
              <TextInput
                style={[s.input, isRTL && s.rtl]}
                placeholder="Örn: 150"
                placeholderTextColor="#CCC"
                value={pageCount}
                onChangeText={setPageCount}
                keyboardType="numeric"
              />
            </View>
          </View>

          {/* Inner content section */}
          <SectionHeader icon="file-text" label={L.innerSection} color="#E63946" />
          <View style={s.row2}>
            <View style={[s.half, { zIndex: 30 }]}>
              <Dropdown
                label={L.innerPaper} value={innerPaper}
                options={INNER_PAPER_OPTIONS} onChange={setInnerPaper}
                isRTL={isRTL} placeholder={L.choosePaper}
              />
            </View>
            <View style={[s.half, { zIndex: 30 }]}>
              <Dropdown
                label={L.printColor} value={printColor}
                options={PRINT_COLORS} onChange={setPrintColor}
                isRTL={isRTL}
              />
            </View>
          </View>

          {/* Cover & binding section */}
          <SectionHeader icon="book" label={L.coverSection} color="#E63946" />
          <View style={s.row2}>
            <View style={[s.half, { zIndex: 20 }]}>
              <Dropdown
                label={L.coverPaper} value={coverPaper}
                options={COVER_PAPER_OPTIONS} onChange={setCoverPaper}
                isRTL={isRTL}
              />
            </View>
            <View style={[s.half, { zIndex: 20 }]}>
              <Dropdown
                label={L.coverLam} value={lamination}
                options={LAMINATION_OPTIONS} onChange={setLamination}
                isRTL={isRTL}
              />
            </View>
          </View>
          <View style={{ zIndex: 10 }}>
            <Dropdown
              label={L.binding} value={bindingType}
              options={BINDING_OPTIONS} onChange={setBindingType}
              isRTL={isRTL}
            />
          </View>

          {/* Quantity */}
          <View style={[s.row2, { marginTop: 14, alignItems: "flex-end" }]}>
            <View style={s.half}>
              <Text style={[s.fieldLabel, isRTL && s.rtl]}>{L.quantity}</Text>
              <TextInput
                style={[s.input, s.inputLg, isRTL && s.rtl]}
                value={quantity}
                onChangeText={setQuantity}
                keyboardType="numeric"
                placeholder="1"
                placeholderTextColor="#CCC"
              />
            </View>
            {/* PDF note */}
            <View style={[s.half, s.pdfNote]}>
              <Feather name="file-text" size={20} color="#E63946" />
              <View style={{ flex: 1, marginLeft: 6 }}>
                <Text style={s.pdfNoteTitle}>{L.pdfNote}</Text>
                <Text style={s.pdfNoteText}>{L.pdfHint}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* ── Summary Card ───────────────────────────────── */}
        <View style={s.summaryCard}>
          <View style={[s.summaryHeader, isRTL && s.rowR]}>
            <Feather name="bar-chart-2" size={15} color="#FFF" />
            <Text style={s.summaryTitle}>{L.summary}</Text>
          </View>

          <SRow label={`📄 ${L.innerPages}`}
            value={hasInput ? `${fmt(result.innerCost)} ₺` : "0.00 ₺"} />
          {coverPaper !== "Kapaksız" && (
            <SRow label={`📕 ${L.cover}`}
              value={hasInput ? `${fmt(result.coverCost)} ₺` : "0.00 ₺"} />
          )}
          {lamination !== "Yok" && coverPaper !== "Kapaksız" && (
            <SRow label={`✨ ${L.lam}`}
              value={hasInput ? `${fmt(result.lamCost)} ₺` : "0.00 ₺"} />
          )}
          {bindingType !== "Ciltlemesiz" && (
            <SRow label={`🔗 ${L.bind}`}
              value={hasInput ? `${fmt(result.bindCost)} ₺` : "0.00 ₺"} />
          )}

          <View style={s.divider} />

          <View style={s.totalBox}>
            <Text style={s.totalLabel}>{L.total}</Text>
            <Text style={s.totalValue}>{hasInput ? `${fmt(result.total)} ₺` : "0.00"}</Text>
            <Text style={s.totalCurrency}>₺</Text>
          </View>

          <TouchableOpacity
            style={[s.sendBtn, !hasInput && s.sendBtnDisabled]}
            onPress={handleSend}
            activeOpacity={0.85}
            disabled={!hasInput}
          >
            <Feather name="shopping-cart" size={17} color={hasInput ? "#1B3A6B" : "#AAA"} />
            <Text style={[s.sendBtnText, !hasInput && s.sendBtnTextDisabled]}>{L.send}</Text>
          </TouchableOpacity>
        </View>

        {/* Hint */}
        <View style={[s.hintRow, isRTL && s.rowR]}>
          <Feather name="info" size={13} color="#AAA" />
          <Text style={s.hintText}>{L.hint}</Text>
        </View>
      </ScrollView>
    </View>
  );
}

// ─── Dropdown Styles ──────────────────────────────────────────────────────────
const dd = StyleSheet.create({
  wrap: { marginBottom: 0 },
  label: { fontSize: 11, fontFamily: "Inter_500Medium", color: "#666", marginBottom: 5 },
  trigger: {
    flexDirection: "row", alignItems: "center", justifyContent: "space-between",
    borderWidth: 1, borderColor: "#E0E0E0", borderRadius: 10,
    paddingHorizontal: 11, paddingVertical: 10, backgroundColor: "#FAFAFA",
  },
  triggerOpen: { borderColor: "#1B3A6B" },
  value: { fontSize: 13, color: "#222", fontFamily: "Inter_500Medium", flex: 1, marginRight: 4 },
  placeholder: { color: "#AAA", fontFamily: "Inter_400Regular" },
  menu: {
    position: "absolute", top: "100%", left: 0, right: 0, zIndex: 999,
    backgroundColor: "#FFF", borderRadius: 10, borderWidth: 1, borderColor: "#E0E0E0",
    shadowColor: "#000", shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12, shadowRadius: 10, elevation: 10,
  },
  option: { paddingHorizontal: 12, paddingVertical: 10 },
  optionActive: { backgroundColor: "#1B3A6B10" },
  optionText: { fontSize: 13, color: "#333", fontFamily: "Inter_400Regular" },
  optionTextActive: { color: "#1B3A6B", fontFamily: "Inter_600SemiBold" },
  rtl: { textAlign: "right" },
});

// ─── Main Styles ──────────────────────────────────────────────────────────────
const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F5F7FA" },
  header: {
    flexDirection: "row", alignItems: "center",
    paddingHorizontal: 14, paddingVertical: 12,
    backgroundColor: "#FFF", borderBottomWidth: 1, borderBottomColor: "#EEE",
  },
  backBtn: { padding: 8, borderRadius: 8 },
  headerTitle: { flex: 1, textAlign: "center", fontSize: 15, fontFamily: "Inter_700Bold", color: "#1B3A6B" },
  rowR: { flexDirection: "row-reverse" },
  rtl: { textAlign: "right" },

  scroll: { padding: 14, gap: 12 },

  card: {
    backgroundColor: "#FFF", borderRadius: 16, padding: 14, gap: 14,
    shadowColor: "#000", shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06, shadowRadius: 8, elevation: 3,
  },
  row2: { flexDirection: "row", gap: 10 },
  half: { flex: 1 },

  fieldLabel: { fontSize: 11, fontFamily: "Inter_500Medium", color: "#666", marginBottom: 5 },
  input: {
    borderWidth: 1, borderColor: "#E0E0E0", borderRadius: 10,
    paddingHorizontal: 11, paddingVertical: 10,
    fontSize: 13, fontFamily: "Inter_400Regular", color: "#222", backgroundColor: "#FAFAFA",
  },
  inputLg: { fontSize: 18, fontFamily: "Inter_700Bold", textAlign: "center", paddingVertical: 14 },

  pdfNote: {
    flexDirection: "row", alignItems: "flex-start",
    backgroundColor: "#FFF8F8", borderRadius: 10, padding: 10,
    borderWidth: 1, borderColor: "#FDDCDC",
  },
  pdfNoteTitle: { fontSize: 11, fontFamily: "Inter_700Bold", color: "#E63946", marginBottom: 2 },
  pdfNoteText: { fontSize: 10, color: "#888", fontFamily: "Inter_400Regular", lineHeight: 14 },

  summaryCard: {
    backgroundColor: "#1B3A6B", borderRadius: 16, padding: 16,
    shadowColor: "#1B3A6B", shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25, shadowRadius: 10, elevation: 5,
  },
  summaryHeader: { flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 14 },
  summaryTitle: { fontSize: 14, fontFamily: "Inter_700Bold", color: "#FFF" },

  sRow: { flexDirection: "row", justifyContent: "space-between", paddingVertical: 4 },
  sLabel: { fontSize: 12, color: "rgba(255,255,255,0.65)", fontFamily: "Inter_400Regular" },
  sValue: { fontSize: 12, color: "#FFF", fontFamily: "Inter_500Medium" },
  sValueHL: { color: "#C9A847", fontFamily: "Inter_700Bold" },

  divider: { height: 1, backgroundColor: "rgba(255,255,255,0.15)", marginVertical: 10 },

  totalBox: { alignItems: "center", paddingVertical: 6 },
  totalLabel: { fontSize: 12, color: "rgba(255,255,255,0.65)", fontFamily: "Inter_400Regular", marginBottom: 2 },
  totalValue: { fontSize: 36, color: "#C9A847", fontFamily: "Inter_700Bold" },
  totalCurrency: { fontSize: 14, color: "rgba(255,255,255,0.5)", fontFamily: "Inter_400Regular" },

  sendBtn: {
    backgroundColor: "#C9A847", borderRadius: 12, paddingVertical: 14,
    flexDirection: "row", alignItems: "center", justifyContent: "center",
    gap: 8, marginTop: 10,
  },
  sendBtnDisabled: { backgroundColor: "rgba(255,255,255,0.15)" },
  sendBtnText: { fontSize: 14, fontFamily: "Inter_700Bold", color: "#1B3A6B" },
  sendBtnTextDisabled: { color: "rgba(255,255,255,0.35)" },

  hintRow: { flexDirection: "row", gap: 6, alignItems: "flex-start" },
  hintText: { flex: 1, fontSize: 11, color: "#AAA", fontFamily: "Inter_400Regular", lineHeight: 16 },
});
