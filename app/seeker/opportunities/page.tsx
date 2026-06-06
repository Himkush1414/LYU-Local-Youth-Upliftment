'use client'

import { useState, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Search, MapPin, Briefcase, Clock, Bookmark, BookmarkCheck,
  X, Building2, GraduationCap, SlidersHorizontal,
  ExternalLink, Play, Award, ChevronDown,
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

type Job = {
  id: string; title: string; company: string; init: string; color: string
  location: string; type: string; salary: string; posted: string
  match: number; skills: string[]; source: string; category: string
  about: string; description: string[]; experience: string
  education: string; perks: string[]; isGov: boolean
}

const JOBS: Job[] = [
  {
    id: '1', title: 'Senior Frontend Engineer', company: 'Razorpay', init: 'RZ', color: '#0ea5e9',
    location: 'Bangalore', type: 'Full-time', salary: '20–30 LPA', posted: '2h ago',
    match: 96, skills: ['React', 'TypeScript', 'Next.js', 'GraphQL'], source: 'LinkedIn',
    category: 'IT & Software', isGov: false,
    about: 'Razorpay is India\'s leading payments solution, powering payments for thousands of businesses.',
    description: [
      'Build and own high-impact frontend features used by millions of merchants',
      'Architect scalable UI systems with React and TypeScript',
      'Collaborate with design and backend teams on product features',
      'Mentor junior engineers and drive technical excellence',
    ],
    experience: '3–5 years', education: 'B.Tech/B.E. in CS or equivalent',
    perks: ['Health Insurance', 'Work from Home', 'Stock Options', 'Annual Bonus', 'Flexible Hours'],
  },
  {
    id: '2', title: 'Software Engineer II', company: 'Swiggy', init: 'SW', color: '#f97316',
    location: 'Bangalore', type: 'Full-time', salary: '18–26 LPA', posted: '4h ago',
    match: 91, skills: ['Node.js', 'React', 'AWS', 'Redis'], source: 'Naukri',
    category: 'IT & Software', isGov: false,
    about: 'Swiggy is India\'s largest food delivery platform, serving millions of customers daily.',
    description: [
      'Design and build scalable backend services for food delivery platform',
      'Work on real-time order tracking and notification systems',
      'Optimize database queries and caching strategies',
      'Participate in on-call rotations and incident response',
    ],
    experience: '2–4 years', education: 'B.Tech/M.Tech in CS or equivalent',
    perks: ['Health Insurance', 'Free Meals', 'Stock Options', 'Gym Membership', 'Remote Work'],
  },
  {
    id: '3', title: 'Product Engineer', company: 'CRED', init: 'CR', color: '#8b5cf6',
    location: 'Bangalore', type: 'Full-time', salary: '22–35 LPA', posted: '1d ago',
    match: 88, skills: ['React Native', 'TypeScript', 'Python', 'PostgreSQL'], source: 'LinkedIn',
    category: 'IT & Software', isGov: false,
    about: 'CRED is a members-only credit card bill payment app rewarding members for paying bills on time.',
    description: [
      'Build mobile-first products used by India\'s creditworthy population',
      'Drive product decisions from engineering perspective',
      'Work on credit scoring algorithms and fintech infrastructure',
      'Ship features end-to-end with full ownership',
    ],
    experience: '3–6 years', education: 'B.Tech or equivalent from top tier',
    perks: ['Health Insurance', 'ESOPs', 'Unlimited PTO', 'MacBook Pro', 'Learning Budget'],
  },
  {
    id: '4', title: 'DevOps Engineer', company: 'PhonePe', init: 'PP', color: '#6366f1',
    location: 'Pune', type: 'Full-time', salary: '15–22 LPA', posted: '1d ago',
    match: 79, skills: ['Kubernetes', 'Docker', 'Terraform', 'AWS'], source: 'Naukri',
    category: 'IT & Software', isGov: false,
    about: 'PhonePe is India\'s leading digital payments platform with 400M+ registered users.',
    description: [
      'Manage cloud infrastructure on AWS using Kubernetes and Terraform',
      'Build CI/CD pipelines for 200+ microservices',
      'Implement monitoring, alerting and incident management',
      'Drive security and compliance initiatives',
    ],
    experience: '2–5 years', education: 'B.Tech in CS/IT or equivalent',
    perks: ['Health Insurance', 'Work from Home', 'Annual Bonus', 'Stock Options'],
  },
  {
    id: '5', title: 'Data Scientist', company: 'Zepto', init: 'ZP', color: '#10b981',
    location: 'Mumbai', type: 'Full-time', salary: '16–24 LPA', posted: '2d ago',
    match: 82, skills: ['Python', 'PyTorch', 'SQL', 'Spark'], source: 'Internshala',
    category: 'IT & Software', isGov: false,
    about: 'Zepto is India\'s fastest growing quick commerce startup delivering groceries in 10 minutes.',
    description: [
      'Build demand forecasting models for 6000+ SKUs',
      'Develop real-time recommendation systems',
      'Analyse supply chain data to reduce wastage',
      'Collaborate with product and ops teams on data-driven decisions',
    ],
    experience: '2–4 years', education: 'B.Tech/M.Tech/MS in CS, Stats or Data Science',
    perks: ['ESOPs', 'Health Insurance', 'Free Zepto Credits', 'Flexible Hours'],
  },
  {
    id: '6', title: 'UI/UX Designer', company: 'Meesho', init: 'MS', color: '#f43f5e',
    location: 'Bangalore', type: 'Full-time', salary: '12–18 LPA', posted: '3d ago',
    match: 74, skills: ['Figma', 'Framer', 'User Research', 'Prototyping'], source: 'LinkedIn',
    category: 'Design', isGov: false,
    about: 'Meesho is India\'s fastest growing social commerce platform empowering 15M+ entrepreneurs.',
    description: [
      'Design intuitive interfaces for 130M+ Indian shoppers',
      'Conduct user research and usability testing',
      'Create and maintain design systems',
      'Collaborate closely with product and engineering',
    ],
    experience: '2–4 years', education: 'Degree in Design, HCI or equivalent portfolio',
    perks: ['Health Insurance', 'Learning Budget', 'Flexible Work', 'Annual Retreats'],
  },
  {
    id: '7', title: 'Marketing Manager', company: 'Groww', init: 'GR', color: '#22c55e',
    location: 'Bangalore', type: 'Full-time', salary: '10–16 LPA', posted: '4d ago',
    match: 68, skills: ['Digital Marketing', 'SEO', 'Google Ads', 'Analytics'], source: 'Naukri',
    category: 'Marketing', isGov: false,
    about: 'Groww is India\'s leading investment platform with 10M+ active investors.',
    description: [
      'Own growth marketing for retail investor acquisition',
      'Run performance marketing campaigns across Google and Meta',
      'Analyse funnel metrics and optimize conversion rates',
      'Work with content team on educational finance content',
    ],
    experience: '3–5 years', education: 'MBA in Marketing preferred',
    perks: ['ESOPs', 'Health Insurance', 'Annual Bonus', 'WFH Flexibility'],
  },
  {
    id: '8', title: 'UPSC Civil Services 2026', company: 'UPSC', init: 'UP', color: '#f59e0b',
    location: 'All India', type: 'Full-time', salary: '56,100–2,50,000/mo', posted: '5d ago',
    match: 85, skills: ['General Studies', 'CSAT', 'Essay', 'Interview'], source: 'Government',
    category: 'Government', isGov: true,
    about: 'Union Public Service Commission conducts Civil Services Examination for IAS, IPS, IFS and other Group A services.',
    description: [
      'Prelims: General Studies Paper I & II (CSAT)',
      'Mains: 9 papers including Essay and Optional subject',
      'Personality Test/Interview by UPSC board',
      'Final merit list based on Mains + Interview marks',
    ],
    experience: 'No experience required', education: 'Any graduation from recognized university',
    perks: ['Grade Pay', 'HRA', 'DA', 'Medical Benefits', 'Pension', 'Job Security'],
  },
  {
    id: '9', title: 'SSC CGL 2026', company: 'SSC', init: 'SC', color: '#06b6d4',
    location: 'Pan India', type: 'Full-time', salary: '25,500–1,51,100/mo', posted: '1w ago',
    match: 80, skills: ['Quantitative Aptitude', 'English', 'Reasoning', 'GK'], source: 'Government',
    category: 'Government', isGov: true,
    about: 'Staff Selection Commission Combined Graduate Level Examination for Group B and C posts in central government.',
    description: [
      'Tier I: Computer Based Test (CBT) — 100 questions',
      'Tier II: Multiple papers including Maths and English',
      'Document verification and medical examination',
      'Posts: Income Tax, Excise, Assistants, Auditors and more',
    ],
    experience: 'No experience required', education: 'Any graduate',
    perks: ['Grade Pay', 'DA', 'HRA', 'LTC', 'Medical', 'Pension'],
  },
  {
    id: '10', title: 'RBI Grade B Officer', company: 'RBI', init: 'RB', color: '#10b981',
    location: 'Mumbai/Various', type: 'Full-time', salary: '55,200–1,01,500/mo', posted: '1w ago',
    match: 77, skills: ['Economics', 'Finance', 'English', 'Reasoning'], source: 'Government',
    category: 'Government', isGov: true,
    about: 'Reserve Bank of India recruits Grade B Officers in General and Specialist categories.',
    description: [
      'Phase I: Online objective test in multiple subjects',
      'Phase II: Economic & Social Issues, English Writing, Finance',
      'Interview by RBI Board',
      'Posting across RBI offices pan India',
    ],
    experience: 'No experience required', education: '60% in graduation from recognised university',
    perks: ['Housing', 'Medical', 'LFC', 'Pension', 'Interest Free Loans', 'Prestige'],
  },
  {
    id: '11', title: 'IBPS PO 2026', company: 'IBPS', init: 'IB', color: '#0284c7',
    location: 'Pan India', type: 'Full-time', salary: '23,700–42,020/mo', posted: '2w ago',
    match: 72, skills: ['Reasoning', 'Quantitative', 'English', 'Computer'], source: 'Government',
    category: 'Government', isGov: true,
    about: 'Institute of Banking Personnel Selection recruits Probationary Officers for public sector banks.',
    description: [
      'Prelims: Reasoning, Quantitative Aptitude, English',
      'Mains: Reasoning, Data Analysis, General Awareness, English',
      'Interview round by respective bank',
      'Posting in nationalized banks across India',
    ],
    experience: 'No experience required', education: 'Any graduation',
    perks: ['Grade Pay', 'Medical', 'HRA', 'DA', 'Pension', 'Loan Benefits'],
  },
]

const FILTERS = ['All', 'IT & Software', 'Government', 'Marketing', 'Design', 'Finance', 'Remote']
const SORT_OPTIONS = ['Relevance', 'Latest', 'Salary']

export default function OpportunitiesPage() {
  const router = useRouter()
  const [query, setQuery] = useState('')
  const [activeFilter, setActiveFilter] = useState('All')
  const [sortBy, setSortBy] = useState('Relevance')
  const [savedIds, setSavedIds] = useState<Set<string>>(new Set())
  const [selectedJob, setSelectedJob] = useState<Job | null>(JOBS[0])
  const [showMobileDetail, setShowMobileDetail] = useState(false)
  const [vw, setVw] = useState(1280)

  useEffect(() => {
    const upd = () => setVw(window.innerWidth)
    upd()
    window.addEventListener('resize', upd)
    return () => window.removeEventListener('resize', upd)
  }, [])

  const isMobile = vw < 768
  const isTablet = vw >= 768 && vw < 1100

  const filtered = useMemo(() => {
    let list = JOBS.filter(j => {
      if (activeFilter === 'All') return true
      if (activeFilter === 'Remote') return j.type === 'Remote'
      return j.category === activeFilter
    })
    if (query.trim()) {
      const q = query.toLowerCase()
      list = list.filter(j =>
        j.title.toLowerCase().includes(q) ||
        j.company.toLowerCase().includes(q) ||
        j.skills.some(s => s.toLowerCase().includes(q))
      )
    }
    if (sortBy === 'Latest') return [...list].sort((a, b) => a.posted.localeCompare(b.posted))
    if (sortBy === 'Relevance') return [...list].sort((a, b) => b.match - a.match)
    return list
  }, [query, activeFilter, sortBy])

  const privateJobs = filtered.filter(j => !j.isGov)
  const govJobs = filtered.filter(j => j.isGov)

  function toggleSave(id: string, e: React.MouseEvent) {
    e.stopPropagation()
    setSavedIds(prev => {
      const n = new Set(prev)
      if (n.has(id)) { n.delete(id); toast.info('Removed from saved') }
      else { n.add(id); toast.success('Job saved!') }
      return n
    })
  }

  function selectJob(job: Job) {
    setSelectedJob(job)
    if (isMobile || isTablet) setShowMobileDetail(true)
  }

  function JobCard({ job }: { job: Job }) {
    const saved = savedIds.has(job.id)
    const active = selectedJob?.id === job.id && !isMobile && !isTablet
    return (
      <motion.div
        layout
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.97 }}
        onClick={() => selectJob(job)}
        style={{
          padding: '14px 16px', borderRadius: C.r, cursor: 'pointer',
          border: `1px solid ${active ? C.purple + '55' : C.border}`,
          background: active ? C.purpleDim : C.card,
          transition: 'all 0.18s', marginBottom: '8px',
        }}
        onMouseEnter={e => { if (!active) (e.currentTarget as HTMLDivElement).style.borderColor = C.borderHov }}
        onMouseLeave={e => { if (!active) (e.currentTarget as HTMLDivElement).style.borderColor = active ? C.purple + '55' : C.border }}
      >
        <div style={{ display: 'flex', gap: '11px', alignItems: 'flex-start' }}>
          <div style={{ width: '38px', height: '38px', borderRadius: '9px', background: `${job.color}20`, border: `1px solid ${job.color}40`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10.5px', fontWeight: 700, color: job.color, flexShrink: 0 }}>
            {job.init}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '6px', marginBottom: '3px' }}>
              <span style={{ fontSize: '13.5px', fontWeight: 700, color: C.text, lineHeight: 1.3 }}>{job.title}</span>
              <button onClick={e => toggleSave(job.id, e)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: saved ? C.amber : C.muted, flexShrink: 0, padding: '1px' }}>
                {saved ? <BookmarkCheck size={15} /> : <Bookmark size={15} />}
              </button>
            </div>
            <div style={{ fontSize: '12px', color: C.sub, marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '4px', flexWrap: 'wrap' }}>
              <Building2 size={10} color={C.muted} />{job.company}
              <span style={{ color: C.border }}>·</span>
              <MapPin size={10} color={C.muted} />{job.location}
              <span style={{ color: C.border }}>·</span>
              <span>{job.salary}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '6px' }}>
              <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                <span style={{ fontSize: '10px', padding: '2px 7px', borderRadius: '20px', background: C.purpleDim, color: C.purple, fontWeight: 500 }}>{job.type}</span>
                {job.isGov && <span style={{ fontSize: '10px', padding: '2px 7px', borderRadius: '20px', background: C.amberDim, color: C.amber, fontWeight: 700 }}>GOV</span>}
                <span style={{ fontSize: '10px', padding: '2px 7px', borderRadius: '20px', background: 'rgba(148,163,184,0.1)', color: C.sub }}>{job.source}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ fontSize: '10.5px', color: C.muted, display: 'flex', alignItems: 'center', gap: '3px' }}>
                  <Clock size={10} />{job.posted}
                </span>
                <span style={{ fontSize: '11px', fontWeight: 700, color: job.match >= 90 ? C.green : job.match >= 75 ? C.amber : C.sub, background: job.match >= 90 ? C.greenDim : job.match >= 75 ? C.amberDim : 'rgba(148,163,184,0.08)', padding: '2px 7px', borderRadius: '20px' }}>
                  {job.match}%
                </span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    )
  }

  function DetailPanel({ job }: { job: Job }) {
    return (
      <div style={{ padding: '22px', display: 'flex', flexDirection: 'column', gap: '18px' }}>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start', marginBottom: '4px' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: `${job.color}20`, border: `1px solid ${job.color}40`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', fontWeight: 800, color: job.color, flexShrink: 0 }}>
            {job.init}
          </div>
          <div>
            <h2 style={{ fontSize: '16px', fontWeight: 800, color: C.text, margin: '0 0 3px', letterSpacing: '-0.02em' }}>{job.title}</h2>
            <p style={{ fontSize: '13px', color: C.sub, margin: 0 }}>{job.company} · {job.location}</p>
          </div>
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '7px' }}>
          {[job.salary, job.type, job.experience].map(tag => (
            <span key={tag} style={{ fontSize: '11.5px', padding: '4px 10px', borderRadius: '20px', background: C.purpleDim, color: C.purple, fontWeight: 500 }}>{tag}</span>
          ))}
          {job.isGov && <span style={{ fontSize: '11.5px', padding: '4px 10px', borderRadius: '20px', background: C.amberDim, color: C.amber, fontWeight: 700 }}>Government</span>}
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          <button onClick={() => toast.info('Opening application form — coming soon!')} style={{ flex: 1, padding: '10px', borderRadius: C.rSm, background: C.purple, border: 'none', color: '#fff', fontSize: '13px', fontWeight: 700, cursor: 'pointer' }}>
            Apply Now
          </button>
          <button
            onClick={() => toggleSave(job.id, { stopPropagation: () => {} } as React.MouseEvent)}
            style={{ padding: '10px 14px', borderRadius: C.rSm, background: savedIds.has(job.id) ? C.amberDim : 'transparent', border: `1px solid ${savedIds.has(job.id) ? C.amber : C.border}`, color: savedIds.has(job.id) ? C.amber : C.sub, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px', fontSize: '12px', fontWeight: 600 }}
          >
            {savedIds.has(job.id) ? <BookmarkCheck size={14} /> : <Bookmark size={14} />}
            {savedIds.has(job.id) ? 'Saved' : 'Save'}
          </button>
          <button onClick={() => toast.success('Link copied!')} style={{ padding: '10px 12px', borderRadius: C.rSm, background: 'transparent', border: `1px solid ${C.border}`, color: C.sub, cursor: 'pointer' }}>
            <ExternalLink size={14} />
          </button>
        </div>

        <div style={{ height: '1px', background: C.border }} />

        <div>
          <h3 style={{ fontSize: '11px', fontWeight: 700, color: C.purple, textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 8px' }}>About {job.company}</h3>
          <p style={{ fontSize: '13px', color: C.sub, lineHeight: 1.7, margin: 0 }}>{job.about}</p>
        </div>

        <div>
          <h3 style={{ fontSize: '11px', fontWeight: 700, color: C.purple, textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 10px' }}>What You'll Do</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {job.description.map((d, i) => (
              <div key={i} style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
                <div style={{ width: '5px', height: '5px', borderRadius: '50%', background: C.purple, marginTop: '8px', flexShrink: 0 }} />
                <p style={{ fontSize: '13px', color: C.sub, lineHeight: 1.6, margin: 0 }}>{d}</p>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h3 style={{ fontSize: '11px', fontWeight: 700, color: C.purple, textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 8px' }}>Required Skills</h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
            {job.skills.map(s => (
              <span key={s} style={{ fontSize: '12px', padding: '4px 10px', borderRadius: '20px', background: C.purpleDim, color: C.purple, fontWeight: 500 }}>{s}</span>
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', gap: '8px', padding: '12px', borderRadius: C.rSm, background: C.cyanDim, border: `1px solid rgba(6,182,212,0.18)` }}>
          <GraduationCap size={15} color={C.cyan} style={{ flexShrink: 0, marginTop: '1px' }} />
          <div>
            <p style={{ fontSize: '11px', fontWeight: 600, color: C.cyan, margin: '0 0 2px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Education</p>
            <p style={{ fontSize: '12.5px', color: C.sub, margin: 0 }}>{job.education}</p>
          </div>
        </div>

        <div>
          <h3 style={{ fontSize: '11px', fontWeight: 700, color: C.purple, textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 8px' }}>Perks & Benefits</h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
            {job.perks.map(p => (
              <span key={p} style={{ fontSize: '11.5px', padding: '3px 9px', borderRadius: '20px', background: C.greenDim, color: C.green, fontWeight: 500 }}>{p}</span>
            ))}
          </div>
        </div>

        <div style={{ paddingBottom: '8px' }} />
      </div>
    )
  }

  const p = isMobile ? '14px' : '22px 26px'

  return (
    <div style={{ padding: p, background: C.bg, minHeight: '100%', display: 'flex', flexDirection: 'column', gap: '16px' }}>

      {/* Header */}
      <div>
        <h1 style={{ fontSize: isMobile ? '18px' : '20px', fontWeight: 800, color: C.text, margin: '0 0 3px', letterSpacing: '-0.02em' }}>
          Opportunities
        </h1>
        <p style={{ fontSize: '13px', color: C.sub, margin: 0 }}>
          Jobs matched to your profile · <span style={{ color: C.purple, fontWeight: 600 }}>{filtered.length} jobs found</span>
        </p>
      </div>

      {/* Search + Sort */}
      <div style={{ display: 'flex', gap: '10px', flexWrap: isMobile ? 'wrap' : 'nowrap' }}>
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '8px', background: C.card, border: `1px solid ${C.border}`, borderRadius: C.rSm, padding: '9px 14px', minWidth: isMobile ? '100%' : 'auto' }}>
          <Search size={14} color={C.muted} />
          <input
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search job title, company, skill..."
            style={{ background: 'none', border: 'none', outline: 'none', color: C.text, fontSize: '13px', flex: 1 }}
          />
          {query && (
            <button onClick={() => setQuery('')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: C.muted, display: 'flex' }}>
              <X size={13} />
            </button>
          )}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: C.card, border: `1px solid ${C.border}`, borderRadius: C.rSm, padding: '9px 12px' }}>
          <SlidersHorizontal size={13} color={C.sub} />
          <select
            value={sortBy}
            onChange={e => setSortBy(e.target.value)}
            style={{ background: 'none', border: 'none', outline: 'none', color: C.sub, fontSize: '12.5px', cursor: 'pointer' }}
          >
            {SORT_OPTIONS.map(o => <option key={o} value={o} style={{ background: '#111118' }}>{o}</option>)}
          </select>
        </div>
      </div>

      {/* Filter chips */}
      <div style={{ display: 'flex', gap: '7px', overflowX: 'auto', paddingBottom: '2px' }}>
        {FILTERS.map(f => (
          <button
            key={f}
            onClick={() => setActiveFilter(f)}
            style={{
              padding: '6px 14px', borderRadius: '20px',
              border: `1px solid ${activeFilter === f ? C.purple : C.border}`,
              background: activeFilter === f ? C.purpleDim : 'transparent',
              color: activeFilter === f ? C.purple : C.sub,
              fontSize: '12px', fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap',
              transition: 'all 0.15s', flexShrink: 0,
            }}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Main grid */}
      <div style={{ display: 'grid', gridTemplateColumns: isMobile || isTablet ? '1fr' : '400px 1fr', gap: '16px', alignItems: 'start', flex: 1 }}>

        {/* Left: job list */}
        <div>
          {privateJobs.length > 0 && (
            <>
              <p style={{ fontSize: '11px', fontWeight: 700, color: C.muted, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '10px' }}>
                Private Sector · {privateJobs.length} jobs
              </p>
              <AnimatePresence mode="popLayout">
                {privateJobs.map(job => <JobCard key={job.id} job={job} />)}
              </AnimatePresence>
            </>
          )}
          {govJobs.length > 0 && (
            <>
              <p style={{ fontSize: '11px', fontWeight: 700, color: C.amber, textTransform: 'uppercase', letterSpacing: '0.08em', margin: '20px 0 10px' }}>
                Government Jobs · {govJobs.length} openings
              </p>
              <AnimatePresence mode="popLayout">
                {govJobs.map(job => <JobCard key={job.id} job={job} />)}
              </AnimatePresence>
            </>
          )}
          {filtered.length === 0 && (
            <div style={{ textAlign: 'center', padding: '48px 20px' }}>
              <Search size={32} color={C.muted} style={{ marginBottom: '12px' }} />
              <p style={{ color: C.sub, fontSize: '14px', margin: 0 }}>No jobs found for "{query}"</p>
              <button onClick={() => { setQuery(''); setActiveFilter('All') }} style={{ marginTop: '12px', padding: '8px 16px', borderRadius: C.rSm, background: C.purple, border: 'none', color: '#fff', fontSize: '12.5px', fontWeight: 600, cursor: 'pointer' }}>
                Clear filters
              </button>
            </div>
          )}
          <div style={{ textAlign: 'center', padding: '12px 0', color: C.muted, fontSize: '12px' }}>
            Showing {filtered.length} of {JOBS.length} jobs
          </div>
        </div>

        {/* Right: detail panel (desktop only) */}
        {!isMobile && !isTablet && (
          <div style={{ position: 'sticky', top: '0', background: C.card, border: `1px solid ${C.border}`, borderRadius: C.r, maxHeight: 'calc(100vh - 120px)', overflowY: 'auto' }}>
            {selectedJob
              ? <DetailPanel job={selectedJob} />
              : (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '300px', color: C.muted }}>
                  <Briefcase size={32} style={{ marginBottom: '12px' }} />
                  <p style={{ fontSize: '13px' }}>Select a job to view details</p>
                </div>
              )
            }
          </div>
        )}
      </div>

      {/* Mobile / tablet bottom sheet */}
      <AnimatePresence>
        {(isMobile || isTablet) && showMobileDetail && selectedJob && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowMobileDetail(false)}
              style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', zIndex: 40, backdropFilter: 'blur(2px)' }}
            />
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 300 }}
              style={{ position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 50, background: C.card, borderRadius: '20px 20px 0 0', border: `1px solid ${C.border}`, maxHeight: '85vh', overflowY: 'auto' }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 18px', borderBottom: `1px solid ${C.border}`, position: 'sticky', top: 0, background: C.card, zIndex: 1 }}>
                <span style={{ fontSize: '13.5px', fontWeight: 700, color: C.text }}>Job Details</span>
                <button onClick={() => setShowMobileDetail(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: C.muted }}>
                  <X size={18} />
                </button>
              </div>
              <DetailPanel job={selectedJob} />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <style>{`
        input::placeholder { color: #475569; }
        select option { background: #111118; color: #f8fafc; }
        div::-webkit-scrollbar { width: 4px; }
        div::-webkit-scrollbar-thumb { background: #1e1e2e; border-radius: 10px; }
      `}</style>
    </div>
  )
}
