import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Header } from '../../components/common/Header';
import { ScorecardTable } from '../../components/scorecard/ScorecardTable';
import { BallByBall } from '../../components/scorecard/BallByBall';
import { theme } from '../../theme';
import { db } from '../../data/db';

interface Props { matchId?: string; onBack: () => void; }

export const ScorecardScreen: React.FC<Props> = ({ matchId, onBack }) => {
  const [selectedMatch, setSelectedMatch] = useState(matchId || db.matches.getAll()[0]?.id || '');
  const match = db.matches.getById(selectedMatch);
  const innings = match ? db.innings.getByMatch(selectedMatch) : [];
  const [activeInnings, setActiveInnings] = useState(0);
  const current = innings[activeInnings];
  const allMatches = db.matches.getAll();

  return (
    <View style={styles.screen}>
      <Header title="Scorecard" onBack={onBack} />

      {!matchId && (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.matchPicker}>
          {allMatches.map(m => {
            const t1 = db.teams.getById(m.team1Id);
            const t2 = db.teams.getById(m.team2Id);
            return (
              <TouchableOpacity key={m.id} style={[styles.matchChip, selectedMatch === m.id && styles.matchChipActive]} onPress={() => { setSelectedMatch(m.id); setActiveInnings(0); }}>
                <Text style={[styles.matchChipText, selectedMatch === m.id && styles.matchChipTextActive]}>{t1?.name} vs {t2?.name}</Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      )}

      {innings.length > 1 && (
        <View style={styles.inningsTabs}>
          {innings.map((inn, i) => (
            <TouchableOpacity key={inn.id} style={[styles.innTab, activeInnings === i && styles.innTabActive]} onPress={() => setActiveInnings(i)}>
              <Text style={[styles.innTabText, activeInnings === i && styles.innTabTextActive]}>
                {db.teams.getById(inn.battingTeamId)?.name} · {inn.totalRuns}/{inn.wickets}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {current ? (
        <ScrollView showsVerticalScrollIndicator={false} style={styles.scroll}>
          <View style={styles.content}>
            <ScorecardTable
              deliveries={current.deliveries}
              battingPlayers={db.players.getByTeam(current.battingTeamId)}
              bowlingPlayers={db.players.getByTeam(current.bowlingTeamId)}
              extras={current.extras}
              totalRuns={current.totalRuns}
              wickets={current.wickets}
              overs={current.overs}
              balls={current.balls}
            />
            <Text style={styles.bbbTitle}>Ball by Ball</Text>
            <BallByBall deliveries={current.deliveries} />
          </View>
        </ScrollView>
      ) : (
        <View style={styles.empty}>
          <Text style={styles.emptyText}>No scorecard data available</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  screen:             { flex: 1, backgroundColor: theme.colors.background },
  matchPicker:        { borderBottomWidth: 1, borderBottomColor: theme.colors.border, paddingHorizontal: 12, paddingVertical: 10 },
  matchChip:          { paddingHorizontal: 14, paddingVertical: 7, borderRadius: theme.borderRadius.full, borderWidth: 1.5, borderColor: theme.colors.border, backgroundColor: theme.colors.surface, marginRight: 8 },
  matchChipActive:    { borderColor: theme.colors.primary, backgroundColor: theme.colors.primary },
  matchChipText:      { fontSize: 12, fontWeight: '600', color: theme.colors.text.secondary },
  matchChipTextActive:{ color: '#fff' },
  inningsTabs:        { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: theme.colors.border },
  innTab:             { flex: 1, paddingVertical: 12, alignItems: 'center', paddingHorizontal: 6 },
  innTabActive:       { borderBottomWidth: 3, borderBottomColor: theme.colors.primary },
  innTabText:         { fontSize: 12, fontWeight: '600', color: theme.colors.text.muted },
  innTabTextActive:   { color: theme.colors.primary, fontWeight: '700' },
  scroll:             { flex: 1 },
  content:            { padding: 12, paddingBottom: 32 },
  bbbTitle:           { fontSize: 15, fontWeight: '700', color: theme.colors.text.primary, marginTop: 16, marginBottom: 10 },
  empty:              { flex: 1, alignItems: 'center', justifyContent: 'center' },
  emptyText:          { color: theme.colors.text.muted, fontSize: 15 },
});
