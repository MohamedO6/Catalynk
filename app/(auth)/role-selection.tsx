import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { router } from 'expo-router';
import { Lightbulb, Users, DollarSign, ArrowRight } from 'lucide-react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { UserRole } from '@/lib/auth';

const roles = [
  {
    id: 'founder' as UserRole,
    title: 'Founder',
    description: 'I have innovative ideas and want to build a startup',
    icon: Lightbulb,
    features: ['Project Creation', 'Team Building', 'Investor Connections', 'AI Matching'],
  },
  {
    id: 'freelancer' as UserRole,
    title: 'Freelancer',
    description: 'I offer skills and services to help startups grow',
    icon: Users,
    features: ['Project Discovery', 'Skill Showcase', 'Portfolio Building', 'Secure Payments'],
  },
  {
    id: 'investor' as UserRole,
    title: 'Investor',
    description: 'I want to fund promising startups and entrepreneurs',
    icon: DollarSign,
    features: ['Deal Flow', 'Due Diligence', 'Portfolio Tracking', 'Blockchain Escrow'],
  },
];

export default function RoleSelection() {
  const { colors } = useTheme();
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);

  const handleContinue = () => {
    if (selectedRole) {
      router.replace('/(tabs)');
    }
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    scrollContainer: {
      flexGrow: 1,
      paddingHorizontal: 20,
      paddingTop: 60,
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
      marginBottom: 40,
    },
    roleCard: {
      backgroundColor: colors.card,
      borderWidth: 2,
      borderColor: colors.border,
      borderRadius: 16,
      padding: 20,
      marginBottom: 16,
    },
    roleCardSelected: {
      borderColor: colors.primary,
      backgroundColor: colors.primary + '10',
    },
    roleHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 12,
    },
    roleIconContainer: {
      width: 50,
      height: 50,
      borderRadius: 25,
      backgroundColor: colors.primary + '20',
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 16,
    },
    roleIconContainerSelected: {
      backgroundColor: colors.primary,
    },
    roleTitle: {
      fontSize: 22,
      fontFamily: 'Inter-Bold',
      color: colors.text,
    },
    roleDescription: {
      fontSize: 16,
      fontFamily: 'Inter-Regular',
      color: colors.textSecondary,
      marginBottom: 16,
      lineHeight: 22,
    },
    featuresContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
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
      backgroundColor: colors.primary + '30',
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
      borderRadius: 12,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: 30,
      marginBottom: 40,
    },
    continueButtonDisabled: {
      backgroundColor: colors.border,
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
        <Text style={styles.title}>Choose Your Role</Text>
        <Text style={styles.subtitle}>
          Select the role that best describes you to get personalized features
        </Text>

        {roles.map((role) => {
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
                  isSelected && styles.roleIconContainerSelected,
                ]}>
                  <Icon
                    size={24}
                    color={isSelected ? '#FFFFFF' : colors.primary}
                  />
                </View>
                <Text style={styles.roleTitle}>{role.title}</Text>
              </View>

              <Text style={styles.roleDescription}>{role.description}</Text>

              <View style={styles.featuresContainer}>
                {role.features.map((feature, index) => (
                  <View
                    key={index}
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
      </ScrollView>
    </View>
  );
}