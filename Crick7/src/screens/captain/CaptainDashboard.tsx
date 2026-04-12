import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Header } from '../../components/common/Header';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { theme } from '../../theme';
import { db } from '../../data/db';

interface Props { onNavigate: (s: string, p?: any) => void; onLogout: () => void; }

export const CaptainDashboard: React.FC<Props> = ({ onNavigate, onLogout }) => {
  const user = db.auth.getCurrentUser()!;
  const allTeams = db.teams.getAll();
  const myTeam = allTeams.find(t => {
    const captain = db.players.getByTeam(t.id).find(p => p.isCaptain);
    return captain?.name === user.name;
  }) || allTeams[0];

  const players = myTeam ? db.players.getByTeam(myTeam.id) : [];
  const captain = players.find(p => p.isCaptain);
  const vc = players.find(p => p.isViceCaptain);
  const liveMatches = db.matches.getLive();

  return (
    <View style={styles.screen}>
      <Header title="Cricket A7" subtitle="Captain Panel" rightAction={{ icon: '⚙️', onPress: onLogout }} />
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.banner}>
          <Badge label="CAPTAIN" variant="accent" />
          <Text style={styles.bannerName}>{user.name}</Text>
          <Text style={styles.bannerTeam}>{myTeam?.name || 'No Team Assigned'}</Text>
        </View>

        <View style={styles.menuGrid}>
          {[
            { label: 'Team Setup',      icon: '⚙️', screen: 'TeamSetup',      desc: 'Configure lineup & roles' },
            { label: 'My Players',      icon: '👥', screen: 'PlayerManage',   desc: 'Manage player roster' },
            { label: 'Live Match',      icon: '🔴', screen: 'MatchDetail',    desc: 'Follow the live game', params: liveMatches[0] ? { matchId: liveMatches[0].id } : undefined },
            { label: 'Scorecard',       icon: '📋', screen: 'Scorecard',      desc: 'Match scorecard' },
            { label: 'Team Stats',      icon: '📊', screen: 'Stats',          desc: 'Player performance' },
            { label: 'Commentary',      icon: '🎙', screen: 'Commentary',     desc: 'Match commentary' },
          ].map(item => (
            <TouchableOpacity key={item.screen} style={styles.menuCard} onPress={() => onNavigate(item.screen, item.params)} activeOpacity={0.75}>
              <Text style={styles.menuIcon}>{item.icon}</Text>
              <Text style={styles.menuLabel}>{item.label}</Text>
              <Text style={styles.menuDesc}>{item.desc}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {myTeam && (
          <>
            <Text style={styles.sectionTitle}>My Squad</Text>
            <Card style={styles.squadCard}>
              <View style={styles.squadHeader}>
                <Text style={styles.squadTeam}>{myTeam.name}</Text>
                <Text style={styles.squadCount}>{players.length} Players</Text>
              </View>
              {players.slice(0, 5).map(p => (
                <View key={p.id} style={styles.playerRow}>
                  <View style={styles.playerLeft}>
                    <Text style={styles.playerName}>{p.name}</Text>
                    <Text style={styles.playerRole}>{p.role}</Text>
                  </View>
                  <View style={styles.playerRight}>
                    {p.isCaptain && <Badge label="C" variant="primary" size="sm" />}
                    {p.isViceCaptain && <Badge label="VC" variant="secondary" size="sm" />}
                    <Text style={styles.playerStats}>{p.stats.runs > 0 ? `${p.stats.runs} runs` : `${p.stats.wickets} wkts`}</Text>
                  </View>
                </View>
              ))}
              {players.length > 5 && <Text style={styles.moreText}>+{players.length - 5} more players</Text>}
            </Card>
          </>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  screen:       { flex: 1, backgroundColor: theme.colors.background },
  banner:       { margin: 16, padding: 20, backgroundColor: theme.colors.secondary, borderRadius: theme.borderRadius.xl, alignItems: 'center', ...theme.shadows.md },
  bannerName:   { fontSize: 24, fontWeight: '800', color: '#fff', marginTop: 8 },
  bannerTeam:   { fontSize: 14, color: 'rgba(255,255,255,0.8)', marginTop: 4 },
  menuGrid:     { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 12, gap: 8, marginBottom: 8 },
  menuCard:     { width: '47%', backgroundColor: theme.colors.surface, borderRadius: theme.borderRadius.lg, padding: 16, marginHorizontal: 4, ...theme.shadows.sm },
  menuIcon:     { fontSize: 28, marginBottom: 8 },
  menuLabel:    { fontSize: 14, fontWeight: '700', color: theme.colors.text.primary },
  menuDesc:     { fontSize: 11, color: theme.colors.text.muted, marginTop: 3 },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: theme.colors.text.primary, paddingHorizontal: 16, marginTop: 12, marginBottom: 10 },
  squadCard:    { marginHorizontal: 16, marginBottom: 20 },
  squadHeader:  { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12, paddingBottom: 10, borderBottomWidth: 1, borderBottomColor: theme.colors.border },
  squadTeam:    { fontSize: 16, fontWeight: '700', color: theme.colors.text.primary },
  squadCount:   { fontSize: 13, color: theme.colors.text.muted },
  playerRow:    { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: theme.colors.borderLight },
  playerLeft:   { flex: 1 },
  playerName:   { fontSize: 14, fontWeight: '600', color: theme.colors.text.primary },
  playerRole:   { fontSize: 11, color: theme.colors.text.muted, marginTop: 1, textTransform: 'capitalize' },
  playerRight:  { flexDirection: 'row', alignItems: 'center', gap: 6 },
  playerStats:  { fontSize: 12, color: theme.colors.text.secondary, fontWeight: '600' },
  moreText:     { fontSize: 12, color: theme.colors.text.muted, textAlign: 'center', marginTop: 8 },
});
