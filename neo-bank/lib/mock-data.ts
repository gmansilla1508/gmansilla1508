export const mockUser = {
  id: 'user-1',
  name: 'Alex Johnson',
  email: 'alex.johnson@email.com',
  avatar: 'AJ',
}

export const mockAccount = {
  id: 'acc-1',
  user_id: 'user-1',
  account_number: '4521 •••• •••• 1234',
  balance: 12450.80,
  currency: 'USD',
  account_type: 'Checking',
  iban: 'US12 BANK 0000 0004 5211 234',
  swift: 'NEOBUS33',
}

export const mockSavingsAccount = {
  id: 'acc-2',
  user_id: 'user-1',
  account_number: '4521 •••• •••• 5678',
  balance: 8320.00,
  currency: 'USD',
  account_type: 'Savings',
  apy: '4.5%',
}

export const mockTransactions = [
  {
    id: 'tx-1',
    account_id: 'acc-1',
    amount: -64.50,
    type: 'debit' as const,
    category: 'Food & Drink',
    description: 'Whole Foods Market',
    merchant: 'Whole Foods',
    icon: '🛒',
    created_at: '2026-03-21T14:30:00Z',
  },
  {
    id: 'tx-2',
    account_id: 'acc-1',
    amount: 3200.00,
    type: 'credit' as const,
    category: 'Income',
    description: 'Salary Deposit',
    merchant: 'Employer Inc.',
    icon: '💰',
    created_at: '2026-03-20T09:00:00Z',
  },
  {
    id: 'tx-3',
    account_id: 'acc-1',
    amount: -12.99,
    type: 'debit' as const,
    category: 'Entertainment',
    description: 'Netflix Subscription',
    merchant: 'Netflix',
    icon: '🎬',
    created_at: '2026-03-19T18:00:00Z',
  },
  {
    id: 'tx-4',
    account_id: 'acc-1',
    amount: -45.00,
    type: 'debit' as const,
    category: 'Transport',
    description: 'Uber Rides',
    merchant: 'Uber',
    icon: '🚗',
    created_at: '2026-03-18T20:15:00Z',
  },
  {
    id: 'tx-5',
    account_id: 'acc-1',
    amount: 250.00,
    type: 'credit' as const,
    category: 'Transfer',
    description: 'Transfer from Sarah',
    merchant: 'Sarah Miller',
    icon: '↩️',
    created_at: '2026-03-17T11:30:00Z',
  },
  {
    id: 'tx-6',
    account_id: 'acc-1',
    amount: -89.99,
    type: 'debit' as const,
    category: 'Shopping',
    description: 'Amazon Purchase',
    merchant: 'Amazon',
    icon: '📦',
    created_at: '2026-03-16T15:45:00Z',
  },
  {
    id: 'tx-7',
    account_id: 'acc-1',
    amount: -120.00,
    type: 'debit' as const,
    category: 'Utilities',
    description: 'Electric Bill',
    merchant: 'City Power Co.',
    icon: '⚡',
    created_at: '2026-03-15T10:00:00Z',
  },
  {
    id: 'tx-8',
    account_id: 'acc-1',
    amount: -8.50,
    type: 'debit' as const,
    category: 'Food & Drink',
    description: 'Starbucks Coffee',
    merchant: 'Starbucks',
    icon: '☕',
    created_at: '2026-03-14T08:20:00Z',
  },
]

export type CardStatus = 'active' | 'frozen' | 'cancelled'
export type CardType = 'physical' | 'virtual'

export type Card = {
  id: string
  account_id: string
  card_number: string
  card_holder: string
  expiry: string
  card_type: CardType
  status: CardStatus
  color: string
  network: string
}

export const mockCards: Card[] = [
  {
    id: 'card-1',
    account_id: 'acc-1',
    card_number: '•••• •••• •••• 1234',
    card_holder: 'ALEX JOHNSON',
    expiry: '03/29',
    card_type: 'physical',
    status: 'active',
    color: 'from-violet-600 to-indigo-700',
    network: 'Visa',
  },
  {
    id: 'card-2',
    account_id: 'acc-1',
    card_number: '•••• •••• •••• 5678',
    card_holder: 'ALEX JOHNSON',
    expiry: '06/27',
    card_type: 'virtual',
    status: 'active',
    color: 'from-emerald-500 to-teal-700',
    network: 'Mastercard',
  },
]

export const mockContacts = [
  { id: 'c-1', name: 'Sarah Miller', avatar: 'SM', handle: '@sarah' },
  { id: 'c-2', name: 'James Wilson', avatar: 'JW', handle: '@james' },
  { id: 'c-3', name: 'Emma Davis', avatar: 'ED', handle: '@emma' },
  { id: 'c-4', name: 'Ryan Chen', avatar: 'RC', handle: '@ryan' },
]
