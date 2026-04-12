import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Header } from '../../components/common/Header';
import { Badge } from '../../components/common/Badge';
import { Card } from '../../components/common/Card';
import { theme } from '../../theme';
import { db } from '../../data/db';
import { formatDate, formatRunRate } from '../../utils/format';
import { useMatch } from '../../hooks/useMatch';

interface Props { matchId: string; onBack: () => void; onNavigate: (s: string, p?: any) => void; }

export const MatchDetailScreen: React.FC<Props> = ({ matchId, onBack, onNavigate }) => {
  const { match, innings } = useMatch(matchId);
  const [tab, setTab] = useState<'info'|'scorecard'|'commentary'>('info');

  if (!match) return null;

  const t1 = db.teams.getById(match.team1Id);
  const t2 = db.teams.getById(match.team2Id);
  const tournament = db.tournaments.getById(match.tournamentId);
  const tossWinner = db.teams.getById(match.tossWinnerId || '');
  const commentary = db.commentary.getByMatch(matchId);
  const currentInnings = innings.find(i => i.status === 'ongoing');

  const commentaryTypeIcon: Record<string, string> = {
    boundary: '🔵', six: '🟣', wicket: '🔴', wide: '🟡',
    noball: '🟠', milestone: '⚪', normal: '⚫',
  };

  return (
    <View style={styles.screen}>
      <Header title={`${t1?.name} vs ${t2?.name}`} subtitle={tournament?.name} onBack={onBack} />

      {/* Score Header */}
      <View style={styles.scoreHeader}>
        <View style={styles.teamScoreBlock}>
          <Text style={styles.teamNameH}>{t1?.name}</Text>
          {innings.find(i => i.battingTeamId === t1?.id) && (
            <Text style={styles.teamScore}>
              {innings.find(i => i.battingTeamId === t1?.id)?.totalRuns}/
              {innings.find(i => i.battingTeamId === t1?.id)?.wickets}
            </Text>
          )}
        </View>
        <View style={styles.vsBlock}>
          <Badge label={match.status === 'live' ? '🔴 LIVE' : match.status.toUpperCase()} variant={match.status === 'live' ? 'live' : match.status === 'completed' ? 'completed' : 'upcoming'} dot={match.status === 'live'} />
          <Text style={styles.vsSmall}>VS</Text>
        </View>
        <View style={[styles.teamScoreBlock, styles.teamScoreRight]}>
          <Text style={styles.teamNameH}>{t2?.name}</Text>
          {innings.find(i => i.battingTeamId === t2?.id) && (
            <Text style={styles.teamScore}>
              {innings.find(i => i.battingTeamId === t2?.id)?.totalRuns}/
              {innings.find(i => i.battingTeamId === t2?.id)?.wickets}
            </Text>
          )}
        </View>
      </View>

      {/* Tabs */}
      <View style={styles.tabs}>
        {(['info','scorecard','commentary'] as const).map(t => (
          <TouchableOpacity key={t} style={[styles.tab, tab === t && styles.tabActive]} onPress={() => setTab(t)}>
            <Text style={[styles.tabText, tab === t && styles.tabTextActive]}>
              {t === 'info' ? 'Match Info' : t === 'scorecard' ? 'Scorecard' : 'Commentary'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        {tab === 'info' && (
          <View style={styles.tabContent}>
            {[
              { label: 'Venue', value: match.venue },
              { label: 'Date', value: formatDate(match.date) },
              { label: 'Tournament', value: tournament?.name || '—' },
              { label: 'Format', value: `${tournament?.type} · ${tournament?.overs} Overs` },
              { label: 'Powerplay', value: `${tournament?.powerplayOvers} Overs` },
              { label: 'Toss', value: tossWinner ? `${tossWinner.name} won, chose to ${match.tossDecision}` : '—' },
              { label: 'Status', value: match.status.charAt(0).toUpperCase() + match.status.slice(1) },
            ].map(row => (
              <View key={row.label} style={styles.infoRow}>
                <Text style={styles.infoLabel}>{row.label}</Text>
                <Text style={styles.infoValue}>{row.value}</Text>
              </View>
            ))}
            <View style={styles.navBtns}>
              <TouchableOpacity style={styles.navBtn} onPress={() => onNavigate('Scorecard', { matchId })}><Text style={styles.navBtnText}>📋 Full Scorecard</Text></TouchableOpacity>
              <TouchableOpacity style={styles.navBtn} onPress={() => onNavigate('Graph', { matchId })}><Text style={styles.navBtnText}>📊 Stats & Graphs</Text></TouchableOpacity>
            </View>
          </View>
        )}

        {tab === 'scorecard' && innings.map(inn => {
          const battingPlayers = db.players.getByTeam(inn.battingTeamId);
          const bowlingPlayers = db.players.getByTeam(inn.bowlingTeamId);
          const battingTeamName = db.teams.getById(inn.battingTeamId)?.name;
          return (
            <View key={inn.id} style={styles.tabContent}>
              <Text style={styles.inningsTitle}>{battingTeamName} Innings</Text>
              <Text style={styles.inningsScore}>{inn.totalRuns}/{inn.wickets} ({inn.overs}.{inn.balls} Ov)</Text>
              <Text style={styles.inningsRR}>Run Rate: {formatRunRate(inn.totalRuns, inn.overs, inn.balls)}</Text>
            </View>
          );
        })}

        {tab === 'commentary' && (
          <View style={styles.tabContent}>
            {commentary.length === 0 ? (
              <Text style={styles.emptyText}>No commentary yet.</Text>
            ) : (
              [...commentary].reverse().map(c => (
                <View key={c.id} style={[styles.commentaryItem, c.type === 'wicket' && styles.commentaryWicket, c.type === 'six' && styles.commentarySix, c.type === 'boundary' && styles.commentaryBoundary]}>
                  <View style={styles.commentaryHeader}>
                    <Text style={styles.commentaryIcon}>{commentaryTypeIcon[c.type] || '⚫'}</Text>
                    <Text style={styles.commentaryOver}>Over {c.over}.{c.ball}</Text>
                    <Text style={styles.commentaryTime}>{new Date(c.timestamp).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</Text>
                  </View>
                  <Text style={styles.commentaryText}>{c.text}</Text>
                </View>
              ))
            )}
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  screen:            { flex: 1, backgroundColor: theme.colors.background },
  scoreHeader:       { flexDirection: 'row', backgroundColor: theme.colors.primary, paddingHorizontal: 16, paddingVertical: 16, alignItems: 'center' },
  teamScoreBlock:    { flex: 2 },
  teamScoreRight:    { alignItems: 'flex-end' },
  teamNameH:         { fontSize: 14, fontWeight: '700', color: 'rgba(255,255,255,0.85)' },
  teamScore:         { fontSize: 28, fontWeight: '900', color: '#fff', marginTop: 2 },
  vsBlock:           { flex: 1, alignItems: 'center', gap: 4 },
  vsSmall:           { fontSize: 11, color: 'rgba(255,255,255,0.6)', fontWeight: '700', marginTop: 4 },
  tabs:              { flexDirection: 'row', backgroundColor: theme.colors.surface, borderBottomWidth: 1, borderBottomColor: theme.colors.border },
  tab:               { flex: 1, paddingVertical: 14, alignItems: 'center' },
  tabActive:         { borderBottomWidth: 3, borderBottomColor: theme.colors.primary },
  tabText:           { fontSize: 13, fontWeight: '600', color: theme.colors.text.muted },
  tabTextActive:     { color: theme.colors.primary },
  scroll:            { flex: 1 },
  tabContent:        { padding: 16 },
  infoRow:           { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: theme.colors.borderLight },
  infoLabel:         { fontSize: 13, color: theme.colors.text.muted, fontWeight: '500' },
  infoValue:         { fontSize: 13, fontWeight: '600', color: theme.colors.text.primary, flex: 1, textAlign: 'right' },
  navBtns:           { flexDirection: 'row', gap: 12, marginTop: 20 },
  navBtn:            { flex: 1, padding: 14, backgroundColor: theme.colors.surfaceAlt, borderRadius: theme.borderRadius.md, alignItems: 'center', borderWidth: 1.5, borderColor: theme.colors.border },
  navBtnText:        { fontSize: 14, fontWeight: '700', color: theme.colors.primary },
  inningsTitle:      { fontSize: 16, fontWeight: '700', color: theme.colors.text.primary, marginBottom: 4 },
  inningsScore:      { fontSize: 28, fontWeight: '900', color: theme.colors.primary, marginBottom: 4 },
  inningsRR:         { fontSize: 13, color: theme.colors.text.muted },
  emptyText:         { color: theme.colors.text.muted, textAlign: 'center', padding: 32 },
  commentaryItem:    { padding: 12, borderRadius: theme.borderRadius.md, marginBottom: 8, backgroundColor: theme.colors.surface, borderLeftWidth: 4, borderLeftColor: theme.colors.border },
  commentaryWicket:  { borderLeftColor: theme.colors.status.live, backgroundColor: theme.colors.status.liveLight },
  commentarySix:     { borderLeftColor: theme.colors.score.six, backgroundColor: '#F3E5F5' },
  commentaryBoundary:{ borderLeftColor: theme.colors.score.boundary, backgroundColor: '#E3F2FD' },
  commentaryHeader:  { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 6 },
  commentaryIcon:    { fontSize: 14 },
  commentaryOver:    { fontSize: 12, fontWeight: '700', color: theme.colors.text.secondary },
  commentaryTime:    { fontSize: 11, color: theme.colors.text.muted, marginLeft: 'auto' },
  commentaryText:    { fontSize: 14, color: theme.colors.text.primary, lineHeight: 20 },
});
