import { NextRequest, NextResponse } from 'next/server'
import { callGemini, parseGeminiJSON } from '@/lib/gemini'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const {
      skills = [],
      experience_years = 0,
      current_role = '',
      preferred_location = '',
      preferred_work_type = 'any',
      salary_expectation_lpa = 0,
      education = '',
    } = body

    const prompt = `You are a senior talent acquisition specialist with expertise in the Indian job market across IT, finance, healthcare, education, and government sectors.

Recommend the best-fit jobs and companies for this candidate:

PROFILE:
- Current Role: ${current_role || 'Fresher/Unspecified'}
- Skills: ${skills.join(', ') || 'Not specified'}
- Experience: ${experience_years} years
- Preferred Location: ${preferred_location || 'Open to anywhere in India'}
- Work Type Preference: ${preferred_work_type} (remote/hybrid/onsite)
- Salary Expectation: ${salary_expectation_lpa ? `₹${salary_expectation_lpa} LPA` : 'Open'}
- Education: ${education || 'Not specified'}

Provide hyper-specific, actionable recommendations for the Indian market.

Return ONLY valid JSON:
{
  "job_titles_to_search": ["Exact job title 1", "Job title 2", "Job title 3"],
  "top_companies": [
    {
      "company": "Company Name",
      "type": "MNC/Startup/PSU/Product/Service",
      "why_good_fit": "Why this company matches their profile",
      "locations": ["City 1", "City 2"],
      "avg_salary_lpa": "8-12",
      "hiring_frequency": "Frequently/Seasonally/Rarely",
      "apply_via": "LinkedIn/Naukri/Company Website/Internshala",
      "apply_url": "https://careers.company.com or LinkedIn search URL"
    }
  ],
  "search_keywords": ["keyword1", "keyword2"],
  "platforms_to_use": [
    {
      "platform": "Naukri.com",
      "why": "Best for experienced professionals in India",
      "url": "https://naukri.com",
      "tips": "Set job alerts with these keywords: ..."
    }
  ],
  "salary_benchmark": {
    "current_market_range_lpa": "6-10",
    "with_top_skills_range_lpa": "12-18",
    "negotiation_tip": "Specific negotiation advice"
  },
  "application_strategy": "Step-by-step approach to land interviews",
  "red_flags_to_avoid": ["Company type or situation to avoid"],
  "networking_tip": "Specific networking advice for Indian market"
}`

    const raw = await callGemini(prompt, {
      temperature: 0.4,
      maxTokens: 2200,
      jsonMode: true,
    })

    const result = parseGeminiJSON(raw)
    return NextResponse.json(result)
  } catch (err: any) {
    console.error('[Job Recommendations Error]', err?.message)
    return NextResponse.json({ error: 'Failed to generate recommendations. Please try again.' }, { status: 500 })
  }
}
