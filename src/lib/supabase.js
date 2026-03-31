import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase credentials not configured. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your .env file.')
}

export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder-key',
  {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true
    }
  }
)

// Storage buckets
export const storage = supabase.storage

// Database helpers
export const db = {
  collection: (tableName) => ({
    select: () => supabase.from(tableName).select(),
    insert: (data) => supabase.from(tableName).insert(data),
    update: (data) => supabase.from(tableName).update(data),
    delete: () => supabase.from(tableName).delete(),
    match: (conditions) => supabase.from(tableName).select().match(conditions),
    eq: (column, value) => supabase.from(tableName).select().eq(column, value)
  })
}
