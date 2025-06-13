import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  PieChart,
  BarChart3,
  Filter,
  Plus,
} from 'lucide-react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

const mockPortfolio = {
  totalInvested: 450000,
  currentValue: 675000,
  totalReturn: 225000,
  returnPercentage: 50,
  activeInvestments: 12,
};

const mockInvestments = [
  {
    id: '1',
    projectName: 'AI-Powered Personal Finance Manager',
    founder: 'Sarah Chen',
    category: 'Fintech',
    invested: 25000,
    currentValue: 42000,
    returnAmount: 17000,
    returnPercentage: 68,
    status: 'growing',
    lastUpdate: '2 days ago',
  },
  {
    id: '2',
    projectName: 'Sustainable Urban Farming Platform',
    founder: 'Marcus Johnson',
    category: 'AgTech',
    invested: 40000,
    currentValue: 52000,
    returnAmount: 12000,
    returnPercentage: 30,
    status: 'stable',
    lastUpdate: '1 week ago',
  },
  {
    id: '3',
    projectName: 'Virtual Reality Therapy Platform',
    founder: 'Dr. Emily Rodriguez',
    category: 'HealthTech',
    invested: 35000,
    currentValue: 28000,
    returnAmount: -7000,
    returnPercentage: -20,
    status: 'declining',
    lastUpdate: '3 days ago',
  },
];

const mockOpportunities = [
  {
    id: '4',
    projectName: 'Quantum Computing Cloud Service',
    founder: 'David Park',
    category: 'DeepTech',
    fundingGoal: 500000,
    currentFunding: 320000,
    minimumInvestment: 10000,
    aiScore: 92,
    riskLevel: 'Medium',
    projectedReturn: '300-500%',
  },
  {
    id: '5',
    projectName: 'Blockchain Supply Chain Tracker',
    founder: 'Lisa Wang',
    category: 'Blockchain',
    fundingGoal: 250000,
    currentFunding: 180000,
    minimumInvestment: 5000,
    aiScore: 87,
    riskLevel: 'Low',
    projectedReturn: '150-250%',
  },
];

export default function Investments() {
  const { colors } = useTheme();
  const [activeTab, setActiveTab] = useState<'portfolio' | 'opportunities'>('portfolio');

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    header: {
      paddingTop: 60,
      paddingHorizontal: 20,
      paddingBottom: 20,
    },
    headerTop: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 20,
    },
    title: {
      fontSize: 28,
      fontFamily: 'Inter-Bold',
      color: colors.text,
    },
    addButton: {
      backgroundColor: colors.primary,
      width: 44,
      height: 44,
      borderRadius: 22,
      justifyContent: 'center',
      alignItems: 'center',
    },
    portfolioOverview: {
      backgroundColor: colors.card,
      borderRadius: 16,
      padding: 20,
      marginBottom: 20,
      borderWidth: 1,
      borderColor: colors.border,
    },
    overviewTitle: {
      fontSize: 18,
      fontFamily: 'Inter-SemiBold',
      color: colors.text,
      marginBottom: 16,
    },
    overviewGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
    },
    overviewItem: {
      width: (width - 80) / 2,
      marginBottom: 16,
    },
    overviewValue: {
      fontSize: 24,
      fontFamily: 'Inter-Bold',
      color: colors.text,
      marginBottom: 4,
    },
    overviewLabel: {
      fontSize: 14,
      fontFamily: 'Inter-Medium',
      color: colors.textSecondary,
    },
    returnPositive: {
      color: colors.success,
    },
    returnNegative: {
      color: colors.error,
    },
    tabsContainer: {
      flexDirection: 'row',
      backgroundColor: colors.surface,
      borderRadius: 12,
      padding: 4,
      marginHorizontal: 20,
      marginBottom: 20,
    },
    tab: {
      flex: 1,
      paddingVertical: 12,
      borderRadius: 8,
      alignItems: 'center',
    },
    activeTab: {
      backgroundColor: colors.primary,
    },
    tabText: {
      fontSize: 16,
      fontFamily: 'Inter-SemiBold',
      color: colors.textSecondary,
    },
    activeTabText: {
      color: '#FFFFFF',
    },
    content: {
      flex: 1,
      paddingHorizontal: 20,
    },
    sectionHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 16,
    },
    sectionTitle: {
      fontSize: 20,
      fontFamily: 'Inter-Bold',
      color: colors.text,
    },
    filterButton: {
      backgroundColor: colors.surface,
      padding: 10,
      borderRadius: 8,
    },
    investmentCard: {
      backgroundColor: colors.card,
      borderRadius: 12,
      padding: 16,
      marginBottom: 12,
      borderWidth: 1,
      borderColor: colors.border,
    },
    investmentHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: 12,
    },
    investmentInfo: {
      flex: 1,
    },
    investmentName: {
      fontSize: 18,
      fontFamily: 'Inter-SemiBold',
      color: colors.text,
      marginBottom: 4,
    },
    investmentFounder: {
      fontSize: 14,
      fontFamily: 'Inter-Medium',
      color: colors.textSecondary,
      marginBottom: 8,
    },
    categoryBadge: {
      backgroundColor: colors.primary + '20',
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 6,
      alignSelf: 'flex-start',
    },
    categoryText: {
      fontSize: 12,
      fontFamily: 'Inter-Medium',
      color: colors.primary,
    },
    statusIndicator: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    investmentMetrics: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: 16,
      paddingTop: 16,
      borderTopWidth: 1,
      borderTopColor: colors.border,
    },
    metric: {
      alignItems: 'center',
    },
    metricValue: {
      fontSize: 16,
      fontFamily: 'Inter-Bold',
      color: colors.text,
    },
    metricLabel: {
      fontSize: 12,
      fontFamily: 'Inter-Medium',
      color: colors.textSecondary,
      marginTop: 4,
    },
    opportunityCard: {
      backgroundColor: colors.card,
      borderRadius: 12,
      padding: 16,
      marginBottom: 12,
      borderWidth: 1,
      borderColor: colors.border,
    },
    opportunityHeader: {
      marginBottom: 12,
    },
    opportunityName: {
      fontSize: 18,
      fontFamily: 'Inter-SemiBold',
      color: colors.text,
      marginBottom: 4,
    },
    opportunityFounder: {
      fontSize: 14,
      fontFamily: 'Inter-Medium',
      color: colors.textSecondary,
    },
    progressContainer: {
      marginVertical: 12,
    },
    progressHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 8,
    },
    progressText: {
      fontSize: 14,
      fontFamily: 'Inter-Medium',
      color: colors.textSecondary,
    },
    progressBar: {
      height: 6,
      backgroundColor: colors.border,
      borderRadius: 3,
    },
    progressFill: {
      height: '100%',
      backgroundColor: colors.success,
      borderRadius: 3,
    },
    opportunityMetrics: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: 12,
    },
    aiScore: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.success + '20',
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 6,
    },
    aiScoreText: {
      fontSize: 12,
      fontFamily: 'Inter-Bold',
      color: colors.success,
      marginLeft: 4,
    },
    riskBadge: {
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 6,
    },
    riskText: {
      fontSize: 12,
      fontFamily: 'Inter-Medium',
    },
    investButton: {
      backgroundColor: colors.primary,
      paddingVertical: 12,
      borderRadius: 8,
      alignItems: 'center',
      marginTop: 16,
    },
    investButtonText: {
      fontSize: 16,
      fontFamily: 'Inter-SemiBold',
      color: '#FFFFFF',
    },
  });

  const formatCurrency = (amount: number) => {
    if (amount >= 1000000) {
      return `$${(amount / 1000000).toFixed(1)}M`;
    } else if (amount >= 1000) {
      return `$${(amount / 1000).toFixed(0)}K`;
    } else {
      return `$${amount.toLocaleString()}`;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'growing':
        return <TrendingUp size={16} color={colors.success} />;
      case 'declining':
        return <TrendingDown size={16} color={colors.error} />;
      default:
        return <BarChart3 size={16} color={colors.warning} />;
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk.toLowerCase()) {
      case 'low':
        return colors.success;
      case 'medium':
        return colors.warning;
      case 'high':
        return colors.error;
      default:
        return colors.textSecondary;
    }
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[colors.success + '10', colors.background]}
        style={styles.header}
      >
        <View style={styles.headerTop}>
          <Text style={styles.title}>Investment Portal</Text>
          <TouchableOpacity style={styles.addButton}>
            <Plus size={24} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        <View style={styles.portfolioOverview}>
          <Text style={styles.overviewTitle}>Portfolio Overview</Text>
          <View style={styles.overviewGrid}>
            <View style={styles.overviewItem}>
              <Text style={styles.overviewValue}>
                {formatCurrency(mockPortfolio.totalInvested)}
              </Text>
              <Text style={styles.overviewLabel}>Total Invested</Text>
            </View>
            <View style={styles.overviewItem}>
              <Text style={styles.overviewValue}>
                {formatCurrency(mockPortfolio.currentValue)}
              </Text>
              <Text style={styles.overviewLabel}>Current Value</Text>
            </View>
            <View style={styles.overviewItem}>
              <Text style={[
                styles.overviewValue,
                mockPortfolio.totalReturn > 0 ? styles.returnPositive : styles.returnNegative
              ]}>
                +{formatCurrency(mockPortfolio.totalReturn)}
              </Text>
              <Text style={styles.overviewLabel}>Total Return</Text>
            </View>
            <View style={styles.overviewItem}>
              <Text style={[styles.overviewValue, styles.returnPositive]}>
                +{mockPortfolio.returnPercentage}%
              </Text>
              <Text style={styles.overviewLabel}>Return Rate</Text>
            </View>
          </View>
        </View>
      </LinearGradient>

      <View style={styles.tabsContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'portfolio' && styles.activeTab]}
          onPress={() => setActiveTab('portfolio')}
        >
          <Text style={[
            styles.tabText,
            activeTab === 'portfolio' && styles.activeTabText
          ]}>
            My Portfolio
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'opportunities' && styles.activeTab]}
          onPress={() => setActiveTab('opportunities')}
        >
          <Text style={[
            styles.tabText,
            activeTab === 'opportunities' && styles.activeTabText
          ]}>
            New Opportunities
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {activeTab === 'portfolio' ? (
          <>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Active Investments</Text>
              <TouchableOpacity style={styles.filterButton}>
                <Filter size={20} color={colors.text} />
              </TouchableOpacity>
            </View>

            {mockInvestments.map((investment) => (
              <TouchableOpacity key={investment.id} style={styles.investmentCard}>
                <View style={styles.investmentHeader}>
                  <View style={styles.investmentInfo}>
                    <Text style={styles.investmentName}>{investment.projectName}</Text>
                    <Text style={styles.investmentFounder}>by {investment.founder}</Text>
                    <View style={styles.categoryBadge}>
                      <Text style={styles.categoryText}>{investment.category}</Text>
                    </View>
                  </View>
                  <View style={styles.statusIndicator}>
                    {getStatusIcon(investment.status)}
                  </View>
                </View>

                <View style={styles.investmentMetrics}>
                  <View style={styles.metric}>
                    <Text style={styles.metricValue}>
                      {formatCurrency(investment.invested)}
                    </Text>
                    <Text style={styles.metricLabel}>Invested</Text>
                  </View>
                  <View style={styles.metric}>
                    <Text style={styles.metricValue}>
                      {formatCurrency(investment.currentValue)}
                    </Text>
                    <Text style={styles.metricLabel}>Current Value</Text>
                  </View>
                  <View style={styles.metric}>
                    <Text style={[
                      styles.metricValue,
                      investment.returnAmount > 0 ? styles.returnPositive : styles.returnNegative
                    ]}>
                      {investment.returnAmount > 0 ? '+' : ''}{formatCurrency(investment.returnAmount)}
                    </Text>
                    <Text style={styles.metricLabel}>Return</Text>
                  </View>
                  <View style={styles.metric}>
                    <Text style={[
                      styles.metricValue,
                      investment.returnPercentage > 0 ? styles.returnPositive : styles.returnNegative
                    ]}>
                      {investment.returnPercentage > 0 ? '+' : ''}{investment.returnPercentage}%
                    </Text>
                    <Text style={styles.metricLabel}>ROI</Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </>
        ) : (
          <>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Investment Opportunities</Text>
              <TouchableOpacity style={styles.filterButton}>
                <Filter size={20} color={colors.text} />
              </TouchableOpacity>
            </View>

            {mockOpportunities.map((opportunity) => (
              <TouchableOpacity key={opportunity.id} style={styles.opportunityCard}>
                <View style={styles.opportunityHeader}>
                  <Text style={styles.opportunityName}>{opportunity.projectName}</Text>
                  <Text style={styles.opportunityFounder}>by {opportunity.founder}</Text>
                  <View style={styles.categoryBadge}>
                    <Text style={styles.categoryText}>{opportunity.category}</Text>
                  </View>
                </View>

                <View style={styles.progressContainer}>
                  <View style={styles.progressHeader}>
                    <Text style={styles.progressText}>
                      {formatCurrency(opportunity.currentFunding)} raised
                    </Text>
                    <Text style={styles.progressText}>
                      of {formatCurrency(opportunity.fundingGoal)} goal
                    </Text>
                  </View>
                  <View style={styles.progressBar}>
                    <View
                      style={[
                        styles.progressFill,
                        {
                          width: `${(opportunity.currentFunding / opportunity.fundingGoal) * 100}%`,
                        },
                      ]}
                    />
                  </View>
                </View>

                <View style={styles.opportunityMetrics}>
                  <View style={styles.aiScore}>
                    <PieChart size={14} color={colors.success} />
                    <Text style={styles.aiScoreText}>AI Score: {opportunity.aiScore}</Text>
                  </View>
                  <View style={[
                    styles.riskBadge,
                    { backgroundColor: getRiskColor(opportunity.riskLevel) + '20' }
                  ]}>
                    <Text style={[
                      styles.riskText,
                      { color: getRiskColor(opportunity.riskLevel) }
                    ]}>
                      {opportunity.riskLevel} Risk
                    </Text>
                  </View>
                  <Text style={styles.progressText}>
                    Min: {formatCurrency(opportunity.minimumInvestment)}
                  </Text>
                </View>

                <TouchableOpacity style={styles.investButton}>
                  <Text style={styles.investButtonText}>Invest Now</Text>
                </TouchableOpacity>
              </TouchableOpacity>
            ))}
          </>
        )}
      </ScrollView>
    </View>
  );
}