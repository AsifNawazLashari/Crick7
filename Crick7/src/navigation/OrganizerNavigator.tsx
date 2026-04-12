import React from 'react';
import { OrganizerDashboard } from '../screens/organizer/OrganizerDashboard';
import { TournamentCreateScreen } from '../screens/organizer/TournamentCreateScreen';
import { TournamentDetailScreen } from '../screens/organizer/TournamentDetailScreen';
import { TeamManageScreen } from '../screens/organizer/TeamManageScreen';
import { MatchSetupScreen } from '../screens/organizer/MatchSetupScreen';
import { FixtureScreen } from '../screens/organizer/FixtureScreen';
import { TokenGenerateScreen } from '../screens/organizer/TokenGenerateScreen';
import { ScorecardScreen } from '../screens/shared/ScorecardScreen';
import { StatsScreen } from '../screens/shared/StatsScreen';
import { GraphScreen } from '../screens/shared/GraphScreen';
import { CommentaryScreen } from '../screens/shared/CommentaryScreen';
import { MatchDetailScreen } from '../screens/shared/MatchDetailScreen';

interface Props {
  currentScreen: string;
  screenParams: any;
  onNavigate: (s: string, p?: any) => void;
  onLogout: () => void;
}

export const OrganizerNavigator: React.FC<Props> = ({ currentScreen, screenParams, onNavigate, onLogout }) => {
  const goBack = () => onNavigate('Dashboard');

  switch (currentScreen) {
    case 'TournamentCreate': return <TournamentCreateScreen onBack={goBack} onNavigate={onNavigate} />;
    case 'TournamentDetail': return <TournamentDetailScreen tournamentId={screenParams.tournamentId} onBack={goBack} onNavigate={onNavigate} />;
    case 'TeamManage':       return <TeamManageScreen onBack={goBack} />;
    case 'MatchSetup':       return <MatchSetupScreen onBack={goBack} onNavigate={onNavigate} />;
    case 'Fixture':          return <FixtureScreen onBack={goBack} onNavigate={onNavigate} />;
    case 'TokenGenerate':    return <TokenGenerateScreen onBack={goBack} />;
    case 'Scorecard':        return <ScorecardScreen matchId={screenParams?.matchId} onBack={goBack} />;
    case 'Stats':            return <StatsScreen onBack={goBack} />;
    case 'Graph':            return <GraphScreen matchId={screenParams?.matchId} onBack={goBack} />;
    case 'Commentary':       return <CommentaryScreen matchId={screenParams?.matchId} onBack={goBack} />;
    case 'MatchDetail':      return <MatchDetailScreen matchId={screenParams.matchId} onBack={goBack} onNavigate={onNavigate} />;
    default:                 return <OrganizerDashboard onNavigate={onNavigate} onLogout={onLogout} />;
  }
};
