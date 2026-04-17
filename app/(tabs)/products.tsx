import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { router, useLocalSearchParams } from "expo-router";
import React, { useMemo, useState } from "react";
import {
  FlatList,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { ProductCard } from "@/components/ProductCard";
import colors from "@/constants/colors";
import { CATEGORIES, Category, Product, getCategoryName } from "@/constants/data";
import { useLanguage } from "@/context/LanguageContext";

export default function ProductsScreen() {
  const { t, language, isRTL } = useLanguage();
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{ categoryId?: string }>();

  const [selectedCategory, setSelectedCategory] = useState<string | null>(
    params.categoryId ?? null,
  );
  const [search, setSearch] = useState("");

  const allProducts = useMemo(
    () => CATEGORIES.flatMap((c) => c.products),
    [],
  );

  const filtered = useMemo(() => {
    let products: Product[] = selectedCategory
      ? CATEGORIES.find((c) => c.id === selectedCategory)?.products ?? []
      : allProducts;

    if (search.trim()) {
      const q = search.toLowerCase();
      products = products.filter(
        (p) =>
          p.nameAr.toLowerCase().includes(q) ||
          p.nameEn.toLowerCase().includes(q) ||
          p.nameTr.toLowerCase().includes(q),
      );
    }
    return products;
  }, [selectedCategory, search, allProducts]);

  const topPad = Platform.OS === "web" ? 16 : insets.top;

  return (
    <View style={[styles.container, { paddingTop: topPad }]}>
      {/* Search */}
      <View style={styles.searchWrap}>
        <Feather name="search" size={18} color={colors.light.mutedForeground} style={styles.searchIcon} />
        <TextInput
          style={[styles.searchInput, { textAlign: isRTL ? "right" : "left" }]}
          placeholder={t("searchProducts")}
          placeholderTextColor={colors.light.mutedForeground}
          value={search}
          onChangeText={setSearch}
        />
        {search.length > 0 && (
          <TouchableOpacity onPress={() => setSearch("")}>
            <Feather name="x" size={18} color={colors.light.mutedForeground} />
          </TouchableOpacity>
        )}
      </View>

      {/* Categories filter */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.filterScroll}
        contentContainerStyle={styles.filterContent}
      >
        <TouchableOpacity
          style={[styles.filterChip, !selectedCategory && styles.filterChipActive]}
          onPress={() => {
            Haptics.selectionAsync();
            setSelectedCategory(null);
          }}
          activeOpacity={0.7}
        >
          <Text style={[styles.filterChipText, !selectedCategory && styles.filterChipTextActive]}>
            {t("allCategories")}
          </Text>
        </TouchableOpacity>
        {CATEGORIES.map((cat) => (
          <TouchableOpacity
            key={cat.id}
            style={[
              styles.filterChip,
              selectedCategory === cat.id && styles.filterChipActive,
              selectedCategory === cat.id && { backgroundColor: cat.color },
            ]}
            onPress={() => {
              Haptics.selectionAsync();
              setSelectedCategory(selectedCategory === cat.id ? null : cat.id);
            }}
            activeOpacity={0.7}
          >
            <Text
              style={[
                styles.filterChipText,
                selectedCategory === cat.id && styles.filterChipTextActive,
              ]}
            >
              {getCategoryName(cat, language)}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Products list */}
      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ProductCard
            product={item}
            onPress={() => {
              Haptics.selectionAsync();
              router.push({ pathname: "/product/[id]", params: { id: item.id } });
            }}
          />
        )}
        contentContainerStyle={[
          styles.listContent,
          { paddingBottom: Math.max(insets.bottom, 34) + 80 },
        ]}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Feather name="package" size={48} color={colors.light.border} />
            <Text style={styles.emptyText}>No products found</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.light.background,
  },
  searchWrap: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.light.card,
    borderRadius: colors.radius,
    margin: 16,
    marginBottom: 8,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: colors.light.border,
    height: 48,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    fontFamily: "Inter_400Regular",
    color: colors.light.text,
    paddingVertical: 0,
  },
  filterScroll: {
    flexGrow: 0,
    marginBottom: 8,
  },
  filterContent: {
    paddingHorizontal: 16,
    gap: 8,
  },
  filterChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: colors.light.card,
    borderWidth: 1,
    borderColor: colors.light.border,
    marginRight: 6,
  },
  filterChipActive: {
    backgroundColor: colors.light.primary,
    borderColor: colors.light.primary,
  },
  filterChipText: {
    fontSize: 13,
    fontFamily: "Inter_500Medium",
    color: colors.light.mutedForeground,
  },
  filterChipTextActive: {
    color: "#FFFFFF",
  },
  listContent: {
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 80,
    gap: 12,
  },
  emptyText: {
    fontSize: 15,
    fontFamily: "Inter_400Regular",
    color: colors.light.mutedForeground,
  },
});
