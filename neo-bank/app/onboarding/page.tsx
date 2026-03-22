'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Check, ChevronRight, ArrowLeft, Shield, Globe, Briefcase, Zap } from 'lucide-react'
import { cn } from '@/lib/utils'

type Step = 1 | 2 | 3 | 4 | 5

const STEPS = [
  { label: 'Account', icon: '📧' },
  { label: 'Identity', icon: '🪪' },
  { label: 'Residency', icon: '🌍' },
  { label: 'Income', icon: '💼' },
  { label: 'Welcome', icon: '🎉' },
]

const COUNTRIES = [
  'United States', 'Spain', 'Germany', 'France', 'United Kingdom',
  'Portugal', 'Italy', 'Mexico', 'Argentina', 'Colombia',
  'Brazil', 'Canada', 'Australia', 'Netherlands', 'Switzerland',
]

const INCOME_SOURCES = [
  { id: 'freelance', label: 'Freelance / Remote Job', icon: '💻', desc: 'Upwork, Toptal, remote contracts' },
  { id: 'platform', label: 'Platform Income', icon: '📱', desc: 'Deel, Remote.com, Oyster' },
  { id: 'crypto', label: 'Crypto / Web3', icon: '🔗', desc: 'DeFi, NFTs, protocol income' },
  { id: 'business', label: 'Business Owner', icon: '🏢', desc: 'Your own company or startup' },
  { id: 'employment', label: 'Employed', icon: '👔', desc: 'Local employer in country of residence' },
  { id: 'investments', label: 'Investments', icon: '📈', desc: 'Dividends, trading, passive income' },
]

export default function OnboardingPage() {
  const router = useRouter()
  const [step, setStep] = useState<Step>(1)
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [idType, setIdType] = useState<'passport' | 'national_id' | null>(null)
  const [nationality, setNationality] = useState('')
  const [residence, setResidence] = useState('')
  const [taxResidency, setTaxResidency] = useState('')
  const [incomeSource, setIncomeSource] = useState('')

  function next() {
    if (step < 5) setStep((s) => (s + 1) as Step)
  }
  function back() {
    if (step > 1) setStep((s) => (s - 1) as Step)
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6" style={{ background: 'var(--background)' }}>
      {/* Logo */}
      <div className="flex items-center gap-2 mb-10">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-white font-bold">
          A
        </div>
        <span className="text-xl font-semibold text-white">Awake</span>
      </div>

      {/* Progress bar */}
      <div className="w-full max-w-md mb-8">
        <div className="flex items-center justify-between mb-3">
          {STEPS.map((s, i) => {
            const num = i + 1
            const done = step > num
            const active = step === num
            return (
              <div key={s.label} className="flex flex-col items-center gap-1">
                <div
                  className={cn(
                    'w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold transition-all',
                    done ? 'bg-violet-600 text-white' :
                    active ? 'bg-violet-600/30 text-violet-300 border border-violet-500/50' :
                    'bg-white/5 text-white/30 border border-white/10'
                  )}
                >
                  {done ? <Check size={14} /> : s.icon}
                </div>
                <span className={cn('text-[10px]', active ? 'text-violet-300' : 'text-white/30')}>{s.label}</span>
              </div>
            )
          })}
        </div>
        <div className="h-1 bg-white/5 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-violet-600 to-indigo-500 rounded-full transition-all duration-500"
            style={{ width: `${((step - 1) / 4) * 100}%` }}
          />
        </div>
      </div>

      {/* Card */}
      <div className="w-full max-w-md glass rounded-2xl p-8">
        {/* Step 1: Email / Phone */}
        {step === 1 && (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-semibold text-white">Create your account</h1>
              <p className="text-white/40 text-sm mt-1">Start your global financial journey.</p>
            </div>
            <div className="space-y-3">
              <div>
                <label className="text-white/50 text-xs uppercase tracking-wide mb-1.5 block">Email address</label>
                <input
                  type="email"
                  placeholder="you@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder-white/20 outline-none focus:border-violet-500/50 transition-colors"
                />
              </div>
              <div>
                <label className="text-white/50 text-xs uppercase tracking-wide mb-1.5 block">Phone number</label>
                <input
                  type="tel"
                  placeholder="+1 (555) 000-0000"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder-white/20 outline-none focus:border-violet-500/50 transition-colors"
                />
              </div>
            </div>
            <div className="flex items-start gap-2 text-xs text-white/30">
              <Shield size={12} className="shrink-0 mt-0.5" />
              <span>Your data is encrypted and never shared with third parties.</span>
            </div>
            <button
              onClick={next}
              disabled={!email || !phone}
              className="w-full py-3 rounded-xl bg-violet-600 hover:bg-violet-500 disabled:opacity-30 disabled:cursor-not-allowed text-white font-medium transition-colors flex items-center justify-center gap-2"
            >
              Continue <ChevronRight size={16} />
            </button>
          </div>
        )}

        {/* Step 2: Identity Verification */}
        {step === 2 && (
          <div className="space-y-6">
            <button onClick={back} className="flex items-center gap-1.5 text-white/40 text-sm hover:text-white/70 transition-colors">
              <ArrowLeft size={14} /> Back
            </button>
            <div>
              <h1 className="text-2xl font-semibold text-white">Verify your identity</h1>
              <p className="text-white/40 text-sm mt-1">We're required by law to verify who you are.</p>
            </div>
            <div className="space-y-3">
              <div>
                <label className="text-white/50 text-xs uppercase tracking-wide mb-1.5 block">First name</label>
                <input
                  type="text"
                  placeholder="Alex"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder-white/20 outline-none focus:border-violet-500/50 transition-colors"
                />
              </div>
              <div>
                <label className="text-white/50 text-xs uppercase tracking-wide mb-1.5 block">Last name</label>
                <input
                  type="text"
                  placeholder="Johnson"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder-white/20 outline-none focus:border-violet-500/50 transition-colors"
                />
              </div>
            </div>
            <div>
              <label className="text-white/50 text-xs uppercase tracking-wide mb-2 block">ID Document</label>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { id: 'passport' as const, label: 'Passport', icon: '🛂' },
                  { id: 'national_id' as const, label: 'National ID', icon: '🪪' },
                ].map((doc) => (
                  <button
                    key={doc.id}
                    onClick={() => setIdType(doc.id)}
                    className={cn(
                      'p-4 rounded-xl border text-left transition-all',
                      idType === doc.id
                        ? 'border-violet-500/50 bg-violet-600/10 text-white'
                        : 'border-white/10 bg-white/5 text-white/50 hover:text-white/80 hover:border-white/20'
                    )}
                  >
                    <div className="text-2xl mb-1">{doc.icon}</div>
                    <div className="text-sm font-medium">{doc.label}</div>
                  </button>
                ))}
              </div>
            </div>
            {idType && (
              <div className="glass rounded-xl p-4 flex items-center gap-3 border border-dashed border-white/20">
                <div className="text-2xl">📎</div>
                <div>
                  <p className="text-white text-sm font-medium">Upload document</p>
                  <p className="text-white/40 text-xs">JPG, PNG or PDF · Max 10MB</p>
                </div>
                <button className="ml-auto text-violet-400 text-xs border border-violet-400/30 px-3 py-1.5 rounded-lg hover:bg-violet-400/10 transition-colors">
                  Choose file
                </button>
              </div>
            )}
            <button
              onClick={next}
              disabled={!firstName || !lastName || !idType}
              className="w-full py-3 rounded-xl bg-violet-600 hover:bg-violet-500 disabled:opacity-30 disabled:cursor-not-allowed text-white font-medium transition-colors flex items-center justify-center gap-2"
            >
              Continue <ChevronRight size={16} />
            </button>
          </div>
        )}

        {/* Step 3: Residency & Tax */}
        {step === 3 && (
          <div className="space-y-6">
            <button onClick={back} className="flex items-center gap-1.5 text-white/40 text-sm hover:text-white/70 transition-colors">
              <ArrowLeft size={14} /> Back
            </button>
            <div>
              <h1 className="text-2xl font-semibold text-white">Mobility profile</h1>
              <p className="text-white/40 text-sm mt-1">Help us understand your financial footprint.</p>
            </div>
            <div className="space-y-3">
              <div>
                <label className="text-white/50 text-xs uppercase tracking-wide mb-1.5 block flex items-center gap-1">
                  <Globe size={10} /> Nationality
                </label>
                <select
                  value={nationality}
                  onChange={(e) => setNationality(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-violet-500/50 transition-colors"
                >
                  <option value="" className="bg-[#0d0d14]">Select nationality…</option>
                  {COUNTRIES.map((c) => <option key={c} value={c} className="bg-[#0d0d14]">{c}</option>)}
                </select>
              </div>
              <div>
                <label className="text-white/50 text-xs uppercase tracking-wide mb-1.5 block">Country of residence</label>
                <select
                  value={residence}
                  onChange={(e) => setResidence(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-violet-500/50 transition-colors"
                >
                  <option value="" className="bg-[#0d0d14]">Select residence…</option>
                  {COUNTRIES.map((c) => <option key={c} value={c} className="bg-[#0d0d14]">{c}</option>)}
                </select>
              </div>
              <div>
                <label className="text-white/50 text-xs uppercase tracking-wide mb-1.5 block">Tax residency</label>
                <select
                  value={taxResidency}
                  onChange={(e) => setTaxResidency(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-violet-500/50 transition-colors"
                >
                  <option value="" className="bg-[#0d0d14]">Select tax residency…</option>
                  {COUNTRIES.map((c) => <option key={c} value={c} className="bg-[#0d0d14]">{c}</option>)}
                </select>
              </div>
            </div>
            <button
              onClick={next}
              disabled={!nationality || !residence || !taxResidency}
              className="w-full py-3 rounded-xl bg-violet-600 hover:bg-violet-500 disabled:opacity-30 disabled:cursor-not-allowed text-white font-medium transition-colors flex items-center justify-center gap-2"
            >
              Continue <ChevronRight size={16} />
            </button>
          </div>
        )}

        {/* Step 4: Income Source */}
        {step === 4 && (
          <div className="space-y-6">
            <button onClick={back} className="flex items-center gap-1.5 text-white/40 text-sm hover:text-white/70 transition-colors">
              <ArrowLeft size={14} /> Back
            </button>
            <div>
              <h1 className="text-2xl font-semibold text-white">Income sources</h1>
              <p className="text-white/40 text-sm mt-1">How do you primarily earn money?</p>
            </div>
            <div className="grid grid-cols-2 gap-2.5">
              {INCOME_SOURCES.map((src) => (
                <button
                  key={src.id}
                  onClick={() => setIncomeSource(src.id)}
                  className={cn(
                    'p-4 rounded-xl border text-left transition-all',
                    incomeSource === src.id
                      ? 'border-violet-500/50 bg-violet-600/10'
                      : 'border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/8'
                  )}
                >
                  <div className="text-xl mb-2">{src.icon}</div>
                  <div className={cn('text-sm font-medium mb-0.5', incomeSource === src.id ? 'text-violet-300' : 'text-white/80')}>
                    {src.label}
                  </div>
                  <div className="text-xs text-white/30">{src.desc}</div>
                </button>
              ))}
            </div>
            <button
              onClick={next}
              disabled={!incomeSource}
              className="w-full py-3 rounded-xl bg-violet-600 hover:bg-violet-500 disabled:opacity-30 disabled:cursor-not-allowed text-white font-medium transition-colors flex items-center justify-center gap-2"
            >
              Continue <ChevronRight size={16} />
            </button>
          </div>
        )}

        {/* Step 5: Welcome */}
        {step === 5 && (
          <div className="space-y-6 text-center">
            <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-4xl">
              🎉
            </div>
            <div>
              <h1 className="text-2xl font-semibold text-white">You're all set!</h1>
              <p className="text-white/40 text-sm mt-2">
                Welcome to Awake, {firstName || 'Alex'}. Your account is ready.
              </p>
            </div>
            <div className="grid grid-cols-3 gap-3 text-left">
              {[
                { icon: <Zap size={16} className="text-violet-400" />, label: 'Instant transfers', sub: 'Send globally' },
                { icon: <Globe size={16} className="text-blue-400" />, label: 'Multi-currency', sub: 'USD, EUR, BTC' },
                { icon: <Briefcase size={16} className="text-emerald-400" />, label: 'Smart savings', sub: '4.8% APY' },
              ].map((feat) => (
                <div key={feat.label} className="glass rounded-xl p-3">
                  <div className="mb-2">{feat.icon}</div>
                  <div className="text-white text-xs font-semibold">{feat.label}</div>
                  <div className="text-white/30 text-xs">{feat.sub}</div>
                </div>
              ))}
            </div>
            <button
              onClick={() => router.push('/dashboard')}
              className="w-full py-3 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-semibold transition-colors flex items-center justify-center gap-2"
            >
              Enter Awake <ChevronRight size={16} />
            </button>
          </div>
        )}
      </div>

      <p className="text-white/20 text-xs mt-6">
        Prototype · Not a real financial product
      </p>
    </div>
  )
}
