// import { NextResponse } from 'next/server'
// import { supabaseAdmin } from '@/lib/supabase'

// export async function GET(req, { params }) {
//   try {
//     const { id } = await params

//     const { data: project, error } = await supabaseAdmin
//       .from('projects')
//       .select('*, milestones(*)')
//       .eq('id', id)
//       .single()

//     if (error || !project) {
//       return NextResponse.json({ error: 'Project not found' }, { status: 404 })
//     }

//     project.milestones.sort((a, b) => a.position - b.position)

//     return NextResponse.json(project)
//   } catch (err) {
//     console.error('Server error:', err)
//     return NextResponse.json({ error: 'Server error' }, { status: 500 })
//   }
// }
import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

// 1. GET Handler (Fetch Project Details with Milestones)
export async function GET(req, { params }) {
  try {
    const { id } = await params

    const { data: project, error } = await supabaseAdmin
      .from('projects')
      .select('*, milestones(*)')
      .eq('id', id)
      .single()

    if (error || !project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 })
    }

    project.milestones.sort((a, b) => a.position - b.position)

    return NextResponse.json(project)
  } catch (err) {
    console.error('Server error:', err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

// 2. Complete Secure DELETE Handler (Protected against active escrow and disputes)
export async function DELETE(req, { params }) {
  try {
    const { id } = await params // URL parameter se dynamic project ID nikala

    // Step A: Current project ke saare milestones ka real-time status fetch karo
    const { data: milestones, error: fetchError } = await supabaseAdmin
      .from('milestones')
      .select('status')
      .eq('project_id', id)

    if (fetchError) {
      return NextResponse.json({ error: "Failed to verify milestones context" }, { status: 500 })
    }

    // Step B: AIRTIGHT ESCROW SAFETY GUARD (Added 'disputed' and 'Disputed' strings)
    // Agar escrow me real paisa lock hai ya ongoing dispute chal raha hai, toh entry BLOCK ho jayegi
    const hasActiveEscrow = milestones?.some(m => 
      ['funded', 'submitted', 'changes_requested', 'disputed', 'Disputed', 'released'].includes(m.status)
    )

    if (hasActiveEscrow) {
      return NextResponse.json({ 
        error: "Security Lock: Active funding or an ongoing dispute exists. This project agreement cannot be deleted." 
      }, { status: 400 })
    }

    // Step C: Relational Integrity Cleanup Sequence (Only triggers if all milestones are untouched/pending)

    // 1. Clear activity logs history references first
    const { error: activityDelError } = await supabaseAdmin
      .from('activity_log')
      .delete()
      .eq('project_id', id)

    if (activityDelError) {
      console.error('Failed to clear activity logs:', activityDelError)
      return NextResponse.json({ error: "Failed to clear linked activity logs references" }, { status: 500 })
    }

    // 2. Clear empty/mock disputes context safely
    const { error: disputeDelError } = await supabaseAdmin
      .from('disputes')
      .delete()
      .eq('project_id', id)

    if (disputeDelError) {
      console.error('Failed to clear linked disputes:', disputeDelError)
      return NextResponse.json({ error: "Failed to clear linked disputes relational references" }, { status: 500 })
    }

    // 3. Clear pending milestones references
    const { error: milestoneDelError } = await supabaseAdmin
      .from('milestones')
      .delete()
      .eq('project_id', id)

    if (milestoneDelError) {
      console.error('Failed to clear milestones:', milestoneDelError)
      return NextResponse.json({ error: "Failed to clear linked milestones context" }, { status: 500 })
    }

    // Step D: Now safely delete the parent record from "projects" table
    const { error: projectDelError } = await supabaseAdmin
      .from('projects')
      .delete()
      .eq('id', id)

    if (projectDelError) {
      return NextResponse.json({ error: projectDelError.message }, { status: 500 })
    }

    return NextResponse.json({ success: true, message: "Project agreement configuration safely purged from database." })

  } catch (error) {
    console.error('Delete error loop exception:', error)
    return NextResponse.json({ error: 'Server error during secure deletion pipeline' }, { status: 500 })
  }
}
