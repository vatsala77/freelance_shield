import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function GET(req) {
  const authHeader = req.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()

    const { data: milestones, error } = await supabaseAdmin
      .from('milestones')
      .select('*, projects(title, client_name, client_email, invite_token)')
      .in('status', ['pending', 'submitted'])
      .lt('created_at', sevenDaysAgo)
      .is('reminder_sent_at', null)

    if (error) {
      console.error('Cron fetch error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    let sentCount = 0

    for (const m of milestones || []) {
      const project = m.projects
      if (!project?.client_email) continue

      const isPaymentReminder = m.status === 'pending'

      await resend.emails.send({
        from: 'FreelanceShield <onboarding@resend.dev>',
        to: project.client_email,
        subject: isPaymentReminder
          ? `⏰ Reminder: Payment pending for "${project.title}"`
          : `⏰ Reminder: Review needed for "${project.title}"`,
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 24px;">
            <div style="background: #1D9E75; padding: 20px; border-radius: 12px 12px 0 0;">
              <h2 style="color: white; margin: 0;">⏰ Friendly reminder</h2>
            </div>
            <div style="background: white; border: 1px solid #e5e5e5; border-top: none; border-radius: 0 0 12px 12px; padding: 24px;">
              <p style="color: #111; font-size: 15px;">Hi ${project.client_name},</p>
              <p style="color: #555; font-size: 14px; line-height: 1.6;">
                ${isPaymentReminder
                  ? `The milestone <strong>"${m.title}"</strong> on your project <strong>${project.title}</strong> is still awaiting payment.`
                  : `The milestone <strong>"${m.title}"</strong> on your project <strong>${project.title}</strong> has been submitted and is awaiting your review.`
                }
              </p>
              <div style="margin-top: 20px; text-align: center;">
                <a href="${process.env.NEXT_PUBLIC_APP_URL}/pay/${project.invite_token}" style="background: #1D9E75; color: white; padding: 12px 28px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 14px;">
                  View Project
                </a>
              </div>
            </div>
          </div>
        `
      })

      await supabaseAdmin
        .from('milestones')
        .update({ reminder_sent_at: new Date().toISOString() })
        .eq('id', m.id)

      sentCount++
    }

    return NextResponse.json({ success: true, remindersSent: sentCount })
  } catch (err) {
    console.error('Cron error:', err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}