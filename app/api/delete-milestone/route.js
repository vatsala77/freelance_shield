import { NextResponse } from 'next/server'
import { query } from '@/lib/supabase'

export async function POST(req) {
  try {
    const { milestone_id } = await req.json()

    if (!milestone_id) {
      return NextResponse.json({ error: 'Milestone ID is required' }, { status: 400 })
    }

    // 1. Database Check: Pehle real-time status pata karo milestone ka
    const fetchResult = await query(
      'SELECT status FROM milestones WHERE id = $1 LIMIT 1',
      [milestone_id]
    )
    
    const milestone = fetchResult.rows[0]

    if (!milestone) {
      return NextResponse.json({ error: 'Milestone not found in database' }, { status: 404 })
    }

    // 2. AIRTIGHT SECURITY GUARD: Agar status pending nahi hai, toh database se touch bhi mat karne do
    if (['funded', 'submitted', 'changes_requested', 'disputed', 'Disputed', 'released'].includes(milestone.status)) {
      return NextResponse.json({ 
        error: "Security Lock: Active or disputed escrow milestones cannot be deleted." 
      }, { status: 400 })
    }

    // 3. Database Delete Action: Agar safe hai (yani status pending hai), toh delete udao
    await query(
      'DELETE FROM milestones WHERE id = $1',
      [milestone_id]
    )

    return NextResponse.json({ success: true, message: 'Milestone successfully deleted from database' })

  } catch (err) {
    console.error('Delete milestone error:', err)
    return NextResponse.json({ error: 'Server error during milestone deletion' }, { status: 500 })
  }
}