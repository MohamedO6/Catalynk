import { useEffect } from 'react';
import { router, useRootNavigationState } from 'expo-router';
import { View } from 'react-native';
import { useAuth } from '@/contexts/AuthContext';
import LoadingScreen from '@/components/LoadingScreen';

export default function Index() {
  const { user, loading } = useAuth();
  const rootNavigationState = useRootNavigationState();

  useEffect(() => {
    // Wait for both auth loading to complete AND root navigation to be ready
    if (!loading && rootNavigationState?.key) {
      if (user) {
        router.replace('/(tabs)');
      } else {
        router.replace('/onboarding');
      }
    }
  }, [user, loading, rootNavigationState?.key]);

  return (
    <View style={{ flex: 1 }}>
      <LoadingScreen />
    </View>
  );
}