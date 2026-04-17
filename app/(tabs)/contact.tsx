import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import React, { useState } from "react";
import {
  Alert,
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

import colors from "@/constants/colors";
import { CONTACT_INFO } from "@/constants/data";
import { useLanguage } from "@/context/LanguageContext";

export default function ContactScreen() {
  const { t, isRTL } = useLanguage();
  const insets = useSafeAreaInsets();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);

  const topPad = Platform.OS === "web" ? 16 : insets.top;
  const textAlign = isRTL ? "right" : "left";

  const handleCall = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    Linking.openURL(`tel:${CONTACT_INFO.phone}`);
  };

  const handleWhatsApp = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    Linking.openURL(`https://wa.me/${CONTACT_INFO.whatsapp}`);
  };

  const handleEmail = () => {
    Linking.openURL(`mailto:${CONTACT_INFO.email}`);
  };

  const handleWebsite = () => {
    Linking.openURL(CONTACT_INFO.website);
  };

  const handleSend = () => {
    if (!name.trim() || !email.trim() || !message.trim()) {
      Alert.alert("", t("fillAllFields"));
      return;
    }
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setSending(true);
    setTimeout(() => {
      setSending(false);
      setName("");
      setEmail("");
      setMessage("");
      Alert.alert("", t("messageSent"));
    }, 1200);
  };

  return (
    <ScrollView
      style={[styles.container, { paddingTop: topPad }]}
      contentContainerStyle={[styles.content, { paddingBottom: Math.max(insets.bottom, 34) + 80 }]}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
    >
      {/* Quick contact */}
      <View style={styles.quickRow}>
        <TouchableOpacity style={styles.quickCard} onPress={handleWhatsApp} activeOpacity={0.8}>
          <View style={[styles.quickIcon, { backgroundColor: "#25D36618" }]}>
            <Feather name="message-circle" size={22} color="#25D366" />
          </View>
          <Text style={styles.quickLabel}>{t("whatsapp")}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.quickCard} onPress={handleCall} activeOpacity={0.8}>
          <View style={[styles.quickIcon, { backgroundColor: colors.light.primary + "18" }]}>
            <Feather name="phone" size={22} color={colors.light.primary} />
          </View>
          <Text style={styles.quickLabel}>{t("callUs")}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.quickCard} onPress={handleEmail} activeOpacity={0.8}>
          <View style={[styles.quickIcon, { backgroundColor: "#C9A84718" }]}>
            <Feather name="mail" size={22} color="#C9A847" />
          </View>
          <Text style={styles.quickLabel}>Email</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.quickCard} onPress={handleWebsite} activeOpacity={0.8}>
          <View style={[styles.quickIcon, { backgroundColor: "#1B7A5A18" }]}>
            <Feather name="globe" size={22} color="#1B7A5A" />
          </View>
          <Text style={styles.quickLabel}>Website</Text>
        </TouchableOpacity>
      </View>

      {/* Info cards */}
      <View style={styles.infoGroup}>
        {[
          { icon: "phone", label: t("phone"), value: CONTACT_INFO.phone, onPress: handleCall },
          { icon: "mail", label: "Email", value: CONTACT_INFO.email, onPress: handleEmail },
          { icon: "map-pin", label: t("address"), value: t("addressValue"), onPress: undefined },
          { icon: "clock", label: t("workHours"), value: t("workHoursValue"), onPress: undefined },
        ].map((item, i) => (
          <TouchableOpacity
            key={i}
            style={styles.infoCard}
            onPress={item.onPress}
            activeOpacity={item.onPress ? 0.7 : 1}
          >
            <View style={styles.infoIconWrap}>
              <Feather name={item.icon as any} size={18} color={colors.light.primary} />
            </View>
            <View style={styles.infoBody}>
              <Text style={styles.infoLabel}>{item.label}</Text>
              <Text style={[styles.infoValue, { textAlign }]}>{item.value}</Text>
            </View>
            {item.onPress && (
              <Feather name="chevron-right" size={16} color={colors.light.mutedForeground} />
            )}
          </TouchableOpacity>
        ))}
      </View>

      {/* Message form */}
      <View style={styles.formCard}>
        <Text style={[styles.formTitle, { textAlign }]}>{t("sendMessage")}</Text>

        <Text style={[styles.label, { textAlign }]}>{t("name")}</Text>
        <TextInput
          style={[styles.input, { textAlign }]}
          placeholder={t("namePlaceholder")}
          placeholderTextColor={colors.light.mutedForeground}
          value={name}
          onChangeText={setName}
        />

        <Text style={[styles.label, { textAlign }]}>{t("email")}</Text>
        <TextInput
          style={[styles.input, { textAlign }]}
          placeholder={t("emailPlaceholder")}
          placeholderTextColor={colors.light.mutedForeground}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <Text style={[styles.label, { textAlign }]}>{t("message")}</Text>
        <TextInput
          style={[styles.input, styles.textarea, { textAlign }]}
          placeholder={t("messagePlaceholder")}
          placeholderTextColor={colors.light.mutedForeground}
          value={message}
          onChangeText={setMessage}
          multiline
          numberOfLines={4}
          textAlignVertical="top"
        />

        <TouchableOpacity
          style={[styles.sendBtn, sending && styles.sendBtnDisabled]}
          onPress={handleSend}
          activeOpacity={0.8}
          disabled={sending}
        >
          <Feather name="send" size={16} color="#FFFFFF" />
          <Text style={styles.sendBtnText}>{sending ? "..." : t("send")}</Text>
        </TouchableOpacity>
      </View>

      {/* Social links */}
      <View style={styles.socialCard}>
        <Text style={[styles.socialTitle, { textAlign: "center" }]}>{t("followUs")}</Text>
        <View style={styles.socialRow}>
          <TouchableOpacity
            style={styles.socialBtn}
            onPress={() =>
              Linking.openURL(`https://www.instagram.com/${CONTACT_INFO.instagram}`)
            }
            activeOpacity={0.7}
          >
            <Feather name="instagram" size={22} color="#E1306C" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.socialBtn}
            onPress={() =>
              Linking.openURL(`https://www.facebook.com/${CONTACT_INFO.facebook}`)
            }
            activeOpacity={0.7}
          >
            <Feather name="facebook" size={22} color="#1877F2" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.socialBtn}
            onPress={handleWhatsApp}
            activeOpacity={0.7}
          >
            <Feather name="message-circle" size={22} color="#25D366" />
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
  content: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  quickRow: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 16,
  },
  quickCard: {
    flex: 1,
    backgroundColor: colors.light.card,
    borderRadius: colors.radius,
    paddingVertical: 14,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  quickIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 6,
  },
  quickLabel: {
    fontSize: 11,
    fontFamily: "Inter_500Medium",
    color: colors.light.text,
    textAlign: "center",
  },
  infoGroup: {
    marginBottom: 16,
  },
  infoCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.light.card,
    borderRadius: colors.radius,
    padding: 14,
    marginBottom: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  infoIconWrap: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: colors.light.primary + "15",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  infoBody: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 11,
    fontFamily: "Inter_400Regular",
    color: colors.light.mutedForeground,
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 14,
    fontFamily: "Inter_500Medium",
    color: colors.light.text,
  },
  formCard: {
    backgroundColor: colors.light.card,
    borderRadius: colors.radius + 4,
    padding: 20,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  formTitle: {
    fontSize: 18,
    fontFamily: "Inter_700Bold",
    color: colors.light.text,
    marginBottom: 16,
  },
  label: {
    fontSize: 13,
    fontFamily: "Inter_500Medium",
    color: colors.light.text,
    marginBottom: 6,
  },
  input: {
    backgroundColor: colors.light.background,
    borderRadius: colors.radius,
    borderWidth: 1,
    borderColor: colors.light.border,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 14,
    fontFamily: "Inter_400Regular",
    color: colors.light.text,
    marginBottom: 14,
  },
  textarea: {
    height: 100,
    paddingTop: 12,
  },
  sendBtn: {
    backgroundColor: colors.light.primary,
    borderRadius: colors.radius,
    paddingVertical: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  sendBtnDisabled: {
    opacity: 0.6,
  },
  sendBtnText: {
    fontSize: 15,
    fontFamily: "Inter_600SemiBold",
    color: "#FFFFFF",
  },
  socialCard: {
    backgroundColor: colors.light.card,
    borderRadius: colors.radius + 4,
    padding: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  socialTitle: {
    fontSize: 15,
    fontFamily: "Inter_600SemiBold",
    color: colors.light.text,
    marginBottom: 14,
  },
  socialRow: {
    flexDirection: "row",
    gap: 12,
  },
  socialBtn: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: colors.light.background,
    borderWidth: 1,
    borderColor: colors.light.border,
    alignItems: "center",
    justifyContent: "center",
  },
});
