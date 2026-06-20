import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function POST(req) {
  try {
    const { milestone_id, submission_link, submission_note } = await req.json()

    if (!milestone_id || !submission_link) {
      return NextResponse.json({ error: 'Link is required' }, { status: 400 })
    }

    const { error } = await supabaseAdmin
      .from('milestones')
      .update({ 
        status: 'submitted',
        submission_link,
        submission_note: submission_note || null,
        change_request_note: null,
      })
      .eq('id', milestone_id)

    if (error) {
      console.error('Submit work error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Server error:', err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}