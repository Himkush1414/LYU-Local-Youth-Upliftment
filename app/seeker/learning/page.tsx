'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Sparkles, BookOpen, Play, CheckCircle, Circle, Clock, Star,
  TrendingUp, Zap, ExternalLink, ChevronDown, ChevronUp, X,
  Youtube, Globe, BookMarked, PenTool, DollarSign, Award,
  BarChart2, Loader2, Send, RotateCcw, Lock, Unlock
} from 'lucide-react'
import { toast } from 'sonner'

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

type BadgeType = 'YouTube' | 'Course' | 'Book' | 'Practice' | 'Mock Test'
type PricingType = 'FREE' | 'PAID' | 'FREEMIUM'

interface Resource {
  id: string
  title: string
  provider: string
  type: BadgeType
  pricing: PricingType
  duration: string
  rating: number
  url: string
  description: string
  completed: boolean
}

interface Phase {
  id: string
  title: string
  duration: string
  description: string
  resources: Resource[]
  expanded: boolean
}

interface LearningPath {
  title: string
  totalDuration: string
  salaryImpact: string
  skillsGained: string[]
  phases: Phase[]
  overview: string
}

const QUICK_PATHS = [
  { label: 'React Developer', icon: '⚛️', color: C.cyan },
  { label: 'Data Science', icon: '📊', color: C.purple },
  { label: 'Cloud/DevOps', icon: '☁️', color: C.amber },
  { label: 'UPSC', icon: '🏛️', color: C.green },
  { label: 'SSC CGL', icon: '📋', color: C.amber },
  { label: 'Banking PO', icon: '🏦', color: C.cyan },
  { label: 'Product Manager', icon: '🚀', color: C.purple },
  { label: 'Full Stack Dev', icon: '💻', color: C.green },
]

const SYSTEM_PROMPT = `You are an expert Indian career counselor and learning path curator. When given a job description or career goal, generate a detailed, structured learning path specifically tailored for Indian job seekers.

Your response MUST be valid JSON in this exact structure:
{
  "title": "Learning Path title",
  "totalDuration": "X months",
  "salaryImpact": "₹X LPA - ₹Y LPA",
  "skillsGained": ["skill1", "skill2", "skill3", "skill4", "skill5"],
  "overview": "2-3 sentence overview of the learning path",
  "phases": [
    {
      "id": "phase-1",
      "title": "Phase title",
      "duration": "X weeks",
      "description": "What this phase covers",
      "resources": [
        {
          "id": "r-1",
          "title": "Resource title",
          "provider": "Provider name",
          "type": "YouTube|Course|Book|Practice|Mock Test",
          "pricing": "FREE|PAID|FREEMIUM",
          "duration": "X hours",
          "rating": 4.5,
          "url": "https://actual-url.com",
          "description": "Brief description of what this resource covers"
        }
      ]
    }
  ]
}

RULES:
- Include 3-4 phases with 3-5 resources each
- Use REAL resources: YouTube channels (Hitesh Choudhary, Krish Naik, Apna College, CodeWithHarry, Physics Wallah, Unacademy, Striver), courses (Coursera, Udemy, Internshala, NPTEL, Testbook, PW Skills), books (standard textbooks)
- For government exams (UPSC, SSC, Banking): include standard books like Laxmikant, M. Laxmikant, NCERT, Manorama, Lucent, Arihant, previous year papers
- Use actual working URLs where possible
- salaryImpact should be realistic Indian salary range in LPA
- rating should be between 3.8 and 5.0
- Return ONLY the JSON object, no markdown, no explanation`

function StarRating({ rating }: { rating: number }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
      {[1,2,3,4,5].map(i => (
        <Star
          key={i}
          size={11}
          fill={i <= Math.round(rating) ? C.amber : 'transparent'}
          color={i <= Math.round(rating) ? C.amber : C.muted}
        />
      ))}
      <span style={{ fontSize: '11px', color: C.sub, marginLeft: '2px' }}>{rating.toFixed(1)}</span>
    </div>
  )
}

function TypeBadge({ type }: { type: BadgeType }) {
  const config: Record<BadgeType, { color: string; icon: React.ReactNode }> = {
    YouTube: { color: '#ef4444', icon: <Youtube size={10} /> },
    Course: { color: C.purple, icon: <Globe size={10} /> },
    Book: { color: C.amber, icon: <BookMarked size={10} /> },
    Practice: { color: C.green, icon: <PenTool size={10} /> },
    'Mock Test': { color: C.cyan, icon: <Award size={10} /> },
  }
  const { color, icon } = config[type]
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: '3px',
      padding: '2px 7px', borderRadius: '20px', fontSize: '10px', fontWeight: 600,
      background: `${color}20`, color, border: `1px solid ${color}40`,
    }}>
      {icon}{type}
    </span>
  )
}

function PricingBadge({ pricing }: { pricing: PricingType }) {
  const config: Record<PricingType, { color: string; label: string }> = {
    FREE: { color: C.green, label: 'FREE' },
    PAID: { color: C.amber, label: 'PAID' },
    FREEMIUM: { color: C.cyan, label: 'FREEMIUM' },
  }
  const { color, label } = config[pricing]
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center',
      padding: '2px 7px', borderRadius: '20px', fontSize: '10px', fontWeight: 700,
      background: `${color}18`, color, border: `1px solid ${color}35`,
    }}>
      {label}
    </span>
  )
}

export default function LearningPage() {
  const [vw, setVw] = useState(1280)
  useEffect(() => {
    const update = () => setVw(window.innerWidth)
    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [])
  const isMobile = vw < 640
  const isTablet = vw >= 640 && vw < 1100

  const [jdInput, setJdInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [path, setPath] = useState<LearningPath | null>(null)
  const [phases, setPhases] = useState<Phase[]>([])
  const [completedIds, setCompletedIds] = useState<Set<string>>(new Set())
  const [hoveredCard, setHoveredCard] = useState<string | null>(null)
  const [hoveredQuick, setHoveredQuick] = useState<string | null>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const pad = isMobile ? '14px' : isTablet ? '20px 22px' : '22px 26px'

  const totalResources = phases.reduce((a, p) => a + p.resources.length, 0)
  const completedCount = completedIds.size
  const progressPct = totalResources > 0 ? Math.round((completedCount / totalResources) * 100) : 0

  function toggleResource(id: string) {
    setCompletedIds(prev => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  function togglePhase(id: string) {
    setPhases(prev => prev.map(p => p.id === id ? { ...p, expanded: !p.expanded } : p))
  }

  async function generatePath(prompt: string) {
    if (!prompt.trim()) { toast.error('Please enter a job description or career goal'); return }
    setLoading(true)
    setPath(null)
    setPhases([])
    setCompletedIds(new Set())
    try {
      const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.NEXT_PUBLIC_GROQ_API_KEY}`,
        },
        body: JSON.stringify({
          model: 'llama-3.3-70b-versatile',
          max_tokens: 4000,
          messages: [
            { role: 'system', content: SYSTEM_PROMPT },
            { role: 'user', content: `Generate a learning path for: ${prompt}` },
          ],
        }),
      })
      const data = await res.json()
      const raw = data.choices?.[0]?.message?.content || ''
      const cleaned = raw.replace(/```json|```/g, '').trim()
      const parsed: LearningPath = JSON.parse(cleaned)
      const phasesWithState = parsed.phases.map(p => ({
        ...p,
        expanded: true,
        resources: p.resources.map(r => ({ ...r, completed: false })),
      }))
      setPath(parsed)
      setPhases(phasesWithState)
      toast.success('Learning path generated!')
    } catch {
      toast.error('Failed to generate path. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  function handleQuickPath(label: string) {
    setJdInput(label)
    generatePath(label)
  }

  return (
    <div style={{ minHeight: '100%', background: C.bg, padding: pad, fontFamily: 'system-ui, sans-serif' }}>

      {/* Header */}
      <div style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
          <div style={{
            width: '36px', height: '36px', borderRadius: '10px',
            background: C.purpleDim, border: `1px solid ${C.purple}40`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <BookOpen size={18} color={C.purple} />
          </div>
          <div>
            <h1 style={{ margin: 0, fontSize: isMobile ? '18px' : '22px', fontWeight: 700, color: C.text }}>
              Learning Path
            </h1>
            <p style={{ margin: 0, fontSize: '12px', color: C.sub }}>AI-curated roadmap from JD to job-ready</p>
          </div>
        </div>
      </div>

      {/* Input Section */}
      <div style={{
        background: C.card, border: `1px solid ${C.border}`, borderRadius: C.r,
        padding: isMobile ? '16px' : '20px', marginBottom: '20px',
      }}>
        <p style={{ margin: '0 0 12px', fontSize: '13px', fontWeight: 600, color: C.text }}>
          Paste a Job Description or describe your goal
        </p>
        <div style={{ position: 'relative' }}>
          <textarea
            ref={textareaRef}
            value={jdInput}
            onChange={e => setJdInput(e.target.value)}
            placeholder="e.g. We are looking for a React Developer with 2+ years of experience in TypeScript, Redux, and REST APIs..."
            rows={isMobile ? 4 : 5}
            style={{
              width: '100%', background: C.bg, border: `1px solid ${C.border}`,
              borderRadius: C.rSm, padding: '12px 44px 12px 14px',
              color: C.text, fontSize: '13px', resize: 'vertical',
              fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box',
              lineHeight: 1.6,
            }}
            onKeyDown={e => { if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) generatePath(jdInput) }}
          />
          <button
            onClick={() => generatePath(jdInput)}
            disabled={loading}
            style={{
              position: 'absolute', bottom: '10px', right: '10px',
              width: '32px', height: '32px', borderRadius: '8px',
              background: loading ? C.muted : C.purple, border: 'none',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: loading ? 'default' : 'pointer', transition: 'all 0.2s',
            }}
          >
            {loading ? <Loader2 size={14} color={C.text} style={{ animation: 'spin 1s linear infinite' }} /> : <Send size={14} color={C.text} />}
          </button>
        </div>
        <p style={{ margin: '8px 0 0', fontSize: '11px', color: C.muted }}>⌘+Enter to generate</p>

        {/* Quick Path Buttons */}
        <div style={{ marginTop: '16px' }}>
          <p style={{ margin: '0 0 10px', fontSize: '11px', color: C.muted, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Quick Paths</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {QUICK_PATHS.map(qp => (
              <motion.button
                key={qp.label}
                onClick={() => handleQuickPath(qp.label)}
                onHoverStart={() => setHoveredQuick(qp.label)}
                onHoverEnd={() => setHoveredQuick(null)}
                whileTap={{ scale: 0.95 }}
                style={{
                  padding: '6px 12px', borderRadius: '20px', border: `1px solid ${hoveredQuick === qp.label ? qp.color : C.border}`,
                  background: hoveredQuick === qp.label ? `${qp.color}18` : C.bg,
                  color: hoveredQuick === qp.label ? qp.color : C.sub,
                  fontSize: '12px', cursor: 'pointer', transition: 'all 0.2s',
                  display: 'flex', alignItems: 'center', gap: '5px',
                }}
              >
                <span>{qp.icon}</span>{qp.label}
              </motion.button>
            ))}
          </div>
        </div>
      </div>

      {/* Loading State */}
      <AnimatePresence>
        {loading && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            style={{
              background: C.card, border: `1px solid ${C.purple}40`, borderRadius: C.r,
              padding: '32px', textAlign: 'center', marginBottom: '20px',
            }}
          >
            <div style={{
              width: '48px', height: '48px', borderRadius: '50%',
              background: C.purpleDim, border: `1px solid ${C.purple}50`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 16px',
            }}>
              <Sparkles size={22} color={C.purple} style={{ animation: 'pulse 1.5s ease-in-out infinite' }} />
            </div>
            <p style={{ margin: '0 0 6px', fontSize: '15px', fontWeight: 600, color: C.text }}>
              Curating your learning path…
            </p>
            <p style={{ margin: 0, fontSize: '13px', color: C.sub }}>
              Finding the best Indian resources for your goal
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '6px', marginTop: '16px' }}>
              {[0,1,2].map(i => (
                <div key={i} style={{
                  width: '8px', height: '8px', borderRadius: '50%', background: C.purple,
                  animation: `bounce 1s ease-in-out ${i * 0.2}s infinite`,
                }} />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Path Results */}
      <AnimatePresence>
        {path && phases.length > 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}>

            {/* Path Header Stats */}
            <div style={{
              background: C.card, border: `1px solid ${C.border}`, borderRadius: C.r,
              padding: isMobile ? '16px' : '20px', marginBottom: '16px',
            }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
                <div style={{ flex: 1, minWidth: '200px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                    <Zap size={16} color={C.purple} />
                    <h2 style={{ margin: 0, fontSize: isMobile ? '15px' : '17px', fontWeight: 700, color: C.text }}>{path.title}</h2>
                  </div>
                  <p style={{ margin: '0 0 14px', fontSize: '13px', color: C.sub, lineHeight: 1.6 }}>{path.overview}</p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                    {path.skillsGained.map(s => (
                      <span key={s} style={{
                        padding: '3px 10px', borderRadius: '20px', fontSize: '11px',
                        background: C.purpleDim, color: C.purple, border: `1px solid ${C.purple}30`,
                      }}>{s}</span>
                    ))}
                  </div>
                </div>
                <div style={{ display: 'flex', gap: isMobile ? '10px' : '14px', flexWrap: 'wrap' }}>
                  {[
                    { icon: <Clock size={14} color={C.cyan} />, label: 'Duration', value: path.totalDuration, color: C.cyan },
                    { icon: <TrendingUp size={14} color={C.green} />, label: 'Salary Range', value: path.salaryImpact, color: C.green },
                    { icon: <BarChart2 size={14} color={C.amber} />, label: 'Resources', value: `${totalResources} items`, color: C.amber },
                  ].map(stat => (
                    <div key={stat.label} style={{
                      background: C.bg, border: `1px solid ${C.border}`, borderRadius: C.rSm,
                      padding: '10px 14px', textAlign: 'center', minWidth: '90px',
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '4px' }}>{stat.icon}</div>
                      <div style={{ fontSize: '13px', fontWeight: 700, color: stat.color }}>{stat.value}</div>
                      <div style={{ fontSize: '10px', color: C.muted }}>{stat.label}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Progress Bar */}
              {totalResources > 0 && (
                <div style={{ marginTop: '16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                    <span style={{ fontSize: '12px', color: C.sub }}>Progress</span>
                    <span style={{ fontSize: '12px', fontWeight: 600, color: progressPct === 100 ? C.green : C.purple }}>
                      {completedCount}/{totalResources} ({progressPct}%)
                    </span>
                  </div>
                  <div style={{ height: '6px', background: C.border, borderRadius: '99px', overflow: 'hidden' }}>
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${progressPct}%` }}
                      transition={{ duration: 0.5, ease: 'easeOut' }}
                      style={{ height: '100%', background: progressPct === 100 ? C.green : C.purple, borderRadius: '99px' }}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Phases */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {phases.map((phase, phaseIdx) => {
                const phaseCompleted = phase.resources.filter(r => completedIds.has(r.id)).length
                const phaseTotal = phase.resources.length
                const phasePct = phaseTotal > 0 ? Math.round((phaseCompleted / phaseTotal) * 100) : 0

                return (
                  <motion.div
                    key={phase.id}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: phaseIdx * 0.08 }}
                    style={{
                      background: C.card, border: `1px solid ${C.border}`, borderRadius: C.r, overflow: 'hidden',
                    }}
                  >
                    {/* Phase Header */}
                    <button
                      onClick={() => togglePhase(phase.id)}
                      style={{
                        width: '100%', padding: isMobile ? '14px' : '16px 20px',
                        background: 'transparent', border: 'none', cursor: 'pointer',
                        display: 'flex', alignItems: 'center', gap: '12px', textAlign: 'left',
                      }}
                    >
                      <div style={{
                        width: '32px', height: '32px', borderRadius: '8px',
                        background: C.purpleDim, border: `1px solid ${C.purple}40`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '13px', fontWeight: 700, color: C.purple, flexShrink: 0,
                      }}>
                        {phaseIdx + 1}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                          <span style={{ fontSize: '14px', fontWeight: 600, color: C.text }}>{phase.title}</span>
                          <span style={{ fontSize: '11px', color: C.muted, background: C.bg, padding: '2px 8px', borderRadius: '20px', border: `1px solid ${C.border}` }}>
                            {phase.duration}
                          </span>
                          {phasePct === 100 && (
                            <span style={{ fontSize: '11px', color: C.green, background: C.greenDim, padding: '2px 8px', borderRadius: '20px' }}>
                              ✓ Complete
                            </span>
                          )}
                        </div>
                        <p style={{ margin: '2px 0 0', fontSize: '12px', color: C.sub }}>{phase.description}</p>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0 }}>
                        <span style={{ fontSize: '11px', color: phasePct === 100 ? C.green : C.sub }}>
                          {phaseCompleted}/{phaseTotal}
                        </span>
                        {phase.expanded ? <ChevronUp size={16} color={C.muted} /> : <ChevronDown size={16} color={C.muted} />}
                      </div>
                    </button>

                    {/* Resources */}
                    <AnimatePresence>
                      {phase.expanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.25 }}
                          style={{ overflow: 'hidden' }}
                        >
                          <div style={{
                            borderTop: `1px solid ${C.border}`,
                            display: 'grid',
                            gridTemplateColumns: !isMobile && !isTablet ? '1fr 1fr' : '1fr',
                            gap: '1px', background: C.border,
                          }}>
                            {phase.resources.map((res) => {
                              const done = completedIds.has(res.id)
                              const hov = hoveredCard === res.id

                              return (
                                <div
                                  key={res.id}
                                  onMouseEnter={() => setHoveredCard(res.id)}
                                  onMouseLeave={() => setHoveredCard(null)}
                                  style={{
                                    background: hov ? C.cardHov : C.card,
                                    padding: isMobile ? '14px' : '16px 18px',
                                    transition: 'background 0.2s',
                                    position: 'relative',
                                  }}
                                >
                                  {/* Completion toggle */}
                                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                                    <button
                                      onClick={() => toggleResource(res.id)}
                                      style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '2px 0', flexShrink: 0, marginTop: '1px' }}
                                    >
                                      {done
                                        ? <CheckCircle size={18} color={C.green} fill={C.green} />
                                        : <Circle size={18} color={C.muted} />
                                      }
                                    </button>
                                    <div style={{ flex: 1, minWidth: 0 }}>
                                      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '8px', marginBottom: '6px' }}>
                                        <span style={{
                                          fontSize: '13px', fontWeight: 600,
                                          color: done ? C.muted : C.text,
                                          textDecoration: done ? 'line-through' : 'none',
                                          lineHeight: 1.4,
                                        }}>
                                          {res.title}
                                        </span>
                                        <a
                                          href={res.url}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          style={{
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            width: '26px', height: '26px', borderRadius: '6px',
                                            background: hov ? C.purpleDim : 'transparent',
                                            border: `1px solid ${hov ? C.purple + '40' : 'transparent'}`,
                                            color: hov ? C.purple : C.muted,
                                            transition: 'all 0.2s', flexShrink: 0,
                                          }}
                                        >
                                          <ExternalLink size={12} />
                                        </a>
                                      </div>
                                      <p style={{ margin: '0 0 8px', fontSize: '11px', color: C.sub, lineHeight: 1.5 }}>
                                        {res.description}
                                      </p>
                                      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '6px' }}>
                                        <TypeBadge type={res.type} />
                                        <PricingBadge pricing={res.pricing} />
                                        <span style={{ fontSize: '11px', color: C.muted, display: 'flex', alignItems: 'center', gap: '3px' }}>
                                          <Clock size={10} color={C.muted} />{res.duration}
                                        </span>
                                        <span style={{ fontSize: '11px', color: C.sub }}>{res.provider}</span>
                                        <StarRating rating={res.rating} />
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              )
                            })}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                )
              })}
            </div>

            {/* Reset */}
            <div style={{ textAlign: 'center', marginTop: '24px', paddingBottom: '8px' }}>
              <button
                onClick={() => { setPath(null); setPhases([]); setJdInput(''); setCompletedIds(new Set()) }}
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: '6px',
                  padding: '8px 18px', borderRadius: '8px',
                  background: C.bg, border: `1px solid ${C.border}`,
                  color: C.sub, fontSize: '13px', cursor: 'pointer',
                }}
              >
                <RotateCcw size={13} /> Generate New Path
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Empty State */}
      {!path && !loading && (
        <div style={{
          textAlign: 'center', padding: isMobile ? '40px 20px' : '60px 40px',
          background: C.card, border: `1px solid ${C.border}`, borderRadius: C.r,
        }}>
          <div style={{
            width: '64px', height: '64px', borderRadius: '16px',
            background: C.purpleDim, border: `1px solid ${C.purple}30`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 16px',
          }}>
            <BookOpen size={28} color={C.purple} />
          </div>
          <h3 style={{ margin: '0 0 8px', fontSize: '17px', fontWeight: 700, color: C.text }}>
            Your AI Learning Path
          </h3>
          <p style={{ margin: '0 0 20px', fontSize: '13px', color: C.sub, maxWidth: '380px', margin: '0 auto 20px', lineHeight: 1.6 }}>
            Paste any job description or pick a quick path above. Claude will curate the best Indian resources — YouTube channels, courses, books, and practice tests — tailored to your goal.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', flexWrap: 'wrap' }}>
            {[
              { icon: <Youtube size={14} color={C.red} />, label: 'Real YouTube Channels' },
              { icon: <Globe size={14} color={C.purple} />, label: 'Top Course Platforms' },
              { icon: <BookMarked size={14} color={C.amber} />, label: 'Standard Books' },
              { icon: <Award size={14} color={C.cyan} />, label: 'Mock Tests' },
            ].map(f => (
              <div key={f.label} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: C.sub }}>
                {f.icon}{f.label}
              </div>
            ))}
          </div>
        </div>
      )}

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes pulse { 0%,100% { opacity: 1; } 50% { opacity: 0.5; } }
        @keyframes bounce { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-6px); } }
        textarea:focus { border-color: ${C.purple} !important; box-shadow: 0 0 0 3px ${C.purpleDim}; }
        textarea::placeholder { color: ${C.muted}; }
        ::-webkit-scrollbar { width: 5px; } ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: ${C.border}; border-radius: 99px; }
      `}</style>
    </div>
  )
}
