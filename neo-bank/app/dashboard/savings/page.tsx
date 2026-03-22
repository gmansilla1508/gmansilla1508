'use client'

import { useState } from 'react'
import { mockSavingsAccount, mockAccounts } from '@/lib/mock-data'
import { formatCurrency } from '@/lib/utils'
import { TrendingUp, ArrowDownToLine, ArrowUpFromLine, Info } from 'lucide-react'
import { cn } from '@/lib/utils'

type Mode = 'overview' | 'deposit' | 'withdraw'

export default function SavingsPage() {
  const [mode, setMode] = useState<Mode>('overview')
  const [amount, setAmount] = useState('')
  const [success, setSuccess] = useState<'deposit' | 'withdraw' | null>(null)

  const parsed = parseFloat(amount) || 0
  const usdAccount = mockAccounts.find((a) => a.currency === 'USD')!

  function handleAction() {
    setSuccess(mode === 'deposit' ? 'deposit' : 'withdraw')
    setAmount('')
    setTimeout(() => { setMode('overview'); setSuccess(null) }, 2500)
  }

  const progressPct = (mockSavingsAccount.balance / mockSavingsAccount.goal) * 100

  return (
    <div className="p-8 max-w-2xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-semibold text-white">Smart Savings</h1>
        <p className="text-white/40 text-sm mt-1">Earn yield on your idle funds.</p>
      </div>

      {/* Main savings card */}
      <div className="relative overflow-hidden rounded-2xl p-6 bg-gradient-to-br from-emerald-600 to-teal-800 shadow-xl shadow-emerald-900/40">
        <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-1">
            <p className="text-white/60 text-sm">Savings Balance</p>
            <span className="text-emerald-200 text-sm font-semibold bg-emerald-400/20 px-2.5 py-1 rounded-full">
              {mockSavingsAccount.apy} APY
            </span>
          </div>
          <p className="text-4xl font-bold text-white mb-6">{formatCurrency(mockSavingsAccount.balance)}</p>
          <div className="space-y-2">
            <div className="flex justify-between text-xs text-white/50">
              <span>{mockSavingsAccount.goalLabel}</span>
              <span>{mockSavingsAccount.goalProgress}% of {formatCurrency(mockSavingsAccount.goal)}</span>
            </div>
            <div className="w-full bg-white/10 rounded-full h-2">
              <div
                className="bg-emerald-300 h-2 rounded-full transition-all"
                style={{ width: `${progressPct}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Yield earned', value: formatCurrency(mockSavingsAccount.yieldEarned), icon: TrendingUp, color: 'text-emerald-400', bg: 'bg-emerald-400/10' },
          { label: 'APY rate', value: mockSavingsAccount.apy, icon: Info, color: 'text-violet-400', bg: 'bg-violet-400/10' },
          { label: 'Goal left', value: formatCurrency(mockSavingsAccount.goal - mockSavingsAccount.balance), icon: ArrowDownToLine, color: 'text-blue-400', bg: 'bg-blue-400/10' },
        ].map((stat) => {
          const Icon = stat.icon
          return (
            <div key={stat.label} className="glass rounded-xl p-4 text-center">
              <div className={`w-8 h-8 rounded-lg ${stat.bg} flex items-center justify-center mx-auto mb-2`}>
                <Icon size={14} className={stat.color} />
              </div>
              <p className={`text-lg font-semibold ${stat.color}`}>{stat.value}</p>
              <p className="text-white/30 text-xs mt-0.5">{stat.label}</p>
            </div>
          )
        })}
      </div>

      {/* Action tabs */}
      {mode === 'overview' && (
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => setMode('deposit')}
            className="glass glass-hover rounded-xl p-5 flex flex-col items-center gap-3 transition-all"
          >
            <div className="w-12 h-12 rounded-xl bg-emerald-400/10 flex items-center justify-center">
              <ArrowDownToLine size={20} className="text-emerald-400" />
            </div>
            <div className="text-center">
              <p className="text-white font-medium text-sm">Deposit to Savings</p>
              <p className="text-white/40 text-xs mt-0.5">Move from your account</p>
            </div>
          </button>
          <button
            onClick={() => setMode('withdraw')}
            className="glass glass-hover rounded-xl p-5 flex flex-col items-center gap-3 transition-all"
          >
            <div className="w-12 h-12 rounded-xl bg-blue-400/10 flex items-center justify-center">
              <ArrowUpFromLine size={20} className="text-blue-400" />
            </div>
            <div className="text-center">
              <p className="text-white font-medium text-sm">Withdraw</p>
              <p className="text-white/40 text-xs mt-0.5">Back to your USD account</p>
            </div>
          </button>
        </div>
      )}

      {(mode === 'deposit' || mode === 'withdraw') && (
        <div className="glass rounded-2xl p-6 space-y-5">
          <div className="flex items-center justify-between">
            <h2 className="text-white font-semibold capitalize">{mode}</h2>
            <button onClick={() => { setMode('overview'); setAmount('') }} className="text-white/30 text-xs hover:text-white/60 transition-colors">
              Cancel
            </button>
          </div>

          <div className="text-center">
            <div className="flex items-center justify-center gap-2">
              <span className="text-3xl text-white/40">$</span>
              <input
                type="number"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="text-5xl font-bold text-white bg-transparent text-center outline-none w-44 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                autoFocus
              />
            </div>
            <p className="text-white/30 text-xs mt-2">
              {mode === 'deposit'
                ? `From: USD account · Available: ${formatCurrency(usdAccount.balance)}`
                : `From: Savings · Available: ${formatCurrency(mockSavingsAccount.balance)}`}
            </p>
          </div>

          <div className="flex gap-2 justify-center">
            {[100, 250, 500, 1000].map((q) => (
              <button
                key={q}
                onClick={() => setAmount(q.toString())}
                className="px-3 py-1.5 rounded-lg bg-white/5 text-white/50 text-xs hover:bg-white/10 hover:text-white transition-all"
              >
                ${q}
              </button>
            ))}
          </div>

          {success && (
            <div className={cn('rounded-xl p-4 flex items-center gap-3 text-sm font-medium', mode === 'deposit' ? 'bg-emerald-400/10 text-emerald-400' : 'bg-blue-400/10 text-blue-400')}>
              <span>✓</span>
              {success === 'deposit'
                ? `${formatCurrency(parsed)} deposited to savings!`
                : `${formatCurrency(parsed)} withdrawn to USD account!`}
            </div>
          )}

          <button
            onClick={handleAction}
            disabled={parsed <= 0 || !!success}
            className="w-full py-3 rounded-xl bg-violet-600 hover:bg-violet-500 disabled:opacity-30 disabled:cursor-not-allowed text-white font-medium transition-colors"
          >
            {mode === 'deposit' ? 'Move to Savings' : 'Withdraw to Account'}
          </button>
        </div>
      )}

      {/* Info box */}
      <div className="glass rounded-xl p-4 flex items-start gap-3">
        <Info size={14} className="text-violet-400 shrink-0 mt-0.5" />
        <p className="text-white/40 text-xs leading-relaxed">
          Savings are separate from your main account. Funds earn <span className="text-emerald-400">{mockSavingsAccount.apy} APY</span> compounded daily. No lock-up period — withdraw anytime.
        </p>
      </div>
    </div>
  )
}
