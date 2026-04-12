import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { theme } from '../../theme';
import { Delivery, Player } from '../../types';
import { getBatsmanStats, getBowlerStats } from '../../utils/scoring';

interface ScorecardTableProps {
  deliveries: Delivery[];
  battingPlayers: Player[];
  bowlingPlayers: Player[];
  extras: { wides: number; noBalls: number; byes: number; legByes: number; penalty: number };
  totalRuns: number;
  wickets: number;
  overs: number;
  balls: number;
}

export const ScorecardTable: React.FC<ScorecardTableProps> = ({
  deliveries, battingPlayers, bowlingPlayers, extras, totalRuns, wickets, overs, balls,
}) => {
  const totalExtras = extras.wides + extras.noBalls + extras.byes + extras.legByes + extras.penalty;

  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      {/* Batting Table */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>BATTING</Text>
        </View>
        <View style={styles.tableHeader}>
          <Text style={[styles.col, styles.colBatsman, styles.headerText]}>Batsman</Text>
          <Text style={[styles.col, styles.colNum, styles.headerText]}>R</Text>
          <Text style={[styles.col, styles.colNum, styles.headerText]}>B</Text>
          <Text style={[styles.col, styles.colNum, styles.headerText]}>4s</Text>
          <Text style={[styles.col, styles.colNum, styles.headerText]}>6s</Text>
          <Text style={[styles.col, styles.colSR, styles.headerText]}>SR</Text>
        </View>
        {battingPlayers.map((p, idx) => {
          const s = getBatsmanStats(deliveries, p.id);
          const dismissal = deliveries.find(d => d.wicket?.playerId === p.id);
          return (
            <View key={p.id} style={[styles.tableRow, idx % 2 === 0 && styles.rowAlt]}>
              <View style={[styles.col, styles.colBatsman]}>
                <Text style={styles.playerName}>{p.name}</Text>
                <Text style={styles.dismissal}>
                  {dismissal ? `${dismissal.wicket?.type}` : s.balls > 0 ? 'not out' : '—'}
                </Text>
              </View>
              <Text style={[styles.col, styles.colNum, styles.runs]}>{s.runs}</Text>
              <Text style={[styles.col, styles.colNum, styles.statText]}>{s.balls}</Text>
              <Text style={[styles.col, styles.colNum, styles.statText]}>{s.fours}</Text>
              <Text style={[styles.col, styles.colNum, styles.statText]}>{s.sixes}</Text>
              <Text style={[styles.col, styles.colSR, styles.statText]}>{s.strikeRate.toFixed(1)}</Text>
            </View>
          );
        })}
        <View style={styles.extrasRow}>
          <Text style={styles.extrasLabel}>Extras</Text>
          <Text style={styles.extrasValue}>{totalExtras} (w {extras.wides}, nb {extras.noBalls}, b {extras.byes}, lb {extras.legByes})</Text>
        </View>
        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>TOTAL</Text>
          <Text style={styles.totalValue}>{totalRuns}/{wickets} ({overs}.{balls} Ov)</Text>
        </View>
      </View>

      {/* Bowling Table */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>BOWLING</Text>
        </View>
        <View style={styles.tableHeader}>
          <Text style={[styles.col, styles.colBatsman, styles.headerText]}>Bowler</Text>
          <Text style={[styles.col, styles.colNum, styles.headerText]}>O</Text>
          <Text style={[styles.col, styles.colNum, styles.headerText]}>M</Text>
          <Text style={[styles.col, styles.colNum, styles.headerText]}>R</Text>
          <Text style={[styles.col, styles.colNum, styles.headerText]}>W</Text>
          <Text style={[styles.col, styles.colSR, styles.headerText]}>Econ</Text>
        </View>
        {bowlingPlayers.map((p, idx) => {
          const s = getBowlerStats(deliveries, p.id);
          return (
            <View key={p.id} style={[styles.tableRow, idx % 2 === 0 && styles.rowAlt]}>
              <Text style={[styles.col, styles.colBatsman, styles.playerName]}>{p.name}</Text>
              <Text style={[styles.col, styles.colNum, styles.statText]}>{s.overs}.{s.balls}</Text>
              <Text style={[styles.col, styles.colNum, styles.statText]}>0</Text>
              <Text style={[styles.col, styles.colNum, styles.statText]}>{s.runs}</Text>
              <Text style={[styles.col, styles.colNum, s.wickets > 0 ? styles.wicketText : styles.statText]}>{s.wickets}</Text>
              <Text style={[styles.col, styles.colSR, styles.statText]}>{s.economy.toFixed(2)}</Text>
            </View>
          );
        })}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  section:       { marginBottom: 16 },
  sectionHeader: { backgroundColor: theme.colors.primary, paddingHorizontal: 14, paddingVertical: 8 },
  sectionTitle:  { color: '#fff', fontSize: 12, fontWeight: '700', letterSpacing: 1 },
  tableHeader:   { flexDirection: 'row', backgroundColor: theme.colors.surfaceAlt, paddingHorizontal: 14, paddingVertical: 8, borderBottomWidth: 1, borderColor: theme.colors.border },
  headerText:    { fontSize: 11, fontWeight: '700', color: theme.colors.text.secondary, letterSpacing: 0.5 },
  tableRow:      { flexDirection: 'row', paddingHorizontal: 14, paddingVertical: 10, alignItems: 'center' },
  rowAlt:        { backgroundColor: theme.colors.surfaceAlt },
  col:           { },
  colBatsman:    { flex: 2.5 },
  colNum:        { flex: 0.7, textAlign: 'center' },
  colSR:         { flex: 1, textAlign: 'right' },
  playerName:    { fontSize: 14, fontWeight: '600', color: theme.colors.text.primary },
  dismissal:     { fontSize: 11, color: theme.colors.text.muted, marginTop: 1 },
  runs:          { fontSize: 16, fontWeight: '700', color: theme.colors.text.primary, textAlign: 'center' },
  statText:      { fontSize: 14, color: theme.colors.text.secondary, textAlign: 'center' },
  wicketText:    { fontSize: 14, fontWeight: '700', color: theme.colors.status.live, textAlign: 'center' },
  extrasRow:     { flexDirection: 'row', paddingHorizontal: 14, paddingVertical: 8, borderTopWidth: 1, borderColor: theme.colors.border },
  extrasLabel:   { fontSize: 13, fontWeight: '600', color: theme.colors.text.secondary, marginRight: 8 },
  extrasValue:   { fontSize: 13, color: theme.colors.text.muted },
  totalRow:      { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 14, paddingVertical: 10, backgroundColor: theme.colors.primaryDark },
  totalLabel:    { fontSize: 14, fontWeight: '700', color: '#fff', letterSpacing: 1 },
  totalValue:    { fontSize: 14, fontWeight: '700', color: theme.colors.accent },
});
