import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Header } from '../../components/common/Header';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';
import { theme } from '../../theme';
import { db } from '../../data/db';
import { validateToken } from '../../utils/validation';

interface Props { onSuccess: (matchId: string) => void; onBack: () => void; }

export const TokenEntryScreen: React.FC<Props> = ({ onSuccess, onBack }) => {
  const [token, setToken] = useState('');
  const [matchId, setMatchId] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const matches = db.matches.getAll().filter(m => m.status !== 'completed');

  const handleValidate = async () => {
    const err = validateToken(token);
    if (err) { setError(err); return; }
    if (!matchId) { setError('Please select a match'); return; }
    setError(null);
    setLoading(true);
    await new Promise(r => setTimeout(r, 600));
    const valid = db.tokens.validate(token.trim().toUpperCase(), matchId);
    setLoading(false);
    if (valid) {
      onSuccess(matchId);
    } else {
      // Also try pre-seeded token A7-2025
      if (token.trim().toUpperCase() === 'A7-2025') {
        onSuccess(matchId);
      } else {
        setError('Invalid or already used token. Contact the organizer.');
      }
    }
  };

  return (
    <View style={styles.screen}>
      <Header title="Enter Scorer Token" subtitle="Organizer-issued access code" onBack={onBack} />
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <View style={styles.iconWrap}>
          <Text style={styles.icon}>🔑</Text>
          <Text style={styles.title}>Scorer Access</Text>
          <Text style={styles.subtitle}>Enter the token provided by your organizer to start live scoring.</Text>
        </View>

        <Text style={styles.sectionLabel}>Select Match</Text>
        {matches.map(m => {
          const t1 = db.teams.getById(m.team1Id);
          const t2 = db.teams.getById(m.team2Id);
          return (
            <View
              key={m.id}
              style={[styles.matchOption, matchId === m.id && styles.matchOptionActive]}
            >
              <Text
                style={[styles.matchOptionText, matchId === m.id && styles.matchOptionTextActive]}
                onPress={() => { setMatchId(m.id); setError(null); }}
              >
                {t1?.name} vs {t2?.name}
              </Text>
            </View>
          );
        })}

        <Input
          label="Access Token"
          value={token}
          onChangeText={t => { setToken(t.toUpperCase()); setError(null); }}
          placeholder="e.g. A7-2025"
          autoCapitalize="characters"
          error={error}
        />

        <View style={styles.hint}>
          <Text style={styles.hintText}>💡 Demo token: <Text style={styles.hintCode}>A7-2025</Text></Text>
        </View>

        <Button
          label="Verify Token & Start Scoring"
          onPress={handleValidate}
          loading={loading}
          disabled={!token || !matchId}
          fullWidth
          size="lg"
        />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  screen:               { flex: 1, backgroundColor: theme.colors.background },
  scroll:               { flex: 1 },
  content:              { padding: 24, paddingBottom: 40 },
  iconWrap:             { alignItems: 'center', paddingVertical: 28 },
  icon:                 { fontSize: 56, marginBottom: 12 },
  title:                { fontSize: 24, fontWeight: '800', color: theme.colors.text.primary, marginBottom: 8 },
  subtitle:             { fontSize: 14, color: theme.colors.text.muted, textAlign: 'center', lineHeight: 20 },
  sectionLabel:         { fontSize: 13, fontWeight: '700', color: theme.colors.text.secondary, marginBottom: 10, textTransform: 'uppercase', letterSpacing: 0.5 },
  matchOption:          { padding: 14, borderRadius: theme.borderRadius.md, borderWidth: 1.5, borderColor: theme.colors.border, backgroundColor: theme.colors.surface, marginBottom: 8 },
  matchOptionActive:    { borderColor: theme.colors.primary, backgroundColor: '#F0FAF5' },
  matchOptionText:      { fontSize: 14, fontWeight: '600', color: theme.colors.text.secondary },
  matchOptionTextActive:{ color: theme.colors.primary },
  hint:                 { backgroundColor: theme.colors.surfaceAlt, borderRadius: theme.borderRadius.md, padding: 12, marginBottom: 20 },
  hintText:             { fontSize: 13, color: theme.colors.text.secondary },
  hintCode:             { fontWeight: '800', color: theme.colors.primary, fontFamily: 'Courier' },
});
