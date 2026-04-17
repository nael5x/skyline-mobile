import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import {
  Image,
  Linking,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import colors from "@/constants/colors";
import { APP_VERSION, CONTACT_INFO } from "@/constants/data";
import { useLanguage } from "@/context/LanguageContext";
import { LanguageSelector } from "@/components/LanguageSelector";

export default function AboutScreen() {
  const { t, isRTL, language } = useLanguage();
  const insets = useSafeAreaInsets();
  const [showLangSelector, setShowLangSelector] = React.useState(false);

  const topPad = Platform.OS === "web" ? 16 : insets.top;
  const textAlign = isRTL ? "right" : "left";

  const SETTINGS_ITEMS = [
    {
      icon: "globe",
      label: t("language"),
      value: language === "ar" ? "العربية" : language === "tr" ? "Türkçe" : "English",
      action: () => setShowLangSelector(true),
      color: "#1B3A6B",
    },
    {
      icon: "clock",
      label: t("orderHistory"),
      value: "",
      action: () => router.push("/order-history"),
      color: "#C9A847",
    },
  ];

  const LEGAL_ITEMS = [
    {
      icon: "shield",
      label: t("privacyPolicy"),
      action: () => router.push("/privacy-policy"),
      color: "#1B7A5A",
    },
    {
      icon: "file-text",
      label: t("termsOfService"),
      action: () => router.push("/terms"),
      color: "#5C3D82",
    },
    {
      icon: "globe",
      label: language === "ar" ? "زوروا موقعنا" : language === "tr" ? "Web Sitemizi Ziyaret Edin" : "Visit Our Website",
      action: () => Linking.openURL(CONTACT_INFO.website),
      color: "#1B3A6B",
    },
  ];

  return (
    <>
      <ScrollView
        style={[styles.container, { paddingTop: topPad }]}
        contentContainerStyle={[styles.content, { paddingBottom: Math.max(insets.bottom, 34) + 80 }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Header brand card */}
        <View style={styles.brandCard}>
          <View style={styles.logoWrap}>
            <Image
              source={require("@/assets/images/icon.png")}
              style={styles.logo}
              resizeMode="cover"
            />
          </View>
          <Text style={styles.brandName}>Skyline Group</Text>
          <Text style={styles.brandTagline}>Professional Printing Solutions</Text>
        </View>

        {/* About text */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { textAlign }]}>{t("aboutTitle")}</Text>
          <Text style={[styles.body, { textAlign }]}>{t("aboutDesc")}</Text>
        </View>

        {/* Stats */}
        <View style={styles.statsGrid}>
          {[
            { value: "10+", label: t("yearsExp"), color: colors.light.primary },
            { value: "500+", label: t("clients"), color: "#C9A847" },
            { value: "2000+", label: t("projects"), color: "#1B7A5A" },
            { value: "100%", label: t("quality"), color: "#5C3D82" },
          ].map((s, i) => (
            <View key={i} style={styles.statCell}>
              <Text style={[styles.statValue, { color: s.color }]}>{s.value}</Text>
              <Text style={styles.statLabel}>{s.label}</Text>
            </View>
          ))}
        </View>

        {/* Mission */}
        <View style={styles.infoCard}>
          <View style={styles.infoIconWrap}>
            <Feather name="target" size={22} color={colors.light.primary} />
          </View>
          <View style={styles.infoBody}>
            <Text style={[styles.infoTitle, { textAlign }]}>{t("ourMission")}</Text>
            <Text style={[styles.infoText, { textAlign }]}>{t("missionDesc")}</Text>
          </View>
        </View>

        {/* Vision */}
        <View style={styles.infoCard}>
          <View style={[styles.infoIconWrap, { backgroundColor: "#C9A84715" }]}>
            <Feather name="eye" size={22} color="#C9A847" />
          </View>
          <View style={styles.infoBody}>
            <Text style={[styles.infoTitle, { textAlign }]}>{t("ourVision")}</Text>
            <Text style={[styles.infoText, { textAlign }]}>{t("visionDesc")}</Text>
          </View>
        </View>

        {/* Settings section */}
        <Text style={[styles.groupLabel, { textAlign }]}>{t("settings")}</Text>
        <View style={styles.menuCard}>
          {SETTINGS_ITEMS.map((item, i) => (
            <TouchableOpacity
              key={i}
              style={[
                styles.menuRow,
                { flexDirection: isRTL ? "row-reverse" : "row" },
                i < SETTINGS_ITEMS.length - 1 && styles.menuBorder,
              ]}
              onPress={item.action}
              activeOpacity={0.7}
            >
              <View style={[styles.menuIcon, { backgroundColor: item.color + "18" }]}>
                <Feather name={item.icon as any} size={18} color={item.color} />
              </View>
              <Text style={[styles.menuLabel, { flex: 1, marginLeft: isRTL ? 0 : 12, marginRight: isRTL ? 12 : 0, textAlign }]}>
                {item.label}
              </Text>
              {item.value ? (
                <Text style={styles.menuValue}>{item.value}</Text>
              ) : null}
              <Feather name={isRTL ? "chevron-left" : "chevron-right"} size={16} color="#CCC" />
            </TouchableOpacity>
          ))}
        </View>

        {/* Legal section */}
        <Text style={[styles.groupLabel, { textAlign }]}>{t("legalInfo")}</Text>
        <View style={styles.menuCard}>
          {LEGAL_ITEMS.map((item, i) => (
            <TouchableOpacity
              key={i}
              style={[
                styles.menuRow,
                { flexDirection: isRTL ? "row-reverse" : "row" },
                i < LEGAL_ITEMS.length - 1 && styles.menuBorder,
              ]}
              onPress={item.action}
              activeOpacity={0.7}
            >
              <View style={[styles.menuIcon, { backgroundColor: item.color + "18" }]}>
                <Feather name={item.icon as any} size={18} color={item.color} />
              </View>
              <Text style={[styles.menuLabel, { flex: 1, marginLeft: isRTL ? 0 : 12, marginRight: isRTL ? 12 : 0, textAlign }]}>
                {item.label}
              </Text>
              <Feather name={isRTL ? "chevron-left" : "chevron-right"} size={16} color="#CCC" />
            </TouchableOpacity>
          ))}
        </View>

        {/* App version */}
        <View style={styles.versionRow}>
          <Text style={styles.versionText}>Skyline Group App v{APP_VERSION}</Text>
          <Text style={styles.versionSubtext}>© 2026 Skyline Group. All rights reserved.</Text>
        </View>
      </ScrollView>

      <LanguageSelector visible={showLangSelector} onClose={() => setShowLangSelector(false)} />
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.light.background },
  content: { paddingHorizontal: 16 },
  brandCard: {
    alignItems: "center",
    backgroundColor: colors.light.primary,
    borderRadius: colors.radius + 4,
    padding: 28,
    marginBottom: 16,
  },
  logoWrap: {
    width: 80, height: 80, borderRadius: 40, backgroundColor: "#FFFFFF",
    overflow: "hidden", marginBottom: 12,
    shadowColor: "#000", shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15, shadowRadius: 8, elevation: 4,
  },
  logo: { width: 80, height: 80 },
  brandName: { fontSize: 24, fontFamily: "Inter_700Bold", color: "#FFFFFF", marginBottom: 4 },
  brandTagline: { fontSize: 13, fontFamily: "Inter_400Regular", color: "rgba(255,255,255,0.75)" },
  section: { marginBottom: 16 },
  sectionTitle: { fontSize: 18, fontFamily: "Inter_700Bold", color: colors.light.text, marginBottom: 8 },
  body: { fontSize: 14, fontFamily: "Inter_400Regular", color: colors.light.mutedForeground, lineHeight: 22 },
  statsGrid: { flexDirection: "row", flexWrap: "wrap", gap: 10, marginBottom: 16 },
  statCell: {
    width: "47%", backgroundColor: colors.light.card, borderRadius: colors.radius,
    padding: 16, alignItems: "center",
    shadowColor: "#000", shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.06, shadowRadius: 4, elevation: 2,
  },
  statValue: { fontSize: 28, fontFamily: "Inter_700Bold", marginBottom: 4 },
  statLabel: { fontSize: 12, fontFamily: "Inter_400Regular", color: colors.light.mutedForeground, textAlign: "center" },
  infoCard: {
    flexDirection: "row", backgroundColor: colors.light.card, borderRadius: colors.radius,
    padding: 16, marginBottom: 10,
    shadowColor: "#000", shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.06, shadowRadius: 4, elevation: 2,
  },
  infoIconWrap: {
    width: 44, height: 44, borderRadius: 22, backgroundColor: colors.light.primary + "15",
    alignItems: "center", justifyContent: "center", marginRight: 14, flexShrink: 0,
  },
  infoBody: { flex: 1 },
  infoTitle: { fontSize: 15, fontFamily: "Inter_700Bold", color: colors.light.text, marginBottom: 4 },
  infoText: { fontSize: 13, fontFamily: "Inter_400Regular", color: colors.light.mutedForeground, lineHeight: 20 },
  groupLabel: {
    fontSize: 13, fontFamily: "Inter_600SemiBold", color: colors.light.mutedForeground,
    marginTop: 16, marginBottom: 8, textTransform: "uppercase", letterSpacing: 0.5,
  },
  menuCard: {
    backgroundColor: "#fff", borderRadius: 16, marginBottom: 8,
    shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 8, elevation: 3,
    overflow: "hidden",
  },
  menuRow: { alignItems: "center", paddingHorizontal: 16, paddingVertical: 14 },
  menuBorder: { borderBottomWidth: 1, borderBottomColor: "#F0F0F0" },
  menuIcon: { width: 36, height: 36, borderRadius: 10, alignItems: "center", justifyContent: "center" },
  menuLabel: { fontSize: 15, fontFamily: "Inter_500Medium", color: "#1B3A6B" },
  menuValue: { fontSize: 13, color: "#888", marginRight: 8 },
  versionRow: { alignItems: "center", marginTop: 24, marginBottom: 8 },
  versionText: { fontSize: 13, color: "#AAA", fontFamily: "Inter_400Regular" },
  versionSubtext: { fontSize: 11, color: "#CCC", fontFamily: "Inter_400Regular", marginTop: 4 },
});
