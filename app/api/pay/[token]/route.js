import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function GET(req, { params }) {
  try {
    const { token } = params

    const { data: project, error } = await supabaseAdmin
      .from('projects')
      .select('*, milestones(*)')
      .eq('invite_token', token)
      .single()

    if (error || !project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 })
    }

    const milestones = project.milestones.sort((a, b) => a.position - b.position)

    return NextResponse.json({ project, milestones })
  } catch (err) {
    console.error('Server error:', err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}