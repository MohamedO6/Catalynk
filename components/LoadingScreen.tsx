import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Mic } from 'lucide-react-native';
import { useTheme } from '@/contexts/ThemeContext';

export default function LoadingScreen() {
  const { colors } = useTheme();

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: colors.background,
    },
    gradient: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      width: '100%',
    },
    logoContainer: {
      alignItems: 'center',
      marginBottom: 40,
    },
    logo: {
      width: 80,
      height: 80,
      borderRadius: 40,
      backgroundColor: colors.primary,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 20,
    },
    appName: {
      fontSize: 32,
      fontFamily: 'Inter-Bold',
      color: colors.text,
      textAlign: 'center',
    },
    tagline: {
      fontSize: 16,
      fontFamily: 'Inter-Medium',
      color: colors.textSecondary,
      textAlign: 'center',
      marginTop: 8,
    },
    loadingText: {
      fontSize: 16,
      fontFamily: 'Inter-Medium',
      color: colors.textSecondary,
      marginTop: 20,
    },
  });

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[colors.background, colors.surface]}
        style={styles.gradient}
      >
        <View style={styles.logoContainer}>
          <View style={styles.logo}>
            <Mic size={40} color="#FFFFFF" />
          </View>
          <Text style={styles.appName}>PodSnap</Text>
          <Text style={styles.tagline}>AI-Powered Podcast Creation</Text>
        </View>
        <Text style={styles.loadingText}>Loading...</Text>
      </LinearGradient>
    </View>
  );
}