import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { Header } from '../../components/common/Header';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { theme } from '../../theme';
import { db } from '../../data/db';
import { formatDate, formatScore } from '../../utils/format';

interface Props { onBack: () => void; onNavigate: (s: string, p?: any) => void; }

export const FixtureScreen: React.FC<Props> = ({ onBack, onNavigate }) => {
  const [filter, setFilter] = useState<'all'|'upcoming'|'live'|'completed'>('all');
  const allMatches = db.matches.getAll();
  const matches = filter === 'all' ? allMatches : allMatches.filter(m => m.status === filter);

  return (
    <View style={styles.screen}>
      <Header title="Fixtures" subtitle="Match Schedule" onBack={onBack} />
      <View style={styles.filters}>
        {(['all','upcoming','live','completed'] as const).map(f => (
          <TouchableOpacity key={f} style={[styles.filterBtn, filter === f && styles.filterActive]} onPress={() => setFilter(f)}>
            <Text style={[styles.filterText, filter === f && styles.filterTextActive]}>
              {f === 'all' ? 'All' : f.charAt(0).toUpperCase() + f.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      <FlatList
        data={matches}
        keyExtractor={m => m.id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        renderItem={({ item: m }) => {
          const t1 = db.teams.getById(m.team1Id);
          const t2 = db.teams.getById(m.team2Id);
          const innings = db.innings.getByMatch(m.id);
          const tournament = db.tournaments.getById(m.tournamentId);
          return (
            <TouchableOpacity onPress={() => onNavigate('MatchDetail', { matchId: m.id })} activeOpacity={0.8}>
              <Card style={styles.matchCard} variant={m.status === 'live' ? 'elevated' : 'outlined'}>
                <View style={styles.matchHeader}>
                  <Badge
                    label={m.status === 'live' ? '🔴 LIVE' : m.status.toUpperCase()}
                    variant={m.status === 'live' ? 'live' : m.status === 'completed' ? 'completed' : 'upcoming'}
                    dot={m.status === 'live'}
                  />
                  <Text style={styles.tournament}>{tournament?.name}</Text>
                </View>
                <View style={styles.teamsRow}>
                  <View style={styles.teamCol}>
                    <Text style={styles.teamName}>{t1?.name}</Text>
                    {innings[0] && <Text style={styles.score}>{formatScore(innings[0].totalRuns, innings[0].wickets)}</Text>}
                    {innings[0] && <Text style={styles.overs}>({innings[0].overs}.{innings[0].balls} Ov)</Text>}
                  </View>
                  <View style={styles.vs}><Text style={styles.vsText}>VS</Text></View>
                  <View style={[styles.teamCol, styles.teamColRight]}>
                    <Text style={styles.teamName}>{t2?.name}</Text>
                    {innings[1] && <Text style={styles.score}>{formatScore(innings[1].totalRuns, innings[1].wickets)}</Text>}
                    {innings[1] && <Text style={styles.overs}>({innings[1].overs}.{innings[1].balls} Ov)</Text>}
                  </View>
                </View>
                <View style={styles.matchFooter}>
                  <Text style={styles.venue}>📍 {m.venue}</Text>
                  <Text style={styles.date}>{formatDate(m.date)}</Text>
                </View>
              </Card>
            </TouchableOpacity>
          );
        }}
        ListEmptyComponent={<Text style={styles.empty}>No matches found</Text>}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  screen:      { flex: 1, backgroundColor: theme.colors.background },
  filters:     { flexDirection: 'row', paddingHorizontal: 16, paddingVertical: 12, gap: 8 },
  filterBtn:   { paddingHorizontal: 14, paddingVertical: 7, borderRadius: theme.borderRadius.full, borderWidth: 1.5, borderColor: theme.colors.border, backgroundColor: theme.colors.surface },
  filterActive:{ borderColor: theme.colors.primary, backgroundColor: theme.colors.primary },
  filterText:  { fontSize: 13, fontWeight: '600', color: theme.colors.text.secondary },
  filterTextActive: { color: '#fff' },
  list:        { paddingHorizontal: 16, paddingBottom: 24 },
  matchCard:   { marginBottom: 12, padding: 14 },
  matchHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  tournament:  { fontSize: 11, color: theme.colors.text.muted, fontWeight: '500' },
  teamsRow:    { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  teamCol:     { flex: 2 },
  teamColRight:{ alignItems: 'flex-end' },
  teamName:    { fontSize: 16, fontWeight: '700', color: theme.colors.text.primary },
  score:       { fontSize: 22, fontWeight: '800', color: theme.colors.primary, marginTop: 4 },
  overs:       { fontSize: 12, color: theme.colors.text.muted },
  vs:          { flex: 1, alignItems: 'center' },
  vsText:      { fontSize: 12, fontWeight: '700', color: theme.colors.text.muted, backgroundColor: theme.colors.surfaceAlt, paddingHorizontal: 8, paddingVertical: 4, borderRadius: theme.borderRadius.sm },
  matchFooter: { flexDirection: 'row', justifyContent: 'space-between', borderTopWidth: 1, borderTopColor: theme.colors.borderLight, paddingTop: 8 },
  venue:       { fontSize: 12, color: theme.colors.text.muted },
  date:        { fontSize: 12, color: theme.colors.text.muted },
  empty:       { textAlign: 'center', color: theme.colors.text.muted, padding: 40 },
});
