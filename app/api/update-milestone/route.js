import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function POST(req) {
  try {
    const { milestone_id, title, description, amount, due_date } = await req.json()

    if (!milestone_id) {
      return NextResponse.json({ error: 'Missing milestone_id' }, { status: 400 })
    }

    const { data: existing, error: fetchError } = await supabaseAdmin
      .from('milestones')
      .select('status')
      .eq('id', milestone_id)
      .single()

    if (fetchError || !existing) {
      return NextResponse.json({ error: 'Milestone not found' }, { status: 404 })
    }

    if (existing.status !== 'pending') {
      return NextResponse.json({ error: 'Cannot edit a milestone that has already been paid into escrow' }, { status: 403 })
    }

    const { error } = await supabaseAdmin
      .from('milestones')
      .update({
        title,
        description: description || null,
        amount_paise: Math.round(Number(amount) * 100),
        due_date: due_date || null,
      })
      .eq('id', milestone_id)

    if (error) {
      console.error('Update milestone error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Server error:', err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}