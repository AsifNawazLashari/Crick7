import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { theme } from '../../theme';

interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  variant?: 'default' | 'elevated' | 'outlined' | 'flat';
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

export const Card: React.FC<CardProps> = ({
  children, style, variant = 'default', padding = 'md',
}) => {
  return (
    <View style={[styles.base, styles[variant], styles[`pad_${padding}`], style]}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  base:     { backgroundColor: theme.colors.surface, borderRadius: theme.borderRadius.lg, overflow: 'hidden' },
  default:  { ...theme.shadows.sm },
  elevated: { ...theme.shadows.md },
  outlined: { borderWidth: 1.5, borderColor: theme.colors.border },
  flat:     { backgroundColor: theme.colors.surfaceAlt },

  pad_none: {},
  pad_sm:   { padding: theme.spacing.sm },
  pad_md:   { padding: theme.spacing.md },
  pad_lg:   { padding: theme.spacing.lg },
});
