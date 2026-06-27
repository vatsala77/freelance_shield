import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function POST(req) {
  try {
    const { milestone_id } = await req.json()

    if (!milestone_id) {
      return NextResponse.json({ error: 'Milestone ID is required' }, { status: 400 })
    }

    // 1. Database Check: Pehle real-time status pata karo milestone ka
    const { data: milestone, error: fetchError } = await supabaseAdmin
      .from('milestones')
      .select('status')
      .eq('id', milestone_id)
      .single()

    if (fetchError || !milestone) {
      return NextResponse.json({ error: 'Milestone not found in database' }, { status: 404 })
    }

    // 2. AIRTIGHT SECURITY GUARD: Agar status pending nahi hai, toh database se touch bhi mat karne do
    if (['funded', 'submitted', 'changes_requested', 'disputed', 'Disputed', 'released'].includes(milestone.status)) {
      return NextResponse.json({ 
        error: "Security Lock: Active or disputed escrow milestones cannot be deleted." 
      }, { status: 400 })
    }

    // 3. Database Delete Action: Agar safe hai (yani status pending hai), toh delete udao
    const { error: deleteError } = await supabaseAdmin
      .from('milestones')
      .delete()
      .eq('id', milestone_id)

    if (deleteError) {
      return NextResponse.json({ error: deleteError.message }, { status: 500 })
    }

    return NextResponse.json({ success: true, message: 'Milestone successfully deleted from database' })

  } catch (err) {
    console.error('Delete milestone error:', err)
    return NextResponse.json({ error: 'Server error during milestone deletion' }, { status: 500 })
  }
}