import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const state = searchParams.get('state')
  const city = searchParams.get('city')

  try {
    const supabase = await createClient()

    // Jobs in last 30 days for this location
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
    let query = supabase
      .from('jobs')
      .select('id, state, city, salary_min, salary_max, job_skills(skills(name))')
      .eq('status', 'active')
      .gte('created_at', thirtyDaysAgo)

    if (city) query = query.eq('city', city)
    else if (state) query = query.eq('state', state)

    const { data: jobs } = await query

    if (!jobs || jobs.length === 0) {
      return NextResponse.json({
        total_jobs: 0,
        top_skills: [],
        avg_salary: null,
        demand_score: 0,
        trending: false,
        location: { state, city }
      })
    }

    // Count skills
    const skillCount: Record<string, number> = {}
    for (const job of jobs) {
      const jobSkills = (job.job_skills || []) as { skills: { name: string } }[]
      for (const js of jobSkills) {
        if (js.skills?.name) {
          skillCount[js.skills.name] = (skillCount[js.skills.name] || 0) + 1
        }
      }
    }

    const topSkills = Object.entries(skillCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([name]) => name)

    // Average salary
    const salaries = jobs.filter(j => j.salary_min).map(j => j.salary_min as number)
    const avgSalary = salaries.length > 0
      ? Math.round(salaries.reduce((a, b) => a + b, 0) / salaries.length)
      : null

    const demandScore = Math.min(100, Math.round((jobs.length / 50) * 100))

    return NextResponse.json({
      total_jobs: jobs.length,
      top_skills: topSkills,
      avg_salary: avgSalary,
      demand_score: demandScore,
      trending: demandScore > 60,
      location: { state, city }
    })
  } catch (err) {
    console.error('Demand analytics error:', err)
    return NextResponse.json({ error: 'Failed to fetch demand data' }, { status: 500 })
  }
}
