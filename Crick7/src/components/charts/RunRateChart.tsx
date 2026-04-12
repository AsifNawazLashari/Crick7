import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { theme } from '../../theme';
import { getRunRateData } from '../../utils/scoring';
import { Delivery } from '../../types';

const W = Dimensions.get('window').width - 64;
const H = 160;

interface RunRateChartProps {
  deliveries: Delivery[];
  powerplayOvers?: number;
}

export const RunRateChart: React.FC<RunRateChartProps> = ({ deliveries, powerplayOvers = 10 }) => {
  const data = getRunRateData(deliveries);
  if (data.length < 2) return (
    <View style={styles.empty}><Text style={styles.emptyText}>Not enough data yet</Text></View>
  );

  const maxRR = Math.max(...data.map(d => d.runRate), 8);
  const minRR = 0;
  const range = maxRR - minRR || 1;

  const getX = (i: number) => (i / (data.length - 1)) * W;
  const getY = (rr: number) => H - ((rr - minRR) / range) * H;

  const points = data.map((d, i) => `${getX(i)},${getY(d.runRate)}`).join(' ');

  const yLabels = [0, Math.round(maxRR / 2), Math.round(maxRR)];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Run Rate Progression</Text>
      <View style={styles.chart}>
        {/* Y axis labels */}
        <View style={styles.yAxis}>
          {yLabels.reverse().map(v => (
            <Text key={v} style={styles.axisLabel}>{v}</Text>
          ))}
        </View>
        <View style={styles.plotArea}>
          {/* Powerplay zone */}
          {powerplayOvers < data.length && (
            <View style={[styles.ppZone, { width: (powerplayOvers / data.length) * (W - 30) }]}>
              <Text style={styles.ppLabel}>PP</Text>
            </View>
          )}
          {/* SVG-like polyline using View borders */}
          {data.map((d, i) => {
            if (i === 0) return null;
            const x1 = ((i - 1) / (data.length - 1)) * (W - 30);
            const x2 = (i / (data.length - 1)) * (W - 30);
            const y1 = H - ((data[i-1].runRate - minRR) / range) * H;
            const y2 = getY(d.runRate);
            const dx = x2 - x1; const dy = y2 - y1;
            const len = Math.sqrt(dx*dx + dy*dy);
            const angle = Math.atan2(dy, dx) * 180 / Math.PI;
            return (
              <View key={i} style={[styles.line, { width: len, left: x1, top: y1, transform: [{ rotate: `${angle}deg` }] }]} />
            );
          })}
          {/* Data points */}
          {data.map((d, i) => (
            <View key={`dot-${i}`} style={[styles.dot, { left: (i / (data.length - 1)) * (W - 30) - 4, top: getY(d.runRate) - 4 }]} />
          ))}
        </View>
      </View>
      {/* X axis */}
      <View style={styles.xAxis}>
        {[1, Math.round(data.length / 2), data.length].map(v => (
          <Text key={v} style={styles.axisLabel}>Ov {v}</Text>
        ))}
      </View>
      {/* Stats row */}
      <View style={styles.statsRow}>
        <View style={styles.stat}>
          <Text style={styles.statVal}>{data[data.length - 1]?.runRate.toFixed(2)}</Text>
          <Text style={styles.statLbl}>Current RR</Text>
        </View>
        <View style={styles.stat}>
          <Text style={styles.statVal}>{Math.max(...data.map(d => d.runRate)).toFixed(2)}</Text>
          <Text style={styles.statLbl}>Peak RR</Text>
        </View>
        <View style={styles.stat}>
          <Text style={styles.statVal}>{data[powerplayOvers - 1]?.runRate.toFixed(2) || '—'}</Text>
          <Text style={styles.statLbl}>PP RR</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { backgroundColor: theme.colors.surface, borderRadius: theme.borderRadius.lg, padding: 16, ...theme.shadows.sm },
  title:     { fontSize: 15, fontWeight: '700', color: theme.colors.text.primary, marginBottom: 12 },
  chart:     { flexDirection: 'row', height: H },
  yAxis:     { width: 30, justifyContent: 'space-between', paddingVertical: 4 },
  plotArea:  { flex: 1, position: 'relative', overflow: 'hidden' },
  ppZone:    { position: 'absolute', top: 0, left: 0, height: H, backgroundColor: 'rgba(233,196,106,0.15)', borderRightWidth: 1, borderRightColor: theme.colors.accent },
  ppLabel:   { position: 'absolute', bottom: 4, right: 4, fontSize: 9, color: theme.colors.accentDark, fontWeight: '700' },
  line:      { position: 'absolute', height: 2.5, backgroundColor: theme.colors.primary, transformOrigin: 'left center', borderRadius: 2 },
  dot:       { position: 'absolute', width: 8, height: 8, borderRadius: 4, backgroundColor: theme.colors.primary, borderWidth: 2, borderColor: '#fff' },
  xAxis:     { flexDirection: 'row', justifyContent: 'space-between', marginTop: 4, paddingLeft: 30 },
  axisLabel: { fontSize: 10, color: theme.colors.text.muted },
  empty:     { padding: 24, alignItems: 'center' },
  emptyText: { color: theme.colors.text.muted },
  statsRow:  { flexDirection: 'row', justifyContent: 'space-around', marginTop: 14, paddingTop: 12, borderTopWidth: 1, borderTopColor: theme.colors.borderLight },
  stat:      { alignItems: 'center' },
  statVal:   { fontSize: 18, fontWeight: '700', color: theme.colors.primary },
  statLbl:   { fontSize: 11, color: theme.colors.text.muted, marginTop: 2 },
});
