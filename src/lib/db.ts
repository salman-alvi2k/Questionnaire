import { createClient } from '@supabase/supabase-js'
import { MongoClient } from 'mongodb'

// Supabase setup
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// MongoDB setup
const MONGODB_URI = process.env.MONGODB_URI!

let cachedClient: MongoClient | null = null

export async function connectToMongoDB() {
  if (cachedClient) {
    return cachedClient
  }

  const client = await MongoClient.connect(MONGODB_URI)
  cachedClient = client
  return client
} 