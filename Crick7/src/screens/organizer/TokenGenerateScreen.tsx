import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Share } from 'react-native';
import { Header } from '../../components/common/Header';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { theme } from '../../theme';
import { db } from '../../data/db';
import { formatDateTime } from '../../utils/format';

interface Props { onBack: () => void; }

export const TokenGenerateScreen: React.FC<Props> = ({ onBack }) => {
  const user = db.auth.getCurrentUser()!;
  const matches = db.matches.getAll().filter(m => m.status !== 'completed');
  const [selectedMatch, setSelectedMatch] = useState(matches[0]?.id || '');
  const [generated, setGenerated] = useState<string | null>(null);
  const [tokens, setTokens] = useState(selectedMatch ? db.tokens.getByMatch(selectedMatch) : []);

  const refreshTokens = (matchId: string) => setTokens(db.tokens.getByMatch(matchId));

  const handleGenerate = () => {
    if (!selectedMatch) return;
    const token = db.tokens.generate(selectedMatch, user.id);
    setGenerated(token.code);
    refreshTokens(selectedMatch);
  };

  const handleShare = async () => {
    if (generated) {
      await Share.share({ message: `Cricket A7 Scorer Token: ${generated}\nUse this to access live scoring for the match.` });
    }
  };

  return (
    <View style={styles.screen}>
      <Header title="Token Generator" subtitle="Scorer Access Tokens" onBack={onBack} />
      <View style={styles.content}>
        <Text style={styles.sectionLabel}>Select Match</Text>
        {matches.map(m => {
          const t1 = db.teams.getById(m.team1Id);
          const t2 = db.teams.getById(m.team2Id);
          return (
            <TouchableOpacity key={m.id} style={[styles.matchBtn, selectedMatch === m.id && styles.matchBtnActive]} onPress={() => { setSelectedMatch(m.id); refreshTokens(m.id); setGenerated(null); }}>
              <Text style={[styles.matchBtnText, selectedMatch === m.id && styles.matchBtnTextActive]}>{t1?.name} vs {t2?.name}</Text>
              <Badge label={m.status.toUpperCase()} variant={m.status === 'live' ? 'live' : 'upcoming'} size="sm" />
            </TouchableOpacity>
          );
        })}

        <Button label="🔑 Generate New Token" onPress={handleGenerate} disabled={!selectedMatch} fullWidth size="lg" />

        {generated && (
          <Card style={styles.tokenCard}>
            <Text style={styles.tokenLabel}>Generated Token</Text>
            <Text style={styles.tokenCode}>{generated}</Text>
            <Text style={styles.tokenHint}>Share this token with the scorer to grant live scoring access.</Text>
            <Button label="Share Token" onPress={handleShare} variant="accent" fullWidth />
          </Card>
        )}

        {tokens.length > 0 && (
          <>
            <Text style={styles.sectionLabel}>Match Tokens ({tokens.length})</Text>
            <FlatList
              data={tokens}
              keyExtractor={t => t.id}
              scrollEnabled={false}
              renderItem={({ item: t }) => (
                <View style={styles.tokenRow}>
                  <View>
                    <Text style={styles.code}>{t.code}</Text>
                    <Text style={styles.tokenDate}>{formatDateTime(t.createdAt)}</Text>
                  </View>
                  <Badge label={t.isUsed ? 'USED' : 'ACTIVE'} variant={t.isUsed ? 'completed' : 'upcoming'} size="sm" />
                </View>
              )}
            />
          </>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  screen:           { flex: 1, backgroundColor: theme.colors.background },
  content:          { flex: 1, padding: 16 },
  sectionLabel:     { fontSize: 13, fontWeight: '700', color: theme.colors.text.secondary, marginBottom: 10, marginTop: 8, textTransform: 'uppercase', letterSpacing: 0.5 },
  matchBtn:         { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 14, borderRadius: theme.borderRadius.md, borderWidth: 1.5, borderColor: theme.colors.border, backgroundColor: theme.colors.surface, marginBottom: 8 },
  matchBtnActive:   { borderColor: theme.colors.primary, backgroundColor: '#F0FAF5' },
  matchBtnText:     { fontSize: 14, fontWeight: '600', color: theme.colors.text.secondary },
  matchBtnTextActive:{ color: theme.colors.primary },
  tokenCard:        { marginVertical: 16, padding: 20, backgroundColor: theme.colors.primaryDark, alignItems: 'center' },
  tokenLabel:       { fontSize: 12, color: 'rgba(255,255,255,0.7)', fontWeight: '600', marginBottom: 8, letterSpacing: 1 },
  tokenCode:        { fontSize: 32, fontWeight: '800', color: theme.colors.accent, letterSpacing: 4, marginBottom: 10, fontFamily: 'Courier' },
  tokenHint:        { fontSize: 13, color: 'rgba(255,255,255,0.7)', textAlign: 'center', marginBottom: 16 },
  tokenRow:         { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: theme.colors.borderLight },
  code:             { fontSize: 16, fontWeight: '700', color: theme.colors.text.primary, letterSpacing: 1, fontFamily: 'Courier' },
  tokenDate:        { fontSize: 11, color: theme.colors.text.muted, marginTop: 2 },
});
