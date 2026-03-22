import React, { useState } from 'react'
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  SafeAreaView, KeyboardAvoidingView, Platform,
} from 'react-native'
import { router } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import { Button, Input } from '@/components/ui'
import { Colors, Spacing, Radius, Typography } from '@/lib/tokens'

type Step = 1 | 2 | 3 | 4 | 5

const TOTAL_STEPS = 5

const INCOME_SOURCES = [
  { id: 'freelance', label: 'Freelance / Remote', icon: '💻' },
  { id: 'platform', label: 'Platform Income', icon: '📱' },
  { id: 'crypto', label: 'Crypto / Web3', icon: '🔗' },
  { id: 'business', label: 'Business Owner', icon: '🏢' },
  { id: 'employment', label: 'Employed', icon: '👔' },
  { id: 'investments', label: 'Investments', icon: '📈' },
]

const COUNTRIES = ['United States', 'Spain', 'Germany', 'France', 'United Kingdom', 'Portugal', 'Mexico', 'Argentina', 'Colombia', 'Brazil']

export default function OnboardingScreen() {
  const [step, setStep] = useState<Step>(1)
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [docType, setDocType] = useState<'passport' | 'national_id' | null>(null)
  const [nationality, setNationality] = useState('')
  const [residence, setResidence] = useState('')
  const [incomeSource, setIncomeSource] = useState('')

  const progress = ((step - 1) / (TOTAL_STEPS - 1)) * 100

  function next() {
    if (step < TOTAL_STEPS) setStep((s) => (s + 1) as Step)
  }
  function back() {
    if (step > 1) setStep((s) => (s - 1) as Step)
  }

  const STEP_LABELS = ['Account', 'Identity', 'Residency', 'Income', 'Welcome']

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Logo */}
          <View style={styles.logo}>
            <View style={styles.logoIcon}>
              <Text style={styles.logoLetter}>A</Text>
            </View>
            <Text style={styles.logoText}>Awake</Text>
          </View>

          {/* Progress */}
          <View style={styles.progressSection}>
            <View style={styles.stepsRow}>
              {STEP_LABELS.map((label, i) => {
                const num = i + 1
                const done = step > num
                const active = step === num
                return (
                  <View key={label} style={styles.stepItem}>
                    <View style={[styles.stepDot, done && styles.stepDotDone, active && styles.stepDotActive]}>
                      {done
                        ? <Ionicons name="checkmark" size={12} color={Colors.textInverse} />
                        : <Text style={[styles.stepNum, active && { color: Colors.primary }]}>{num}</Text>}
                    </View>
                    <Text style={[styles.stepLabel, active && { color: Colors.primary }]}>{label}</Text>
                  </View>
                )
              })}
            </View>
            <View style={styles.progressTrack}>
              <View style={[styles.progressFill, { width: `${progress}%` }]} />
            </View>
          </View>

          {/* ── Step 1: Account ── */}
          {step === 1 && (
            <View style={styles.stepContent}>
              <Text style={styles.title}>Create your account</Text>
              <Text style={styles.subtitle}>Start your global financial journey.</Text>
              <View style={styles.form}>
                <Input
                  label="Email address"
                  placeholder="you@email.com"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
                <Input
                  label="Phone number"
                  placeholder="+1 (555) 000-0000"
                  value={phone}
                  onChangeText={setPhone}
                  keyboardType="phone-pad"
                />
              </View>
              <View style={styles.trustBadge}>
                <Ionicons name="shield-checkmark-outline" size={14} color={Colors.success} />
                <Text style={styles.trustText}>Your data is encrypted and never shared with third parties.</Text>
              </View>
              <Button label="Continue" onPress={next} disabled={!email || !phone} />
            </View>
          )}

          {/* ── Step 2: Identity ── */}
          {step === 2 && (
            <View style={styles.stepContent}>
              <TouchableOpacity onPress={back} style={styles.backBtn}>
                <Ionicons name="arrow-back" size={18} color={Colors.textSecondary} />
                <Text style={styles.backText}>Back</Text>
              </TouchableOpacity>
              <Text style={styles.title}>Verify your identity</Text>
              <Text style={styles.subtitle}>We're required by law to verify who you are.</Text>
              <View style={styles.form}>
                <Input label="First name" placeholder="Alex" value={firstName} onChangeText={setFirstName} />
                <Input label="Last name" placeholder="Johnson" value={lastName} onChangeText={setLastName} />
              </View>
              <Text style={styles.sectionLabel}>ID Document</Text>
              <View style={styles.docRow}>
                {([{ id: 'passport', label: 'Passport', icon: '🛂' }, { id: 'national_id', label: 'National ID', icon: '🪪' }] as const).map((d) => (
                  <TouchableOpacity
                    key={d.id}
                    onPress={() => setDocType(d.id)}
                    style={[styles.docCard, docType === d.id && styles.docCardActive]}
                  >
                    <Text style={styles.docIcon}>{d.icon}</Text>
                    <Text style={[styles.docLabel, docType === d.id && { color: Colors.primary }]}>{d.label}</Text>
                  </TouchableOpacity>
                ))}
              </View>
              {docType && (
                <View style={styles.uploadBox}>
                  <Ionicons name="cloud-upload-outline" size={20} color={Colors.textSecondary} />
                  <Text style={styles.uploadText}>Tap to upload document</Text>
                  <Text style={styles.uploadSub}>JPG, PNG or PDF · Max 10MB</Text>
                </View>
              )}
              <Button label="Continue" onPress={next} disabled={!firstName || !lastName || !docType} />
            </View>
          )}

          {/* ── Step 3: Residency ── */}
          {step === 3 && (
            <View style={styles.stepContent}>
              <TouchableOpacity onPress={back} style={styles.backBtn}>
                <Ionicons name="arrow-back" size={18} color={Colors.textSecondary} />
                <Text style={styles.backText}>Back</Text>
              </TouchableOpacity>
              <Text style={styles.title}>Mobility profile</Text>
              <Text style={styles.subtitle}>Help us understand your financial footprint.</Text>

              <Text style={styles.sectionLabel}>Nationality</Text>
              <View style={styles.countryGrid}>
                {COUNTRIES.slice(0, 6).map((c) => (
                  <TouchableOpacity
                    key={c}
                    onPress={() => setNationality(c)}
                    style={[styles.countryChip, nationality === c && styles.countryChipActive]}
                  >
                    <Text style={[styles.countryChipText, nationality === c && { color: Colors.primary }]}>{c}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              <Text style={[styles.sectionLabel, { marginTop: Spacing.base }]}>Country of residence</Text>
              <View style={styles.countryGrid}>
                {COUNTRIES.slice(0, 6).map((c) => (
                  <TouchableOpacity
                    key={c}
                    onPress={() => setResidence(c)}
                    style={[styles.countryChip, residence === c && styles.countryChipActive]}
                  >
                    <Text style={[styles.countryChipText, residence === c && { color: Colors.primary }]}>{c}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              <Button
                label="Continue"
                onPress={next}
                disabled={!nationality || !residence}
                style={{ marginTop: Spacing.lg }}
              />
            </View>
          )}

          {/* ── Step 4: Income ── */}
          {step === 4 && (
            <View style={styles.stepContent}>
              <TouchableOpacity onPress={back} style={styles.backBtn}>
                <Ionicons name="arrow-back" size={18} color={Colors.textSecondary} />
                <Text style={styles.backText}>Back</Text>
              </TouchableOpacity>
              <Text style={styles.title}>Income sources</Text>
              <Text style={styles.subtitle}>How do you primarily earn money?</Text>
              <View style={styles.incomeGrid}>
                {INCOME_SOURCES.map((src) => (
                  <TouchableOpacity
                    key={src.id}
                    onPress={() => setIncomeSource(src.id)}
                    style={[styles.incomeCard, incomeSource === src.id && styles.incomeCardActive]}
                  >
                    <Text style={styles.incomeIcon}>{src.icon}</Text>
                    <Text style={[styles.incomeLabel, incomeSource === src.id && { color: Colors.primary }]}>{src.label}</Text>
                  </TouchableOpacity>
                ))}
              </View>
              <Button label="Continue" onPress={next} disabled={!incomeSource} />
            </View>
          )}

          {/* ── Step 5: Welcome ── */}
          {step === 5 && (
            <View style={[styles.stepContent, styles.welcomeContent]}>
              <View style={styles.welcomeEmoji}>
                <Text style={{ fontSize: 48 }}>🎉</Text>
              </View>
              <Text style={[styles.title, { textAlign: 'center' }]}>You're all set!</Text>
              <Text style={[styles.subtitle, { textAlign: 'center' }]}>
                Welcome to Awake, {firstName || 'Alex'}. Your account is ready.
              </Text>
              <View style={styles.featuresRow}>
                {[
                  { icon: '⚡', label: 'Instant transfers', sub: 'Send globally' },
                  { icon: '🌍', label: 'Multi-currency', sub: 'USD, EUR, BTC' },
                  { icon: '📈', label: 'Smart savings', sub: '4.8% APY' },
                ].map((f) => (
                  <View key={f.label} style={styles.featureCard}>
                    <Text style={styles.featureIcon}>{f.icon}</Text>
                    <Text style={styles.featureLabel}>{f.label}</Text>
                    <Text style={styles.featureSub}>{f.sub}</Text>
                  </View>
                ))}
              </View>
              <View style={styles.securityRow}>
                <Ionicons name="shield-checkmark" size={14} color={Colors.success} />
                <Text style={styles.securityText}>Verified account · Fraud protection enabled</Text>
              </View>
              <Button label="Enter Awake" onPress={() => router.replace('/(tabs)')} />
              <Text style={styles.prototype}>Prototype · Not a real financial product</Text>
            </View>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  scroll: { flex: 1 },
  content: { padding: Spacing.base, paddingBottom: Spacing.xxl },

  logo: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, marginBottom: Spacing.xl, marginTop: Spacing.base },
  logoIcon: { width: 36, height: 36, borderRadius: Radius.md, backgroundColor: Colors.primary, alignItems: 'center', justifyContent: 'center' },
  logoLetter: { color: Colors.textInverse, fontWeight: '700', fontSize: 18 },
  logoText: { fontSize: 20, fontWeight: '700', color: Colors.textPrimary },

  progressSection: { marginBottom: Spacing.xl },
  stepsRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: Spacing.sm },
  stepItem: { alignItems: 'center', gap: 4 },
  stepDot: { width: 28, height: 28, borderRadius: Radius.full, backgroundColor: Colors.surface, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: Colors.border },
  stepDotDone: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  stepDotActive: { borderColor: Colors.primary, backgroundColor: Colors.primaryLight },
  stepNum: { fontSize: 11, fontWeight: '600', color: Colors.textSecondary },
  stepLabel: { fontSize: 10, color: Colors.textSecondary, fontWeight: '500' },
  progressTrack: { height: 4, backgroundColor: Colors.surface, borderRadius: Radius.full, overflow: 'hidden' },
  progressFill: { height: 4, backgroundColor: Colors.primary, borderRadius: Radius.full },

  stepContent: { gap: Spacing.base },
  title: { ...Typography.headline, fontSize: 24 },
  subtitle: { ...Typography.secondary },
  form: { gap: Spacing.sm },
  sectionLabel: { ...Typography.caption, textTransform: 'uppercase', letterSpacing: 0.5, color: Colors.textSecondary },

  backBtn: { flexDirection: 'row', alignItems: 'center', gap: Spacing.xs },
  backText: { ...Typography.secondary, color: Colors.textSecondary },

  trustBadge: { flexDirection: 'row', alignItems: 'center', gap: Spacing.xs, backgroundColor: Colors.successLight, padding: Spacing.sm, borderRadius: Radius.md },
  trustText: { ...Typography.caption, color: Colors.success, flex: 1 },

  docRow: { flexDirection: 'row', gap: Spacing.sm },
  docCard: { flex: 1, padding: Spacing.base, borderRadius: Radius.md, borderWidth: 1.5, borderColor: Colors.border, backgroundColor: Colors.surface, alignItems: 'center', gap: Spacing.xs },
  docCardActive: { borderColor: Colors.primary, backgroundColor: Colors.primaryLight },
  docIcon: { fontSize: 28 },
  docLabel: { ...Typography.secondary, fontWeight: '600', color: Colors.textPrimary },

  uploadBox: { borderWidth: 1.5, borderStyle: 'dashed', borderColor: Colors.border, borderRadius: Radius.md, padding: Spacing.lg, alignItems: 'center', gap: Spacing.xs },
  uploadText: { ...Typography.body, fontWeight: '500' },
  uploadSub: { ...Typography.caption },

  countryGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.xs },
  countryChip: { paddingHorizontal: Spacing.sm, paddingVertical: 6, borderRadius: Radius.full, backgroundColor: Colors.surface, borderWidth: 1, borderColor: Colors.border },
  countryChipActive: { borderColor: Colors.primary, backgroundColor: Colors.primaryLight },
  countryChipText: { ...Typography.caption, fontWeight: '600', color: Colors.textPrimary },

  incomeGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm },
  incomeCard: { width: '47%', padding: Spacing.md, borderRadius: Radius.md, borderWidth: 1.5, borderColor: Colors.border, backgroundColor: Colors.surface, gap: Spacing.xs },
  incomeCardActive: { borderColor: Colors.primary, backgroundColor: Colors.primaryLight },
  incomeIcon: { fontSize: 24 },
  incomeLabel: { ...Typography.secondary, fontWeight: '600', color: Colors.textPrimary },

  welcomeContent: { alignItems: 'center' },
  welcomeEmoji: { width: 80, height: 80, borderRadius: Radius.full, backgroundColor: Colors.primaryLight, alignItems: 'center', justifyContent: 'center' },
  featuresRow: { flexDirection: 'row', gap: Spacing.sm, width: '100%' },
  featureCard: { flex: 1, padding: Spacing.sm, borderRadius: Radius.md, backgroundColor: Colors.surface, alignItems: 'center', gap: 2 },
  featureIcon: { fontSize: 20 },
  featureLabel: { ...Typography.caption, fontWeight: '600', color: Colors.textPrimary, textAlign: 'center' },
  featureSub: { fontSize: 10, color: Colors.textSecondary, textAlign: 'center' },
  securityRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.xs, backgroundColor: Colors.successLight, paddingHorizontal: Spacing.sm, paddingVertical: Spacing.xs, borderRadius: Radius.full },
  securityText: { ...Typography.caption, color: Colors.success },
  prototype: { ...Typography.caption, color: Colors.textDisabled, textAlign: 'center', marginTop: Spacing.sm },
})
