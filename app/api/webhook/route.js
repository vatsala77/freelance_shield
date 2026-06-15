import { NextResponse } from 'next/server'
import { verifyWebhookSignature } from '@/lib/razorpay'
import { supabaseAdmin } from '@/lib/supabase'

export async function POST(req) {
  try {
    const rawBody = await req.text()
    const signature = req.headers.get('x-razorpay-signature')

    if (!signature) {
      return NextResponse.json({ error: 'Missing signature' }, { status: 400 })
    }

    const isValid = verifyWebhookSignature(rawBody, signature, process.env.WEBHOOK_SECRET)
    if (!isValid) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
    }

    const payload = JSON.parse(rawBody)
    const event = payload.event

    if (event === 'payment.captured') {
      const payment = payload.payload.payment?.entity
      const milestoneId = payment?.notes?.milestone_id
      if (milestoneId) {
        await supabaseAdmin
          .from('milestones')
          .update({ status: 'funded', razorpay_payment_id: payment.id })
          .eq('id', milestoneId)
          .eq('status', 'pending')
      }
    }

    if (event === 'payment.failed') {
      const payment = payload.payload.payment?.entity
      const milestoneId = payment?.notes?.milestone_id
      if (milestoneId) {
        await supabaseAdmin
          .from('milestones')
          .update({ status: 'pending', razorpay_order_id: null })
          .eq('id', milestoneId)
      }
    }

    return NextResponse.json({ received: true })

  } catch (err) {
    console.error(err)
    return NextResponse.json({ received: true })
  }
}