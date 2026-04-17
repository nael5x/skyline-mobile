import React from "react";
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform,
} from "react-native";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { useLanguage } from "../context/LanguageContext";

const TERMS_AR = `
آخر تحديث: أبريل 2026

قبول الشروط
باستخدام تطبيق Skyline Group، فإنكم توافقون على هذه الشروط والأحكام. إذا كنتم لا توافقون، يرجى عدم استخدام التطبيق.

وصف الخدمة
يوفر التطبيق كتالوجاً لمنتجات الطباعة ويتيح للمستخدمين إرسال طلبات عروض الأسعار عبر واتساب. لا يُجري التطبيق معاملات مالية مباشرة.

الطلبات والأسعار
- جميع الطلبات المُرسلة عبر التطبيق هي طلبات أسعار وليست عقوداً ملزمة.
- سيتواصل فريقنا لتأكيد الطلب وتحديد السعر النهائي.
- الأسعار تختلف حسب الكمية والمواصفات والمواد المطلوبة.
- يحق للشركة رفض أي طلب دون إبداء الأسباب.

الملكية الفكرية
جميع المحتويات الموجودة في التطبيق (شعار الشركة، الصور، النصوص) هي ملكية حصرية لـ Skyline Group ومحمية بموجب قوانين الملكية الفكرية.

إخلاء المسؤولية
- لا تضمن الشركة دقة جميع المعلومات الواردة في التطبيق في كل الأوقات.
- لا تتحمل الشركة أي مسؤولية عن أي أضرار ناتجة عن استخدام التطبيق.

التعديلات
تحتفظ Skyline Group بالحق في تعديل هذه الشروط في أي وقت. سيتم إخطار المستخدمين بالتغييرات الجوهرية.

القانون الحاكم
تخضع هذه الشروط لقوانين الجمهورية العربية السورية.

التواصل
info@skylinegroup-sy.com
`;

const TERMS_EN = `
Last Updated: April 2026

Acceptance of Terms
By using the Skyline Group app, you agree to these terms and conditions. If you disagree, please do not use the app.

Service Description
The app provides a printing product catalog and allows users to send price quote requests via WhatsApp. The app does not conduct direct financial transactions.

Orders and Pricing
- All orders sent through the app are quote requests and not binding contracts.
- Our team will contact you to confirm the order and determine the final price.
- Prices vary depending on quantity, specifications, and required materials.
- The company reserves the right to refuse any order without giving reasons.

Intellectual Property
All content in the app (company logo, images, text) is the exclusive property of Skyline Group and is protected under intellectual property laws.

Disclaimer
- The company does not guarantee the accuracy of all information in the app at all times.
- The company bears no responsibility for any damages resulting from using the app.

Modifications
Skyline Group reserves the right to modify these terms at any time. Users will be notified of significant changes.

Governing Law
These terms are governed by the laws of the Syrian Arab Republic.

Contact
info@skylinegroup-sy.com
`;

const TERMS_TR = `
Son Güncelleme: Nisan 2026

Şartların Kabulü
Skyline Group uygulamasını kullanarak bu hüküm ve koşulları kabul etmiş olursunuz. Kabul etmiyorsanız lütfen uygulamayı kullanmayın.

Hizmet Açıklaması
Uygulama, baskı ürün kataloğu sağlar ve kullanıcıların WhatsApp üzerinden fiyat teklifi gönderebilmesine olanak tanır. Uygulama doğrudan finansal işlem gerçekleştirmez.

Siparişler ve Fiyatlandırma
- Uygulama üzerinden gönderilen tüm siparişler fiyat teklifi talepleridir ve bağlayıcı sözleşmeler değildir.
- Ekibimiz siparişi onaylamak ve nihai fiyatı belirlemek için sizinle iletişime geçecektir.
- Fiyatlar miktar, özellikler ve gerekli malzemelere göre değişir.
- Şirket, herhangi bir siparişi sebep göstermeksizin reddetme hakkını saklı tutar.

Fikri Mülkiyet
Uygulamadaki tüm içerikler (şirket logosu, görseller, metinler) Skyline Group'un özel mülkiyetindedir ve fikri mülkiyet yasaları kapsamında korunmaktadır.

Sorumluluk Reddi
- Şirket, uygulamadaki tüm bilgilerin her zaman doğruluğunu garanti etmez.
- Şirket, uygulamanın kullanımından kaynaklanan herhangi bir zarardan sorumlu tutulamaz.

Değişiklikler
Skyline Group bu şartları istediği zaman değiştirme hakkını saklı tutar. Kullanıcılar önemli değişiklikler hakkında bilgilendirilecektir.

Yürürlükteki Hukuk
Bu şartlar Suriye Arap Cumhuriyeti yasalarına tabidir.

İletişim
info@skylinegroup-sy.com
`;

export default function TermsScreen() {
  const { t, language } = useLanguage();
  const insets = useSafeAreaInsets();
  const isRTL = language === "ar";
  const topPad = Platform.OS === "web" ? 16 : insets.top;

  const text = language === "ar" ? TERMS_AR : language === "tr" ? TERMS_TR : TERMS_EN;

  return (
    <View style={[styles.container, { paddingTop: topPad }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Feather name={isRTL ? "arrow-right" : "arrow-left"} size={22} color="#1B3A6B" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t("termsOfService")}</Text>
        <View style={{ width: 38 }} />
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
        <View style={styles.iconRow}>
          <View style={styles.iconBox}>
            <Feather name="file-text" size={40} color="#1B3A6B" />
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
  sectionTitle: { fontSize: 16, fontWeight: "700", color: "#1B3A6B", marginBottom: 8 },
  body: { fontSize: 14, color: "#444", lineHeight: 22 },
  rtl: { textAlign: "right" },
});
