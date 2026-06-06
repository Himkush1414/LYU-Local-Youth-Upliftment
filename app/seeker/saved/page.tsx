'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  BookmarkCheck, MapPin, Clock, Building2, Trash2,
  Search, Briefcase, ArrowRight, X, AlertTriangle,
} from 'lucide-react'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

const C = {
  bg: '#0a0a0f', card: '#111118', cardHov: '#14141c',
  border: '#1e1e2e', borderHov: '#2d2d44',
  purple: '#6c63ff', purpleDim: 'rgba(108,99,255,0.12)',
  cyan: '#06b6d4', cyanDim: 'rgba(6,182,212,0.12)',
  green: '#10b981', greenDim: 'rgba(16,185,129,0.12)',
  amber: '#f59e0b', amberDim: 'rgba(245,158,11,0.12)',
  red: '#ef4444', redDim: 'rgba(239,68,68,0.12)',
  text: '#f8fafc', sub: '#94a3b8', muted: '#475569',
  r: '14px', rSm: '10px',
}

const INITIAL_JOBS = [
  { id:'1',  company:'Flipkart',   init:'FL', color:'#2563eb', role:'SDE-2',                  loc:'Bangalore', salary:'25–35 LPA', type:'Full-time',  saved:'Today',     match:94, skills:['Java','Spring Boot','Kafka'],   deadline:'Jun 20', urgent: true  },
  { id:'2',  company:'Google',     init:'GO', color:'#ef4444', role:'Software Engineer L4',    loc:'Hyderabad', salary:'40–60 LPA', type:'Full-time',  saved:'Yesterday', match:88, skills:['C++','Algorithms','DSA'],       deadline:'Jun 30', urgent: false },
  { id:'3',  company:'Microsoft',  init:'MS', color:'#0ea5e9', role:'SDE-2 (Cloud)',           loc:'Hyderabad', salary:'35–50 LPA', type:'Full-time',  saved:'2d ago',    match:85, skills:['Azure','C#','Distributed'],     deadline:'Jul 5',  urgent: false },
  { id:'4',  company:'Amazon',     init:'AM', color:'#f97316', role:'SDE-1',                   loc:'Bangalore', salary:'24–32 LPA', type:'Full-time',  saved:'3d ago',    match:82, skills:['Python','AWS','REST'],           deadline:'Jun 25', urgent: true  },
  { id:'5',  company:'Paytm',      init:'PT', color:'#1d4ed8', role:'Product Manager',         loc:'Noida',     salary:'18–28 LPA', type:'Full-time',  saved:'4d ago',    match:76, skills:['Product','Analytics','Agile'],  deadline:'Jun 28', urgent: false },
  { id:'6',  company:'Freshworks', init:'FW', color:'#22c55e', role:'Frontend Engineer',       loc:'Chennai',   salary:'14–22 LPA', type:'Hybrid',     saved:'5d ago',    match:90, skills:['React','TypeScript','CSS'],     deadline:'Jul 1',  urgent: false },
  { id:'7',  company:'Infosys',    init:'IF', color:'#6366f1', role:'Systems Engineer',        loc:'Pune',      salary:'6–9 LPA',   type:'Full-time',  saved:'1w ago',    match:70, skills:['Java','.NET','SQL'],            deadline:'Jun 22', urgent: true  },
  { id:'8',  company:'IBPS PO',    init:'IB', color:'#f59e0b', role:'Probationary Officer',   loc:'Pan India', salary:'23,700/mo', type:'Government', saved:'1w ago',    match:78, skills:['Reasoning','English','GK'],     deadline:'Jun 18', urgent: true  },
]

type SortKey = 'saved' | 'match' | 'deadline'

export default function SavedPage() {
  const router = useRouter()
  const [jobs, setJobs] = useState(INITIAL_JOBS)
  const [query, setQuery] = useState('')
  const [sortBy, setSortBy] = useState<SortKey>('saved')
  const [vw, setVw] = useState(1280)

  useEffect(() => {
    const upd = () => setVw(window.innerWidth)
    upd()
    window.addEventListener('resize', upd)
    return () => window.removeEventListener('resize', upd)
  }, [])

  const isMobile = vw < 640
  const isWide = vw >= 1100

  const filtered = jobs
    .filter(j =>
      !query.trim() ||
      j.company.toLowerCase().includes(query.toLowerCase()) ||
      j.role.toLowerCase().includes(query.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === 'match') return b.match - a.match
      if (sortBy === 'deadline') return a.deadline.localeCompare(b.deadline)
      return 0
    })

  const urgentCount = filtered.filter(j => j.urgent).length

  function removeJob(id: string) {
    setJobs(prev => prev.filter(j => j.id !== id))
    toast.info('Removed from saved jobs')
  }

  const p = isMobile ? '14px' : '22px 26px'

  return (
    <div style={{ padding: p, background: C.bg, minHeight: '100%', display: 'flex', flexDirection: 'column', gap: '20px' }}>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h1 style={{ fontSize: isMobile ? '18px' : '20px', fontWeight: 800, color: C.text, margin: '0 0 3px', letterSpacing: '-0.02em' }}>
            Saved Jobs
          </h1>
          <p style={{ fontSize: '13px', color: C.sub, margin: 0 }}>
            <span style={{ color: C.purple, fontWeight: 600 }}>{jobs.length} jobs</span> saved · Apply before deadlines
          </p>
        </div>
        <button
          onClick={() => router.push('/seeker/opportunities')}
          style={{ padding: '9px 18px', borderRadius: C.rSm, background: C.purple, border: 'none', color: '#fff', fontSize: '12.5px', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px' }}
        >
          <Briefcase size={13} /> Browse More
        </button>
      </div>

      {/* Urgent deadline banner */}
      {urgentCount > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ padding: '12px 16px', borderRadius: C.rSm, background: C.redDim, border: `1px solid rgba(239,68,68,0.3)`, display: 'flex', alignItems: 'center', gap: '10px' }}
        >
          <AlertTriangle size={15} color={C.red} style={{ flexShrink: 0 }} />
          <p style={{ fontSize: '13px', color: C.red, margin: 0, fontWeight: 500 }}>
            <strong>{urgentCount} job{urgentCount > 1 ? 's' : ''}</strong> have deadlines approaching soon — apply now before they close.
          </p>
        </motion.div>
      )}

      {/* Search + Sort */}
      <div style={{ display: 'flex', gap: '10px', flexWrap: isMobile ? 'wrap' : 'nowrap' }}>
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '8px', background: C.card, border: `1px solid ${C.border}`, borderRadius: C.rSm, padding: '9px 14px' }}>
          <Search size={14} color={C.muted} />
          <input
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search saved jobs..."
            style={{ background: 'none', border: 'none', outline: 'none', color: C.text, fontSize: '13px', flex: 1 }}
          />
          {query && (
            <button onClick={() => setQuery('')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: C.muted, display: 'flex' }}>
              <X size={13} />
            </button>
          )}
        </div>
        <div style={{ display: 'flex', gap: '6px' }}>
          {(['saved', 'match', 'deadline'] as SortKey[]).map(s => (
            <button
              key={s}
              onClick={() => setSortBy(s)}
              style={{
                padding: '9px 14px', borderRadius: C.rSm, fontSize: '12px', fontWeight: 600,
                cursor: 'pointer', whiteSpace: 'nowrap', transition: 'all 0.15s',
                background: sortBy === s ? C.purpleDim : 'transparent',
                border: `1px solid ${sortBy === s ? C.purple : C.border}`,
                color: sortBy === s ? C.purple : C.sub,
              }}
            >
              {s === 'saved' ? 'Recent' : s === 'match' ? 'Best Match' : 'Deadline'}
            </button>
          ))}
        </div>
      </div>

      {/* Empty state */}
      {filtered.length === 0 && (
        <div style={{ textAlign: 'center', padding: '60px 20px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
          <BookmarkCheck size={36} color={C.muted} />
          <p style={{ color: C.sub, fontSize: '14px', margin: 0 }}>
            {query ? `No results for "${query}"` : 'No saved jobs yet'}
          </p>
          <p style={{ color: C.muted, fontSize: '12.5px', margin: 0 }}>
            {query ? 'Try a different search' : 'Browse opportunities and bookmark jobs you like'}
          </p>
          {!query && (
            <button
              onClick={() => router.push('/seeker/opportunities')}
              style={{ marginTop: '8px', padding: '9px 20px', borderRadius: C.rSm, background: C.purple, border: 'none', color: '#fff', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}
            >
              Browse Jobs
            </button>
          )}
        </div>
      )}

      {/* Job cards grid */}
      {filtered.length > 0 && (
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : isWide ? '1fr 1fr' : '1fr', gap: '10px' }}>
          <AnimatePresence>
            {filtered.map((job, i) => (
              <motion.div
                key={job.id}
                layout
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.15 } }}
                transition={{ delay: i * 0.04 }}
                style={{
                  background: C.card,
                  border: `1px solid ${job.urgent ? 'rgba(239,68,68,0.25)' : C.border}`,
                  borderRadius: C.r, padding: '16px', transition: 'border-color 0.18s',
                }}
                onMouseEnter={e => (e.currentTarget.style.borderColor = job.urgent ? 'rgba(239,68,68,0.45)' : C.borderHov)}
                onMouseLeave={e => (e.currentTarget.style.borderColor = job.urgent ? 'rgba(239,68,68,0.25)' : C.border)}
              >
                <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                  {/* Logo */}
                  <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: `${job.color}20`, border: `1px solid ${job.color}40`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: 700, color: job.color, flexShrink: 0 }}>
                    {job.init}
                  </div>

                  <div style={{ flex: 1, minWidth: 0 }}>
                    {/* Title + remove */}
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '6px', marginBottom: '3px' }}>
                      <span style={{ fontSize: '13.5px', fontWeight: 700, color: C.text, lineHeight: 1.3 }}>{job.role}</span>
                      <button
                        onClick={() => removeJob(job.id)}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', color: C.muted, padding: '2px', display: 'flex', alignItems: 'center', flexShrink: 0, transition: 'color 0.15s' }}
                        onMouseEnter={e => ((e.currentTarget as HTMLButtonElement).style.color = C.red)}
                        onMouseLeave={e => ((e.currentTarget as HTMLButtonElement).style.color = C.muted)}
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>

                    {/* Meta */}
                    <div style={{ fontSize: '12px', color: C.sub, marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '4px', flexWrap: 'wrap' }}>
                      <Building2 size={10} color={C.muted} />{job.company}
                      <span style={{ color: C.border }}>·</span>
                      <MapPin size={10} color={C.muted} />{job.loc}
                      <span style={{ color: C.border }}>·</span>
                      {job.salary}
                    </div>

                    {/* Skill tags */}
                    <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap', marginBottom: '12px' }}>
                      {job.skills.map(s => (
                        <span key={s} style={{ fontSize: '10.5px', padding: '2px 7px', borderRadius: '5px', background: C.purpleDim, color: C.purple, fontWeight: 500 }}>{s}</span>
                      ))}
                      <span style={{ fontSize: '10.5px', padding: '2px 7px', borderRadius: '5px', background: 'rgba(148,163,184,0.1)', color: C.sub }}>{job.type}</span>
                    </div>

                    {/* Bottom row */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
                      <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
                        <span style={{ fontSize: '11px', color: C.muted, display: 'flex', alignItems: 'center', gap: '3px' }}>
                          <BookmarkCheck size={10} color={C.amber} /> {job.saved}
                        </span>
                        <span style={{ fontSize: '11px', fontWeight: 600, color: job.urgent ? C.red : C.muted, display: 'flex', alignItems: 'center', gap: '3px' }}>
                          <Clock size={10} color={job.urgent ? C.red : C.muted} />
                          {job.urgent ? '⚠ ' : ''}Deadline: {job.deadline}
                        </span>
                      </div>
                      <div style={{ display: 'flex', gap: '7px', alignItems: 'center' }}>
                        <span style={{ fontSize: '11px', fontWeight: 700, color: job.match >= 85 ? C.green : C.amber, background: job.match >= 85 ? C.greenDim : C.amberDim, padding: '2px 7px', borderRadius: '20px' }}>
                          {job.match}% match
                        </span>
                        <button
                          onClick={() => toast.info('Opening application — coming soon!')}
                          style={{ padding: '6px 13px', borderRadius: '8px', background: C.purple, border: 'none', color: '#fff', fontSize: '11.5px', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
                        >
                          Apply <ArrowRight size={11} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      <style>{`input::placeholder { color: #475569; }`}</style>
    </div>
  )
}
