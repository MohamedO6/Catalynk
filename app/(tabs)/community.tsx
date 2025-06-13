import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Dimensions,
  Alert,
} from 'react-native';
import { router } from 'expo-router';
import {
  Search,
  Plus,
  MessageCircle,
  ArrowUp,
  ArrowDown,
  Share2,
  Bookmark,
  Clock,
  User,
  Flame,
  TrendingUp,
} from 'lucide-react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';

const { width } = Dimensions.get('window');

interface CommunityPost {
  id: string;
  title: string;
  content: string;
  author_id: string;
  category: string;
  tags: string[];
  upvotes: number;
  downvotes: number;
  comment_count: number;
  is_pinned: boolean;
  created_at: string;
  profiles: {
    full_name: string;
    role: string;
  };
}

const categories = ['All', 'Startup Advice', 'Job Postings', 'Lessons Learned', 'Tools & Resources', 'Funding', 'Technical'];
const sortOptions = ['Hot', 'New', 'Top', 'Rising'];

export default function Community() {
  const { colors } = useTheme();
  const { profile } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('Hot');
  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [likedPosts, setLikedPosts] = useState<string[]>([]);

  useEffect(() => {
    fetchPosts();
  }, [selectedCategory, sortBy]);

  const fetchPosts = async () => {
    try {
      let query = supabase
        .from('community_posts')
        .select(`
          *,
          profiles:author_id (
            full_name,
            role
          )
        `);

      if (selectedCategory !== 'All') {
        query = query.eq('category', selectedCategory);
      }

      // Apply sorting
      switch (sortBy) {
        case 'New':
          query = query.order('created_at', { ascending: false });
          break;
        case 'Top':
          query = query.order('upvotes', { ascending: false });
          break;
        case 'Hot':
        default:
          // Simple hot algorithm: upvotes - downvotes, with recent posts getting boost
          query = query.order('upvotes', { ascending: false });
          break;
      }

      const { data, error } = await query.limit(20);

      if (error) {
        console.error('Error fetching posts:', error);
        return;
      }

      setPosts(data || []);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleVote = async (postId: string, voteType: 'up' | 'down') => {
    if (!profile?.id) {
      Alert.alert('Login Required', 'Please log in to vote on posts.');
      return;
    }

    try {
      // Check if user already voted
      const { data: existingVote } = await supabase
        .from('community_votes')
        .select('*')
        .eq('user_id', profile.id)
        .eq('post_id', postId)
        .single();

      if (existingVote) {
        if (existingVote.vote_type === voteType) {
          // Remove vote
          await supabase
            .from('community_votes')
            .delete()
            .eq('id', existingVote.id);
        } else {
          // Update vote
          await supabase
            .from('community_votes')
            .update({ vote_type: voteType })
            .eq('id', existingVote.id);
        }
      } else {
        // Create new vote
        await supabase
          .from('community_votes')
          .insert({
            user_id: profile.id,
            post_id: postId,
            vote_type: voteType,
          });
      }

      // Refresh posts to get updated vote counts
      fetchPosts();
    } catch (error) {
      console.error('Error voting:', error);
      Alert.alert('Error', 'Failed to vote. Please try again.');
    }
  };

  const toggleBookmark = (postId: string) => {
    setLikedPosts(prev =>
      prev.includes(postId)
        ? prev.filter(id => id !== postId)
        : [...prev, postId]
    );
    Alert.alert('Bookmarked', 'Post saved to your bookmarks.');
  };

  const handleCreatePost = () => {
    if (!profile?.id) {
      Alert.alert('Login Required', 'Please log in to create posts.');
      return;
    }
    router.push('/community/create');
  };

  const handlePostPress = (postId: string) => {
    router.push(`/community/post/${postId}`);
  };

  const handleSearch = () => {
    if (searchQuery.trim()) {
      // In a real app, this would filter posts by search query
      Alert.alert('Search', `Searching for: ${searchQuery}`);
    }
  };

  const getSortIcon = (sort: string) => {
    switch (sort) {
      case 'Hot':
        return <Flame size={16} color={colors.text} />;
      case 'New':
        return <Clock size={16} color={colors.text} />;
      case 'Top':
        return <TrendingUp size={16} color={colors.text} />;
      case 'Rising':
        return <ArrowUp size={16} color={colors.text} />;
      default:
        return null;
    }
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d ago`;
    return date.toLocaleDateString();
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
    filtersContainer: {
      paddingVertical: 10,
    },
    categoriesScrollView: {
      paddingHorizontal: 20,
      marginBottom: 10,
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
    sortContainer: {
      flexDirection: 'row',
      paddingHorizontal: 20,
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    sortButton: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.surface,
      paddingHorizontal: 12,
      paddingVertical: 8,
      borderRadius: 8,
      marginRight: 8,
    },
    sortButtonActive: {
      backgroundColor: colors.primary + '20',
    },
    sortText: {
      fontSize: 14,
      fontFamily: 'Inter-Medium',
      color: colors.text,
      marginLeft: 4,
    },
    sortTextActive: {
      color: colors.primary,
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
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: 12,
    },
    postAuthorInfo: {
      flex: 1,
    },
    postAuthor: {
      fontSize: 16,
      fontFamily: 'Inter-SemiBold',
      color: colors.text,
    },
    postAuthorRole: {
      fontSize: 14,
      fontFamily: 'Inter-Medium',
      color: colors.textSecondary,
    },
    postTimestamp: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    postTimestampText: {
      fontSize: 12,
      fontFamily: 'Inter-Regular',
      color: colors.textTertiary,
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
      marginBottom: 16,
    },
    tag: {
      backgroundColor: colors.surface,
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 8,
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
    categoryBadge: {
      backgroundColor: colors.primary + '20',
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 6,
      alignSelf: 'flex-start',
      marginBottom: 8,
    },
    categoryBadgeText: {
      fontSize: 12,
      fontFamily: 'Inter-Medium',
      color: colors.primary,
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
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <Text style={styles.title}>Community</Text>
          <TouchableOpacity style={styles.createButton} onPress={handleCreatePost}>
            <Plus size={24} color="#FFFFFF" />
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
            onSubmitEditing={handleSearch}
          />
          <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
            <Search size={16} color={colors.primary} />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.filtersContainer}>
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

        <View style={styles.sortContainer}>
          {sortOptions.map((sort) => (
            <TouchableOpacity
              key={sort}
              style={[
                styles.sortButton,
                sortBy === sort && styles.sortButtonActive,
              ]}
              onPress={() => setSortBy(sort)}
            >
              {getSortIcon(sort)}
              <Text
                style={[
                  styles.sortText,
                  sortBy === sort && styles.sortTextActive,
                ]}
              >
                {sort}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <ScrollView style={styles.postsContainer} showsVerticalScrollIndicator={false}>
        {loading ? (
          <Text style={styles.loadingText}>Loading discussions...</Text>
        ) : posts.length === 0 ? (
          <Text style={styles.emptyText}>No posts found. Be the first to start a discussion!</Text>
        ) : (
          posts.map((post) => (
            <TouchableOpacity 
              key={post.id} 
              style={styles.postCard}
              onPress={() => handlePostPress(post.id)}
            >
              <View style={styles.postHeader}>
                <View style={styles.postAuthorInfo}>
                  <Text style={styles.postAuthor}>{post.profiles?.full_name || 'Anonymous'}</Text>
                  <Text style={styles.postAuthorRole}>{post.profiles?.role || 'Member'}</Text>
                </View>
                <View style={styles.postTimestamp}>
                  <Clock size={12} color={colors.textTertiary} />
                  <Text style={styles.postTimestampText}>{formatTimeAgo(post.created_at)}</Text>
                </View>
              </View>

              <View style={styles.categoryBadge}>
                <Text style={styles.categoryBadgeText}>{post.category}</Text>
              </View>

              <Text style={styles.postTitle}>{post.title}</Text>
              <Text style={styles.postContent} numberOfLines={3}>{post.content}</Text>

              {post.tags && post.tags.length > 0 && (
                <View style={styles.tagsContainer}>
                  {post.tags.slice(0, 3).map((tag, index) => (
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
                        color={colors.textSecondary}
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
                        color={colors.textSecondary}
                      />
                    </TouchableOpacity>
                  </View>

                  <TouchableOpacity 
                    style={styles.commentsButton}
                    onPress={() => handlePostPress(post.id)}
                  >
                    <MessageCircle size={18} color={colors.textSecondary} />
                    <Text style={styles.commentsCount}>{post.comment_count}</Text>
                  </TouchableOpacity>
                </View>

                <View style={styles.postActionsRight}>
                  <TouchableOpacity style={styles.actionButton}>
                    <Share2 size={18} color={colors.textSecondary} />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => toggleBookmark(post.id)}
                  >
                    <Bookmark
                      size={18}
                      color={likedPosts.includes(post.id) ? colors.primary : colors.textSecondary}
                      fill={likedPosts.includes(post.id) ? colors.primary : 'none'}
                    />
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>
    </View>
  );
}