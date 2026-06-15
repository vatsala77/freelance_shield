import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
 'https://hxtwdfjnrkzxtyajczhg.supabase.co',
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

export async function POST(req) {
  const { email, password } = await req.json()
  const { data, error } = await supabase.auth.admin.createUser({
    email, password, email_confirm: true
  })
  if (error) return NextResponse.json({ error: error.message }, { status: 400 })
  return NextResponse.json({ success: true, user: data.user })
}