import React from 'react'
import { View, StyleSheet, ViewStyle } from 'react-native'
import { Colors, Radius } from '@/lib/tokens'

type Props = {
  progress: number // 0-100
  color?: string
  height?: number
  style?: ViewStyle
}

export default function ProgressBar({
  progress,
  color = Colors.primary,
  height = 6,
  style,
}: Props) {
  const clamped = Math.min(Math.max(progress, 0), 100)

  return (
    <View style={[styles.track, { height }, style]}>
      <View
        style={[
          styles.fill,
          { width: `${clamped}%`, backgroundColor: color, height },
        ]}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  track: {
    width: '100%',
    backgroundColor: Colors.surface,
    borderRadius: Radius.full,
    overflow: 'hidden',
  },
  fill: {
    borderRadius: Radius.full,
  },
})
