import { NextRequest, NextResponse } from 'next/server'
import { callGemini, parseGeminiJSON } from '@/lib/gemini'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const {
      current_skills = [],
      target_role,
      years_experience = 0,
      current_role = '',
      location = 'India',
    } = body

    if (!target_role) {
      return NextResponse.json({ error: 'target_role is required' }, { status: 400 })
    }

    const prompt = `You are an expert technical recruiter and career coach for the Indian job market.

Perform a detailed skill gap analysis for this professional:

PROFILE:
- Current Role: ${current_role || 'Not specified'}
- Target Role: ${target_role}
- Current Skills: ${current_skills.join(', ') || 'None listed'}
- Years of Experience: ${years_experience}
- Location: ${location}

Analyze what skills are missing, what's strong, and create a prioritized learning plan.
Focus on the Indian job market — what companies actually look for in ${target_role} roles.

Return ONLY valid JSON:
{
  "match_percentage": 65,
  "strengths": [
    { "skill": "Skill name", "level": "Advanced", "market_demand": "Very High" }
  ],
  "critical_gaps": [
    {
      "skill": "Missing skill name",
      "importance": "Critical",
      "why_needed": "Why this skill is essential for the role",
      "time_to_learn_weeks": 4,
      "free_resources": [
        { "name": "Resource name", "url": "https://...", "type": "Course/Video/Documentation" }
      ]
    }
  ],
  "nice_to_have_gaps": [
    {
      "skill": "Skill name",
      "importance": "Good to have",
      "time_to_learn_weeks": 2,
      "free_resources": [{ "name": "Resource", "url": "https://...", "type": "Course" }]
    }
  ],
  "learning_order": ["Learn this first", "Then this", "Then this"],
  "total_learning_weeks": 16,
  "job_readiness_after_plan": "high",
  "salary_impact_lpa": {
    "current_range": "4-6",
    "after_upskilling": "8-12"
  },
  "top_skills_in_demand": ["skill1", "skill2", "skill3"],
  "recommended_projects": [
    { "name": "Project idea", "skills_practiced": ["skill1", "skill2"], "impact": "What this proves to employers" }
  ]
}`

    const raw = await callGemini(prompt, {
      temperature: 0.35,
      maxTokens: 2000,
      jsonMode: true,
    })

    const result = parseGeminiJSON(raw)
    return NextResponse.json(result)
  } catch (err: any) {
    console.error('[Skill Gap Error]', err?.message)
    return NextResponse.json({ error: 'Failed to analyze skill gap. Please try again.' }, { status: 500 })
  }
}
