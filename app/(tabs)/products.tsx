import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
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
import { useLanguage } from "@/context/LanguageContext";
import { Category, Product } from "@/types";
import { getAllCategories } from "@/services/categoryService";
import { getAllProducts, getProductsByCategory } from "@/services/productService";

function getText(
  value: { ar: string; tr: string; en: string } | undefined,
  language: "ar" | "tr" | "en"
): string {
  if (!value) return "";
  return value[language] || value.ar || value.tr || value.en || "";
}

export default function ProductsScreen() {
  const { t, language } = useLanguage();
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{ categoryId?: string }>();

  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(
    params.categoryId ?? null
  );
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function loadCategories() {
      try {
        const apiCategories = await getAllCategories();
        if (mounted) {
          setCategories(apiCategories);
        }
      } catch (error) {
        console.error("Categories load error:", error);
      }
    }

    loadCategories();

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    let mounted = true;

    async function loadProducts() {
      try {
        setLoading(true);

        const apiProducts = selectedCategory
          ? await getProductsByCategory(selectedCategory)
          : await getAllProducts();

        if (mounted) {
          setProducts(apiProducts);
        }
      } catch (error) {
        console.error("Products load error:", error);
        if (mounted) {
          setProducts([]);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    loadProducts();

    return () => {
      mounted = false;
    };
  }, [selectedCategory]);

  const filtered = useMemo(() => {
    if (!search.trim()) return products;

    const q = search.trim().toLowerCase();

    return products.filter((product) => {
      const name = getText(product.name, language).toLowerCase();
      const desc = getText(product.description, language).toLowerCase();
      const sku = String(product.sku || "").toLowerCase();

      return name.includes(q) || desc.includes(q) || sku.includes(q);
    });
  }, [products, search, language]);

  const topPad = Platform.OS === "web" ? 16 : insets.top;

  return (
    <View style={styles.container}>
      <View style={[styles.searchWrap, { marginTop: topPad + 16 }]}>
        <Feather
          name="search"
          size={18}
          color={colors.light.mutedForeground}
          style={styles.searchIcon}
        />

        <TextInput
          value={search}
          onChangeText={setSearch}
          placeholder={t("searchProducts")}
          placeholderTextColor={colors.light.mutedForeground}
          style={styles.searchInput}
        />

        {search.length > 0 && (
          <TouchableOpacity onPress={() => setSearch("")}>
            <Feather name="x" size={18} color={colors.light.mutedForeground} />
          </TouchableOpacity>
        )}
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.filterScroll}
        contentContainerStyle={styles.filterContent}
      >
        <TouchableOpacity
          style={[
            styles.filterChip,
            !selectedCategory && styles.filterChipActive,
          ]}
          onPress={() => {
            Haptics.selectionAsync();
            setSelectedCategory(null);
          }}
          activeOpacity={0.7}
        >
          <Text
            style={[
              styles.filterChipText,
              !selectedCategory && styles.filterChipTextActive,
            ]}
          >
            {t("allCategories")}
          </Text>
        </TouchableOpacity>

        {categories.map((cat) => {
          const active = selectedCategory === cat.id;

          return (
            <TouchableOpacity
              key={cat.id}
              style={[styles.filterChip, active && styles.filterChipActive]}
              onPress={() => {
                Haptics.selectionAsync();
                setSelectedCategory(active ? null : cat.id);
              }}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.filterChipText,
                  active && styles.filterChipTextActive,
                ]}
              >
                {getText(cat.name, language)}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {loading ? (
        <View style={styles.loadingWrap}>
          <ActivityIndicator size="large" color={colors.light.primary} />
          <Text style={styles.loadingText}>Loading products...</Text>
        </View>
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <ProductCard
              product={item}
              onPress={() => {
                Haptics.selectionAsync();
                router.push({
                  pathname: "/product/[id]",
                  params: { id: item.id },
                });
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
              <Feather
                name="package"
                size={42}
                color={colors.light.mutedForeground}
              />
              <Text style={styles.emptyText}>No products found</Text>
            </View>
          }
        />
      )}
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
  loadingWrap: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
  },
  loadingText: {
    fontSize: 14,
    fontFamily: "Inter_400Regular",
    color: colors.light.mutedForeground,
  },
});