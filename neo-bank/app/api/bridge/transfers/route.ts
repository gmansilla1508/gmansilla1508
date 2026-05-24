import { NextRequest, NextResponse } from 'next/server'
import {
  isBridgeConfigured,
  createTransfer,
  BridgeError,
  BridgeTransferSource,
  BridgeTransferDestination,
} from '@/lib/bridge'

type SendMethod = 'awake' | 'bank' | 'crypto'

function buildRails(
  method: SendMethod,
  currency: string,
  destination: string
): { source: BridgeTransferSource; dest: BridgeTransferDestination } {
  if (method === 'awake') {
    return {
      source: { payment_rail: 'ach', currency: currency.toLowerCase() },
      dest: { payment_rail: 'ach' },
    }
  }
  if (method === 'bank') {
    const isUsd = currency.toUpperCase() === 'USD'
    return {
      source: { payment_rail: 'ach', currency: currency.toLowerCase() },
      dest: isUsd
        ? { payment_rail: 'wire', currency: 'usd' }
        : { payment_rail: 'sepa', currency: 'eur' },
    }
  }
  return {
    source: { payment_rail: 'base', currency: currency.toLowerCase() },
    dest: { payment_rail: 'base', currency: 'usdc', to_address: destination },
  }
}

export async function POST(req: NextRequest) {
  const { customer_id, amount, currency, method, destination } = await req.json()

  if (!isBridgeConfigured()) {
    return NextResponse.json(
      {
        transfer_id: `tr_mock_${Date.now()}`,
        state: 'payment_processed',
        receipt: null,
        amount,
        currency,
      },
      { status: 201 }
    )
  }

  try {
    const { source, dest } = buildRails(method as SendMethod, currency, destination)

    const transfer = await createTransfer({
      on_behalf_of: customer_id,
      amount,
      source,
      destination: dest,
    })

    return NextResponse.json(
      {
        transfer_id: transfer.id,
        state: transfer.state,
        receipt: null,
      },
      { status: 201 }
    )
  } catch (err) {
    if (err instanceof BridgeError) {
      return NextResponse.json({ error: err.message }, { status: err.status })
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
