import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { Header } from '../../components/common/Header';
import { Badge } from '../../components/common/Badge';
import { theme } from '../../theme';
import { db } from '../../data/db';
import { Commentary } from '../../types';

interface Props { matchId?: string; onBack: () => void; }

const TYPE_COLORS: Record<string, { border: string; bg: string; icon: string }> = {
  boundary: { border: theme.colors.score.boundary, bg: '#E3F2FD', icon: '🔵' },
  six:      { border: theme.colors.score.six, bg: '#F3E5F5', icon: '🟣' },
  wicket:   { border: theme.colors.status.live, bg: theme.colors.status.liveLight, icon: '🔴' },
  wide:     { border: theme.colors.score.extra, bg: '#FFF3E0', icon: '🟡' },
  noball:   { border: '#FF5722', bg: '#FBE9E7', icon: '🟠' },
  milestone:{ border: theme.colors.primary, bg: '#F0FAF5', icon: '⭐' },
  normal:   { border: theme.colors.border, bg: theme.colors.surface, icon: '⚫' },
};

export const CommentaryScreen: React.FC<Props> = ({ matchId, onBack }) => {
  const matches = matchId ? [db.matches.getById(matchId)!].filter(Boolean) : db.matches.getAll();
  const [activeMatch, setActiveMatch] = useState(matches[0]?.id || '');
  const [filter, setFilter] = useState<string>('all');

  const allCommentary = db.commentary.getByMatch(activeMatch);
  const filtered = filter === 'all' ? allCommentary : allCommentary.filter(c => c.type === filter);
  const sorted = [...filtered].reverse();

  const filterTypes = ['all', 'boundary', 'six', 'wicket', 'milestone', 'wide', 'noball'];

  const match = db.matches.getById(activeMatch);
  const t1 = db.teams.getById(match?.team1Id || '');
  const t2 = db.teams.getById(match?.team2Id || '');

  return (
    <View style={styles.screen}>
      <Header title="Commentary" subtitle="Ball-by-Ball" onBack={onBack} />

      {/* Match Selector */}
      {!matchId && matches.length > 1 && (
        <View style={styles.matchRow}>
          {matches.map(m => {
            const mt1 = db.teams.getById(m.team1Id);
            const mt2 = db.teams.getById(m.team2Id);
            return (
              <TouchableOpacity key={m.id} style={[styles.matchChip, activeMatch === m.id && styles.matchChipActive]} onPress={() => setActiveMatch(m.id)}>
                <Text style={[styles.matchChipText, activeMatch === m.id && styles.matchChipTextActive]}>{mt1?.name?.split(' ')[0]} vs {mt2?.name?.split(' ')[0]}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
      )}

      {/* Header Banner */}
      <View style={styles.banner}>
        <View style={styles.bannerLeft}>
          {match?.status === 'live' && <Badge label="LIVE" variant="live" dot />}
          <Text style={styles.bannerMatch}>{t1?.name} vs {t2?.name}</Text>
        </View>
        <Text style={styles.bannerCount}>{allCommentary.length} entries</Text>
      </View>

      {/* Filters */}
      <FlatList
        horizontal
        data={filterTypes}
        keyExtractor={t => t}
        showsHorizontalScrollIndicator={false}
        style={styles.filterList}
        renderItem={({ item: f }) => (
          <TouchableOpacity style={[styles.filterBtn, filter === f && styles.filterActive]} onPress={() => setFilter(f)}>
            <Text style={[styles.filterText, filter === f && styles.filterTextActive]}>
              {f === 'all' ? 'All' : TYPE_COLORS[f]?.icon + ' ' + f.charAt(0).toUpperCase() + f.slice(1)}
            </Text>
          </TouchableOpacity>
        )}
      />

      {/* Commentary List */}
      <FlatList
        data={sorted}
        keyExtractor={c => c.id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        renderItem={({ item: c }) => {
          const typeStyle = TYPE_COLORS[c.type] || TYPE_COLORS.normal;
          return (
            <View style={[styles.commentaryCard, { borderLeftColor: typeStyle.border, backgroundColor: typeStyle.bg }]}>
              <View style={styles.cardHeader}>
                <Text style={styles.typeIcon}>{typeStyle.icon}</Text>
                <View style={styles.overBadge}>
                  <Text style={styles.overText}>Over {c.over}.{c.ball}</Text>
                </View>
                {c.type !== 'normal' && (
                  <Badge label={c.type.toUpperCase()} variant={c.type === 'wicket' ? 'live' : c.type === 'six' ? 'primary' : c.type === 'boundary' ? 'secondary' : 'upcoming'} size="sm" />
                )}
                <Text style={styles.timeText}>{new Date(c.timestamp).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</Text>
              </View>
              <Text style={styles.commentaryText}>{c.text}</Text>
            </View>
          );
        }}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyIcon}>🎙</Text>
            <Text style={styles.emptyText}>No commentary yet.</Text>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  screen:              { flex: 1, backgroundColor: theme.colors.background },
  matchRow:            { flexDirection: 'row', padding: 12, gap: 8 },
  matchChip:           { paddingHorizontal: 12, paddingVertical: 6, borderRadius: theme.borderRadius.full, borderWidth: 1.5, borderColor: theme.colors.border },
  matchChipActive:     { borderColor: theme.colors.primary, backgroundColor: theme.colors.primary },
  matchChipText:       { fontSize: 12, fontWeight: '600', color: theme.colors.text.secondary },
  matchChipTextActive: { color: '#fff' },
  banner:              { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: theme.colors.primary, paddingHorizontal: 16, paddingVertical: 12 },
  bannerLeft:          { flexDirection: 'row', alignItems: 'center', gap: 8 },
  bannerMatch:         { fontSize: 15, fontWeight: '700', color: '#fff' },
  bannerCount:         { fontSize: 12, color: 'rgba(255,255,255,0.7)' },
  filterList:          { paddingHorizontal: 12, paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: theme.colors.border, flexGrow: 0 },
  filterBtn:           { paddingHorizontal: 14, paddingVertical: 7, borderRadius: theme.borderRadius.full, borderWidth: 1.5, borderColor: theme.colors.border, marginRight: 8, backgroundColor: theme.colors.surface },
  filterActive:        { borderColor: theme.colors.primary, backgroundColor: theme.colors.primary },
  filterText:          { fontSize: 12, fontWeight: '600', color: theme.colors.text.secondary },
  filterTextActive:    { color: '#fff' },
  list:                { padding: 12 },
  commentaryCard:      { borderLeftWidth: 4, borderRadius: theme.borderRadius.md, padding: 14, marginBottom: 10, ...theme.shadows.sm },
  cardHeader:          { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 8 },
  typeIcon:            { fontSize: 16 },
  overBadge:           { backgroundColor: 'rgba(0,0,0,0.08)', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 12 },
  overText:            { fontSize: 11, fontWeight: '700', color: theme.colors.text.primary },
  timeText:            { fontSize: 11, color: theme.colors.text.muted, marginLeft: 'auto' },
  commentaryText:      { fontSize: 15, color: theme.colors.text.primary, lineHeight: 22, fontWeight: '400' },
  empty:               { alignItems: 'center', padding: 48 },
  emptyIcon:           { fontSize: 48, marginBottom: 12 },
  emptyText:           { fontSize: 15, color: theme.colors.text.muted },
});
