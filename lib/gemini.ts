// lib/gemini.ts
// AI wrapper for LYU — powered by Groq (FREE, no credit card)
// Model: llama-3.3-70b-versatile (smarter than GPT-3.5, completely free)

const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions'

interface GeminiOptions {
  systemPrompt?: string
  temperature?: number
  maxTokens?: number
  jsonMode?: boolean
}

export async function callGemini(
  userPrompt: string,
  options: GeminiOptions = {}
): Promise<string> {
  const apiKey = process.env.GROQ_API_KEY

  if (!apiKey || apiKey === 'your_groq_key_here') {
    throw new Error('GROQ_API_KEY is not set in .env.local')
  }

  const { systemPrompt, temperature = 0.7, maxTokens = 2048, jsonMode = false } = options

  const messages: any[] = []

  if (systemPrompt) {
    messages.push({ role: 'system', content: systemPrompt })
  }

  messages.push({ role: 'user', content: userPrompt })

  const body: any = {
    model: 'llama-3.3-70b-versatile',
    messages,
    temperature,
    max_tokens: maxTokens,
    ...(jsonMode && { response_format: { type: 'json_object' } }),
  }

  const res = await fetch(GROQ_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify(body),
  })

  if (!res.ok) {
    const err = await res.text()
    throw new Error(`Groq API error ${res.status}: ${err}`)
  }

  const data = await res.json()
  const text = data.choices?.[0]?.message?.content

  if (!text) throw new Error('Empty response from Groq')
  return text
}

// Safe JSON parse — strips markdown fences if model adds them
export function parseGeminiJSON<T>(raw: string): T {
  const cleaned = raw
    .replace(/^```json\s*/i, '')
    .replace(/^```\s*/i, '')
    .replace(/```\s*$/i, '')
    .trim()
  return JSON.parse(cleaned) as T
}
