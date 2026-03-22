import React, { useState } from 'react'
import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput, SafeAreaView } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { mockTransactions, type TransactionCategory } from '@/lib/mock-data'
import { formatShortDate } from '@/lib/utils'
import { Colors, Spacing, Radius, Typography } from '@/lib/tokens'

const ALL_CATEGORIES: (TransactionCategory | 'All')[] = ['All', 'Income', 'Transfer', 'Subscriptions', 'Travel', 'Housing', 'Savings', 'FX', 'Food & Drink', 'Card']

const CATEGORY_COLORS: Record<string, { bg: string; text: string }> = {
  Income: { bg: Colors.successLight, text: Colors.success },
  Transfer: { bg: Colors.primaryLight, text: Colors.primary },
  Subscriptions: { bg: '#FCE7F3', text: '#DB2777' },
  Travel: { bg: '#E0F2FE', text: '#0369A1' },
  Housing: { bg: '#EDE9FE', text: '#7C3AED' },
  Savings: { bg: '#CCFBF1', text: '#0D9488' },
  FX: { bg: Colors.warningLight, text: Colors.warning },
  'Food & Drink': { bg: '#FEF3C7', text: '#D97706' },
  Card: { bg: '#FFE4E6', text: '#E11D48' },
}

export default function TransactionsScreen() {
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState<TransactionCategory | 'All'>('All')
  const [typeFilter, setTypeFilter] = useState<'all' | 'credit' | 'debit'>('all')

  const filtered = mockTransactions.filter((tx) => {
    const q = search.toLowerCase()
    const matchSearch = tx.description.toLowerCase().includes(q) || tx.merchant.toLowerCase().includes(q)
    const matchCat = category === 'All' || tx.category === category
    const matchType = typeFilter === 'all' || tx.type === typeFilter
    return matchSearch && matchCat && matchType
  })

  const totalIn = filtered.filter((t) => t.type === 'credit').reduce((s, t) => s + t.amount, 0)
  const totalOut = filtered.filter((t) => t.type === 'debit').reduce((s, t) => s + Math.abs(t.amount), 0)

  return (
    <SafeAreaView style={styles.safe}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Transactions</Text>
          <Text style={styles.subtitle}>{mockTransactions.length} total</Text>
        </View>
        <View style={styles.summaryChips}>
          <View style={[styles.summaryChip, { backgroundColor: Colors.successLight }]}>
            <Text style={[styles.summaryText, { color: Colors.success }]}>+${totalIn.toFixed(0)}</Text>
          </View>
          <View style={[styles.summaryChip, { backgroundColor: Colors.errorLight }]}>
            <Text style={[styles.summaryText, { color: Colors.error }]}>-${totalOut.toFixed(0)}</Text>
          </View>
        </View>
      </View>

      {/* Search */}
      <View style={styles.searchRow}>
        <Ionicons name="search-outline" size={16} color={Colors.textSecondary} style={styles.searchIcon} />
        <TextInput
          placeholder="Search transactions…"
          value={search}
          onChangeText={setSearch}
          style={styles.searchInput}
          placeholderTextColor={Colors.textDisabled}
        />
        {search.length > 0 && (
          <TouchableOpacity onPress={() => setSearch('')}>
            <Ionicons name="close-circle" size={16} color={Colors.textSecondary} />
          </TouchableOpacity>
        )}
      </View>

      {/* Type filter */}
      <View style={styles.typeRow}>
        {(['all', 'credit', 'debit'] as const).map((t) => (
          <TouchableOpacity
            key={t}
            onPress={() => setTypeFilter(t)}
            style={[styles.typeChip, typeFilter === t && styles.typeChipActive]}
          >
            <Text style={[styles.typeChipText, typeFilter === t && { color: Colors.primary }]}>
              {t === 'all' ? 'All' : t === 'credit' ? '↑ Income' : '↓ Expenses'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Category filter */}
      <FlatList
        data={ALL_CATEGORIES}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.catRow}
        keyExtractor={(item) => item}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => setCategory(item as any)}
            style={[styles.catChip, category === item && styles.catChipActive]}
          >
            <Text style={[styles.catChipText, category === item && { color: Colors.primary }]}>{item}</Text>
          </TouchableOpacity>
        )}
        style={{ flexGrow: 0 }}
      />

      {/* Transaction list */}
      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={<Text style={styles.emptyText}>No transactions found.</Text>}
        renderItem={({ item: tx }) => {
          const cat = CATEGORY_COLORS[tx.category] ?? { bg: Colors.surface, text: Colors.textSecondary }
          return (
            <View style={styles.txRow}>
              <View style={styles.txIcon}><Text style={{ fontSize: 20 }}>{tx.icon}</Text></View>
              <View style={styles.txInfo}>
                <Text style={styles.txDesc} numberOfLines={1}>{tx.description}</Text>
                <Text style={styles.txMeta}>{formatShortDate(tx.created_at)} · {tx.merchant}</Text>
              </View>
              <View style={styles.txRight}>
                <Text style={[styles.txAmount, { color: tx.type === 'credit' ? Colors.success : Colors.textPrimary }]}>
                  {tx.type === 'credit' ? '+' : '-'}{Math.abs(tx.amount).toFixed(2)} {tx.currency}
                </Text>
                <View style={[styles.catBadge, { backgroundColor: cat.bg }]}>
                  <Text style={[styles.catBadgeText, { color: cat.text }]}>{tx.category}</Text>
                </View>
              </View>
            </View>
          )
        }}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },

  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', paddingHorizontal: Spacing.base, paddingTop: Spacing.base, paddingBottom: Spacing.sm },
  title: { ...Typography.sectionTitle },
  subtitle: { ...Typography.caption, marginTop: 2 },
  summaryChips: { flexDirection: 'row', gap: Spacing.xs },
  summaryChip: { paddingHorizontal: Spacing.sm, paddingVertical: 5, borderRadius: Radius.full },
  summaryText: { fontSize: 13, fontWeight: '700' },

  searchRow: { flexDirection: 'row', alignItems: 'center', marginHorizontal: Spacing.base, marginBottom: Spacing.sm, height: 44, borderRadius: Radius.md, borderWidth: 1, borderColor: Colors.border, backgroundColor: Colors.surface, paddingHorizontal: Spacing.sm, gap: Spacing.xs },
  searchIcon: { marginRight: 2 },
  searchInput: { flex: 1, ...Typography.body, color: Colors.textPrimary },

  typeRow: { flexDirection: 'row', gap: Spacing.xs, paddingHorizontal: Spacing.base, marginBottom: Spacing.xs },
  typeChip: { paddingHorizontal: Spacing.sm, paddingVertical: 6, borderRadius: Radius.full, borderWidth: 1, borderColor: Colors.border, backgroundColor: Colors.surface },
  typeChipActive: { borderColor: Colors.primary, backgroundColor: Colors.primaryLight },
  typeChipText: { ...Typography.caption, fontWeight: '600', color: Colors.textSecondary },

  catRow: { paddingHorizontal: Spacing.base, gap: Spacing.xs, marginBottom: Spacing.sm },
  catChip: { paddingHorizontal: Spacing.sm, paddingVertical: 5, borderRadius: Radius.full, borderWidth: 1, borderColor: Colors.border, backgroundColor: Colors.surface },
  catChipActive: { borderColor: Colors.primary, backgroundColor: Colors.primaryLight },
  catChipText: { fontSize: 11, fontWeight: '600', color: Colors.textSecondary },

  listContent: { paddingHorizontal: Spacing.base, paddingBottom: Spacing.xxl },
  txRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: Spacing.md, gap: Spacing.sm },
  separator: { height: 1, backgroundColor: Colors.borderLight },
  txIcon: { width: 42, height: 42, borderRadius: Radius.md, backgroundColor: Colors.surface, alignItems: 'center', justifyContent: 'center' },
  txInfo: { flex: 1, gap: 2 },
  txDesc: { ...Typography.secondary, color: Colors.textPrimary, fontWeight: '500' },
  txMeta: { fontSize: 11, color: Colors.textSecondary },
  txRight: { alignItems: 'flex-end', gap: 3 },
  txAmount: { ...Typography.secondary, fontWeight: '600' },
  catBadge: { paddingHorizontal: 6, paddingVertical: 2, borderRadius: Radius.full },
  catBadgeText: { fontSize: 10, fontWeight: '600' },
  emptyText: { ...Typography.secondary, textAlign: 'center', paddingVertical: Spacing.xxl, color: Colors.textSecondary },
})
