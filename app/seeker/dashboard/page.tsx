'use client'

import { useEffect, useState, useRef } from 'react'
import { motion, useInView, animate } from 'framer-motion'
import {
  Briefcase, Calendar, Eye, Bookmark, Sparkles, ArrowUpRight,
  ArrowDownRight, ChevronRight, MapPin, IndianRupee, Clock,
  CheckCircle2, Circle, Video, Bell, Send, Heart, MessageSquare,
  TrendingUp, User, Star, Zap, Target, Award
} from 'lucide-react'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

// ─── Types ─────────────────────────────────────────────────────────────────

interface Profile {
  full_name: string | null
  avatar_url: string | null
  headline: string | null
}

interface Application {
  id: string
  company: string
  role: string
  location: string
  appliedDate: string
  status: 'Applied' | 'In Review' | 'Interview' | 'Rejected' | 'Offer'
  initials: string
  color: string
}

interface Job {
  id: string
  title: string
  company: string
  location: string
  salaryMin: number
  salaryMax: number
  match: number
  tags: string[]
  initials: string
  color: string
}

interface Interview {
  id: string
  company: string
  role: string
  date: string
  time: string
  type: string
}

interface ActivityItem {
  id: string
  type: 'applied' | 'saved' | 'viewed' | 'message'
  text: string
  time: string
  icon: 'send' | 'bookmark' | 'eye' | 'message'
}

// ─── Mock Data ──────────────────────────────────────────────────────────────

const APPLICATIONS: Application[] = [
  { id: '1', company: 'Infosys', role: 'Senior Frontend Developer', location: 'Bengaluru', appliedDate: '2 Jun 2025', status: 'Interview', initials: 'IN', color: '#006f9f' },
  { id: '2', company: 'Razorpay', role: 'Product Designer', location: 'Bengaluru', appliedDate: '30 May 2025', status: 'In Review', initials: 'RP', color: '#3395FF' },
  { id: '3', company: 'Swiggy', role: 'React Native Engineer', location: 'Hyderabad', appliedDate: '28 May 2025', status: 'Applied', initials: 'SW', color: '#FC8019' },
  { id: '4', company: 'HDFC Bank', role: 'UI/UX Designer', location: 'Mumbai', appliedDate: '25 May 2025', status: 'Rejected', initials: 'HB', color: '#004C8F' },
  { id: '5', company: 'Meesho', role: 'Full Stack Developer', location: 'Bengaluru', appliedDate: '22 May 2025', status: 'Offer', initials: 'ME', color: '#9b59b6' },
]

const RECOMMENDED_JOBS: Job[] = [
  { id: '1', title: 'Senior React Developer', company: 'Zomato', location: 'Gurugram', salaryMin: 18, salaryMax: 28, match: 96, tags: ['Hybrid', 'Full-time', 'React'], initials: 'ZO', color: '#E23744' },
  { id: '2', title: 'Frontend Engineer', company: 'PhonePe', location: 'Bengaluru', salaryMin: 22, salaryMax: 35, match: 91, tags: ['Remote', 'Full-time', 'TypeScript'], initials: 'PP', color: '#5f259f' },
  { id: '3', title: 'UI Engineer L3', company: 'Flipkart', location: 'Bengaluru', salaryMin: 25, salaryMax: 40, match: 88, tags: ['On-site', 'Full-time', 'Next.js'], initials: 'FK', color: '#2874F0' },
]

const PROFILE_ITEMS = [
  { label: 'Work Experience', done: true },
  { label: 'Education Details', done: true },
  { label: 'Skills & Expertise', done: true },
  { label: 'Resume Upload', done: false },
  { label: 'Portfolio Link', done: false },
  { label: 'Profile Photo', done: false },
]

const INTERVIEWS: Interview[] = [
  { id: '1', company: 'Infosys', role: 'Senior Frontend Developer', date: 'Today', time: '3:00 PM', type: 'Technical Round 2' },
  { id: '2', company: 'Razorpay', role: 'Product Designer', date: 'Tomorrow', time: '11:30 AM', type: 'Culture Fit' },
]

const ACTIVITY: ActivityItem[] = [
  { id: '1', type: 'applied', text: 'Applied to Senior React Developer at Zomato', time: '2 hours ago', icon: 'send' },
  { id: '2', type: 'viewed', text: 'Your profile was viewed by a recruiter from Amazon', time: '5 hours ago', icon: 'eye' },
  { id: '3', type: 'saved', text: 'Saved Frontend Engineer role at Google India', time: 'Yesterday', icon: 'bookmark' },
  { id: '4', type: 'message', text: 'New message from HR at Wipro Technologies', time: 'Yesterday', icon: 'message' },
  { id: '5', type: 'applied', text: 'Application viewed by Razorpay hiring team', time: '2 days ago', icon: 'eye' },
]

// ─── Status Config ──────────────────────────────────────────────────────────

const STATUS_CONFIG = {
  Applied: { bg: 'rgba(108,99,255,0.15)', text: '#a89dff', dot: '#6c63ff' },
  'In Review': { bg: 'rgba(6,182,212,0.15)', text: '#67e8f9', dot: '#06b6d4' },
  Interview: { bg: 'rgba(16,185,129,0.15)', text: '#6ee7b7', dot: '#10b981' },
  Rejected: { bg: 'rgba(239,68,68,0.15)', text: '#fca5a5', dot: '#ef4444' },
  Offer: { bg: 'rgba(245,158,11,0.15)', text: '#fcd34d', dot: '#f59e0b' },
}

const ACTIVITY_ICON_CONFIG = {
  send: { Icon: Send, bg: 'rgba(108,99,255,0.2)', color: '#a89dff' },
  bookmark: { Icon: Bookmark, bg: 'rgba(245,158,11,0.2)', color: '#fcd34d' },
  eye: { Icon: Eye, bg: 'rgba(6,182,212,0.2)', color: '#67e8f9' },
  message: { Icon: MessageSquare, bg: 'rgba(16,185,129,0.2)', color: '#6ee7b7' },
}

// ─── Sub-components ─────────────────────────────────────────────────────────

function AnimatedNumber({ target, duration = 1.2 }: { target: number; duration?: number }) {
  const [val, setVal] = useState(0)
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true })

  useEffect(() => {
    if (!inView) return
    const controls = animate(0, target, {
      duration,
      ease: [0.25, 0.46, 0.45, 0.94],
      onUpdate: (v) => setVal(Math.round(v)),
    })
    return () => controls.stop()
  }, [inView, target, duration])

  return <span ref={ref}>{val}</span>
}

function Skeleton({ className = '' }: { className?: string }) {
  return (
    <div
      className={`rounded-xl animate-pulse ${className}`}
      style={{ background: 'linear-gradient(90deg, #1a1a28 25%, #22223a 50%, #1a1a28 75%)', backgroundSize: '200% 100%' }}
    />
  )
}

function CircularProgress({ percent }: { percent: number }) {
  const radius = 52
  const circumference = 2 * Math.PI * radius
  const strokeDashoffset = circumference - (percent / 100) * circumference

  return (
    <div className="relative flex items-center justify-center" style={{ width: 128, height: 128 }}>
      <svg width="128" height="128" style={{ transform: 'rotate(-90deg)' }}>
        <circle cx="64" cy="64" r={radius} fill="none" stroke="#1e1e2e" strokeWidth="10" />
        <motion.circle
          cx="64" cy="64" r={radius}
          fill="none"
          stroke="url(#progressGrad)"
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 1.4, ease: 'easeOut', delay: 0.3 }}
        />
        <defs>
          <linearGradient id="progressGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#6c63ff" />
            <stop offset="100%" stopColor="#06b6d4" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span style={{ fontSize: 26, fontWeight: 700, color: '#f8fafc', lineHeight: 1 }}>{percent}%</span>
        <span style={{ fontSize: 10, color: '#94a3b8', marginTop: 2 }}>Complete</span>
      </div>
    </div>
  )
}

// ─── Main Page ───────────────────────────────────────────────────────────────

export default function DashboardPage() {
  const router = useRouter()
  const supabase = createClient()
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (user) {
          const { data } = await supabase
            .from('profiles')
            .select('full_name, avatar_url, headline')
            .eq('id', user.id)
            .single()
          setProfile(data)
        }
      } catch {
        // silently fail — dashboard still renders with mock data
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const firstName = profile?.full_name?.split(' ')[0] ?? 'there'

  const now = new Date()
  const hour = now.getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'
  const dateStr = now.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })

  const profilePercent = Math.round((PROFILE_ITEMS.filter(i => i.done).length / PROFILE_ITEMS.length) * 100)

  const STATS = [
    { label: 'Jobs Applied', value: 24, trend: '+3 this week', up: true, icon: Briefcase, color: '#6c63ff', glow: 'rgba(108,99,255,0.25)' },
    { label: 'Interviews', value: 3, trend: '+1 this week', up: true, icon: Calendar, color: '#06b6d4', glow: 'rgba(6,182,212,0.25)' },
    { label: 'Profile Views', value: 187, trend: '+12% vs last week', up: true, icon: Eye, color: '#10b981', glow: 'rgba(16,185,129,0.25)' },
    { label: 'Saved Jobs', value: 11, trend: '-2 this week', up: false, icon: Bookmark, color: '#f59e0b', glow: 'rgba(245,158,11,0.25)' },
  ]

  const cardBase: React.CSSProperties = {
    background: '#111118',
    border: '1px solid #1e1e2e',
    borderRadius: 16,
    transition: 'all 0.2s ease',
  }

  // ── Loading Skeleton ─────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="w-full min-h-full p-6 space-y-6" style={{ background: '#0a0a0f' }}>
        <Skeleton className="h-32 w-full" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-32" />)}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
          <div className="lg:col-span-3 space-y-4">
            <Skeleton className="h-64" />
            <Skeleton className="h-56" />
          </div>
          <div className="lg:col-span-2 space-y-4">
            <Skeleton className="h-48" />
            <Skeleton className="h-40" />
            <Skeleton className="h-32" />
          </div>
        </div>
        <Skeleton className="h-48" />
      </div>
    )
  }

  return (
    <div className="w-full min-h-full p-4 md:p-6 space-y-5" style={{ background: '#0a0a0f', color: '#f8fafc', fontFamily: 'system-ui, -apple-system, sans-serif' }}>

      {/* ── Welcome Banner ───────────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        style={{
          ...cardBase,
          background: 'linear-gradient(135deg, rgba(108,99,255,0.12) 0%, rgba(6,182,212,0.08) 50%, #111118 100%)',
          borderColor: 'rgba(108,99,255,0.3)',
          padding: '24px 28px',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div style={{ position: 'absolute', top: -40, right: -40, width: 160, height: 160, background: 'rgba(108,99,255,0.08)', borderRadius: '50%', filter: 'blur(40px)' }} />
        <div style={{ position: 'absolute', bottom: -20, right: 120, width: 100, height: 100, background: 'rgba(6,182,212,0.06)', borderRadius: '50%', filter: 'blur(30px)' }} />

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 relative z-10">
          <div>
            <h1 style={{ fontSize: 26, fontWeight: 700, color: '#f8fafc', marginBottom: 6, lineHeight: 1.2 }}>
              {greeting}, {firstName}! 👋
            </h1>
            <p style={{ color: '#94a3b8', fontSize: 14 }}>
              Here's what's happening with your job search today.
            </p>
          </div>
          <div style={{ background: 'rgba(255,255,255,0.05)', borderRadius: 12, padding: '8px 16px', border: '1px solid rgba(255,255,255,0.08)', flexShrink: 0 }}>
            <p style={{ color: '#94a3b8', fontSize: 11, marginBottom: 2 }}>TODAY</p>
            <p style={{ color: '#f8fafc', fontSize: 13, fontWeight: 600 }}>{dateStr}</p>
          </div>
        </div>
      </motion.div>

      {/* ── Stats Row ────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {STATS.map((stat, i) => {
          const Icon = stat.icon
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 + i * 0.07 }}
              style={{
                ...cardBase,
                padding: '20px',
                backdropFilter: 'blur(12px)',
                WebkitBackdropFilter: 'blur(12px)',
                cursor: 'default',
                position: 'relative',
                overflow: 'hidden',
              }}
              whileHover={{ boxShadow: `0 0 24px ${stat.glow}`, borderColor: stat.color + '55', y: -2 }}
            >
              <div style={{ position: 'absolute', top: -24, right: -24, width: 80, height: 80, background: stat.glow, borderRadius: '50%', filter: 'blur(20px)' }} />
              <div className="flex items-start justify-between mb-3">
                <div style={{ width: 40, height: 40, borderRadius: 10, background: stat.glow, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Icon size={18} color={stat.color} />
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 3, fontSize: 11, color: stat.up ? '#10b981' : '#ef4444', fontWeight: 600 }}>
                  {stat.up ? <ArrowUpRight size={13} /> : <ArrowDownRight size={13} />}
                </div>
              </div>
              <div style={{ fontSize: 30, fontWeight: 800, color: '#f8fafc', lineHeight: 1, marginBottom: 4 }}>
                <AnimatedNumber target={stat.value} />
              </div>
              <div style={{ fontSize: 12, color: '#94a3b8', fontWeight: 500 }}>{stat.label}</div>
              <div style={{ fontSize: 11, color: stat.up ? '#10b981' : '#ef4444', marginTop: 4, fontWeight: 600 }}>{stat.trend}</div>
            </motion.div>
          )
        })}
      </div>

      {/* ── Two-Column Layout ─────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">

        {/* LEFT COLUMN */}
        <div className="lg:col-span-3 space-y-5">

          {/* Recent Applications */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.45, delay: 0.25 }}
            style={{ ...cardBase, padding: '20px 24px' }}
          >
            <div className="flex items-center justify-between mb-4">
              <h2 style={{ fontSize: 16, fontWeight: 700, color: '#f8fafc' }}>Recent Applications</h2>
              <button
                onClick={() => router.push('/seeker/applications')}
                style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, color: '#6c63ff', fontWeight: 600, background: 'none', border: 'none', cursor: 'pointer', padding: '4px 8px', borderRadius: 8, transition: 'all 0.2s' }}
                onMouseEnter={e => (e.currentTarget.style.background = 'rgba(108,99,255,0.1)')}
                onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
              >
                View All <ChevronRight size={14} />
              </button>
            </div>
            <div className="space-y-1">
              {APPLICATIONS.map((app, i) => (
                <motion.div
                  key={app.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + i * 0.05 }}
                  onClick={() => toast('Opening application details — coming soon!')}
                  style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 12px', borderRadius: 12, cursor: 'pointer', transition: 'all 0.2s' }}
                  whileHover={{ background: 'rgba(255,255,255,0.04)' }}
                >
                  <div style={{ width: 38, height: 38, borderRadius: 10, background: app.color + '22', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, border: `1px solid ${app.color}44` }}>
                    <span style={{ fontSize: 12, fontWeight: 700, color: app.color }}>{app.initials}</span>
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: '#f8fafc', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{app.role}</div>
                    <div style={{ fontSize: 11, color: '#94a3b8', display: 'flex', alignItems: 'center', gap: 6, marginTop: 1 }}>
                      <span>{app.company}</span>
                      <span style={{ color: '#2d2d44' }}>•</span>
                      <MapPin size={10} />
                      <span>{app.location}</span>
                    </div>
                  </div>
                  <div style={{ fontSize: 11, color: '#94a3b8', flexShrink: 0, display: 'none' }} className="sm:block">{app.appliedDate}</div>
                  <div style={{
                    flexShrink: 0,
                    padding: '3px 10px',
                    borderRadius: 20,
                    fontSize: 11,
                    fontWeight: 600,
                    background: STATUS_CONFIG[app.status].bg,
                    color: STATUS_CONFIG[app.status].text,
                    display: 'flex', alignItems: 'center', gap: 5,
                  }}>
                    <span style={{ width: 5, height: 5, borderRadius: '50%', background: STATUS_CONFIG[app.status].dot }} />
                    {app.status}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Recommended Jobs */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.45, delay: 0.35 }}
            style={{ ...cardBase, padding: '20px 24px' }}
          >
            <div className="flex items-center justify-between mb-4">
              <h2 style={{ fontSize: 16, fontWeight: 700, color: '#f8fafc' }}>Recommended Jobs</h2>
              <button
                onClick={() => router.push('/seeker/opportunities')}
                style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, color: '#6c63ff', fontWeight: 600, background: 'none', border: 'none', cursor: 'pointer', padding: '4px 8px', borderRadius: 8, transition: 'all 0.2s' }}
                onMouseEnter={e => (e.currentTarget.style.background = 'rgba(108,99,255,0.1)')}
                onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
              >
                View All <ChevronRight size={14} />
              </button>
            </div>
            <div className="space-y-3">
              {RECOMMENDED_JOBS.map((job, i) => (
                <motion.div
                  key={job.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + i * 0.07 }}
                  style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid #1e1e2e', borderRadius: 12, padding: '14px 16px', transition: 'all 0.2s' }}
                  whileHover={{ borderColor: '#2d2d44', background: 'rgba(255,255,255,0.04)' }}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3 flex-1 min-w-0">
                      <div style={{ width: 40, height: 40, borderRadius: 10, background: job.color + '22', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, border: `1px solid ${job.color}44` }}>
                        <span style={{ fontSize: 12, fontWeight: 700, color: job.color }}>{job.initials}</span>
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 14, fontWeight: 700, color: '#f8fafc' }}>{job.title}</div>
                        <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 2, display: 'flex', alignItems: 'center', gap: 5 }}>
                          <span>{job.company}</span>
                          <span style={{ color: '#2d2d44' }}>•</span>
                          <MapPin size={10} />
                          <span>{job.location}</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 8, flexWrap: 'wrap' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 3, fontSize: 12, color: '#10b981', fontWeight: 600 }}>
                            <IndianRupee size={11} />
                            {job.salaryMin}–{job.salaryMax} LPA
                          </div>
                          {job.tags.map(tag => (
                            <span key={tag} style={{ fontSize: 10, color: '#94a3b8', background: 'rgba(255,255,255,0.06)', borderRadius: 6, padding: '2px 8px', border: '1px solid #1e1e2e' }}>{tag}</span>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2 flex-shrink-0">
                      <div style={{ background: 'rgba(16,185,129,0.15)', color: '#6ee7b7', fontSize: 11, fontWeight: 700, padding: '3px 8px', borderRadius: 8 }}>
                        <Target size={10} style={{ display: 'inline', marginRight: 3 }} />
                        {job.match}% match
                      </div>
                      <button
                        onClick={() => toast('Redirecting to application — coming soon!')}
                        style={{ fontSize: 12, fontWeight: 700, color: '#f8fafc', background: 'linear-gradient(135deg, #6c63ff, #4f46e5)', border: 'none', borderRadius: 10, padding: '7px 14px', cursor: 'pointer', transition: 'all 0.2s', whiteSpace: 'nowrap' }}
                        onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.04)'; e.currentTarget.style.boxShadow = '0 0 16px rgba(108,99,255,0.4)' }}
                        onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.boxShadow = 'none' }}
                      >
                        Apply Now
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* RIGHT COLUMN */}
        <div className="lg:col-span-2 space-y-5">

          {/* Profile Completion */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.45, delay: 0.3 }}
            style={{ ...cardBase, padding: '20px 22px' }}
          >
            <h2 style={{ fontSize: 15, fontWeight: 700, color: '#f8fafc', marginBottom: 16 }}>Profile Completion</h2>
            <div className="flex items-start gap-4">
              <CircularProgress percent={profilePercent} />
              <div style={{ flex: 1 }}>
                <div className="space-y-1.5">
                  {PROFILE_ITEMS.map((item) => (
                    <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      {item.done
                        ? <CheckCircle2 size={14} color="#10b981" style={{ flexShrink: 0 }} />
                        : <Circle size={14} color="#2d2d44" style={{ flexShrink: 0 }} />
                      }
                      <span style={{ fontSize: 12, color: item.done ? '#94a3b8' : '#f8fafc', textDecoration: item.done ? 'line-through' : 'none' }}>
                        {item.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <button
              onClick={() => router.push('/seeker/profile')}
              style={{ marginTop: 16, width: '100%', padding: '10px', borderRadius: 12, border: '1px solid rgba(108,99,255,0.4)', background: 'rgba(108,99,255,0.1)', color: '#a89dff', fontSize: 13, fontWeight: 700, cursor: 'pointer', transition: 'all 0.2s' }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(108,99,255,0.2)'; e.currentTarget.style.borderColor = '#6c63ff' }}
              onMouseLeave={e => { e.currentTarget.style.background = 'rgba(108,99,255,0.1)'; e.currentTarget.style.borderColor = 'rgba(108,99,255,0.4)' }}
            >
              Complete Profile →
            </button>
          </motion.div>

          {/* Upcoming Interviews */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.45, delay: 0.38 }}
            style={{ ...cardBase, padding: '20px 22px' }}
          >
            <h2 style={{ fontSize: 15, fontWeight: 700, color: '#f8fafc', marginBottom: 14 }}>Upcoming Interviews</h2>
            {INTERVIEWS.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '24px 0', color: '#94a3b8', fontSize: 13 }}>
                <Calendar size={28} style={{ margin: '0 auto 8px', opacity: 0.4 }} />
                No interviews scheduled
              </div>
            ) : (
              <div className="space-y-3">
                {INTERVIEWS.map((iv) => (
                  <div key={iv.id} style={{ background: 'rgba(6,182,212,0.06)', border: '1px solid rgba(6,182,212,0.2)', borderRadius: 12, padding: '12px 14px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 700, color: '#f8fafc' }}>{iv.role}</div>
                        <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 2 }}>{iv.company} · {iv.type}</div>
                      </div>
                      <div style={{ background: 'rgba(6,182,212,0.15)', color: '#67e8f9', fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 6, flexShrink: 0 }}>
                        {iv.date}
                      </div>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, color: '#94a3b8' }}>
                        <Clock size={11} /> {iv.time}
                      </div>
                      <button
                        onClick={() => toast('Opening meeting link — coming soon!')}
                        style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11, fontWeight: 700, color: '#f8fafc', background: 'linear-gradient(135deg, #06b6d4, #0891b2)', border: 'none', borderRadius: 8, padding: '5px 12px', cursor: 'pointer', transition: 'all 0.2s' }}
                        onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.04)'; e.currentTarget.style.boxShadow = '0 0 14px rgba(6,182,212,0.35)' }}
                        onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.boxShadow = 'none' }}
                      >
                        <Video size={11} /> Join
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>

          {/* AI Tip of the Day */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.45, delay: 0.46 }}
            style={{
              borderRadius: 16,
              padding: '18px 20px',
              background: 'linear-gradient(135deg, rgba(108,99,255,0.25) 0%, rgba(79,70,229,0.2) 50%, rgba(6,182,212,0.1) 100%)',
              border: '1px solid rgba(108,99,255,0.35)',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <div style={{ position: 'absolute', top: -30, right: -30, width: 100, height: 100, background: 'rgba(108,99,255,0.15)', borderRadius: '50%', filter: 'blur(30px)' }} />
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10, position: 'relative' }}>
              <div style={{ width: 28, height: 28, borderRadius: 8, background: 'rgba(108,99,255,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Sparkles size={14} color="#a89dff" />
              </div>
              <span style={{ fontSize: 11, fontWeight: 700, color: '#a89dff', letterSpacing: '0.05em', textTransform: 'uppercase' }}>AI Career Tip</span>
            </div>
            <p style={{ fontSize: 13, color: '#e2e8f0', lineHeight: 1.6, position: 'relative' }}>
              Tailor your resume to each job description by mirroring the exact keywords from the posting — ATS systems at companies like Infosys and TCS scan for keyword density before a human ever reads your application.
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 10, fontSize: 11, color: '#94a3b8', position: 'relative' }}>
              <Zap size={10} color="#f59e0b" /> Powered by LYU AI
            </div>
          </motion.div>

        </div>
      </div>

      {/* ── Activity Feed ─────────────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, delay: 0.5 }}
        style={{ ...cardBase, padding: '20px 24px' }}
      >
        <div className="flex items-center justify-between mb-5">
          <h2 style={{ fontSize: 16, fontWeight: 700, color: '#f8fafc', display: 'flex', alignItems: 'center', gap: 8 }}>
            <Bell size={16} color="#6c63ff" /> Recent Activity
          </h2>
          <span style={{ fontSize: 11, color: '#94a3b8' }}>Last 7 days</span>
        </div>
        <div style={{ position: 'relative' }}>
          <div style={{ position: 'absolute', left: 17, top: 8, bottom: 8, width: 1, background: 'linear-gradient(to bottom, #1e1e2e, transparent)' }} />
          <div className="space-y-4">
            {ACTIVITY.map((item, i) => {
              const cfg = ACTIVITY_ICON_CONFIG[item.icon]
              const Icon = cfg.Icon
              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.55 + i * 0.06 }}
                  style={{ display: 'flex', alignItems: 'center', gap: 14 }}
                >
                  <div style={{ width: 34, height: 34, borderRadius: 10, background: cfg.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, border: `1px solid ${cfg.color}33`, zIndex: 1, position: 'relative' }}>
                    <Icon size={14} color={cfg.color} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontSize: 13, color: '#e2e8f0', lineHeight: 1.4 }}>{item.text}</p>
                  </div>
                  <div style={{ fontSize: 11, color: '#94a3b8', flexShrink: 0, display: 'flex', alignItems: 'center', gap: 3 }}>
                    <Clock size={10} /> {item.time}
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>
      </motion.div>

    </div>
  )
}
