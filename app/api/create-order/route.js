import { NextResponse } from 'next/server'
import { razorpay } from '@/lib/razorpay'
import { query } from '@/lib/supabase'

export async function POST(req) {
  try {
    const { milestone_id, project_id } = await req.json()
    
    if (!milestone_id || !project_id) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
    }

    // 1. Fetch the project details
    const projectResult = await query(
      'SELECT * FROM projects WHERE id = \$1 LIMIT 1',
      [project_id]
    )
    const project = projectResult.rows[0]

    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 })
    }

    // 2. Fetch the specific milestone details
    const milestoneResult = await query(
      'SELECT * FROM milestones WHERE id = \$1 AND project_id = \$2 LIMIT 1',
      [milestone_id, project_id]
    )
    const milestone = milestoneResult.rows[0]

    if (!milestone) {
      return NextResponse.json({ error: 'Milestone not found' }, { status: 404 })
    }

    // 3. Create Razorpay order
    const order = await razorpay.orders.create({
      amount: milestone.amount_paise,
      currency: 'INR',
      receipt: `m_${milestone_id.toString().slice(0, 30)}`,
      notes: {
        milestone_id,
        project_id,
        milestone_title: milestone.title,
      },
    })

    // 4. Update the milestone with the new razorpay_order_id
    await query(
      'UPDATE milestones SET razorpay_order_id = \$1 WHERE id = \$2',
      [order.id, milestone_id]
    )

    return NextResponse.json({
      order_id: order.id,
      amount: order.amount,
      currency: order.currency,
      key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
      client_name: project.client_name,
      client_email: project.client_email,
    })
  } catch (err) {
    console.error('Create order error:', err)
    return NextResponse.json({ error: 'Failed to create order' }, { status: 500 })
  }
}