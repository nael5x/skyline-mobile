import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
  useFonts,
} from "@expo-google-fonts/inter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack, router } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import React, { useEffect, useState } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { KeyboardProvider } from "react-native-keyboard-controller";
import { SafeAreaProvider } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { ErrorBoundary } from "@/components/ErrorBoundary";
import { AuthProvider } from "@/context/AuthContext";
import { CartProvider } from "@/context/CartContext";
import { LanguageProvider } from "@/context/LanguageContext";

SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient();

function RootLayoutNav({ onboardingDone }: { onboardingDone: boolean }) {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="onboarding" options={{ headerShown: false }} />
      <Stack.Screen name="product/[id]" options={{ headerShown: false }} />
      <Stack.Screen name="checkout" options={{ headerShown: false }} />
      <Stack.Screen name="order-history" options={{ headerShown: false }} />
      <Stack.Screen name="privacy-policy" options={{ headerShown: false }} />
      <Stack.Screen name="terms" options={{ headerShown: false }} />
      <Stack.Screen name="box-calculator" options={{ headerShown: false }} />
      <Stack.Screen name="book-printing" options={{ headerShown: false }} />
      <Stack.Screen name="marketplace" options={{ headerShown: false }} />
      <Stack.Screen name="order-tracking" options={{ headerShown: false }} />
      <Stack.Screen name="admin" options={{ headerShown: false }} />
      <Stack.Screen name="auth/login" options={{ headerShown: false }} />
      <Stack.Screen name="auth/register" options={{ headerShown: false }} />
      <Stack.Screen name="auth/forgot-password" options={{ headerShown: false }} />
    </Stack>
  );
}

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
  });
  const [onboardingChecked, setOnboardingChecked] = useState(false);
  const [onboardingDone, setOnboardingDone] = useState(true);

  useEffect(() => {
    AsyncStorage.getItem("onboardingDone").then((val) => {
      setOnboardingDone(val === "true");
      setOnboardingChecked(true);
    });
  }, []);

  useEffect(() => {
    if ((fontsLoaded || fontError) && onboardingChecked) {
      SplashScreen.hideAsync();
      if (!onboardingDone) {
        router.replace("/onboarding");
      }
    }
  }, [fontsLoaded, fontError, onboardingChecked, onboardingDone]);

  if ((!fontsLoaded && !fontError) || !onboardingChecked) return null;

  return (
    <SafeAreaProvider>
      <ErrorBoundary>
        <LanguageProvider>
          <AuthProvider>
          <CartProvider>
            <QueryClientProvider client={queryClient}>
              <GestureHandlerRootView>
                <KeyboardProvider>
                  <RootLayoutNav onboardingDone={onboardingDone} />
                </KeyboardProvider>
              </GestureHandlerRootView>
            </QueryClientProvider>
          </CartProvider>
          </AuthProvider>
        </LanguageProvider>
      </ErrorBoundary>
    </SafeAreaProvider>
  );
}
