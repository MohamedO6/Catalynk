import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { useTheme } from '@/contexts/ThemeContext';
import { supabase } from '@/lib/supabase';
import LoadingScreen from '@/components/LoadingScreen';

export default function OAuthCallback() {
  const { colors } = useTheme();
  const params = useLocalSearchParams();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleOAuthCallback = async () => {
      try {
        // Extract tokens from URL parameters
        const { access_token, refresh_token, error: authError } = params;

        if (authError) {
          setError(authError as string);
          setTimeout(() => router.replace('/(auth)/welcome'), 3000);
          return;
        }

        if (access_token && refresh_token) {
          // Set the session with the tokens
          const { error: sessionError } = await supabase.auth.setSession({
            access_token: access_token as string,
            refresh_token: refresh_token as string,
          });

          if (sessionError) {
            setError(sessionError.message);
            setTimeout(() => router.replace('/(auth)/welcome'), 3000);
            return;
          }

          // Check if user has completed profile setup
          const { data: { user } } = await supabase.auth.getUser();
          
          if (user) {
            // Check if user has a profile with role
            const { data: profiles } = await supabase
              .from('profiles')
              .select('role')
              .eq('id', user.id)
              .limit(1);

            const profile = profiles && profiles.length > 0 ? profiles[0] : null;

            if (profile?.role) {
              // User has completed setup, go to main app
              router.replace('/(tabs)');
            } else {
              // User needs to complete role selection
              router.replace('/(auth)/role-selection');
            }
          } else {
            setError('Failed to authenticate user');
            setTimeout(() => router.replace('/(auth)/welcome'), 3000);
          }
        } else {
          setError('Missing authentication tokens');
          setTimeout(() => router.replace('/(auth)/welcome'), 3000);
        }
      } catch (error) {
        console.error('OAuth callback error:', error);
        setError('Authentication failed');
        setTimeout(() => router.replace('/(auth)/welcome'), 3000);
      }
    };

    handleOAuthCallback();
  }, [params]);

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