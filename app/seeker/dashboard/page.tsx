'use client'

import { useEffect, useState, useRef } from 'react'
import { motion, useInView, animate, AnimatePresence } from 'framer-motion'
import {
  Briefcase, Calendar, Eye, Bookmark, Sparkles, ArrowUpRight,
  ArrowDownRight, ChevronRight, MapPin, IndianRupee, Clock,
  CheckCircle2, Circle, Bell, TrendingUp, Star, Zap, Target,
  Award, MessageSquare, Heart, Send, User, BarChart2, FileText
} from 'lucide-react'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

// ─── Design tokens ────────────────────────────────────────────────────────────
const C = {
  bg: '#0a0a0f',
  card: '#111118',
  cardHover: '#16161f',
  border: '#1e1e2e',
  borderHover: '#2e2e4e',
  purple: '#6c63ff',
  purpleDim: 'rgba(108,99,255,0.12)',
  purpleGlow: 'rgba(108,99,255,0.25)',
  cyan: '#06b6d4',
  cyanDim: 'rgba(6,182,212,0.12)',
  green: '#10b981',
  greenDim: 'rgba(16,185,129,0.12)',
  amber: '#f59e0b',
  amberDim: 'rgba(245,158,11,0.12)',
  red: '#ef4444',
  redDim: 'rgba(239,68,68,0.12)',
  text: '#f8fafc',
  textSub: '#94a3b8',
  textMuted: '#475569',
  radius: '16px',
  radiusSm: '10px',
}

// ─── Types ────────────────────────────────────────────────────────────────────
interface Profile { full_name: string | null; avatar_url: string | null; headline: string | null }

interface StatCard {
  label: string; value: number; trend: number; icon: React.ElementType
  color: string; dimColor: string; prefix?: string; suffix?: string
}

interface Application {
  id: string; company: string; role: string; location: string
  appliedDate: string; status: 'Applied' | 'In Review' | 'Interview' | 'Rejected' | 'Offer'
  initials: string; color: string
}

interface Job {
  id: string; title: string; company: string; location: string
  salary: string; match: number; tags: string[]; type: string; initials: string; color: string
}

interface Interview {
  id: string; company: string; role: string; date: string; time: string; type: string
}

interface Activity {
  id: string; type: 'applied' | 'saved' | 'viewed' | 'message' | 'interview'
  text: string; time: string; icon: React.ElementType; color: string
}

// ─── Mock data ────────────────────────────────────────────────────────────────
const MOCK_APPLICATIONS: Application[] = [
  { id: '1', company: 'Razorpay', role: 'Frontend Engineer', location: 'Bangalore', appliedDate: '2 days ago', status: 'In Review', initials: 'RZ', color: '#0ea5e9' },
  { id: '2', company: 'Swiggy', role: 'Software Engineer II', location: 'Bangalore', appliedDate: '4 days ago', status: 'Interview', initials: 'SW', color: '#f97316' },
  { id: '3', company: 'CRED', role: 'Product Engineer', location: 'Bangalore', appliedDate: '1 week ago', status: 'Applied', initials: 'CR', color: '#8b5cf6' },
  { id: '4', company: 'PhonePe', role: 'React Developer', location: 'Pune', appliedDate: '1 week ago', status: 'Rejected', initials: 'PP', color: '#6366f1' },
  { id: '5', company: 'Zepto', role: 'Full Stack Developer', location: 'Mumbai', appliedDate: '2 weeks ago', status: 'Offer', initials: 'ZP', color: '#10b981' },
]

const MOCK_JOBS: Job[] = [
  { id: '1', title: 'Senior React Developer', company: 'Groww', location: 'Bangalore', salary: '18–25 LPA', match: 96, tags: ['React', 'TypeScript', 'Redux'], type: 'Full-time', initials: 'GR', color: '#10b981' },
  { id: '2', title: 'Product Engineer', company: 'Meesho', location: 'Bangalore', salary: '15–22 LPA', match: 89, tags: ['Node.js', 'React', 'AWS'], type: 'Full-time', initials: 'MS', color: '#f43f5e' },
  { id: '3', title: 'Frontend Engineer', company: 'Zomato', location: 'Gurugram', salary: '12–18 LPA', match: 83, tags: ['Vue.js', 'Python', 'Docker'], type: 'Hybrid', initials: 'ZM', color: '#ef4444' },
]

const MOCK_INTERVIEWS: Interview[] = [
  { id: '1', company: 'Swiggy', role: 'Software Engineer II', date: 'Tomorrow', time: '11:00 AM', type: 'Video Call' },
  { id: '2', company: 'Razorpay', role: 'Frontend Engineer', date: 'Jun 10', time: '3:00 PM', type: 'Technical Round' },
]

const MOCK_ACTIVITY: Activity[] = [
  { id: '1', type: 'interview', text: 'Interview scheduled with Swiggy for Software Engineer II', time: '1 hour ago', icon: Calendar, color: C.cyan },
  { id: '2', type: 'message', text: 'New message from Razorpay HR — "We loved your profile!"', time: '3 hours ago', icon: MessageSquare, color: C.purple },
  { id: '3', type: 'applied', text: 'Applied to Product Engineer at CRED', time: 'Yesterday', icon: Send, color: C.green },
  { id: '4', type: 'saved', text: 'Saved Senior Frontend role at Flipkart', time: 'Yesterday', icon: Heart, color: C.amber },
  { id: '5', type: 'viewed', text: 'Recruiter from Zepto viewed your profile', time: '2 days ago', icon: Eye, color: '#a855f7' },
]

const PROFILE_ITEMS = [
  { label: 'Profile photo', done: true },
  { label: 'Work experience', done: true },
  { label: 'Education details', done: true },
  { label: 'Skills & tools', done: false },
  { label: 'Resume uploaded', done: false },
  { label: 'LinkedIn profile', done: false },
]

// ─── Animated counter ─────────────────────────────────────────────────────────
function CountUp({ to, duration = 1.5 }: { to: number; duration?: number }) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true })
  useEffect(() => {
    if (!inView || !ref.current) return
    const controls = animate(0, to, {
      duration,
      onUpdate: v => { if (ref.current) ref.current.textContent = Math.round(v).toString() }
    })
    return controls.stop
  }, [inView, to, duration])
  return <span ref={ref}>0</span>
}

// ─── Status badge ─────────────────────────────────────────────────────────────
function StatusBadge({ status }: { status: Application['status'] }) {
  const map: Record<Application['status'], { color: string; bg: string }> = {
    'Applied':   { color: '#60a5fa', bg: 'rgba(96,165,250,0.12)' },
    'In Review': { color: C.amber,   bg: C.amberDim },
    'Interview': { color: C.cyan,    bg: C.cyanDim },
    'Rejected':  { color: C.red,     bg: C.redDim },
    'Offer':     { color: C.green,   bg: C.greenDim },
  }
  const s = map[status]
  return (
    <span style={{ fontSize: '11px', fontWeight: 600, padding: '3px 10px', borderRadius: '20px', color: s.color, background: s.bg, letterSpacing: '0.02em' }}>
      {status}
    </span>
  )
}

// ─── Card wrapper ─────────────────────────────────────────────────────────────
function Card({ children, style = {}, onClick }: { children: React.ReactNode; style?: React.CSSProperties; onClick?: () => void }) {
  const [hovered, setHovered] = useState(false)
  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: C.card,
        border: `1px solid ${hovered ? C.borderHover : C.border}`,
        borderRadius: C.radius,
        transition: 'all 0.2s ease',
        cursor: onClick ? 'pointer' : 'default',
        ...style,
      }}
    >
      {children}
    </div>
  )
}

// ─── Section header ───────────────────────────────────────────────────────────
function SectionHeader({ title, action, onAction }: { title: string; action?: string; onAction?: () => void }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
      <h2 style={{ fontSize: '15px', fontWeight: 700, color: C.text, margin: 0 }}>{title}</h2>
      {action && (
        <button onClick={onAction} style={{ background: 'none', border: 'none', cursor: 'pointer', color: C.purple, fontSize: '12.5px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px', padding: 0 }}>
          {action} <ChevronRight size={14} />
        </button>
      )}
    </div>
  )
}

// ─── Circular progress ────────────────────────────────────────────────────────
function CircularProgress({ pct }: { pct: number }) {
  const r = 44, cx = 52, cy = 52, stroke = 6
  const circ = 2 * Math.PI * r
  const dash = (pct / 100) * circ
  return (
    <svg width="104" height="104" viewBox="0 0 104 104">
      <circle cx={cx} cy={cy} r={r} fill="none" stroke={C.border} strokeWidth={stroke} />
      <motion.circle
        cx={cx} cy={cy} r={r} fill="none"
        stroke={C.purple} strokeWidth={stroke}
        strokeLinecap="round"
        strokeDasharray={`${dash} ${circ - dash}`}
        strokeDashoffset={circ / 4}
        initial={{ strokeDasharray: `0 ${circ}` }}
        animate={{ strokeDasharray: `${dash} ${circ - dash}` }}
        transition={{ duration: 1.2, ease: 'easeOut' }}
      />
      <text x={cx} y={cy + 2} textAnchor="middle" dominantBaseline="middle" fill={C.text} fontSize="18" fontWeight="700">{pct}%</text>
    </svg>
  )
}

// ─── Main page ────────────────────────────────────────────────────────────────
export default function DashboardPage() {
  const router = useRouter()
  const [profile, setProfile] = useState<Profile>({ full_name: null, avatar_url: null, headline: null })
  const [loading, setLoading] = useState(true)

  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'
  const firstName = profile.full_name?.split(' ')[0] || 'there'

  const today = new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })

  const profileDone = PROFILE_ITEMS.filter(i => i.done).length
  const profilePct = Math.round((profileDone / PROFILE_ITEMS.length) * 100)

  const STATS: StatCard[] = [
    { label: 'Jobs Applied', value: 24, trend: 12, icon: Briefcase, color: C.purple, dimColor: C.purpleDim },
    { label: 'Interviews', value: 3, trend: 50, icon: Calendar, color: C.cyan, dimColor: C.cyanDim },
    { label: 'Profile Views', value: 187, trend: 23, icon: Eye, color: C.green, dimColor: C.greenDim },
    { label: 'Saved Jobs', value: 12, trend: -5, icon: Bookmark, color: C.amber, dimColor: C.amberDim },
  ]

  useEffect(() => {
    const load = async () => {
      try {
        const supabase = createClient()
        const { data: { user } } = await supabase.auth.getUser()
        if (user) {
          const { data } = await supabase.from('profiles').select('full_name,avatar_url,headline').eq('id', user.id).single()
          if (data) setProfile(data)
        }
      } catch { /* use defaults */ }
      finally { setLoading(false) }
    }
    load()
  }, [])

  if (loading) return (
    <div style={{ padding: '32px', background: C.bg, minHeight: '100%' }}>
      {[1,2,3,4].map(i => (
        <div key={i} style={{ height: '80px', borderRadius: C.radius, background: C.card, marginBottom: '16px', animation: 'pulse 1.5s ease-in-out infinite' }} />
      ))}
    </div>
  )

  return (
    <div style={{ padding: '28px 32px', background: C.bg, minHeight: '100%', maxWidth: '1400px' }}>

      {/* ── Welcome banner ── */}
      <motion.div
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        style={{
          borderRadius: C.radius,
          padding: '28px 32px',
          marginBottom: '28px',
          background: 'linear-gradient(135deg, rgba(108,99,255,0.15) 0%, rgba(6,182,212,0.08) 100%)',
          border: `1px solid ${C.border}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '16px',
        }}
      >
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 800, color: C.text, margin: '0 0 6px', letterSpacing: '-0.02em' }}>
            {greeting}, {firstName}! 👋
          </h1>
          <p style={{ fontSize: '14px', color: C.textSub, margin: 0 }}>
            Here's what's happening with your job search today.
          </p>
          <p style={{ fontSize: '12px', color: C.textMuted, margin: '4px 0 0' }}>{today}</p>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={() => router.push('/seeker/opportunities')}
            style={{ padding: '10px 20px', borderRadius: C.radiusSm, background: C.purple, border: 'none', color: '#fff', fontSize: '13px', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <Zap size={14} /> Browse Jobs
          </button>
          <button
            onClick={() => router.push('/seeker/resume')}
            style={{ padding: '10px 20px', borderRadius: C.radiusSm, background: 'transparent', border: `1px solid ${C.border}`, color: C.text, fontSize: '13px', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <FileText size={14} /> Update Resume
          </button>
        </div>
      </motion.div>

      {/* ── Stats row ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '28px' }}>
        {STATS.map((s, i) => {
          const Icon = s.icon
          const up = s.trend > 0
          return (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
            >
              <Card style={{ padding: '22px', backdropFilter: 'blur(12px)' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '16px' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: s.dimColor, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Icon size={18} color={s.color} />
                  </div>
                  <span style={{ fontSize: '11.5px', fontWeight: 600, color: up ? C.green : C.red, display: 'flex', alignItems: 'center', gap: '3px' }}>
                    {up ? <ArrowUpRight size={13} /> : <ArrowDownRight size={13} />}
                    {Math.abs(s.trend)}%
                  </span>
                </div>
                <div style={{ fontSize: '32px', fontWeight: 800, color: C.text, letterSpacing: '-0.03em', lineHeight: 1 }}>
                  {s.prefix}<CountUp to={s.value} />{s.suffix}
                </div>
                <div style={{ fontSize: '12.5px', color: C.textSub, marginTop: '6px' }}>{s.label}</div>
                <div style={{ fontSize: '11px', color: C.textMuted, marginTop: '3px' }}>vs last week</div>
              </Card>
            </motion.div>
          )
        })}
      </div>

      {/* ── Main two-column ── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '20px', alignItems: 'start' }}>

        {/* LEFT */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

          {/* Recent Applications */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <Card style={{ padding: '24px' }}>
              <SectionHeader title="Recent Applications" action="View All" onAction={() => router.push('/seeker/applications')} />
              <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                {MOCK_APPLICATIONS.map((app, i) => (
                  <motion.div
                    key={app.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.35 + i * 0.06 }}
                    onClick={() => toast.info('Opening application details — coming soon!')}
                    style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '12px', borderRadius: C.radiusSm, cursor: 'pointer', transition: 'background 0.15s' }}
                    onMouseEnter={e => (e.currentTarget.style.background = C.cardHover)}
                    onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                  >
                    <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: app.color + '22', border: `1px solid ${app.color}44`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 700, color: app.color, flexShrink: 0 }}>
                      {app.initials}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: '13.5px', fontWeight: 600, color: C.text, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{app.role}</div>
                      <div style={{ fontSize: '12px', color: C.textSub, display: 'flex', alignItems: 'center', gap: '6px', marginTop: '2px' }}>
                        {app.company}
                        <span style={{ color: C.textMuted }}>·</span>
                        <MapPin size={11} color={C.textMuted} />
                        <span style={{ color: C.textMuted }}>{app.location}</span>
                      </div>
                    </div>
                    <div style={{ textAlign: 'right', flexShrink: 0 }}>
                      <StatusBadge status={app.status} />
                      <div style={{ fontSize: '11px', color: C.textMuted, marginTop: '4px' }}>{app.appliedDate}</div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </Card>
          </motion.div>

          {/* Recommended Jobs */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
            <Card style={{ padding: '24px' }}>
              <SectionHeader title="Recommended for You" action="Browse All" onAction={() => router.push('/seeker/opportunities')} />
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {MOCK_JOBS.map((job, i) => (
                  <motion.div
                    key={job.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.45 + i * 0.07 }}
                    style={{ padding: '16px', borderRadius: C.radiusSm, border: `1px solid ${C.border}`, background: 'transparent', transition: 'all 0.2s' }}
                    onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.background = C.cardHover; (e.currentTarget as HTMLDivElement).style.borderColor = C.borderHover }}
                    onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.background = 'transparent'; (e.currentTarget as HTMLDivElement).style.borderColor = C.border }}
                  >
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                      <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: job.color + '22', border: `1px solid ${job.color}44`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 700, color: job.color, flexShrink: 0 }}>
                        {job.initials}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                          <span style={{ fontSize: '14px', fontWeight: 700, color: C.text }}>{job.title}</span>
                          <span style={{ fontSize: '11.5px', fontWeight: 700, color: job.match >= 90 ? C.green : C.amber, background: job.match >= 90 ? C.greenDim : C.amberDim, padding: '2px 8px', borderRadius: '20px' }}>
                            {job.match}% match
                          </span>
                        </div>
                        <div style={{ fontSize: '12.5px', color: C.textSub, display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                          {job.company}
                          <span style={{ color: C.textMuted }}>·</span>
                          <MapPin size={11} color={C.textMuted} />
                          {job.location}
                          <span style={{ color: C.textMuted }}>·</span>
                          <IndianRupee size={11} color={C.textMuted} />
                          {job.salary}
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                            {job.tags.map(t => (
                              <span key={t} style={{ fontSize: '11px', padding: '2px 8px', borderRadius: '6px', background: C.purpleDim, color: C.purple, fontWeight: 500 }}>{t}</span>
                            ))}
                            <span style={{ fontSize: '11px', padding: '2px 8px', borderRadius: '6px', background: C.cyanDim, color: C.cyan, fontWeight: 500 }}>{job.type}</span>
                          </div>
                          <button
                            onClick={() => toast.info('Redirecting to application — coming soon!')}
                            style={{ padding: '6px 14px', borderRadius: '8px', background: C.purple, border: 'none', color: '#fff', fontSize: '12px', fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap' }}
                          >
                            Apply Now
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </Card>
          </motion.div>

          {/* Activity Feed */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
            <Card style={{ padding: '24px' }}>
              <SectionHeader title="Recent Activity" />
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
                {MOCK_ACTIVITY.map((act, i) => {
                  const Icon = act.icon
                  return (
                    <div key={act.id} style={{ display: 'flex', gap: '14px', padding: '12px 0', borderBottom: i < MOCK_ACTIVITY.length - 1 ? `1px solid ${C.border}` : 'none' }}>
                      <div style={{ width: '34px', height: '34px', borderRadius: '10px', background: act.color + '18', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: '2px' }}>
                        <Icon size={15} color={act.color} />
                      </div>
                      <div style={{ flex: 1 }}>
                        <p style={{ fontSize: '13px', color: C.text, margin: '0 0 3px', lineHeight: 1.5 }}>{act.text}</p>
                        <span style={{ fontSize: '11.5px', color: C.textMuted }}>{act.time}</span>
                      </div>
                    </div>
                  )
                })}
              </div>
            </Card>
          </motion.div>
        </div>

        {/* RIGHT */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

          {/* Profile completion */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.35 }}>
            <Card style={{ padding: '24px' }}>
              <SectionHeader title="Profile Strength" />
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '20px' }}>
                <CircularProgress pct={profilePct} />
                <p style={{ fontSize: '13px', color: C.textSub, marginTop: '10px', textAlign: 'center' }}>
                  {profilePct < 70 ? 'Complete your profile to get more visibility' : 'Great profile! Keep it updated.'}
                </p>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px' }}>
                {PROFILE_ITEMS.map(item => (
                  <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    {item.done
                      ? <CheckCircle2 size={15} color={C.green} />
                      : <Circle size={15} color={C.textMuted} />
                    }
                    <span style={{ fontSize: '12.5px', color: item.done ? C.textSub : C.text, textDecoration: item.done ? 'line-through' : 'none', opacity: item.done ? 0.6 : 1 }}>
                      {item.label}
                    </span>
                  </div>
                ))}
              </div>
              <button
                onClick={() => router.push('/seeker/profile')}
                style={{ width: '100%', padding: '10px', borderRadius: C.radiusSm, background: C.purple, border: 'none', color: '#fff', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}
              >
                Complete Profile
              </button>
            </Card>
          </motion.div>

          {/* Upcoming Interviews */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.42 }}>
            <Card style={{ padding: '24px' }}>
              <SectionHeader title="Upcoming Interviews" />
              {MOCK_INTERVIEWS.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '20px 0', color: C.textMuted, fontSize: '13px' }}>
                  No interviews scheduled yet
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {MOCK_INTERVIEWS.map(iv => (
                    <div key={iv.id} style={{ padding: '14px', borderRadius: C.radiusSm, background: C.cyanDim, border: `1px solid ${C.cyan}30` }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                        <div>
                          <p style={{ fontSize: '13.5px', fontWeight: 700, color: C.text, margin: '0 0 2px' }}>{iv.company}</p>
                          <p style={{ fontSize: '12px', color: C.textSub, margin: 0 }}>{iv.role}</p>
                        </div>
                        <span style={{ fontSize: '11px', background: C.cyanDim, color: C.cyan, padding: '2px 8px', borderRadius: '20px', fontWeight: 600, border: `1px solid ${C.cyan}30` }}>
                          {iv.type}
                        </span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <span style={{ fontSize: '12px', color: C.textSub, display: 'flex', alignItems: 'center', gap: '5px' }}>
                          <Calendar size={12} color={C.cyan} /> {iv.date} at {iv.time}
                        </span>
                        <button
                          onClick={() => toast.info('Joining meeting — coming soon!')}
                          style={{ padding: '5px 12px', borderRadius: '7px', background: C.cyan, border: 'none', color: '#fff', fontSize: '11.5px', fontWeight: 600, cursor: 'pointer' }}
                        >
                          Join
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </motion.div>

          {/* AI Tip */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 }}>
            <Card style={{ padding: '24px', background: 'linear-gradient(135deg, rgba(108,99,255,0.18) 0%, rgba(6,182,212,0.10) 100%)', border: `1px solid ${C.purple}40` }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                <Sparkles size={16} color={C.purple} />
                <span style={{ fontSize: '12px', fontWeight: 700, color: C.purple, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Career AI Tip</span>
              </div>
              <p style={{ fontSize: '13.5px', color: C.text, lineHeight: 1.7, margin: '0 0 14px' }}>
                Candidates who apply within the first 24 hours of a job posting are <strong style={{ color: C.cyan }}>3x more likely</strong> to get a callback. Check new listings every morning!
              </p>
              <button
                onClick={() => router.push('/seeker/chat')}
                style={{ padding: '8px 16px', borderRadius: C.radiusSm, background: C.purple, border: 'none', color: '#fff', fontSize: '12.5px', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
              >
                <Sparkles size={13} /> Ask Career AI
              </button>
            </Card>
          </motion.div>

        </div>
      </div>

      <style>{`
        @media (max-width: 1024px) {
          .dash-grid { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 768px) {
          .stats-grid { grid-template-columns: repeat(2,1fr) !important; }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
      `}</style>
    </div>
  )
}
