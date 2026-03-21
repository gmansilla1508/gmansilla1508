'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { mockUser } from '@/lib/mock-data'
import { cn } from '@/lib/utils'

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: '⬛' },
  { href: '/dashboard/transactions', label: 'Transactions', icon: '↕' },
  { href: '/dashboard/transfer', label: 'Transfer', icon: '→' },
  { href: '/dashboard/cards', label: 'Cards', icon: '▭' },
]

export default function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="w-64 min-h-screen flex flex-col glass border-r border-white/5 px-4 py-6 shrink-0">
      {/* Logo */}
      <div className="flex items-center gap-2 px-3 mb-10">
        <div className="w-8 h-8 rounded-lg bg-violet-600 flex items-center justify-center text-white font-bold text-sm">N</div>
        <span className="text-lg font-semibold text-white">NeoBank</span>
      </div>

      {/* Nav */}
      <nav className="flex-1 space-y-1">
        {navItems.map((item) => {
          const active = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all',
                active
                  ? 'bg-violet-600/20 text-violet-300 border border-violet-500/30'
                  : 'text-white/50 hover:text-white/80 hover:bg-white/5'
              )}
            >
              <span className="text-base">{item.icon}</span>
              {item.label}
            </Link>
          )
        })}
      </nav>

      {/* User */}
      <div className="mt-auto pt-4 border-t border-white/5">
        <div className="flex items-center gap-3 px-3 py-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-white text-xs font-semibold">
            {mockUser.avatar}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">{mockUser.name}</p>
            <p className="text-xs text-white/40 truncate">{mockUser.email}</p>
          </div>
        </div>
      </div>
    </aside>
  )
}
