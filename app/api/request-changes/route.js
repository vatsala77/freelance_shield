import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function POST(req) {
  try {
    const { milestone_id, note } = await req.json()

    if (!milestone_id || !note) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
    }

    const { error } = await supabaseAdmin
      .from('milestones')
      .update({ 
        status: 'changes_requested',
        change_request_note: note,
      })
      .eq('id', milestone_id)

    if (error) {
      console.error('Request changes error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Server error:', err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}