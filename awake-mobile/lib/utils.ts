export function formatCurrency(
  amount: number,
  currency = 'USD',
  compact = false,
): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: currency === 'BTC' ? 4 : 2,
    notation: compact ? 'compact' : 'standard',
  }).format(Math.abs(amount))
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

export function formatShortDate(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

export function formatBalanceDisplay(balance: number, currency: string, symbol: string): string {
  if (currency === 'BTC') return `${balance.toFixed(4)} BTC`
  return `${symbol}${balance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
}

export function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}
