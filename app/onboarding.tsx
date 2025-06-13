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
import { Mic, Sparkles, Share2, Crown } from 'lucide-react-native';
import { useTheme } from '@/contexts/ThemeContext';

const { width } = Dimensions.get('window');

const onboardingData = [
  {
    icon: Mic,
    title: 'Create Professional Podcasts',
    description: 'Generate high-quality podcast episodes using AI - no microphone or camera required.',
  },
  {
    icon: Sparkles,
    title: 'AI Script Generation',
    description: 'Let AI write engaging scripts, then convert them to natural-sounding voiceovers with ElevenLabs.',
  },
  {
    icon: Share2,
    title: 'Video Introductions',
    description: 'Create personalized video intros with AI avatars using Tavus technology.',
  },
  {
    icon: Crown,
    title: 'Publish as NFTs',
    description: 'Mint your podcasts as NFTs on Algorand blockchain and build your custom podcast website.',
  },
];

export default function Onboarding() {
  const { colors } = useTheme();
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = () => {
    if (currentIndex < onboardingData.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      router.push('/(auth)/welcome');
    }
  };

  const skip = () => {
    router.push('/(auth)/welcome');
  };

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
      backgroundColor: colors.primary + '20',
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 40,
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
      lineHeight: 24,
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
        <View style={styles.slideContainer}>
          <View style={styles.iconContainer}>
            <Icon size={60} color={colors.primary} />
          </View>
          <Text style={styles.title}>{currentSlide.title}</Text>
          <Text style={styles.description}>{currentSlide.description}</Text>
        </View>

        <View style={styles.dotsContainer}>
          {onboardingData.map((_, index) => (
            <View
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