import { useState, useCallback } from 'react';
import { db } from '../data/db';
import { Tournament, Team, Match } from '../types';

export const useTournament = () => {
  const [tournaments, setTournaments] = useState<Tournament[]>(db.tournaments.getAll());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(() => {
    setTournaments(db.tournaments.getAll());
  }, []);

  const createTournament = useCallback(async (data: Omit<Tournament, 'id' | 'createdAt'>) => {
    setLoading(true);
    try {
      await new Promise(r => setTimeout(r, 400));
      const t = db.tournaments.create(data);
      refresh();
      return t;
    } finally {
      setLoading(false);
    }
  }, [refresh]);

  const updateTournament = useCallback(async (id: string, data: Partial<Tournament>) => {
    const t = db.tournaments.update(id, data);
    refresh();
    return t;
  }, [refresh]);

  const deleteTournament = useCallback(async (id: string) => {
    db.tournaments.delete(id);
    refresh();
  }, [refresh]);

  const getTeams = useCallback((tournamentId: string): Team[] => {
    return db.teams.getByTournament(tournamentId);
  }, []);

  const getMatches = useCallback((tournamentId: string): Match[] => {
    return db.matches.getByTournament(tournamentId);
  }, []);

  return { tournaments, loading, error, refresh, createTournament, updateTournament, deleteTournament, getTeams, getMatches };
};
