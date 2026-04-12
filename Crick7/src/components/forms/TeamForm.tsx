import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Input } from '../common/Input';
import { Button } from '../common/Button';
import { theme } from '../../theme';
import { Team } from '../../types';
import { validateName } from '../../utils/validation';

interface TeamFormProps {
  tournamentId: string;
  initialData?: Partial<Team>;
  onSubmit: (data: Omit<Team, 'id'>) => void;
  onCancel: () => void;
  loading?: boolean;
}

export const TeamForm: React.FC<TeamFormProps> = ({ tournamentId, initialData, onSubmit, onCancel, loading }) => {
  const [name, setName] = useState(initialData?.name || '');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const e: Record<string, string> = {};
    const nameErr = validateName(name, 'Team name');
    if (nameErr) e.name = nameErr;
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    onSubmit({ name: name.trim(), captainId: '', viceCaptainId: '', playerIds: [], tournamentId });
  };

  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <Input label="Team Name" value={name} onChangeText={setName} placeholder="e.g. Pakistan XI" error={errors.name} />
      <View style={styles.actions}>
        <Button label="Cancel" onPress={onCancel} variant="outline" />
        <Button label={initialData ? 'Update Team' : 'Create Team'} onPress={handleSubmit} loading={loading} />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  actions: { flexDirection: 'row', gap: 12, marginTop: 8 },
});
