'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { TrendingUp, MapPin, ArrowRight } from 'lucide-react'

interface DemandData {
  total_jobs: number
  top_skills: string[]
  avg_salary: number | null
  demand_score: number
  trending: boolean
}

export default function LocationDemandBanner({ state, city }: { state?: string; city?: string }) {
  const [data, setData] = useState<DemandData | null>(null)

  useEffect(() => {
    if (!state && !city) return
    const params = new URLSearchParams()
    if (state) params.set('state', state)
    if (city) params.set('city', city)

    fetch(`/api/v1/analytics/demand?${params}`)
      .then(r => r.json())
      .then(d => { if (d.total_jobs > 0) setData(d) })
      .catch(() => {})
  }, [state, city])

  if (!data || data.total_jobs === 0) return null

  return (
    <div style={{
      background: 'linear-gradient(135deg,#eff6ff,#f5f3ff)',
      border: '1px solid #bfdbfe', borderRadius: 16, padding: '16px 20px',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{ width: 40, height: 40, background: '#eff6ff', borderRadius: 12, border: '1px solid #bfdbfe', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          {data.trending ? <TrendingUp style={{ width: 20, height: 20, color: '#2563eb' }} /> : <MapPin style={{ width: 20, height: 20, color: '#2563eb' }} />}
        </div>
        <div>
          <p style={{ fontWeight: 800, color: '#0f172a', fontSize: 14, marginBottom: 4 }}>
            🔥 {data.total_jobs} jobs available in {city || state} right now
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {data.top_skills.slice(0, 3).map(skill => (
              <span key={skill} style={{ fontSize: 11, fontWeight: 700, color: '#1d4ed8', background: '#dbeafe', padding: '2px 8px', borderRadius: 9999 }}>{skill}</span>
            ))}
            {data.avg_salary && (
              <span style={{ fontSize: 11, color: '#64748b' }}>Avg ₹{(data.avg_salary / 1000).toFixed(0)}K/mo</span>
            )}
          </div>
        </div>
      </div>
      <Link href={`/jobs?${new URLSearchParams({ ...(state ? { state } : {}), ...(city ? { city } : {}) }).toString()}`}
        style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: '#2563eb', color: 'white', fontWeight: 700, fontSize: 13, padding: '9px 16px', borderRadius: 10, textDecoration: 'none', whiteSpace: 'nowrap' }}>
        View Jobs <ArrowRight style={{ width: 13, height: 13 }} />
      </Link>
    </div>
  )
}
