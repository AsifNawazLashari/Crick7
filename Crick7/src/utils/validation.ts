export const validateEmail = (email: string): string | null => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email) return 'Email is required';
  if (!re.test(email)) return 'Enter a valid email';
  return null;
};

export const validatePassword = (password: string): string | null => {
  if (!password) return 'Password is required';
  if (password.length < 6) return 'Password must be at least 6 characters';
  return null;
};

export const validateName = (name: string, label = 'Name'): string | null => {
  if (!name || !name.trim()) return `${label} is required`;
  if (name.trim().length < 2) return `${label} must be at least 2 characters`;
  return null;
};

export const validateOvers = (overs: number): string | null => {
  if (!overs || overs < 1) return 'Overs must be at least 1';
  if (overs > 50) return 'Overs cannot exceed 50';
  return null;
};

export const validatePowerplay = (powerplay: number, overs: number): string | null => {
  if (powerplay < 1) return 'Powerplay must be at least 1 over';
  if (powerplay >= overs) return 'Powerplay must be less than total overs';
  return null;
};

export const validateToken = (token: string): string | null => {
  if (!token || !token.trim()) return 'Token is required';
  if (!token.startsWith('A7-')) return 'Invalid token format';
  return null;
};

export const validateRequired = (value: string, label: string): string | null => {
  if (!value || !value.trim()) return `${label} is required`;
  return null;
};
