import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { router } from "expo-router";
import React, { useCallback, useState } from "react";
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
import { CONTACT_INFO } from "@/constants/data";
import { useLanguage } from "@/context/LanguageContext";

// ─── Pricing Constants (TL) ───────────────────────────────────────────────────
const CARDBOARD_PRICES: Record<string, Record<string, number>> = {
  Kroma:   { "250g": 1.80, "300g": 2.20, "350g": 2.60, "400g": 3.00 },
  Duplex:  { "250g": 1.50, "300g": 1.90, "350g": 2.30, "400g": 2.70 },
  Mikron:  { "250g": 2.10, "300g": 2.50, "350g": 2.90, "400g": 3.30 },
  Kuşe:    { "250g": 1.60, "300g": 2.00, "350g": 2.40, "400g": 2.80 },
};
const LAMINATION_PRICES: Record<string, number> = { Yok: 0, Mat: 0.75, Parlak: 0.85 };
const UV_PRICES: Record<string, number>         = { Yok: 0, Tam: 0.95, Spot: 1.40 };
const THERMAL_PRICES: Record<string, number>    = { Yok: 0, Mat: 0.55, Parlak: 0.65 };
const GLUE_PRICES: Record<string, number>       = { Yok: 0, Düz: 0.45, Özel: 0.80 };
const PRINT_PRICE_PER_SHEET                     = 1.40;
const CUTTING_PRICE_PER_SHEET                   = 0.35;
const CUSTOM_DIE_PRICE                          = 7500;
const SHEET_WEIGHT_KG: Record<string, number>   = { "250g": 0.875, "300g": 1.05, "350g": 1.225, "400g": 1.40 };

// ─── Dropdown ─────────────────────────────────────────────────────────────────
function DropdownField({
  label, value, options, onChange, isRTL, accent,
}: {
  label: string; value: string; options: string[];
  onChange: (v: string) => void; isRTL: boolean; accent?: string;
}) {
  const [open, setOpen] = useState(false);
  return (
    <View style={dd.wrap}>
      <Text style={[dd.label, isRTL && dd.rtl, accent ? { color: accent } : null]}>{label}</Text>
      <TouchableOpacity
        style={[dd.trigger, open && dd.triggerOpen, accent ? { borderColor: accent } : null]}
        onPress={() => setOpen(!open)}
        activeOpacity={0.8}
      >
        <Text style={[dd.value, isRTL && dd.rtl]}>{value}</Text>
        <Feather name={open ? "chevron-up" : "chevron-down"} size={16} color="#888" />
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

// ─── Main Screen ──────────────────────────────────────────────────────────────
export default function BoxCalculatorScreen() {
  const { language, isRTL } = useLanguage();
  const insets = useSafeAreaInsets();
  const topPad = Platform.OS === "web" ? 16 : insets.top + 8;

  const [totalBoxes, setTotalBoxes]       = useState("");
  const [boxesPerSheet, setBoxesPerSheet] = useState("");
  const [cardboardType, setCardboardType] = useState("Kroma");
  const [grammage, setGrammage]           = useState("300g");
  const [lamination, setLamination]       = useState("Yok");
  const [uvLak, setUvLak]                 = useState("Yok");
  const [thermal, setThermal]             = useState("Yok");
  const [gluing, setGluing]               = useState("Yok");
  const [dieType, setDieType]             = useState("Standart");
  const [calcDie, setCalcDie]             = useState(true);

  // ─── Labels by language ─────────────────────────────────────────────────────
  const L = {
    title:        language === "ar" ? "حاسبة تكلفة الكرتون" : language === "tr" ? "Akıllı Kutu Hesaplayıcı" : "Smart Box Calculator",
    orderData:    language === "ar" ? "بيانات الطلب"        : language === "tr" ? "Sipariş Verileri"         : "Order Details",
    totalBoxes:   language === "ar" ? "إجمالي عدد الكراتين المطلوبة" : language === "tr" ? "İstenen Toplam Kutu Sayısı" : "Total Boxes Required",
    perSheet:     language === "ar" ? "عدد الكراتين في الطبقة (50×70)" : language === "tr" ? "Tabakadaki (50x70) Kutu Sayısı" : "Boxes per Sheet (50×70)",
    cardType:     language === "ar" ? "نوع الكرتون"         : language === "tr" ? "Karton Türü"              : "Cardboard Type",
    grammage:     language === "ar" ? "وزن الكرتون"         : language === "tr" ? "Karton Gramajı"           : "Cardboard Weight",
    lam:          language === "ar" ? "التصفيح"             : language === "tr" ? "Laminasyon"               : "Lamination",
    uv:           language === "ar" ? "لك UV"               : language === "tr" ? "UV Lak"                   : "UV Lacquer",
    thermal:      language === "ar" ? "حراري"               : language === "tr" ? "Termal"                   : "Thermal",
    glue:         language === "ar" ? "طريقة اللصق"         : language === "tr" ? "Yapıştırma Yöntemi"       : "Gluing Method",
    die:          language === "ar" ? "قالب القطع"          : language === "tr" ? "Kesim Kalıbı"             : "Cutting Die",
    calcDie:      language === "ar" ? "احسب تكلفة القالب"   : language === "tr" ? "Kesim Ücretini Hesapla"   : "Include Die Cost",
    summary:      language === "ar" ? "ملخص السعر"          : language === "tr" ? "Sipariş Özeti"            : "Price Summary",
    sheets:       language === "ar" ? "إجمالي الطبقات"      : language === "tr" ? "Toplam Tabaka"            : "Total Sheets",
    weight:       language === "ar" ? "الوزن الكلي"         : language === "tr" ? "Toplam Ağırlık"           : "Total Weight",
    cardCost:     language === "ar" ? "الكرتون"             : language === "tr" ? "Karton"                   : "Cardboard",
    printCost:    language === "ar" ? "الطباعة"             : language === "tr" ? "Baskı"                    : "Printing",
    lamCost:      language === "ar" ? "التصفيح"             : language === "tr" ? "Laminasyon"               : "Lamination",
    uvCost:       language === "ar" ? "لك UV"               : language === "tr" ? "UV Lak"                   : "UV Lacquer",
    thermalCost:  language === "ar" ? "الحراري"             : language === "tr" ? "Termal"                   : "Thermal",
    cuttingCost:  language === "ar" ? "القطع"               : language === "tr" ? "Kesim"                    : "Cutting",
    glueCost:     language === "ar" ? "اللصق"               : language === "tr" ? "Yapıştırma"               : "Gluing",
    dieCost:      language === "ar" ? "قالب القطع"          : language === "tr" ? "Kesim Kalıbı"             : "Cutting Die",
    total:        language === "ar" ? "السعر الإجمالي"      : language === "tr" ? "Toplam Fiyat"             : "Total Price",
    perBox:       language === "ar" ? "تكلفة الكرتونة الواحدة" : language === "tr" ? "Kutu Maliyeti"         : "Cost per Box",
    addToCart:    language === "ar" ? "أضف للسلة عبر واتساب" : language === "tr" ? "Sepete Ekle"             : "Send via WhatsApp",
    reset:        language === "ar" ? "إعادة تعيين"         : language === "tr" ? "Alanları Temizle"         : "Reset Fields",
    hint:         language === "ar" ? "الأسعار تقديرية. سيتواصل معك فريقنا بالسعر النهائي." : language === "tr" ? "Fiyatlar tahminidir. Ekibimiz nihai fiyat için sizinle iletişime geçecektir." : "Prices are estimates. Our team will contact you with the final price.",
  };

  // ─── Calculation ────────────────────────────────────────────────────────────
  const calc = useCallback(() => {
    const boxes = parseInt(totalBoxes) || 0;
    const bps   = parseInt(boxesPerSheet) || 1;
    const sheets = Math.ceil(boxes / bps);
    const weightKg = sheets * (SHEET_WEIGHT_KG[grammage] ?? 1.05);
    const cardPrice  = sheets * (CARDBOARD_PRICES[cardboardType]?.[grammage] ?? 2.20);
    const printPrice = sheets * PRINT_PRICE_PER_SHEET;
    const lamPrice   = sheets * (LAMINATION_PRICES[lamination] ?? 0);
    const uvPrice    = sheets * (UV_PRICES[uvLak] ?? 0);
    const thermPrice = sheets * (THERMAL_PRICES[thermal] ?? 0);
    const cutPrice   = sheets * CUTTING_PRICE_PER_SHEET;
    const gluePrice  = sheets * (GLUE_PRICES[gluing] ?? 0);
    const diePrice   = (calcDie && dieType === "Özel Kesim") ? CUSTOM_DIE_PRICE : 0;
    const total = cardPrice + printPrice + lamPrice + uvPrice + thermPrice + cutPrice + gluePrice + diePrice;
    const perBox = boxes > 0 ? total / boxes : 0;
    return { sheets, weightKg, cardPrice, printPrice, lamPrice, uvPrice, thermPrice, cutPrice, gluePrice, diePrice, total, perBox };
  }, [totalBoxes, boxesPerSheet, cardboardType, grammage, lamination, uvLak, thermal, gluing, dieType, calcDie]);

  const result = calc();
  const hasInput = parseInt(totalBoxes) > 0 && parseInt(boxesPerSheet) > 0;

  const fmt = (n: number) => n.toLocaleString("tr-TR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  const handleWhatsApp = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    const msg = language === "ar"
      ? `مرحباً، أريد طلب عرض سعر للكراتين:\n📦 العدد: ${totalBoxes}\n📋 النوع: ${cardboardType} ${grammage}\n🖨 التصفيح: ${lamination} | UV: ${uvLak}\n💰 السعر التقديري: ${fmt(result.total)} ₺`
      : language === "tr"
      ? `Merhaba, kutu fiyat teklifi istiyorum:\n📦 Adet: ${totalBoxes}\n📋 Tür: ${cardboardType} ${grammage}\n🖨 Laminasyon: ${lamination} | UV: ${uvLak}\n💰 Tahmini Fiyat: ${fmt(result.total)} ₺`
      : `Hello, I'd like a quote for boxes:\n📦 Quantity: ${totalBoxes}\n📋 Type: ${cardboardType} ${grammage}\n🖨 Lamination: ${lamination} | UV: ${uvLak}\n💰 Estimated Price: ${fmt(result.total)} ₺`;
    Linking.openURL(`https://wa.me/${CONTACT_INFO.whatsapp}?text=${encodeURIComponent(msg)}`);
  };

  const handleReset = () => {
    setTotalBoxes(""); setBoxesPerSheet(""); setCardboardType("Kroma");
    setGrammage("300g"); setLamination("Yok"); setUvLak("Yok");
    setThermal("Yok"); setGluing("Yok"); setDieType("Standart"); setCalcDie(true);
  };

  // ─── Summary Row ────────────────────────────────────────────────────────────
  const SRow = ({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) => (
    <View style={[s.sRow, isRTL && s.row_r]}>
      <Text style={[s.sLabel, isRTL && s.rtl]}>{label}</Text>
      <Text style={[s.sValue, highlight && s.sValueHL]}>{value}</Text>
    </View>
  );

  return (
    <View style={[s.container, { paddingTop: topPad }]}>
      {/* Header */}
      <View style={[s.header, isRTL && s.row_r]}>
        <TouchableOpacity onPress={() => router.back()} style={s.backBtn}>
          <Feather name={isRTL ? "arrow-right" : "arrow-left"} size={22} color="#1B3A6B" />
        </TouchableOpacity>
        <View style={s.headerCenter}>
          <Text style={s.headerTitle}>{L.title}</Text>
        </View>
        <TouchableOpacity onPress={handleReset} style={s.resetBtn}>
          <Feather name="refresh-ccw" size={18} color="#888" />
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={[s.scroll, { paddingBottom: Math.max(insets.bottom, 24) + 40 }]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* ── Order Data Card ─────────────────────────── */}
        <View style={s.card}>
          <View style={[s.cardHeader, isRTL && s.row_r]}>
            <Feather name="settings" size={16} color="#1B3A6B" />
            <Text style={[s.cardTitle, isRTL && { marginRight: 8, marginLeft: 0 }]}>{L.orderData}</Text>
          </View>

          {/* Total boxes + per sheet */}
          <View style={s.rowFields}>
            <View style={s.halfField}>
              <Text style={[s.fieldLabel, isRTL && s.rtl]}>{L.totalBoxes}</Text>
              <TextInput
                style={[s.input, isRTL && s.rtl]}
                placeholder="Örn: 8000"
                placeholderTextColor="#BBB"
                value={totalBoxes}
                onChangeText={setTotalBoxes}
                keyboardType="numeric"
              />
            </View>
            <View style={s.halfField}>
              <Text style={[s.fieldLabel, isRTL && s.rtl]}>{L.perSheet}</Text>
              <TextInput
                style={[s.input, isRTL && s.rtl]}
                placeholder="Örn: 8"
                placeholderTextColor="#BBB"
                value={boxesPerSheet}
                onChangeText={setBoxesPerSheet}
                keyboardType="numeric"
              />
            </View>
          </View>

          {/* Cardboard type + grammage */}
          <View style={s.rowFields}>
            <View style={s.halfField}>
              <DropdownField label={L.cardType} value={cardboardType}
                options={Object.keys(CARDBOARD_PRICES)} onChange={setCardboardType} isRTL={isRTL} />
            </View>
            <View style={s.halfField}>
              <DropdownField label={L.grammage} value={grammage}
                options={["250g", "300g", "350g", "400g"]} onChange={setGrammage} isRTL={isRTL} />
            </View>
          </View>

          {/* Lamination + UV + Thermal */}
          <View style={s.rowFields}>
            <View style={s.thirdField}>
              <DropdownField label={L.lam} value={lamination}
                options={["Yok", "Mat", "Parlak"]} onChange={setLamination} isRTL={isRTL} />
            </View>
            <View style={s.thirdField}>
              <DropdownField label={L.uv} value={uvLak}
                options={["Yok", "Tam", "Spot"]} onChange={setUvLak} isRTL={isRTL} />
            </View>
            <View style={s.thirdField}>
              <DropdownField label={L.thermal} value={thermal}
                options={["Yok", "Mat", "Parlak"]} onChange={setThermal} isRTL={isRTL} />
            </View>
          </View>

          {/* Gluing + Die */}
          <View style={s.rowFields}>
            <View style={s.halfField}>
              <DropdownField label={L.glue} value={gluing}
                options={["Yok", "Düz", "Özel"]} onChange={setGluing} isRTL={isRTL} />
            </View>
            <View style={s.halfField}>
              <DropdownField
                label={L.die} value={dieType}
                options={["Standart", "Özel Kesim"]} onChange={setDieType}
                isRTL={isRTL}
                accent={dieType === "Özel Kesim" ? "#C9A847" : undefined}
              />
            </View>
          </View>

          {/* Toggle: include die cost */}
          <View style={[s.toggleRow, isRTL && s.row_r]}>
            <Text style={[s.toggleLabel, isRTL && s.rtl]}>{L.calcDie}</Text>
            <Switch
              value={calcDie}
              onValueChange={setCalcDie}
              trackColor={{ false: "#DDD", true: "#1B3A6B" }}
              thumbColor={calcDie ? "#C9A847" : "#FFF"}
            />
          </View>
        </View>

        {/* ── Summary Card ────────────────────────────── */}
        <View style={[s.card, s.summaryCard]}>
          <View style={[s.cardHeader, isRTL && s.row_r]}>
            <Feather name="bar-chart-2" size={16} color="#FFF" />
            <Text style={[s.cardTitle, { color: "#FFF", marginLeft: 8 }, isRTL && { marginRight: 8, marginLeft: 0 }]}>
              {L.summary}
            </Text>
          </View>

          <SRow label={`📋 ${L.sheets}`} value={hasInput ? `${result.sheets.toLocaleString()} ${language === "ar" ? "طبقة" : "Tabaka"}` : "—"} />
          <SRow label={`⚖️ ${L.weight}`} value={hasInput ? `${fmt(result.weightKg)} Kg` : "—"} />

          <View style={s.divider} />

          <SRow label={`🟦 ${L.cardCost}`}   value={hasInput ? `${fmt(result.cardPrice)} ₺`   : "0.00 ₺"} />
          <SRow label={`🖨️ ${L.printCost}`}  value={hasInput ? `${fmt(result.printPrice)} ₺`  : "0.00 ₺"} />
          {lamination !== "Yok" && <SRow label={`✨ ${L.lamCost}`}  value={hasInput ? `${fmt(result.lamPrice)} ₺`    : "0.00 ₺"} />}
          {uvLak !== "Yok"      && <SRow label={`💎 ${L.uvCost}`}   value={hasInput ? `${fmt(result.uvPrice)} ₺`     : "0.00 ₺"} />}
          {thermal !== "Yok"    && <SRow label={`🔥 ${L.thermalCost}`} value={hasInput ? `${fmt(result.thermPrice)} ₺` : "0.00 ₺"} />}
          <SRow label={`✂️ ${L.cuttingCost}`} value={hasInput ? `${fmt(result.cutPrice)} ₺`  : "0.00 ₺"} />
          {gluing !== "Yok"     && <SRow label={`🔗 ${L.glueCost}`} value={hasInput ? `${fmt(result.gluePrice)} ₺`   : "0.00 ₺"} />}
          {calcDie && dieType === "Özel Kesim" && (
            <SRow label={`🗂️ ${L.dieCost}`} value={`${fmt(result.diePrice)} ₺`} highlight />
          )}

          <View style={s.divider} />

          {/* Total */}
          <View style={s.totalBox}>
            <Text style={s.totalLabel}>{L.total}</Text>
            <Text style={s.totalValue}>{hasInput ? `${fmt(result.total)} ₺` : "0.00 ₺"}</Text>
          </View>

          {/* Per box */}
          <View style={s.perBoxRow}>
            <Text style={s.perBoxText}>{L.perBox}</Text>
            <Text style={s.perBoxValue}>{hasInput ? `${fmt(result.perBox)} ₺` : "0.0000 ₺"}</Text>
          </View>
        </View>

        {/* Hint */}
        <View style={[s.hintCard, isRTL && s.row_r]}>
          <Feather name="info" size={14} color="#888" />
          <Text style={[s.hintText, isRTL && { marginRight: 8, marginLeft: 0, textAlign: "right" }]}>{L.hint}</Text>
        </View>

        {/* WhatsApp CTA */}
        <TouchableOpacity style={s.waBtn} onPress={handleWhatsApp} activeOpacity={0.85} disabled={!hasInput}>
          <Feather name="message-circle" size={20} color="#FFF" />
          <Text style={s.waBtnText}>{L.addToCart}</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

// ─── Dropdown Styles ──────────────────────────────────────────────────────────
const dd = StyleSheet.create({
  wrap:  { marginBottom: 0 },
  label: { fontSize: 11, fontFamily: "Inter_500Medium", color: "#666", marginBottom: 4 },
  trigger: {
    flexDirection: "row", alignItems: "center", justifyContent: "space-between",
    borderWidth: 1, borderColor: "#E0E0E0", borderRadius: 10,
    paddingHorizontal: 10, paddingVertical: 10, backgroundColor: "#FAFAFA",
  },
  triggerOpen: { borderColor: "#1B3A6B" },
  value: { fontSize: 13, color: "#333", fontFamily: "Inter_500Medium", flex: 1 },
  menu: {
    position: "absolute", top: "100%", left: 0, right: 0, zIndex: 999,
    backgroundColor: "#FFF", borderRadius: 10, borderWidth: 1, borderColor: "#E0E0E0",
    shadowColor: "#000", shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1, shadowRadius: 8, elevation: 8,
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
    paddingHorizontal: 16, paddingVertical: 12,
    backgroundColor: "#FFF", borderBottomWidth: 1, borderBottomColor: "#EEE",
  },
  backBtn: { padding: 8, borderRadius: 8 },
  headerCenter: { flex: 1, alignItems: "center" },
  headerTitle: { fontSize: 16, fontFamily: "Inter_700Bold", color: "#1B3A6B" },
  resetBtn: { padding: 8 },
  row_r: { flexDirection: "row-reverse" },
  rtl: { textAlign: "right" },

  scroll: { padding: 14, gap: 12 },

  card: {
    backgroundColor: "#FFF", borderRadius: 16, padding: 14,
    shadowColor: "#000", shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06, shadowRadius: 8, elevation: 3,
  },
  summaryCard: { backgroundColor: "#1B3A6B" },
  cardHeader: { flexDirection: "row", alignItems: "center", marginBottom: 14 },
  cardTitle: { fontSize: 14, fontFamily: "Inter_700Bold", color: "#1B3A6B", marginLeft: 8 },

  rowFields: { flexDirection: "row", gap: 10, marginBottom: 12 },
  halfField: { flex: 1, zIndex: 10 },
  thirdField: { flex: 1, zIndex: 10 },

  fieldLabel: { fontSize: 11, fontFamily: "Inter_500Medium", color: "#666", marginBottom: 4 },
  input: {
    borderWidth: 1, borderColor: "#E0E0E0", borderRadius: 10,
    paddingHorizontal: 10, paddingVertical: 10, fontSize: 13,
    fontFamily: "Inter_400Regular", color: "#333", backgroundColor: "#FAFAFA",
  },

  toggleRow: {
    flexDirection: "row", alignItems: "center", justifyContent: "space-between",
    paddingTop: 4,
  },
  toggleLabel: { fontSize: 13, fontFamily: "Inter_500Medium", color: "#444", flex: 1 },

  sRow: {
    flexDirection: "row", justifyContent: "space-between", alignItems: "center",
    paddingVertical: 5,
  },
  sLabel: { fontSize: 12, color: "rgba(255,255,255,0.75)", fontFamily: "Inter_400Regular", flex: 1 },
  sValue: { fontSize: 12, color: "#FFF", fontFamily: "Inter_500Medium" },
  sValueHL: { color: "#C9A847", fontFamily: "Inter_700Bold", fontSize: 13 },

  divider: { height: 1, backgroundColor: "rgba(255,255,255,0.15)", marginVertical: 8 },

  totalBox: { alignItems: "center", paddingVertical: 8 },
  totalLabel: { fontSize: 12, color: "rgba(255,255,255,0.7)", fontFamily: "Inter_400Regular", marginBottom: 4 },
  totalValue: { fontSize: 32, color: "#FFF", fontFamily: "Inter_700Bold" },

  perBoxRow: {
    backgroundColor: "rgba(255,255,255,0.12)", borderRadius: 10,
    paddingHorizontal: 14, paddingVertical: 10,
    flexDirection: "row", justifyContent: "space-between",
    marginTop: 8,
  },
  perBoxText: { fontSize: 12, color: "rgba(255,255,255,0.75)", fontFamily: "Inter_500Medium" },
  perBoxValue: { fontSize: 12, color: "#C9A847", fontFamily: "Inter_700Bold" },

  hintCard: {
    flexDirection: "row", gap: 8, alignItems: "flex-start",
    backgroundColor: "#FFF9E6", borderRadius: 10, padding: 12,
    borderWidth: 1, borderColor: "#F0E0A0",
  },
  hintText: { flex: 1, fontSize: 11, color: "#666", fontFamily: "Inter_400Regular", lineHeight: 16, marginLeft: 4 },

  waBtn: {
    backgroundColor: "#25D366", borderRadius: 14, paddingVertical: 16,
    flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 10,
    shadowColor: "#25D366", shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35, shadowRadius: 8, elevation: 4,
  },
  waBtnText: { fontSize: 16, fontFamily: "Inter_700Bold", color: "#FFF" },
});
