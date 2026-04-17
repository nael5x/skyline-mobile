import { Feather } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

import colors from "@/constants/colors";

interface ServiceCardProps {
  icon: string;
  title: string;
  description: string;
  color?: string;
}

export function ServiceCard({ icon, title, description, color = colors.light.primary }: ServiceCardProps) {
  return (
    <View style={styles.card}>
      <View style={[styles.iconWrap, { backgroundColor: color + "15" }]}>
        <Feather name={icon as any} size={24} color={color} />
      </View>
      <View style={styles.content}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.desc}>{description}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: colors.light.card,
    borderRadius: colors.radius,
    padding: 16,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  iconWrap: {
    width: 48,
    height: 48,
    borderRadius: colors.radius,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 15,
    fontFamily: "Inter_600SemiBold",
    color: colors.light.text,
    marginBottom: 4,
  },
  desc: {
    fontSize: 13,
    fontFamily: "Inter_400Regular",
    color: colors.light.mutedForeground,
    lineHeight: 18,
  },
});
