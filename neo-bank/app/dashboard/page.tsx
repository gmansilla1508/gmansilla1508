import { mockAccount, mockSavingsAccount, mockTransactions, mockUser } from '@/lib/mock-data'
import { formatCurrency, formatDate } from '@/lib/utils'

export default function DashboardPage() {
  const recentTx = mockTransactions.slice(0, 5)

  const totalSpent = mockTransactions
    .filter((t) => t.type === 'debit')
    .reduce((sum, t) => sum + Math.abs(t.amount), 0)

  const totalReceived = mockTransactions
    .filter((t) => t.type === 'credit')
    .reduce((sum, t) => sum + t.amount, 0)

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <p className="text-white/40 text-sm">Good morning,</p>
        <h1 className="text-2xl font-semibold text-white">{mockUser.name} 👋</h1>
      </div>

      {/* Balance Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Main Account Card */}
        <div className="relative overflow-hidden rounded-2xl p-6 bg-gradient-to-br from-violet-600 to-indigo-700 shadow-lg shadow-violet-900/40">
          <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-6">
              <span className="text-white/70 text-sm font-medium">{mockAccount.account_type} Account</span>
              <span className="text-white/50 text-xs font-mono">{mockAccount.account_number}</span>
            </div>
            <p className="text-white/60 text-sm mb-1">Available Balance</p>
            <p className="text-4xl font-bold text-white mb-4">{formatCurrency(mockAccount.balance)}</p>
            <div className="flex items-center gap-4 text-sm">
              <div>
                <p className="text-white/50 text-xs">IBAN</p>
                <p className="text-white/80 font-mono text-xs">{mockAccount.iban}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Savings Account Card */}
        <div className="rounded-2xl p-6 glass">
          <div className="flex items-center justify-between mb-6">
            <span className="text-white/60 text-sm font-medium">{mockSavingsAccount.account_type} Account</span>
            <span className="text-emerald-400 text-xs font-semibold bg-emerald-400/10 px-2 py-1 rounded-full">
              {mockSavingsAccount.apy} APY
            </span>
          </div>
          <p className="text-white/60 text-sm mb-1">Balance</p>
          <p className="text-3xl font-bold text-white mb-6">{formatCurrency(mockSavingsAccount.balance)}</p>
          <div className="w-full bg-white/5 rounded-full h-1.5">
            <div className="bg-emerald-400 h-1.5 rounded-full" style={{ width: '65%' }} />
          </div>
          <p className="text-white/30 text-xs mt-2">65% of monthly goal</p>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Spent', value: formatCurrency(totalSpent), color: 'text-red-400', bg: 'bg-red-400/10' },
          { label: 'Total Received', value: formatCurrency(totalReceived), color: 'text-emerald-400', bg: 'bg-emerald-400/10' },
          { label: 'Transactions', value: mockTransactions.length.toString(), color: 'text-blue-400', bg: 'bg-blue-400/10' },
          { label: 'Savings Rate', value: '32%', color: 'text-violet-400', bg: 'bg-violet-400/10' },
        ].map((stat) => (
          <div key={stat.label} className="glass rounded-xl p-4">
            <div className={`w-8 h-8 rounded-lg ${stat.bg} flex items-center justify-center mb-3`}>
              <div className={`w-3 h-3 rounded-sm ${stat.color} bg-current`} />
            </div>
            <p className="text-white/40 text-xs mb-1">{stat.label}</p>
            <p className={`text-lg font-semibold ${stat.color}`}>{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Recent Transactions */}
      <div className="glass rounded-2xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-white font-semibold">Recent Transactions</h2>
          <a href="/dashboard/transactions" className="text-violet-400 text-sm hover:text-violet-300 transition-colors">
            View all →
          </a>
        </div>
        <div className="space-y-1">
          {recentTx.map((tx) => (
            <div key={tx.id} className="flex items-center gap-4 p-3 rounded-xl hover:bg-white/5 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-lg shrink-0">
                {tx.icon}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white text-sm font-medium truncate">{tx.description}</p>
                <p className="text-white/40 text-xs">{formatDate(tx.created_at)}</p>
              </div>
              <div className="text-right shrink-0">
                <p className={`text-sm font-semibold ${tx.type === 'credit' ? 'text-emerald-400' : 'text-white'}`}>
                  {tx.type === 'credit' ? '+' : ''}{formatCurrency(tx.amount)}
                </p>
                <span className="text-xs text-white/30 bg-white/5 px-2 py-0.5 rounded-full">
                  {tx.category}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
