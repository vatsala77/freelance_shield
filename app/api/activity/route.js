import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url)
    const project_id = searchParams.get('project_id')

    const { data, error } = await supabaseAdmin
      .from('activity_log')
      .select('*')
      .eq('project_id', project_id)
      .order('created_at', { ascending: false })

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })

    return NextResponse.json(data || [])
  } catch (err) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

export async function POST(req) {
  try {
    const { project_id, text, color } = await req.json()

    const { error } = await supabaseAdmin
      .from('activity_log')
      .insert({ project_id, text, color: color || '#1D9E75' })

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })

    return NextResponse.json({ success: true })
  } catch (err) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}