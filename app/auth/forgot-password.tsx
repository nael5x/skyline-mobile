import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ActivityIndicator,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import colors from "@/constants/colors";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";

export default function ForgotPasswordScreen() {
  const { t, isRTL } = useLanguage();
  const { resetPassword } = useAuth();
  const insets = useSafeAreaInsets();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const topPad = Platform.OS === "web" ? 16 : insets.top + 16;

  const handleReset = async () => {
    if (!email.trim()) {
      Alert.alert("", t("enterEmail") || "Please enter your email");
      return;
    }
    setLoading(true);
    try {
      await resetPassword(email.trim());
      setSent(true);
    } catch (error: any) {
      let msg = "Failed to send reset email";
      if (error.code === "auth/user-not-found") msg = "Email not found";
      Alert.alert("Error", msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        style={[styles.container, { paddingTop: topPad }]}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => router.back()}
        >
          <Feather name={isRTL ? "arrow-right" : "arrow-left"} size={24} color={colors.light.text} />
        </TouchableOpacity>

        <View style={styles.header}>
          <View style={styles.iconWrap}>
            <Feather name={sent ? "check" : "key"} size={32} color="#FFF" />
          </View>
          <Text style={styles.title}>
            {sent
              ? t("emailSent") || "تم الإرسال"
              : t("forgotPassword") || "نسيت كلمة المرور؟"}
          </Text>
          <Text style={styles.subtitle}>
            {sent
              ? t("checkEmail") || "تحقق من بريدك الإلكتروني لإعادة تعيين كلمة المرور"
              : t("forgotSubtitle") || "أدخل بريدك وسنرسل لك رابط لإعادة تعيين كلمة المرور"}
          </Text>
        </View>

        {!sent && (
          <View style={styles.form}>
            <View style={styles.inputWrap}>
              <Feather name="mail" size={18} color={colors.light.mutedForeground} />
              <TextInput
                style={[styles.input, { textAlign: isRTL ? "right" : "left" }]}
                placeholder={t("email") || "البريد الإلكتروني"}
                placeholderTextColor={colors.light.mutedForeground}
                keyboardType="email-address"
                autoCapitalize="none"
                value={email}
                onChangeText={setEmail}
              />
            </View>

            <TouchableOpacity
              style={[styles.resetBtn, loading && { opacity: 0.7 }]}
              onPress={handleReset}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#FFF" />
              ) : (
                <Text style={styles.resetBtnText}>
                  {t("sendResetLink") || "إرسال رابط إعادة التعيين"}
                </Text>
              )}
            </TouchableOpacity>
          </View>
        )}

        {sent && (
          <View style={styles.form}>
            <TouchableOpacity
              style={styles.resetBtn}
              onPress={() => router.push("/auth/login")}
            >
              <Text style={styles.resetBtnText}>
                {t("backToLogin") || "العودة لتسجيل الدخول"}
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.light.background },
  content: { paddingBottom: 40 },
  backBtn: { marginLeft: 16, marginBottom: 16, width: 40 },
  header: { alignItems: "center", marginBottom: 32, paddingHorizontal: 24 },
  iconWrap: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.light.primary,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontFamily: "Inter_700Bold",
    color: colors.light.text,
    marginBottom: 8,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 14,
    fontFamily: "Inter_400Regular",
    color: colors.light.mutedForeground,
    textAlign: "center",
    lineHeight: 22,
  },
  form: { paddingHorizontal: 24 },
  inputWrap: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.light.card,
    borderRadius: 12,
    paddingHorizontal: 14,
    height: 52,
    borderWidth: 1,
    borderColor: colors.light.border,
    marginBottom: 20,
    gap: 10,
  },
  input: {
    flex: 1,
    fontSize: 15,
    fontFamily: "Inter_400Regular",
    color: colors.light.text,
  },
  resetBtn: {
    backgroundColor: colors.light.primary,
    borderRadius: 12,
    height: 52,
    alignItems: "center",
    justifyContent: "center",
  },
  resetBtnText: {
    fontSize: 16,
    fontFamily: "Inter_600SemiBold",
    color: "#FFF",
  },
});
