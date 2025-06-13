import { createClient } from '@supabase/supabase-js';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

// Validate environment variables
const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables');
  console.error('EXPO_PUBLIC_SUPABASE_URL:', supabaseUrl ? 'Set' : 'Missing');
  console.error('EXPO_PUBLIC_SUPABASE_ANON_KEY:', supabaseAnonKey ? 'Set' : 'Missing');
  throw new Error(`
Missing Supabase environment variables. Please:

1. Create a .env file in your project root
2. Add your Supabase credentials:
   EXPO_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
   EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

Get these from your Supabase Dashboard > Settings > API
  `);
}

// Validate URL format
try {
  new URL(supabaseUrl);
} catch (error) {
  throw new Error(`
Invalid Supabase URL: ${supabaseUrl}

Please check your EXPO_PUBLIC_SUPABASE_URL environment variable.
It should look like: https://your-project-ref.supabase.co
  `);
}

const ExpoSecureStoreAdapter = {
  getItem: (key: string) => {
    return SecureStore.getItemAsync(key);
  },
  setItem: (key: string, value: string) => {
    SecureStore.setItemAsync(key, value);
  },
  removeItem: (key: string) => {
    SecureStore.deleteItemAsync(key);
  },
};

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: Platform.OS === 'web' ? undefined : ExpoSecureStoreAdapter,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

// Test connection on initialization
supabase.auth.getSession().then(({ error }) => {
  if (error) {
    console.error('Supabase connection error:', error.message);
  } else {
    console.log('✅ Supabase connected successfully');
  }
}).catch((error) => {
  console.error('Failed to test Supabase connection:', error);
});