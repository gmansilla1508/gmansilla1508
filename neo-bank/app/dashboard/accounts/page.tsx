'use client'

import { useState } from 'react'
import Link from 'next/link'
import { mockAccounts, mockTransactions, type Account } from '@/lib/mock-data'
import { formatDate } from '@/lib/utils'
import { Copy, ArrowUpRight, ArrowDownLeft, ArrowLeftRight, PiggyBank, Check } from 'lucide-react'
import { cn } from '@/lib/utils'

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false)
  function copy() {
    navigator.clipboard.writeText(text).catch(() => {})
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }
  return (
    <button onClick={copy} className="text-white/30 hover:text-violet-400 transition-colors">
      {copied ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
    </button>
  )
}

function formatBalance(acc: Account) {
  if (acc.currency === 'BTC') return `${acc.balance} BTC`
  return `${acc.symbol}${acc.balance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
}

export default function AccountsPage() {
  const [selected, setSelected] = useState<Account>(mockAccounts[0])

  const txForAccount = mockTransactions.filter((t) => t.currency === selected.currency).slice(0, 6)

  const actions = [
    { label: 'Send', icon: ArrowUpRight, href: '/dashboard/send', color: 'text-blue-400' },
    { label: 'Receive', icon: ArrowDownLeft, href: '/dashboard/receive', color: 'text-emerald-400' },
    { label: 'Convert', icon: ArrowLeftRight, href: '/dashboard/convert', color: 'text-amber-400' },
    { label: 'Savings', icon: PiggyBank, href: '/dashboard/savings', color: 'text-violet-400' },
  ]

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-semibold text-white">Balances</h1>
        <p className="text-white/40 text-sm mt-1">{mockAccounts.length} currency accounts</p>
      </div>

      {/* Account Cards */}
      <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-2">
        {mockAccounts.map((acc) => (
          <button
            key={acc.id}
            onClick={() => setSelected(acc)}
            className={cn(
              'relative shrink-0 w-64 rounded-2xl p-5 text-left transition-all overflow-hidden bg-gradient-to-br',
              acc.color,
              selected.id === acc.id ? 'ring-2 ring-white/30 scale-[1.02] shadow-xl' : 'opacity-60 hover:opacity-85'
            )}
          >
            <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <span className="text-white/70 text-xs font-medium">{acc.name}</span>
                <span className="text-xl">{acc.flag}</span>
              </div>
              <p className="text-white font-bold text-2xl mb-1">{formatBalance(acc)}</p>
              {acc.usdValue && <p className="text-white/50 text-xs">≈ ${acc.usdValue.toLocaleString()} USD</p>}
            </div>
          </button>
        ))}
      </div>

      {/* Selected Account Details */}
      <div className="glass rounded-2xl p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-white font-semibold">{selected.name} Account</h2>
          <span className={`text-xs font-medium px-2 py-1 rounded-full bg-gradient-to-r ${selected.color} text-white`}>
            {selected.currency}
          </span>
        </div>

        {selected.iban && (
          <div className="flex justify-between items-center py-2 border-b border-white/5">
            <span className="text-white/40 text-sm">IBAN</span>
            <div className="flex items-center gap-2">
              <span className="text-white/80 text-sm font-mono text-xs">{selected.iban}</span>
              <CopyButton text={selected.iban} />
            </div>
          </div>
        )}
        {selected.walletAddress && (
          <div className="flex justify-between items-center py-2 border-b border-white/5">
            <span className="text-white/40 text-sm">Wallet Address</span>
            <div className="flex items-center gap-2">
              <span className="text-white/80 font-mono text-xs truncate max-w-[180px]">{selected.walletAddress}</span>
              <CopyButton text={selected.walletAddress} />
            </div>
          </div>
        )}
        <div className="flex justify-between items-center py-2">
          <span className="text-white/40 text-sm">Balance</span>
          <span className="text-white font-semibold">{formatBalance(selected)}</span>
        </div>
      </div>

      {/* Actions */}
      <div className="grid grid-cols-4 gap-3">
        {actions.map((action) => {
          const Icon = action.icon
          return (
            <Link
              key={action.label}
              href={action.href}
              className="glass glass-hover rounded-xl p-4 flex flex-col items-center gap-2 transition-all"
            >
              <Icon size={18} className={action.color} />
              <span className="text-white/60 text-xs font-medium">{action.label}</span>
            </Link>
          )
        })}
      </div>

      {/* Transactions for this currency */}
      <div className="glass rounded-2xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-white font-semibold">{selected.currency} Transactions</h2>
          <Link href="/dashboard/transactions" className="text-violet-400 text-xs hover:text-violet-300 transition-colors">View all →</Link>
        </div>
        {txForAccount.length === 0 ? (
          <p className="text-white/30 text-sm text-center py-6">No transactions for {selected.currency} yet.</p>
        ) : (
          <div className="space-y-1">
            {txForAccount.map((tx) => (
              <div key={tx.id} className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 transition-colors">
                <div className="w-9 h-9 rounded-xl bg-white/5 flex items-center justify-center text-base shrink-0">{tx.icon}</div>
                <div className="flex-1 min-w-0">
                  <p className="text-white text-sm truncate">{tx.description}</p>
                  <p className="text-white/30 text-xs">{formatDate(tx.created_at)}</p>
                </div>
                <p className={`text-sm font-semibold shrink-0 ${tx.type === 'credit' ? 'text-emerald-400' : 'text-white/80'}`}>
                  {tx.type === 'credit' ? '+' : '-'}{Math.abs(tx.amount).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
