export interface Quote {
  id: string;
  text: string;
  source: string;
  chapter?: string;
}

export interface AppSettings {
  theme: 'light' | 'dark' | 'auto';
  fontSize: 'small' | 'medium' | 'large';
  soundEnabled: boolean;
  hapticEnabled: boolean;
}

export type ThemeMode = 'light' | 'dark';
