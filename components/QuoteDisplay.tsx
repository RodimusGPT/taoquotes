import React from 'react';
import { StyleSheet, Text, View, Pressable } from 'react-native';
import Animated, {
  useAnimatedStyle,
  interpolate,
  SharedValue,
} from 'react-native-reanimated';
import { useTheme } from '../hooks/useTheme';
import { useStore } from '../store/useStore';
import { Quote } from '../types';

interface QuoteDisplayProps {
  quote: Quote;
  opacity: SharedValue<number>;
  onLongPress: () => void;
  isFavorite: boolean;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function QuoteDisplay({ quote, opacity, onLongPress, isFavorite }: QuoteDisplayProps) {
  const { colors } = useTheme();
  const settings = useStore((state) => state.settings);

  const getFontSize = () => {
    switch (settings.fontSize) {
      case 'small': return { quote: 20, source: 14, chapter: 12 };
      case 'large': return { quote: 28, source: 18, chapter: 14 };
      default: return { quote: 24, source: 16, chapter: 13 };
    }
  };

  const fontSizes = getFontSize();

  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
      transform: [
        { translateY: interpolate(opacity.value, [0, 1], [20, 0]) },
        { scale: interpolate(opacity.value, [0, 1], [0.98, 1]) },
      ],
    };
  });

  return (
    <AnimatedPressable onLongPress={onLongPress} delayLongPress={500} style={[styles.container, animatedStyle]}>
      <View style={styles.quoteWrapper}>
        {isFavorite && (
          <View style={[styles.favoriteIndicator, { backgroundColor: colors.accent }]}>
            <Text style={styles.favoriteIcon}>{"\u2665"}</Text>
          </View>
        )}

        <Text style={[styles.quoteText, { color: colors.text, fontSize: fontSizes.quote, lineHeight: fontSizes.quote * 1.6 }]}>
          {quote.text}
        </Text>

        <View style={styles.attributionContainer}>
          <View style={[styles.divider, { backgroundColor: colors.accent }]} />
          <Text style={[styles.sourceText, { color: colors.textSecondary, fontSize: fontSizes.source }]}>
            {quote.source}
          </Text>
          {quote.chapter && (
            <Text style={[styles.chapterText, { color: colors.textSecondary, fontSize: fontSizes.chapter }]}>
              {quote.chapter}
            </Text>
          )}
        </View>
      </View>
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 32 },
  quoteWrapper: { maxWidth: 600, alignItems: 'center', position: 'relative' },
  favoriteIndicator: { position: 'absolute', top: -40, width: 28, height: 28, borderRadius: 14, justifyContent: 'center', alignItems: 'center', opacity: 0.8 },
  favoriteIcon: { fontSize: 14, color: '#FFF' },
  quoteText: { fontFamily: 'Georgia', textAlign: 'center', letterSpacing: 0.5 },
  attributionContainer: { marginTop: 32, alignItems: 'center' },
  divider: { width: 40, height: 2, borderRadius: 1, marginBottom: 16, opacity: 0.6 },
  sourceText: { fontFamily: 'Georgia', fontStyle: 'italic', letterSpacing: 1 },
  chapterText: { marginTop: 6, fontFamily: 'System', letterSpacing: 0.5, opacity: 0.7 },
});
