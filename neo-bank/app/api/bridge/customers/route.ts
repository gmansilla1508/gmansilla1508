import { NextRequest, NextResponse } from 'next/server'
import {
  isBridgeConfigured,
  createCustomer,
  createKycLink,
  BridgeError,
} from '@/lib/bridge'

export async function POST(req: NextRequest) {
  const { first_name, last_name, email, phone } = await req.json()

  if (!isBridgeConfigured()) {
    return NextResponse.json(
      { customer_id: 'cust_mock_123', kyc_link_url: null, status: 'sandbox' },
      { status: 201 }
    )
  }

  try {
    const customer = await createCustomer({
      type: 'individual',
      first_name,
      last_name,
      email,
      phone,
    })

    const kycLink = await createKycLink({
      customer_id: customer.id,
      full_name: `${first_name} ${last_name}`,
      email,
    })

    return NextResponse.json(
      {
        customer_id: customer.id,
        kyc_link_url: kycLink.kyc_link,
        status: customer.kyc_status,
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
