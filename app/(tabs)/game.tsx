import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Image,
  ScrollView,
  Alert,
  RefreshControl,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import {
  ThumbsUp,
  ThumbsDown,
  RotateCcw,
  Trophy,
  Zap,
  Star,
  TrendingUp,
  Users,
} from 'lucide-react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';

const { width, height } = Dimensions.get('window');

interface GameIdea {
  id: string;
  title: string;
  description: string;
  category: string;
  funding_goal: number;
  difficulty: string;
  market_size: string;
  image_url?: string;
  pitch_votes: number;
  ditch_votes: number;
  is_active: boolean;
  created_at: string;
}

interface GameScore {
  id: string;
  user_id: string;
  total_score: number;
  total_votes: number;
  accuracy: number;
  best_streak: number;
  current_streak: number;
}

const mockLeaderboard = [
  { rank: 1, name: 'Sarah Chen', score: 2847, avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=50&h=50&fit=crop' },
  { rank: 2, name: 'Alex Thompson', score: 2634, avatar: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=50&h=50&fit=crop' },
  { rank: 3, name: 'Marcus Johnson', score: 2456, avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=50&h=50&fit=crop' },
  { rank: 4, name: 'You', score: 1834, avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=50&h=50&fit=crop' },
];

export default function PitchOrDitchGame() {
  const { colors } = useTheme();
  const { profile } = useAuth();
  const [currentIdeaIndex, setCurrentIdeaIndex] = useState(0);
  const [gameIdeas, setGameIdeas] = useState<GameIdea[]>([]);
  const [userScore, setUserScore] = useState<GameScore | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [lastVote, setLastVote] = useState<'pitch' | 'ditch' | null>(null);

  useEffect(() => {
    fetchGameIdeas();
    fetchUserScore();
  }, []);

  const fetchGameIdeas = async () => {
    try {
      const { data, error } = await supabase
        .from('game_ideas')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) {
        console.error('Error fetching game ideas:', error);
        return;
      }

      setGameIdeas(data || []);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const fetchUserScore = async () => {
    if (!profile?.id) return;

    try {
      const { data, error } = await supabase
        .from('game_scores')
        .select('*')
        .eq('user_id', profile.id)
        .maybeSingle();

      if (error) {
        console.error('Error fetching user score:', error);
        return;
      }

      if (data) {
        setUserScore(data);
      } else {
        // Create initial score record
        const { data: newScore, error: createError } = await supabase
          .from('game_scores')
          .insert({
            user_id: profile.id,
            total_score: 0,
            total_votes: 0,
            accuracy: 0,
            best_streak: 0,
            current_streak: 0,
          })
          .select()
          .single();

        if (!createError && newScore) {
          setUserScore(newScore);
        }
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleVote = async (vote: 'pitch' | 'ditch') => {
    if (!profile?.id || gameIdeas.length === 0) {
      Alert.alert('Login Required', 'Please log in to play the game.');
      return;
    }

    const currentIdea = gameIdeas[currentIdeaIndex];
    setLastVote(vote);
    setShowResult(true);

    try {
      // Record the vote with proper conflict resolution
      await supabase
        .from('game_votes')
        .upsert({
          user_id: profile.id,
          idea_id: currentIdea.id,
          vote_type: vote,
        }, {
          onConflict: 'user_id,idea_id'
        });

      // Calculate points based on vote and community consensus
      const totalVotes = currentIdea.pitch_votes + currentIdea.ditch_votes;
      const majorityVote = currentIdea.pitch_votes > currentIdea.ditch_votes ? 'pitch' : 'ditch';
      const isCorrect = vote === majorityVote;
      
      let points = 10; // Base points
      if (isCorrect) {
        points += 15; // Bonus for matching majority
      }
      
      // Update user score
      if (userScore) {
        const newStreak = isCorrect ? userScore.current_streak + 1 : 0;
        const newAccuracy = Math.round(((userScore.accuracy * userScore.total_votes) + (isCorrect ? 100 : 0)) / (userScore.total_votes + 1));
        
        await supabase
          .from('game_scores')
          .update({
            total_score: userScore.total_score + points,
            total_votes: userScore.total_votes + 1,
            accuracy: newAccuracy,
            best_streak: Math.max(userScore.best_streak, newStreak),
            current_streak: newStreak,
          })
          .eq('user_id', profile.id);

        setUserScore({
          ...userScore,
          total_score: userScore.total_score + points,
          total_votes: userScore.total_votes + 1,
          accuracy: newAccuracy,
          best_streak: Math.max(userScore.best_streak, newStreak),
          current_streak: newStreak,
        });
      }

      setTimeout(() => {
        nextIdea();
      }, 2000);
    } catch (error) {
      console.error('Error recording vote:', error);
      Alert.alert('Error', 'Failed to record vote. Please try again.');
    }
  };

  const nextIdea = () => {
    setShowResult(false);
    setLastVote(null);
    setCurrentIdeaIndex((prev) => (prev + 1) % gameIdeas.length);
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchGameIdeas();
    fetchUserScore();
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case 'easy': return colors.success;
      case 'medium': return colors.warning;
      case 'hard': return colors.error;
      case 'impossible': return colors.error;
      default: return colors.textSecondary;
    }
  };

  const getMarketSizeIcon = (size: string) => {
    switch (size.toLowerCase()) {
      case 'small':
      case 'niche':
        return <Users size={16} color={colors.textSecondary} />;
      case 'medium':
        return <TrendingUp size={16} color={colors.warning} />;
      case 'large':
      case 'huge':
      case 'infinite':
        return <Star size={16} color={colors.success} />;
      default:
        return <Users size={16} color={colors.textSecondary} />;
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
    scoreContainer: {
      alignItems: 'flex-end',
    },
    score: {
      fontSize: 24,
      fontFamily: 'Inter-Bold',
      color: colors.primary,
    },
    scoreLabel: {
      fontSize: 12,
      fontFamily: 'Inter-Medium',
      color: colors.textSecondary,
    },
    statsContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    statItem: {
      alignItems: 'center',
      flex: 1,
    },
    statValue: {
      fontSize: 20,
      fontFamily: 'Inter-Bold',
      color: colors.text,
    },
    statLabel: {
      fontSize: 12,
      fontFamily: 'Inter-Medium',
      color: colors.textSecondary,
      marginTop: 4,
    },
    gameContainer: {
      flex: 1,
      paddingHorizontal: 20,
    },
    ideaCard: {
      backgroundColor: colors.card,
      borderRadius: 20,
      marginBottom: 20,
      borderWidth: 1,
      borderColor: colors.border,
      overflow: 'hidden',
    },
    ideaImage: {
      width: '100%',
      height: 200,
    },
    ideaContent: {
      padding: 20,
    },
    ideaHeader: {
      marginBottom: 16,
    },
    ideaTitle: {
      fontSize: 24,
      fontFamily: 'Inter-Bold',
      color: colors.text,
      marginBottom: 8,
    },
    ideaCategory: {
      backgroundColor: colors.primary + '20',
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 16,
      alignSelf: 'flex-start',
    },
    ideaCategoryText: {
      fontSize: 12,
      fontFamily: 'Inter-Bold',
      color: colors.primary,
    },
    ideaDescription: {
      fontSize: 16,
      fontFamily: 'Inter-Regular',
      color: colors.textSecondary,
      lineHeight: 24,
      marginBottom: 20,
    },
    ideaMetrics: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 20,
    },
    metricItem: {
      alignItems: 'center',
      flex: 1,
    },
    metricValue: {
      fontSize: 16,
      fontFamily: 'Inter-Bold',
      color: colors.text,
    },
    metricLabel: {
      fontSize: 12,
      fontFamily: 'Inter-Medium',
      color: colors.textSecondary,
      marginTop: 4,
    },
    difficultyBadge: {
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 8,
    },
    difficultyText: {
      fontSize: 12,
      fontFamily: 'Inter-Bold',
    },
    marketSizeContainer: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    marketSizeText: {
      fontSize: 12,
      fontFamily: 'Inter-Medium',
      color: colors.textSecondary,
      marginLeft: 4,
    },
    votingContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 20,
    },
    voteButton: {
      flex: 1,
      paddingVertical: 16,
      borderRadius: 12,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      marginHorizontal: 8,
    },
    pitchButton: {
      backgroundColor: colors.success,
    },
    ditchButton: {
      backgroundColor: colors.error,
    },
    voteButtonText: {
      fontSize: 18,
      fontFamily: 'Inter-Bold',
      color: '#FFFFFF',
      marginLeft: 8,
    },
    resultOverlay: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: colors.background + 'E6',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 10,
    },
    resultCard: {
      backgroundColor: colors.card,
      borderRadius: 20,
      padding: 24,
      alignItems: 'center',
      marginHorizontal: 40,
      borderWidth: 1,
      borderColor: colors.border,
    },
    resultIcon: {
      marginBottom: 16,
    },
    resultTitle: {
      fontSize: 24,
      fontFamily: 'Inter-Bold',
      color: colors.text,
      marginBottom: 8,
    },
    resultSubtitle: {
      fontSize: 16,
      fontFamily: 'Inter-Regular',
      color: colors.textSecondary,
      textAlign: 'center',
      marginBottom: 16,
    },
    resultStats: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      width: '100%',
    },
    resultStatItem: {
      alignItems: 'center',
    },
    resultStatValue: {
      fontSize: 20,
      fontFamily: 'Inter-Bold',
      color: colors.primary,
    },
    resultStatLabel: {
      fontSize: 12,
      fontFamily: 'Inter-Medium',
      color: colors.textSecondary,
      marginTop: 4,
    },
    communityVotes: {
      marginTop: 20,
    },
    communityTitle: {
      fontSize: 16,
      fontFamily: 'Inter-Bold',
      color: colors.text,
      marginBottom: 12,
      textAlign: 'center',
    },
    voteBreakdown: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    voteItem: {
      alignItems: 'center',
      flex: 1,
    },
    voteCount: {
      fontSize: 18,
      fontFamily: 'Inter-Bold',
      color: colors.text,
    },
    voteLabel: {
      fontSize: 12,
      fontFamily: 'Inter-Medium',
      color: colors.textSecondary,
      marginTop: 4,
    },
    leaderboardContainer: {
      backgroundColor: colors.card,
      borderRadius: 16,
      padding: 20,
      marginBottom: 20,
      borderWidth: 1,
      borderColor: colors.border,
    },
    leaderboardTitle: {
      fontSize: 18,
      fontFamily: 'Inter-Bold',
      color: colors.text,
      marginBottom: 16,
      textAlign: 'center',
    },
    leaderboardItem: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 8,
    },
    rank: {
      width: 30,
      fontSize: 16,
      fontFamily: 'Inter-Bold',
      color: colors.textSecondary,
    },
    rankFirst: {
      color: '#FFD700',
    },
    rankSecond: {
      color: '#C0C0C0',
    },
    rankThird: {
      color: '#CD7F32',
    },
    leaderAvatar: {
      width: 32,
      height: 32,
      borderRadius: 16,
      marginRight: 12,
    },
    leaderName: {
      flex: 1,
      fontSize: 14,
      fontFamily: 'Inter-Medium',
      color: colors.text,
    },
    leaderScore: {
      fontSize: 14,
      fontFamily: 'Inter-Bold',
      color: colors.primary,
    },
    streakContainer: {
      backgroundColor: colors.warning + '20',
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 16,
      flexDirection: 'row',
      alignItems: 'center',
      alignSelf: 'center',
      marginBottom: 20,
    },
    streakText: {
      fontSize: 14,
      fontFamily: 'Inter-Bold',
      color: colors.warning,
      marginLeft: 4,
    },
    loadingText: {
      fontSize: 16,
      fontFamily: 'Inter-Medium',
      color: colors.textSecondary,
      textAlign: 'center',
      marginTop: 100,
    },
  });

  if (loading || gameIdeas.length === 0) {
    return (
      <View style={styles.container}>
        <LinearGradient
          colors={[colors.warning + '10', colors.background]}
          style={styles.header}
        >
          <View style={styles.headerTop}>
            <Text style={styles.title}>Pitch or Ditch</Text>
          </View>
        </LinearGradient>
        <Text style={styles.loadingText}>Loading game ideas...</Text>
      </View>
    );
  }

  const currentIdea = gameIdeas[currentIdeaIndex];

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[colors.warning + '10', colors.background]}
        style={styles.header}
      >
        <View style={styles.headerTop}>
          <Text style={styles.title}>Pitch or Ditch</Text>
          <View style={styles.scoreContainer}>
            <Text style={styles.score}>{userScore?.total_score?.toLocaleString() || '0'}</Text>
            <Text style={styles.scoreLabel}>Points</Text>
          </View>
        </View>

        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{userScore?.total_votes || 0}</Text>
            <Text style={styles.statLabel}>Total Votes</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{userScore?.accuracy || 0}%</Text>
            <Text style={styles.statLabel}>Accuracy</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{userScore?.best_streak || 0}</Text>
            <Text style={styles.statLabel}>Best Streak</Text>
          </View>
        </View>
      </LinearGradient>

      <ScrollView 
        style={styles.gameContainer} 
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {userScore && userScore.current_streak > 0 && (
          <View style={styles.streakContainer}>
            <Zap size={16} color={colors.warning} />
            <Text style={styles.streakText}>{userScore.current_streak} Vote Streak!</Text>
          </View>
        )}

        <View style={styles.ideaCard}>
          {currentIdea.image_url && (
            <Image source={{ uri: currentIdea.image_url }} style={styles.ideaImage} />
          )}
          
          <View style={styles.ideaContent}>
            <View style={styles.ideaHeader}>
              <Text style={styles.ideaTitle}>{currentIdea.title}</Text>
              <View style={styles.ideaCategory}>
                <Text style={styles.ideaCategoryText}>{currentIdea.category}</Text>
              </View>
            </View>

            <Text style={styles.ideaDescription}>{currentIdea.description}</Text>

            <View style={styles.ideaMetrics}>
              <View style={styles.metricItem}>
                <Text style={styles.metricValue}>{formatCurrency(currentIdea.funding_goal)}</Text>
                <Text style={styles.metricLabel}>Funding Goal</Text>
              </View>
              <View style={styles.metricItem}>
                <View style={[
                  styles.difficultyBadge,
                  { backgroundColor: getDifficultyColor(currentIdea.difficulty) + '20' }
                ]}>
                  <Text style={[
                    styles.difficultyText,
                    { color: getDifficultyColor(currentIdea.difficulty) }
                  ]}>
                    {currentIdea.difficulty}
                  </Text>
                </View>
                <Text style={styles.metricLabel}>Difficulty</Text>
              </View>
              <View style={styles.metricItem}>
                <View style={styles.marketSizeContainer}>
                  {getMarketSizeIcon(currentIdea.market_size)}
                  <Text style={styles.marketSizeText}>{currentIdea.market_size}</Text>
                </View>
                <Text style={styles.metricLabel}>Market Size</Text>
              </View>
            </View>

            <View style={styles.votingContainer}>
              <TouchableOpacity
                style={[styles.voteButton, styles.pitchButton]}
                onPress={() => handleVote('pitch')}
                disabled={showResult}
              >
                <ThumbsUp size={24} color="#FFFFFF" />
                <Text style={styles.voteButtonText}>PITCH</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.voteButton, styles.ditchButton]}
                onPress={() => handleVote('ditch')}
                disabled={showResult}
              >
                <ThumbsDown size={24} color="#FFFFFF" />
                <Text style={styles.voteButtonText}>DITCH</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.communityVotes}>
              <Text style={styles.communityTitle}>Community Votes</Text>
              <View style={styles.voteBreakdown}>
                <View style={styles.voteItem}>
                  <Text style={[styles.voteCount, { color: colors.success }]}>
                    {currentIdea.pitch_votes}
                  </Text>
                  <Text style={styles.voteLabel}>Pitch</Text>
                </View>
                <View style={styles.voteItem}>
                  <Text style={[styles.voteCount, { color: colors.error }]}>
                    {currentIdea.ditch_votes}
                  </Text>
                  <Text style={styles.voteLabel}>Ditch</Text>
                </View>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.leaderboardContainer}>
          <Text style={styles.leaderboardTitle}>🏆 Leaderboard</Text>
          {mockLeaderboard.map((player) => (
            <View key={player.rank} style={styles.leaderboardItem}>
              <Text style={[
                styles.rank,
                player.rank === 1 && styles.rankFirst,
                player.rank === 2 && styles.rankSecond,
                player.rank === 3 && styles.rankThird,
              ]}>
                {player.rank}
              </Text>
              <Image source={{ uri: player.avatar }} style={styles.leaderAvatar} />
              <Text style={[
                styles.leaderName,
                player.name === 'You' && { color: colors.primary, fontFamily: 'Inter-Bold' }
              ]}>
                {player.name}
              </Text>
              <Text style={styles.leaderScore}>{player.score.toLocaleString()}</Text>
            </View>
          ))}
        </View>
      </ScrollView>

      {showResult && (
        <View style={styles.resultOverlay}>
          <View style={styles.resultCard}>
            <View style={styles.resultIcon}>
              {lastVote === 'pitch' ? (
                <ThumbsUp size={48} color={colors.success} />
              ) : (
                <ThumbsDown size={48} color={colors.error} />
              )}
            </View>
            <Text style={styles.resultTitle}>
              {lastVote === 'pitch' ? 'PITCHED!' : 'DITCHED!'}
            </Text>
            <Text style={styles.resultSubtitle}>
              {((lastVote === 'pitch' && currentIdea.pitch_votes > currentIdea.ditch_votes) ||
                (lastVote === 'ditch' && currentIdea.ditch_votes > currentIdea.pitch_votes))
                ? 'You matched the majority! +25 points'
                : 'Different from majority, but that\'s okay! +10 points'}
            </Text>
            <View style={styles.resultStats}>
              <View style={styles.resultStatItem}>
                <Text style={styles.resultStatValue}>+{
                  ((lastVote === 'pitch' && currentIdea.pitch_votes > currentIdea.ditch_votes) ||
                   (lastVote === 'ditch' && currentIdea.ditch_votes > currentIdea.pitch_votes))
                    ? '25' : '10'
                }</Text>
                <Text style={styles.resultStatLabel}>Points</Text>
              </View>
              <View style={styles.resultStatItem}>
                <Text style={styles.resultStatValue}>{(userScore?.current_streak || 0) + 1}</Text>
                <Text style={styles.resultStatLabel}>Streak</Text>
              </View>
            </View>
          </View>
        </View>
      )}
    </View>
  );
}