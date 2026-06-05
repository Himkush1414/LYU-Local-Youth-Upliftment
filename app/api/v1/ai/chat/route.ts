import { NextRequest, NextResponse } from 'next/server'
import { callGemini } from '@/lib/gemini'

const DEFAULT_SYSTEM = `You are LYU Career AI for Indian job seekers. Help with jobs, career, skills, resume, interviews, salary. If asked anything unrelated, redirect politely. Be concise, warm, and specific to Indian context.`

export async function POST(request: NextRequest) {
  try {
    const { messages, systemOverride } = await request.json()
    if (!messages?.length) return NextResponse.json({ error: 'Messages required' }, { status: 400 })

    const history = messages.slice(0,-1).map((m: any) => `${m.role==='user'?'User':'Assistant'}: ${m.content}`).join('\n\n')
    const last = messages[messages.length-1]?.content || ''
    const prompt = messages.length > 1 ? `${history}\n\nUser: ${last}` : last

    const reply = await callGemini(prompt, {
      systemPrompt: systemOverride || DEFAULT_SYSTEM,
      temperature: 0.7,
      maxTokens: 1500,
    })

    return NextResponse.json({ reply: reply.trim() })
  } catch (err: any) {
    console.error('[Chat Error]', err?.message)
    return NextResponse.json({ reply: 'Connection issue. Please try again.' }, { status: 500 })
  }
}
