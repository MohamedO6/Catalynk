import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
  Alert,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import {
  ArrowLeft,
  Heart,
  Share2,
  Play,
  Volume2,
  MapPin,
  Calendar,
  Users,
  DollarSign,
  Star,
  MessageCircle,
  ExternalLink,
} from 'lucide-react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';

const { width } = Dimensions.get('window');

interface ProjectDetails {
  id: string;
  title: string;
  description: string;
  category: string;
  founder_id: string;
  funding_goal: number;
  current_funding: number;
  location?: string;
  website?: string;
  image_url?: string;
  has_audio: boolean;
  has_video: boolean;
  tags: string[];
  team_size: number;
  problem?: string;
  solution?: string;
  market?: string;
  business_model?: string;
  traction?: string;
  created_at: string;
  profiles: {
    full_name: string;
    avatar_url?: string;
    role: string;
  };
}

// Mock project data for demo
const mockProject: ProjectDetails = {
  id: '1',
  title: 'EcoTrack - Carbon Footprint Tracker',
  description: 'AI-powered app that helps individuals and businesses track and reduce their carbon footprint through smart recommendations and real-time monitoring.',
  category: 'CleanTech',
  founder_id: 'mock-founder-id',
  funding_goal: 200000,
  current_funding: 125000,
  location: 'San Francisco, CA',
  website: 'https://ecotrack.app',
  image_url: 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop',
  has_audio: true,
  has_video: true,
  tags: ['AI', 'Sustainability', 'Mobile App', 'Climate Tech'],
  team_size: 5,
  problem: 'Climate change is accelerating, but individuals and businesses lack accessible tools to understand and reduce their environmental impact. Current carbon tracking solutions are complex, expensive, and disconnected from daily activities.',
  solution: 'EcoTrack uses AI to automatically track carbon footprint through smartphone sensors, purchase data, and lifestyle inputs. It provides personalized recommendations, gamification, and connects users with carbon offset opportunities.',
  market: 'The global carbon management software market is expected to reach $22.5 billion by 2027. Our target includes 50M+ environmentally conscious consumers and 500K+ SMBs seeking sustainability solutions.',
  business_model: 'Freemium SaaS model with premium features for detailed analytics, business accounts for companies, and commission from carbon offset marketplace partnerships.',
  traction: 'Beta version has 2,500 active users with 4.8/5 rating. Partnerships signed with 3 major retailers for purchase data integration. $50K in pre-orders secured.',
  created_at: '2024-01-15T00:00:00Z',
  profiles: {
    full_name: 'Sarah Chen',
    avatar_url: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop',
    role: 'founder',
  },
};

export default function ProjectDetail() {
  const { colors } = useTheme();
  const { profile } = useAuth();
  const { id } = useLocalSearchParams();
  const [project, setProject] = useState<ProjectDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [isLiked, setIsLiked] = useState(false);

  useEffect(() => {
    if (id) {
      fetchProject();
    }
  }, [id]);

  const fetchProject = async () => {
    try {
      // For demo purposes, use mock data
      // In production, this would fetch from Supabase
      setTimeout(() => {
        setProject(mockProject);
        setLoading(false);
      }, 500);

      /* Production code:
      const { data, error } = await supabase
        .from('projects')
        .select(`
          *,
          profiles:founder_id (
            full_name,
            avatar_url,
            role
          )
        `)
        .eq('id', id)
        .single();

      if (error) {
        console.error('Error fetching project:', error);
        Alert.alert('Error', 'Failed to load project details.');
        return;
      }

      setProject(data);
      */
    } catch (error) {
      console.error('Error:', error);
      Alert.alert('Error', 'Failed to load project details.');
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    router.back();
  };

  const handleLike = () => {
    setIsLiked(!isLiked);
    Alert.alert('Liked', isLiked ? 'Removed from favorites' : 'Added to favorites!');
  };

  const handleShare = () => {
    Alert.alert('Share Project', 'Project link copied to clipboard!');
  };

  const handlePlayAudio = () => {
    Alert.alert('Audio Playing', 'Playing AI-generated pitch audio...');
  };

  const handlePlayVideo = () => {
    Alert.alert('Video Playing', 'Opening AI-generated video introduction...');
  };

  const handleInvest = () => {
    if (profile?.role !== 'investor') {
      Alert.alert('Access Restricted', 'Only investors can invest in projects.');
      return;
    }
    Alert.alert('Investment', 'Investment feature coming soon!');
  };

  const handleContact = () => {
    Alert.alert('Contact Founder', 'Messaging feature coming soon!');
  };

  const handleJoinTeam = () => {
    Alert.alert('Join Team', 'Team joining feature coming soon!');
  };

  const handleWebsite = () => {
    if (project?.website) {
      Alert.alert('Opening Website', `Opening ${project.website}...`);
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getProgress = () => {
    if (!project || project.funding_goal === 0) return 0;
    return Math.round((project.current_funding / project.funding_goal) * 100);
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 20,
      paddingTop: 60,
      paddingBottom: 20,
      backgroundColor: colors.background,
    },
    headerLeft: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    backButton: {
      marginRight: 20,
    },
    headerTitle: {
      fontSize: 18,
      fontFamily: 'Inter-SemiBold',
      color: colors.text,
    },
    headerActions: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    actionButton: {
      padding: 8,
      marginLeft: 8,
      backgroundColor: colors.surface,
      borderRadius: 20,
    },
    scrollContainer: {
      flex: 1,
    },
    projectImage: {
      width: '100%',
      height: 250,
    },
    content: {
      padding: 20,
    },
    projectHeader: {
      marginBottom: 20,
    },
    projectTitle: {
      fontSize: 28,
      fontFamily: 'Inter-Bold',
      color: colors.text,
      marginBottom: 8,
    },
    founderInfo: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 16,
    },
    founderAvatar: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: colors.primary,
      marginRight: 12,
    },
    founderDetails: {
      flex: 1,
    },
    founderName: {
      fontSize: 16,
      fontFamily: 'Inter-SemiBold',
      color: colors.text,
    },
    founderRole: {
      fontSize: 14,
      fontFamily: 'Inter-Medium',
      color: colors.textSecondary,
    },
    categoryBadge: {
      backgroundColor: colors.primary + '20',
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 16,
      alignSelf: 'flex-start',
    },
    categoryText: {
      fontSize: 14,
      fontFamily: 'Inter-SemiBold',
      color: colors.primary,
    },
    mediaButtons: {
      flexDirection: 'row',
      marginBottom: 20,
    },
    mediaButton: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.surface,
      paddingHorizontal: 16,
      paddingVertical: 12,
      borderRadius: 12,
      marginRight: 12,
    },
    mediaButtonText: {
      fontSize: 14,
      fontFamily: 'Inter-SemiBold',
      color: colors.text,
      marginLeft: 8,
    },
    description: {
      fontSize: 16,
      fontFamily: 'Inter-Regular',
      color: colors.textSecondary,
      lineHeight: 24,
      marginBottom: 24,
    },
    metaContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      marginBottom: 24,
    },
    metaItem: {
      flexDirection: 'row',
      alignItems: 'center',
      marginRight: 20,
      marginBottom: 12,
    },
    metaText: {
      fontSize: 14,
      fontFamily: 'Inter-Medium',
      color: colors.textSecondary,
      marginLeft: 8,
    },
    fundingSection: {
      backgroundColor: colors.card,
      borderRadius: 16,
      padding: 20,
      marginBottom: 24,
      borderWidth: 1,
      borderColor: colors.border,
    },
    fundingHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 16,
    },
    fundingAmount: {
      fontSize: 24,
      fontFamily: 'Inter-Bold',
      color: colors.success,
    },
    fundingTarget: {
      fontSize: 16,
      fontFamily: 'Inter-Medium',
      color: colors.textSecondary,
    },
    progressBar: {
      height: 8,
      backgroundColor: colors.border,
      borderRadius: 4,
      marginBottom: 12,
    },
    progressFill: {
      height: '100%',
      backgroundColor: colors.success,
      borderRadius: 4,
    },
    progressText: {
      fontSize: 14,
      fontFamily: 'Inter-Medium',
      color: colors.textSecondary,
      textAlign: 'center',
    },
    section: {
      marginBottom: 24,
    },
    sectionTitle: {
      fontSize: 20,
      fontFamily: 'Inter-Bold',
      color: colors.text,
      marginBottom: 12,
    },
    sectionContent: {
      fontSize: 16,
      fontFamily: 'Inter-Regular',
      color: colors.textSecondary,
      lineHeight: 24,
    },
    tagsContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      marginBottom: 24,
    },
    tag: {
      backgroundColor: colors.surface,
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 16,
      marginRight: 8,
      marginBottom: 8,
    },
    tagText: {
      fontSize: 12,
      fontFamily: 'Inter-Medium',
      color: colors.textSecondary,
    },
    actionButtons: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: 20,
    },
    primaryButton: {
      backgroundColor: colors.primary,
      paddingVertical: 16,
      paddingHorizontal: 24,
      borderRadius: 12,
      flex: 1,
      marginRight: 8,
      alignItems: 'center',
    },
    secondaryButton: {
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.border,
      paddingVertical: 16,
      paddingHorizontal: 24,
      borderRadius: 12,
      flex: 1,
      marginLeft: 8,
      alignItems: 'center',
    },
    buttonText: {
      fontSize: 16,
      fontFamily: 'Inter-SemiBold',
      color: '#FFFFFF',
    },
    secondaryButtonText: {
      fontSize: 16,
      fontFamily: 'Inter-SemiBold',
      color: colors.text,
    },
    loadingText: {
      fontSize: 16,
      fontFamily: 'Inter-Medium',
      color: colors.textSecondary,
      textAlign: 'center',
      marginTop: 100,
    },
  });

  if (loading) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={handleBack}>
            <ArrowLeft size={24} color={colors.text} />
          </TouchableOpacity>
        </View>
        <Text style={styles.loadingText}>Loading project...</Text>
      </View>
    );
  }

  if (!project) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={handleBack}>
            <ArrowLeft size={24} color={colors.text} />
          </TouchableOpacity>
        </View>
        <Text style={styles.loadingText}>Project not found</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <TouchableOpacity style={styles.backButton} onPress={handleBack}>
              <ArrowLeft size={24} color={colors.text} />
            </TouchableOpacity>
            <Text style={styles.headerTitle} numberOfLines={1}>
              {project.title}
            </Text>
          </View>
          <View style={styles.headerActions}>
            <TouchableOpacity style={styles.actionButton} onPress={handleLike}>
              <Heart
                size={20}
                color={isLiked ? colors.error : colors.textSecondary}
                fill={isLiked ? colors.error : 'none'}
              />
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton} onPress={handleShare}>
              <Share2 size={20} color={colors.textSecondary} />
            </TouchableOpacity>
          </View>
        </View>

        {project.image_url && (
          <Image source={{ uri: project.image_url }} style={styles.projectImage} />
        )}

        <View style={styles.content}>
          <View style={styles.projectHeader}>
            <Text style={styles.projectTitle}>{project.title}</Text>
            
            <View style={styles.founderInfo}>
              <View style={styles.founderAvatar} />
              <View style={styles.founderDetails}>
                <Text style={styles.founderName}>{project.profiles?.full_name}</Text>
                <Text style={styles.founderRole}>{project.profiles?.role}</Text>
              </View>
              <View style={styles.categoryBadge}>
                <Text style={styles.categoryText}>{project.category}</Text>
              </View>
            </View>
          </View>

          {(project.has_audio || project.has_video) && (
            <View style={styles.mediaButtons}>
              {project.has_audio && (
                <TouchableOpacity style={styles.mediaButton} onPress={handlePlayAudio}>
                  <Volume2 size={20} color={colors.text} />
                  <Text style={styles.mediaButtonText}>Play Pitch</Text>
                </TouchableOpacity>
              )}
              {project.has_video && (
                <TouchableOpacity style={styles.mediaButton} onPress={handlePlayVideo}>
                  <Play size={20} color={colors.text} />
                  <Text style={styles.mediaButtonText}>Watch Video</Text>
                </TouchableOpacity>
              )}
            </View>
          )}

          <Text style={styles.description}>{project.description}</Text>

          <View style={styles.metaContainer}>
            {project.location && (
              <View style={styles.metaItem}>
                <MapPin size={16} color={colors.textSecondary} />
                <Text style={styles.metaText}>{project.location}</Text>
              </View>
            )}
            <View style={styles.metaItem}>
              <Calendar size={16} color={colors.textSecondary} />
              <Text style={styles.metaText}>{formatDate(project.created_at)}</Text>
            </View>
            <View style={styles.metaItem}>
              <Users size={16} color={colors.textSecondary} />
              <Text style={styles.metaText}>{project.team_size} team members</Text>
            </View>
            {project.website && (
              <TouchableOpacity style={styles.metaItem} onPress={handleWebsite}>
                <ExternalLink size={16} color={colors.primary} />
                <Text style={[styles.metaText, { color: colors.primary }]}>Visit Website</Text>
              </TouchableOpacity>
            )}
          </View>

          {project.funding_goal > 0 && (
            <View style={styles.fundingSection}>
              <View style={styles.fundingHeader}>
                <Text style={styles.fundingAmount}>
                  {formatCurrency(project.current_funding)}
                </Text>
                <Text style={styles.fundingTarget}>
                  of {formatCurrency(project.funding_goal)} goal
                </Text>
              </View>
              <View style={styles.progressBar}>
                <View
                  style={[
                    styles.progressFill,
                    { width: `${Math.min(getProgress(), 100)}%` },
                  ]}
                />
              </View>
              <Text style={styles.progressText}>{getProgress()}% funded</Text>
            </View>
          )}

          {project.problem && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Problem</Text>
              <Text style={styles.sectionContent}>{project.problem}</Text>
            </View>
          )}

          {project.solution && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Solution</Text>
              <Text style={styles.sectionContent}>{project.solution}</Text>
            </View>
          )}

          {project.market && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Market</Text>
              <Text style={styles.sectionContent}>{project.market}</Text>
            </View>
          )}

          {project.business_model && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Business Model</Text>
              <Text style={styles.sectionContent}>{project.business_model}</Text>
            </View>
          )}

          {project.traction && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Traction</Text>
              <Text style={styles.sectionContent}>{project.traction}</Text>
            </View>
          )}

          {project.tags && project.tags.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Tags</Text>
              <View style={styles.tagsContainer}>
                {project.tags.map((tag, index) => (
                  <View key={index} style={styles.tag}>
                    <Text style={styles.tagText}>{tag}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          <View style={styles.actionButtons}>
            {profile?.role === 'investor' && project.funding_goal > 0 ? (
              <TouchableOpacity style={styles.primaryButton} onPress={handleInvest}>
                <Text style={styles.buttonText}>Invest Now</Text>
              </TouchableOpacity>
            ) : profile?.role === 'freelancer' ? (
              <TouchableOpacity style={styles.primaryButton} onPress={handleJoinTeam}>
                <Text style={styles.buttonText}>Join Team</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity style={styles.primaryButton} onPress={handleContact}>
                <Text style={styles.buttonText}>Contact Founder</Text>
              </TouchableOpacity>
            )}
            
            <TouchableOpacity style={styles.secondaryButton} onPress={handleContact}>
              <Text style={styles.secondaryButtonText}>Message</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}