import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { theme } from '../../theme';

type BadgeVariant = 'live' | 'upcoming' | 'completed' | 'organizer' | 'captain' | 'scorer' | 'viewer' | 'boundary' | 'six' | 'wicket' | 'primary' | 'accent';

interface BadgeProps {
  label: string;
  variant?: BadgeVariant;
  size?: 'sm' | 'md';
  dot?: boolean;
}

const variantStyles: Record<BadgeVariant, { bg: string; text: string }> = {
  live:       { bg: theme.colors.status.liveLight,      text: theme.colors.status.live },
  upcoming:   { bg: theme.colors.status.upcomingLight,  text: '#8B6914' },
  completed:  { bg: theme.colors.status.completedLight, text: theme.colors.status.completed },
  organizer:  { bg: '#E8F5EE', text: theme.colors.primary },
  captain:    { bg: '#E8EEF5', text: theme.colors.secondary },
  scorer:     { bg: '#FFF8E1', text: '#8B6914' },
  viewer:     { bg: '#F5F5F5', text: '#666' },
  boundary:   { bg: '#E3F2FD', text: '#1565C0' },
  six:        { bg: '#F3E5F5', text: '#7B1FA2' },
  wicket:     { bg: theme.colors.status.liveLight, text: theme.colors.status.live },
  primary:    { bg: theme.colors.primaryLight, text: '#fff' },
  accent:     { bg: theme.colors.accent, text: '#0D2B1F' },
};

export const Badge: React.FC<BadgeProps> = ({ label, variant = 'primary', size = 'md', dot = false }) => {
  const vs = variantStyles[variant];
  return (
    <View style={[styles.badge, { backgroundColor: vs.bg }, size === 'sm' && styles.sm]}>
      {dot && <View style={[styles.dot, { backgroundColor: vs.text }]} />}
      <Text style={[styles.text, { color: vs.text }, size === 'sm' && styles.textSm]}>
        {label}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 10, paddingVertical: 4,
    borderRadius: theme.borderRadius.full,
    alignSelf: 'flex-start',
  },
  sm: { paddingHorizontal: 7, paddingVertical: 2 },
  dot: { width: 6, height: 6, borderRadius: 3, marginRight: 5 },
  text: { fontSize: 12, fontWeight: '600', letterSpacing: 0.3 },
  textSm: { fontSize: 10 },
});
