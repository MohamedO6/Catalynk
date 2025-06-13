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
  ActivityIndicator,
} from 'react-native';
import { router } from 'expo-router';
import {
  ArrowLeft,
  Upload,
  Play,
  Volume2,
  Tag,
  DollarSign,
  Users,
  Calendar,
  MapPin,
  Link,
  X,
} from 'lucide-react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { useAuth } from '@/contexts/AuthContext';

const categories = [
  'FinTech', 'HealthTech', 'EdTech', 'CleanTech', 'AI/ML', 'Blockchain',
  'E-commerce', 'SaaS', 'Mobile Apps', 'IoT', 'Gaming', 'Social Media',
  'Marketplace', 'Sustainability', 'Food & Beverage', 'Travel', 'Real Estate', 'Other'
];

const fundingStages = [
  'Pre-Seed', 'Seed', 'Series A', 'Series B', 'Series C+', 'Growth', 'Not Seeking Funding'
];

export default function CreateProject() {
  const { colors } = useTheme();
  const { profile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    fundingStage: '',
    fundingGoal: '',
    location: '',
    website: '',
    tags: [] as string[],
    teamSize: '',
    timeline: '',
    pitch: '',
    problem: '',
    solution: '',
    market: '',
    competition: '',
    businessModel: '',
    traction: '',
  });
  const [newTag, setNewTag] = useState('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [hasAudio, setHasAudio] = useState(false);
  const [hasVideo, setHasVideo] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
  };

  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim()) && formData.tags.length < 10) {
      setFormData({
        ...formData,
        tags: [...formData.tags, newTag.trim()]
      });
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter(tag => tag !== tagToRemove)
    });
  };

  const selectImage = () => {
    // Simulate image selection
    const sampleImages = [
      'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=400&h=200&fit=crop',
      'https://images.pexels.com/photos/3184292/pexels-photo-3184292.jpeg?auto=compress&cs=tinysrgb&w=400&h=200&fit=crop',
      'https://images.pexels.com/photos/3184293/pexels-photo-3184293.jpeg?auto=compress&cs=tinysrgb&w=400&h=200&fit=crop',
    ];
    setSelectedImage(sampleImages[Math.floor(Math.random() * sampleImages.length)]);
  };

  const generateAudio = () => {
    setHasAudio(true);
    Alert.alert('Audio Generated', 'Your project pitch has been converted to audio using ElevenLabs AI voice synthesis.');
  };

  const generateVideo = () => {
    setHasVideo(true);
    Alert.alert('Video Generated', 'A personalized video introduction has been created using Tavus AI video generation.');
  };

  const validateStep = (step: number) => {
    switch (step) {
      case 1:
        return formData.title.trim() && formData.description.trim() && formData.category;
      case 2:
        return formData.problem.trim() && formData.solution.trim() && formData.market.trim();
      case 3:
        return formData.businessModel.trim() && formData.fundingStage;
      default:
        return true;
    }
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, 4));
    } else {
      Alert.alert('Missing Information', 'Please fill in all required fields before continuing.');
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = async () => {
    if (!validateStep(currentStep)) {
      Alert.alert('Missing Information', 'Please fill in all required fields.');
      return;
    }

    setLoading(true);
    
    try {
      // Simulate project creation
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      Alert.alert(
        'Project Created!',
        'Your project has been successfully created and is now live on the platform.',
        [
          {
            text: 'View Project',
            onPress: () => router.replace('/(tabs)/projects')
          }
        ]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to create project. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const renderStepIndicator = () => (
    <View style={styles.stepIndicator}>
      {[1, 2, 3, 4].map((step) => (
        <View key={step} style={styles.stepContainer}>
          <View style={[
            styles.stepCircle,
            currentStep >= step && styles.stepCircleActive
          ]}>
            <Text style={[
              styles.stepNumber,
              currentStep >= step && styles.stepNumberActive
            ]}>
              {step}
            </Text>
          </View>
          {step < 4 && (
            <View style={[
              styles.stepLine,
              currentStep > step && styles.stepLineActive
            ]} />
          )}
        </View>
      ))}
    </View>
  );

  const renderStep1 = () => (
    <View style={styles.stepContent}>
      <Text style={styles.stepTitle}>Basic Information</Text>
      <Text style={styles.stepSubtitle}>Tell us about your project</Text>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Project Title *</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your project title"
          placeholderTextColor={colors.textTertiary}
          value={formData.title}
          onChangeText={(value) => handleInputChange('title', value)}
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Short Description *</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Briefly describe your project in 1-2 sentences"
          placeholderTextColor={colors.textTertiary}
          multiline
          numberOfLines={3}
          value={formData.description}
          onChangeText={(value) => handleInputChange('description', value)}
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Category *</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryScroll}>
          {categories.map((category) => (
            <TouchableOpacity
              key={category}
              style={[
                styles.categoryButton,
                formData.category === category && styles.categoryButtonActive
              ]}
              onPress={() => handleInputChange('category', category)}
            >
              <Text style={[
                styles.categoryText,
                formData.category === category && styles.categoryTextActive
              ]}>
                {category}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Location</Text>
        <View style={styles.inputWithIcon}>
          <MapPin size={20} color={colors.textSecondary} />
          <TextInput
            style={styles.inputWithIconText}
            placeholder="City, Country"
            placeholderTextColor={colors.textTertiary}
            value={formData.location}
            onChangeText={(value) => handleInputChange('location', value)}
          />
        </View>
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Website/Demo</Text>
        <View style={styles.inputWithIcon}>
          <Link size={20} color={colors.textSecondary} />
          <TextInput
            style={styles.inputWithIconText}
            placeholder="https://yourproject.com"
            placeholderTextColor={colors.textTertiary}
            value={formData.website}
            onChangeText={(value) => handleInputChange('website', value)}
            autoCapitalize="none"
          />
        </View>
      </View>
    </View>
  );

  const renderStep2 = () => (
    <View style={styles.stepContent}>
      <Text style={styles.stepTitle}>Project Details</Text>
      <Text style={styles.stepSubtitle}>Describe your project in detail</Text>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Problem Statement *</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="What problem are you solving?"
          placeholderTextColor={colors.textTertiary}
          multiline
          numberOfLines={4}
          value={formData.problem}
          onChangeText={(value) => handleInputChange('problem', value)}
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Solution *</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="How does your project solve this problem?"
          placeholderTextColor={colors.textTertiary}
          multiline
          numberOfLines={4}
          value={formData.solution}
          onChangeText={(value) => handleInputChange('solution', value)}
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Target Market *</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Who is your target audience?"
          placeholderTextColor={colors.textTertiary}
          multiline
          numberOfLines={3}
          value={formData.market}
          onChangeText={(value) => handleInputChange('market', value)}
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Competition Analysis</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Who are your competitors and how are you different?"
          placeholderTextColor={colors.textTertiary}
          multiline
          numberOfLines={3}
          value={formData.competition}
          onChangeText={(value) => handleInputChange('competition', value)}
        />
      </View>
    </View>
  );

  const renderStep3 = () => (
    <View style={styles.stepContent}>
      <Text style={styles.stepTitle}>Business & Funding</Text>
      <Text style={styles.stepSubtitle}>Tell us about your business model and funding needs</Text>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Business Model *</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="How will you make money?"
          placeholderTextColor={colors.textTertiary}
          multiline
          numberOfLines={3}
          value={formData.businessModel}
          onChangeText={(value) => handleInputChange('businessModel', value)}
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Funding Stage *</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryScroll}>
          {fundingStages.map((stage) => (
            <TouchableOpacity
              key={stage}
              style={[
                styles.categoryButton,
                formData.fundingStage === stage && styles.categoryButtonActive
              ]}
              onPress={() => handleInputChange('fundingStage', stage)}
            >
              <Text style={[
                styles.categoryText,
                formData.fundingStage === stage && styles.categoryTextActive
              ]}>
                {stage}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {formData.fundingStage !== 'Not Seeking Funding' && (
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Funding Goal</Text>
          <View style={styles.inputWithIcon}>
            <DollarSign size={20} color={colors.textSecondary} />
            <TextInput
              style={styles.inputWithIconText}
              placeholder="100000"
              placeholderTextColor={colors.textTertiary}
              value={formData.fundingGoal}
              onChangeText={(value) => handleInputChange('fundingGoal', value)}
              keyboardType="numeric"
            />
          </View>
        </View>
      )}

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Team Size</Text>
        <View style={styles.inputWithIcon}>
          <Users size={20} color={colors.textSecondary} />
          <TextInput
            style={styles.inputWithIconText}
            placeholder="5"
            placeholderTextColor={colors.textTertiary}
            value={formData.teamSize}
            onChangeText={(value) => handleInputChange('teamSize', value)}
            keyboardType="numeric"
          />
        </View>
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Traction</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="What progress have you made? (users, revenue, partnerships, etc.)"
          placeholderTextColor={colors.textTertiary}
          multiline
          numberOfLines={3}
          value={formData.traction}
          onChangeText={(value) => handleInputChange('traction', value)}
        />
      </View>
    </View>
  );

  const renderStep4 = () => (
    <View style={styles.stepContent}>
      <Text style={styles.stepTitle}>Media & Tags</Text>
      <Text style={styles.stepSubtitle}>Add visual content and tags to make your project stand out</Text>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Project Image</Text>
        <TouchableOpacity style={styles.imageUpload} onPress={selectImage}>
          {selectedImage ? (
            <Image source={{ uri: selectedImage }} style={styles.uploadedImage} />
          ) : (
            <View style={styles.uploadPlaceholder}>
              <Upload size={32} color={colors.textSecondary} />
              <Text style={styles.uploadText}>Tap to select image</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>AI-Generated Content</Text>
        <View style={styles.aiContentContainer}>
          <TouchableOpacity
            style={[styles.aiButton, hasAudio && styles.aiButtonActive]}
            onPress={generateAudio}
          >
            <Volume2 size={20} color={hasAudio ? '#FFFFFF' : colors.textSecondary} />
            <Text style={[styles.aiButtonText, hasAudio && styles.aiButtonTextActive]}>
              {hasAudio ? 'Audio Generated' : 'Generate Audio Pitch'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.aiButton, hasVideo && styles.aiButtonActive]}
            onPress={generateVideo}
          >
            <Play size={20} color={hasVideo ? '#FFFFFF' : colors.textSecondary} />
            <Text style={[styles.aiButtonText, hasVideo && styles.aiButtonTextActive]}>
              {hasVideo ? 'Video Generated' : 'Generate Video Intro'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Tags</Text>
        <View style={styles.tagInputContainer}>
          <View style={styles.inputWithIcon}>
            <Tag size={20} color={colors.textSecondary} />
            <TextInput
              style={styles.inputWithIconText}
              placeholder="Add a tag"
              placeholderTextColor={colors.textTertiary}
              value={newTag}
              onChangeText={setNewTag}
              onSubmitEditing={addTag}
            />
          </View>
          <TouchableOpacity style={styles.addTagButton} onPress={addTag}>
            <Text style={styles.addTagText}>Add</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.tagsContainer}>
          {formData.tags.map((tag, index) => (
            <View key={index} style={styles.tag}>
              <Text style={styles.tagText}>{tag}</Text>
              <TouchableOpacity onPress={() => removeTag(tag)}>
                <X size={16} color={colors.textSecondary} />
              </TouchableOpacity>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Elevator Pitch</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Summarize your project in 30 seconds or less"
          placeholderTextColor={colors.textTertiary}
          multiline
          numberOfLines={4}
          value={formData.pitch}
          onChangeText={(value) => handleInputChange('pitch', value)}
        />
      </View>
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
    stepIndicator: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      paddingVertical: 20,
      paddingHorizontal: 20,
    },
    stepContainer: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    stepCircle: {
      width: 32,
      height: 32,
      borderRadius: 16,
      backgroundColor: colors.surface,
      borderWidth: 2,
      borderColor: colors.border,
      justifyContent: 'center',
      alignItems: 'center',
    },
    stepCircleActive: {
      backgroundColor: colors.primary,
      borderColor: colors.primary,
    },
    stepNumber: {
      fontSize: 14,
      fontFamily: 'Inter-Bold',
      color: colors.textSecondary,
    },
    stepNumberActive: {
      color: '#FFFFFF',
    },
    stepLine: {
      width: 40,
      height: 2,
      backgroundColor: colors.border,
      marginHorizontal: 8,
    },
    stepLineActive: {
      backgroundColor: colors.primary,
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
    inputWithIcon: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 12,
      paddingHorizontal: 16,
    },
    inputWithIconText: {
      flex: 1,
      paddingVertical: 16,
      paddingLeft: 12,
      fontSize: 16,
      fontFamily: 'Inter-Regular',
      color: colors.text,
    },
    categoryScroll: {
      marginTop: 8,
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
    imageUpload: {
      height: 200,
      borderRadius: 12,
      borderWidth: 2,
      borderColor: colors.border,
      borderStyle: 'dashed',
      overflow: 'hidden',
    },
    uploadPlaceholder: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    uploadText: {
      fontSize: 16,
      fontFamily: 'Inter-Medium',
      color: colors.textSecondary,
      marginTop: 8,
    },
    uploadedImage: {
      width: '100%',
      height: '100%',
    },
    aiContentContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    aiButton: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 12,
      paddingVertical: 16,
      marginHorizontal: 4,
    },
    aiButtonActive: {
      backgroundColor: colors.success,
      borderColor: colors.success,
    },
    aiButtonText: {
      fontSize: 14,
      fontFamily: 'Inter-Medium',
      color: colors.textSecondary,
      marginLeft: 8,
    },
    aiButtonTextActive: {
      color: '#FFFFFF',
    },
    tagInputContainer: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    addTagButton: {
      backgroundColor: colors.primary,
      paddingHorizontal: 16,
      paddingVertical: 16,
      borderRadius: 12,
      marginLeft: 12,
    },
    addTagText: {
      fontSize: 14,
      fontFamily: 'Inter-SemiBold',
      color: '#FFFFFF',
    },
    tagsContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      marginTop: 12,
    },
    tag: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.primary + '20',
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 16,
      marginRight: 8,
      marginBottom: 8,
    },
    tagText: {
      fontSize: 12,
      fontFamily: 'Inter-Medium',
      color: colors.primary,
      marginRight: 6,
    },
    navigationContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingHorizontal: 20,
      paddingVertical: 20,
      borderTopWidth: 1,
      borderTopColor: colors.border,
    },
    navButton: {
      flex: 1,
      paddingVertical: 16,
      borderRadius: 12,
      alignItems: 'center',
      marginHorizontal: 8,
    },
    prevButton: {
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.border,
    },
    nextButton: {
      backgroundColor: colors.primary,
    },
    navButtonDisabled: {
      opacity: 0.5,
    },
    navButtonText: {
      fontSize: 16,
      fontFamily: 'Inter-SemiBold',
    },
    prevButtonText: {
      color: colors.text,
    },
    nextButtonText: {
      color: '#FFFFFF',
    },
    submitButton: {
      backgroundColor: colors.success,
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
    },
    submitButtonText: {
      color: '#FFFFFF',
      marginRight: 8,
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
        <Text style={styles.headerTitle}>Create Project</Text>
      </View>

      {renderStepIndicator()}

      <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        {currentStep === 1 && renderStep1()}
        {currentStep === 2 && renderStep2()}
        {currentStep === 3 && renderStep3()}
        {currentStep === 4 && renderStep4()}
      </ScrollView>

      <View style={styles.navigationContainer}>
        {currentStep > 1 && (
          <TouchableOpacity
            style={[styles.navButton, styles.prevButton]}
            onPress={prevStep}
          >
            <Text style={[styles.navButtonText, styles.prevButtonText]}>Previous</Text>
          </TouchableOpacity>
        )}

        {currentStep < 4 ? (
          <TouchableOpacity
            style={[
              styles.navButton,
              styles.nextButton,
              !validateStep(currentStep) && styles.navButtonDisabled
            ]}
            onPress={nextStep}
            disabled={!validateStep(currentStep)}
          >
            <Text style={[styles.navButtonText, styles.nextButtonText]}>Next</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={[
              styles.navButton,
              styles.submitButton,
              loading && styles.navButtonDisabled
            ]}
            onPress={handleSubmit}
            disabled={loading}
          >
            <Text style={[styles.navButtonText, styles.submitButtonText]}>
              {loading ? 'Creating...' : 'Create Project'}
            </Text>
            {loading && <ActivityIndicator size="small" color="#FFFFFF" />}
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}