import React, { useState } from 'react'
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { Card, Button } from '@/components/ui'
import { mockAccounts, mockFxRates, mockFxDisplayRates, type CurrencyCode } from '@/lib/mock-data'
import { Colors, Spacing, Radius, Typography } from '@/lib/tokens'

type Step = 'input' | 'confirm' | 'success'

function getRate(from: CurrencyCode, to: CurrencyCode): number {
  return (1 / mockFxRates[from]) * mockFxRates[to]
}

export default function ConvertScreen() {
  const [step, setStep] = useState<Step>('input')
  const [fromCurrency, setFromCurrency] = useState<CurrencyCode>('USD')
  const [toCurrency, setToCurrency] = useState<CurrencyCode>('EUR')
  const [fromAmount, setFromAmount] = useState('')

  const fromAccount = mockAccounts.find((a) => a.currency === fromCurrency)
  const toAccount = mockAccounts.find((a) => a.currency === toCurrency)
  const rate = getRate(fromCurrency, toCurrency)
  const parsedFrom = parseFloat(fromAmount) || 0
  const toAmount = parsedFrom * rate
  const isValid = parsedFrom > 0 && fromCurrency !== toCurrency && fromAccount && parsedFrom <= fromAccount.balance

  const CURRENCIES: CurrencyCode[] = mockAccounts.map((a) => a.currency)

  function swap() {
    const tmp = fromCurrency
    setFromCurrency(toCurrency)
    setToCurrency(tmp)
    setFromAmount('')
  }

  function reset() {
    setStep('input')
    setFromAmount('')
  }

  if (step === 'success') {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.successContainer}>
          <View style={styles.successIcon}>
            <Text style={{ fontSize: 36 }}>🔄</Text>
          </View>
          <Text style={styles.successTitle}>Converted!</Text>
          <Text style={styles.successSub}>
            {parsedFrom.toFixed(2)} {fromCurrency} → {toAmount.toFixed(4)} {toCurrency}
          </Text>
          <Card style={styles.receiptCard}>
            {[
              { label: 'You sent', value: `${parsedFrom.toFixed(2)} ${fromCurrency}` },
              { label: 'You received', value: `${toAmount.toFixed(4)} ${toCurrency}` },
              { label: 'Rate', value: `1 ${fromCurrency} = ${rate.toFixed(4)} ${toCurrency}` },
              { label: 'Fee', value: 'Free' },
            ].map((r) => (
              <View key={r.label} style={styles.receiptRow}>
                <Text style={styles.receiptLabel}>{r.label}</Text>
                <Text style={[styles.receiptValue, r.label === 'Fee' && { color: Colors.success }]}>{r.value}</Text>
              </View>
            ))}
          </Card>
          <Button label="New Conversion" onPress={reset} />
        </View>
      </SafeAreaView>
    )
  }

  if (step === 'confirm') {
    return (
      <SafeAreaView style={styles.safe}>
        <ScrollView style={styles.scroll} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <Text style={styles.screenTitle}>Confirm Conversion</Text>
          <Card>
            {[
              { label: 'You send', value: `${parsedFrom.toFixed(2)} ${fromCurrency}`, bold: true },
              { label: 'You receive', value: `${toAmount.toFixed(4)} ${toCurrency}`, bold: true },
              { label: 'Rate', value: `1 ${fromCurrency} = ${rate.toFixed(4)} ${toCurrency}` },
              { label: 'Fee', value: 'Free' },
              { label: 'Estimated time', value: 'Instant' },
            ].map((r) => (
              <View key={r.label} style={styles.receiptRow}>
                <Text style={styles.receiptLabel}>{r.label}</Text>
                <Text style={[styles.receiptValue, r.label === 'Fee' && { color: Colors.success }, r.bold && { fontWeight: '700', color: Colors.textPrimary }]}>
                  {r.value}
                </Text>
              </View>
            ))}
          </Card>
          <View style={styles.btnRow}>
            <Button label="Back" onPress={() => setStep('input')} variant="secondary" style={{ flex: 1 }} />
            <Button label="Confirm" onPress={() => setStep('success')} style={{ flex: 1 }} />
          </View>
        </ScrollView>
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.screenTitle}>Convert</Text>
        <Text style={styles.screenSub}>Exchange at real-time rates. No fees.</Text>

        {/* Converter */}
        <Card>
          {/* From */}
          <View style={styles.currencyBlock}>
            <Text style={styles.blockLabel}>From</Text>
            <View style={styles.blockRow}>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.currencyChips}>
                {CURRENCIES.map((c) => (
                  <TouchableOpacity
                    key={c}
                    onPress={() => setFromCurrency(c)}
                    style={[styles.currencyChip, fromCurrency === c && styles.currencyChipActive]}
                  >
                    <Text style={[styles.currencyChipLabel, fromCurrency === c && { color: Colors.primary }]}>{c}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
            <View style={styles.amountDisplay}>
              <Text style={styles.amountText}>
                {parsedFrom > 0 ? parsedFrom.toFixed(2) : '—'}
              </Text>
              {fromAccount && <Text style={styles.balanceHint}>Balance: {fromAccount.symbol}{fromAccount.balance.toLocaleString()}</Text>}
            </View>
            {/* Quick amounts */}
            <View style={styles.quickRow}>
              {[25, 50, 100, 500].map((q) => (
                <TouchableOpacity key={q} onPress={() => setFromAmount(q.toString())} style={styles.quickBtn}>
                  <Text style={styles.quickBtnText}>{fromAccount?.symbol ?? '$'}{q}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Swap button */}
          <TouchableOpacity onPress={swap} style={styles.swapBtn} activeOpacity={0.7}>
            <Ionicons name="swap-vertical" size={18} color={Colors.primary} />
          </TouchableOpacity>

          {/* To */}
          <View style={styles.currencyBlock}>
            <Text style={styles.blockLabel}>To</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.currencyChips}>
              {CURRENCIES.map((c) => (
                <TouchableOpacity
                  key={c}
                  onPress={() => setToCurrency(c)}
                  style={[styles.currencyChip, toCurrency === c && styles.currencyChipActive]}
                >
                  <Text style={[styles.currencyChipLabel, toCurrency === c && { color: Colors.primary }]}>{c}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
            <View style={styles.amountDisplay}>
              <Text style={[styles.amountText, { color: Colors.success }]}>
                {toAmount > 0 ? toAmount.toFixed(4) : '—'}
              </Text>
              {toAccount && <Text style={styles.balanceHint}>Balance: {toAccount.symbol}{toAccount.balance.toLocaleString()}</Text>}
            </View>
          </View>

          {fromCurrency !== toCurrency && parsedFrom > 0 && (
            <View style={styles.rateRow}>
              <Text style={styles.rateText}>1 {fromCurrency} = {rate.toFixed(6)} {toCurrency}</Text>
            </View>
          )}

          {fromCurrency === toCurrency && <Text style={styles.errorText}>Select different currencies</Text>}
          {fromAccount && parsedFrom > fromAccount.balance && <Text style={styles.errorText}>Insufficient balance</Text>}
        </Card>

        {/* Keypad for amount input */}
        <View style={styles.keypad}>
          {['1','2','3','4','5','6','7','8','9','.','0','⌫'].map((k) => (
            <TouchableOpacity
              key={k}
              style={styles.key}
              onPress={() => {
                if (k === '⌫') {
                  setFromAmount((v) => v.slice(0, -1))
                } else if (k === '.' && fromAmount.includes('.')) {
                  // ignore
                } else {
                  setFromAmount((v) => (v === '0' ? k : v + k))
                }
              }}
              activeOpacity={0.6}
            >
              <Text style={styles.keyText}>{k}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Button label="Review Conversion" onPress={() => setStep('confirm')} disabled={!isValid} />

        {/* Live rates */}
        <Text style={styles.ratesTitle}>Live Rates</Text>
        <Card>
          {mockFxDisplayRates.map((r, i) => (
            <View key={r.pair} style={[styles.rateItem, i < mockFxDisplayRates.length - 1 && { borderBottomWidth: 1, borderBottomColor: Colors.borderLight }]}>
              <View>
                <Text style={styles.ratePair}>{r.pair}</Text>
                <Text style={styles.rateValue}>{r.rate}</Text>
              </View>
              <View style={[styles.rateChange, { backgroundColor: r.up ? Colors.successLight : Colors.errorLight }]}>
                <Ionicons name={r.up ? 'trending-up' : 'trending-down'} size={12} color={r.up ? Colors.success : Colors.error} />
                <Text style={[styles.rateChangeTxt, { color: r.up ? Colors.success : Colors.error }]}>{r.change}</Text>
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
  screenTitle: { ...Typography.sectionTitle },
  screenSub: { ...Typography.secondary, marginTop: 2 },

  currencyBlock: { gap: Spacing.xs, paddingVertical: Spacing.xs },
  blockLabel: { ...Typography.caption, textTransform: 'uppercase', letterSpacing: 0.5 },
  blockRow: {},
  currencyChips: { gap: Spacing.xs, paddingRight: Spacing.xs },
  currencyChip: { paddingHorizontal: Spacing.sm, paddingVertical: 5, borderRadius: Radius.full, borderWidth: 1, borderColor: Colors.border, backgroundColor: Colors.surface },
  currencyChipActive: { borderColor: Colors.primary, backgroundColor: Colors.primaryLight },
  currencyChipLabel: { ...Typography.caption, fontWeight: '600', color: Colors.textPrimary },
  amountDisplay: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingTop: Spacing.xs },
  amountText: { fontSize: 28, fontWeight: '700', color: Colors.textPrimary },
  balanceHint: { ...Typography.caption },
  quickRow: { flexDirection: 'row', gap: Spacing.xs, marginTop: Spacing.xs },
  quickBtn: { paddingHorizontal: Spacing.sm, paddingVertical: 5, borderRadius: Radius.full, backgroundColor: Colors.surface, borderWidth: 1, borderColor: Colors.border },
  quickBtnText: { fontSize: 11, fontWeight: '600', color: Colors.textPrimary },

  swapBtn: { alignSelf: 'center', width: 36, height: 36, borderRadius: Radius.full, backgroundColor: Colors.primaryLight, alignItems: 'center', justifyContent: 'center', marginVertical: Spacing.xs },
  rateRow: { alignItems: 'center', marginTop: Spacing.xs },
  rateText: { ...Typography.caption, color: Colors.textSecondary },
  errorText: { ...Typography.caption, color: Colors.error, textAlign: 'center', marginTop: Spacing.xs },

  keypad: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.xs },
  key: { width: '31%', height: 48, borderRadius: Radius.md, backgroundColor: Colors.surface, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: Colors.borderLight },
  keyText: { fontSize: 20, fontWeight: '500', color: Colors.textPrimary },

  ratesTitle: { ...Typography.bodyMedium, fontWeight: '600' },
  rateItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: Spacing.sm },
  ratePair: { ...Typography.secondary, fontWeight: '600', color: Colors.textPrimary },
  rateValue: { ...Typography.caption },
  rateChange: { flexDirection: 'row', alignItems: 'center', gap: 3, paddingHorizontal: Spacing.xs, paddingVertical: 3, borderRadius: Radius.full },
  rateChangeTxt: { fontSize: 11, fontWeight: '600' },

  receiptCard: { width: '100%' },
  receiptRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: Spacing.sm, borderBottomWidth: 1, borderBottomColor: Colors.borderLight },
  receiptLabel: { ...Typography.secondary },
  receiptValue: { ...Typography.secondary, color: Colors.textPrimary, fontWeight: '500' },
  btnRow: { flexDirection: 'row', gap: Spacing.sm },

  successContainer: { flex: 1, padding: Spacing.base, alignItems: 'center', justifyContent: 'center', gap: Spacing.base },
  successIcon: { width: 80, height: 80, borderRadius: Radius.full, backgroundColor: Colors.primaryLight, alignItems: 'center', justifyContent: 'center' },
  successTitle: { ...Typography.headline },
  successSub: { ...Typography.secondary, textAlign: 'center' },
})
