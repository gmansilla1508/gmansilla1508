import React from 'react'
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView } from 'react-native'
import { router } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import { Card, Badge } from '@/components/ui'
import { mockUser } from '@/lib/mock-data'
import { Colors, Spacing, Radius, Typography } from '@/lib/tokens'

type IoniconName = React.ComponentProps<typeof Ionicons>['name']

const MENU_ITEMS: Array<{
  label: string
  icon: IoniconName
  route: string
  badge?: string
}> = [
  { label: 'My Card', icon: 'card-outline', route: '/card' },
  { label: 'Transactions', icon: 'time-outline', route: '/transactions' },
  { label: 'Savings', icon: 'save-outline', route: '/savings' },
  { label: 'Support Center', icon: 'headset-outline', route: '/support' },
]

function MenuItem({ label, icon, route, badge }: { label: string; icon: IoniconName; route: string; badge?: string }) {
  return (
    <TouchableOpacity style={styles.menuItem} onPress={() => router.push(route as any)} activeOpacity={0.7}>
      <View style={styles.menuIcon}>
        <Ionicons name={icon} size={20} color={Colors.textPrimary} />
      </View>
      <Text style={styles.menuLabel}>{label}</Text>
      {badge && <Badge label={badge} variant="primary" />}
      <Ionicons name="chevron-forward" size={16} color={Colors.textSecondary} style={{ marginLeft: 'auto' }} />
    </TouchableOpacity>
  )
}

export default function ProfileScreen() {
  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.screenTitle}>Profile</Text>

        {/* User card */}
        <Card>
          <View style={styles.userRow}>
            <View style={styles.avatarCircle}>
              <Text style={styles.avatarText}>{mockUser.avatar}</Text>
            </View>
            <View style={styles.userInfo}>
              <Text style={styles.userName}>{mockUser.name}</Text>
              <Text style={styles.userEmail}>{mockUser.email}</Text>
            </View>
            <Badge label="Verified" variant="success" />
          </View>

          <View style={styles.userDetails}>
            {[
              { label: 'Nationality', value: mockUser.nationality },
              { label: 'Residence', value: mockUser.residence },
              { label: 'Tax residency', value: mockUser.taxResidency },
              { label: 'Income', value: mockUser.incomeSource },
              { label: 'Member since', value: mockUser.memberSince },
            ].map((row) => (
              <View key={row.label} style={styles.detailRow}>
                <Text style={styles.detailLabel}>{row.label}</Text>
                <Text style={styles.detailValue}>{row.value}</Text>
              </View>
            ))}
          </View>
        </Card>

        {/* Security indicator */}
        <View style={styles.securityBanner}>
          <Ionicons name="shield-checkmark" size={16} color={Colors.success} />
          <Text style={styles.securityText}>Fraud protection enabled · 2FA active</Text>
        </View>

        {/* Menu */}
        <Card padding={0} style={styles.menuCard}>
          {MENU_ITEMS.map((item, i) => (
            <View key={item.label}>
              <MenuItem {...item} />
              {i < MENU_ITEMS.length - 1 && <View style={styles.divider} />}
            </View>
          ))}
        </Card>

        {/* Account info */}
        <Card>
          <Text style={styles.sectionLabel}>Account</Text>
          <View style={styles.infoGrid}>
            {[
              { label: 'KYC Status', value: 'Verified', color: Colors.success },
              { label: 'Account type', value: 'Premium' },
              { label: 'Phone', value: mockUser.phone },
            ].map((row) => (
              <View key={row.label} style={styles.infoRow}>
                <Text style={styles.infoLabel}>{row.label}</Text>
                <Text style={[styles.infoValue, row.color ? { color: row.color } : {}]}>{row.value}</Text>
              </View>
            ))}
          </View>
        </Card>

        {/* Sign out */}
        <TouchableOpacity
          style={styles.signOut}
          onPress={() => router.replace('/onboarding')}
          activeOpacity={0.7}
        >
          <Ionicons name="log-out-outline" size={18} color={Colors.textSecondary} />
          <Text style={styles.signOutText}>Sign out</Text>
        </TouchableOpacity>

        <Text style={styles.prototype}>Prototype · Not a real financial product</Text>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  scroll: { flex: 1 },
  content: { padding: Spacing.base, paddingBottom: Spacing.xxl, gap: Spacing.base },
  screenTitle: { ...Typography.sectionTitle },

  userRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, marginBottom: Spacing.base },
  avatarCircle: { width: 52, height: 52, borderRadius: Radius.full, backgroundColor: Colors.primary, alignItems: 'center', justifyContent: 'center' },
  avatarText: { color: Colors.textInverse, fontWeight: '700', fontSize: 18 },
  userInfo: { flex: 1 },
  userName: { ...Typography.bodyMedium, fontWeight: '600' },
  userEmail: { ...Typography.caption, marginTop: 2 },

  userDetails: { borderTopWidth: 1, borderTopColor: Colors.borderLight, paddingTop: Spacing.base, gap: Spacing.sm },
  detailRow: { flexDirection: 'row', justifyContent: 'space-between' },
  detailLabel: { ...Typography.secondary },
  detailValue: { ...Typography.secondary, color: Colors.textPrimary, fontWeight: '500' },

  securityBanner: { flexDirection: 'row', alignItems: 'center', gap: Spacing.xs, backgroundColor: Colors.successLight, padding: Spacing.sm, borderRadius: Radius.md },
  securityText: { ...Typography.caption, color: Colors.success },

  menuCard: { overflow: 'hidden' },
  menuItem: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, padding: Spacing.base },
  menuIcon: { width: 36, height: 36, borderRadius: Radius.md, backgroundColor: Colors.surface, alignItems: 'center', justifyContent: 'center' },
  menuLabel: { ...Typography.body, fontWeight: '500', flex: 1 },
  divider: { height: 1, backgroundColor: Colors.borderLight, marginLeft: Spacing.base + 36 + Spacing.sm },

  sectionLabel: { ...Typography.caption, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: Spacing.sm },
  infoGrid: { gap: Spacing.sm },
  infoRow: { flexDirection: 'row', justifyContent: 'space-between' },
  infoLabel: { ...Typography.secondary },
  infoValue: { ...Typography.secondary, color: Colors.textPrimary, fontWeight: '500' },

  signOut: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: Spacing.xs, padding: Spacing.base },
  signOutText: { ...Typography.body, color: Colors.textSecondary },
  prototype: { ...Typography.caption, color: Colors.textDisabled, textAlign: 'center' },
})
