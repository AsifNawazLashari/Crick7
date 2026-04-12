export const theme = {
  colors: {
    primary: '#1B4332',
    primaryLight: '#2D6A4F',
    primaryDark: '#0D2B1F',
    accent: '#E9C46A',
    accentDark: '#C9A84C',
    secondary: '#264653',
    background: '#F8F9FA',
    surface: '#FFFFFF',
    surfaceAlt: '#F1F5F2',
    border: '#DDE8E1',
    borderLight: '#EEF4F0',
    text: {
      primary: '#0D2B1F',
      secondary: '#4A7C65',
      muted: '#8BAF99',
      light: '#FFFFFF',
      inverse: '#FFFFFF',
    },
    status: {
      live: '#E63946',
      liveLight: '#FFF0F0',
      upcoming: '#E9C46A',
      upcomingLight: '#FFFBF0',
      completed: '#2D6A4F',
      completedLight: '#F0FAF5',
    },
    score: {
      boundary: '#2196F3',
      six: '#9C27B0',
      wicket: '#E63946',
      dot: '#9E9E9E',
      single: '#4CAF50',
      extra: '#FF9800',
    },
    role: {
      organizer: '#1B4332',
      captain: '#264653',
      scorer: '#E9C46A',
      viewer: '#8BAF99',
    },
    chart: {
      line1: '#1B4332',
      line2: '#E9C46A',
      line3: '#264653',
      bar1: '#2D6A4F',
      bar2: '#E9C46A',
      grid: '#DDE8E1',
    },
  },
  spacing: {
    xs: 4, sm: 8, md: 16, lg: 24, xl: 32, xxl: 48,
  },
  borderRadius: {
    sm: 6, md: 10, lg: 16, xl: 24, full: 9999,
  },
  typography: {
    fontFamily: {
      heading: 'Georgia',
      body: 'System',
      mono: 'Courier',
    },
    sizes: {
      xs: 11, sm: 13, md: 15, lg: 18, xl: 22, xxl: 28, xxxl: 36,
    },
    weights: {
      regular: '400' as const,
      medium: '500' as const,
      semibold: '600' as const,
      bold: '700' as const,
      extrabold: '800' as const,
    },
  },
  shadows: {
    sm: {
      shadowColor: '#1B4332', shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.06, shadowRadius: 4, elevation: 2,
    },
    md: {
      shadowColor: '#1B4332', shadowOffset: { width: 0, height: 3 },
      shadowOpacity: 0.10, shadowRadius: 8, elevation: 4,
    },
    lg: {
      shadowColor: '#1B4332', shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.15, shadowRadius: 16, elevation: 8,
    },
  },
};

export type Theme = typeof theme;
