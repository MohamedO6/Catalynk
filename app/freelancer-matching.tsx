import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
  Alert,
} from 'react-native';
import { router } from 'expo-router';
import { ArrowLeft, Search, Filter, Star, MapPin, MessageCircle, Heart } from 'lucide-react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';

interface Freelancer {
  id: string;
  full_name: string;
  role: string;
  bio?: string;
  skills?: string[];
  location?: string;
  avatar_url?: string;
  rating: number;
  projects_completed: number;
  hourly_rate: number;
  availability: 'available' | 'busy' | 'unavailable';
  match_score: number;
}

const skillCategories = ['All', 'Development', 'Design', 'Marketing', 'Business', 'Data Science'];

export default function FreelancerMatching() {
  const { colors } = useTheme();
  const { profile } = useAuth();
  const [freelancers, setFreelancers] = useState<Freelancer[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [likedFreelancers, setLikedFreelancers] = useState<string[]>([]);

  useEffect(() => {
    fetchFreelancers();
  }, []);

  const fetchFreelancers = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('role', 'freelancer')
        .limit(20);

      if (error) {
        console.error('Error fetching freelancers:', error);
        return;
      }

      // Simulate AI matching scores and additional data
      const freelancersWithScores = (data || []).map(freelancer => ({
        ...freelancer,
        rating: 4.2 + Math.random() * 0.8,
        projects_completed: Math.floor(Math.random() * 50) + 5,
        hourly_rate: Math.floor(Math.random() * 100) + 25,
        availability: ['available', 'busy', 'unavailable'][Math.floor(Math.random() * 3)] as 'available' | 'busy' | 'unavailable',
        match_score: Math.floor(Math.random() * 30) + 70,
      }));

      // Sort by match score
      freelancersWithScores.sort((a, b) => b.match_score - a.match_score);
      
      setFreelancers(freelancersWithScores);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLike = (freelancerId: string) => {
    setLikedFreelancers(prev =>
      prev.includes(freelancerId)
        ? prev.filter(id => id !== freelancerId)
        : [...prev, freelancerId]
    );
    Alert.alert('Liked', 'Freelancer added to your favorites!');
  };

  const handleMessage = (freelancerId: string) => {
    router.push(`/messaging/${freelancerId}`);
  };

  const handleViewProfile = (freelancerId: string) => {
    router.push(`/profile/${freelancerId}`);
  };

  const getAvailabilityColor = (availability: string) => {
    switch (availability) {
      case 'available': return colors.success;
      case 'busy': return colors.warning;
      case 'unavailable': return colors.error;
      default: return colors.textSecondary;
    }
  };

  const getAvailabilityText = (availability: string) => {
    switch (availability) {
      case 'available': return 'Available';
      case 'busy': return 'Busy';
      case 'unavailable': return 'Unavailable';
      default: return 'Unknown';
    }
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
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    backButton: {
      marginRight: 20,
    },
    headerTitle: {
      fontSize: 24,
      fontFamily: 'Inter-Bold',
      color: colors.text,
    },
    searchContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 20,
      paddingVertical: 16,
    },
    searchInput: {
      flex: 1,
      backgroundColor: colors.surface,
      borderRadius: 12,
      paddingHorizontal: 16,
      paddingVertical: 12,
      fontSize: 16,
      fontFamily: 'Inter-Regular',
      color: colors.text,
      marginRight: 12,
    },
    filterButton: {
      backgroundColor: colors.surface,
      padding: 12,
      borderRadius: 12,
    },
    categoriesContainer: {
      paddingVertical: 10,
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
    freelancersContainer: {
      flex: 1,
      paddingHorizontal: 20,
    },
    freelancerCard: {
      backgroundColor: colors.card,
      borderRadius: 16,
      padding: 20,
      marginBottom: 16,
      borderWidth: 1,
      borderColor: colors.border,
    },
    freelancerHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 12,
    },
    avatar: {
      width: 60,
      height: 60,
      borderRadius: 30,
      backgroundColor: colors.primary,
      marginRight: 16,
      justifyContent: 'center',
      alignItems: 'center',
    },
    avatarText: {
      fontSize: 24,
      fontFamily: 'Inter-Bold',
      color: '#FFFFFF',
    },
    freelancerInfo: {
      flex: 1,
    },
    freelancerName: {
      fontSize: 18,
      fontFamily: 'Inter-Bold',
      color: colors.text,
      marginBottom: 4,
    },
    freelancerRole: {
      fontSize: 14,
      fontFamily: 'Inter-Medium',
      color: colors.textSecondary,
      marginBottom: 4,
    },
    ratingContainer: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    rating: {
      fontSize: 14,
      fontFamily: 'Inter-SemiBold',
      color: colors.text,
      marginLeft: 4,
      marginRight: 8,
    },
    projectsCompleted: {
      fontSize: 12,
      fontFamily: 'Inter-Regular',
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
    freelancerBio: {
      fontSize: 15,
      fontFamily: 'Inter-Regular',
      color: colors.textSecondary,
      lineHeight: 22,
      marginBottom: 12,
    },
    skillsContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      marginBottom: 16,
    },
    skill: {
      backgroundColor: colors.surface,
      paddingHorizontal: 10,
      paddingVertical: 4,
      borderRadius: 12,
      marginRight: 8,
      marginBottom: 8,
    },
    skillText: {
      fontSize: 12,
      fontFamily: 'Inter-Medium',
      color: colors.textSecondary,
    },
    freelancerMeta: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 16,
    },
    metaItem: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    metaText: {
      fontSize: 14,
      fontFamily: 'Inter-Medium',
      color: colors.textSecondary,
      marginLeft: 6,
    },
    hourlyRate: {
      fontSize: 16,
      fontFamily: 'Inter-Bold',
      color: colors.success,
    },
    availability: {
      fontSize: 12,
      fontFamily: 'Inter-SemiBold',
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 8,
    },
    freelancerActions: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    actionButton: {
      flex: 1,
      paddingVertical: 12,
      borderRadius: 12,
      alignItems: 'center',
      marginHorizontal: 4,
      flexDirection: 'row',
      justifyContent: 'center',
    },
    primaryButton: {
      backgroundColor: colors.primary,
    },
    secondaryButton: {
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.border,
    },
    likeButton: {
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.border,
      width: 44,
      height: 44,
      borderRadius: 22,
      justifyContent: 'center',
      alignItems: 'center',
      marginLeft: 8,
    },
    buttonText: {
      fontSize: 14,
      fontFamily: 'Inter-SemiBold',
      color: '#FFFFFF',
      marginLeft: 6,
    },
    secondaryButtonText: {
      fontSize: 14,
      fontFamily: 'Inter-SemiBold',
      color: colors.text,
      marginLeft: 6,
    },
    loadingText: {
      fontSize: 16,
      fontFamily: 'Inter-Medium',
      color: colors.textSecondary,
      textAlign: 'center',
      marginTop: 100,
    },
  });

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <ArrowLeft size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Find Freelancers</Text>
      </View>

      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search freelancers..."
          placeholderTextColor={colors.textTertiary}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        <TouchableOpacity style={styles.filterButton}>
          <Filter size={20} color={colors.text} />
        </TouchableOpacity>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.categoriesContainer}
      >
        {skillCategories.map((category) => (
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

      <ScrollView style={styles.freelancersContainer} showsVerticalScrollIndicator={false}>
        {loading ? (
          <Text style={styles.loadingText}>Loading freelancers...</Text>
        ) : (
          freelancers.map((freelancer) => {
            const isLiked = likedFreelancers.includes(freelancer.id);
            
            return (
              <TouchableOpacity 
                key={freelancer.id} 
                style={styles.freelancerCard}
                onPress={() => handleViewProfile(freelancer.id)}
              >
                <View style={styles.freelancerHeader}>
                  <View style={styles.avatar}>
                    {freelancer.avatar_url ? (
                      <Image source={{ uri: freelancer.avatar_url }} style={styles.avatar} />
                    ) : (
                      <Text style={styles.avatarText}>
                        {getInitials(freelancer.full_name)}
                      </Text>
                    )}
                  </View>
                  <View style={styles.freelancerInfo}>
                    <Text style={styles.freelancerName}>{freelancer.full_name}</Text>
                    <Text style={styles.freelancerRole}>{freelancer.role}</Text>
                    <View style={styles.ratingContainer}>
                      <Star size={14} color={colors.warning} fill={colors.warning} />
                      <Text style={styles.rating}>{freelancer.rating.toFixed(1)}</Text>
                      <Text style={styles.projectsCompleted}>
                        {freelancer.projects_completed} projects
                      </Text>
                    </View>
                  </View>
                  <View style={styles.matchScore}>
                    <Text style={styles.matchScoreText}>{freelancer.match_score}% match</Text>
                  </View>
                </View>

                {freelancer.bio && (
                  <Text style={styles.freelancerBio} numberOfLines={2}>
                    {freelancer.bio}
                  </Text>
                )}

                {freelancer.skills && freelancer.skills.length > 0 && (
                  <View style={styles.skillsContainer}>
                    {freelancer.skills.slice(0, 4).map((skill, index) => (
                      <View key={index} style={styles.skill}>
                        <Text style={styles.skillText}>{skill}</Text>
                      </View>
                    ))}
                  </View>
                )}

                <View style={styles.freelancerMeta}>
                  {freelancer.location && (
                    <View style={styles.metaItem}>
                      <MapPin size={14} color={colors.textSecondary} />
                      <Text style={styles.metaText}>{freelancer.location}</Text>
                    </View>
                  )}
                  <Text style={styles.hourlyRate}>${freelancer.hourly_rate}/hr</Text>
                  <Text
                    style={[
                      styles.availability,
                      { 
                        backgroundColor: getAvailabilityColor(freelancer.availability) + '20',
                        color: getAvailabilityColor(freelancer.availability)
                      }
                    ]}
                  >
                    {getAvailabilityText(freelancer.availability)}
                  </Text>
                </View>

                <View style={styles.freelancerActions}>
                  <TouchableOpacity
                    style={[styles.actionButton, styles.primaryButton]}
                    onPress={() => handleMessage(freelancer.id)}
                  >
                    <MessageCircle size={16} color="#FFFFFF" />
                    <Text style={styles.buttonText}>Message</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.actionButton, styles.secondaryButton]}
                    onPress={() => handleViewProfile(freelancer.id)}
                  >
                    <Text style={styles.secondaryButtonText}>View Profile</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.likeButton}
                    onPress={() => handleLike(freelancer.id)}
                  >
                    <Heart
                      size={20}
                      color={isLiked ? colors.error : colors.textSecondary}
                      fill={isLiked ? colors.error : 'none'}
                    />
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            );
          })
        )}
      </ScrollView>
    </View>
  );
}