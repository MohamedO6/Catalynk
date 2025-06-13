import React, { createContext, useContext, useState, useEffect } from 'react';
import { useColorScheme, Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';

export type Theme = 'light' | 'dark' | 'auto';

interface ThemeContextType {
  theme: Theme;
  actualTheme: 'light' | 'dark';
  setTheme: (theme: Theme) => void;
  colors: typeof lightColors;
}

const lightColors = {
  primary: '#8B5CF6',
  secondary: '#3B82F6',
  accent: '#F59E0B',
  success: '#10B981',
  warning: '#F59E0B',
  error: '#EF4444',
  background: '#FFFFFF',
  surface: '#F9FAFB',
  surfaceVariant: '#F3F4F6',
  text: '#111827',
  textSecondary: '#6B7280',
  textTertiary: '#9CA3AF',
  border: '#E5E7EB',
  borderLight: '#F3F4F6',
  card: '#FFFFFF',
};

const darkColors = {
  primary: '#A78BFA',
  secondary: '#60A5FA',
  accent: '#FBBF24',
  success: '#34D399',
  warning: '#FBBF24',
  error: '#F87171',
  background: '#0F0F23',
  surface: '#1A1A2E',
  surfaceVariant: '#16213E',
  text: '#F9FAFB',
  textSecondary: '#D1D5DB',
  textTertiary: '#9CA3AF',
  border: '#374151',
  borderLight: '#4B5563',
  card: '#1A1A2E',
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

// Platform-specific storage functions
const getStoredTheme = async (): Promise<Theme | null> => {
  try {
    if (Platform.OS === 'web') {
      const stored = localStorage.getItem('theme');
      return stored && ['light', 'dark', 'auto'].includes(stored) ? (stored as Theme) : null;
    } else {
      const stored = await SecureStore.getItemAsync('theme');
      return stored && ['light', 'dark', 'auto'].includes(stored) ? (stored as Theme) : null;
    }
  } catch (error) {
    console.warn('Failed to get stored theme:', error);
    return null;
  }
};

const setStoredTheme = async (theme: Theme): Promise<void> => {
  try {
    if (Platform.OS === 'web') {
      localStorage.setItem('theme', theme);
    } else {
      await SecureStore.setItemAsync('theme', theme);
    }
  } catch (error) {
    console.warn('Failed to store theme:', error);
  }
};

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const systemTheme = useColorScheme();
  const [theme, setThemeState] = useState<Theme>('auto');

  const actualTheme = theme === 'auto' ? (systemTheme || 'light') : theme;
  const colors = actualTheme === 'dark' ? darkColors : lightColors;

  useEffect(() => {
    // Load saved theme preference
    getStoredTheme().then((savedTheme) => {
      if (savedTheme) {
        setThemeState(savedTheme);
      }
    });
  }, []);

  const setTheme = async (newTheme: Theme) => {
    setThemeState(newTheme);
    await setStoredTheme(newTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, actualTheme, setTheme, colors }}>
      {children}
    </ThemeContext.Provider>
  );
};