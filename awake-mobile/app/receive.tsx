import React, { useState } from 'react'
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView, Alert } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { Card } from '@/components/ui'
import { mockAccounts, mockUser } from '@/lib/mock-data'
import { Colors, Spacing, Radius, Typography } from '@/lib/tokens'

type Method = 'p2p' | 'bank' | 'employer'

const METHODS = [
  { id: 'p2p' as Method, label: 'Peer to Peer', icon: '👤' },
  { id: 'bank' as Method, label: 'Bank Transfer', icon: '🏦' },
  { id: 'employer' as Method, label: 'From Platform', icon: '💼' },
]

const PLATFORMS = [
  { name: 'Upwork', icon: '💼', currency: 'USD', instructions: 'Add your Awake USD IBAN in Upwork payment settings.' },
  { name: 'Deel', icon: '🌐', currency: 'EUR', instructions: 'Use your Awake EUR IBAN in Deel withdrawal preferences.' },
  { name: 'Remote.com', icon: '🏢', currency: 'USD', instructions: 'Link your Awake USD account in Remote payment settings.' },
  { name: 'Toptal', icon: '⭐', currency: 'USD', instructions: 'Select bank transfer and use your Awake USD routing details.' },
]

function CopyRow({ label, value }: { label: string; value: string }) {
  function copy() { Alert.alert('Copied', `${value} copied to clipboard.`) }
  return (
    <View style={styles.copyRow}>
      <View style={styles.copyInfo}>
        <Text style={styles.copyLabel}>{label}</Text>
        <Text style={styles.copyValue} numberOfLines={1}>{value}</Text>
      </View>
      <TouchableOpacity onPress={copy} style={styles.copyBtn}>
        <Ionicons name="copy-outline" size={14} color={Colors.primary} />
        <Text style={styles.copyBtnText}>Copy</Text>
      </TouchableOpacity>
    </View>
  )
}

export default function ReceiveScreen() {
  const [method, setMethod] = useState<Method>('p2p')
  const [selectedAccount, setSelectedAccount] = useState(mockAccounts[0])
  const [selectedPlatform, setSelectedPlatform] = useState(PLATFORMS[0])

  const fiatAccounts = mockAccounts.filter((a) => a.iban)

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

        {/* Security bar */}
        <View style={styles.securityBar}>
          <Ionicons name="shield-checkmark" size={13} color={Colors.success} />
          <Text style={styles.securityText}>Secure transfer · Verified account</Text>
        </View>

        {/* Method tabs */}
        <View style={styles.methodTabs}>
          {METHODS.map((m) => (
            <TouchableOpacity
              key={m.id}
              onPress={() => setMethod(m.id)}
              style={[styles.methodTab, method === m.id && styles.methodTabActive]}
              activeOpacity={0.7}
            >
              <Text style={styles.methodTabIcon}>{m.icon}</Text>
              <Text style={[styles.methodTabLabel, method === m.id && { color: Colors.primary }]}>{m.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* P2P */}
        {method === 'p2p' && (
          <>
            <Card style={styles.qrCard}>
              <View style={styles.qrPlaceholder}>
                <Ionicons name="qr-code-outline" size={80} color={Colors.textSecondary} />
              </View>
              <Text style={styles.qrUsername}>@{mockUser.name.split(' ')[0].toLowerCase()}</Text>
              <Text style={styles.qrSub}>Awake username</Text>
              <TouchableOpacity style={styles.shareBtn}>
                <Ionicons name="share-outline" size={16} color={Colors.primary} />
                <Text style={styles.shareBtnText}>Share payment link</Text>
              </TouchableOpacity>
            </Card>

            <Text style={styles.sectionTitle}>Or share account details</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.accountChips}>
              {mockAccounts.map((acc) => (
                <TouchableOpacity
                  key={acc.id}
                  onPress={() => setSelectedAccount(acc)}
                  style={[styles.chip, selectedAccount.id === acc.id && styles.chipActive]}
                >
                  <Text style={styles.chipFlag}>{acc.flag}</Text>
                  <Text style={[styles.chipLabel, selectedAccount.id === acc.id && { color: Colors.primary }]}>{acc.currency}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
            <Card>
              {selectedAccount.iban && <CopyRow label="IBAN" value={selectedAccount.iban} />}
              {selectedAccount.walletAddress && <CopyRow label="Wallet Address" value={selectedAccount.walletAddress} />}
              <CopyRow label="Account holder" value={mockUser.name} />
            </Card>
          </>
        )}

        {/* Bank Transfer */}
        {method === 'bank' && (
          <>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.accountChips}>
              {fiatAccounts.map((acc) => (
                <TouchableOpacity
                  key={acc.id}
                  onPress={() => setSelectedAccount(acc)}
                  style={[styles.chip, selectedAccount.id === acc.id && styles.chipActive]}
                >
                  <Text style={styles.chipFlag}>{acc.flag}</Text>
                  <Text style={[styles.chipLabel, selectedAccount.id === acc.id && { color: Colors.primary }]}>{acc.currency}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
            <Card>
              <Text style={styles.cardTitle}>{selectedAccount.name} Account Details</Text>
              {selectedAccount.iban && <CopyRow label="IBAN" value={selectedAccount.iban} />}
              <CopyRow label="Account Holder" value={mockUser.name} />
              <CopyRow label="BIC / SWIFT" value="AWAKEUS33" />
              <CopyRow label="Bank Name" value="Awake Financial" />
            </Card>
            <View style={styles.infoBanner}>
              <Text style={styles.infoIcon}>⚡</Text>
              <View>
                <Text style={styles.infoTitle}>SEPA transfers: instant</Text>
                <Text style={styles.infoDesc}>SWIFT: 1–3 business days · Crypto: ~seconds</Text>
              </View>
            </View>
          </>
        )}

        {/* From Platform/Employer */}
        {method === 'employer' && (
          <>
            <Text style={styles.sectionTitle}>Select platform</Text>
            <View style={styles.platformGrid}>
              {PLATFORMS.map((p) => (
                <TouchableOpacity
                  key={p.name}
                  onPress={() => setSelectedPlatform(p)}
                  style={[styles.platformCard, selectedPlatform.name === p.name && styles.platformCardActive]}
                  activeOpacity={0.7}
                >
                  <Text style={styles.platformIcon}>{p.icon}</Text>
                  <Text style={[styles.platformName, selectedPlatform.name === p.name && { color: Colors.primary }]}>{p.name}</Text>
                  <Text style={styles.platformCurrency}>{p.currency}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <Card>
              <Text style={styles.cardTitle}>How to receive from {selectedPlatform.name}</Text>
              <Text style={styles.platformInstructions}>{selectedPlatform.instructions}</Text>
              {selectedPlatform.currency === 'USD' && mockAccounts[0].iban && (
                <CopyRow label="Your USD IBAN" value={mockAccounts[0].iban} />
              )}
              {selectedPlatform.currency === 'EUR' && mockAccounts[1].iban && (
                <CopyRow label="Your EUR IBAN" value={mockAccounts[1].iban} />
              )}
            </Card>
          </>
        )}

      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  scroll: { flex: 1 },
  content: { padding: Spacing.base, paddingBottom: Spacing.xxl, gap: Spacing.base },

  securityBar: { flexDirection: 'row', alignItems: 'center', gap: Spacing.xs, backgroundColor: Colors.successLight, padding: Spacing.sm, borderRadius: Radius.md },
  securityText: { ...Typography.caption, color: Colors.success },

  methodTabs: { flexDirection: 'row', gap: Spacing.xs },
  methodTab: { flex: 1, alignItems: 'center', paddingVertical: Spacing.sm, borderRadius: Radius.md, borderWidth: 1, borderColor: Colors.border, backgroundColor: Colors.surface, gap: 2 },
  methodTabActive: { borderColor: Colors.primary, backgroundColor: Colors.primaryLight },
  methodTabIcon: { fontSize: 18 },
  methodTabLabel: { ...Typography.caption, fontWeight: '600', color: Colors.textSecondary, textAlign: 'center' },

  qrCard: { alignItems: 'center', gap: Spacing.sm, paddingVertical: Spacing.xl },
  qrPlaceholder: { width: 160, height: 160, borderRadius: Radius.lg, backgroundColor: Colors.surface, alignItems: 'center', justifyContent: 'center', borderWidth: 1.5, borderStyle: 'dashed', borderColor: Colors.border },
  qrUsername: { ...Typography.bodyMedium, fontWeight: '700' },
  qrSub: { ...Typography.caption },
  shareBtn: { flexDirection: 'row', alignItems: 'center', gap: Spacing.xs, paddingHorizontal: Spacing.base, paddingVertical: Spacing.sm, borderRadius: Radius.full, borderWidth: 1, borderColor: Colors.primary },
  shareBtnText: { ...Typography.secondary, color: Colors.primary, fontWeight: '600' },

  sectionTitle: { ...Typography.bodyMedium, fontWeight: '600' },
  accountChips: { gap: Spacing.xs, paddingRight: Spacing.base },
  chip: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: Spacing.sm, paddingVertical: 6, borderRadius: Radius.full, borderWidth: 1, borderColor: Colors.border, backgroundColor: Colors.surface },
  chipActive: { borderColor: Colors.primary, backgroundColor: Colors.primaryLight },
  chipFlag: { fontSize: 14 },
  chipLabel: { ...Typography.caption, fontWeight: '600', color: Colors.textPrimary },

  cardTitle: { ...Typography.bodyMedium, fontWeight: '600', marginBottom: Spacing.sm },
  copyRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: Spacing.sm, borderBottomWidth: 1, borderBottomColor: Colors.borderLight },
  copyInfo: { flex: 1 },
  copyLabel: { ...Typography.caption },
  copyValue: { ...Typography.secondary, color: Colors.textPrimary, fontWeight: '500', marginTop: 1 },
  copyBtn: { flexDirection: 'row', alignItems: 'center', gap: 3, paddingHorizontal: Spacing.sm, paddingVertical: 5, borderRadius: Radius.sm, borderWidth: 1, borderColor: Colors.primary },
  copyBtnText: { fontSize: 11, color: Colors.primary, fontWeight: '600' },

  infoBanner: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, padding: Spacing.base, borderRadius: Radius.md, backgroundColor: Colors.surface, borderWidth: 1, borderColor: Colors.border },
  infoIcon: { fontSize: 22 },
  infoTitle: { ...Typography.secondary, fontWeight: '600', color: Colors.textPrimary },
  infoDesc: { ...Typography.caption },

  platformGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm },
  platformCard: { width: '47%', padding: Spacing.base, borderRadius: Radius.lg, borderWidth: 1.5, borderColor: Colors.border, backgroundColor: Colors.surface, alignItems: 'center', gap: 4 },
  platformCardActive: { borderColor: Colors.primary, backgroundColor: Colors.primaryLight },
  platformIcon: { fontSize: 28 },
  platformName: { ...Typography.secondary, fontWeight: '600', color: Colors.textPrimary },
  platformCurrency: { ...Typography.caption },
  platformInstructions: { ...Typography.secondary, marginBottom: Spacing.sm },
})
