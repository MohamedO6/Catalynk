import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { router } from 'expo-router';
import { ArrowLeft, Crown, Check, CreditCard, Calendar, Users, Zap } from 'lucide-react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { useAuth } from '@/contexts/AuthContext';

const subscriptionFeatures = {
  free: [
    'Create up to 3 projects',
    'Basic community access',
    'Standard matching',
    'Email support',
  ],
  pro: [
    'Unlimited projects',
    'AI-powered matching',
    'Priority community access',
    'Advanced analytics',
    'Voice AI pitch generation',
    'Video AI introductions',
    'Blockchain escrow access',
    'Priority support',
    'Early access to new features',
    'Verified badge',
  ],
};

export default function SubscriptionManagement() {
  const { colors } = useTheme();
  const { profile } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleUpgrade = () => {
    Alert.alert(
      'Upgrade to Pro',
      'This would integrate with RevenueCat for mobile subscriptions. For web, we would use Stripe Billing.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Continue', 
          onPress: () => {
            Alert.alert('Success', 'Subscription upgraded successfully!');
          }
        }
      ]
    );
  };

  const handleManageBilling = () => {
    Alert.alert('Manage Billing', 'This would open the billing portal for subscription management.');
  };

  const handleCancelSubscription = () => {
    Alert.alert(
      'Cancel Subscription',
      'Are you sure you want to cancel your Pro subscription? You will lose access to premium features.',
      [
        { text: 'Keep Subscription', style: 'cancel' },
        { 
          text: 'Cancel', 
          style: 'destructive',
          onPress: () => {
            Alert.alert('Cancelled', 'Your subscription has been cancelled.');
          }
        }
      ]
    );
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
      paddingBottom: 20,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
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
      flex: 1,
      padding: 20,
    },
    currentPlanCard: {
      backgroundColor: colors.card,
      borderRadius: 16,
      padding: 20,
      marginBottom: 24,
      borderWidth: 1,
      borderColor: colors.border,
    },
    currentPlanHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 16,
    },
    planIcon: {
      width: 48,
      height: 48,
      borderRadius: 24,
      backgroundColor: colors.primary + '20',
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 16,
    },
    planInfo: {
      flex: 1,
    },
    planName: {
      fontSize: 20,
      fontFamily: 'Inter-Bold',
      color: colors.text,
    },
    planPrice: {
      fontSize: 16,
      fontFamily: 'Inter-Medium',
      color: colors.textSecondary,
    },
    planStatus: {
      backgroundColor: colors.success + '20',
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 8,
    },
    planStatusText: {
      fontSize: 12,
      fontFamily: 'Inter-Bold',
      color: colors.success,
    },
    featuresTitle: {
      fontSize: 16,
      fontFamily: 'Inter-Bold',
      color: colors.text,
      marginBottom: 12,
    },
    featuresList: {
      marginBottom: 20,
    },
    featureItem: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 8,
    },
    featureText: {
      fontSize: 14,
      fontFamily: 'Inter-Regular',
      color: colors.textSecondary,
      marginLeft: 12,
    },
    actionsContainer: {
      marginTop: 20,
    },
    actionButton: {
      backgroundColor: colors.primary,
      paddingVertical: 16,
      borderRadius: 12,
      alignItems: 'center',
      marginBottom: 12,
      flexDirection: 'row',
      justifyContent: 'center',
    },
    secondaryButton: {
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.border,
    },
    dangerButton: {
      backgroundColor: colors.error + '20',
      borderWidth: 1,
      borderColor: colors.error + '40',
    },
    buttonText: {
      fontSize: 16,
      fontFamily: 'Inter-SemiBold',
      color: '#FFFFFF',
      marginLeft: 8,
    },
    secondaryButtonText: {
      fontSize: 16,
      fontFamily: 'Inter-SemiBold',
      color: colors.text,
      marginLeft: 8,
    },
    dangerButtonText: {
      fontSize: 16,
      fontFamily: 'Inter-SemiBold',
      color: colors.error,
      marginLeft: 8,
    },
    billingInfo: {
      backgroundColor: colors.surface,
      borderRadius: 12,
      padding: 16,
      marginBottom: 24,
    },
    billingTitle: {
      fontSize: 16,
      fontFamily: 'Inter-Bold',
      color: colors.text,
      marginBottom: 12,
    },
    billingItem: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 8,
    },
    billingLabel: {
      fontSize: 14,
      fontFamily: 'Inter-Medium',
      color: colors.textSecondary,
    },
    billingValue: {
      fontSize: 14,
      fontFamily: 'Inter-SemiBold',
      color: colors.text,
    },
    usageStats: {
      backgroundColor: colors.surface,
      borderRadius: 12,
      padding: 16,
      marginBottom: 24,
    },
    usageTitle: {
      fontSize: 16,
      fontFamily: 'Inter-Bold',
      color: colors.text,
      marginBottom: 12,
    },
    usageItem: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 8,
    },
    usageLabel: {
      fontSize: 14,
      fontFamily: 'Inter-Medium',
      color: colors.textSecondary,
    },
    usageValue: {
      fontSize: 14,
      fontFamily: 'Inter-SemiBold',
      color: colors.text,
    },
    usageBar: {
      height: 4,
      backgroundColor: colors.border,
      borderRadius: 2,
      marginTop: 4,
    },
    usageProgress: {
      height: '100%',
      backgroundColor: colors.primary,
      borderRadius: 2,
    },
  });

  const currentPlan = profile?.subscription_tier || 'free';
  const features = subscriptionFeatures[currentPlan as keyof typeof subscriptionFeatures];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <ArrowLeft size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Subscription</Text>
      </View>

      <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        <View style={styles.currentPlanCard}>
          <View style={styles.currentPlanHeader}>
            <View style={styles.planIcon}>
              {currentPlan === 'pro' ? (
                <Crown size={24} color={colors.primary} />
              ) : (
                <Users size={24} color={colors.primary} />
              )}
            </View>
            <View style={styles.planInfo}>
              <Text style={styles.planName}>
                {currentPlan === 'pro' ? 'Catalynk Pro' : 'Free Plan'}
              </Text>
              <Text style={styles.planPrice}>
                {currentPlan === 'pro' ? '$29/month' : 'Free forever'}
              </Text>
            </View>
            <View style={styles.planStatus}>
              <Text style={styles.planStatusText}>Active</Text>
            </View>
          </View>

          <Text style={styles.featuresTitle}>Plan Features</Text>
          <View style={styles.featuresList}>
            {features.map((feature, index) => (
              <View key={index} style={styles.featureItem}>
                <Check size={16} color={colors.success} />
                <Text style={styles.featureText}>{feature}</Text>
              </View>
            ))}
          </View>
        </View>

        {currentPlan === 'pro' && (
          <View style={styles.billingInfo}>
            <Text style={styles.billingTitle}>Billing Information</Text>
            <View style={styles.billingItem}>
              <Text style={styles.billingLabel}>Next billing date</Text>
              <Text style={styles.billingValue}>March 15, 2024</Text>
            </View>
            <View style={styles.billingItem}>
              <Text style={styles.billingLabel}>Payment method</Text>
              <Text style={styles.billingValue}>•••• 4242</Text>
            </View>
            <View style={styles.billingItem}>
              <Text style={styles.billingLabel}>Amount</Text>
              <Text style={styles.billingValue}>$29.00</Text>
            </View>
          </View>
        )}

        <View style={styles.usageStats}>
          <Text style={styles.usageTitle}>Usage This Month</Text>
          <View style={styles.usageItem}>
            <Text style={styles.usageLabel}>Projects created</Text>
            <Text style={styles.usageValue}>
              {currentPlan === 'pro' ? '8' : '2/3'}
            </Text>
          </View>
          {currentPlan === 'free' && (
            <View style={styles.usageBar}>
              <View style={[styles.usageProgress, { width: '67%' }]} />
            </View>
          )}
          <View style={styles.usageItem}>
            <Text style={styles.usageLabel}>AI features used</Text>
            <Text style={styles.usageValue}>
              {currentPlan === 'pro' ? '24' : '0/0'}
            </Text>
          </View>
          <View style={styles.usageItem}>
            <Text style={styles.usageLabel}>Community posts</Text>
            <Text style={styles.usageValue}>12</Text>
          </View>
        </View>

        <View style={styles.actionsContainer}>
          {currentPlan === 'free' ? (
            <TouchableOpacity style={styles.actionButton} onPress={handleUpgrade}>
              <Crown size={20} color="#FFFFFF" />
              <Text style={styles.buttonText}>Upgrade to Pro</Text>
            </TouchableOpacity>
          ) : (
            <>
              <TouchableOpacity 
                style={[styles.actionButton, styles.secondaryButton]} 
                onPress={handleManageBilling}
              >
                <CreditCard size={20} color={colors.text} />
                <Text style={styles.secondaryButtonText}>Manage Billing</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={[styles.actionButton, styles.dangerButton]} 
                onPress={handleCancelSubscription}
              >
                <Calendar size={20} color={colors.error} />
                <Text style={styles.dangerButtonText}>Cancel Subscription</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </ScrollView>
    </View>
  );
}