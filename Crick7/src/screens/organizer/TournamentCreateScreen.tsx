import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert } from 'react-native';
import { Header } from '../../components/common/Header';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { TournamentForm } from '../../components/forms/TournamentForm';
import { theme } from '../../theme';
import { db } from '../../data/db';
import { Tournament } from '../../types';
import { formatDate } from '../../utils/format';
import { useTournament } from '../../hooks/useTournament';

interface Props { onBack: () => void; onNavigate: (s: string, p?: any) => void; }

export const TournamentCreateScreen: React.FC<Props> = ({ onBack, onNavigate }) => {
  const user = db.auth.getCurrentUser()!;
  const { tournaments, loading, createTournament, deleteTournament } = useTournament();
  const [showForm, setShowForm] = useState(false);
  const [editData, setEditData] = useState<Tournament | null>(null);

  const handleCreate = async (data: any) => {
    await createTournament({ ...data, organizerId: user.id });
    setShowForm(false);
  };

  const handleDelete = (id: string, name: string) => {
    Alert.alert('Delete Tournament', `Delete "${name}"? This cannot be undone.`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => deleteTournament(id) },
    ]);
  };

  if (showForm || editData) {
    return (
      <View style={styles.screen}>
        <Header title={editData ? 'Edit Tournament' : 'New Tournament'} onBack={() => { setShowForm(false); setEditData(null); }} />
        <View style={styles.formWrap}>
          <TournamentForm
            organizerId={user.id}
            initialData={editData || undefined}
            onSubmit={handleCreate}
            onCancel={() => { setShowForm(false); setEditData(null); }}
            loading={loading}
          />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <Header title="Tournaments" subtitle="A7 Cup Management" onBack={onBack} />
      <View style={styles.content}>
        <Button label="+ Create Tournament" onPress={() => setShowForm(true)} fullWidth size="lg" />
        <FlatList
          data={tournaments}
          keyExtractor={t => t.id}
          style={{ marginTop: 16 }}
          showsVerticalScrollIndicator={false}
          renderItem={({ item: t }) => (
            <Card style={styles.card} variant="outlined">
              <View style={styles.cardTop}>
                <View style={styles.cardInfo}>
                  <Text style={styles.tName}>{t.name}</Text>
                  <Text style={styles.tMeta}>{t.type} · {t.overs} Overs · PP: {t.powerplayOvers} Ov</Text>
                  <Text style={styles.tDate}>Created {formatDate(t.createdAt)}</Text>
                </View>
                <Badge label={t.status} variant={t.status as any} />
              </View>
              <View style={styles.teamsRow}>
                <Text style={styles.teamCount}>{t.teamIds.length} Teams · {t.matchIds.length} Matches</Text>
              </View>
              <View style={styles.actions}>
                <Button label="View Detail" onPress={() => onNavigate('TournamentDetail', { tournamentId: t.id })} variant="outline" size="sm" />
                <Button label="Edit" onPress={() => setEditData(t)} variant="ghost" size="sm" />
                <Button label="Delete" onPress={() => handleDelete(t.id, t.name)} variant="danger" size="sm" />
              </View>
            </Card>
          )}
          ListEmptyComponent={<Text style={styles.empty}>No tournaments yet. Create one!</Text>}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  screen:   { flex: 1, backgroundColor: theme.colors.background },
  content:  { flex: 1, padding: 16 },
  formWrap: { flex: 1, padding: 16 },
  card:     { marginBottom: 12, padding: 14 },
  cardTop:  { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 },
  cardInfo: { flex: 1, marginRight: 10 },
  tName:    { fontSize: 17, fontWeight: '700', color: theme.colors.text.primary },
  tMeta:    { fontSize: 13, color: theme.colors.text.secondary, marginTop: 3 },
  tDate:    { fontSize: 11, color: theme.colors.text.muted, marginTop: 2 },
  teamsRow: { marginBottom: 10 },
  teamCount:{ fontSize: 12, color: theme.colors.text.muted },
  actions:  { flexDirection: 'row', gap: 8 },
  empty:    { textAlign: 'center', color: theme.colors.text.muted, padding: 40 },
});
