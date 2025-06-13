import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Image,
  ScrollView,
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

const { width, height } = Dimensions.get('window');

const mockIdeas = [
  {
    id: '1',
    title: 'AI-Powered Sock Matcher',
    description: 'Never lose a sock again! Our AI analyzes your laundry patterns and predicts which socks will go missing, automatically ordering replacements.',
    category: 'AI/Lifestyle',
    image: 'https://images.pexels.com/photos/7679720/pexels-photo-7679720.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop',
    fundingGoal: 50000,
    difficulty: 'Easy',
    marketSize: 'Small',
    votes: { pitch: 234, ditch: 156 },
  },
  {
    id: '2',
    title: 'Blockchain-Based Pet Translator',
    description: 'Decode what your pets are really thinking with our revolutionary blockchain-secured neural network that translates barks, meows, and chirps into human language.',
    category: 'Blockchain/Pets',
    image: 'https://images.pexels.com/photos/1108099/pexels-photo-1108099.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop',
    fundingGoal: 500000,
    difficulty: 'Impossible',
    marketSize: 'Huge',
    votes: { pitch: 89, ditch: 445 },
  },
  {
    id: '3',
    title: 'Subscription Box for Air',
    description: 'Premium air from exotic locations delivered monthly. Each bottle contains authentic atmosphere from places like Mount Everest, Amazon Rainforest, or Paris cafés.',
    category: 'Subscription/Wellness',
    image: 'https://images.pexels.com/photos/1108572/pexels-photo-1108572.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop',
    fundingGoal: 100000,
    difficulty: 'Medium',
    marketSize: 'Medium',
    votes: { pitch: 167, ditch: 298 },
  },
  {
    id: '4',
    title: 'Dating App for Plants',
    description: 'Help your houseplants find love! Our app uses advanced botany algorithms to match compatible plants for optimal growth and happiness.',
    category: 'Dating/Plants',
    image: 'https://images.pexels.com/photos/1084199/pexels-photo-1084199.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop',
    fundingGoal: 25000,
    difficulty: 'Easy',
    marketSize: 'Niche',
    votes: { pitch: 312, ditch: 123 },
  },
  {
    id: '5',
    title: 'Time Travel Insurance',
    description: 'Protect yourself from temporal paradoxes and timeline disruptions. Our comprehensive coverage includes butterfly effect protection and grandfather clause coverage.',
    category: 'Insurance/Sci-Fi',
    image: 'https://images.pexels.com/photos/1181263/pexels-photo-1181263.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop',
    fundingGoal: 1000000,
    difficulty: 'Impossible',
    marketSize: 'Infinite',
    votes: { pitch: 78, ditch: 567 },
  },
];

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
  const [userScore, setUserScore] = useState(1834);
  const [streak, setStreak] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [lastVote, setLastVote] = useState<'pitch' | 'ditch' | null>(null);
  const [gameStats, setGameStats] = useState({
    totalVotes: 156,
    accuracy: 73,
    bestStreak: 12,
  });

  const currentIdea = mockIdeas[currentIdeaIndex];

  const handleVote = (vote: 'pitch' | 'ditch') => {
    setLastVote(vote);
    setShowResult(true);
    
    // Calculate points based on vote and community consensus
    const totalVotes = currentIdea.votes.pitch + currentIdea.votes.ditch;
    const majorityVote = currentIdea.votes.pitch > currentIdea.votes.ditch ? 'pitch' : 'ditch';
    const isCorrect = vote === majorityVote;
    
    let points = 10; // Base points
    if (isCorrect) {
      points += 15; // Bonus for matching majority
      setStreak(prev => prev + 1);
    } else {
      setStreak(0);
    }
    
    // Streak bonus
    if (streak >= 5) points += 5;
    if (streak >= 10) points += 10;
    
    setUserScore(prev => prev + points);
    setGameStats(prev => ({
      ...prev,
      totalVotes: prev.totalVotes + 1,
      accuracy: isCorrect ? Math.min(100, prev.accuracy + 1) : Math.max(0, prev.accuracy - 1),
      bestStreak: Math.max(prev.bestStreak, streak + (isCorrect ? 1 : 0)),
    }));

    setTimeout(() => {
      nextIdea();
    }, 2000);
  };

  const nextIdea = () => {
    setShowResult(false);
    setLastVote(null);
    setCurrentIdeaIndex((prev) => (prev + 1) % mockIdeas.length);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case 'easy': return colors.success;
      case 'medium': return colors.warning;
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
      case 'huge':
      case 'infinite':
        return <Star size={16} color={colors.success} />;
      default:
        return <Users size={16} color={colors.textSecondary} />;
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
      <LinearGradient
        colors={[colors.warning + '10', colors.background]}
        style={styles.header}
      >
        <View style={styles.headerTop}>
          <Text style={styles.title}>Pitch or Ditch</Text>
          <View style={styles.scoreContainer}>
            <Text style={styles.score}>{userScore.toLocaleString()}</Text>
            <Text style={styles.scoreLabel}>Points</Text>
          </View>
        </View>

        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{gameStats.totalVotes}</Text>
            <Text style={styles.statLabel}>Total Votes</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{gameStats.accuracy}%</Text>
            <Text style={styles.statLabel}>Accuracy</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{gameStats.bestStreak}</Text>
            <Text style={styles.statLabel}>Best Streak</Text>
          </View>
        </View>
      </LinearGradient>

      <ScrollView style={styles.gameContainer} showsVerticalScrollIndicator={false}>
        {streak > 0 && (
          <View style={styles.streakContainer}>
            <Zap size={16} color={colors.warning} />
            <Text style={styles.streakText}>{streak} Vote Streak!</Text>
          </View>
        )}

        <View style={styles.ideaCard}>
          <Image source={{ uri: currentIdea.image }} style={styles.ideaImage} />
          
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
                <Text style={styles.metricValue}>{formatCurrency(currentIdea.fundingGoal)}</Text>
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
                  {getMarketSizeIcon(currentIdea.marketSize)}
                  <Text style={styles.marketSizeText}>{currentIdea.marketSize}</Text>
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
                    {currentIdea.votes.pitch}
                  </Text>
                  <Text style={styles.voteLabel}>Pitch</Text>
                </View>
                <View style={styles.voteItem}>
                  <Text style={[styles.voteCount, { color: colors.error }]}>
                    {currentIdea.votes.ditch}
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
              {((lastVote === 'pitch' && currentIdea.votes.pitch > currentIdea.votes.ditch) ||
                (lastVote === 'ditch' && currentIdea.votes.ditch > currentIdea.votes.pitch))
                ? 'You matched the majority! +25 points'
                : 'Different from majority, but that\'s okay! +10 points'}
            </Text>
            <View style={styles.resultStats}>
              <View style={styles.resultStatItem}>
                <Text style={styles.resultStatValue}>+{
                  ((lastVote === 'pitch' && currentIdea.votes.pitch > currentIdea.votes.ditch) ||
                   (lastVote === 'ditch' && currentIdea.votes.ditch > currentIdea.votes.pitch))
                    ? '25' : '10'
                }</Text>
                <Text style={styles.resultStatLabel}>Points</Text>
              </View>
              <View style={styles.resultStatItem}>
                <Text style={styles.resultStatValue}>{streak + 1}</Text>
                <Text style={styles.resultStatLabel}>Streak</Text>
              </View>
            </View>
          </View>
        </View>
      )}
    </View>
  );
}