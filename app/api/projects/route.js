import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/authOptions'
import { query } from '@/lib/supabase'
import crypto from 'crypto'

export async function GET(req) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Fetch projects for the freelancer
    const projectsResult = await query(
      'SELECT * FROM projects WHERE freelancer_id = \$1 ORDER BY created_at DESC',
      [session.user.id]
    )

    const projects = projectsResult.rows

    // Fetch milestones for each project so dashboard gets the complete structure
    for (const project of projects) {
      const milestonesResult = await query(
        'SELECT * FROM milestones WHERE project_id = \$1 ORDER BY position ASC',
        [project.id]
      )
      project.milestones = milestonesResult.rows || []
    }

    return NextResponse.json(projects)
  } catch (err) {
    console.error('Fetch projects error:', err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const { title, client_name, client_email, client_phone, milestones, freelancer_id } = body

    if (!title || !client_name || !client_email || !milestones?.length || !freelancer_id) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Ensure user exists in users table
    const userCheck = await query(
      'SELECT id FROM users WHERE id = \$1',
      [freelancer_id]
    )

    if (userCheck.rows.length === 0) {
      await query(
        'INSERT INTO users (id, email, name) VALUES (\$1, \$2, \$3)',
        [freelancer_id, session.user.email, session.user.name || session.user.email.split('@')[0]]
      )
    }

    const total = milestones.reduce((a, m) => a + (Number(m.amount) || 0), 0)
    const invite_token = crypto.randomUUID()

    // Insert project
    const projectResult = await query(
      `INSERT INTO projects (title, freelancer_id, client_name, client_email, client_phone, freelancer_razorpay_account_id, total_amount_paise, milestone_count, status, invite_token) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *`,
      [
        title,
        freelancer_id,
        client_name,
        client_email,
        client_phone || null,
        'pending',
        total * 100,
        milestones.length,
        'active',
        invite_token
      ]
    )

    const project = projectResult.rows[0]

    // Insert milestones
    for (let index = 0; index < milestones.length; index++) {
      const m = milestones[index]
      const amountPaise = Number(m.amount) * 100
      const feePaise = Math.round(amountPaise * 0.05)
      const payoutPaise = amountPaise - feePaise

      await query(
        `INSERT INTO milestones (project_id, position, title, description, amount_paise, platform_fee_paise, freelancer_payout_paise, due_date, status) 
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
        [
          project.id,
          index + 1,
          m.title,
          m.description || null,
          amountPaise,
          feePaise,
          payoutPaise,
          m.due || null,
          'pending'
        ]
      )
    }

    return NextResponse.json({ invite_token, project_id: project.id })
  } catch (err) {
    console.error('Server error:', err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}