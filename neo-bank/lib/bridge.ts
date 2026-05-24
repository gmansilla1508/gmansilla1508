const BRIDGE_BASE_URL = process.env.BRIDGE_BASE_URL ?? 'https://api.sandbox.bridge.xyz/v0'
const BRIDGE_API_KEY = process.env.BRIDGE_API_KEY ?? ''

export function isBridgeConfigured(): boolean {
  return !!BRIDGE_API_KEY
}

export class BridgeError extends Error {
  status: number
  constructor(message: string, status: number) {
    super(message)
    this.name = 'BridgeError'
    this.status = status
  }
}

export interface BridgeCustomer {
  id: string
  type: 'individual'
  first_name: string
  last_name: string
  email: string
  phone: string
  kyc_status: string
  created_at: string
}

export interface BridgeKycLink {
  id: string
  customer_id: string
  full_name: string
  email: string
  kyc_link: string
  kyc_status: string
  created_at: string
}

export interface BridgeTransferSource {
  payment_rail: string
  currency: string
}

export interface BridgeTransferDestination {
  payment_rail: string
  currency?: string
  to_address?: string
  external_account_id?: string
}

export interface BridgeTransfer {
  id: string
  state: string
  amount: string
  currency: string
  on_behalf_of: string
  source: BridgeTransferSource
  destination: BridgeTransferDestination
  created_at: string
}

export interface BridgeLiquidationAddress {
  id: string
  customer_id: string
  chain: string
  currency: string
  address: string
  destination_payment_rail: string
  destination_currency: string
  state: string
  created_at: string
}

export interface CreateCustomerInput {
  type: 'individual'
  first_name: string
  last_name: string
  email: string
  phone: string
}

export interface CreateTransferInput {
  on_behalf_of: string
  amount: string
  source: BridgeTransferSource
  destination: BridgeTransferDestination
}

async function bridgeFetch<T>(path: string, options: RequestInit = {}): Promise<T> {
  const res = await fetch(`${BRIDGE_BASE_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'Api-Key': BRIDGE_API_KEY,
      ...options.headers,
    },
  })

  if (!res.ok) {
    let message = `Bridge API error ${res.status}`
    try {
      const body = await res.json()
      if (body.message) message = body.message
      else if (body.error) message = body.error
    } catch {
      // ignore parse error
    }
    throw new BridgeError(message, res.status)
  }

  return res.json() as Promise<T>
}

export async function createCustomer(data: CreateCustomerInput): Promise<BridgeCustomer> {
  return bridgeFetch<BridgeCustomer>('/customers', {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

export async function createKycLink(data: {
  customer_id: string
  full_name: string
  email: string
}): Promise<BridgeKycLink> {
  return bridgeFetch<BridgeKycLink>('/kyc_links', {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

export async function createTransfer(data: CreateTransferInput): Promise<BridgeTransfer> {
  return bridgeFetch<BridgeTransfer>('/transfers', {
    method: 'POST',
    headers: {
      'Idempotency-Key': crypto.randomUUID(),
    },
    body: JSON.stringify(data),
  })
}

export async function createLiquidationAddress(
  customerId: string,
  data: {
    chain: string
    currency: string
    destination_payment_rail: string
    destination_currency: string
  }
): Promise<BridgeLiquidationAddress> {
  return bridgeFetch<BridgeLiquidationAddress>(
    `/customers/${customerId}/liquidation_addresses`,
    {
      method: 'POST',
      headers: {
        'Idempotency-Key': crypto.randomUUID(),
      },
      body: JSON.stringify(data),
    }
  )
}

export async function getLiquidationAddresses(customerId: string): Promise<BridgeLiquidationAddress[]> {
  return bridgeFetch<BridgeLiquidationAddress[]>(
    `/customers/${customerId}/liquidation_addresses`
  )
}
