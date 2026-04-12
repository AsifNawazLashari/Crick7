import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Header } from '../../components/common/Header';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { theme } from '../../theme';
import { db } from '../../data/db';
import { formatDate } from '../../utils/format';

interface Props { tournamentId: string; onBack: () => void; onNavigate: (s: string, p?: any) => void; }

export const TournamentDetailScreen: React.FC<Props> = ({ tournamentId, onBack, onNavigate }) => {
  const tournament = db.tournaments.getById(tournamentId);
  if (!tournament) return null;
  const teams = db.teams.getByTournament(tournamentId);
  const matches = db.matches.getByTournament(tournamentId);

  return (
    <View style={styles.screen}>
      <Header title={tournament.name} subtitle={`${tournament.type} Tournament`} onBack={onBack} />
      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Info Card */}
        <Card style={styles.infoCard}>
          <View style={styles.infoRow}>
            {[
              { label: 'Format', value: tournament.type },
              { label: 'Overs', value: String(tournament.overs) },
              { label: 'Powerplay', value: `${tournament.powerplayOvers} Ov` },
              { label: 'Status', value: tournament.status },
            ].map(i => (
              <View key={i.label} style={styles.infoItem}>
                <Text style={styles.infoLabel}>{i.label}</Text>
                <Text style={styles.infoValue}>{i.value}</Text>
              </View>
            ))}
          </View>
          <Text style={styles.infoDate}>Created {formatDate(tournament.createdAt)}</Text>
        </Card>

        {/* Teams */}
        <Text style={styles.sectionTitle}>Teams ({teams.length})</Text>
        {teams.map(t => {
          const players = db.players.getByTeam(t.id);
          const captain = players.find(p => p.isCaptain);
          return (
            <Card key={t.id} style={styles.teamCard} variant="outlined">
              <View style={styles.teamRow}>
                <View>
                  <Text style={styles.teamName}>{t.name}</Text>
                  <Text style={styles.teamMeta}>{players.length} Players · C: {captain?.name || 'TBD'}</Text>
                </View>
                <Text style={styles.teamArrow}>→</Text>
              </View>
            </Card>
          );
        })}

        {/* Matches */}
        <Text style={styles.sectionTitle}>Fixtures ({matches.length})</Text>
        {matches.map(m => {
          const t1 = db.teams.getById(m.team1Id);
          const t2 = db.teams.getById(m.team2Id);
          const inn = db.innings.getByMatch(m.id);
          return (
            <TouchableOpacity key={m.id} onPress={() => onNavigate('MatchDetail', { matchId: m.id })}>
              <Card style={styles.matchCard} variant="outlined">
                <View style={styles.matchTop}>
                  <Badge label={m.status.toUpperCase()} variant={m.status === 'live' ? 'live' : m.status === 'completed' ? 'completed' : 'upcoming'} dot={m.status === 'live'} />
                  <Text style={styles.matchVenue}>{m.venue}</Text>
                </View>
                <Text style={styles.matchTeams}>{t1?.name} vs {t2?.name}</Text>
                {inn.length > 0 && (
                  <Text style={styles.matchScore}>{inn[0].totalRuns}/{inn[0].wickets} ({inn[0].overs}.{inn[0].balls} Ov)</Text>
                )}
                <Text style={styles.matchDate}>{formatDate(m.date)}</Text>
              </Card>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  screen:      { flex: 1, backgroundColor: theme.colors.background },
  scroll:      { flex: 1 },
  infoCard:    { margin: 16, marginBottom: 0 },
  infoRow:     { flexDirection: 'row', justifyContent: 'space-around', marginBottom: 12 },
  infoItem:    { alignItems: 'center' },
  infoLabel:   { fontSize: 11, color: theme.colors.text.muted, marginBottom: 3, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.5 },
  infoValue:   { fontSize: 16, fontWeight: '700', color: theme.colors.text.primary, textTransform: 'capitalize' },
  infoDate:    { fontSize: 12, color: theme.colors.text.muted, textAlign: 'center' },
  sectionTitle:{ fontSize: 16, fontWeight: '700', color: theme.colors.text.primary, paddingHorizontal: 16, marginTop: 20, marginBottom: 10 },
  teamCard:    { marginHorizontal: 16, marginBottom: 10, padding: 14 },
  teamRow:     { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  teamName:    { fontSize: 16, fontWeight: '700', color: theme.colors.text.primary },
  teamMeta:    { fontSize: 12, color: theme.colors.text.muted, marginTop: 3 },
  teamArrow:   { fontSize: 18, color: theme.colors.text.muted },
  matchCard:   { marginHorizontal: 16, marginBottom: 10, padding: 14 },
  matchTop:    { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  matchVenue:  { fontSize: 12, color: theme.colors.text.muted },
  matchTeams:  { fontSize: 17, fontWeight: '700', color: theme.colors.text.primary },
  matchScore:  { fontSize: 14, color: theme.colors.primary, fontWeight: '600', marginTop: 4 },
  matchDate:   { fontSize: 12, color: theme.colors.text.muted, marginTop: 4 },
});
