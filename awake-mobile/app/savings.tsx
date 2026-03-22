import React, { useState } from 'react'
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, SafeAreaView } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import { Ionicons } from '@expo/vector-icons'
import { Card, Button, ProgressBar } from '@/components/ui'
import { mockSavingsAccount, mockAccounts } from '@/lib/mock-data'
import { formatCurrency } from '@/lib/utils'
import { Colors, Spacing, Radius, Typography } from '@/lib/tokens'

type Mode = 'overview' | 'deposit' | 'withdraw'

export default function SavingsScreen() {
  const [mode, setMode] = useState<Mode>('overview')
  const [amount, setAmount] = useState('')
  const [success, setSuccess] = useState<'deposit' | 'withdraw' | null>(null)

  const parsed = parseFloat(amount) || 0
  const usdAccount = mockAccounts.find((a) => a.currency === 'USD')!
  const progress = (mockSavingsAccount.balance / mockSavingsAccount.goal) * 100

  function doAction() {
    setSuccess(mode === 'deposit' ? 'deposit' : 'withdraw')
    setAmount('')
    setTimeout(() => { setMode('overview'); setSuccess(null) }, 2500)
  }

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>

        {/* Hero card */}
        <LinearGradient colors={Colors.savingsGradient} style={styles.heroCard} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
          <View style={styles.apyBadge}>
            <Text style={styles.apyText}>{mockSavingsAccount.apy} APY</Text>
          </View>
          <Text style={styles.heroLabel}>Savings Balance</Text>
          <Text style={styles.heroAmount}>{formatCurrency(mockSavingsAccount.balance)}</Text>
          <View style={styles.goalSection}>
            <View style={styles.goalRow}>
              <Text style={styles.goalLabel}>{mockSavingsAccount.goalLabel}</Text>
              <Text style={styles.goalPct}>{mockSavingsAccount.goalProgress}% of {formatCurrency(mockSavingsAccount.goal)}</Text>
            </View>
            <View style={styles.goalTrack}>
              <View style={[styles.goalFill, { width: `${progress}%` }]} />
            </View>
          </View>
        </LinearGradient>

        {/* Stats */}
        <View style={styles.statsRow}>
          {[
            { label: 'Yield Earned', value: formatCurrency(mockSavingsAccount.yieldEarned), icon: 'trending-up' as const, color: Colors.success },
            { label: 'APY Rate', value: mockSavingsAccount.apy, icon: 'information-circle-outline' as const, color: Colors.primary },
            { label: 'Goal Left', value: formatCurrency(mockSavingsAccount.goal - mockSavingsAccount.balance), icon: 'flag-outline' as const, color: '#7C3AED' },
          ].map((s) => (
            <Card key={s.label} style={styles.statCard} padding={Spacing.md}>
              <View style={[styles.statIcon, { backgroundColor: `${s.color}15` }]}>
                <Ionicons name={s.icon} size={14} color={s.color} />
              </View>
              <Text style={[styles.statValue, { color: s.color }]}>{s.value}</Text>
              <Text style={styles.statLabel}>{s.label}</Text>
            </Card>
          ))}
        </View>

        {/* Deposit / Withdraw input */}
        {mode === 'overview' ? (
          <View style={styles.actionRow}>
            <TouchableOpacity style={styles.actionCard} onPress={() => setMode('deposit')} activeOpacity={0.7}>
              <View style={[styles.actionIcon, { backgroundColor: Colors.successLight }]}>
                <Ionicons name="arrow-down-circle-outline" size={24} color={Colors.success} />
              </View>
              <Text style={styles.actionLabel}>Deposit</Text>
              <Text style={styles.actionDesc}>Move from account</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionCard} onPress={() => setMode('withdraw')} activeOpacity={0.7}>
              <View style={[styles.actionIcon, { backgroundColor: Colors.primaryLight }]}>
                <Ionicons name="arrow-up-circle-outline" size={24} color={Colors.primary} />
              </View>
              <Text style={styles.actionLabel}>Withdraw</Text>
              <Text style={styles.actionDesc}>Back to USD account</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <Card>
            <View style={styles.modeHeader}>
              <Text style={styles.modeTitle}>{mode === 'deposit' ? 'Deposit to Savings' : 'Withdraw from Savings'}</Text>
              <TouchableOpacity onPress={() => { setMode('overview'); setAmount('') }}>
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.amountRow}>
              <Text style={styles.amountSymbol}>$</Text>
              <TextInput
                value={amount}
                onChangeText={setAmount}
                placeholder="0.00"
                keyboardType="decimal-pad"
                style={styles.amountInput}
                placeholderTextColor={Colors.textDisabled}
                autoFocus
              />
            </View>
            <Text style={styles.availableText}>
              {mode === 'deposit'
                ? `From: USD account · Available: ${formatCurrency(usdAccount.balance)}`
                : `From: Savings · Available: ${formatCurrency(mockSavingsAccount.balance)}`}
            </Text>

            <View style={styles.quickRow}>
              {[100, 250, 500, 1000].map((q) => (
                <TouchableOpacity key={q} onPress={() => setAmount(q.toString())} style={styles.quickBtn}>
                  <Text style={styles.quickBtnText}>${q}</Text>
                </TouchableOpacity>
              ))}
            </View>

            {success && (
              <View style={styles.successBanner}>
                <Ionicons name="checkmark-circle" size={16} color={Colors.success} />
                <Text style={styles.successText}>
                  {success === 'deposit' ? `${formatCurrency(parsed)} deposited to savings!` : `${formatCurrency(parsed)} withdrawn to USD account!`}
                </Text>
              </View>
            )}

            <Button
              label={mode === 'deposit' ? 'Move to Savings' : 'Withdraw to Account'}
              onPress={doAction}
              disabled={parsed <= 0 || !!success}
              style={{ marginTop: Spacing.sm }}
            />
          </Card>
        )}

        {/* Info */}
        <View style={styles.infoBanner}>
          <Ionicons name="information-circle-outline" size={16} color={Colors.primary} />
          <Text style={styles.infoText}>
            Savings earn <Text style={{ color: Colors.success, fontWeight: '600' }}>{mockSavingsAccount.apy} APY</Text> compounded daily. No lock-up period — withdraw anytime.
          </Text>
        </View>

      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  scroll: { flex: 1 },
  content: { padding: Spacing.base, paddingBottom: Spacing.xxl, gap: Spacing.base },

  heroCard: { borderRadius: Radius.xl, padding: Spacing.lg, gap: Spacing.sm },
  apyBadge: { alignSelf: 'flex-end', backgroundColor: 'rgba(255,255,255,0.25)', paddingHorizontal: Spacing.sm, paddingVertical: 4, borderRadius: Radius.full },
  apyText: { fontSize: 12, fontWeight: '700', color: Colors.textInverse },
  heroLabel: { fontSize: 13, color: 'rgba(255,255,255,0.7)' },
  heroAmount: { fontSize: 40, fontWeight: '800', color: Colors.textInverse, letterSpacing: -1 },
  goalSection: { gap: 6, marginTop: Spacing.xs },
  goalRow: { flexDirection: 'row', justifyContent: 'space-between' },
  goalLabel: { fontSize: 12, color: 'rgba(255,255,255,0.7)' },
  goalPct: { fontSize: 12, color: 'rgba(255,255,255,0.7)' },
  goalTrack: { height: 6, backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: Radius.full, overflow: 'hidden' },
  goalFill: { height: 6, backgroundColor: 'rgba(255,255,255,0.8)', borderRadius: Radius.full },

  statsRow: { flexDirection: 'row', gap: Spacing.sm },
  statCard: { flex: 1, alignItems: 'center', gap: 4 },
  statIcon: { width: 30, height: 30, borderRadius: Radius.md, alignItems: 'center', justifyContent: 'center' },
  statValue: { fontSize: 14, fontWeight: '700' },
  statLabel: { fontSize: 10, color: Colors.textSecondary, textAlign: 'center' },

  actionRow: { flexDirection: 'row', gap: Spacing.sm },
  actionCard: { flex: 1, padding: Spacing.base, borderRadius: Radius.lg, borderWidth: 1, borderColor: Colors.border, alignItems: 'center', gap: Spacing.xs },
  actionIcon: { width: 48, height: 48, borderRadius: Radius.md, alignItems: 'center', justifyContent: 'center' },
  actionLabel: { ...Typography.bodyMedium, fontWeight: '600' },
  actionDesc: { ...Typography.caption, textAlign: 'center' },

  modeHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: Spacing.base },
  modeTitle: { ...Typography.bodyMedium, fontWeight: '600' },
  cancelText: { ...Typography.secondary, color: Colors.textSecondary },
  amountRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 4 },
  amountSymbol: { fontSize: 28, color: Colors.textSecondary, fontWeight: '300' },
  amountInput: { fontSize: 48, fontWeight: '700', color: Colors.textPrimary, minWidth: 120, textAlign: 'center' },
  availableText: { ...Typography.caption, textAlign: 'center', marginBottom: Spacing.sm },
  quickRow: { flexDirection: 'row', justifyContent: 'center', gap: Spacing.xs, marginBottom: Spacing.sm },
  quickBtn: { paddingHorizontal: Spacing.sm, paddingVertical: 6, borderRadius: Radius.full, backgroundColor: Colors.surface, borderWidth: 1, borderColor: Colors.border },
  quickBtnText: { ...Typography.caption, fontWeight: '600', color: Colors.textPrimary },
  successBanner: { flexDirection: 'row', alignItems: 'center', gap: Spacing.xs, backgroundColor: Colors.successLight, padding: Spacing.sm, borderRadius: Radius.md },
  successText: { ...Typography.caption, color: Colors.success, flex: 1 },

  infoBanner: { flexDirection: 'row', alignItems: 'flex-start', gap: Spacing.xs, backgroundColor: Colors.primaryLight, padding: Spacing.sm, borderRadius: Radius.md },
  infoText: { ...Typography.caption, color: Colors.primary, flex: 1, lineHeight: 18 },
})
