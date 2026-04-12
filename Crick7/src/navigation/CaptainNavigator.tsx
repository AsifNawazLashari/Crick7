import React from 'react';
import { CaptainDashboard } from '../screens/captain/CaptainDashboard';
import { TeamSetupScreen } from '../screens/captain/TeamSetupScreen';
import { PlayerManageScreen } from '../screens/captain/PlayerManageScreen';
import { ScorecardScreen } from '../screens/shared/ScorecardScreen';
import { StatsScreen } from '../screens/shared/StatsScreen';
import { CommentaryScreen } from '../screens/shared/CommentaryScreen';
import { MatchDetailScreen } from '../screens/shared/MatchDetailScreen';
import { GraphScreen } from '../screens/shared/GraphScreen';

interface Props {
  currentScreen: string;
  screenParams: any;
  onNavigate: (s: string, p?: any) => void;
  onLogout: () => void;
}

export const CaptainNavigator: React.FC<Props> = ({ currentScreen, screenParams, onNavigate, onLogout }) => {
  const goBack = () => onNavigate('Dashboard');

  switch (currentScreen) {
    case 'TeamSetup':     return <TeamSetupScreen onBack={goBack} />;
    case 'PlayerManage':  return <PlayerManageScreen onBack={goBack} />;
    case 'Scorecard':     return <ScorecardScreen matchId={screenParams?.matchId} onBack={goBack} />;
    case 'Stats':         return <StatsScreen onBack={goBack} />;
    case 'Commentary':    return <CommentaryScreen matchId={screenParams?.matchId} onBack={goBack} />;
    case 'MatchDetail':   return <MatchDetailScreen matchId={screenParams.matchId} onBack={goBack} onNavigate={onNavigate} />;
    case 'Graph':         return <GraphScreen matchId={screenParams?.matchId} onBack={goBack} />;
    default:              return <CaptainDashboard onNavigate={onNavigate} onLogout={onLogout} />;
  }
};
