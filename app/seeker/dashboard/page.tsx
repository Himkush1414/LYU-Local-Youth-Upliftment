'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

function timeAgo(date: string) {
  const diff = Math.floor((Date.now() - new Date(date).getTime()) / 1000)
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`
  return `${Math.floor(diff / 86400)}d ago`
}

const QUICK_ACTIONS = [
  {
    label: 'AI Resume Builder', desc: 'Build a professional resume with AI', href: '/seeker/resume', color: '#d97706', bg: '#fffbeb',
    icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>,
  },
  {
    label: 'Career AI Chat', desc: 'Ask about jobs, skills and salary', href: '/seeker/chat', color: '#7c3aed', bg: '#f5f3ff',
    icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>,
  },
  {
    label: 'Skill Gap Analysis', desc: 'Discover what skills to learn next', href: '/seeker/learning', color: '#0891b2', bg: '#ecfeff',
    icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>,
  },
  {
    label: 'Browse All Jobs', desc: 'Live jobs from LinkedIn & Indeed', href: '/seeker/jobs', color: '#2563eb', bg: '#eff6ff',
    icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>,
  },
]

export default function SeekerDashboard() {
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<any>(null)
  const [jobs, setJobs] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [jobsLoading, setJobsLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
      if (user) {
        const { data } = await supabase.from('profiles').select('*').eq('user_id', user.id).single()
        setProfile(data)
      }
      setLoading(false)
    }
    load()
  }, [])

  useEffect(() => {
    async function loadJobs() {
      try {
        const res = await fetch('/api/v1/jobs/search?q=jobs&location=India')
        const data = await res.json()
        setJobs((data.data || []).slice(0, 5))
      } catch { setJobs([]) }
      finally { setJobsLoading(false) }
    }
    loadJobs()
  }, [])

  const name = profile?.full_name || user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'there'
  const firstName = name.split(' ')[0]
  const completion = profile?.profile_completion || 35
  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'

  const formatSalary = (min: number, max: number) => {
    const fmt = (n: number) => n >= 100000 ? `₹${(n / 100000).toFixed(0)}L` : `₹${(n / 1000).toFixed(0)}K`
    if (min && max) return `${fmt(min)}–${fmt(max)}/yr`
    if (min) return `${fmt(min)}+`
    return null
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24, fontFamily: 'Inter, system-ui, sans-serif', paddingBottom: 60 }}>

      {/* Greeting */}
      <div>
        <h1 style={{ fontSize: 24, fontWeight: 900, color: '#0f172a', letterSpacing: '-0.02em', marginBottom: 4 }}>
          {greeting}, {loading ? '...' : firstName}
        </h1>
        <p style={{ color: '#64748b', fontSize: 14 }}>Here are your latest job opportunities</p>
      </div>

      {/* Profile completion banner — only if incomplete */}
      {!loading && completion < 80 && (
        <div style={{ background: 'linear-gradient(135deg, #eff6ff, #f5f3ff)', border: '1px solid #c7d2fe', borderRadius: 16, padding: '18px 22px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 14 }}>
            <div style={{ flex: 1, minWidth: 220 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                <p style={{ fontWeight: 700, color: '#1e40af', fontSize: 14 }}>Complete your profile — {completion}% done</p>
                <span style={{ fontWeight: 800, color: '#2563eb', fontSize: 13 }}>{completion}%</span>
              </div>
              <div style={{ height: 6, background: '#dbeafe', borderRadius: 9999, overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${completion}%`, background: 'linear-gradient(90deg,#2563eb,#6366f1)', borderRadius: 9999, transition: 'width 0.7s ease' }} />
              </div>
              <p style={{ fontSize: 12, color: '#475569', marginTop: 6 }}>Reach 80% to get 3x more interview calls from employers</p>
            </div>
            <Link href="/seeker/profile" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: '#2563eb', color: 'white', fontWeight: 700, fontSize: 13, padding: '10px 18px', borderRadius: 11, textDecoration: 'none', flexShrink: 0, whiteSpace: 'nowrap' }}>
              Complete Profile
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
            </Link>
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div>
        <h2 style={{ fontSize: 15, fontWeight: 800, color: '#0f172a', marginBottom: 12 }}>Quick Actions</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 12 }}>
          {QUICK_ACTIONS.map(a => (
            <Link key={a.label} href={a.href} style={{ background: 'white', borderRadius: 14, border: '1px solid #f1f5f9', padding: '16px 18px', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 14, boxShadow: '0 1px 3px rgba(0,0,0,0.04)', transition: 'all 0.2s' }}
              onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 6px 20px rgba(0,0,0,0.08)'; e.currentTarget.style.transform = 'translateY(-2px)' }}
              onMouseLeave={e => { e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.04)'; e.currentTarget.style.transform = 'translateY(0)' }}>
              <div style={{ width: 42, height: 42, borderRadius: 12, background: a.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, color: a.color }}>{a.icon}</div>
              <div>
                <p style={{ fontWeight: 700, color: '#0f172a', fontSize: 14, marginBottom: 2 }}>{a.label}</p>
                <p style={{ fontSize: 12, color: '#64748b' }}>{a.desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Latest Jobs — live from API, no dummy data */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14, flexWrap: 'wrap', gap: 8 }}>
          <div>
            <h2 style={{ fontSize: 15, fontWeight: 800, color: '#0f172a', marginBottom: 2 }}>Latest Jobs Near You</h2>
            <p style={{ fontSize: 12, color: '#94a3b8' }}>Live data · Aggregated from LinkedIn, Indeed & more</p>
          </div>
          <Link href="/seeker/jobs" style={{ fontSize: 13, color: '#2563eb', fontWeight: 700, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 4 }}>
            Browse all
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
          </Link>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {jobsLoading ? (
            [...Array(4)].map((_, i) => (
              <div key={i} style={{ background: 'white', borderRadius: 14, border: '1px solid #f1f5f9', padding: '18px 20px', display: 'flex', gap: 14, boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
                <div style={{ width: 44, height: 44, borderRadius: 12, flexShrink: 0, background: 'linear-gradient(90deg,#f1f5f9 25%,#e8edf2 50%,#f1f5f9 75%)', backgroundSize: '200% 100%', animation: 'shimmer 1.5s infinite' }} />
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 9 }}>
                  <div style={{ height: 14, width: '50%', borderRadius: 7, background: 'linear-gradient(90deg,#f1f5f9 25%,#e8edf2 50%,#f1f5f9 75%)', backgroundSize: '200% 100%', animation: 'shimmer 1.5s infinite' }} />
                  <div style={{ height: 11, width: '30%', borderRadius: 6, background: 'linear-gradient(90deg,#f1f5f9 25%,#e8edf2 50%,#f1f5f9 75%)', backgroundSize: '200% 100%', animation: 'shimmer 1.5s infinite' }} />
                  <div style={{ height: 11, width: '65%', borderRadius: 6, background: 'linear-gradient(90deg,#f1f5f9 25%,#e8edf2 50%,#f1f5f9 75%)', backgroundSize: '200% 100%', animation: 'shimmer 1.5s infinite' }} />
                </div>
              </div>
            ))
          ) : jobs.length === 0 ? (
            <div style={{ background: 'white', borderRadius: 16, border: '1px solid #f1f5f9', padding: '48px 24px', textAlign: 'center', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
              <div style={{ width: 56, height: 56, background: '#f8fafc', borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', color: '#94a3b8' }}>
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>
              </div>
              <p style={{ fontWeight: 700, color: '#0f172a', fontSize: 15, marginBottom: 6 }}>No jobs loaded yet</p>
              <p style={{ fontSize: 13, color: '#64748b', maxWidth: 320, margin: '0 auto' }}>Add your RapidAPI key to .env.local to load live jobs from LinkedIn and Indeed automatically</p>
            </div>
          ) : jobs.map((job: any) => {
            const salary = formatSalary(job.job_min_salary, job.job_max_salary)
            return (
              <div key={job.job_id} style={{ background: 'white', borderRadius: 14, border: '1px solid #f1f5f9', padding: '18px 20px', boxShadow: '0 1px 3px rgba(0,0,0,0.04)', transition: 'all 0.2s', display: 'flex', alignItems: 'center', gap: 14 }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = '#bfdbfe'; e.currentTarget.style.boxShadow = '0 4px 16px rgba(37,99,235,0.08)' }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = '#f1f5f9'; e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.04)' }}>
                <div style={{ width: 44, height: 44, borderRadius: 12, background: 'linear-gradient(135deg,#2563eb,#4f46e5)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, color: 'white', fontWeight: 900, fontSize: 18 }}>
                  {(job.employer_name || 'J')[0]}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontWeight: 800, color: '#0f172a', fontSize: 15, marginBottom: 2 }}>{job.job_title}</p>
                  <p style={{ fontSize: 13, color: '#475569', marginBottom: 6 }}>{job.employer_name}</p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, alignItems: 'center' }}>
                    {job.job_city && (
                      <span style={{ display: 'flex', alignItems: 'center', gap: 3, fontSize: 11, color: '#64748b' }}>
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                        {job.job_city}
                      </span>
                    )}
                    {job.job_employment_type && (
                      <span style={{ fontSize: 11, fontWeight: 600, color: '#475569', background: '#f8fafc', border: '1px solid #e2e8f0', padding: '2px 8px', borderRadius: 9999 }}>
                        {job.job_employment_type === 'FULLTIME' ? 'Full Time' : job.job_employment_type === 'PARTTIME' ? 'Part Time' : job.job_employment_type}
                      </span>
                    )}
                    {job.job_is_remote && <span style={{ fontSize: 11, fontWeight: 700, color: '#2563eb', background: '#eff6ff', border: '1px solid #bfdbfe', padding: '2px 8px', borderRadius: 9999 }}>Remote</span>}
                    {salary && <span style={{ fontSize: 12, fontWeight: 800, color: '#0f172a' }}>{salary}</span>}
                    <span style={{ fontSize: 11, color: '#94a3b8' }}>{timeAgo(job.job_posted_at_datetime_utc)}</span>
                  </div>
                </div>
                <a href={job.job_apply_link || '#'} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: 5, background: '#2563eb', color: 'white', fontSize: 12, fontWeight: 700, padding: '9px 16px', borderRadius: 10, textDecoration: 'none', flexShrink: 0, whiteSpace: 'nowrap' }}>
                  Apply
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="7" y1="17" x2="17" y2="7"/><polyline points="7 7 17 7 17 17"/></svg>
                </a>
              </div>
            )
          })}
        </div>
      </div>

      <style>{`
        @keyframes shimmer { 0%{background-position:-200% 0} 100%{background-position:200% 0} }
        @media(max-width:640px) { h1 { font-size: 20px !important; } }
      `}</style>
    </div>
  )
}
