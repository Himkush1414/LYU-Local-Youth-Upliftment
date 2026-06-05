import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const apiKey = process.env.RESEND_API_KEY
    if (!apiKey || apiKey === 're_placeholder_not_needed_yet' || apiKey === '') {
      return NextResponse.json({ message: 'Email not configured yet' }, { status: 200 })
    }

    const { to, subject, html } = await req.json()
    const { Resend } = await import('resend')
    const resend = new Resend(apiKey)

    await resend.emails.send({ from: 'LYU <noreply@lyu.app>', to, subject, html })
    return NextResponse.json({ message: 'Email sent' })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
