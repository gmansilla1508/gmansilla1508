import React, { useState } from 'react'
import { View, Text, TextInput, StyleSheet, ViewStyle, TextInputProps } from 'react-native'
import { Colors, Spacing, Radius, Typography } from '@/lib/tokens'

type Props = TextInputProps & {
  label?: string
  error?: string
  containerStyle?: ViewStyle
}

export default function Input({ label, error, containerStyle, ...props }: Props) {
  const [focused, setFocused] = useState(false)

  return (
    <View style={[styles.container, containerStyle]}>
      {label && <Text style={styles.label}>{label}</Text>}
      <TextInput
        {...props}
        onFocus={(e) => { setFocused(true); props.onFocus?.(e) }}
        onBlur={(e) => { setFocused(false); props.onBlur?.(e) }}
        style={[
          styles.input,
          focused && styles.inputFocused,
          error && styles.inputError,
          props.style,
        ]}
        placeholderTextColor={Colors.textDisabled}
      />
      {error && <Text style={styles.error}>{error}</Text>}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    gap: Spacing.xs,
  },
  label: {
    ...Typography.caption,
    color: Colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  input: {
    height: 48,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingHorizontal: Spacing.base,
    backgroundColor: Colors.surface,
    ...Typography.body,
    color: Colors.textPrimary,
  },
  inputFocused: {
    borderColor: Colors.primary,
    backgroundColor: Colors.background,
  },
  inputError: {
    borderColor: Colors.error,
  },
  error: {
    ...Typography.caption,
    color: Colors.error,
  },
})
