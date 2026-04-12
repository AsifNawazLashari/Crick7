import React, { useState } from 'react';
import { View } from 'react-native';
import { useAuth } from '../hooks/useAuth';
import { LoginScreen } from '../screens/auth/LoginScreen';
import { RegisterScreen } from '../screens/auth/RegisterScreen';
import { OrganizerNavigator } from './OrganizerNavigator';
import { CaptainNavigator } from './CaptainNavigator';
import { ScorerNavigator } from './ScorerNavigator';
import { HomeScreen } from '../screens/shared/HomeScreen';
import { MatchDetailScreen } from '../screens/shared/MatchDetailScreen';
import { ScorecardScreen } from '../screens/shared/ScorecardScreen';
import { StatsScreen } from '../screens/shared/StatsScreen';
import { GraphScreen } from '../screens/shared/GraphScreen';
import { CommentaryScreen } from '../screens/shared/CommentaryScreen';
import { TournamentDetailScreen } from '../screens/organizer/TournamentDetailScreen';

type AuthScreen = 'login' | 'register';
type AppScreen = string;

export const AppNavigator: React.FC = () => {
  const { user, logout } = useAuth();
  const [authScreen, setAuthScreen] = useState<AuthScreen>('login');
  const [currentScreen, setCurrentScreen] = useState<AppScreen>('Dashboard');
  const [screenParams, setScreenParams] = useState<any>({});

  const navigate = (screen: string, params?: any) => {
    setCurrentScreen(screen);
    setScreenParams(params || {});
  };

  const goBack = () => {
    setCurrentScreen('Dashboard');
    setScreenParams({});
  };

  if (!user) {
    if (authScreen === 'register') {
      return <RegisterScreen onRegister={() => setAuthScreen('login')} onBack={() => setAuthScreen('login')} />;
    }
    return <LoginScreen onLogin={() => setCurrentScreen('Dashboard')} onNavigateRegister={() => setAuthScreen('register')} />;
  }

  // Shared screens accessible from all roles
  if (currentScreen === 'MatchDetail') return <MatchDetailScreen matchId={screenParams.matchId} onBack={goBack} onNavigate={navigate} />;
  if (currentScreen === 'Scorecard') return <ScorecardScreen matchId={screenParams.matchId} onBack={goBack} />;
  if (currentScreen === 'Stats') return <StatsScreen onBack={goBack} />;
  if (currentScreen === 'Graph') return <GraphScreen matchId={screenParams.matchId} onBack={goBack} />;
  if (currentScreen === 'Commentary') return <CommentaryScreen matchId={screenParams.matchId} onBack={goBack} />;
  if (currentScreen === 'TournamentDetail') return <TournamentDetailScreen tournamentId={screenParams.tournamentId} onBack={goBack} onNavigate={navigate} />;
  if (currentScreen === 'Home') return <HomeScreen onNavigate={navigate} onLogout={logout} />;

  // Role-based navigators
  if (user.role === 'organizer') return <OrganizerNavigator currentScreen={currentScreen} screenParams={screenParams} onNavigate={navigate} onLogout={logout} />;
  if (user.role === 'captain')   return <CaptainNavigator   currentScreen={currentScreen} screenParams={screenParams} onNavigate={navigate} onLogout={logout} />;
  if (user.role === 'scorer')    return <ScorerNavigator    currentScreen={currentScreen} screenParams={screenParams} onNavigate={navigate} onLogout={logout} />;

  return <HomeScreen onNavigate={navigate} onLogout={logout} />;
};
