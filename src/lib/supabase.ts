import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// Log the configuration for debugging
console.log('Supabase Config:', {
  url: supabaseUrl ? 'Set' : 'Missing',
  key: supabaseAnonKey ? 'Set' : 'Missing'
});

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables. Please check your .env file.');
}

// Create Supabase client with rate-limit friendly configuration
export const supabase = supabaseUrl && supabaseAnonKey 
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: false,
        flowType: 'implicit',
        storageKey: 'guloona-auth'
      },
      global: {
        headers: {
          'X-Client-Info': 'guloona-web-client'
        }
      }
    })
  : createClient('https://placeholder.supabase.co', 'placeholder-key', {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      }
    })

export type Database = {
  public: {
    Tables: {
      carts: {
        Row: {
          id: string
          user_id: string
          product_id: number
          product_name: string
          product_price: string
          product_price_number: number
          product_image: string
          product_color: string
          size: string
          quantity: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          product_id: number
          product_name: string
          product_price: string
          product_price_number: number
          product_image: string
          product_color: string
          size: string
          quantity: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          product_id?: number
          product_name?: string
          product_price?: string
          product_price_number?: number
          product_image?: string
          product_color?: string
          size?: string
          quantity?: number
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}
