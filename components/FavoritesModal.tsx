import React from 'react';
import { StyleSheet, Text, View, Pressable, FlatList, Modal, Share, Alert } from 'react-native';
import { useTheme } from '../hooks/useTheme';
import { useStore } from '../store/useStore';
import { Quote } from '../types';

interface FavoritesModalProps {
  visible: boolean;
  onClose: () => void;
}

export function FavoritesModal({ visible, onClose }: FavoritesModalProps) {
  const { colors } = useTheme();
  const favorites = useStore((state) => state.favorites);
  const removeFavorite = useStore((state) => state.removeFavorite);
  const setCurrentQuote = useStore((state) => state.setCurrentQuote);

  const handleShare = async (quote: Quote) => {
    try {
      const message = `"${quote.text}"\n\n\u2014 ${quote.source}${quote.chapter ? `\n${quote.chapter}` : ''}`;
      await Share.share({ message });
    } catch (error) {
      console.error('Error sharing quote:', error);
    }
  };

  const handleRemove = (quote: Quote) => {
    Alert.alert('Remove from Favorites', 'Are you sure you want to remove this quote?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Remove', style: 'destructive', onPress: () => removeFavorite(quote.id) },
    ]);
  };

  const handleSelect = (quote: Quote) => {
    setCurrentQuote(quote);
    onClose();
  };

  const renderQuote = ({ item }: { item: Quote }) => (
    <Pressable style={[styles.quoteCard, { backgroundColor: colors.backgroundSecondary }]} onPress={() => handleSelect(item)}>
      <Text style={[styles.quoteText, { color: colors.text }]} numberOfLines={3}>"{item.text}"</Text>
      <Text style={[styles.sourceText, { color: colors.textSecondary }]}>\u2014 {item.source}</Text>
      <View style={styles.actions}>
        <Pressable style={[styles.actionButton, { backgroundColor: colors.surface }]} onPress={() => handleShare(item)}>
          <Text style={[styles.actionText, { color: colors.accent }]}>Share</Text>
        </Pressable>
        <Pressable style={[styles.actionButton, { backgroundColor: colors.surface }]} onPress={() => handleRemove(item)}>
          <Text style={[styles.actionText, { color: '#C75050' }]}>Remove</Text>
        </Pressable>
      </View>
    </Pressable>
  );

  if (!visible) return null;

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.header}>
          <View style={styles.handle} />
          <Text style={[styles.title, { color: colors.text }]}>Saved Quotes</Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>{favorites.length} {favorites.length === 1 ? 'quote' : 'quotes'} saved</Text>
        </View>

        {favorites.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={[styles.emptyIcon, { color: colors.textSecondary }]}>\u2661</Text>
            <Text style={[styles.emptyText, { color: colors.textSecondary }]}>No saved quotes yet</Text>
            <Text style={[styles.emptyHint, { color: colors.textSecondary }]}>Long press on any quote to save it</Text>
          </View>
        ) : (
          <FlatList data={favorites} keyExtractor={(item) => item.id} renderItem={renderQuote} contentContainerStyle={styles.listContent} showsVerticalScrollIndicator={false} />
        )}

        <Pressable style={[styles.closeButton, { backgroundColor: colors.accent }]} onPress={onClose}>
          <Text style={styles.closeButtonText}>Close</Text>
        </Pressable>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 60 },
  header: { alignItems: 'center', paddingBottom: 20 },
  handle: { width: 36, height: 4, borderRadius: 2, backgroundColor: '#CCC', marginBottom: 20 },
  title: { fontSize: 24, fontWeight: '600', fontFamily: 'Georgia', marginBottom: 4 },
  subtitle: { fontSize: 14 },
  listContent: { padding: 20, paddingBottom: 100 },
  quoteCard: { padding: 20, borderRadius: 16, marginBottom: 16 },
  quoteText: { fontSize: 16, fontFamily: 'Georgia', lineHeight: 24, marginBottom: 12 },
  sourceText: { fontSize: 14, fontStyle: 'italic', marginBottom: 16 },
  actions: { flexDirection: 'row', gap: 10 },
  actionButton: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 8 },
  actionText: { fontSize: 14, fontWeight: '500' },
  emptyState: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 40 },
  emptyIcon: { fontSize: 48, marginBottom: 16, opacity: 0.5 },
  emptyText: { fontSize: 18, fontFamily: 'Georgia', marginBottom: 8 },
  emptyHint: { fontSize: 14, textAlign: 'center', opacity: 0.7 },
  closeButton: { position: 'absolute', bottom: 40, left: 20, right: 20, paddingVertical: 16, borderRadius: 14, alignItems: 'center' },
  closeButtonText: { color: '#FFF', fontSize: 17, fontWeight: '600' },
});
