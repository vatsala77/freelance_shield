import { NextResponse } from 'next/server'
import { query } from '@/lib/supabase'

// 1. GET Handler (Fetch Project Details with Milestones)
export async function GET(req, { params }) {
  try {
    const { id } = await params

    // Fetch the main project
    const projectResult = await query(
      'SELECT * FROM projects WHERE id = $1 LIMIT 1',
      [id]
    )
    const project = projectResult.rows[0]

    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 })
    }

    // Fetch associated milestones ordered by position
    const milestonesResult = await query(
      'SELECT * FROM milestones WHERE project_id = $1 ORDER BY position ASC',
      [id]
    )
    project.milestones = milestonesResult.rows || []

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
    const milestonesResult = await query(
      'SELECT status FROM milestones WHERE project_id = $1',
      [id]
    )
    const milestones = milestonesResult.rows

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
    await query('DELETE FROM activity_log WHERE project_id = $1', [id])

    // 2. Clear empty/mock disputes context safely
    await query('DELETE FROM disputes WHERE project_id = $1', [id])

    // 3. Clear pending milestones references
    await query('DELETE FROM milestones WHERE project_id = $1', [id])

    // Step D: Now safely delete the parent record from "projects" table
    await query('DELETE FROM projects WHERE id = $1', [id])

    return NextResponse.json({ success: true, message: "Project agreement configuration safely purged from database." })

  } catch (error) {
    console.error('Delete error loop exception:', error)
    return NextResponse.json({ error: 'Server error during secure deletion pipeline' }, { status: 500 })
  }
}