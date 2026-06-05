import { NextRequest, NextResponse } from 'next/server'
import { callGemini, parseGeminiJSON } from '@/lib/gemini'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const {
      current_role,
      target_role,
      current_skills = [],
      years_experience = 0,
      education = '',
      timeline_months = 12,
      location = 'India',
    } = body

    if (!current_role || !target_role) {
      return NextResponse.json(
        { error: 'current_role and target_role are required' },
        { status: 400 }
      )
    }

    const prompt = `You are an expert Indian career coach with deep knowledge of the Indian IT, finance, government, and startup job markets.

Create a detailed, realistic career roadmap for this professional:

PROFILE:
- Current Role: ${current_role}
- Target Role: ${target_role}
- Years of Experience: ${years_experience}
- Education: ${education}
- Current Skills: ${current_skills.join(', ') || 'Not specified'}
- Desired Timeline: ${timeline_months} months
- Location: ${location}

REQUIREMENTS:
- Be realistic about timelines for the Indian job market
- Prioritize FREE resources (Coursera free audit, NPTEL, YouTube, freeCodeCamp, GeeksForGeeks, GitHub)
- Include Indian-specific platforms (Naukri, LinkedIn India, Internshala, AngelList India)
- Salary figures must be in INR (LPA format)
- Include government certifications where relevant (NASSCOM, NIELIT, etc.)

Return ONLY valid JSON with this exact structure:
{
  "phases": [
    {
      "phase_number": 1,
      "title": "Phase title",
      "duration_months": 3,
      "focus": "What this phase achieves",
      "skills_to_learn": ["skill1", "skill2"],
      "projects_to_build": ["project description 1", "project description 2"],
      "certifications": [
        {
          "name": "Certification name",
          "platform": "Platform name",
          "url": "https://...",
          "cost": "Free",
          "duration_weeks": 4
        }
      ],
      "milestones": ["milestone 1", "milestone 2"],
      "expected_salary_hike_percent": 15
    }
  ],
  "total_months": 12,
  "realistic_assessment": "Honest 2-3 sentence assessment of this transition",
  "current_avg_salary_lpa": 6,
  "target_avg_salary_lpa": 14,
  "success_probability": "high",
  "success_probability_reason": "Why this probability",
  "top_companies_to_target": ["Company 1", "Company 2", "Company 3"],
  "job_platforms": ["Platform 1", "Platform 2"],
  "key_risks": ["risk 1", "risk 2"],
  "quick_wins": ["thing you can do this week"]
}`

    const raw = await callGemini(prompt, {
      temperature: 0.4,
      maxTokens: 3000,
      jsonMode: true,
    })

    const result = parseGeminiJSON(raw)
    return NextResponse.json(result)
  } catch (err: any) {
    console.error('[Career Roadmap Error]', err?.message)
    return NextResponse.json({ error: 'Failed to generate roadmap. Please try again.' }, { status: 500 })
  }
}
