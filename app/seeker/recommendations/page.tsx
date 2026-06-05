'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { toast } from 'sonner'

const JOBS = [
  { id: '1', title: 'Senior React Developer', company: 'TechCorp', city: 'Chandigarh', state: 'Punjab', salary: '₹30K–45K/mo', match: 95, type: 'Full Time', work: 'Remote', posted: '1h ago', skills: ['React', 'TypeScript', 'Node.js'], reasons: ['React matches', 'Remote preference', 'Chandigarh base'] },
  { id: '2', title: 'Frontend Engineer', company: 'StartupX', city: 'Mohali', state: 'Punjab', salary: '₹25K–35K/mo', match: 88, type: 'Full Time', work: 'Hybrid', posted: '3h ago', skills: ['React', 'JavaScript', 'CSS'], reasons: ['React matches', '4km from you', 'Experience match'] },
  { id: '3', title: 'UI Developer', company: 'DesignLab', city: 'Panchkula', state: 'Haryana', salary: '₹20K–28K/mo', match: 74, type: 'Contract', work: 'Onsite', posted: '8h ago', skills: ['CSS', 'Figma', 'JavaScript'], reasons: ['JavaScript matches', 'Nearby location'] },
  { id: '4', title: 'Full Stack Developer', company: 'WebAgency', city: 'Ludhiana', state: 'Punjab', salary: '₹28K–40K/mo', match: 82, type: 'Full Time', work: 'Remote', posted: '12h ago', skills: ['React', 'Node.js', 'MongoDB'], reasons: ['Node.js matches', 'Remote OK'] },
]

function SkeletonCard() {
  return (
    <div style={{ background: 'white', borderRadius: 16, border: '1px solid #f1f5f9', padding: 20 }}>
      <style>{`@keyframes sk { 0% { background-position: -200% 0; } 100% { background-position: 200% 0; } }`}</style>
      {[['70%', 14], ['45%', 10], ['90%', 10]].map(([w, h], i) => (
        <div key={i} style={{ height: h as number, borderRadius: 6, width: w as string, marginBottom: 10, background: 'linear-gradient(90deg,#f1f5f9 25%,#e8edf2 50%,#f1f5f9 75%)', backgroundSize: '200% 100%', animation: 'sk 1.5s infinite' }} />
      ))}
    </div>
  )
}

function MatchBadge({ score }: { score: number }) {
  const c = score >= 85 ? '#15803d' : score >= 70 ? '#2563eb' : '#b45309'
  const bg = score >= 85 ? '#f0fdf4' : score >= 70 ? '#eff6ff' : '#fffbeb'
  const border = score >= 85 ? '#bbf7d0' : score >= 70 ? '#bfdbfe' : '#fde68a'
  return (
    <span style={{ fontSize: 11, fontWeight: 800, color: c, background: bg, border: `1px solid ${border}`, padding: '3px 10px', borderRadius: 9999 }}>
      {score}% match
    </span>
  )
}

export default function RecommendationsPage() {
  const [loading, setLoading] = useState(true)
  const [saved, setSaved] = useState<string[]>([])
  const [filter, setFilter] = useState('All')

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 1200)
    return () => clearTimeout(t)
  }, [])

  const refresh = async () => {
    setLoading(true)
    await new Promise(r => setTimeout(r, 1400))
    setLoading(false)
    toast.success('Recommendations refreshed based on your latest profile!')
  }

  const filters = ['All', 'Remote', 'Nearby', 'High Match']
  const filtered = JOBS.filter(j => {
    if (filter === 'All') return true
    if (filter === 'Remote') return j.work === 'Remote'
    if (filter === 'Nearby') return j.city === 'Chandigarh' || j.city === 'Mohali'
    if (filter === 'High Match') return j.match >= 85
    return true
  })

  return (
    <div style={{ fontFamily: 'Inter, system-ui, sans-serif', display: 'flex', flexDirection: 'column', gap: 24 }}>
      <style>{`
        @keyframes sk { 0% { background-position: -200% 0; } 100% { background-position: 200% 0; } }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
            <div style={{ width: 30, height: 30, borderRadius: 9, background: 'linear-gradient(135deg,#2563eb,#4f46e5)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
              </svg>
            </div>
            <h1 style={{ fontSize: 22, fontWeight: 900, color: '#0f172a' }}>For You</h1>
          </div>
          <p style={{ color: '#64748b', fontSize: 14 }}>AI-curated jobs based on your skills · React, JavaScript, TypeScript · Chandigarh</p>
        </div>
        <button onClick={refresh} style={{ display: 'inline-flex', alignItems: 'center', gap: 7, fontSize: 13, fontWeight: 700, color: '#2563eb', background: '#eff6ff', border: '1px solid #bfdbfe', padding: '8px 16px', borderRadius: 10, cursor: 'pointer', fontFamily: 'inherit' }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/>
          </svg>
          Refresh AI
        </button>
      </div>

      {/* AI info banner */}
      <div style={{ background: 'linear-gradient(135deg,#eff6ff,#f5f3ff)', border: '1px solid #c7d2fe', borderRadius: 14, padding: '14px 18px', display: 'flex', alignItems: 'flex-start', gap: 12 }}>
        <div style={{ width: 36, height: 36, borderRadius: 10, background: 'linear-gradient(135deg,#2563eb,#4f46e5)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="3"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14M4.93 4.93a10 10 0 0 0 0 14.14"/>
          </svg>
        </div>
        <div>
          <p style={{ fontWeight: 700, color: '#1e40af', fontSize: 14, marginBottom: 3 }}>AI is matching you to {JOBS.length} jobs right now</p>
          <p style={{ fontSize: 12, color: '#4338ca', lineHeight: 1.6 }}>
            Based on your <strong>React, JavaScript, TypeScript</strong> skills and location in <strong>Chandigarh</strong>.
            Your average match score is <strong>{Math.round(JOBS.reduce((a, j) => a + j.match, 0) / JOBS.length)}%</strong>.
            <Link href="/seeker/learning" style={{ color: '#2563eb', marginLeft: 4, fontWeight: 700 }}>Improve your score →</Link>
          </p>
        </div>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: 7, flexWrap: 'wrap' }}>
        {filters.map(f => (
          <button key={f} onClick={() => setFilter(f)} style={{
            padding: '7px 16px', borderRadius: 9999, fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', border: 'none', transition: 'all 0.15s',
            background: filter === f ? '#2563eb' : '#f1f5f9', color: filter === f ? 'white' : '#475569',
          }}>{f}</button>
        ))}
        <span style={{ marginLeft: 'auto', fontSize: 12, color: '#94a3b8', display: 'flex', alignItems: 'center' }}>
          {filtered.length} job{filtered.length !== 1 ? 's' : ''}
        </span>
      </div>

      {/* Job cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        {loading ? (
          [1, 2, 3].map(i => <SkeletonCard key={i} />)
        ) : filtered.map((job, idx) => (
          <div key={job.id} style={{ background: 'white', borderRadius: 16, border: '1px solid #e2e8f0', padding: '20px 22px', boxShadow: '0 1px 4px rgba(0,0,0,0.04)', transition: 'all 0.2s', animation: `fadeUp 0.4s ease ${idx * 0.07}s both` }}
            onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.08)'; e.currentTarget.style.borderColor = '#bfdbfe' }}
            onMouseLeave={e => { e.currentTarget.style.boxShadow = '0 1px 4px rgba(0,0,0,0.04)'; e.currentTarget.style.borderColor = '#e2e8f0' }}>

            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14 }}>
              {/* Logo */}
              <div style={{ width: 46, height: 46, borderRadius: 13, background: 'linear-gradient(135deg,#2563eb,#4f46e5)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, boxShadow: '0 4px 12px rgba(37,99,235,0.2)' }}>
                <span style={{ color: 'white', fontWeight: 900, fontSize: 16 }}>{job.company[0]}</span>
              </div>

              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 10, flexWrap: 'wrap' }}>
                  <div>
                    <Link href={`/seeker/jobs/${job.id}`} style={{ fontWeight: 900, color: '#0f172a', fontSize: 16, textDecoration: 'none', display: 'block', marginBottom: 2 }}
                      onMouseEnter={e => e.currentTarget.style.color = '#2563eb'}
                      onMouseLeave={e => e.currentTarget.style.color = '#0f172a'}>
                      {job.title}
                    </Link>
                    <p style={{ fontSize: 13, color: '#64748b' }}>{job.company}</p>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
                    <MatchBadge score={job.match} />
                    <button onClick={() => setSaved(s => s.includes(job.id) ? s.filter(id => id !== job.id) : [...s, job.id])} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4, display: 'flex', alignItems: 'center', color: saved.includes(job.id) ? '#2563eb' : '#cbd5e1' }}>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill={saved.includes(job.id) ? '#2563eb' : 'none'} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
                      </svg>
                    </button>
                  </div>
                </div>

                {/* Meta */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginTop: 10 }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, color: '#64748b' }}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                    {job.city}
                  </span>
                  <span style={{ fontSize: 11, fontWeight: 600, color: '#475569', background: '#f8fafc', border: '1px solid #e2e8f0', padding: '2px 9px', borderRadius: 9999 }}>{job.type}</span>
                  <span style={{ fontSize: 11, fontWeight: 700, color: '#2563eb', background: '#eff6ff', border: '1px solid #bfdbfe', padding: '2px 9px', borderRadius: 9999 }}>{job.work}</span>
                  <span style={{ fontSize: 12, fontWeight: 800, color: '#0f172a' }}>{job.salary}</span>
                  <span style={{ fontSize: 11, color: '#94a3b8', display: 'flex', alignItems: 'center', gap: 3 }}>
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                    {job.posted}
                  </span>
                </div>

                {/* Skill chips */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 10 }}>
                  {job.skills.map(s => (
                    <span key={s} style={{ fontSize: 11, fontWeight: 600, color: '#1d4ed8', background: '#eff6ff', border: '1px solid #dbeafe', padding: '3px 10px', borderRadius: 9999 }}>{s}</span>
                  ))}
                </div>

                {/* AI match reasons */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 8 }}>
                  {job.reasons.map(r => (
                    <span key={r} style={{ fontSize: 11, fontWeight: 600, color: '#15803d', background: '#f0fdf4', border: '1px solid #bbf7d0', padding: '2px 9px', borderRadius: 9999, display: 'flex', alignItems: 'center', gap: 4 }}>
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                      {r}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 16, paddingTop: 14, borderTop: '1px solid #f8fafc', flexWrap: 'wrap', gap: 10 }}>
              <div style={{ display: 'flex', items: 'center', gap: 8 }}>
                <span style={{ fontSize: 12, color: '#94a3b8' }}>Posted {job.posted}</span>
              </div>
              <Link href={`/seeker/jobs/${job.id}`} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 13, fontWeight: 700, color: 'white', background: 'linear-gradient(135deg,#2563eb,#1d4ed8)', padding: '9px 20px', borderRadius: 10, textDecoration: 'none', boxShadow: '0 4px 12px rgba(37,99,235,0.25)' }}>
                View & Apply
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
              </Link>
            </div>
          </div>
        ))}

        {!loading && filtered.length === 0 && (
          <div style={{ textAlign: 'center', padding: '48px 20px', background: 'white', borderRadius: 16, border: '1px solid #e2e8f0' }}>
            <div style={{ width: 56, height: 56, borderRadius: 16, background: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            </div>
            <p style={{ fontWeight: 800, color: '#0f172a', fontSize: 16, marginBottom: 6 }}>No jobs match this filter</p>
            <p style={{ fontSize: 13, color: '#64748b' }}>Try another filter or refresh your recommendations</p>
          </div>
        )}
      </div>
    </div>
  )
}
