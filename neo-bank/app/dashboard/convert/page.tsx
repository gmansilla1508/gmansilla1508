'use client'

import { useState, useEffect } from 'react'
import { mockAccounts, mockFxRates, mockFxDisplayRates, type CurrencyCode } from '@/lib/mock-data'
import { ArrowLeftRight, TrendingUp, TrendingDown } from 'lucide-react'
import { cn } from '@/lib/utils'

function getRate(from: CurrencyCode, to: CurrencyCode): number {
  const fromUsd = 1 / mockFxRates[from]
  const toRate = mockFxRates[to]
  return fromUsd * toRate
}

export default function ConvertPage() {
  const [fromCurrency, setFromCurrency] = useState<CurrencyCode>('USD')
  const [toCurrency, setToCurrency] = useState<CurrencyCode>('EUR')
  const [fromAmount, setFromAmount] = useState('')
  const [step, setStep] = useState<'input' | 'confirm' | 'success'>('input')

  const fromAccount = mockAccounts.find((a) => a.currency === fromCurrency)
  const toAccount = mockAccounts.find((a) => a.currency === toCurrency)
  const rate = getRate(fromCurrency, toCurrency)
  const parsedFrom = parseFloat(fromAmount) || 0
  const toAmount = parsedFrom * rate
  const isValid = parsedFrom > 0 && fromAccount && parsedFrom <= fromAccount.balance && fromCurrency !== toCurrency

  function swap() {
    setFromCurrency(toCurrency)
    setToCurrency(fromCurrency)
    setFromAmount('')
  }

  const CURRENCY_OPTIONS = mockAccounts.map((a) => a.currency)

  if (step === 'success') {
    return (
      <div className="p-8 max-w-lg mx-auto flex flex-col items-center justify-center min-h-[60vh] text-center space-y-6">
        <div className="w-20 h-20 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-4xl">🔄</div>
        <div>
          <h2 className="text-2xl font-semibold text-white">Converted!</h2>
          <p className="text-white/50 mt-2">
            {parsedFrom.toFixed(4)} {fromCurrency} → {toAmount.toFixed(4)} {toCurrency}
          </p>
        </div>
        <div className="glass rounded-2xl p-5 w-full text-left space-y-2">
          <InfoRow label="From" value={`${parsedFrom.toFixed(2)} ${fromCurrency}`} />
          <InfoRow label="To" value={`${toAmount.toFixed(4)} ${toCurrency}`} highlight />
          <InfoRow label="Rate" value={`1 ${fromCurrency} = ${rate.toFixed(4)} ${toCurrency}`} />
          <InfoRow label="Fee" value="Free" color="text-emerald-400" />
        </div>
        <button
          onClick={() => { setStep('input'); setFromAmount('') }}
          className="w-full py-3 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-medium transition-colors"
        >
          New Conversion
        </button>
      </div>
    )
  }

  if (step === 'confirm') {
    return (
      <div className="p-8 max-w-lg mx-auto space-y-6">
        <h1 className="text-2xl font-semibold text-white">Confirm Conversion</h1>
        <div className="glass rounded-2xl p-6 space-y-2">
          <InfoRow label="You send" value={`${parsedFrom.toFixed(2)} ${fromCurrency}`} highlight />
          <InfoRow label="You receive" value={`${toAmount.toFixed(4)} ${toCurrency}`} highlight />
          <InfoRow label="Rate" value={`1 ${fromCurrency} = ${rate.toFixed(4)} ${toCurrency}`} />
          <InfoRow label="Fee" value="Free" color="text-emerald-400" />
          <InfoRow label="Estimated time" value="Instant" color="text-emerald-400" />
        </div>
        <div className="flex gap-3">
          <button onClick={() => setStep('input')} className="flex-1 py-3 rounded-xl bg-white/5 text-white/70 hover:bg-white/10 font-medium transition-colors">
            Back
          </button>
          <button onClick={() => setStep('success')} className="flex-1 py-3 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-medium transition-colors">
            Confirm
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="p-8 max-w-lg mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-semibold text-white">Convert</h1>
        <p className="text-white/40 text-sm mt-1">Exchange currencies at real-time rates.</p>
      </div>

      {/* Converter */}
      <div className="glass rounded-2xl p-6 space-y-3">
        {/* From */}
        <div className="bg-white/5 rounded-xl p-4 space-y-2">
          <div className="flex justify-between items-center">
            <label className="text-white/40 text-xs uppercase tracking-wide">From</label>
            {fromAccount && (
              <span className="text-white/30 text-xs">
                Balance: {fromAccount.symbol}{fromAccount.balance.toLocaleString()}
              </span>
            )}
          </div>
          <div className="flex items-center gap-3">
            <select
              value={fromCurrency}
              onChange={(e) => setFromCurrency(e.target.value as CurrencyCode)}
              className="bg-transparent text-white font-semibold text-lg outline-none cursor-pointer"
            >
              {CURRENCY_OPTIONS.map((c) => (
                <option key={c} value={c} className="bg-[#0d0d14]">{c}</option>
              ))}
            </select>
            <input
              type="number"
              placeholder="0.00"
              value={fromAmount}
              onChange={(e) => setFromAmount(e.target.value)}
              className="flex-1 bg-transparent text-right text-white text-2xl font-bold outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              autoFocus
            />
          </div>
        </div>

        {/* Swap button */}
        <div className="flex justify-center">
          <button
            onClick={swap}
            className="w-10 h-10 rounded-xl glass flex items-center justify-center hover:bg-violet-600/20 transition-all text-white/40 hover:text-violet-400"
          >
            <ArrowLeftRight size={16} />
          </button>
        </div>

        {/* To */}
        <div className="bg-white/5 rounded-xl p-4 space-y-2">
          <div className="flex justify-between items-center">
            <label className="text-white/40 text-xs uppercase tracking-wide">To</label>
            {toAccount && (
              <span className="text-white/30 text-xs">
                Balance: {toAccount.symbol}{toAccount.balance.toLocaleString()}
              </span>
            )}
          </div>
          <div className="flex items-center gap-3">
            <select
              value={toCurrency}
              onChange={(e) => setToCurrency(e.target.value as CurrencyCode)}
              className="bg-transparent text-white font-semibold text-lg outline-none cursor-pointer"
            >
              {CURRENCY_OPTIONS.map((c) => (
                <option key={c} value={c} className="bg-[#0d0d14]">{c}</option>
              ))}
            </select>
            <div className="flex-1 text-right text-white/60 text-2xl font-bold">
              {toAmount > 0 ? toAmount.toFixed(4) : '—'}
            </div>
          </div>
        </div>

        {/* Rate indicator */}
        {fromCurrency !== toCurrency && (
          <div className="flex justify-center">
            <span className="text-white/30 text-xs">
              1 {fromCurrency} = {rate.toFixed(6)} {toCurrency}
            </span>
          </div>
        )}

        {parsedFrom > 0 && fromAccount && parsedFrom > fromAccount.balance && (
          <p className="text-red-400 text-xs text-center">Insufficient balance</p>
        )}
        {fromCurrency === toCurrency && (
          <p className="text-amber-400 text-xs text-center">Select different currencies</p>
        )}

        <button
          onClick={() => setStep('confirm')}
          disabled={!isValid}
          className="w-full py-3 rounded-xl bg-violet-600 hover:bg-violet-500 disabled:opacity-30 disabled:cursor-not-allowed text-white font-medium transition-colors mt-2"
        >
          Review Conversion
        </button>
      </div>

      {/* Live rates */}
      <div className="glass rounded-2xl p-5">
        <h2 className="text-white font-semibold mb-4 text-sm">Live Rates</h2>
        <div className="space-y-3">
          {mockFxDisplayRates.map((r) => (
            <div key={r.pair} className="flex items-center justify-between">
              <div>
                <p className="text-white/80 text-sm font-medium">{r.pair}</p>
                <p className="text-white/40 text-xs">{r.rate}</p>
              </div>
              <div className={cn('flex items-center gap-1 text-xs font-medium', r.up ? 'text-emerald-400' : 'text-red-400')}>
                {r.up ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                {r.change}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function InfoRow({ label, value, highlight, color }: { label: string; value: string; highlight?: boolean; color?: string }) {
  return (
    <div className="flex justify-between items-center py-2 border-b border-white/5 last:border-0">
      <span className="text-white/40 text-sm">{label}</span>
      <span className={cn('text-sm', highlight ? 'text-white font-semibold' : color ?? 'text-white/70')}>{value}</span>
    </div>
  )
}
