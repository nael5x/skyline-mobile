import { Feather } from "@expo/vector-icons";
import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

import colors from "@/constants/colors";
import { useLanguage } from "@/context/LanguageContext";
import { Product } from "@/types";

interface ProductCardProps {
  product: Product;
  onPress: () => void;
}

function getText(
  value: { ar: string; tr: string; en: string } | undefined,
  language: "ar" | "tr" | "en"
): string {
  if (!value) return "";
  return value[language] || value.ar || value.tr || value.en || "";
}

export function ProductCard({ product, onPress }: ProductCardProps) {
  const { language } = useLanguage();

  const name = getText(product.name, language);
  const desc = getText(product.shortDescription || product.description, language);

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.8}>
      <View style={styles.iconSection}>
        {product.thumbnailUrl ? (
          <Image
            source={{ uri: product.thumbnailUrl }}
            style={styles.thumbnail}
            resizeMode="cover"
          />
        ) : (
          <Feather name="package" size={30} color={colors.light.primary} />
        )}
      </View>

      <View style={styles.info}>
        <Text style={styles.name} numberOfLines={2}>
          {name}
        </Text>

        <Text style={styles.desc} numberOfLines={2}>
          {desc}
        </Text>

        <Text style={styles.price}>
          {Number(product.basePrice || 0).toLocaleString()} {product.currency || "TRY"}
        </Text>
      </View>

      <Feather name="chevron-right" size={18} color={colors.light.mutedForeground} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.light.card,
    borderRadius: colors.radius,
    padding: 14,
    marginBottom: 10,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  iconSection: {
    width: 56,
    height: 56,
    borderRadius: colors.radius,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
    backgroundColor: colors.light.primary + "15",
    overflow: "hidden",
  },
  thumbnail: {
    width: "100%",
    height: "100%",
  },
  info: {
    flex: 1,
    marginRight: 8,
  },
  name: {
    fontSize: 14,
    fontFamily: "Inter_600SemiBold",
    color: colors.light.text,
    marginBottom: 4,
  },
  desc: {
    fontSize: 12,
    fontFamily: "Inter_400Regular",
    color: colors.light.mutedForeground,
    lineHeight: 16,
  },
  price: {
    marginTop: 6,
    fontSize: 13,
    fontFamily: "Inter_700Bold",
    color: colors.light.primary,
  },
});