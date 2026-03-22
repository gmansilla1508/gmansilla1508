import React, { useState } from 'react'
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView, Alert } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import { Ionicons } from '@expo/vector-icons'
import { Card, ProgressBar, Badge } from '@/components/ui'
import { mockCards, mockTransactions, type Card as CardType, type CurrencyCode } from '@/lib/mock-data'
import { formatShortDate } from '@/lib/utils'
import { Colors, Spacing, Radius, Typography } from '@/lib/tokens'

const SPENDING_SOURCES: CurrencyCode[] = ['USD', 'EUR', 'USDC', 'USDT', 'BTC']

const cardTx = mockTransactions.filter((t) => t.category === 'Card')

export default function CardScreen() {
  const [cards, setCards] = useState<CardType[]>(mockCards)
  const [selectedId, setSelectedId] = useState(mockCards[0].id)
  const [showSource, setShowSource] = useState(false)

  const selected = cards.find((c) => c.id === selectedId) ?? cards[0]
  const spendPct = Math.round((selected.monthly_spending / selected.monthly_limit) * 100)

  function toggleFreeze() {
    setCards((prev) => prev.map((c) => c.id === selectedId ? { ...c, status: c.status === 'active' ? 'frozen' : 'active' } : c))
  }

  function setSource(src: CurrencyCode) {
    setCards((prev) => prev.map((c) => c.id === selectedId ? { ...c, spending_source: src } : c))
    setShowSource(false)
  }

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

        {/* Card selector (horizontal) */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.cardScroll}>
          {cards.map((card) => (
            <TouchableOpacity key={card.id} onPress={() => setSelectedId(card.id)} activeOpacity={0.85}>
              <LinearGradient
                colors={[card.gradientStart, card.gradientEnd]}
                style={[styles.cardVisual, selectedId !== card.id && styles.cardDimmed]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                {card.status === 'frozen' && (
                  <View style={styles.frozenOverlay}>
                    <Ionicons name="snow-outline" size={32} color="rgba(255,255,255,0.9)" />
                    <Text style={styles.frozenText}>Frozen</Text>
                  </View>
                )}
                <View style={styles.cardTop}>
                  <Text style={styles.cardType}>{card.card_type} · {card.network}</Text>
                  {card.cross_border && <Ionicons name="globe-outline" size={14} color="rgba(255,255,255,0.7)" />}
                </View>
                <Text style={styles.cardNumber}>{card.card_number}</Text>
                <View style={styles.cardBottom}>
                  <View>
                    <Text style={styles.cardFieldLabel}>CARD HOLDER</Text>
                    <Text style={styles.cardFieldValue}>{card.card_holder}</Text>
                  </View>
                  <View style={{ alignItems: 'flex-end' }}>
                    <Text style={styles.cardFieldLabel}>EXPIRES</Text>
                    <Text style={styles.cardFieldValue}>{card.expiry}</Text>
                  </View>
                </View>
              </LinearGradient>
            </TouchableOpacity>
          ))}
          <TouchableOpacity style={styles.addCard}>
            <Ionicons name="add" size={28} color={Colors.textSecondary} />
            <Text style={styles.addCardText}>Add card</Text>
          </TouchableOpacity>
        </ScrollView>

        {/* Quick actions */}
        <View style={styles.actionsGrid}>
          {[
            { label: selected.status === 'active' ? 'Freeze' : 'Unfreeze', icon: selected.status === 'active' ? 'snow-outline' : 'flame-outline' as any, color: selected.status === 'active' ? '#3B82F6' : Colors.warning, action: toggleFreeze },
            { label: 'Apple Pay', icon: 'phone-portrait-outline' as any, color: '#7C3AED', action: () => Alert.alert('Apple Pay', 'Add to Apple Wallet') },
            { label: 'Spending', icon: 'layers-outline' as any, color: Colors.warning, action: () => setShowSource(!showSource) },
            { label: 'Report Lost', icon: 'warning-outline' as any, color: Colors.error, action: () => Alert.alert('Report', 'Card reported lost. A new one will be issued.') },
          ].map((a) => (
            <TouchableOpacity key={a.label} style={styles.actionBtn} onPress={a.action} activeOpacity={0.7}>
              <View style={[styles.actionIcon, { backgroundColor: `${a.color}15` }]}>
                <Ionicons name={a.icon} size={20} color={a.color} />
              </View>
              <Text style={[styles.actionLabel, { color: a.color }]}>{a.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Spending source picker */}
        {showSource && (
          <Card>
            <Text style={styles.sourceTitle}>Spending source</Text>
            <Text style={styles.sourceSub}>Card deducts from this balance.</Text>
            <View style={styles.sourceChips}>
              {SPENDING_SOURCES.map((src) => (
                <TouchableOpacity
                  key={src}
                  onPress={() => setSource(src)}
                  style={[styles.sourceChip, selected.spending_source === src && styles.sourceChipActive]}
                >
                  <Text style={[styles.sourceChipText, selected.spending_source === src && { color: Colors.primary }]}>{src}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </Card>
        )}

        {/* Card details + spending */}
        <View style={styles.detailsGrid}>
          <Card style={styles.halfCard}>
            <Text style={styles.sectionTitle}>Card Details</Text>
            {[
              { label: 'Number', value: selected.card_number },
              { label: 'Holder', value: selected.card_holder },
              { label: 'Expiry', value: selected.expiry },
              { label: 'Type', value: `${selected.card_type} · ${selected.network}` },
              { label: 'Spending from', value: selected.spending_source },
              { label: 'ATM limit', value: `$${selected.atm_limit}/day` },
              { label: 'Cross-border', value: selected.cross_border ? 'Enabled' : 'Off' },
              { label: 'Status', value: selected.status.charAt(0).toUpperCase() + selected.status.slice(1) },
            ].map((row) => (
              <View key={row.label} style={styles.detailRow}>
                <Text style={styles.detailLabel}>{row.label}</Text>
                <Text style={[styles.detailValue,
                  row.label === 'Status' && { color: selected.status === 'active' ? Colors.success : '#3B82F6' },
                  row.label === 'Spending from' && { color: Colors.primary },
                  row.label === 'Cross-border' && { color: selected.cross_border ? Colors.success : Colors.textSecondary },
                ]}>{row.value}</Text>
              </View>
            ))}
          </Card>

          <Card style={styles.halfCard}>
            <Text style={styles.sectionTitle}>This Month</Text>
            <Text style={styles.spendAmount}>${selected.monthly_spending.toLocaleString()}</Text>
            <Text style={styles.spendLimit}>of ${selected.monthly_limit.toLocaleString()} limit</Text>
            <ProgressBar
              progress={spendPct}
              color={spendPct > 80 ? Colors.error : Colors.primary}
              height={8}
              style={{ marginVertical: Spacing.sm }}
            />
            <Text style={styles.spendPct}>{spendPct}% used</Text>

            <Text style={[styles.sectionTitle, { marginTop: Spacing.base }]}>Card Transactions</Text>
            {cardTx.length === 0 ? (
              <Text style={styles.emptyText}>No card transactions.</Text>
            ) : (
              cardTx.slice(0, 4).map((tx) => (
                <View key={tx.id} style={styles.txRow}>
                  <Text style={styles.txIcon}>{tx.icon}</Text>
                  <View style={styles.txInfo}>
                    <Text style={styles.txDesc} numberOfLines={1}>{tx.description}</Text>
                    <Text style={styles.txDate}>{formatShortDate(tx.created_at)}</Text>
                  </View>
                  <Text style={styles.txAmount}>-{Math.abs(tx.amount).toFixed(2)}</Text>
                </View>
              ))
            )}
          </Card>
        </View>

        {/* Security indicator */}
        <View style={styles.securityBanner}>
          <Ionicons name="shield-checkmark" size={14} color={Colors.success} />
          <Text style={styles.securityText}>Fraud protection active · 3D Secure enabled · Cross-border spending enabled</Text>
        </View>

      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  scroll: { flex: 1 },
  content: { padding: Spacing.base, paddingBottom: Spacing.xxl, gap: Spacing.base },

  cardScroll: { gap: Spacing.sm, paddingRight: Spacing.base },
  cardVisual: { width: 300, height: 180, borderRadius: Radius.lg, padding: Spacing.base, justifyContent: 'space-between' },
  cardDimmed: { opacity: 0.5 },
  frozenOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.5)', borderRadius: Radius.lg, alignItems: 'center', justifyContent: 'center', gap: 4 },
  frozenText: { color: 'rgba(255,255,255,0.9)', fontWeight: '600', fontSize: 14 },
  cardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  cardType: { fontSize: 11, color: 'rgba(255,255,255,0.7)', fontWeight: '500' },
  cardNumber: { fontFamily: 'monospace', fontSize: 14, color: 'rgba(255,255,255,0.85)', letterSpacing: 2 },
  cardBottom: { flexDirection: 'row', justifyContent: 'space-between' },
  cardFieldLabel: { fontSize: 9, color: 'rgba(255,255,255,0.5)', letterSpacing: 0.5 },
  cardFieldValue: { fontSize: 13, color: Colors.textInverse, fontWeight: '500' },

  addCard: { width: 200, height: 180, borderRadius: Radius.lg, borderWidth: 1.5, borderStyle: 'dashed', borderColor: Colors.border, alignItems: 'center', justifyContent: 'center', gap: 4 },
  addCardText: { ...Typography.secondary },

  actionsGrid: { flexDirection: 'row', gap: Spacing.sm },
  actionBtn: { flex: 1, alignItems: 'center', gap: 4 },
  actionIcon: { width: 44, height: 44, borderRadius: Radius.md, alignItems: 'center', justifyContent: 'center' },
  actionLabel: { ...Typography.caption, fontWeight: '600', textAlign: 'center' },

  sourceTitle: { ...Typography.bodyMedium, fontWeight: '600' },
  sourceSub: { ...Typography.caption, marginBottom: Spacing.sm },
  sourceChips: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.xs },
  sourceChip: { paddingHorizontal: Spacing.sm, paddingVertical: 6, borderRadius: Radius.full, borderWidth: 1, borderColor: Colors.border, backgroundColor: Colors.surface },
  sourceChipActive: { borderColor: Colors.primary, backgroundColor: Colors.primaryLight },
  sourceChipText: { ...Typography.caption, fontWeight: '600', color: Colors.textPrimary },

  detailsGrid: { gap: Spacing.sm },
  halfCard: {},
  sectionTitle: { ...Typography.secondary, fontWeight: '700', color: Colors.textPrimary, marginBottom: Spacing.sm },
  detailRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 5, borderBottomWidth: 1, borderBottomColor: Colors.borderLight },
  detailLabel: { ...Typography.caption },
  detailValue: { ...Typography.caption, fontWeight: '600', color: Colors.textPrimary },

  spendAmount: { fontSize: 28, fontWeight: '700', color: Colors.textPrimary },
  spendLimit: { ...Typography.caption },
  spendPct: { ...Typography.caption },

  txRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.xs, paddingVertical: 5 },
  txIcon: { fontSize: 16, width: 24 },
  txInfo: { flex: 1 },
  txDesc: { ...Typography.caption, fontWeight: '500', color: Colors.textPrimary },
  txDate: { fontSize: 10, color: Colors.textSecondary },
  txAmount: { ...Typography.caption, fontWeight: '600', color: Colors.textPrimary },
  emptyText: { ...Typography.caption },

  securityBanner: { flexDirection: 'row', alignItems: 'flex-start', gap: Spacing.xs, backgroundColor: Colors.successLight, padding: Spacing.sm, borderRadius: Radius.md },
  securityText: { ...Typography.caption, color: Colors.success, flex: 1, lineHeight: 16 },
})
