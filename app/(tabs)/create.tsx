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
} from 'react-native';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import {
  Mic,
  Sparkles,
  Play,
  Video,
  Upload,
  Crown,
  Clock,
  FileText,
  Volume2,
} from 'lucide-react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { useAuth } from '@/contexts/AuthContext';

export default function Create() {
  const { colors } = useTheme();
  const { profile } = useAuth();
  const [topic, setTopic] = useState('');
  const [duration, setDuration] = useState('5');
  const [loading, setLoading] = useState(false);
  const [generatingScript, setGeneratingScript] = useState(false);
  const [generatingAudio, setGeneratingAudio] = useState(false);
  const [generatingVideo, setGeneratingVideo] = useState(false);

  const handleQuickStart = () => {
    router.push('/create-episode');
  };

  const handleGenerateScript = async () => {
    if (!topic.trim()) {
      Alert.alert('Missing Topic', 'Please enter a topic for your podcast.');
      return;
    }

    if (profile?.tier === 'free' && parseInt(duration) > 5) {
      Alert.alert('Upgrade Required', 'Free users can create episodes up to 5 minutes. Upgrade to Pro for longer episodes.');
      return;
    }

    setGeneratingScript(true);
    
    // Simulate AI script generation
    setTimeout(() => {
      setGeneratingScript(false);
      Alert.alert(
        'Script Generated!',
        'Your AI-generated script is ready. Would you like to proceed to create the full episode?',
        [
          { text: 'Edit Script', style: 'cancel' },
          { 
            text: 'Create Episode', 
            onPress: () => router.push('/create-episode')
          }
        ]
      );
    }, 3000);
  };

  const handleGenerateAudio = () => {
    if (profile?.tier === 'free') {
      Alert.alert('Upgrade Required', 'Voice AI features are available for Pro users only.');
      return;
    }

    setGeneratingAudio(true);
    setTimeout(() => {
      setGeneratingAudio(false);
      Alert.alert('Audio Generated!', 'Your AI voiceover has been created successfully.');
    }, 4000);
  };

  const handleGenerateVideo = () => {
    if (profile?.tier === 'free') {
      Alert.alert('Upgrade Required', 'Video AI features are available for Pro users only.');
      return;
    }

    setGeneratingVideo(true);
    setTimeout(() => {
      setGeneratingVideo(false);
      Alert.alert('Video Generated!', 'Your AI video introduction has been created successfully.');
    }, 6000);
  };

  const handleUpgrade = () => {
    router.push('/upgrade');
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
    },
    scrollContainer: {
      flex: 1,
      paddingHorizontal: 20,
    },
    quickStartCard: {
      backgroundColor: colors.card,
      borderRadius: 16,
      padding: 20,
      marginBottom: 24,
      borderWidth: 1,
      borderColor: colors.border,
    },
    quickStartHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 12,
    },
    quickStartIcon: {
      width: 48,
      height: 48,
      borderRadius: 24,
      backgroundColor: colors.primary + '20',
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 16,
    },
    quickStartTitle: {
      fontSize: 20,
      fontFamily: 'Inter-Bold',
      color: colors.text,
    },
    quickStartDescription: {
      fontSize: 15,
      fontFamily: 'Inter-Regular',
      color: colors.textSecondary,
      lineHeight: 22,
      marginBottom: 16,
    },
    quickStartButton: {
      backgroundColor: colors.primary,
      paddingVertical: 14,
      borderRadius: 12,
      alignItems: 'center',
      flexDirection: 'row',
      justifyContent: 'center',
    },
    quickStartButtonText: {
      fontSize: 16,
      fontFamily: 'Inter-SemiBold',
      color: '#FFFFFF',
      marginLeft: 8,
    },
    aiToolsSection: {
      marginBottom: 24,
    },
    sectionTitle: {
      fontSize: 20,
      fontFamily: 'Inter-Bold',
      color: colors.text,
      marginBottom: 16,
    },
    inputContainer: {
      marginBottom: 16,
    },
    label: {
      fontSize: 16,
      fontFamily: 'Inter-Medium',
      color: colors.text,
      marginBottom: 8,
    },
    input: {
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 12,
      paddingVertical: 16,
      paddingHorizontal: 16,
      fontSize: 16,
      fontFamily: 'Inter-Regular',
      color: colors.text,
    },
    textArea: {
      height: 100,
      textAlignVertical: 'top',
    },
    durationContainer: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    durationInput: {
      width: 80,
      marginRight: 12,
    },
    durationLabel: {
      fontSize: 16,
      fontFamily: 'Inter-Medium',
      color: colors.textSecondary,
    },
    generateButton: {
      backgroundColor: colors.primary,
      paddingVertical: 16,
      borderRadius: 12,
      alignItems: 'center',
      flexDirection: 'row',
      justifyContent: 'center',
      marginTop: 8,
    },
    generateButtonDisabled: {
      opacity: 0.6,
    },
    generateButtonText: {
      fontSize: 16,
      fontFamily: 'Inter-SemiBold',
      color: '#FFFFFF',
      marginLeft: 8,
    },
    aiToolCard: {
      backgroundColor: colors.card,
      borderRadius: 12,
      padding: 16,
      marginBottom: 12,
      borderWidth: 1,
      borderColor: colors.border,
    },
    aiToolHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 8,
    },
    aiToolInfo: {
      flexDirection: 'row',
      alignItems: 'center',
      flex: 1,
    },
    aiToolIcon: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: colors.primary + '20',
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 12,
    },
    aiToolTitle: {
      fontSize: 16,
      fontFamily: 'Inter-SemiBold',
      color: colors.text,
    },
    proTag: {
      backgroundColor: colors.warning + '20',
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 8,
      flexDirection: 'row',
      alignItems: 'center',
    },
    proTagText: {
      fontSize: 10,
      fontFamily: 'Inter-Bold',
      color: colors.warning,
      marginLeft: 4,
    },
    aiToolDescription: {
      fontSize: 14,
      fontFamily: 'Inter-Regular',
      color: colors.textSecondary,
      marginBottom: 12,
    },
    aiToolButton: {
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.border,
      paddingVertical: 12,
      borderRadius: 8,
      alignItems: 'center',
      flexDirection: 'row',
      justifyContent: 'center',
    },
    aiToolButtonPro: {
      backgroundColor: colors.primary,
      borderColor: colors.primary,
    },
    aiToolButtonText: {
      fontSize: 14,
      fontFamily: 'Inter-SemiBold',
      color: colors.text,
      marginLeft: 8,
    },
    aiToolButtonTextPro: {
      color: '#FFFFFF',
    },
    upgradeCard: {
      backgroundColor: colors.warning + '10',
      borderWidth: 1,
      borderColor: colors.warning + '40',
      borderRadius: 16,
      padding: 20,
      marginBottom: 24,
    },
    upgradeHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 12,
    },
    upgradeIcon: {
      marginRight: 12,
    },
    upgradeTitle: {
      fontSize: 18,
      fontFamily: 'Inter-Bold',
      color: colors.warning,
    },
    upgradeDescription: {
      fontSize: 15,
      fontFamily: 'Inter-Regular',
      color: colors.textSecondary,
      lineHeight: 22,
      marginBottom: 16,
    },
    upgradeButton: {
      backgroundColor: colors.warning,
      paddingVertical: 14,
      borderRadius: 12,
      alignItems: 'center',
      flexDirection: 'row',
      justifyContent: 'center',
    },
    upgradeButtonText: {
      fontSize: 16,
      fontFamily: 'Inter-SemiBold',
      color: '#FFFFFF',
      marginLeft: 8,
    },
  });

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[colors.primary + '10', colors.background]}
        style={styles.header}
      >
        <Text style={styles.title}>Create Episode</Text>
        <Text style={styles.subtitle}>
          Use AI to generate professional podcast content
        </Text>
      </LinearGradient>

      <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        <View style={styles.quickStartCard}>
          <View style={styles.quickStartHeader}>
            <View style={styles.quickStartIcon}>
              <Mic size={24} color={colors.primary} />
            </View>
            <Text style={styles.quickStartTitle}>Quick Start</Text>
          </View>
          <Text style={styles.quickStartDescription}>
            Jump straight into the full episode creator with all the tools and options.
          </Text>
          <TouchableOpacity style={styles.quickStartButton} onPress={handleQuickStart}>
            <Play size={20} color="#FFFFFF" />
            <Text style={styles.quickStartButtonText}>Start Creating</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.aiToolsSection}>
          <Text style={styles.sectionTitle}>AI Script Generator</Text>
          
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Podcast Topic</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="What would you like your podcast to be about?"
              placeholderTextColor={colors.textTertiary}
              multiline
              value={topic}
              onChangeText={setTopic}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Duration (minutes)</Text>
            <View style={styles.durationContainer}>
              <TextInput
                style={[styles.input, styles.durationInput]}
                placeholder="5"
                placeholderTextColor={colors.textTertiary}
                keyboardType="numeric"
                value={duration}
                onChangeText={setDuration}
              />
              <Text style={styles.durationLabel}>
                {profile?.tier === 'free' ? '(max 5 for free users)' : '(up to 60 minutes)'}
              </Text>
            </View>
          </View>

          <TouchableOpacity
            style={[
              styles.generateButton,
              (generatingScript || !topic.trim()) && styles.generateButtonDisabled,
            ]}
            onPress={handleGenerateScript}
            disabled={generatingScript || !topic.trim()}
          >
            {generatingScript ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <Sparkles size={20} color="#FFFFFF" />
            )}
            <Text style={styles.generateButtonText}>
              {generatingScript ? 'Generating Script...' : 'Generate Script'}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.aiToolsSection}>
          <Text style={styles.sectionTitle}>AI Tools</Text>
          
          <View style={styles.aiToolCard}>
            <View style={styles.aiToolHeader}>
              <View style={styles.aiToolInfo}>
                <View style={styles.aiToolIcon}>
                  <Volume2 size={20} color={colors.primary} />
                </View>
                <Text style={styles.aiToolTitle}>Voice AI (ElevenLabs)</Text>
              </View>
              {profile?.tier === 'free' && (
                <View style={styles.proTag}>
                  <Crown size={12} color={colors.warning} />
                  <Text style={styles.proTagText}>PRO</Text>
                </View>
              )}
            </View>
            <Text style={styles.aiToolDescription}>
              Convert your script to natural-sounding voiceover with multiple voice options.
            </Text>
            <TouchableOpacity
              style={[
                styles.aiToolButton,
                profile?.tier === 'pro' && styles.aiToolButtonPro,
                generatingAudio && styles.generateButtonDisabled,
              ]}
              onPress={profile?.tier === 'pro' ? handleGenerateAudio : handleUpgrade}
              disabled={generatingAudio}
            >
              {generatingAudio ? (
                <ActivityIndicator size="small" color={profile?.tier === 'pro' ? '#FFFFFF' : colors.text} />
              ) : (
                <Volume2 size={16} color={profile?.tier === 'pro' ? '#FFFFFF' : colors.text} />
              )}
              <Text style={[
                styles.aiToolButtonText,
                profile?.tier === 'pro' && styles.aiToolButtonTextPro,
              ]}>
                {generatingAudio ? 'Generating...' : profile?.tier === 'pro' ? 'Generate Audio' : 'Upgrade to Use'}
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.aiToolCard}>
            <View style={styles.aiToolHeader}>
              <View style={styles.aiToolInfo}>
                <View style={styles.aiToolIcon}>
                  <Video size={20} color={colors.primary} />
                </View>
                <Text style={styles.aiToolTitle}>Video AI (Tavus)</Text>
              </View>
              {profile?.tier === 'free' && (
                <View style={styles.proTag}>
                  <Crown size={12} color={colors.warning} />
                  <Text style={styles.proTagText}>PRO</Text>
                </View>
              )}
            </View>
            <Text style={styles.aiToolDescription}>
              Create personalized video introductions with AI avatars for your podcast.
            </Text>
            <TouchableOpacity
              style={[
                styles.aiToolButton,
                profile?.tier === 'pro' && styles.aiToolButtonPro,
                generatingVideo && styles.generateButtonDisabled,
              ]}
              onPress={profile?.tier === 'pro' ? handleGenerateVideo : handleUpgrade}
              disabled={generatingVideo}
            >
              {generatingVideo ? (
                <ActivityIndicator size="small" color={profile?.tier === 'pro' ? '#FFFFFF' : colors.text} />
              ) : (
                <Video size={16} color={profile?.tier === 'pro' ? '#FFFFFF' : colors.text} />
              )}
              <Text style={[
                styles.aiToolButtonText,
                profile?.tier === 'pro' && styles.aiToolButtonTextPro,
              ]}>
                {generatingVideo ? 'Generating...' : profile?.tier === 'pro' ? 'Generate Video' : 'Upgrade to Use'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {profile?.tier === 'free' && (
          <View style={styles.upgradeCard}>
            <View style={styles.upgradeHeader}>
              <Crown size={24} color={colors.warning} style={styles.upgradeIcon} />
              <Text style={styles.upgradeTitle}>Unlock Pro Features</Text>
            </View>
            <Text style={styles.upgradeDescription}>
              Get access to longer episodes, premium voices, video generation, and advanced analytics.
            </Text>
            <TouchableOpacity style={styles.upgradeButton} onPress={handleUpgrade}>
              <Crown size={20} color="#FFFFFF" />
              <Text style={styles.upgradeButtonText}>Upgrade to Pro</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </View>
  );
}