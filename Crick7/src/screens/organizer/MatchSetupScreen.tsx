import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Header } from '../../components/common/Header';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { theme } from '../../theme';
import { db } from '../../data/db';

interface Props { onBack: () => void; onNavigate: (s: string, p?: any) => void; }

export const MatchSetupScreen: React.FC<Props> = ({ onBack, onNavigate }) => {
  const tournaments = db.tournaments.getAll();
  const teams = db.teams.getAll();
  const [selectedTournament, setSelectedTournament] = useState(tournaments[0]?.id || '');
  const [team1, setTeam1] = useState('');
  const [team2, setTeam2] = useState('');
  const [venue, setVenue] = useState('');
  const [tossWinner, setTossWinner] = useState('');
  const [tossDec, setTossDec] = useState<'bat'|'bowl'>('bat');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const filteredTeams = teams.filter(t => t.tournamentId === selectedTournament);

  const handleCreate = async () => {
    if (!team1 || !team2 || !venue) return;
    setLoading(true);
    await new Promise(r => setTimeout(r, 500));
    const match = db.matches.create({
      tournamentId: selectedTournament, team1Id: team1, team2Id: team2,
      status: 'upcoming', token: `A7-${Math.random().toString(36).substring(2,8).toUpperCase()}`,
      venue, date: new Date().toISOString(), inningsIds: [],
      tossWinnerId: tossWinner, tossDecision: tossDec,
    });
    const t = db.tournaments.getById(selectedTournament);
    if (t) db.tournaments.update(selectedTournament, { matchIds: [...t.matchIds, match.id] });
    setLoading(false); setSuccess(true);
  };

  if (success) {
    return (
      <View style={styles.screen}>
        <Header title="Match Setup" onBack={onBack} />
        <View style={styles.successWrap}>
          <Text style={styles.successIcon}>✅</Text>
          <Text style={styles.successTitle}>Match Created!</Text>
          <Text style={styles.successSub}>Match has been scheduled successfully.</Text>
          <Button label="Go to Fixtures" onPress={() => onNavigate('Fixture')} fullWidth style={{ marginTop: 20 }} />
          <Button label="Generate Token" onPress={() => onNavigate('TokenGenerate')} variant="outline" fullWidth style={{ marginTop: 10 }} />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <Header title="Match Setup" subtitle="Configure a new match" onBack={onBack} />
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
        <Text style={styles.sectionLabel}>Tournament</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipRow}>
          {tournaments.map(t => (
            <TouchableOpacity key={t.id} style={[styles.chip, selectedTournament === t.id && styles.chipActive]} onPress={() => setSelectedTournament(t.id)}>
              <Text style={[styles.chipText, selectedTournament === t.id && styles.chipTextActive]}>{t.name}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <Text style={styles.sectionLabel}>Team 1</Text>
        <View style={styles.teamGrid}>
          {filteredTeams.map(t => (
            <TouchableOpacity key={t.id} style={[styles.teamChip, team1 === t.id && styles.chipActive]} onPress={() => setTeam1(t.id)}>
              <Text style={[styles.chipText, team1 === t.id && styles.chipTextActive]}>{t.name}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.sectionLabel}>Team 2</Text>
        <View style={styles.teamGrid}>
          {filteredTeams.filter(t => t.id !== team1).map(t => (
            <TouchableOpacity key={t.id} style={[styles.teamChip, team2 === t.id && styles.chipActive]} onPress={() => setTeam2(t.id)}>
              <Text style={[styles.chipText, team2 === t.id && styles.chipTextActive]}>{t.name}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Input label="Venue" value={venue} onChangeText={setVenue} placeholder="e.g. National Stadium, Karachi" />

        {team1 && team2 && (
          <>
            <Text style={styles.sectionLabel}>Toss Winner</Text>
            <View style={styles.teamGrid}>
              {[team1, team2].map(tid => {
                const t = db.teams.getById(tid);
                return (
                  <TouchableOpacity key={tid} style={[styles.teamChip, tossWinner === tid && styles.chipActive]} onPress={() => setTossWinner(tid)}>
                    <Text style={[styles.chipText, tossWinner === tid && styles.chipTextActive]}>{t?.name}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>
            <Text style={styles.sectionLabel}>Toss Decision</Text>
            <View style={styles.teamGrid}>
              {(['bat','bowl'] as const).map(d => (
                <TouchableOpacity key={d} style={[styles.teamChip, tossDec === d && styles.chipActive]} onPress={() => setTossDec(d)}>
                  <Text style={[styles.chipText, tossDec === d && styles.chipTextActive]}>{d === 'bat' ? '🏏 Bat' : '⚾ Bowl'}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </>
        )}

        <Button label="Create Match" onPress={handleCreate} loading={loading} disabled={!team1 || !team2 || !venue} fullWidth size="lg" />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  screen:       { flex: 1, backgroundColor: theme.colors.background },
  scroll:       { flex: 1 },
  content:      { padding: 16, paddingBottom: 40 },
  sectionLabel: { fontSize: 13, fontWeight: '700', color: theme.colors.text.secondary, marginBottom: 10, marginTop: 8, textTransform: 'uppercase', letterSpacing: 0.5 },
  chipRow:      { marginBottom: 16 },
  chip:         { paddingHorizontal: 14, paddingVertical: 8, borderRadius: theme.borderRadius.full, borderWidth: 1.5, borderColor: theme.colors.border, backgroundColor: theme.colors.surface, marginRight: 8 },
  chipActive:   { borderColor: theme.colors.primary, backgroundColor: theme.colors.primary },
  chipText:     { fontSize: 13, fontWeight: '600', color: theme.colors.text.secondary },
  chipTextActive:{ color: '#fff' },
  teamGrid:     { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 16 },
  teamChip:     { paddingHorizontal: 16, paddingVertical: 10, borderRadius: theme.borderRadius.md, borderWidth: 1.5, borderColor: theme.colors.border, backgroundColor: theme.colors.surface },
  successWrap:  { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 40 },
  successIcon:  { fontSize: 64, marginBottom: 16 },
  successTitle: { fontSize: 26, fontWeight: '800', color: theme.colors.text.primary, marginBottom: 8 },
  successSub:   { fontSize: 15, color: theme.colors.text.muted, textAlign: 'center' },
});
