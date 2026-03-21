'use client'

import { useState } from 'react'
import { mockAccount, mockContacts } from '@/lib/mock-data'
import { formatCurrency } from '@/lib/utils'

type Step = 'select' | 'amount' | 'confirm' | 'success'

export default function TransferPage() {
  const [step, setStep] = useState<Step>('select')
  const [selectedContact, setSelectedContact] = useState<typeof mockContacts[0] | null>(null)
  const [amount, setAmount] = useState('')
  const [note, setNote] = useState('')

  const parsedAmount = parseFloat(amount) || 0
  const isValidAmount = parsedAmount > 0 && parsedAmount <= mockAccount.balance

  function handleSelectContact(contact: typeof mockContacts[0]) {
    setSelectedContact(contact)
    setStep('amount')
  }

  function handleConfirm() {
    setStep('confirm')
  }

  function handleSend() {
    setStep('success')
  }

  function handleReset() {
    setStep('select')
    setSelectedContact(null)
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
          <h2 className="text-2xl font-semibold text-white">Transfer Sent!</h2>
          <p className="text-white/50 mt-2">
            {formatCurrency(parsedAmount)} was sent to {selectedContact?.name}
          </p>
        </div>
        <div className="glass rounded-2xl p-5 w-full text-left space-y-3">
          <Row label="To" value={selectedContact?.name ?? ''} />
          <Row label="Amount" value={formatCurrency(parsedAmount)} highlight />
          <Row label="Note" value={note || '—'} />
          <Row label="Status" value="Completed" color="text-emerald-400" />
        </div>
        <button
          onClick={handleReset}
          className="w-full py-3 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-medium transition-colors"
        >
          New Transfer
        </button>
      </div>
    )
  }

  if (step === 'confirm') {
    return (
      <div className="p-8 max-w-lg mx-auto space-y-6">
        <h1 className="text-2xl font-semibold text-white">Confirm Transfer</h1>
        <div className="glass rounded-2xl p-6 space-y-4">
          <div className="flex items-center gap-4 pb-4 border-b border-white/5">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-white font-semibold">
              {selectedContact?.avatar}
            </div>
            <div>
              <p className="text-white font-medium">{selectedContact?.name}</p>
              <p className="text-white/40 text-sm">{selectedContact?.handle}</p>
            </div>
          </div>
          <Row label="Amount" value={formatCurrency(parsedAmount)} highlight />
          <Row label="From" value={`Checking ${mockAccount.account_number}`} />
          <Row label="Fee" value="Free" color="text-emerald-400" />
          <Row label="Note" value={note || '—'} />
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setStep('amount')}
            className="flex-1 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-white/70 font-medium transition-colors"
          >
            Back
          </button>
          <button
            onClick={handleSend}
            className="flex-1 py-3 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-medium transition-colors"
          >
            Send Money
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="p-8 max-w-lg mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-semibold text-white">Transfer Money</h1>
        <p className="text-white/40 text-sm mt-1">
          Available: {formatCurrency(mockAccount.balance)}
        </p>
      </div>

      {/* Step 1: Select Contact */}
      <div className="space-y-3">
        <h2 className="text-white/60 text-xs uppercase tracking-wider font-medium">
          {step === 'select' ? 'Select Recipient' : 'Recipient'}
        </h2>
        {step === 'select' ? (
          <div className="grid grid-cols-2 gap-3">
            {mockContacts.map((contact) => (
              <button
                key={contact.id}
                onClick={() => handleSelectContact(contact)}
                className="glass glass-hover rounded-xl p-4 flex flex-col items-center gap-2 transition-all"
              >
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-white font-semibold">
                  {contact.avatar}
                </div>
                <p className="text-white text-sm font-medium">{contact.name}</p>
                <p className="text-white/40 text-xs">{contact.handle}</p>
              </button>
            ))}
          </div>
        ) : (
          <div className="glass rounded-xl p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-white font-semibold text-sm">
              {selectedContact?.avatar}
            </div>
            <div className="flex-1">
              <p className="text-white font-medium">{selectedContact?.name}</p>
              <p className="text-white/40 text-xs">{selectedContact?.handle}</p>
            </div>
            <button
              onClick={() => { setStep('select'); setAmount('') }}
              className="text-violet-400 text-xs hover:text-violet-300"
            >
              Change
            </button>
          </div>
        )}
      </div>

      {/* Step 2: Amount */}
      {step === 'amount' && (
        <div className="space-y-4">
          <h2 className="text-white/60 text-xs uppercase tracking-wider font-medium">Amount</h2>
          <div className="glass rounded-2xl p-6 space-y-4">
            <div className="text-center">
              <div className="flex items-center justify-center gap-2">
                <span className="text-3xl text-white/40 font-light">$</span>
                <input
                  type="number"
                  placeholder="0.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="text-5xl font-bold text-white bg-transparent text-center outline-none w-40 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  autoFocus
                />
              </div>
              {parsedAmount > mockAccount.balance && (
                <p className="text-red-400 text-xs mt-2">Insufficient balance</p>
              )}
            </div>

            {/* Quick amounts */}
            <div className="flex gap-2 justify-center">
              {[20, 50, 100, 200].map((q) => (
                <button
                  key={q}
                  onClick={() => setAmount(q.toString())}
                  className="px-3 py-1.5 rounded-lg bg-white/5 text-white/50 text-xs hover:bg-white/10 hover:text-white transition-all"
                >
                  ${q}
                </button>
              ))}
            </div>
          </div>

          <input
            type="text"
            placeholder="Add a note (optional)"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder-white/30 outline-none focus:border-violet-500/50 transition-colors"
          />

          <button
            onClick={handleConfirm}
            disabled={!isValidAmount}
            className="w-full py-3 rounded-xl bg-violet-600 hover:bg-violet-500 disabled:opacity-30 disabled:cursor-not-allowed text-white font-medium transition-colors"
          >
            Continue
          </button>
        </div>
      )}
    </div>
  )
}

function Row({ label, value, highlight, color }: { label: string; value: string; highlight?: boolean; color?: string }) {
  return (
    <div className="flex justify-between items-center">
      <span className="text-white/40 text-sm">{label}</span>
      <span className={`text-sm font-medium ${highlight ? 'text-white text-base font-semibold' : color ?? 'text-white/80'}`}>
        {value}
      </span>
    </div>
  )
}
