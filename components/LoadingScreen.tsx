import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withRepeat,
  withTiming,
  withSequence
} from 'react-native-reanimated';
import { Zap } from 'lucide-react-native';
import { useTheme } from '@/contexts/ThemeContext';

export default function LoadingScreen() {
  const { colors } = useTheme();
  
  const scale = useSharedValue(1);
  const opacity = useSharedValue(0.7);

  React.useEffect(() => {
    scale.value = withRepeat(
      withSequence(
        withTiming(1.2, { duration: 1000 }),
        withTiming(1, { duration: 1000 })
      ),
      -1,
      false
    );
    
    opacity.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 1000 }),
        withTiming(0.7, { duration: 1000 })
      ),
      -1,
      false
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

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
      width: 100,
      height: 100,
      borderRadius: 50,
      backgroundColor: colors.primary,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 20,
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
      fontSize: 36,
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
        colors={[colors.primary + '05', colors.background]}
        style={styles.gradient}
      >
        <View style={styles.logoContainer}>
          <Animated.View style={[styles.logo, animatedStyle]}>
            <Zap size={50} color="#FFFFFF" />
          </Animated.View>
          <Text style={styles.appName}>Catalynk</Text>
          <Text style={styles.tagline}>Where Innovation Meets Opportunity</Text>
        </View>
        <Text style={styles.loadingText}>Loading...</Text>
      </LinearGradient>
    </View>
  );
}