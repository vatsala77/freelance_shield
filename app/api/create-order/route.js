import { NextResponse } from 'next/server'
import { razorpay } from '@/lib/razorpay'
import { supabaseAdmin } from '@/lib/supabase'

export async function POST(req) {
  try {
    const { milestone_id, project_id } = await req.json()
    
    if (!milestone_id || !project_id) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
    }

    const { data: project, error } = await supabaseAdmin
      .from('projects')
      .select('*, milestones(*)')
      .eq('id', project_id)
      .single()

    if (error) return NextResponse.json({ error: 'Project not found' }, { status: 404 })

    const milestone = project.milestones.find(m => m.id === milestone_id)
    if (!milestone) return NextResponse.json({ error: 'Milestone not found' }, { status: 404 })

    const order = await razorpay.orders.create({
      amount: milestone.amount_paise,
      currency: 'INR',
      receipt: `m_${milestone_id.slice(0, 30)}`,
      notes: {
        milestone_id,
        project_id,
        milestone_title: milestone.title,
      },
    })

    await supabaseAdmin
      .from('milestones')
      .update({ razorpay_order_id: order.id })
      .eq('id', milestone_id)

    return NextResponse.json({
      order_id: order.id,
      amount: order.amount,
      currency: order.currency,
      key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
      client_name: project.client_name,
      client_email: project.client_email,
    })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Failed to create order' }, { status: 500 })
  }
}
