'use client'

import { useState, useEffect, useCallback } from 'react'
import { useSearchParams } from 'next/navigation'

function timeAgo(date: string) {
  if (!date) return ''
  const diff = Math.floor((Date.now() - new Date(date).getTime()) / 1000)
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`
  return `${Math.floor(diff / 86400)}d ago`
}

const CITIES = ['All India','Delhi','Mumbai','Bengaluru','Hyderabad','Chennai','Pune','Dehradun','Chandigarh','Noida','Gurugram','Jaipur','Lucknow','Kochi','Indore','Ahmedabad']
const TYPE_FILTERS = ['All','Full Time','Part Time','Contract','Remote']
const ACCENT = '#4f46e5'

interface Job {
  id: string; title: string; company: string; city: string | null; state: string | null
  salary_min: number | null; salary_max: number | null; work_type: string; employment_type: string
  description: string; source: string; external_url: string | null; skills_required: string[]
  posted_at: string; logo_url: string | null
}

export default function JobsContent() {
  const searchParams = useSearchParams()
  const [jobs, setJobs] = useState<Job[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState(searchParams.get('q') || '')
  const [debouncedSearch, setDebouncedSearch] = useState(searchParams.get('q') || '')
  const [location, setLocation] = useState('All India')
  const [typeFilter, setTypeFilter] = useState('All')
  const [saved, setSaved] = useState<string[]>([])
  const [dataSource, setDataSource] = useState('')
  const [selectedJob, setSelectedJob] = useState<Job | null>(null)

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 500)
    return () => clearTimeout(t)
  }, [search])

  const fetchJobs = useCallback(async () => {
    setLoading(true)
    try {
      const q = debouncedSearch || 'software engineer'
      const loc = location === 'All India' ? 'India' : location
      const res = await fetch(`/api/v1/jobs/search?q=${encodeURIComponent(q)}&location=${encodeURIComponent(loc)}`)
      const data = await res.json()
      setJobs(data.data || [])
      setDataSource(data.status === 'live' ? `● Live · ${(data.data||[]).length} jobs` : '● Sample data')
    } catch { setJobs([]) }
    finally { setLoading(false) }
  }, [debouncedSearch, location])

  useEffect(() => { fetchJobs() }, [fetchJobs])

  const filtered = jobs.filter(job => {
    if (typeFilter === 'Remote') return job.work_type === 'remote'
    if (typeFilter === 'Full Time') return job.employment_type?.includes('full')
    if (typeFilter === 'Part Time') return job.employment_type?.includes('part')
    if (typeFilter === 'Contract') return job.employment_type?.includes('contract') || job.employment_type?.includes('freelance')
    return true
  })

  const fmtSalary = (min: number | null, max: number | null) => {
    if (!min && !max) return null
    const fmt = (n: number) => n >= 100000 ? `₹${(n/100000).toFixed(1)}L` : `₹${(n/1000).toFixed(0)}K`
    if (min && max) return `${fmt(min)} – ${fmt(max)}/yr`
    return min ? `${fmt(min)}+/yr` : null
  }

  const srcBadge = (src: string) => {
    if (src === 'adzuna') return { bg: '#f0fdf4', color: '#16a34a', text: 'Adzuna' }
    if (src === 'remotive') return { bg: '#f0f9ff', color: '#0284c7', text: 'Remote' }
    return { bg: '#f8fafc', color: '#64748b', text: 'LYU' }
  }

  return (
    <div style={{ display: 'flex', height: '100%', fontFamily: 'Inter,system-ui,sans-serif', overflow: 'hidden' }}>
      {/* LEFT */}
      <div style={{ width: selectedJob ? 400 : '100%', flexShrink: 0, display: 'flex', flexDirection: 'column', height: '100%', borderRight: selectedJob ? '1px solid #e2e8f0' : 'none', overflow: 'hidden' }}>
        <div style={{ padding: '14px 14px 10px', background: 'white', borderBottom: '1px solid #f1f5f9', flexShrink: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#f8fafc', border: '1.5px solid #e2e8f0', borderRadius: 10, padding: '9px 12px', marginBottom: 10 }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search jobs, skills, companies..."
              style={{ flex: 1, border: 'none', outline: 'none', background: 'transparent', fontSize: 13, color: '#0f172a', fontFamily: 'inherit' }} />
            {search && <button onClick={() => setSearch('')} style={{ border: 'none', background: 'none', cursor: 'pointer', color: '#94a3b8', padding: 0 }}>✕</button>}
          </div>
          <div style={{ marginBottom: 8 }}>
            <p style={{ fontSize: 10, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 5 }}>📍 Location</p>
            <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
              {CITIES.slice(0, 9).map(city => (
                <button key={city} onClick={() => setLocation(city)} style={{ padding: '3px 9px', borderRadius: 9999, fontSize: 11, fontWeight: 600, cursor: 'pointer', border: 'none', fontFamily: 'inherit', background: location === city ? ACCENT : '#f1f5f9', color: location === city ? 'white' : '#475569' }}>{city}</button>
              ))}
              <select value={CITIES.slice(9).includes(location) ? location : ''} onChange={e => e.target.value && setLocation(e.target.value)}
                style={{ padding: '3px 8px', borderRadius: 9999, fontSize: 11, fontWeight: 600, border: 'none', background: CITIES.slice(9).includes(location) ? ACCENT : '#f1f5f9', color: CITIES.slice(9).includes(location) ? 'white' : '#475569', cursor: 'pointer', fontFamily: 'inherit' }}>
                <option value="">More ▾</option>
                {CITIES.slice(9).map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 4 }}>
            {TYPE_FILTERS.map(f => (
              <button key={f} onClick={() => setTypeFilter(f)} style={{ padding: '3px 9px', borderRadius: 9999, fontSize: 11, fontWeight: 600, cursor: 'pointer', border: 'none', fontFamily: 'inherit', background: typeFilter === f ? '#0f172a' : '#f1f5f9', color: typeFilter === f ? 'white' : '#475569' }}>{f}</button>
            ))}
          </div>
        </div>

        <div style={{ padding: '6px 14px', background: '#fafafa', borderBottom: '1px solid #f1f5f9', flexShrink: 0 }}>
          <p style={{ fontSize: 11, fontWeight: 600, color: loading ? '#94a3b8' : dataSource.includes('Live') ? '#16a34a' : '#94a3b8' }}>
            {loading ? 'Fetching jobs...' : `${filtered.length} results · ${dataSource}`}
          </p>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: '8px' }}>
          {loading ? [...Array(5)].map((_,i) => (
            <div key={i} style={{ background: 'white', borderRadius: 12, border: '1px solid #f1f5f9', padding: 12, marginBottom: 6, display: 'flex', gap: 10 }}>
              <div style={{ width: 38, height: 38, borderRadius: 9, background: '#f1f5f9', flexShrink: 0 }} />
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 6 }}>
                <div style={{ height: 12, width: '50%', borderRadius: 5, background: '#f1f5f9' }} />
                <div style={{ height: 10, width: '33%', borderRadius: 4, background: '#f1f5f9' }} />
              </div>
            </div>
          )) : filtered.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '48px 16px' }}>
              <p style={{ fontSize: 28, marginBottom: 8 }}>🔍</p>
              <p style={{ fontWeight: 700, color: '#0f172a', marginBottom: 6 }}>No jobs found</p>
              <button onClick={() => { setSearch(''); setTypeFilter('All'); setLocation('All India') }}
                style={{ background: ACCENT, color: 'white', border: 'none', borderRadius: 8, padding: '8px 16px', fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>Reset</button>
            </div>
          ) : filtered.map(job => {
            const sal = fmtSalary(job.salary_min, job.salary_max)
            const src = srcBadge(job.source)
            const isSelected = selectedJob?.id === job.id
            const isSaved = saved.includes(job.id)
            return (
              <div key={job.id} onClick={() => setSelectedJob(isSelected ? null : job)}
                style={{ background: 'white', borderRadius: 12, border: `1.5px solid ${isSelected ? ACCENT : '#f1f5f9'}`, padding: 12, marginBottom: 6, cursor: 'pointer', transition: 'border-color 0.15s', boxShadow: isSelected ? `0 0 0 3px ${ACCENT}22` : '0 1px 2px rgba(0,0,0,0.04)' }}
                onMouseEnter={e => { if (!isSelected) e.currentTarget.style.borderColor = '#c7d2fe' }}
                onMouseLeave={e => { if (!isSelected) e.currentTarget.style.borderColor = '#f1f5f9' }}>
                <div style={{ display: 'flex', gap: 10 }}>
                  <div style={{ width: 38, height: 38, borderRadius: 9, background: `linear-gradient(135deg,${ACCENT},#7c3aed)`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, color: 'white', fontWeight: 900, fontSize: 15, overflow: 'hidden' }}>
                    {job.company?.[0] || 'J'}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', gap: 4 }}>
                      <p style={{ fontWeight: 800, color: '#0f172a', fontSize: 13, lineHeight: 1.3, marginBottom: 1 }}>{job.title}</p>
                      <button onClick={e => { e.stopPropagation(); setSaved(s => s.includes(job.id) ? s.filter(x => x !== job.id) : [...s, job.id]) }}
                        style={{ border: 'none', background: 'none', cursor: 'pointer', color: isSaved ? ACCENT : '#cbd5e1', padding: 2, flexShrink: 0 }}>
                        <svg width="13" height="13" viewBox="0 0 24 24" fill={isSaved ? ACCENT : 'none'} stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>
                      </button>
                    </div>
                    <p style={{ fontSize: 11, color: '#64748b', marginBottom: 5 }}>{job.company}</p>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, alignItems: 'center' }}>
                      {job.city && <span style={{ fontSize: 10, color: '#64748b' }}>📍 {job.city}</span>}
                      {job.work_type === 'remote' && <span style={{ fontSize: 10, fontWeight: 700, color: '#0284c7', background: '#f0f9ff', padding: '1px 6px', borderRadius: 9999 }}>Remote</span>}
                      {sal && <span style={{ fontSize: 11, fontWeight: 800, color: '#0f172a' }}>{sal}</span>}
                      <span style={{ fontSize: 10, fontWeight: 600, color: src.color, background: src.bg, padding: '1px 6px', borderRadius: 9999, marginLeft: 'auto' }}>{src.text}</span>
                    </div>
                    {job.skills_required?.length > 0 && (
                      <div style={{ display: 'flex', gap: 3, marginTop: 5, flexWrap: 'wrap' }}>
                        {job.skills_required.slice(0, 4).map(sk => (
                          <span key={sk} style={{ fontSize: 10, color: '#475569', background: '#f8fafc', border: '1px solid #e2e8f0', padding: '1px 6px', borderRadius: 4 }}>{sk}</span>
                        ))}
                      </div>
                    )}
                    <p style={{ fontSize: 10, color: '#94a3b8', marginTop: 4 }}>{timeAgo(job.posted_at)}</p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* RIGHT — detail */}
      {selectedJob && (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', background: 'white' }}>
          <div style={{ padding: '20px 22px 16px', borderBottom: '1px solid #f1f5f9', flexShrink: 0 }}>
            <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start', marginBottom: 14 }}>
              <div style={{ width: 52, height: 52, borderRadius: 13, background: `linear-gradient(135deg,${ACCENT},#7c3aed)`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, color: 'white', fontWeight: 900, fontSize: 20 }}>
                {selectedJob.company?.[0] || 'J'}
              </div>
              <div style={{ flex: 1 }}>
                <h2 style={{ fontSize: 17, fontWeight: 900, color: '#0f172a', marginBottom: 3, lineHeight: 1.3 }}>{selectedJob.title}</h2>
                <p style={{ fontSize: 13, color: '#64748b' }}>{selectedJob.company}</p>
              </div>
              <button onClick={() => setSelectedJob(null)} style={{ border: 'none', background: '#f8fafc', cursor: 'pointer', borderRadius: 8, padding: '5px 10px', color: '#64748b', fontSize: 12 }}>✕</button>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 14 }}>
              {selectedJob.city && <span style={{ fontSize: 12, color: '#475569', background: '#f8fafc', border: '1px solid #e2e8f0', padding: '4px 10px', borderRadius: 9999 }}>📍 {selectedJob.city}{selectedJob.state && selectedJob.state !== selectedJob.city ? `, ${selectedJob.state}` : ''}</span>}
              {selectedJob.work_type && <span style={{ fontSize: 12, fontWeight: 700, color: selectedJob.work_type === 'remote' ? '#0284c7' : '#475569', background: selectedJob.work_type === 'remote' ? '#f0f9ff' : '#f8fafc', border: `1px solid ${selectedJob.work_type === 'remote' ? '#bae6fd' : '#e2e8f0'}`, padding: '4px 10px', borderRadius: 9999 }}>{selectedJob.work_type.charAt(0).toUpperCase() + selectedJob.work_type.slice(1)}</span>}
              {fmtSalary(selectedJob.salary_min, selectedJob.salary_max) && <span style={{ fontSize: 12, fontWeight: 800, color: '#0f172a', background: '#f0fdf4', border: '1px solid #bbf7d0', padding: '4px 10px', borderRadius: 9999 }}>💰 {fmtSalary(selectedJob.salary_min, selectedJob.salary_max)}</span>}
            </div>
            <a href={selectedJob.external_url || '#'} target="_blank" rel="noopener noreferrer"
              style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: ACCENT, color: 'white', fontSize: 13, fontWeight: 700, padding: '10px 20px', borderRadius: 10, textDecoration: 'none' }}>
              Apply Now →
            </a>
          </div>
          <div style={{ flex: 1, overflowY: 'auto', padding: '18px 22px' }}>
            {selectedJob.skills_required?.length > 0 && (
              <div style={{ marginBottom: 18 }}>
                <h3 style={{ fontSize: 12, fontWeight: 700, color: '#0f172a', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Required Skills</h3>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  {selectedJob.skills_required.map(sk => <span key={sk} style={{ fontSize: 12, fontWeight: 600, color: ACCENT, background: '#eef2ff', border: `1px solid ${ACCENT}33`, padding: '3px 10px', borderRadius: 7 }}>{sk}</span>)}
                </div>
              </div>
            )}
            <div>
              <h3 style={{ fontSize: 12, fontWeight: 700, color: '#0f172a', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Job Description</h3>
              <p style={{ fontSize: 13, color: '#374151', lineHeight: 1.75, whiteSpace: 'pre-wrap' }}>{selectedJob.description?.replace(/<[^>]*>/g, '') || 'No description available.'}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
