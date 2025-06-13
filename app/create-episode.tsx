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
  Image,
} from 'react-native';
import { router } from 'expo-router';
import { ArrowLeft, Sparkles, Volume2, Video, Upload, Play, Download, Share2, Crown } from 'lucide-react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { useAuth } from '@/contexts/AuthContext';
import { generatePodcastScript } from '@/lib/openai';
import { generateVoiceover } from '@/lib/elevenlabs';
import { generatePodcastVideo } from '@/lib/tavus';
import { mintPodcastNFT } from '@/lib/algorand';
import { createPodcastDomain } from '@/lib/entri';

export default function CreateEpisode() {
  const { colors } = useTheme();
  const { profile } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [episodeData, setEpisodeData] = useState({
    title: '',
    topic: '',
    duration: '5',
    script: '',
    audioUrl: '',
    videoUrl: '',
    imageUrl: '',
  });
  const [loading, setLoading] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setEpisodeData({ ...episodeData, [field]: value });
  };

  const handleGenerateScript = async () => {
    if (!episodeData.topic.trim()) {
      Alert.alert('Missing Topic', 'Please enter a topic for your podcast.');
      return;
    }

    if (profile?.tier === 'free' && parseInt(episodeData.duration) > 5) {
      Alert.alert('Upgrade Required', 'Free users can create episodes up to 5 minutes. Upgrade to Pro for longer episodes.');
      return;
    }

    setLoading(true);
    
    try {
      const result = await generatePodcastScript(episodeData.topic, parseInt(episodeData.duration));
      
      if (result.success) {
        setEpisodeData({ ...episodeData, script: result.script });
        setCurrentStep(2);
      } else {
        Alert.alert('Error', 'Failed to generate script. Please try again.');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to generate script. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateAudio = async () => {
    if (profile?.tier === 'free') {
      Alert.alert('Upgrade Required', 'Voice AI features are available for Pro users only.');
      return;
    }

    if (!episodeData.script.trim()) {
      Alert.alert('Missing Script', 'Please generate or enter a script first.');
      return;
    }

    setLoading(true);
    
    try {
      const result = await generateVoiceover(episodeData.script);
      
      if (result.success) {
        // In a real app, you'd upload the audio blob and get a URL
        const mockAudioUrl = 'https://example.com/audio.mp3';
        setEpisodeData({ ...episodeData, audioUrl: mockAudioUrl });
        Alert.alert('Success!', 'Audio generated successfully!');
      } else {
        Alert.alert('Error', 'Failed to generate audio. Please try again.');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to generate audio. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateVideo = async () => {
    if (profile?.tier === 'free') {
      Alert.alert('Upgrade Required', 'Video AI features are available for Pro users only.');
      return;
    }

    if (!episodeData.script.trim()) {
      Alert.alert('Missing Script', 'Please generate or enter a script first.');
      return;
    }

    setLoading(true);
    
    try {
      const result = await generatePodcastVideo(episodeData.script);
      
      if (result.success) {
        // In a real app, you'd get the video URL from the response
        const mockVideoUrl = 'https://example.com/video.mp4';
        setEpisodeData({ ...episodeData, videoUrl: mockVideoUrl });
        Alert.alert('Success!', 'Video generated successfully!');
      } else {
        Alert.alert('Error', 'Failed to generate video. Please try again.');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to generate video. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handlePublish = async () => {
    if (!episodeData.title.trim() || !episodeData.script.trim()) {
      Alert.alert('Missing Information', 'Please provide a title and script for your episode.');
      return;
    }

    setLoading(true);
    
    try {
      // Mint as NFT
      const nftResult = await mintPodcastNFT(
        profile?.id || '',
        episodeData.title,
        episodeData.topic,
        episodeData.audioUrl,
        episodeData.videoUrl
      );

      if (nftResult.success) {
        Alert.alert(
          'Episode Published!',
          'Your podcast episode has been created and minted as an NFT on Algorand blockchain.',
          [
            {
              text: 'View Episode',
              onPress: () => router.replace('/(tabs)')
            }
          ]
        );
      } else {
        Alert.alert('Error', 'Failed to publish episode. Please try again.');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to publish episode. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateDomain = async () => {
    if (!profile?.full_name) return;
    
    try {
      const result = await createPodcastDomain(
        profile.full_name.toLowerCase().replace(/\s+/g, ''),
        episodeData.title
      );
      
      if (result.success) {
        Alert.alert(
          'Domain Created!',
          `Your podcast website is being set up at ${result.domain}. It will be live shortly.`
        );
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to create domain. Please try again.');
    }
  };

  const renderStep1 = () => (
    <View style={styles.stepContent}>
      <Text style={styles.stepTitle}>Episode Details</Text>
      <Text style={styles.stepSubtitle}>Tell us about your podcast episode</Text>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Episode Title</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your episode title"
          placeholderTextColor={colors.textTertiary}
          value={episodeData.title}
          onChangeText={(value) => handleInputChange('title', value)}
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Topic</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="What would you like your podcast to be about?"
          placeholderTextColor={colors.textTertiary}
          multiline
          numberOfLines={4}
          value={episodeData.topic}
          onChangeText={(value) => handleInputChange('topic', value)}
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Duration (minutes)</Text>
        <TextInput
          style={styles.input}
          placeholder="5"
          placeholderTextColor={colors.textTertiary}
          keyboardType="numeric"
          value={episodeData.duration}
          onChangeText={(value) => handleInputChange('duration', value)}
        />
        <Text style={styles.helperText}>
          {profile?.tier === 'free' ? 'Free users: max 5 minutes' : 'Pro users: up to 60 minutes'}
        </Text>
      </View>

      <TouchableOpacity
        style={[
          styles.primaryButton,
          loading && styles.buttonDisabled,
        ]}
        onPress={handleGenerateScript}
        disabled={loading || !episodeData.topic.trim()}
      >
        {loading ? (
          <ActivityIndicator size="small" color="#FFFFFF" />
        ) : (
          <Sparkles size={20} color="#FFFFFF" />
        )}
        <Text style={styles.primaryButtonText}>
          {loading ? 'Generating Script...' : 'Generate Script with AI'}
        </Text>
      </TouchableOpacity>
    </View>
  );

  const renderStep2 = () => (
    <View style={styles.stepContent}>
      <Text style={styles.stepTitle}>Review & Edit Script</Text>
      <Text style={styles.stepSubtitle}>Your AI-generated script is ready</Text>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Script</Text>
        <TextInput
          style={[styles.input, styles.scriptArea]}
          placeholder="Your podcast script will appear here..."
          placeholderTextColor={colors.textTertiary}
          multiline
          value={episodeData.script}
          onChangeText={(value) => handleInputChange('script', value)}
        />
      </View>

      <View style={styles.aiToolsContainer}>
        <Text style={styles.sectionTitle}>Generate Media</Text>
        
        <View style={styles.aiToolCard}>
          <View style={styles.aiToolHeader}>
            <Volume2 size={24} color={colors.primary} />
            <Text style={styles.aiToolTitle}>Generate Audio (ElevenLabs)</Text>
            {profile?.tier === 'free' && (
              <View style={styles.proTag}>
                <Crown size={12} color={colors.warning} />
                <Text style={styles.proTagText}>PRO</Text>
              </View>
            )}
          </View>
          <Text style={styles.aiToolDescription}>
            Convert your script to natural-sounding voiceover
          </Text>
          <TouchableOpacity
            style={[
              styles.aiToolButton,
              profile?.tier === 'pro' && styles.aiToolButtonPro,
            ]}
            onPress={profile?.tier === 'pro' ? handleGenerateAudio : () => router.push('/upgrade')}
          >
            <Volume2 size={16} color={profile?.tier === 'pro' ? '#FFFFFF' : colors.text} />
            <Text style={[
              styles.aiToolButtonText,
              profile?.tier === 'pro' && styles.aiToolButtonTextPro,
            ]}>
              {profile?.tier === 'pro' ? 'Generate Audio' : 'Upgrade to Use'}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.aiToolCard}>
          <View style={styles.aiToolHeader}>
            <Video size={24} color={colors.primary} />
            <Text style={styles.aiToolTitle}>Generate Video (Tavus)</Text>
            {profile?.tier === 'free' && (
              <View style={styles.proTag}>
                <Crown size={12} color={colors.warning} />
                <Text style={styles.proTagText}>PRO</Text>
              </View>
            )}
          </View>
          <Text style={styles.aiToolDescription}>
            Create a personalized video introduction with AI avatars
          </Text>
          <TouchableOpacity
            style={[
              styles.aiToolButton,
              profile?.tier === 'pro' && styles.aiToolButtonPro,
            ]}
            onPress={profile?.tier === 'pro' ? handleGenerateVideo : () => router.push('/upgrade')}
          >
            <Video size={16} color={profile?.tier === 'pro' ? '#FFFFFF' : colors.text} />
            <Text style={[
              styles.aiToolButtonText,
              profile?.tier === 'pro' && styles.aiToolButtonTextPro,
            ]}>
              {profile?.tier === 'pro' ? 'Generate Video' : 'Upgrade to Use'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <TouchableOpacity
        style={styles.primaryButton}
        onPress={() => setCurrentStep(3)}
      >
        <Play size={20} color="#FFFFFF" />
        <Text style={styles.primaryButtonText}>Continue to Publish</Text>
      </TouchableOpacity>
    </View>
  );

  const renderStep3 = () => (
    <View style={styles.stepContent}>
      <Text style={styles.stepTitle}>Publish Episode</Text>
      <Text style={styles.stepSubtitle}>Review and publish your podcast episode</Text>

      <View style={styles.previewCard}>
        <Image 
          source={{ uri: 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=400&h=200&fit=crop' }}
          style={styles.previewImage}
        />
        <View style={styles.previewContent}>
          <Text style={styles.previewTitle}>{episodeData.title}</Text>
          <Text style={styles.previewCreator}>by {profile?.full_name}</Text>
          <Text style={styles.previewDuration}>{episodeData.duration} minutes</Text>
        </View>
      </View>

      <View style={styles.publishOptions}>
        <Text style={styles.sectionTitle}>Publishing Options</Text>
        
        <TouchableOpacity style={styles.optionCard} onPress={handleCreateDomain}>
          <View style={styles.optionHeader}>
            <Text style={styles.optionTitle}>Create Custom Domain</Text>
            <Text style={styles.optionSubtitle}>Get your own podcast website</Text>
          </View>
        </TouchableOpacity>

        <View style={styles.optionCard}>
          <View style={styles.optionHeader}>
            <Text style={styles.optionTitle}>Mint as NFT</Text>
            <Text style={styles.optionSubtitle}>Publish on Algorand blockchain</Text>
          </View>
        </View>
      </View>

      <TouchableOpacity
        style={[
          styles.primaryButton,
          loading && styles.buttonDisabled,
        ]}
        onPress={handlePublish}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator size="small" color="#FFFFFF" />
        ) : (
          <Share2 size={20} color="#FFFFFF" />
        )}
        <Text style={styles.primaryButtonText}>
          {loading ? 'Publishing...' : 'Publish Episode'}
        </Text>
      </TouchableOpacity>
    </View>
  );

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
    scrollContainer: {
      flex: 1,
    },
    stepContent: {
      padding: 20,
    },
    stepTitle: {
      fontSize: 28,
      fontFamily: 'Inter-Bold',
      color: colors.text,
      marginBottom: 8,
    },
    stepSubtitle: {
      fontSize: 16,
      fontFamily: 'Inter-Regular',
      color: colors.textSecondary,
      marginBottom: 30,
    },
    inputContainer: {
      marginBottom: 24,
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
    scriptArea: {
      height: 200,
      textAlignVertical: 'top',
    },
    helperText: {
      fontSize: 14,
      fontFamily: 'Inter-Regular',
      color: colors.textSecondary,
      marginTop: 8,
    },
    primaryButton: {
      backgroundColor: colors.primary,
      paddingVertical: 18,
      borderRadius: 12,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: 20,
    },
    buttonDisabled: {
      opacity: 0.6,
    },
    primaryButtonText: {
      fontSize: 18,
      fontFamily: 'Inter-SemiBold',
      color: '#FFFFFF',
      marginLeft: 8,
    },
    aiToolsContainer: {
      marginBottom: 24,
    },
    sectionTitle: {
      fontSize: 20,
      fontFamily: 'Inter-Bold',
      color: colors.text,
      marginBottom: 16,
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
    aiToolTitle: {
      fontSize: 16,
      fontFamily: 'Inter-SemiBold',
      color: colors.text,
      flex: 1,
      marginLeft: 12,
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
    previewCard: {
      backgroundColor: colors.card,
      borderRadius: 16,
      overflow: 'hidden',
      marginBottom: 24,
      borderWidth: 1,
      borderColor: colors.border,
    },
    previewImage: {
      width: '100%',
      height: 160,
    },
    previewContent: {
      padding: 16,
    },
    previewTitle: {
      fontSize: 18,
      fontFamily: 'Inter-Bold',
      color: colors.text,
      marginBottom: 4,
    },
    previewCreator: {
      fontSize: 14,
      fontFamily: 'Inter-Medium',
      color: colors.textSecondary,
      marginBottom: 4,
    },
    previewDuration: {
      fontSize: 14,
      fontFamily: 'Inter-SemiBold',
      color: colors.primary,
    },
    publishOptions: {
      marginBottom: 24,
    },
    optionCard: {
      backgroundColor: colors.card,
      borderRadius: 12,
      padding: 16,
      marginBottom: 12,
      borderWidth: 1,
      borderColor: colors.border,
    },
    optionHeader: {
      marginBottom: 8,
    },
    optionTitle: {
      fontSize: 16,
      fontFamily: 'Inter-SemiBold',
      color: colors.text,
      marginBottom: 4,
    },
    optionSubtitle: {
      fontSize: 14,
      fontFamily: 'Inter-Regular',
      color: colors.textSecondary,
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <ArrowLeft size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Create Episode</Text>
      </View>

      <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        {currentStep === 1 && renderStep1()}
        {currentStep === 2 && renderStep2()}
        {currentStep === 3 && renderStep3()}
      </ScrollView>
    </View>
  );
}