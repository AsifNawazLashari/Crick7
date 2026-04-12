import { Delivery, Innings } from '../types';

export const calculateRunRate = (runs: number, overs: number, balls: number): number => {
  const total = overs + balls / 6;
  return total === 0 ? 0 : runs / total;
};

export const calculateRequiredRate = (
  target: number, currentRuns: number, currentOvers: number,
  currentBalls: number, totalOvers: number
): number => {
  const remaining = target - currentRuns;
  const oversLeft = totalOvers - currentOvers - currentBalls / 6;
  return oversLeft <= 0 ? 0 : remaining / oversLeft;
};

export const isLegalDelivery = (delivery: Delivery): boolean => {
  return !delivery.isWide && !delivery.isNoBall;
};

export const getDeliveryRuns = (delivery: Delivery): number => {
  let runs = delivery.runs;
  if (delivery.isWide) runs += 1;
  if (delivery.isNoBall) runs += 1;
  return runs;
};

export const groupDeliveriesByOver = (deliveries: Delivery[]): Record<number, Delivery[]> => {
  return deliveries.reduce((acc, d) => {
    if (!acc[d.over]) acc[d.over] = [];
    acc[d.over].push(d);
    return acc;
  }, {} as Record<number, Delivery[]>);
};

export const getOverRuns = (deliveries: Delivery[]): number => {
  return deliveries.reduce((sum, d) => sum + getDeliveryRuns(d), 0);
};

export const getOverWickets = (deliveries: Delivery[]): number => {
  return deliveries.filter(d => d.wicket).length;
};

export const getBatsmanStats = (deliveries: Delivery[], batsmanId: string) => {
  const batDeliveries = deliveries.filter(d => d.batsmanId === batsmanId && !d.isWide);
  const runs = batDeliveries.reduce((s, d) => s + (d.isWide || d.isBye || d.isLegBye ? 0 : d.runs), 0);
  const balls = batDeliveries.filter(d => !d.isWide && !d.isNoBall).length;
  const fours = batDeliveries.filter(d => d.isBoundary && !d.isSix).length;
  const sixes = batDeliveries.filter(d => d.isSix).length;
  const isOut = batDeliveries.some(d => d.wicket?.playerId === batsmanId);
  const strikeRate = balls > 0 ? (runs / balls) * 100 : 0;
  return { runs, balls, fours, sixes, strikeRate, isOut };
};

export const getBowlerStats = (deliveries: Delivery[], bowlerId: string) => {
  const bowlDeliveries = deliveries.filter(d => d.bowlerId === bowlerId);
  const legalBalls = bowlDeliveries.filter(d => !d.isWide && !d.isNoBall).length;
  const overs = Math.floor(legalBalls / 6);
  const balls = legalBalls % 6;
  const runs = bowlDeliveries.reduce((s, d) => s + getDeliveryRuns(d), 0);
  const wickets = bowlDeliveries.filter(d => d.wicket && d.wicket.type !== 'runout').length;
  const economy = legalBalls > 0 ? (runs / (legalBalls / 6)) : 0;
  return { overs, balls, runs, wickets, economy };
};

export const getRunRateData = (deliveries: Delivery[]): { over: number; runRate: number; runs: number }[] => {
  const grouped = groupDeliveriesByOver(deliveries);
  let cumRuns = 0;
  const data = [];
  for (let i = 1; i <= Math.max(...Object.keys(grouped).map(Number), 0); i++) {
    const overDeliveries = grouped[i] || [];
    cumRuns += getOverRuns(overDeliveries);
    data.push({ over: i, runRate: cumRuns / i, runs: cumRuns });
  }
  return data;
};

export const getTarget = (innings: any): number => innings.totalRuns + 1;

export const isPowerplay = (over: number, powerplayOvers: number): boolean => over <= powerplayOvers;
