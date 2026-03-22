// ─── User ────────────────────────────────────────────────────────────────────
export const mockUser = {
  id: 'user-1',
  name: 'Alex Johnson',
  email: 'alex.johnson@email.com',
  phone: '+1 (555) 234-5678',
  avatar: 'AJ',
  nationality: 'American',
  residence: 'Spain',
  taxResidency: 'United States',
  incomeSource: 'Freelance / Remote Job',
  memberSince: 'January 2025',
  kycStatus: 'verified' as const,
}

// ─── Multicurrency Accounts ───────────────────────────────────────────────────
export type CurrencyCode = 'USD' | 'EUR' | 'USDC' | 'USDT' | 'BTC'

export type Account = {
  id: string
  currency: CurrencyCode
  symbol: string
  name: string
  balance: number
  flag: string
  iban?: string
  walletAddress?: string
  usdValue?: number
}

export const mockAccounts: Account[] = [
  { id: 'acc-usd', currency: 'USD', symbol: '$', name: 'US Dollar', balance: 4250.80, flag: '🇺🇸', iban: 'US12 BANK 0000 0004 5211 234' },
  { id: 'acc-eur', currency: 'EUR', symbol: '€', name: 'Euro', balance: 1830.50, flag: '🇪🇺', iban: 'ES91 2100 0418 4502 0005 1332', usdValue: 1988.24 },
  { id: 'acc-usdc', currency: 'USDC', symbol: '$', name: 'USD Coin', balance: 980.00, flag: '💵', walletAddress: '0x1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f' },
  { id: 'acc-btc', currency: 'BTC', symbol: '₿', name: 'Bitcoin', balance: 0.0181, flag: '₿', walletAddress: 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh', usdValue: 1356.96 },
]

export const mockNetWorth = 8576.00
export const mockMonthlyIncome = 4500.00
export const mockMonthlySpent = 1830.00
export const mockMonthlySaved = 2370.00

// ─── Savings ─────────────────────────────────────────────────────────────────
export const mockSavingsAccount = {
  id: 'sav-1',
  balance: 2370.00,
  currency: 'USD',
  apy: '4.8%',
  apyValue: 4.8,
  yieldEarned: 87.40,
  goal: 5000,
  goalLabel: 'Emergency Fund',
  goalProgress: 47,
}

// ─── FX Rates ─────────────────────────────────────────────────────────────────
export const mockFxRates: Record<CurrencyCode, number> = {
  USD: 1, EUR: 0.918, USDC: 1, USDT: 1, BTC: 0.0000133,
}

export const mockFxDisplayRates = [
  { pair: 'USD / EUR', rate: '1 USD = 0.918 EUR', change: '+0.12%', up: true },
  { pair: 'USD / USDC', rate: '1 USD = 1.000 USDC', change: '0.00%', up: true },
  { pair: 'BTC / USD', rate: '1 BTC = $75,188', change: '+2.34%', up: true },
  { pair: 'EUR / USD', rate: '1 EUR = 1.089 USD', change: '-0.08%', up: false },
]

// ─── Transactions ─────────────────────────────────────────────────────────────
export type TransactionType = 'credit' | 'debit'
export type TransactionCategory =
  | 'Income' | 'Transfer' | 'Subscriptions' | 'Travel'
  | 'Housing' | 'Savings' | 'FX' | 'Food & Drink' | 'Card'

export type Transaction = {
  id: string
  amount: number
  type: TransactionType
  category: TransactionCategory
  description: string
  merchant: string
  icon: string
  currency: CurrencyCode
  created_at: string
}

export const mockTransactions: Transaction[] = [
  { id: 'tx-1', amount: 3400.00, type: 'credit', category: 'Income', description: 'Upwork Payment – Project Alpha', merchant: 'Upwork', icon: '💼', currency: 'USD', created_at: '2026-03-22T09:00:00Z' },
  { id: 'tx-2', amount: 1100.00, type: 'credit', category: 'Income', description: 'Consulting Fee – Deel', merchant: 'Deel', icon: '📊', currency: 'EUR', created_at: '2026-03-20T14:00:00Z' },
  { id: 'tx-3', amount: 250.00, type: 'credit', category: 'Transfer', description: 'Received from Sarah Miller', merchant: 'Sarah Miller', icon: '↩', currency: 'USD', created_at: '2026-03-19T11:30:00Z' },
  { id: 'tx-4', amount: -150.00, type: 'debit', category: 'Transfer', description: 'Sent to James Wilson', merchant: 'James Wilson', icon: '↗', currency: 'USD', created_at: '2026-03-18T16:00:00Z' },
  { id: 'tx-5', amount: -12.99, type: 'debit', category: 'Subscriptions', description: 'Netflix', merchant: 'Netflix', icon: '🎬', currency: 'USD', created_at: '2026-03-17T18:00:00Z' },
  { id: 'tx-6', amount: -9.99, type: 'debit', category: 'Subscriptions', description: 'Spotify Premium', merchant: 'Spotify', icon: '🎵', currency: 'USD', created_at: '2026-03-15T10:00:00Z' },
  { id: 'tx-7', amount: -14.99, type: 'debit', category: 'Subscriptions', description: 'Adobe Creative Cloud', merchant: 'Adobe', icon: '🎨', currency: 'USD', created_at: '2026-03-12T10:00:00Z' },
  { id: 'tx-8', amount: -45.00, type: 'debit', category: 'Travel', description: 'Uber Rides', merchant: 'Uber', icon: '🚗', currency: 'USD', created_at: '2026-03-14T20:15:00Z' },
  { id: 'tx-9', amount: -320.00, type: 'debit', category: 'Travel', description: 'Iberia Flight MAD–BCN', merchant: 'Iberia', icon: '✈️', currency: 'EUR', created_at: '2026-03-10T08:00:00Z' },
  { id: 'tx-10', amount: -950.00, type: 'debit', category: 'Housing', description: 'Monthly Rent', merchant: 'Landlord', icon: '🏠', currency: 'EUR', created_at: '2026-03-08T09:00:00Z' },
  { id: 'tx-11', amount: -120.00, type: 'debit', category: 'Housing', description: 'Electric Bill', merchant: 'Endesa', icon: '⚡', currency: 'EUR', created_at: '2026-03-06T10:00:00Z' },
  { id: 'tx-12', amount: -500.00, type: 'debit', category: 'Savings', description: 'Moved to Savings', merchant: 'Awake Savings', icon: '🏦', currency: 'USD', created_at: '2026-03-05T12:00:00Z' },
  { id: 'tx-13', amount: -200.00, type: 'debit', category: 'FX', description: 'Converted USD → USDC', merchant: 'Awake FX', icon: '🔄', currency: 'USD', created_at: '2026-03-04T14:00:00Z' },
  { id: 'tx-14', amount: 200.00, type: 'credit', category: 'FX', description: 'Received USDC from conversion', merchant: 'Awake FX', icon: '🔄', currency: 'USDC', created_at: '2026-03-04T14:01:00Z' },
  { id: 'tx-15', amount: -64.50, type: 'debit', category: 'Food & Drink', description: 'Mercadona Groceries', merchant: 'Mercadona', icon: '🛒', currency: 'EUR', created_at: '2026-03-03T17:30:00Z' },
  { id: 'tx-16', amount: -8.50, type: 'debit', category: 'Food & Drink', description: 'Coffee & Snacks', merchant: 'Starbucks', icon: '☕', currency: 'USD', created_at: '2026-03-02T08:20:00Z' },
  { id: 'tx-17', amount: -89.99, type: 'debit', category: 'Card', description: 'Amazon Purchase', merchant: 'Amazon', icon: '📦', currency: 'USD', created_at: '2026-03-01T15:45:00Z' },
  { id: 'tx-18', amount: -32.00, type: 'debit', category: 'Card', description: 'Zara – Clothing', merchant: 'Zara', icon: '👕', currency: 'EUR', created_at: '2026-02-28T13:00:00Z' },
]

// ─── Contacts ─────────────────────────────────────────────────────────────────
export const mockContacts = [
  { id: 'c-1', name: 'Sarah Miller', avatar: 'SM', handle: '@sarah' },
  { id: 'c-2', name: 'James Wilson', avatar: 'JW', handle: '@james' },
  { id: 'c-3', name: 'Emma Davis', avatar: 'ED', handle: '@emma' },
  { id: 'c-4', name: 'Ryan Chen', avatar: 'RC', handle: '@ryan' },
]

// ─── Cards ───────────────────────────────────────────────────────────────────
export type CardStatus = 'active' | 'frozen'
export type CardType = 'physical' | 'virtual'

export type Card = {
  id: string
  card_number: string
  card_holder: string
  expiry: string
  card_type: CardType
  status: CardStatus
  network: string
  spending_source: CurrencyCode
  atm_limit: number
  monthly_spending: number
  monthly_limit: number
  cross_border: boolean
  gradientStart: string
  gradientEnd: string
}

export const mockCards: Card[] = [
  { id: 'card-1', card_number: '•••• •••• •••• 1234', card_holder: 'ALEX JOHNSON', expiry: '03/29', card_type: 'physical', status: 'active', network: 'Visa', spending_source: 'USD', atm_limit: 500, monthly_spending: 1245.80, monthly_limit: 3000, cross_border: true, gradientStart: '#1F4BFF', gradientEnd: '#1238CC' },
  { id: 'card-2', card_number: '•••• •••• •••• 5678', card_holder: 'ALEX JOHNSON', expiry: '06/27', card_type: 'virtual', status: 'active', network: 'Mastercard', spending_source: 'USDC', atm_limit: 300, monthly_spending: 320.00, monthly_limit: 2000, cross_border: true, gradientStart: '#059669', gradientEnd: '#0D9488' },
]

// ─── Insights ─────────────────────────────────────────────────────────────────
export const mockInsights = {
  incomeSources: [
    { label: 'Freelance (Upwork)', amount: 3400, percentage: 76 },
    { label: 'Consulting (Deel)', amount: 1100, percentage: 24 },
  ],
  stabilityScore: 'High' as const,
  stabilityMonths: 6,
  topCategories: [
    { label: 'Housing', amount: 1070, icon: '🏠', percentage: 58, color: '#7C3AED' },
    { label: 'Travel', amount: 365, icon: '✈️', percentage: 20, color: '#1F4BFF' },
    { label: 'Subscriptions', amount: 37.97, icon: '📺', percentage: 11, color: '#DB2777' },
    { label: 'Food & Drink', amount: 73, icon: '🛒', percentage: 4, color: '#F59E0B' },
    { label: 'Other', amount: 127, icon: '📦', percentage: 7, color: '#9CA3AF' },
  ],
  cashRunwayMonths: 4.2,
  savingsRate: 52,
  monthlyTrend: [
    { month: 'Oct', income: 3800, spent: 2100 },
    { month: 'Nov', income: 4200, spent: 1950 },
    { month: 'Dec', income: 3900, spent: 2400 },
    { month: 'Jan', income: 4500, spent: 1700 },
    { month: 'Feb', income: 4200, spent: 1880 },
    { month: 'Mar', income: 4500, spent: 1830 },
  ],
}

// ─── Support ──────────────────────────────────────────────────────────────────
export const mockSupportCategories = [
  { id: 's-1', icon: '💸', label: 'Payments & Transfers', description: 'Issues with sending or receiving money' },
  { id: 's-2', icon: '💳', label: 'Card Issues', description: 'Card blocked, lost, or not working' },
  { id: 's-3', icon: '🪪', label: 'Account Verification', description: 'KYC, identity, or document issues' },
  { id: 's-4', icon: '⬆️', label: 'Deposits & Withdrawals', description: 'Top-up and withdrawal help' },
  { id: 's-5', icon: '🔒', label: 'Security', description: 'Suspicious activity or account security' },
]

export const mockSupportFaqs = [
  { q: 'How long does a bank transfer take?', a: 'SEPA transfers take 1–2 business days. Crypto transfers are instant.' },
  { q: 'How do I increase my card limit?', a: 'Go to Card > Set Limits. Limit increases are approved within 24h.' },
  { q: 'What documents do I need for KYC?', a: 'A valid government-issued ID (passport or national ID) and a selfie.' },
  { q: 'Is my money protected?', a: 'Fiat deposits are protected up to €100,000 under EU deposit guarantee schemes.' },
]
