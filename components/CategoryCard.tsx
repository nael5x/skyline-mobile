import { Feather } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

import colors from "@/constants/colors";
import { Category, getCategoryName } from "@/constants/data";
import { useLanguage } from "@/context/LanguageContext";

interface CategoryCardProps {
  category: Category;
  onPress: () => void;
  compact?: boolean;
}

export function CategoryCard({ category, onPress, compact = false }: CategoryCardProps) {
  const { language } = useLanguage();
  const name = getCategoryName(category, language);

  if (compact) {
    return (
      <TouchableOpacity
        style={[styles.compactCard, { borderLeftColor: category.color }]}
        onPress={onPress}
        activeOpacity={0.7}
      >
        <View style={[styles.compactIconWrap, { backgroundColor: category.color + "18" }]}>
          <Feather name={category.icon as any} size={20} color={category.color} />
        </View>
        <Text style={styles.compactName} numberOfLines={2}>
          {name}
        </Text>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{category.products.length}</Text>
        </View>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity style={[styles.card, { backgroundColor: category.color }]} onPress={onPress} activeOpacity={0.85}>
      <View style={styles.iconWrap}>
        <Feather name={category.icon as any} size={32} color="#FFFFFF" />
      </View>
      <Text style={styles.name} numberOfLines={2}>
        {name}
      </Text>
      <Text style={styles.count}>
        {category.products.length} items
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 150,
    height: 140,
    borderRadius: colors.radius + 4,
    padding: 16,
    marginRight: 12,
    justifyContent: "space-between",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 3,
  },
  iconWrap: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: "rgba(255,255,255,0.2)",
    alignItems: "center",
    justifyContent: "center",
  },
  name: {
    fontSize: 14,
    fontFamily: "Inter_600SemiBold",
    color: "#FFFFFF",
    marginTop: 4,
  },
  count: {
    fontSize: 12,
    fontFamily: "Inter_400Regular",
    color: "rgba(255,255,255,0.75)",
  },
  compactCard: {
    backgroundColor: colors.light.card,
    borderRadius: colors.radius,
    padding: 14,
    marginBottom: 10,
    flexDirection: "row",
    alignItems: "center",
    borderLeftWidth: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  compactIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  compactName: {
    flex: 1,
    fontSize: 14,
    fontFamily: "Inter_500Medium",
    color: colors.light.text,
  },
  badge: {
    backgroundColor: colors.light.primary,
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 2,
    marginLeft: 8,
  },
  badgeText: {
    color: "#FFFFFF",
    fontSize: 11,
    fontFamily: "Inter_600SemiBold",
  },
});
