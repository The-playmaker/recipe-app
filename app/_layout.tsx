import React, { useEffect } from 'react';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFonts, Inter_400Regular, Inter_500Medium, Inter_600SemiBold, Inter_700Bold } from '@expo-google-fonts/inter';
import * as SplashScreen from 'expo-splash-screen';
import { AuthProvider, useAuth } from '@/context/AuthContext';
import { ActivityIndicator, View, StyleSheet } from 'react-native';

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

const InitialLayout = () => {
  const { currentUser, loading: authLoading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  const [fontsLoaded, fontError] = useFonts({
    'Inter-Regular': Inter_400Regular,
    'Inter-Medium': Inter_500Medium,
    'Inter-SemiBold': Inter_600SemiBold,
    'Inter-Bold': Inter_700Bold,
  });

  useEffect(() => {
    if (authLoading || (!fontsLoaded && !fontError)) {
      // Still loading auth state or fonts, keep splash or show loading
      return;
    }

    const inAuthGroup = segments[0] === 'auth';

    if (!currentUser && !inAuthGroup) {
      // If the user is not signed in and the initial segment is not anything in the auth group,
      // then redirect to the login page.
      router.replace('/auth/login');
    } else if (currentUser && inAuthGroup) {
      // If the user is signed in and the initial segment is in the auth group (e.g. /auth/login),
      // then redirect to the main app.
      router.replace('/(tabs)/recipes'); // Adjust to your main app route
    }

    // Hide the splash screen once we're done with auth checks and font loading
    SplashScreen.hideAsync();

  }, [currentUser, authLoading, fontsLoaded, fontError, segments, router]);

  if (authLoading || (!fontsLoaded && !fontError)) {
    // You can return a global loading spinner here if you prefer instead of just null
    // while SplashScreen is visible or fonts are loading.
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#F59E0B" />
      </View>
    );
  }

  return (
    <>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        {/* Ensure your login screen is part of the navigation stack if not already defined by its path */}
        {/* e.g., if app/auth/login.tsx exists, it's automatically a route. */}
        {/* You might need a specific screen definition if it's outside the default routing structure */}
        <Stack.Screen name="auth/login" options={{ headerShown: false, presentation: 'modal' }} />
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style="auto" />
    </>
  );
};

export default function RootLayout() {
  // useFrameworkReady(); // This hook was present, ensure it's still needed or integrated.
                        // If it was for splash screen or similar, its logic might be covered.

  return (
    <AuthProvider>
      <InitialLayout />
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F9FAFB', // Or your app's background color
  },
});