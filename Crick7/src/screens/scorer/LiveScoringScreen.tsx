import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { Header } from '../../components/common/Header';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { OverSummary } from '../../components/scorecard/OverSummary';
import { BallByBall } from '../../components/scorecard/BallByBall';
import { theme } from '../../theme';
import { db } from '../../data/db';
import { useMatch } from '../../hooks/useMatch';
import { Delivery } from '../../types';
import { formatRunRate } from '../../utils/format';

interface Props { matchId: string; onBack: () => void; }

type RunOption = 0 | 1 | 2 | 3 | 4 | 6;

export const LiveScoringScreen: React.FC<Props> = ({ matchId, onBack }) => {
  const { match, currentInnings, innings, loading, refresh, addDelivery } = useMatch(matchId);
  const [selectedRuns, setSelectedRuns] = useState<RunOption | null>(null);
  const [isWide, setIsWide] = useState(false);
  const [isNoBall, setIsNoBall] = useState(false);
  const [isBye, setIsBye] = useState(false);
  const [isLegBye, setIsLegBye] = useState(false);
  const [wicketMode, setWicketMode] = useState(false);
  const [wicketType, setWicketType] = useState<Delivery['wicket']>();
  const [showBBB, setShowBBB] = useState(false);

  if (!match || !currentInnings) {
    return (
      <View style={styles.screen}>
        <Header title="Live Scoring" onBack={onBack} />
        <View style={styles.center}><Text style={styles.noMatch}>No active innings found.</Text></View>
      </View>
    );
  }

  const battingTeam  = db.teams.getById(currentInnings.battingTeamId);
  const bowlingTeam  = db.teams.getById(currentInnings.bowlingTeamId);
  const battingPlayers  = db.players.getByTeam(currentInnings.battingTeamId);
  const bowlingPlayers  = db.players.getByTeam(currentInnings.bowlingTeamId);
  const striker  = battingPlayers[0];
  const nonStriker = battingPlayers[1];
  const currentBowler = bowlingPlayers[0];
  const tournament = db.tournaments.getById(match.tournamentId);
  const runRate = formatRunRate(currentInnings.totalRuns, currentInnings.overs, currentInnings.balls);

  const resetDelivery = () => {
    setSelectedRuns(null); setIsWide(false); setIsNoBall(false);
    setIsBye(false); setIsLegBye(false); setWicketMode(false); setWicketType(undefined);
  };

  const handleDeliver = async () => {
    if (selectedRuns === null && !isWide && !isNoBall) {
      Alert.alert('Select runs or extra');
      return;
    }
    const delivery: Omit<Delivery, 'id'> = {
      inningsId: currentInnings.id,
      over: currentInnings.overs + 1,
      ball: currentInnings.balls + 1,
      batsmanId: striker?.id || '',
      bowlerId: currentBowler?.id || '',
      runs: selectedRuns ?? 0,
      isWide, isNoBall, isBye, isLegBye,
      isBoundary: selectedRuns === 4,
      isSix: selectedRuns === 6,
      wicket: wicketType,
    };
    await addDelivery(currentInnings.id, delivery);

    // auto commentary
    let commentText = '';
    let commentType: any = 'normal';
    if (selectedRuns === 6)      { commentText = `SIX! ${striker?.name} launches it over the boundary!`; commentType = 'six'; }
    else if (selectedRuns === 4) { commentText = `FOUR! ${striker?.name} finds the gap!`; commentType = 'boundary'; }
    else if (wicketType)         { commentText = `WICKET! ${striker?.name} is OUT — ${wicketType.type}!`; commentType = 'wicket'; }
    else if (isWide)             { commentText = `Wide ball from ${currentBowler?.name}.`; commentType = 'wide'; }
    else if (isNoBall)           { commentText = `No ball! Free hit coming up.`; commentType = 'noball'; }
    else if (selectedRuns === 0) { commentText = `Dot ball. Good line from ${currentBowler?.name}.`; }
    else                         { commentText = `${selectedRuns} run${selectedRuns !== 1 ? 's' : ''} taken.`; }

    if (commentText) {
      db.commentary.add({ matchId, over: currentInnings.overs + 1, ball: currentInnings.balls + 1, text: commentText, type: commentType });
    }

    resetDelivery();
  };

  const RUNS: RunOption[] = [0, 1, 2, 3, 4, 6];
  const WICKET_TYPES = ['bowled', 'caught', 'lbw', 'runout', 'stumped', 'hitwicket'] as const;

  return (
    <View style={styles.screen}>
      <Header
        title="Live Scoring"
        subtitle={`${battingTeam?.name} vs ${bowlingTeam?.name}`}
        onBack={onBack}
        rightComponent={<Badge label="LIVE" variant="live" dot />}
      />
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Scoreboard */}
        <View style={styles.scoreboard}>
          <View style={styles.scoreMain}>
            <Text style={styles.scoreRuns}>{currentInnings.totalRuns}/{currentInnings.wickets}</Text>
            <Text style={styles.scoreOvers}>({currentInnings.overs}.{currentInnings.balls} Ov) • RR: {runRate}</Text>
          </View>
          <View style={styles.scoreMeta}>
            <Text style={styles.teamName}>{battingTeam?.name}</Text>
            <Text style={styles.ppStatus}>
              {currentInnings.overs < (tournament?.powerplayOvers || 10) ? '⚡ POWERPLAY' : ''}
            </Text>
          </View>
        </View>

        {/* Batsmen */}
        <View style={styles.batsmenRow}>
          {[
            { player: striker, label: '* ON STRIKE' },
            { player: nonStriker, label: 'Non-striker' },
          ].map(({ player, label }) => {
            if (!player) return null;
            const s = currentInnings.deliveries.filter(d => d.batsmanId === player.id);
            const runs = s.reduce((acc, d) => acc + (!d.isBye && !d.isLegBye && !d.isWide ? d.runs : 0), 0);
            const balls = s.filter(d => !d.isWide && !d.isNoBall).length;
            return (
              <View key={player.id} style={styles.batsmanCard}>
                <Text style={styles.batsmanLabel}>{label}</Text>
                <Text style={styles.batsmanName}>{player.name}</Text>
                <Text style={styles.batsmanScore}>{runs} ({balls})</Text>
              </View>
            );
          })}
        </View>

        {/* Bowler */}
        <View style={styles.bowlerRow}>
          <Text style={styles.bowlerLabel}>Bowling: </Text>
          <Text style={styles.bowlerName}>{currentBowler?.name || '—'}</Text>
          <Text style={styles.bowlerFigures}>
            {(() => {
              const bs = currentInnings.deliveries.filter(d => d.bowlerId === currentBowler?.id);
              const legal = bs.filter(d => !d.isWide && !d.isNoBall).length;
              const wkts = bs.filter(d => d.wicket).length;
              const runs = bs.reduce((a, d) => a + d.runs + (d.isWide ? 1 : 0) + (d.isNoBall ? 1 : 0), 0);
              return `${Math.floor(legal/6)}.${legal%6} ov · ${wkts}/${runs}`;
            })()}
          </Text>
        </View>

        {/* Run Buttons */}
        <View style={styles.panel}>
          <Text style={styles.panelTitle}>Runs</Text>
          <View style={styles.runGrid}>
            {RUNS.map(r => (
              <TouchableOpacity
                key={r}
                style={[
                  styles.runBtn,
                  selectedRuns === r && styles.runBtnActive,
                  r === 4 && styles.runBtn4,
                  r === 6 && styles.runBtn6,
                  selectedRuns === r && r === 4 && styles.runBtn4Active,
                  selectedRuns === r && r === 6 && styles.runBtn6Active,
                ]}
                onPress={() => setSelectedRuns(selectedRuns === r ? null : r)}
              >
                <Text style={[styles.runBtnText, selectedRuns === r && styles.runBtnTextActive]}>{r}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Extras */}
          <Text style={styles.panelTitle}>Extras</Text>
          <View style={styles.extrasRow}>
            {[
              { label: 'Wide', val: isWide, set: () => setIsWide(!isWide) },
              { label: 'No Ball', val: isNoBall, set: () => setIsNoBall(!isNoBall) },
              { label: 'Bye', val: isBye, set: () => setIsBye(!isBye) },
              { label: 'Leg Bye', val: isLegBye, set: () => setIsLegBye(!isLegBye) },
            ].map(({ label, val, set }) => (
              <TouchableOpacity key={label} style={[styles.extraBtn, val && styles.extraActive]} onPress={set}>
                <Text style={[styles.extraText, val && styles.extraTextActive]}>{label}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Wicket */}
          <TouchableOpacity style={[styles.wicketToggle, wicketMode && styles.wicketToggleActive]} onPress={() => setWicketMode(!wicketMode)}>
            <Text style={[styles.wicketToggleText, wicketMode && styles.wicketToggleTextActive]}>
              {wicketMode ? '❌ Cancel Wicket' : '🏏 Mark Wicket'}
            </Text>
          </TouchableOpacity>

          {wicketMode && (
            <View style={styles.wicketTypes}>
              {WICKET_TYPES.map(wt => (
                <TouchableOpacity
                  key={wt}
                  style={[styles.wicketTypeBtn, wicketType?.type === wt && styles.wicketTypeActive]}
                  onPress={() => setWicketType(wicketType?.type === wt ? undefined : { type: wt, playerId: striker?.id || '' })}
                >
                  <Text style={[styles.wicketTypeText, wicketType?.type === wt && styles.wicketTypeTextActive]}>{wt}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}

          {/* Deliver Button */}
          <TouchableOpacity style={styles.deliverBtn} onPress={handleDeliver} activeOpacity={0.85}>
            <Text style={styles.deliverText}>
              {wicketType ? `⚡ WICKET — ${wicketType.type}` : isWide ? '⚡ WIDE' : isNoBall ? '⚡ NO BALL' : `⚡ DELIVER  ${selectedRuns ?? '?'} run${selectedRuns !== 1 ? 's' : ''}`}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Ball by ball toggle */}
        <TouchableOpacity style={styles.bbbToggle} onPress={() => setShowBBB(!showBBB)}>
          <Text style={styles.bbbToggleText}>{showBBB ? '▲ Hide' : '▼ Show'} Ball-by-Ball</Text>
        </TouchableOpacity>

        {showBBB && (
          <View style={styles.bbbWrap}>
            <OverSummary deliveries={currentInnings.deliveries} currentOver={currentInnings.overs + 1} />
            <BallByBall deliveries={currentInnings.deliveries} />
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  screen:               { flex: 1, backgroundColor: theme.colors.background },
  center:               { flex: 1, alignItems: 'center', justifyContent: 'center' },
  noMatch:              { color: theme.colors.text.muted, fontSize: 16 },
  scoreboard:           { backgroundColor: theme.colors.primary, padding: 20 },
  scoreMain:            { alignItems: 'center', marginBottom: 8 },
  scoreRuns:            { fontSize: 52, fontWeight: '800', color: '#fff', letterSpacing: -1 },
  scoreOvers:           { fontSize: 14, color: 'rgba(255,255,255,0.8)', marginTop: 2 },
  scoreMeta:            { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  teamName:             { fontSize: 14, fontWeight: '600', color: 'rgba(255,255,255,0.9)' },
  ppStatus:             { fontSize: 12, color: theme.colors.accent, fontWeight: '700' },
  batsmenRow:           { flexDirection: 'row', gap: 10, padding: 12 },
  batsmanCard:          { flex: 1, backgroundColor: theme.colors.surface, borderRadius: theme.borderRadius.lg, padding: 12, ...theme.shadows.sm },
  batsmanLabel:         { fontSize: 10, color: theme.colors.text.muted, fontWeight: '600', letterSpacing: 0.5, marginBottom: 4 },
  batsmanName:          { fontSize: 13, fontWeight: '700', color: theme.colors.text.primary },
  batsmanScore:         { fontSize: 20, fontWeight: '800', color: theme.colors.primary, marginTop: 2 },
  bowlerRow:            { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingBottom: 10 },
  bowlerLabel:          { fontSize: 13, color: theme.colors.text.muted },
  bowlerName:           { fontSize: 13, fontWeight: '700', color: theme.colors.text.primary },
  bowlerFigures:        { fontSize: 12, color: theme.colors.text.secondary, marginLeft: 8 },
  panel:                { margin: 12, backgroundColor: theme.colors.surface, borderRadius: theme.borderRadius.xl, padding: 16, ...theme.shadows.md },
  panelTitle:           { fontSize: 12, fontWeight: '700', color: theme.colors.text.muted, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 10, marginTop: 6 },
  runGrid:              { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 },
  runBtn:               { width: 52, height: 52, borderRadius: 26, backgroundColor: theme.colors.surfaceAlt, borderWidth: 2, borderColor: theme.colors.border, alignItems: 'center', justifyContent: 'center' },
  runBtnActive:         { backgroundColor: theme.colors.primary, borderColor: theme.colors.primary },
  runBtn4:              { borderColor: theme.colors.score.boundary },
  runBtn6:              { borderColor: theme.colors.score.six },
  runBtn4Active:        { backgroundColor: theme.colors.score.boundary, borderColor: theme.colors.score.boundary },
  runBtn6Active:        { backgroundColor: theme.colors.score.six, borderColor: theme.colors.score.six },
  runBtnText:           { fontSize: 20, fontWeight: '800', color: theme.colors.text.primary },
  runBtnTextActive:     { color: '#fff' },
  extrasRow:            { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 12 },
  extraBtn:             { paddingHorizontal: 14, paddingVertical: 8, borderRadius: theme.borderRadius.full, borderWidth: 1.5, borderColor: theme.colors.border, backgroundColor: theme.colors.surfaceAlt },
  extraActive:          { borderColor: theme.colors.score.extra, backgroundColor: '#FFF3E0' },
  extraText:            { fontSize: 13, fontWeight: '600', color: theme.colors.text.secondary },
  extraTextActive:      { color: '#E65100' },
  wicketToggle:         { padding: 12, borderRadius: theme.borderRadius.md, borderWidth: 1.5, borderColor: theme.colors.border, alignItems: 'center', marginBottom: 10 },
  wicketToggleActive:   { borderColor: theme.colors.status.live, backgroundColor: theme.colors.status.liveLight },
  wicketToggleText:     { fontSize: 14, fontWeight: '700', color: theme.colors.text.secondary },
  wicketToggleTextActive:{ color: theme.colors.status.live },
  wicketTypes:          { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 12 },
  wicketTypeBtn:        { paddingHorizontal: 12, paddingVertical: 7, borderRadius: theme.borderRadius.md, borderWidth: 1.5, borderColor: theme.colors.border, backgroundColor: theme.colors.surfaceAlt },
  wicketTypeActive:     { borderColor: theme.colors.status.live, backgroundColor: theme.colors.status.liveLight },
  wicketTypeText:       { fontSize: 12, fontWeight: '600', color: theme.colors.text.secondary, textTransform: 'capitalize' },
  wicketTypeTextActive: { color: theme.colors.status.live },
  deliverBtn:           { backgroundColor: theme.colors.primary, padding: 18, borderRadius: theme.borderRadius.lg, alignItems: 'center', marginTop: 6, ...theme.shadows.md },
  deliverText:          { color: '#fff', fontSize: 17, fontWeight: '800', letterSpacing: 0.5 },
  bbbToggle:            { marginHorizontal: 16, marginBottom: 8, padding: 10, backgroundColor: theme.colors.surfaceAlt, borderRadius: theme.borderRadius.md, alignItems: 'center' },
  bbbToggleText:        { fontSize: 13, fontWeight: '600', color: theme.colors.text.secondary },
  bbbWrap:              { paddingHorizontal: 12, paddingBottom: 24 },
});
