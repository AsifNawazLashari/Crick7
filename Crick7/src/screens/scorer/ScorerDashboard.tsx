import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Header } from '../../components/common/Header';
import { Badge } from '../../components/common/Badge';
import { Card } from '../../components/common/Card';
import { theme } from '../../theme';
import { db } from '../../data/db';
import { formatDate } from '../../utils/format';

interface Props { onNavigate: (s: string, p?: any) => void; onLogout: () => void; }

export const ScorerDashboard: React.FC<Props> = ({ onNavigate, onLogout }) => {
  const user = db.auth.getCurrentUser()!;
  const liveMatches = db.matches.getLive();
  const allMatches = db.matches.getAll();

  return (
    <View style={styles.screen}>
      <Header title="Cricket A7" subtitle="Scorer Panel" rightAction={{ icon: '⚙️', onPress: onLogout }} />
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.banner}>
          <Badge label="SCORER" variant="accent" />
          <Text style={styles.bannerName}>{user.name}</Text>
          <Text style={styles.bannerSub}>Live Match Scorer</Text>
        </View>

        {liveMatches.length > 0 && (
          <View style={styles.liveSection}>
            <Text style={styles.sectionTitle}>🔴 Live Matches</Text>
            {liveMatches.map(m => {
              const t1 = db.teams.getById(m.team1Id);
              const t2 = db.teams.getById(m.team2Id);
              const innings = db.innings.getByMatch(m.id);
              const curr = innings.find(i => i.status === 'ongoing');
              return (
                <TouchableOpacity key={m.id} onPress={() => onNavigate('LiveScoring', { matchId: m.id })} activeOpacity={0.8}>
                  <Card style={styles.liveCard} variant="elevated">
                    <View style={styles.liveTop}>
                      <Badge label="LIVE" variant="live" dot />
                      <Text style={styles.liveVenue}>{m.venue}</Text>
                    </View>
                    <Text style={styles.liveTeams}>{t1?.name} vs {t2?.name}</Text>
                    {curr && (
                      <Text style={styles.liveScore}>
                        {curr.totalRuns}/{curr.wickets} ({curr.overs}.{curr.balls} Ov)
                      </Text>
                    )}
                    <View style={styles.scoreNowBtn}>
                      <Text style={styles.scoreNowText}>Tap to Score →</Text>
                    </View>
                  </Card>
                </TouchableOpacity>
              );
            })}
          </View>
        )}

        <View style={styles.menuGrid}>
          {[
            { label: 'Enter Token',   icon: '🔑', screen: 'TokenEntry',  desc: 'Use organizer token' },
            { label: 'Live Scoring',  icon: '📊', screen: 'LiveScoring', desc: 'Score the match', params: liveMatches[0] ? { matchId: liveMatches[0].id } : undefined },
            { label: 'Scorecard',     icon: '📋', screen: 'Scorecard',   desc: 'Full scorecard view' },
            { label: 'Commentary',    icon: '🎙', screen: 'Commentary',  desc: 'Ball-by-ball commentary' },
            { label: 'Stats',         icon: '📈', screen: 'Stats',       desc: 'Player & team stats' },
            { label: 'Graphs',        icon: '📉', screen: 'Graph',       desc: 'Performance charts' },
          ].map(item => (
            <TouchableOpacity key={item.label} style={styles.menuCard} onPress={() => onNavigate(item.screen, item.params)} activeOpacity={0.75}>
              <Text style={styles.menuIcon}>{item.icon}</Text>
              <Text style={styles.menuLabel}>{item.label}</Text>
              <Text style={styles.menuDesc}>{item.desc}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.sectionTitle}>All Matches</Text>
        {allMatches.map(m => {
          const t1 = db.teams.getById(m.team1Id);
          const t2 = db.teams.getById(m.team2Id);
          return (
            <Card key={m.id} style={styles.matchCard} variant="outlined">
              <View style={styles.matchRow}>
                <View style={styles.matchInfo}>
                  <Text style={styles.matchTeams}>{t1?.name} vs {t2?.name}</Text>
                  <Text style={styles.matchDate}>{formatDate(m.date)} · {m.venue}</Text>
                </View>
                <Badge label={m.status.toUpperCase()} variant={m.status === 'live' ? 'live' : m.status === 'completed' ? 'completed' : 'upcoming'} size="sm" />
              </View>
            </Card>
          );
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  screen:       { flex: 1, backgroundColor: theme.colors.background },
  banner:       { margin: 16, padding: 20, backgroundColor: '#1A3A5C', borderRadius: theme.borderRadius.xl, alignItems: 'center', ...theme.shadows.md },
  bannerName:   { fontSize: 22, fontWeight: '800', color: '#fff', marginTop: 8 },
  bannerSub:    { fontSize: 13, color: 'rgba(255,255,255,0.7)', marginTop: 3 },
  liveSection:  { paddingHorizontal: 16, marginBottom: 8 },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: theme.colors.text.primary, paddingHorizontal: 16, marginTop: 16, marginBottom: 10 },
  liveCard:     { marginBottom: 10, padding: 16, borderLeftWidth: 4, borderLeftColor: theme.colors.status.live },
  liveTop:      { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  liveVenue:    { fontSize: 12, color: theme.colors.text.muted },
  liveTeams:    { fontSize: 18, fontWeight: '700', color: theme.colors.text.primary },
  liveScore:    { fontSize: 26, fontWeight: '800', color: theme.colors.primary, marginTop: 4 },
  scoreNowBtn:  { marginTop: 10, paddingTop: 10, borderTopWidth: 1, borderTopColor: theme.colors.borderLight },
  scoreNowText: { fontSize: 14, fontWeight: '700', color: theme.colors.primary },
  menuGrid:     { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 12, gap: 8, marginBottom: 8 },
  menuCard:     { width: '47%', backgroundColor: theme.colors.surface, borderRadius: theme.borderRadius.lg, padding: 16, marginHorizontal: 4, ...theme.shadows.sm },
  menuIcon:     { fontSize: 28, marginBottom: 8 },
  menuLabel:    { fontSize: 14, fontWeight: '700', color: theme.colors.text.primary },
  menuDesc:     { fontSize: 11, color: theme.colors.text.muted, marginTop: 3 },
  matchCard:    { marginHorizontal: 16, marginBottom: 8, padding: 12 },
  matchRow:     { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  matchInfo:    { flex: 1, marginRight: 10 },
  matchTeams:   { fontSize: 14, fontWeight: '600', color: theme.colors.text.primary },
  matchDate:    { fontSize: 11, color: theme.colors.text.muted, marginTop: 2 },
});
