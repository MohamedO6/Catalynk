import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  KeyboardAvoidingView,
  Platform,
  RefreshControl,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { ArrowLeft, Send, Phone, Video, MoveHorizontal as MoreHorizontal } from 'lucide-react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';

interface Message {
  id: string;
  content: string;
  sender_id: string;
  timestamp: string;
  is_own: boolean;
}

interface Conversation {
  id: string;
  participant_1: string;
  participant_2: string;
  last_message_at: string;
}

export default function MessagingScreen() {
  const { colors } = useTheme();
  const { profile } = useAuth();
  const { id: recipientId } = useLocalSearchParams();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [recipientName, setRecipientName] = useState('User');
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (profile?.id && recipientId) {
      initializeConversation();
    }
  }, [profile?.id, recipientId]);

  const initializeConversation = async () => {
    if (!profile?.id || !recipientId) return;

    try {
      // Get recipient info
      const { data: recipientData } = await supabase
        .from('profiles')
        .select('full_name')
        .eq('id', recipientId)
        .single();

      if (recipientData) {
        setRecipientName(recipientData.full_name);
      }

      // Find or create conversation
      let { data: conversation } = await supabase
        .from('conversations')
        .select('*')
        .or(`and(participant_1.eq.${profile.id},participant_2.eq.${recipientId}),and(participant_1.eq.${recipientId},participant_2.eq.${profile.id})`)
        .single();

      if (!conversation) {
        // Create new conversation
        const { data: newConversation, error } = await supabase
          .from('conversations')
          .insert({
            participant_1: profile.id,
            participant_2: recipientId,
          })
          .select()
          .single();

        if (error) {
          console.error('Error creating conversation:', error);
          Alert.alert('Error', 'Failed to start conversation');
          return;
        }
        conversation = newConversation;
      }

      setConversationId(conversation.id);
      await loadMessages(conversation.id);
    } catch (error) {
      console.error('Error initializing conversation:', error);
      // Load mock messages for demo
      loadMockMessages();
    } finally {
      setLoading(false);
    }
  };

  const loadMessages = async (convId: string) => {
    try {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('conversation_id', convId)
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Error loading messages:', error);
        return;
      }

      const formattedMessages = data.map(msg => ({
        id: msg.id,
        content: msg.content,
        sender_id: msg.sender_id,
        timestamp: new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        is_own: msg.sender_id === profile?.id,
      }));

      setMessages(formattedMessages);
    } catch (error) {
      console.error('Error loading messages:', error);
      loadMockMessages();
    }
  };

  const loadMockMessages = () => {
    const mockMessages: Message[] = [
      {
        id: '1',
        content: 'Hi! I saw your project and I\'m really interested in collaborating.',
        sender_id: 'other',
        timestamp: '10:30 AM',
        is_own: false,
      },
      {
        id: '2',
        content: 'That sounds great! What\'s your background?',
        sender_id: 'me',
        timestamp: '10:32 AM',
        is_own: true,
      },
      {
        id: '3',
        content: 'I\'m a full-stack developer with 5 years of experience in React and Node.js. I\'ve worked on several fintech projects.',
        sender_id: 'other',
        timestamp: '10:35 AM',
        is_own: false,
      },
      {
        id: '4',
        content: 'Perfect! We\'re looking for someone with exactly that skillset. Would you like to schedule a call to discuss further?',
        sender_id: 'me',
        timestamp: '10:37 AM',
        is_own: true,
      },
    ];
    setMessages(mockMessages);
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !profile?.id) return;

    const tempMessage: Message = {
      id: Date.now().toString(),
      content: newMessage.trim(),
      sender_id: profile.id,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      is_own: true,
    };

    setMessages(prev => [...prev, tempMessage]);
    const messageContent = newMessage.trim();
    setNewMessage('');

    try {
      if (conversationId) {
        const { error } = await supabase
          .from('messages')
          .insert({
            conversation_id: conversationId,
            sender_id: profile.id,
            content: messageContent,
          });

        if (error) {
          console.error('Error sending message:', error);
          Alert.alert('Error', 'Failed to send message');
          // Remove the temp message on error
          setMessages(prev => prev.filter(msg => msg.id !== tempMessage.id));
        }
      }
    } catch (error) {
      console.error('Error sending message:', error);
      // Simulate response for demo
      setTimeout(() => {
        const response: Message = {
          id: (Date.now() + 1).toString(),
          content: 'Thanks for your message! I\'ll get back to you soon.',
          sender_id: 'other',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          is_own: false,
        };
        setMessages(prev => [...prev, response]);
      }, 1000);
    }
  };

  const handleCall = () => {
    Alert.alert('Voice Call', 'Voice calling feature coming soon!');
  };

  const handleVideoCall = () => {
    Alert.alert('Video Call', 'Video calling feature coming soon!');
  };

  const handleMore = () => {
    Alert.alert('More Options', 'Additional options coming soon!');
  };

  const onRefresh = () => {
    setRefreshing(true);
    if (conversationId) {
      loadMessages(conversationId);
    }
    setTimeout(() => setRefreshing(false), 1000);
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 20,
      paddingTop: 60,
      paddingBottom: 20,
      backgroundColor: colors.card,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    headerLeft: {
      flexDirection: 'row',
      alignItems: 'center',
      flex: 1,
    },
    backButton: {
      marginRight: 16,
    },
    headerInfo: {
      flex: 1,
    },
    recipientName: {
      fontSize: 18,
      fontFamily: 'Inter-Bold',
      color: colors.text,
    },
    onlineStatus: {
      fontSize: 14,
      fontFamily: 'Inter-Medium',
      color: colors.success,
    },
    headerActions: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    actionButton: {
      padding: 8,
      marginLeft: 8,
    },
    messagesContainer: {
      flex: 1,
      paddingHorizontal: 20,
      paddingVertical: 16,
    },
    messageContainer: {
      marginBottom: 16,
    },
    ownMessage: {
      alignItems: 'flex-end',
    },
    otherMessage: {
      alignItems: 'flex-start',
    },
    messageBubble: {
      maxWidth: '80%',
      paddingHorizontal: 16,
      paddingVertical: 12,
      borderRadius: 20,
    },
    ownMessageBubble: {
      backgroundColor: colors.primary,
    },
    otherMessageBubble: {
      backgroundColor: colors.surface,
    },
    messageText: {
      fontSize: 16,
      fontFamily: 'Inter-Regular',
      lineHeight: 22,
    },
    ownMessageText: {
      color: '#FFFFFF',
    },
    otherMessageText: {
      color: colors.text,
    },
    messageTime: {
      fontSize: 12,
      fontFamily: 'Inter-Regular',
      color: colors.textTertiary,
      marginTop: 4,
    },
    inputContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 20,
      paddingVertical: 16,
      backgroundColor: colors.card,
      borderTopWidth: 1,
      borderTopColor: colors.border,
    },
    messageInput: {
      flex: 1,
      backgroundColor: colors.surface,
      borderRadius: 20,
      paddingHorizontal: 16,
      paddingVertical: 12,
      fontSize: 16,
      fontFamily: 'Inter-Regular',
      color: colors.text,
      marginRight: 12,
      maxHeight: 100,
    },
    sendButton: {
      backgroundColor: colors.primary,
      width: 44,
      height: 44,
      borderRadius: 22,
      justifyContent: 'center',
      alignItems: 'center',
    },
    sendButtonDisabled: {
      opacity: 0.5,
    },
    loadingText: {
      fontSize: 16,
      fontFamily: 'Inter-Medium',
      color: colors.textSecondary,
      textAlign: 'center',
      marginTop: 100,
    },
  });

  if (loading) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <ArrowLeft size={24} color={colors.text} />
          </TouchableOpacity>
        </View>
        <Text style={styles.loadingText}>Loading conversation...</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <ArrowLeft size={24} color={colors.text} />
          </TouchableOpacity>
          <View style={styles.headerInfo}>
            <Text style={styles.recipientName}>{recipientName}</Text>
            <Text style={styles.onlineStatus}>Online</Text>
          </View>
        </View>
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.actionButton} onPress={handleCall}>
            <Phone size={20} color={colors.text} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton} onPress={handleVideoCall}>
            <Video size={20} color={colors.text} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton} onPress={handleMore}>
            <MoreHorizontal size={20} color={colors.text} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView 
        style={styles.messagesContainer}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {messages.map((message) => (
          <View
            key={message.id}
            style={[
              styles.messageContainer,
              message.is_own ? styles.ownMessage : styles.otherMessage,
            ]}
          >
            <View
              style={[
                styles.messageBubble,
                message.is_own ? styles.ownMessageBubble : styles.otherMessageBubble,
              ]}
            >
              <Text
                style={[
                  styles.messageText,
                  message.is_own ? styles.ownMessageText : styles.otherMessageText,
                ]}
              >
                {message.content}
              </Text>
            </View>
            <Text style={styles.messageTime}>{message.timestamp}</Text>
          </View>
        ))}
      </ScrollView>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.messageInput}
          placeholder="Type a message..."
          placeholderTextColor={colors.textTertiary}
          value={newMessage}
          onChangeText={setNewMessage}
          multiline
        />
        <TouchableOpacity
          style={[
            styles.sendButton,
            !newMessage.trim() && styles.sendButtonDisabled,
          ]}
          onPress={handleSendMessage}
          disabled={!newMessage.trim()}
        >
          <Send size={20} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}