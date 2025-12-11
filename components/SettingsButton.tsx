import React from 'react';
import { StyleSheet, Pressable, Text } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { useTheme } from '../hooks/useTheme';

interface SettingsButtonProps {
  onPress: () => void;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function SettingsButton({ onPress }: SettingsButtonProps) {
  const { colors } = useTheme();
  const opacity = useSharedValue(0.5);

  const animatedStyle = useAnimatedStyle(() => ({ opacity: opacity.value }));

  return (
    <AnimatedPressable
      style={[styles.button, animatedStyle]}
      onPress={onPress}
      onPressIn={() => { opacity.value = withTiming(1, { duration: 100 }); }}
      onPressOut={() => { opacity.value = withTiming(0.5, { duration: 200 }); }}
    >
      <Text style={[styles.icon, { color: colors.textSecondary }]}>{"\u2630"}</Text>
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  button: { position: 'absolute', top: 50, right: 20, width: 44, height: 44, borderRadius: 22, justifyContent: 'center', alignItems: 'center', zIndex: 100 },
  icon: { fontSize: 24 },
});
