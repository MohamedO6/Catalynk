import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withSpring,
  withTiming,
  interpolate,
  runOnJS
} from 'react-native-reanimated';
import { Lightbulb, Users, DollarSign, Sparkles } from 'lucide-react-native';
import { useTheme } from '@/contexts/ThemeContext';

const { width } = Dimensions.get('window');

const onboardingData = [
  {
    icon: Lightbulb,
    title: 'Turn Ideas into Reality',
    description: 'Connect with talented freelancers and passionate investors to bring your startup vision to life.',
    color: '#F59E0B',
  },
  {
    icon: Users,
    title: 'AI-Powered Matching',
    description: 'Our intelligent system matches you with the perfect collaborators based on skills, interests, and goals.',
    color: '#3B82F6',
  },
  {
    icon: DollarSign,
    title: 'Secure Blockchain Funding',
    description: 'Transparent, trustless funding through Algorand smart contracts with milestone-based releases.',
    color: '#10B981',
  },
  {
    icon: Sparkles,
    title: 'Voice & Video AI',
    description: 'Generate compelling project pitches with AI voices and personalized video introductions.',
    color: '#8B5CF6',
  },
];

export default function Onboarding() {
  const { colors } = useTheme();
  const [currentIndex, setCurrentIndex] = useState(0);
  const slideX = useSharedValue(0);
  const opacity = useSharedValue(1);

  const nextSlide = () => {
    if (currentIndex < onboardingData.length - 1) {
      opacity.value = withTiming(0, { duration: 200 }, () => {
        runOnJS(setCurrentIndex)(currentIndex + 1);
        opacity.value = withTiming(1, { duration: 300 });
      });
    } else {
      router.push('/(auth)/welcome');
    }
  };

  const skip = () => {
    router.push('/(auth)/welcome');
  };

  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
      transform: [
        {
          translateX: interpolate(
            opacity.value,
            [0, 1],
            [50, 0]
          )
        }
      ]
    };
  });

  const iconAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          scale: withSpring(opacity.value, {
            damping: 15,
            stiffness: 150,
          })
        }
      ]
    };
  });

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    gradient: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: 20,
    },
    slideContainer: {
      alignItems: 'center',
      justifyContent: 'center',
      width: width - 40,
    },
    iconContainer: {
      width: 120,
      height: 120,
      borderRadius: 60,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 40,
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 10,
      },
      shadowOpacity: 0.25,
      shadowRadius: 20,
      elevation: 10,
    },
    title: {
      fontSize: 32,
      fontFamily: 'Inter-Bold',
      color: colors.text,
      textAlign: 'center',
      marginBottom: 20,
    },
    description: {
      fontSize: 18,
      fontFamily: 'Inter-Regular',
      color: colors.textSecondary,
      textAlign: 'center',
      lineHeight: 26,
      marginBottom: 60,
    },
    buttonContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      width: '100%',
      paddingHorizontal: 20,
      paddingBottom: 50,
    },
    skipButton: {
      paddingVertical: 12,
      paddingHorizontal: 24,
    },
    skipText: {
      fontSize: 16,
      fontFamily: 'Inter-Medium',
      color: colors.textSecondary,
    },
    nextButton: {
      backgroundColor: colors.primary,
      paddingVertical: 16,
      paddingHorizontal: 32,
      borderRadius: 25,
      minWidth: 120,
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
    nextText: {
      fontSize: 16,
      fontFamily: 'Inter-SemiBold',
      color: '#FFFFFF',
    },
    dotsContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
      marginBottom: 40,
    },
    dot: {
      width: 8,
      height: 8,
      borderRadius: 4,
      marginHorizontal: 4,
    },
    activeDot: {
      backgroundColor: colors.primary,
      width: 24,
    },
    inactiveDot: {
      backgroundColor: colors.border,
    },
  });

  const currentSlide = onboardingData[currentIndex];
  const Icon = currentSlide.icon;

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[colors.background, colors.surface]}
        style={styles.gradient}
      >
        <Animated.View style={[styles.slideContainer, animatedStyle]}>
          <Animated.View style={[iconAnimatedStyle]}>
            <LinearGradient
              colors={[currentSlide.color + '20', currentSlide.color + '10']}
              style={styles.iconContainer}
            >
              <Icon size={60} color={currentSlide.color} />
            </LinearGradient>
          </Animated.View>
          <Text style={styles.title}>{currentSlide.title}</Text>
          <Text style={styles.description}>{currentSlide.description}</Text>
        </Animated.View>

        <View style={styles.dotsContainer}>
          {onboardingData.map((_, index) => (
            <Animated.View
              key={index}
              style={[
                styles.dot,
                index === currentIndex ? styles.activeDot : styles.inactiveDot,
              ]}
            />
          ))}
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.skipButton} onPress={skip}>
            <Text style={styles.skipText}>Skip</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.nextButton} onPress={nextSlide}>
            <Text style={styles.nextText}>
              {currentIndex === onboardingData.length - 1 ? 'Get Started' : 'Next'}
            </Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </View>
  );
}