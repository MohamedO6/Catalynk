import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import {
  Sparkles,
  Volume2,
  Video,
  Bot,
  Mic,
  FileText,
  Crown,
  Play,
  Download,
  Share2,
  Zap,
  Brain,
  MessageSquare,
} from 'lucide-react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { useAuth } from '@/contexts/AuthContext';
import { router } from 'expo-router';

interface AITool {
  id: string;
  name: string;
  description: string;
  icon: any;
  color: string;
  category: 'audio' | 'video' | 'text' | 'agent';
  isPro: boolean;
  features: string[];
}

const aiTools: AITool[] = [
  {
    id: 'elevenlabs',
    name: 'ElevenLabs Voice AI',
    description: 'Generate natural-sounding voiceovers with premium AI voices',
    icon: Volume2,
    color: '#8B5CF6',
    category: 'audio',
    isPro: true,
    features: ['Natural voice synthesis', 'Multiple voice options', 'Custom voice cloning', 'High-quality audio'],
  },
  {
    id: 'tavus',
    name: 'Tavus Video AI',
    description: 'Create personalized video content with AI avatars',
    icon: Video,
    color: '#3B82F6',
    category: 'video',
    isPro: true,
    features: ['AI avatar creation', 'Personalized videos', 'Multiple languages', 'HD video output'],
  },
  {
    id: 'openai-gpt',
    name: 'OpenAI GPT-4',
    description: 'Advanced text generation and content creation',
    icon: FileText,
    color: '#10B981',
    category: 'text',
    isPro: false,
    features: ['Content generation', 'Text summarization', 'Language translation', 'Creative writing'],
  },
  {
    id: 'ai-agent',
    name: 'AI Project Assistant',
    description: 'Intelligent agent to help with project planning and development',
    icon: Bot,
    color: '#F59E0B',
    category: 'agent',
    isPro: true,
    features: ['Project analysis', 'Market research', 'Business planning', 'Technical guidance'],
  },
  {
    id: 'speech-to-text',
    name: 'Speech Recognition',
    description: 'Convert speech to text with high accuracy',
    icon: Mic,
    color: '#EF4444',
    category: 'audio',
    isPro: false,
    features: ['Real-time transcription', 'Multiple languages', 'Noise reduction', 'Punctuation'],
  },
  {
    id: 'ai-chat',
    name: 'AI Chat Assistant',
    description: 'Interactive AI assistant for project questions and guidance',
    icon: MessageSquare,
    color: '#8B5CF6',
    category: 'agent',
    isPro: false,
    features: ['24/7 availability', 'Project guidance', 'Technical support', 'Learning resources'],
  },
];

export default function AITools() {
  const { colors } = useTheme();
  const { profile } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [activeTool, setActiveTool] = useState<string | null>(null);

  const categories = [
    { id: 'all', name: 'All Tools', icon: Zap },
    { id: 'audio', name: 'Audio', icon: Volume2 },
    { id: 'video', name: 'Video', icon: Video },
    { id: 'text', name: 'Text', icon: FileText },
    { id: 'agent', name: 'AI Agents', icon: Bot },
  ];

  const filteredTools = aiTools.filter(tool => {
    const matchesCategory = selectedCategory === 'all' || tool.category === selectedCategory;
    const matchesSearch = tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         tool.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleToolPress = async (tool: AITool) => {
    if (tool.isPro && profile?.subscription_tier === 'free') {
      Alert.alert(
        'Upgrade Required',
        `${tool.name} is a Pro feature. Upgrade to access advanced AI tools.`,
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Upgrade', onPress: () => router.push('/upgrade') }
        ]
      );
      return;
    }

    setActiveTool(tool.id);
    
    // Simulate tool activation
    setTimeout(() => {
      setActiveTool(null);
      Alert.alert(
        `${tool.name} Ready`,
        `${tool.name} is now ready to use. This would open the tool interface in a production app.`,
        [
          { text: 'OK' },
          { text: 'Learn More', onPress: () => showToolDetails(tool) }
        ]
      );
    }, 2000);
  };

  const showToolDetails = (tool: AITool) => {
    Alert.alert(
      tool.name,
      `${tool.description}\n\nFeatures:\n${tool.features.map(f => `• ${f}`).join('\n')}`,
      [{ text: 'Got it' }]
    );
  };

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
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
    title: {
      fontSize: 28,
      fontFamily: 'Inter-Bold',
      color: colors.text,
      marginBottom: 8,
    },
    subtitle: {
      fontSize: 16,
      fontFamily: 'Inter-Regular',
      color: colors.textSecondary,
      marginBottom: 20,
    },
    searchContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.surface,
      borderRadius: 12,
      paddingHorizontal: 16,
      marginBottom: 20,
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
      flexDirection: 'row',
      alignItems: 'center',
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
      marginLeft: 8,
    },
    categoryTextActive: {
      color: '#FFFFFF',
    },
    toolsContainer: {
      flex: 1,
      paddingHorizontal: 20,
      paddingTop: 20,
    },
    toolCard: {
      backgroundColor: colors.card,
      borderRadius: 16,
      padding: 20,
      marginBottom: 16,
      borderWidth: 1,
      borderColor: colors.border,
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 4,
      },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 5,
    },
    toolHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 12,
    },
    toolIconContainer: {
      width: 56,
      height: 56,
      borderRadius: 28,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 16,
    },
    toolInfo: {
      flex: 1,
    },
    toolName: {
      fontSize: 18,
      fontFamily: 'Inter-Bold',
      color: colors.text,
      marginBottom: 4,
    },
    toolDescription: {
      fontSize: 14,
      fontFamily: 'Inter-Regular',
      color: colors.textSecondary,
      lineHeight: 20,
    },
    proTag: {
      backgroundColor: colors.warning + '20',
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 8,
      flexDirection: 'row',
      alignItems: 'center',
      alignSelf: 'flex-start',
      marginTop: 8,
    },
    proTagText: {
      fontSize: 10,
      fontFamily: 'Inter-Bold',
      color: colors.warning,
      marginLeft: 4,
    },
    featuresContainer: {
      marginTop: 16,
      marginBottom: 16,
    },
    featuresTitle: {
      fontSize: 14,
      fontFamily: 'Inter-SemiBold',
      color: colors.text,
      marginBottom: 8,
    },
    featuresList: {
      flexDirection: 'row',
      flexWrap: 'wrap',
    },
    featureTag: {
      backgroundColor: colors.surface,
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 12,
      marginRight: 8,
      marginBottom: 4,
    },
    featureText: {
      fontSize: 12,
      fontFamily: 'Inter-Medium',
      color: colors.textSecondary,
    },
    toolActions: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    useButton: {
      backgroundColor: colors.primary,
      paddingVertical: 12,
      paddingHorizontal: 24,
      borderRadius: 12,
      flexDirection: 'row',
      alignItems: 'center',
      flex: 1,
      justifyContent: 'center',
      marginRight: 8,
    },
    upgradeButton: {
      backgroundColor: colors.warning,
    },
    useButtonText: {
      fontSize: 14,
      fontFamily: 'Inter-SemiBold',
      color: '#FFFFFF',
      marginLeft: 6,
    },
    learnButton: {
      backgroundColor: colors.surface,
      paddingVertical: 12,
      paddingHorizontal: 16,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: colors.border,
    },
    learnButtonText: {
      fontSize: 14,
      fontFamily: 'Inter-SemiBold',
      color: colors.text,
    },
    loadingOverlay: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: colors.background + 'E6',
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 16,
    },
    loadingText: {
      fontSize: 14,
      fontFamily: 'Inter-Medium',
      color: colors.text,
      marginTop: 12,
    },
  });

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[colors.primary + '10', colors.background]}
        style={styles.header}
      >
        <Text style={styles.title}>AI Tools</Text>
        <Text style={styles.subtitle}>
          Powerful AI tools to help you understand projects and concepts
        </Text>

        <View style={styles.searchContainer}>
          <Sparkles size={20} color={colors.textSecondary} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search AI tools..."
            placeholderTextColor={colors.textTertiary}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </LinearGradient>

      <View style={styles.categoriesContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesScrollView}
        >
          {categories.map((category) => {
            const Icon = category.icon;
            return (
              <TouchableOpacity
                key={category.id}
                style={[
                  styles.categoryButton,
                  selectedCategory === category.id && styles.categoryButtonActive,
                ]}
                onPress={() => setSelectedCategory(category.id)}
              >
                <Icon 
                  size={16} 
                  color={selectedCategory === category.id ? '#FFFFFF' : colors.text} 
                />
                <Text
                  style={[
                    styles.categoryText,
                    selectedCategory === category.id && styles.categoryTextActive,
                  ]}
                >
                  {category.name}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      <ScrollView 
        style={styles.toolsContainer} 
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {filteredTools.map((tool) => {
          const Icon = tool.icon;
          const isActive = activeTool === tool.id;
          const canUse = !tool.isPro || profile?.subscription_tier === 'pro';

          return (
            <View key={tool.id} style={styles.toolCard}>
              <View style={styles.toolHeader}>
                <View style={[
                  styles.toolIconContainer,
                  { backgroundColor: tool.color + '20' }
                ]}>
                  <Icon size={28} color={tool.color} />
                </View>
                <View style={styles.toolInfo}>
                  <Text style={styles.toolName}>{tool.name}</Text>
                  <Text style={styles.toolDescription}>{tool.description}</Text>
                  {tool.isPro && (
                    <View style={styles.proTag}>
                      <Crown size={12} color={colors.warning} />
                      <Text style={styles.proTagText}>PRO</Text>
                    </View>
                  )}
                </View>
              </View>

              <View style={styles.featuresContainer}>
                <Text style={styles.featuresTitle}>Features</Text>
                <View style={styles.featuresList}>
                  {tool.features.map((feature, index) => (
                    <View key={index} style={styles.featureTag}>
                      <Text style={styles.featureText}>{feature}</Text>
                    </View>
                  ))}
                </View>
              </View>

              <View style={styles.toolActions}>
                <TouchableOpacity
                  style={[
                    styles.useButton,
                    !canUse && styles.upgradeButton,
                  ]}
                  onPress={() => handleToolPress(tool)}
                  disabled={isActive}
                >
                  {isActive ? (
                    <ActivityIndicator size="small" color="#FFFFFF" />
                  ) : (
                    <Play size={16} color="#FFFFFF" />
                  )}
                  <Text style={styles.useButtonText}>
                    {isActive ? 'Loading...' : canUse ? 'Use Tool' : 'Upgrade to Use'}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.learnButton}
                  onPress={() => showToolDetails(tool)}
                >
                  <Text style={styles.learnButtonText}>Learn More</Text>
                </TouchableOpacity>
              </View>

              {isActive && (
                <View style={styles.loadingOverlay}>
                  <ActivityIndicator size="large" color={colors.primary} />
                  <Text style={styles.loadingText}>Initializing {tool.name}...</Text>
                </View>
              )}
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
}