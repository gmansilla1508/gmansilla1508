import React from 'react'
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView } from 'react-native'
import { router } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import { mockTransactions } from '@/lib/mock-data'
import { formatShortDate } from '@/lib/utils'
import { Colors, Spacing, Radius, Typography } from '@/lib/tokens'

const PAYMENT_ACTIONS = [
  { label: 'Send', icon: 'arrow-up-circle' as const, desc: 'Transfer to users, banks, wallets', color: Colors.primary, bg: Colors.primaryLight, route: '/send' },
  { label: 'Receive', icon: 'arrow-down-circle' as const, desc: 'Bank transfer, P2P, employer', color: Colors.success, bg: Colors.successLight, route: '/receive' },
  { label: 'Convert', icon: 'swap-horizontal' as const, desc: 'Exchange currencies at live rates', color: Colors.warning, bg: Colors.warningLight, route: '/convert' },
  { label: 'Savings', icon: 'trending-up' as const, desc: 'Smart savings · 4.8% APY', color: '#7C3AED', bg: '#EDE9FE', route: '/savings' },
]

const recentPayments = mockTransactions.filter((t) =>
  ['Transfer', 'Income', 'FX', 'Savings'].includes(t.category)
).slice(0, 6)

export default function PaymentsScreen() {
  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.screenTitle}>Payments</Text>
        <Text style={styles.screenSubtitle}>Send, receive & convert globally.</Text>

        {/* Main Action Cards */}
        <View style={styles.actionsGrid}>
          {PAYMENT_ACTIONS.map((a) => (
            <TouchableOpacity
              key={a.label}
              style={[styles.actionCard, { backgroundColor: a.bg }]}
              onPress={() => router.push(a.route as any)}
              activeOpacity={0.75}
            >
              <View style={styles.actionTop}>
                <View style={[styles.actionIconBox, { backgroundColor: `${a.color}20` }]}>
                  <Ionicons name={a.icon} size={26} color={a.color} />
                </View>
                <Ionicons name="chevron-forward" size={16} color={a.color} />
              </View>
              <Text style={[styles.actionLabel, { color: a.color }]}>{a.label}</Text>
              <Text style={styles.actionDesc}>{a.desc}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Security notice */}
        <View style={styles.securityBanner}>
          <Ionicons name="shield-checkmark" size={16} color={Colors.success} />
          <Text style={styles.securityText}>All transfers are encrypted and fraud-protected</Text>
        </View>

        {/* Recent payment activity */}
        <Text style={styles.sectionTitle}>Recent Activity</Text>
        <View style={styles.txList}>
          {recentPayments.map((tx, i) => (
            <View key={tx.id} style={[styles.txRow, i < recentPayments.length - 1 && styles.txBorder]}>
              <View style={styles.txIcon}><Text style={{ fontSize: 18 }}>{tx.icon}</Text></View>
              <View style={styles.txInfo}>
                <Text style={styles.txDesc} numberOfLines={1}>{tx.description}</Text>
                <Text style={styles.txMeta}>{formatShortDate(tx.created_at)} · {tx.currency}</Text>
              </View>
              <View style={styles.txRight}>
                <Text style={[styles.txAmount, { color: tx.type === 'credit' ? Colors.success : Colors.textPrimary }]}>
                  {tx.type === 'credit' ? '+' : '-'}{Math.abs(tx.amount).toFixed(2)}
                </Text>
                <Text style={styles.txCategory}>{tx.category}</Text>
              </View>
            </View>
          ))}
        </View>

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

  actionsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm },
  actionCard: { width: '47.5%', borderRadius: Radius.lg, padding: Spacing.base, gap: Spacing.xs },
  actionTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: Spacing.xs },
  actionIconBox: { width: 44, height: 44, borderRadius: Radius.md, alignItems: 'center', justifyContent: 'center' },
  actionLabel: { fontSize: 16, fontWeight: '700' },
  actionDesc: { ...Typography.caption, color: Colors.textSecondary },

  securityBanner: { flexDirection: 'row', alignItems: 'center', gap: Spacing.xs, backgroundColor: Colors.successLight, padding: Spacing.sm, borderRadius: Radius.md },
  securityText: { ...Typography.caption, color: Colors.success, flex: 1 },

  sectionTitle: { ...Typography.bodyMedium, fontWeight: '600' },

  txList: { borderRadius: Radius.lg, borderWidth: 1, borderColor: Colors.border, overflow: 'hidden', backgroundColor: Colors.background },
  txRow: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: Spacing.base, paddingVertical: Spacing.md, gap: Spacing.sm },
  txBorder: { borderBottomWidth: 1, borderBottomColor: Colors.borderLight },
  txIcon: { width: 38, height: 38, borderRadius: Radius.md, backgroundColor: Colors.surface, alignItems: 'center', justifyContent: 'center' },
  txInfo: { flex: 1, gap: 2 },
  txDesc: { ...Typography.secondary, color: Colors.textPrimary, fontWeight: '500' },
  txMeta: { fontSize: 11, color: Colors.textSecondary },
  txRight: { alignItems: 'flex-end', gap: 2 },
  txAmount: { ...Typography.secondary, fontWeight: '600' },
  txCategory: { fontSize: 10, color: Colors.textSecondary },
})
