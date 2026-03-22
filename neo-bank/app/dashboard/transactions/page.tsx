'use client'

import { useState } from 'react'
import { mockTransactions, type TransactionCategory } from '@/lib/mock-data'
import { formatDate } from '@/lib/utils'

const ALL_CATEGORIES: TransactionCategory[] = ['Income', 'Transfer', 'Subscriptions', 'Travel', 'Housing', 'Savings', 'FX', 'Food & Drink', 'Card']

const CATEGORY_COLORS: Record<TransactionCategory, string> = {
  Income: 'text-emerald-400 bg-emerald-400/10',
  Transfer: 'text-blue-400 bg-blue-400/10',
  Subscriptions: 'text-pink-400 bg-pink-400/10',
  Travel: 'text-sky-400 bg-sky-400/10',
  Housing: 'text-violet-400 bg-violet-400/10',
  Savings: 'text-teal-400 bg-teal-400/10',
  FX: 'text-amber-400 bg-amber-400/10',
  'Food & Drink': 'text-orange-400 bg-orange-400/10',
  Card: 'text-rose-400 bg-rose-400/10',
}

export default function TransactionsPage() {
  const [search, setSearch] = useState('')
  const [activeCategory, setActiveCategory] = useState<TransactionCategory | 'All'>('All')
  const [typeFilter, setTypeFilter] = useState<'all' | 'credit' | 'debit'>('all')

  const filtered = mockTransactions.filter((tx) => {
    const matchesSearch =
      tx.description.toLowerCase().includes(search.toLowerCase()) ||
      tx.merchant.toLowerCase().includes(search.toLowerCase())
    const matchesCategory = activeCategory === 'All' || tx.category === activeCategory
    const matchesType = typeFilter === 'all' || tx.type === typeFilter
    return matchesSearch && matchesCategory && matchesType
  })

  const totalIn = filtered.filter((t) => t.type === 'credit').reduce((s, t) => s + t.amount, 0)
  const totalOut = filtered.filter((t) => t.type === 'debit').reduce((s, t) => s + Math.abs(t.amount), 0)

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-white">Transactions</h1>
          <p className="text-white/40 text-sm mt-1">{mockTransactions.length} total · All activity</p>
        </div>
        <div className="flex gap-3 text-sm">
          <div className="glass px-3 py-2 rounded-xl text-center">
            <p className="text-emerald-400 font-semibold">+${totalIn.toFixed(0)}</p>
            <p className="text-white/30 text-xs">In</p>
          </div>
          <div className="glass px-3 py-2 rounded-xl text-center">
            <p className="text-red-400 font-semibold">-${totalOut.toFixed(0)}</p>
            <p className="text-white/30 text-xs">Out</p>
          </div>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="glass rounded-2xl p-4 space-y-3">
        <input
          type="text"
          placeholder="Search transactions…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm placeholder-white/20 outline-none focus:border-violet-500/50 transition-colors"
        />

        <div className="flex gap-2">
          {(['all', 'credit', 'debit'] as const).map((type) => (
            <button
              key={type}
              onClick={() => setTypeFilter(type)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                typeFilter === type
                  ? 'bg-violet-600 text-white'
                  : 'bg-white/5 text-white/40 hover:text-white/70'
              }`}
            >
              {type === 'credit' ? '↑ Income' : type === 'debit' ? '↓ Expenses' : 'All'}
            </button>
          ))}
        </div>

        <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
          <button
            onClick={() => setActiveCategory('All')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
              activeCategory === 'All'
                ? 'bg-violet-600/30 text-violet-300 border border-violet-500/40'
                : 'bg-white/5 text-white/40 hover:text-white/70'
            }`}
          >
            All
          </button>
          {ALL_CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                activeCategory === cat
                  ? 'bg-violet-600/30 text-violet-300 border border-violet-500/40'
                  : 'bg-white/5 text-white/40 hover:text-white/70'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Transaction List */}
      <div className="glass rounded-2xl overflow-hidden">
        {filtered.length === 0 ? (
          <div className="p-12 text-center text-white/30 text-sm">No transactions found</div>
        ) : (
          <div className="divide-y divide-white/5">
            {filtered.map((tx) => {
              const catColor = CATEGORY_COLORS[tx.category] ?? 'text-white/40 bg-white/5'
              return (
                <div key={tx.id} className="flex items-center gap-4 p-4 hover:bg-white/5 transition-colors">
                  <div className="w-11 h-11 rounded-xl bg-white/5 flex items-center justify-center text-xl shrink-0">
                    {tx.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-sm font-medium truncate">{tx.description}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <p className="text-white/40 text-xs">{formatDate(tx.created_at)}</p>
                      <span className="text-white/20 text-xs">·</span>
                      <span className="text-xs text-white/30">{tx.merchant}</span>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1 shrink-0">
                    <p className={`text-sm font-semibold ${tx.type === 'credit' ? 'text-emerald-400' : 'text-white/90'}`}>
                      {tx.type === 'credit' ? '+' : '-'}{Math.abs(tx.amount).toFixed(2)} {tx.currency}
                    </p>
                    <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${catColor}`}>
                      {tx.category}
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
