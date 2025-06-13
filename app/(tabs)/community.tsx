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

const { width } = Dimensions.get('window');

const mockPosts = [
  {
    id: '1',
    title: 'How to validate your startup idea before building anything?',
    content: 'I have an idea for a productivity app but I\'m not sure if there\'s actual demand. What are some effective ways to validate an idea without spending months building an MVP?',
    author: 'Alex Chen',
    authorRole: 'Founder',
    timestamp: '2 hours ago',
    upvotes: 47,
    downvotes: 3,
    comments: 23,
    category: 'Startup Advice',
    isUpvoted: false,
    isDownvoted: false,
    isBookmarked: false,
    tags: ['validation', 'mvp', 'startup-advice'],
  },
  {
    id: '2',
    title: 'Looking for a React Native developer for a FinTech startup',
    content: 'We\'re building a personal finance app and need an experienced React Native developer. Remote work, equity + competitive salary. DM if interested!',
    author: 'Sarah Martinez',
    authorRole: 'Founder',
    timestamp: '4 hours ago',
    upvotes: 29,
    downvotes: 1,
    comments: 18,
    category: 'Job Postings',
    isUpvoted: true,
    isDownvoted: false,
    isBookmarked: true,
    tags: ['react-native', 'fintech', 'remote', 'hiring'],
  },
  {
    id: '3',
    title: 'The biggest mistakes I made in my first year as a startup founder',
    content: 'After building and selling two startups, here are the top 5 mistakes I see new founders making (including myself). Thread 🧵',
    author: 'Michael Roberts',
    authorRole: 'Serial Entrepreneur',
    timestamp: '1 day ago',
    upvotes: 312,
    downvotes: 8,
    comments: 89,
    category: 'Lessons Learned',
    isUpvoted: false,
    isDownvoted: false,
    isBookmarked: false,
    tags: ['founder-stories', 'lessons', 'mistakes'],
  },
  {
    id: '4',
    title: 'AI tools that every startup should be using in 2024',
    content: 'Compiled a list of 15 AI tools that can help startups automate tasks, improve productivity, and reduce costs. What would you add to this list?',
    author: 'Emma Thompson',
    authorRole: 'Growth Hacker',
    timestamp: '2 days ago',
    upvotes: 156,
    downvotes: 12,
    comments: 45,
    category: 'Tools & Resources',
    isUpvoted: true,
    isDownvoted: false,
    isBookmarked: true,
    tags: ['ai-tools', 'productivity', 'automation'],
  },
];

const categories = ['All', 'Startup Advice', 'Job Postings', 'Lessons Learned', 'Tools & Resources', 'Funding', 'Technical'];
const sortOptions = ['Hot', 'New', 'Top', 'Rising'];

export default function Community() {
  const { colors } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('Hot');
  const [posts, setPosts] = useState(mockPosts);

  const handleVote = (postId: string, voteType: 'up' | 'down') => {
    setPosts(prev =>
      prev.map(post => {
        if (post.id === postId) {
          let newUpvotes = post.upvotes;
          let newDownvotes = post.downvotes;
          let isUpvoted = post.isUpvoted;
          let isDownvoted = post.isDownvoted;

          if (voteType === 'up') {
            if (post.isUpvoted) {
              newUpvotes -= 1;
              isUpvoted = false;
            } else {
              newUpvotes += 1;
              isUpvoted = true;
              if (post.isDownvoted) {
                newDownvotes -= 1;
                isDownvoted = false;
              }
            }
          } else {
            if (post.isDownvoted) {
              newDownvotes -= 1;
              isDownvoted = false;
            } else {
              newDownvotes += 1;
              isDownvoted = true;
              if (post.isUpvoted) {
                newUpvotes -= 1;
                isUpvoted = false;
              }
            }
          }

          return {
            ...post,
            upvotes: newUpvotes,
            downvotes: newDownvotes,
            isUpvoted,
            isDownvoted,
          };
        }
        return post;
      })
    );
  };

  const toggleBookmark = (postId: string) => {
    setPosts(prev =>
      prev.map(post =>
        post.id === postId
          ? { ...post, isBookmarked: !post.isBookmarked }
          : post
      )
    );
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
  });

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

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <Text style={styles.title}>Community</Text>
          <TouchableOpacity style={styles.createButton}>
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
          />
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
        {posts.map((post) => (
          <TouchableOpacity key={post.id} style={styles.postCard}>
            <View style={styles.postHeader}>
              <View style={styles.postAuthorInfo}>
                <Text style={styles.postAuthor}>{post.author}</Text>
                <Text style={styles.postAuthorRole}>{post.authorRole}</Text>
              </View>
              <View style={styles.postTimestamp}>
                <Clock size={12} color={colors.textTertiary} />
                <Text style={styles.postTimestampText}>{post.timestamp}</Text>
              </View>
            </View>

            <View style={styles.categoryBadge}>
              <Text style={styles.categoryBadgeText}>{post.category}</Text>
            </View>

            <Text style={styles.postTitle}>{post.title}</Text>
            <Text style={styles.postContent}>{post.content}</Text>

            <View style={styles.tagsContainer}>
              {post.tags.map((tag, index) => (
                <View key={index} style={styles.tag}>
                  <Text style={styles.tagText}>#{tag}</Text>
                </View>
              ))}
            </View>

            <View style={styles.postActions}>
              <View style={styles.postActionsLeft}>
                <View style={styles.voteContainer}>
                  <TouchableOpacity
                    style={styles.voteButton}
                    onPress={() => handleVote(post.id, 'up')}
                  >
                    <ArrowUp
                      size={20}
                      color={post.isUpvoted ? colors.primary : colors.textSecondary}
                      fill={post.isUpvoted ? colors.primary : 'none'}
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
                      color={post.isDownvoted ? colors.error : colors.textSecondary}
                      fill={post.isDownvoted ? colors.error : 'none'}
                    />
                  </TouchableOpacity>
                </View>

                <TouchableOpacity style={styles.commentsButton}>
                  <MessageCircle size={18} color={colors.textSecondary} />
                  <Text style={styles.commentsCount}>{post.comments}</Text>
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
                    color={post.isBookmarked ? colors.primary : colors.textSecondary}
                    fill={post.isBookmarked ? colors.primary : 'none'}
                  />
                </TouchableOpacity>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}