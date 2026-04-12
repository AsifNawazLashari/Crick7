import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, FlatList } from 'react-native';
import { Header } from '../../components/common/Header';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { theme } from '../../theme';
import { db } from '../../data/db';

interface Props { onBack: () => void; }

export const StatsScreen: React.FC<Props> = ({ onBack }) => {
  const [activeTab, setActiveTab] = useState<'batting'|'bowling'|'team'>('batting');
  const [selectedTeam, setSelectedTeam] = useState<string>('all');

  const teams = db.teams.getAll();
  const allPlayers = db.players.getAll();
  const players = selectedTeam === 'all' ? allPlayers : allPlayers.filter(p => p.teamId === selectedTeam);

  const battingLeaders = [...players].sort((a, b) => b.stats.runs - a.stats.runs);
  const bowlingLeaders = [...players].sort((a, b) => b.stats.wickets - a.stats.wickets);

  const teamStats = teams.map(t => {
    const tp = db.players.getByTeam(t.id);
    const totalRuns = tp.reduce((s, p) => s + p.stats.runs, 0);
    const totalWickets = tp.reduce((s, p) => s + p.stats.wickets, 0);
    const matches = tp.length > 0 ? Math.max(...tp.map(p => p.stats.matches)) : 0;
    return { ...t, totalRuns, totalWickets, matches, playerCount: tp.length };
  });

  return (
    <View style={styles.screen}>
      <Header title="Stats Center" subtitle="Player & Team Analytics" onBack={onBack} />

      {/* Team Filter */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.teamFilter}>
        <TouchableOpacity style={[styles.teamChip, selectedTeam === 'all' && styles.chipActive]} onPress={() => setSelectedTeam('all')}>
          <Text style={[styles.chipText, selectedTeam === 'all' && styles.chipTextActive]}>All Teams</Text>
        </TouchableOpacity>
        {teams.map(t => (
          <TouchableOpacity key={t.id} style={[styles.teamChip, selectedTeam === t.id && styles.chipActive]} onPress={() => setSelectedTeam(t.id)}>
            <Text style={[styles.chipText, selectedTeam === t.id && styles.chipTextActive]}>{t.name}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Tabs */}
      <View style={styles.tabs}>
        {(['batting','bowling','team'] as const).map(t => (
          <TouchableOpacity key={t} style={[styles.tab, activeTab === t && styles.tabActive]} onPress={() => setActiveTab(t)}>
            <Text style={[styles.tabText, activeTab === t && styles.tabTextActive]}>
              {t === 'batting' ? '🏏 Batting' : t === 'bowling' ? '⚾ Bowling' : '🏆 Teams'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        {activeTab === 'batting' && (
          <View style={styles.content}>
            {/* Header Row */}
            <View style={styles.tableHeader}>
              <Text style={[styles.col, styles.colPlayer, styles.headerText]}>Player</Text>
              <Text style={[styles.col, styles.colNum, styles.headerText]}>M</Text>
              <Text style={[styles.col, styles.colNum, styles.headerText]}>R</Text>
              <Text style={[styles.col, styles.colNum, styles.headerText]}>HS</Text>
              <Text style={[styles.col, styles.colNum, styles.headerText]}>Avg</Text>
              <Text style={[styles.col, styles.colNum, styles.headerText]}>SR</Text>
            </View>
            {battingLeaders.map((p, i) => (
              <View key={p.id} style={[styles.tableRow, i % 2 === 0 && styles.rowAlt, i === 0 && styles.topRow]}>
                <View style={[styles.col, styles.colPlayer]}>
                  {i === 0 && <Text style={styles.crownIcon}>👑</Text>}
                  <Text style={styles.playerName}>{p.name}</Text>
                  <Text style={styles.teamName}>{db.teams.getById(p.teamId)?.name}</Text>
                </View>
                <Text style={[styles.col, styles.colNum, styles.statCell]}>{p.stats.matches}</Text>
                <Text style={[styles.col, styles.colNum, i === 0 ? styles.topStat : styles.statCell]}>{p.stats.runs}</Text>
                <Text style={[styles.col, styles.colNum, styles.statCell]}>{p.stats.highScore}</Text>
                <Text style={[styles.col, styles.colNum, styles.statCell]}>{p.stats.average.toFixed(1)}</Text>
                <Text style={[styles.col, styles.colNum, styles.statCell]}>{p.stats.strikeRate.toFixed(1)}</Text>
              </View>
            ))}
          </View>
        )}

        {activeTab === 'bowling' && (
          <View style={styles.content}>
            <View style={styles.tableHeader}>
              <Text style={[styles.col, styles.colPlayer, styles.headerText]}>Bowler</Text>
              <Text style={[styles.col, styles.colNum, styles.headerText]}>M</Text>
              <Text style={[styles.col, styles.colNum, styles.headerText]}>W</Text>
              <Text style={[styles.col, styles.colNum, styles.headerText]}>R</Text>
              <Text style={[styles.col, styles.colNum, styles.headerText]}>Eco</Text>
              <Text style={[styles.col, styles.colNum, styles.headerText]}>BB</Text>
            </View>
            {bowlingLeaders.map((p, i) => (
              <View key={p.id} style={[styles.tableRow, i % 2 === 0 && styles.rowAlt, i === 0 && styles.topRow]}>
                <View style={[styles.col, styles.colPlayer]}>
                  {i === 0 && <Text style={styles.crownIcon}>👑</Text>}
                  <Text style={styles.playerName}>{p.name}</Text>
                  <Text style={styles.teamName}>{db.teams.getById(p.teamId)?.name}</Text>
                </View>
                <Text style={[styles.col, styles.colNum, styles.statCell]}>{p.stats.matches}</Text>
                <Text style={[styles.col, styles.colNum, i === 0 ? styles.topStat : styles.statCell]}>{p.stats.wickets}</Text>
                <Text style={[styles.col, styles.colNum, styles.statCell]}>{p.stats.runsConceded}</Text>
                <Text style={[styles.col, styles.colNum, styles.statCell]}>{p.stats.economy.toFixed(2)}</Text>
                <Text style={[styles.col, styles.colNum, styles.statCell]}>{p.stats.bestBowling}</Text>
              </View>
            ))}
          </View>
        )}

        {activeTab === 'team' && (
          <View style={styles.content}>
            {teamStats.map(t => (
              <Card key={t.id} style={styles.teamCard} variant="outlined">
                <Text style={styles.tName}>{t.name}</Text>
                <View style={styles.teamStatGrid}>
                  {[
                    { label: 'Players', value: t.playerCount },
                    { label: 'Total Runs', value: t.totalRuns },
                    { label: 'Total Wkts', value: t.totalWickets },
                    { label: 'Matches', value: t.matches },
                  ].map(s => (
                    <View key={s.label} style={styles.teamStatItem}>
                      <Text style={styles.teamStatVal}>{s.value}</Text>
                      <Text style={styles.teamStatLbl}>{s.label}</Text>
                    </View>
                  ))}
                </View>
              </Card>
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  screen:       { flex: 1, backgroundColor: theme.colors.background },
  teamFilter:   { paddingHorizontal: 12, paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: theme.colors.border, flexGrow: 0 },
  teamChip:     { paddingHorizontal: 14, paddingVertical: 7, borderRadius: theme.borderRadius.full, borderWidth: 1.5, borderColor: theme.colors.border, marginRight: 8, backgroundColor: theme.colors.surface },
  chipActive:   { borderColor: theme.colors.primary, backgroundColor: theme.colors.primary },
  chipText:     { fontSize: 12, fontWeight: '600', color: theme.colors.text.secondary },
  chipTextActive:{ color: '#fff' },
  tabs:         { flexDirection: 'row', backgroundColor: theme.colors.surface, borderBottomWidth: 1, borderBottomColor: theme.colors.border },
  tab:          { flex: 1, paddingVertical: 13, alignItems: 'center' },
  tabActive:    { borderBottomWidth: 3, borderBottomColor: theme.colors.primary },
  tabText:      { fontSize: 13, fontWeight: '600', color: theme.colors.text.muted },
  tabTextActive:{ color: theme.colors.primary },
  scroll:       { flex: 1 },
  content:      { paddingBottom: 24 },
  tableHeader:  { flexDirection: 'row', backgroundColor: theme.colors.primary, paddingHorizontal: 12, paddingVertical: 10 },
  headerText:   { fontSize: 11, fontWeight: '700', color: 'rgba(255,255,255,0.9)', textTransform: 'uppercase', letterSpacing: 0.5 },
  tableRow:     { flexDirection: 'row', paddingHorizontal: 12, paddingVertical: 10, alignItems: 'center' },
  rowAlt:       { backgroundColor: theme.colors.surfaceAlt },
  topRow:       { backgroundColor: '#F0FAF5', borderBottomWidth: 2, borderBottomColor: theme.colors.primary },
  col:          {},
  colPlayer:    { flex: 2.5 },
  colNum:       { flex: 1, textAlign: 'center' },
  crownIcon:    { fontSize: 12 },
  playerName:   { fontSize: 14, fontWeight: '700', color: theme.colors.text.primary },
  teamName:     { fontSize: 11, color: theme.colors.text.muted, marginTop: 1 },
  statCell:     { fontSize: 13, color: theme.colors.text.secondary, textAlign: 'center' },
  topStat:      { fontSize: 15, fontWeight: '800', color: theme.colors.primary, textAlign: 'center' },
  teamCard:     { margin: 12, marginBottom: 0, padding: 16 },
  tName:        { fontSize: 18, fontWeight: '700', color: theme.colors.text.primary, marginBottom: 12 },
  teamStatGrid: { flexDirection: 'row', justifyContent: 'space-around' },
  teamStatItem: { alignItems: 'center' },
  teamStatVal:  { fontSize: 22, fontWeight: '800', color: theme.colors.primary },
  teamStatLbl:  { fontSize: 11, color: theme.colors.text.muted, marginTop: 3 },
});
