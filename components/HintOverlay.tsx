import React, { useEffect } from 'react';
import { StyleSheet, Text } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withDelay,
  withSequence,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { useTheme } from '../hooks/useTheme';

interface HintOverlayProps {
  visible: boolean;
}

export function HintOverlay({ visible }: HintOverlayProps) {
  const { colors } = useTheme();
  const opacity = useSharedValue(0);

  useEffect(() => {
    if (visible) {
      opacity.value = withSequence(
        withDelay(2000, withTiming(1, { duration: 800, easing: Easing.out(Easing.cubic) })),
        withDelay(4000, withTiming(0, { duration: 800, easing: Easing.in(Easing.cubic) }))
      );
    }
  }, [visible]);

  const animatedStyle = useAnimatedStyle(() => ({ opacity: opacity.value }));

  if (!visible) return null;

  return (
    <Animated.View style={[styles.container, animatedStyle]} pointerEvents="none">
      <Text style={[styles.hint, { color: colors.textSecondary }]}>Tap anywhere for new wisdom</Text>
      <Text style={[styles.subHint, { color: colors.textSecondary }]}>Long press to save favorites</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: { position: 'absolute', bottom: 80, left: 0, right: 0, alignItems: 'center' },
  hint: { fontSize: 14, fontFamily: 'Georgia', fontStyle: 'italic', letterSpacing: 0.5, opacity: 0.7 },
  subHint: { fontSize: 12, fontFamily: 'System', marginTop: 8, opacity: 0.5 },
});
