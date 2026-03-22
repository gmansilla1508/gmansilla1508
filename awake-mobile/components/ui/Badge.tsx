import React from 'react'
import { View, Text, StyleSheet, ViewStyle } from 'react-native'
import { Colors, Radius, Spacing, Typography } from '@/lib/tokens'

type Variant = 'success' | 'warning' | 'error' | 'primary' | 'neutral'

type Props = {
  label: string
  variant?: Variant
  style?: ViewStyle
}

const VARIANTS: Record<Variant, { bg: string; text: string }> = {
  success: { bg: Colors.successLight, text: Colors.success },
  warning: { bg: Colors.warningLight, text: Colors.warning },
  error: { bg: Colors.errorLight, text: Colors.error },
  primary: { bg: Colors.primaryLight, text: Colors.primary },
  neutral: { bg: Colors.surface, text: Colors.textSecondary },
}

export default function Badge({ label, variant = 'neutral', style }: Props) {
  const v = VARIANTS[variant]
  return (
    <View style={[styles.badge, { backgroundColor: v.bg }, style]}>
      <Text style={[styles.text, { color: v.text }]}>{label}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 3,
    borderRadius: Radius.full,
    alignSelf: 'flex-start',
  },
  text: {
    ...Typography.caption,
    fontWeight: '600',
  },
})
