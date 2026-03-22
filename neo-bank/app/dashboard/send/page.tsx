'use client'

import { useState } from 'react'
import { mockAccounts, mockContacts } from '@/lib/mock-data'
import { cn } from '@/lib/utils'
import { ArrowLeft, ChevronRight, Building2, User, Bitcoin } from 'lucide-react'

type Step = 'method' | 'recipient' | 'amount' | 'confirm' | 'success'
type SendMethod = 'awake' | 'bank' | 'crypto'

const SEND_METHODS = [
  { id: 'awake' as const, label: 'Awake User', icon: User, desc: 'Send instantly to any Awake user', color: 'text-violet-400' },
  { id: 'bank' as const, label: 'Bank Account', icon: Building2, desc: 'Wire to any bank account (SEPA / SWIFT)', color: 'text-blue-400' },
  { id: 'crypto' as const, label: 'Crypto Wallet', icon: Bitcoin, desc: 'Send to any wallet address', color: 'text-amber-400' },
]

function Row({ label, value, highlight, color }: { label: string; value: string; highlight?: boolean; color?: string }) {
  return (
    <div className="flex justify-between items-center py-2 border-b border-white/5 last:border-0">
      <span className="text-white/40 text-sm">{label}</span>
      <span className={cn('text-sm', highlight ? 'text-white font-semibold text-base' : color ?? 'text-white/80')}>{value}</span>
    </div>
  )
}

export default function SendPage() {
  const [step, setStep] = useState<Step>('method')
  const [method, setMethod] = useState<SendMethod | null>(null)
  const [selectedContact, setSelectedContact] = useState<typeof mockContacts[0] | null>(null)
  const [recipientInput, setRecipientInput] = useState('')
  const [selectedCurrency, setSelectedCurrency] = useState(mockAccounts[0])
  const [amount, setAmount] = useState('')
  const [note, setNote] = useState('')

  const parsedAmount = parseFloat(amount) || 0
  const isValidAmount = parsedAmount > 0 && parsedAmount <= selectedCurrency.balance

  function reset() {
    setStep('method')
    setMethod(null)
    setSelectedContact(null)
    setRecipientInput('')
    setAmount('')
    setNote('')
  }

  if (step === 'success') {
    return (
      <div className="p-8 max-w-lg mx-auto flex flex-col items-center justify-center min-h-[60vh] text-center space-y-6">
        <div className="w-20 h-20 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-4xl">
          ✓
        </div>
        <div>
          <h2 className="text-2xl font-semibold text-white">Sent!</h2>
          <p className="text-white/50 mt-2">
            {selectedCurrency.symbol}{parsedAmount.toFixed(2)} {selectedCurrency.currency} sent successfully.
          </p>
        </div>
        <div className="glass rounded-2xl p-5 w-full text-left space-y-1">
          <Row label="To" value={selectedContact?.name ?? recipientInput} />
          <Row label="Amount" value={`${selectedCurrency.symbol}${parsedAmount.toFixed(2)} ${selectedCurrency.currency}`} highlight />
          <Row label="Fee" value="Free" color="text-emerald-400" />
          <Row label="Note" value={note || '—'} />
          <Row label="Status" value="Completed" color="text-emerald-400" />
        </div>
        <button onClick={reset} className="w-full py-3 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-medium transition-colors">
          New Transfer
        </button>
      </div>
    )
  }

  if (step === 'confirm') {
    return (
      <div className="p-8 max-w-lg mx-auto space-y-6">
        <button onClick={() => setStep('amount')} className="flex items-center gap-1.5 text-white/40 text-sm hover:text-white/70 transition-colors">
          <ArrowLeft size={14} /> Back
        </button>
        <h1 className="text-2xl font-semibold text-white">Confirm Transfer</h1>
        <div className="glass rounded-2xl p-6 space-y-1">
          <Row label="To" value={selectedContact?.name ?? recipientInput} />
          <Row label="Amount" value={`${selectedCurrency.symbol}${parsedAmount.toFixed(2)} ${selectedCurrency.currency}`} highlight />
          <Row label="From" value={`${selectedCurrency.name} account`} />
          <Row label="Fee" value="Free" color="text-emerald-400" />
          <Row label="Note" value={note || '—'} />
        </div>
        <div className="flex gap-3">
          <button onClick={() => setStep('amount')} className="flex-1 py-3 rounded-xl bg-white/5 text-white/70 font-medium hover:bg-white/10 transition-colors">
            Back
          </button>
          <button onClick={() => setStep('success')} className="flex-1 py-3 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-medium transition-colors">
            Send Money
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="p-8 max-w-lg mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-semibold text-white">Send Money</h1>
        <p className="text-white/40 text-sm mt-1">Transfer funds instantly, anywhere.</p>
      </div>

      {/* Step 1: Method */}
      {step === 'method' && (
        <div className="space-y-3">
          <p className="text-white/50 text-xs uppercase tracking-wider">Choose method</p>
          {SEND_METHODS.map((m) => {
            const Icon = m.icon
            return (
              <button
                key={m.id}
                onClick={() => { setMethod(m.id); setStep('recipient') }}
                className="w-full glass glass-hover rounded-xl p-4 flex items-center gap-4 text-left transition-all"
              >
                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center shrink-0">
                  <Icon size={18} className={m.color} />
                </div>
                <div className="flex-1">
                  <p className="text-white font-medium text-sm">{m.label}</p>
                  <p className="text-white/40 text-xs">{m.desc}</p>
                </div>
                <ChevronRight size={16} className="text-white/20" />
              </button>
            )
          })}
        </div>
      )}

      {/* Step 2: Recipient */}
      {step === 'recipient' && (
        <div className="space-y-5">
          <button onClick={() => setStep('method')} className="flex items-center gap-1.5 text-white/40 text-sm hover:text-white/70 transition-colors">
            <ArrowLeft size={14} /> Back
          </button>

          {method === 'awake' && (
            <div className="space-y-3">
              <p className="text-white/50 text-xs uppercase tracking-wider">Select recipient</p>
              <div className="grid grid-cols-2 gap-3">
                {mockContacts.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => { setSelectedContact(c); setStep('amount') }}
                    className="glass glass-hover rounded-xl p-4 flex flex-col items-center gap-2 transition-all"
                  >
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-white font-semibold text-sm">
                      {c.avatar}
                    </div>
                    <p className="text-white text-sm font-medium">{c.name}</p>
                    <p className="text-white/40 text-xs">{c.handle}</p>
                  </button>
                ))}
              </div>
              <div className="relative">
                <input
                  placeholder="Or enter username / handle"
                  value={recipientInput}
                  onChange={(e) => setRecipientInput(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder-white/20 outline-none focus:border-violet-500/50 transition-colors"
                />
              </div>
              {recipientInput && (
                <button onClick={() => setStep('amount')} className="w-full py-3 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-medium transition-colors">
                  Continue
                </button>
              )}
            </div>
          )}

          {(method === 'bank' || method === 'crypto') && (
            <div className="space-y-3">
              <p className="text-white/50 text-xs uppercase tracking-wider">
                {method === 'bank' ? 'Bank account details' : 'Wallet address'}
              </p>
              {method === 'bank' ? (
                <>
                  <input placeholder="Recipient name" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder-white/20 outline-none focus:border-violet-500/50 transition-colors" />
                  <input
                    placeholder="IBAN or account number"
                    value={recipientInput}
                    onChange={(e) => setRecipientInput(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder-white/20 outline-none focus:border-violet-500/50 transition-colors"
                  />
                  <input placeholder="BIC / SWIFT (optional)" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder-white/20 outline-none focus:border-violet-500/50 transition-colors" />
                </>
              ) : (
                <input
                  placeholder="0x... or bc1q..."
                  value={recipientInput}
                  onChange={(e) => setRecipientInput(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm font-mono placeholder-white/20 outline-none focus:border-violet-500/50 transition-colors"
                />
              )}
              <button
                onClick={() => setStep('amount')}
                disabled={!recipientInput}
                className="w-full py-3 rounded-xl bg-violet-600 hover:bg-violet-500 disabled:opacity-30 text-white font-medium transition-colors"
              >
                Continue
              </button>
            </div>
          )}
        </div>
      )}

      {/* Step 3: Amount */}
      {step === 'amount' && (
        <div className="space-y-5">
          <button onClick={() => setStep('recipient')} className="flex items-center gap-1.5 text-white/40 text-sm hover:text-white/70 transition-colors">
            <ArrowLeft size={14} /> Back
          </button>

          {/* Currency selector */}
          <div>
            <p className="text-white/50 text-xs uppercase tracking-wider mb-2">From account</p>
            <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
              {mockAccounts.map((acc) => (
                <button
                  key={acc.id}
                  onClick={() => setSelectedCurrency(acc)}
                  className={cn(
                    'shrink-0 px-3 py-2 rounded-xl text-xs font-medium border transition-all',
                    selectedCurrency.id === acc.id
                      ? 'bg-violet-600/20 text-violet-300 border-violet-500/40'
                      : 'bg-white/5 text-white/50 border-white/10 hover:text-white/80'
                  )}
                >
                  {acc.flag} {acc.currency}
                </button>
              ))}
            </div>
          </div>

          <div className="glass rounded-2xl p-6 space-y-4">
            <div className="text-center">
              <div className="flex items-center justify-center gap-2">
                <span className="text-3xl text-white/40">{selectedCurrency.symbol}</span>
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
                Available: {selectedCurrency.symbol}{selectedCurrency.balance.toLocaleString()} {selectedCurrency.currency}
              </p>
              {parsedAmount > selectedCurrency.balance && (
                <p className="text-red-400 text-xs mt-1">Insufficient balance</p>
              )}
            </div>
            <div className="flex gap-2 justify-center">
              {[25, 50, 100, 250].map((q) => (
                <button
                  key={q}
                  onClick={() => setAmount(q.toString())}
                  className="px-3 py-1.5 rounded-lg bg-white/5 text-white/50 text-xs hover:bg-white/10 hover:text-white transition-all"
                >
                  {selectedCurrency.symbol}{q}
                </button>
              ))}
            </div>
          </div>

          <input
            type="text"
            placeholder="Add a note (optional)"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder-white/20 outline-none focus:border-violet-500/50 transition-colors"
          />

          <button
            onClick={() => setStep('confirm')}
            disabled={!isValidAmount}
            className="w-full py-3 rounded-xl bg-violet-600 hover:bg-violet-500 disabled:opacity-30 disabled:cursor-not-allowed text-white font-medium transition-colors"
          >
            Review Transfer
          </button>
        </div>
      )}
    </div>
  )
}
