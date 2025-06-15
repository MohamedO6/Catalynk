import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withRepeat,
  withTiming,
  withSequence,
  withDelay,
  interpolate,
  Easing
} from 'react-native-reanimated';
import { Zap, Sparkles, Rocket } from 'lucide-react-native';
import { useTheme } from '@/contexts/ThemeContext';

const { width, height } = Dimensions.get('window');

export default function LoadingScreen() {
  const { colors } = useTheme();
  
  const scale = useSharedValue(1);
  const opacity = useSharedValue(0.7);
  const rotation = useSharedValue(0);
  const sparkleScale = useSharedValue(0);
  const rocketY = useSharedValue(0);
  const progressWidth = useSharedValue(0);

  React.useEffect(() => {
    // Main logo animation
    scale.value = withRepeat(
      withSequence(
        withTiming(1.2, { duration: 1000, easing: Easing.inOut(Easing.quad) }),
        withTiming(1, { duration: 1000, easing: Easing.inOut(Easing.quad) })
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

    // Rotation animation for the main icon
    rotation.value = withRepeat(
      withTiming(360, { duration: 3000, easing: Easing.linear }),
      -1,
      false
    );

    // Sparkle animations with delays
    sparkleScale.value = withDelay(
      500,
      withRepeat(
        withSequence(
          withTiming(1, { duration: 800 }),
          withTiming(0, { duration: 800 })
        ),
        -1,
        false
      )
    );

    // Rocket animation
    rocketY.value = withRepeat(
      withSequence(
        withTiming(-20, { duration: 1500, easing: Easing.inOut(Easing.quad) }),
        withTiming(0, { duration: 1500, easing: Easing.inOut(Easing.quad) })
      ),
      -1,
      false
    );

    // Progress bar animation
    progressWidth.value = withRepeat(
      withSequence(
        withTiming(100, { duration: 2000, easing: Easing.inOut(Easing.quad) }),
        withTiming(0, { duration: 100 })
      ),
      -1,
      false
    );
  }, []);

  const logoAnimatedStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: scale.value },
      { rotate: `${rotation.value}deg` }
    ],
    opacity: opacity.value,
  }));

  const sparkleAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: sparkleScale.value }],
    opacity: sparkleScale.value,
  }));

  const rocketAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: rocketY.value }],
  }));

  const progressAnimatedStyle = useAnimatedStyle(() => ({
    width: `${progressWidth.value}%`,
  }));

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    gradient: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      width: '100%',
      position: 'relative',
    },
    logoContainer: {
      alignItems: 'center',
      marginBottom: 60,
      position: 'relative',
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
        height: 15,
      },
      shadowOpacity: 0.4,
      shadowRadius: 25,
      elevation: 20,
    },
    appName: {
      fontSize: 42,
      fontFamily: 'Inter-Bold',
      color: colors.text,
      textAlign: 'center',
      marginBottom: 8,
    },
    tagline: {
      fontSize: 18,
      fontFamily: 'Inter-Medium',
      color: colors.textSecondary,
      textAlign: 'center',
    },
    sparkleContainer: {
      position: 'absolute',
      top: -20,
      right: -20,
    },
    sparkle: {
      position: 'absolute',
    },
    sparkle1: {
      top: 10,
      right: 10,
    },
    sparkle2: {
      top: 40,
      right: -10,
    },
    sparkle3: {
      top: -10,
      right: 30,
    },
    rocketContainer: {
      position: 'absolute',
      bottom: -40,
      left: -30,
    },
    loadingContainer: {
      alignItems: 'center',
      marginTop: 40,
      width: '80%',
    },
    loadingText: {
      fontSize: 16,
      fontFamily: 'Inter-Medium',
      color: colors.textSecondary,
      marginBottom: 20,
    },
    progressBarContainer: {
      width: '100%',
      height: 4,
      backgroundColor: colors.border,
      borderRadius: 2,
      overflow: 'hidden',
    },
    progressBar: {
      height: '100%',
      backgroundColor: colors.primary,
      borderRadius: 2,
    },
    dotsContainer: {
      flexDirection: 'row',
      marginTop: 20,
    },
    dot: {
      width: 8,
      height: 8,
      borderRadius: 4,
      backgroundColor: colors.primary,
      marginHorizontal: 4,
    },
    statusText: {
      fontSize: 14,
      fontFamily: 'Inter-Regular',
      color: colors.textTertiary,
      marginTop: 16,
      textAlign: 'center',
    },
  });

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[colors.primary + '08', colors.background, colors.primary + '05']}
        style={styles.gradient}
      >
        <View style={styles.logoContainer}>
          <Animated.View style={[styles.logo, logoAnimatedStyle]}>
            <Zap size={60} color="#FFFFFF" />
            
            {/* Sparkles around the logo */}
            <View style={styles.sparkleContainer}>
              <Animated.View style={[styles.sparkle, styles.sparkle1, sparkleAnimatedStyle]}>
                <Sparkles size={16} color={colors.warning} />
              </Animated.View>
              <Animated.View style={[styles.sparkle, styles.sparkle2, sparkleAnimatedStyle]}>
                <Sparkles size={12} color={colors.success} />
              </Animated.View>
              <Animated.View style={[styles.sparkle, styles.sparkle3, sparkleAnimatedStyle]}>
                <Sparkles size={14} color={colors.secondary} />
              </Animated.View>
            </View>

            {/* Rocket animation */}
            <Animated.View style={[styles.rocketContainer, rocketAnimatedStyle]}>
              <Rocket size={24} color={colors.accent} />
            </Animated.View>
          </Animated.View>

          <Text style={styles.appName}>Catalynk</Text>
          <Text style={styles.tagline}>Where Innovation Meets Opportunity</Text>
        </View>

        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Initializing your experience...</Text>
          
          <View style={styles.progressBarContainer}>
            <Animated.View style={[styles.progressBar, progressAnimatedStyle]} />
          </View>

          <View style={styles.dotsContainer}>
            <Animated.View style={[styles.dot, { opacity: 1 }]} />
            <Animated.View style={[styles.dot, { opacity: 0.7 }]} />
            <Animated.View style={[styles.dot, { opacity: 0.4 }]} />
          </View>

          <Text style={styles.statusText}>
            Setting up your workspace...
          </Text>
        </View>
      </LinearGradient>
    </View>
  );
}