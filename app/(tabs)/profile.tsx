import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
} from 'react-native';
import {
  Settings,
  Edit3,
  Star,
  Users,
  Mic,
  Crown,
  ExternalLink,
  Github,
  Linkedin,
  Globe,
  LogOut,
  Bell,
  Shield,
  Moon,
  Sun,
  Download,
  Share2,
} from 'lucide-react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { useAuth } from '@/contexts/AuthContext';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';

const mockUserStats = {
  episodesCreated: 12,
  totalPlays: 8547,
  totalLikes: 234,
  followers: 89,
  rating: 4.8,
  reviews: 23,
};

export default function Profile() {
  const { colors, theme, setTheme } = useTheme();
  const { profile, signOut } = useAuth();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  const handleSignOut = async () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Sign Out', 
          style: 'destructive',
          onPress: async () => {
            try {
              await signOut();
              router.replace('/(auth)/welcome');
            } catch (error) {
              Alert.alert('Error', 'Failed to sign out. Please try again.');
            }
          }
        }
      ]
    );
  };

  const handleEditProfile = () => {
    Alert.alert('Edit Profile', 'Profile editing feature coming soon!');
  };

  const handleUpgrade = () => {
    router.push('/upgrade');
  };

  const handleCreateDomain = () => {
    Alert.alert('Custom Domain', 'Create your custom podcast website at username.mypodsnap.tech');
  };

  const handleExportEpisodes = () => {
    Alert.alert('Export Episodes', 'Download all your episodes as audio/video files.');
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M`;
    } else if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`;
    } else {
      return num.toString();
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
      paddingBottom: 30,
    },
    headerTop: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 30,
    },
    title: {
      fontSize: 28,
      fontFamily: 'Inter-Bold',
      color: colors.text,
    },
    settingsButton: {
      backgroundColor: colors.surface,
      width: 44,
      height: 44,
      borderRadius: 22,
      justifyContent: 'center',
      alignItems: 'center',
    },
    profileCard: {
      backgroundColor: colors.card,
      borderRadius: 20,
      padding: 24,
      borderWidth: 1,
      borderColor: colors.border,
    },
    profileHeader: {
      alignItems: 'center',
      marginBottom: 20,
    },
    avatar: {
      width: 100,
      height: 100,
      borderRadius: 50,
      backgroundColor: colors.primary,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 16,
    },
    avatarText: {
      fontSize: 36,
      fontFamily: 'Inter-Bold',
      color: '#FFFFFF',
    },
    nameContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 8,
    },
    name: {
      fontSize: 24,
      fontFamily: 'Inter-Bold',
      color: colors.text,
      marginRight: 8,
    },
    proBadge: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: '#FFD700' + '20',
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 12,
    },
    proText: {
      fontSize: 12,
      fontFamily: 'Inter-Bold',
      color: '#FFD700',
      marginLeft: 4,
    },
    bio: {
      fontSize: 16,
      fontFamily: 'Inter-Regular',
      color: colors.textSecondary,
      textAlign: 'center',
      lineHeight: 22,
      marginBottom: 20,
    },
    socialLinks: {
      flexDirection: 'row',
      justifyContent: 'center',
      marginBottom: 20,
    },
    socialButton: {
      backgroundColor: colors.surface,
      width: 44,
      height: 44,
      borderRadius: 22,
      justifyContent: 'center',
      alignItems: 'center',
      marginHorizontal: 8,
    },
    actionButtons: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    editButton: {
      backgroundColor: colors.primary,
      paddingVertical: 12,
      paddingHorizontal: 24,
      borderRadius: 12,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      flex: 1,
      marginRight: 8,
    },
    domainButton: {
      backgroundColor: colors.surface,
      paddingVertical: 12,
      paddingHorizontal: 24,
      borderRadius: 12,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      flex: 1,
      marginLeft: 8,
    },
    editButtonText: {
      fontSize: 16,
      fontFamily: 'Inter-SemiBold',
      color: '#FFFFFF',
      marginLeft: 8,
    },
    domainButtonText: {
      fontSize: 16,
      fontFamily: 'Inter-SemiBold',
      color: colors.text,
      marginLeft: 8,
    },
    statsContainer: {
      marginTop: 30,
    },
    statsGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
    },
    statCard: {
      width: '48%',
      backgroundColor: colors.card,
      borderRadius: 12,
      padding: 16,
      marginBottom: 12,
      borderWidth: 1,
      borderColor: colors.border,
      alignItems: 'center',
    },
    statValue: {
      fontSize: 24,
      fontFamily: 'Inter-Bold',
      color: colors.text,
      marginBottom: 4,
    },
    statLabel: {
      fontSize: 14,
      fontFamily: 'Inter-Medium',
      color: colors.textSecondary,
      textAlign: 'center',
    },
    ratingContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
    },
    ratingText: {
      fontSize: 24,
      fontFamily: 'Inter-Bold',
      color: colors.text,
      marginLeft: 8,
    },
    reviewsText: {
      fontSize: 14,
      fontFamily: 'Inter-Medium',
      color: colors.textSecondary,
      marginTop: 4,
    },
    menuContainer: {
      marginTop: 30,
      paddingHorizontal: 20,
    },
    menuSection: {
      marginBottom: 30,
    },
    sectionTitle: {
      fontSize: 18,
      fontFamily: 'Inter-Bold',
      color: colors.text,
      marginBottom: 16,
    },
    menuItem: {
      backgroundColor: colors.card,
      borderRadius: 12,
      padding: 16,
      marginBottom: 8,
      borderWidth: 1,
      borderColor: colors.border,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    menuItemLeft: {
      flexDirection: 'row',
      alignItems: 'center',
      flex: 1,
    },
    menuItemText: {
      fontSize: 16,
      fontFamily: 'Inter-Medium',
      color: colors.text,
      marginLeft: 16,
    },
    themeToggle: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    signOutButton: {
      backgroundColor: colors.error + '20',
      borderColor: colors.error + '40',
    },
    signOutText: {
      color: colors.error,
    },
    upgradeButton: {
      backgroundColor: colors.warning + '20',
      borderColor: colors.warning + '40',
    },
    upgradeText: {
      color: colors.warning,
    },
  });

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[colors.primary + '10', colors.background]}
        style={styles.header}
      >
        <View style={styles.headerTop}>
          <Text style={styles.title}>Profile</Text>
          <TouchableOpacity style={styles.settingsButton}>
            <Settings size={20} color={colors.text} />
          </TouchableOpacity>
        </View>

        <View style={styles.profileCard}>
          <View style={styles.profileHeader}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {getInitials(profile?.full_name || 'User')}
              </Text>
            </View>

            <View style={styles.nameContainer}>
              <Text style={styles.name}>{profile?.full_name || 'User'}</Text>
              {profile?.tier === 'pro' && (
                <View style={styles.proBadge}>
                  <Crown size={16} color="#FFD700" />
                  <Text style={styles.proText}>PRO</Text>
                </View>
              )}
            </View>

            <Text style={styles.bio}>
              {profile?.bio || 'Podcast creator passionate about sharing stories and insights through AI-powered content.'}
            </Text>

            <View style={styles.socialLinks}>
              <TouchableOpacity style={styles.socialButton}>
                <Github size={20} color={colors.text} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.socialButton}>
                <Linkedin size={20} color={colors.text} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.socialButton}>
                <Globe size={20} color={colors.text} />
              </TouchableOpacity>
            </View>

            <View style={styles.actionButtons}>
              <TouchableOpacity style={styles.editButton} onPress={handleEditProfile}>
                <Edit3 size={18} color="#FFFFFF" />
                <Text style={styles.editButtonText}>Edit Profile</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.domainButton} onPress={handleCreateDomain}>
                <Globe size={18} color={colors.text} />
                <Text style={styles.domainButtonText}>My Domain</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </LinearGradient>

      <ScrollView style={styles.statsContainer} showsVerticalScrollIndicator={false}>
        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{mockUserStats.episodesCreated}</Text>
            <Text style={styles.statLabel}>Episodes Created</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{formatNumber(mockUserStats.totalPlays)}</Text>
            <Text style={styles.statLabel}>Total Plays</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{formatNumber(mockUserStats.totalLikes)}</Text>
            <Text style={styles.statLabel}>Total Likes</Text>
          </View>
          <View style={styles.statCard}>
            <View style={styles.ratingContainer}>
              <Star size={20} color={colors.warning} fill={colors.warning} />
              <Text style={styles.ratingText}>{mockUserStats.rating}</Text>
            </View>
            <Text style={styles.reviewsText}>{mockUserStats.reviews} reviews</Text>
          </View>
        </View>

        <View style={styles.menuContainer}>
          {profile?.tier === 'free' && (
            <View style={styles.menuSection}>
              <TouchableOpacity style={[styles.menuItem, styles.upgradeButton]} onPress={handleUpgrade}>
                <View style={styles.menuItemLeft}>
                  <Crown size={24} color={colors.warning} />
                  <Text style={[styles.menuItemText, styles.upgradeText]}>
                    Upgrade to Pro
                  </Text>
                </View>
                <ExternalLink size={20} color={colors.warning} />
              </TouchableOpacity>
            </View>
          )}

          <View style={styles.menuSection}>
            <Text style={styles.sectionTitle}>Content</Text>
            
            <TouchableOpacity style={styles.menuItem} onPress={handleExportEpisodes}>
              <View style={styles.menuItemLeft}>
                <Download size={24} color={colors.text} />
                <Text style={styles.menuItemText}>Export Episodes</Text>
              </View>
              <ExternalLink size={20} color={colors.textSecondary} />
            </TouchableOpacity>

            <TouchableOpacity style={styles.menuItem}>
              <View style={styles.menuItemLeft}>
                <Share2 size={24} color={colors.text} />
                <Text style={styles.menuItemText}>Share Profile</Text>
              </View>
              <ExternalLink size={20} color={colors.textSecondary} />
            </TouchableOpacity>
          </View>

          <View style={styles.menuSection}>
            <Text style={styles.sectionTitle}>Preferences</Text>
            
            <TouchableOpacity style={styles.menuItem}>
              <View style={styles.menuItemLeft}>
                <Bell size={24} color={colors.text} />
                <Text style={styles.menuItemText}>Notifications</Text>
              </View>
              <Switch
                value={notificationsEnabled}
                onValueChange={setNotificationsEnabled}
                trackColor={{ false: colors.border, true: colors.primary + '40' }}
                thumbColor={notificationsEnabled ? colors.primary : colors.textTertiary}
              />
            </TouchableOpacity>

            <TouchableOpacity style={styles.menuItem}>
              <View style={styles.menuItemLeft}>
                {theme === 'dark' ? (
                  <Moon size={24} color={colors.text} />
                ) : (
                  <Sun size={24} color={colors.text} />
                )}
                <Text style={styles.menuItemText}>Theme</Text>
              </View>
              <View style={styles.themeToggle}>
                <TouchableOpacity onPress={() => setTheme('light')}>
                  <Sun size={20} color={theme === 'light' ? colors.primary : colors.textSecondary} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setTheme('dark')} style={{ marginLeft: 12 }}>
                  <Moon size={20} color={theme === 'dark' ? colors.primary : colors.textSecondary} />
                </TouchableOpacity>
              </View>
            </TouchableOpacity>

            <TouchableOpacity style={styles.menuItem}>
              <View style={styles.menuItemLeft}>
                <Shield size={24} color={colors.text} />
                <Text style={styles.menuItemText}>Privacy & Security</Text>
              </View>
              <ExternalLink size={20} color={colors.textSecondary} />
            </TouchableOpacity>
          </View>

          <View style={styles.menuSection}>
            <TouchableOpacity
              style={[styles.menuItem, styles.signOutButton]}
              onPress={handleSignOut}
            >
              <View style={styles.menuItemLeft}>
                <LogOut size={24} color={colors.error} />
                <Text style={[styles.menuItemText, styles.signOutText]}>Sign Out</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}