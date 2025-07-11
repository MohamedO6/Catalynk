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
  Modal,
} from 'react-native';
import { router } from 'expo-router';
import { ArrowLeft, Upload, Tag, DollarSign, Users, MapPin, Link, X, CircleCheck as CheckCircle, Trash2, FileText, Eye } from 'lucide-react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import * as DocumentPicker from 'expo-document-picker';
import * as ImagePicker from 'expo-image-picker';

const categories = [
  'FinTech', 'HealthTech', 'EdTech', 'CleanTech', 'AI/ML', 'Blockchain',
  'E-commerce', 'SaaS', 'Mobile Apps', 'IoT', 'Gaming', 'Social Media',
  'Marketplace', 'Sustainability', 'Food & Beverage', 'Travel', 'Real Estate', 'Other'
];

const fundingStages = [
  'Pre-Seed', 'Seed', 'Series A', 'Series B', 'Series C+', 'Growth', 'Not Seeking Funding'
];

interface UploadedFile {
  uri: string;
  name: string;
  type: string;
  size?: number;
}

export default function CreateProject() {
  const { colors } = useTheme();
  const { profile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
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
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [previewFile, setPreviewFile] = useState<UploadedFile | null>(null);
  const [showPreview, setShowPreview] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }

    // Apply field-specific validation
    let processedValue = value;

    switch (field) {
      case 'fundingGoal':
      case 'teamSize':
        // Only allow numbers
        processedValue = value.replace(/[^0-9]/g, '');
        break;
      case 'website':
        // Basic URL validation
        if (value && !isValidUrl(value)) {
          setErrors(prev => ({ ...prev, [field]: 'Please enter a valid URL (e.g., https://example.com)' }));
        }
        break;
      case 'title':
        // Limit to 100 characters
        if (value.length > 100) {
          setErrors(prev => ({ ...prev, [field]: 'Title must be 100 characters or less' }));
          return; // Don't update if over limit
        }
        break;
      case 'description':
        // Limit to 500 characters
        if (value.length > 500) {
          setErrors(prev => ({ ...prev, [field]: 'Description must be 500 characters or less' }));
          return; // Don't update if over limit
        }
        break;
      case 'problem':
      case 'solution':
      case 'market':
      case 'businessModel':
        // Limit to 1000 characters
        if (value.length > 1000) {
          setErrors(prev => ({ ...prev, [field]: 'This field must be 1000 characters or less' }));
          return; // Don't update if over limit
        }
        break;
      case 'competition':
      case 'traction':
      case 'pitch':
        // Limit to 800 characters
        if (value.length > 800) {
          setErrors(prev => ({ ...prev, [field]: 'This field must be 800 characters or less' }));
          return; // Don't update if over limit
        }
        break;
    }

    setFormData({ ...formData, [field]: processedValue });
  };

  const isValidUrl = (url: string): boolean => {
    try {
      const urlPattern = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;
      return urlPattern.test(url);
    } catch {
      return false;
    }
  };

  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim()) && formData.tags.length < 10) {
      if (newTag.trim().length > 20) {
        Alert.alert('Tag too long', 'Tags must be 20 characters or less');
        return;
      }
      setFormData({
        ...formData,
        tags: [...formData.tags, newTag.trim()]
      });
      setNewTag('');
    } else if (formData.tags.length >= 10) {
      Alert.alert('Too many tags', 'You can add up to 10 tags only');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter(tag => tag !== tagToRemove)
    });
  };

  const selectImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [16, 9],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        setSelectedImage(result.assets[0].uri);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to select image. Please try again.');
    }
  };

  const uploadFile = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['image/*', 'application/pdf', 'text/*', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
        copyToCacheDirectory: true,
        multiple: false,
      });

      if (!result.canceled && result.assets[0]) {
        const file = result.assets[0];
        const newFile: UploadedFile = {
          uri: file.uri,
          name: file.name,
          type: file.mimeType || 'application/octet-stream',
          size: file.size,
        };
        
        setUploadedFiles(prev => [...prev, newFile]);
        Alert.alert('File Uploaded', `Successfully uploaded: ${file.name}`);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to select file. Please try again.');
    }
  };

  const removeFile = (index: number) => {
    Alert.alert(
      'Remove File',
      'Are you sure you want to remove this file?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Remove', 
          style: 'destructive',
          onPress: () => {
            setUploadedFiles(prev => prev.filter((_, i) => i !== index));
          }
        }
      ]
    );
  };

  const handlePreviewFile = (file: UploadedFile) => {
    setPreviewFile(file);
    setShowPreview(true);
  };

  const validateStep = (step: number) => {
    const newErrors: Record<string, string> = {};

    switch (step) {
      case 1:
        if (!formData.title.trim()) {
          newErrors.title = 'Project title is required';
        } else if (formData.title.length < 5) {
          newErrors.title = 'Title must be at least 5 characters';
        }
        
        if (!formData.description.trim()) {
          newErrors.description = 'Description is required';
        } else if (formData.description.length < 20) {
          newErrors.description = 'Description must be at least 20 characters';
        }
        
        if (!formData.category) {
          newErrors.category = 'Please select a category';
        }

        if (formData.website && !isValidUrl(formData.website)) {
          newErrors.website = 'Please enter a valid URL';
        }
        break;

      case 2:
        if (!formData.problem.trim()) {
          newErrors.problem = 'Problem statement is required';
        } else if (formData.problem.length < 50) {
          newErrors.problem = 'Problem statement must be at least 50 characters';
        }
        
        if (!formData.solution.trim()) {
          newErrors.solution = 'Solution description is required';
        } else if (formData.solution.length < 50) {
          newErrors.solution = 'Solution description must be at least 50 characters';
        }
        
        if (!formData.market.trim()) {
          newErrors.market = 'Target market description is required';
        } else if (formData.market.length < 30) {
          newErrors.market = 'Market description must be at least 30 characters';
        }
        break;

      case 3:
        if (!formData.businessModel.trim()) {
          newErrors.businessModel = 'Business model is required';
        } else if (formData.businessModel.length < 30) {
          newErrors.businessModel = 'Business model must be at least 30 characters';
        }
        
        if (!formData.fundingStage) {
          newErrors.fundingStage = 'Please select a funding stage';
        }

        if (formData.fundingStage !== 'Not Seeking Funding' && formData.fundingGoal) {
          const goal = parseInt(formData.fundingGoal);
          if (goal < 1000) {
            newErrors.fundingGoal = 'Funding goal must be at least $1,000';
          } else if (goal > 100000000) {
            newErrors.fundingGoal = 'Funding goal cannot exceed $100,000,000';
          }
        }

        if (formData.teamSize) {
          const size = parseInt(formData.teamSize);
          if (size < 1) {
            newErrors.teamSize = 'Team size must be at least 1';
          } else if (size > 1000) {
            newErrors.teamSize = 'Team size cannot exceed 1,000';
          }
        }
        break;

      case 4:
        // Step 4 is optional, no validation needed
        break;
    }

    return newErrors;
  };

  const isStepValid = (step: number) => {
    const validationErrors = validateStep(step);
    return Object.keys(validationErrors).length === 0;
  };

  const nextStep = () => {
    const validationErrors = validateStep(currentStep);
    if (Object.keys(validationErrors).length === 0) {
      setCurrentStep(prev => Math.min(prev + 1, 4));
      setErrors({}); // Clear any existing errors
    } else {
      setErrors(validationErrors);
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
    setErrors({}); // Clear errors when going back
  };

  const handleSubmit = async () => {
    // Prevent multiple submissions
    if (loading) return;

    // Final validation before submission
    const allErrors: Record<string, string> = {};
    
    // Validate all steps
    for (let step = 1; step <= 3; step++) {
      const stepErrors = validateStep(step);
      Object.assign(allErrors, stepErrors);
    }

    if (Object.keys(allErrors).length > 0) {
      setErrors(allErrors);
      Alert.alert('Validation Error', 'Please fix the errors in your form before submitting.');
      return;
    }

    if (!profile?.id) {
      Alert.alert('Error', 'You must be logged in to create a project.');
      return;
    }

    setLoading(true);
    
    try {
      const projectData = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        category: formData.category,
        founder_id: profile.id,
        funding_goal: formData.fundingGoal ? parseFloat(formData.fundingGoal) : 0,
        current_funding: 0,
        funding_stage: formData.fundingStage,
        team_size: formData.teamSize ? parseInt(formData.teamSize) : 1,
        location: formData.location.trim() || null,
        website: formData.website.trim() || null,
        tags: formData.tags,
        image_url: selectedImage,
        has_audio: false,
        has_video: false,
        problem: formData.problem.trim(),
        solution: formData.solution.trim(),
        market: formData.market.trim(),
        competition: formData.competition.trim() || null,
        business_model: formData.businessModel.trim(),
        traction: formData.traction.trim() || null,
        pitch: formData.pitch.trim() || null,
        status: 'active',
      };

      console.log('Submitting project data:', projectData);

      const { data, error } = await supabase
        .from('projects')
        .insert([projectData])
        .select()
        .single();

      if (error) {
        console.error('Supabase error creating project:', error);
        Alert.alert('Database Error', `Failed to create project: ${error.message}`);
        return;
      }

      console.log('Project created successfully:', data);

      // Show success modal
      setShowSuccessModal(true);
      
      // Auto-redirect after 3 seconds
      setTimeout(() => {
        setShowSuccessModal(false);
        router.replace('/(tabs)/projects');
      }, 3000);

    } catch (error) {
      console.error('Unexpected error:', error);
      Alert.alert('Error', 'An unexpected error occurred. Please try again.');
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

  const renderError = (field: string) => {
    if (errors[field]) {
      return <Text style={styles.errorText}>{errors[field]}</Text>;
    }
    return null;
  };

  const renderCharacterCount = (field: string, maxLength: number) => {
    const currentLength = formData[field as keyof typeof formData]?.toString().length || 0;
    return (
      <Text style={[
        styles.characterCount,
        currentLength > maxLength * 0.9 && styles.characterCountWarning,
        currentLength >= maxLength && styles.characterCountError
      ]}>
        {currentLength}/{maxLength}
      </Text>
    );
  };

  const getFileIcon = (type: string) => {
    if (type.startsWith('image/')) return '🖼️';
    if (type === 'application/pdf') return '📄';
    if (type.includes('word') || type.includes('document')) return '📝';
    if (type.includes('text')) return '📄';
    return '📎';
  };

  const renderFilePreview = () => {
    if (!previewFile) return null;

    return (
      <Modal
        visible={showPreview}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowPreview(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.previewModal}>
            <View style={styles.previewHeader}>
              <Text style={styles.previewTitle}>{previewFile.name}</Text>
              <TouchableOpacity onPress={() => setShowPreview(false)}>
                <X size={24} color={colors.text} />
              </TouchableOpacity>
            </View>
            
            <View style={styles.previewContent}>
              {previewFile.type.startsWith('image/') ? (
                <Image source={{ uri: previewFile.uri }} style={styles.previewImage} />
              ) : previewFile.type === 'application/pdf' ? (
                <View style={styles.pdfPreview}>
                  <FileText size={64} color={colors.textSecondary} />
                  <Text style={styles.pdfText}>PDF Document</Text>
                  <Text style={styles.pdfSubtext}>
                    {previewFile.size ? `${Math.round(previewFile.size / 1024)} KB` : 'Unknown size'}
                  </Text>
                </View>
              ) : (
                <View style={styles.filePreview}>
                  <Text style={styles.fileIcon}>{getFileIcon(previewFile.type)}</Text>
                  <Text style={styles.fileName}>{previewFile.name}</Text>
                  <Text style={styles.fileType}>{previewFile.type}</Text>
                  <Text style={styles.fileSize}>
                    {previewFile.size ? `${Math.round(previewFile.size / 1024)} KB` : 'Unknown size'}
                  </Text>
                </View>
              )}
            </View>
          </View>
        </View>
      </Modal>
    );
  };

  const renderSuccessModal = () => (
    <Modal
      visible={showSuccessModal}
      transparent={true}
      animationType="fade"
    >
      <View style={styles.modalOverlay}>
        <View style={styles.successModal}>
          <CheckCircle size={64} color={colors.success} />
          <Text style={styles.successTitle}>Project Created Successfully!</Text>
          <Text style={styles.successMessage}>
            Your project has been submitted and is now live on the platform. 
            You'll be redirected to the projects feed shortly.
          </Text>
          <View style={styles.successLoader}>
            <ActivityIndicator size="small" color={colors.primary} />
            <Text style={styles.successLoaderText}>Redirecting...</Text>
          </View>
        </View>
      </View>
    </Modal>
  );

  const renderStep1 = () => (
    <View style={styles.stepContent}>
      <Text style={styles.stepTitle}>Basic Information</Text>
      <Text style={styles.stepSubtitle}>Tell us about your project</Text>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Project Title * (5-100 characters)</Text>
        <TextInput
          style={[styles.input, errors.title && styles.inputError]}
          placeholder="Enter your project title"
          placeholderTextColor={colors.textTertiary}
          value={formData.title}
          onChangeText={(value) => handleInputChange('title', value)}
          maxLength={100}
        />
        {renderCharacterCount('title', 100)}
        {renderError('title')}
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Short Description * (20-500 characters)</Text>
        <TextInput
          style={[styles.input, styles.textArea, errors.description && styles.inputError]}
          placeholder="Briefly describe your project in 1-2 sentences"
          placeholderTextColor={colors.textTertiary}
          multiline
          numberOfLines={3}
          value={formData.description}
          onChangeText={(value) => handleInputChange('description', value)}
          maxLength={500}
        />
        {renderCharacterCount('description', 500)}
        {renderError('description')}
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
        {renderError('category')}
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
            maxLength={100}
          />
        </View>
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Website/Demo URL</Text>
        <View style={styles.inputWithIcon}>
          <Link size={20} color={colors.textSecondary} />
          <TextInput
            style={[styles.inputWithIconText, errors.website && styles.inputError]}
            placeholder="https://yourproject.com"
            placeholderTextColor={colors.textTertiary}
            value={formData.website}
            onChangeText={(value) => handleInputChange('website', value)}
            autoCapitalize="none"
            keyboardType="url"
          />
        </View>
        {renderError('website')}
      </View>
    </View>
  );

  const renderStep2 = () => (
    <View style={styles.stepContent}>
      <Text style={styles.stepTitle}>Project Details</Text>
      <Text style={styles.stepSubtitle}>Describe your project in detail</Text>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Problem Statement * (50-1000 characters)</Text>
        <TextInput
          style={[styles.input, styles.textArea, errors.problem && styles.inputError]}
          placeholder="What problem are you solving?"
          placeholderTextColor={colors.textTertiary}
          multiline
          numberOfLines={4}
          value={formData.problem}
          onChangeText={(value) => handleInputChange('problem', value)}
          maxLength={1000}
        />
        {renderCharacterCount('problem', 1000)}
        {renderError('problem')}
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Solution * (50-1000 characters)</Text>
        <TextInput
          style={[styles.input, styles.textArea, errors.solution && styles.inputError]}
          placeholder="How does your project solve this problem?"
          placeholderTextColor={colors.textTertiary}
          multiline
          numberOfLines={4}
          value={formData.solution}
          onChangeText={(value) => handleInputChange('solution', value)}
          maxLength={1000}
        />
        {renderCharacterCount('solution', 1000)}
        {renderError('solution')}
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Target Market * (30-1000 characters)</Text>
        <TextInput
          style={[styles.input, styles.textArea, errors.market && styles.inputError]}
          placeholder="Who is your target audience?"
          placeholderTextColor={colors.textTertiary}
          multiline
          numberOfLines={3}
          value={formData.market}
          onChangeText={(value) => handleInputChange('market', value)}
          maxLength={1000}
        />
        {renderCharacterCount('market', 1000)}
        {renderError('market')}
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Competition Analysis (up to 800 characters)</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Who are your competitors and how are you different?"
          placeholderTextColor={colors.textTertiary}
          multiline
          numberOfLines={3}
          value={formData.competition}
          onChangeText={(value) => handleInputChange('competition', value)}
          maxLength={800}
        />
        {renderCharacterCount('competition', 800)}
      </View>
    </View>
  );

  const renderStep3 = () => (
    <View style={styles.stepContent}>
      <Text style={styles.stepTitle}>Business & Funding</Text>
      <Text style={styles.stepSubtitle}>Tell us about your business model and funding needs</Text>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Business Model * (30-1000 characters)</Text>
        <TextInput
          style={[styles.input, styles.textArea, errors.businessModel && styles.inputError]}
          placeholder="How will you make money?"
          placeholderTextColor={colors.textTertiary}
          multiline
          numberOfLines={3}
          value={formData.businessModel}
          onChangeText={(value) => handleInputChange('businessModel', value)}
          maxLength={1000}
        />
        {renderCharacterCount('businessModel', 1000)}
        {renderError('businessModel')}
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
        {renderError('fundingStage')}
      </View>

      {formData.fundingStage !== 'Not Seeking Funding' && (
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Funding Goal ($1,000 - $100,000,000)</Text>
          <View style={styles.inputWithIcon}>
            <DollarSign size={20} color={colors.textSecondary} />
            <TextInput
              style={[styles.inputWithIconText, errors.fundingGoal && styles.inputError]}
              placeholder="100000"
              placeholderTextColor={colors.textTertiary}
              value={formData.fundingGoal}
              onChangeText={(value) => handleInputChange('fundingGoal', value)}
              keyboardType="numeric"
            />
          </View>
          {renderError('fundingGoal')}
        </View>
      )}

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Team Size (1-1000)</Text>
        <View style={styles.inputWithIcon}>
          <Users size={20} color={colors.textSecondary} />
          <TextInput
            style={[styles.inputWithIconText, errors.teamSize && styles.inputError]}
            placeholder="5"
            placeholderTextColor={colors.textTertiary}
            value={formData.teamSize}
            onChangeText={(value) => handleInputChange('teamSize', value)}
            keyboardType="numeric"
          />
        </View>
        {renderError('teamSize')}
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Traction (up to 800 characters)</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="What progress have you made? (users, revenue, partnerships, etc.)"
          placeholderTextColor={colors.textTertiary}
          multiline
          numberOfLines={3}
          value={formData.traction}
          onChangeText={(value) => handleInputChange('traction', value)}
          maxLength={800}
        />
        {renderCharacterCount('traction', 800)}
      </View>
    </View>
  );

  const renderStep4 = () => (
    <View style={styles.stepContent}>
      <Text style={styles.stepTitle}>Media & Files</Text>
      <Text style={styles.stepSubtitle}>Add visual content and files to make your project stand out</Text>

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
        <Text style={styles.label}>Upload Files (PDFs, Documents, Images)</Text>
        <TouchableOpacity style={styles.fileUploadButton} onPress={uploadFile}>
          <Upload size={20} color={colors.text} />
          <Text style={styles.fileUploadText}>Upload Documents, PDFs, or Images</Text>
        </TouchableOpacity>
        
        {uploadedFiles.length > 0 && (
          <View style={styles.filesContainer}>
            {uploadedFiles.map((file, index) => (
              <View key={index} style={styles.fileItem}>
                <View style={styles.fileInfo}>
                  <Text style={styles.fileIcon}>{getFileIcon(file.type)}</Text>
                  <View style={styles.fileDetails}>
                    <Text style={styles.fileName} numberOfLines={1}>{file.name}</Text>
                    <Text style={styles.fileSize}>
                      {file.size ? Math.round(file.size / 1024) + ' KB' : 'Unknown size'}
                    </Text>
                  </View>
                </View>
                <View style={styles.fileActions}>
                  <TouchableOpacity 
                    style={styles.fileActionButton}
                    onPress={() => handlePreviewFile(file)}
                  >
                    <Eye size={16} color={colors.primary} />
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={styles.fileActionButton}
                    onPress={() => removeFile(index)}
                  >
                    <Trash2 size={16} color={colors.error} />
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        )}
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Tags (up to 10 tags, max 20 characters each)</Text>
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
              maxLength={20}
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
        <Text style={styles.label}>Elevator Pitch (up to 800 characters)</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Summarize your project in 30 seconds or less"
          placeholderTextColor={colors.textTertiary}
          multiline
          numberOfLines={4}
          value={formData.pitch}
          onChangeText={(value) => handleInputChange('pitch', value)}
          maxLength={800}
        />
        {renderCharacterCount('pitch', 800)}
      </View>
    </View>
  );

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    scrollContainer: {
      flexGrow: 1,
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
    inputError: {
      borderColor: colors.error,
    },
    textArea: {
      height: 100,
      textAlignVertical: 'top',
    },
    errorText: {
      fontSize: 14,
      fontFamily: 'Inter-Medium',
      color: colors.error,
      marginTop: 4,
    },
    characterCount: {
      fontSize: 12,
      fontFamily: 'Inter-Regular',
      color: colors.textTertiary,
      textAlign: 'right',
      marginTop: 4,
    },
    characterCountWarning: {
      color: colors.warning,
    },
    characterCountError: {
      color: colors.error,
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
    fileUploadButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 12,
      paddingVertical: 16,
    },
    fileUploadText: {
      fontSize: 16,
      fontFamily: 'Inter-Medium',
      color: colors.text,
      marginLeft: 8,
    },
    filesContainer: {
      marginTop: 12,
    },
    fileItem: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      backgroundColor: colors.surface,
      borderRadius: 8,
      padding: 12,
      marginBottom: 8,
    },
    fileInfo: {
      flexDirection: 'row',
      alignItems: 'center',
      flex: 1,
    },
    fileIcon: {
      fontSize: 20,
      marginRight: 12,
    },
    fileDetails: {
      flex: 1,
    },
    fileName: {
      fontSize: 14,
      fontFamily: 'Inter-Medium',
      color: colors.text,
    },
    fileSize: {
      fontSize: 12,
      fontFamily: 'Inter-Regular',
      color: colors.textSecondary,
    },
    fileActions: {
      flexDirection: 'row',
    },
    fileActionButton: {
      padding: 8,
      marginLeft: 4,
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
      backgroundColor: colors.background,
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
    modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    previewModal: {
      backgroundColor: colors.card,
      borderRadius: 16,
      margin: 20,
      maxHeight: '80%',
      maxWidth: '90%',
      minWidth: 300,
    },
    previewHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: 20,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    previewTitle: {
      fontSize: 18,
      fontFamily: 'Inter-Bold',
      color: colors.text,
      flex: 1,
      marginRight: 16,
    },
    previewContent: {
      padding: 20,
      alignItems: 'center',
    },
    previewImage: {
      width: 250,
      height: 200,
      borderRadius: 8,
    },
    pdfPreview: {
      alignItems: 'center',
      padding: 40,
    },
    pdfText: {
      fontSize: 18,
      fontFamily: 'Inter-Bold',
      color: colors.text,
      marginTop: 16,
    },
    pdfSubtext: {
      fontSize: 14,
      fontFamily: 'Inter-Regular',
      color: colors.textSecondary,
      marginTop: 8,
    },
    filePreview: {
      alignItems: 'center',
      padding: 40,
    },
    fileType: {
      fontSize: 14,
      fontFamily: 'Inter-Regular',
      color: colors.textSecondary,
      marginTop: 8,
    },
    successModal: {
      backgroundColor: colors.card,
      borderRadius: 20,
      padding: 32,
      margin: 20,
      alignItems: 'center',
      maxWidth: 350,
    },
    successTitle: {
      fontSize: 24,
      fontFamily: 'Inter-Bold',
      color: colors.text,
      textAlign: 'center',
      marginTop: 16,
      marginBottom: 12,
    },
    successMessage: {
      fontSize: 16,
      fontFamily: 'Inter-Regular',
      color: colors.textSecondary,
      textAlign: 'center',
      lineHeight: 22,
      marginBottom: 24,
    },
    successLoader: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    successLoaderText: {
      fontSize: 14,
      fontFamily: 'Inter-Medium',
      color: colors.primary,
      marginLeft: 8,
    },
  });

  return (
    <View style={styles.container}>
      <ScrollView 
        style={styles.container}
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
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
              !isStepValid(currentStep) && styles.navButtonDisabled
            ]}
            onPress={nextStep}
            disabled={!isStepValid(currentStep)}
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

      {renderFilePreview()}
      {renderSuccessModal()}
    </View>
  );
}