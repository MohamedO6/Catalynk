import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import {
  Search,
  Plus,
  TrendingUp,
  Users,
  DollarSign,
  Sparkles,
  Bell,
} from 'lucide-react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { useAuth } from '@/contexts/AuthContext';

const { width } = Dimensions.get('window');

const mockStats = {
  totalProjects: 1247,
  activeUsers: 15432,
  totalFunding: 2850000,
  successRate: 78,
};

const mockTrendingProjects = [
  {
    id: '1',
    title: 'EcoTrack: Sustainable Living Assistant',
    description: 'AI-powered app to help users track and reduce their carbon footprint',
    category: 'Sustainability',
    funding: 45000,
    progress: 72,
    members: 8,
  },
  {
    id: '2',
    title: 'MedConnect: Telemedicine Platform',
    description: 'Connecting patients with healthcare providers through secure video consultations',
    category: 'Healthcare',
    funding: 120000,
    progress: 85,
    members: 12,
  },
  {
    id: '3',
    title: 'EduGame: Gamified Learning Platform',
    description: 'Making education fun through interactive games and challenges',
    category: 'Education',
    funding: 32000,
    progress: 45,
    members: 6,
  },
];

export default function Home() {
  const { colors } = useTheme();
  const { profile } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');

  const getDashboardTitle = () => {
    switch (profile?.role) {
      case 'founder':
        return 'Founder Dashboard';
      case 'freelancer':
        return 'Freelancer Hub';
      case 'investor':
        return 'Investment Portal';
      default:
        return 'Welcome to Catalynk';
    }
  };

  const getDashboardSubtitle = () => {
    const name = profile?.full_name?.split(' ')[0] || 'there';
    switch (profile?.role) {
      case 'founder':
        return `Welcome back, ${name}! Ready to build the future?`;
      case 'freelancer':
        return `Hello ${name}! Find your next exciting project`;
      case 'investor':
        return `Hi ${name}! Discover promising investment opportunities`;
      default:
        return 'Discover innovation, connect with talent, and grow your network';
    }
  };

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
    greeting: {
      flex: 1,
    },
    title: {
      fontSize: 28,
      fontFamily: 'Inter-Bold',
      color: colors.text,
      marginBottom: 4,
    },
    subtitle: {
      fontSize: 16,
      fontFamily: 'Inter-Regular',
      color: colors.textSecondary,
    },
    notificationButton: {
      width: 44,
      height: 44,
      borderRadius: 22,
      backgroundColor: colors.surface,
      justifyContent: 'center',
      alignItems: 'center',
    },
    searchContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.surface,
      borderRadius: 12,
      paddingHorizontal: 16,
      paddingVertical: 4,
    },
    searchInput: {
      flex: 1,
      fontSize: 16,
      fontFamily: 'Inter-Regular',
      color: colors.text,
      paddingVertical: 12,
      marginLeft: 12,
    },
    quickActions: {
      flexDirection: 'row',
      paddingHorizontal: 20,
      marginBottom: 30,
    },
    quickActionButton: {
      flex: 1,
      backgroundColor: colors.primary,
      paddingVertical: 16,
      borderRadius: 12,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
    },
    quickActionText: {
      fontSize: 16,
      fontFamily: 'Inter-SemiBold',
      color: '#FFFFFF',
      marginLeft: 8,
    },
    statsContainer: {
      paddingHorizontal: 20,
      marginBottom: 30,
    },
    statsGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
    },
    statCard: {
      width: (width - 50) / 2,
      backgroundColor: colors.card,
      borderRadius: 12,
      padding: 16,
      marginBottom: 10,
      borderWidth: 1,
      borderColor: colors.border,
    },
    statValue: {
      fontSize: 24,
      fontFamily: 'Inter-Bold',
      color: colors.text,
      marginBottom: 4,
    },
    statLabel: {
      fontSize: 14,
      fontFamily: 'Inter-Medium',
      color: colors.textSecondary,
    },
    section: {
      paddingHorizontal: 20,
      marginBottom: 30,
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
    seeAllButton: {
      paddingVertical: 4,
      paddingHorizontal: 8,
    },
    seeAllText: {
      fontSize: 14,
      fontFamily: 'Inter-Medium',
      color: colors.primary,
    },
    projectCard: {
      backgroundColor: colors.card,
      borderRadius: 12,
      padding: 16,
      marginBottom: 12,
      borderWidth: 1,
      borderColor: colors.border,
    },
    projectTitle: {
      fontSize: 18,
      fontFamily: 'Inter-SemiBold',
      color: colors.text,
      marginBottom: 8,
    },
    projectDescription: {
      fontSize: 14,
      fontFamily: 'Inter-Regular',
      color: colors.textSecondary,
      lineHeight: 20,
      marginBottom: 12,
    },
    projectMeta: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    projectCategory: {
      backgroundColor: colors.primary + '20',
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 6,
    },
    projectCategoryText: {
      fontSize: 12,
      fontFamily: 'Inter-Medium',
      color: colors.primary,
    },
    projectStats: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    projectStat: {
      flexDirection: 'row',
      alignItems: 'center',
      marginLeft: 16,
    },
    projectStatText: {
      fontSize: 12,
      fontFamily: 'Inter-Medium',
      color: colors.textSecondary,
      marginLeft: 4,
    },
  });

  const formatCurrency = (amount: number) => {
    if (amount >= 1000000) {
      return `$${(amount / 1000000).toFixed(1)}M`;
    } else if (amount >= 1000) {
      return `$${(amount / 1000).toFixed(0)}K`;
    } else {
      return `$${amount}`;
    }
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[colors.primary + '10', colors.background]}
        style={styles.header}
      >
        <View style={styles.headerTop}>
          <View style={styles.greeting}>
            <Text style={styles.title}>{getDashboardTitle()}</Text>
            <Text style={styles.subtitle}>{getDashboardSubtitle()}</Text>
          </View>
          <TouchableOpacity style={styles.notificationButton}>
            <Bell size={20} color={colors.text} />
          </TouchableOpacity>
        </View>

        <View style={styles.searchContainer}>
          <Search size={20} color={colors.textSecondary} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search projects, people, or ideas..."
            placeholderTextColor={colors.textTertiary}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </LinearGradient>

      {profile?.role === 'founder' && (
        <View style={styles.quickActions}>
          <TouchableOpacity style={styles.quickActionButton}>
            <Plus size={20} color="#FFFFFF" />
            <Text style={styles.quickActionText}>Create Project</Text>
          </TouchableOpacity>
        </View>
      )}

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.statsContainer}>
          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>{mockStats.totalProjects.toLocaleString()}</Text>
              <Text style={styles.statLabel}>Active Projects</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>{mockStats.activeUsers.toLocaleString()}</Text>
              <Text style={styles.statLabel}>Community Members</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>{formatCurrency(mockStats.totalFunding)}</Text>
              <Text style={styles.statLabel}>Total Funding</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>{mockStats.successRate}%</Text>
              <Text style={styles.statLabel}>Success Rate</Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Trending Projects</Text>
            <TouchableOpacity style={styles.seeAllButton}>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>

          {mockTrendingProjects.map((project) => (
            <TouchableOpacity key={project.id} style={styles.projectCard}>
              <Text style={styles.projectTitle}>{project.title}</Text>
              <Text style={styles.projectDescription}>{project.description}</Text>
              
              <View style={styles.projectMeta}>
                <View style={styles.projectCategory}>
                  <Text style={styles.projectCategoryText}>{project.category}</Text>
                </View>
                
                <View style={styles.projectStats}>
                  <View style={styles.projectStat}>
                    <DollarSign size={14} color={colors.success} />
                    <Text style={styles.projectStatText}>{formatCurrency(project.funding)}</Text>
                  </View>
                  <View style={styles.projectStat}>
                    <Users size={14} color={colors.textSecondary} />
                    <Text style={styles.projectStatText}>{project.members}</Text>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}