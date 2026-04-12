import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { theme } from '../../theme';

interface InputProps {
  label?: string;
  value: string;
  onChangeText: (t: string) => void;
  placeholder?: string;
  secureTextEntry?: boolean;
  error?: string | null;
  keyboardType?: any;
  autoCapitalize?: any;
  multiline?: boolean;
  numberOfLines?: number;
  icon?: React.ReactNode;
  editable?: boolean;
}

export const Input: React.FC<InputProps> = ({
  label, value, onChangeText, placeholder, secureTextEntry = false,
  error, keyboardType = 'default', autoCapitalize = 'sentences',
  multiline = false, numberOfLines = 1, icon, editable = true,
}) => {
  const [focused, setFocused] = useState(false);
  const [showPass, setShowPass] = useState(false);

  return (
    <View style={styles.wrapper}>
      {label && <Text style={styles.label}>{label}</Text>}
      <View style={[styles.inputRow, focused && styles.focused, !!error && styles.errorBorder, !editable && styles.disabled]}>
        {icon && <View style={styles.icon}>{icon}</View>}
        <TextInput
          style={[styles.input, multiline && { height: numberOfLines * 40, textAlignVertical: 'top' }]}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={theme.colors.text.muted}
          secureTextEntry={secureTextEntry && !showPass}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          multiline={multiline}
          numberOfLines={numberOfLines}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          editable={editable}
        />
        {secureTextEntry && (
          <TouchableOpacity onPress={() => setShowPass(!showPass)} style={styles.eyeBtn}>
            <Text style={styles.eyeText}>{showPass ? '🙈' : '👁'}</Text>
          </TouchableOpacity>
        )}
      </View>
      {error && <Text style={styles.error}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper:     { marginBottom: theme.spacing.md },
  label:       { fontSize: 13, fontWeight: '600', color: theme.colors.text.secondary, marginBottom: 6, letterSpacing: 0.2 },
  inputRow:    { flexDirection: 'row', alignItems: 'center', backgroundColor: theme.colors.surfaceAlt, borderRadius: theme.borderRadius.md, borderWidth: 1.5, borderColor: theme.colors.border, paddingHorizontal: 12 },
  focused:     { borderColor: theme.colors.primary, backgroundColor: '#fff' },
  errorBorder: { borderColor: theme.colors.status.live },
  disabled:    { opacity: 0.6 },
  icon:        { marginRight: 8 },
  input:       { flex: 1, fontSize: 15, color: theme.colors.text.primary, paddingVertical: 12 },
  eyeBtn:      { padding: 4 },
  eyeText:     { fontSize: 16 },
  error:       { fontSize: 12, color: theme.colors.status.live, marginTop: 4 },
});
