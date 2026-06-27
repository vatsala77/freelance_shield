import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(req) {
  const { milestone_id, project_id, reason } = await req.json()

  if (!milestone_id || !project_id || !reason) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
  }

  // 1. Milestone status disputed karo
  const { error: milestoneError } = await supabaseAdmin
    .from('milestones')
    .update({ status: 'disputed' })
    .eq('id', milestone_id)

  if (milestoneError) {
    return NextResponse.json({ error: milestoneError.message }, { status: 400 })
  }

  // 2. Dispute record save karo
  const { error: disputeError } = await supabaseAdmin
    .from('disputes')
    .insert({
      milestone_id,
      project_id,
      raised_by: null,
      reason,
      status: 'open',
    })

  if (disputeError) {
    console.log('Dispute insert error:', disputeError.message)
  }

  // 3. Project details fetch karo email ke liye
  const { data: project } = await supabaseAdmin
    .from('projects')
    .select('title, client_name, client_email')
    .eq('id', project_id)
    .single()

  const { data: milestone } = await supabaseAdmin
    .from('milestones')
    .select('title, amount_paise')
    .eq('id', milestone_id)
    .single()

  // 4. Admin ko email bhejo
  await resend.emails.send({
    from: 'FreelanceShield <onboarding@resend.dev>',
    to: process.env.ADMIN_EMAIL,
    subject: `⚠️ New Dispute — ${project?.title}`,
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 24px;">
        <div style="background: #1D9E75; padding: 20px; border-radius: 12px 12px 0 0;">
          <h2 style="color: white; margin: 0;">⚠️ New Dispute Raised</h2>
          <p style="color: rgba(255,255,255,0.8); margin: 4px 0 0;">FreelanceShield — Action Required</p>
        </div>
        
        <div style="background: white; border: 1px solid #e5e5e5; border-top: none; border-radius: 0 0 12px 12px; padding: 24px;">
          
          <h3 style="margin: 0 0 16px; color: #111;">Dispute Details</h3>
          
          <table style="width: 100%; border-collapse: collapse;">
            <tr style="border-bottom: 1px solid #f0f0f0;">
              <td style="padding: 10px 0; color: #888; font-size: 13px; width: 140px;">Project</td>
              <td style="padding: 10px 0; color: #111; font-weight: 500;">${project?.title}</td>
            </tr>
            <tr style="border-bottom: 1px solid #f0f0f0;">
              <td style="padding: 10px 0; color: #888; font-size: 13px;">Client</td>
              <td style="padding: 10px 0; color: #111; font-weight: 500;">${project?.client_name} (${project?.client_email})</td>
            </tr>
            <tr style="border-bottom: 1px solid #f0f0f0;">
              <td style="padding: 10px 0; color: #888; font-size: 13px;">Milestone</td>
              <td style="padding: 10px 0; color: #111; font-weight: 500;">${milestone?.title}</td>
            </tr>
            <tr style="border-bottom: 1px solid #f0f0f0;">
              <td style="padding: 10px 0; color: #888; font-size: 13px;">Amount</td>
              <td style="padding: 10px 0; color: #1D9E75; font-weight: 700;">₹${((milestone?.amount_paise || 0) / 100).toLocaleString('en-IN')}</td>
            </tr>
            <tr>
              <td style="padding: 10px 0; color: #888; font-size: 13px; vertical-align: top;">Reason</td>
              <td style="padding: 10px 0; color: #e74c3c; font-weight: 500;">${reason}</td>
            </tr>
          </table>

          <div style="background: #fff8e1; border: 1px solid #f59e0b; border-radius: 8px; padding: 16px; margin-top: 20px;">
            <p style="margin: 0; font-size: 13px; color: #b45309;">
              <strong>Action Required:</strong> Review this dispute and contact both parties. 
              Refund or release funds manually via Razorpay dashboard.
            </p>
          </div>

          <div style="margin-top: 20px; padding-top: 16px; border-top: 1px solid #e5e5e5;">
            <p style="margin: 0; font-size: 12px; color: #aaa;">
              Dispute ID: ${milestone_id} · Project ID: ${project_id}
            </p>
          </div>
        </div>
      </div>
    `
  })

  return NextResponse.json({ success: true })
}