import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Header } from '../../components/common/Header';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { theme } from '../../theme';
import { db } from '../../data/db';
import { formatDate, formatScore } from '../../utils/format';

interface Props { onNavigate: (s: string, p?: any) => void; onLogout: () => void; }

export const HomeScreen: React.FC<Props> = ({ onNavigate, onLogout }) => {
  const user = db.auth.getCurrentUser()!;
  const liveMatches = db.matches.getLive();
  const allMatches  = db.matches.getAll();
  const tournaments = db.tournaments.getAll();

  return (
    <View style={styles.screen}>
      <Header title="Cricket A7" subtitle="Live Scores & Stats" rightAction={{ icon: '⚙️', onPress: onLogout }} />
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Welcome */}
        <View style={styles.welcome}>
          <Text style={styles.welcomeText}>Welcome, {user.name.split(' ')[0]} 👋</Text>
          <Text style={styles.welcomeSub}>Here's what's happening today</Text>
        </View>

        {/* Live matches */}
        {liveMatches.length > 0 && (
          <>
            <View style={styles.sectionHeader}>
              <Badge label="LIVE NOW" variant="live" dot />
            </View>
            {liveMatches.map(m => {
              const t1 = db.teams.getById(m.team1Id);
              const t2 = db.teams.getById(m.team2Id);
              const innings = db.innings.getByMatch(m.id);
              const current = innings.find(i => i.status === 'ongoing');
              const tournament = db.tournaments.getById(m.tournamentId);
              return (
                <TouchableOpacity key={m.id} onPress={() => onNavigate('MatchDetail', { matchId: m.id })} activeOpacity={0.85}>
                  <Card style={styles.liveCard}>
                    <View style={styles.liveTop}>
                      <Text style={styles.liveTournament}>{tournament?.name}</Text>
                      <Text style={styles.liveVenue}>{m.venue}</Text>
                    </View>
                    <View style={styles.liveTeams}>
                      <View style={styles.teamBlock}>
                        <Text style={styles.liveTeamName}>{t1?.name}</Text>
                        {innings[0] && <Text style={styles.liveScore}>{formatScore(innings[0].totalRuns, innings[0].wickets)}</Text>}
                        {innings[0] && <Text style={styles.liveOvers}>({innings[0].overs}.{innings[0].balls} Ov)</Text>}
                      </View>
                      <Text style={styles.vsText}>VS</Text>
                      <View style={[styles.teamBlock, styles.teamBlockRight]}>
                        <Text style={styles.liveTeamName}>{t2?.name}</Text>
                        {innings[1] && <Text style={styles.liveScore}>{formatScore(innings[1].totalRuns, innings[1].wickets)}</Text>}
                      </View>
                    </View>
                    {current && (
                      <View style={styles.liveFooter}>
                        <Text style={styles.liveFooterText}>
                          Batting: {db.teams.getById(current.battingTeamId)?.name} · CRR: {(current.totalRuns / Math.max(current.overs + current.balls/6, 0.1)).toFixed(2)}
                        </Text>
                      </View>
                    )}
                  </Card>
                </TouchableOpacity>
              );
            })}
          </>
        )}

        {/* Recent matches */}
        <Text style={styles.sectionTitle}>All Matches</Text>
        {allMatches.map(m => {
          const t1 = db.teams.getById(m.team1Id);
          const t2 = db.teams.getById(m.team2Id);
          const innings = db.innings.getByMatch(m.id);
          return (
            <TouchableOpacity key={m.id} onPress={() => onNavigate('MatchDetail', { matchId: m.id })} activeOpacity={0.8}>
              <Card style={styles.matchCard} variant="outlined">
                <View style={styles.matchTop}>
                  <Badge label={m.status.toUpperCase()} variant={m.status === 'live' ? 'live' : m.status === 'completed' ? 'completed' : 'upcoming'} size="sm" />
                  <Text style={styles.matchDate}>{formatDate(m.date)}</Text>
                </View>
                <Text style={styles.matchTeams}>{t1?.name} vs {t2?.name}</Text>
                {innings[0] && <Text style={styles.matchScore}>{formatScore(innings[0].totalRuns, innings[0].wickets)} ({innings[0].overs}.{innings[0].balls} Ov)</Text>}
                <Text style={styles.matchVenue}>📍 {m.venue}</Text>
              </Card>
            </TouchableOpacity>
          );
        })}

        {/* Tournaments */}
        <Text style={styles.sectionTitle}>Tournaments</Text>
        {tournaments.map(t => (
          <Card key={t.id} style={styles.tournamentCard} variant="outlined">
            <View style={styles.tournamentRow}>
              <View>
                <Text style={styles.tournamentName}>{t.name}</Text>
                <Text style={styles.tournamentMeta}>{t.type} · {t.overs} Overs</Text>
              </View>
              <Badge label={t.status} variant={t.status as any} />
            </View>
          </Card>
        ))}

        <View style={styles.footer}>
          <Text style={styles.footerText}>Cricket A7 · Made by Asif Nawaz Lashari · A7 Studio</Text>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  screen:          { flex: 1, backgroundColor: theme.colors.background },
  welcome:         { padding: 16, paddingBottom: 4 },
  welcomeText:     { fontSize: 22, fontWeight: '800', color: theme.colors.text.primary },
  welcomeSub:      { fontSize: 13, color: theme.colors.text.muted, marginTop: 2 },
  sectionHeader:   { paddingHorizontal: 16, paddingTop: 16, paddingBottom: 8 },
  sectionTitle:    { fontSize: 16, fontWeight: '700', color: theme.colors.text.primary, paddingHorizontal: 16, marginTop: 16, marginBottom: 10 },
  liveCard:        { marginHorizontal: 16, marginBottom: 12, padding: 16, borderWidth: 2, borderColor: theme.colors.status.live, ...theme.shadows.md },
  liveTop:         { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
  liveTournament:  { fontSize: 12, fontWeight: '600', color: theme.colors.text.muted },
  liveVenue:       { fontSize: 11, color: theme.colors.text.muted },
  liveTeams:       { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  teamBlock:       { flex: 2 },
  teamBlockRight:  { alignItems: 'flex-end' },
  liveTeamName:    { fontSize: 15, fontWeight: '700', color: theme.colors.text.primary },
  liveScore:       { fontSize: 26, fontWeight: '800', color: theme.colors.primary, marginTop: 3 },
  liveOvers:       { fontSize: 11, color: theme.colors.text.muted },
  vsText:          { flex: 1, textAlign: 'center', fontSize: 11, fontWeight: '700', color: theme.colors.text.muted },
  liveFooter:      { borderTopWidth: 1, borderTopColor: theme.colors.borderLight, paddingTop: 8 },
  liveFooterText:  { fontSize: 12, color: theme.colors.text.secondary },
  matchCard:       { marginHorizontal: 16, marginBottom: 10, padding: 14 },
  matchTop:        { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  matchDate:       { fontSize: 11, color: theme.colors.text.muted },
  matchTeams:      { fontSize: 16, fontWeight: '700', color: theme.colors.text.primary },
  matchScore:      { fontSize: 14, color: theme.colors.primary, fontWeight: '600', marginTop: 3 },
  matchVenue:      { fontSize: 12, color: theme.colors.text.muted, marginTop: 4 },
  tournamentCard:  { marginHorizontal: 16, marginBottom: 10, padding: 14 },
  tournamentRow:   { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  tournamentName:  { fontSize: 16, fontWeight: '700', color: theme.colors.text.primary },
  tournamentMeta:  { fontSize: 12, color: theme.colors.text.muted, marginTop: 3 },
  footer:          { padding: 24, alignItems: 'center' },
  footerText:      { fontSize: 11, color: theme.colors.text.muted },
});
