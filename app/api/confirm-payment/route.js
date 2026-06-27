import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(req) {
  try {
    const { milestone_id } = await req.json()
    if (!milestone_id) {
      return NextResponse.json({ error: 'Missing milestone_id' }, { status: 400 })
    }

    const { error } = await supabaseAdmin
      .from('milestones')
      .update({ status: 'funded' })
      .eq('id', milestone_id)

    if (error) {
      console.error('Confirm payment error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Fetch milestone + project + freelancer details for email
    const { data: milestone } = await supabaseAdmin
      .from('milestones')
      .select('title, amount_paise, project_id')
      .eq('id', milestone_id)
      .single()

    if (milestone) {
      const { data: project } = await supabaseAdmin
        .from('projects')
        .select('title, client_name, freelancer_id')
        .eq('id', milestone.project_id)
        .single()

      if (project) {
        const { data: freelancer } = await supabaseAdmin
          .from('users')
          .select('email, name')
          .eq('id', project.freelancer_id)
          .single()

        if (freelancer?.email) {
          await resend.emails.send({
            from: 'FreelanceShield <onboarding@resend.dev>',
            to: freelancer.email,
            subject: `💰 Payment received — ${project.title}`,
            html: `
              <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 24px;">
                <div style="background: #1D9E75; padding: 20px; border-radius: 12px 12px 0 0;">
                  <h2 style="color: white; margin: 0;">💰 Payment received!</h2>
                  <p style="color: rgba(255,255,255,0.8); margin: 4px 0 0;">FreelanceShield — Escrow Update</p>
                </div>

                <div style="background: white; border: 1px solid #e5e5e5; border-top: none; border-radius: 0 0 12px 12px; padding: 24px;">
                  <p style="color: #111; font-size: 15px;">Hi ${freelancer.name || 'there'},</p>
                  <p style="color: #555; font-size: 14px; line-height: 1.6;">
                    Good news — <strong>${project.client_name}</strong> has paid into escrow for the milestone <strong>"${milestone.title}"</strong> on your project <strong>${project.title}</strong>.
                  </p>

                  <div style="background: #e8f5ef; border-radius: 8px; padding: 16px; margin: 20px 0; text-align: center;">
                    <p style="margin: 0 0 4px; font-size: 12px; color: #1D9E75; font-weight: 600;">AMOUNT IN ESCROW</p>
                    <p style="margin: 0; font-size: 24px; font-weight: 700; color: #111;">₹${(milestone.amount_paise / 100).toLocaleString('en-IN')}</p>
                  </div>

                  <p style="color: #555; font-size: 14px; line-height: 1.6;">
                    The money is securely held in escrow. Once you complete and submit the work, the client can approve it for release to your account.
                  </p>

                  <div style="margin-top: 24px; text-align: center;">
                    <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard" style="background: #1D9E75; color: white; padding: 12px 28px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 14px;">
                      View on Dashboard
                    </a>
                  </div>
                </div>
              </div>
            `
          })
        }
      }
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Server error:', err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}