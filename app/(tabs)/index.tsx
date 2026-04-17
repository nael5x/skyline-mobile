import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { router } from "expo-router";
import React from "react";
import {
  Image,
  Linking,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { CategoryCard } from "@/components/CategoryCard";
import { ServiceCard } from "@/components/ServiceCard";
import { StatCard } from "@/components/StatCard";
import colors from "@/constants/colors";
import { CATEGORIES, CONTACT_INFO } from "@/constants/data";
import { useLanguage } from "@/context/LanguageContext";

const ICON_SERVICES = ["printer", "layers", "maximize", "edit-3", "package", "truck"] as const;
const SERVICE_COLORS = [
  colors.light.primary,
  "#C9A847",
  "#2E5DA6",
  "#1B7A5A",
  "#5C3D82",
  "#8B4513",
];

export default function HomeScreen() {
  const { t, isRTL } = useLanguage();
  const insets = useSafeAreaInsets();

  const serviceKeys = [
    "digitalPrinting",
    "offsetPrinting",
    "largeFormat",
    "designService",
    "packaging",
    "expressDelivery",
  ] as const;
  const serviceDescKeys = [
    "digitalPrintingDesc",
    "offsetPrintingDesc",
    "largeFormatDesc",
    "designServiceDesc",
    "packagingDesc",
    "expressDeliveryDesc",
  ] as const;

  const handleCall = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    Linking.openURL(`tel:${CONTACT_INFO.phone}`);
  };

  const handleWhatsApp = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    Linking.openURL(`https://wa.me/${CONTACT_INFO.whatsapp}`);
  };

  const topPad =
    Platform.OS === "web"
      ? 67 + 20
      : insets.top > 0
      ? insets.top
      : 20;

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={[styles.content, { paddingBottom: Math.max(insets.bottom, 34) + 80 }]}
      showsVerticalScrollIndicator={false}
    >
      <StatusBar barStyle="light-content" />

      {/* Hero */}
      <View style={[styles.hero, { paddingTop: topPad + 16 }]}>
        <Image
          source={require("@/assets/images/hero_banner.png")}
          style={styles.heroBg}
          resizeMode="cover"
        />
        <View style={styles.heroOverlay} />
        <View style={[styles.heroContent, { direction: isRTL ? "rtl" : "ltr" }]}>
          <Text style={styles.heroTitle}>{t("welcomeTitle")}</Text>
          <Text style={styles.heroSub}>{t("welcomeSubtitle")}</Text>
          <View style={styles.heroActions}>
            <TouchableOpacity style={styles.heroBtn} onPress={handleWhatsApp} activeOpacity={0.8}>
              <Feather name="message-circle" size={16} color="#1B3A6B" />
              <Text style={styles.heroBtnText}>{t("whatsapp")}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.heroOutlineBtn} onPress={handleCall} activeOpacity={0.8}>
              <Feather name="phone" size={16} color="#FFFFFF" />
              <Text style={styles.heroOutlineBtnText}>{t("callUs")}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Stats */}
      <View style={styles.statsRow}>
        <StatCard value="10+" label={t("yearsExp")} color={colors.light.primary} />
        <StatCard value="500+" label={t("clients")} color="#C9A847" />
        <StatCard value="2000+" label={t("projects")} color="#1B7A5A" />
      </View>

      {/* Tools Banner Row */}
      <View style={styles.toolsRow}>
        <TouchableOpacity
          style={[styles.toolBanner, { backgroundColor: "#1B3A6B" }]}
          onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium); router.push("/box-calculator"); }}
          activeOpacity={0.88}
        >
          <View style={[styles.toolIconBox, { backgroundColor: "rgba(201,168,71,0.2)" }]}>
            <Feather name="box" size={20} color="#C9A847" />
          </View>
          <Text style={styles.toolBannerTitle}>{t("boxCalculatorTitle")}</Text>
          <Text style={styles.toolBannerSub}>{t("boxCalculatorSub")}</Text>
          <Feather name="chevron-right" size={14} color="rgba(255,255,255,0.5)" style={{ alignSelf: "flex-end" }} />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.toolBanner, { backgroundColor: "#7B1E3C" }]}
          onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium); router.push("/book-printing"); }}
          activeOpacity={0.88}
        >
          <View style={[styles.toolIconBox, { backgroundColor: "rgba(255,255,255,0.15)" }]}>
            <Feather name="book-open" size={20} color="#FFF" />
          </View>
          <Text style={styles.toolBannerTitle}>{t("bookPrintingTitle")}</Text>
          <Text style={styles.toolBannerSub}>{t("bookPrintingSub")}</Text>
          <Feather name="chevron-right" size={14} color="rgba(255,255,255,0.5)" style={{ alignSelf: "flex-end" }} />
        </TouchableOpacity>
      </View>

      {/* Marketplace Banner */}
      <TouchableOpacity
        style={styles.marketplaceBanner}
        onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium); router.push("/marketplace"); }}
        activeOpacity={0.88}
      >
        <View style={[styles.mpLeft, isRTL && styles.rowR]}>
          <View style={styles.mpIconBox}>
            <Feather name="shopping-bag" size={24} color="#FF5722" />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.mpTitle}>{t("marketplaceTitle")}</Text>
            <Text style={styles.mpSub}>{t("marketplaceSub")}</Text>
          </View>
        </View>
        <View style={styles.mpArrow}>
          <Feather name={isRTL ? "arrow-left" : "arrow-right"} size={16} color="#FF5722" />
        </View>
      </TouchableOpacity>

      {/* Categories */}
      <View style={styles.section}>
        <View style={[styles.sectionHeader, { flexDirection: isRTL ? "row-reverse" : "row" }]}>
          <Text style={styles.sectionTitle}>{t("featuredCategories")}</Text>
          <TouchableOpacity onPress={() => router.push("/(tabs)/products")} activeOpacity={0.7}>
            <Text style={styles.viewAll}>{t("viewAll")}</Text>
          </TouchableOpacity>
        </View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesScroll}
        >
          {CATEGORIES.map((cat) => (
            <CategoryCard
              key={cat.id}
              category={cat}
              onPress={() => {
                Haptics.selectionAsync();
                router.push({ pathname: "/(tabs)/products", params: { categoryId: cat.id } });
              }}
            />
          ))}
        </ScrollView>
      </View>

      {/* Services */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { textAlign: isRTL ? "right" : "left" }]}>
          {t("ourServices")}
        </Text>
        <View style={styles.servicesList}>
          {serviceKeys.map((key, i) => (
            <ServiceCard
              key={key}
              icon={ICON_SERVICES[i]}
              title={t(key)}
              description={t(serviceDescKeys[i])}
              color={SERVICE_COLORS[i]}
            />
          ))}
        </View>
      </View>

      {/* Quick contact banner */}
      <View style={styles.contactBanner}>
        <Text style={styles.contactBannerTitle}>{t("contactUs")}</Text>
        <View style={styles.contactBannerBtns}>
          <TouchableOpacity style={styles.waBanner} onPress={handleWhatsApp} activeOpacity={0.85}>
            <Feather name="message-circle" size={18} color="#FFFFFF" />
            <Text style={styles.waBannerText}>{t("whatsapp")}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.callBanner} onPress={handleCall} activeOpacity={0.85}>
            <Feather name="phone" size={18} color={colors.light.primary} />
            <Text style={styles.callBannerText}>{t("callUs")}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.light.background,
  },
  content: {},
  hero: {
    backgroundColor: colors.light.primary,
    minHeight: 260,
    paddingHorizontal: 20,
    paddingBottom: 28,
    overflow: "hidden",
  },
  heroBg: {
    ...StyleSheet.absoluteFillObject,
    width: "100%",
    height: "100%",
    opacity: 0.35,
  },
  heroOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: colors.light.navyDark,
    opacity: 0.55,
  },
  heroContent: {
    position: "relative",
  },
  heroTitle: {
    fontSize: 32,
    fontFamily: "Inter_700Bold",
    color: "#FFFFFF",
    marginBottom: 6,
  },
  heroSub: {
    fontSize: 14,
    fontFamily: "Inter_400Regular",
    color: "rgba(255,255,255,0.85)",
    lineHeight: 22,
    marginBottom: 20,
    maxWidth: 280,
  },
  heroActions: {
    flexDirection: "row",
    gap: 10,
  },
  heroBtn: {
    backgroundColor: colors.light.secondary,
    borderRadius: 22,
    paddingHorizontal: 16,
    paddingVertical: 10,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  heroBtnText: {
    fontSize: 14,
    fontFamily: "Inter_600SemiBold",
    color: colors.light.primary,
  },
  heroOutlineBtn: {
    borderWidth: 1.5,
    borderColor: "rgba(255,255,255,0.6)",
    borderRadius: 22,
    paddingHorizontal: 16,
    paddingVertical: 10,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  heroOutlineBtnText: {
    fontSize: 14,
    fontFamily: "Inter_600SemiBold",
    color: "#FFFFFF",
  },
  statsRow: {
    flexDirection: "row",
    marginHorizontal: 12,
    marginTop: 16,
    marginBottom: 4,
  },
  section: {
    marginTop: 20,
    paddingHorizontal: 16,
  },
  sectionHeader: {
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: "Inter_700Bold",
    color: colors.light.text,
  },
  viewAll: {
    fontSize: 13,
    fontFamily: "Inter_500Medium",
    color: colors.light.secondary,
  },
  categoriesScroll: {
    paddingVertical: 4,
    paddingRight: 16,
  },
  servicesList: {
    marginTop: 8,
  },
  contactBanner: {
    margin: 16,
    backgroundColor: colors.light.primary,
    borderRadius: colors.radius + 4,
    padding: 20,
    alignItems: "center",
  },
  contactBannerTitle: {
    fontSize: 18,
    fontFamily: "Inter_700Bold",
    color: "#FFFFFF",
    marginBottom: 14,
  },
  toolsRow: {
    flexDirection: "row",
    gap: 10,
    marginHorizontal: 16,
    marginBottom: 16,
  },
  toolBanner: {
    flex: 1,
    borderRadius: 14,
    padding: 14,
    gap: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
  },
  toolIconBox: {
    width: 38, height: 38, borderRadius: 10,
    alignItems: "center", justifyContent: "center",
    marginBottom: 2,
  },
  toolBannerTitle: { fontSize: 12, fontFamily: "Inter_700Bold", color: "#FFF", lineHeight: 16 },
  toolBannerSub: { fontSize: 10, color: "rgba(255,255,255,0.6)", fontFamily: "Inter_400Regular", lineHeight: 14 },

  marketplaceBanner: {
    marginHorizontal: 16, marginBottom: 16,
    backgroundColor: "#FFF", borderRadius: 14, padding: 14,
    flexDirection: "row", alignItems: "center", justifyContent: "space-between",
    borderWidth: 1.5, borderColor: "#FF572225",
    shadowColor: "#FF5722", shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1, shadowRadius: 8, elevation: 3,
  },
  mpLeft: { flexDirection: "row", alignItems: "center", gap: 12, flex: 1 },
  mpIconBox: {
    width: 46, height: 46, borderRadius: 12,
    backgroundColor: "#FF572215", alignItems: "center", justifyContent: "center",
  },
  mpTitle: { fontSize: 14, fontFamily: "Inter_700Bold", color: "#1B3A6B", marginBottom: 2 },
  mpSub: { fontSize: 11, color: "#888", fontFamily: "Inter_400Regular" },
  mpArrow: {
    width: 32, height: 32, borderRadius: 8,
    backgroundColor: "#FF572210", alignItems: "center", justifyContent: "center",
  },
  rowR: { flexDirection: "row-reverse" },
  contactBannerBtns: {
    flexDirection: "row",
    gap: 12,
    width: "100%",
  },
  waBanner: {
    flex: 1,
    backgroundColor: "#25D366",
    borderRadius: colors.radius,
    paddingVertical: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  waBannerText: {
    fontSize: 14,
    fontFamily: "Inter_600SemiBold",
    color: "#FFFFFF",
  },
  callBanner: {
    flex: 1,
    backgroundColor: colors.light.secondary,
    borderRadius: colors.radius,
    paddingVertical: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  callBannerText: {
    fontSize: 14,
    fontFamily: "Inter_600SemiBold",
    color: colors.light.primary,
  },
});
