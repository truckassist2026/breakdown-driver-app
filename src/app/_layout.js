import { useFonts } from "@expo-google-fonts/inter";

import { Stack, useRouter, useSegments } from "expo-router";

import * as SplashScreen from "expo-splash-screen";

import { StatusBar } from "expo-status-bar";

import { useEffect, useState } from "react";

import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
} from "@expo-google-fonts/inter";

import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

import { AuthProvider, useAuth } from "../context/AuthContext";

import LaunchScreen from "../components/LaunchScreen";

// =========================================================
// KEEP NATIVE SPLASH WHILE APP STARTS
// =========================================================

SplashScreen.preventAutoHideAsync();

// =========================================================
// ROUTE GUARD
// =========================================================

function RootNavigator() {
  const router = useRouter();

  const segments = useSegments();

  const { loading, isAuthenticated } = useAuth();

  // =======================================================
  // AUTH ROUTING
  // =======================================================

  useEffect(() => {
    if (loading) {
      return;
    }

    const firstSegment = segments[0];

    const isAuthScreen = firstSegment === "login" || firstSegment === "otp";

    const isTabsScreen = firstSegment === "(tabs)";

    // =====================================================
    // NOT AUTHENTICATED
    // =====================================================

    if (!isAuthenticated && isTabsScreen) {
      console.log("[Router] No session → Login");

      router.replace("/login");

      return;
    }

    // =====================================================
    // AUTHENTICATED
    // =====================================================

    if (isAuthenticated && isAuthScreen) {
      console.log("[Router] Session exists → Home");

      router.replace("/(tabs)/home");

      return;
    }
  }, [loading, isAuthenticated, segments]);

  // =======================================================
  // WAIT FOR AUTH RESTORE
  // =======================================================

  if (loading) {
    return null;
  }

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: "#F8FAFC",
      }}
      edges={["top", "bottom"]}
    >
      <Stack
        screenOptions={{
          headerShown: false,

          animation: "slide_from_right",

          contentStyle: {
            backgroundColor: "#F8FAFC",
          },
        }}
      >
        <Stack.Screen name="index" />

        <Stack.Screen name="login" />

        <Stack.Screen name="otp" />

        <Stack.Screen name="(tabs)" />
      </Stack>
    </SafeAreaView>
  );
}

// =========================================================
// APP CONTENT
// =========================================================

function AppContent() {
  const [launchFinished, setLaunchFinished] = useState(false);

  // =======================================================
  // FULL SCREEN LAUNCH SCREEN
  // =======================================================

  useEffect(() => {
    const timer = setTimeout(() => {
      setLaunchFinished(true);
    }, 1800);

    return () => {
      clearTimeout(timer);
    };
  }, []);

  // =======================================================
  // SHOW FULL LAUNCH SCREEN
  // =======================================================

  if (!launchFinished) {
    return <LaunchScreen />;
  }

  // =======================================================
  // NORMAL APPLICATION
  // =======================================================

  return (
    <>
      <StatusBar style="dark" translucent={false} />

      <RootNavigator />
    </>
  );
}

// =========================================================
// ROOT LAYOUT
// =========================================================

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    InterRegular: Inter_400Regular,

    InterMedium: Inter_500Medium,

    InterSemiBold: Inter_600SemiBold,

    InterBold: Inter_700Bold,
  });

  // =======================================================
  // HIDE NATIVE SPLASH
  // =======================================================

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  // =======================================================
  // WAIT FOR FONTS
  // =======================================================

  if (!fontsLoaded) {
    return null;
  }

  return (
    <SafeAreaProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </SafeAreaProvider>
  );
}
