import { supabase } from './supabase';
import * as WebBrowser from 'expo-web-browser';
import { makeRedirectUri } from 'expo-auth-session';
import { Platform } from 'react-native';

export type UserRole = 'founder' | 'freelancer' | 'investor';
export type UserTier = 'free' | 'pro';

export interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  avatar_url?: string;
  role: UserRole;
  bio?: string;
  skills?: string[];
  location?: string;
  website?: string;
  linkedin_url?: string;
  github_url?: string;
  is_verified: boolean;
  subscription_tier: UserTier;
  created_at: string;
  updated_at: string;
}

// Configure WebBrowser for OAuth
WebBrowser.maybeCompleteAuthSession();

export const signUp = async (email: string, password: string, fullName: string, role: UserRole = 'founder') => {
  try {
    const { data, error } = await supabase.auth.signUp({
      email: email.toLowerCase().trim(),
      password,
      options: {
        data: {
          full_name: fullName.trim(),
          role,
        },
      },
    });

    return { data, error };
  } catch (error) {
    console.error('Sign up error:', error);
    return { data: null, error };
  }
};

export const signIn = async (email: string, password: string) => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.toLowerCase().trim(),
      password,
    });

    return { data, error };
  } catch (error) {
    console.error('Sign in error:', error);
    return { data: null, error };
  }
};

export const signInWithOAuth = async (provider: 'google' | 'github') => {
  try {
    let redirectTo: string;
    
    if (Platform.OS === 'web') {
      // For web, use the current origin + callback path
      redirectTo = `${window.location.origin}/callback`;
    } else {
      // For mobile, use expo-auth-session
      redirectTo = makeRedirectUri({
        path: '/callback',
      });
    }

    console.log('OAuth redirect URL:', redirectTo);

    const { data, error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo,
        skipBrowserRedirect: Platform.OS !== 'web',
      },
    });

    if (Platform.OS !== 'web' && data?.url) {
      // Open the OAuth URL in the browser for mobile
      const result = await WebBrowser.openAuthSessionAsync(
        data.url,
        redirectTo
      );

      if (result.type === 'success' && result.url) {
        // Extract the URL parameters and set the session
        const url = new URL(result.url);
        const access_token = url.searchParams.get('access_token');
        const refresh_token = url.searchParams.get('refresh_token');

        if (access_token && refresh_token) {
          const { data: sessionData, error: sessionError } = await supabase.auth.setSession({
            access_token,
            refresh_token,
          });
          return { data: sessionData, error: sessionError };
        }
      }
    }

    return { data, error };
  } catch (error) {
    console.error('OAuth sign in error:', error);
    return { data: null, error };
  }
};

export const signOut = async () => {
  try {
    const { error } = await supabase.auth.signOut();
    return { error };
  } catch (error) {
    console.error('Sign out error:', error);
    return { error };
  }
};

export const getCurrentUser = async () => {
  try {
    const { data: { user }, error } = await supabase.auth.getUser();
    return user;
  } catch (error) {
    console.error('Get current user error:', error);
    return null;
  }
};

export const getUserProfile = async (userId: string): Promise<UserProfile | null> => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .maybeSingle();
    
    if (error) {
      console.error('Get user profile error:', error);
      return null;
    }
    
    return data;
  } catch (error) {
    console.error('Error:', error);
    return null;
  }
};

export const updateUserProfile = async (userId: string, updates: Partial<UserProfile>) => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .upsert({ id: userId, ...updates }, { onConflict: 'id' })
      .select()
      .single();

    return { data, error };
  } catch (error) {
    console.error('Update profile error:', error);
    return { data: null, error };
  }
};