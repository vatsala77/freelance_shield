import { NextResponse } from 'next/server'
import { verifyPaymentSignature } from '@/lib/razorpay'
import { supabaseAdmin } from '@/lib/supabase'

export async function POST(req) {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, milestone_id } = await req.json()

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !milestone_id) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
    }

    const isValid = verifyPaymentSignature(razorpay_order_id, razorpay_payment_id, razorpay_signature)

    if (!isValid) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
    }

    await supabaseAdmin
      .from('milestones')
      .update({ status: 'funded', razorpay_payment_id })
      .eq('id', milestone_id)

    return NextResponse.json({ success: true, message: 'Payment verified. Funds in escrow.' })

  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Verification failed' }, { status: 500 })
  }
}