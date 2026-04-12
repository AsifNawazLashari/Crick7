import React, { useState } from 'react';
import { ScorerDashboard } from '../screens/scorer/ScorerDashboard';
import { TokenEntryScreen } from '../screens/scorer/TokenEntryScreen';
import { LiveScoringScreen } from '../screens/scorer/LiveScoringScreen';
import { ScorecardScreen } from '../screens/shared/ScorecardScreen';
import { StatsScreen } from '../screens/shared/StatsScreen';
import { CommentaryScreen } from '../screens/shared/CommentaryScreen';
import { GraphScreen } from '../screens/shared/GraphScreen';
import { MatchDetailScreen } from '../screens/shared/MatchDetailScreen';

interface Props {
  currentScreen: string;
  screenParams: any;
  onNavigate: (s: string, p?: any) => void;
  onLogout: () => void;
}

export const ScorerNavigator: React.FC<Props> = ({ currentScreen, screenParams, onNavigate, onLogout }) => {
  const goBack = () => onNavigate('Dashboard');

  const handleTokenSuccess = (matchId: string) => {
    onNavigate('LiveScoring', { matchId });
  };

  switch (currentScreen) {
    case 'TokenEntry':  return <TokenEntryScreen onSuccess={handleTokenSuccess} onBack={goBack} />;
    case 'LiveScoring': return <LiveScoringScreen matchId={screenParams?.matchId || ''} onBack={goBack} />;
    case 'Scorecard':   return <ScorecardScreen matchId={screenParams?.matchId} onBack={goBack} />;
    case 'Stats':       return <StatsScreen onBack={goBack} />;
    case 'Commentary':  return <CommentaryScreen matchId={screenParams?.matchId} onBack={goBack} />;
    case 'Graph':       return <GraphScreen matchId={screenParams?.matchId} onBack={goBack} />;
    case 'MatchDetail': return <MatchDetailScreen matchId={screenParams.matchId} onBack={goBack} onNavigate={onNavigate} />;
    default:            return <ScorerDashboard onNavigate={onNavigate} onLogout={onLogout} />;
  }
};
