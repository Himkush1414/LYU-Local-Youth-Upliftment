import { NextRequest, NextResponse } from 'next/server'
import { normalizeAdzunaJob, normalizeJSearchJob } from '@/lib/jobs/normalize'

async function fetchAdzuna(state: string, city: string) {
  const appId = process.env.ADZUNA_APP_ID
  const appKey = process.env.ADZUNA_APP_KEY
  if (!appId || !appKey) return []

  const where = city || state || 'India'
  const url = `https://api.adzuna.com/v1/api/jobs/in/search/1?app_id=${appId}&app_key=${appKey}&results_per_page=20&where=${encodeURIComponent(where)}&content-type=application/json`

  try {
    const res = await fetch(url, { next: { revalidate: 3600 } })
    if (!res.ok) return []
    const data = await res.json()
    return (data.results || []).map(normalizeAdzunaJob)
  } catch {
    return []
  }
}

async function fetchJSearch(query: string, location: string) {
  const apiKey = process.env.JSEARCH_API_KEY
  if (!apiKey) return []

  try {
    const res = await fetch(
      `https://jsearch.p.rapidapi.com/search?query=${encodeURIComponent(query)}&location=${encodeURIComponent(location)}&num_pages=1`,
      {
        headers: { 'X-RapidAPI-Key': apiKey, 'X-RapidAPI-Host': 'jsearch.p.rapidapi.com' },
        next: { revalidate: 3600 }
      }
    )
    if (!res.ok) return []
    const data = await res.json()
    return (data.data || []).map(normalizeJSearchJob)
  } catch {
    return []
  }
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const state = searchParams.get('state') || ''
  const city = searchParams.get('city') || ''
  const query = searchParams.get('q') || 'jobs'

  try {
    // Try Adzuna first
    let jobs = await fetchAdzuna(state, city)

    // Fallback to JSearch if Adzuna returns nothing
    if (jobs.length === 0) {
      const location = city || state || 'India'
      jobs = await fetchJSearch(query, location)
    }

    return NextResponse.json({ jobs, source: jobs[0]?.source || 'none', total: jobs.length })
  } catch (err) {
    console.error('External jobs error:', err)
    return NextResponse.json({ jobs: [], error: 'Failed to fetch external jobs' }, { status: 500 })
  }
}
