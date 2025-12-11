import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Quote, AppSettings, ThemeMode } from '../types';
import { Appearance } from 'react-native';

interface AppState {
  currentQuote: Quote | null;
  setCurrentQuote: (quote: Quote) => void;
  favorites: Quote[];
  addFavorite: (quote: Quote) => void;
  removeFavorite: (quoteId: string) => void;
  isFavorite: (quoteId: string) => boolean;
  loadFavorites: () => Promise<void>;
  settings: AppSettings;
  updateSettings: (settings: Partial<AppSettings>) => void;
  loadSettings: () => Promise<void>;
  resolvedTheme: ThemeMode;
  updateResolvedTheme: () => void;
  isInitialized: boolean;
  initialize: () => Promise<void>;
}

const FAVORITES_KEY = '@taoquotes_favorites';
const SETTINGS_KEY = '@taoquotes_settings';

const defaultSettings: AppSettings = {
  theme: 'auto',
  fontSize: 'medium',
  soundEnabled: false,
  hapticEnabled: true,
};

export const useStore = create<AppState>((set, get) => ({
  currentQuote: null,
  setCurrentQuote: (quote) => set({ currentQuote: quote }),

  favorites: [],

  addFavorite: async (quote) => {
    const { favorites } = get();
    if (favorites.some((f) => f.id === quote.id)) return;

    const newFavorites = [...favorites, quote];
    set({ favorites: newFavorites });

    try {
      await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(newFavorites));
    } catch (error) {
      console.error('Failed to save favorite:', error);
    }
  },

  removeFavorite: async (quoteId) => {
    const { favorites } = get();
    const newFavorites = favorites.filter((f) => f.id !== quoteId);
    set({ favorites: newFavorites });

    try {
      await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(newFavorites));
    } catch (error) {
      console.error('Failed to remove favorite:', error);
    }
  },

  isFavorite: (quoteId) => {
    const { favorites } = get();
    return favorites.some((f) => f.id === quoteId);
  },

  loadFavorites: async () => {
    try {
      const stored = await AsyncStorage.getItem(FAVORITES_KEY);
      if (stored) {
        set({ favorites: JSON.parse(stored) });
      }
    } catch (error) {
      console.error('Failed to load favorites:', error);
    }
  },

  settings: defaultSettings,

  updateSettings: async (newSettings) => {
    const { settings, updateResolvedTheme } = get();
    const updated = { ...settings, ...newSettings };
    set({ settings: updated });

    if (newSettings.theme !== undefined) {
      updateResolvedTheme();
    }

    try {
      await AsyncStorage.setItem(SETTINGS_KEY, JSON.stringify(updated));
    } catch (error) {
      console.error('Failed to save settings:', error);
    }
  },

  loadSettings: async () => {
    try {
      const stored = await AsyncStorage.getItem(SETTINGS_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        set({ settings: { ...defaultSettings, ...parsed } });
      }
    } catch (error) {
      console.error('Failed to load settings:', error);
    }
  },

  resolvedTheme: 'dark',

  updateResolvedTheme: () => {
    const { settings } = get();
    let resolved: ThemeMode;

    if (settings.theme === 'auto') {
      const systemTheme = Appearance.getColorScheme();
      resolved = systemTheme === 'light' ? 'light' : 'dark';
    } else {
      resolved = settings.theme;
    }

    set({ resolvedTheme: resolved });
  },

  isInitialized: false,

  initialize: async () => {
    const { loadFavorites, loadSettings, updateResolvedTheme } = get();

    await Promise.all([loadFavorites(), loadSettings()]);
    updateResolvedTheme();

    set({ isInitialized: true });
  },
}));
