import React from 'react'
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator, ViewStyle, TextStyle } from 'react-native'
import { Colors, Spacing, Radius, Typography } from '@/lib/tokens'

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger'

type Props = {
  label: string
  onPress: () => void
  variant?: Variant
  loading?: boolean
  disabled?: boolean
  style?: ViewStyle
  textStyle?: TextStyle
  fullWidth?: boolean
}

export default function Button({
  label,
  onPress,
  variant = 'primary',
  loading = false,
  disabled = false,
  style,
  textStyle,
  fullWidth = true,
}: Props) {
  const isDisabled = disabled || loading

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={isDisabled}
      activeOpacity={0.75}
      style={[
        styles.base,
        styles[variant],
        fullWidth && styles.fullWidth,
        isDisabled && styles.disabled,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={variant === 'primary' ? Colors.textInverse : Colors.primary} size="small" />
      ) : (
        <Text style={[styles.text, styles[`${variant}Text`] as TextStyle, textStyle]}>{label}</Text>
      )}
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  base: {
    height: 48,
    borderRadius: Radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.lg,
  },
  fullWidth: {
    width: '100%',
  },
  disabled: {
    opacity: 0.4,
  },

  // Variants
  primary: {
    backgroundColor: Colors.primary,
  },
  secondary: {
    backgroundColor: Colors.background,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  ghost: {
    backgroundColor: 'transparent',
  },
  danger: {
    backgroundColor: Colors.error,
  },

  // Text
  text: {
    ...Typography.bodyMedium,
    fontWeight: '600',
  },
  primaryText: {
    color: Colors.textInverse,
  },
  secondaryText: {
    color: Colors.textPrimary,
  },
  ghostText: {
    color: Colors.primary,
  },
  dangerText: {
    color: Colors.textInverse,
  },
})
