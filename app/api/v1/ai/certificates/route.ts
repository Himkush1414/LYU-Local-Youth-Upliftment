import { NextRequest, NextResponse } from 'next/server'
import { callGemini, parseGeminiJSON } from '@/lib/gemini'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const {
      target_role,
      current_skills = [],
      experience_level = 'mid',
      budget = 'free',
      timeline_weeks = 12,
    } = body

    if (!target_role) {
      return NextResponse.json({ error: 'target_role is required' }, { status: 400 })
    }

    const prompt = `You are a career development expert specializing in the Indian job market and professional certifications.

Recommend the best certifications for this professional:

TARGET: ${target_role}
CURRENT SKILLS: ${current_skills.join(', ') || 'Beginner'}
EXPERIENCE LEVEL: ${experience_level}
BUDGET: ${budget} (${budget === 'free' ? 'only free or free-audit options' : 'up to ₹5000 budget'})
TIMELINE: ${timeline_weeks} weeks available

Prioritize certifications that:
1. Are highly recognized by Indian employers
2. Can be completed in the timeline
3. Are available on ${budget === 'free' ? 'Coursera (free audit), NPTEL, Google, Microsoft, AWS free tier, freeCodeCamp, YouTube' : 'any platform'}
4. Have the highest ROI for getting interviews

Return ONLY valid JSON:
{
  "top_certifications": [
    {
      "rank": 1,
      "name": "Certification full name",
      "issuer": "Google/Microsoft/AWS/Coursera/etc",
      "platform": "Platform where to get it",
      "url": "https://...",
      "cost": "Free",
      "duration_weeks": 4,
      "difficulty": "Beginner/Intermediate/Advanced",
      "why_valuable": "Why Indian employers love this cert",
      "salary_impact": "10-15% hike typical",
      "recognition_score": 9,
      "skills_covered": ["skill1", "skill2"],
      "is_industry_recognized": true,
      "completion_certificate": true
    }
  ],
  "certification_path": ["Do cert 1 first", "Then cert 2", "Finally cert 3"],
  "total_cost": "₹0 (all free)",
  "expected_outcome": "After completing these, you should be able to..."
}`

    const raw = await callGemini(prompt, {
      temperature: 0.3,
      maxTokens: 2000,
      jsonMode: true,
    })

    const result = parseGeminiJSON(raw)
    return NextResponse.json(result)
  } catch (err: any) {
    console.error('[Certificates Error]', err?.message)
    return NextResponse.json({ error: 'Failed to fetch certifications. Please try again.' }, { status: 500 })
  }
}
