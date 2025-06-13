import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Dimensions,
  Image,
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
  Play,
  Volume2,
  VolumeX,
  Crown,
} from 'lucide-react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { useAuth } from '@/contexts/AuthContext';
import { router } from 'expo-router';

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
    description: 'AI-powered app to help users track and reduce their carbon footprint through personalized recommendations and gamification.',
    category: 'Sustainability',
    founder: 'Sarah Chen',
    avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop',
    image: 'https://images.pexels.com/photos/1108572/pexels-photo-1108572.jpeg?auto=compress&cs=tinysrgb&w=400&h=200&fit=crop',
    funding: 45000,
    target: 100000,
    progress: 45,
    members: 8,
    hasAudio: true,
    hasVideo: true,
  },
  {
    id: '2',
    title: 'MedConnect: Telemedicine Platform',
    description: 'Connecting patients with healthcare providers through secure video consultations and AI-powered symptom analysis.',
    category: 'Healthcare',
    founder: 'Dr. Marcus Johnson',
    avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop',
    image: 'https://images.pexels.com/photos/4386467/pexels-photo-4386467.jpeg?auto=compress&cs=tinysrgb&w=400&h=200&fit=crop',
    funding: 120000,
    target: 200000,
    progress: 60,
    members: 12,
    hasAudio: true,
    hasVideo: false,
  },
  {
    id: '3',
    title: 'EduGame: Gamified Learning Platform',
    description: 'Making education fun through interactive games, AR experiences, and personalized learning paths for students.',
    category: 'Education',
    founder: 'Emily Rodriguez',
    avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop',
    image: 'https://images.pexels.com/photos/5212345/pexels-photo-5212345.jpeg?auto=compress&cs=tinysrgb&w=400&h=200&fit=crop',
    funding: 32000,
    target: 75000,
    progress: 43,
    members: 6,
    hasAudio: false,
    hasVideo: true,
  },
];

const mockAIMatches = [
  {
    id: '1',
    type: 'freelancer',
    name: 'Alex Thompson',
    title: 'Full-Stack Developer',
    skills: ['React Native', 'Node.js', 'AI/ML'],
    rating: 4.9,
    avatar: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop',
    matchScore: 95,
  },
  {
    id: '2',
    type: 'investor',
    name: 'Jennifer Park',
    title: 'Angel Investor',
    focus: ['FinTech', 'HealthTech'],
    portfolio: 23,
    avatar: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop',
    matchScore: 88,
  },
];

export default function Home() {
  const { colors } = useTheme();
  const { profile } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [audioPlaying, setAudioPlaying] = useState<string | null>(null);

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

  const handleCreateProject = () => {
    router.push('/create-project');
  };

  const handlePlayAudio = (projectId: string) => {
    if (audioPlaying === projectId) {
      setAudioPlaying(null);
    } else {
      setAudioPlaying(projectId);
      // Simulate audio playback
      setTimeout(() => setAudioPlaying(null), 5000);
    }
  };

  const handlePlayVideo = (projectId: string) => {
    router.push(`/project-video/${projectId}`);
  };

  const handleUpgradeToPro = () => {
    router.push('/upgrade');
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
    headerActions: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    notificationButton: {
      width: 44,
      height: 44,
      borderRadius: 22,
      backgroundColor: colors.surface,
      justifyContent: 'center',
      alignItems: 'center',
      marginLeft: 12,
    },
    upgradeButton: {
      backgroundColor: colors.warning + '20',
      paddingHorizontal: 12,
      paddingVertical: 8,
      borderRadius: 20,
      flexDirection: 'row',
      alignItems: 'center',
    },
    upgradeText: {
      fontSize: 12,
      fontFamily: 'Inter-Bold',
      color: colors.warning,
      marginLeft: 4,
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
      borderRadius: 16,
      marginBottom: 16,
      borderWidth: 1,
      borderColor: colors.border,
      overflow: 'hidden',
    },
    projectImage: {
      width: '100%',
      height: 160,
    },
    projectContent: {
      padding: 16,
    },
    projectHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: 8,
    },
    projectTitle: {
      fontSize: 18,
      fontFamily: 'Inter-Bold',
      color: colors.text,
      flex: 1,
      marginRight: 12,
    },
    projectActions: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    actionButton: {
      width: 36,
      height: 36,
      borderRadius: 18,
      backgroundColor: colors.surface,
      justifyContent: 'center',
      alignItems: 'center',
      marginLeft: 8,
    },
    projectFounder: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 12,
    },
    founderAvatar: {
      width: 24,
      height: 24,
      borderRadius: 12,
      marginRight: 8,
    },
    founderName: {
      fontSize: 14,
      fontFamily: 'Inter-Medium',
      color: colors.textSecondary,
    },
    projectDescription: {
      fontSize: 15,
      fontFamily: 'Inter-Regular',
      color: colors.textSecondary,
      lineHeight: 22,
      marginBottom: 16,
    },
    projectMeta: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 12,
    },
    categoryBadge: {
      backgroundColor: colors.primary + '20',
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 6,
    },
    categoryText: {
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
    fundingContainer: {
      marginTop: 12,
    },
    fundingHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 8,
    },
    fundingAmount: {
      fontSize: 16,
      fontFamily: 'Inter-Bold',
      color: colors.success,
    },
    fundingTarget: {
      fontSize: 14,
      fontFamily: 'Inter-Medium',
      color: colors.textSecondary,
    },
    progressBar: {
      height: 6,
      backgroundColor: colors.border,
      borderRadius: 3,
      marginBottom: 4,
    },
    progressFill: {
      height: '100%',
      backgroundColor: colors.success,
      borderRadius: 3,
    },
    progressText: {
      fontSize: 12,
      fontFamily: 'Inter-Medium',
      color: colors.textSecondary,
      textAlign: 'right',
    },
    matchCard: {
      backgroundColor: colors.card,
      borderRadius: 12,
      padding: 16,
      marginRight: 16,
      borderWidth: 1,
      borderColor: colors.border,
      width: 280,
    },
    matchHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 12,
    },
    matchAvatar: {
      width: 48,
      height: 48,
      borderRadius: 24,
      marginRight: 12,
    },
    matchInfo: {
      flex: 1,
    },
    matchName: {
      fontSize: 16,
      fontFamily: 'Inter-Bold',
      color: colors.text,
    },
    matchTitle: {
      fontSize: 14,
      fontFamily: 'Inter-Medium',
      color: colors.textSecondary,
    },
    matchScore: {
      backgroundColor: colors.success + '20',
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 12,
    },
    matchScoreText: {
      fontSize: 12,
      fontFamily: 'Inter-Bold',
      color: colors.success,
    },
    matchDetails: {
      marginBottom: 12,
    },
    matchSkills: {
      flexDirection: 'row',
      flexWrap: 'wrap',
    },
    skillTag: {
      backgroundColor: colors.surface,
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 8,
      marginRight: 6,
      marginBottom: 6,
    },
    skillText: {
      fontSize: 12,
      fontFamily: 'Inter-Medium',
      color: colors.textSecondary,
    },
    connectButton: {
      backgroundColor: colors.primary,
      paddingVertical: 10,
      borderRadius: 8,
      alignItems: 'center',
    },
    connectButtonText: {
      fontSize: 14,
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
          <View style={styles.headerActions}>
            {profile?.subscription_tier === 'free' && (
              <TouchableOpacity style={styles.upgradeButton} onPress={handleUpgradeToPro}>
                <Crown size={16} color={colors.warning} />
                <Text style={styles.upgradeText}>Upgrade</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity style={styles.notificationButton}>
              <Bell size={20} color={colors.text} />
            </TouchableOpacity>
          </View>
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
          <TouchableOpacity style={styles.quickActionButton} onPress={handleCreateProject}>
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
            <TouchableOpacity style={styles.seeAllButton} onPress={() => router.push('/projects')}>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>

          {mockTrendingProjects.map((project) => (
            <TouchableOpacity key={project.id} style={styles.projectCard}>
              <Image source={{ uri: project.image }} style={styles.projectImage} />
              
              <View style={styles.projectContent}>
                <View style={styles.projectHeader}>
                  <Text style={styles.projectTitle}>{project.title}</Text>
                  <View style={styles.projectActions}>
                    {project.hasAudio && (
                      <TouchableOpacity 
                        style={styles.actionButton}
                        onPress={() => handlePlayAudio(project.id)}
                      >
                        {audioPlaying === project.id ? (
                          <VolumeX size={18} color={colors.primary} />
                        ) : (
                          <Volume2 size={18} color={colors.textSecondary} />
                        )}
                      </TouchableOpacity>
                    )}
                    {project.hasVideo && (
                      <TouchableOpacity 
                        style={styles.actionButton}
                        onPress={() => handlePlayVideo(project.id)}
                      >
                        <Play size={18} color={colors.textSecondary} />
                      </TouchableOpacity>
                    )}
                  </View>
                </View>

                <View style={styles.projectFounder}>
                  <Image source={{ uri: project.avatar }} style={styles.founderAvatar} />
                  <Text style={styles.founderName}>by {project.founder}</Text>
                </View>

                <Text style={styles.projectDescription}>{project.description}</Text>

                <View style={styles.projectMeta}>
                  <View style={styles.categoryBadge}>
                    <Text style={styles.categoryText}>{project.category}</Text>
                  </View>
                  
                  <View style={styles.projectStats}>
                    <View style={styles.projectStat}>
                      <Users size={14} color={colors.textSecondary} />
                      <Text style={styles.projectStatText}>{project.members}</Text>
                    </View>
                  </View>
                </View>

                <View style={styles.fundingContainer}>
                  <View style={styles.fundingHeader}>
                    <Text style={styles.fundingAmount}>
                      {formatCurrency(project.funding)} raised
                    </Text>
                    <Text style={styles.fundingTarget}>
                      of {formatCurrency(project.target)} goal
                    </Text>
                  </View>
                  <View style={styles.progressBar}>
                    <View
                      style={[
                        styles.progressFill,
                        { width: `${project.progress}%` },
                      ]}
                    />
                  </View>
                  <Text style={styles.progressText}>{project.progress}% funded</Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>AI-Powered Matches</Text>
            <TouchableOpacity style={styles.seeAllButton}>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>

          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {mockAIMatches.map((match) => (
              <View key={match.id} style={styles.matchCard}>
                <View style={styles.matchHeader}>
                  <Image source={{ uri: match.avatar }} style={styles.matchAvatar} />
                  <View style={styles.matchInfo}>
                    <Text style={styles.matchName}>{match.name}</Text>
                    <Text style={styles.matchTitle}>{match.title}</Text>
                  </View>
                  <View style={styles.matchScore}>
                    <Text style={styles.matchScoreText}>{match.matchScore}%</Text>
                  </View>
                </View>

                <View style={styles.matchDetails}>
                  <View style={styles.matchSkills}>
                    {(match.skills || match.focus || []).map((skill, index) => (
                      <View key={index} style={styles.skillTag}>
                        <Text style={styles.skillText}>{skill}</Text>
                      </View>
                    ))}
                  </View>
                </View>

                <TouchableOpacity style={styles.connectButton}>
                  <Text style={styles.connectButtonText}>Connect</Text>
                </TouchableOpacity>
              </View>
            ))}
          </ScrollView>
        </View>
      </ScrollView>
    </View>
  );
}