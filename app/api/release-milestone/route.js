import { NextResponse } from 'next/server'
import { razorpay, calculateFee } from '@/lib/razorpay'
import { supabaseAdmin } from '@/lib/supabase'

export async function POST(req) {
  try {
    const { milestone_id, project_id } = await req.json()

    const { data: project } = await supabaseAdmin
      .from('projects')
      .select('*, milestones(*)')
      .eq('id', project_id)
      .single()

    const milestone = project.milestones.find(m => m.id === milestone_id)

    if (milestone.status !== 'submitted') {
      return NextResponse.json({ error: 'Milestone must be submitted first' }, { status: 400 })
    }

    const transfers = await razorpay.payments.fetchTransfer(milestone.razorpay_payment_id)
    const transfer = transfers.items?.find(t => t.recipient === project.freelancer_razorpay_account_id)

    if (!transfer) {
      return NextResponse.json({ error: 'Transfer not found' }, { status: 404 })
    }

    const updatedTransfer = await razorpay.transfers.edit(transfer.id, { on_hold: 0 })

    const { fee, freelancerAmount } = calculateFee(milestone.amount_paise, project.platform_fee_percent)

    await supabaseAdmin
      .from('milestones')
      .update({ status: 'released', razorpay_transfer_id: updatedTransfer.id })
      .eq('id', milestone_id)

    await supabaseAdmin.from('platform_fees').insert({
      project_id,
      milestone_id,
      gross_amount_paise: milestone.amount_paise,
      fee_percent: project.platform_fee_percent,
      fee_amount_paise: fee,
      net_to_freelancer_paise: freelancerAmount,
      transfer_id: updatedTransfer.id,
    })

    return NextResponse.json({ success: true, transfer_id: updatedTransfer.id })

  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Release failed' }, { status: 500 })
  }
}