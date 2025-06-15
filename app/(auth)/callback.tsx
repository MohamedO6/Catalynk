import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { useTheme } from '@/contexts/ThemeContext';
import { supabase } from '@/lib/supabase';
import LoadingScreen from '@/components/LoadingScreen';

export default function AuthCallback() {
  const { colors } = useTheme();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        console.log('Auth callback triggered');
        
        // Small delay to ensure URL processing is complete
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Get the current session after OAuth redirect
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();

        if (sessionError) {
          console.error('Session error:', sessionError);
          setError(sessionError.message);
          setTimeout(() => router.replace('/(auth)/welcome'), 3000);
          return;
        }

        if (session?.user) {
          console.log('User authenticated successfully:', session.user.email);
          
          // Check if user has completed profile setup
          const { data: profiles } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', session.user.id)
            .limit(1);

          const profile = profiles && profiles.length > 0 ? profiles[0] : null;

          if (profile?.role) {
            // User has completed setup, go to main app
            console.log('User has role, redirecting to main app');
            router.replace('/(tabs)');
          } else {
            // User needs to complete role selection
            console.log('User needs role selection');
            router.replace('/(auth)/role-selection');
          }
        } else {
          setError('No session found');
          setTimeout(() => router.replace('/(auth)/welcome'), 3000);
        }
      } catch (error) {
        console.error('Auth callback error:', error);
        setError('Authentication failed');
        setTimeout(() => router.replace('/(auth)/welcome'), 3000);
      }
    };

    handleAuthCallback();
  }, []);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: colors.background,
      padding: 20,
    },
    errorText: {
      fontSize: 16,
      fontFamily: 'Inter-Medium',
      color: colors.error,
      textAlign: 'center',
      marginTop: 20,
    },
    redirectText: {
      fontSize: 14,
      fontFamily: 'Inter-Regular',
      color: colors.textSecondary,
      textAlign: 'center',
      marginTop: 10,
    },
  });

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Authentication Error: {error}</Text>
        <Text style={styles.redirectText}>Redirecting to login...</Text>
      </View>
    );
  }

  return <LoadingScreen />;
}