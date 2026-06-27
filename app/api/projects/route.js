import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/authOptions'
import { supabaseAdmin } from '@/lib/supabase'
import crypto from 'crypto'

export async function GET(req) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data, error } = await supabaseAdmin
      .from('projects')
      .select('*, milestones(*)')
      .eq('freelancer_id', session.user.id)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Fetch projects error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(data || [])
  } catch (err) {
    console.error('Server error:', err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    console.log('Request body:', JSON.stringify(body))

    const { title, client_name, client_email, client_phone, milestones, freelancer_id } = body

    if (!title || !client_name || !client_email || !milestones?.length || !freelancer_id) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Ensure user exists in users table (create if missing)
    const { data: userExists } = await supabaseAdmin
      .from('users')
      .select('id')
      .eq('id', freelancer_id)
      .single()

    if (!userExists) {
      await supabaseAdmin
        .from('users')
        .insert({
          id: freelancer_id,
          email: session.user.email,
          name: session.user.name || session.user.email.split('@')[0],
        })
        .select()
        .single()
    }

    const total = milestones.reduce((a, m) => a + (Number(m.amount) || 0), 0)
    const invite_token = crypto.randomUUID()

    const { data: project, error: projectError } = await supabaseAdmin
      .from('projects')
      .insert({
        title,
        freelancer_id,
        client_name,
        client_email,
        client_phone: client_phone || null,
        freelancer_razorpay_account_id: 'pending',
        total_amount_paise: total * 100,
        milestone_count: milestones.length,
        status: 'active',
        invite_token,
      })
      .select()
      .single()

    if (projectError) {
      console.error('Project insert error:', projectError)
      return NextResponse.json({ error: projectError.message }, { status: 500 })
    }

    const milestoneRows = milestones.map((m, index) => {
  const amountPaise = Number(m.amount) * 100
  const feePaise = Math.round(amountPaise * 0.05)
  const payoutPaise = amountPaise - feePaise

  return {
    project_id: project.id,
    position: index + 1,
    title: m.title,
    description: m.description || null,
    amount_paise: amountPaise,
    platform_fee_paise: feePaise,
    freelancer_payout_paise: payoutPaise,
    due_date: m.due || null,
    status: 'pending',
  }
})
    const { error: milestoneError } = await supabaseAdmin
      .from('milestones')
      .insert(milestoneRows)

    if (milestoneError) {
      console.error('Milestone insert error:', milestoneError)
      return NextResponse.json({ error: milestoneError.message }, { status: 500 })
    }

    return NextResponse.json({ invite_token, project_id: project.id })
  } catch (err) {
    console.error('Server error:', err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}