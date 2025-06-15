import { useEffect } from 'react';
import { router, useRootNavigationState } from 'expo-router';
import { View } from 'react-native';
import { useAuth } from '@/contexts/AuthContext';
import LoadingScreen from '@/components/LoadingScreen';

export default function Index() {
  const { user, profile, loading } = useAuth();
  const rootNavigationState = useRootNavigationState();

  useEffect(() => {
    // Wait for both auth loading to complete AND root navigation to be ready
    if (!loading && rootNavigationState?.key) {
      console.log('Navigation ready, user:', !!user, 'profile:', !!profile, 'role:', profile?.role);
      
      if (user) {
        // If user exists but no profile or no role, go to role selection
        if (!profile || !profile.role) {
          console.log('Redirecting to role selection');
          router.replace('/(auth)/role-selection');
        } else {
          // User has completed setup, go to main app
          console.log('Redirecting to main app');
          router.replace('/(tabs)');
        }
      } else {
        // No user, go to onboarding
        console.log('Redirecting to onboarding');
        router.replace('/onboarding');
      }
    }
  }, [user, profile, loading, rootNavigationState?.key]);

  // Show loading screen while auth is loading or navigation isn't ready
  if (loading || !rootNavigationState?.key) {
    return (
      <View style={{ flex: 1 }}>
        <LoadingScreen />
      </View>
    );
  }

  // Fallback loading screen
  return (
    <View style={{ flex: 1 }}>
      <LoadingScreen />
    </View>
  );
}