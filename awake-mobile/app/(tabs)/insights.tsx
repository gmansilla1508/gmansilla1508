import React from 'react'
import { View, Text, StyleSheet, ScrollView, SafeAreaView } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { Card, ProgressBar } from '@/components/ui'
import { mockInsights, mockMonthlyIncome, mockMonthlySpent, mockMonthlySaved } from '@/lib/mock-data'
import { Colors, Spacing, Radius, Typography } from '@/lib/tokens'

const MAX_BAR = 4800

export default function InsightsScreen() {
  const { incomeSources, stabilityScore, stabilityMonths, topCategories, cashRunwayMonths, savingsRate, monthlyTrend } = mockInsights

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.screenTitle}>Financial Insights</Text>
        <Text style={styles.screenSubtitle}>Your activity — March 2026</Text>

        {/* Summary strip */}
        <View style={styles.summaryRow}>
          {[
            { label: 'Income', value: `$${mockMonthlyIncome.toLocaleString()}`, color: Colors.success, icon: 'trending-up' as const },
            { label: 'Spent', value: `$${mockMonthlySpent.toLocaleString()}`, color: Colors.error, icon: 'trending-down' as const },
            { label: 'Saved', value: `$${mockMonthlySaved.toLocaleString()}`, color: Colors.primary, icon: 'arrow-up-circle' as const },
          ].map((s) => (
            <Card key={s.label} style={styles.summaryCard}>
              <View style={[styles.summaryIcon, { backgroundColor: `${s.color}15` }]}>
                <Ionicons name={s.icon} size={16} color={s.color} />
              </View>
              <Text style={[styles.summaryValue, { color: s.color }]}>{s.value}</Text>
              <Text style={styles.summaryLabel}>{s.label}</Text>
            </Card>
          ))}
        </View>

        {/* Bar chart — Income vs Spending */}
        <Card>
          <Text style={styles.cardTitle}>Income vs Spending</Text>
          <Text style={styles.cardSub}>Last 6 months</Text>
          <View style={styles.barChart}>
            {monthlyTrend.map((m) => (
              <View key={m.month} style={styles.barGroup}>
                <View style={styles.bars}>
                  <View style={[styles.bar, { height: (m.income / MAX_BAR) * 100, backgroundColor: `${Colors.success}80` }]} />
                  <View style={[styles.bar, { height: (m.spent / MAX_BAR) * 100, backgroundColor: `${Colors.error}60` }]} />
                </View>
                <Text style={styles.barLabel}>{m.month}</Text>
              </View>
            ))}
          </View>
          <View style={styles.legend}>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: `${Colors.success}80` }]} />
              <Text style={styles.legendText}>Income</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: `${Colors.error}60` }]} />
              <Text style={styles.legendText}>Spending</Text>
            </View>
          </View>
        </Card>

        {/* Income sources */}
        <Card>
          <Text style={styles.cardTitle}>Income Sources</Text>
          <View style={styles.sourcesList}>
            {incomeSources.map((src) => (
              <View key={src.label} style={styles.sourceRow}>
                <View style={styles.sourceInfo}>
                  <Text style={styles.sourceLabel}>{src.label}</Text>
                  <View style={styles.sourceMeta}>
                    <Text style={styles.sourceAmount}>${src.amount.toLocaleString()}</Text>
                    <Text style={styles.sourcePct}>{src.percentage}%</Text>
                  </View>
                </View>
                <ProgressBar progress={src.percentage} color={Colors.success} height={6} />
              </View>
            ))}
          </View>
          <View style={styles.stabilityRow}>
            <View style={styles.stabilityDot} />
            <Text style={styles.stabilityText}>
              Income Stability: <Text style={{ color: Colors.success, fontWeight: '600' }}>{stabilityScore}</Text> · Stable for {stabilityMonths} months
            </Text>
          </View>
        </Card>

        {/* Spending categories */}
        <Card>
          <Text style={styles.cardTitle}>Top Spending Categories</Text>
          <View style={styles.categoriesList}>
            {topCategories.map((cat) => (
              <View key={cat.label} style={styles.catRow}>
                <Text style={styles.catIcon}>{cat.icon}</Text>
                <View style={styles.catInfo}>
                  <View style={styles.catMeta}>
                    <Text style={styles.catLabel}>{cat.label}</Text>
                    <Text style={styles.catAmount}>${typeof cat.amount === 'number' ? cat.amount.toFixed(0) : cat.amount}</Text>
                  </View>
                  <ProgressBar progress={cat.percentage} color={cat.color} height={5} />
                </View>
                <Text style={styles.catPct}>{cat.percentage}%</Text>
              </View>
            ))}
          </View>
        </Card>

        {/* Health metrics */}
        <View style={styles.healthGrid}>
          {/* Savings Rate */}
          <Card style={styles.halfCard}>
            <Text style={styles.cardTitle}>Savings Rate</Text>
            <Text style={[styles.bigNumber, { color: Colors.primary }]}>{savingsRate}%</Text>
            <ProgressBar progress={savingsRate} color={Colors.primary} height={8} style={{ marginVertical: Spacing.sm }} />
            <Text style={styles.healthNote}>
              {savingsRate >= 50 ? '🌟 Excellent' : savingsRate >= 30 ? '👍 Good' : '📈 Improve'}
            </Text>
          </Card>

          {/* Cash Runway */}
          <Card style={styles.halfCard}>
            <Text style={styles.cardTitle}>Cash Runway</Text>
            <Text style={[styles.bigNumber, { color: cashRunwayMonths >= 6 ? Colors.success : Colors.warning }]}>
              {cashRunwayMonths}
            </Text>
            <Text style={styles.bigNumberSub}>months</Text>
            <ProgressBar
              progress={(cashRunwayMonths / 12) * 100}
              color={cashRunwayMonths >= 6 ? Colors.success : Colors.warning}
              height={8}
              style={{ marginVertical: Spacing.sm }}
            />
            <Text style={styles.healthNote}>
              {cashRunwayMonths >= 6 ? '✓ Healthy fund' : '⚠ Target 6 months'}
            </Text>
          </Card>
        </View>

        {/* Savings health summary */}
        <Card>
          <Text style={styles.cardTitle}>Savings Health</Text>
          <View style={styles.healthChecks}>
            {[
              { label: 'Emergency fund', ok: cashRunwayMonths >= 3, status: cashRunwayMonths >= 3 ? 'Good' : 'Low' },
              { label: 'Savings rate', ok: savingsRate >= 20, status: savingsRate >= 20 ? 'On track' : 'Below target' },
              { label: 'Income diversification', ok: incomeSources.length >= 2, status: incomeSources.length >= 2 ? 'Diversified' : 'Single source' },
            ].map((c) => (
              <View key={c.label} style={styles.healthCheck}>
                <Ionicons name={c.ok ? 'checkmark-circle' : 'warning'} size={18} color={c.ok ? Colors.success : Colors.warning} />
                <View>
                  <Text style={[styles.healthStatus, { color: c.ok ? Colors.success : Colors.warning }]}>{c.status}</Text>
                  <Text style={styles.healthLabel}>{c.label}</Text>
                </View>
              </View>
            ))}
          </View>
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
  cardTitle: { ...Typography.bodyMedium, fontWeight: '600', marginBottom: 2 },
  cardSub: { ...Typography.caption, marginBottom: Spacing.base },

  summaryRow: { flexDirection: 'row', gap: Spacing.sm },
  summaryCard: { flex: 1, alignItems: 'center', gap: 4 },
  summaryIcon: { width: 32, height: 32, borderRadius: Radius.md, alignItems: 'center', justifyContent: 'center' },
  summaryValue: { fontSize: 15, fontWeight: '700' },
  summaryLabel: { ...Typography.caption },

  barChart: { flexDirection: 'row', alignItems: 'flex-end', height: 120, gap: Spacing.xs, marginBottom: Spacing.sm },
  barGroup: { flex: 1, alignItems: 'center', gap: 4 },
  bars: { flexDirection: 'row', alignItems: 'flex-end', gap: 2, height: 100 },
  bar: { width: 10, borderRadius: 3, minHeight: 4 },
  barLabel: { fontSize: 10, color: Colors.textSecondary },
  legend: { flexDirection: 'row', gap: Spacing.base, marginTop: Spacing.xs },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  legendDot: { width: 10, height: 10, borderRadius: 2 },
  legendText: { ...Typography.caption },

  sourcesList: { gap: Spacing.md, marginTop: Spacing.sm },
  sourceRow: { gap: 6 },
  sourceInfo: { flexDirection: 'row', justifyContent: 'space-between' },
  sourceLabel: { ...Typography.secondary, color: Colors.textPrimary },
  sourceMeta: { flexDirection: 'row', gap: Spacing.sm },
  sourceAmount: { ...Typography.secondary, color: Colors.success, fontWeight: '600' },
  sourcePct: { ...Typography.caption, color: Colors.textSecondary },
  stabilityRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.xs, marginTop: Spacing.base, paddingTop: Spacing.base, borderTopWidth: 1, borderTopColor: Colors.borderLight },
  stabilityDot: { width: 8, height: 8, borderRadius: Radius.full, backgroundColor: Colors.success },
  stabilityText: { ...Typography.secondary, flex: 1 },

  categoriesList: { gap: Spacing.md, marginTop: Spacing.sm },
  catRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  catIcon: { fontSize: 20, width: 28 },
  catInfo: { flex: 1, gap: 4 },
  catMeta: { flexDirection: 'row', justifyContent: 'space-between' },
  catLabel: { ...Typography.secondary, color: Colors.textPrimary },
  catAmount: { ...Typography.caption, color: Colors.textSecondary },
  catPct: { ...Typography.caption, color: Colors.textSecondary, width: 30, textAlign: 'right' },

  healthGrid: { flexDirection: 'row', gap: Spacing.sm },
  halfCard: { flex: 1 },
  bigNumber: { fontSize: 36, fontWeight: '800', letterSpacing: -1 },
  bigNumberSub: { ...Typography.caption, marginTop: -4 },
  healthNote: { ...Typography.caption, marginTop: 2 },

  healthChecks: { gap: Spacing.md, marginTop: Spacing.sm },
  healthCheck: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  healthStatus: { ...Typography.secondary, fontWeight: '600' },
  healthLabel: { ...Typography.caption },
})
