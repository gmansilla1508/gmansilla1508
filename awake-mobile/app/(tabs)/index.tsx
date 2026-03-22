import React from 'react'
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView } from 'react-native'
import { router } from 'expo-router'
import { LinearGradient } from 'expo-linear-gradient'
import { Ionicons } from '@expo/vector-icons'
import { Card } from '@/components/ui'
import {
  mockUser, mockAccounts, mockTransactions, mockNetWorth,
  mockMonthlyIncome, mockMonthlySpent, mockMonthlySaved, mockSavingsAccount,
} from '@/lib/mock-data'
import { formatCurrency, formatBalanceDisplay, formatShortDate } from '@/lib/utils'
import { Colors, Spacing, Radius, Typography, Shadow } from '@/lib/tokens'

const QUICK_ACTIONS = [
  { label: 'Add', icon: 'add' as const, color: Colors.success, bg: '#DCFCE7', route: '/receive' },
  { label: 'Send', icon: 'arrow-up' as const, color: Colors.primary, bg: Colors.primaryLight, route: '/send' },
  { label: 'Receive', icon: 'arrow-down' as const, color: '#7C3AED', bg: '#EDE9FE', route: '/receive' },
  { label: 'Convert', icon: 'swap-horizontal' as const, color: Colors.warning, bg: Colors.warningLight, route: '/convert' },
]

const CURRENCY_GRADIENTS: Record<string, [string, string]> = {
  USD: ['#2563EB', '#1D4ED8'],
  EUR: ['#7C3AED', '#4F46E5'],
  USDC: ['#059669', '#0D9488'],
  BTC: ['#F97316', '#D97706'],
}

export default function HomeScreen() {
  const recentTx = mockTransactions.slice(0, 5)

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Good morning,</Text>
            <Text style={styles.name}>{mockUser.name}</Text>
          </View>
          <View style={styles.kycBadge}>
            <View style={styles.kycDot} />
            <Text style={styles.kycText}>Verified</Text>
          </View>
        </View>

        {/* Net Worth Card */}
        <LinearGradient colors={Colors.heroGradient} style={styles.heroCard} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
          <Text style={styles.heroLabel}>Total Net Worth</Text>
          <Text style={styles.heroBalance}>{formatCurrency(mockNetWorth)}</Text>
          <View style={styles.heroStats}>
            {[
              { label: 'Income', value: formatCurrency(mockMonthlyIncome), color: '#86EFAC' },
              { label: 'Spent', value: formatCurrency(mockMonthlySpent), color: '#FCA5A5' },
              { label: 'Saved', value: formatCurrency(mockMonthlySaved), color: '#FFFFFF' },
            ].map((s) => (
              <View key={s.label} style={styles.heroStat}>
                <Text style={styles.heroStatLabel}>{s.label}</Text>
                <Text style={[styles.heroStatValue, { color: s.color }]}>{s.value}</Text>
              </View>
            ))}
          </View>
        </LinearGradient>

        {/* Quick Actions */}
        <View style={styles.actionsRow}>
          {QUICK_ACTIONS.map((a) => (
            <TouchableOpacity
              key={a.label}
              onPress={() => router.push(a.route as any)}
              style={styles.actionItem}
              activeOpacity={0.7}
            >
              <View style={[styles.actionIcon, { backgroundColor: a.bg }]}>
                <Ionicons name={a.icon} size={22} color={a.color} />
              </View>
              <Text style={styles.actionLabel}>{a.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Balances */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Balances</Text>
          <TouchableOpacity onPress={() => router.push('/(tabs)/balances')}>
            <Text style={styles.sectionLink}>View all</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.balanceGrid}>
          {mockAccounts.map((acc) => {
            const gradient = CURRENCY_GRADIENTS[acc.currency] ?? ['#6B7280', '#4B5563']
            return (
              <LinearGradient key={acc.id} colors={gradient} style={styles.balanceCard} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
                <View style={styles.balanceCardTop}>
                  <Text style={styles.balanceCurrency}>{acc.currency}</Text>
                  <Text style={styles.balanceFlag}>{acc.flag}</Text>
                </View>
                <Text style={styles.balanceAmount}>{formatBalanceDisplay(acc.balance, acc.currency, acc.symbol)}</Text>
                {acc.usdValue && <Text style={styles.balanceUsd}>≈ ${acc.usdValue.toLocaleString()}</Text>}
              </LinearGradient>
            )
          })}
        </View>

        {/* Savings teaser */}
        <Card style={styles.savingsCard}>
          <View style={styles.savingsRow}>
            <View style={styles.savingsIconBox}>
              <Text style={{ fontSize: 20 }}>🏦</Text>
            </View>
            <View style={styles.savingsInfo}>
              <View style={styles.savingsTopRow}>
                <Text style={styles.savingsTitle}>Smart Savings</Text>
                <Text style={styles.savingsApy}>{mockSavingsAccount.apy} APY</Text>
              </View>
              <View style={styles.savingsBar}>
                <View style={[styles.savingsFill, { width: `${mockSavingsAccount.goalProgress}%` }]} />
              </View>
              <Text style={styles.savingsInfo2}>
                {formatCurrency(mockSavingsAccount.balance)} of {formatCurrency(mockSavingsAccount.goal)} · Yield: {formatCurrency(mockSavingsAccount.yieldEarned)}
              </Text>
            </View>
            <TouchableOpacity onPress={() => router.push('/savings')} style={styles.savingsBtn}>
              <Text style={styles.savingsBtnText}>Manage</Text>
            </TouchableOpacity>
          </View>
        </Card>

        {/* Recent Transactions */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recent Transactions</Text>
          <TouchableOpacity onPress={() => router.push('/transactions')}>
            <Text style={styles.sectionLink}>View all</Text>
          </TouchableOpacity>
        </View>
        <Card style={styles.txCard} padding={0}>
          {recentTx.map((tx, i) => (
            <View key={tx.id} style={[styles.txRow, i < recentTx.length - 1 && styles.txBorder]}>
              <View style={styles.txIcon}>
                <Text style={{ fontSize: 18 }}>{tx.icon}</Text>
              </View>
              <View style={styles.txInfo}>
                <Text style={styles.txDesc} numberOfLines={1}>{tx.description}</Text>
                <Text style={styles.txMeta}>{formatShortDate(tx.created_at)} · {tx.currency}</Text>
              </View>
              <View style={styles.txRight}>
                <Text style={[styles.txAmount, { color: tx.type === 'credit' ? Colors.success : Colors.textPrimary }]}>
                  {tx.type === 'credit' ? '+' : '-'}{formatCurrency(Math.abs(tx.amount))}
                </Text>
                <Text style={styles.txCategory}>{tx.category}</Text>
              </View>
            </View>
          ))}
        </Card>

      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  scroll: { flex: 1 },
  content: { padding: Spacing.base, paddingBottom: Spacing.xxl, gap: Spacing.base },

  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  greeting: { ...Typography.secondary },
  name: { ...Typography.sectionTitle },
  kycBadge: { flexDirection: 'row', alignItems: 'center', gap: 5, backgroundColor: Colors.successLight, paddingHorizontal: Spacing.sm, paddingVertical: 5, borderRadius: Radius.full },
  kycDot: { width: 7, height: 7, borderRadius: Radius.full, backgroundColor: Colors.success },
  kycText: { ...Typography.caption, color: Colors.success, fontWeight: '600' },

  heroCard: { borderRadius: Radius.xl, padding: Spacing.lg },
  heroLabel: { fontSize: 13, color: 'rgba(255,255,255,0.7)', marginBottom: 4 },
  heroBalance: { fontSize: 40, fontWeight: '800', color: Colors.textInverse, letterSpacing: -1, marginBottom: Spacing.lg },
  heroStats: { flexDirection: 'row', justifyContent: 'space-between' },
  heroStat: { alignItems: 'flex-start' },
  heroStatLabel: { fontSize: 11, color: 'rgba(255,255,255,0.6)', marginBottom: 2 },
  heroStatValue: { fontSize: 15, fontWeight: '600' },

  actionsRow: { flexDirection: 'row', justifyContent: 'space-between' },
  actionItem: { alignItems: 'center', gap: Spacing.xs, flex: 1 },
  actionIcon: { width: 52, height: 52, borderRadius: Radius.lg, alignItems: 'center', justifyContent: 'center' },
  actionLabel: { ...Typography.caption, color: Colors.textSecondary, fontWeight: '600' },

  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  sectionTitle: { ...Typography.bodyMedium, fontWeight: '600' },
  sectionLink: { ...Typography.secondary, color: Colors.primary },

  balanceGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm },
  balanceCard: { width: '47.5%', borderRadius: Radius.lg, padding: Spacing.md, gap: 2 },
  balanceCardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: Spacing.xs },
  balanceCurrency: { fontSize: 11, fontWeight: '600', color: 'rgba(255,255,255,0.8)' },
  balanceFlag: { fontSize: 16 },
  balanceAmount: { fontSize: 16, fontWeight: '700', color: Colors.textInverse },
  balanceUsd: { fontSize: 11, color: 'rgba(255,255,255,0.6)' },

  savingsCard: {},
  savingsRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  savingsIconBox: { width: 40, height: 40, borderRadius: Radius.md, backgroundColor: Colors.surface, alignItems: 'center', justifyContent: 'center' },
  savingsInfo: { flex: 1, gap: 4 },
  savingsTopRow: { flexDirection: 'row', justifyContent: 'space-between' },
  savingsTitle: { ...Typography.secondary, fontWeight: '600', color: Colors.textPrimary },
  savingsApy: { ...Typography.caption, color: Colors.success, fontWeight: '600' },
  savingsBar: { height: 4, backgroundColor: Colors.surface, borderRadius: Radius.full, overflow: 'hidden' },
  savingsFill: { height: 4, backgroundColor: Colors.success, borderRadius: Radius.full },
  savingsInfo2: { fontSize: 11, color: Colors.textSecondary },
  savingsBtn: { paddingHorizontal: Spacing.sm, paddingVertical: 6, borderRadius: Radius.sm, borderWidth: 1, borderColor: Colors.primary },
  savingsBtnText: { ...Typography.caption, color: Colors.primary, fontWeight: '600' },

  txCard: { overflow: 'hidden' },
  txRow: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: Spacing.base, paddingVertical: Spacing.md, gap: Spacing.sm },
  txBorder: { borderBottomWidth: 1, borderBottomColor: Colors.borderLight },
  txIcon: { width: 40, height: 40, borderRadius: Radius.md, backgroundColor: Colors.surface, alignItems: 'center', justifyContent: 'center' },
  txInfo: { flex: 1, gap: 2 },
  txDesc: { ...Typography.secondary, color: Colors.textPrimary, fontWeight: '500' },
  txMeta: { fontSize: 11, color: Colors.textSecondary },
  txRight: { alignItems: 'flex-end', gap: 2 },
  txAmount: { ...Typography.secondary, fontWeight: '600' },
  txCategory: { fontSize: 10, color: Colors.textSecondary },
})
