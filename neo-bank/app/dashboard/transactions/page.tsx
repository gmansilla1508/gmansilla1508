'use client'

import { useState } from 'react'
import { mockTransactions } from '@/lib/mock-data'
import { formatCurrency, formatDate } from '@/lib/utils'

const categories = ['All', 'Food & Drink', 'Income', 'Entertainment', 'Transport', 'Transfer', 'Shopping', 'Utilities']

export default function TransactionsPage() {
  const [search, setSearch] = useState('')
  const [activeCategory, setActiveCategory] = useState('All')
  const [typeFilter, setTypeFilter] = useState<'all' | 'credit' | 'debit'>('all')

  const filtered = mockTransactions.filter((tx) => {
    const matchesSearch =
      tx.description.toLowerCase().includes(search.toLowerCase()) ||
      tx.merchant.toLowerCase().includes(search.toLowerCase())
    const matchesCategory = activeCategory === 'All' || tx.category === activeCategory
    const matchesType = typeFilter === 'all' || tx.type === typeFilter
    return matchesSearch && matchesCategory && matchesType
  })

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-white">Transactions</h1>
        <p className="text-white/40 text-sm mt-1">{mockTransactions.length} total transactions</p>
      </div>

      {/* Search & Filters */}
      <div className="glass rounded-2xl p-4 space-y-4">
        <input
          type="text"
          placeholder="Search transactions..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm placeholder-white/30 outline-none focus:border-violet-500/50 transition-colors"
        />

        {/* Type Filter */}
        <div className="flex gap-2">
          {(['all', 'credit', 'debit'] as const).map((type) => (
            <button
              key={type}
              onClick={() => setTypeFilter(type)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-all ${
                typeFilter === type
                  ? 'bg-violet-600 text-white'
                  : 'bg-white/5 text-white/40 hover:text-white/70'
              }`}
            >
              {type === 'credit' ? '↑ Income' : type === 'debit' ? '↓ Expenses' : 'All'}
            </button>
          ))}
        </div>

        {/* Category Filter */}
        <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
          {categories.map((cat) => (
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
      <div className="glass rounded-2xl divide-y divide-white/5 overflow-hidden">
        {filtered.length === 0 ? (
          <div className="p-12 text-center text-white/30 text-sm">No transactions found</div>
        ) : (
          filtered.map((tx) => (
            <div key={tx.id} className="flex items-center gap-4 p-4 hover:bg-white/5 transition-colors">
              <div className="w-11 h-11 rounded-xl bg-white/5 flex items-center justify-center text-xl shrink-0">
                {tx.icon}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white text-sm font-medium truncate">{tx.description}</p>
                <div className="flex items-center gap-2 mt-0.5">
                  <p className="text-white/40 text-xs">{formatDate(tx.created_at)}</p>
                  <span className="w-1 h-1 bg-white/20 rounded-full" />
                  <span className="text-xs text-white/30">{tx.merchant}</span>
                </div>
              </div>
              <div className="text-right shrink-0">
                <p className={`text-sm font-semibold ${tx.type === 'credit' ? 'text-emerald-400' : 'text-white/90'}`}>
                  {tx.type === 'credit' ? '+' : '-'}{formatCurrency(Math.abs(tx.amount))}
                </p>
                <span className="text-xs text-white/30">{tx.category}</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
