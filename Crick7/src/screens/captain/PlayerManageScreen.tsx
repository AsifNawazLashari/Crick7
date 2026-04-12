import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert } from 'react-native';
import { Header } from '../../components/common/Header';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { PlayerForm } from '../../components/forms/PlayerForm';
import { theme } from '../../theme';
import { db } from '../../data/db';
import { Player } from '../../types';

interface Props { onBack: () => void; }

export const PlayerManageScreen: React.FC<Props> = ({ onBack }) => {
  const team = db.teams.getAll()[0];
  const [players, setPlayers] = useState<Player[]>(team ? db.players.getByTeam(team.id) : []);
  const [showForm, setShowForm] = useState(false);
  const [editPlayer, setEditPlayer] = useState<Player | null>(null);

  const refresh = () => team && setPlayers(db.players.getByTeam(team.id));

  const handleSubmit = (data: any) => {
    if (editPlayer) db.players.update(editPlayer.id, data);
    else db.players.create(data);
    refresh(); setShowForm(false); setEditPlayer(null);
  };

  const handleDelete = (id: string, name: string) => {
    Alert.alert('Remove Player', `Remove ${name}?`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Remove', style: 'destructive', onPress: () => { db.players.delete(id); refresh(); } },
    ]);
  };

  if (showForm || editPlayer) {
    return (
      <View style={styles.screen}>
        <Header title={editPlayer ? 'Edit Player' : 'Add Player'} onBack={() => { setShowForm(false); setEditPlayer(null); }} />
        <View style={styles.formWrap}>
          <PlayerForm teamId={team?.id || ''} initialData={editPlayer || undefined} onSubmit={handleSubmit} onCancel={() => { setShowForm(false); setEditPlayer(null); }} />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <Header title="Player Roster" subtitle={team?.name} onBack={onBack} />
      <View style={styles.content}>
        <Button label="+ Add Player" onPress={() => setShowForm(true)} fullWidth />
        <FlatList
          data={players}
          keyExtractor={p => p.id}
          style={{ marginTop: 16 }}
          showsVerticalScrollIndicator={false}
          renderItem={({ item: p }) => (
            <View style={styles.playerCard}>
              <View style={styles.info}>
                <View style={styles.nameRow}>
                  <Text style={styles.name}>{p.name}</Text>
                  {p.isCaptain && <Badge label="C" variant="primary" size="sm" />}
                  {p.isViceCaptain && <Badge label="VC" variant="accent" size="sm" />}
                </View>
                <Text style={styles.role}>{p.role}</Text>
                <View style={styles.stats}>
                  {p.stats.runs > 0 && <Text style={styles.stat}>🏏 {p.stats.runs} runs</Text>}
                  {p.stats.wickets > 0 && <Text style={styles.stat}>⚾ {p.stats.wickets} wkts</Text>}
                  <Text style={styles.stat}>📅 {p.stats.matches} matches</Text>
                </View>
              </View>
              <View style={styles.actions}>
                <TouchableOpacity onPress={() => setEditPlayer(p)} style={styles.actionBtn}><Text style={styles.editIcon}>✏️</Text></TouchableOpacity>
                <TouchableOpacity onPress={() => handleDelete(p.id, p.name)} style={styles.actionBtn}><Text style={styles.delIcon}>🗑️</Text></TouchableOpacity>
              </View>
            </View>
          )}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  screen:     { flex: 1, backgroundColor: theme.colors.background },
  content:    { flex: 1, padding: 16 },
  formWrap:   { flex: 1, padding: 16 },
  playerCard: { flexDirection: 'row', backgroundColor: theme.colors.surface, borderRadius: theme.borderRadius.lg, padding: 14, marginBottom: 10, ...theme.shadows.sm },
  info:       { flex: 1 },
  nameRow:    { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 3 },
  name:       { fontSize: 16, fontWeight: '700', color: theme.colors.text.primary },
  role:       { fontSize: 12, color: theme.colors.text.muted, textTransform: 'capitalize', marginBottom: 6 },
  stats:      { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  stat:       { fontSize: 12, color: theme.colors.text.secondary, fontWeight: '500' },
  actions:    { justifyContent: 'center', gap: 8 },
  actionBtn:  { padding: 4 },
  editIcon:   { fontSize: 20 },
  delIcon:    { fontSize: 20 },
});
