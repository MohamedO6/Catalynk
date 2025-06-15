import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';
import { useFonts, Inter_400Regular, Inter_500Medium, Inter_600SemiBold, Inter_700Bold } from '@expo-google-fonts/inter';
import * as SplashScreen from 'expo-splash-screen';
import { AuthProvider } from '@/contexts/AuthContext';
import { ThemeProvider } from '@/contexts/ThemeContext';
import 'react-native-url-polyfill/auto';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  useFrameworkReady();

  const [fontsLoaded, fontError] = useFonts({
    'Inter-Regular': Inter_400Regular,
    'Inter-Medium': Inter_500Medium,
    'Inter-SemiBold': Inter_600SemiBold,
    'Inter-Bold': Inter_700Bold,
  });

  useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  return (
    <ThemeProvider>
      <AuthProvider>
        {!fontsLoaded && !fontError ? null : (
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="(auth)" options={{ headerShown: false }} />
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="onboarding" options={{ headerShown: false }} />
            <Stack.Screen name="create-project" options={{ headerShown: false }} />
            <Stack.Screen name="project/[id]" options={{ headerShown: false }} />
            <Stack.Screen name="profile/[id]" options={{ headerShown: false }} />
            <Stack.Screen name="upgrade" options={{ headerShown: false }} />
            <Stack.Screen name="freelancer-matching" options={{ headerShown: false }} />
            <Stack.Screen name="messaging/[id]" options={{ headerShown: false }} />
            <Stack.Screen name="community/create" options={{ headerShown: false }} />
            <Stack.Screen name="community/post/[id]" options={{ headerShown: false }} />
            <Stack.Screen name="subscription-management" options={{ headerShown: false }} />
            <Stack.Screen name="+not-found" />
          </Stack>
        )}
        <StatusBar style="auto" />
      </AuthProvider>
    </ThemeProvider>
  );
}