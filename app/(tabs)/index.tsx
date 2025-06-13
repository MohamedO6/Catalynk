import React, { useState, useEffect } from 'react';
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
import {
  Plus,
  Play,
  TrendingUp,
  Users,
  Crown,
  Bell,
  Search,
  Mic,
  Video,
  Share2,
  Heart,
  MoreHorizontal,
} from 'lucide-react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { useAuth } from '@/contexts/AuthContext';

const { width } = Dimensions.get('window');

interface Episode {
  id: string;
  title: string;
  description: string;
  creator: string;
  duration: string;
  plays: number;
  likes: number;
  image_url: string;
  has_video: boolean;
  created_at: string;
}

const mockStats = {
  totalEpisodes: 1247,
  totalPlays: 45632,
  totalCreators: 892,
  avgRating: 4.8,
};

const mockTrendingEpisodes: Episode[] = [
  {
    id: '1',
    title: 'The Future of AI in Content Creation',
    description: 'Exploring how artificial intelligence is revolutionizing the way we create and consume content.',
    creator: 'Sarah Chen',
    duration: '12:34',
    plays: 2847,
    likes: 234,
    image_url: 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=400&h=200&fit=crop',
    has_video: true,
    created_at: '2024-01-15',
  },
  {
    id: '2',
    title: 'Building Sustainable Startups',
    description: 'A deep dive into creating businesses that are both profitable and environmentally conscious.',
    creator: 'Marcus Johnson',
    duration: '18:22',
    plays: 1923,
    likes: 189,
    image_url: 'https://images.pexels.com/photos/3184292/pexels-photo-3184292.jpeg?auto=compress&cs=tinysrgb&w=400&h=200&fit=crop',
    has_video: false,
    created_at: '2024-01-14',
  },
  {
    id: '3',
    title: 'The Psychology of Decision Making',
    description: 'Understanding the cognitive biases that influence our daily choices and how to overcome them.',
    creator: 'Dr. Emily Rodriguez',
    duration: '15:45',
    plays: 3156,
    likes: 298,
    image_url: 'https://images.pexels.com/photos/3184293/pexels-photo-3184293.jpeg?auto=compress&cs=tinysrgb&w=400&h=200&fit=crop',
    has_video: true,
    created_at: '2024-01-13',
  },
];

export default function Home() {
  const { colors } = useTheme();
  const { profile } = useAuth();
  const [likedEpisodes, setLikedEpisodes] = useState<string[]>([]);

  const handleCreateEpisode = () => {
    router.push('/create-episode');
  };

  const handlePlayEpisode = (episodeId: string) => {
    Alert.alert('Playing Episode', 'Episode player would open here with audio/video playback.');
  };

  const handleLikeEpisode = (episodeId: string) => {
    setLikedEpisodes(prev =>
      prev.includes(episodeId)
        ? prev.filter(id => id !== episodeId)
        : [...prev, episodeId]
    );
  };

  const handleShareEpisode = (episodeId: string) => {
    Alert.alert('Share Episode', 'Episode link copied to clipboard!');
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
    episodeCard: {
      backgroundColor: colors.card,
      borderRadius: 16,
      marginBottom: 16,
      borderWidth: 1,
      borderColor: colors.border,
      overflow: 'hidden',
    },
    episodeImage: {
      width: '100%',
      height: 160,
      position: 'relative',
    },
    playOverlay: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.3)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    playButton: {
      width: 60,
      height: 60,
      borderRadius: 30,
      backgroundColor: colors.primary,
      justifyContent: 'center',
      alignItems: 'center',
    },
    videoBadge: {
      position: 'absolute',
      top: 12,
      right: 12,
      backgroundColor: colors.error,
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 12,
      flexDirection: 'row',
      alignItems: 'center',
    },
    videoBadgeText: {
      fontSize: 10,
      fontFamily: 'Inter-Bold',
      color: '#FFFFFF',
      marginLeft: 4,
    },
    episodeContent: {
      padding: 16,
    },
    episodeHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: 8,
    },
    episodeTitle: {
      fontSize: 18,
      fontFamily: 'Inter-Bold',
      color: colors.text,
      flex: 1,
      marginRight: 12,
    },
    episodeActions: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    actionButton: {
      padding: 6,
      marginLeft: 8,
    },
    episodeCreator: {
      fontSize: 14,
      fontFamily: 'Inter-Medium',
      color: colors.textSecondary,
      marginBottom: 8,
    },
    episodeDescription: {
      fontSize: 15,
      fontFamily: 'Inter-Regular',
      color: colors.textSecondary,
      lineHeight: 22,
      marginBottom: 12,
    },
    episodeStats: {
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
    duration: {
      fontSize: 14,
      fontFamily: 'Inter-SemiBold',
      color: colors.primary,
    },
  });

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[colors.primary + '10', colors.background]}
        style={styles.header}
      >
        <View style={styles.headerTop}>
          <View style={styles.greeting}>
            <Text style={styles.title}>Welcome back!</Text>
            <Text style={styles.subtitle}>
              Ready to create your next podcast episode?
            </Text>
          </View>
          <View style={styles.headerActions}>
            {profile?.tier === 'free' && (
              <TouchableOpacity style={styles.upgradeButton} onPress={handleUpgrade}>
                <Crown size={16} color={colors.warning} />
                <Text style={styles.upgradeText}>Upgrade</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity style={styles.notificationButton} onPress={handleNotifications}>
              <Bell size={20} color={colors.text} />
            </TouchableOpacity>
          </View>
        </View>
      </LinearGradient>

      <View style={styles.quickActions}>
        <TouchableOpacity style={styles.quickActionButton} onPress={handleCreateEpisode}>
          <Plus size={20} color="#FFFFFF" />
          <Text style={styles.quickActionText}>Create Episode</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.secondaryActionButton}>
          <Search size={20} color={colors.text} />
          <Text style={styles.secondaryActionText}>Discover</Text>
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.statsContainer}>
          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>{formatNumber(mockStats.totalEpisodes)}</Text>
              <Text style={styles.statLabel}>Total Episodes</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>{formatNumber(mockStats.totalPlays)}</Text>
              <Text style={styles.statLabel}>Total Plays</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>{formatNumber(mockStats.totalCreators)}</Text>
              <Text style={styles.statLabel}>Creators</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>{mockStats.avgRating}</Text>
              <Text style={styles.statLabel}>Avg Rating</Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Trending Episodes</Text>
            <TouchableOpacity style={styles.seeAllButton}>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>

          {mockTrendingEpisodes.map((episode) => {
            const isLiked = likedEpisodes.includes(episode.id);
            
            return (
              <TouchableOpacity 
                key={episode.id} 
                style={styles.episodeCard}
                onPress={() => handlePlayEpisode(episode.id)}
              >
                <View style={styles.episodeImage}>
                  <Image source={{ uri: episode.image_url }} style={styles.episodeImage} />
                  <View style={styles.playOverlay}>
                    <TouchableOpacity 
                      style={styles.playButton}
                      onPress={() => handlePlayEpisode(episode.id)}
                    >
                      <Play size={24} color="#FFFFFF" />
                    </TouchableOpacity>
                  </View>
                  {episode.has_video && (
                    <View style={styles.videoBadge}>
                      <Video size={12} color="#FFFFFF" />
                      <Text style={styles.videoBadgeText}>VIDEO</Text>
                    </View>
                  )}
                </View>
                
                <View style={styles.episodeContent}>
                  <View style={styles.episodeHeader}>
                    <Text style={styles.episodeTitle}>{episode.title}</Text>
                    <View style={styles.episodeActions}>
                      <TouchableOpacity
                        style={styles.actionButton}
                        onPress={() => handleLikeEpisode(episode.id)}
                      >
                        <Heart
                          size={20}
                          color={isLiked ? colors.error : colors.textSecondary}
                          fill={isLiked ? colors.error : 'none'}
                        />
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={styles.actionButton}
                        onPress={() => handleShareEpisode(episode.id)}
                      >
                        <Share2 size={20} color={colors.textSecondary} />
                      </TouchableOpacity>
                      <TouchableOpacity style={styles.actionButton}>
                        <MoreHorizontal size={20} color={colors.textSecondary} />
                      </TouchableOpacity>
                    </View>
                  </View>

                  <Text style={styles.episodeCreator}>by {episode.creator}</Text>
                  <Text style={styles.episodeDescription} numberOfLines={2}>
                    {episode.description}
                  </Text>

                  <View style={styles.episodeStats}>
                    <View style={styles.statItem}>
                      <Play size={14} color={colors.textSecondary} />
                      <Text style={styles.statText}>{formatNumber(episode.plays)}</Text>
                    </View>
                    <View style={styles.statItem}>
                      <Heart size={14} color={colors.textSecondary} />
                      <Text style={styles.statText}>{formatNumber(episode.likes)}</Text>
                    </View>
                    <Text style={styles.duration}>{episode.duration}</Text>
                  </View>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>
    </View>
  );
}