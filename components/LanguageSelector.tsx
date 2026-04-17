import React, { useState } from "react";
import {
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import colors from "@/constants/colors";
import { useLanguage } from "@/context/LanguageContext";
import { Language } from "@/constants/translations";

const LANGUAGES: { code: Language; label: string; native: string }[] = [
  { code: "ar", label: "Arabic", native: "العربية" },
  { code: "en", label: "English", native: "English" },
  { code: "tr", label: "Turkish", native: "Türkçe" },
];

interface LanguageSelectorProps {
  visible?: boolean;
  onClose?: () => void;
}

export function LanguageSelector({ visible: externalVisible, onClose }: LanguageSelectorProps = {}) {
  const { language, setLanguage, t } = useLanguage();
  const [internalVisible, setInternalVisible] = useState(false);
  const insets = useSafeAreaInsets();

  const isControlled = externalVisible !== undefined;
  const visible = isControlled ? externalVisible : internalVisible;
  const close = () => {
    if (isControlled) onClose?.();
    else setInternalVisible(false);
  };

  const currentLang = LANGUAGES.find((l) => l.code === language);

  return (
    <>
      {!isControlled && (
        <TouchableOpacity style={styles.trigger} onPress={() => setInternalVisible(true)} activeOpacity={0.7}>
          <Text style={styles.triggerText}>{currentLang?.native}</Text>
        </TouchableOpacity>
      )}

      <Modal
        visible={visible}
        transparent
        animationType="fade"
        onRequestClose={close}
      >
        <Pressable style={styles.overlay} onPress={close}>
          <View
            style={[
              styles.sheet,
              { paddingBottom: Math.max(insets.bottom, 20) },
            ]}
          >
            <Text style={styles.title}>{t("selectLanguage")}</Text>
            {LANGUAGES.map((lang) => (
              <TouchableOpacity
                key={lang.code}
                style={[styles.option, language === lang.code && styles.optionActive]}
                onPress={() => {
                  setLanguage(lang.code);
                  close();
                }}
                activeOpacity={0.7}
              >
                <Text style={[styles.optionLabel, language === lang.code && styles.optionLabelActive]}>
                  {lang.native}
                </Text>
                <Text style={[styles.optionSub, language === lang.code && styles.optionSubActive]}>
                  {lang.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </Pressable>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  trigger: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.2)",
  },
  triggerText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontFamily: "Inter_500Medium",
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  sheet: {
    backgroundColor: colors.light.card,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 20,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 18,
    fontFamily: "Inter_700Bold",
    color: colors.light.primary,
    textAlign: "center",
    marginBottom: 16,
  },
  option: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    borderRadius: colors.radius,
    marginBottom: 8,
    backgroundColor: colors.light.surface,
  },
  optionActive: {
    backgroundColor: colors.light.primary,
  },
  optionLabel: {
    fontSize: 16,
    fontFamily: "Inter_600SemiBold",
    color: colors.light.text,
  },
  optionLabelActive: {
    color: "#FFFFFF",
  },
  optionSub: {
    fontSize: 13,
    fontFamily: "Inter_400Regular",
    color: colors.light.mutedForeground,
  },
  optionSubActive: {
    color: "rgba(255,255,255,0.75)",
  },
});
