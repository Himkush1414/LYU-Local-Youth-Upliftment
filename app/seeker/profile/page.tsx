'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  User, Mail, Phone, MapPin, FileText, Briefcase, GraduationCap,
  Code2, Globe, Github, Linkedin, Plus, Trash2, ChevronDown, ChevronUp,
  Camera, Save, CheckCircle, AlertCircle, X, Upload, ExternalLink,
  Languages, Star, Edit3, Award, Calendar
} from 'lucide-react'
import { toast } from 'sonner'
import { createClient } from '@/lib/supabase/client'

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

interface WorkExp {
  id: string
  company: string
  role: string
  location: string
  startDate: string
  endDate: string
  current: boolean
  description: string
}

interface Education {
  id: string
  institution: string
  degree: string
  field: string
  startYear: string
  endYear: string
  grade: string
}

interface ProfileData {
  name: string
  email: string
  phone: string
  city: string
  headline: string
  bio: string
  skills: string[]
  languages: string[]
  linkedin: string
  github: string
  portfolio: string
  workExp: WorkExp[]
  education: Education[]
}

const EMPTY_PROFILE: ProfileData = {
  name: '', email: '', phone: '', city: '', headline: '', bio: '',
  skills: [], languages: [],
  linkedin: '', github: '', portfolio: '',
  workExp: [], education: [],
}

const SECTION_WEIGHTS: Record<string, number> = {
  basic: 25, bio: 10, work: 20, education: 15,
  skills: 15, social: 10, languages: 5,
}

function uid() { return Math.random().toString(36).slice(2, 9) }

function calcCompletion(p: ProfileData): number {
  let score = 0
  if (p.name && p.email && p.phone && p.city && p.headline) score += SECTION_WEIGHTS.basic
  if (p.bio.trim().length > 30) score += SECTION_WEIGHTS.bio
  if (p.workExp.length > 0) score += SECTION_WEIGHTS.work
  if (p.education.length > 0) score += SECTION_WEIGHTS.education
  if (p.skills.length >= 3) score += SECTION_WEIGHTS.skills
  if (p.linkedin || p.github || p.portfolio) score += SECTION_WEIGHTS.social
  if (p.languages.length > 0) score += SECTION_WEIGHTS.languages
  return Math.min(score, 100)
}

function SectionCard({
  id, title, icon, children, expanded, onToggle, completion, isMobile,
}: {
  id: string; title: string; icon: React.ReactNode; children: React.ReactNode
  expanded: boolean; onToggle: () => void; completion?: number; isMobile: boolean
}) {
  const [hov, setHov] = useState(false)
  return (
    <div style={{
      background: C.card, border: `1px solid ${hov ? C.borderHov : C.border}`,
      borderRadius: C.r, overflow: 'hidden', transition: 'border-color 0.2s',
    }}
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
    >
      <button
        onClick={onToggle}
        style={{
          width: '100%', background: 'none', border: 'none', cursor: 'pointer',
          padding: isMobile ? '14px' : '16px 20px',
          display: 'flex', alignItems: 'center', gap: '12px', textAlign: 'left',
        }}
      >
        <div style={{
          width: '34px', height: '34px', borderRadius: '9px',
          background: C.purpleDim, border: `1px solid ${C.purple}35`,
          display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
        }}>
          {icon}
        </div>
        <span style={{ flex: 1, fontSize: '14px', fontWeight: 600, color: C.text }}>{title}</span>
        {completion !== undefined && (
          <span style={{
            fontSize: '11px', fontWeight: 600,
            color: completion === 100 ? C.green : completion > 50 ? C.amber : C.muted,
            background: completion === 100 ? C.greenDim : completion > 50 ? C.amberDim : 'transparent',
            padding: '2px 8px', borderRadius: '20px',
          }}>
            {completion === 100 ? '✓ Done' : `${completion}%`}
          </span>
        )}
        {expanded ? <ChevronUp size={16} color={C.muted} /> : <ChevronDown size={16} color={C.muted} />}
      </button>
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22 }}
            style={{ overflow: 'hidden' }}
          >
            <div style={{ padding: isMobile ? '0 14px 16px' : '0 20px 20px', borderTop: `1px solid ${C.border}` }}>
              <div style={{ paddingTop: '16px' }}>{children}</div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function Field({
  label, value, onChange, placeholder, type = 'text', isMobile,
}: {
  label: string; value: string; onChange: (v: string) => void
  placeholder?: string; type?: string; isMobile: boolean
}) {
  const [focused, setFocused] = useState(false)
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
      <label style={{ fontSize: '11px', fontWeight: 600, color: C.sub, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={{
          background: C.bg, border: `1px solid ${focused ? C.purple : C.border}`,
          borderRadius: C.rSm, padding: '10px 12px', color: C.text,
          fontSize: '13px', outline: 'none', fontFamily: 'inherit',
          boxShadow: focused ? `0 0 0 3px ${C.purpleDim}` : 'none',
          transition: 'all 0.2s',
        }}
      />
    </div>
  )
}

function TextAreaField({
  label, value, onChange, placeholder, rows = 3, isMobile,
}: {
  label: string; value: string; onChange: (v: string) => void
  placeholder?: string; rows?: number; isMobile: boolean
}) {
  const [focused, setFocused] = useState(false)
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
      <label style={{ fontSize: '11px', fontWeight: 600, color: C.sub, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
        {label}
      </label>
      <textarea
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={{
          background: C.bg, border: `1px solid ${focused ? C.purple : C.border}`,
          borderRadius: C.rSm, padding: '10px 12px', color: C.text,
          fontSize: '13px', outline: 'none', fontFamily: 'inherit', resize: 'vertical',
          boxShadow: focused ? `0 0 0 3px ${C.purpleDim}` : 'none',
          transition: 'all 0.2s', lineHeight: 1.6,
        }}
      />
    </div>
  )
}

export default function ProfilePage() {
  const [vw, setVw] = useState(1280)
  useEffect(() => {
    const update = () => setVw(window.innerWidth)
    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [])
  const isMobile = vw < 640
  const isTablet = vw >= 640 && vw < 1100
  const pad = isMobile ? '14px' : isTablet ? '20px 22px' : '22px 26px'

  const [profile, setProfile] = useState<ProfileData>(EMPTY_PROFILE)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [expanded, setExpanded] = useState<Record<string, boolean>>({
    basic: true, bio: true, work: false, education: false,
    skills: false, social: false, languages: false, resume: false,
  })
  const [skillInput, setSkillInput] = useState('')
  const [langInput, setLangInput] = useState('')
  const [hovSave, setHovSave] = useState(false)

  const completion = calcCompletion(profile)

  useEffect(() => {
    async function load() {
      try {
        const supabase = createClient()
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) { setLoading(false); return }
        const { data } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single()
        if (data) {
          setProfile({
            name: data.full_name || '',
            email: user.email || '',
            phone: data.phone || '',
            city: data.city || '',
            headline: data.headline || '',
            bio: data.bio || '',
            skills: data.skills || [],
            languages: data.languages || [],
            linkedin: data.linkedin || '',
            github: data.github || '',
            portfolio: data.portfolio || '',
            workExp: data.work_exp || [],
            education: data.education || [],
          })
        } else {
          setProfile(p => ({ ...p, email: user.email || '' }))
        }
      } catch {
        // graceful fallback
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  async function save() {
    setSaving(true)
    try {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { toast.error('Please sign in to save your profile'); return }
      await supabase.from('profiles').upsert({
        id: user.id,
        full_name: profile.name,
        phone: profile.phone,
        city: profile.city,
        headline: profile.headline,
        bio: profile.bio,
        skills: profile.skills,
        languages: profile.languages,
        linkedin: profile.linkedin,
        github: profile.github,
        portfolio: profile.portfolio,
        work_exp: profile.workExp,
        education: profile.education,
        updated_at: new Date().toISOString(),
      })
      toast.success('Profile saved successfully!')
    } catch {
      toast.error('Could not save. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  function set(key: keyof ProfileData, val: unknown) {
    setProfile(p => ({ ...p, [key]: val }))
  }

  function toggle(sec: string) {
    setExpanded(e => ({ ...e, [sec]: !e[sec] }))
  }

  // Skills
  function addSkill() {
    const s = skillInput.trim()
    if (!s || profile.skills.includes(s)) return
    set('skills', [...profile.skills, s])
    setSkillInput('')
  }
  function removeSkill(s: string) { set('skills', profile.skills.filter(x => x !== s)) }

  // Languages
  function addLang() {
    const l = langInput.trim()
    if (!l || profile.languages.includes(l)) return
    set('languages', [...profile.languages, l])
    setLangInput('')
  }
  function removeLang(l: string) { set('languages', profile.languages.filter(x => x !== l)) }

  // Work Experience
  function addWork() {
    set('workExp', [...profile.workExp, {
      id: uid(), company: '', role: '', location: '', startDate: '', endDate: '', current: false, description: '',
    }])
    setExpanded(e => ({ ...e, work: true }))
  }
  function updateWork(id: string, key: keyof WorkExp, val: string | boolean) {
    set('workExp', profile.workExp.map(w => w.id === id ? { ...w, [key]: val } : w))
  }
  function removeWork(id: string) { set('workExp', profile.workExp.filter(w => w.id !== id)) }

  // Education
  function addEdu() {
    set('education', [...profile.education, {
      id: uid(), institution: '', degree: '', field: '', startYear: '', endYear: '', grade: '',
    }])
    setExpanded(e => ({ ...e, education: true }))
  }
  function updateEdu(id: string, key: keyof Education, val: string) {
    set('education', profile.education.map(e => e.id === id ? { ...e, [key]: val } : e))
  }
  function removeEdu(id: string) { set('education', profile.education.filter(e => e.id !== id)) }

  function sectionCompletion(sec: string): number | undefined {
    if (sec === 'basic') {
      const filled = [profile.name, profile.email, profile.phone, profile.city, profile.headline].filter(Boolean).length
      return Math.round((filled / 5) * 100)
    }
    if (sec === 'bio') return profile.bio.trim().length > 30 ? 100 : Math.round((profile.bio.trim().length / 30) * 100)
    if (sec === 'work') return profile.workExp.length > 0 ? 100 : 0
    if (sec === 'education') return profile.education.length > 0 ? 100 : 0
    if (sec === 'skills') return Math.min(Math.round((profile.skills.length / 3) * 100), 100)
    if (sec === 'social') return (profile.linkedin || profile.github || profile.portfolio) ? 100 : 0
    if (sec === 'languages') return profile.languages.length > 0 ? 100 : 0
    return undefined
  }

  if (loading) {
    return (
      <div style={{ minHeight: '100%', background: C.bg, padding: pad }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {[180, 100, 140, 120].map((h, i) => (
            <div key={i} style={{
              height: h, background: C.card, borderRadius: C.r,
              border: `1px solid ${C.border}`, animation: 'pulse 1.5s ease-in-out infinite',
            }} />
          ))}
        </div>
      </div>
    )
  }

  const grid2 = { display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '14px' }

  return (
    <div style={{ minHeight: '100%', background: C.bg, padding: pad, fontFamily: 'system-ui, sans-serif' }}>

      {/* Header */}
      <div style={{ marginBottom: '20px', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h1 style={{ margin: '0 0 4px', fontSize: isMobile ? '18px' : '22px', fontWeight: 700, color: C.text }}>
            Profile Builder
          </h1>
          <p style={{ margin: 0, fontSize: '12px', color: C.sub }}>Build your profile to unlock better job matches</p>
        </div>
        <motion.button
          onClick={save}
          onHoverStart={() => setHovSave(true)}
          onHoverEnd={() => setHovSave(false)}
          whileTap={{ scale: 0.96 }}
          disabled={saving}
          style={{
            display: 'inline-flex', alignItems: 'center', gap: '7px',
            padding: '10px 20px', borderRadius: '10px',
            background: hovSave ? '#5a52e0' : C.purple, border: 'none',
            color: '#fff', fontSize: '13px', fontWeight: 600,
            cursor: saving ? 'default' : 'pointer', transition: 'all 0.2s',
            opacity: saving ? 0.7 : 1,
          }}
        >
          <Save size={15} />
          {saving ? 'Saving…' : 'Save Changes'}
        </motion.button>
      </div>

      {/* Progress Bar */}
      <div style={{
        background: C.card, border: `1px solid ${C.border}`, borderRadius: C.r,
        padding: isMobile ? '14px' : '16px 20px', marginBottom: '20px',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
          <div>
            <span style={{ fontSize: '13px', fontWeight: 600, color: C.text }}>Profile Completion</span>
            <span style={{ fontSize: '12px', color: C.muted, marginLeft: '8px' }}>
              {completion < 40 ? 'Add more details to get better matches' :
               completion < 70 ? 'Looking good — keep going!' :
               completion < 100 ? 'Almost there!' : '🎉 Profile complete!'}
            </span>
          </div>
          <span style={{
            fontSize: '18px', fontWeight: 800,
            color: completion === 100 ? C.green : completion >= 60 ? C.amber : C.purple,
          }}>
            {completion}%
          </span>
        </div>
        <div style={{ height: '8px', background: C.bg, borderRadius: '99px', overflow: 'hidden' }}>
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${completion}%` }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            style={{
              height: '100%', borderRadius: '99px',
              background: completion === 100
                ? C.green
                : `linear-gradient(90deg, ${C.purple}, ${C.cyan})`,
            }}
          />
        </div>
        {/* Milestone dots */}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '6px' }}>
          {[25, 50, 75, 100].map(m => (
            <span key={m} style={{
              fontSize: '10px',
              color: completion >= m ? (m === 100 ? C.green : C.purple) : C.muted,
              fontWeight: completion >= m ? 600 : 400,
            }}>
              {m}%
            </span>
          ))}
        </div>
      </div>

      {/* Photo + Quick Info Banner */}
      <div style={{
        background: C.card, border: `1px solid ${C.border}`, borderRadius: C.r,
        padding: isMobile ? '16px' : '20px', marginBottom: '16px',
        display: 'flex', alignItems: 'center', gap: '20px', flexWrap: isMobile ? 'wrap' : 'nowrap',
      }}>
        {/* Avatar */}
        <div style={{ position: 'relative', flexShrink: 0 }}>
          <div style={{
            width: isMobile ? '72px' : '88px', height: isMobile ? '72px' : '88px',
            borderRadius: '50%', background: C.purpleDim,
            border: `2px solid ${C.purple}50`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            {profile.name ? (
              <span style={{ fontSize: isMobile ? '24px' : '30px', fontWeight: 700, color: C.purple }}>
                {profile.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()}
              </span>
            ) : (
              <User size={isMobile ? 28 : 36} color={C.muted} />
            )}
          </div>
          <button
            onClick={() => toast.info('Photo upload coming soon!')}
            style={{
              position: 'absolute', bottom: 0, right: 0,
              width: '26px', height: '26px', borderRadius: '50%',
              background: C.purple, border: `2px solid ${C.bg}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', border: `2px solid ${C.bg}`,
            }}
          >
            <Camera size={12} color="#fff" />
          </button>
        </div>

        <div style={{ flex: 1, minWidth: '180px' }}>
          <div style={{ fontSize: isMobile ? '17px' : '20px', fontWeight: 700, color: profile.name ? C.text : C.muted, marginBottom: '2px' }}>
            {profile.name || 'Your Name'}
          </div>
          <div style={{ fontSize: '13px', color: profile.headline ? C.sub : C.muted, marginBottom: '6px' }}>
            {profile.headline || 'Add a professional headline'}
          </div>
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            {profile.city && (
              <span style={{ fontSize: '12px', color: C.muted, display: 'flex', alignItems: 'center', gap: '4px' }}>
                <MapPin size={11} color={C.muted} />{profile.city}
              </span>
            )}
            {profile.email && (
              <span style={{ fontSize: '12px', color: C.muted, display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Mail size={11} color={C.muted} />{profile.email}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Sections */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>

        {/* Basic Info */}
        <SectionCard id="basic" title="Basic Information" icon={<User size={16} color={C.purple} />}
          expanded={expanded.basic} onToggle={() => toggle('basic')}
          completion={sectionCompletion('basic')} isMobile={isMobile}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div style={grid2}>
              <Field label="Full Name" value={profile.name} onChange={v => set('name', v)} placeholder="Arjun Sharma" isMobile={isMobile} />
              <Field label="Email" value={profile.email} onChange={v => set('email', v)} placeholder="arjun@email.com" type="email" isMobile={isMobile} />
            </div>
            <div style={grid2}>
              <Field label="Phone" value={profile.phone} onChange={v => set('phone', v)} placeholder="+91 98765 43210" type="tel" isMobile={isMobile} />
              <Field label="City" value={profile.city} onChange={v => set('city', v)} placeholder="Bangalore, Karnataka" isMobile={isMobile} />
            </div>
            <Field label="Professional Headline" value={profile.headline} onChange={v => set('headline', v)}
              placeholder="Frontend Engineer · React · TypeScript · Open to Opportunities" isMobile={isMobile} />
          </div>
        </SectionCard>

        {/* Bio */}
        <SectionCard id="bio" title="About / Bio" icon={<Edit3 size={16} color={C.purple} />}
          expanded={expanded.bio} onToggle={() => toggle('bio')}
          completion={sectionCompletion('bio')} isMobile={isMobile}
        >
          <TextAreaField
            label="Professional Summary"
            value={profile.bio}
            onChange={v => set('bio', v)}
            placeholder="Write a short summary about yourself — your experience, what you are passionate about, and what you are looking for next..."
            rows={4}
            isMobile={isMobile}
          />
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '6px' }}>
            <span style={{ fontSize: '11px', color: profile.bio.length > 500 ? C.red : C.muted }}>
              {profile.bio.length}/600 characters
            </span>
          </div>
        </SectionCard>

        {/* Work Experience */}
        <SectionCard id="work" title="Work Experience" icon={<Briefcase size={16} color={C.purple} />}
          expanded={expanded.work} onToggle={() => toggle('work')}
          completion={sectionCompletion('work')} isMobile={isMobile}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {profile.workExp.length === 0 && (
              <div style={{ textAlign: 'center', padding: '20px', color: C.muted, fontSize: '13px' }}>
                No experience added yet. Click below to add your first role.
              </div>
            )}
            {profile.workExp.map((w, idx) => (
              <motion.div
                key={w.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                style={{
                  background: C.bg, border: `1px solid ${C.border}`,
                  borderRadius: C.rSm, padding: isMobile ? '14px' : '16px',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <span style={{ fontSize: '12px', fontWeight: 600, color: C.purple }}>Experience {idx + 1}</span>
                  <button onClick={() => removeWork(w.id)} style={{
                    background: C.redDim, border: `1px solid ${C.red}30`, borderRadius: '6px',
                    padding: '4px 8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px',
                    color: C.red, fontSize: '11px',
                  }}>
                    <Trash2 size={11} /> Remove
                  </button>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div style={grid2}>
                    <Field label="Job Title / Role" value={w.role} onChange={v => updateWork(w.id, 'role', v)} placeholder="Software Engineer" isMobile={isMobile} />
                    <Field label="Company Name" value={w.company} onChange={v => updateWork(w.id, 'company', v)} placeholder="Infosys" isMobile={isMobile} />
                  </div>
                  <div style={grid2}>
                    <Field label="Location" value={w.location} onChange={v => updateWork(w.id, 'location', v)} placeholder="Bangalore / Remote" isMobile={isMobile} />
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                      <label style={{ fontSize: '11px', fontWeight: 600, color: C.sub, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Currently Working Here</label>
                      <button
                        onClick={() => updateWork(w.id, 'current', !w.current)}
                        style={{
                          alignSelf: 'flex-start', display: 'flex', alignItems: 'center', gap: '7px',
                          background: w.current ? C.greenDim : C.bg,
                          border: `1px solid ${w.current ? C.green : C.border}`,
                          borderRadius: '7px', padding: '8px 12px',
                          color: w.current ? C.green : C.muted, fontSize: '12px', cursor: 'pointer',
                          transition: 'all 0.2s',
                        }}
                      >
                        {w.current ? <CheckCircle size={13} color={C.green} /> : <AlertCircle size={13} color={C.muted} />}
                        {w.current ? 'Yes, current job' : 'No'}
                      </button>
                    </div>
                  </div>
                  <div style={grid2}>
                    <Field label="Start Date" value={w.startDate} onChange={v => updateWork(w.id, 'startDate', v)} placeholder="Jan 2022" isMobile={isMobile} />
                    {!w.current && (
                      <Field label="End Date" value={w.endDate} onChange={v => updateWork(w.id, 'endDate', v)} placeholder="Dec 2023" isMobile={isMobile} />
                    )}
                  </div>
                  <TextAreaField
                    label="Key Responsibilities & Achievements"
                    value={w.description}
                    onChange={v => updateWork(w.id, 'description', v)}
                    placeholder="• Built React dashboard used by 10K+ users&#10;• Improved page load by 40% via lazy loading&#10;• Led team of 3 engineers"
                    rows={3}
                    isMobile={isMobile}
                  />
                </div>
              </motion.div>
            ))}
            <button
              onClick={addWork}
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '7px',
                padding: '10px', borderRadius: C.rSm,
                background: C.purpleDim, border: `1px dashed ${C.purple}50`,
                color: C.purple, fontSize: '13px', fontWeight: 600, cursor: 'pointer',
                transition: 'all 0.2s',
              }}
            >
              <Plus size={15} /> Add Work Experience
            </button>
          </div>
        </SectionCard>

        {/* Education */}
        <SectionCard id="education" title="Education" icon={<GraduationCap size={16} color={C.purple} />}
          expanded={expanded.education} onToggle={() => toggle('education')}
          completion={sectionCompletion('education')} isMobile={isMobile}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {profile.education.length === 0 && (
              <div style={{ textAlign: 'center', padding: '20px', color: C.muted, fontSize: '13px' }}>
                No education added yet.
              </div>
            )}
            {profile.education.map((edu, idx) => (
              <motion.div
                key={edu.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                style={{
                  background: C.bg, border: `1px solid ${C.border}`,
                  borderRadius: C.rSm, padding: isMobile ? '14px' : '16px',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <span style={{ fontSize: '12px', fontWeight: 600, color: C.cyan }}>Education {idx + 1}</span>
                  <button onClick={() => removeEdu(edu.id)} style={{
                    background: C.redDim, border: `1px solid ${C.red}30`, borderRadius: '6px',
                    padding: '4px 8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px',
                    color: C.red, fontSize: '11px',
                  }}>
                    <Trash2 size={11} /> Remove
                  </button>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <Field label="Institution / University" value={edu.institution} onChange={v => updateEdu(edu.id, 'institution', v)} placeholder="IIT Delhi / VIT Vellore / DU" isMobile={isMobile} />
                  <div style={grid2}>
                    <Field label="Degree" value={edu.degree} onChange={v => updateEdu(edu.id, 'degree', v)} placeholder="B.Tech / B.Sc / MBA" isMobile={isMobile} />
                    <Field label="Field of Study" value={edu.field} onChange={v => updateEdu(edu.id, 'field', v)} placeholder="Computer Science" isMobile={isMobile} />
                  </div>
                  <div style={grid2}>
                    <Field label="Start Year" value={edu.startYear} onChange={v => updateEdu(edu.id, 'startYear', v)} placeholder="2019" isMobile={isMobile} />
                    <Field label="End Year" value={edu.endYear} onChange={v => updateEdu(edu.id, 'endYear', v)} placeholder="2023" isMobile={isMobile} />
                  </div>
                  <Field label="Grade / CGPA / Percentage" value={edu.grade} onChange={v => updateEdu(edu.id, 'grade', v)} placeholder="8.7 CGPA / 85%" isMobile={isMobile} />
                </div>
              </motion.div>
            ))}
            <button
              onClick={addEdu}
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '7px',
                padding: '10px', borderRadius: C.rSm,
                background: C.cyanDim, border: `1px dashed ${C.cyan}50`,
                color: C.cyan, fontSize: '13px', fontWeight: 600, cursor: 'pointer',
                transition: 'all 0.2s',
              }}
            >
              <Plus size={15} /> Add Education
            </button>
          </div>
        </SectionCard>

        {/* Skills */}
        <SectionCard id="skills" title="Skills" icon={<Code2 size={16} color={C.purple} />}
          expanded={expanded.skills} onToggle={() => toggle('skills')}
          completion={sectionCompletion('skills')} isMobile={isMobile}
        >
          <div>
            <p style={{ margin: '0 0 12px', fontSize: '12px', color: C.sub }}>
              Type a skill and press Enter or comma to add. Add at least 3 skills.
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '12px' }}>
              {profile.skills.map(s => (
                <motion.span
                  key={s}
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  style={{
                    display: 'inline-flex', alignItems: 'center', gap: '5px',
                    padding: '5px 10px', borderRadius: '20px',
                    background: C.purpleDim, border: `1px solid ${C.purple}35`,
                    color: C.purple, fontSize: '12px', fontWeight: 500,
                  }}
                >
                  {s}
                  <button onClick={() => removeSkill(s)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, display: 'flex', color: C.purple }}>
                    <X size={11} />
                  </button>
                </motion.span>
              ))}
            </div>
            <input
              value={skillInput}
              onChange={e => setSkillInput(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter' || e.key === ',') { e.preventDefault(); addSkill() }
              }}
              placeholder="e.g. React, TypeScript, Python…"
              style={{
                width: '100%', background: C.bg, border: `1px solid ${C.border}`,
                borderRadius: C.rSm, padding: '10px 12px', color: C.text,
                fontSize: '13px', outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box',
              }}
            />
            <p style={{ margin: '6px 0 0', fontSize: '11px', color: C.muted }}>Press Enter or comma to add</p>
          </div>
        </SectionCard>

        {/* Languages */}
        <SectionCard id="languages" title="Languages" icon={<Languages size={16} color={C.purple} />}
          expanded={expanded.languages} onToggle={() => toggle('languages')}
          completion={sectionCompletion('languages')} isMobile={isMobile}
        >
          <div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '12px' }}>
              {profile.languages.map(l => (
                <motion.span
                  key={l}
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  style={{
                    display: 'inline-flex', alignItems: 'center', gap: '5px',
                    padding: '5px 10px', borderRadius: '20px',
                    background: C.cyanDim, border: `1px solid ${C.cyan}35`,
                    color: C.cyan, fontSize: '12px', fontWeight: 500,
                  }}
                >
                  {l}
                  <button onClick={() => removeLang(l)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, display: 'flex', color: C.cyan }}>
                    <X size={11} />
                  </button>
                </motion.span>
              ))}
            </div>
            <input
              value={langInput}
              onChange={e => setLangInput(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter' || e.key === ',') { e.preventDefault(); addLang() }
              }}
              placeholder="e.g. English, Hindi, Tamil…"
              style={{
                width: '100%', background: C.bg, border: `1px solid ${C.border}`,
                borderRadius: C.rSm, padding: '10px 12px', color: C.text,
                fontSize: '13px', outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box',
              }}
            />
            <p style={{ margin: '6px 0 0', fontSize: '11px', color: C.muted }}>Press Enter or comma to add</p>
          </div>
        </SectionCard>

        {/* Social Links */}
        <SectionCard id="social" title="Social Links" icon={<Globe size={16} color={C.purple} />}
          expanded={expanded.social} onToggle={() => toggle('social')}
          completion={sectionCompletion('social')} isMobile={isMobile}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div style={{ position: 'relative' }}>
              <Linkedin size={14} color="#0A66C2" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
              <input
                value={profile.linkedin}
                onChange={e => set('linkedin', e.target.value)}
                placeholder="https://linkedin.com/in/yourname"
                style={{
                  width: '100%', background: C.bg, border: `1px solid ${C.border}`,
                  borderRadius: C.rSm, padding: '10px 12px 10px 36px',
                  color: C.text, fontSize: '13px', outline: 'none',
                  fontFamily: 'inherit', boxSizing: 'border-box',
                }}
              />
            </div>
            <div style={{ position: 'relative' }}>
              <Github size={14} color={C.sub} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
              <input
                value={profile.github}
                onChange={e => set('github', e.target.value)}
                placeholder="https://github.com/yourusername"
                style={{
                  width: '100%', background: C.bg, border: `1px solid ${C.border}`,
                  borderRadius: C.rSm, padding: '10px 12px 10px 36px',
                  color: C.text, fontSize: '13px', outline: 'none',
                  fontFamily: 'inherit', boxSizing: 'border-box',
                }}
              />
            </div>
            <div style={{ position: 'relative' }}>
              <Globe size={14} color={C.purple} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
              <input
                value={profile.portfolio}
                onChange={e => set('portfolio', e.target.value)}
                placeholder="https://yourportfolio.com"
                style={{
                  width: '100%', background: C.bg, border: `1px solid ${C.border}`,
                  borderRadius: C.rSm, padding: '10px 12px 10px 36px',
                  color: C.text, fontSize: '13px', outline: 'none',
                  fontFamily: 'inherit', boxSizing: 'border-box',
                }}
              />
            </div>
          </div>
        </SectionCard>

        {/* Resume Upload */}
        <SectionCard id="resume" title="Resume Upload" icon={<FileText size={16} color={C.purple} />}
          expanded={expanded.resume} onToggle={() => toggle('resume')} isMobile={isMobile}
        >
          <div
            onClick={() => toast.info('Resume upload coming soon!')}
            style={{
              border: `2px dashed ${C.border}`, borderRadius: C.rSm,
              padding: isMobile ? '28px 16px' : '36px 24px',
              textAlign: 'center', cursor: 'pointer',
              transition: 'all 0.2s',
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.borderColor = C.purple; (e.currentTarget as HTMLDivElement).style.background = C.purpleDim }}
            onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.borderColor = C.border; (e.currentTarget as HTMLDivElement).style.background = 'transparent' }}
          >
            <Upload size={28} color={C.muted} style={{ marginBottom: '10px' }} />
            <p style={{ margin: '0 0 4px', fontSize: '14px', fontWeight: 600, color: C.text }}>
              Upload your Resume
            </p>
            <p style={{ margin: '0 0 12px', fontSize: '12px', color: C.muted }}>
              PDF, DOC, DOCX — max 5MB
            </p>
            <span style={{
              display: 'inline-flex', alignItems: 'center', gap: '6px',
              padding: '8px 16px', borderRadius: '8px',
              background: C.purpleDim, border: `1px solid ${C.purple}40`,
              color: C.purple, fontSize: '12px', fontWeight: 600,
            }}>
              <Upload size={13} /> Browse File
            </span>
          </div>
          <p style={{ margin: '10px 0 0', fontSize: '11px', color: C.muted, textAlign: 'center' }}>
            Tip: Go to <strong style={{ color: C.sub }}>Resume Studio</strong> to build an AI-powered resume from scratch
          </p>
        </SectionCard>

      </div>

      {/* Bottom Save */}
      <div style={{ marginTop: '24px', paddingBottom: '8px', display: 'flex', justifyContent: 'flex-end' }}>
        <motion.button
          onClick={save}
          whileTap={{ scale: 0.96 }}
          disabled={saving}
          style={{
            display: 'inline-flex', alignItems: 'center', gap: '7px',
            padding: '12px 28px', borderRadius: '10px',
            background: C.purple, border: 'none',
            color: '#fff', fontSize: '14px', fontWeight: 600,
            cursor: saving ? 'default' : 'pointer',
            opacity: saving ? 0.7 : 1,
          }}
        >
          <Save size={15} />
          {saving ? 'Saving…' : 'Save All Changes'}
        </motion.button>
      </div>

      <style>{`
        @keyframes pulse { 0%,100% { opacity: 1; } 50% { opacity: 0.45; } }
        input::placeholder, textarea::placeholder { color: ${C.muted}; }
        input:focus, textarea:focus { border-color: ${C.purple} !important; box-shadow: 0 0 0 3px ${C.purpleDim} !important; }
        ::-webkit-scrollbar { width: 5px; } ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: ${C.border}; border-radius: 99px; }
      `}</style>
    </div>
  )
}
