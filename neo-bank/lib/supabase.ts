import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Database = {
  public: {
    Tables: {
      accounts: {
        Row: {
          id: string
          user_id: string
          account_number: string
          balance: number
          currency: string
          account_type: string
          created_at: string
        }
      }
      transactions: {
        Row: {
          id: string
          account_id: string
          amount: number
          type: 'credit' | 'debit'
          category: string
          description: string
          merchant: string
          created_at: string
        }
      }
      cards: {
        Row: {
          id: string
          account_id: string
          card_number: string
          card_holder: string
          expiry: string
          card_type: 'virtual' | 'physical'
          status: 'active' | 'frozen' | 'cancelled'
          created_at: string
        }
      }
    }
  }
}
