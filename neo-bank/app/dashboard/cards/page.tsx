'use client'

import { useState } from 'react'
import { mockCards, mockTransactions, type Card, type CurrencyCode } from '@/lib/mock-data'
import { formatDate } from '@/lib/utils'
import { cn } from '@/lib/utils'
import { Snowflake, Flame, Smartphone, Globe, Sliders, AlertTriangle, Eye, EyeOff } from 'lucide-react'

const SPENDING_SOURCES: CurrencyCode[] = ['USD', 'EUR', 'USDC', 'USDT', 'BTC']

export default function CardsPage() {
  const [cards, setCards] = useState<Card[]>(mockCards)
  const [selectedId, setSelectedId] = useState(mockCards[0].id)
  const [showCvv, setShowCvv] = useState(false)
  const [editingSource, setEditingSource] = useState(false)

  const selected = cards.find((c) => c.id === selectedId) ?? cards[0]
  const cardTx = mockTransactions.filter((t) => t.category === 'Card').slice(0, 5)

  function toggleFreeze() {
    setCards((prev) =>
      prev.map((c) =>
        c.id === selectedId ? { ...c, status: c.status === 'active' ? 'frozen' : 'active' } : c
      )
    )
  }

  function setSpendingSource(src: CurrencyCode) {
    setCards((prev) =>
      prev.map((c) => c.id === selectedId ? { ...c, spending_source: src } : c)
    )
    setEditingSource(false)
  }

  const spendingPct = Math.round((selected.monthly_spending / selected.monthly_limit) * 100)

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-semibold text-white">Card</h1>
        <p className="text-white/40 text-sm mt-1">{cards.length} cards · Premium Debit</p>
      </div>

      {/* Card Selector */}
      <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-2">
        {cards.map((card) => (
          <button
            key={card.id}
            onClick={() => setSelectedId(card.id)}
            className={cn(
              'relative shrink-0 w-72 h-44 rounded-2xl p-5 text-left transition-all overflow-hidden',
              `bg-gradient-to-br ${card.color}`,
              selectedId === card.id ? 'ring-2 ring-white/30 scale-[1.02] shadow-xl' : 'opacity-60 hover:opacity-80'
            )}
          >
            {card.status === 'frozen' && (
              <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center rounded-2xl z-10">
                <div className="text-center">
                  <Snowflake size={28} className="text-blue-300 mx-auto mb-1" />
                  <span className="text-white/80 font-semibold text-sm">Frozen</span>
                </div>
              </div>
            )}
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
            <div className="relative z-0 flex flex-col h-full">
              <div className="flex justify-between items-start mb-auto">
                <span className="text-white/70 text-xs capitalize font-medium">{card.card_type} · {card.network}</span>
                <Globe size={14} className="text-white/50" />
              </div>
              <div>
                <p className="text-white/80 font-mono text-sm tracking-widest mb-3">{card.card_number}</p>
                <div className="flex justify-between items-end">
                  <div>
                    <p className="text-white/40 text-[10px]">CARD HOLDER</p>
                    <p className="text-white font-medium text-sm">{card.card_holder}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-white/40 text-[10px]">EXPIRES</p>
                    <p className="text-white font-mono text-sm">{card.expiry}</p>
                  </div>
                </div>
              </div>
            </div>
          </button>
        ))}

        <button className="shrink-0 w-72 h-44 rounded-2xl border-2 border-dashed border-white/10 flex flex-col items-center justify-center gap-2 text-white/30 hover:text-white/60 hover:border-white/20 transition-all">
          <span className="text-3xl">+</span>
          <span className="text-sm">Add new card</span>
        </button>
      </div>

      {/* Card actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          {
            label: selected.status === 'active' ? 'Freeze Card' : 'Unfreeze Card',
            icon: selected.status === 'active' ? Snowflake : Flame,
            action: toggleFreeze,
            color: selected.status === 'active' ? 'text-blue-400' : 'text-orange-400',
            bg: selected.status === 'active' ? 'bg-blue-400/10' : 'bg-orange-400/10',
          },
          {
            label: 'Apple / Google Pay',
            icon: Smartphone,
            action: () => {},
            color: 'text-violet-400',
            bg: 'bg-violet-400/10',
          },
          {
            label: 'Spending source',
            icon: Sliders,
            action: () => setEditingSource(!editingSource),
            color: 'text-amber-400',
            bg: 'bg-amber-400/10',
          },
          {
            label: 'Report Lost',
            icon: AlertTriangle,
            action: () => {},
            color: 'text-red-400',
            bg: 'bg-red-400/10',
          },
        ].map((action) => {
          const Icon = action.icon
          return (
            <button
              key={action.label}
              onClick={action.action}
              className="glass glass-hover rounded-xl p-4 flex flex-col items-center gap-2 transition-all"
            >
              <div className={`w-9 h-9 rounded-lg ${action.bg} flex items-center justify-center`}>
                <Icon size={16} className={action.color} />
              </div>
              <span className={`text-xs font-medium ${action.color}`}>{action.label}</span>
            </button>
          )
        })}
      </div>

      {/* Spending source picker */}
      {editingSource && (
        <div className="glass rounded-2xl p-5 space-y-3">
          <p className="text-white font-medium text-sm">Choose spending source</p>
          <p className="text-white/40 text-xs">Your card will deduct from this balance when spending.</p>
          <div className="flex gap-2 flex-wrap">
            {SPENDING_SOURCES.map((src) => (
              <button
                key={src}
                onClick={() => setSpendingSource(src)}
                className={cn(
                  'px-4 py-2 rounded-xl text-sm font-medium border transition-all',
                  selected.spending_source === src
                    ? 'bg-violet-600/20 border-violet-500/40 text-violet-300'
                    : 'bg-white/5 border-white/10 text-white/50 hover:text-white/80'
                )}
              >
                {src}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Card details */}
      <div className="grid md:grid-cols-2 gap-4">
        {/* Details */}
        <div className="glass rounded-2xl p-6 space-y-1">
          <h2 className="text-white font-semibold mb-4">Card Details</h2>
          {[
            { label: 'Number', value: selected.card_number },
            { label: 'Holder', value: selected.card_holder },
            { label: 'Expiry', value: selected.expiry },
            {
              label: 'CVV',
              value: showCvv ? '• • •' : selected.cvv,
              extra: (
                <button onClick={() => setShowCvv(!showCvv)} className="text-white/30 hover:text-white/60 transition-colors">
                  {showCvv ? <EyeOff size={12} /> : <Eye size={12} />}
                </button>
              ),
            },
            { label: 'Type', value: `${selected.card_type} · ${selected.network}` },
            { label: 'Spending from', value: selected.spending_source, color: 'text-violet-400' },
            {
              label: 'Status',
              value: selected.status.charAt(0).toUpperCase() + selected.status.slice(1),
              color: selected.status === 'active' ? 'text-emerald-400' : 'text-blue-400',
            },
            { label: 'Cross-border', value: selected.cross_border ? 'Enabled' : 'Disabled', color: selected.cross_border ? 'text-emerald-400' : 'text-white/40' },
            { label: 'ATM Limit', value: `$${selected.atm_limit}/day` },
          ].map((detail) => (
            <div key={detail.label} className="flex justify-between items-center py-2 border-b border-white/5 last:border-0">
              <span className="text-white/40 text-sm">{detail.label}</span>
              <div className="flex items-center gap-2">
                <span className={`text-sm font-medium ${'color' in detail ? detail.color : 'text-white/80'}`}>{detail.value}</span>
                {'extra' in detail && detail.extra}
              </div>
            </div>
          ))}
        </div>

        {/* Spending */}
        <div className="glass rounded-2xl p-6 space-y-4">
          <h2 className="text-white font-semibold">This Month</h2>
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-white/40 text-sm">Spending</span>
              <span className="text-white text-sm font-medium">${selected.monthly_spending.toLocaleString()} / ${selected.monthly_limit.toLocaleString()}</span>
            </div>
            <div className="w-full bg-white/5 rounded-full h-2">
              <div
                className={cn('h-2 rounded-full transition-all', spendingPct > 80 ? 'bg-red-400' : 'bg-violet-500')}
                style={{ width: `${spendingPct}%` }}
              />
            </div>
            <p className="text-white/30 text-xs mt-1">{spendingPct}% of monthly limit used</p>
          </div>

          {/* Card transactions */}
          <div>
            <h3 className="text-white/60 text-xs uppercase tracking-wide mb-3">Card Transactions</h3>
            {cardTx.length === 0 ? (
              <p className="text-white/20 text-sm">No card transactions yet.</p>
            ) : (
              <div className="space-y-1">
                {cardTx.map((tx) => (
                  <div key={tx.id} className="flex items-center gap-3 py-2">
                    <span className="text-base shrink-0">{tx.icon}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-white/80 text-xs truncate">{tx.description}</p>
                      <p className="text-white/30 text-xs">{formatDate(tx.created_at)}</p>
                    </div>
                    <span className="text-white/70 text-xs font-medium shrink-0">
                      -{Math.abs(tx.amount).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
