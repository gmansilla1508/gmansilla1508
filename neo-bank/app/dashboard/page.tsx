import Link from 'next/link'
import { mockUser, mockAccounts, mockTransactions, mockNetWorth, mockMonthlyIncome, mockMonthlySpent, mockMonthlySaved, mockSavingsAccount } from '@/lib/mock-data'
import { formatCurrency, formatDate } from '@/lib/utils'
import { ArrowUpRight, ArrowDownLeft, ArrowLeftRight, Plus } from 'lucide-react'

export default function DashboardPage() {
  const recentTx = mockTransactions.slice(0, 5)

  const quickActions = [
    { label: 'Add Money', icon: Plus, href: '/dashboard/receive', color: 'text-emerald-400', bg: 'bg-emerald-400/10 border-emerald-400/20' },
    { label: 'Send', icon: ArrowUpRight, href: '/dashboard/send', color: 'text-blue-400', bg: 'bg-blue-400/10 border-blue-400/20' },
    { label: 'Receive', icon: ArrowDownLeft, href: '/dashboard/receive', color: 'text-violet-400', bg: 'bg-violet-400/10 border-violet-400/20' },
    { label: 'Convert', icon: ArrowLeftRight, href: '/dashboard/convert', color: 'text-amber-400', bg: 'bg-amber-400/10 border-amber-400/20' },
  ]

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-white/40 text-sm">Good morning,</p>
          <h1 className="text-2xl font-semibold text-white">{mockUser.name}</h1>
        </div>
        <div className="flex items-center gap-2 glass px-3 py-2 rounded-xl">
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-white/50 text-xs">KYC Verified</span>
        </div>
      </div>

      {/* Net Worth Card */}
      <div className="relative overflow-hidden rounded-2xl p-6 bg-gradient-to-br from-violet-600 via-indigo-700 to-indigo-900 shadow-xl shadow-violet-900/40">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-40 h-40 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />
        <div className="relative z-10">
          <p className="text-white/60 text-sm mb-1">Total Net Worth</p>
          <p className="text-5xl font-bold text-white mb-6">{formatCurrency(mockNetWorth)}</p>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <p className="text-white/40 text-xs mb-0.5">Income this month</p>
              <p className="text-emerald-300 font-semibold">{formatCurrency(mockMonthlyIncome)}</p>
            </div>
            <div>
              <p className="text-white/40 text-xs mb-0.5">Spent this month</p>
              <p className="text-red-300 font-semibold">{formatCurrency(mockMonthlySpent)}</p>
            </div>
            <div>
              <p className="text-white/40 text-xs mb-0.5">Saved</p>
              <p className="text-white font-semibold">{formatCurrency(mockMonthlySaved)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-4 gap-3">
        {quickActions.map((action) => {
          const Icon = action.icon
          return (
            <Link
              key={action.label}
              href={action.href}
              className={`glass glass-hover rounded-2xl p-4 flex flex-col items-center gap-2.5 border transition-all ${action.bg}`}
            >
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${action.bg}`}>
                <Icon size={18} className={action.color} />
              </div>
              <span className="text-white/70 text-sm font-medium">{action.label}</span>
            </Link>
          )
        })}
      </div>

      {/* Currency Balances Mini-overview */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-white font-semibold">Balances</h2>
          <Link href="/dashboard/accounts" className="text-violet-400 text-sm hover:text-violet-300 transition-colors">
            View all →
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {mockAccounts.map((acc) => (
            <div key={acc.id} className={`rounded-2xl p-4 bg-gradient-to-br ${acc.color} relative overflow-hidden`}>
              <div className="absolute top-0 right-0 w-16 h-16 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-white/70 text-xs font-medium">{acc.currency}</span>
                  <span className="text-base">{acc.flag}</span>
                </div>
                <p className="text-white font-bold text-lg">
                  {acc.currency === 'BTC'
                    ? `${acc.balance} BTC`
                    : `${acc.symbol}${acc.balance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
                </p>
                {acc.usdValue && <p className="text-white/50 text-xs mt-0.5">≈ ${acc.usdValue.toLocaleString()}</p>}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Savings teaser */}
      <div className="glass rounded-2xl p-5 flex items-center gap-4">
        <div className="w-11 h-11 rounded-xl bg-emerald-400/10 flex items-center justify-center text-xl shrink-0">🏦</div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
            <p className="text-white font-medium text-sm">Smart Savings</p>
            <span className="text-emerald-400 text-xs font-semibold">{mockSavingsAccount.apy} APY</span>
          </div>
          <div className="w-full bg-white/5 rounded-full h-1.5">
            <div className="bg-emerald-400 h-1.5 rounded-full" style={{ width: `${mockSavingsAccount.goalProgress}%` }} />
          </div>
          <p className="text-white/30 text-xs mt-1.5">
            {formatCurrency(mockSavingsAccount.balance)} of {formatCurrency(mockSavingsAccount.goal)} goal · Yield earned: {formatCurrency(mockSavingsAccount.yieldEarned)}
          </p>
        </div>
        <Link
          href="/dashboard/savings"
          className="shrink-0 text-xs text-violet-400 border border-violet-400/30 px-3 py-1.5 rounded-lg hover:bg-violet-400/10 transition-colors"
        >
          Manage
        </Link>
      </div>

      {/* Recent Transactions */}
      <div className="glass rounded-2xl p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-white font-semibold">Recent Transactions</h2>
          <Link href="/dashboard/transactions" className="text-violet-400 text-sm hover:text-violet-300 transition-colors">
            View all →
          </Link>
        </div>
        <div className="space-y-1">
          {recentTx.map((tx) => (
            <div key={tx.id} className="flex items-center gap-4 p-3 rounded-xl hover:bg-white/5 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-lg shrink-0">
                {tx.icon}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white text-sm font-medium truncate">{tx.description}</p>
                <div className="flex items-center gap-2">
                  <p className="text-white/40 text-xs">{formatDate(tx.created_at)}</p>
                  <span className="text-white/20 text-xs">·</span>
                  <span className="text-xs text-white/30">{tx.currency}</span>
                </div>
              </div>
              <div className="text-right shrink-0">
                <p className={`text-sm font-semibold ${tx.type === 'credit' ? 'text-emerald-400' : 'text-white'}`}>
                  {tx.type === 'credit' ? '+' : ''}{formatCurrency(Math.abs(tx.amount))}
                </p>
                <span className="text-xs text-white/30 bg-white/5 px-2 py-0.5 rounded-full">{tx.category}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
