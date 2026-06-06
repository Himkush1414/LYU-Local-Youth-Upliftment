'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Briefcase, MapPin, Calendar, Clock, ChevronRight,
  Search, Filter, CheckCircle2, XCircle,
  AlertCircle, MessageSquare, FileText, X, Inbox,
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

type Status = 'Applied' | 'In Review' | 'Interview' | 'Offer' | 'Rejected'

const STATUS_CFG: Record<Status, { color: string; bg: string; icon: React.FC<{ size?: number; color?: string }> }> = {
  'Applied':   { color: '#60a5fa', bg: 'rgba(96,165,250,0.12)',  icon: Clock        },
  'In Review': { color: C.amber,   bg: C.amberDim,               icon: AlertCircle  },
  'Interview': { color: C.cyan,    bg: C.cyanDim,                icon: Calendar     },
  'Offer':     { color: C.green,   bg: C.greenDim,               icon: CheckCircle2 },
  'Rejected':  { color: C.red,     bg: C.redDim,                 icon: XCircle      },
}

const APPS = [
  { id:'1',  company:'Razorpay',  init:'RZ', color:'#0ea5e9', role:'Frontend Engineer',    loc:'Bangalore', applied:'Jun 4',  status:'In Review' as Status, salary:'20–30 LPA', type:'Full-time', notes:'Recruiter reached out on LinkedIn. Round 1 scheduled for next week.' },
  { id:'2',  company:'Swiggy',    init:'SW', color:'#f97316', role:'Software Engineer II', loc:'Bangalore', applied:'Jun 2',  status:'Interview' as Status, salary:'18–26 LPA', type:'Full-time', notes:'Interview on Jun 8 at 11 AM. Prepare DSA + system design.' },
  { id:'3',  company:'CRED',      init:'CR', color:'#8b5cf6', role:'Product Engineer',     loc:'Bangalore', applied:'May 30', status:'Applied'   as Status, salary:'22–35 LPA', type:'Full-time', notes:'Applied via company portal. Waiting for response.' },
  { id:'4',  company:'PhonePe',   init:'PP', color:'#6366f1', role:'React Developer',      loc:'Pune',      applied:'May 28', status:'Rejected'  as Status, salary:'15–22 LPA', type:'Full-time', notes:'Rejected at resume screening stage. Focus on system design prep.' },
  { id:'5',  company:'Zepto',     init:'ZP', color:'#10b981', role:'Full Stack Developer', loc:'Mumbai',    applied:'May 22', status:'Offer'     as Status, salary:'16–24 LPA', type:'Full-time', notes:'Offer received! CTC: 22 LPA. Deadline to accept: Jun 15.' },
  { id:'6',  company:'Meesho',    init:'MS', color:'#f43f5e', role:'Product Engineer',     loc:'Bangalore', applied:'May 20', status:'Applied'   as Status, salary:'15–22 LPA', type:'Full-time', notes:'Applied via referral from college senior.' },
  { id:'7',  company:'Groww',     init:'GR', color:'#22c55e', role:'Frontend Developer',   loc:'Bangalore', applied:'May 18', status:'In Review' as Status, salary:'14–20 LPA', type:'Full-time', notes:'HR called for initial screening last week.' },
  { id:'8',  company:'Nykaa',     init:'NK', color:'#ec4899', role:'Software Engineer',    loc:'Mumbai',    applied:'May 15', status:'Interview' as Status, salary:'12–18 LPA', type:'Full-time', notes:'Final round on Jun 9. Prepare machine coding round.' },
  { id:'9',  company:'Ola',       init:'OL', color:'#eab308', role:'Backend Engineer',     loc:'Bangalore', applied:'May 12', status:'Rejected'  as Status, salary:'14–20 LPA', type:'Full-time', notes:'Did not clear technical round 2. Work on problem-solving speed.' },
  { id:'10', company:'Flipkart',  init:'FL', color:'#2563eb', role:'SDE-1',                loc:'Bangalore', applied:'May 10', status:'Applied'   as Status, salary:'20–28 LPA', type:'Full-time', notes:'Applied for Flipkart Grid Program.' },
]

const ALL_STATUSES: Status[] = ['Applied', 'In Review', 'Interview', 'Offer', 'Rejected']

export default function ApplicationsPage() {
  const router = useRouter()
  const [query, setQuery] = useState('')
  const [activeStatus, setActiveStatus] = useState<'All' | Status>('All')
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [vw, setVw] = useState(1280)

  useEffect(() => {
    const upd = () => setVw(window.innerWidth)
    upd()
    window.addEventListener('resize', upd)
    return () => window.removeEventListener('resize', upd)
  }, [])

  const isMobile = vw < 640

  const filtered = APPS.filter(a => {
    const matchStatus = activeStatus === 'All' || a.status === activeStatus
    const matchQuery = !query.trim() ||
      a.company.toLowerCase().includes(query.toLowerCase()) ||
      a.role.toLowerCase().includes(query.toLowerCase())
    return matchStatus && matchQuery
  })

  const counts = ALL_STATUSES.reduce((acc, s) => {
    acc[s] = APPS.filter(a => a.status === s).length
    return acc
  }, {} as Record<Status, number>)

  const p = isMobile ? '14px' : '22px 26px'

  return (
    <div style={{ padding: p, background: C.bg, minHeight: '100%', display: 'flex', flexDirection: 'column', gap: '20px' }}>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '12px', flexWrap: 'wrap' }}>
        <div>
          <h1 style={{ fontSize: isMobile ? '18px' : '20px', fontWeight: 800, color: C.text, margin: '0 0 3px', letterSpacing: '-0.02em' }}>
            Applications
          </h1>
          <p style={{ fontSize: '13px', color: C.sub, margin: 0 }}>
            Track all your job applications · <span style={{ color: C.purple, fontWeight: 600 }}>{APPS.length} total</span>
          </p>
        </div>
        <button
          onClick={() => router.push('/seeker/opportunities')}
          style={{ padding: '9px 18px', borderRadius: C.rSm, background: C.purple, border: 'none', color: '#fff', fontSize: '12.5px', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px', flexShrink: 0 }}
        >
          <Briefcase size={13} /> Browse Jobs
        </button>
      </div>

      {/* Status overview cards */}
      <div style={{ display: 'grid', gridTemplateColumns: `repeat(${isMobile ? 3 : 5}, 1fr)`, gap: '10px' }}>
        {ALL_STATUSES.map(s => {
          const cfg = STATUS_CFG[s]
          const Icon = cfg.icon
          const isActive = activeStatus === s
          return (
            <motion.div
              key={s}
              whileTap={{ scale: 0.96 }}
              onClick={() => setActiveStatus(isActive ? 'All' : s)}
              style={{
                padding: isMobile ? '12px 8px' : '16px', borderRadius: C.r,
                cursor: 'pointer', textAlign: 'center',
                border: `1px solid ${isActive ? cfg.color + '55' : C.border}`,
                background: isActive ? cfg.bg : C.card,
                transition: 'all 0.18s',
              }}
            >
              <Icon size={16} color={cfg.color} />
              <div style={{ fontSize: isMobile ? '22px' : '24px', fontWeight: 800, color: C.text, margin: '6px 0 2px', letterSpacing: '-0.03em' }}>
                {counts[s]}
              </div>
              <div style={{ fontSize: isMobile ? '10px' : '11px', color: C.sub, fontWeight: 500 }}>{s}</div>
            </motion.div>
          )
        })}
      </div>

      {/* Search + filter clear */}
      <div style={{ display: 'flex', gap: '10px', flexWrap: isMobile ? 'wrap' : 'nowrap' }}>
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '8px', background: C.card, border: `1px solid ${C.border}`, borderRadius: C.rSm, padding: '9px 14px' }}>
          <Search size={14} color={C.muted} />
          <input
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search by company or role..."
            style={{ background: 'none', border: 'none', outline: 'none', color: C.text, fontSize: '13px', flex: 1 }}
          />
          {query && (
            <button onClick={() => setQuery('')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: C.muted, display: 'flex' }}>
              <X size={13} />
            </button>
          )}
        </div>
        {activeStatus !== 'All' && (
          <button
            onClick={() => setActiveStatus('All')}
            style={{ padding: '9px 14px', borderRadius: C.rSm, background: C.redDim, border: `1px solid ${C.red}40`, color: C.red, fontSize: '12px', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px', whiteSpace: 'nowrap' }}
          >
            <Filter size={12} /> Clear
          </button>
        )}
      </div>

      {/* Applications list */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {filtered.length === 0 && (
          <div style={{ textAlign: 'center', padding: '48px 20px' }}>
            <Inbox size={32} color={C.muted} style={{ marginBottom: '12px' }} />
            <p style={{ color: C.sub, fontSize: '14px', margin: 0 }}>No applications found</p>
          </div>
        )}

        <AnimatePresence>
          {filtered.map((app, i) => {
            const cfg = STATUS_CFG[app.status]
            const StatusIcon = cfg.icon
            const isExpanded = expandedId === app.id

            return (
              <motion.div
                key={app.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ delay: i * 0.04 }}
              >
                <div
                  style={{
                    background: C.card,
                    border: `1px solid ${isExpanded ? C.borderHov : C.border}`,
                    borderRadius: C.r, overflow: 'hidden', transition: 'all 0.2s',
                  }}
                >
                  {/* Main row */}
                  <div
                    onClick={() => setExpandedId(isExpanded ? null : app.id)}
                    style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '14px 16px', cursor: 'pointer', transition: 'background 0.15s' }}
                    onMouseEnter={e => (e.currentTarget.style.background = C.cardHov)}
                    onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                  >
                    {/* Logo */}
                    <div style={{ width: '38px', height: '38px', borderRadius: '9px', background: `${app.color}20`, border: `1px solid ${app.color}40`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10.5px', fontWeight: 700, color: app.color, flexShrink: 0 }}>
                      {app.init}
                    </div>

                    {/* Info */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '3px', flexWrap: 'wrap' }}>
                        <span style={{ fontSize: '13.5px', fontWeight: 700, color: C.text }}>{app.role}</span>
                        <span style={{ fontSize: '10.5px', fontWeight: 600, padding: '2px 8px', borderRadius: '20px', color: cfg.color, background: cfg.bg, display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <StatusIcon size={10} color={cfg.color} />{app.status}
                        </span>
                      </div>
                      <div style={{ fontSize: '12px', color: C.sub, display: 'flex', alignItems: 'center', gap: '4px', flexWrap: 'wrap' }}>
                        {app.company}
                        <span style={{ color: C.border }}>·</span>
                        <MapPin size={10} color={C.muted} />{app.loc}
                        <span style={{ color: C.border }}>·</span>
                        {app.salary}
                      </div>
                    </div>

                    {/* Date + chevron */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0 }}>
                      <div style={{ fontSize: '11px', color: C.muted, display: 'flex', alignItems: 'center', gap: '3px' }}>
                        <Calendar size={10} color={C.muted} />{app.applied}
                      </div>
                      <ChevronRight
                        size={14} color={C.muted}
                        style={{ transform: isExpanded ? 'rotate(90deg)' : 'none', transition: 'transform 0.2s' }}
                      />
                    </div>
                  </div>

                  {/* Expanded detail */}
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.22 }}
                        style={{ overflow: 'hidden' }}
                      >
                        <div style={{ padding: '0 16px 16px', borderTop: `1px solid ${C.border}`, paddingTop: '14px' }}>

                          {/* Notes box */}
                          <div style={{ padding: '11px 14px', borderRadius: C.rSm, background: C.purpleDim, border: `1px solid rgba(108,99,255,0.2)`, marginBottom: '12px' }}>
                            <p style={{ fontSize: '11px', fontWeight: 600, color: C.purple, margin: '0 0 4px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Notes</p>
                            <p style={{ fontSize: '12.5px', color: C.sub, margin: 0, lineHeight: 1.6 }}>{app.notes}</p>
                          </div>

                          {/* Offer highlight */}
                          {app.status === 'Offer' && (
                            <div style={{ padding: '10px 14px', borderRadius: C.rSm, background: C.greenDim, border: `1px solid rgba(16,185,129,0.25)`, marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <CheckCircle2 size={14} color={C.green} />
                              <p style={{ fontSize: '12.5px', color: C.green, margin: 0, fontWeight: 600 }}>
                                Congratulations! You have a job offer. Review and respond before the deadline.
                              </p>
                            </div>
                          )}

                          {/* Interview highlight */}
                          {app.status === 'Interview' && (
                            <div style={{ padding: '10px 14px', borderRadius: C.rSm, background: C.cyanDim, border: `1px solid rgba(6,182,212,0.25)`, marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <Calendar size={14} color={C.cyan} />
                              <p style={{ fontSize: '12.5px', color: C.cyan, margin: 0, fontWeight: 600 }}>
                                Interview scheduled — check your email for the meeting link and prep materials.
                              </p>
                            </div>
                          )}

                          {/* Action buttons */}
                          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                            <button
                              onClick={() => toast.info('Opening job details — coming soon!')}
                              style={{ padding: '7px 14px', borderRadius: '8px', background: 'transparent', border: `1px solid ${C.border}`, color: C.sub, fontSize: '12px', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px' }}
                            >
                              <FileText size={12} /> View Job
                            </button>
                            <button
                              onClick={() => toast.info('Opening messages — coming soon!')}
                              style={{ padding: '7px 14px', borderRadius: '8px', background: 'transparent', border: `1px solid ${C.border}`, color: C.sub, fontSize: '12px', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px' }}
                            >
                              <MessageSquare size={12} /> Message HR
                            </button>
                            {app.status === 'Offer' && (
                              <button
                                onClick={() => toast.success('Accepting offer — coming soon!')}
                                style={{ padding: '7px 14px', borderRadius: '8px', background: C.green, border: 'none', color: '#fff', fontSize: '12px', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px' }}
                              >
                                <CheckCircle2 size={12} /> Accept Offer
                              </button>
                            )}
                            {app.status === 'Rejected' && (
                              <button
                                onClick={() => router.push('/seeker/opportunities')}
                                style={{ padding: '7px 14px', borderRadius: '8px', background: C.purple, border: 'none', color: '#fff', fontSize: '12px', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px' }}
                              >
                                <Briefcase size={12} /> Find Similar
                              </button>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            )
          })}
        </AnimatePresence>
      </div>

      <style>{`input::placeholder { color: #475569; }`}</style>
    </div>
  )
}
