import React, { useState } from 'react'
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView, Alert } from 'react-native'
import { router } from 'expo-router'
import { LinearGradient } from 'expo-linear-gradient'
import { Ionicons } from '@expo/vector-icons'
import { Card } from '@/components/ui'
import { mockAccounts, mockTransactions, type Account } from '@/lib/mock-data'
import { formatBalanceDisplay, formatShortDate } from '@/lib/utils'
import { Colors, Spacing, Radius, Typography } from '@/lib/tokens'

const CURRENCY_GRADIENTS: Record<string, [string, string]> = {
  USD: ['#2563EB', '#1D4ED8'],
  EUR: ['#7C3AED', '#4F46E5'],
  USDC: ['#059669', '#0D9488'],
  BTC: ['#F97316', '#D97706'],
}

const ACCOUNT_ACTIONS = [
  { label: 'Send', icon: 'arrow-up-circle-outline' as const, route: '/send', color: Colors.primary },
  { label: 'Receive', icon: 'arrow-down-circle-outline' as const, route: '/receive', color: Colors.success },
  { label: 'Convert', icon: 'swap-horizontal-outline' as const, route: '/convert', color: Colors.warning },
  { label: 'Savings', icon: 'save-outline' as const, route: '/savings', color: '#7C3AED' },
]

export default function BalancesScreen() {
  const [selected, setSelected] = useState<Account>(mockAccounts[0])

  const txForCurrency = mockTransactions.filter((t) => t.currency === selected.currency).slice(0, 6)
  const gradient = CURRENCY_GRADIENTS[selected.currency] ?? ['#6B7280', '#4B5563']

  function copyToClipboard(value: string) {
    Alert.alert('Copied', `${value} copied to clipboard.`)
  }

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.screenTitle}>Balances</Text>
        <Text style={styles.screenSubtitle}>{mockAccounts.length} currency accounts</Text>

        {/* Account Cards (horizontal scroll) */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.cardsScroll}>
          {mockAccounts.map((acc) => {
            const g = CURRENCY_GRADIENTS[acc.currency] ?? ['#6B7280', '#4B5563']
            const isSelected = selected.id === acc.id
            return (
              <TouchableOpacity key={acc.id} onPress={() => setSelected(acc)} activeOpacity={0.85}>
                <LinearGradient
                  colors={g}
                  style={[styles.accountCard, !isSelected && styles.accountCardDimmed]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  <View style={styles.cardTop}>
                    <Text style={styles.cardName}>{acc.name}</Text>
                    <Text style={styles.cardFlag}>{acc.flag}</Text>
                  </View>
                  <Text style={styles.cardBalance}>{formatBalanceDisplay(acc.balance, acc.currency, acc.symbol)}</Text>
                  {acc.usdValue && <Text style={styles.cardUsd}>≈ ${acc.usdValue.toLocaleString()} USD</Text>}
                </LinearGradient>
              </TouchableOpacity>
            )
          })}
        </ScrollView>

        {/* Selected account details */}
        <Card>
          <View style={styles.detailHeader}>
            <Text style={styles.detailTitle}>{selected.name} Account</Text>
            <LinearGradient colors={gradient} style={styles.currencyPill} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}>
              <Text style={styles.currencyPillText}>{selected.currency}</Text>
            </LinearGradient>
          </View>

          {[
            { label: 'Balance', value: formatBalanceDisplay(selected.balance, selected.currency, selected.symbol), copyable: false },
            ...(selected.iban ? [{ label: 'IBAN', value: selected.iban, copyable: true }] : []),
            ...(selected.walletAddress ? [{ label: 'Wallet', value: selected.walletAddress.slice(0, 20) + '…', copyable: true, full: selected.walletAddress }] : []),
          ].map((row) => (
            <View key={row.label} style={styles.detailRow}>
              <Text style={styles.detailLabel}>{row.label}</Text>
              <View style={styles.detailValue}>
                <Text style={styles.detailValueText} numberOfLines={1}>{row.value}</Text>
                {row.copyable && (
                  <TouchableOpacity onPress={() => copyToClipboard((row as any).full ?? row.value)}>
                    <Ionicons name="copy-outline" size={14} color={Colors.primary} />
                  </TouchableOpacity>
                )}
              </View>
            </View>
          ))}
        </Card>

        {/* Actions */}
        <View style={styles.actionsGrid}>
          {ACCOUNT_ACTIONS.map((a) => (
            <TouchableOpacity key={a.label} style={styles.actionCard} onPress={() => router.push(a.route as any)} activeOpacity={0.7}>
              <Ionicons name={a.icon} size={22} color={a.color} />
              <Text style={[styles.actionLabel, { color: a.color }]}>{a.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Currency transactions */}
        <Text style={styles.sectionTitle}>{selected.currency} Transactions</Text>
        <Card padding={0} style={styles.txCard}>
          {txForCurrency.length === 0 ? (
            <Text style={styles.emptyText}>No {selected.currency} transactions yet.</Text>
          ) : (
            txForCurrency.map((tx, i) => (
              <View key={tx.id} style={[styles.txRow, i < txForCurrency.length - 1 && styles.txBorder]}>
                <View style={styles.txIcon}><Text style={{ fontSize: 18 }}>{tx.icon}</Text></View>
                <View style={styles.txInfo}>
                  <Text style={styles.txDesc} numberOfLines={1}>{tx.description}</Text>
                  <Text style={styles.txDate}>{formatShortDate(tx.created_at)}</Text>
                </View>
                <Text style={[styles.txAmount, { color: tx.type === 'credit' ? Colors.success : Colors.textPrimary }]}>
                  {tx.type === 'credit' ? '+' : '-'}{Math.abs(tx.amount).toFixed(2)}
                </Text>
              </View>
            ))
          )}
        </Card>

      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  scroll: { flex: 1 },
  content: { padding: Spacing.base, paddingBottom: Spacing.xxl, gap: Spacing.base },
  screenTitle: { ...Typography.sectionTitle },
  screenSubtitle: { ...Typography.secondary, marginTop: 2 },

  cardsScroll: { gap: Spacing.sm, paddingRight: Spacing.base },
  accountCard: { width: 220, borderRadius: Radius.lg, padding: Spacing.base, gap: 4 },
  accountCardDimmed: { opacity: 0.55 },
  cardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: Spacing.xs },
  cardName: { fontSize: 11, fontWeight: '600', color: 'rgba(255,255,255,0.8)' },
  cardFlag: { fontSize: 18 },
  cardBalance: { fontSize: 22, fontWeight: '700', color: Colors.textInverse },
  cardUsd: { fontSize: 11, color: 'rgba(255,255,255,0.6)' },

  detailHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: Spacing.base },
  detailTitle: { ...Typography.bodyMedium, fontWeight: '600' },
  currencyPill: { paddingHorizontal: Spacing.sm, paddingVertical: 4, borderRadius: Radius.full },
  currencyPillText: { fontSize: 11, fontWeight: '700', color: Colors.textInverse },

  detailRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: Spacing.sm, borderBottomWidth: 1, borderBottomColor: Colors.borderLight },
  detailLabel: { ...Typography.secondary },
  detailValue: { flexDirection: 'row', alignItems: 'center', gap: Spacing.xs },
  detailValueText: { ...Typography.secondary, color: Colors.textPrimary, fontWeight: '500', maxWidth: 200 },

  actionsGrid: { flexDirection: 'row', gap: Spacing.sm },
  actionCard: { flex: 1, borderRadius: Radius.md, borderWidth: 1, borderColor: Colors.border, backgroundColor: Colors.surface, alignItems: 'center', paddingVertical: Spacing.md, gap: Spacing.xs },
  actionLabel: { ...Typography.caption, fontWeight: '600' },

  sectionTitle: { ...Typography.bodyMedium, fontWeight: '600' },
  txCard: { overflow: 'hidden' },
  txRow: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: Spacing.base, paddingVertical: Spacing.md, gap: Spacing.sm },
  txBorder: { borderBottomWidth: 1, borderBottomColor: Colors.borderLight },
  txIcon: { width: 38, height: 38, borderRadius: Radius.md, backgroundColor: Colors.surface, alignItems: 'center', justifyContent: 'center' },
  txInfo: { flex: 1, gap: 2 },
  txDesc: { ...Typography.secondary, color: Colors.textPrimary, fontWeight: '500' },
  txDate: { fontSize: 11, color: Colors.textSecondary },
  txAmount: { ...Typography.secondary, fontWeight: '600' },
  emptyText: { ...Typography.secondary, textAlign: 'center', paddingVertical: Spacing.xl },
})
