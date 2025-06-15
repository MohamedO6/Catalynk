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
  Modal,
  Share,
  Linking,
} from 'react-native';
import { router } from 'expo-router';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withSpring,
  withDelay
} from 'react-native-reanimated';
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
  MessageCircle,
  Mail,
  X,
  DollarSign,
  TrendingUp,
  Calendar,
  Tag,
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

const categories = ['All', 'FinTech', 'HealthTech', 'EdTech', 'CleanTech', 'AI/ML', 'Blockchain', 'E-commerce', 'SaaS'];

const sortOptions = [
  { id: 'newest', label: 'Newest First', icon: Calendar },
  { id: 'oldest', label: 'Oldest First', icon: Calendar },
  { id: 'funding_high', label: 'Highest Funding', icon: DollarSign },
  { id: 'funding_low', label: 'Lowest Funding', icon: DollarSign },
  { id: 'popular', label: 'Most Popular', icon: TrendingUp },
  { id: 'team_size', label: 'Team Size', icon: Users },
];

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
  {
    id: '4',
    title: 'FoodieBot - Restaurant Discovery AI',
    description: 'Smart restaurant recommendation system that learns your taste preferences and suggests perfect dining experiences.',
    category: 'AI/ML',
    founder_id: 'founder4',
    funding_goal: 75000,
    current_funding: 45000,
    location: 'Los Angeles, CA',
    image_url: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=400&h=200&fit=crop',
    has_audio: false,
    has_video: false,
    tags: ['AI', 'Food', 'Recommendations'],
    team_size: 2,
    created_at: '2024-01-12T00:00:00Z',
    profiles: {
      full_name: 'Alex Kim',
      avatar_url: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=50&h=50&fit=crop',
    },
  },
  {
    id: '5',
    title: 'CryptoWallet Pro - Secure Digital Assets',
    description: 'Next-generation cryptocurrency wallet with advanced security features and multi-chain support.',
    category: 'Blockchain',
    founder_id: 'founder5',
    funding_goal: 500000,
    current_funding: 320000,
    location: 'Miami, FL',
    image_url: 'https://images.pexels.com/photos/6801648/pexels-photo-6801648.jpeg?auto=compress&cs=tinysrgb&w=400&h=200&fit=crop',
    has_audio: true,
    has_video: true,
    tags: ['Blockchain', 'Security', 'Crypto'],
    team_size: 12,
    created_at: '2024-01-11T00:00:00Z',
    profiles: {
      full_name: 'David Park',
      avatar_url: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=50&h=50&fit=crop',
    },
  },
];

export default function Projects() {
  const { colors } = useTheme();
  const { profile } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [likedProjects, setLikedProjects] = useState<string[]>([]);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [selectedSort, setSelectedSort] = useState('newest');
  const [minFunding, setMinFunding] = useState('');
  const [maxFunding, setMaxFunding] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const headerOpacity = useSharedValue(0);
  const projectsOpacity = useSharedValue(0);

  useEffect(() => {
    headerOpacity.value = withSpring(1);
    projectsOpacity.value = withDelay(200, withSpring(1));
    fetchProjects();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [projects, searchQuery, selectedCategory, selectedSort, minFunding, maxFunding, selectedTags]);

  const fetchProjects = async () => {
    try {
      // For demo purposes, use mock data
      setTimeout(() => {
        setProjects(mockProjects);
        setLoading(false);
      }, 500);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...projects];

    // Search filter
    if (searchQuery.trim()) {
      filtered = filtered.filter(project =>
        project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.profiles.full_name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Category filter
    if (selectedCategory !== 'All') {
      filtered = filtered.filter(project => project.category === selectedCategory);
    }

    // Funding range filter
    if (minFunding) {
      const min = parseFloat(minFunding);
      filtered = filtered.filter(project => project.current_funding >= min);
    }
    if (maxFunding) {
      const max = parseFloat(maxFunding);
      filtered = filtered.filter(project => project.current_funding <= max);
    }

    // Tags filter
    if (selectedTags.length > 0) {
      filtered = filtered.filter(project =>
        selectedTags.some(tag => project.tags.includes(tag))
      );
    }

    // Sort
    filtered.sort((a, b) => {
      switch (selectedSort) {
        case 'newest':
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        case 'oldest':
          return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
        case 'funding_high':
          return b.current_funding - a.current_funding;
        case 'funding_low':
          return a.current_funding - b.current_funding;
        case 'team_size':
          return b.team_size - a.team_size;
        case 'popular':
          // Mock popularity based on funding percentage
          const aPopularity = a.funding_goal > 0 ? (a.current_funding / a.funding_goal) : 0;
          const bPopularity = b.funding_goal > 0 ? (b.current_funding / b.funding_goal) : 0;
          return bPopularity - aPopularity;
        default:
          return 0;
      }
    });

    setFilteredProjects(filtered);
  };

  const toggleLike = (projectId: string) => {
    setLikedProjects(prev =>
      prev.includes(projectId)
        ? prev.filter(id => id !== projectId)
        : [...prev, projectId]
    );
    
    const isLiked = likedProjects.includes(projectId);
    Alert.alert(
      isLiked ? 'Removed from Favorites' : 'Added to Favorites',
      isLiked ? 'Project removed from your favorites' : 'Project added to your favorites!'
    );
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

  const handlePlayAudio = (projectId: string) => {
    Alert.alert('🎵 Playing Audio', 'AI-generated pitch audio is now playing...');
  };

  const handlePlayVideo = (projectId: string) => {
    Alert.alert('🎥 Playing Video', 'AI-generated video introduction is now playing...');
  };

  const generateShareLink = (project: Project) => {
    // Generate unique shareable link
    const baseUrl = 'https://catalynk.app';
    return `${baseUrl}/project/${project.id}?ref=${profile?.id || 'guest'}`;
  };

  const handleShare = async (project: Project) => {
    try {
      const shareUrl = generateShareLink(project);
      const shareMessage = `Check out "${project.title}" by ${project.profiles.full_name} on Catalynk!\n\n${project.description}\n\n${shareUrl}`;

      const result = await Share.share({
        message: shareMessage,
        url: shareUrl,
        title: project.title,
      });

      if (result.action === Share.sharedAction) {
        Alert.alert('Shared Successfully!', 'Project link has been shared.');
      }
    } catch (error) {
      // Fallback for web or if Share API fails
      if (typeof navigator !== 'undefined' && navigator.clipboard) {
        const shareUrl = generateShareLink(project);
        await navigator.clipboard.writeText(shareUrl);
        Alert.alert('Link Copied!', 'Project link has been copied to clipboard.');
      } else {
        Alert.alert('Share Project', 'Project link: ' + generateShareLink(project));
      }
    }
  };

  const handleContactFounder = (project: Project) => {
    Alert.alert(
      'Contact Founder',
      `Would you like to contact ${project.profiles.full_name}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Send Message', 
          onPress: () => router.push(`/messaging/${project.founder_id}`)
        },
        { 
          text: 'Send Email', 
          onPress: () => {
            const subject = `Interested in ${project.title}`;
            const body = `Hi ${project.profiles.full_name},\n\nI'm interested in your project "${project.title}" and would like to learn more.\n\nBest regards,\n${profile?.full_name || 'A Catalynk User'}`;
            Linking.openURL(`mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`);
          }
        }
      ]
    );
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('All');
    setSelectedSort('newest');
    setMinFunding('');
    setMaxFunding('');
    setSelectedTags([]);
    setShowFilterModal(false);
  };

  const getAllTags = () => {
    const allTags = new Set<string>();
    projects.forEach(project => {
      project.tags.forEach(tag => allTags.add(tag));
    });
    return Array.from(allTags).sort();
  };

  const toggleTag = (tag: string) => {
    setSelectedTags(prev =>
      prev.includes(tag)
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
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

  const headerAnimatedStyle = useAnimatedStyle(() => ({
    opacity: headerOpacity.value,
    transform: [{ translateY: (1 - headerOpacity.value) * 20 }],
  }));

  const projectsAnimatedStyle = useAnimatedStyle(() => ({
    opacity: projectsOpacity.value,
    transform: [{ translateY: (1 - projectsOpacity.value) * 30 }],
  }));

  const renderFilterModal = () => (
    <Modal
      visible={showFilterModal}
      transparent={true}
      animationType="slide"
      onRequestClose={() => setShowFilterModal(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.filterModal}>
          <View style={styles.filterHeader}>
            <Text style={styles.filterTitle}>Filter & Sort</Text>
            <TouchableOpacity onPress={() => setShowFilterModal(false)}>
              <X size={24} color={colors.text} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.filterContent} showsVerticalScrollIndicator={false}>
            {/* Sort Options */}
            <View style={styles.filterSection}>
              <Text style={styles.filterSectionTitle}>Sort By</Text>
              {sortOptions.map((option) => {
                const Icon = option.icon;
                return (
                  <TouchableOpacity
                    key={option.id}
                    style={[
                      styles.filterOption,
                      selectedSort === option.id && styles.filterOptionActive
                    ]}
                    onPress={() => setSelectedSort(option.id)}
                  >
                    <Icon size={20} color={selectedSort === option.id ? colors.primary : colors.textSecondary} />
                    <Text style={[
                      styles.filterOptionText,
                      selectedSort === option.id && styles.filterOptionTextActive
                    ]}>
                      {option.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Funding Range */}
            <View style={styles.filterSection}>
              <Text style={styles.filterSectionTitle}>Funding Range</Text>
              <View style={styles.fundingInputs}>
                <TextInput
                  style={styles.fundingInput}
                  placeholder="Min ($)"
                  placeholderTextColor={colors.textTertiary}
                  value={minFunding}
                  onChangeText={setMinFunding}
                  keyboardType="numeric"
                />
                <Text style={styles.fundingDash}>-</Text>
                <TextInput
                  style={styles.fundingInput}
                  placeholder="Max ($)"
                  placeholderTextColor={colors.textTertiary}
                  value={maxFunding}
                  onChangeText={setMaxFunding}
                  keyboardType="numeric"
                />
              </View>
            </View>

            {/* Tags */}
            <View style={styles.filterSection}>
              <Text style={styles.filterSectionTitle}>Tags</Text>
              <View style={styles.tagsContainer}>
                {getAllTags().map((tag) => (
                  <TouchableOpacity
                    key={tag}
                    style={[
                      styles.tagButton,
                      selectedTags.includes(tag) && styles.tagButtonActive
                    ]}
                    onPress={() => toggleTag(tag)}
                  >
                    <Text style={[
                      styles.tagButtonText,
                      selectedTags.includes(tag) && styles.tagButtonTextActive
                    ]}>
                      {tag}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </ScrollView>

          <View style={styles.filterActions}>
            <TouchableOpacity style={styles.clearButton} onPress={clearFilters}>
              <Text style={styles.clearButtonText}>Clear All</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.applyButton} onPress={() => setShowFilterModal(false)}>
              <Text style={styles.applyButtonText}>Apply Filters</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );

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
      shadowColor: colors.primary,
      shadowOffset: {
        width: 0,
        height: 4,
      },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 8,
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
    resultsHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 16,
    },
    resultsCount: {
      fontSize: 16,
      fontFamily: 'Inter-Medium',
      color: colors.textSecondary,
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
      backgroundColor: 'rgba(0,0,0,0.8)',
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 12,
      marginLeft: 4,
      flexDirection: 'row',
      alignItems: 'center',
    },
    mediaBadgeText: {
      fontSize: 10,
      fontFamily: 'Inter-Bold',
      color: '#FFFFFF',
      marginLeft: 4,
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
      paddingTop: 16,
      borderTopWidth: 1,
      borderTopColor: colors.border,
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
    contactButton: {
      backgroundColor: colors.primary,
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderRadius: 20,
      flexDirection: 'row',
      alignItems: 'center',
    },
    contactButtonText: {
      fontSize: 14,
      fontFamily: 'Inter-SemiBold',
      color: '#FFFFFF',
      marginLeft: 6,
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
    modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      justifyContent: 'flex-end',
    },
    filterModal: {
      backgroundColor: colors.card,
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      maxHeight: '80%',
    },
    filterHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: 20,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    filterTitle: {
      fontSize: 20,
      fontFamily: 'Inter-Bold',
      color: colors.text,
    },
    filterContent: {
      flex: 1,
      padding: 20,
    },
    filterSection: {
      marginBottom: 24,
    },
    filterSectionTitle: {
      fontSize: 16,
      fontFamily: 'Inter-Bold',
      color: colors.text,
      marginBottom: 12,
    },
    filterOption: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 12,
      paddingHorizontal: 16,
      borderRadius: 8,
      marginBottom: 8,
    },
    filterOptionActive: {
      backgroundColor: colors.primary + '20',
    },
    filterOptionText: {
      fontSize: 16,
      fontFamily: 'Inter-Medium',
      color: colors.textSecondary,
      marginLeft: 12,
    },
    filterOptionTextActive: {
      color: colors.primary,
    },
    fundingInputs: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    fundingInput: {
      flex: 1,
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 8,
      paddingVertical: 12,
      paddingHorizontal: 16,
      fontSize: 16,
      fontFamily: 'Inter-Regular',
      color: colors.text,
    },
    fundingDash: {
      fontSize: 16,
      fontFamily: 'Inter-Medium',
      color: colors.textSecondary,
      marginHorizontal: 12,
    },
    tagButton: {
      backgroundColor: colors.surface,
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 16,
      marginRight: 8,
      marginBottom: 8,
      borderWidth: 1,
      borderColor: colors.border,
    },
    tagButtonActive: {
      backgroundColor: colors.primary,
      borderColor: colors.primary,
    },
    tagButtonText: {
      fontSize: 14,
      fontFamily: 'Inter-Medium',
      color: colors.text,
    },
    tagButtonTextActive: {
      color: '#FFFFFF',
    },
    filterActions: {
      flexDirection: 'row',
      padding: 20,
      borderTopWidth: 1,
      borderTopColor: colors.border,
    },
    clearButton: {
      flex: 1,
      backgroundColor: colors.surface,
      paddingVertical: 16,
      borderRadius: 12,
      alignItems: 'center',
      marginRight: 8,
    },
    clearButtonText: {
      fontSize: 16,
      fontFamily: 'Inter-SemiBold',
      color: colors.text,
    },
    applyButton: {
      flex: 1,
      backgroundColor: colors.primary,
      paddingVertical: 16,
      borderRadius: 12,
      alignItems: 'center',
      marginLeft: 8,
    },
    applyButtonText: {
      fontSize: 16,
      fontFamily: 'Inter-SemiBold',
      color: '#FFFFFF',
    },
  });

  return (
    <View style={styles.container}>
      <ScrollView 
        style={styles.container}
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View style={[styles.header, headerAnimatedStyle]}>
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
              />
            </View>
            <TouchableOpacity 
              style={styles.filterButton} 
              onPress={() => setShowFilterModal(true)}
            >
              <Filter size={20} color={colors.text} />
            </TouchableOpacity>
          </View>
        </Animated.View>

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

        <Animated.View style={[styles.projectsContainer, projectsAnimatedStyle]}>
          <View style={styles.resultsHeader}>
            <Text style={styles.resultsCount}>
              {filteredProjects.length} project{filteredProjects.length !== 1 ? 's' : ''} found
            </Text>
          </View>

          {loading ? (
            <Text style={styles.loadingText}>Loading projects...</Text>
          ) : filteredProjects.length === 0 ? (
            <Text style={styles.emptyText}>
              {projects.length === 0 
                ? 'No projects found. Be the first to create one!' 
                : 'No projects match your filters. Try adjusting your search criteria.'
              }
            </Text>
          ) : (
            filteredProjects.map((project) => {
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
                    <View style={styles.projectImage}>
                      <Image source={{ uri: project.image_url }} style={styles.projectImage} />
                      {(project.has_audio || project.has_video) && (
                        <View style={styles.mediaOverlay}>
                          {project.has_audio && (
                            <TouchableOpacity
                              style={styles.mediaBadge}
                              onPress={() => handlePlayAudio(project.id)}
                            >
                              <Volume2 size={12} color="#FFFFFF" />
                              <Text style={styles.mediaBadgeText}>AUDIO</Text>
                            </TouchableOpacity>
                          )}
                          {project.has_video && (
                            <TouchableOpacity
                              style={styles.mediaBadge}
                              onPress={() => handlePlayVideo(project.id)}
                            >
                              <Play size={12} color="#FFFFFF" />
                              <Text style={styles.mediaBadgeText}>VIDEO</Text>
                            </TouchableOpacity>
                          )}
                        </View>
                      )}
                    </View>
                  )}
                  
                  <View style={styles.projectContent}>
                    <View style={styles.projectHeader}>
                      <View style={styles.projectTitleContainer}>
                        <Text style={styles.projectTitle}>{project.title}</Text>
                        <Text style={styles.projectFounder}>by {project.profiles?.full_name || 'Unknown'}</Text>
                      </View>
                      <View style={styles.projectActions}>
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
                          onPress={() => handleShare(project)}
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
                      <TouchableOpacity 
                        style={styles.contactButton}
                        onPress={() => handleContactFounder(project)}
                      >
                        <MessageCircle size={16} color="#FFFFFF" />
                        <Text style={styles.contactButtonText}>Contact</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </TouchableOpacity>
              );
            })
          )}
        </Animated.View>
      </ScrollView>

      {renderFilterModal()}
    </View>
  );
}