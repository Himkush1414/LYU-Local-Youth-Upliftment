import { NextRequest, NextResponse } from 'next/server'
import { normalizeAdzunaJob } from '@/lib/jobs/normalize'

async function fetchAdzuna(query: string, location: string) {
  const appId = process.env.ADZUNA_APP_ID
  const appKey = process.env.ADZUNA_APP_KEY
  if (!appId || !appKey) return []
  const where = location && location !== 'India' ? location : 'India'
  const url = `https://api.adzuna.com/v1/api/jobs/in/search/1?app_id=${appId}&app_key=${appKey}&results_per_page=20&what=${encodeURIComponent(query)}&where=${encodeURIComponent(where)}&content-type=application/json`
  try {
    const res = await fetch(url, { next: { revalidate: 1800 } })
    if (!res.ok) return []
    const data = await res.json()
    return (data.results || []).map(normalizeAdzunaJob)
  } catch { return [] }
}

async function fetchRemotive(query: string) {
  try {
    const q = query.toLowerCase()
    let category = ''
    if (q.includes('software') || q.includes('developer') || q.includes('engineer') || q.includes('react') || q.includes('node') || q.includes('python')) category = 'software-dev'
    else if (q.includes('design') || q.includes('ui') || q.includes('ux')) category = 'design'
    else if (q.includes('marketing') || q.includes('seo')) category = 'marketing'
    else if (q.includes('data') || q.includes('ml') || q.includes('ai')) category = 'data'
    const url = `https://remotive.com/api/remote-jobs?limit=15${category ? `&category=${category}` : ''}`
    const res = await fetch(url, { next: { revalidate: 3600 } })
    if (!res.ok) return []
    const data = await res.json()
    return (data.jobs || []).map((job: any) => ({
      id: `remotive_${job.id}`,
      title: job.title,
      company: job.company_name,
      city: null, state: null, salary_min: null, salary_max: null,
      work_type: 'remote',
      employment_type: job.job_type || 'full_time',
      description: (job.description || '').replace(/<[^>]*>/g, '').slice(0, 500),
      source: 'remotive',
      external_url: job.url,
      skills_required: job.tags || [],
      posted_at: job.publication_date,
      experience_level: 'any',
      logo_url: job.company_logo_url || null,
    }))
  } catch { return [] }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const query = searchParams.get('q') || 'software engineer'
  const location = searchParams.get('location') || 'India'
  try {
    const [adzunaJobs, remotiveJobs] = await Promise.all([
      fetchAdzuna(query, location),
      fetchRemotive(query),
    ])
    const jobs = [...adzunaJobs, ...remotiveJobs]
    if (jobs.length === 0) return NextResponse.json({ status: 'mock', data: getMockJobs() })
    return NextResponse.json({ status: 'live', data: jobs, total: jobs.length })
  } catch {
    return NextResponse.json({ status: 'mock', data: getMockJobs() })
  }
}

function getMockJobs() {
  return [
    { id: 'mock-1', title: 'Software Engineer', company: 'TechCorp India', city: 'Bengaluru', state: 'Karnataka', salary_min: 600000, salary_max: 1200000, work_type: 'onsite', employment_type: 'full_time', description: 'Join our team as a Software Engineer.', source: 'mock', external_url: '#', skills_required: ['React', 'Node.js', 'TypeScript'], posted_at: new Date().toISOString(), experience_level: 'mid', logo_url: null },
    { id: 'mock-2', title: 'Product Manager', company: 'StartupHub', city: 'Delhi', state: 'Delhi', salary_min: 1200000, salary_max: 2000000, work_type: 'hybrid', employment_type: 'full_time', description: 'Lead product strategy for our growing platform.', source: 'mock', external_url: '#', skills_required: ['Product Strategy', 'Agile', 'Analytics'], posted_at: new Date().toISOString(), experience_level: 'senior', logo_url: null },
    { id: 'mock-3', title: 'Data Scientist', company: 'Analytics Corp', city: 'Mumbai', state: 'Maharashtra', salary_min: 800000, salary_max: 1500000, work_type: 'remote', employment_type: 'full_time', description: 'Build ML models for business insights.', source: 'mock', external_url: '#', skills_required: ['Python', 'Machine Learning', 'SQL'], posted_at: new Date().toISOString(), experience_level: 'mid', logo_url: null },
  ]
}
