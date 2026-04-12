import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, StatusBar } from 'react-native';
import { theme } from '../../theme';

interface HeaderProps {
  title: string;
  subtitle?: string;
  onBack?: () => void;
  rightAction?: { icon: string; onPress: () => void };
  rightComponent?: React.ReactNode;
  dark?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  title, subtitle, onBack, rightAction, rightComponent, dark = true,
}) => {
  const bg = dark ? theme.colors.primary : theme.colors.surface;
  const titleColor = dark ? '#fff' : theme.colors.text.primary;
  const subtitleColor = dark ? 'rgba(255,255,255,0.7)' : theme.colors.text.muted;

  return (
    <>
      <StatusBar barStyle={dark ? 'light-content' : 'dark-content'} backgroundColor={bg} />
      <View style={[styles.header, { backgroundColor: bg }, !dark && theme.shadows.sm]}>
        <View style={styles.left}>
          {onBack && (
            <TouchableOpacity style={styles.backBtn} onPress={onBack} activeOpacity={0.7}>
              <Text style={[styles.backIcon, { color: titleColor }]}>←</Text>
            </TouchableOpacity>
          )}
          <View style={styles.titleWrap}>
            <Text style={[styles.title, { color: titleColor }]} numberOfLines={1}>{title}</Text>
            {subtitle && <Text style={[styles.subtitle, { color: subtitleColor }]} numberOfLines={1}>{subtitle}</Text>}
          </View>
        </View>
        <View style={styles.right}>
          {rightComponent}
          {rightAction && (
            <TouchableOpacity style={styles.actionBtn} onPress={rightAction.onPress}>
              <Text style={[styles.actionIcon, { color: titleColor }]}>{rightAction.icon}</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  header:    { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 14, paddingTop: 48 },
  left:      { flexDirection: 'row', alignItems: 'center', flex: 1 },
  backBtn:   { marginRight: 12, padding: 4 },
  backIcon:  { fontSize: 22, fontWeight: '300' },
  titleWrap: { flex: 1 },
  title:     { fontSize: 20, fontWeight: '700', letterSpacing: -0.3 },
  subtitle:  { fontSize: 12, marginTop: 1 },
  right:     { flexDirection: 'row', alignItems: 'center' },
  actionBtn: { padding: 8, marginLeft: 4 },
  actionIcon:{ fontSize: 20 },
});
