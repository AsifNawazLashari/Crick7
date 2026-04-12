import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { theme } from '../../theme';
import { Delivery } from '../../types';
import { getBallDisplay, getOverBalls } from '../../utils/format';
import { groupDeliveriesByOver } from '../../utils/scoring';

interface BallByBallProps {
  deliveries: Delivery[];
}

const BallCircle: React.FC<{ delivery: Delivery }> = ({ delivery }) => {
  const display = getBallDisplay(delivery);
  let bg = theme.colors.surfaceAlt;
  let color = theme.colors.text.secondary;
  if (delivery.isSix)     { bg = theme.colors.score.six;      color = '#fff'; }
  else if (delivery.isBoundary) { bg = theme.colors.score.boundary; color = '#fff'; }
  else if (delivery.wicket)     { bg = theme.colors.score.wicket;   color = '#fff'; }
  else if (delivery.isWide || delivery.isNoBall) { bg = theme.colors.score.extra; color = '#fff'; }
  else if (delivery.runs === 0) { bg = '#E0E0E0'; color = '#555'; }
  else { bg = theme.colors.score.single; color = '#fff'; }

  return (
    <View style={[styles.ball, { backgroundColor: bg }]}>
      <Text style={[styles.ballText, { color }]}>{display}</Text>
    </View>
  );
};

export const BallByBall: React.FC<BallByBallProps> = ({ deliveries }) => {
  const grouped = groupDeliveriesByOver(deliveries);
  const overNums = Object.keys(grouped).map(Number).sort((a, b) => b - a);

  if (overNums.length === 0) {
    return (
      <View style={styles.empty}>
        <Text style={styles.emptyText}>No deliveries yet</Text>
      </View>
    );
  }

  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      {overNums.map(over => {
        const overDeliveries = grouped[over];
        const overRuns = overDeliveries.reduce((s, d) => s + d.runs + (d.isWide ? 1 : 0) + (d.isNoBall ? 1 : 0), 0);
        const wickets = overDeliveries.filter(d => d.wicket).length;
        return (
          <View key={over} style={styles.overRow}>
            <View style={styles.overMeta}>
              <Text style={styles.overLabel}>Over {over}</Text>
              <Text style={styles.overSummary}>{overRuns} runs{wickets > 0 ? ` • ${wickets}W` : ''}</Text>
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.ballsRow}>
              {overDeliveries.map((d, i) => <BallCircle key={d.id || i} delivery={d} />)}
            </ScrollView>
          </View>
        );
      })}
      <View style={styles.legend}>
        {[
          { bg: theme.colors.score.boundary, label: '4' },
          { bg: theme.colors.score.six,      label: '6' },
          { bg: theme.colors.score.wicket,   label: 'W' },
          { bg: theme.colors.score.extra,    label: 'Extra' },
          { bg: theme.colors.score.single,   label: 'Runs' },
          { bg: '#E0E0E0',                   label: 'Dot' },
        ].map(item => (
          <View key={item.label} style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: item.bg }]} />
            <Text style={styles.legendLabel}>{item.label}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  overRow:     { marginBottom: 16 },
  overMeta:    { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8, paddingHorizontal: 2 },
  overLabel:   { fontSize: 13, fontWeight: '700', color: theme.colors.text.primary },
  overSummary: { fontSize: 12, color: theme.colors.text.muted },
  ballsRow:    { flexDirection: 'row' },
  ball:        { width: 38, height: 38, borderRadius: 19, alignItems: 'center', justifyContent: 'center', marginRight: 8, ...theme.shadows.sm },
  ballText:    { fontSize: 12, fontWeight: '700' },
  empty:       { padding: 32, alignItems: 'center' },
  emptyText:   { color: theme.colors.text.muted, fontSize: 14 },
  legend:      { flexDirection: 'row', flexWrap: 'wrap', marginTop: 8, gap: 8 },
  legendItem:  { flexDirection: 'row', alignItems: 'center', marginRight: 12 },
  legendDot:   { width: 12, height: 12, borderRadius: 6, marginRight: 4 },
  legendLabel: { fontSize: 11, color: theme.colors.text.muted },
});
