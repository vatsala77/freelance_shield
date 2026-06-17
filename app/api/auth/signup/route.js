import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
 'https://hxtwdfjnrkzxtyajczhg.supabase.co',
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

export async function POST(req) {
  try {
    const { email, password } = await req.json()
    
    // Create auth user
    const { data, error } = await supabase.auth.admin.createUser({
      email, password, email_confirm: true
    })
    
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    // Also create user profile in users table
    const { error: profileError } = await supabase
      .from('users')
      .insert({
        id: data.user.id,
        email: data.user.email,
        name: data.user.email.split('@')[0],
      })

    if (profileError) {
      console.error('Profile creation error:', profileError)
      // Still return success since auth user was created
      // The user will be created on first project creation if this fails
    }

    return NextResponse.json({ success: true, user: data.user })
  } catch (err) {
    console.error('Signup error:', err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}