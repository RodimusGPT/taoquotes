import { useStore } from '../store/useStore';
import { ThemeMode } from '../types';

interface ThemeColors {
  background: string;
  backgroundSecondary: string;
  text: string;
  textSecondary: string;
  accent: string;
  accentMuted: string;
  surface: string;
  surfaceHighlight: string;
  border: string;
  shadow: string;
}

const lightTheme: ThemeColors = {
  background: '#F5F1EB',
  backgroundSecondary: '#EAE4DA',
  text: '#2C2C2C',
  textSecondary: '#6B6B6B',
  accent: '#5C7A6B',
  accentMuted: '#8FA398',
  surface: '#FFFFFF',
  surfaceHighlight: '#FAFAF8',
  border: '#D4CFC5',
  shadow: 'rgba(0, 0, 0, 0.08)',
};

const darkTheme: ThemeColors = {
  background: '#1A1A1A',
  backgroundSecondary: '#242424',
  text: '#E8E4DE',
  textSecondary: '#9A9590',
  accent: '#7A9A8B',
  accentMuted: '#5C7A6B',
  surface: '#2A2A2A',
  surfaceHighlight: '#333333',
  border: '#3A3A3A',
  shadow: 'rgba(0, 0, 0, 0.4)',
};

export function useTheme() {
  const resolvedTheme = useStore((state) => state.resolvedTheme);
  const colors = resolvedTheme === 'dark' ? darkTheme : lightTheme;

  return {
    theme: resolvedTheme,
    colors,
    isDark: resolvedTheme === 'dark',
  };
}

export type { ThemeColors };
