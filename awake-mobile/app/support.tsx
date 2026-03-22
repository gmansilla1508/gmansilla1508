import React, { useState, useRef } from 'react'
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, FlatList, SafeAreaView, KeyboardAvoidingView, Platform } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { Card } from '@/components/ui'
import { mockSupportCategories, mockSupportFaqs } from '@/lib/mock-data'
import { Colors, Spacing, Radius, Typography } from '@/lib/tokens'

type Tab = 'center' | 'chat'
type ChatMsg = { id: string; from: 'user' | 'bot'; text: string }

const BOT_RESPONSES: [RegExp, string][] = [
  [/transfer|send|payment/i, 'Transfers between Awake accounts are instant and free. Bank transfers take 1–2 business days via SEPA.'],
  [/card|freeze|block|lost/i, 'If your card is blocked, go to Card > Freeze/Unfreeze. For lost cards, tap "Report Lost" in the Card section.'],
  [/kyc|verify|identity|document/i, 'KYC verification takes less than 5 minutes. You need a passport or national ID and a selfie.'],
  [/deposit|top.?up|withdraw/i, 'Top up via bank transfer (SEPA/SWIFT) or crypto. Go to Receive to get your account details.'],
  [/security|suspicious|hack|fraud/i, 'If you notice suspicious activity, freeze your card immediately and message us. We\'ll investigate within minutes.'],
]

function getBot(msg: string): string {
  for (const [re, response] of BOT_RESPONSES) {
    if (re.test(msg)) return response
  }
  return "Thanks for reaching out! A support agent will be with you within 2 minutes. Is there anything else I can help you with?"
}

export default function SupportScreen() {
  const [activeTab, setActiveTab] = useState<Tab>('center')
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null)
  const [chatInput, setChatInput] = useState('')
  const [messages, setMessages] = useState<ChatMsg[]>([
    { id: '0', from: 'bot', text: "Hi! I'm the Awake assistant. How can I help you today?" },
  ])
  const flatRef = useRef<FlatList>(null)

  function sendMessage() {
    if (!chatInput.trim()) return
    const userMsg: ChatMsg = { id: Date.now().toString(), from: 'user', text: chatInput }
    const botMsg: ChatMsg = { id: (Date.now() + 1).toString(), from: 'bot', text: getBot(chatInput) }
    setMessages((prev) => [...prev, userMsg, botMsg])
    setChatInput('')
    setTimeout(() => flatRef.current?.scrollToEnd({ animated: true }), 100)
  }

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>

        {/* Tab bar */}
        <View style={styles.tabBar}>
          {[{ id: 'center' as Tab, label: 'Support Center' }, { id: 'chat' as Tab, label: 'Live Chat' }].map((t) => (
            <TouchableOpacity
              key={t.id}
              onPress={() => setActiveTab(t.id)}
              style={[styles.tab, activeTab === t.id && styles.tabActive]}
            >
              <Text style={[styles.tabText, activeTab === t.id && styles.tabTextActive]}>{t.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {activeTab === 'center' && (
          <ScrollView style={styles.scroll} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

            {/* Status banner */}
            <Card>
              <View style={styles.statusRow}>
                <View style={styles.statusLeft}>
                  <Text style={styles.statusTitle}>Awake Support</Text>
                  <Text style={styles.statusSub}>24/7 · Avg. response 2 min</Text>
                </View>
                <View style={styles.onlineChip}>
                  <View style={styles.onlineDot} />
                  <Text style={styles.onlineText}>Online</Text>
                </View>
              </View>
            </Card>

            {/* Contact options */}
            <View style={styles.contactGrid}>
              {[
                { label: 'Live Chat', icon: 'chatbubble-outline' as const, color: Colors.primary, action: () => setActiveTab('chat') },
                { label: 'Message', icon: 'mail-outline' as const, color: '#7C3AED', action: () => {} },
                { label: 'Emergency', icon: 'call-outline' as const, color: Colors.error, action: () => {} },
                { label: 'Email', icon: 'send-outline' as const, color: Colors.success, action: () => {} },
              ].map((c) => (
                <TouchableOpacity key={c.label} style={styles.contactCard} onPress={c.action} activeOpacity={0.7}>
                  <View style={[styles.contactIcon, { backgroundColor: `${c.color}15` }]}>
                    <Ionicons name={c.icon} size={22} color={c.color} />
                  </View>
                  <Text style={styles.contactLabel}>{c.label}</Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Help categories */}
            <Text style={styles.sectionTitle}>How can we help you?</Text>
            <Card padding={0} style={styles.categoriesCard}>
              {mockSupportCategories.map((cat, i) => (
                <TouchableOpacity
                  key={cat.id}
                  style={[styles.categoryRow, i < mockSupportCategories.length - 1 && styles.categoryBorder]}
                  onPress={() => setActiveTab('chat')}
                  activeOpacity={0.7}
                >
                  <Text style={styles.categoryIcon}>{cat.icon}</Text>
                  <View style={styles.categoryInfo}>
                    <Text style={styles.categoryLabel}>{cat.label}</Text>
                    <Text style={styles.categoryDesc}>{cat.description}</Text>
                  </View>
                  <Ionicons name="chevron-forward" size={16} color={Colors.textSecondary} />
                </TouchableOpacity>
              ))}
            </Card>

            {/* FAQ */}
            <Text style={styles.sectionTitle}>FAQ</Text>
            <View style={styles.faqList}>
              {mockSupportFaqs.map((faq, i) => (
                <TouchableOpacity
                  key={i}
                  style={styles.faqItem}
                  onPress={() => setExpandedFaq(expandedFaq === i ? null : i)}
                  activeOpacity={0.7}
                >
                  <View style={styles.faqQuestion}>
                    <Text style={styles.faqQ}>{faq.q}</Text>
                    <Ionicons name={expandedFaq === i ? 'chevron-up' : 'chevron-down'} size={16} color={expandedFaq === i ? Colors.primary : Colors.textSecondary} />
                  </View>
                  {expandedFaq === i && <Text style={styles.faqA}>{faq.a}</Text>}
                </TouchableOpacity>
              ))}
            </View>

          </ScrollView>
        )}

        {activeTab === 'chat' && (
          <View style={styles.chatContainer}>
            {/* Chat header */}
            <View style={styles.chatHeader}>
              <View style={styles.botAvatar}>
                <Ionicons name="headset" size={20} color={Colors.primary} />
              </View>
              <View>
                <Text style={styles.botName}>Awake Assistant</Text>
                <View style={styles.onlineSmall}>
                  <View style={[styles.onlineDot, { width: 6, height: 6 }]} />
                  <Text style={styles.onlineSmallText}>Online · replies in seconds</Text>
                </View>
              </View>
            </View>

            {/* Messages */}
            <FlatList
              ref={flatRef}
              data={messages}
              keyExtractor={(m) => m.id}
              contentContainerStyle={styles.chatMessages}
              renderItem={({ item: msg }) => (
                <View style={[styles.bubble, msg.from === 'user' ? styles.bubbleUser : styles.bubbleBot]}>
                  <Text style={[styles.bubbleText, msg.from === 'user' && { color: Colors.textInverse }]}>{msg.text}</Text>
                </View>
              )}
            />

            {/* Input */}
            <View style={styles.chatInput}>
              <TextInput
                placeholder="Type your message…"
                value={chatInput}
                onChangeText={setChatInput}
                onSubmitEditing={sendMessage}
                returnKeyType="send"
                style={styles.chatTextInput}
                placeholderTextColor={Colors.textDisabled}
              />
              <TouchableOpacity onPress={sendMessage} style={[styles.sendBtn, !chatInput.trim() && { opacity: 0.4 }]} disabled={!chatInput.trim()}>
                <Ionicons name="send" size={18} color={Colors.textInverse} />
              </TouchableOpacity>
            </View>
          </View>
        )}

      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  tabBar: { flexDirection: 'row', paddingHorizontal: Spacing.base, paddingTop: Spacing.sm, gap: Spacing.xs },
  tab: { flex: 1, height: 40, alignItems: 'center', justifyContent: 'center', borderRadius: Radius.md, backgroundColor: Colors.surface, borderWidth: 1, borderColor: Colors.border },
  tabActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  tabText: { ...Typography.secondary, fontWeight: '600', color: Colors.textSecondary },
  tabTextActive: { color: Colors.textInverse },

  scroll: { flex: 1 },
  content: { padding: Spacing.base, paddingBottom: Spacing.xxl, gap: Spacing.base },

  statusRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  statusLeft: {},
  statusTitle: { ...Typography.bodyMedium, fontWeight: '600' },
  statusSub: { ...Typography.caption, marginTop: 2 },
  onlineChip: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: Colors.successLight, paddingHorizontal: Spacing.sm, paddingVertical: 4, borderRadius: Radius.full },
  onlineDot: { width: 8, height: 8, borderRadius: Radius.full, backgroundColor: Colors.success },
  onlineText: { ...Typography.caption, color: Colors.success, fontWeight: '600' },

  contactGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm },
  contactCard: { width: '47%', padding: Spacing.base, borderRadius: Radius.lg, borderWidth: 1, borderColor: Colors.border, alignItems: 'center', gap: Spacing.xs },
  contactIcon: { width: 44, height: 44, borderRadius: Radius.md, alignItems: 'center', justifyContent: 'center' },
  contactLabel: { ...Typography.secondary, fontWeight: '600', color: Colors.textPrimary },

  sectionTitle: { ...Typography.bodyMedium, fontWeight: '600' },
  categoriesCard: { overflow: 'hidden' },
  categoryRow: { flexDirection: 'row', alignItems: 'center', padding: Spacing.base, gap: Spacing.sm },
  categoryBorder: { borderBottomWidth: 1, borderBottomColor: Colors.borderLight },
  categoryIcon: { fontSize: 24, width: 32 },
  categoryInfo: { flex: 1 },
  categoryLabel: { ...Typography.secondary, fontWeight: '600', color: Colors.textPrimary },
  categoryDesc: { ...Typography.caption, marginTop: 1 },

  faqList: { gap: Spacing.xs },
  faqItem: { borderRadius: Radius.md, borderWidth: 1, borderColor: Colors.border, overflow: 'hidden' },
  faqQuestion: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: Spacing.base, gap: Spacing.sm },
  faqQ: { ...Typography.secondary, fontWeight: '500', color: Colors.textPrimary, flex: 1 },
  faqA: { ...Typography.secondary, color: Colors.textSecondary, padding: Spacing.base, paddingTop: 0 },

  chatContainer: { flex: 1 },
  chatHeader: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, padding: Spacing.base, borderBottomWidth: 1, borderBottomColor: Colors.border },
  botAvatar: { width: 40, height: 40, borderRadius: Radius.full, backgroundColor: Colors.primaryLight, alignItems: 'center', justifyContent: 'center' },
  botName: { ...Typography.secondary, fontWeight: '600', color: Colors.textPrimary },
  onlineSmall: { flexDirection: 'row', alignItems: 'center', gap: 3, marginTop: 2 },
  onlineSmallText: { fontSize: 11, color: Colors.success },

  chatMessages: { padding: Spacing.base, gap: Spacing.sm, paddingBottom: Spacing.base },
  bubble: { maxWidth: '80%', padding: Spacing.sm, borderRadius: Radius.lg },
  bubbleUser: { backgroundColor: Colors.primary, alignSelf: 'flex-end', borderBottomRightRadius: 4 },
  bubbleBot: { backgroundColor: Colors.surface, alignSelf: 'flex-start', borderBottomLeftRadius: 4, borderWidth: 1, borderColor: Colors.border },
  bubbleText: { ...Typography.secondary, color: Colors.textPrimary, lineHeight: 20 },

  chatInput: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, padding: Spacing.sm, borderTopWidth: 1, borderTopColor: Colors.border },
  chatTextInput: { flex: 1, height: 44, borderRadius: Radius.full, borderWidth: 1, borderColor: Colors.border, backgroundColor: Colors.surface, paddingHorizontal: Spacing.base, ...Typography.secondary, color: Colors.textPrimary },
  sendBtn: { width: 44, height: 44, borderRadius: Radius.full, backgroundColor: Colors.primary, alignItems: 'center', justifyContent: 'center' },
})
