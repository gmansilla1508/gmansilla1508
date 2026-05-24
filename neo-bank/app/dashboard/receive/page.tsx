'use client'

import { useState, useEffect } from 'react'
import { mockAccounts, mockUser } from '@/lib/mock-data'
import { Copy, Check, QrCode, Plus } from 'lucide-react'
import { cn } from '@/lib/utils'

type ReceiveMethod = 'bank' | 'p2p' | 'employer'

const METHODS = [
  { id: 'bank' as const, label: 'Bank Transfer', icon: '🏦', desc: 'Top up via SEPA or SWIFT' },
  { id: 'p2p' as const, label: 'Peer to Peer', icon: '👤', desc: 'Username, wallet or QR code' },
  { id: 'employer' as const, label: 'From Employer / Platform', icon: '💼', desc: 'Upwork, Deel, Remote.com…' },
]

const PLATFORMS = [
  { name: 'Upwork', icon: '💼', currency: 'USD', instructions: 'Add your Awake USD account to your Upwork payment method.' },
  { name: 'Deel', icon: '🌐', currency: 'EUR', instructions: 'Use your Awake EUR IBAN in Deel withdrawal settings.' },
  { name: 'Remote.com', icon: '🏢', currency: 'USD', instructions: 'Link your Awake USD account in Remote payment preferences.' },
  { name: 'Toptal', icon: '⭐', currency: 'USD', instructions: 'Select bank transfer and use your Awake USD routing details.' },
]

function CopyField({ label, value }: { label: string; value: string }) {
  const [copied, setCopied] = useState(false)
  function copy() {
    navigator.clipboard.writeText(value).catch(() => {})
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }
  return (
    <div className="flex justify-between items-center py-3 border-b border-white/5 last:border-0">
      <div>
        <p className="text-white/40 text-xs mb-0.5">{label}</p>
        <p className="text-white/80 font-mono text-sm">{value}</p>
      </div>
      <button
        onClick={copy}
        className="ml-4 flex items-center gap-1.5 text-xs text-white/30 hover:text-violet-400 transition-colors border border-white/10 hover:border-violet-400/30 px-2.5 py-1 rounded-lg"
      >
        {copied ? <Check size={11} className="text-emerald-400" /> : <Copy size={11} />}
        {copied ? 'Copied' : 'Copy'}
      </button>
    </div>
  )
}

export default function ReceivePage() {
  const [method, setMethod] = useState<ReceiveMethod>('p2p')
  const [selectedAccount, setSelectedAccount] = useState(mockAccounts[0])
  const [selectedPlatform, setSelectedPlatform] = useState(PLATFORMS[0])

  return (
    <div className="p-8 max-w-lg mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-semibold text-white">Receive Money</h1>
        <p className="text-white/40 text-sm mt-1">Share your details to receive funds.</p>
      </div>

      {/* Method tabs */}
      <div className="grid grid-cols-3 gap-2">
        {METHODS.map((m) => (
          <button
            key={m.id}
            onClick={() => setMethod(m.id)}
            className={cn(
              'rounded-xl p-3 text-center transition-all border',
              method === m.id
                ? 'bg-violet-600/20 border-violet-500/40 text-violet-300'
                : 'glass border-white/5 text-white/40 hover:text-white/70 hover:bg-white/5'
            )}
          >
            <div className="text-xl mb-1">{m.icon}</div>
            <div className="text-xs font-medium">{m.label}</div>
          </button>
        ))}
      </div>

      {/* P2P */}
      {method === 'p2p' && (
        <div className="space-y-5">
          {/* QR Code placeholder */}
          <div className="glass rounded-2xl p-8 flex flex-col items-center gap-4">
            <div className="w-40 h-40 bg-white/5 rounded-xl border-2 border-dashed border-white/10 flex flex-col items-center justify-center gap-2 text-white/20">
              <QrCode size={48} />
              <span className="text-xs">@{mockUser.name.split(' ')[0].toLowerCase()}</span>
            </div>
            <div className="text-center">
              <p className="text-white font-medium">@{mockUser.name.split(' ')[0].toLowerCase()}</p>
              <p className="text-white/40 text-xs mt-0.5">Awake username</p>
            </div>
            <button className="text-violet-400 text-sm border border-violet-400/30 px-4 py-2 rounded-xl hover:bg-violet-400/10 transition-colors flex items-center gap-2">
              <Copy size={14} /> Share link
            </button>
          </div>

          {/* Account selector for wallet address */}
          <div>
            <p className="text-white/50 text-xs uppercase tracking-wider mb-2">Or share account details</p>
            <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
              {mockAccounts.map((acc) => (
                <button
                  key={acc.id}
                  onClick={() => setSelectedAccount(acc)}
                  className={cn(
                    'shrink-0 px-3 py-2 rounded-xl text-xs font-medium border transition-all',
                    selectedAccount.id === acc.id
                      ? 'bg-violet-600/20 text-violet-300 border-violet-500/40'
                      : 'bg-white/5 text-white/50 border-white/10 hover:text-white/80'
                  )}
                >
                  {selectedAccount.flag} {acc.currency}
                </button>
              ))}
            </div>
          </div>

          <div className="glass rounded-2xl p-5">
            {selectedAccount.iban && <CopyField label="IBAN" value={selectedAccount.iban} />}
            {selectedAccount.walletAddress && <CopyField label="Wallet Address" value={selectedAccount.walletAddress} />}
            <CopyField label="Account holder" value={mockUser.name} />
          </div>
        </div>
      )}

      {/* Bank Transfer */}
      {method === 'bank' && (
        <div className="space-y-4">
          <p className="text-white/50 text-xs uppercase tracking-wider">Select account</p>
          <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
            {mockAccounts.filter((a) => a.iban).map((acc) => (
              <button
                key={acc.id}
                onClick={() => setSelectedAccount(acc)}
                className={cn(
                  'shrink-0 px-3 py-2 rounded-xl text-xs font-medium border transition-all',
                  selectedAccount.id === acc.id
                    ? 'bg-violet-600/20 text-violet-300 border-violet-500/40'
                    : 'bg-white/5 text-white/50 border-white/10'
                )}
              >
                {acc.flag} {acc.currency}
              </button>
            ))}
          </div>
          <div className="glass rounded-2xl p-5">
            <p className="text-white font-medium mb-4">{selectedAccount.name} Account Details</p>
            {selectedAccount.iban && <CopyField label="IBAN" value={selectedAccount.iban} />}
            <CopyField label="Account Holder" value={mockUser.name} />
            <CopyField label="BIC / SWIFT" value="AWAKEUS33" />
            <CopyField label="Bank Name" value="Awake Financial" />
          </div>
          <div className="glass rounded-xl p-4 flex items-center gap-3">
            <span className="text-xl">⚡</span>
            <div>
              <p className="text-white text-sm font-medium">SEPA transfers: instant</p>
              <p className="text-white/40 text-xs">SWIFT: 1–3 business days · Crypto: ~seconds</p>
            </div>
          </div>
        </div>
      )}

      {/* From Employer / Platform */}
      {method === 'employer' && (
        <div className="space-y-4">
          <p className="text-white/50 text-xs uppercase tracking-wider">Select platform</p>
          <div className="grid grid-cols-2 gap-3">
            {PLATFORMS.map((p) => (
              <button
                key={p.name}
                onClick={() => setSelectedPlatform(p)}
                className={cn(
                  'p-4 rounded-xl border text-left transition-all',
                  selectedPlatform.name === p.name
                    ? 'border-violet-500/40 bg-violet-600/10'
                    : 'border-white/10 bg-white/5 hover:border-white/20'
                )}
              >
                <div className="text-2xl mb-2">{p.icon}</div>
                <p className={cn('text-sm font-medium', selectedPlatform.name === p.name ? 'text-violet-300' : 'text-white/80')}>{p.name}</p>
                <p className="text-white/30 text-xs">{p.currency}</p>
              </button>
            ))}
          </div>
          <div className="glass rounded-2xl p-5 space-y-3">
            <p className="text-white font-medium text-sm">How to receive from {selectedPlatform.name}</p>
            <p className="text-white/50 text-sm">{selectedPlatform.instructions}</p>
            {selectedPlatform.currency === 'USD' && mockAccounts[0].iban && (
              <CopyField label="Your USD IBAN" value={mockAccounts[0].iban} />
            )}
            {selectedPlatform.currency === 'EUR' && mockAccounts[1].iban && (
              <CopyField label="Your EUR IBAN" value={mockAccounts[1].iban} />
            )}
          </div>
        </div>
      )}
    </div>
  )
}
