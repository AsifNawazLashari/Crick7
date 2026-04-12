import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, Alert, TouchableOpacity } from 'react-native';
import { Header } from '../../components/common/Header';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { TeamForm } from '../../components/forms/TeamForm';
import { PlayerForm } from '../../components/forms/PlayerForm';
import { theme } from '../../theme';
import { db } from '../../data/db';
import { Team, Player } from '../../types';

interface Props { onBack: () => void; }

export const TeamManageScreen: React.FC<Props> = ({ onBack }) => {
  const [teams, setTeams] = useState<Team[]>(db.teams.getAll());
  const [showTeamForm, setShowTeamForm] = useState(false);
  const [showPlayerForm, setShowPlayerForm] = useState<string | null>(null);
  const [editPlayer, setEditPlayer] = useState<Player | null>(null);
  const [selectedTeam, setSelectedTeam] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const refresh = () => setTeams(db.teams.getAll());

  const handleCreateTeam = (data: any) => {
    const tournaments = db.tournaments.getAll();
    db.teams.create({ ...data, tournamentId: tournaments[0]?.id || '' });
    refresh(); setShowTeamForm(false);
  };

  const handleAddPlayer = (data: any) => {
    if (editPlayer) { db.players.update(editPlayer.id, data); }
    else { db.players.create(data); }
    setShowPlayerForm(null); setEditPlayer(null);
  };

  const handleDeleteTeam = (id: string, name: string) => {
    Alert.alert('Delete Team', `Delete "${name}"?`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => { db.teams.delete(id); refresh(); } },
    ]);
  };

  const handleDeletePlayer = (id: string, name: string) => {
    Alert.alert('Remove Player', `Remove "${name}" from team?`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Remove', style: 'destructive', onPress: () => { db.players.delete(id); refresh(); } },
    ]);
  };

  if (showTeamForm) {
    return (
      <View style={styles.screen}>
        <Header title="Create Team" onBack={() => setShowTeamForm(false)} />
        <View style={styles.formWrap}>
          <TeamForm tournamentId="" onSubmit={handleCreateTeam} onCancel={() => setShowTeamForm(false)} />
        </View>
      </View>
    );
  }

  if (showPlayerForm) {
    return (
      <View style={styles.screen}>
        <Header title={editPlayer ? 'Edit Player' : 'Add Player'} onBack={() => { setShowPlayerForm(null); setEditPlayer(null); }} />
        <View style={styles.formWrap}>
          <PlayerForm teamId={showPlayerForm} initialData={editPlayer || undefined} onSubmit={handleAddPlayer} onCancel={() => { setShowPlayerForm(null); setEditPlayer(null); }} />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <Header title="Team Management" onBack={onBack} />
      <View style={styles.content}>
        <Button label="+ Create New Team" onPress={() => setShowTeamForm(true)} fullWidth />
        <FlatList
          data={teams}
          keyExtractor={t => t.id}
          style={{ marginTop: 16 }}
          showsVerticalScrollIndicator={false}
          renderItem={({ item: t }) => {
            const players = db.players.getByTeam(t.id);
            const captain = players.find(p => p.isCaptain);
            const isExpanded = selectedTeam === t.id;
            return (
              <Card style={styles.teamCard} variant="outlined">
                <TouchableOpacity style={styles.teamHeader} onPress={() => setSelectedTeam(isExpanded ? null : t.id)}>
                  <View>
                    <Text style={styles.teamName}>{t.name}</Text>
                    <Text style={styles.teamMeta}>{players.length} Players · C: {captain?.name || 'Not Assigned'}</Text>
                  </View>
                  <View style={styles.teamActions}>
                    <Button label="Delete" onPress={() => handleDeleteTeam(t.id, t.name)} variant="danger" size="sm" />
                    <Text style={styles.chevron}>{isExpanded ? '▲' : '▼'}</Text>
                  </View>
                </TouchableOpacity>
                {isExpanded && (
                  <View style={styles.playerList}>
                    <Button label="+ Add Player" onPress={() => setShowPlayerForm(t.id)} variant="outline" size="sm" />
                    {players.map(p => (
                      <View key={p.id} style={styles.playerRow}>
                        <View style={styles.playerInfo}>
                          <Text style={styles.playerName}>{p.name}{p.isCaptain ? ' (C)' : ''}{p.isViceCaptain ? ' (VC)' : ''}</Text>
                          <Text style={styles.playerRole}>{p.role} · {p.stats.matches} matches</Text>
                        </View>
                        <View style={styles.playerBtns}>
                          <TouchableOpacity onPress={() => { setEditPlayer(p); setShowPlayerForm(t.id); }}><Text style={styles.editBtn}>✏️</Text></TouchableOpacity>
                          <TouchableOpacity onPress={() => handleDeletePlayer(p.id, p.name)}><Text style={styles.delBtn}>🗑️</Text></TouchableOpacity>
                        </View>
                      </View>
                    ))}
                  </View>
                )}
              </Card>
            );
          }}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  screen:      { flex: 1, backgroundColor: theme.colors.background },
  content:     { flex: 1, padding: 16 },
  formWrap:    { flex: 1, padding: 16 },
  teamCard:    { marginBottom: 12, padding: 14 },
  teamHeader:  { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  teamName:    { fontSize: 17, fontWeight: '700', color: theme.colors.text.primary },
  teamMeta:    { fontSize: 12, color: theme.colors.text.muted, marginTop: 3 },
  teamActions: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  chevron:     { fontSize: 14, color: theme.colors.text.muted, marginLeft: 4 },
  playerList:  { marginTop: 12, borderTopWidth: 1, borderTopColor: theme.colors.border, paddingTop: 12, gap: 8 },
  playerRow:   { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 6 },
  playerInfo:  { flex: 1 },
  playerName:  { fontSize: 14, fontWeight: '600', color: theme.colors.text.primary },
  playerRole:  { fontSize: 11, color: theme.colors.text.muted, marginTop: 1, textTransform: 'capitalize' },
  playerBtns:  { flexDirection: 'row', gap: 10 },
  editBtn:     { fontSize: 18 },
  delBtn:      { fontSize: 18 },
});
