import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { theme } from '../../theme';
import { Player } from '../../types';

const W = Dimensions.get('window').width - 64;

interface PlayerStatsChartProps {
  players: Player[];
  type?: 'batting' | 'bowling';
}

const BAR_H = 28;

export const PlayerStatsChart: React.FC<PlayerStatsChartProps> = ({ players, type = 'batting' }) => {
  const [activeType, setActiveType] = useState<'batting' | 'bowling'>(type);

  const sortedPlayers = activeType === 'batting'
    ? [...players].sort((a, b) => b.stats.runs - a.stats.runs).slice(0, 8)
    : [...players].sort((a, b) => b.stats.wickets - a.stats.wickets).slice(0, 8);

  const maxVal = activeType === 'batting'
    ? Math.max(...sortedPlayers.map(p => p.stats.runs), 1)
    : Math.max(...sortedPlayers.map(p => p.stats.wickets), 1);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Player Performance</Text>
        <View style={styles.toggle}>
          {(['batting', 'bowling'] as const).map(t => (
            <TouchableOpacity
              key={t}
              style={[styles.toggleBtn, activeType === t && styles.toggleActive]}
              onPress={() => setActiveType(t)}
            >
              <Text style={[styles.toggleText, activeType === t && styles.toggleTextActive]}>
                {t === 'batting' ? '🏏 Bat' : '⚾ Bowl'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.bars}>
        {sortedPlayers.map((p, i) => {
          const val = activeType === 'batting' ? p.stats.runs : p.stats.wickets;
          const pct = val / maxVal;
          const isTop = i === 0;
          return (
            <View key={p.id} style={styles.barRow}>
              <Text style={styles.playerName} numberOfLines={1}>{p.name}</Text>
              <View style={styles.barTrack}>
                <View style={[
                  styles.barFill,
                  { width: pct * (W - 130) },
                  isTop && styles.barTop,
                ]} />
                <Text style={styles.barValue}>{val}</Text>
              </View>
              <Text style={styles.subValue}>
                {activeType === 'batting'
                  ? `Avg: ${p.stats.average.toFixed(1)}`
                  : `Eco: ${p.stats.economy.toFixed(2)}`}
              </Text>
            </View>
          );
        })}
      </View>

      {sortedPlayers.length === 0 && (
        <Text style={styles.empty}>No data available</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { backgroundColor: theme.colors.surface, borderRadius: theme.borderRadius.lg, padding: 16, ...theme.shadows.sm },
  header:    { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  title:     { fontSize: 15, fontWeight: '700', color: theme.colors.text.primary },
  toggle:    { flexDirection: 'row', backgroundColor: theme.colors.surfaceAlt, borderRadius: theme.borderRadius.full, padding: 2 },
  toggleBtn: { paddingHorizontal: 12, paddingVertical: 5, borderRadius: theme.borderRadius.full },
  toggleActive: { backgroundColor: theme.colors.primary },
  toggleText:   { fontSize: 12, color: theme.colors.text.secondary, fontWeight: '600' },
  toggleTextActive: { color: '#fff' },
  bars:      { gap: 12 },
  barRow:    { },
  playerName:{ fontSize: 13, fontWeight: '600', color: theme.colors.text.primary, marginBottom: 4 },
  barTrack:  { flexDirection: 'row', alignItems: 'center', backgroundColor: theme.colors.surfaceAlt, borderRadius: 4, height: BAR_H, overflow: 'hidden' },
  barFill:   { height: BAR_H, backgroundColor: theme.colors.primaryLight, borderRadius: 4 },
  barTop:    { backgroundColor: theme.colors.accent },
  barValue:  { fontSize: 13, fontWeight: '700', color: theme.colors.text.primary, marginLeft: 8 },
  subValue:  { fontSize: 11, color: theme.colors.text.muted, marginTop: 2 },
  empty:     { textAlign: 'center', color: theme.colors.text.muted, paddingVertical: 16 },
});
