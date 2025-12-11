import React from 'react';
import { StyleSheet, Text, View, Pressable, ScrollView, Switch, Modal } from 'react-native';
import { BlurView } from 'expo-blur';
import Animated, { FadeIn } from 'react-native-reanimated';
import { useTheme } from '../hooks/useTheme';
import { useStore } from '../store/useStore';
import { AppSettings } from '../types';

interface SettingsModalProps {
  visible: boolean;
  onClose: () => void;
  onViewFavorites: () => void;
}

const AnimatedBlurView = Animated.createAnimatedComponent(BlurView);

export function SettingsModal({ visible, onClose, onViewFavorites }: SettingsModalProps) {
  const { colors, isDark } = useTheme();
  const settings = useStore((state) => state.settings);
  const updateSettings = useStore((state) => state.updateSettings);
  const favoritesCount = useStore((state) => state.favorites.length);

  const handleThemeChange = (theme: AppSettings['theme']) => updateSettings({ theme });
  const handleFontSizeChange = (fontSize: AppSettings['fontSize']) => updateSettings({ fontSize });

  if (!visible) return null;

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <Pressable style={styles.overlay} onPress={onClose}>
        <AnimatedBlurView style={StyleSheet.absoluteFill} intensity={20} tint={isDark ? 'dark' : 'light'} entering={FadeIn.duration(200)} />
      </Pressable>

      <Animated.View style={[styles.container, { backgroundColor: colors.surface }]} entering={FadeIn.duration(300)}>
        <View style={styles.handle} />
        <Text style={[styles.title, { color: colors.text }]}>Settings</Text>

        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>APPEARANCE</Text>
            <View style={styles.optionGroup}>
              {(['light', 'dark', 'auto'] as const).map((theme) => (
                <Pressable key={theme} style={[styles.optionButton, { backgroundColor: settings.theme === theme ? colors.accent : colors.backgroundSecondary, borderColor: colors.border }]} onPress={() => handleThemeChange(theme)}>
                  <Text style={[styles.optionText, { color: settings.theme === theme ? '#FFF' : colors.text }]}>
                    {theme === 'auto' ? 'Auto' : theme.charAt(0).toUpperCase() + theme.slice(1)}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>

          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>TEXT SIZE</Text>
            <View style={styles.optionGroup}>
              {(['small', 'medium', 'large'] as const).map((size) => (
                <Pressable key={size} style={[styles.optionButton, { backgroundColor: settings.fontSize === size ? colors.accent : colors.backgroundSecondary, borderColor: colors.border }]} onPress={() => handleFontSizeChange(size)}>
                  <Text style={[styles.optionText, { color: settings.fontSize === size ? '#FFF' : colors.text, fontSize: size === 'small' ? 13 : size === 'large' ? 17 : 15 }]}>
                    {size.charAt(0).toUpperCase() + size.slice(1)}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>

          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>FEEDBACK</Text>
            <View style={[styles.settingRow, { borderBottomColor: colors.border }]}>
              <Text style={[styles.settingLabel, { color: colors.text }]}>Ambient Sound</Text>
              <Switch value={settings.soundEnabled} onValueChange={(value) => updateSettings({ soundEnabled: value })} trackColor={{ false: colors.border, true: colors.accent }} thumbColor={settings.soundEnabled ? '#FFF' : colors.backgroundSecondary} />
            </View>
            <View style={[styles.settingRow, { borderBottomColor: 'transparent' }]}>
              <Text style={[styles.settingLabel, { color: colors.text }]}>Haptic Feedback</Text>
              <Switch value={settings.hapticEnabled} onValueChange={(value) => updateSettings({ hapticEnabled: value })} trackColor={{ false: colors.border, true: colors.accent }} thumbColor={settings.hapticEnabled ? '#FFF' : colors.backgroundSecondary} />
            </View>
          </View>

          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>COLLECTION</Text>
            <Pressable style={[styles.favoritesButton, { backgroundColor: colors.backgroundSecondary }]} onPress={onViewFavorites}>
              <Text style={[styles.favoritesText, { color: colors.text }]}>Saved Quotes</Text>
              <Text style={[styles.favoritesCount, { color: colors.textSecondary }]}>{favoritesCount} {favoritesCount === 1 ? 'quote' : 'quotes'}</Text>
            </Pressable>
          </View>

          <View style={[styles.section, styles.aboutSection]}>
            <Text style={[styles.aboutText, { color: colors.textSecondary }]}>TaoQuotes</Text>
            <Text style={[styles.versionText, { color: colors.textSecondary }]}>A meditative journey through Taoist wisdom</Text>
          </View>
        </ScrollView>

        <Pressable style={[styles.closeButton, { backgroundColor: colors.accent }]} onPress={onClose}>
          <Text style={styles.closeButtonText}>Done</Text>
        </Pressable>
      </Animated.View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { ...StyleSheet.absoluteFillObject },
  container: { position: 'absolute', bottom: 0, left: 0, right: 0, maxHeight: '85%', borderTopLeftRadius: 24, borderTopRightRadius: 24, paddingTop: 12, paddingHorizontal: 24, paddingBottom: 40, elevation: 10 },
  handle: { width: 36, height: 4, borderRadius: 2, backgroundColor: '#CCC', alignSelf: 'center', marginBottom: 16 },
  title: { fontSize: 22, fontWeight: '600', textAlign: 'center', marginBottom: 24, fontFamily: 'Georgia' },
  scrollView: { flex: 1 },
  section: { marginBottom: 28 },
  sectionTitle: { fontSize: 12, fontWeight: '600', letterSpacing: 1.5, marginBottom: 12 },
  optionGroup: { flexDirection: 'row', gap: 10 },
  optionButton: { flex: 1, paddingVertical: 12, borderRadius: 12, alignItems: 'center', borderWidth: 1 },
  optionText: { fontSize: 15, fontWeight: '500' },
  settingRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 14, borderBottomWidth: 1 },
  settingLabel: { fontSize: 16 },
  favoritesButton: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, borderRadius: 12 },
  favoritesText: { fontSize: 16, fontWeight: '500' },
  favoritesCount: { fontSize: 14 },
  aboutSection: { alignItems: 'center', paddingTop: 12 },
  aboutText: { fontSize: 16, fontFamily: 'Georgia', fontStyle: 'italic' },
  versionText: { fontSize: 12, marginTop: 4 },
  closeButton: { marginTop: 16, paddingVertical: 16, borderRadius: 14, alignItems: 'center' },
  closeButtonText: { color: '#FFF', fontSize: 17, fontWeight: '600' },
});
