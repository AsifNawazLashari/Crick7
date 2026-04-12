import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';
import { theme } from '../../theme';
import { useAuth } from '../../hooks/useAuth';
import { validateEmail, validatePassword } from '../../utils/validation';

interface LoginScreenProps {
  onLogin: () => void;
  onNavigateRegister: () => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin, onNavigateRegister }) => {
  const { login, loading, error, setError } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const e: Record<string, string> = {};
    const emailErr = validateEmail(email);
    const passErr = validatePassword(password);
    if (emailErr) e.email = emailErr;
    if (passErr) e.password = passErr;
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleLogin = async () => {
    if (!validate()) return;
    const user = await login(email, password);
    if (user) onLogin();
  };

  const quickLogin = async (e: string) => {
    setEmail(e); setPassword('password123');
    const user = await login(e, 'password123');
    if (user) onLogin();
  };

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
      {/* Hero */}
      <View style={styles.hero}>
        <View style={styles.logoWrap}>
          <Text style={styles.logoIcon}>🏏</Text>
        </View>
        <Text style={styles.appName}>Cricket A7</Text>
        <Text style={styles.tagline}>Tournament Management Platform</Text>
        <Text style={styles.studio}>by A7 Studio · Asif Lashari</Text>
      </View>

      {/* Form Card */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Welcome Back</Text>
        <Text style={styles.cardSub}>Sign in to continue</Text>

        <Input
          label="Email Address"
          value={email}
          onChangeText={t => { setEmail(t); setErrors({}); }}
          placeholder="your@email.com"
          keyboardType="email-address"
          autoCapitalize="none"
          error={errors.email}
        />
        <Input
          label="Password"
          value={password}
          onChangeText={t => { setPassword(t); setErrors({}); }}
          placeholder="Enter your password"
          secureTextEntry
          error={errors.password}
        />

        {error && <Text style={styles.errorMsg}>{error}</Text>}

        <Button label="Sign In" onPress={handleLogin} loading={loading} fullWidth size="lg" />

        <TouchableOpacity style={styles.forgotBtn}>
          <Text style={styles.forgotText}>Forgot Password?</Text>
        </TouchableOpacity>
      </View>

      {/* Quick Login */}
      <View style={styles.quickSection}>
        <Text style={styles.quickTitle}>Quick Demo Login</Text>
        <View style={styles.quickBtns}>
          {[
            { label: '🏆 Organizer', email: 'asif@a7studio.com', color: theme.colors.primary },
            { label: '🏏 Captain',   email: 'ali@cricket.com',  color: theme.colors.secondary },
            { label: '📊 Scorer',    email: 'scorer@cricket.com', color: '#8B6914' },
          ].map(q => (
            <TouchableOpacity key={q.email} style={[styles.quickBtn, { borderColor: q.color }]} onPress={() => quickLogin(q.email)}>
              <Text style={[styles.quickBtnText, { color: q.color }]}>{q.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <TouchableOpacity style={styles.registerLink} onPress={onNavigateRegister}>
        <Text style={styles.registerText}>Don't have an account? <Text style={styles.registerAction}>Register</Text></Text>
      </TouchableOpacity>

      <Text style={styles.footer}>Cricket A7 v1.0 · Made with ❤️ by Asif Nawaz Lashari · A7 Studio</Text>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  screen:   { flex: 1, backgroundColor: theme.colors.background },
  content:  { padding: theme.spacing.lg, paddingBottom: 40 },
  hero:     { alignItems: 'center', paddingVertical: 40 },
  logoWrap: { width: 90, height: 90, borderRadius: 28, backgroundColor: theme.colors.primary, alignItems: 'center', justifyContent: 'center', marginBottom: 16, ...theme.shadows.lg },
  logoIcon: { fontSize: 44 },
  appName:  { fontSize: 34, fontWeight: '800', color: theme.colors.text.primary, letterSpacing: -1 },
  tagline:  { fontSize: 14, color: theme.colors.text.secondary, marginTop: 4, fontWeight: '500' },
  studio:   { fontSize: 12, color: theme.colors.text.muted, marginTop: 6 },
  card:     { backgroundColor: theme.colors.surface, borderRadius: theme.borderRadius.xl, padding: 24, ...theme.shadows.md, marginBottom: 20 },
  cardTitle:{ fontSize: 22, fontWeight: '700', color: theme.colors.text.primary, marginBottom: 4 },
  cardSub:  { fontSize: 14, color: theme.colors.text.muted, marginBottom: 24 },
  errorMsg: { color: theme.colors.status.live, fontSize: 13, marginBottom: 12, textAlign: 'center' },
  forgotBtn:{ alignItems: 'center', marginTop: 16 },
  forgotText:{ color: theme.colors.primaryLight, fontSize: 14, fontWeight: '500' },
  quickSection:{ marginBottom: 20 },
  quickTitle:  { fontSize: 13, fontWeight: '600', color: theme.colors.text.muted, textAlign: 'center', marginBottom: 12, letterSpacing: 0.5 },
  quickBtns:   { flexDirection: 'row', gap: 8 },
  quickBtn:    { flex: 1, paddingVertical: 10, borderRadius: theme.borderRadius.md, borderWidth: 1.5, alignItems: 'center' },
  quickBtnText:{ fontSize: 12, fontWeight: '700' },
  registerLink:{ alignItems: 'center', marginBottom: 20 },
  registerText:{ fontSize: 14, color: theme.colors.text.secondary },
  registerAction:{ color: theme.colors.primary, fontWeight: '700' },
  footer:   { textAlign: 'center', fontSize: 11, color: theme.colors.text.muted },
});
