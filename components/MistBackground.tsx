import React, { useEffect } from 'react';
import { StyleSheet, Dimensions, View } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withSequence,
  Easing,
  interpolate,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../hooks/useTheme';

const { width, height } = Dimensions.get('window');

export function MistBackground() {
  const { colors, isDark } = useTheme();

  const mist1Progress = useSharedValue(0);
  const mist2Progress = useSharedValue(0);
  const mist3Progress = useSharedValue(0);

  useEffect(() => {
    mist1Progress.value = withRepeat(
      withTiming(1, { duration: 60000, easing: Easing.linear }),
      -1,
      false
    );

    mist2Progress.value = withRepeat(
      withTiming(1, { duration: 80000, easing: Easing.linear }),
      -1,
      false
    );

    mist3Progress.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 40000, easing: Easing.inOut(Easing.sin) }),
        withTiming(0, { duration: 40000, easing: Easing.inOut(Easing.sin) })
      ),
      -1,
      false
    );
  }, []);

  const mist1Style = useAnimatedStyle(() => ({
    transform: [
      { translateX: interpolate(mist1Progress.value, [0, 1], [-width * 0.3, width * 0.3]) },
    ],
    opacity: interpolate(mist1Progress.value, [0, 0.5, 1], [0.3, 0.5, 0.3]),
  }));

  const mist2Style = useAnimatedStyle(() => ({
    transform: [
      { translateX: interpolate(mist2Progress.value, [0, 1], [width * 0.2, -width * 0.2]) },
    ],
    opacity: interpolate(mist2Progress.value, [0, 0.5, 1], [0.2, 0.4, 0.2]),
  }));

  const mist3Style = useAnimatedStyle(() => ({
    transform: [
      { translateY: interpolate(mist3Progress.value, [0, 1], [0, height * 0.05]) },
    ],
    opacity: interpolate(mist3Progress.value, [0, 0.5, 1], [0.15, 0.35, 0.15]),
  }));

  const mistColor = isDark
    ? ['rgba(60, 60, 60, 0)', 'rgba(80, 80, 80, 0.4)', 'rgba(60, 60, 60, 0)']
    : ['rgba(200, 195, 185, 0)', 'rgba(220, 215, 205, 0.5)', 'rgba(200, 195, 185, 0)'];

  const mountainGradient = isDark
    ? ['transparent', 'rgba(40, 45, 50, 0.4)', 'rgba(30, 35, 40, 0.6)']
    : ['transparent', 'rgba(180, 175, 165, 0.3)', 'rgba(160, 155, 145, 0.4)'];

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <LinearGradient
        colors={mountainGradient as [string, string, ...string[]]}
        style={styles.mountainGradient}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
        locations={[0, 0.7, 1]}
      />

      <Animated.View style={[styles.mistLayer, mist1Style]}>
        <LinearGradient
          colors={mistColor as [string, string, ...string[]]}
          style={styles.mistGradient}
          start={{ x: 0, y: 0.5 }}
          end={{ x: 1, y: 0.5 }}
        />
      </Animated.View>

      <Animated.View style={[styles.mistLayer, styles.mistLayer2, mist2Style]}>
        <LinearGradient
          colors={mistColor as [string, string, ...string[]]}
          style={styles.mistGradient}
          start={{ x: 0, y: 0.5 }}
          end={{ x: 1, y: 0.5 }}
        />
      </Animated.View>

      <Animated.View style={[styles.mistLayer, styles.mistLayer3, mist3Style]}>
        <LinearGradient
          colors={mistColor as [string, string, ...string[]]}
          style={styles.mistGradient}
          start={{ x: 0.5, y: 0 }}
          end={{ x: 0.5, y: 1 }}
        />
      </Animated.View>

      <LinearGradient
        colors={[
          isDark ? 'rgba(26, 26, 26, 0.8)' : 'rgba(245, 241, 235, 0.8)',
          'transparent',
        ]}
        style={styles.topVignette}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
      />

      <LinearGradient
        colors={[
          'transparent',
          isDark ? 'rgba(26, 26, 26, 0.6)' : 'rgba(245, 241, 235, 0.6)',
        ]}
        style={styles.bottomVignette}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    overflow: 'hidden',
  },
  mountainGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: height * 0.5,
  },
  mistLayer: {
    position: 'absolute',
    top: height * 0.3,
    left: -width * 0.5,
    width: width * 2,
    height: height * 0.4,
  },
  mistLayer2: {
    top: height * 0.5,
  },
  mistLayer3: {
    top: 0,
    height: height * 0.3,
    left: 0,
    width: width,
  },
  mistGradient: {
    flex: 1,
  },
  topVignette: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: height * 0.15,
  },
  bottomVignette: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: height * 0.15,
  },
});
