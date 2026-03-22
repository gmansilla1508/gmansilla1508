import React from 'react'
import { View, StyleSheet, ViewStyle } from 'react-native'
import { Colors, Radius, Spacing, Shadow } from '@/lib/tokens'

type Props = {
  children: React.ReactNode
  style?: ViewStyle
  padding?: number
  elevated?: boolean
}

export default function Card({ children, style, padding = Spacing.base, elevated = false }: Props) {
  return (
    <View
      style={[
        styles.card,
        { padding },
        elevated && Shadow.strong,
        style,
      ]}
    >
      {children}
    </View>
  )
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surfaceElevated,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    ...Shadow.card,
  },
})
