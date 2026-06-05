'use client'

import { useEffect, useState } from 'react'
import { Briefcase, FileText, Bookmark, Sparkles, ArrowUpRight } from 'lucide-react'

const MOCK_JOBS = [
  { id: '1', title: 'Software Engineer', company: 'TechCorp India', city: 'Bengaluru', type: 'Full Time', salary: '₹8L–₹15L/yr' },
  { id: '2', title: 'Product Manager', company: 'StartupHub', city: 'Delhi', type: 'Full Time', salary: '₹12L–₹20L/yr' },
  { id: '3', title: 'Data Scientist', company: 'Analytics Co', city: 'Mumbai', type: 'Remote', salary: '₹10L–₹18L/yr' },
]

const STATS = [
  { label: 'Applications', value: '12', icon: FileText, color: '#4f46e5', bg: '#eef2ff' },
  { label: 'Profile Views', value: '48', icon: Briefcase, color: '#0284c7', bg: '#f0f9ff' },
  { label: 'Saved Jobs', value: '7', icon: Bookmark, color: '#16a34a', bg: '#f0fdf4' },
  { label: 'AI Sessions', value: '23', icon: Sparkles, color: '#9333ea', bg: '#faf5ff' },
]

const ACTIONS = [
  { label: 'Build Resume', href: '/seeker/resume', color: '#4f46e5', bg: '#eef2ff' },
  { label: 'Find Jobs', href: '/seeker/jobs', color: '#0284c7', bg: '#f0f9ff' },
  { label: 'Career AI', href: '/seeker/chat', color: '#9333ea', bg: '#faf5ff' },
  { label: 'Skill Gap', href: '/seeker/learning', color: '#16a34a', bg: '#f0fdf4' },
]

function getGreeting() {
  const h = new Date().getHours()
  if (h < 12) return 'Good morning'
  if (h < 17) return 'Good afternoon'
  return 'Good evening'
}

export default function DashboardPage() {
  const [jobs, setJobs] = useState(MOCK_JOBS)

  useEffect(() => {
    fetch('/api/v1/jobs/search?q=software+engineer&location=India')
      .then(r => r.json())
      .then(d => { if (d.data?.length) setJobs(d.data.slice(0, 3)) })
      .catch(() => {})
  }, [])

  return (
    <div style={{ padding: '32px', maxWidth: '1100px', margin: '0 auto' }}>
      {/* Greeting */}
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '26px', fontWeight: 800, color: '#0f172a', marginBottom: '4px' }}>
          {getGreeting()} 👋
        </h1>
        <p style={{ fontSize: '14px', color: '#64748b' }}>Here is what is happening with your career today.</p>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '32px' }}>
        {STATS.map(s => {
          const Icon = s.icon
          return (
            <div key={s.label} style={{ background: 'white', borderRadius: '14px', padding: '20px', border: '1px solid #f1f5f9', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <p style={{ fontSize: '12px', color: '#64748b', marginBottom: '6px', fontWeight: 600 }}>{s.label}</p>
                  <p style={{ fontSize: '28px', fontWeight: 900, color: '#0f172a' }}>{s.value}</p>
                </div>
                <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: s.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Icon size={20} color={s.color} />
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Quick Actions */}
      <div style={{ marginBottom: '32px' }}>
        <h2 style={{ fontSize: '16px', fontWeight: 700, color: '#0f172a', marginBottom: '14px' }}>Quick Actions</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px' }}>
          {ACTIONS.map(a => (
            <a key={a.label} href={a.href} style={{ textDecoration: 'none' }}>
              <div style={{ background: 'white', border: '1.5px solid #f1f5f9', borderRadius: '12px', padding: '18px', textAlign: 'center', cursor: 'pointer', transition: 'all 0.15s' }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = a.color; e.currentTarget.style.boxShadow = `0 4px 12px ${a.bg}` }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = '#f1f5f9'; e.currentTarget.style.boxShadow = 'none' }}>
                <p style={{ fontSize: '14px', fontWeight: 700, color: a.color }}>{a.label}</p>
              </div>
            </a>
          ))}
        </div>
      </div>

      {/* Recent Jobs */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
          <h2 style={{ fontSize: '16px', fontWeight: 700, color: '#0f172a' }}>Recommended Jobs</h2>
          <a href="/seeker/jobs" style={{ fontSize: '13px', color: '#4f46e5', fontWeight: 600, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}>
            View all <ArrowUpRight size={14} />
          </a>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {jobs.map((job: any) => (
            <div key={job.id} style={{ background: 'white', borderRadius: '12px', border: '1px solid #f1f5f9', padding: '16px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
              <div style={{ display: 'flex', gap: '14px', alignItems: 'center' }}>
                <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: 'linear-gradient(135deg,#4f46e5,#7c3aed)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 900, fontSize: '16px', flexShrink: 0 }}>
                  {(job.company || job.employer_name || 'J')[0]}
                </div>
                <div>
                  <p style={{ fontWeight: 700, color: '#0f172a', fontSize: '14px', marginBottom: '2px' }}>{job.title || job.job_title}</p>
                  <p style={{ fontSize: '12px', color: '#64748b' }}>{job.company || job.employer_name} · {job.city || job.job_city || 'India'}</p>
                </div>
              </div>
              <a href={job.external_url || job.job_apply_link || '/seeker/jobs'} target="_blank" rel="noopener noreferrer"
                style={{ background: '#4f46e5', color: 'white', padding: '8px 16px', borderRadius: '8px', fontSize: '12px', fontWeight: 700, textDecoration: 'none' }}>
                Apply
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
