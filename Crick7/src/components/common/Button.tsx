import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator, View } from 'react-native';
import { theme } from '../../theme';

type ButtonVariant = 'primary' | 'secondary' | 'accent' | 'outline' | 'ghost' | 'danger';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps {
  label: string;
  onPress: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  disabled?: boolean;
  icon?: React.ReactNode;
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  label, onPress, variant = 'primary', size = 'md',
  loading = false, disabled = false, icon, fullWidth = false,
}) => {
  const isDisabled = disabled || loading;

  const containerStyle = [
    styles.base,
    styles[variant],
    styles[`size_${size}`],
    fullWidth && styles.fullWidth,
    isDisabled && styles.disabled,
  ];

  const textStyle = [
    styles.text,
    styles[`text_${variant}`],
    styles[`textSize_${size}`],
  ];

  return (
    <TouchableOpacity style={containerStyle} onPress={onPress} disabled={isDisabled} activeOpacity={0.82}>
      {loading ? (
        <ActivityIndicator size="small" color={variant === 'outline' || variant === 'ghost' ? theme.colors.primary : '#fff'} />
      ) : (
        <View style={styles.inner}>
          {icon && <View style={styles.iconWrap}>{icon}</View>}
          <Text style={textStyle}>{label}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  base: { borderRadius: theme.borderRadius.md, alignItems: 'center', justifyContent: 'center', ...theme.shadows.sm },
  inner: { flexDirection: 'row', alignItems: 'center' },
  iconWrap: { marginRight: 6 },
  fullWidth: { width: '100%' },
  disabled: { opacity: 0.5 },

  primary:   { backgroundColor: theme.colors.primary },
  secondary: { backgroundColor: theme.colors.secondary },
  accent:    { backgroundColor: theme.colors.accent },
  outline:   { backgroundColor: 'transparent', borderWidth: 1.5, borderColor: theme.colors.primary },
  ghost:     { backgroundColor: 'transparent' },
  danger:    { backgroundColor: theme.colors.status.live },

  size_sm: { paddingHorizontal: 14, paddingVertical: 8 },
  size_md: { paddingHorizontal: 20, paddingVertical: 12 },
  size_lg: { paddingHorizontal: 28, paddingVertical: 16 },

  text:           { fontWeight: '600', letterSpacing: 0.3 },
  text_primary:   { color: '#fff' },
  text_secondary: { color: '#fff' },
  text_accent:    { color: theme.colors.primaryDark },
  text_outline:   { color: theme.colors.primary },
  text_ghost:     { color: theme.colors.primary },
  text_danger:    { color: '#fff' },

  textSize_sm: { fontSize: 13 },
  textSize_md: { fontSize: 15 },
  textSize_lg: { fontSize: 17 },
});
