import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const state = searchParams.get('state')
    const district = searchParams.get('district')
    const city = searchParams.get('city')
    const skills = searchParams.get('skills')?.split(',').filter(Boolean)
    const work_type = searchParams.get('work_type')
    const employment_type = searchParams.get('employment_type')
    const salary_min = searchParams.get('salary_min')
    const salary_max = searchParams.get('salary_max')
    const experience_level = searchParams.get('experience_level')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const offset = (page - 1) * limit

    const supabase = await createClient()

    // Build base query for LYU-posted jobs
    let query = supabase
      .from('jobs')
      .select(`
        *,
        companies (name, logo_url, is_verified, hq_city, hq_state),
        job_skills (skill_id, is_required, skills (name))
      `, { count: 'exact' })
      .eq('status', 'active')
      .is('deleted_at', null)

    // Location filtering with priority
    if (city) {
      query = query.or(`city.eq.${city},work_type.eq.remote`)
    } else if (state) {
      query = query.or(`state.eq.${state},work_type.eq.remote`)
    }

    if (work_type) query = query.eq('work_type', work_type)
    if (employment_type) query = query.eq('employment_type', employment_type)
    if (experience_level) query = query.eq('experience_level', experience_level)
    if (salary_min) query = query.gte('salary_min', parseInt(salary_min))
    if (salary_max) query = query.lte('salary_max', parseInt(salary_max))

    query = query.order('created_at', { ascending: false }).range(offset, offset + limit - 1)

    const { data: lyuJobs, error: lyuError, count } = await query

    if (lyuError) {
      console.error('LYU jobs query error:', lyuError)
    }

    // Also fetch external jobs
    let extQuery = supabase
      .from('external_jobs')
      .select('*', { count: 'exact' })
      .eq('is_expired', false)

    if (city) extQuery = extQuery.or(`city.eq.${city},work_type.eq.remote`)
    else if (state) extQuery = extQuery.or(`state.eq.${state},work_type.eq.remote`)
    if (work_type) extQuery = extQuery.eq('work_type', work_type)

    extQuery = extQuery.order('posted_at', { ascending: false }).range(0, 19)

    const { data: extJobs } = await extQuery

    // Normalize and merge
    const normalizedLYU = (lyuJobs || []).map(job => ({
      ...job,
      source: 'lyu',
      company_name: job.companies?.name,
      company_logo: job.companies?.logo_url,
      company_verified: job.companies?.is_verified,
      skills_required: (job.job_skills || []).map((js: { skills: { name: string } }) => js.skills?.name).filter(Boolean),
    }))

    const normalizedExt = (extJobs || []).map(job => ({
      ...job,
      source: job.source,
      company_name: job.company,
      company_logo: null,
      company_verified: false,
      skills_required: job.skills || [],
    }))

    // Sort: LYU jobs first, then external
    const merged = [...normalizedLYU, ...normalizedExt]

    // Location breakdown stats
    const cityCount = merged.filter(j => j.city === city).length
    const stateCount = merged.filter(j => j.state === state && j.city !== city).length
    const remoteCount = merged.filter(j => j.work_type === 'remote').length

    return NextResponse.json({
      jobs: merged,
      total: (count || 0) + (extJobs?.length || 0),
      page,
      limit,
      location_breakdown: {
        exact_city: cityCount,
        state: stateCount,
        remote: remoteCount,
      }
    })
  } catch (err) {
    console.error('Jobs API error:', err)
    return NextResponse.json({ error: 'Failed to fetch jobs' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const body = await req.json()

    // Get company for this user
    const { data: company } = await supabase
      .from('companies')
      .select('id, is_verified, profile_completion, created_at')
      .eq('owner_id', user.id)
      .single()

    if (!company) return NextResponse.json({ error: 'Company profile not found. Please complete your company profile first.' }, { status: 400 })

    // Fraud detection
    const fraudScore = calculateFraudScore(body, company, user)
    let status = 'active'
    let fraud_flagged = false

    if (fraudScore >= 80) {
      status = 'rejected'
      fraud_flagged = true
    } else if (fraudScore >= 50) {
      status = 'under_review'
      fraud_flagged = true
    }

    // Insert job
    const { data: job, error } = await supabase
      .from('jobs')
      .insert({
        company_id: company.id,
        title: body.title,
        slug: generateSlug(body.title, company.id),
        description: body.description,
        requirements: body.requirements,
        employment_type: body.employment_type || 'full_time',
        work_type: body.work_type || 'onsite',
        experience_level: body.experience_level || 'fresher',
        salary_min: body.salary_min || null,
        salary_max: body.salary_max || null,
        salary_disclosed: body.salary_disclosed !== false,
        state: body.state,
        city: body.city,
        openings_count: body.openings_count || 1,
        status,
        expires_at: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString(),
      })
      .select()
      .single()

    if (error) throw error

    // Insert job skills
    if (body.skills?.length && job) {
      const skillInserts = []
      for (const skillName of body.skills) {
        let { data: skill } = await supabase.from('skills').select('id').eq('name', skillName).single()
        if (!skill) {
          const { data: newSkill } = await supabase.from('skills').insert({ name: skillName, category: 'general' }).select().single()
          skill = newSkill
        }
        if (skill) skillInserts.push({ job_id: job.id, skill_id: skill.id, is_required: true })
      }
      if (skillInserts.length) await supabase.from('job_skills').insert(skillInserts)
    }

    // Notify admin if flagged
    if (fraud_flagged && status !== 'rejected') {
      await supabase.from('notifications').insert({
        user_id: user.id,
        type: 'job_under_review',
        title: 'Your job is under review',
        body: 'We are reviewing your job posting for quality. It will be live within 24 hours.',
        action_url: `/employer/jobs/${job?.id}`,
      })
    }

    return NextResponse.json({ job, status, fraud_score: fraudScore })
  } catch (err) {
    console.error('Job POST error:', err)
    return NextResponse.json({ error: 'Failed to create job' }, { status: 500 })
  }
}

function calculateFraudScore(body: Record<string, unknown>, company: Record<string, unknown>, user: Record<string, unknown>): number {
  let score = 0
  const desc = ((body.description as string) || '').toLowerCase()
  const salaryMax = Number(body.salary_max) || 0
  const experienceLevel = body.experience_level as string

  if (salaryMax > 83333 && experienceLevel === 'fresher') score += 30
  const accountAgeDays = (Date.now() - new Date((company.created_at as string)).getTime()) / (1000 * 60 * 60 * 24)
  if (accountAgeDays < 7) score += 20
  if ((company.profile_completion as number) < 30) score += 20

  const suspiciousTerms = ['no experience needed', 'earn ₹', 'earn rs', 'part time from home', 'घर बैठे', 'data entry work from home', 'unlimited earning']
  if (suspiciousTerms.some(t => desc.includes(t))) score += 15

  const email = (user as { email?: string }).email || ''
  if (['@gmail', '@yahoo', '@hotmail', '@outlook'].some(d => email.includes(d))) score += 10

  return score
}

function generateSlug(title: string, companyId: string): string {
  const base = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
  const suffix = companyId.slice(0, 8)
  return `${base}-${suffix}-${Date.now()}`
}
