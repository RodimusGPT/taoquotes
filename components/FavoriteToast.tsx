import React, { useEffect } from 'react';
import { StyleSheet, Text } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSequence,
  withDelay,
  Easing,
  runOnJS,
} from 'react-native-reanimated';
import { useTheme } from '../hooks/useTheme';

interface FavoriteToastProps {
  message: string;
  onHide: () => void;
}

export function FavoriteToast({ message, onHide }: FavoriteToastProps) {
  const { colors } = useTheme();
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(20);

  useEffect(() => {
    opacity.value = withSequence(
      withTiming(1, { duration: 300, easing: Easing.out(Easing.cubic) }),
      withDelay(1500, withTiming(0, { duration: 300, easing: Easing.in(Easing.cubic) }, (finished) => {
        if (finished) runOnJS(onHide)();
      }))
    );
    translateY.value = withSequence(
      withTiming(0, { duration: 300, easing: Easing.out(Easing.cubic) }),
      withDelay(1500, withTiming(-10, { duration: 300, easing: Easing.in(Easing.cubic) }))
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }));

  return (
    <Animated.View style={[styles.container, { backgroundColor: colors.surface, borderColor: colors.border }, animatedStyle]}>
      <Text style={[styles.message, { color: colors.text }]}>{message}</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: { position: 'absolute', bottom: 100, alignSelf: 'center', paddingHorizontal: 24, paddingVertical: 14, borderRadius: 25, borderWidth: 1, elevation: 5 },
  message: { fontSize: 15, fontFamily: 'Georgia', letterSpacing: 0.3 },
});
