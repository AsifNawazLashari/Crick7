import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Input } from '../common/Input';
import { Button } from '../common/Button';
import { theme } from '../../theme';
import { Tournament } from '../../types';
import { validateName, validateOvers, validatePowerplay } from '../../utils/validation';

const TYPES = ['ODI','T20','Test','Custom'] as const;

interface TournamentFormProps {
  organizerId: string;
  initialData?: Partial<Tournament>;
  onSubmit: (data: Omit<Tournament, 'id' | 'createdAt'>) => void;
  onCancel: () => void;
  loading?: boolean;
}

export const TournamentForm: React.FC<TournamentFormProps> = ({ organizerId, initialData, onSubmit, onCancel, loading }) => {
  const [name, setName] = useState(initialData?.name || '');
  const [type, setType] = useState<Tournament['type']>(initialData?.type || 'ODI');
  const [overs, setOvers] = useState(String(initialData?.overs || 50));
  const [ppOvers, setPPOvers] = useState(String(initialData?.powerplayOvers || 10));
  const [errors, setErrors] = useState<Record<string, string>>({});

  const typeDefaults: Record<string, { overs: string; pp: string }> = {
    ODI: { overs: '50', pp: '10' }, T20: { overs: '20', pp: '6' },
    Test: { overs: '90', pp: '0' }, Custom: { overs: overs, pp: ppOvers },
  };

  const handleTypeSelect = (t: Tournament['type']) => {
    setType(t);
    if (t !== 'Custom') {
      setOvers(typeDefaults[t].overs);
      setPPOvers(typeDefaults[t].pp);
    }
  };

  const validate = () => {
    const e: Record<string, string> = {};
    const nameErr = validateName(name, 'Tournament name');
    if (nameErr) e.name = nameErr;
    const oversNum = parseInt(overs);
    const ppNum = parseInt(ppOvers);
    const oversErr = validateOvers(oversNum);
    if (oversErr) e.overs = oversErr;
    if (!oversErr) {
      const ppErr = validatePowerplay(ppNum, oversNum);
      if (ppErr) e.pp = ppErr;
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    onSubmit({
      name: name.trim(), type, overs: parseInt(overs),
      powerplayOvers: parseInt(ppOvers), organizerId,
      teamIds: initialData?.teamIds || [],
      matchIds: initialData?.matchIds || [],
      status: initialData?.status || 'upcoming',
    });
  };

  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <Input label="Tournament Name" value={name} onChangeText={setName} placeholder="e.g. A7 Cup 2025" error={errors.name} />

      <Text style={styles.label}>Format</Text>
      <View style={styles.typeRow}>
        {TYPES.map(t => (
          <TouchableOpacity key={t} style={[styles.typeBtn, type === t && styles.typeActive]} onPress={() => handleTypeSelect(t)}>
            <Text style={[styles.typeText, type === t && styles.typeTextActive]}>{t}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Input label="Total Overs" value={overs} onChangeText={setOvers} keyboardType="numeric" placeholder="50" error={errors.overs} />
      <Input label="Powerplay Overs" value={ppOvers} onChangeText={setPPOvers} keyboardType="numeric" placeholder="10" error={errors.pp} />

      <View style={styles.actions}>
        <Button label="Cancel" onPress={onCancel} variant="outline" />
        <Button label={initialData ? 'Update Tournament' : 'Create Tournament'} onPress={handleSubmit} loading={loading} />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  label:         { fontSize: 13, fontWeight: '600', color: theme.colors.text.secondary, marginBottom: 8 },
  typeRow:       { flexDirection: 'row', gap: 8, marginBottom: 16 },
  typeBtn:       { flex: 1, paddingVertical: 10, borderRadius: theme.borderRadius.md, borderWidth: 1.5, borderColor: theme.colors.border, alignItems: 'center' },
  typeActive:    { borderColor: theme.colors.primary, backgroundColor: theme.colors.primary },
  typeText:      { fontSize: 13, fontWeight: '700', color: theme.colors.text.secondary },
  typeTextActive:{ color: '#fff' },
  actions:       { flexDirection: 'row', gap: 12, marginTop: 8 },
});
