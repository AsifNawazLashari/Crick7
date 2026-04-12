import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';
import { Header } from '../../components/common/Header';
import { theme } from '../../theme';
import { useAuth } from '../../hooks/useAuth';
import { UserRole } from '../../types';
import { validateEmail, validatePassword, validateName } from '../../utils/validation';

interface RegisterScreenProps {
  onRegister: () => void;
  onBack: () => void;
}

const ROLES: { key: UserRole; label: string; icon: string; desc: string }[] = [
  { key: 'organizer', label: 'Organizer', icon: '🏆', desc: 'Full tournament control' },
  { key: 'captain',   label: 'Captain',   icon: '🏏', desc: 'Manage your team' },
  { key: 'scorer',    label: 'Scorer',    icon: '📊', desc: 'Score live matches' },
  { key: 'viewer',    label: 'Viewer',    icon: '👁',  desc: 'Watch & follow' },
];

export const RegisterScreen: React.FC<RegisterScreenProps> = ({ onRegister, onBack }) => {
  const { register, loading, error } = useAuth();
  const [name, setName]         = useState('');
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole]         = useState<UserRole>('viewer');
  const [errors, setErrors]     = useState<Record<string, string>>({});

  const validate = () => {
    const e: Record<string, string> = {};
    const nameErr  = validateName(name);
    const emailErr = validateEmail(email);
    const passErr  = validatePassword(password);
    if (nameErr)  e.name     = nameErr;
    if (emailErr) e.email    = emailErr;
    if (passErr)  e.password = passErr;
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleRegister = async () => {
    if (!validate()) return;
    const user = await register(name, email, password, role);
    if (user) onRegister();
  };

  return (
    <View style={styles.screen}>
      <Header title="Create Account" subtitle="Join Cricket A7" onBack={onBack} />
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <Input label="Full Name" value={name} onChangeText={setName} placeholder="e.g. Asif Lashari" error={errors.name} />
        <Input label="Email Address" value={email} onChangeText={setEmail} placeholder="your@email.com" keyboardType="email-address" autoCapitalize="none" error={errors.email} />
        <Input label="Password" value={password} onChangeText={setPassword} placeholder="Min. 6 characters" secureTextEntry error={errors.password} />

        <Text style={styles.roleTitle}>Select Your Role</Text>
        <View style={styles.roleGrid}>
          {ROLES.map(r => (
            <TouchableOpacity key={r.key} style={[styles.roleCard, role === r.key && styles.roleActive]} onPress={() => setRole(r.key)}>
              <Text style={styles.roleIcon}>{r.icon}</Text>
              <Text style={[styles.roleLabel, role === r.key && styles.roleLabelActive]}>{r.label}</Text>
              <Text style={styles.roleDesc}>{r.desc}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {error && <Text style={styles.errorMsg}>{error}</Text>}
        <Button label="Create Account" onPress={handleRegister} loading={loading} fullWidth size="lg" />

        <TouchableOpacity style={styles.loginLink} onPress={onBack}>
          <Text style={styles.loginText}>Already have an account? <Text style={styles.loginAction}>Sign In</Text></Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  screen:         { flex: 1, backgroundColor: theme.colors.background },
  scroll:         { flex: 1 },
  content:        { padding: theme.spacing.lg, paddingBottom: 40 },
  roleTitle:      { fontSize: 13, fontWeight: '600', color: theme.colors.text.secondary, marginBottom: 12, marginTop: 4 },
  roleGrid:       { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 20 },
  roleCard:       { width: '47%', padding: 14, borderRadius: theme.borderRadius.lg, borderWidth: 1.5, borderColor: theme.colors.border, backgroundColor: theme.colors.surface, ...theme.shadows.sm },
  roleActive:     { borderColor: theme.colors.primary, backgroundColor: '#F0FAF5' },
  roleIcon:       { fontSize: 28, marginBottom: 6 },
  roleLabel:      { fontSize: 15, fontWeight: '700', color: theme.colors.text.primary },
  roleLabelActive:{ color: theme.colors.primary },
  roleDesc:       { fontSize: 11, color: theme.colors.text.muted, marginTop: 2 },
  errorMsg:       { color: theme.colors.status.live, fontSize: 13, marginBottom: 12, textAlign: 'center' },
  loginLink:      { alignItems: 'center', marginTop: 20 },
  loginText:      { fontSize: 14, color: theme.colors.text.secondary },
  loginAction:    { color: theme.colors.primary, fontWeight: '700' },
});
