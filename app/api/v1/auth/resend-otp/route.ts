import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json()
    if (!email) return NextResponse.json({ error: 'Email required' }, { status: 400 })

    const supabase = await createClient()
    const { error } = await supabase.auth.resend({ email, type: 'signup' })
    if (error) throw error

    return NextResponse.json({ success: true, retry_after_seconds: 60 })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to resend OTP'
    return NextResponse.json({ success: false, error: message }, { status: 500 })
  }
}
