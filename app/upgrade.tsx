import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { ArrowLeft, Crown, Check, Zap, Users, MessageCircle, BarChart3, Shield, Sparkles, Rocket } from 'lucide-react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { useAuth } from '@/contexts/AuthContext';

const plans = [
  {
    id: 'free',
    name: 'Free',
    price: 0,
    period: 'forever',
    description: 'Perfect for getting started',
    features: [
      'Create up to 5-minute episodes',
      'Basic AI script generation',
      'Community access',
      'Standard audio quality',
    ],
    limitations: [
      'No voice AI features',
      'No video generation',
      'Limited episode length',
    ],
  },
  {
    id: 'pro',
    name: 'PodSnap Pro',
    price: 29,
    period: 'month',
    description: 'Unlock your full potential',
    features: [
      'Unlimited episode length',
      'Premium voice AI (ElevenLabs)',
      'Video AI generation (Tavus)',
      'Advanced script generation',
      'NFT minting on Algorand',
      'Custom domain creation',
      'Priority community access',
      'Advanced analytics',
      'Priority support',
      'Early access to new features',
    ],
    popular: true,
  },
];

const proFeatures = [
  {
    icon: Sparkles,
    title: 'Advanced AI Script Generation',
    description: 'Get more sophisticated and engaging podcast scripts with GPT-4 powered generation.',
  },
  {
    icon: MessageCircle,
    title: 'Voice AI with ElevenLabs',
    description: 'Convert your scripts into natural-sounding voiceovers with premium voice options.',
  },
  {
    icon: Rocket,
    title: 'Video AI with Tavus',
    description: 'Create personalized video introductions for your podcasts using AI avatars.',
  },
  {
    icon: Shield,
    title: 'NFT Publishing on Algorand',
    description: 'Mint your podcast episodes as NFTs on the Algorand blockchain for ownership and monetization.',
  },
  {
    icon: BarChart3,
    title: 'Advanced Analytics',
    description: 'Track your podcast performance with detailed insights and engagement metrics.',
  },
  {
    icon: Users,
    title: 'Custom Domain Creation',
    description: 'Get your own podcast website with Entri domain services (username.mypodsnap.tech).',
  },
];

export default function Upgrade() {
  const { colors } = useTheme();
  const { profile } = useAuth();
  const [selectedPlan, setSelectedPlan] = useState('pro');
  const [loading, setLoading] = useState(false);
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'yearly'>('monthly');

  const handleUpgrade = async (planId: string) => {
    if (planId === 'free') {
      Alert.alert('Already Free', 'You are already on the free plan.');
      return;
    }

    setLoading(true);
    
    try {
      // Simulate payment processing with RevenueCat
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      Alert.alert(
        'Upgrade Successful!',
        `Welcome to ${plans.find(p => p.id === planId)?.name}! Your account has been upgraded and all Pro features are now available.`,
        [
          {
            text: 'Continue',
            onPress: () => router.back()
          }
        ]
      );
    } catch (error) {
      Alert.alert('Upgrade Failed', 'There was an error processing your payment. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getDiscountedPrice = (price: number) => {
    return billingPeriod === 'yearly' ? Math.round(price * 0.8) : price;
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
    },
    backButton: {
      marginRight: 20,
    },
    headerTitle: {
      fontSize: 24,
      fontFamily: 'Inter-Bold',
      color: colors.text,
    },
    heroSection: {
      paddingHorizontal: 20,
      paddingBottom: 30,
      alignItems: 'center',
    },
    heroIcon: {
      width: 80,
      height: 80,
      borderRadius: 40,
      backgroundColor: colors.warning + '20',
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 20,
    },
    heroTitle: {
      fontSize: 32,
      fontFamily: 'Inter-Bold',
      color: colors.text,
      textAlign: 'center',
      marginBottom: 12,
    },
    heroSubtitle: {
      fontSize: 18,
      fontFamily: 'Inter-Regular',
      color: colors.textSecondary,
      textAlign: 'center',
      lineHeight: 24,
    },
    billingToggle: {
      flexDirection: 'row',
      backgroundColor: colors.surface,
      borderRadius: 12,
      padding: 4,
      marginHorizontal: 20,
      marginBottom: 30,
    },
    billingOption: {
      flex: 1,
      paddingVertical: 12,
      alignItems: 'center',
      borderRadius: 8,
    },
    billingOptionActive: {
      backgroundColor: colors.primary,
    },
    billingOptionText: {
      fontSize: 16,
      fontFamily: 'Inter-SemiBold',
      color: colors.textSecondary,
    },
    billingOptionTextActive: {
      color: '#FFFFFF',
    },
    discountBadge: {
      backgroundColor: colors.success,
      paddingHorizontal: 8,
      paddingVertical: 2,
      borderRadius: 8,
      marginTop: 4,
    },
    discountText: {
      fontSize: 10,
      fontFamily: 'Inter-Bold',
      color: '#FFFFFF',
    },
    plansContainer: {
      paddingHorizontal: 20,
    },
    planCard: {
      backgroundColor: colors.card,
      borderRadius: 16,
      padding: 24,
      marginBottom: 16,
      borderWidth: 2,
      borderColor: colors.border,
    },
    planCardPopular: {
      borderColor: colors.primary,
      position: 'relative',
    },
    popularBadge: {
      position: 'absolute',
      top: -12,
      left: 24,
      backgroundColor: colors.primary,
      paddingHorizontal: 12,
      paddingVertical: 4,
      borderRadius: 12,
    },
    popularText: {
      fontSize: 12,
      fontFamily: 'Inter-Bold',
      color: '#FFFFFF',
    },
    planHeader: {
      marginBottom: 20,
    },
    planName: {
      fontSize: 24,
      fontFamily: 'Inter-Bold',
      color: colors.text,
      marginBottom: 4,
    },
    planDescription: {
      fontSize: 16,
      fontFamily: 'Inter-Regular',
      color: colors.textSecondary,
      marginBottom: 16,
    },
    planPricing: {
      flexDirection: 'row',
      alignItems: 'baseline',
    },
    planPrice: {
      fontSize: 36,
      fontFamily: 'Inter-Bold',
      color: colors.text,
    },
    planPeriod: {
      fontSize: 16,
      fontFamily: 'Inter-Medium',
      color: colors.textSecondary,
      marginLeft: 4,
    },
    originalPrice: {
      fontSize: 20,
      fontFamily: 'Inter-Medium',
      color: colors.textSecondary,
      textDecorationLine: 'line-through',
      marginLeft: 8,
    },
    planFeatures: {
      marginBottom: 24,
    },
    featureItem: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 12,
    },
    featureIcon: {
      marginRight: 12,
    },
    featureText: {
      fontSize: 16,
      fontFamily: 'Inter-Regular',
      color: colors.text,
      flex: 1,
    },
    limitationText: {
      color: colors.textSecondary,
    },
    planButton: {
      backgroundColor: colors.primary,
      paddingVertical: 16,
      borderRadius: 12,
      alignItems: 'center',
      flexDirection: 'row',
      justifyContent: 'center',
    },
    planButtonSecondary: {
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.border,
    },
    planButtonText: {
      fontSize: 18,
      fontFamily: 'Inter-SemiBold',
      color: '#FFFFFF',
      marginRight: 8,
    },
    planButtonTextSecondary: {
      color: colors.text,
    },
    featuresSection: {
      paddingHorizontal: 20,
      paddingTop: 40,
      paddingBottom: 20,
    },
    featuresTitle: {
      fontSize: 24,
      fontFamily: 'Inter-Bold',
      color: colors.text,
      textAlign: 'center',
      marginBottom: 30,
    },
    featureCard: {
      backgroundColor: colors.card,
      borderRadius: 12,
      padding: 20,
      marginBottom: 16,
      borderWidth: 1,
      borderColor: colors.border,
    },
    featureCardHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 12,
    },
    featureIconContainer: {
      width: 48,
      height: 48,
      borderRadius: 24,
      backgroundColor: colors.primary + '20',
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 16,
    },
    featureCardTitle: {
      fontSize: 18,
      fontFamily: 'Inter-Bold',
      color: colors.text,
    },
    featureCardDescription: {
      fontSize: 15,
      fontFamily: 'Inter-Regular',
      color: colors.textSecondary,
      lineHeight: 22,
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
        <Text style={styles.headerTitle}>Upgrade to Pro</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <LinearGradient
          colors={[colors.warning + '10', colors.background]}
          style={styles.heroSection}
        >
          <View style={styles.heroIcon}>
            <Crown size={40} color={colors.warning} />
          </View>
          <Text style={styles.heroTitle}>Unlock Your Full Potential</Text>
          <Text style={styles.heroSubtitle}>
            Get access to AI-powered features, blockchain publishing, and premium tools to create professional podcasts
          </Text>
        </LinearGradient>

        <View style={styles.billingToggle}>
          <TouchableOpacity
            style={[
              styles.billingOption,
              billingPeriod === 'monthly' && styles.billingOptionActive
            ]}
            onPress={() => setBillingPeriod('monthly')}
          >
            <Text style={[
              styles.billingOptionText,
              billingPeriod === 'monthly' && styles.billingOptionTextActive
            ]}>
              Monthly
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.billingOption,
              billingPeriod === 'yearly' && styles.billingOptionActive
            ]}
            onPress={() => setBillingPeriod('yearly')}
          >
            <Text style={[
              styles.billingOptionText,
              billingPeriod === 'yearly' && styles.billingOptionTextActive
            ]}>
              Yearly
            </Text>
            {billingPeriod === 'yearly' && (
              <View style={styles.discountBadge}>
                <Text style={styles.discountText}>20% OFF</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        <View style={styles.plansContainer}>
          {plans.map((plan) => (
            <View
              key={plan.id}
              style={[
                styles.planCard,
                plan.popular && styles.planCardPopular
              ]}
            >
              {plan.popular && (
                <View style={styles.popularBadge}>
                  <Text style={styles.popularText}>MOST POPULAR</Text>
                </View>
              )}

              <View style={styles.planHeader}>
                <Text style={styles.planName}>{plan.name}</Text>
                <Text style={styles.planDescription}>{plan.description}</Text>
                
                <View style={styles.planPricing}>
                  <Text style={styles.planPrice}>
                    ${plan.price === 0 ? '0' : getDiscountedPrice(plan.price)}
                  </Text>
                  {plan.price > 0 && (
                    <Text style={styles.planPeriod}>/{billingPeriod === 'yearly' ? 'year' : plan.period}</Text>
                  )}
                  {billingPeriod === 'yearly' && plan.price > 0 && (
                    <Text style={styles.originalPrice}>${plan.price * 12}</Text>
                  )}
                </View>
              </View>

              <View style={styles.planFeatures}>
                {plan.features.map((feature, index) => (
                  <View key={index} style={styles.featureItem}>
                    <View style={styles.featureIcon}>
                      <Check size={20} color={colors.success} />
                    </View>
                    <Text style={styles.featureText}>{feature}</Text>
                  </View>
                ))}
                {plan.limitations?.map((limitation, index) => (
                  <View key={`limitation-${index}`} style={styles.featureItem}>
                    <View style={styles.featureIcon}>
                      <Check size={20} color={colors.textTertiary} />
                    </View>
                    <Text style={[styles.featureText, styles.limitationText]}>{limitation}</Text>
                  </View>
                ))}
              </View>

              <TouchableOpacity
                style={[
                  styles.planButton,
                  plan.id === 'free' && styles.planButtonSecondary,
                  loading && { opacity: 0.6 }
                ]}
                onPress={() => handleUpgrade(plan.id)}
                disabled={loading}
              >
                <Text style={[
                  styles.planButtonText,
                  plan.id === 'free' && styles.planButtonTextSecondary
                ]}>
                  {plan.id === 'free' ? 'Current Plan' : 
                   profile?.tier === plan.id ? 'Current Plan' :
                   loading ? 'Processing...' : `Upgrade to ${plan.name}`}
                </Text>
                {loading && <ActivityIndicator size="small" color="#FFFFFF" />}
              </TouchableOpacity>
            </View>
          ))}
        </View>

        <View style={styles.featuresSection}>
          <Text style={styles.featuresTitle}>Pro Features in Detail</Text>
          
          {proFeatures.map((feature, index) => (
            <View key={index} style={styles.featureCard}>
              <View style={styles.featureCardHeader}>
                <View style={styles.featureIconContainer}>
                  <feature.icon size={24} color={colors.primary} />
                </View>
                <Text style={styles.featureCardTitle}>{feature.title}</Text>
              </View>
              <Text style={styles.featureCardDescription}>{feature.description}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}