import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Header } from '../../components/common/Header';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { theme } from '../../theme';
import { db } from '../../data/db';
import { formatDate } from '../../utils/format';

interface OrganizerDashboardProps {
  onNavigate: (screen: string, params?: any) => void;
  onLogout: () => void;
}

export const OrganizerDashboard: React.FC<OrganizerDashboardProps> = ({ onNavigate, onLogout }) => {
  const user = db.auth.getCurrentUser();
  const tournaments = db.tournaments.getAll();
  const matches = db.matches.getAll();
  const liveMatches = db.matches.getLive();
  const teams = db.teams.getAll();
  const players = db.players.getAll();

  const stats = [
    { label: 'Tournaments', value: tournaments.length, icon: '🏆', color: theme.colors.primary },
    { label: 'Matches',     value: matches.length,     icon: '⚔️', color: theme.colors.secondary },
    { label: 'Teams',       value: teams.length,        icon: '👥', color: '#264653' },
    { label: 'Players',     value: players.length,      icon: '🏏', color: '#2D6A4F' },
  ];

  const menuItems = [
    { label: 'Tournaments',    icon: '🏆', screen: 'TournamentCreate', desc: 'Create & manage tournaments' },
    { label: 'Match Setup',    icon: '⚔️', screen: 'MatchSetup',       desc: 'Configure upcoming matches' },
    { label: 'Team Manage',    icon: '👥', screen: 'TeamManage',        desc: 'Manage all teams & players' },
    { label: 'Fixture',        icon: '📅', screen: 'Fixture',           desc: 'View match schedule' },
    { label: 'Token Generate', icon: '🔑', screen: 'TokenGenerate',     desc: 'Generate scorer tokens' },
    { label: 'Scorecard',      icon: '📋', screen: 'Scorecard',         desc: 'View match scorecards' },
    { label: 'Commentary',     icon: '🎙', screen: 'Commentary',        desc: 'Match commentary feed' },
    { label: 'Stats & Graphs', icon: '📊', screen: 'Graph',             desc: 'Performance analytics' },
  ];

  return (
    <View style={styles.screen}>
      <Header
        title="Cricket A7"
        subtitle={`Welcome, ${user?.name?.split(' ')[0]}`}
        rightAction={{ icon: '⚙️', onPress: onLogout }}
      />
      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Role Banner */}
        <View style={styles.roleBanner}>
          <View style={styles.roleInfo}>
            <Text style={styles.roleTitle}>Organizer Dashboard</Text>
            <Text style={styles.roleName}>{user?.name}</Text>
            <Text style={styles.roleEmail}>{user?.email}</Text>
          </View>
          <Badge label="ORGANIZER" variant="accent" />
        </View>

        {/* Live Match Alert */}
        {liveMatches.length > 0 && (
          <TouchableOpacity style={styles.liveAlert} onPress={() => onNavigate('MatchDetail', { matchId: liveMatches[0].id })}>
            <View style={styles.liveLeft}>
              <Badge label="LIVE" variant="live" dot />
              <View style={styles.liveInfo}>
                {liveMatches.map(m => {
                  const t1 = db.teams.getById(m.team1Id);
                  const t2 = db.teams.getById(m.team2Id);
                  return (
                    <Text key={m.id} style={styles.liveMatchText}>{t1?.name} vs {t2?.name}</Text>
                  );
                })}
                <Text style={styles.liveVenue}>{liveMatches[0].venue}</Text>
              </View>
            </View>
            <Text style={styles.liveArrow}>→</Text>
          </TouchableOpacity>
        )}

        {/* Stats Grid */}
        <View style={styles.statsGrid}>
          {stats.map(s => (
            <View key={s.label} style={[styles.statCard, { borderTopColor: s.color }]}>
              <Text style={styles.statIcon}>{s.icon}</Text>
              <Text style={[styles.statValue, { color: s.color }]}>{s.value}</Text>
              <Text style={styles.statLabel}>{s.label}</Text>
            </View>
          ))}
        </View>

        {/* Menu Grid */}
        <Text style={styles.sectionTitle}>Management</Text>
        <View style={styles.menuGrid}>
          {menuItems.map(item => (
            <TouchableOpacity key={item.screen} style={styles.menuCard} onPress={() => onNavigate(item.screen)} activeOpacity={0.75}>
              <Text style={styles.menuIcon}>{item.icon}</Text>
              <Text style={styles.menuLabel}>{item.label}</Text>
              <Text style={styles.menuDesc}>{item.desc}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Recent Tournaments */}
        <Text style={styles.sectionTitle}>Recent Tournaments</Text>
        {tournaments.slice(0, 3).map(t => (
          <TouchableOpacity key={t.id} onPress={() => onNavigate('TournamentDetail', { tournamentId: t.id })} activeOpacity={0.8}>
            <Card style={styles.tournamentCard} variant="outlined">
              <View style={styles.tournamentRow}>
                <View style={styles.tournamentInfo}>
                  <Text style={styles.tournamentName}>{t.name}</Text>
                  <Text style={styles.tournamentMeta}>{t.type} · {t.overs} Overs · PP: {t.powerplayOvers} Ov</Text>
                  <Text style={styles.tournamentDate}>{formatDate(t.createdAt)}</Text>
                </View>
                <Badge label={t.status} variant={t.status as any} />
              </View>
            </Card>
          </TouchableOpacity>
        ))}

        <View style={styles.footer}>
          <Text style={styles.footerText}>Cricket A7 · Made by Asif Nawaz Lashari · A7 Studio</Text>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  screen:        { flex: 1, backgroundColor: theme.colors.background },
  scroll:        { flex: 1 },
  roleBanner:    { margin: 16, padding: 18, backgroundColor: theme.colors.primary, borderRadius: theme.borderRadius.xl, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', ...theme.shadows.md },
  roleInfo:      { flex: 1 },
  roleTitle:     { fontSize: 12, color: 'rgba(255,255,255,0.7)', fontWeight: '600', letterSpacing: 1, textTransform: 'uppercase' },
  roleName:      { fontSize: 20, fontWeight: '800', color: '#fff', marginTop: 2 },
  roleEmail:     { fontSize: 12, color: 'rgba(255,255,255,0.7)', marginTop: 2 },
  liveAlert:     { marginHorizontal: 16, marginBottom: 16, padding: 14, backgroundColor: theme.colors.status.liveLight, borderRadius: theme.borderRadius.lg, borderWidth: 1, borderColor: '#FFCDD2', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  liveLeft:      { flexDirection: 'row', alignItems: 'center', flex: 1 },
  liveInfo:      { marginLeft: 10 },
  liveMatchText: { fontSize: 15, fontWeight: '700', color: theme.colors.text.primary },
  liveVenue:     { fontSize: 12, color: theme.colors.text.muted, marginTop: 1 },
  liveArrow:     { fontSize: 18, color: theme.colors.status.live, fontWeight: '700' },
  statsGrid:     { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 12, gap: 8, marginBottom: 8 },
  statCard:      { width: '47%', backgroundColor: theme.colors.surface, borderRadius: theme.borderRadius.lg, padding: 14, borderTopWidth: 3, ...theme.shadows.sm, marginHorizontal: 4 },
  statIcon:      { fontSize: 24, marginBottom: 6 },
  statValue:     { fontSize: 28, fontWeight: '800' },
  statLabel:     { fontSize: 12, color: theme.colors.text.muted, marginTop: 2, fontWeight: '500' },
  sectionTitle:  { fontSize: 16, fontWeight: '700', color: theme.colors.text.primary, paddingHorizontal: 16, marginTop: 16, marginBottom: 10 },
  menuGrid:      { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 12, gap: 8 },
  menuCard:      { width: '47%', backgroundColor: theme.colors.surface, borderRadius: theme.borderRadius.lg, padding: 16, marginHorizontal: 4, ...theme.shadows.sm },
  menuIcon:      { fontSize: 28, marginBottom: 8 },
  menuLabel:     { fontSize: 14, fontWeight: '700', color: theme.colors.text.primary },
  menuDesc:      { fontSize: 11, color: theme.colors.text.muted, marginTop: 3 },
  tournamentCard:{ marginHorizontal: 16, marginBottom: 10 },
  tournamentRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  tournamentInfo:{ flex: 1, marginRight: 12 },
  tournamentName:{ fontSize: 16, fontWeight: '700', color: theme.colors.text.primary },
  tournamentMeta:{ fontSize: 12, color: theme.colors.text.secondary, marginTop: 3 },
  tournamentDate:{ fontSize: 11, color: theme.colors.text.muted, marginTop: 2 },
  footer:        { padding: 24, alignItems: 'center' },
  footerText:    { fontSize: 11, color: theme.colors.text.muted },
});
