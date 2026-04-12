export const formatOvers = (overs: number, balls: number): string => {
  return `${overs}.${balls}`;
};

export const formatScore = (runs: number, wickets: number): string => {
  return `${runs}/${wickets}`;
};

export const formatRunRate = (runs: number, overs: number, balls: number): string => {
  const totalOvers = overs + balls / 6;
  if (totalOvers === 0) return '0.00';
  return (runs / totalOvers).toFixed(2);
};

export const formatRequiredRate = (
  target: number, runs: number, overs: number, balls: number, totalOvers: number
): string => {
  const remaining = target - runs;
  const oversLeft = totalOvers - overs - balls / 6;
  if (oversLeft <= 0) return '0.00';
  return (remaining / oversLeft).toFixed(2);
};

export const formatDate = (dateStr: string): string => {
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });
};

export const formatTime = (dateStr: string): string => {
  const d = new Date(dateStr);
  return d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
};

export const formatDateTime = (dateStr: string): string => {
  return `${formatDate(dateStr)} • ${formatTime(dateStr)}`;
};

export const formatAverage = (runs: number, matches: number): string => {
  if (matches === 0) return '0.00';
  return (runs / matches).toFixed(2);
};

export const formatStrikeRate = (runs: number, balls: number): string => {
  if (balls === 0) return '0.00';
  return ((runs / balls) * 100).toFixed(2);
};

export const formatEconomy = (runs: number, overs: number): string => {
  if (overs === 0) return '0.00';
  return (runs / overs).toFixed(2);
};

export const getOverBalls = (deliveries: any[], over: number) => {
  return deliveries.filter(d => d.over === over);
};

export const getBallDisplay = (delivery: any): string => {
  if (delivery.isSix) return '6';
  if (delivery.isBoundary) return '4';
  if (delivery.wicket) return 'W';
  if (delivery.isWide) return 'Wd';
  if (delivery.isNoBall) return 'NB';
  if (delivery.isBye) return 'B';
  if (delivery.isLegBye) return 'LB';
  return delivery.runs.toString();
};

export const getExtraRuns = (extras: any): number => {
  return (extras.wides || 0) + (extras.noBalls || 0) + (extras.byes || 0) + (extras.legByes || 0) + (extras.penalty || 0);
};
