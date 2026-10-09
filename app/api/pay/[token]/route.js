import { NextResponse } from 'next/server'
import { query } from '@/lib/supabase'

export async function GET(req, { params }) {
  try {
    const { token } = await params

    // 1. Pehle invite_token se project fetch karo
    const projectResult = await query(
      'SELECT * FROM projects WHERE invite_token = $1 LIMIT 1',
      [token]
    )

    const project = projectResult.rows[0]

    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 })
    }

    // 2. Phir us project ke ID se saare milestones fetch karo (position ke hisaab se sorted)
    const milestonesResult = await query(
      'SELECT * FROM milestones WHERE project_id = $1 ORDER BY position ASC',
      [project.id]
    )

    const milestones = milestonesResult.rows || []

    return NextResponse.json({ project, milestones })
  } catch (err) {
    console.error('Server error:', err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}