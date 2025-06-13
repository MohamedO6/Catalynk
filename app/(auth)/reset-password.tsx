import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { ArrowLeft, Eye, EyeOff, CircleCheck as CheckCircle, CircleAlert as AlertCircle } from 'lucide-react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { supabase } from '@/lib/supabase';

export default function ResetPassword() {
  const { colors } = useTheme();
  const { access_token, refresh_token } = useLocalSearchParams();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    // Set the session from URL parameters
    if (access_token && refresh_token) {
      supabase.auth.setSession({
        access_token: access_token as string,
        refresh_token: refresh_token as string,
      });
    }
  }, [access_token, refresh_token]);

  const validateForm = () => {
    if (!password) {
      setError('Please enter a new password');
      return false;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      return false;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return false;
    }

    return true;
  };

  const handleResetPassword = async () => {
    setError(null);

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase.auth.updateUser({
        password: password,
      });

      if (error) {
        setError(error.message);
      } else {
        setSuccess(true);
        setTimeout(() => {
          router.replace('/(tabs)');
        }, 2000);
      }
    } catch (error) {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getPasswordStrength = () => {
    if (!password) return { strength: 0, text: '', color: colors.textTertiary };

    let strength = 0;
    if (password.length >= 6) strength += 1;
    if (password.length >= 8) strength += 1;
    if (/[A-Z]/.test(password)) strength += 1;
    if (/[0-9]/.test(password)) strength += 1;
    if (/[^A-Za-z0-9]/.test(password)) strength += 1;

    if (strength <= 2) return { strength, text: 'Weak', color: colors.error };
    if (strength <= 3) return { strength, text: 'Fair', color: colors.warning };
    if (strength <= 4) return { strength, text: 'Good', color: colors.success };
    return { strength, text: 'Strong', color: colors.success };
  };

  const passwordStrength = getPasswordStrength();

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
    passwordStrengthContainer: {
      marginTop: 8,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    passwordStrengthBar: {
      flex: 1,
      height: 4,
      backgroundColor: colors.border,
      borderRadius: 2,
      marginRight: 12,
    },
    passwordStrengthFill: {
      height: '100%',
      borderRadius: 2,
    },
    passwordStrengthText: {
      fontSize: 12,
      fontFamily: 'Inter-Medium',
    },
    resetButton: {
      backgroundColor: colors.primary,
      paddingVertical: 18,
      borderRadius: 12,
      alignItems: 'center',
      marginTop: 20,
      marginBottom: 20,
      flexDirection: 'row',
      justifyContent: 'center',
    },
    resetButtonDisabled: {
      opacity: 0.6,
    },
    resetButtonText: {
      fontSize: 18,
      fontFamily: 'Inter-SemiBold',
      color: '#FFFFFF',
      marginRight: 8,
    },
  });

  if (success) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Password Reset</Text>
        </View>
        <View style={[styles.scrollContainer, { justifyContent: 'center', alignItems: 'center' }]}>
          <CheckCircle size={80} color={colors.success} />
          <Text style={[styles.title, { textAlign: 'center', marginTop: 20 }]}>
            Password Updated!
          </Text>
          <Text style={[styles.subtitle, { textAlign: 'center' }]}>
            Your password has been successfully updated. Redirecting to your dashboard...
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <ArrowLeft size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Reset Password</Text>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>Create New Password</Text>
        <Text style={styles.subtitle}>
          Enter a new password for your account
        </Text>

        {error && (
          <View style={styles.errorContainer}>
            <AlertCircle size={20} color={colors.error} />
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

        <View style={styles.inputContainer}>
          <Text style={styles.label}>New Password</Text>
          <View style={styles.passwordContainer}>
            <TextInput
              style={[styles.input, styles.passwordInput]}
              placeholder="Enter your new password"
              placeholderTextColor={colors.textTertiary}
              secureTextEntry={!showPassword}
              value={password}
              onChangeText={(value) => {
                setPassword(value);
                if (error) setError(null);
              }}
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
          {password && (
            <View style={styles.passwordStrengthContainer}>
              <View style={styles.passwordStrengthBar}>
                <View
                  style={[
                    styles.passwordStrengthFill,
                    {
                      width: `${(passwordStrength.strength / 5) * 100}%`,
                      backgroundColor: passwordStrength.color,
                    },
                  ]}
                />
              </View>
              <Text style={[styles.passwordStrengthText, { color: passwordStrength.color }]}>
                {passwordStrength.text}
              </Text>
            </View>
          )}
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Confirm New Password</Text>
          <View style={styles.passwordContainer}>
            <TextInput
              style={[styles.input, styles.passwordInput]}
              placeholder="Confirm your new password"
              placeholderTextColor={colors.textTertiary}
              secureTextEntry={!showConfirmPassword}
              value={confirmPassword}
              onChangeText={(value) => {
                setConfirmPassword(value);
                if (error) setError(null);
              }}
            />
            <TouchableOpacity
              style={styles.eyeButton}
              onPress={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? (
                <EyeOff size={20} color={colors.textSecondary} />
              ) : (
                <Eye size={20} color={colors.textSecondary} />
              )}
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity
          style={[
            styles.resetButton,
            loading && styles.resetButtonDisabled,
          ]}
          onPress={handleResetPassword}
          disabled={loading}
        >
          <Text style={styles.resetButtonText}>
            {loading ? 'Updating Password...' : 'Update Password'}
          </Text>
          {loading && <ActivityIndicator size="small" color="#FFFFFF" />}
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}