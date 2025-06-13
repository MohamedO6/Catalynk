import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { router } from 'expo-router';
import { ArrowLeft, Eye, EyeOff, CircleAlert as AlertCircle } from 'lucide-react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { signIn, resetPassword } from '@/lib/auth';

export default function SignIn() {
  const { colors } = useTheme();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resetMessage, setResetMessage] = useState<string | null>(null);

  const handleInputChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
    // Clear error when user starts typing
    if (error) setError(null);
    if (resetMessage) setResetMessage(null);
  };

  const validateForm = () => {
    if (!formData.email.trim()) {
      setError('Please enter your email address');
      return false;
    }

    if (!formData.password) {
      setError('Please enter your password');
      return false;
    }

    return true;
  };

  const handleSignIn = async () => {
    setError(null);

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    
    try {
      const { data, error } = await signIn(formData.email, formData.password);

      if (error) {
        setError(error.message);
      } else if (data?.user) {
        router.replace('/(tabs)');
      }
    } catch (error) {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!formData.email.trim()) {
      setError('Please enter your email address first');
      return;
    }

    setResetLoading(true);
    setError(null);

    try {
      const { error } = await resetPassword(formData.email);

      if (error) {
        setError(error.message);
      } else {
        setResetMessage('Password reset email sent! Check your inbox for instructions.');
      }
    } catch (error) {
      setError('Failed to send reset email. Please try again.');
    } finally {
      setResetLoading(false);
    }
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 20,
      paddingTop: 60,
      paddingBottom: 30,
    },
    backButton: {
      marginRight: 20,
    },
    headerTitle: {
      fontSize: 24,
      fontFamily: 'Inter-Bold',
      color: colors.text,
    },
    scrollContainer: {
      flexGrow: 1,
      paddingHorizontal: 20,
    },
    title: {
      fontSize: 32,
      fontFamily: 'Inter-Bold',
      color: colors.text,
      marginBottom: 8,
    },
    subtitle: {
      fontSize: 16,
      fontFamily: 'Inter-Regular',
      color: colors.textSecondary,
      marginBottom: 40,
    },
    errorContainer: {
      backgroundColor: colors.error + '20',
      borderWidth: 1,
      borderColor: colors.error + '40',
      borderRadius: 12,
      padding: 16,
      marginBottom: 20,
      flexDirection: 'row',
      alignItems: 'center',
    },
    successContainer: {
      backgroundColor: colors.success + '20',
      borderWidth: 1,
      borderColor: colors.success + '40',
      borderRadius: 12,
      padding: 16,
      marginBottom: 20,
      flexDirection: 'row',
      alignItems: 'center',
    },
    errorText: {
      fontSize: 14,
      fontFamily: 'Inter-Medium',
      color: colors.error,
      marginLeft: 12,
      flex: 1,
    },
    successText: {
      fontSize: 14,
      fontFamily: 'Inter-Medium',
      color: colors.success,
      marginLeft: 12,
      flex: 1,
    },
    inputContainer: {
      marginBottom: 20,
    },
    label: {
      fontSize: 16,
      fontFamily: 'Inter-Medium',
      color: colors.text,
      marginBottom: 8,
    },
    input: {
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 12,
      paddingVertical: 16,
      paddingHorizontal: 16,
      fontSize: 16,
      fontFamily: 'Inter-Regular',
      color: colors.text,
    },
    passwordContainer: {
      position: 'relative',
    },
    passwordInput: {
      paddingRight: 50,
    },
    eyeButton: {
      position: 'absolute',
      right: 16,
      top: 18,
    },
    forgotPasswordContainer: {
      alignItems: 'flex-end',
      marginBottom: 30,
    },
    forgotPassword: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    forgotPasswordText: {
      fontSize: 14,
      fontFamily: 'Inter-Medium',
      color: colors.primary,
      marginRight: 8,
    },
    signInButton: {
      backgroundColor: colors.primary,
      paddingVertical: 18,
      borderRadius: 12,
      alignItems: 'center',
      marginBottom: 20,
      flexDirection: 'row',
      justifyContent: 'center',
    },
    signInButtonDisabled: {
      opacity: 0.6,
    },
    signInButtonText: {
      fontSize: 18,
      fontFamily: 'Inter-SemiBold',
      color: '#FFFFFF',
      marginRight: 8,
    },
    footer: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: 20,
      marginBottom: 40,
    },
    footerText: {
      fontSize: 16,
      fontFamily: 'Inter-Regular',
      color: colors.textSecondary,
    },
    signUpLink: {
      fontSize: 16,
      fontFamily: 'Inter-SemiBold',
      color: colors.primary,
      marginLeft: 4,
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <ArrowLeft size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Sign In</Text>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>Welcome Back</Text>
        <Text style={styles.subtitle}>
          Sign in to continue your innovation journey
        </Text>

        {error && (
          <View style={styles.errorContainer}>
            <AlertCircle size={20} color={colors.error} />
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

        {resetMessage && (
          <View style={styles.successContainer}>
            <AlertCircle size={20} color={colors.success} />
            <Text style={styles.successText}>{resetMessage}</Text>
          </View>
        )}

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your email"
            placeholderTextColor={colors.textTertiary}
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
            value={formData.email}
            onChangeText={(value) => handleInputChange('email', value)}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Password</Text>
          <View style={styles.passwordContainer}>
            <TextInput
              style={[styles.input, styles.passwordInput]}
              placeholder="Enter your password"
              placeholderTextColor={colors.textTertiary}
              secureTextEntry={!showPassword}
              autoComplete="current-password"
              value={formData.password}
              onChangeText={(value) => handleInputChange('password', value)}
            />
            <TouchableOpacity
              style={styles.eyeButton}
              onPress={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <EyeOff size={20} color={colors.textSecondary} />
              ) : (
                <Eye size={20} color={colors.textSecondary} />
              )}
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.forgotPasswordContainer}>
          <TouchableOpacity 
            style={styles.forgotPassword}
            onPress={handleForgotPassword}
            disabled={resetLoading}
          >
            <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
            {resetLoading && <ActivityIndicator size="small" color={colors.primary} />}
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={[
            styles.signInButton,
            loading && styles.signInButtonDisabled,
          ]}
          onPress={handleSignIn}
          disabled={loading}
        >
          <Text style={styles.signInButtonText}>
            {loading ? 'Signing In...' : 'Sign In'}
          </Text>
          {loading && <ActivityIndicator size="small" color="#FFFFFF" />}
        </TouchableOpacity>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Don't have an account?</Text>
          <TouchableOpacity onPress={() => router.push('/(auth)/signup')}>
            <Text style={styles.signUpLink}>Sign Up</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}