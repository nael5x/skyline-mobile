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

export default function RegisterScreen() {
  const { t, isRTL, language } = useLanguage();
  const { register } = useAuth();
  const insets = useSafeAreaInsets();
  
  // دالة وسيطة لإسكات تحذيرات TypeScript
  const translate = (key: string) => t(key as any);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const topPad = Platform.OS === "web" ? 16 : insets.top + 16;

  const handleRegister = async () => {
    if (!name.trim() || !email.trim() || !phone.trim() || !password.trim()) {
      showAlert("تنبيه", translate("fillAllFields") || "الرجاء تعبئة جميع الحقول");
      return;
    }
    if (password !== confirmPassword) {
      showAlert("تنبيه", translate("passwordMismatch") || "كلمات المرور غير متطابقة");
      return;
    }
    if (password.length < 6) {
      showAlert("تنبيه", translate("passwordTooShort") || "يجب أن تكون كلمة المرور 6 أحرف على الأقل");
      return;
    }
    
    setLoading(true);
    try {
      await register(email.trim(), password, name.trim(), phone.trim(), language);
      router.replace("/(tabs)");
    } catch (error: any) {
      let msg = "فشل إنشاء الحساب";
      if (error.code === "auth/email-already-in-use") msg = "هذا البريد مستخدم بالفعل";
      else if (error.code === "auth/weak-password") msg = "كلمة المرور ضعيفة جداً";
      else if (error.code === "auth/invalid-email") msg = "البريد الإلكتروني غير صحيح";
      
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
            <Feather name="user-plus" size={32} color="#FFF" />
          </View>
          <Text style={styles.title}>{translate("createAccount") || "إنشاء حساب"}</Text>
          <Text style={styles.subtitle}>{translate("registerSubtitle") || "أنشئ حسابك للبدء بالطلب"}</Text>
        </View>

        <View style={styles.form}>
          <View style={styles.inputWrap}>
            <Feather name="user" size={18} color={colors.light.mutedForeground} />
            <TextInput style={[styles.input, { textAlign: isRTL ? "right" : "left" }]} placeholder={translate("fullName") || "الاسم الكامل"} placeholderTextColor={colors.light.mutedForeground} value={name} onChangeText={setName} />
          </View>

          <View style={styles.inputWrap}>
            <Feather name="mail" size={18} color={colors.light.mutedForeground} />
            <TextInput style={[styles.input, { textAlign: isRTL ? "right" : "left" }]} placeholder={translate("email") || "البريد الإلكتروني"} placeholderTextColor={colors.light.mutedForeground} keyboardType="email-address" autoCapitalize="none" value={email} onChangeText={setEmail} />
          </View>

          <View style={styles.inputWrap}>
            <Feather name="phone" size={18} color={colors.light.mutedForeground} />
            <TextInput style={[styles.input, { textAlign: isRTL ? "right" : "left" }]} placeholder={translate("phone") || "رقم الهاتف"} placeholderTextColor={colors.light.mutedForeground} keyboardType="phone-pad" value={phone} onChangeText={setPhone} />
          </View>

          <View style={styles.inputWrap}>
            <Feather name="lock" size={18} color={colors.light.mutedForeground} />
            <TextInput style={[styles.input, { textAlign: isRTL ? "right" : "left" }]} placeholder={translate("password") || "كلمة المرور"} placeholderTextColor={colors.light.mutedForeground} secureTextEntry value={password} onChangeText={setPassword} />
          </View>

          <View style={styles.inputWrap}>
            <Feather name="lock" size={18} color={colors.light.mutedForeground} />
            <TextInput style={[styles.input, { textAlign: isRTL ? "right" : "left" }]} placeholder={translate("confirmPassword") || "تأكيد كلمة المرور"} placeholderTextColor={colors.light.mutedForeground} secureTextEntry value={confirmPassword} onChangeText={setConfirmPassword} />
          </View>

          <TouchableOpacity style={[styles.registerBtn, loading && { opacity: 0.7 }]} onPress={handleRegister} disabled={loading}>
            {loading ? <ActivityIndicator color="#FFF" /> : <Text style={styles.registerBtnText}>{translate("createAccount") || "إنشاء حساب"}</Text>}
          </TouchableOpacity>

          <View style={styles.loginRow}>
            <Text style={styles.loginText}>{translate("haveAccount") || "لديك حساب بالفعل؟"}</Text>
            <TouchableOpacity onPress={() => router.push("/auth/login")}>
              <Text style={styles.loginLink}>{" "}{translate("login") || "تسجيل الدخول"}</Text>
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
  header: { alignItems: "center", marginBottom: 24 },
  iconWrap: { width: 64, height: 64, borderRadius: 32, backgroundColor: colors.light.primary, alignItems: "center", justifyContent: "center", marginBottom: 16 },
  title: { fontSize: 24, fontFamily: "Inter_700Bold", color: colors.light.text, marginBottom: 8 },
  subtitle: { fontSize: 14, fontFamily: "Inter_400Regular", color: colors.light.mutedForeground },
  form: { paddingHorizontal: 24 },
  inputWrap: { flexDirection: "row", alignItems: "center", backgroundColor: colors.light.card, borderRadius: 12, paddingHorizontal: 14, height: 52, borderWidth: 1, borderColor: colors.light.border, marginBottom: 14, gap: 10 },
  input: { flex: 1, fontSize: 15, fontFamily: "Inter_400Regular", color: colors.light.text },
  registerBtn: { backgroundColor: colors.light.primary, borderRadius: 12, height: 52, alignItems: "center", justifyContent: "center", marginTop: 8, marginBottom: 20 },
  registerBtnText: { fontSize: 16, fontFamily: "Inter_600SemiBold", color: "#FFF" },
  loginRow: { flexDirection: "row", justifyContent: "center", alignItems: "center" },
  loginText: { fontSize: 14, fontFamily: "Inter_400Regular", color: colors.light.mutedForeground },
  loginLink: { fontSize: 14, fontFamily: "Inter_600SemiBold", color: colors.light.primary },
});