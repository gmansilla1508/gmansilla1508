import { mockInsights, mockMonthlyIncome, mockMonthlySpent, mockMonthlySaved } from '@/lib/mock-data'
import { TrendingUp, TrendingDown, Minus } from 'lucide-react'

export default function InsightsPage() {
  const { incomeSources, stabilityScore, stabilityMonths, topCategories, cashRunwayMonths, savingsRate, monthlyTrend } = mockInsights

  const maxBar = Math.max(...monthlyTrend.map((m) => Math.max(m.income, m.spent)))

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-semibold text-white">Financial Insights</h1>
        <p className="text-white/40 text-sm mt-1">Your financial activity — March 2026</p>
      </div>

      {/* Summary strip */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Income this month', value: `$${mockMonthlyIncome.toLocaleString()}`, trend: TrendingUp, color: 'text-emerald-400', bg: 'bg-emerald-400/10' },
          { label: 'Spent this month', value: `$${mockMonthlySpent.toLocaleString()}`, trend: TrendingDown, color: 'text-red-400', bg: 'bg-red-400/10' },
          { label: 'Saved', value: `$${mockMonthlySaved.toLocaleString()}`, trend: TrendingUp, color: 'text-violet-400', bg: 'bg-violet-400/10' },
        ].map((stat) => {
          const Icon = stat.trend
          return (
            <div key={stat.label} className="glass rounded-2xl p-5">
              <div className={`w-9 h-9 rounded-xl ${stat.bg} flex items-center justify-center mb-3`}>
                <Icon size={16} className={stat.color} />
              </div>
              <p className={`text-xl font-bold ${stat.color}`}>{stat.value}</p>
              <p className="text-white/40 text-xs mt-1">{stat.label}</p>
            </div>
          )
        })}
      </div>

      {/* Income chart bar */}
      <div className="glass rounded-2xl p-6">
        <h2 className="text-white font-semibold mb-5">Income vs Spending — Last 6 Months</h2>
        <div className="flex items-end gap-3 h-32">
          {monthlyTrend.map((m) => (
            <div key={m.month} className="flex-1 flex flex-col items-center gap-1">
              <div className="w-full flex gap-1 items-end" style={{ height: '100px' }}>
                <div
                  className="flex-1 rounded-t-md bg-emerald-500/60"
                  style={{ height: `${(m.income / maxBar) * 100}px` }}
                />
                <div
                  className="flex-1 rounded-t-md bg-red-400/50"
                  style={{ height: `${(m.spent / maxBar) * 100}px` }}
                />
              </div>
              <span className="text-white/30 text-xs">{m.month}</span>
            </div>
          ))}
        </div>
        <div className="flex items-center gap-4 mt-4">
          <div className="flex items-center gap-2 text-xs text-white/40">
            <div className="w-3 h-3 rounded-sm bg-emerald-500/60" /> Income
          </div>
          <div className="flex items-center gap-2 text-xs text-white/40">
            <div className="w-3 h-3 rounded-sm bg-red-400/50" /> Spending
          </div>
        </div>
      </div>

      {/* Income sources */}
      <div className="glass rounded-2xl p-6">
        <h2 className="text-white font-semibold mb-4">Income Sources</h2>
        <div className="space-y-4">
          {incomeSources.map((src) => (
            <div key={src.label}>
              <div className="flex justify-between items-center mb-1.5">
                <p className="text-white/80 text-sm">{src.label}</p>
                <div className="flex items-center gap-3">
                  <span className="text-white/40 text-xs">{src.percentage}%</span>
                  <span className="text-emerald-400 font-semibold text-sm">${src.amount.toLocaleString()}</span>
                </div>
              </div>
              <div className="w-full bg-white/5 rounded-full h-1.5">
                <div className="bg-emerald-500 h-1.5 rounded-full" style={{ width: `${src.percentage}%` }} />
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4 pt-4 border-t border-white/5 flex items-center gap-3">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
          <div>
            <p className="text-white/70 text-sm font-medium">
              Income Stability: <span className="text-emerald-400">{stabilityScore}</span>
            </p>
            <p className="text-white/30 text-xs">Your income has been stable for {stabilityMonths} months.</p>
          </div>
        </div>
      </div>

      {/* Top spending categories */}
      <div className="glass rounded-2xl p-6">
        <h2 className="text-white font-semibold mb-4">Top Spending Categories</h2>
        <div className="space-y-3">
          {topCategories.map((cat) => (
            <div key={cat.label} className="flex items-center gap-3">
              <span className="text-xl w-8 text-center shrink-0">{cat.icon}</span>
              <div className="flex-1">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-white/80 text-sm">{cat.label}</span>
                  <span className="text-white/60 text-sm">${cat.amount.toLocaleString('en-US', { minimumFractionDigits: 0 })}</span>
                </div>
                <div className="w-full bg-white/5 rounded-full h-1.5">
                  <div className={`${cat.color} h-1.5 rounded-full`} style={{ width: `${cat.percentage}%` }} />
                </div>
              </div>
              <span className="text-white/30 text-xs w-8 text-right shrink-0">{cat.percentage}%</span>
            </div>
          ))}
        </div>
      </div>

      {/* Health metrics */}
      <div className="grid md:grid-cols-2 gap-4">
        {/* Savings rate */}
        <div className="glass rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-white font-semibold">Savings Rate</h2>
            <span className="text-violet-400 font-bold text-xl">{savingsRate}%</span>
          </div>
          <div className="w-full bg-white/5 rounded-full h-3 mb-3">
            <div className="bg-gradient-to-r from-violet-500 to-indigo-500 h-3 rounded-full" style={{ width: `${savingsRate}%` }} />
          </div>
          <p className="text-white/40 text-xs">
            {savingsRate >= 50 ? '🌟 Excellent! You\'re saving over half your income.' :
             savingsRate >= 30 ? '👍 Good savings habit. Target 50%+ for faster growth.' :
             '📈 Try to increase your savings rate to build wealth faster.'}
          </p>
        </div>

        {/* Cash runway */}
        <div className="glass rounded-2xl p-6">
          <h2 className="text-white font-semibold mb-4">Cash Runway</h2>
          <div className="flex items-center gap-3 mb-3">
            <span className="text-4xl font-bold text-white">{cashRunwayMonths}</span>
            <span className="text-white/40 text-sm">months of expenses covered</span>
          </div>
          <div className="w-full bg-white/5 rounded-full h-3 mb-3">
            <div
              className={`h-3 rounded-full ${cashRunwayMonths >= 6 ? 'bg-emerald-500' : cashRunwayMonths >= 3 ? 'bg-amber-500' : 'bg-red-500'}`}
              style={{ width: `${Math.min((cashRunwayMonths / 12) * 100, 100)}%` }}
            />
          </div>
          <p className="text-white/40 text-xs">
            {cashRunwayMonths >= 6 ? '✓ You have a healthy emergency fund (6+ months recommended).' :
             cashRunwayMonths >= 3 ? '⚠ You\'re on track. Aim for 6 months of runway.' :
             '⚠ Low runway. Consider saving more to cover unexpected expenses.'}
          </p>
        </div>
      </div>

      {/* Savings health */}
      <div className="glass rounded-2xl p-6">
        <h2 className="text-white font-semibold mb-4">Savings Health</h2>
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: 'Emergency fund', status: cashRunwayMonths >= 3 ? 'Good' : 'Low', ok: cashRunwayMonths >= 3 },
            { label: 'Savings rate', status: savingsRate >= 20 ? 'On track' : 'Below target', ok: savingsRate >= 20 },
            { label: 'Income diversification', status: incomeSources.length >= 2 ? 'Diversified' : 'Single source', ok: incomeSources.length >= 2 },
          ].map((item) => (
            <div key={item.label} className="text-center p-4 glass rounded-xl">
              <div className={`text-2xl mb-2`}>{item.ok ? '✅' : '⚠️'}</div>
              <p className={`text-sm font-medium ${item.ok ? 'text-emerald-400' : 'text-amber-400'}`}>{item.status}</p>
              <p className="text-white/30 text-xs mt-1">{item.label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
