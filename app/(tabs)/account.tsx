import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import {
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
import { showAlert } from "@/utils/alert";

export default function AccountScreen() {
  const { t, isRTL, language, setLanguage } = useLanguage();
  const { user, logout, loading, isAdmin } = useAuth();
  const insets = useSafeAreaInsets();
  const topPad = Platform.OS === "web" ? 16 : insets.top + 16;

  const translate = (key: string) => t(key as any);

  // دالة مساعدة قوية للترجمة اليدوية تتجاوز القاموس المفقود
  const getManualTranslation = (key: string) => {
    if (key === 'logout') return language === 'ar' ? "تسجيل الخروج" : language === 'tr' ? "Çıkış Yap" : "Logout";
    if (key === 'logoutConfirm') return language === 'ar' ? "هل تريد تسجيل الخروج حقاً؟" : language === 'tr' ? "Çıkış yapmak istediğinize emin misiniz?" : "Are you sure you want to logout?";
    if (key === 'addresses') return language === 'ar' ? "العناوين" : language === 'tr' ? "Adresler" : "Addresses";
    if (key === 'notifications') return language === 'ar' ? "الإشعارات" : language === 'tr' ? "Bildirimler" : "Notifications";
    return translate(key);
  };

  const handleLogout = () => {
    showAlert(
      getManualTranslation('logout'),
      getManualTranslation('logoutConfirm'),
      async () => {
        await logout();
      }
    );
  };

  const MenuItem = ({
    icon,
    label,
    onPress,
    danger,
    rightText,
  }: {
    icon: string;
    label: string;
    onPress: () => void;
    danger?: boolean;
    rightText?: string;
  }) => (
    <TouchableOpacity
      style={[styles.menuItem, { flexDirection: isRTL ? "row-reverse" : "row" }]}
      onPress={onPress}
    >
      <View style={[styles.menuIconWrap, danger && { backgroundColor: "#FEE2E2" }]}>
        <Feather
          name={icon as any}
          size={18}
          color={danger ? colors.light.destructive : colors.light.primary}
        />
      </View>
      <Text
        style={[
          styles.menuLabel,
          danger && { color: colors.light.destructive },
          { textAlign: isRTL ? "right" : "left", flex: 1 },
        ]}
      >
        {label}
      </Text>
      {rightText && (
        <Text style={styles.menuRightText}>{rightText}</Text>
      )}
      <Feather
        name={isRTL ? "chevron-left" : "chevron-right"}
        size={18}
        color={colors.light.mutedForeground}
      />
    </TouchableOpacity>
  );

  if (!user) {
    return (
      <ScrollView
        style={[styles.container, { paddingTop: topPad }]}
        contentContainerStyle={styles.content}
      >
        <Text style={styles.sectionTitle}>
          {translate("settings") || (language === 'ar' ? "الإعدادات" : language === 'tr' ? "Ayarlar" : "Settings")}
        </Text>

        <View style={styles.guestCard}>
          <View style={styles.guestIconWrap}>
            <Feather name="user" size={40} color={colors.light.mutedForeground} />
          </View>
          <Text style={styles.guestTitle}>
            {translate("loginToAccount") || (language === 'ar' ? "سجّل دخولك لتتمكن من متابعة طلباتك" : language === 'tr' ? "Devam etmek için giriş yapın" : "Login to continue")}
          </Text>
          <TouchableOpacity
            style={styles.loginBtn}
            onPress={() => router.push("/auth/login")}
          >
            <Text style={styles.loginBtnText}>
              {translate("login") || (language === 'ar' ? "تسجيل الدخول" : language === 'tr' ? "Giriş Yap" : "Login")}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.push("/auth/register")}>
            <Text style={styles.registerLink}>
              {translate("createAccount") || (language === 'ar' ? "إنشاء حساب جديد" : language === 'tr' ? "Hesap Oluştur" : "Create Account")}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>
            {translate("language") || (language === 'ar' ? "اللغة" : language === 'tr' ? "Dil" : "Language")}
          </Text>
          <View style={styles.langRow}>
            {(["ar", "tr", "en"] as const).map((lang) => (
              <TouchableOpacity
                key={lang}
                style={[
                  styles.langBtn,
                  language === lang && styles.langBtnActive,
                ]}
                onPress={() => setLanguage(lang)}
              >
                <Text
                  style={[
                    styles.langBtnText,
                    language === lang && styles.langBtnTextActive,
                  ]}
                >
                  {lang === "ar" ? "العربية" : lang === "tr" ? "Türkçe" : "English"}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <MenuItem
            icon="file-text"
            label={translate("privacyPolicy") || (language === 'ar' ? "سياسة الخصوصية" : language === 'tr' ? "Gizlilik Politikası" : "Privacy Policy")}
            onPress={() => router.push("/privacy-policy")}
          />
          <MenuItem
            icon="book"
            label={translate("termsOfService") || (language === 'ar' ? "شروط الخدمة" : language === 'tr' ? "Hizmet Şartları" : "Terms of Service")}
            onPress={() => router.push("/terms")}
          />
        </View>

        <Text style={styles.versionText}>
          {translate("appVersion") || (language === 'ar' ? "إصدار التطبيق" : language === 'tr' ? "Uygulama Sürümü" : "App Version")}: 2.0.0
        </Text>
      </ScrollView>
    );
  }

  return (
    <ScrollView
      style={[styles.container, { paddingTop: topPad }]}
      contentContainerStyle={styles.content}
    >
      <Text style={styles.sectionTitle}>
        {translate("settings") || (language === 'ar' ? "الإعدادات" : language === 'tr' ? "Ayarlar" : "Settings")}
      </Text>

      <View style={styles.profileCard}>
        <View style={styles.avatarWrap}>
          <Text style={styles.avatarText}>
            {user.name.charAt(0).toUpperCase()}
          </Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={[styles.profileName, { textAlign: isRTL ? "right" : "left" }]}>
            {user.name}
          </Text>
          <Text style={[styles.profileEmail, { textAlign: isRTL ? "right" : "left" }]}>
            {user.email}
          </Text>
        </View>
      </View>

      {isAdmin && (
        <TouchableOpacity
          style={styles.adminBtn}
          onPress={() => router.push("/admin")}
        >
          <Feather name="shield" size={20} color="#FFF" />
          <Text style={styles.adminBtnText}>Admin Dashboard</Text>
        </TouchableOpacity>
      )}

      <View style={styles.section}>
        <MenuItem
          icon="package"
          label={translate("orderHistory") || (language === 'ar' ? "سجل الطلبات" : language === 'tr' ? "Sipariş Geçmişi" : "Order History")}
          onPress={() => router.push("/order-history")}
        />
        <MenuItem
          icon="map-pin"
          label={getManualTranslation('addresses')}
          onPress={() => {}}
        />
        <MenuItem
          icon="bell"
          label={getManualTranslation('notifications')}
          onPress={() => {}}
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionLabel}>
          {translate("language") || (language === 'ar' ? "اللغة" : language === 'tr' ? "Dil" : "Language")}
        </Text>
        <View style={styles.langRow}>
          {(["ar", "tr", "en"] as const).map((lang) => (
            <TouchableOpacity
              key={lang}
              style={[
                styles.langBtn,
                language === lang && styles.langBtnActive,
              ]}
              onPress={() => setLanguage(lang)}
            >
              <Text
                style={[
                  styles.langBtnText,
                  language === lang && styles.langBtnTextActive,
                ]}
              >
                {lang === "ar" ? "العربية" : lang === "tr" ? "Türkçe" : "English"}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <MenuItem
          icon="file-text"
          label={translate("privacyPolicy") || (language === 'ar' ? "سياسة الخصوصية" : language === 'tr' ? "Gizlilik Politikası" : "Privacy Policy")}
          onPress={() => router.push("/privacy-policy")}
        />
        <MenuItem
          icon="book"
          label={translate("termsOfService") || (language === 'ar' ? "شروط الخدمة" : language === 'tr' ? "Hizmet Şartları" : "Terms of Service")}
          onPress={() => router.push("/terms")}
        />
      </View>

      <View style={styles.section}>
        <MenuItem
          icon="log-out"
          label={getManualTranslation('logout')}
          onPress={handleLogout}
          danger
        />
      </View>

      <Text style={styles.versionText}>
        {translate("appVersion") || (language === 'ar' ? "إصدار التطبيق" : language === 'tr' ? "Uygulama Sürümü" : "App Version")}: 2.0.0
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.light.background },
  content: { paddingBottom: 120, paddingHorizontal: 20 },
  sectionTitle: { fontSize: 22, fontFamily: "Inter_700Bold", color: colors.light.text, marginBottom: 20 },
  guestCard: { backgroundColor: colors.light.card, borderRadius: 16, padding: 24, alignItems: "center", marginBottom: 20, borderWidth: 1, borderColor: colors.light.border },
  guestIconWrap: { width: 80, height: 80, borderRadius: 40, backgroundColor: colors.light.muted, alignItems: "center", justifyContent: "center", marginBottom: 16 },
  guestTitle: { fontSize: 15, fontFamily: "Inter_500Medium", color: colors.light.mutedForeground, textAlign: "center", marginBottom: 20, lineHeight: 22 },
  loginBtn: { backgroundColor: colors.light.primary, borderRadius: 12, paddingVertical: 14, paddingHorizontal: 48, marginBottom: 12 },
  loginBtnText: { fontSize: 16, fontFamily: "Inter_600SemiBold", color: "#FFF" },
  registerLink: { fontSize: 14, fontFamily: "Inter_600SemiBold", color: colors.light.primary },
  profileCard: { flexDirection: "row", alignItems: "center", backgroundColor: colors.light.card, borderRadius: 16, padding: 16, marginBottom: 20, borderWidth: 1, borderColor: colors.light.border, gap: 14 },
  avatarWrap: { width: 52, height: 52, borderRadius: 26, backgroundColor: colors.light.primary, alignItems: "center", justifyContent: "center" },
  avatarText: { fontSize: 22, fontFamily: "Inter_700Bold", color: "#FFF" },
  profileName: { fontSize: 17, fontFamily: "Inter_600SemiBold", color: colors.light.text },
  profileEmail: { fontSize: 13, fontFamily: "Inter_400Regular", color: colors.light.mutedForeground, marginTop: 2 },
  section: { backgroundColor: colors.light.card, borderRadius: 14, marginBottom: 16, borderWidth: 1, borderColor: colors.light.border, overflow: "hidden" },
  sectionLabel: { fontSize: 13, fontFamily: "Inter_600SemiBold", color: colors.light.mutedForeground, paddingHorizontal: 16, paddingTop: 14, paddingBottom: 8 },
  menuItem: { flexDirection: "row", alignItems: "center", padding: 14, paddingHorizontal: 16, gap: 12, borderBottomWidth: 0.5, borderBottomColor: colors.light.border },
  menuIconWrap: { width: 34, height: 34, borderRadius: 10, backgroundColor: `${colors.light.primary}15`, alignItems: "center", justifyContent: "center" },
  menuLabel: { fontSize: 15, fontFamily: "Inter_500Medium", color: colors.light.text },
  menuRightText: { fontSize: 13, fontFamily: "Inter_400Regular", color: colors.light.mutedForeground },
  langRow: { flexDirection: "row", gap: 8, padding: 12, paddingTop: 4 },
  langBtn: { flex: 1, paddingVertical: 10, borderRadius: 10, backgroundColor: colors.light.muted, alignItems: "center" },
  langBtnActive: { backgroundColor: colors.light.primary },
  langBtnText: { fontSize: 13, fontFamily: "Inter_500Medium", color: colors.light.mutedForeground },
  langBtnTextActive: { color: "#FFF" },
  adminBtn: { flexDirection: "row", alignItems: "center", justifyContent: "center", backgroundColor: "#E63946", borderRadius: 14, paddingVertical: 14, marginBottom: 16, gap: 10 },
  adminBtnText: { fontSize: 15, fontFamily: "Inter_600SemiBold", color: "#FFF" },
  versionText: { fontSize: 12, fontFamily: "Inter_400Regular", color: colors.light.mutedForeground, textAlign: "center", marginTop: 8 },
});