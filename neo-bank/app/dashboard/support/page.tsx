'use client'

import { useState } from 'react'
import { mockSupportCategories, mockSupportFaqs } from '@/lib/mock-data'
import { MessageCircle, Mail, Phone, ChevronDown, ChevronUp, Send, Bot } from 'lucide-react'
import { cn } from '@/lib/utils'

type ChatMsg = { from: 'user' | 'bot'; text: string }

const BOT_RESPONSES: Record<string, string> = {
  transfer: "Transfers between Awake accounts are instant and free. Bank transfers take 1–2 business days via SEPA.",
  card: "If your card is blocked, go to Card > Freeze/Unfreeze. For lost cards, tap 'Report Lost' in the Card section.",
  kyc: "KYC verification usually takes less than 5 minutes. You'll need a passport or national ID and a selfie.",
  deposit: "You can top up via bank transfer (SEPA/SWIFT) or crypto. Go to Receive to get your account details.",
  security: "If you notice suspicious activity, freeze your card immediately and contact us via Live Chat.",
}

function getBot(msg: string): string {
  const lower = msg.toLowerCase()
  if (lower.includes('transfer') || lower.includes('send') || lower.includes('payment')) return BOT_RESPONSES.transfer
  if (lower.includes('card') || lower.includes('block') || lower.includes('freeze')) return BOT_RESPONSES.card
  if (lower.includes('kyc') || lower.includes('verify') || lower.includes('id') || lower.includes('identity')) return BOT_RESPONSES.kyc
  if (lower.includes('deposit') || lower.includes('top') || lower.includes('withdraw')) return BOT_RESPONSES.deposit
  if (lower.includes('security') || lower.includes('suspicious') || lower.includes('hack')) return BOT_RESPONSES.security
  return "Thanks for reaching out! Our support team will respond within 2 minutes. Is there anything else I can help you with?"
}

export default function SupportPage() {
  const [activeTab, setActiveTab] = useState<'center' | 'chat'>('center')
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null)
  const [chatInput, setChatInput] = useState('')
  const [messages, setMessages] = useState<ChatMsg[]>([
    { from: 'bot', text: "Hi! I'm the Awake support assistant. How can I help you today?" },
  ])

  function sendMessage() {
    if (!chatInput.trim()) return
    const userMsg: ChatMsg = { from: 'user', text: chatInput }
    const botMsg: ChatMsg = { from: 'bot', text: getBot(chatInput) }
    setMessages((prev) => [...prev, userMsg, botMsg])
    setChatInput('')
  }

  return (
    <div className="p-8 max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="glass rounded-2xl p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-semibold text-white">Awake Support</h1>
            <p className="text-white/40 text-sm mt-0.5">24/7 support available</p>
          </div>
          <div className="text-right">
            <div className="flex items-center gap-1.5 justify-end">
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-emerald-400 text-xs font-medium">Online</span>
            </div>
            <p className="text-white/30 text-xs mt-0.5">Avg. response: 2 min</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2">
          {[
            { id: 'center' as const, label: 'Support Center' },
            { id: 'chat' as const, label: 'Live Chat' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                'px-4 py-2 rounded-xl text-sm font-medium transition-all',
                activeTab === tab.id
                  ? 'bg-violet-600 text-white'
                  : 'bg-white/5 text-white/50 hover:text-white/80'
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {activeTab === 'center' && (
        <>
          {/* Quick contact options */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { label: 'Live Chat', icon: MessageCircle, color: 'text-violet-400', bg: 'bg-violet-400/10', action: () => setActiveTab('chat') },
              { label: 'Message', icon: Mail, color: 'text-blue-400', bg: 'bg-blue-400/10', action: () => {} },
              { label: 'Emergency Card', icon: Phone, color: 'text-red-400', bg: 'bg-red-400/10', action: () => {} },
              { label: 'Email', icon: Send, color: 'text-emerald-400', bg: 'bg-emerald-400/10', action: () => {} },
            ].map((opt) => {
              const Icon = opt.icon
              return (
                <button
                  key={opt.label}
                  onClick={opt.action}
                  className="glass glass-hover rounded-xl p-4 flex flex-col items-center gap-2.5 transition-all"
                >
                  <div className={`w-10 h-10 rounded-xl ${opt.bg} flex items-center justify-center`}>
                    <Icon size={18} className={opt.color} />
                  </div>
                  <span className="text-white/60 text-xs font-medium">{opt.label}</span>
                </button>
              )
            })}
          </div>

          {/* Help categories */}
          <div className="glass rounded-2xl p-5">
            <h2 className="text-white font-semibold mb-4">How can we help you?</h2>
            <div className="space-y-2">
              {mockSupportCategories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setActiveTab('chat')}
                  className="w-full glass glass-hover rounded-xl p-4 flex items-center gap-4 text-left transition-all"
                >
                  <div className="text-2xl w-9 text-center shrink-0">{cat.icon}</div>
                  <div className="flex-1">
                    <p className="text-white font-medium text-sm">{cat.label}</p>
                    <p className="text-white/40 text-xs">{cat.description}</p>
                  </div>
                  <ChevronDown size={14} className="text-white/20 -rotate-90" />
                </button>
              ))}
            </div>
          </div>

          {/* FAQ */}
          <div className="glass rounded-2xl p-5">
            <h2 className="text-white font-semibold mb-4">Frequently Asked Questions</h2>
            <div className="space-y-2">
              {mockSupportFaqs.map((faq, i) => (
                <div key={i} className="border border-white/5 rounded-xl overflow-hidden">
                  <button
                    onClick={() => setExpandedFaq(expandedFaq === i ? null : i)}
                    className="w-full flex items-center justify-between p-4 text-left hover:bg-white/5 transition-colors"
                  >
                    <span className="text-white/80 text-sm font-medium pr-4">{faq.q}</span>
                    {expandedFaq === i
                      ? <ChevronUp size={14} className="text-violet-400 shrink-0" />
                      : <ChevronDown size={14} className="text-white/20 shrink-0" />}
                  </button>
                  {expandedFaq === i && (
                    <div className="px-4 pb-4 text-white/50 text-sm border-t border-white/5 pt-3">
                      {faq.a}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {activeTab === 'chat' && (
        <div className="glass rounded-2xl overflow-hidden flex flex-col" style={{ height: '520px' }}>
          {/* Chat header */}
          <div className="p-4 border-b border-white/5 flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-violet-600/30 flex items-center justify-center">
              <Bot size={18} className="text-violet-400" />
            </div>
            <div>
              <p className="text-white font-medium text-sm">Awake Assistant</p>
              <div className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <p className="text-white/40 text-xs">Online · Typically replies in seconds</p>
              </div>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.map((msg, i) => (
              <div key={i} className={cn('flex', msg.from === 'user' ? 'justify-end' : 'justify-start')}>
                <div
                  className={cn(
                    'max-w-xs px-4 py-2.5 rounded-2xl text-sm',
                    msg.from === 'user'
                      ? 'bg-violet-600 text-white rounded-br-md'
                      : 'glass text-white/80 rounded-bl-md'
                  )}
                >
                  {msg.text}
                </div>
              </div>
            ))}
          </div>

          {/* Input */}
          <div className="p-4 border-t border-white/5 flex gap-2">
            <input
              type="text"
              placeholder="Type your message…"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
              className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm placeholder-white/20 outline-none focus:border-violet-500/50 transition-colors"
            />
            <button
              onClick={sendMessage}
              disabled={!chatInput.trim()}
              className="w-10 h-10 rounded-xl bg-violet-600 hover:bg-violet-500 disabled:opacity-30 flex items-center justify-center transition-colors"
            >
              <Send size={14} className="text-white" />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
