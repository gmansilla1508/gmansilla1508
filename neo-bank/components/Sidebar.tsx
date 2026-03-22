'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { mockUser } from '@/lib/mock-data'
import { cn } from '@/lib/utils'
import {
  LayoutDashboard,
  Wallet,
  ArrowUpRight,
  ArrowDownLeft,
  PiggyBank,
  ArrowLeftRight,
  CreditCard,
  Clock,
  BarChart3,
  HeadphonesIcon,
  LogOut,
} from 'lucide-react'

const navItems = [
  { href: '/dashboard', label: 'Home', icon: LayoutDashboard },
  { href: '/dashboard/accounts', label: 'Balances', icon: Wallet },
  { href: '/dashboard/send', label: 'Send', icon: ArrowUpRight },
  { href: '/dashboard/receive', label: 'Receive', icon: ArrowDownLeft },
  { href: '/dashboard/savings', label: 'Savings', icon: PiggyBank },
  { href: '/dashboard/convert', label: 'Convert', icon: ArrowLeftRight },
  { href: '/dashboard/cards', label: 'Card', icon: CreditCard },
  { href: '/dashboard/transactions', label: 'Transactions', icon: Clock },
  { href: '/dashboard/insights', label: 'Insights', icon: BarChart3 },
  { href: '/dashboard/support', label: 'Support', icon: HeadphonesIcon },
]

export default function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="w-60 min-h-screen flex flex-col glass border-r border-white/5 px-3 py-6 shrink-0">
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-3 mb-8">
        <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-white font-bold text-sm">
          A
        </div>
        <span className="text-lg font-semibold text-white tracking-tight">Awake</span>
        <span className="ml-auto text-[10px] font-medium text-violet-400 bg-violet-400/10 border border-violet-400/20 px-1.5 py-0.5 rounded-full">
          Beta
        </span>
      </div>

      {/* Nav */}
      <nav className="flex-1 space-y-0.5">
        {navItems.map((item) => {
          const active = pathname === item.href
          const Icon = item.icon
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all',
                active
                  ? 'bg-violet-600/20 text-violet-300 border border-violet-500/20'
                  : 'text-white/50 hover:text-white/80 hover:bg-white/5'
              )}
            >
              <Icon size={16} strokeWidth={active ? 2.5 : 2} />
              {item.label}
            </Link>
          )
        })}
      </nav>

      {/* User */}
      <div className="mt-4 pt-4 border-t border-white/5 space-y-1">
        <div className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-white/5 transition-colors cursor-pointer">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-white text-xs font-semibold shrink-0">
            {mockUser.avatar}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">{mockUser.name}</p>
            <p className="text-xs text-white/40 truncate">{mockUser.email}</p>
          </div>
        </div>
        <Link
          href="/onboarding"
          className="flex items-center gap-3 px-3 py-2 rounded-xl text-xs text-white/30 hover:text-white/60 hover:bg-white/5 transition-colors"
        >
          <LogOut size={14} />
          Sign out
        </Link>
      </div>
    </aside>
  )
}
