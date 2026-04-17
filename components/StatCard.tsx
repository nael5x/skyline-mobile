import React from "react";
import { StyleSheet, Text, View } from "react-native";

import colors from "@/constants/colors";

interface StatCardProps {
  value: string;
  label: string;
  color?: string;
}

export function StatCard({ value, label, color = colors.light.primary }: StatCardProps) {
  return (
    <View style={styles.card}>
      <Text style={[styles.value, { color }]}>{value}</Text>
      <Text style={styles.label}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: colors.light.card,
    borderRadius: colors.radius,
    padding: 16,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
    marginHorizontal: 4,
  },
  value: {
    fontSize: 26,
    fontFamily: "Inter_700Bold",
    marginBottom: 4,
  },
  label: {
    fontSize: 11,
    fontFamily: "Inter_400Regular",
    color: colors.light.mutedForeground,
    textAlign: "center",
  },
});
