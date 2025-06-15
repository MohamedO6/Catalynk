import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Image,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withSpring,
  withDelay
} from 'react-native-reanimated';
import { Plus, TrendingUp, Users, Crown, Bell, Search, Zap, Play, Heart, Share2, MoveHorizontal as MoreHorizontal } from 'lucide-react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { useAuth } from '@/contexts/AuthContext';

const { width } = Dimensions.get('window');

interface Project {
  id: string;
  title: string;
  description: string;
  creator: string;
  category: string;
  funding: number;
  goal: number;
  backers: number;
  image_url: string;
  has_audio: boolean;
  has_video: boolean;
  created_at: string;
}

const mockStats = {
  totalProjects: 1247,
  totalFunding: 4563200,
  totalUsers: 8924,
  avgSuccess: 78,
};

const mockTrendingProjects: Project[] = [
  {
    id: '1',
    title: 'EcoTrack - Carbon Footprint Tracker',
    description: 'AI-powered app that helps individuals and businesses track and reduce their carbon footprint through smart recommendations.',
    creator: 'Sarah Chen',
    category: 'CleanTech',
    funding: 125000,
    goal: 200000,
    backers: 89,
    image_url: 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=400&h=200&fit=crop',
    has_audio: true,
    has_video: true,
    created_at: '2024-01-15',
  },
  {
    id: '2',
    title: 'MindfulAI - Mental Health Assistant',
    description: 'Personalized mental health support using AI to provide 24/7 emotional guidance and therapy recommendations.',
    creator: 'Marcus Johnson',
    category: 'HealthTech',
    funding: 89000,
    goal: 150000,
    backers: 156,
    image_url: 'https://images.pexels.com/photos/3184292/pexels-photo-3184292.jpeg?auto=compress&cs=tinysrgb&w=400&h=200&fit=crop',
    has_audio: false,
    has_video: true,
    created_at: '2024-01-14',
  },
  {
    id: '3',
    title: 'BlockLearn - Decentralized Education',
    description: 'Blockchain-based learning platform that rewards students with tokens for completing courses and achieving milestones.',
    creator: 'Dr. Emily Rodriguez',
    category: 'EdTech',
    funding: 234000,
    goal: 300000,
    backers: 203,
    image_url: 'https://images.pexels.com/photos/3184293/pexels-photo-3184293.jpeg?auto=compress&cs=tinysrgb&w=400&h=200&fit=crop',
    has_audio: true,
    has_video: false,
    created_at: '2024-01-13',
  },
];

export default function Home() {
  const { colors } = useTheme();
  const { profile } = useAuth();
  const [likedProjects, setLikedProjects] = useState<string[]>([]);

  const headerOpacity = useSharedValue(0);
  const statsOpacity = useSharedValue(0);
  const projectsOpacity = useSharedValue(0);

  React.useEffect(() => {
    headerOpacity.value = withSpring(1);
    statsOpacity.value = withDelay(200, withSpring(1));
    projectsOpacity.value = withDelay(400, withSpring(1));
  }, []);

  const handleCreateProject = () => {
    router.push('/create-project');
  };

  const handlePlayAudio = (projectId: string) => {
    Alert.alert('Playing Audio', 'AI-generated pitch audio would play here.');
  };

  const handlePlayVideo = (projectId: string) => {
    Alert.alert('Playing Video', 'AI-generated video introduction would play here.');
  };

  const handleLikeProject = (projectId: string) => {
    setLikedProjects(prev =>
      prev.includes(projectId)
        ? prev.filter(id => id !== projectId)
        : [...prev, projectId]
    );
  };

  const handleShareProject = (projectId: string) => {
    Alert.alert('Share Project', 'Project link copied to clipboard!');
  };

  const handleUpgrade = () => {
    router.push('/upgrade');
  };

  const handleNotifications = () => {
    Alert.alert('Notifications', 'You have 3 new notifications!');
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M`;
    } else if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`;
    } else {
      return num.toString();
    }
  };

  const formatCurrency = (amount: number) => {
    if (amount >= 1000000) {
      return `$${(amount / 1000000).toFixed(1)}M`;
    } else if (amount >= 1000) {
      return `$${(amount / 1000).toFixed(0)}K`;
    } else {
      return `$${amount.toLocaleString()}`;
    }
  };

  const headerAnimatedStyle = useAnimatedStyle(() => ({
    opacity: headerOpacity.value,
    transform: [{ translateY: (1 - headerOpacity.value) * 20 }],
  }));

  const statsAnimatedStyle = useAnimatedStyle(() => ({
    opacity: statsOpacity.value,
    transform: [{ translateY: (1 - statsOpacity.value) * 30 }],
  }));

  const projectsAnimatedStyle = useAnimatedStyle(() => ({
    opacity: projectsOpacity.value,
    transform: [{ translateY: (1 - projectsOpacity.value) * 40 }],
  }));

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
    upgradeButton: {
      backgroundColor: colors.warning + '20',
      paddingHorizontal: 12,
      paddingVertical: 8,
      borderRadius: 20,
      flexDirection: 'row',
      alignItems: 'center',
      marginRight: 12,
    },
    upgradeText: {
      fontSize: 12,
      fontFamily: 'Inter-Bold',
      color: colors.warning,
      marginLeft: 4,
    },
    notificationButton: {
      width: 44,
      height: 44,
      borderRadius: 22,
      backgroundColor: colors.surface,
      justifyContent: 'center',
      alignItems: 'center',
    },
    quickActions: {
      flexDirection: 'row',
      paddingHorizontal: 20,
      marginBottom: 30,
      gap: 12,
    },
    quickActionButton: {
      flex: 1,
      backgroundColor: colors.primary,
      paddingVertical: 16,
      borderRadius: 12,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      shadowColor: colors.primary,
      shadowOffset: {
        width: 0,
        height: 4,
      },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 8,
    },
    secondaryActionButton: {
      flex: 1,
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.border,
      paddingVertical: 16,
      borderRadius: 12,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
    },
    quickActionText: {
      fontSize: 14,
      fontFamily: 'Inter-SemiBold',
      color: '#FFFFFF',
      marginLeft: 8,
    },
    secondaryActionText: {
      fontSize: 14,
      fontFamily: 'Inter-SemiBold',
      color: colors.text,
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
      borderRadius: 16,
      padding: 16,
      marginBottom: 10,
      borderWidth: 1,
      borderColor: colors.border,
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
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
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 4,
      },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 5,
    },
    projectImage: {
      width: '100%',
      height: 160,
      position: 'relative',
    },
    mediaOverlay: {
      position: 'absolute',
      top: 12,
      right: 12,
      flexDirection: 'row',
    },
    mediaBadge: {
      backgroundColor: 'rgba(0,0,0,0.7)',
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 12,
      marginLeft: 4,
    },
    mediaBadgeText: {
      fontSize: 10,
      fontFamily: 'Inter-Bold',
      color: '#FFFFFF',
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
      padding: 6,
      marginLeft: 8,
    },
    projectCreator: {
      fontSize: 14,
      fontFamily: 'Inter-Medium',
      color: colors.textSecondary,
      marginBottom: 8,
    },
    projectDescription: {
      fontSize: 15,
      fontFamily: 'Inter-Regular',
      color: colors.textSecondary,
      lineHeight: 22,
      marginBottom: 12,
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
      borderRadius: 8,
    },
    categoryText: {
      fontSize: 12,
      fontFamily: 'Inter-Bold',
      color: colors.primary,
    },
    fundingInfo: {
      alignItems: 'flex-end',
    },
    fundingAmount: {
      fontSize: 16,
      fontFamily: 'Inter-Bold',
      color: colors.success,
    },
    fundingProgress: {
      fontSize: 12,
      fontFamily: 'Inter-Medium',
      color: colors.textSecondary,
    },
    progressBar: {
      height: 4,
      backgroundColor: colors.border,
      borderRadius: 2,
      marginBottom: 8,
    },
    progressFill: {
      height: '100%',
      backgroundColor: colors.success,
      borderRadius: 2,
    },
    projectStats: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    statItem: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    statText: {
      fontSize: 12,
      fontFamily: 'Inter-Medium',
      color: colors.textSecondary,
      marginLeft: 4,
    },
  });

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[colors.primary + '08', colors.background]}
        style={styles.header}
      >
        <Animated.View style={[styles.headerTop, headerAnimatedStyle]}>
          <View style={styles.greeting}>
            <Text style={styles.title}>Welcome back!</Text>
            <Text style={styles.subtitle}>
              Ready to turn your next idea into reality?
            </Text>
          </View>
          <View style={styles.headerActions}>
            {profile?.subscription_tier === 'free' && (
              <TouchableOpacity style={styles.upgradeButton} onPress={handleUpgrade}>
                <Crown size={16} color={colors.warning} />
                <Text style={styles.upgradeText}>Upgrade</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity style={styles.notificationButton} onPress={handleNotifications}>
              <Bell size={20} color={colors.text} />
            </TouchableOpacity>
          </View>
        </Animated.View>
      </LinearGradient>

      <View style={styles.quickActions}>
        <TouchableOpacity style={styles.quickActionButton} onPress={handleCreateProject}>
          <Plus size={20} color="#FFFFFF" />
          <Text style={styles.quickActionText}>Create Project</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.secondaryActionButton}>
          <Search size={20} color={colors.text} />
          <Text style={styles.secondaryActionText}>Discover</Text>
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <Animated.View style={[styles.statsContainer, statsAnimatedStyle]}>
          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>{formatNumber(mockStats.totalProjects)}</Text>
              <Text style={styles.statLabel}>Active Projects</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>{formatCurrency(mockStats.totalFunding)}</Text>
              <Text style={styles.statLabel}>Total Funding</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>{formatNumber(mockStats.totalUsers)}</Text>
              <Text style={styles.statLabel}>Community</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>{mockStats.avgSuccess}%</Text>
              <Text style={styles.statLabel}>Success Rate</Text>
            </View>
          </View>
        </Animated.View>

        <Animated.View style={[styles.section, projectsAnimatedStyle]}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Trending Projects</Text>
            <TouchableOpacity style={styles.seeAllButton}>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>

          {mockTrendingProjects.map((project) => {
            const isLiked = likedProjects.includes(project.id);
            const progress = Math.round((project.funding / project.goal) * 100);
            
            return (
              <TouchableOpacity 
                key={project.id} 
                style={styles.projectCard}
                onPress={() => router.push(`/project/${project.id}`)}
              >
                <View style={styles.projectImage}>
                  <Image source={{ uri: project.image_url }} style={styles.projectImage} />
                  <View style={styles.mediaOverlay}>
                    {project.has_audio && (
                      <TouchableOpacity 
                        style={styles.mediaBadge}
                        onPress={() => handlePlayAudio(project.id)}
                      >
                        <Text style={styles.mediaBadgeText}>🎵 AUDIO</Text>
                      </TouchableOpacity>
                    )}
                    {project.has_video && (
                      <TouchableOpacity 
                        style={styles.mediaBadge}
                        onPress={() => handlePlayVideo(project.id)}
                      >
                        <Text style={styles.mediaBadgeText}>🎥 VIDEO</Text>
                      </TouchableOpacity>
                    )}
                  </View>
                </View>
                
                <View style={styles.projectContent}>
                  <View style={styles.projectHeader}>
                    <Text style={styles.projectTitle}>{project.title}</Text>
                    <View style={styles.projectActions}>
                      <TouchableOpacity
                        style={styles.actionButton}
                        onPress={() => handleLikeProject(project.id)}
                      >
                        <Heart
                          size={20}
                          color={isLiked ? colors.error : colors.textSecondary}
                          fill={isLiked ? colors.error : 'none'}
                        />
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={styles.actionButton}
                        onPress={() => handleShareProject(project.id)}
                      >
                        <Share2 size={20} color={colors.textSecondary} />
                      </TouchableOpacity>
                      <TouchableOpacity style={styles.actionButton}>
                        <MoreHorizontal size={20} color={colors.textSecondary} />
                      </TouchableOpacity>
                    </View>
                  </View>

                  <Text style={styles.projectCreator}>by {project.creator}</Text>
                  <Text style={styles.projectDescription} numberOfLines={2}>
                    {project.description}
                  </Text>

                  <View style={styles.projectMeta}>
                    <View style={styles.categoryBadge}>
                      <Text style={styles.categoryText}>{project.category}</Text>
                    </View>
                    <View style={styles.fundingInfo}>
                      <Text style={styles.fundingAmount}>{formatCurrency(project.funding)}</Text>
                      <Text style={styles.fundingProgress}>of {formatCurrency(project.goal)}</Text>
                    </View>
                  </View>

                  <View style={styles.progressBar}>
                    <View
                      style={[
                        styles.progressFill,
                        { width: `${Math.min(progress, 100)}%` },
                      ]}
                    />
                  </View>

                  <View style={styles.projectStats}>
                    <View style={styles.statItem}>
                      <TrendingUp size={14} color={colors.textSecondary} />
                      <Text style={styles.statText}>{progress}% funded</Text>
                    </View>
                    <View style={styles.statItem}>
                      <Users size={14} color={colors.textSecondary} />
                      <Text style={styles.statText}>{project.backers} backers</Text>
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            );
          })}
        </Animated.View>
      </ScrollView>
    </View>
  );
}