import React, { useState } from 'react';
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
import {
  Search,
  TrendingUp,
  ArrowUp,
  ArrowDown,
  MessageCircle,
  Share2,
  Play,
  Heart,
  MoreHorizontal,
  Filter,
} from 'lucide-react-native';
import { useTheme } from '@/contexts/ThemeContext';

interface CommunityPost {
  id: string;
  type: 'episode' | 'discussion' | 'roast';
  title: string;
  content?: string;
  author: string;
  avatar: string;
  timestamp: string;
  upvotes: number;
  downvotes: number;
  comments: number;
  episode?: {
    duration: string;
    plays: number;
    image_url: string;
  };
}

const mockPosts: CommunityPost[] = [
  {
    id: '1',
    type: 'episode',
    title: 'The Future of Remote Work',
    author: 'Sarah Chen',
    avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=50&h=50&fit=crop',
    timestamp: '2 hours ago',
    upvotes: 47,
    downvotes: 3,
    comments: 23,
    episode: {
      duration: '15:32',
      plays: 1247,
      image_url: 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=400&h=200&fit=crop',
    },
  },
  {
    id: '2',
    type: 'discussion',
    title: 'Best practices for podcast intros?',
    content: 'I\'m struggling with creating engaging podcast intros. What are your favorite techniques for hooking listeners in the first 30 seconds?',
    author: 'Marcus Johnson',
    avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=50&h=50&fit=crop',
    timestamp: '4 hours ago',
    upvotes: 29,
    downvotes: 1,
    comments: 18,
  },
  {
    id: '3',
    type: 'roast',
    title: 'Roast My Podcast: "Crypto for Cats"',
    content: 'I created a podcast explaining cryptocurrency using cat analogies. Please roast it mercilessly so I can improve! 🐱',
    author: 'Emily Rodriguez',
    avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=50&h=50&fit=crop',
    timestamp: '1 day ago',
    upvotes: 156,
    downvotes: 12,
    comments: 89,
  },
];

const categories = ['All', 'Episodes', 'Discussions', 'Roast My Podcast', 'Tips & Tricks'];

export default function Community() {
  const { colors } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [posts, setPosts] = useState(mockPosts);

  const handleVote = (postId: string, voteType: 'up' | 'down') => {
    setPosts(prev =>
      prev.map(post => {
        if (post.id === postId) {
          if (voteType === 'up') {
            return { ...post, upvotes: post.upvotes + 1 };
          } else {
            return { ...post, downvotes: post.downvotes + 1 };
          }
        }
        return post;
      })
    );
  };

  const handlePlayEpisode = (postId: string) => {
    Alert.alert('Playing Episode', 'Episode player would open here.');
  };

  const handleShare = (postId: string) => {
    Alert.alert('Share', 'Post shared successfully!');
  };

  const getPostTypeColor = (type: string) => {
    switch (type) {
      case 'episode': return colors.primary;
      case 'discussion': return colors.success;
      case 'roast': return colors.warning;
      default: return colors.textSecondary;
    }
  };

  const getPostTypeLabel = (type: string) => {
    switch (type) {
      case 'episode': return 'Episode';
      case 'discussion': return 'Discussion';
      case 'roast': return 'Roast';
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
    filterButton: {
      backgroundColor: colors.surface,
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
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 8,
    },
    postTypeText: {
      fontSize: 10,
      fontFamily: 'Inter-Bold',
      color: '#FFFFFF',
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
    episodeCard: {
      backgroundColor: colors.surface,
      borderRadius: 12,
      padding: 12,
      marginBottom: 12,
      flexDirection: 'row',
      alignItems: 'center',
    },
    episodeImage: {
      width: 60,
      height: 60,
      borderRadius: 8,
      marginRight: 12,
    },
    episodeInfo: {
      flex: 1,
    },
    episodeDuration: {
      fontSize: 14,
      fontFamily: 'Inter-SemiBold',
      color: colors.primary,
    },
    episodePlays: {
      fontSize: 12,
      fontFamily: 'Inter-Regular',
      color: colors.textSecondary,
    },
    playButton: {
      backgroundColor: colors.primary,
      width: 40,
      height: 40,
      borderRadius: 20,
      justifyContent: 'center',
      alignItems: 'center',
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
          <TouchableOpacity style={styles.filterButton}>
            <Filter size={20} color={colors.text} />
          </TouchableOpacity>
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

      <ScrollView style={styles.postsContainer} showsVerticalScrollIndicator={false}>
        {posts.map((post) => (
          <View key={post.id} style={styles.postCard}>
            <View style={styles.postHeader}>
              <Image source={{ uri: post.avatar }} style={styles.avatar} />
              <View style={styles.authorInfo}>
                <Text style={styles.authorName}>{post.author}</Text>
                <Text style={styles.timestamp}>{post.timestamp}</Text>
              </View>
              <View style={[
                styles.postTypeBadge,
                { backgroundColor: getPostTypeColor(post.type) }
              ]}>
                <Text style={styles.postTypeText}>{getPostTypeLabel(post.type)}</Text>
              </View>
            </View>

            <Text style={styles.postTitle}>{post.title}</Text>
            
            {post.content && (
              <Text style={styles.postContent}>{post.content}</Text>
            )}

            {post.episode && (
              <View style={styles.episodeCard}>
                <Image source={{ uri: post.episode.image_url }} style={styles.episodeImage} />
                <View style={styles.episodeInfo}>
                  <Text style={styles.episodeDuration}>{post.episode.duration}</Text>
                  <Text style={styles.episodePlays}>{post.episode.plays.toLocaleString()} plays</Text>
                </View>
                <TouchableOpacity 
                  style={styles.playButton}
                  onPress={() => handlePlayEpisode(post.id)}
                >
                  <Play size={20} color="#FFFFFF" />
                </TouchableOpacity>
              </View>
            )}

            <View style={styles.postActions}>
              <View style={styles.postActionsLeft}>
                <View style={styles.voteContainer}>
                  <TouchableOpacity
                    style={styles.voteButton}
                    onPress={() => handleVote(post.id, 'up')}
                  >
                    <ArrowUp size={20} color={colors.textSecondary} />
                  </TouchableOpacity>
                  <Text style={styles.voteCount}>
                    {post.upvotes - post.downvotes}
                  </Text>
                  <TouchableOpacity
                    style={styles.voteButton}
                    onPress={() => handleVote(post.id, 'down')}
                  >
                    <ArrowDown size={20} color={colors.textSecondary} />
                  </TouchableOpacity>
                </View>

                <TouchableOpacity style={styles.commentsButton}>
                  <MessageCircle size={18} color={colors.textSecondary} />
                  <Text style={styles.commentsCount}>{post.comments}</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.postActionsRight}>
                <TouchableOpacity 
                  style={styles.actionButton}
                  onPress={() => handleShare(post.id)}
                >
                  <Share2 size={18} color={colors.textSecondary} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionButton}>
                  <MoreHorizontal size={18} color={colors.textSecondary} />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}