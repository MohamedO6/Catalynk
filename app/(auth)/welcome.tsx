import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withSpring,
  withDelay,
  runOnJS
} from 'react-native-reanimated';
import { Zap, Github, Chrome, Linkedin } from 'lucide-react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { signInWithOAuth } from '@/lib/auth';

const { width } = Dimensions.get('window');

export default function Welcome() {
  const { colors } = useTheme();
  const [loading, setLoading] = useState<string | null>(null);
  
  const logoScale = useSharedValue(0);
  const titleOpacity = useSharedValue(0);
  const buttonsOpacity = useSharedValue(0);

  React.useEffect(() => {
    logoScale.value = withSpring(1, { damping: 15, stiffness: 150 });
    titleOpacity.value = withDelay(300, withSpring(1));
    buttonsOpacity.value = withDelay(600, withSpring(1));
  }, []);

  const handleSocialSignIn = async (provider: 'google' | 'github') => {
    setLoading(provider);
    
    try {
      const { data, error } = await signInWithOAuth(provider);
      
      if (error) {
        Alert.alert('Authentication Error', error.message);
      } else if (data?.user) {
        // Check if user has completed profile setup
        router.replace('/(auth)/role-selection');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to authenticate. Please try again.');
    } finally {
      setLoading(null);
    }
  };

  const logoAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: logoScale.value }],
  }));

  const titleAnimatedStyle = useAnimatedStyle(() => ({
    opacity: titleOpacity.value,
    transform: [{ translateY: (1 - titleOpacity.value) * 20 }],
  }));

  const buttonsAnimatedStyle = useAnimatedStyle(() => ({
    opacity: buttonsOpacity.value,
    transform: [{ translateY: (1 - buttonsOpacity.value) * 30 }],
  }));

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
      width: 120,
      height: 120,
      borderRadius: 60,
      backgroundColor: colors.primary,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 30,
      shadowColor: colors.primary,
      shadowOffset: {
        width: 0,
        height: 10,
      },
      shadowOpacity: 0.3,
      shadowRadius: 20,
      elevation: 15,
    },
    appName: {
      fontSize: 48,
      fontFamily: 'Inter-Bold',
      color: colors.text,
      textAlign: 'center',
      marginBottom: 8,
    },
    tagline: {
      fontSize: 20,
      fontFamily: 'Inter-Medium',
      color: colors.textSecondary,
      textAlign: 'center',
    },
    buttonsContainer: {
      marginTop: 60,
    },
    primaryButton: {
      backgroundColor: colors.primary,
      paddingVertical: 18,
      borderRadius: 16,
      marginBottom: 16,
      alignItems: 'center',
      shadowColor: colors.primary,
      shadowOffset: {
        width: 0,
        height: 4,
      },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 8,
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
      borderRadius: 16,
      marginBottom: 32,
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
      borderRadius: 16,
      marginBottom: 12,
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
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
      lineHeight: 20,
    },
  });

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[colors.primary + '05', colors.background]}
        style={styles.gradient}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.logoContainer}>
            <Animated.View style={[styles.logo, logoAnimatedStyle]}>
              <Zap size={60} color="#FFFFFF" />
            </Animated.View>
            <Animated.View style={titleAnimatedStyle}>
              <Text style={styles.appName}>Catalynk</Text>
              <Text style={styles.tagline}>Where Innovation Meets Opportunity</Text>
            </Animated.View>
          </View>

          <Animated.View style={[styles.buttonsContainer, buttonsAnimatedStyle]}>
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
          </Animated.View>

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