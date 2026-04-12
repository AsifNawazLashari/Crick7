import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Header } from '../../components/common/Header';
import { RunRateChart } from '../../components/charts/RunRateChart';
import { PlayerStatsChart } from '../../components/charts/PlayerStatsChart';
import { WagonWheel } from '../../components/charts/WagonWheel';
import { theme } from '../../theme';
import { db } from '../../data/db';

interface Props { matchId?: string; onBack: () => void; }

export const GraphScreen: React.FC<Props> = ({ matchId, onBack }) => {
  const matches = matchId ? [db.matches.getById(matchId)!].filter(Boolean) : db.matches.getAll();
  const [activeMatch, setActiveMatch] = useState(matches[0]?.id || '');
  const [activeView, setActiveView] = useState<'runrate'|'players'|'wagon'>('runrate');

  const match = db.matches.getById(activeMatch);
  const innings = match ? db.innings.getByMatch(match.id) : [];
  const currentInnings = innings.find(i => i.status === 'ongoing') || innings[0];
  const allPlayers = db.players.getAll();
  const tournament = match ? db.tournaments.getById(match.tournamentId) : null;

  const views = [
    { key: 'runrate', label: '📈 Run Rate' },
    { key: 'players', label: '🏏 Players' },
    { key: 'wagon',   label: '🎯 Wagon Wheel' },
  ] as const;

  return (
    <View style={styles.screen}>
      <Header title="Analytics" subtitle="Performance Graphs" onBack={onBack} />

      {/* Match Picker */}
      {!matchId && matches.length > 1 && (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.matchPicker}>
          {matches.map(m => {
            const t1 = db.teams.getById(m.team1Id);
            const t2 = db.teams.getById(m.team2Id);
            return (
              <TouchableOpacity key={m.id} style={[styles.matchChip, activeMatch === m.id && styles.chipActive]} onPress={() => setActiveMatch(m.id)}>
                <Text style={[styles.chipText, activeMatch === m.id && styles.chipTextActive]}>{t1?.name?.split(' ')[0]} vs {t2?.name?.split(' ')[0]}</Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      )}

      {/* Chart Selector */}
      <View style={styles.viewSelector}>
        {views.map(v => (
          <TouchableOpacity key={v.key} style={[styles.viewBtn, activeView === v.key && styles.viewBtnActive]} onPress={() => setActiveView(v.key)}>
            <Text style={[styles.viewBtnText, activeView === v.key && styles.viewBtnTextActive]}>{v.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

        {activeView === 'runrate' && (
          <>
            <Text style={styles.sectionTitle}>Run Rate Chart</Text>
            {currentInnings ? (
              <RunRateChart deliveries={currentInnings.deliveries} powerplayOvers={tournament?.powerplayOvers || 10} />
            ) : (
              <View style={styles.empty}><Text style={styles.emptyText}>No innings data available</Text></View>
            )}
            {/* Innings Summary Cards */}
            {innings.map(inn => {
              const team = db.teams.getById(inn.battingTeamId);
              const rr = inn.overs > 0 ? (inn.totalRuns / (inn.overs + inn.balls / 6)).toFixed(2) : '0.00';
              const extras = inn.extras.wides + inn.extras.noBalls + inn.extras.byes + inn.extras.legByes;
              return (
                <View key={inn.id} style={styles.inningsSummary}>
                  <Text style={styles.innTeamName}>{team?.name} Innings</Text>
                  <View style={styles.innStatRow}>
                    {[
                      { label: 'Runs', value: `${inn.totalRuns}/${inn.wickets}` },
                      { label: 'Overs', value: `${inn.overs}.${inn.balls}` },
                      { label: 'Run Rate', value: rr },
                      { label: 'Extras', value: String(extras) },
                      { label: 'Boundaries', value: String(inn.deliveries.filter(d => d.isBoundary && !d.isSix).length) },
                      { label: 'Sixes', value: String(inn.deliveries.filter(d => d.isSix).length) },
                    ].map(s => (
                      <View key={s.label} style={styles.innStat}>
                        <Text style={styles.innStatVal}>{s.value}</Text>
                        <Text style={styles.innStatLbl}>{s.label}</Text>
                      </View>
                    ))}
                  </View>
                </View>
              );
            })}
          </>
        )}

        {activeView === 'players' && (
          <>
            <Text style={styles.sectionTitle}>Batting Leaders</Text>
            <PlayerStatsChart players={allPlayers} type="batting" />
            <Text style={[styles.sectionTitle, { marginTop: 20 }]}>Bowling Leaders</Text>
            <PlayerStatsChart players={allPlayers} type="bowling" />
          </>
        )}

        {activeView === 'wagon' && (
          <>
            <Text style={styles.sectionTitle}>Wagon Wheel</Text>
            {currentInnings ? (
              <>
                <WagonWheel deliveries={currentInnings.deliveries} />
                <Text style={styles.subTitle}>By Batsman</Text>
                {db.players.getByTeam(currentInnings.battingTeamId).map(p => (
                  <View key={p.id} style={styles.playerWagonWrap}>
                    <Text style={styles.playerWagonName}>{p.name}</Text>
                    <WagonWheel deliveries={currentInnings.deliveries} batsmanId={p.id} />
                  </View>
                ))}
              </>
            ) : (
              <View style={styles.empty}><Text style={styles.emptyText}>No delivery data available</Text></View>
            )}
          </>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  screen:          { flex: 1, backgroundColor: theme.colors.background },
  matchPicker:     { paddingHorizontal: 12, paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: theme.colors.border, flexGrow: 0 },
  matchChip:       { paddingHorizontal: 14, paddingVertical: 7, borderRadius: theme.borderRadius.full, borderWidth: 1.5, borderColor: theme.colors.border, marginRight: 8, backgroundColor: theme.colors.surface },
  chipActive:      { borderColor: theme.colors.primary, backgroundColor: theme.colors.primary },
  chipText:        { fontSize: 12, fontWeight: '600', color: theme.colors.text.secondary },
  chipTextActive:  { color: '#fff' },
  viewSelector:    { flexDirection: 'row', padding: 12, gap: 8, backgroundColor: theme.colors.surface, borderBottomWidth: 1, borderBottomColor: theme.colors.border },
  viewBtn:         { flex: 1, paddingVertical: 9, borderRadius: theme.borderRadius.md, borderWidth: 1.5, borderColor: theme.colors.border, alignItems: 'center' },
  viewBtnActive:   { borderColor: theme.colors.primary, backgroundColor: theme.colors.primary },
  viewBtnText:     { fontSize: 12, fontWeight: '600', color: theme.colors.text.secondary },
  viewBtnTextActive:{ color: '#fff' },
  scroll:          { flex: 1 },
  content:         { padding: 16, paddingBottom: 40 },
  sectionTitle:    { fontSize: 16, fontWeight: '700', color: theme.colors.text.primary, marginBottom: 12 },
  subTitle:        { fontSize: 14, fontWeight: '600', color: theme.colors.text.secondary, marginTop: 16, marginBottom: 8 },
  inningsSummary:  { backgroundColor: theme.colors.surface, borderRadius: theme.borderRadius.lg, padding: 14, marginTop: 16, ...theme.shadows.sm },
  innTeamName:     { fontSize: 15, fontWeight: '700', color: theme.colors.text.primary, marginBottom: 12 },
  innStatRow:      { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', gap: 8 },
  innStat:         { alignItems: 'center', width: '30%' },
  innStatVal:      { fontSize: 17, fontWeight: '800', color: theme.colors.primary },
  innStatLbl:      { fontSize: 10, color: theme.colors.text.muted, marginTop: 2, textAlign: 'center' },
  playerWagonWrap: { marginTop: 16, backgroundColor: theme.colors.surface, borderRadius: theme.borderRadius.lg, padding: 12, ...theme.shadows.sm },
  playerWagonName: { fontSize: 14, fontWeight: '700', color: theme.colors.text.primary, marginBottom: 8 },
  empty:           { padding: 32, alignItems: 'center' },
  emptyText:       { color: theme.colors.text.muted },
});
