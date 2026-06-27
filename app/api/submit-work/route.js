import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(req) {
  try {
    const { milestone_id, submission_link, submission_note } = await req.json()
    if (!milestone_id || !submission_link) {
      return NextResponse.json({ error: 'Link is required' }, { status: 400 })
    }

    const { error } = await supabaseAdmin
      .from('milestones')
      .update({
        status: 'submitted',
        submission_link,
        submission_note: submission_note || null,
        change_request_note: null,
      })
      .eq('id', milestone_id)

    if (error) {
      console.error('Submit work error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Fetch milestone + project details for email
    const { data: milestone } = await supabaseAdmin
      .from('milestones')
      .select('title, amount_paise, project_id')
      .eq('id', milestone_id)
      .single()

    if (milestone) {
      const { data: project } = await supabaseAdmin
        .from('projects')
        .select('title, client_name, client_email, invite_token')
        .eq('id', milestone.project_id)
        .single()

      if (project?.client_email) {
        await resend.emails.send({
          from: 'FreelanceShield <onboarding@resend.dev>',
          to: project.client_email,
          subject: `📤 Work submitted for review — ${project.title}`,
          html: `
            <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 24px;">
              <div style="background: #1D9E75; padding: 20px; border-radius: 12px 12px 0 0;">
                <h2 style="color: white; margin: 0;">📤 Work submitted!</h2>
                <p style="color: rgba(255,255,255,0.8); margin: 4px 0 0;">FreelanceShield — Review Needed</p>
              </div>

              <div style="background: white; border: 1px solid #e5e5e5; border-top: none; border-radius: 0 0 12px 12px; padding: 24px;">
                <p style="color: #111; font-size: 15px;">Hi ${project.client_name},</p>
                <p style="color: #555; font-size: 14px; line-height: 1.6;">
                  Your freelancer has submitted work for the milestone <strong>"${milestone.title}"</strong> on your project <strong>${project.title}</strong>.
                </p>

                <div style="background: #fff8e1; border-radius: 8px; padding: 16px; margin: 20px 0; text-align: center;">
                  <p style="margin: 0 0 4px; font-size: 12px; color: #b45309; font-weight: 600;">MILESTONE AMOUNT</p>
                  <p style="margin: 0; font-size: 24px; font-weight: 700; color: #111;">₹${(milestone.amount_paise / 100).toLocaleString('en-IN')}</p>
                </div>

                ${submission_note ? `
                <p style="color: #555; font-size: 14px; line-height: 1.6;">
                  <strong>Note from freelancer:</strong> ${submission_note}
                </p>
                ` : ''}

                <p style="color: #555; font-size: 14px; line-height: 1.6;">
                  Please review the submitted work and approve it to release the funds, or request changes if something needs to be fixed.
                </p>

                <div style="margin-top: 24px; text-align: center;">
                  <a href="${process.env.NEXT_PUBLIC_APP_URL}/pay/${project.invite_token}" style="background: #1D9E75; color: white; padding: 12px 28px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 14px;">
                    Review Submission
                  </a>
                </div>
              </div>
            </div>
          `
        })
      }
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Server error:', err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}