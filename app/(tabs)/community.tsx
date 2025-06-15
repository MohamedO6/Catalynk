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
  RefreshControl,
  Share,
  Platform,
} from 'react-native';
import { router } from 'expo-router';
import { Search, TrendingUp, ArrowUp, ArrowDown, MessageCircle, Share2, Heart, MoveHorizontal as MoreHorizontal, Filter, Plus, Code, Lightbulb, HelpCircle } from 'lucide-react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import * as Clipboard from 'expo-clipboard';

interface CommunityPost {
  id: string;
  type: 'discussion' | 'question' | 'showcase' | 'help';
  title: string;
  content?: string;
  author: string;
  avatar: string;
  timestamp: string;
  upvotes: number;
  downvotes: number;
  comments: number;
  category: string;
  tags: string[];
  user_vote?: 'up' | 'down' | null;
  is_liked?: boolean;
}

const mockPosts: CommunityPost[] = [
  {
    id: '1',
    type: 'question',
    title: 'How to validate a startup idea before building?',
    content: 'I have an idea for a fintech app but I\'m not sure how to validate it properly. What are the best methods to test market demand before investing time and money?',
    author: 'Sarah Chen',
    avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=50&h=50&fit=crop',
    timestamp: '2 hours ago',
    upvotes: 47,
    downvotes: 3,
    comments: 23,
    category: 'Startup Advice',
    tags: ['validation', 'fintech', 'market-research'],
  },
  {
    id: '2',
    type: 'discussion',
    title: 'Best tech stack for MVP development in 2024?',
    content: 'Looking for recommendations on modern tech stacks that allow for rapid MVP development. Considering React Native + Supabase vs Next.js + Firebase. What are your experiences?',
    author: 'Marcus Johnson',
    avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=50&h=50&fit=crop',
    timestamp: '4 hours ago',
    upvotes: 29,
    downvotes: 1,
    comments: 18,
    category: 'Technical',
    tags: ['mvp', 'tech-stack', 'react-native'],
  },
  {
    id: '3',
    type: 'showcase',
    title: 'Built an AI-powered project management tool',
    content: 'After 6 months of development, I\'m excited to share my AI project management tool that helps teams prioritize tasks automatically. Would love feedback from the community!',
    author: 'Emily Rodriguez',
    avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=50&h=50&fit=crop',
    timestamp: '1 day ago',
    upvotes: 156,
    downvotes: 12,
    comments: 89,
    category: 'Project Showcase',
    tags: ['ai', 'project-management', 'saas'],
  },
  {
    id: '4',
    type: 'help',
    title: 'Need help with user authentication implementation',
    content: 'Struggling with implementing secure user authentication in my React app. Should I use Auth0, Firebase Auth, or build custom? Looking for pros/cons of each approach.',
    author: 'Alex Kim',
    avatar: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=50&h=50&fit=crop',
    timestamp: '2 days ago',
    upvotes: 34,
    downvotes: 2,
    comments: 27,
    category: 'Technical Help',
    tags: ['authentication', 'security', 'react'],
  },
];

const categories = ['All', 'Startup Advice', 'Technical', 'Project Showcase', 'Technical Help', 'Funding', 'Networking'];

export default function Community() {
  const { colors } = useTheme();
  const { profile } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [posts, setPosts] = useState(mockPosts);
  const [refreshing, setRefreshing] = useState(false);

  const handleVote = async (postId: string, voteType: 'up' | 'down') => {
    if (!profile?.id) {
      Alert.alert('Login Required', 'Please log in to vote on posts.');
      return;
    }

    setPosts(prev =>
      prev.map(post => {
        if (post.id === postId) {
          const currentVote = post.user_vote;
          let newUpvotes = post.upvotes;
          let newDownvotes = post.downvotes;
          let newUserVote: 'up' | 'down' | null = voteType;

          // Remove previous vote if exists
          if (currentVote === 'up') {
            newUpvotes -= 1;
          } else if (currentVote === 'down') {
            newDownvotes -= 1;
          }

          // Add new vote if different from current
          if (currentVote === voteType) {
            newUserVote = null; // Remove vote if clicking same button
          } else {
            if (voteType === 'up') {
              newUpvotes += 1;
            } else {
              newDownvotes += 1;
            }
          }

          return {
            ...post,
            upvotes: newUpvotes,
            downvotes: newDownvotes,
            user_vote: newUserVote,
          };
        }
        return post;
      })
    );

    // In production, save to database
    try {
      await supabase
        .from('community_votes')
        .upsert({
          user_id: profile.id,
          post_id: postId,
          vote_type: voteType,
        }, {
          onConflict: 'user_id,post_id'
        });
    } catch (error) {
      console.error('Error saving vote:', error);
    }
  };

  const handleLike = (postId: string) => {
    setPosts(prev =>
      prev.map(post => {
        if (post.id === postId) {
          return {
            ...post,
            is_liked: !post.is_liked,
          };
        }
        return post;
      })
    );
  };

  const handleShare = async (post: CommunityPost) => {
    try {
      const shareUrl = `https://catalynk.app/community/post/${post.id}`;
      const shareTitle = post.title;
      const shareMessage = `Check out "${post.title}" by ${post.author} on Catalynk Community!\n\n${post.content || 'Join the discussion!'}\n\n${shareUrl}`;

      if (Platform.OS === 'web') {
        await Clipboard.setStringAsync(shareUrl);
        Alert.alert('📋 Link Copied!', 'Post link has been copied to clipboard. You can now paste it anywhere to share!');
      } else {
        const result = await Share.share({
          message: shareMessage,
          url: shareUrl,
          title: shareTitle,
        });

        if (result.action === Share.sharedAction) {
          Alert.alert('✅ Shared Successfully!', 'Post has been shared.');
        }
      }
    } catch (error) {
      console.error('Share error:', error);
      Alert.alert('❌ Share Failed', 'Unable to share the post. Please try again.');
    }
  };

  const handleComment = (postId: string) => {
    router.push(`/community/post/${postId}`);
  };

  const handleCreatePost = () => {
    router.push('/community/create');
  };

  const onRefresh = () => {
    setRefreshing(true);
    // Simulate refresh
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  const getPostTypeIcon = (type: string) => {
    switch (type) {
      case 'question': return HelpCircle;
      case 'discussion': return MessageCircle;
      case 'showcase': return Lightbulb;
      case 'help': return Code;
      default: return MessageCircle;
    }
  };

  const getPostTypeColor = (type: string) => {
    switch (type) {
      case 'question': return colors.warning;
      case 'discussion': return colors.primary;
      case 'showcase': return colors.success;
      case 'help': return colors.error;
      default: return colors.textSecondary;
    }
  };

  const getPostTypeLabel = (type: string) => {
    switch (type) {
      case 'question': return 'Question';
      case 'discussion': return 'Discussion';
      case 'showcase': return 'Showcase';
      case 'help': return 'Help Needed';
      default: return 'Post';
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
    title: {
      fontSize: 28,
      fontFamily: 'Inter-Bold',
      color: colors.text,
    },
    headerActions: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    filterButton: {
      backgroundColor: colors.surface,
      padding: 12,
      borderRadius: 12,
      marginRight: 8,
    },
    createButton: {
      backgroundColor: colors.primary,
      padding: 12,
      borderRadius: 12,
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
    postsContainer: {
      flex: 1,
      paddingHorizontal: 20,
      paddingTop: 20,
    },
    postCard: {
      backgroundColor: colors.card,
      borderRadius: 12,
      padding: 16,
      marginBottom: 16,
      borderWidth: 1,
      borderColor: colors.border,
    },
    postHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 12,
    },
    avatar: {
      width: 40,
      height: 40,
      borderRadius: 20,
      marginRight: 12,
    },
    authorInfo: {
      flex: 1,
    },
    authorName: {
      fontSize: 16,
      fontFamily: 'Inter-SemiBold',
      color: colors.text,
    },
    timestamp: {
      fontSize: 12,
      fontFamily: 'Inter-Regular',
      color: colors.textTertiary,
    },
    postTypeBadge: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 8,
    },
    postTypeText: {
      fontSize: 10,
      fontFamily: 'Inter-Bold',
      color: '#FFFFFF',
      marginLeft: 4,
    },
    postTitle: {
      fontSize: 18,
      fontFamily: 'Inter-Bold',
      color: colors.text,
      marginBottom: 8,
      lineHeight: 24,
    },
    postContent: {
      fontSize: 15,
      fontFamily: 'Inter-Regular',
      color: colors.textSecondary,
      lineHeight: 22,
      marginBottom: 12,
    },
    tagsContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      marginBottom: 12,
    },
    tag: {
      backgroundColor: colors.surface,
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 12,
      marginRight: 8,
      marginBottom: 4,
    },
    tagText: {
      fontSize: 12,
      fontFamily: 'Inter-Medium',
      color: colors.textSecondary,
    },
    postActions: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingTop: 12,
      borderTopWidth: 1,
      borderTopColor: colors.border,
    },
    postActionsLeft: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    voteContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginRight: 20,
    },
    voteButton: {
      padding: 4,
    },
    voteCount: {
      fontSize: 14,
      fontFamily: 'Inter-SemiBold',
      color: colors.text,
      marginHorizontal: 8,
    },
    commentsButton: {
      flexDirection: 'row',
      alignItems: 'center',
      marginRight: 20,
    },
    commentsCount: {
      fontSize: 14,
      fontFamily: 'Inter-Medium',
      color: colors.textSecondary,
      marginLeft: 6,
    },
    postActionsRight: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    actionButton: {
      padding: 6,
      marginLeft: 8,
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <Text style={styles.title}>Community</Text>
          <View style={styles.headerActions}>
            <TouchableOpacity style={styles.filterButton}>
              <Filter size={20} color={colors.text} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.createButton} onPress={handleCreatePost}>
              <Plus size={20} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.searchContainer}>
          <Search size={20} color={colors.textSecondary} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search discussions..."
            placeholderTextColor={colors.textTertiary}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
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

      <ScrollView 
        style={styles.postsContainer} 
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {posts.map((post) => {
          const TypeIcon = getPostTypeIcon(post.type);
          const typeColor = getPostTypeColor(post.type);
          
          return (
            <TouchableOpacity 
              key={post.id} 
              style={styles.postCard}
              onPress={() => router.push(`/community/post/${post.id}`)}
            >
              <View style={styles.postHeader}>
                <Image source={{ uri: post.avatar }} style={styles.avatar} />
                <View style={styles.authorInfo}>
                  <Text style={styles.authorName}>{post.author}</Text>
                  <Text style={styles.timestamp}>{post.timestamp}</Text>
                </View>
                <View style={[
                  styles.postTypeBadge,
                  { backgroundColor: typeColor }
                ]}>
                  <TypeIcon size={12} color="#FFFFFF" />
                  <Text style={styles.postTypeText}>{getPostTypeLabel(post.type)}</Text>
                </View>
              </View>

              <Text style={styles.postTitle}>{post.title}</Text>
              
              {post.content && (
                <Text style={styles.postContent} numberOfLines={3}>{post.content}</Text>
              )}

              {post.tags && post.tags.length > 0 && (
                <View style={styles.tagsContainer}>
                  {post.tags.map((tag, index) => (
                    <View key={index} style={styles.tag}>
                      <Text style={styles.tagText}>#{tag}</Text>
                    </View>
                  ))}
                </View>
              )}

              <View style={styles.postActions}>
                <View style={styles.postActionsLeft}>
                  <View style={styles.voteContainer}>
                    <TouchableOpacity
                      style={styles.voteButton}
                      onPress={() => handleVote(post.id, 'up')}
                    >
                      <ArrowUp 
                        size={20} 
                        color={post.user_vote === 'up' ? colors.success : colors.textSecondary} 
                      />
                    </TouchableOpacity>
                    <Text style={styles.voteCount}>
                      {post.upvotes - post.downvotes}
                    </Text>
                    <TouchableOpacity
                      style={styles.voteButton}
                      onPress={() => handleVote(post.id, 'down')}
                    >
                      <ArrowDown 
                        size={20} 
                        color={post.user_vote === 'down' ? colors.error : colors.textSecondary} 
                      />
                    </TouchableOpacity>
                  </View>

                  <TouchableOpacity 
                    style={styles.commentsButton}
                    onPress={() => handleComment(post.id)}
                  >
                    <MessageCircle size={18} color={colors.textSecondary} />
                    <Text style={styles.commentsCount}>{post.comments}</Text>
                  </TouchableOpacity>
                </View>

                <View style={styles.postActionsRight}>
                  <TouchableOpacity 
                    style={styles.actionButton}
                    onPress={() => handleLike(post.id)}
                  >
                    <Heart 
                      size={18} 
                      color={post.is_liked ? colors.error : colors.textSecondary}
                      fill={post.is_liked ? colors.error : 'none'}
                    />
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={styles.actionButton}
                    onPress={() => handleShare(post)}
                  >
                    <Share2 size={18} color={colors.textSecondary} />
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.actionButton}>
                    <MoreHorizontal size={18} color={colors.textSecondary} />
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}