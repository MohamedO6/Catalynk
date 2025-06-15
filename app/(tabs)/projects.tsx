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
  Alert,
} from 'react-native';
import { router } from 'expo-router';
import {
  Search,
  Filter,
  Plus,
  Heart,
  Share2,
  Clock,
  MapPin,
  Star,
  Users,
  Play,
  Volume2,
} from 'lucide-react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';

const { width } = Dimensions.get('window');

interface Project {
  id: string;
  title: string;
  description: string;
  category: string;
  founder_id: string;
  funding_goal: number;
  current_funding: number;
  location?: string;
  image_url?: string;
  has_audio: boolean;
  has_video: boolean;
  tags: string[];
  team_size: number;
  created_at: string;
  profiles: {
    full_name: string;
    avatar_url?: string;
  };
}

const categories = ['All', 'Fintech', 'HealthTech', 'AgTech', 'EdTech', 'CleanTech', 'AI/ML'];

// Mock projects for demo
const mockProjects: Project[] = [
  {
    id: '1',
    title: 'EcoTrack - Carbon Footprint Tracker',
    description: 'AI-powered app that helps individuals and businesses track and reduce their carbon footprint through smart recommendations.',
    category: 'CleanTech',
    founder_id: 'founder1',
    funding_goal: 200000,
    current_funding: 125000,
    location: 'San Francisco, CA',
    image_url: 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=400&h=200&fit=crop',
    has_audio: true,
    has_video: true,
    tags: ['AI', 'Sustainability', 'Mobile App'],
    team_size: 5,
    created_at: '2024-01-15T00:00:00Z',
    profiles: {
      full_name: 'Sarah Chen',
      avatar_url: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=50&h=50&fit=crop',
    },
  },
  {
    id: '2',
    title: 'MindfulAI - Mental Health Assistant',
    description: 'Personalized mental health support using AI to provide 24/7 emotional guidance and therapy recommendations.',
    category: 'HealthTech',
    founder_id: 'founder2',
    funding_goal: 150000,
    current_funding: 89000,
    location: 'New York, NY',
    image_url: 'https://images.pexels.com/photos/3184292/pexels-photo-3184292.jpeg?auto=compress&cs=tinysrgb&w=400&h=200&fit=crop',
    has_audio: false,
    has_video: true,
    tags: ['AI', 'Mental Health', 'Healthcare'],
    team_size: 3,
    created_at: '2024-01-14T00:00:00Z',
    profiles: {
      full_name: 'Marcus Johnson',
      avatar_url: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=50&h=50&fit=crop',
    },
  },
  {
    id: '3',
    title: 'BlockLearn - Decentralized Education',
    description: 'Blockchain-based learning platform that rewards students with tokens for completing courses and achieving milestones.',
    category: 'EdTech',
    founder_id: 'founder3',
    funding_goal: 300000,
    current_funding: 234000,
    location: 'Austin, TX',
    image_url: 'https://images.pexels.com/photos/3184293/pexels-photo-3184293.jpeg?auto=compress&cs=tinysrgb&w=400&h=200&fit=crop',
    has_audio: true,
    has_video: false,
    tags: ['Blockchain', 'Education', 'Tokens'],
    team_size: 8,
    created_at: '2024-01-13T00:00:00Z',
    profiles: {
      full_name: 'Dr. Emily Rodriguez',
      avatar_url: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=50&h=50&fit=crop',
    },
  },
];

export default function Projects() {
  const { colors } = useTheme();
  const { profile } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [likedProjects, setLikedProjects] = useState<string[]>([]);

  useEffect(() => {
    fetchProjects();
  }, [selectedCategory]);

  const fetchProjects = async () => {
    try {
      // For demo purposes, use mock data
      setTimeout(() => {
        setProjects(mockProjects);
        setLoading(false);
      }, 500);

      /* Production code:
      let query = supabase
        .from('projects')
        .select(`
          *,
          profiles:founder_id (
            full_name,
            avatar_url
          )
        `)
        .eq('status', 'active')
        .order('created_at', { ascending: false });

      if (selectedCategory !== 'All') {
        query = query.eq('category', selectedCategory);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching projects:', error);
        return;
      }

      setProjects(data || []);
      */
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleLike = (projectId: string) => {
    setLikedProjects(prev =>
      prev.includes(projectId)
        ? prev.filter(id => id !== projectId)
        : [...prev, projectId]
    );
    Alert.alert('Liked', 'Project added to your favorites!');
  };

  const handleCreateProject = () => {
    if (profile?.role !== 'founder') {
      Alert.alert('Access Restricted', 'Only founders can create projects. Please update your profile role.');
      return;
    }
    router.push('/create-project');
  };

  const handleProjectPress = (projectId: string) => {
    router.push(`/project/${projectId}`);
  };

  const handleSearch = () => {
    if (searchQuery.trim()) {
      // Filter projects by search query
      const filtered = projects.filter(project =>
        project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setProjects(filtered);
    } else {
      fetchProjects();
    }
  };

  const handlePlayAudio = (projectId: string) => {
    Alert.alert('Audio Playing', 'Playing AI-generated pitch audio...');
  };

  const handlePlayVideo = (projectId: string) => {
    Alert.alert('Video Playing', 'Opening AI-generated video introduction...');
  };

  const handleShare = (projectId: string) => {
    Alert.alert('Share Project', 'Project link copied to clipboard!');
  };

  const getScreenTitle = () => {
    switch (profile?.role) {
      case 'founder':
        return 'Your Projects';
      case 'freelancer':
        return 'Browse Projects';
      case 'investor':
        return 'Investment Opportunities';
      default:
        return 'Projects';
    }
  };

  const formatCurrency = (amount: number) => {
    if (amount >= 1000000) {
      return `$${(amount / 1000000).toFixed(1)}M`;
    } else if (amount >= 1000) {
      return `$${(amount / 1000).toFixed(0)}K`;
    } else {
      return `$${amount}`;
    }
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffInDays === 0) return 'Today';
    if (diffInDays === 1) return 'Yesterday';
    if (diffInDays < 7) return `${diffInDays} days ago`;
    return date.toLocaleDateString();
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    scrollContainer: {
      flexGrow: 1,
    },
    header: {
      paddingTop: 60,
      paddingHorizontal: 20,
      paddingBottom: 20,
      backgroundColor: colors.background,
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
    createButton: {
      backgroundColor: colors.primary,
      width: 44,
      height: 44,
      borderRadius: 22,
      justifyContent: 'center',
      alignItems: 'center',
    },
    searchContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.surface,
      borderRadius: 12,
      paddingHorizontal: 16,
      marginBottom: 16,
    },
    searchInput: {
      flex: 1,
      fontSize: 16,
      fontFamily: 'Inter-Regular',
      color: colors.text,
      paddingVertical: 12,
      marginLeft: 12,
    },
    searchButton: {
      padding: 8,
    },
    filterButton: {
      backgroundColor: colors.surface,
      padding: 12,
      borderRadius: 12,
      marginLeft: 12,
    },
    categoriesContainer: {
      paddingVertical: 10,
    },
    categoriesScrollView: {
      paddingHorizontal: 20,
    },
    categoryButton: {
      backgroundColor: colors.surface,
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderRadius: 20,
      marginRight: 12,
      borderWidth: 1,
      borderColor: colors.border,
    },
    categoryButtonActive: {
      backgroundColor: colors.primary,
      borderColor: colors.primary,
    },
    categoryText: {
      fontSize: 14,
      fontFamily: 'Inter-Medium',
      color: colors.text,
    },
    categoryTextActive: {
      color: '#FFFFFF',
    },
    projectsContainer: {
      flex: 1,
      paddingHorizontal: 20,
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
      padding: 20,
    },
    projectHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: 12,
    },
    projectTitleContainer: {
      flex: 1,
      marginRight: 16,
    },
    projectTitle: {
      fontSize: 20,
      fontFamily: 'Inter-Bold',
      color: colors.text,
      marginBottom: 4,
    },
    projectFounder: {
      fontSize: 14,
      fontFamily: 'Inter-Medium',
      color: colors.textSecondary,
    },
    projectActions: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    actionButton: {
      padding: 8,
      marginLeft: 8,
      backgroundColor: colors.surface,
      borderRadius: 20,
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
      alignItems: 'center',
      marginBottom: 16,
    },
    metaItem: {
      flexDirection: 'row',
      alignItems: 'center',
      marginRight: 20,
    },
    metaText: {
      fontSize: 14,
      fontFamily: 'Inter-Medium',
      color: colors.textSecondary,
      marginLeft: 6,
    },
    fundingContainer: {
      marginBottom: 16,
    },
    fundingHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 8,
    },
    fundingAmount: {
      fontSize: 18,
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
      marginBottom: 8,
    },
    progressFill: {
      height: '100%',
      backgroundColor: colors.success,
      borderRadius: 3,
    },
    progressText: {
      fontSize: 14,
      fontFamily: 'Inter-Medium',
      color: colors.textSecondary,
      textAlign: 'center',
    },
    tagsContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      marginBottom: 16,
    },
    tag: {
      backgroundColor: colors.surface,
      paddingHorizontal: 10,
      paddingVertical: 4,
      borderRadius: 12,
      marginRight: 8,
      marginBottom: 8,
    },
    tagText: {
      fontSize: 12,
      fontFamily: 'Inter-Medium',
      color: colors.textSecondary,
    },
    projectFooter: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    teamInfo: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    teamText: {
      fontSize: 14,
      fontFamily: 'Inter-Medium',
      color: colors.textSecondary,
      marginLeft: 6,
    },
    rating: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    ratingText: {
      fontSize: 14,
      fontFamily: 'Inter-Medium',
      color: colors.textSecondary,
      marginLeft: 4,
    },
    loadingText: {
      fontSize: 16,
      fontFamily: 'Inter-Medium',
      color: colors.textSecondary,
      textAlign: 'center',
      marginTop: 40,
    },
    emptyText: {
      fontSize: 16,
      fontFamily: 'Inter-Medium',
      color: colors.textSecondary,
      textAlign: 'center',
      marginTop: 40,
    },
  });

  return (
    <View style={styles.container}>
      <ScrollView 
        style={styles.container}
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <Text style={styles.title}>{getScreenTitle()}</Text>
            {profile?.role === 'founder' && (
              <TouchableOpacity style={styles.createButton} onPress={handleCreateProject}>
                <Plus size={24} color="#FFFFFF" />
              </TouchableOpacity>
            )}
          </View>

          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <View style={styles.searchContainer}>
              <Search size={20} color={colors.textSecondary} />
              <TextInput
                style={styles.searchInput}
                placeholder="Search projects..."
                placeholderTextColor={colors.textTertiary}
                value={searchQuery}
                onChangeText={setSearchQuery}
                onSubmitEditing={handleSearch}
              />
              <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
                <Search size={16} color={colors.primary} />
              </TouchableOpacity>
            </View>
            <TouchableOpacity style={styles.filterButton}>
              <Filter size={20} color={colors.text} />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.categoriesContainer}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoriesScrollView}
          >
            {categories.map((category) => (
              <TouchableOpacity
                key={category}
                style={[
                  styles.categoryButton,
                  selectedCategory === category && styles.categoryButtonActive,
                ]}
                onPress={() => setSelectedCategory(category)}
              >
                <Text
                  style={[
                    styles.categoryText,
                    selectedCategory === category && styles.categoryTextActive,
                  ]}
                >
                  {category}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <View style={styles.projectsContainer}>
          {loading ? (
            <Text style={styles.loadingText}>Loading projects...</Text>
          ) : projects.length === 0 ? (
            <Text style={styles.emptyText}>No projects found. Be the first to create one!</Text>
          ) : (
            projects.map((project) => {
              const isLiked = likedProjects.includes(project.id);
              const progress = project.funding_goal > 0 
                ? Math.round((project.current_funding / project.funding_goal) * 100)
                : 0;
              
              return (
                <TouchableOpacity 
                  key={project.id} 
                  style={styles.projectCard}
                  onPress={() => handleProjectPress(project.id)}
                >
                  {project.image_url && (
                    <Image source={{ uri: project.image_url }} style={styles.projectImage} />
                  )}
                  
                  <View style={styles.projectContent}>
                    <View style={styles.projectHeader}>
                      <View style={styles.projectTitleContainer}>
                        <Text style={styles.projectTitle}>{project.title}</Text>
                        <Text style={styles.projectFounder}>by {project.profiles?.full_name || 'Unknown'}</Text>
                      </View>
                      <View style={styles.projectActions}>
                        {project.has_audio && (
                          <TouchableOpacity
                            style={styles.actionButton}
                            onPress={() => handlePlayAudio(project.id)}
                          >
                            <Volume2 size={16} color={colors.textSecondary} />
                          </TouchableOpacity>
                        )}
                        {project.has_video && (
                          <TouchableOpacity
                            style={styles.actionButton}
                            onPress={() => handlePlayVideo(project.id)}
                          >
                            <Play size={16} color={colors.textSecondary} />
                          </TouchableOpacity>
                        )}
                        <TouchableOpacity
                          style={styles.actionButton}
                          onPress={() => toggleLike(project.id)}
                        >
                          <Heart
                            size={16}
                            color={isLiked ? colors.error : colors.textSecondary}
                            fill={isLiked ? colors.error : 'none'}
                          />
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={styles.actionButton}
                          onPress={() => handleShare(project.id)}
                        >
                          <Share2 size={16} color={colors.textSecondary} />
                        </TouchableOpacity>
                      </View>
                    </View>

                    <Text style={styles.projectDescription} numberOfLines={3}>
                      {project.description}
                    </Text>

                    <View style={styles.projectMeta}>
                      {project.location && (
                        <View style={styles.metaItem}>
                          <MapPin size={16} color={colors.textSecondary} />
                          <Text style={styles.metaText}>{project.location}</Text>
                        </View>
                      )}
                      <View style={styles.metaItem}>
                        <Clock size={16} color={colors.textSecondary} />
                        <Text style={styles.metaText}>{formatTimeAgo(project.created_at)}</Text>
                      </View>
                    </View>

                    {project.funding_goal > 0 && (
                      <View style={styles.fundingContainer}>
                        <View style={styles.fundingHeader}>
                          <Text style={styles.fundingAmount}>
                            {formatCurrency(project.current_funding)} raised
                          </Text>
                          <Text style={styles.fundingTarget}>
                            of {formatCurrency(project.funding_goal)} goal
                          </Text>
                        </View>
                        <View style={styles.progressBar}>
                          <View
                            style={[
                              styles.progressFill,
                              { width: `${Math.min(progress, 100)}%` },
                            ]}
                          />
                        </View>
                        <Text style={styles.progressText}>{progress}% funded</Text>
                      </View>
                    )}

                    {project.tags && project.tags.length > 0 && (
                      <View style={styles.tagsContainer}>
                        {project.tags.slice(0, 3).map((tag, index) => (
                          <View key={index} style={styles.tag}>
                            <Text style={styles.tagText}>{tag}</Text>
                          </View>
                        ))}
                      </View>
                    )}

                    <View style={styles.projectFooter}>
                      <View style={styles.teamInfo}>
                        <Users size={16} color={colors.textSecondary} />
                        <Text style={styles.teamText}>{project.team_size} team members</Text>
                      </View>
                      <View style={styles.rating}>
                        <Star size={16} color={colors.warning} fill={colors.warning} />
                        <Text style={styles.ratingText}>4.8</Text>
                      </View>
                    </View>
                  </View>
                </TouchableOpacity>
              );
            })
          )}
        </View>
      </ScrollView>
    </View>
  );
}