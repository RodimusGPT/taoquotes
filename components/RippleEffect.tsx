import React, { useEffect } from 'react';
import { StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
  runOnJS,
} from 'react-native-reanimated';
import { useTheme } from '../hooks/useTheme';

interface RippleEffectProps {
  x: number;
  y: number;
  onComplete: () => void;
}

export function RippleEffect({ x, y, onComplete }: RippleEffectProps) {
  const { isDark } = useTheme();
  const scale = useSharedValue(0);
  const opacity = useSharedValue(0.4);

  useEffect(() => {
    scale.value = withTiming(1, { duration: 800, easing: Easing.out(Easing.cubic) }, (finished) => {
      if (finished) runOnJS(onComplete)();
    });
    opacity.value = withTiming(0, { duration: 800, easing: Easing.out(Easing.cubic) });
  }, []);

  const rippleStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  const rippleColor = isDark ? 'rgba(122, 154, 139, 0.3)' : 'rgba(92, 122, 107, 0.2)';

  return (
    <Animated.View style={[styles.ripple, { left: x - 100, top: y - 100, backgroundColor: rippleColor }, rippleStyle]} />
  );
}

const styles = StyleSheet.create({
  ripple: { position: 'absolute', width: 200, height: 200, borderRadius: 100 },
});
