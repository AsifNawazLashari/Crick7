import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Input } from '../common/Input';
import { Button } from '../common/Button';
import { theme } from '../../theme';
import { Player, PlayerStats } from '../../types';
import { validateName } from '../../utils/validation';

const defaultStats: PlayerStats = { matches:0,runs:0,balls:0,fours:0,sixes:0,highScore:0,average:0,strikeRate:0,wickets:0,oversBowled:0,runsConceded:0,economy:0,bestBowling:'0/0' };

const ROLES = ['batsman','bowler','allrounder','wicketkeeper'] as const;

interface PlayerFormProps {
  teamId: string;
  initialData?: Partial<Player>;
  onSubmit: (data: Omit<Player, 'id'>) => void;
  onCancel: () => void;
  loading?: boolean;
}

export const PlayerForm: React.FC<PlayerFormProps> = ({ teamId, initialData, onSubmit, onCancel, loading }) => {
  const [name, setName] = useState(initialData?.name || '');
  const [role, setRole] = useState<Player['role']>(initialData?.role || 'batsman');
  const [isCaptain, setIsCaptain] = useState(initialData?.isCaptain || false);
  const [isVC, setIsVC] = useState(initialData?.isViceCaptain || false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const e: Record<string, string> = {};
    const nameErr = validateName(name, 'Player name');
    if (nameErr) e.name = nameErr;
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    onSubmit({ name: name.trim(), teamId, role, isCaptain, isViceCaptain: isVC, stats: { ...defaultStats, ...initialData?.stats } });
  };

  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <Input label="Player Name" value={name} onChangeText={setName} placeholder="e.g. Babar Azam" error={errors.name} />

      <Text style={styles.label}>Role</Text>
      <View style={styles.roleGrid}>
        {ROLES.map(r => (
          <TouchableOpacity
            key={r}
            style={[styles.roleBtn, role === r && styles.roleActive]}
            onPress={() => setRole(r)}
          >
            <Text style={[styles.roleText, role === r && styles.roleTextActive]}>
              {r === 'batsman' ? '🏏' : r === 'bowler' ? '⚾' : r === 'allrounder' ? '⭐' : '🧤'} {r}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.label}>Designation</Text>
      <View style={styles.row}>
        <TouchableOpacity style={[styles.checkBtn, isCaptain && styles.checkActive]} onPress={() => setIsCaptain(!isCaptain)}>
          <Text style={[styles.checkText, isCaptain && styles.checkTextActive]}>{isCaptain ? '✓ ' : ''}Captain (C)</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.checkBtn, isVC && styles.checkActive]} onPress={() => setIsVC(!isVC)}>
          <Text style={[styles.checkText, isVC && styles.checkTextActive]}>{isVC ? '✓ ' : ''}Vice Captain (VC)</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.actions}>
        <Button label="Cancel" onPress={onCancel} variant="outline" size="md" />
        <Button label={initialData ? 'Update Player' : 'Add Player'} onPress={handleSubmit} loading={loading} size="md" />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  label:          { fontSize: 13, fontWeight: '600', color: theme.colors.text.secondary, marginBottom: 8, marginTop: 4 },
  roleGrid:       { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 16 },
  roleBtn:        { paddingHorizontal: 14, paddingVertical: 8, borderRadius: theme.borderRadius.md, borderWidth: 1.5, borderColor: theme.colors.border, backgroundColor: theme.colors.surfaceAlt },
  roleActive:     { borderColor: theme.colors.primary, backgroundColor: theme.colors.primary },
  roleText:       { fontSize: 13, fontWeight: '600', color: theme.colors.text.secondary, textTransform: 'capitalize' },
  roleTextActive: { color: '#fff' },
  row:            { flexDirection: 'row', gap: 8, marginBottom: 16 },
  checkBtn:       { flex: 1, paddingVertical: 10, borderRadius: theme.borderRadius.md, borderWidth: 1.5, borderColor: theme.colors.border, alignItems: 'center' },
  checkActive:    { borderColor: theme.colors.accent, backgroundColor: '#FFF8E1' },
  checkText:      { fontSize: 13, fontWeight: '600', color: theme.colors.text.secondary },
  checkTextActive:{ color: '#8B6914' },
  actions:        { flexDirection: 'row', gap: 12, marginTop: 8 },
});
