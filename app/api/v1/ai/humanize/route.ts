import { NextRequest, NextResponse } from 'next/server'
import { callGemini } from '@/lib/gemini'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { text, context = 'professional', tone = 'confident' } = body

    if (!text || text.trim().length < 10) {
      return NextResponse.json({ error: 'Text is required (minimum 10 characters)' }, { status: 400 })
    }

    const prompt = `You are an expert professional writer specializing in authentic, human-sounding career content for the Indian professional audience.

TASK: Rewrite the following text to sound natural, human, and ${tone}. Remove any AI-sounding, robotic, or generic language.

CONTEXT: This is for ${context} (cover letter / resume bullet / LinkedIn post / email / profile summary)

ORIGINAL TEXT:
${text}

RULES:
- Make it sound like a real person wrote it — confident but not arrogant
- Remove buzzwords like "leverage", "synergize", "utilize", "passionate about", "dynamic"
- Use specific, concrete language
- Keep the same core meaning and facts
- For Indian professional context — warm yet professional tone
- Keep similar length to original (±20%)

Return ONLY the rewritten text with no explanation, no quotes, no labels. Just the improved text directly.`

    const humanized = await callGemini(prompt, {
      temperature: 0.8,
      maxTokens: 800,
    })

    return NextResponse.json({ 
      original: text,
      humanized: humanized.trim(),
      word_count_original: text.split(' ').length,
      word_count_humanized: humanized.trim().split(' ').length,
    })
  } catch (err: any) {
    console.error('[Humanize Error]', err?.message)
    return NextResponse.json({ error: 'Failed to humanize text. Please try again.' }, { status: 500 })
  }
}
