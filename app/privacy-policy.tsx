import React from "react";
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform,
} from "react-native";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { useLanguage } from "../context/LanguageContext";

const PRIVACY_AR = `
آخر تحديث: أبريل 2026

مقدمة
تلتزم Skyline Group بحماية خصوصيتكم. توضح هذه السياسة كيفية جمع معلوماتكم واستخدامها وحمايتها.

المعلومات التي نجمعها
- المعلومات التي تقدمونها طوعاً عند إرسال الطلبات: الاسم، رقم الهاتف، المدينة.
- بيانات الاستخدام الموجودة محلياً على جهازكم (السلة، الطلبات السابقة) باستخدام AsyncStorage.
- لا نجمع أي بيانات على خوادمنا.

كيف نستخدم المعلومات
- لمعالجة طلباتكم والتواصل معكم عبر واتساب.
- لتحسين تجربة استخدام التطبيق.
- لا نشارك معلوماتكم مع أي طرف ثالث.

تخزين البيانات
جميع بياناتكم تُخزَّن محلياً على جهازكم فقط. لا يتم إرسالها إلى أي خادم خارجي. يمكنكم حذف هذه البيانات في أي وقت عن طريق حذف التطبيق.

أذونات التطبيق
يطلب التطبيق الإذن بفتح تطبيق واتساب وإجراء المكالمات فقط عند الضغط على الأزرار المخصصة لذلك.

التواصل معنا
إذا كان لديكم أي استفسار حول سياسة الخصوصية، يرجى التواصل معنا:
البريد الإلكتروني: info@skylinegroup-sy.com
`;

const PRIVACY_EN = `
Last Updated: April 2026

Introduction
Skyline Group is committed to protecting your privacy. This policy explains how we collect, use, and protect your information.

Information We Collect
- Information you voluntarily provide when placing orders: name, phone number, city.
- Usage data stored locally on your device (cart, order history) using AsyncStorage.
- We do not collect any data on our servers.

How We Use Information
- To process your orders and communicate with you via WhatsApp.
- To improve the app experience.
- We do not share your information with any third parties.

Data Storage
All your data is stored locally on your device only. It is not sent to any external server. You can delete this data at any time by uninstalling the app.

App Permissions
The app only requests permission to open WhatsApp and make phone calls when you tap the designated buttons.

Contact Us
If you have any questions about this privacy policy, please contact us:
Email: info@skylinegroup-sy.com
`;

const PRIVACY_TR = `
Son Güncelleme: Nisan 2026

Giriş
Skyline Group gizliliğinizi korumaya kararlıdır. Bu politika, bilgilerinizin nasıl toplandığını, kullanıldığını ve korunduğunu açıklamaktadır.

Topladığımız Bilgiler
- Sipariş verirken gönüllü olarak sağladığınız bilgiler: ad, telefon numarası, şehir.
- AsyncStorage kullanılarak cihazınızda yerel olarak depolanan kullanım verileri (sepet, sipariş geçmişi).
- Sunucularımızda herhangi bir veri toplamıyoruz.

Bilgileri Nasıl Kullanıyoruz
- Siparişlerinizi işlemek ve WhatsApp üzerinden sizinle iletişim kurmak için.
- Uygulama deneyimini iyileştirmek için.
- Bilgilerinizi üçüncü taraflarla paylaşmıyoruz.

Veri Depolama
Tüm verileriniz yalnızca cihazınızda yerel olarak saklanır. Harici herhangi bir sunucuya gönderilmez. Uygulamayı kaldırarak bu verileri istediğiniz zaman silebilirsiniz.

Uygulama İzinleri
Uygulama, yalnızca ilgili düğmelere bastığınızda WhatsApp'ı açmak ve telefon görüşmesi yapmak için izin ister.

Bize Ulaşın
Bu gizlilik politikası hakkında sorularınız varsa lütfen bizimle iletişime geçin:
E-posta: info@skylinegroup-sy.com
`;

export default function PrivacyPolicyScreen() {
  const { t, language } = useLanguage();
  const insets = useSafeAreaInsets();
  const isRTL = language === "ar";
  const topPad = Platform.OS === "web" ? 16 : insets.top;

  const text = language === "ar" ? PRIVACY_AR : language === "tr" ? PRIVACY_TR : PRIVACY_EN;

  return (
    <View style={[styles.container, { paddingTop: topPad }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Feather name={isRTL ? "arrow-right" : "arrow-left"} size={22} color="#1B3A6B" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t("privacyPolicy")}</Text>
        <View style={{ width: 38 }} />
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
        <View style={[styles.iconRow]}>
          <View style={styles.iconBox}>
            <Feather name="shield" size={40} color="#1B3A6B" />
          </View>
        </View>
        {text.trim().split("\n\n").map((section, idx) => {
          const lines = section.split("\n");
          const isHeading = lines[0] && !lines[0].startsWith("-") && lines.length > 1;
          return (
            <View key={idx} style={styles.section}>
              {isHeading ? (
                <>
                  <Text style={[styles.sectionTitle, isRTL && styles.rtl]}>{lines[0]}</Text>
                  {lines.slice(1).map((line, li) => (
                    <Text key={li} style={[styles.body, isRTL && styles.rtl]}>{line}</Text>
                  ))}
                </>
              ) : (
                lines.map((line, li) => (
                  <Text key={li} style={[styles.body, isRTL && styles.rtl]}>{line}</Text>
                ))
              )}
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F5F7FA" },
  header: {
    flexDirection: "row", alignItems: "center", justifyContent: "space-between",
    paddingHorizontal: 16, paddingVertical: 14, backgroundColor: "#fff",
    borderBottomWidth: 1, borderBottomColor: "#EEE",
  },
  backBtn: { padding: 8, borderRadius: 8 },
  headerTitle: { fontSize: 17, fontWeight: "700", color: "#1B3A6B" },
  scroll: { flex: 1 },
  content: { padding: 20, paddingBottom: 48 },
  iconRow: { alignItems: "center", marginBottom: 24 },
  iconBox: {
    width: 80, height: 80, borderRadius: 40, backgroundColor: "#EBF0FA",
    alignItems: "center", justifyContent: "center",
  },
  section: { marginBottom: 20 },
  sectionTitle: {
    fontSize: 16, fontWeight: "700", color: "#1B3A6B",
    marginBottom: 8,
  },
  body: { fontSize: 14, color: "#444", lineHeight: 22 },
  rtl: { textAlign: "right" },
});
