import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function POST(req) {
  try {
    const { project_id, title, description, amount, due_date } = await req.json()

    if (!project_id || !title || !amount) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const { data: existingMilestones, error: countError } = await supabaseAdmin
      .from('milestones')
      .select('position')
      .eq('project_id', project_id)
      .order('position', { ascending: false })
      .limit(1)

    if (countError) {
      return NextResponse.json({ error: countError.message }, { status: 500 })
    }

    const nextPosition = (existingMilestones?.[0]?.position || 0) + 1

    const amountPaise = Math.round(Number(amount) * 100)
const feePaise = Math.round(amountPaise * 0.05)
const payoutPaise = amountPaise - feePaise

const { error } = await supabaseAdmin
  .from('milestones')
  .insert({
    project_id,
    position: nextPosition,
    title,
    description: description || null,
    amount_paise: amountPaise,
    platform_fee_paise: feePaise,
    freelancer_payout_paise: payoutPaise,
    due_date: due_date || null,
    status: 'pending',
  })

    if (error) {
      console.error('Add milestone error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    const { data: allMilestones } = await supabaseAdmin
      .from('milestones')
      .select('amount_paise')
      .eq('project_id', project_id)

    const newTotal = allMilestones.reduce((sum, m) => sum + m.amount_paise, 0)

    await supabaseAdmin
      .from('projects')
      .update({ total_amount_paise: newTotal, milestone_count: allMilestones.length })
      .eq('id', project_id)

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Server error:', err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}