import { NextRequest, NextResponse } from 'next/server'
import { callGemini, parseGeminiJSON } from '@/lib/gemini'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const {
      name,
      email,
      phone,
      city,
      state,
      linkedin_url = '',
      github_url = '',
      portfolio_url = '',
      skills = [],
      experience = [],
      education = [],
      target_role,
      years_experience = 0,
      achievements = [],
    } = body

    if (!name || !target_role) {
      return NextResponse.json({ error: 'name and target_role are required' }, { status: 400 })
    }

    const prompt = `You are an expert Indian resume writer who specializes in ATS-optimized resumes for the Indian job market (IT, finance, consulting, startups, MNCs).

Create a powerful, ATS-optimized resume for this candidate:

CANDIDATE DETAILS:
- Full Name: ${name}
- Email: ${email}
- Phone: ${phone}
- Location: ${city}, ${state}
- LinkedIn: ${linkedin_url}
- GitHub: ${github_url}
- Portfolio: ${portfolio_url}
- Target Role: ${target_role}
- Total Experience: ${years_experience} years
- Skills: ${skills.join(', ')}
- Work Experience: ${JSON.stringify(experience)}
- Education: ${JSON.stringify(education)}
- Key Achievements: ${achievements.join(', ') || 'None specified'}

RULES FOR THE RESUME:
- Professional summary must be 2-3 punchy lines, tailored to ${target_role}
- Use strong action verbs: Led, Architected, Optimized, Reduced, Increased, Built, Deployed
- Quantify everything possible (%, numbers, scale)
- ATS keywords must match common ${target_role} job descriptions
- Keep bullet points under 2 lines each
- Indian format: include CGPA/percentage if education provided
- Do NOT include age, religion, marital status (modern Indian resume format)

Return ONLY valid JSON:
{
  "summary": "Professional summary (2-3 sentences, impactful)",
  "skills_section": {
    "technical": ["skill1", "skill2"],
    "soft": ["skill1", "skill2"],
    "tools": ["tool1", "tool2"],
    "languages": ["language1"]
  },
  "experience_bullets": [
    {
      "company": "Company Name",
      "role": "Job Title",
      "duration": "Jun 2022 – Present",
      "location": "Bengaluru, Karnataka",
      "bullets": [
        "Led development of X, resulting in Y% improvement in Z",
        "Built and deployed A using B, reducing C by D%"
      ]
    }
  ],
  "education_section": [
    {
      "degree": "B.Tech Computer Science",
      "institution": "Institution Name",
      "year": "2020",
      "score": "8.2 CGPA",
      "relevant_courses": ["Course 1", "Course 2"]
    }
  ],
  "certifications_section": [
    {
      "name": "Certification Name",
      "issuer": "Platform/Company",
      "year": "2023",
      "url": ""
    }
  ],
  "projects_section": [
    {
      "name": "Project Name",
      "tech_stack": ["React", "Node.js"],
      "description": "What it does and impact",
      "url": ""
    }
  ],
  "ats_keywords": ["keyword1", "keyword2", "keyword3"],
  "resume_score": 82,
  "improvement_tips": ["Tip 1 to improve further", "Tip 2"]
}`

    const raw = await callGemini(prompt, {
      temperature: 0.3,
      maxTokens: 2500,
      jsonMode: true,
    })

    const result = parseGeminiJSON(raw)
    return NextResponse.json(result)
  } catch (err: any) {
    console.error('[Resume Builder Error]', err?.message)
    return NextResponse.json({ error: 'Failed to generate resume. Please try again.' }, { status: 500 })
  }
}
