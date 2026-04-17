import { BlurView } from "expo-blur";
import { Tabs } from "expo-router";
import { Feather } from "@expo/vector-icons";
import React from "react";
import { Platform, StyleSheet, Text, View, useColorScheme } from "react-native";

import colors from "@/constants/colors";
import { useCart } from "@/context/CartContext";
import { useColors } from "@/hooks/useColors";
import { useLanguage } from "@/context/LanguageContext";

function CartBadge({ count }: { count: number }) {
  if (count === 0) return null;
  return (
    <View style={badge.wrap}>
      <Text style={badge.text}>{count > 9 ? "9+" : count}</Text>
    </View>
  );
}

const badge = StyleSheet.create({
  wrap: {
    position: "absolute",
    top: -4,
    right: -8,
    backgroundColor: colors.light.secondary,
    borderRadius: 9,
    minWidth: 18,
    height: 18,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 4,
  },
  text: {
    fontSize: 10,
    fontFamily: "Inter_700Bold",
    color: colors.light.primary,
  },
});

export default function TabLayout() {
  const c = useColors();
  const { t } = useLanguage();
  const { totalCount } = useCart();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const isIOS = Platform.OS === "ios";
  const isWeb = Platform.OS === "web";

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: c.primary,
        tabBarInactiveTintColor: c.mutedForeground,
        headerShown: false,
        tabBarStyle: {
          position: "absolute",
          backgroundColor: isIOS ? "transparent" : c.card,
          borderTopWidth: 1,
          borderTopColor: c.border,
          elevation: 0,
          height: isWeb ? 84 : 60,
        },
        tabBarBackground: () =>
          isIOS ? (
            <BlurView
              intensity={100}
              tint={isDark ? "dark" : "light"}
              style={StyleSheet.absoluteFill}
            />
          ) : isWeb ? (
            <View style={[StyleSheet.absoluteFill, { backgroundColor: c.card }]} />
          ) : null,
        tabBarLabelStyle: {
          fontSize: 10,
          fontFamily: "Inter_500Medium",
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: t("home"),
          tabBarIcon: ({ color }) => <Feather name="home" size={22} color={color} />,
        }}
      />
      <Tabs.Screen
        name="products"
        options={{
          title: t("products"),
          tabBarIcon: ({ color }) => <Feather name="grid" size={22} color={color} />,
        }}
      />
      <Tabs.Screen
        name="cart"
        options={{
          title: t("cart"),
          tabBarIcon: ({ color }) => (
            <View style={{ position: "relative" }}>
              <Feather name="shopping-cart" size={22} color={color} />
              <CartBadge count={totalCount} />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="about"
        options={{
          title: t("about"),
          tabBarIcon: ({ color }) => <Feather name="info" size={22} color={color} />,
        }}
      />
      <Tabs.Screen
        name="contact"
        options={{
          title: t("contact"),
          tabBarIcon: ({ color }) => <Feather name="phone" size={22} color={color} />,
        }}
      />
      <Tabs.Screen
        name="account"
        options={{
          title: t("settings"),
          tabBarIcon: ({ color }) => <Feather name="user" size={22} color={color} />,
        }}
      />
    </Tabs>
  );
}
