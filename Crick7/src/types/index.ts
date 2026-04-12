export type UserRole = 'organizer' | 'captain' | 'scorer' | 'viewer';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  teamId?: string;
}

export interface PlayerStats {
  matches: number; runs: number; balls: number; fours: number; sixes: number;
  highScore: number; average: number; strikeRate: number;
  wickets: number; oversBowled: number; runsConceded: number;
  economy: number; bestBowling: string;
}

export interface Player {
  id: string; name: string; teamId: string;
  role: 'batsman' | 'bowler' | 'allrounder' | 'wicketkeeper';
  isCaptain?: boolean; isViceCaptain?: boolean; stats: PlayerStats;
}

export interface Team {
  id: string; name: string; captainId: string;
  viceCaptainId?: string; playerIds: string[]; tournamentId: string;
}

export interface Tournament {
  id: string; name: string; type: 'ODI' | 'T20' | 'Test' | 'Custom';
  overs: number; powerplayOvers: number; organizerId: string;
  teamIds: string[]; matchIds: string[];
  status: 'upcoming' | 'ongoing' | 'completed'; createdAt: string;
}

export interface Delivery {
  id: string; inningsId: string; over: number; ball: number;
  batsmanId: string; bowlerId: string; runs: number;
  isWide: boolean; isNoBall: boolean; isBye: boolean; isLegBye: boolean;
  wicket?: { type: 'bowled'|'caught'|'lbw'|'runout'|'stumped'|'hitwicket'; playerId: string; fielderId?: string; };
  isBoundary: boolean; isSix: boolean;
}

export interface Extras { wides: number; noBalls: number; byes: number; legByes: number; penalty: number; }

export interface Innings {
  id: string; matchId: string; battingTeamId: string; bowlingTeamId: string;
  totalRuns: number; wickets: number; overs: number; balls: number;
  extras: Extras; deliveries: Delivery[]; isPowerplay: boolean;
  status: 'upcoming' | 'ongoing' | 'completed';
}

export interface Match {
  id: string; tournamentId: string; team1Id: string; team2Id: string;
  status: 'upcoming' | 'live' | 'completed'; token: string;
  scorerId?: string; venue: string; date: string; inningsIds: string[];
  winnerId?: string; tossWinnerId?: string; tossDecision?: 'bat' | 'bowl';
}

export interface Token {
  id: string; matchId: string; scorerId: string;
  code: string; isUsed: boolean; createdAt: string;
}

export interface Commentary {
  id: string; matchId: string; over: number; ball: number;
  text: string; type: 'normal'|'boundary'|'six'|'wicket'|'wide'|'noball'|'milestone';
  timestamp: string;
}
