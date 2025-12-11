import React, { useEffect, useState, useCallback, useRef } from 'react';
import {
  StyleSheet,
  View,
  Pressable,
  Appearance,
  GestureResponderEvent,
  Share,
  Platform,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import * as Haptics from 'expo-haptics';
import Animated, {
  useSharedValue,
  withTiming,
  withSequence,
  Easing,
  runOnJS,
} from 'react-native-reanimated';

import { useStore } from './store/useStore';
import { useTheme } from './hooks/useTheme';
import { useAmbientSound } from './hooks/useAmbientSound';
import { Quote } from './types';
import { getRandomQuote } from './data/quotes';

import { MistBackground } from './components/MistBackground';
import { QuoteDisplay } from './components/QuoteDisplay';
import { RippleEffect } from './components/RippleEffect';
import { SettingsButton } from './components/SettingsButton';
import { SettingsModal } from './components/SettingsModal';
import { FavoritesModal } from './components/FavoritesModal';
import { FavoriteToast } from './components/FavoriteToast';
import { HintOverlay } from './components/HintOverlay';

interface RippleData {
  id: number;
  x: number;
  y: number;
}

export default function App() {
  const { colors, isDark } = useTheme();
  const { playSound, stopSound } = useAmbientSound();

  const initialize = useStore((state) => state.initialize);
  const isInitialized = useStore((state) => state.isInitialized);
  const currentQuote = useStore((state) => state.currentQuote);
  const setCurrentQuote = useStore((state) => state.setCurrentQuote);
  const addFavorite = useStore((state) => state.addFavorite);
  const isFavorite = useStore((state) => state.isFavorite);
  const settings = useStore((state) => state.settings);
  const updateResolvedTheme = useStore((state) => state.updateResolvedTheme);

  const [settingsVisible, setSettingsVisible] = useState(false);
  const [favoritesVisible, setFavoritesVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [ripples, setRipples] = useState<RippleData[]>([]);
  const [showHint, setShowHint] = useState(true);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const quoteOpacity = useSharedValue(1);
  const rippleIdRef = useRef(0);

  useEffect(() => {
    initialize();
  }, []);

  useEffect(() => {
    if (isInitialized && !currentQuote) {
      setCurrentQuote(getRandomQuote());
    }
  }, [isInitialized, currentQuote]);

  useEffect(() => {
    const subscription = Appearance.addChangeListener(() => {
      if (settings.theme === 'auto') {
        updateResolvedTheme();
      }
    });
    return () => subscription.remove();
  }, [settings.theme]);

  useEffect(() => {
    if (settings.soundEnabled) {
      playSound();
    } else {
      stopSound();
    }
  }, [settings.soundEnabled]);

  useEffect(() => {
    if (!showHint) return;
    const timer = setTimeout(() => setShowHint(false), 8000);
    return () => clearTimeout(timer);
  }, [showHint]);

  const triggerHaptic = useCallback(() => {
    if (settings.hapticEnabled) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  }, [settings.hapticEnabled]);

  const handleTap = useCallback(
    (event: GestureResponderEvent) => {
      if (isTransitioning || !currentQuote) return;

      const { pageX, pageY } = event.nativeEvent;

      const newRipple: RippleData = {
        id: ++rippleIdRef.current,
        x: pageX,
        y: pageY,
      };
      setRipples((prev) => [...prev, newRipple]);

      triggerHaptic();

      if (showHint) setShowHint(false);

      setIsTransitioning(true);

      quoteOpacity.value = withSequence(
        withTiming(0, {
          duration: 400,
          easing: Easing.out(Easing.cubic),
        }),
        withTiming(
          1,
          {
            duration: 800,
            easing: Easing.out(Easing.cubic),
          },
          () => {
            runOnJS(setIsTransitioning)(false);
          }
        )
      );

      setTimeout(() => {
        setCurrentQuote(getRandomQuote(currentQuote.id));
      }, 400);
    },
    [currentQuote, isTransitioning, triggerHaptic, showHint]
  );

  const handleLongPress = useCallback(() => {
    if (!currentQuote) return;

    if (settings.hapticEnabled) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }

    if (isFavorite(currentQuote.id)) {
      setToastMessage('Already in your collection');
    } else {
      addFavorite(currentQuote);
      setToastMessage('Added to favorites');
    }
  }, [currentQuote, settings.hapticEnabled, isFavorite, addFavorite]);

  const handleRemoveRipple = useCallback((id: number) => {
    setRipples((prev) => prev.filter((r) => r.id !== id));
  }, []);

  if (!isInitialized || !currentQuote) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <StatusBar style={isDark ? 'light' : 'dark'} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar style={isDark ? 'light' : 'dark'} />

      <MistBackground />

      {ripples.map((ripple) => (
        <RippleEffect
          key={ripple.id}
          x={ripple.x}
          y={ripple.y}
          onComplete={() => handleRemoveRipple(ripple.id)}
        />
      ))}

      <Pressable
        style={styles.tapArea}
        onPress={handleTap}
        onLongPress={handleLongPress}
        delayLongPress={500}
      >
        <QuoteDisplay
          quote={currentQuote}
          opacity={quoteOpacity}
          onLongPress={handleLongPress}
          isFavorite={isFavorite(currentQuote.id)}
        />
      </Pressable>

      <HintOverlay visible={showHint} />

      <SettingsButton onPress={() => setSettingsVisible(true)} />

      <SettingsModal
        visible={settingsVisible}
        onClose={() => setSettingsVisible(false)}
        onViewFavorites={() => {
          setSettingsVisible(false);
          setTimeout(() => setFavoritesVisible(true), 300);
        }}
      />

      <FavoritesModal
        visible={favoritesVisible}
        onClose={() => setFavoritesVisible(false)}
      />

      {toastMessage && (
        <FavoriteToast
          message={toastMessage}
          onHide={() => setToastMessage(null)}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  tapArea: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
