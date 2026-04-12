import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { theme } from '../../theme';
import { Delivery } from '../../types';

const SIZE = Math.min(Dimensions.get('window').width - 80, 260);
const CX = SIZE / 2;
const CY = SIZE / 2;
const R = SIZE / 2 - 10;

interface WagonWheelProps {
  deliveries: Delivery[];
  batsmanId?: string;
}

const getAngle = (index: number, total: number) => (index / total) * Math.PI * 2 - Math.PI / 2;
const getLength = (runs: number) => {
  if (runs === 0) return R * 0.3;
  if (runs === 1) return R * 0.45;
  if (runs === 2) return R * 0.6;
  if (runs === 3) return R * 0.7;
  if (runs === 4) return R * 0.88;
  return R * 0.98;
};

const getColor = (delivery: Delivery) => {
  if (delivery.isSix) return theme.colors.score.six;
  if (delivery.isBoundary) return theme.colors.score.boundary;
  if (delivery.wicket) return theme.colors.score.wicket;
  if (delivery.runs === 0) return '#CCC';
  return theme.colors.score.single;
};

export const WagonWheel: React.FC<WagonWheelProps> = ({ deliveries, batsmanId }) => {
  const filtered = batsmanId ? deliveries.filter(d => d.batsmanId === batsmanId) : deliveries;
  const batDeliveries = filtered.filter(d => !d.isBye && !d.isLegBye);
  const total = batDeliveries.length;

  const boundaries = batDeliveries.filter(d => d.isBoundary && !d.isSix).length;
  const sixes = batDeliveries.filter(d => d.isSix).length;
  const dots = batDeliveries.filter(d => d.runs === 0 && !d.wicket).length;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Wagon Wheel</Text>
      <View style={styles.wheel}>
        {/* Concentric circles */}
        {[0.3, 0.6, 1.0].map((r, i) => (
          <View key={i} style={[styles.circle, {
            width: SIZE * r, height: SIZE * r,
            borderRadius: (SIZE * r) / 2,
            left: CX - (SIZE * r) / 2, top: CY - (SIZE * r) / 2,
          }]} />
        ))}
        {/* Field zones */}
        {['On', 'Off', 'Mid-on', 'Mid-off', 'Square Leg', 'Point', 'Fine Leg', 'Third Man'].map((z, i) => {
          const angle = (i / 8) * Math.PI * 2 - Math.PI / 2;
          const lx = CX + Math.cos(angle) * R * 1.05 - 15;
          const ly = CY + Math.sin(angle) * R * 1.05 - 8;
          return (
            <Text key={z} style={[styles.zoneLabel, { left: lx, top: ly }]}>{z}</Text>
          );
        })}
        {/* Shots */}
        {batDeliveries.map((d, i) => {
          const angle = getAngle(i, Math.max(total, 1)) + (Math.random() * 0.3 - 0.15);
          const len = getLength(d.runs);
          const ex = CX + Math.cos(angle) * len;
          const ey = CY + Math.sin(angle) * len;
          const color = getColor(d);
          const dx = ex - CX; const dy = ey - CY;
          const lineLen = Math.sqrt(dx*dx + dy*dy);
          const lineAngle = Math.atan2(dy, dx) * 180 / Math.PI;
          return (
            <View key={d.id || i} style={[styles.shot, {
              width: lineLen, left: CX, top: CY - 1,
              backgroundColor: color, opacity: d.runs === 0 ? 0.35 : 0.75,
              transform: [{ rotate: `${lineAngle}deg` }],
            }]} />
          );
        })}
        {/* Pitch */}
        <View style={styles.pitch} />
        <View style={[styles.dot, { left: CX - 4, top: CY - 4 }]} />
      </View>
      <View style={styles.legend}>
        <View style={styles.legendItem}><View style={[styles.legendDot, { backgroundColor: theme.colors.score.boundary }]} /><Text style={styles.legendText}>4s: {boundaries}</Text></View>
        <View style={styles.legendItem}><View style={[styles.legendDot, { backgroundColor: theme.colors.score.six }]} /><Text style={styles.legendText}>6s: {sixes}</Text></View>
        <View style={styles.legendItem}><View style={[styles.legendDot, { backgroundColor: '#CCC' }]} /><Text style={styles.legendText}>Dots: {dots}</Text></View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { backgroundColor: theme.colors.surface, borderRadius: theme.borderRadius.lg, padding: 16, ...theme.shadows.sm, alignItems: 'center' },
  title:     { fontSize: 15, fontWeight: '700', color: theme.colors.text.primary, marginBottom: 12, alignSelf: 'flex-start' },
  wheel:     { width: SIZE, height: SIZE, position: 'relative' },
  circle:    { position: 'absolute', borderWidth: 1, borderColor: theme.colors.border },
  zoneLabel: { position: 'absolute', fontSize: 8, color: theme.colors.text.muted, fontWeight: '600' },
  shot:      { position: 'absolute', height: 2, transformOrigin: 'left center', borderRadius: 1 },
  pitch:     { position: 'absolute', width: 14, height: 28, backgroundColor: '#D4B896', borderRadius: 3, left: CX - 7, top: CY - 14, borderWidth: 1, borderColor: '#C4A880' },
  dot:       { position: 'absolute', width: 8, height: 8, borderRadius: 4, backgroundColor: theme.colors.primary },
  legend:    { flexDirection: 'row', marginTop: 12, gap: 16 },
  legendItem:{ flexDirection: 'row', alignItems: 'center' },
  legendDot: { width: 10, height: 10, borderRadius: 5, marginRight: 5 },
  legendText:{ fontSize: 12, color: theme.colors.text.secondary, fontWeight: '600' },
});
