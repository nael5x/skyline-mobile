import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { router, useLocalSearchParams } from "expo-router";
import React from "react";
import {
  Linking,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { ProductCard } from "@/components/ProductCard";
import colors from "@/constants/colors";
import {
  CATEGORIES,
  CONTACT_INFO,
  getCategoryName,
  getProductDesc,
  getProductName,
} from "@/constants/data";
import { useCart } from "@/context/CartContext";
import { useLanguage } from "@/context/LanguageContext";

export default function ProductDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { t, language, isRTL } = useLanguage();
  const { addItem, isInCart, totalCount } = useCart();
  const insets = useSafeAreaInsets();

  const allProducts = CATEGORIES.flatMap((c) => c.products);
  const product = allProducts.find((p) => p.id === id);
  const category = product ? CATEGORIES.find((c) => c.id === product.categoryId) : null;
  const related = product
    ? CATEGORIES.find((c) => c.id === product.categoryId)
        ?.products.filter((p) => p.id !== id)
        .slice(0, 3) ?? []
    : [];

  const topPad = Platform.OS === "web" ? 16 : insets.top + 16;
  const textAlign = isRTL ? "right" : "left";

  if (!product) {
    return (
      <View style={styles.notFound}>
        <Feather name="package" size={48} color={colors.light.border} />
        <Text style={styles.notFoundText}>Product not found</Text>
      </View>
    );
  }

  const inCart = isInCart(product.id);

  const handleAddToCart = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    addItem(product);
  };

  const handleQuote = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    const msg = `Hello, I'm interested in: ${getProductName(product, language)} - ${getCategoryName(category!, language)}`;
    Linking.openURL(`https://wa.me/${CONTACT_INFO.whatsapp}?text=${encodeURIComponent(msg)}`);
  };

  const handleCall = () => {
    Linking.openURL(`tel:${CONTACT_INFO.phone}`);
  };

  return (
    <View style={[styles.wrapper, { paddingTop: topPad }]}>
      {/* Header */}
      <View style={[styles.header, { flexDirection: isRTL ? "row-reverse" : "row" }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn} activeOpacity={0.7}>
          <Feather name={isRTL ? "arrow-right" : "arrow-left"} size={22} color={colors.light.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle} numberOfLines={1}>
          {t("productDetails")}
        </Text>
        {/* Cart icon with badge */}
        <TouchableOpacity
          style={styles.cartHeaderBtn}
          onPress={() => router.push("/(tabs)/cart")}
          activeOpacity={0.7}
        >
          <Feather name="shopping-cart" size={20} color={colors.light.primary} />
          {totalCount > 0 && (
            <View style={styles.cartBadge}>
              <Text style={styles.cartBadgeText}>{totalCount > 9 ? "9+" : totalCount}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={[styles.content, { paddingBottom: Math.max(insets.bottom, 34) + 100 }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Product icon / hero */}
        <View style={[styles.heroSection, { backgroundColor: (category?.color ?? colors.light.primary) + "15" }]}>
          <Feather
            name={(category?.icon as any) ?? "package"}
            size={72}
            color={category?.color ?? colors.light.primary}
          />
        </View>

        {/* Category chip */}
        {category && (
          <View style={[styles.catChip, { backgroundColor: category.color }]}>
            <Feather name={category.icon as any} size={12} color="#FFFFFF" />
            <Text style={styles.catChipText}>{getCategoryName(category, language)}</Text>
          </View>
        )}

        {/* Name & desc */}
        <Text style={[styles.productName, { textAlign }]}>
          {getProductName(product, language)}
        </Text>
        <Text style={[styles.productDesc, { textAlign }]}>
          {getProductDesc(product, language)}
        </Text>

        {/* Add to Cart */}
        <TouchableOpacity
          style={[styles.addToCartBtn, inCart && styles.addToCartBtnActive]}
          onPress={handleAddToCart}
          activeOpacity={0.85}
        >
          <Feather
            name={inCart ? "check-circle" : "shopping-cart"}
            size={18}
            color="#FFFFFF"
          />
          <Text style={styles.addToCartText}>
            {inCart ? t("itemAdded") : t("addToCart")}
          </Text>
        </TouchableOpacity>

        {/* Secondary CTA buttons */}
        <View style={styles.ctaRow}>
          <TouchableOpacity style={styles.ctaWhatsApp} onPress={handleQuote} activeOpacity={0.85}>
            <Feather name="message-circle" size={16} color="#FFFFFF" />
            <Text style={styles.ctaWhatsAppText}>{t("getQuote")}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.ctaCall} onPress={handleCall} activeOpacity={0.85}>
            <Feather name="phone" size={16} color={colors.light.primary} />
          </TouchableOpacity>
        </View>

        {/* Related */}
        {related.length > 0 && (
          <View style={styles.relatedSection}>
            <Text style={[styles.relatedTitle, { textAlign }]}>{t("relatedProducts")}</Text>
            {related.map((p) => (
              <ProductCard
                key={p.id}
                product={p}
                onPress={() => {
                  Haptics.selectionAsync();
                  router.replace({ pathname: "/product/[id]", params: { id: p.id } });
                }}
              />
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: colors.light.background,
  },
  notFound: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
  },
  notFoundText: {
    fontSize: 16,
    fontFamily: "Inter_400Regular",
    color: colors.light.mutedForeground,
  },
  header: {
    alignItems: "center",
    paddingHorizontal: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.light.border,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.light.card,
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    flex: 1,
    fontSize: 16,
    fontFamily: "Inter_600SemiBold",
    color: colors.light.text,
    textAlign: "center",
  },
  cartHeaderBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.light.card,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  cartBadge: {
    position: "absolute",
    top: -2,
    right: -2,
    backgroundColor: colors.light.secondary,
    borderRadius: 9,
    minWidth: 16,
    height: 16,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 3,
  },
  cartBadgeText: {
    fontSize: 9,
    fontFamily: "Inter_700Bold",
    color: colors.light.primary,
  },
  content: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  heroSection: {
    height: 180,
    borderRadius: colors.radius + 4,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  catChip: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 5,
    marginBottom: 12,
    gap: 5,
  },
  catChipText: {
    fontSize: 12,
    fontFamily: "Inter_600SemiBold",
    color: "#FFFFFF",
  },
  productName: {
    fontSize: 22,
    fontFamily: "Inter_700Bold",
    color: colors.light.text,
    marginBottom: 10,
  },
  productDesc: {
    fontSize: 15,
    fontFamily: "Inter_400Regular",
    color: colors.light.mutedForeground,
    lineHeight: 24,
    marginBottom: 20,
  },
  addToCartBtn: {
    backgroundColor: colors.light.primary,
    borderRadius: colors.radius,
    paddingVertical: 15,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    marginBottom: 10,
    shadowColor: colors.light.primary,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 3,
  },
  addToCartBtnActive: {
    backgroundColor: "#1B7A5A",
  },
  addToCartText: {
    fontSize: 15,
    fontFamily: "Inter_700Bold",
    color: "#FFFFFF",
  },
  ctaRow: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 24,
  },
  ctaWhatsApp: {
    flex: 1,
    backgroundColor: "#25D366",
    borderRadius: colors.radius,
    paddingVertical: 13,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
  },
  ctaWhatsAppText: {
    fontSize: 13,
    fontFamily: "Inter_600SemiBold",
    color: "#FFFFFF",
  },
  ctaCall: {
    width: 48,
    height: 48,
    backgroundColor: colors.light.secondary + "25",
    borderRadius: colors.radius,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1.5,
    borderColor: colors.light.primary,
  },
  relatedSection: {
    marginTop: 8,
  },
  relatedTitle: {
    fontSize: 17,
    fontFamily: "Inter_700Bold",
    color: colors.light.text,
    marginBottom: 12,
  },
});
