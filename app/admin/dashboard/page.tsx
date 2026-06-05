'use client'

import { useState } from 'react'
import Link from 'next/link'
import { toast } from 'sonner'

const kpis = [
  { label: 'Total Users', value: '4,521', change: '+124 today', up: true, icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>, color: '#2563eb', bg: '#eff6ff' },
  { label: 'Active Jobs', value: '1,240', change: '+18 today', up: true, icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>, color: '#7c3aed', bg: '#f5f3ff' },
  { label: 'Reports Pending', value: '7', change: '3 urgent', up: false, icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>, color: '#dc2626', bg: '#fef2f2' },
  { label: 'New Signups Today', value: '89', change: '+22% vs yesterday', up: true, icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>, color: '#16a34a', bg: '#f0fdf4' },
]

const pendingJobs = [
  { id: '1', title: 'Digital Marketing Manager', company: 'AdTech', state: 'Punjab', reason: 'New employer', score: 40 },
  { id: '2', title: 'Sales Rep — ₹80K/day', company: 'QuickEarn', state: 'Delhi', reason: 'Suspicious salary', score: 75 },
  { id: '3', title: 'React Developer', company: 'CodeCo', state: 'Haryana', reason: 'Vague description', score: 30 },
]

const reports = [
  { id: '1', type: 'Fake Job', target: 'QuickEarn — Sales Rep', reporter: 'Priya S.', date: '2h ago', severity: 'high' },
  { id: '2', type: 'Scam Company', target: 'EasyMoney Ltd', reporter: 'Rahul K.', date: '5h ago', severity: 'high' },
  { id: '3', type: 'Spam', target: 'InfoJob post #432', reporter: 'Ananya M.', date: '1d ago', severity: 'medium' },
]

const recentUsers = [
  { name: 'Priya Sharma', email: 'priya@example.com', role: 'seeker', joined: '2h ago', status: 'active' },
  { name: 'TechCorp HR', email: 'hr@techcorp.com', role: 'employer', joined: '4h ago', status: 'active' },
  { name: 'Rahul Verma', email: 'rahul@gmail.com', role: 'seeker', joined: '6h ago', status: 'pending' },
]

export default function AdminDashboard() {
  const [jobs, setJobs] = useState(pendingJobs)

  const approve = (id: string) => {
    setJobs(j => j.filter(job => job.id !== id))
    toast.success('Job approved and published')
  }
  const reject = (id: string) => {
    setJobs(j => j.filter(job => job.id !== id))
    toast.error('Job rejected and employer notified')
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', fontFamily: 'Inter, system-ui, sans-serif' }}>

      {/* Admin top bar */}
      <header style={{ background: '#0f172a', position: 'sticky', top: 0, zIndex: 50, boxShadow: '0 2px 10px rgba(0,0,0,0.2)' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 24px', height: 56, display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 32, height: 32, borderRadius: 9, background: 'linear-gradient(135deg,#2563eb,#4f46e5)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ color: 'white', fontWeight: 900, fontSize: 11 }}>LY</span>
            </div>
            <span style={{ fontWeight: 900, color: 'white', fontSize: 15 }}>LYU</span>
            <span style={{ fontSize: 10, fontWeight: 800, color: '#ef4444', background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.3)', padding: '2px 8px', borderRadius: 9999, marginLeft: 4 }}>ADMIN</span>
          </div>
          <div style={{ flex: 1 }} />
          {[['Dashboard', '/admin/dashboard'], ['Users', '/admin/users'], ['Jobs', '/admin/jobs'], ['Reports', '/admin/reports']].map(([label, href]) => (
            <Link key={label} href={href} style={{ fontSize: 13, fontWeight: 600, color: '#94a3b8', textDecoration: 'none', padding: '6px 12px', borderRadius: 8 }}
              onMouseEnter={e => { e.currentTarget.style.color = 'white'; e.currentTarget.style.background = 'rgba(255,255,255,0.08)' }}
              onMouseLeave={e => { e.currentTarget.style.color = '#94a3b8'; e.currentTarget.style.background = 'transparent' }}>
              {label}
            </Link>
          ))}
          <Link href="/" style={{ fontSize: 12, fontWeight: 600, color: '#64748b', textDecoration: 'none', marginLeft: 8 }}>Exit →</Link>
        </div>
      </header>

      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '28px 24px 48px' }}>

        <div style={{ marginBottom: 24 }}>
          <h1 style={{ fontSize: 22, fontWeight: 900, color: '#0f172a', marginBottom: 4 }}>Admin Dashboard</h1>
          <p style={{ color: '#64748b', fontSize: 14 }}>Platform overview and moderation queue</p>
        </div>

        {/* KPI cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(220px,1fr))', gap: 14, marginBottom: 28 }}>
          {kpis.map(k => (
            <div key={k.label} style={{ background: 'white', borderRadius: 16, border: '1px solid #e2e8f0', padding: '18px 20px', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 14 }}>
                <div style={{ width: 40, height: 40, borderRadius: 12, background: k.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', color: k.color }}>
                  {k.icon}
                </div>
                <span style={{ fontSize: 11, fontWeight: 700, color: k.up ? '#15803d' : '#b91c1c', background: k.up ? '#f0fdf4' : '#fef2f2', padding: '3px 8px', borderRadius: 9999 }}>
                  {k.change}
                </span>
              </div>
              <div style={{ fontSize: 28, fontWeight: 900, color: '#0f172a', marginBottom: 4 }}>{k.value}</div>
              <div style={{ fontSize: 13, color: '#64748b' }}>{k.label}</div>
            </div>
          ))}
        </div>

        {/* Bento grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(340px,1fr))', gap: 16 }}>

          {/* Job moderation */}
          <div style={{ background: 'white', borderRadius: 16, border: '1px solid #e2e8f0', overflow: 'hidden', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
            <div style={{ padding: '16px 20px', borderBottom: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ width: 32, height: 32, borderRadius: 9, background: '#fffbeb', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#d97706' }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                </div>
                <h2 style={{ fontWeight: 800, color: '#0f172a', fontSize: 15 }}>Job Moderation</h2>
              </div>
              <span style={{ fontSize: 11, fontWeight: 800, color: '#d97706', background: '#fffbeb', border: '1px solid #fde68a', padding: '2px 9px', borderRadius: 9999 }}>{jobs.length} pending</span>
            </div>
            <div>
              {jobs.length === 0 ? (
                <div style={{ padding: '32px 20px', textAlign: 'center', color: '#94a3b8', fontSize: 13 }}>
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ margin: '0 auto 10px', display: 'block' }}><polyline points="20 6 9 17 4 12"/></svg>
                  All caught up! No pending jobs.
                </div>
              ) : jobs.map(job => (
                <div key={job.id} style={{ padding: '14px 20px', borderBottom: '1px solid #f8fafc' }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8, marginBottom: 10 }}>
                    <div>
                      <p style={{ fontWeight: 700, color: '#0f172a', fontSize: 14 }}>{job.title}</p>
                      <p style={{ fontSize: 12, color: '#64748b', marginTop: 2 }}>{job.company} · {job.state}</p>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginTop: 4 }}>
                        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#d97706" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/></svg>
                        <span style={{ fontSize: 11, color: '#d97706' }}>{job.reason}</span>
                      </div>
                    </div>
                    <span style={{ fontSize: 11, fontWeight: 800, color: job.score >= 60 ? '#dc2626' : '#d97706', background: job.score >= 60 ? '#fef2f2' : '#fffbeb', padding: '3px 9px', borderRadius: 9999, flexShrink: 0 }}>Risk: {job.score}</span>
                  </div>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button onClick={() => approve(job.id)} style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 12, fontWeight: 700, color: '#15803d', background: '#f0fdf4', border: '1px solid #bbf7d0', padding: '6px 12px', borderRadius: 9, cursor: 'pointer', fontFamily: 'inherit' }}>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                      Approve
                    </button>
                    <button onClick={() => reject(job.id)} style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 12, fontWeight: 700, color: '#dc2626', background: '#fef2f2', border: '1px solid #fecaca', padding: '6px 12px', borderRadius: 9, cursor: 'pointer', fontFamily: 'inherit' }}>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                      Reject
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Reports */}
          <div style={{ background: 'white', borderRadius: 16, border: '1px solid #e2e8f0', overflow: 'hidden', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
            <div style={{ padding: '16px 20px', borderBottom: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ width: 32, height: 32, borderRadius: 9, background: '#fef2f2', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#dc2626' }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
                </div>
                <h2 style={{ fontWeight: 800, color: '#0f172a', fontSize: 15 }}>Flagged Reports</h2>
              </div>
              <span style={{ fontSize: 11, fontWeight: 800, color: '#dc2626', background: '#fef2f2', border: '1px solid #fecaca', padding: '2px 9px', borderRadius: 9999 }}>{reports.length} open</span>
            </div>
            <div>
              {reports.map((r, i) => (
                <div key={r.id} style={{ padding: '14px 20px', borderBottom: i < reports.length - 1 ? '1px solid #f8fafc' : 'none', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 10 }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 4 }}>
                      <span style={{ fontSize: 11, fontWeight: 700, color: r.severity === 'high' ? '#dc2626' : '#d97706', background: r.severity === 'high' ? '#fef2f2' : '#fffbeb', padding: '2px 8px', borderRadius: 9999, border: `1px solid ${r.severity === 'high' ? '#fecaca' : '#fde68a'}` }}>
                        {r.type}
                      </span>
                    </div>
                    <p style={{ fontSize: 13, fontWeight: 600, color: '#0f172a' }}>{r.target}</p>
                    <p style={{ fontSize: 11, color: '#94a3b8', marginTop: 2 }}>By {r.reporter} · {r.date}</p>
                  </div>
                  <button onClick={() => toast.info('Opening report review...')} style={{ fontSize: 12, fontWeight: 700, color: '#2563eb', background: 'none', border: 'none', cursor: 'pointer', flexShrink: 0, fontFamily: 'inherit' }}>
                    Review
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Recent users */}
          <div style={{ background: 'white', borderRadius: 16, border: '1px solid #e2e8f0', overflow: 'hidden', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
            <div style={{ padding: '16px 20px', borderBottom: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ width: 32, height: 32, borderRadius: 9, background: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#2563eb' }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                </div>
                <h2 style={{ fontWeight: 800, color: '#0f172a', fontSize: 15 }}>Recent Signups</h2>
              </div>
              <Link href="/admin/users" style={{ fontSize: 12, fontWeight: 700, color: '#2563eb', textDecoration: 'none' }}>View all</Link>
            </div>
            <div>
              {recentUsers.map((u, i) => (
                <div key={u.email} style={{ padding: '12px 20px', borderBottom: i < recentUsers.length - 1 ? '1px solid #f8fafc' : 'none', display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ width: 36, height: 36, borderRadius: '50%', background: u.role === 'employer' ? 'linear-gradient(135deg,#7c3aed,#6d28d9)' : 'linear-gradient(135deg,#2563eb,#4f46e5)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 800, fontSize: 12, flexShrink: 0 }}>
                    {u.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontWeight: 700, color: '#0f172a', fontSize: 13, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{u.name}</p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 2 }}>
                      <span style={{ fontSize: 10, fontWeight: 700, color: u.role === 'employer' ? '#7c3aed' : '#2563eb', background: u.role === 'employer' ? '#f5f3ff' : '#eff6ff', padding: '1px 7px', borderRadius: 9999 }}>{u.role}</span>
                      <span style={{ fontSize: 11, color: '#94a3b8' }}>{u.joined}</span>
                    </div>
                  </div>
                  <span style={{ fontSize: 10, fontWeight: 700, color: u.status === 'active' ? '#15803d' : '#d97706', background: u.status === 'active' ? '#f0fdf4' : '#fffbeb', padding: '2px 8px', borderRadius: 9999 }}>{u.status}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Platform stats */}
          <div style={{ background: 'linear-gradient(135deg,#0f172a,#1e293b)', borderRadius: 16, padding: '20px 24px', color: 'white', boxShadow: '0 4px 14px rgba(0,0,0,0.15)' }}>
            <h2 style={{ fontWeight: 800, color: 'white', fontSize: 15, marginBottom: 4 }}>Platform Health</h2>
            <p style={{ fontSize: 12, color: '#64748b', marginBottom: 20 }}>Live metrics</p>
            {[
              { label: 'Jobs filled this week', value: '124', bar: 78 },
              { label: 'Applications submitted', value: '2,341', bar: 65 },
              { label: 'Avg match score', value: '74%', bar: 74 },
              { label: 'Fraud rate', value: '0.3%', bar: 3 },
            ].map(stat => (
              <div key={stat.label} style={{ marginBottom: 14 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                  <span style={{ fontSize: 12, color: '#94a3b8' }}>{stat.label}</span>
                  <span style={{ fontSize: 12, fontWeight: 800, color: 'white' }}>{stat.value}</span>
                </div>
                <div style={{ height: 5, background: '#334155', borderRadius: 9999, overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${stat.bar}%`, background: 'linear-gradient(90deg,#2563eb,#4f46e5)', borderRadius: 9999 }} />
                </div>
              </div>
            ))}
            <div style={{ marginTop: 20, display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#4ade80', animation: 'pulse 2s infinite' }} />
              <span style={{ fontSize: 12, color: '#4ade80', fontWeight: 600 }}>All systems operational</span>
            </div>
          </div>
        </div>
      </div>
      <style>{`@keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }`}</style>
    </div>
  )
}
