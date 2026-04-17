import React, { useState, useRef } from "react";
import {
  View, Text, StyleSheet, TouchableOpacity, Dimensions,
  ScrollView, Platform, StatusBar, Image,
} from "react-native";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useLanguage } from "../context/LanguageContext";
import { Feather } from "@expo/vector-icons";

const { width, height } = Dimensions.get("window");

const SLIDES = [
  {
    key: "1",
    titleKey: "onboardingTitle1" as const,
    descKey: "onboardingDesc1" as const,
    icon: "printer" as const,
    color: "#1B3A6B",
    bgColor: "#EBF0FA",
  },
  {
    key: "2",
    titleKey: "onboardingTitle2" as const,
    descKey: "onboardingDesc2" as const,
    icon: "grid" as const,
    color: "#C9A847",
    bgColor: "#FDF8EC",
  },
  {
    key: "3",
    titleKey: "onboardingTitle3" as const,
    descKey: "onboardingDesc3" as const,
    icon: "message-circle" as const,
    color: "#25D366",
    bgColor: "#EAF9EF",
  },
];

export default function OnboardingScreen() {
  const { t, language } = useLanguage();
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollRef = useRef<ScrollView>(null);
  const isRTL = language === "ar";

  const handleNext = () => {
    if (activeIndex < SLIDES.length - 1) {
      const nextIndex = activeIndex + 1;
      scrollRef.current?.scrollTo({ x: nextIndex * width, animated: true });
      setActiveIndex(nextIndex);
    } else {
      finish();
    }
  };

  const finish = async () => {
    await AsyncStorage.setItem("onboardingDone", "true");
    router.replace("/(tabs)");
  };

  const handleScroll = (e: any) => {
    const idx = Math.round(e.nativeEvent.contentOffset.x / width);
    setActiveIndex(idx);
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      <TouchableOpacity style={styles.skipBtn} onPress={finish}>
        <Text style={styles.skipText}>{t("skip")}</Text>
      </TouchableOpacity>

      <ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={handleScroll}
        scrollEnabled
      >
        {SLIDES.map((slide) => (
          <View key={slide.key} style={[styles.slide, { backgroundColor: slide.bgColor }]}>
            <View style={[styles.iconCircle, { backgroundColor: slide.color }]}>
              <Feather name={slide.icon} size={72} color="#fff" />
            </View>
            <Text style={[styles.title, isRTL && styles.rtl]}>{t(slide.titleKey)}</Text>
            <Text style={[styles.desc, isRTL && styles.rtl]}>{t(slide.descKey)}</Text>
          </View>
        ))}
      </ScrollView>

      <View style={styles.footer}>
        <View style={styles.dots}>
          {SLIDES.map((_, i) => (
            <View
              key={i}
              style={[styles.dot, activeIndex === i && styles.dotActive]}
            />
          ))}
        </View>

        <TouchableOpacity
          style={[
            styles.nextBtn,
            activeIndex === SLIDES.length - 1 && styles.startBtn,
          ]}
          onPress={handleNext}
        >
          <Text style={styles.nextBtnText}>
            {activeIndex === SLIDES.length - 1 ? t("getStarted") : t("next")}
          </Text>
          {activeIndex < SLIDES.length - 1 && (
            <Feather
              name={isRTL ? "arrow-left" : "arrow-right"}
              size={20}
              color="#fff"
              style={{ marginLeft: 8 }}
            />
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  skipBtn: {
    position: "absolute",
    top: Platform.OS === "ios" ? 56 : 40,
    right: 20,
    zIndex: 10,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  skipText: { color: "#666", fontSize: 15, fontWeight: "500" },
  slide: {
    width,
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 40,
    paddingTop: 80,
    paddingBottom: 160,
  },
  iconCircle: {
    width: 160,
    height: 160,
    borderRadius: 80,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 40,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 10,
  },
  title: {
    fontSize: 26,
    fontWeight: "800",
    color: "#1B3A6B",
    textAlign: "center",
    marginBottom: 16,
    lineHeight: 34,
  },
  desc: {
    fontSize: 16,
    color: "#555",
    textAlign: "center",
    lineHeight: 26,
  },
  rtl: { textAlign: "right" },
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#fff",
    paddingBottom: Platform.OS === "ios" ? 40 : 28,
    paddingTop: 20,
    paddingHorizontal: 24,
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
  },
  dots: { flexDirection: "row", marginBottom: 20, gap: 8 },
  dot: {
    width: 8, height: 8, borderRadius: 4, backgroundColor: "#DDD",
  },
  dotActive: { backgroundColor: "#1B3A6B", width: 24 },
  nextBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1B3A6B",
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 50,
    width: "100%",
    justifyContent: "center",
  },
  startBtn: { backgroundColor: "#C9A847" },
  nextBtnText: { color: "#fff", fontSize: 17, fontWeight: "700" },
});
