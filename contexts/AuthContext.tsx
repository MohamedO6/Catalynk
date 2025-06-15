import React, { createContext, useContext, useEffect, useState, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import { UserProfile, getCurrentUser, getUserProfile, updateUserProfile } from '@/lib/auth';
import { User } from '@supabase/supabase-js';

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
  updateProfile: (updates: Partial<UserProfile>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const mounted = useRef(false);

  const refreshProfile = async () => {
    if (user && mounted.current) {
      try {
        const userProfile = await getUserProfile(user.id);
        if (mounted.current) {
          setProfile(userProfile);
        }
      } catch (error) {
        console.error('Error refreshing profile:', error);
      }
    }
  };

  const updateProfile = async (updates: Partial<UserProfile>) => {
    if (!user) return;
    
    try {
      const { data, error } = await updateUserProfile(user.id, updates);
      if (!error && data && mounted.current) {
        setProfile(data);
      }
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      if (mounted.current) {
        setUser(null);
        setProfile(null);
      }
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  useEffect(() => {
    mounted.current = true;

    const getInitialSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (mounted.current) {
          setUser(session?.user ?? null);
          
          if (session?.user) {
            try {
              const userProfile = await getUserProfile(session.user.id);
              if (mounted.current) {
                setProfile(userProfile);
              }
            } catch (profileError) {
              console.error('Error fetching profile:', profileError);
              // Profile might not exist yet, that's okay
            }
          }
          
          setLoading(false);
        }
      } catch (error) {
        console.error('Error in getInitialSession:', error);
        if (mounted.current) {
          setLoading(false);
        }
      }
    };

    getInitialSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.id);
        
        if (mounted.current) {
          setUser(session?.user ?? null);
          
          if (session?.user) {
            try {
              const userProfile = await getUserProfile(session.user.id);
              if (mounted.current) {
                setProfile(userProfile);
              }
            } catch (error) {
              console.error('Error fetching profile on auth change:', error);
              // Profile might not exist yet for new users
              if (mounted.current) {
                setProfile(null);
              }
            }
          } else {
            if (mounted.current) {
              setProfile(null);
            }
          }
          
          setLoading(false);
        }
      }
    );

    return () => {
      mounted.current = false;
      subscription.unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider value={{ user, profile, loading, signOut, refreshProfile, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
};