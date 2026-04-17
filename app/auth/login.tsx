import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import {
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
import { showAlert } from "@/utils/alert";

export default function LoginScreen() {
  const { t, isRTL } = useLanguage();
  const { login } = useAuth();
  const insets = useSafeAreaInsets();
  
  // دالة وسيطة لإسكات تحذيرات TypeScript
  const translate = (key: string) => t(key as any);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const topPad = Platform.OS === "web" ? 16 : insets.top + 16;

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      showAlert("تنبيه", translate("fillAllFields") || "الرجاء تعبئة جميع الحقول");
      return;
    }
    setLoading(true);
    try {
      await login(email.trim(), password);
      router.replace("/(tabs)");
    } catch (error: any) {
      let msg = "فشل تسجيل الدخول";
      if (error.code === "auth/user-not-found") msg = "هذا الحساب غير موجود";
      else if (error.code === "auth/wrong-password") msg = "كلمة المرور خاطئة";
      else if (error.code === "auth/invalid-email") msg = "صيغة البريد الإلكتروني غير صحيحة";
      
      showAlert("خطأ", msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : undefined}>
      <ScrollView style={[styles.container, { paddingTop: topPad }]} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Feather name={isRTL ? "arrow-right" : "arrow-left"} size={24} color={colors.light.text} />
        </TouchableOpacity>

        <View style={styles.header}>
          <View style={styles.iconWrap}>
            <Feather name="log-in" size={32} color="#FFF" />
          </View>
          <Text style={styles.title}>{translate("login") || "تسجيل الدخول"}</Text>
          <Text style={styles.subtitle}>{translate("loginSubtitle") || "سجّل دخولك لمتابعة طلباتك"}</Text>
        </View>

        <View style={styles.form}>
          <View style={styles.inputWrap}>
            <Feather name="mail" size={18} color={colors.light.mutedForeground} />
            <TextInput style={[styles.input, { textAlign: isRTL ? "right" : "left" }]} placeholder={translate("email") || "البريد الإلكتروني"} placeholderTextColor={colors.light.mutedForeground} keyboardType="email-address" autoCapitalize="none" value={email} onChangeText={setEmail} />
          </View>

          <View style={styles.inputWrap}>
            <Feather name="lock" size={18} color={colors.light.mutedForeground} />
            <TextInput style={[styles.input, { textAlign: isRTL ? "right" : "left" }]} placeholder={translate("password") || "كلمة المرور"} placeholderTextColor={colors.light.mutedForeground} secureTextEntry={!showPassword} value={password} onChangeText={setPassword} />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
              <Feather name={showPassword ? "eye-off" : "eye"} size={18} color={colors.light.mutedForeground} />
            </TouchableOpacity>
          </View>

          <TouchableOpacity onPress={() => router.push("/auth/forgot-password")}>
            <Text style={styles.forgotText}>{translate("forgotPassword") || "نسيت كلمة المرور؟"}</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.loginBtn, loading && { opacity: 0.7 }]} onPress={handleLogin} disabled={loading}>
            {loading ? <ActivityIndicator color="#FFF" /> : <Text style={styles.loginBtnText}>{translate("login") || "تسجيل الدخول"}</Text>}
          </TouchableOpacity>

          <View style={styles.registerRow}>
            <Text style={styles.registerText}>{translate("noAccount") || "ليس لديك حساب؟"}</Text>
            <TouchableOpacity onPress={() => router.push("/auth/register")}>
              <Text style={styles.registerLink}>{" "}{translate("createAccount") || "إنشاء حساب"}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.light.background },
  content: { paddingBottom: 40 },
  backBtn: { marginLeft: 16, marginBottom: 16, width: 40 },
  header: { alignItems: "center", marginBottom: 32 },
  iconWrap: { width: 64, height: 64, borderRadius: 32, backgroundColor: colors.light.primary, alignItems: "center", justifyContent: "center", marginBottom: 16 },
  title: { fontSize: 24, fontFamily: "Inter_700Bold", color: colors.light.text, marginBottom: 8 },
  subtitle: { fontSize: 14, fontFamily: "Inter_400Regular", color: colors.light.mutedForeground },
  form: { paddingHorizontal: 24 },
  inputWrap: { flexDirection: "row", alignItems: "center", backgroundColor: colors.light.card, borderRadius: 12, paddingHorizontal: 14, height: 52, borderWidth: 1, borderColor: colors.light.border, marginBottom: 14, gap: 10 },
  input: { flex: 1, fontSize: 15, fontFamily: "Inter_400Regular", color: colors.light.text },
  forgotText: { fontSize: 13, fontFamily: "Inter_500Medium", color: colors.light.primary, textAlign: "right", marginBottom: 24 },
  loginBtn: { backgroundColor: colors.light.primary, borderRadius: 12, height: 52, alignItems: "center", justifyContent: "center", marginBottom: 20 },
  loginBtnText: { fontSize: 16, fontFamily: "Inter_600SemiBold", color: "#FFF" },
  registerRow: { flexDirection: "row", justifyContent: "center", alignItems: "center" },
  registerText: { fontSize: 14, fontFamily: "Inter_400Regular", color: colors.light.mutedForeground },
  registerLink: { fontSize: 14, fontFamily: "Inter_600SemiBold", color: colors.light.primary },
});