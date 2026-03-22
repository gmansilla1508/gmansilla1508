import { TextStyle, ViewStyle } from 'react-native'

// ─── Color Tokens ─────────────────────────────────────────────────────────────
export const Colors = {
  // Brand
  primary: '#1F4BFF',
  primaryDark: '#1238CC',
  primaryLight: '#EEF2FF',

  // Backgrounds
  background: '#FFFFFF',
  surface: '#F5F7FB',
  surfaceElevated: '#FFFFFF',

  // Status
  success: '#22C55E',
  successLight: '#DCFCE7',
  warning: '#F59E0B',
  warningLight: '#FEF3C7',
  error: '#EF4444',
  errorLight: '#FEE2E2',

  // Text
  textPrimary: '#111827',
  textSecondary: '#6B7280',
  textDisabled: '#9CA3AF',
  textInverse: '#FFFFFF',

  // Border
  border: '#E5E7EB',
  borderLight: '#F3F4F6',

  // Currency gradients
  usdGradient: ['#2563EB', '#1D4ED8'] as [string, string],
  eurGradient: ['#7C3AED', '#4F46E5'] as [string, string],
  usdcGradient: ['#059669', '#0D9488'] as [string, string],
  btcGradient: ['#F97316', '#D97706'] as [string, string],
  heroGradient: ['#1F4BFF', '#1238CC'] as [string, string],
  savingsGradient: ['#059669', '#0D9488'] as [string, string],
}

// ─── Spacing Tokens ──────────────────────────────────────────────────────────
export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  base: 16,
  lg: 24,
  xl: 32,
  xxl: 40,
}

// ─── Border Radius Tokens ─────────────────────────────────────────────────────
export const Radius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 9999,
}

// ─── Typography Tokens ────────────────────────────────────────────────────────
export const Typography = {
  headline: {
    fontSize: 28,
    fontWeight: '700',
    color: Colors.textPrimary,
    letterSpacing: -0.5,
  } as TextStyle,

  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: Colors.textPrimary,
  } as TextStyle,

  body: {
    fontSize: 16,
    fontWeight: '400',
    color: Colors.textPrimary,
    lineHeight: 24,
  } as TextStyle,

  bodyMedium: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.textPrimary,
  } as TextStyle,

  secondary: {
    fontSize: 14,
    fontWeight: '400',
    color: Colors.textSecondary,
  } as TextStyle,

  caption: {
    fontSize: 12,
    fontWeight: '500',
    color: Colors.textSecondary,
  } as TextStyle,
}

// ─── Shadow Tokens ────────────────────────────────────────────────────────────
export const Shadow = {
  card: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  } as ViewStyle,

  strong: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 6,
  } as ViewStyle,
}
