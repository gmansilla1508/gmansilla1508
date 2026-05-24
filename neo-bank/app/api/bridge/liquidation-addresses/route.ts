import { NextRequest, NextResponse } from 'next/server'
import {
  isBridgeConfigured,
  createLiquidationAddress,
  getLiquidationAddresses,
  BridgeError,
} from '@/lib/bridge'

export async function POST(req: NextRequest) {
  const { customer_id, chain, currency, destination_payment_rail, destination_currency } =
    await req.json()

  if (!isBridgeConfigured()) {
    return NextResponse.json(
      {
        id: 'la_mock_123',
        address: '0x1F4BFF...mock',
        chain,
        currency,
        state: 'active',
      },
      { status: 201 }
    )
  }

  try {
    const address = await createLiquidationAddress(customer_id, {
      chain,
      currency,
      destination_payment_rail,
      destination_currency,
    })

    return NextResponse.json(address, { status: 201 })
  } catch (err) {
    if (err instanceof BridgeError) {
      return NextResponse.json({ error: err.message }, { status: err.status })
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const customer_id = searchParams.get('customer_id')

  if (!customer_id) {
    return NextResponse.json({ error: 'customer_id is required' }, { status: 400 })
  }

  if (!isBridgeConfigured()) {
    return NextResponse.json([
      {
        id: 'la_mock_001',
        customer_id,
        chain: 'ethereum',
        currency: 'usdc',
        address: '0x1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b',
        destination_payment_rail: 'ach',
        destination_currency: 'usd',
        state: 'active',
        created_at: new Date().toISOString(),
      },
      {
        id: 'la_mock_002',
        customer_id,
        chain: 'base',
        currency: 'usdc',
        address: '0x9f8e7d6c5b4a3f2e1d0c9b8a7f6e5d4c3b2a1f0e',
        destination_payment_rail: 'ach',
        destination_currency: 'usd',
        state: 'active',
        created_at: new Date().toISOString(),
      },
    ])
  }

  try {
    const addresses = await getLiquidationAddresses(customer_id)
    return NextResponse.json(addresses)
  } catch (err) {
    if (err instanceof BridgeError) {
      return NextResponse.json({ error: err.message }, { status: err.status })
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
