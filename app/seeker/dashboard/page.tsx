'use client'

import { useEffect, useState, useRef } from 'react'
import { motion, useInView, animate } from 'framer-motion'
import {
  Briefcase, Calendar, Eye, Bookmark, Sparkles,
  ArrowUpRight, ArrowDownRight, ChevronRight, MapPin,
  CheckCircle2, Circle, Zap, FileText, MessageSquare,
  Send, Heart, TrendingUp,
} from 'lucide-react'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

// ── Design tokens ─────────────────────────────────────────────────────────────
const C = {
  bg:        '#0a0a0f',
  card:      '#111118',
  cardHov:   '#14141c',
  border:    '#1e1e2e',
  borderHov: '#2d2d44',
  purple:    '#6c63ff',
  purpleDim: 'rgba(108,99,255,0.12)',
  cyan:      '#06b6d4',
  cyanDim:   'rgba(6,182,212,0.12)',
  green:     '#10b981',
  greenDim:  'rgba(16,185,129,0.12)',
  amber:     '#f59e0b',
  amberDim:  'rgba(245,158,11,0.12)',
  red:       '#ef4444',
  redDim:    'rgba(239,68,68,0.12)',
  text:      '#f8fafc',
  sub:       '#94a3b8',
  muted:     '#475569',
  r:         '14px',
  rSm:       '10px',
}

// ── Static data ───────────────────────────────────────────────────────────────
const APPS = [
  { id:'1', company:'Razorpay',  role:'Frontend Engineer',    loc:'Bangalore', date:'2d ago', status:'In Review' as const, init:'RZ', color:'#0ea5e9' },
  { id:'2', company:'Swiggy',    role:'Software Engineer II', loc:'Bangalore', date:'4d ago', status:'Interview' as const, init:'SW', color:'#f97316' },
  { id:'3', company:'CRED',      role:'Product Engineer',     loc:'Bangalore', date:'1w ago', status:'Applied'   as const, init:'CR', color:'#8b5cf6' },
  { id:'4', company:'PhonePe',   role:'React Developer',      loc:'Pune',      date:'1w ago', status:'Rejected'  as const, init:'PP', color:'#6366f1' },
  { id:'5', company:'Zepto',     role:'Full Stack Developer', loc:'Mumbai',    date:'2w ago', status:'Offer'     as const, init:'ZP', color:'#10b981' },
]

const JOBS = [
  { id:'1', title:'Senior React Developer', co:'Groww',  loc:'Bangalore', sal:'18–25 LPA', match:96, tags:['React','TypeScript','Redux'], init:'GR', color:'#10b981' },
  { id:'2', title:'Product Engineer',       co:'Meesho', loc:'Bangalore', sal:'15–22 LPA', match:89, tags:['Node.js','React','AWS'],     init:'MS', color:'#f43f5e' },
  { id:'3', title:'Frontend Engineer',      co:'Zomato', loc:'Gurugram',  sal:'12–18 LPA', match:83, tags:['Vue.js','Python','Docker'],  init:'ZM', color:'#ef4444' },
]

const INTERVIEWS = [
  { id:'1', co:'Swiggy',   role:'Software Engineer II', date:'Tomorrow', time:'11:00 AM', type:'Video Call' },
  { id:'2', co:'Razorpay', role:'Frontend Engineer',    date:'Jun 10',   time:'3:00 PM',  type:'Tech Round' },
]

const ACTIVITY = [
  { id:'1', icon:Calendar,      color:C.cyan,    text:'Interview scheduled with Swiggy',         time:'1h ago' },
  { id:'2', icon:MessageSquare, color:C.purple,  text:'New message from Razorpay HR',             time:'3h ago' },
  { id:'3', icon:Send,          color:C.green,   text:'Applied to Product Engineer at CRED',      time:'Yesterday' },
  { id:'4', icon:Heart,         color:C.amber,   text:'Saved Senior Frontend role at Flipkart',   time:'Yesterday' },
  { id:'5', icon:Eye,           color:'#a855f7', text:'Recruiter from Zepto viewed your profile', time:'2d ago' },
]

const PROFILE_ITEMS = [
  { label:'Profile photo',     done:true  },
  { label:'Work experience',   done:true  },
  { label:'Education details', done:true  },
  { label:'Skills & tools',    done:false },
  { label:'Resume uploaded',   done:false },
  { label:'LinkedIn profile',  done:false },
]

const STATUS_STYLE: Record<string, { color:string; bg:string }> = {
  'Applied':   { color:'#60a5fa', bg:'rgba(96,165,250,0.12)' },
  'In Review': { color:C.amber,   bg:C.amberDim },
  'Interview': { color:C.cyan,    bg:C.cyanDim  },
  'Rejected':  { color:C.red,     bg:C.redDim   },
  'Offer':     { color:C.green,   bg:C.greenDim },
}

// ── Sub-components ────────────────────────────────────────────────────────────
function CountUp({ to }: { to:number }) {
  const ref = useRef<HTMLSpanElement>(null)
  const inV = useInView(ref, { once:true })
  useEffect(() => {
    if (!inV || !ref.current) return
    const ctrl = animate(0, to, {
      duration: 1.4,
      ease: 'easeOut',
      onUpdate: v => { if (ref.current) ref.current.textContent = Math.round(v).toString() },
    })
    return ctrl.stop
  }, [inV, to])
  return <span ref={ref}>0</span>
}

function Card({ children, style={}, onClick }: {
  children: React.ReactNode
  style?: React.CSSProperties
  onClick?: () => void
}) {
  const [h, setH] = useState(false)
  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setH(true)}
      onMouseLeave={() => setH(false)}
      style={{
        background: C.card,
        border: `1px solid ${h ? C.borderHov : C.border}`,
        borderRadius: C.r,
        transition: 'border-color 0.2s, background 0.2s',
        cursor: onClick ? 'pointer' : 'default',
        ...style,
      }}
    >
      {children}
    </div>
  )
}

function SectionHead({ title, action, onAct }: { title:string; action?:string; onAct?:()=>void }) {
  return (
    <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'16px' }}>
      <h2 style={{ fontSize:'14px', fontWeight:700, color:C.text, margin:0 }}>{title}</h2>
      {action && (
        <button onClick={onAct} style={{
          background:'none', border:'none', cursor:'pointer',
          color:C.purple, fontSize:'12px', fontWeight:600,
          display:'flex', alignItems:'center', gap:'2px', padding:0,
        }}>
          {action}<ChevronRight size={13}/>
        </button>
      )}
    </div>
  )
}

function RadialProgress({ pct }: { pct:number }) {
  const r = 42, circ = 2 * Math.PI * r
  const dash = (pct / 100) * circ
  return (
    <svg width="100" height="100" viewBox="0 0 100 100">
      <circle cx="50" cy="50" r={r} fill="none" stroke={C.border} strokeWidth="6"/>
      <motion.circle
        cx="50" cy="50" r={r} fill="none"
        stroke={C.purple} strokeWidth="6" strokeLinecap="round"
        strokeDashoffset={circ / 4}
        initial={{ strokeDasharray:`0 ${circ}` }}
        animate={{ strokeDasharray:`${dash} ${circ - dash}` }}
        transition={{ duration:1.3, ease:'easeOut' }}
      />
      <text x="50" y="53" textAnchor="middle" dominantBaseline="middle"
        fill={C.text} fontSize="16" fontWeight="700">{pct}%</text>
    </svg>
  )
}

// ── Page ──────────────────────────────────────────────────────────────────────
interface Profile { full_name:string|null; avatar_url:string|null }

export default function DashboardPage() {
  const router = useRouter()
  const [profile, setProfile] = useState<Profile>({ full_name:null, avatar_url:null })
  const [loading, setLoading] = useState(true)
  const [vw, setVw] = useState(1280)

  useEffect(() => {
    const upd = () => setVw(window.innerWidth)
    upd()
    window.addEventListener('resize', upd)
    return () => window.removeEventListener('resize', upd)
  }, [])

  const isMobile = vw < 640
  const isTablet = vw >= 640 && vw < 1100

  const hour = new Date().getHours()
  const greet = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'
  const name  = profile.full_name?.split(' ')[0] || 'there'
  const today = new Date().toLocaleDateString('en-IN', { weekday:'long', month:'long', day:'numeric', year:'numeric' })
  const doneCnt = PROFILE_ITEMS.filter(x => x.done).length
  const pct = Math.round((doneCnt / PROFILE_ITEMS.length) * 100)

  const STATS = [
    { label:'Jobs Applied',  val:24,  trend:12,  Icon:Briefcase, color:C.purple, dim:C.purpleDim },
    { label:'Interviews',    val:3,   trend:50,  Icon:Calendar,  color:C.cyan,   dim:C.cyanDim   },
    { label:'Profile Views', val:187, trend:23,  Icon:Eye,       color:C.green,  dim:C.greenDim  },
    { label:'Saved Jobs',    val:12,  trend:-5,  Icon:Bookmark,  color:C.amber,  dim:C.amberDim  },
  ]

  useEffect(() => {
    ;(async () => {
      try {
        const sb = createClient()
        const { data:{ user } } = await sb.auth.getUser()
        if (user) {
          const { data } = await sb.from('profiles').select('full_name,avatar_url').eq('id', user.id).single()
          if (data) setProfile(data)
        }
      } catch { /* silent */ } finally { setLoading(false) }
    })()
  }, [])

  if (loading) return (
    <div style={{ padding:'24px', background:C.bg, minHeight:'100%' }}>
      {[80,80,200,200].map((h,i) => (
        <div key={i} style={{ height:`${h}px`, borderRadius:C.r, background:C.card, marginBottom:'16px', animation:'pulse 1.5s ease-in-out infinite', animationDelay:`${i*0.1}s` }}/>
      ))}
      <style>{`@keyframes pulse{0%,100%{opacity:1}50%{opacity:0.4}}`}</style>
    </div>
  )

  const p = isMobile ? '14px' : isTablet ? '20px 22px' : '26px 30px'
  const g = isMobile ? '12px' : '18px'

  return (
    <div style={{ padding:p, background:C.bg, minHeight:'100%' }}>

      {/* ── Welcome banner ── */}
      <motion.div
        initial={{ opacity:0, y:-12 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.35 }}
        style={{
          borderRadius:C.r, padding: isMobile ? '18px' : '24px 28px',
          marginBottom:g,
          background:'linear-gradient(135deg,rgba(108,99,255,0.13) 0%,rgba(6,182,212,0.06) 100%)',
          border:`1px solid ${C.border}`,
        }}
      >
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:'14px' }}>
          <div>
            <h1 style={{ fontSize: isMobile ? '19px' : '22px', fontWeight:800, color:C.text, margin:'0 0 5px', letterSpacing:'-0.02em' }}>
              {greet}, {name}! 👋
            </h1>
            <p style={{ fontSize:'13px', color:C.sub, margin:'0 0 3px' }}>Here's what's happening with your job search today.</p>
            <p style={{ fontSize:'11.5px', color:C.muted, margin:0 }}>{today}</p>
          </div>
          {!isMobile && (
            <div style={{ display:'flex', gap:'8px' }}>
              <button
                onClick={() => router.push('/seeker/opportunities')}
                style={{ padding:'9px 18px', borderRadius:C.rSm, background:C.purple, border:'none', color:'#fff', fontSize:'12.5px', fontWeight:600, cursor:'pointer', display:'flex', alignItems:'center', gap:'5px' }}
              >
                <Zap size={13}/> Browse Jobs
              </button>
              <button
                onClick={() => router.push('/seeker/resume')}
                style={{ padding:'9px 18px', borderRadius:C.rSm, background:'transparent', border:`1px solid ${C.border}`, color:C.sub, fontSize:'12.5px', fontWeight:600, cursor:'pointer', display:'flex', alignItems:'center', gap:'5px' }}
              >
                <FileText size={13}/> Resume
              </button>
            </div>
          )}
          {isMobile && (
            <div style={{ display:'flex', gap:'8px', width:'100%' }}>
              <button onClick={() => router.push('/seeker/opportunities')} style={{ flex:1, padding:'9px', borderRadius:C.rSm, background:C.purple, border:'none', color:'#fff', fontSize:'12px', fontWeight:600, cursor:'pointer' }}>
                Browse Jobs
              </button>
              <button onClick={() => router.push('/seeker/resume')} style={{ flex:1, padding:'9px', borderRadius:C.rSm, background:'transparent', border:`1px solid ${C.border}`, color:C.sub, fontSize:'12px', fontWeight:600, cursor:'pointer' }}>
                Resume
              </button>
            </div>
          )}
        </div>
      </motion.div>

      {/* ── Stats grid ── */}
      <div style={{ display:'grid', gridTemplateColumns: isMobile ? '1fr 1fr' : 'repeat(4,1fr)', gap: isMobile ? '10px' : '14px', marginBottom:g }}>
        {STATS.map(({ label, val, trend, Icon, color, dim }, i) => (
          <motion.div key={label} initial={{ opacity:0, y:18 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.35, delay:i*0.07 }}>
            <Card style={{ padding: isMobile ? '14px' : '20px' }}>
              <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', marginBottom:'12px' }}>
                <div style={{ width:'36px', height:'36px', borderRadius:'9px', background:dim, display:'flex', alignItems:'center', justifyContent:'center' }}>
                  <Icon size={16} color={color}/>
                </div>
                <span style={{ fontSize:'10.5px', fontWeight:600, color: trend>0 ? C.green : C.red, display:'flex', alignItems:'center', gap:'1px' }}>
                  {trend>0 ? <ArrowUpRight size={11}/> : <ArrowDownRight size={11}/>}{Math.abs(trend)}%
                </span>
              </div>
              <div style={{ fontSize: isMobile ? '26px' : '28px', fontWeight:800, color:C.text, letterSpacing:'-0.03em', lineHeight:1 }}>
                <CountUp to={val}/>
              </div>
              <div style={{ fontSize:'11.5px', color:C.sub, marginTop:'4px' }}>{label}</div>
              <div style={{ fontSize:'10.5px', color:C.muted, marginTop:'1px' }}>vs last week</div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* ── Main body grid ── */}
      <div style={{ display:'grid', gridTemplateColumns: isMobile || isTablet ? '1fr' : '1fr 340px', gap:g, alignItems:'start' }}>

        {/* ─ LEFT column ─ */}
        <div style={{ display:'flex', flexDirection:'column', gap:g }}>

          {/* Applications */}
          <motion.div initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.28 }}>
            <Card style={{ padding: isMobile ? '14px' : '22px' }}>
              <SectionHead title="Recent Applications" action="View All" onAct={() => router.push('/seeker/applications')}/>
              <div style={{ display:'flex', flexDirection:'column', gap:'1px' }}>
                {APPS.map((app, i) => (
                  <motion.div
                    key={app.id}
                    initial={{ opacity:0, x:-8 }} animate={{ opacity:1, x:0 }} transition={{ delay:0.32+i*0.05 }}
                    onClick={() => toast.info('Opening application details — coming soon!')}
                    style={{ display:'flex', alignItems:'center', gap:'11px', padding:'10px', borderRadius:C.rSm, cursor:'pointer', transition:'background 0.15s' }}
                    onMouseEnter={e => (e.currentTarget.style.background = C.cardHov)}
                    onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                  >
                    <div style={{ width:'34px', height:'34px', borderRadius:'8px', background:`${app.color}20`, border:`1px solid ${app.color}40`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:'10px', fontWeight:700, color:app.color, flexShrink:0 }}>
                      {app.init}
                    </div>
                    <div style={{ flex:1, minWidth:0 }}>
                      <div style={{ fontSize:'12.5px', fontWeight:600, color:C.text, whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{app.role}</div>
                      <div style={{ fontSize:'11px', color:C.sub, marginTop:'2px', display:'flex', alignItems:'center', gap:'3px' }}>
                        {app.company} · <MapPin size={9} color={C.muted}/>{app.loc}
                      </div>
                    </div>
                    <div style={{ textAlign:'right', flexShrink:0 }}>
                      <span style={{ fontSize:'10.5px', fontWeight:600, padding:'2px 8px', borderRadius:'20px', color:STATUS_STYLE[app.status].color, background:STATUS_STYLE[app.status].bg }}>
                        {app.status}
                      </span>
                      <div style={{ fontSize:'10.5px', color:C.muted, marginTop:'3px' }}>{app.date}</div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </Card>
          </motion.div>

          {/* Recommended Jobs */}
          <motion.div initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.36 }}>
            <Card style={{ padding: isMobile ? '14px' : '22px' }}>
              <SectionHead title="Recommended for You" action="Browse All" onAct={() => router.push('/seeker/opportunities')}/>
              <div style={{ display:'flex', flexDirection:'column', gap:'10px' }}>
                {JOBS.map((job, i) => (
                  <motion.div
                    key={job.id}
                    initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.40+i*0.06 }}
                    style={{ padding:'13px', borderRadius:C.rSm, border:`1px solid ${C.border}`, transition:'all 0.2s' }}
                    onMouseEnter={e => { const d = e.currentTarget as HTMLDivElement; d.style.background=C.cardHov; d.style.borderColor=C.borderHov }}
                    onMouseLeave={e => { const d = e.currentTarget as HTMLDivElement; d.style.background='transparent'; d.style.borderColor=C.border }}
                  >
                    <div style={{ display:'flex', gap:'11px' }}>
                      <div style={{ width:'36px', height:'36px', borderRadius:'8px', background:`${job.color}20`, border:`1px solid ${job.color}40`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:'10px', fontWeight:700, color:job.color, flexShrink:0 }}>
                        {job.init}
                      </div>
                      <div style={{ flex:1, minWidth:0 }}>
                        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', gap:'8px', flexWrap:'wrap', marginBottom:'3px' }}>
                          <span style={{ fontSize:'13px', fontWeight:700, color:C.text }}>{job.title}</span>
                          <span style={{ fontSize:'10.5px', fontWeight:700, color:job.match>=90?C.green:C.amber, background:job.match>=90?C.greenDim:C.amberDim, padding:'2px 7px', borderRadius:'20px', flexShrink:0 }}>
                            {job.match}% match
                          </span>
                        </div>
                        <div style={{ fontSize:'11.5px', color:C.sub, marginBottom:'9px' }}>
                          {job.co} · <MapPin size={9} style={{ display:'inline', verticalAlign:'middle' }}/> {job.loc} · {job.sal}
                        </div>
                        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:'8px' }}>
                          <div style={{ display:'flex', gap:'4px', flexWrap:'wrap' }}>
                            {job.tags.map(t => (
                              <span key={t} style={{ fontSize:'10.5px', padding:'2px 6px', borderRadius:'5px', background:C.purpleDim, color:C.purple, fontWeight:500 }}>{t}</span>
                            ))}
                          </div>
                          <button
                            onClick={() => toast.info('Redirecting to application — coming soon!')}
                            style={{ padding:'5px 12px', borderRadius:'7px', background:C.purple, border:'none', color:'#fff', fontSize:'11.5px', fontWeight:600, cursor:'pointer', flexShrink:0 }}
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

          {/* Activity */}
          <motion.div initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.44 }}>
            <Card style={{ padding: isMobile ? '14px' : '22px' }}>
              <SectionHead title="Recent Activity"/>
              {ACTIVITY.map((a, i) => {
                const Icon = a.icon
                return (
                  <div key={a.id} style={{ display:'flex', gap:'11px', padding:'10px 0', borderBottom: i < ACTIVITY.length-1 ? `1px solid ${C.border}` : 'none' }}>
                    <div style={{ width:'30px', height:'30px', borderRadius:'8px', background:`${a.color}18`, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, marginTop:'1px' }}>
                      <Icon size={13} color={a.color}/>
                    </div>
                    <div style={{ flex:1 }}>
                      <p style={{ fontSize:'12.5px', color:C.text, margin:'0 0 3px', lineHeight:1.5 }}>{a.text}</p>
                      <span style={{ fontSize:'11px', color:C.muted }}>{a.time}</span>
                    </div>
                  </div>
                )
              })}
            </Card>
          </motion.div>
        </div>

        {/* ─ RIGHT column ─ */}
        <div style={{ display:'flex', flexDirection:'column', gap:g }}>

          {/* Profile strength */}
          <motion.div initial={{ opacity:0, x: isMobile?0:16 }} animate={{ opacity:1, x:0 }} transition={{ delay:0.3 }}>
            <Card style={{ padding: isMobile ? '14px' : '22px' }}>
              <SectionHead title="Profile Strength"/>
              <div style={{ display:'flex', flexDirection:'column', alignItems:'center', marginBottom:'14px' }}>
                <RadialProgress pct={pct}/>
                <p style={{ fontSize:'12px', color:C.sub, marginTop:'8px', textAlign:'center' }}>
                  {pct < 70 ? 'Complete your profile for more visibility' : 'Great profile! Keep it updated.'}
                </p>
              </div>
              <div style={{ display:'flex', flexDirection:'column', gap:'6px', marginBottom:'14px' }}>
                {PROFILE_ITEMS.map(item => (
                  <div key={item.label} style={{ display:'flex', alignItems:'center', gap:'8px' }}>
                    {item.done
                      ? <CheckCircle2 size={13} color={C.green}/>
                      : <Circle size={13} color={C.muted}/>
                    }
                    <span style={{ fontSize:'12px', color:item.done?C.muted:C.text, textDecoration:item.done?'line-through':'none', opacity:item.done?0.55:1 }}>
                      {item.label}
                    </span>
                  </div>
                ))}
              </div>
              <button
                onClick={() => router.push('/seeker/profile')}
                style={{ width:'100%', padding:'9px', borderRadius:C.rSm, background:C.purple, border:'none', color:'#fff', fontSize:'12.5px', fontWeight:600, cursor:'pointer' }}
              >
                Complete Profile
              </button>
            </Card>
          </motion.div>

          {/* Upcoming Interviews */}
          <motion.div initial={{ opacity:0, x: isMobile?0:16 }} animate={{ opacity:1, x:0 }} transition={{ delay:0.38 }}>
            <Card style={{ padding: isMobile ? '14px' : '22px' }}>
              <SectionHead title="Upcoming Interviews"/>
              <div style={{ display:'flex', flexDirection:'column', gap:'10px' }}>
                {INTERVIEWS.map(iv => (
                  <div key={iv.id} style={{ padding:'12px', borderRadius:C.rSm, background:C.cyanDim, border:`1px solid rgba(6,182,212,0.18)` }}>
                    <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:'8px' }}>
                      <div>
                        <p style={{ fontSize:'12.5px', fontWeight:700, color:C.text, margin:'0 0 2px' }}>{iv.co}</p>
                        <p style={{ fontSize:'11.5px', color:C.sub, margin:0 }}>{iv.role}</p>
                      </div>
                      <span style={{ fontSize:'10px', background:C.cyanDim, color:C.cyan, padding:'2px 7px', borderRadius:'20px', fontWeight:600, border:'1px solid rgba(6,182,212,0.2)', flexShrink:0 }}>
                        {iv.type}
                      </span>
                    </div>
                    <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
                      <span style={{ fontSize:'11.5px', color:C.sub, display:'flex', alignItems:'center', gap:'4px' }}>
                        <Calendar size={10} color={C.cyan}/>{iv.date} · {iv.time}
                      </span>
                      <button
                        onClick={() => toast.info('Joining meeting — coming soon!')}
                        style={{ padding:'5px 11px', borderRadius:'7px', background:C.cyan, border:'none', color:'#fff', fontSize:'11px', fontWeight:600, cursor:'pointer' }}
                      >
                        Join
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </motion.div>

          {/* Career AI tip */}
          <motion.div initial={{ opacity:0, x: isMobile?0:16 }} animate={{ opacity:1, x:0 }} transition={{ delay:0.46 }}>
            <Card style={{
              padding: isMobile ? '14px' : '22px',
              background:'linear-gradient(135deg,rgba(108,99,255,0.15) 0%,rgba(6,182,212,0.07) 100%)',
              border:`1px solid rgba(108,99,255,0.28)`,
            }}>
              <div style={{ display:'flex', alignItems:'center', gap:'7px', marginBottom:'10px' }}>
                <Sparkles size={14} color={C.purple}/>
                <span style={{ fontSize:'10.5px', fontWeight:700, color:C.purple, textTransform:'uppercase', letterSpacing:'0.08em' }}>
                  Career AI Tip
                </span>
              </div>
              <p style={{ fontSize:'13px', color:C.text, lineHeight:1.7, margin:'0 0 14px' }}>
                Candidates who apply within the first <strong style={{ color:C.cyan }}>24 hours</strong> of a posting are 3× more likely to get a callback. Check new listings every morning!
              </p>
              <button
                onClick={() => router.push('/seeker/chat')}
                style={{ padding:'8px 14px', borderRadius:C.rSm, background:C.purple, border:'none', color:'#fff', fontSize:'12px', fontWeight:600, cursor:'pointer', display:'flex', alignItems:'center', gap:'5px' }}
              >
                <Sparkles size={11}/> Ask Career AI
              </button>
            </Card>
          </motion.div>

        </div>
      </div>

      <style>{`
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.45} }
      `}</style>
    </div>
  )
}
