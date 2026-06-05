import { NextRequest, NextResponse } from 'next/server'
import { callGemini, parseGeminiJSON } from '@/lib/gemini'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const {
      name,
      headline,
      summary,
      skills = [],
      experience = [],
      education = [],
      target_role,
      platform = 'linkedin',
    } = body

    if (!target_role) {
      return NextResponse.json({ error: 'target_role is required' }, { status: 400 })
    }

    const prompt = `You are a LinkedIn profile optimization expert who specializes in helping Indian professionals get found by recruiters and get more interview calls.

Optimize this professional's ${platform} profile:

CURRENT PROFILE:
- Name: ${name}
- Current Headline: ${headline || 'Not set'}
- Current Summary/About: ${summary || 'Not written'}
- Skills: ${skills.join(', ') || 'None listed'}
- Experience: ${JSON.stringify(experience)}
- Education: ${JSON.stringify(education)}
- Target Role: ${target_role}

Indian LinkedIn context: Recruiters at TCS, Infosys, Wipro, HCL, Accenture, Deloitte, startups actively search LinkedIn India.

Return ONLY valid JSON:
{
  "profile_score": 68,
  "optimized_headline": "New compelling headline (max 220 chars) | Include role + value proposition + key skill",
  "optimized_summary": "Full optimized About section (300-400 words) — first-person, achievements-focused, ends with CTA",
  "skills_to_add": ["High-demand skill 1", "Skill 2"],
  "skills_to_remove": ["Generic skill to remove"],
  "skills_to_keep": ["Keep this important skill"],
  "keyword_density_improvements": ["Add this keyword to headline", "Mention X in experience"],
  "section_improvements": [
    {
      "section": "Experience",
      "current_issue": "What's wrong",
      "fix": "How to fix it specifically"
    }
  ],
  "recruiter_visibility_tips": [
    "Specific tip to appear in more recruiter searches"
  ],
  "profile_photo_tip": "Professional photo advice",
  "connection_strategy": "How to grow network for job search",
  "engagement_tip": "What content to post/engage with",
  "expected_improvement": "After these changes, expect X% more profile views and Y% more recruiter messages"
}`

    const raw = await callGemini(prompt, {
      temperature: 0.35,
      maxTokens: 2000,
      jsonMode: true,
    })

    const result = parseGeminiJSON(raw)
    return NextResponse.json(result)
  } catch (err: any) {
    console.error('[Profile Optimizer Error]', err?.message)
    return NextResponse.json({ error: 'Failed to optimize profile. Please try again.' }, { status: 500 })
  }
}
