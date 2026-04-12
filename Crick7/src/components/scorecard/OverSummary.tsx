import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { theme } from '../../theme';
import { Delivery } from '../../types';
import { groupDeliveriesByOver, getOverRuns, getOverWickets } from '../../utils/scoring';

interface OverSummaryProps {
  deliveries: Delivery[];
  currentOver: number;
}

export const OverSummary: React.FC<OverSummaryProps> = ({ deliveries, currentOver }) => {
  const grouped = groupDeliveriesByOver(deliveries);
  const currentDeliveries = grouped[currentOver] || [];

  const overRuns = getOverRuns(currentDeliveries);
  const overWickets = getOverWickets(currentDeliveries);
  const dots = currentDeliveries.filter(d => !d.isWide && !d.isNoBall && d.runs === 0 && !d.wicket).length;
  const boundaries = currentDeliveries.filter(d => d.isBoundary && !d.isSix).length;
  const sixes = currentDeliveries.filter(d => d.isSix).length;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Over {currentOver} Summary</Text>
        <Text style={styles.total}>{overRuns} runs{overWickets > 0 ? ` • ${overWickets}W` : ''}</Text>
      </View>
      <View style={styles.statsRow}>
        {[
          { label: 'Dots', value: dots, color: '#9E9E9E' },
          { label: 'Runs', value: overRuns, color: theme.colors.primary },
          { label: '4s', value: boundaries, color: theme.colors.score.boundary },
          { label: '6s', value: sixes, color: theme.colors.score.six },
          { label: 'Wkts', value: overWickets, color: theme.colors.score.wicket },
        ].map(s => (
          <View key={s.label} style={styles.stat}>
            <Text style={[styles.statValue, { color: s.color }]}>{s.value}</Text>
            <Text style={styles.statLabel}>{s.label}</Text>
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { backgroundColor: theme.colors.surface, borderRadius: theme.borderRadius.lg, padding: 14, ...theme.shadows.sm, marginBottom: 12 },
  header:    { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  title:     { fontSize: 14, fontWeight: '700', color: theme.colors.text.primary },
  total:     { fontSize: 14, fontWeight: '600', color: theme.colors.text.secondary },
  statsRow:  { flexDirection: 'row', justifyContent: 'space-around' },
  stat:      { alignItems: 'center' },
  statValue: { fontSize: 22, fontWeight: '800' },
  statLabel: { fontSize: 11, color: theme.colors.text.muted, marginTop: 2, fontWeight: '500' },
});
