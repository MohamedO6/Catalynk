import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { router } from 'expo-router';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withSpring,
  withDelay
} from 'react-native-reanimated';
import { Lightbulb, Users, DollarSign, ArrowRight } from 'lucide-react-native';
import { useTheme } from '@/contexts/ThemeContext';

export type UserRole = 'founder' | 'freelancer' | 'investor';

const roles = [
  {
    id: 'founder' as UserRole,
    title: 'Founder',
    description: 'I have innovative ideas and want to build a startup',
    icon: Lightbulb,
    color: '#F59E0B',
    features: ['Project Creation', 'Team Building', 'Investor Connections', 'AI Matching'],
  },
  {
    id: 'freelancer' as UserRole,
    title: 'Freelancer',
    description: 'I offer skills and services to help startups grow',
    icon: Users,
    color: '#3B82F6',
    features: ['Project Discovery', 'Skill Showcase', 'Portfolio Building', 'Secure Payments'],
  },
  {
    id: 'investor' as UserRole,
    title: 'Investor',
    description: 'I want to fund promising startups and entrepreneurs',
    icon: DollarSign,
    color: '#10B981',
    features: ['Deal Flow', 'Due Diligence', 'Portfolio Tracking', 'Blockchain Escrow'],
  },
];

export default function RoleSelection() {
  const { colors } = useTheme();
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  
  const titleOpacity = useSharedValue(0);
  const cardsOpacity = useSharedValue(0);

  React.useEffect(() => {
    titleOpacity.value = withSpring(1);
    cardsOpacity.value = withDelay(300, withSpring(1));
  }, []);

  const handleContinue = () => {
    if (selectedRole) {
      router.replace('/(tabs)');
    }
  };

  const titleAnimatedStyle = useAnimatedStyle(() => ({
    opacity: titleOpacity.value,
    transform: [{ translateY: (1 - titleOpacity.value) * 20 }],
  }));

  const cardsAnimatedStyle = useAnimatedStyle(() => ({
    opacity: cardsOpacity.value,
    transform: [{ translateY: (1 - cardsOpacity.value) * 30 }],
  }));

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    scrollContainer: {
      flexGrow: 1,
      paddingHorizontal: 20,
      paddingTop: 80,
    },
    titleContainer: {
      alignItems: 'center',
      marginBottom: 40,
    },
    title: {
      fontSize: 32,
      fontFamily: 'Inter-Bold',
      color: colors.text,
      textAlign: 'center',
      marginBottom: 12,
    },
    subtitle: {
      fontSize: 18,
      fontFamily: 'Inter-Regular',
      color: colors.textSecondary,
      textAlign: 'center',
    },
    roleCard: {
      backgroundColor: colors.card,
      borderWidth: 2,
      borderColor: colors.border,
      borderRadius: 20,
      padding: 24,
      marginBottom: 16,
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 4,
      },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 5,
    },
    roleCardSelected: {
      borderColor: colors.primary,
      backgroundColor: colors.primary + '08',
      shadowColor: colors.primary,
      shadowOpacity: 0.2,
    },
    roleHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 16,
    },
    roleIconContainer: {
      width: 60,
      height: 60,
      borderRadius: 30,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 16,
    },
    roleIconContainerSelected: {
      backgroundColor: colors.primary,
    },
    roleContent: {
      flex: 1,
    },
    roleTitle: {
      fontSize: 24,
      fontFamily: 'Inter-Bold',
      color: colors.text,
      marginBottom: 4,
    },
    roleDescription: {
      fontSize: 16,
      fontFamily: 'Inter-Regular',
      color: colors.textSecondary,
      lineHeight: 22,
    },
    featuresContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      marginTop: 16,
    },
    featureTag: {
      backgroundColor: colors.surface,
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 20,
      marginRight: 8,
      marginBottom: 8,
    },
    featureTagSelected: {
      backgroundColor: colors.primary + '20',
    },
    featureText: {
      fontSize: 14,
      fontFamily: 'Inter-Medium',
      color: colors.textSecondary,
    },
    featureTextSelected: {
      color: colors.primary,
    },
    continueButton: {
      backgroundColor: colors.primary,
      paddingVertical: 18,
      borderRadius: 16,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: 30,
      marginBottom: 40,
      shadowColor: colors.primary,
      shadowOffset: {
        width: 0,
        height: 4,
      },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 8,
    },
    continueButtonDisabled: {
      backgroundColor: colors.border,
      shadowOpacity: 0,
    },
    continueButtonText: {
      fontSize: 18,
      fontFamily: 'Inter-SemiBold',
      color: '#FFFFFF',
      marginRight: 8,
    },
  });

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View style={[styles.titleContainer, titleAnimatedStyle]}>
          <Text style={styles.title}>Choose Your Role</Text>
          <Text style={styles.subtitle}>
            Select the role that best describes you to get personalized features
          </Text>
        </Animated.View>

        <Animated.View style={cardsAnimatedStyle}>
          {roles.map((role, index) => {
            const isSelected = selectedRole === role.id;
            const Icon = role.icon;

            return (
              <TouchableOpacity
                key={role.id}
                style={[
                  styles.roleCard,
                  isSelected && styles.roleCardSelected,
                ]}
                onPress={() => setSelectedRole(role.id)}
              >
                <View style={styles.roleHeader}>
                  <View style={[
                    styles.roleIconContainer,
                    { backgroundColor: isSelected ? role.color : role.color + '20' },
                    isSelected && styles.roleIconContainerSelected,
                  ]}>
                    <Icon
                      size={28}
                      color={isSelected ? '#FFFFFF' : role.color}
                    />
                  </View>
                  <View style={styles.roleContent}>
                    <Text style={styles.roleTitle}>{role.title}</Text>
                    <Text style={styles.roleDescription}>{role.description}</Text>
                  </View>
                </View>

                <View style={styles.featuresContainer}>
                  {role.features.map((feature, featureIndex) => (
                    <View
                      key={featureIndex}
                      style={[
                        styles.featureTag,
                        isSelected && styles.featureTagSelected,
                      ]}
                    >
                      <Text style={[
                        styles.featureText,
                        isSelected && styles.featureTextSelected,
                      ]}>
                        {feature}
                      </Text>
                    </View>
                  ))}
                </View>
              </TouchableOpacity>
            );
          })}

          <TouchableOpacity
            style={[
              styles.continueButton,
              !selectedRole && styles.continueButtonDisabled,
            ]}
            onPress={handleContinue}
            disabled={!selectedRole}
          >
            <Text style={styles.continueButtonText}>Continue</Text>
            <ArrowRight size={20} color="#FFFFFF" />
          </TouchableOpacity>
        </Animated.View>
      </ScrollView>
    </View>
  );
}