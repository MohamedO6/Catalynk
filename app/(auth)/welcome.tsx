import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Mic, Github, Chrome } from 'lucide-react-native';
import { useTheme } from '@/contexts/ThemeContext';

const { width } = Dimensions.get('window');

export default function Welcome() {
  const { colors } = useTheme();
  const [loading, setLoading] = useState<string | null>(null);

  const handleSocialSignIn = async (provider: 'google' | 'github') => {
    setLoading(provider);
    // Simulate OAuth flow
    setTimeout(() => {
      setLoading(null);
      router.replace('/(tabs)');
    }, 2000);
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    gradient: {
      flex: 1,
    },
    scrollContainer: {
      flexGrow: 1,
      justifyContent: 'center',
      paddingHorizontal: 20,
    },
    logoContainer: {
      alignItems: 'center',
      marginBottom: 60,
    },
    logo: {
      width: 100,
      height: 100,
      borderRadius: 50,
      backgroundColor: colors.primary,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 20,
    },
    appName: {
      fontSize: 42,
      fontFamily: 'Inter-Bold',
      color: colors.text,
      textAlign: 'center',
    },
    tagline: {
      fontSize: 18,
      fontFamily: 'Inter-Medium',
      color: colors.textSecondary,
      textAlign: 'center',
      marginTop: 8,
    },
    buttonsContainer: {
      marginTop: 60,
    },
    primaryButton: {
      backgroundColor: colors.primary,
      paddingVertical: 18,
      borderRadius: 12,
      marginBottom: 16,
      alignItems: 'center',
    },
    primaryButtonText: {
      fontSize: 18,
      fontFamily: 'Inter-SemiBold',
      color: '#FFFFFF',
    },
    secondaryButton: {
      backgroundColor: 'transparent',
      borderWidth: 2,
      borderColor: colors.border,
      paddingVertical: 16,
      borderRadius: 12,
      marginBottom: 24,
      alignItems: 'center',
    },
    secondaryButtonText: {
      fontSize: 18,
      fontFamily: 'Inter-SemiBold',
      color: colors.text,
    },
    divider: {
      flexDirection: 'row',
      alignItems: 'center',
      marginVertical: 24,
    },
    dividerLine: {
      flex: 1,
      height: 1,
      backgroundColor: colors.border,
    },
    dividerText: {
      marginHorizontal: 16,
      fontSize: 16,
      fontFamily: 'Inter-Medium',
      color: colors.textSecondary,
    },
    socialButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.border,
      paddingVertical: 16,
      borderRadius: 12,
      marginBottom: 12,
    },
    socialButtonDisabled: {
      opacity: 0.6,
    },
    socialButtonText: {
      fontSize: 16,
      fontFamily: 'Inter-SemiBold',
      color: colors.text,
      marginLeft: 12,
    },
    footer: {
      marginTop: 40,
      alignItems: 'center',
    },
    footerText: {
      fontSize: 14,
      fontFamily: 'Inter-Regular',
      color: colors.textTertiary,
      textAlign: 'center',
    },
  });

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[colors.background, colors.surface]}
        style={styles.gradient}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.logoContainer}>
            <View style={styles.logo}>
              <Mic size={50} color="#FFFFFF" />
            </View>
            <Text style={styles.appName}>PodSnap</Text>
            <Text style={styles.tagline}>AI-Powered Podcast Creation</Text>
          </View>

          <View style={styles.buttonsContainer}>
            <TouchableOpacity
              style={styles.primaryButton}
              onPress={() => router.push('/(auth)/signup')}
            >
              <Text style={styles.primaryButtonText}>Create Account</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.secondaryButton}
              onPress={() => router.push('/(auth)/signin')}
            >
              <Text style={styles.secondaryButtonText}>Sign In</Text>
            </TouchableOpacity>

            <View style={styles.divider}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>or continue with</Text>
              <View style={styles.dividerLine} />
            </View>

            <TouchableOpacity 
              style={[
                styles.socialButton,
                loading === 'google' && styles.socialButtonDisabled
              ]}
              onPress={() => handleSocialSignIn('google')}
              disabled={loading === 'google'}
            >
              {loading === 'google' ? (
                <ActivityIndicator size="small" color={colors.text} />
              ) : (
                <Chrome size={24} color={colors.text} />
              )}
              <Text style={styles.socialButtonText}>
                {loading === 'google' ? 'Connecting...' : 'Continue with Google'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[
                styles.socialButton,
                loading === 'github' && styles.socialButtonDisabled
              ]}
              onPress={() => handleSocialSignIn('github')}
              disabled={loading === 'github'}
            >
              {loading === 'github' ? (
                <ActivityIndicator size="small" color={colors.text} />
              ) : (
                <Github size={24} color={colors.text} />
              )}
              <Text style={styles.socialButtonText}>
                {loading === 'github' ? 'Connecting...' : 'Continue with GitHub'}
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>
              By continuing, you agree to our Terms of Service and Privacy Policy
            </Text>
          </View>
        </ScrollView>
      </LinearGradient>
    </View>
  );
}