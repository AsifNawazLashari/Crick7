import { useState, useCallback, useEffect } from 'react';
import { db } from '../data/db';
import { Match, Innings, Delivery } from '../types';

export const useMatch = (matchId?: string) => {
  const [match, setMatch] = useState<Match | null>(matchId ? db.matches.getById(matchId) || null : null);
  const [innings, setInnings] = useState<Innings[]>(matchId ? db.innings.getByMatch(matchId) : []);
  const [loading, setLoading] = useState(false);

  const refresh = useCallback(() => {
    if (matchId) {
      setMatch(db.matches.getById(matchId) || null);
      setInnings(db.innings.getByMatch(matchId));
    }
  }, [matchId]);

  useEffect(() => { refresh(); }, [matchId]);

  const addDelivery = useCallback(async (inningsId: string, delivery: Omit<Delivery, 'id'>) => {
    setLoading(true);
    try {
      await new Promise(r => setTimeout(r, 200));
      const d: Delivery = { ...delivery, id: `d${Date.now()}` };
      db.innings.addDelivery(inningsId, d);
      const inn = db.innings.getById(inningsId);
      if (inn) {
        let addRuns = d.runs;
        if (d.isWide) addRuns += 1;
        if (d.isNoBall) addRuns += 1;
        if (d.isBye || d.isLegBye) addRuns = d.runs;
        let newBalls = inn.balls;
        let newOvers = inn.overs;
        if (!d.isWide && !d.isNoBall) {
          newBalls++;
          if (newBalls >= 6) { newOvers++; newBalls = 0; }
        }
        db.innings.update(inningsId, {
          totalRuns: inn.totalRuns + addRuns,
          wickets: inn.wickets + (d.wicket ? 1 : 0),
          overs: newOvers, balls: newBalls,
        });
      }
      refresh();
    } finally {
      setLoading(false);
    }
  }, [refresh]);

  const getLiveMatch = useCallback(() => db.matches.getLive(), []);

  const currentInnings = innings.find(i => i.status === 'ongoing');
  const allInnings = innings;

  return { match, innings: allInnings, currentInnings, loading, refresh, addDelivery, getLiveMatch };
};
