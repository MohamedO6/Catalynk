import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Dimensions,
} from 'react-native';
import {
  Search,
  Filter,
  Plus,
  Heart,
  Share2,
  Clock,
  MapPin,
  Star,
} from 'lucide-react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { useAuth } from '@/contexts/AuthContext';

const { width } = Dimensions.get('window');

const mockProjects = [
  {
    id: '1',
    title: 'AI-Powered Personal Finance Manager',
    description: 'Revolutionary fintech app that uses machine learning to provide personalized financial advice and automated savings strategies.',
    category: 'Fintech',
    founder: 'Sarah Chen',
    location: 'San Francisco, CA',
    funding: 75000,
    target: 150000,
    progress: 50,
    timeLeft: '23 days',
    tags: ['AI', 'Machine Learning', 'Finance', 'Mobile App'],
    teamSize: 5,
    rating: 4.8,
    liked: false,
  },
  {
    id: '2',
    title: 'Sustainable Urban Farming Platform',
    description: 'IoT-enabled vertical farming solution for urban environments, making fresh produce accessible in city centers.',
    category: 'AgTech',
    founder: 'Marcus Johnson',
    location: 'Austin, TX',
    funding: 125000,
    target: 200000,
    progress: 62,
    timeLeft: '18 days',
    tags: ['IoT', 'Sustainability', 'Agriculture', 'Hardware'],
    teamSize: 8,
    rating: 4.6,
    liked: true,
  },
  {
    id: '3',
    title: 'Virtual Reality Therapy Platform',
    description: 'Immersive VR experiences designed to help patients overcome phobias and anxiety disorders through controlled exposure therapy.',
    category: 'HealthTech',
    founder: 'Dr. Emily Rodriguez',
    location: 'Boston, MA',
    funding: 90000,
    target: 250000,
    progress: 36,
    timeLeft: '31 days',
    tags: ['VR', 'Healthcare', 'Mental Health', 'Therapy'],
    teamSize: 6,
    rating: 4.9,
    liked: false,
  },
];

const categories = ['All', 'Fintech', 'HealthTech', 'AgTech', 'EdTech', 'CleanTech', 'AI/ML'];

export default function Projects() {
  const { colors } = useTheme();
  const { profile } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [likedProjects, setLikedProjects] = useState<string[]>([]);

  const toggleLike = (projectId: string) => {
    setLikedProjects(prev =>
      prev.includes(projectId)
        ? prev.filter(id => id !== projectId)
        : [...prev, projectId]
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

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
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
      padding: 20,
      marginBottom: 16,
      borderWidth: 1,
      borderColor: colors.border,
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
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <Text style={styles.title}>{getScreenTitle()}</Text>
          {profile?.role === 'founder' && (
            <TouchableOpacity style={styles.createButton}>
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

      <ScrollView style={styles.projectsContainer} showsVerticalScrollIndicator={false}>
        {mockProjects.map((project) => {
          const isLiked = likedProjects.includes(project.id);
          
          return (
            <TouchableOpacity key={project.id} style={styles.projectCard}>
              <View style={styles.projectHeader}>
                <View style={styles.projectTitleContainer}>
                  <Text style={styles.projectTitle}>{project.title}</Text>
                  <Text style={styles.projectFounder}>by {project.founder}</Text>
                </View>
                <View style={styles.projectActions}>
                  <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => toggleLike(project.id)}
                  >
                    <Heart
                      size={20}
                      color={isLiked ? colors.error : colors.textSecondary}
                      fill={isLiked ? colors.error : 'none'}
                    />
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.actionButton}>
                    <Share2 size={20} color={colors.textSecondary} />
                  </TouchableOpacity>
                </View>
              </View>

              <Text style={styles.projectDescription}>{project.description}</Text>

              <View style={styles.projectMeta}>
                <View style={styles.metaItem}>
                  <MapPin size={16} color={colors.textSecondary} />
                  <Text style={styles.metaText}>{project.location}</Text>
                </View>
                <View style={styles.metaItem}>
                  <Clock size={16} color={colors.textSecondary} />
                  <Text style={styles.metaText}>{project.timeLeft} left</Text>
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

              <View style={styles.tagsContainer}>
                {project.tags.map((tag, index) => (
                  <View key={index} style={styles.tag}>
                    <Text style={styles.tagText}>{tag}</Text>
                  </View>
                ))}
              </View>

              <View style={styles.projectFooter}>
                <View style={styles.teamInfo}>
                  <Text style={styles.teamText}>{project.teamSize} team members</Text>
                </View>
                <View style={styles.rating}>
                  <Star size={16} color={colors.warning} fill={colors.warning} />
                  <Text style={styles.ratingText}>{project.rating}</Text>
                </View>
              </View>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}