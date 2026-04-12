import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Header } from '../../components/common/Header';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { theme } from '../../theme';
import { db } from '../../data/db';
import { Player } from '../../types';

interface Props { onBack: () => void; }

export const TeamSetupScreen: React.FC<Props> = ({ onBack }) => {
  const allTeams = db.teams.getAll();
  const team = allTeams[0];
  const [players, setPlayers] = useState<Player[]>(team ? db.players.getByTeam(team.id) : []);
  const [saved, setSaved] = useState(false);

  const toggleCaptain = (playerId: string) => {
    setPlayers(prev => prev.map(p => ({ ...p, isCaptain: p.id === playerId })));
  };
  const toggleVC = (playerId: string) => {
    setPlayers(prev => prev.map(p => ({ ...p, isViceCaptain: p.id === playerId })));
  };

  const handleSave = () => {
    players.forEach(p => db.players.update(p.id, { isCaptain: p.isCaptain, isViceCaptain: p.isViceCaptain }));
    if (team) {
      const captain = players.find(p => p.isCaptain);
      const vc = players.find(p => p.isViceCaptain);
      db.teams.update(team.id, { captainId: captain?.id || '', viceCaptainId: vc?.id });
    }
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <View style={styles.screen}>
      <Header title="Team Setup" subtitle={team?.name} onBack={onBack} />
      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.info}>
          <Text style={styles.infoText}>Assign Captain and Vice Captain roles for your team.</Text>
        </View>
        {players.map(p => (
          <View key={p.id} style={styles.playerCard}>
            <View style={styles.playerInfo}>
              <Text style={styles.playerName}>{p.name}</Text>
              <Text style={styles.playerRole}>{p.role} · {p.stats.matches} matches</Text>
              <Text style={styles.playerStats}>
                {p.stats.runs > 0 ? `${p.stats.runs} runs · Avg ${p.stats.average.toFixed(1)}` : `${p.stats.wickets} wkts · Eco ${p.stats.economy.toFixed(2)}`}
              </Text>
            </View>
            <View style={styles.roleAssign}>
              <TouchableOpacity style={[styles.roleBtn, p.isCaptain && styles.roleActive]} onPress={() => toggleCaptain(p.id)}>
                <Text style={[styles.roleBtnText, p.isCaptain && styles.roleBtnTextActive]}>C</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.roleBtn, p.isViceCaptain && styles.vcActive]} onPress={() => toggleVC(p.id)}>
                <Text style={[styles.roleBtnText, p.isViceCaptain && styles.roleBtnTextActive]}>VC</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
        <View style={styles.footer}>
          <Button label={saved ? '✓ Saved!' : 'Save Team Setup'} onPress={handleSave} fullWidth size="lg" variant={saved ? 'accent' : 'primary'} />
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  screen:           { flex: 1, backgroundColor: theme.colors.background },
  scroll:           { flex: 1 },
  info:             { margin: 16, padding: 14, backgroundColor: theme.colors.surfaceAlt, borderRadius: theme.borderRadius.md },
  infoText:         { fontSize: 13, color: theme.colors.text.secondary },
  playerCard:       { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginHorizontal: 16, marginBottom: 10, padding: 14, backgroundColor: theme.colors.surface, borderRadius: theme.borderRadius.lg, ...theme.shadows.sm },
  playerInfo:       { flex: 1 },
  playerName:       { fontSize: 15, fontWeight: '700', color: theme.colors.text.primary },
  playerRole:       { fontSize: 12, color: theme.colors.text.muted, marginTop: 2, textTransform: 'capitalize' },
  playerStats:      { fontSize: 12, color: theme.colors.text.secondary, marginTop: 2 },
  roleAssign:       { flexDirection: 'row', gap: 8 },
  roleBtn:          { width: 38, height: 38, borderRadius: 19, alignItems: 'center', justifyContent: 'center', borderWidth: 1.5, borderColor: theme.colors.border, backgroundColor: theme.colors.surfaceAlt },
  roleActive:       { borderColor: theme.colors.primary, backgroundColor: theme.colors.primary },
  vcActive:         { borderColor: theme.colors.accent, backgroundColor: theme.colors.accent },
  roleBtnText:      { fontSize: 13, fontWeight: '700', color: theme.colors.text.secondary },
  roleBtnTextActive:{ color: '#fff' },
  footer:           { padding: 16, paddingBottom: 32 },
});
