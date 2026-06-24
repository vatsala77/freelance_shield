import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url)
    const user_id = searchParams.get('user_id')

    if (!user_id) {
      return NextResponse.json({ error: 'Missing user_id' }, { status: 400 })
    }

    const { data, error } = await supabaseAdmin
      .from('users')
      .select('bank_account_holder, bank_account_number, bank_ifsc, bank_details_added')
      .eq('id', user_id)
      .single()

    if (error) {
      return NextResponse.json({ bank_details_added: false })
    }

    return NextResponse.json(data)
  } catch (err) {
    console.error('Server error:', err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

export async function POST(req) {
  try {
    const { user_id, email, name, bank_account_holder, bank_account_number, bank_ifsc } = await req.json()

    if (!user_id || !bank_account_holder || !bank_account_number || !bank_ifsc) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const { data: existing } = await supabaseAdmin
      .from('users')
      .select('id')
      .eq('id', user_id)
      .single()

    if (existing) {
      const { error } = await supabaseAdmin
        .from('users')
        .update({
          bank_account_holder,
          bank_account_number,
          bank_ifsc,
          bank_details_added: true,
          updated_at: new Date().toISOString()
        })
        .eq('id', user_id)

      if (error) {
        console.error('Update error:', error)
        return NextResponse.json({ error: error.message }, { status: 500 })
      }
    } else {
      const { error } = await supabaseAdmin
        .from('users')
        .insert({
          id: user_id,
          email,
          name,
          bank_account_holder,
          bank_account_number,
          bank_ifsc,
          bank_details_added: true,
        })

      if (error) {
        console.error('Insert error:', error)
        return NextResponse.json({ error: error.message }, { status: 500 })
      }
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Server error:', err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}