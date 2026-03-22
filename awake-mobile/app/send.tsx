import React, { useState } from 'react'
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, SafeAreaView, Alert } from 'react-native'
import { router } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import { Button, Card, Badge } from '@/components/ui'
import { mockAccounts, mockContacts } from '@/lib/mock-data'
import { Colors, Spacing, Radius, Typography } from '@/lib/tokens'

type Step = 'method' | 'recipient' | 'amount' | 'confirm' | 'success'
type Method = 'awake' | 'bank' | 'crypto'

const METHODS = [
  { id: 'awake' as Method, label: 'Awake User', desc: 'Instant, free', icon: 'person-circle-outline' as const, color: Colors.primary },
  { id: 'bank' as Method, label: 'Bank Account', desc: 'SEPA / SWIFT', icon: 'business-outline' as const, color: '#7C3AED' },
  { id: 'crypto' as Method, label: 'Crypto Wallet', desc: 'Any wallet address', icon: 'logo-bitcoin' as const, color: Colors.warning },
]

export default function SendScreen() {
  const [step, setStep] = useState<Step>('method')
  const [method, setMethod] = useState<Method | null>(null)
  const [contact, setContact] = useState<typeof mockContacts[0] | null>(null)
  const [recipient, setRecipient] = useState('')
  const [currency, setCurrency] = useState(mockAccounts[0])
  const [amount, setAmount] = useState('')
  const [note, setNote] = useState('')

  const parsed = parseFloat(amount) || 0
  const isValid = parsed > 0 && parsed <= currency.balance

  function reset() {
    setStep('method'); setMethod(null); setContact(null)
    setRecipient(''); setAmount(''); setNote('')
  }

  if (step === 'success') {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.successContainer}>
          <View style={styles.successCircle}>
            <Ionicons name="checkmark" size={40} color={Colors.success} />
          </View>
          <Text style={styles.successTitle}>Sent!</Text>
          <Text style={styles.successSub}>
            {currency.symbol}{parsed.toFixed(2)} {currency.currency} sent successfully.
          </Text>
          <Card style={styles.receiptCard}>
            {[
              { label: 'To', value: contact?.name ?? recipient },
              { label: 'Amount', value: `${currency.symbol}${parsed.toFixed(2)} ${currency.currency}` },
              { label: 'Fee', value: 'Free' },
              { label: 'Status', value: 'Completed' },
            ].map((r) => (
              <View key={r.label} style={styles.receiptRow}>
                <Text style={styles.receiptLabel}>{r.label}</Text>
                <Text style={[styles.receiptValue, r.label === 'Status' && { color: Colors.success }]}>{r.value}</Text>
              </View>
            ))}
          </Card>
          <Button label="New Transfer" onPress={reset} />
          <Button label="Done" onPress={() => router.back()} variant="ghost" style={{ marginTop: Spacing.xs }} />
        </View>
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>

        {/* Security indicator */}
        <View style={styles.securityBar}>
          <Ionicons name="shield-checkmark" size={13} color={Colors.success} />
          <Text style={styles.securityText}>Secure transfer · End-to-end encrypted</Text>
        </View>

        {/* Step: Method */}
        {step === 'method' && (
          <View style={styles.section}>
            <Text style={styles.stepTitle}>Choose method</Text>
            {METHODS.map((m) => (
              <TouchableOpacity
                key={m.id}
                style={styles.methodCard}
                onPress={() => { setMethod(m.id); setStep('recipient') }}
                activeOpacity={0.7}
              >
                <View style={[styles.methodIcon, { backgroundColor: `${m.color}15` }]}>
                  <Ionicons name={m.icon} size={24} color={m.color} />
                </View>
                <View style={styles.methodInfo}>
                  <Text style={styles.methodLabel}>{m.label}</Text>
                  <Text style={styles.methodDesc}>{m.desc}</Text>
                </View>
                <Ionicons name="chevron-forward" size={16} color={Colors.textSecondary} />
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Step: Recipient */}
        {step === 'recipient' && (
          <View style={styles.section}>
            <TouchableOpacity onPress={() => setStep('method')} style={styles.backBtn}>
              <Ionicons name="arrow-back" size={18} color={Colors.textSecondary} />
              <Text style={styles.backText}>Back</Text>
            </TouchableOpacity>
            <Text style={styles.stepTitle}>{method === 'awake' ? 'Select recipient' : method === 'bank' ? 'Bank details' : 'Wallet address'}</Text>

            {method === 'awake' && (
              <>
                <View style={styles.contactsGrid}>
                  {mockContacts.map((c) => (
                    <TouchableOpacity
                      key={c.id}
                      style={[styles.contactCard, contact?.id === c.id && styles.contactCardActive]}
                      onPress={() => setContact(c)}
                      activeOpacity={0.7}
                    >
                      <View style={styles.contactAvatar}><Text style={styles.contactAvatarText}>{c.avatar}</Text></View>
                      <Text style={styles.contactName}>{c.name}</Text>
                      <Text style={styles.contactHandle}>{c.handle}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
                <TextInput
                  placeholder="Or enter username / handle"
                  value={recipient}
                  onChangeText={setRecipient}
                  style={styles.textInput}
                  placeholderTextColor={Colors.textDisabled}
                />
                {(contact || recipient) && <Button label="Continue" onPress={() => setStep('amount')} />}
              </>
            )}

            {method === 'bank' && (
              <>
                <TextInput placeholder="Recipient name" style={styles.textInput} placeholderTextColor={Colors.textDisabled} />
                <TextInput placeholder="IBAN or account number" value={recipient} onChangeText={setRecipient} style={styles.textInput} placeholderTextColor={Colors.textDisabled} />
                <TextInput placeholder="BIC / SWIFT (optional)" style={styles.textInput} placeholderTextColor={Colors.textDisabled} />
                <Button label="Continue" onPress={() => setStep('amount')} disabled={!recipient} />
              </>
            )}

            {method === 'crypto' && (
              <>
                <TextInput placeholder="0x… or bc1q…" value={recipient} onChangeText={setRecipient} style={[styles.textInput, { fontFamily: 'monospace' }]} placeholderTextColor={Colors.textDisabled} autoCapitalize="none" />
                <Button label="Continue" onPress={() => setStep('amount')} disabled={!recipient} />
              </>
            )}
          </View>
        )}

        {/* Step: Amount */}
        {step === 'amount' && (
          <View style={styles.section}>
            <TouchableOpacity onPress={() => setStep('recipient')} style={styles.backBtn}>
              <Ionicons name="arrow-back" size={18} color={Colors.textSecondary} />
              <Text style={styles.backText}>Back</Text>
            </TouchableOpacity>
            <Text style={styles.stepTitle}>Enter amount</Text>

            {/* Currency selector */}
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.currencyRow}>
              {mockAccounts.map((acc) => (
                <TouchableOpacity
                  key={acc.id}
                  onPress={() => setCurrency(acc)}
                  style={[styles.currencyChip, currency.id === acc.id && styles.currencyChipActive]}
                >
                  <Text style={styles.currencyFlag}>{acc.flag}</Text>
                  <Text style={[styles.currencyLabel, currency.id === acc.id && { color: Colors.primary }]}>{acc.currency}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            <Card style={styles.amountCard}>
              <View style={styles.amountRow}>
                <Text style={styles.currencySymbol}>{currency.symbol}</Text>
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
              <Text style={styles.balanceHint}>Available: {currency.symbol}{currency.balance.toLocaleString()} {currency.currency}</Text>
              {parsed > currency.balance && <Text style={styles.errorText}>Insufficient balance</Text>}
              <View style={styles.quickAmounts}>
                {[25, 50, 100, 250].map((q) => (
                  <TouchableOpacity key={q} onPress={() => setAmount(q.toString())} style={styles.quickBtn}>
                    <Text style={styles.quickBtnText}>{currency.symbol}{q}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </Card>

            <TextInput
              placeholder="Note (optional)"
              value={note}
              onChangeText={setNote}
              style={styles.textInput}
              placeholderTextColor={Colors.textDisabled}
            />
            <Button label="Review Transfer" onPress={() => setStep('confirm')} disabled={!isValid} />
          </View>
        )}

        {/* Step: Confirm */}
        {step === 'confirm' && (
          <View style={styles.section}>
            <Text style={styles.stepTitle}>Confirm Transfer</Text>
            <Card>
              {[
                { label: 'To', value: contact?.name ?? recipient },
                { label: 'Amount', value: `${currency.symbol}${parsed.toFixed(2)} ${currency.currency}` },
                { label: 'From', value: `${currency.name} account` },
                { label: 'Fee', value: 'Free' },
                { label: 'Note', value: note || '—' },
              ].map((r) => (
                <View key={r.label} style={styles.receiptRow}>
                  <Text style={styles.receiptLabel}>{r.label}</Text>
                  <Text style={[styles.receiptValue, r.label === 'Fee' && { color: Colors.success }]}>{r.value}</Text>
                </View>
              ))}
            </Card>
            <View style={styles.btnRow}>
              <Button label="Back" onPress={() => setStep('amount')} variant="secondary" style={{ flex: 1 }} />
              <Button label="Send Money" onPress={() => setStep('success')} style={{ flex: 1 }} />
            </View>
          </View>
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

  section: { gap: Spacing.base },
  stepTitle: { ...Typography.sectionTitle, fontSize: 20 },
  backBtn: { flexDirection: 'row', alignItems: 'center', gap: Spacing.xs },
  backText: { ...Typography.secondary },

  methodCard: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, padding: Spacing.base, borderRadius: Radius.lg, borderWidth: 1, borderColor: Colors.border, backgroundColor: Colors.background },
  methodIcon: { width: 44, height: 44, borderRadius: Radius.md, alignItems: 'center', justifyContent: 'center' },
  methodInfo: { flex: 1 },
  methodLabel: { ...Typography.bodyMedium, fontWeight: '600' },
  methodDesc: { ...Typography.caption },

  contactsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm },
  contactCard: { width: '47%', padding: Spacing.md, borderRadius: Radius.lg, borderWidth: 1.5, borderColor: Colors.border, backgroundColor: Colors.surface, alignItems: 'center', gap: 4 },
  contactCardActive: { borderColor: Colors.primary, backgroundColor: Colors.primaryLight },
  contactAvatar: { width: 44, height: 44, borderRadius: Radius.full, backgroundColor: Colors.primary, alignItems: 'center', justifyContent: 'center' },
  contactAvatarText: { color: Colors.textInverse, fontWeight: '700', fontSize: 14 },
  contactName: { ...Typography.secondary, fontWeight: '600', color: Colors.textPrimary },
  contactHandle: { ...Typography.caption },

  textInput: { height: 48, borderRadius: Radius.md, borderWidth: 1, borderColor: Colors.border, paddingHorizontal: Spacing.base, backgroundColor: Colors.surface, ...Typography.body, color: Colors.textPrimary },

  currencyRow: { gap: Spacing.xs, paddingRight: Spacing.base },
  currencyChip: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: Spacing.sm, paddingVertical: 6, borderRadius: Radius.full, borderWidth: 1, borderColor: Colors.border, backgroundColor: Colors.surface },
  currencyChipActive: { borderColor: Colors.primary, backgroundColor: Colors.primaryLight },
  currencyFlag: { fontSize: 14 },
  currencyLabel: { ...Typography.caption, fontWeight: '600', color: Colors.textPrimary },

  amountCard: { alignItems: 'center', gap: Spacing.sm },
  amountRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  currencySymbol: { fontSize: 28, color: Colors.textSecondary, fontWeight: '300' },
  amountInput: { fontSize: 48, fontWeight: '700', color: Colors.textPrimary, minWidth: 120, textAlign: 'center' },
  balanceHint: { ...Typography.caption },
  errorText: { ...Typography.caption, color: Colors.error },
  quickAmounts: { flexDirection: 'row', gap: Spacing.xs },
  quickBtn: { paddingHorizontal: Spacing.sm, paddingVertical: 6, borderRadius: Radius.full, backgroundColor: Colors.surface, borderWidth: 1, borderColor: Colors.border },
  quickBtnText: { ...Typography.caption, fontWeight: '600', color: Colors.textPrimary },

  receiptRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: Spacing.sm, borderBottomWidth: 1, borderBottomColor: Colors.borderLight },
  receiptLabel: { ...Typography.secondary },
  receiptValue: { ...Typography.secondary, color: Colors.textPrimary, fontWeight: '500' },

  btnRow: { flexDirection: 'row', gap: Spacing.sm },

  successContainer: { flex: 1, padding: Spacing.base, alignItems: 'center', justifyContent: 'center', gap: Spacing.base },
  successCircle: { width: 80, height: 80, borderRadius: Radius.full, backgroundColor: Colors.successLight, alignItems: 'center', justifyContent: 'center' },
  successTitle: { ...Typography.headline },
  successSub: { ...Typography.secondary, textAlign: 'center' },
  receiptCard: { width: '100%' },
})
