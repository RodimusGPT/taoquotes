# TaoQuotes

A minimalist, meditative mobile app delivering Taoist wisdom one tap at a time.

## Features

- **Tap to reveal**: Each tap fades out the current quote and fades in a new one
- **108 curated quotes**: From the Tao Te Ching, Zhuangzi, and other classical sources
- **Save favorites**: Long-press to bookmark quotes for later
- **Dark/light themes**: Auto-switch based on system preference
- **Ink wash aesthetic**: Animated mist background inspired by Chinese landscape painting
- **Haptic feedback**: Subtle vibrations enhance the tactile experience

## Tech Stack

- React Native with Expo SDK 54
- TypeScript (strict mode)
- Zustand for state management
- React Native Reanimated for animations
- AsyncStorage for persistence

## Getting Started

```bash
# Install dependencies
npm install

# Start the development server
npx expo start
```

## Building

```bash
# Build for Android (APK)
eas build --platform android --profile preview

# Build for iOS
eas build --platform ios --profile preview
```

## Philosophy

Opening the app should feel like stepping into a quiet garden. The user should leave feeling a little more grounded than when they arrived.
