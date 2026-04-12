import {
  User, Player, Team, Tournament,
  Match, Innings, Token, Commentary,
  Delivery, PlayerStats
} from '../types';

const defaultStats: PlayerStats = {
  matches: 0, runs: 0, balls: 0, fours: 0, sixes: 0,
  highScore: 0, average: 0, strikeRate: 0,
  wickets: 0, oversBowled: 0, runsConceded: 0,
  economy: 0, bestBowling: '0/0',
};

let users: User[] = [
  { id: 'u1', name: 'Asif Lashari', email: 'asif@a7studio.com', role: 'organizer' },
  { id: 'u2', name: 'Ahmed Scorer', email: 'scorer@cricket.com', role: 'scorer' },
  { id: 'u3', name: 'Ali Captain', email: 'ali@cricket.com', role: 'captain' },
];

let players: Player[] = [
  { id: 'p1', name: 'Babar Azam', teamId: 't1', role: 'batsman', isCaptain: true, stats: { ...defaultStats, matches: 10, runs: 450, average: 50, balls: 380, fours: 42, sixes: 8, highScore: 98, strikeRate: 118.4 } },
  { id: 'p2', name: 'Shaheen Afridi', teamId: 't1', role: 'bowler', stats: { ...defaultStats, matches: 10, wickets: 18, oversBowled: 80, runsConceded: 360, economy: 4.5, bestBowling: '4/22' } },
  { id: 'p3', name: 'Mohammad Rizwan', teamId: 't1', role: 'wicketkeeper', isViceCaptain: true, stats: { ...defaultStats, matches: 10, runs: 380, balls: 290, fours: 30, sixes: 5, highScore: 85, average: 42.2, strikeRate: 131.0 } },
  { id: 'p4', name: 'Fakhar Zaman', teamId: 't1', role: 'batsman', stats: { ...defaultStats, matches: 10, runs: 310, balls: 240, fours: 28, sixes: 12, highScore: 75, average: 34.4, strikeRate: 129.2 } },
  { id: 'p5', name: 'Shadab Khan', teamId: 't1', role: 'allrounder', stats: { ...defaultStats, matches: 10, runs: 180, balls: 130, wickets: 12, oversBowled: 55, runsConceded: 280, economy: 5.1, bestBowling: '3/28', average: 22.5 } },
  { id: 'p6', name: 'Virat Kohli', teamId: 't2', role: 'batsman', isCaptain: true, stats: { ...defaultStats, matches: 10, runs: 520, balls: 420, fours: 48, sixes: 10, highScore: 112, average: 57.8, strikeRate: 123.8 } },
  { id: 'p7', name: 'Jasprit Bumrah', teamId: 't2', role: 'bowler', stats: { ...defaultStats, matches: 10, wickets: 20, oversBowled: 85, runsConceded: 380, economy: 4.47, bestBowling: '5/18' } },
  { id: 'p8', name: 'Rohit Sharma', teamId: 't2', role: 'batsman', isViceCaptain: true, stats: { ...defaultStats, matches: 10, runs: 410, balls: 300, fours: 38, sixes: 18, highScore: 95, average: 45.6, strikeRate: 136.7 } },
  { id: 'p9', name: 'Hardik Pandya', teamId: 't2', role: 'allrounder', stats: { ...defaultStats, matches: 10, runs: 220, balls: 150, wickets: 10, oversBowled: 45, runsConceded: 250, economy: 5.56, bestBowling: '3/32', average: 27.5 } },
  { id: 'p10', name: 'KL Rahul', teamId: 't2', role: 'wicketkeeper', stats: { ...defaultStats, matches: 10, runs: 290, balls: 210, fours: 24, sixes: 6, highScore: 72, average: 32.2, strikeRate: 138.1 } },
];

let teams: Team[] = [
  { id: 't1', name: 'Pakistan XI', captainId: 'p1', viceCaptainId: 'p3', playerIds: ['p1','p2','p3','p4','p5'], tournamentId: 'tn1' },
  { id: 't2', name: 'India XI', captainId: 'p6', viceCaptainId: 'p8', playerIds: ['p6','p7','p8','p9','p10'], tournamentId: 'tn1' },
];

let tournaments: Tournament[] = [
  {
    id: 'tn1', name: 'A7 Cup 2025', type: 'ODI', overs: 50,
    powerplayOvers: 10, organizerId: 'u1',
    teamIds: ['t1','t2'], matchIds: ['m1'],
    status: 'ongoing', createdAt: new Date().toISOString(),
  },
];

let matches: Match[] = [
  {
    id: 'm1', tournamentId: 'tn1', team1Id: 't1', team2Id: 't2',
    status: 'live', token: 'A7-2025', scorerId: 'u2',
    venue: 'National Stadium, Karachi', date: new Date().toISOString(),
    inningsIds: ['i1'], tossWinnerId: 't1', tossDecision: 'bat',
  },
];

let innings: Innings[] = [
  {
    id: 'i1', matchId: 'm1', battingTeamId: 't1', bowlingTeamId: 't2',
    totalRuns: 145, wickets: 3, overs: 25, balls: 0,
    extras: { wides: 4, noBalls: 1, byes: 0, legByes: 2, penalty: 0 },
    deliveries: [
      { id: 'd1', inningsId: 'i1', over: 1, ball: 1, batsmanId: 'p1', bowlerId: 'p7', runs: 4, isWide: false, isNoBall: false, isBye: false, isLegBye: false, isBoundary: true, isSix: false },
      { id: 'd2', inningsId: 'i1', over: 1, ball: 2, batsmanId: 'p4', bowlerId: 'p7', runs: 0, isWide: false, isNoBall: false, isBye: false, isLegBye: false, isBoundary: false, isSix: false },
      { id: 'd3', inningsId: 'i1', over: 1, ball: 3, batsmanId: 'p1', bowlerId: 'p7', runs: 6, isWide: false, isNoBall: false, isBye: false, isLegBye: false, isBoundary: false, isSix: true },
      { id: 'd4', inningsId: 'i1', over: 2, ball: 1, batsmanId: 'p4', bowlerId: 'p9', runs: 1, isWide: false, isNoBall: false, isBye: false, isLegBye: false, isBoundary: false, isSix: false },
      { id: 'd5', inningsId: 'i1', over: 2, ball: 2, batsmanId: 'p1', bowlerId: 'p9', runs: 0, isWide: false, isNoBall: false, isBye: false, isLegBye: false, isBoundary: false, isSix: false, wicket: { type: 'caught', playerId: 'p1', fielderId: 'p10' } },
    ],
    isPowerplay: false, status: 'ongoing',
  },
];

let tokens: Token[] = [
  { id: 'tk1', matchId: 'm1', scorerId: 'u2', code: 'A7-2025', isUsed: true, createdAt: new Date().toISOString() },
];

let commentary: Commentary[] = [
  { id: 'c1', matchId: 'm1', over: 1, ball: 1, text: 'Bumrah steams in and Babar drives it elegantly through the covers for FOUR! What a start!', type: 'boundary', timestamp: new Date(Date.now() - 3600000).toISOString() },
  { id: 'c2', matchId: 'm1', over: 1, ball: 3, text: 'SIX! Babar Azam picks up the length early and launches it over long-on! Spectacular!', type: 'six', timestamp: new Date(Date.now() - 3500000).toISOString() },
  { id: 'c3', matchId: 'm1', over: 2, ball: 2, text: 'OUT! Bumrah gets the big wicket of Babar Azam! Caught at the keeper, what a delivery!', type: 'wicket', timestamp: new Date(Date.now() - 3000000).toISOString() },
  { id: 'c4', matchId: 'm1', over: 10, ball: 6, text: 'End of powerplay! Pakistan XI: 62/1 after 10 overs. Rizwan and Fakhar building nicely.', type: 'milestone', timestamp: new Date(Date.now() - 2000000).toISOString() },
  { id: 'c5', matchId: 'm1', over: 24, ball: 6, text: 'Babar had set the platform earlier. Now Rizwan takes on Pandya — drives through covers for FOUR!', type: 'boundary', timestamp: new Date(Date.now() - 500000).toISOString() },
  { id: 'c6', matchId: 'm1', over: 25, ball: 1, text: 'Pakistan XI 145/3 after 25 overs. Required rate for India XI will be steep if this continues!', type: 'milestone', timestamp: new Date(Date.now() - 100000).toISOString() },
];

let currentUser: User | null = users[0];

export const db = {
  auth: {
    login: (email: string, _password: string): User | null => {
      const user = users.find(u => u.email === email);
      if (user) currentUser = user;
      return user || null;
    },
    logout: () => { currentUser = null; },
    getCurrentUser: (): User | null => currentUser,
    register: (user: Omit<User, 'id'>): User => {
      const newUser = { ...user, id: `u${Date.now()}` };
      users.push(newUser);
      return newUser;
    },
  },

  users: {
    getAll: (): User[] => users,
    getById: (id: string): User | undefined => users.find(u => u.id === id),
    update: (id: string, data: Partial<User>): User | null => {
      const i = users.findIndex(u => u.id === id);
      if (i === -1) return null;
      users[i] = { ...users[i], ...data };
      return users[i];
    },
    delete: (id: string): void => { users = users.filter(u => u.id !== id); },
  },

  tournaments: {
    getAll: (): Tournament[] => tournaments,
    getById: (id: string): Tournament | undefined => tournaments.find(t => t.id === id),
    create: (data: Omit<Tournament, 'id' | 'createdAt'>): Tournament => {
      const t = { ...data, id: `tn${Date.now()}`, createdAt: new Date().toISOString() };
      tournaments.push(t);
      return t;
    },
    update: (id: string, data: Partial<Tournament>): Tournament | null => {
      const i = tournaments.findIndex(t => t.id === id);
      if (i === -1) return null;
      tournaments[i] = { ...tournaments[i], ...data };
      return tournaments[i];
    },
    delete: (id: string): void => { tournaments = tournaments.filter(t => t.id !== id); },
  },

  teams: {
    getAll: (): Team[] => teams,
    getById: (id: string): Team | undefined => teams.find(t => t.id === id),
    getByTournament: (tournamentId: string): Team[] => teams.filter(t => t.tournamentId === tournamentId),
    create: (data: Omit<Team, 'id'>): Team => {
      const t = { ...data, id: `t${Date.now()}` };
      teams.push(t);
      return t;
    },
    update: (id: string, data: Partial<Team>): Team | null => {
      const i = teams.findIndex(t => t.id === id);
      if (i === -1) return null;
      teams[i] = { ...teams[i], ...data };
      return teams[i];
    },
    delete: (id: string): void => { teams = teams.filter(t => t.id !== id); },
  },

  players: {
    getAll: (): Player[] => players,
    getById: (id: string): Player | undefined => players.find(p => p.id === id),
    getByTeam: (teamId: string): Player[] => players.filter(p => p.teamId === teamId),
    create: (data: Omit<Player, 'id'>): Player => {
      const p = { ...data, id: `p${Date.now()}` };
      players.push(p);
      return p;
    },
    update: (id: string, data: Partial<Player>): Player | null => {
      const i = players.findIndex(p => p.id === id);
      if (i === -1) return null;
      players[i] = { ...players[i], ...data };
      return players[i];
    },
    delete: (id: string): void => { players = players.filter(p => p.id !== id); },
  },

  matches: {
    getAll: (): Match[] => matches,
    getById: (id: string): Match | undefined => matches.find(m => m.id === id),
    getByTournament: (tournamentId: string): Match[] => matches.filter(m => m.tournamentId === tournamentId),
    getLive: (): Match[] => matches.filter(m => m.status === 'live'),
    create: (data: Omit<Match, 'id'>): Match => {
      const m = { ...data, id: `m${Date.now()}` };
      matches.push(m);
      return m;
    },
    update: (id: string, data: Partial<Match>): Match | null => {
      const i = matches.findIndex(m => m.id === id);
      if (i === -1) return null;
      matches[i] = { ...matches[i], ...data };
      return matches[i];
    },
  },

  innings: {
    getById: (id: string): Innings | undefined => innings.find(i => i.id === id),
    getByMatch: (matchId: string): Innings[] => innings.filter(i => i.matchId === matchId),
    create: (data: Omit<Innings, 'id'>): Innings => {
      const inn = { ...data, id: `i${Date.now()}` };
      innings.push(inn);
      return inn;
    },
    update: (id: string, data: Partial<Innings>): Innings | null => {
      const i = innings.findIndex(inn => inn.id === id);
      if (i === -1) return null;
      innings[i] = { ...innings[i], ...data };
      return innings[i];
    },
    addDelivery: (inningsId: string, delivery: Delivery): void => {
      const i = innings.findIndex(inn => inn.id === inningsId);
      if (i !== -1) innings[i].deliveries.push(delivery);
    },
  },

  tokens: {
    generate: (matchId: string, scorerId: string): Token => {
      const code = `A7-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
      const token: Token = { id: `tk${Date.now()}`, matchId, scorerId, code, isUsed: false, createdAt: new Date().toISOString() };
      tokens.push(token);
      return token;
    },
    validate: (code: string, matchId: string): boolean => {
      const token = tokens.find(t => t.code === code && t.matchId === matchId && !t.isUsed);
      if (token) { token.isUsed = true; return true; }
      return false;
    },
    getByMatch: (matchId: string): Token[] => tokens.filter(t => t.matchId === matchId),
  },

  commentary: {
    getByMatch: (matchId: string): Commentary[] => commentary.filter(c => c.matchId === matchId),
    add: (data: Omit<Commentary, 'id' | 'timestamp'>): Commentary => {
      const c = { ...data, id: `c${Date.now()}`, timestamp: new Date().toISOString() };
      commentary.push(c);
      return c;
    },
  },
};
