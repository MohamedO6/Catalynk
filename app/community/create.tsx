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
import { ArrowLeft, Tag, X, CircleHelp as HelpCircle, MessageCircle, Lightbulb, Code } from 'lucide-react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';

const categories = [
  'Startup Advice',
  'Technical Help', 
  'Project Showcase',
  'Funding Questions',
  'Technical Discussion',
  'Networking',
  'General Discussion',
  'Tools & Resources',
];

const postTypes = [
  { id: 'question', label: 'Question', icon: HelpCircle, description: 'Ask for help or advice' },
  { id: 'discussion', label: 'Discussion', icon: MessageCircle, description: 'Start a conversation' },
  { id: 'showcase', label: 'Showcase', icon: Lightbulb, description: 'Show off your project' },
  { id: 'help', label: 'Help Needed', icon: Code, description: 'Need technical assistance' },
];

export default function CreatePost() {
  const { colors } = useTheme();
  const { profile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: '',
    type: 'discussion',
    tags: [] as string[],
  });
  const [newTag, setNewTag] = useState('');

  const handleInputChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
  };

  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim()) && formData.tags.length < 5) {
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

  const validateForm = () => {
    if (!formData.title.trim()) {
      Alert.alert('Missing Title', 'Please enter a title for your post.');
      return false;
    }
    if (!formData.content.trim()) {
      Alert.alert('Missing Content', 'Please enter content for your post.');
      return false;
    }
    if (!formData.category) {
      Alert.alert('Missing Category', 'Please select a category for your post.');
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    if (!profile?.id) {
      Alert.alert('Error', 'You must be logged in to create a post.');
      return;
    }

    setLoading(true);

    try {
      const postData = {
        title: formData.title.trim(),
        content: formData.content.trim(),
        category: formData.category,
        author_id: profile.id,
        tags: formData.tags,
        upvotes: 0,
        downvotes: 0,
        comment_count: 0,
        is_pinned: false,
      };

      const { data, error } = await supabase
        .from('community_posts')
        .insert([postData])
        .select()
        .single();

      if (error) {
        console.error('Error creating post:', error);
        Alert.alert('Error', 'Failed to create post. Please try again.');
        return;
      }

      Alert.alert(
        'Post Created!',
        'Your post has been published to the community.',
        [
          {
            text: 'View Post',
            onPress: () => {
              router.replace('/(tabs)/community');
            }
          }
        ]
      );
    } catch (error) {
      console.error('Error:', error);
      Alert.alert('Error', 'Failed to create post. Please try again.');
    } finally {
      setLoading(false);
    }
  };

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
      padding: 20,
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
      marginBottom: 30,
    },
    sectionTitle: {
      fontSize: 18,
      fontFamily: 'Inter-Bold',
      color: colors.text,
      marginBottom: 12,
    },
    postTypesContainer: {
      marginBottom: 24,
    },
    postTypeGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      marginTop: 8,
    },
    postTypeButton: {
      backgroundColor: colors.surface,
      paddingHorizontal: 16,
      paddingVertical: 12,
      borderRadius: 12,
      marginRight: 12,
      marginBottom: 12,
      borderWidth: 1,
      borderColor: colors.border,
      flexDirection: 'row',
      alignItems: 'center',
      minWidth: '45%',
    },
    postTypeButtonActive: {
      backgroundColor: colors.primary,
      borderColor: colors.primary,
    },
    postTypeIcon: {
      marginRight: 8,
    },
    postTypeText: {
      fontSize: 14,
      fontFamily: 'Inter-Medium',
      color: colors.text,
    },
    postTypeTextActive: {
      color: '#FFFFFF',
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
      height: 120,
      textAlignVertical: 'top',
    },
    categoryContainer: {
      marginBottom: 24,
    },
    categoryGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      marginTop: 8,
    },
    categoryButton: {
      backgroundColor: colors.surface,
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderRadius: 20,
      marginRight: 12,
      marginBottom: 12,
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
    tagInputContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 12,
    },
    tagInput: {
      flex: 1,
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 12,
      paddingVertical: 12,
      paddingHorizontal: 16,
      fontSize: 16,
      fontFamily: 'Inter-Regular',
      color: colors.text,
      marginRight: 12,
    },
    addTagButton: {
      backgroundColor: colors.primary,
      paddingHorizontal: 16,
      paddingVertical: 12,
      borderRadius: 12,
    },
    addTagText: {
      fontSize: 14,
      fontFamily: 'Inter-SemiBold',
      color: '#FFFFFF',
    },
    tagsContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
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
    submitButton: {
      backgroundColor: colors.primary,
      paddingVertical: 18,
      borderRadius: 12,
      alignItems: 'center',
      marginTop: 20,
      flexDirection: 'row',
      justifyContent: 'center',
    },
    submitButtonDisabled: {
      opacity: 0.6,
    },
    submitButtonText: {
      fontSize: 18,
      fontFamily: 'Inter-SemiBold',
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
        <Text style={styles.headerTitle}>Create Post</Text>
      </View>

      <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Share with the Community</Text>
        <Text style={styles.subtitle}>
          Ask questions, share insights, or showcase your projects
        </Text>

        <View style={styles.postTypesContainer}>
          <Text style={styles.sectionTitle}>Post Type</Text>
          <View style={styles.postTypeGrid}>
            {postTypes.map((type) => {
              const Icon = type.icon;
              return (
                <TouchableOpacity
                  key={type.id}
                  style={[
                    styles.postTypeButton,
                    formData.type === type.id && styles.postTypeButtonActive,
                  ]}
                  onPress={() => handleInputChange('type', type.id)}
                >
                  <Icon 
                    size={16} 
                    color={formData.type === type.id ? '#FFFFFF' : colors.text}
                    style={styles.postTypeIcon}
                  />
                  <Text
                    style={[
                      styles.postTypeText,
                      formData.type === type.id && styles.postTypeTextActive,
                    ]}
                  >
                    {type.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Title *</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter a descriptive title"
            placeholderTextColor={colors.textTertiary}
            value={formData.title}
            onChangeText={(value) => handleInputChange('title', value)}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Content *</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Share your thoughts, questions, or insights..."
            placeholderTextColor={colors.textTertiary}
            multiline
            value={formData.content}
            onChangeText={(value) => handleInputChange('content', value)}
          />
        </View>

        <View style={styles.categoryContainer}>
          <Text style={styles.label}>Category *</Text>
          <View style={styles.categoryGrid}>
            {categories.map((category) => (
              <TouchableOpacity
                key={category}
                style={[
                  styles.categoryButton,
                  formData.category === category && styles.categoryButtonActive,
                ]}
                onPress={() => handleInputChange('category', category)}
              >
                <Text
                  style={[
                    styles.categoryText,
                    formData.category === category && styles.categoryTextActive,
                  ]}
                >
                  {category}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Tags (Optional)</Text>
          <View style={styles.tagInputContainer}>
            <TextInput
              style={styles.tagInput}
              placeholder="Add a tag"
              placeholderTextColor={colors.textTertiary}
              value={newTag}
              onChangeText={setNewTag}
              onSubmitEditing={addTag}
            />
            <TouchableOpacity style={styles.addTagButton} onPress={addTag}>
              <Text style={styles.addTagText}>Add</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.tagsContainer}>
            {formData.tags.map((tag, index) => (
              <View key={index} style={styles.tag}>
                <Text style={styles.tagText}>#{tag}</Text>
                <TouchableOpacity onPress={() => removeTag(tag)}>
                  <X size={16} color={colors.primary} />
                </TouchableOpacity>
              </View>
            ))}
          </View>
        </View>

        <TouchableOpacity
          style={[
            styles.submitButton,
            loading && styles.submitButtonDisabled,
          ]}
          onPress={handleSubmit}
          disabled={loading}
        >
          <Text style={styles.submitButtonText}>
            {loading ? 'Publishing...' : 'Publish Post'}
          </Text>
          {loading && <ActivityIndicator size="small" color="#FFFFFF" />}
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}