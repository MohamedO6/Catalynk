import { supabase } from './supabase';

export type UserRole = 'founder' | 'freelancer' | 'investor';

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
  subscription_tier: 'free' | 'pro';
  created_at: string;
  updated_at: string;
}

export interface AuthError {
  message: string;
  code?: string;
}

export const signUp = async (email: string, password: string, userData: {
  full_name: string;
  role: UserRole;
}) => {
  try {
    // Validate input
    if (!email || !password || !userData.full_name) {
      return { 
        data: null, 
        error: { message: 'Please fill in all required fields' } as AuthError 
      };
    }

    if (password.length < 6) {
      return { 
        data: null, 
        error: { message: 'Password must be at least 6 characters long' } as AuthError 
      };
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return { 
        data: null, 
        error: { message: 'Please enter a valid email address' } as AuthError 
      };
    }

    const { data, error } = await supabase.auth.signUp({
      email: email.toLowerCase().trim(),
      password,
      options: {
        data: {
          full_name: userData.full_name.trim(),
          role: userData.role,
        },
      },
    });

    if (error) {
      // Handle specific Supabase errors
      let errorMessage = error.message;
      
      if (error.message.includes('User already registered')) {
        errorMessage = 'An account with this email already exists. Please sign in instead.';
      } else if (error.message.includes('Invalid email')) {
        errorMessage = 'Please enter a valid email address.';
      } else if (error.message.includes('Password')) {
        errorMessage = 'Password must be at least 6 characters long.';
      }

      return { data: null, error: { message: errorMessage, code: error.message } as AuthError };
    }

    return { data, error: null };
  } catch (error) {
    console.error('Sign up error:', error);
    return { 
      data: null, 
      error: { message: 'Network error. Please check your connection and try again.' } as AuthError 
    };
  }
};

export const signIn = async (email: string, password: string) => {
  try {
    // Validate input
    if (!email || !password) {
      return { 
        data: null, 
        error: { message: 'Please enter both email and password' } as AuthError 
      };
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.toLowerCase().trim(),
      password,
    });

    if (error) {
      // Handle specific Supabase errors
      let errorMessage = error.message;
      
      if (error.message.includes('Invalid login credentials')) {
        errorMessage = 'Invalid email or password. Please check your credentials and try again.';
      } else if (error.message.includes('Email not confirmed')) {
        errorMessage = 'Please check your email and click the confirmation link before signing in.';
      } else if (error.message.includes('Too many requests')) {
        errorMessage = 'Too many login attempts. Please wait a moment and try again.';
      }

      return { data: null, error: { message: errorMessage, code: error.message } as AuthError };
    }

    return { data, error: null };
  } catch (error) {
    console.error('Sign in error:', error);
    return { 
      data: null, 
      error: { message: 'Network error. Please check your connection and try again.' } as AuthError 
    };
  }
};

export const signInWithProvider = async (provider: 'google' | 'github') => {
  try {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}/(tabs)`,
        queryParams: {
          access_type: 'offline',
          prompt: 'consent',
        },
      },
    });

    if (error) {
      let errorMessage = error.message;
      
      if (error.message.includes('OAuth')) {
        errorMessage = `Failed to connect with ${provider}. Please try again.`;
      }

      return { data: null, error: { message: errorMessage, code: error.message } as AuthError };
    }

    return { data, error: null };
  } catch (error) {
    console.error(`${provider} sign in error:`, error);
    return { 
      data: null, 
      error: { message: 'Network error. Please check your connection and try again.' } as AuthError 
    };
  }
};

export const signOut = async () => {
  try {
    const { error } = await supabase.auth.signOut();
    
    if (error) {
      return { error: { message: error.message } as AuthError };
    }
    
    return { error: null };
  } catch (error) {
    console.error('Sign out error:', error);
    return { error: { message: 'Network error. Please try again.' } as AuthError };
  }
};

export const getCurrentUser = async () => {
  try {
    const { data: { user }, error } = await supabase.auth.getUser();
    
    if (error) {
      console.error('Get current user error:', error);
      return null;
    }
    
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
      console.error('Error fetching user profile:', error);
      return null;
    }
    
    return data;
  } catch (error) {
    console.error('Get user profile error:', error);
    return null;
  }
};

export const updateUserProfile = async (userId: string, updates: Partial<UserProfile>) => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', userId)
      .select()
      .single();
    
    if (error) {
      return { data: null, error: { message: error.message } as AuthError };
    }
    
    return { data, error: null };
  } catch (error) {
    console.error('Update user profile error:', error);
    return { 
      data: null, 
      error: { message: 'Network error. Please try again.' } as AuthError 
    };
  }
};

export const resetPassword = async (email: string) => {
  try {
    if (!email) {
      return { 
        error: { message: 'Please enter your email address' } as AuthError 
      };
    }

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/(auth)/reset-password`,
    });

    if (error) {
      return { error: { message: error.message } as AuthError };
    }

    return { error: null };
  } catch (error) {
    console.error('Reset password error:', error);
    return { 
      error: { message: 'Network error. Please try again.' } as AuthError 
    };
  }
};