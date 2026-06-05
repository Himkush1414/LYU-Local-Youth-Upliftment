import { NextRequest, NextResponse } from 'next/server'
import { callGemini, parseGeminiJSON } from '@/lib/gemini'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const {
      resume_text,
      target_role,
      years_experience = 0,
      job_description = '',
    } = body

    if (!resume_text || !target_role) {
      return NextResponse.json(
        { error: 'resume_text and target_role are required' },
        { status: 400 }
      )
    }

    const prompt = `You are a senior hiring manager and ATS expert with 15+ years of recruiting experience in India's top companies (Flipkart, Zomato, TCS, Infosys, Goldman Sachs India, etc.)

Review this resume for a ${target_role} position (${years_experience} years experience):

RESUME:
${resume_text}

${job_description ? `JOB DESCRIPTION TO MATCH AGAINST:\n${job_description}` : ''}

Provide a thorough, honest review. Be specific — not generic feedback.

Return ONLY valid JSON:
{
  "overall_score": 72,
  "ats_score": 68,
  "human_readability_score": 78,
  "verdict": "Strong/Good/Needs Work/Major Revision Needed",
  "strengths": [
    { "point": "Specific strength", "impact": "Why this helps" }
  ],
  "critical_issues": [
    {
      "issue": "Specific problem",
      "location": "Where in the resume",
      "fix": "Exactly how to fix it",
      "priority": "High/Medium/Low"
    }
  ],
  "ats_issues": [
    "Missing keyword X that ATS filters for",
    "Date format inconsistency"
  ],
  "missing_sections": ["Section that should be added"],
  "formatting_issues": ["Specific formatting problem"],
  "content_improvements": [
    {
      "original": "Original bullet point text",
      "improved": "Rewritten version with numbers and impact",
      "why_better": "Explanation"
    }
  ],
  "keywords_found": ["keyword1", "keyword2"],
  "keywords_missing": ["important keyword not in resume"],
  "interview_probability": "35%",
  "top_3_actions": [
    "Most important thing to fix right now",
    "Second most important",
    "Third"
  ],
  "estimated_improvement_if_fixed": "Score would go from 72 to ~88 if all critical issues are fixed"
}`

    const raw = await callGemini(prompt, {
      temperature: 0.25,
      maxTokens: 2500,
      jsonMode: true,
    })

    const result = parseGeminiJSON(raw)
    return NextResponse.json(result)
  } catch (err: any) {
    console.error('[Resume Review Error]', err?.message)
    return NextResponse.json({ error: 'Failed to review resume. Please try again.' }, { status: 500 })
  }
}
