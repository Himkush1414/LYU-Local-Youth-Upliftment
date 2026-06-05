'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'

function timeAgo(date: string) {
  if (!date) return ''
  const diff = Math.floor((Date.now() - new Date(date).getTime()) / 1000)
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`
  if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`
  return `${Math.floor(diff / 604800)}w ago`
}

const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string; dot: string }> = {
  applied:     { label: 'Applied',     color: '#1d4ed8', bg: '#eff6ff', dot: '#3b82f6' },
  viewed:      { label: 'Viewed',      color: '#b45309', bg: '#fffbeb', dot: '#f59e0b' },
  shortlisted: { label: 'Shortlisted', color: '#15803d', bg: '#f0fdf4', dot: '#22c55e' },
  rejected:    { label: 'Rejected',    color: '#b91c1c', bg: '#fef2f2', dot: '#ef4444' },
  hired:       { label: 'Hired',       color: '#065f46', bg: '#ecfdf5', dot: '#10b981' },
  withdrawn:   { label: 'Withdrawn',   color: '#475569', bg: '#f8fafc', dot: '#94a3b8' },
}

const TABS = ['All', 'Applied', 'Viewed', 'Shortlisted', 'Rejected']

export default function ApplicationsPage() {
  const [applications, setApplications] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('All')
  const supabase = createClient()

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { setLoading(false); return }
      const { data } = await supabase
        .from('applications')
        .select('*, jobs(title, company_id, city, salary_min, salary_max, salary_disclosed, employment_type, work_type)')
        .eq('seeker_id', user.id)
        .order('created_at', { ascending: false })
      setApplications(data || [])
      setLoading(false)
    }
    load()
  }, [])

  const filtered = activeTab === 'All' ? applications : applications.filter(a => a.status === activeTab.toLowerCase())

  const counts = TABS.slice(1).reduce((acc, tab) => {
    acc[tab] = applications.filter(a => a.status === tab.toLowerCase()).length
    return acc
  }, {} as Record<string, number>)

  const fmtSalary = (min: number, max: number, disc: boolean) => {
    if (!disc) return 'Not disclosed'
    const f = (n: number) => n >= 100000 ? `₹${(n/100000).toFixed(0)}L` : `₹${(n/1000).toFixed(0)}K`
    return min && max ? `${f(min)}–${f(max)}/yr` : min ? `${f(min)}+` : 'Not disclosed'
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 22, fontFamily: 'Inter, system-ui, sans-serif', paddingBottom: 60 }}>

      <div>
        <h1 style={{ fontSize: 22, fontWeight: 900, color: '#0f172a', letterSpacing: '-0.02em', marginBottom: 3 }}>My Applications</h1>
        <p style={{ fontSize: 13, color: '#64748b' }}>{loading ? 'Loading...' : `${applications.length} total applications`}</p>
      </div>

      {/* Summary cards */}
      {!loading && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: 10 }}>
          {TABS.slice(1).map(tab => {
            const cfg = STATUS_CONFIG[tab.toLowerCase()]
            return (
              <button key={tab} onClick={() => setActiveTab(tab)}
                style={{ background: activeTab === tab ? cfg.bg : 'white', borderRadius: 14, border: `2px solid ${activeTab === tab ? cfg.dot : '#f1f5f9'}`, padding: '16px 18px', textAlign: 'left', cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.15s', boxShadow: activeTab === tab ? '0 4px 12px rgba(0,0,0,0.06)' : '0 1px 3px rgba(0,0,0,0.04)' }}>
                <p style={{ fontSize: 26, fontWeight: 900, color: '#0f172a', marginBottom: 4 }}>{counts[tab] || 0}</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                  <span style={{ width: 7, height: 7, borderRadius: '50%', background: cfg.dot, flexShrink: 0 }} />
                  <p style={{ fontSize: 12, fontWeight: 600, color: '#475569' }}>{tab}</p>
                </div>
              </button>
            )
          })}
        </div>
      )}

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 0, background: '#f1f5f9', borderRadius: 11, padding: 4, width: 'fit-content', flexWrap: 'wrap' }}>
        {TABS.map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)}
            style={{ padding: '8px 16px', borderRadius: 8, fontSize: 13, fontWeight: activeTab === tab ? 700 : 500, cursor: 'pointer', border: 'none', fontFamily: 'inherit', transition: 'all 0.15s', background: activeTab === tab ? 'white' : 'transparent', color: activeTab === tab ? '#0f172a' : '#64748b', boxShadow: activeTab === tab ? '0 1px 3px rgba(0,0,0,0.08)' : 'none' }}>
            {tab} {tab !== 'All' && counts[tab] > 0 && <span style={{ fontSize: 11, background: activeTab === tab ? '#f1f5f9' : '#e2e8f0', borderRadius: 9999, padding: '1px 6px', marginLeft: 4 }}>{counts[tab]}</span>}
          </button>
        ))}
      </div>

      {/* Application list */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {loading ? (
          [...Array(3)].map((_, i) => (
            <div key={i} style={{ background: 'white', borderRadius: 16, border: '1px solid #f1f5f9', padding: '20px 22px', display: 'flex', gap: 14, boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
              <div style={{ width: 48, height: 48, borderRadius: 13, flexShrink: 0, background: 'linear-gradient(90deg,#f1f5f9 25%,#e8edf2 50%,#f1f5f9 75%)', backgroundSize: '200% 100%', animation: 'shimmer 1.5s infinite' }} />
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 9 }}>
                <div style={{ height: 14, width: '45%', borderRadius: 7, background: 'linear-gradient(90deg,#f1f5f9 25%,#e8edf2 50%,#f1f5f9 75%)', backgroundSize: '200% 100%', animation: 'shimmer 1.5s infinite' }} />
                <div style={{ height: 11, width: '30%', borderRadius: 6, background: 'linear-gradient(90deg,#f1f5f9 25%,#e8edf2 50%,#f1f5f9 75%)', backgroundSize: '200% 100%', animation: 'shimmer 1.5s infinite' }} />
              </div>
            </div>
          ))
        ) : filtered.length === 0 ? (
          <div style={{ background: 'white', borderRadius: 16, border: '1px solid #f1f5f9', padding: '60px 24px', textAlign: 'center', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
            <div style={{ width: 56, height: 56, background: '#f8fafc', borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', color: '#94a3b8' }}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
            </div>
            <p style={{ fontWeight: 700, color: '#0f172a', fontSize: 16, marginBottom: 6 }}>
              {activeTab === 'All' ? 'No applications yet' : `No ${activeTab.toLowerCase()} applications`}
            </p>
            <p style={{ fontSize: 13, color: '#64748b', marginBottom: 18 }}>
              {activeTab === 'All' ? 'Start applying to jobs that match your skills' : `You have no applications in ${activeTab} status`}
            </p>
            {activeTab === 'All' && (
              <Link href="/seeker/jobs" style={{ display: 'inline-flex', alignItems: 'center', gap: 7, background: '#2563eb', color: 'white', fontWeight: 700, fontSize: 13, padding: '10px 20px', borderRadius: 11, textDecoration: 'none' }}>
                Browse Jobs
              </Link>
            )}
          </div>
        ) : filtered.map((app: any) => {
          const job = app.jobs
          const cfg = STATUS_CONFIG[app.status] || STATUS_CONFIG.applied
          const companyInitial = (job?.employer_name || app.job_id || 'J')[0]
          return (
            <div key={app.id} style={{ background: 'white', borderRadius: 16, border: '1px solid #f1f5f9', padding: '20px 22px', boxShadow: '0 1px 3px rgba(0,0,0,0.04)', transition: 'all 0.2s' }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = '#e2e8f0'; e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.06)' }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = '#f1f5f9'; e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.04)' }}>
              <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
                <div style={{ width: 48, height: 48, borderRadius: 13, background: 'linear-gradient(135deg,#2563eb,#4f46e5)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, color: 'white', fontWeight: 900, fontSize: 20, boxShadow: '0 4px 12px rgba(37,99,235,0.15)' }}>
                  {companyInitial}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 10, flexWrap: 'wrap', marginBottom: 6 }}>
                    <div>
                      <p style={{ fontWeight: 800, color: '#0f172a', fontSize: 15, marginBottom: 2 }}>{job?.title || 'Job Title'}</p>
                      <p style={{ fontSize: 13, color: '#475569' }}>{app.employer_name || 'Company'}</p>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, fontWeight: 700, color: cfg.color, background: cfg.bg, padding: '4px 12px', borderRadius: 9999, border: `1px solid ${cfg.dot}30` }}>
                        <span style={{ width: 6, height: 6, borderRadius: '50%', background: cfg.dot, flexShrink: 0 }} />
                        {cfg.label}
                      </span>
                    </div>
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, alignItems: 'center', marginBottom: 12 }}>
                    {job?.city && (
                      <span style={{ display: 'flex', alignItems: 'center', gap: 3, fontSize: 12, color: '#64748b' }}>
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                        {job.city}
                      </span>
                    )}
                    {job?.salary_min && (
                      <span style={{ fontSize: 12, fontWeight: 700, color: '#0f172a' }}>{fmtSalary(job.salary_min, job.salary_max, job.salary_disclosed)}</span>
                    )}
                    {app.match_score && (
                      <span style={{ fontSize: 11, fontWeight: 700, color: app.match_score >= 80 ? '#15803d' : app.match_score >= 60 ? '#b45309' : '#b91c1c', background: app.match_score >= 80 ? '#f0fdf4' : app.match_score >= 60 ? '#fffbeb' : '#fef2f2', padding: '2px 8px', borderRadius: 9999 }}>
                        {app.match_score}% match
                      </span>
                    )}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, color: '#94a3b8' }}>
                      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                      Applied {timeAgo(app.applied_at || app.created_at)}
                    </span>
                    {app.status === 'shortlisted' && (
                      <Link href="/seeker/messages" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: '#f0fdf4', color: '#15803d', fontWeight: 700, fontSize: 12, padding: '7px 14px', borderRadius: 9, textDecoration: 'none', border: '1px solid #bbf7d0' }}>
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                        Message Employer
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      <style>{`@keyframes shimmer { 0%{background-position:-200% 0} 100%{background-position:200% 0} }`}</style>
    </div>
  )
}
