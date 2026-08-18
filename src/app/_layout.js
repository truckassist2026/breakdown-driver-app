import { useFonts } from '@expo-google-fonts/inter';

import {
  Stack,
  useRouter,
  useSegments,
} from 'expo-router';

import * as SplashScreen from 'expo-splash-screen';

import { StatusBar } from 'expo-status-bar';

import {
  useEffect,
} from 'react';

import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
} from '@expo-google-fonts/inter';

import {
  AuthProvider,
  useAuth,
} from '../context/AuthContext';

// =========================================================
// KEEP SPLASH SCREEN WHILE LOADING
// =========================================================

SplashScreen.preventAutoHideAsync();

// =========================================================
// ROUTE GUARD
// =========================================================

function RootNavigator() {
  const router =
    useRouter();

  const segments =
    useSegments();

  const {
    loading,
    isAuthenticated,
  } = useAuth();

  // =======================================================
  // AUTH ROUTING
  // =======================================================

  useEffect(() => {
    if (loading) {
      return;
    }

    const firstSegment =
      segments[0];

    const isAuthScreen =
      firstSegment === 'login' ||
      firstSegment === 'otp';

    const isTabsScreen =
      firstSegment === '(tabs)';

    // =====================================================
    // NOT AUTHENTICATED
    // =====================================================

    if (
      !isAuthenticated &&
      isTabsScreen
    ) {
      console.log(
        '[Router] No session → Login'
      );

      router.replace(
        '/login'
      );

      return;
    }

    // =====================================================
    // AUTHENTICATED
    // =====================================================

    if (
      isAuthenticated &&
      isAuthScreen
    ) {
      console.log(
        '[Router] Session exists → Home'
      );

      router.replace(
        '/(tabs)/home'
      );

      return;
    }

  }, [
    loading,
    isAuthenticated,
    segments,
  ]);

  // =======================================================
  // WAIT FOR AUTH RESTORE
  // =======================================================

  if (loading) {
    return null;
  }

  return (
    <>
      <StatusBar
        style="dark"
      />

      <Stack
        screenOptions={{
          headerShown: false,

          animation:
            'slide_from_right',

          contentStyle: {
            backgroundColor:
              '#F8FAFC',
          },
        }}
      >
        <Stack.Screen
          name="index"
        />

        <Stack.Screen
          name="login"
        />

        <Stack.Screen
          name="otp"
        />

        <Stack.Screen
          name="(tabs)"
        />
      </Stack>
    </>
  );
}

// =========================================================
// ROOT LAYOUT
// =========================================================

export default function RootLayout() {
  const [
    fontsLoaded,
  ] = useFonts({
    InterRegular:
      Inter_400Regular,

    InterMedium:
      Inter_500Medium,

    InterSemiBold:
      Inter_600SemiBold,

    InterBold:
      Inter_700Bold,
  });

  // =======================================================
  // HIDE SPLASH
  // =======================================================

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [
    fontsLoaded,
  ]);

  // =======================================================
  // WAIT FOR FONTS
  // =======================================================

  if (!fontsLoaded) {
    return null;
  }

  return (
    <AuthProvider>
      <RootNavigator />
    </AuthProvider>
  );
}