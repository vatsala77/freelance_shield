import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function GET() {
  await supabaseAdmin.from('profiles').select('id').limit(1)
  return NextResponse.json({ status: 'alive', time: new Date().toISOString() })
}