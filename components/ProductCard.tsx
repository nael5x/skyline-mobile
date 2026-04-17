import { Feather } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

import colors from "@/constants/colors";
import { CATEGORIES, Product, getProductDesc, getProductName } from "@/constants/data";
import { useLanguage } from "@/context/LanguageContext";

interface ProductCardProps {
  product: Product;
  onPress: () => void;
}

export function ProductCard({ product, onPress }: ProductCardProps) {
  const { language } = useLanguage();
  const name = getProductName(product, language);
  const desc = getProductDesc(product, language);
  const category = CATEGORIES.find((c) => c.id === product.categoryId);

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.8}>
      <View style={[styles.iconSection, { backgroundColor: (category?.color ?? colors.light.primary) + "15" }]}>
        <Feather
          name={(category?.icon as any) ?? "package"}
          size={36}
          color={category?.color ?? colors.light.primary}
        />
      </View>
      <View style={styles.info}>
        <Text style={styles.name} numberOfLines={2}>
          {name}
        </Text>
        <Text style={styles.desc} numberOfLines={2}>
          {desc}
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
});
