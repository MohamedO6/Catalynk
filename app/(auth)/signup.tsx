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
import { ArrowLeft, Eye, EyeOff, CircleCheck as CheckCircle, CircleAlert as AlertCircle } from 'lucide-react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { signUp, UserRole } from '@/lib/auth';

export default function SignUp() {
  const { colors } = useTheme();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleInputChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
    // Clear error when user starts typing
    if (error) setError(null);
    if (success) setSuccess(null);
  };

  const validateForm = () => {
    if (!formData.fullName.trim()) {
      setError('Please enter your full name');
      return false;
    }

    if (!formData.email.trim()) {
      setError('Please enter your email address');
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Please enter a valid email address');
      return false;
    }

    if (!formData.password) {
      setError('Please enter a password');
      return false;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return false;
    }

    return true;
  };

  const handleSignUp = async () => {
    setError(null);
    setSuccess(null);

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    
    try {
      const { data, error } = await signUp(formData.email, formData.password, {
        full_name: formData.fullName,
        role: 'founder' as UserRole, // Default role, can be changed later
      });

      if (error) {
        setError(error.message);
      } else if (data?.user) {
        if (data.user.email_confirmed_at) {
          // User is confirmed, redirect to role selection
          router.push('/(auth)/role-selection');
        } else {
          // User needs to confirm email
          setSuccess('Account created! Please check your email and click the confirmation link to continue.');
        }
      }
    } catch (error) {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getPasswordStrength = () => {
    const password = formData.password;
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
    inputFocused: {
      borderColor: colors.primary,
    },
    inputError: {
      borderColor: colors.error,
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
    signUpButton: {
      backgroundColor: colors.primary,
      paddingVertical: 18,
      borderRadius: 12,
      alignItems: 'center',
      marginTop: 20,
      marginBottom: 20,
      flexDirection: 'row',
      justifyContent: 'center',
    },
    signUpButtonDisabled: {
      opacity: 0.6,
    },
    signUpButtonText: {
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
    signInLink: {
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
        <Text style={styles.headerTitle}>Create Account</Text>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>Join Catalynk</Text>
        <Text style={styles.subtitle}>
          Connect with innovators, freelancers, and investors
        </Text>

        {error && (
          <View style={styles.errorContainer}>
            <AlertCircle size={20} color={colors.error} />
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

        {success && (
          <View style={styles.successContainer}>
            <CheckCircle size={20} color={colors.success} />
            <Text style={styles.successText}>{success}</Text>
          </View>
        )}

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Full Name</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your full name"
            placeholderTextColor={colors.textTertiary}
            value={formData.fullName}
            onChangeText={(value) => handleInputChange('fullName', value)}
            autoCapitalize="words"
            autoComplete="name"
          />
        </View>

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
              autoComplete="new-password"
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
          {formData.password ? (
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
          ) : null}
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Confirm Password</Text>
          <View style={styles.passwordContainer}>
            <TextInput
              style={[styles.input, styles.passwordInput]}
              placeholder="Confirm your password"
              placeholderTextColor={colors.textTertiary}
              secureTextEntry={!showConfirmPassword}
              autoComplete="new-password"
              value={formData.confirmPassword}
              onChangeText={(value) => handleInputChange('confirmPassword', value)}
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
            styles.signUpButton,
            loading && styles.signUpButtonDisabled,
          ]}
          onPress={handleSignUp}
          disabled={loading}
        >
          <Text style={styles.signUpButtonText}>
            {loading ? 'Creating Account...' : 'Create Account'}
          </Text>
          {loading && <ActivityIndicator size="small" color="#FFFFFF" />}
        </TouchableOpacity>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Already have an account?</Text>
          <TouchableOpacity onPress={() => router.push('/(auth)/signin')}>
            <Text style={styles.signInLink}>Sign In</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}