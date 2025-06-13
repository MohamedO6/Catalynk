import { useEffect } from 'react';
import { router } from 'expo-router';
import { View } from 'react-native';
import { useAuth } from '@/contexts/AuthContext';
import LoadingScreen from '@/components/LoadingScreen';

export default function Index() {
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading) {
      if (user) {
        router.replace('/(tabs)');
      } else {
        router.replace('/onboarding');
      }
    }
  }, [user, loading]);

  return (
    <View style={{ flex: 1 }}>
      <LoadingScreen />
    </View>
  );
}