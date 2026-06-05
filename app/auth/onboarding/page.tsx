'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

const INDIAN_STATES = [
  'Andhra Pradesh','Arunachal Pradesh','Assam','Bihar','Chhattisgarh','Goa','Gujarat',
  'Haryana','Himachal Pradesh','Jharkhand','Karnataka','Kerala','Madhya Pradesh',
  'Maharashtra','Manipur','Meghalaya','Mizoram','Nagaland','Odisha','Punjab',
  'Rajasthan','Sikkim','Tamil Nadu','Telangana','Tripura','Uttar Pradesh',
  'Uttarakhand','West Bengal','Delhi','Chandigarh','Puducherry','Jammu & Kashmir','Ladakh'
]

const SKILL_SUGGESTIONS = [
  'JavaScript','React','Node.js','Python','Java','TypeScript','Next.js','PHP',
  'C++','C#','Vue.js','Angular','MongoDB','PostgreSQL','MySQL','Docker',
  'AWS','Figma','Photoshop','Excel','Tally','AutoCAD','Welding','Electrical',
  'Plumbing','Sales','Marketing','Content Writing','SEO','Data Entry',
  'Customer Service','Teaching','Nursing','Accountancy','GST Filing',
]

const EXP_LEVELS = [
  {
    value: 'fresher', label: 'Fresher', desc: 'No professional experience yet',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/>
      </svg>
    ),
  },
  {
    value: '0-1', label: '0 – 1 year', desc: 'Just starting my career',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
      </svg>
    ),
  },
  {
    value: '1-3', label: '1 – 3 years', desc: 'Have some experience',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>
      </svg>
    ),
  },
  {
    value: '3-5', label: '3 – 5 years', desc: 'Experienced professional',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
      </svg>
    ),
  },
  {
    value: '5+', label: '5+ years', desc: 'Senior level experience',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="8" r="7"/><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"/>
      </svg>
    ),
  },
]

const WORK_TYPES = [
  {
    value: 'remote', label: 'Remote',
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>,
  },
  {
    value: 'onsite', label: 'On-site',
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>,
  },
  {
    value: 'hybrid', label: 'Hybrid',
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"/></svg>,
  },
  {
    value: 'any', label: 'Any',
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>,
  },
]

const EMP_TYPES = [
  {
    value: 'full_time', label: 'Full Time',
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>,
  },
  {
    value: 'part_time', label: 'Part Time',
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,
  },
  {
    value: 'internship', label: 'Internship',
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>,
  },
  {
    value: 'freelance', label: 'Freelance',
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 10c-.83 0-1.5-.67-1.5-1.5v-5c0-.83.67-1.5 1.5-1.5s1.5.67 1.5 1.5v5c0 .83-.67 1.5-1.5 1.5z"/><path d="M20.5 10H19V8.5c0-.83.67-1.5 1.5-1.5s1.5.67 1.5 1.5-.67 1.5-1.5 1.5z"/><path d="M9.5 14c.83 0 1.5.67 1.5 1.5v5c0 .83-.67 1.5-1.5 1.5S8 21.33 8 20.5v-5c0-.83.67-1.5 1.5-1.5z"/><path d="M3.5 14H5v1.5c0 .83-.67 1.5-1.5 1.5S2 16.33 2 15.5 2.67 14 3.5 14z"/><path d="M14 14.5c0-.83.67-1.5 1.5-1.5h5c.83 0 1.5.67 1.5 1.5s-.67 1.5-1.5 1.5h-5c-.83 0-1.5-.67-1.5-1.5z"/><path d="M15.5 19H14v1.5c0 .83.67 1.5 1.5 1.5s1.5-.67 1.5-1.5-.67-1.5-1.5-1.5z"/><path d="M10 9.5C10 8.67 9.33 8 8.5 8h-5C2.67 8 2 8.67 2 9.5S2.67 11 3.5 11h5c.83 0 1.5-.67 1.5-1.5z"/><path d="M8.5 5H10V3.5C10 2.67 9.33 2 8.5 2S7 2.67 7 3.5 7.67 5 8.5 5z"/></svg>,
  },
  {
    value: 'any', label: 'Any',
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 11 12 14 22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>,
  },
]

const CheckIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
)

const ArrowRight = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
  </svg>
)

const ArrowLeft = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/>
  </svg>
)

const steps = [
  { label: 'Location', title: 'Where are you?', subtitle: "We'll find jobs closest to you first" },
  { label: 'Your Skills', title: 'What are your skills?', subtitle: 'Type to search. Select at least 2 skills to unlock AI job matching.' },
  { label: 'Experience', title: 'Your experience level?', subtitle: "We'll match you to the right level of jobs" },
  { label: 'Preferences', title: 'Job preferences', subtitle: 'Almost done — just 2 quick questions' },
]

export default function OnboardingPage() {
  const router = useRouter()
  const supabase = createClient()
  const [step, setStep] = useState(0)
  const [saving, setSaving] = useState(false)

  const [state, setState] = useState('')
  const [city, setCity] = useState('')
  const [skills, setSkills] = useState<string[]>([])
  const [skillSearch, setSkillSearch] = useState('')
  const [expLevel, setExpLevel] = useState('')
  const [workType, setWorkType] = useState('')
  const [empType, setEmpType] = useState('')

  const progress = (step / steps.length) * 100
  const canContinue = [
    state.trim().length > 0,
    skills.length >= 2,
    expLevel.length > 0,
    workType.length > 0 && empType.length > 0,
  ][step]

  const filteredSkills = skillSearch
    ? SKILL_SUGGESTIONS.filter(s => s.toLowerCase().includes(skillSearch.toLowerCase()) && !skills.includes(s))
    : SKILL_SUGGESTIONS.filter(s => !skills.includes(s))

  const handleFinish = async () => {
    setSaving(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        await supabase.from('profiles').upsert({
          user_id: user.id,
          full_name: user.user_metadata?.full_name || '',
          state, city,
          years_of_experience: expLevel === 'fresher' ? 0 : expLevel === '0-1' ? 0 : expLevel === '1-3' ? 1 : expLevel === '3-5' ? 3 : 5,
          open_to_work: true,
          remote_ok: workType === 'remote' || workType === 'any',
          profile_completion: 50,
        })
        for (const skillName of skills) {
          const { data: skillRow } = await supabase.from('skills').select('id').eq('name', skillName).single()
          if (skillRow) {
            await supabase.from('user_skills').upsert({ user_id: user.id, skill_id: skillRow.id, level: 'beginner' })
          }
        }
      }
      router.push('/seeker/dashboard')
    } catch {
      router.push('/seeker/dashboard')
    }
  }

  const s = { fontFamily: 'Inter, system-ui, sans-serif' }

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '24px 16px', ...s }}>
      <div style={{ width: '100%', maxWidth: 520 }}>

        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, marginBottom: 32 }}>
          <div style={{ width: 40, height: 40, borderRadius: 12, background: 'linear-gradient(135deg,#2563eb,#4f46e5)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 16px rgba(37,99,235,0.3)' }}>
            <span style={{ color: 'white', fontWeight: 900, fontSize: 13 }}>LY</span>
          </div>
          <span style={{ fontWeight: 900, fontSize: 20, color: '#0f172a', letterSpacing: '-0.02em' }}>LYU</span>
        </div>

        {/* Step dots */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0, marginBottom: 8 }}>
          {steps.map((st, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center' }}>
              <div style={{
                width: 34, height: 34, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 13,
                background: i < step ? '#2563eb' : i === step ? '#2563eb' : '#e2e8f0',
                color: i <= step ? 'white' : '#94a3b8',
                boxShadow: i === step ? '0 0 0 4px rgba(37,99,235,0.15)' : 'none',
                transition: 'all 0.3s',
              }}>
                {i < step ? <CheckIcon /> : i + 1}
              </div>
              {i < steps.length - 1 && (
                <div style={{ width: 60, height: 2, background: i < step ? '#2563eb' : '#e2e8f0', transition: 'background 0.3s', margin: '0 4px' }} />
              )}
            </div>
          ))}
        </div>

        <div style={{ textAlign: 'center', marginBottom: 20 }}>
          <p style={{ fontSize: 12, color: '#94a3b8', marginBottom: 2 }}>Step {step + 1} of {steps.length} · {steps[step].label}</p>
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <span style={{ fontSize: 11, color: '#94a3b8' }}>{Math.round(progress)}% done</span>
          </div>
          <div style={{ height: 3, background: '#e2e8f0', borderRadius: 9999, overflow: 'hidden', marginTop: 4 }}>
            <div style={{ height: '100%', width: `${progress}%`, background: 'linear-gradient(90deg,#2563eb,#6366f1)', borderRadius: 9999, transition: 'width 0.4s ease' }} />
          </div>
        </div>

        {/* Card */}
        <div style={{ background: 'white', borderRadius: 20, border: '1px solid #e2e8f0', boxShadow: '0 4px 20px rgba(0,0,0,0.06)', overflow: 'hidden' }}>

          {/* Card header */}
          <div style={{ padding: '24px 28px 20px', borderBottom: '1px solid #f1f5f9', display: 'flex', alignItems: 'flex-start', gap: 14 }}>
            <div style={{ width: 44, height: 44, borderRadius: 12, background: '#eff6ff', border: '1px solid #dbeafe', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, color: '#2563eb' }}>
              {step === 0 && <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>}
              {step === 1 && <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14M4.93 4.93a10 10 0 0 0 0 14.14"/></svg>}
              {step === 2 && <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>}
              {step === 3 && <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>}
            </div>
            <div>
              <h2 style={{ fontSize: 20, fontWeight: 900, color: '#0f172a', marginBottom: 4, letterSpacing: '-0.02em' }}>{steps[step].title}</h2>
              <p style={{ fontSize: 13, color: '#64748b', lineHeight: 1.5 }}>{steps[step].subtitle}</p>
            </div>
          </div>

          {/* Card body */}
          <div style={{ padding: '24px 28px' }}>

            {/* STEP 0 — Location */}
            {step === 0 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: '#374151', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 8 }}>State</label>
                  <div style={{ position: 'relative' }}>
                    <select value={state} onChange={e => setState(e.target.value)}
                      style={{ width: '100%', padding: '12px 40px 12px 14px', border: `2px solid ${state ? '#2563eb' : '#e2e8f0'}`, borderRadius: 12, fontSize: 14, color: state ? '#0f172a' : '#94a3b8', background: 'white', cursor: 'pointer', appearance: 'none', fontFamily: 'inherit', outline: 'none' }}>
                      <option value="">Select your state</option>
                      {INDIAN_STATES.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                    <svg style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="6 9 12 15 18 9"/>
                    </svg>
                  </div>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: '#374151', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 8 }}>City / District</label>
                  <input type="text" value={city} onChange={e => setCity(e.target.value)} placeholder="e.g. Chandigarh, Ludhiana, Amritsar"
                    style={{ width: '100%', padding: '12px 14px', border: `2px solid ${city ? '#2563eb' : '#e2e8f0'}`, borderRadius: 12, fontSize: 14, color: '#0f172a', background: 'white', fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box' }} />
                </div>
                <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: 10, padding: '10px 14px', display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: 1 }}>
                    <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                  </svg>
                  <p style={{ fontSize: 12, color: '#1d4ed8', lineHeight: 1.5 }}>LYU shows jobs within your district first, then state, then remote — so you always see the closest opportunities.</p>
                </div>
              </div>
            )}

            {/* STEP 1 — Skills */}
            {step === 1 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                {/* Selected skills */}
                {skills.length > 0 && (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7, padding: '10px 12px', background: '#f8fafc', borderRadius: 10, border: '1px solid #e2e8f0' }}>
                    {skills.map(sk => (
                      <span key={sk} style={{ display: 'inline-flex', alignItems: 'center', gap: 5, background: '#2563eb', color: 'white', fontSize: 12, fontWeight: 600, padding: '4px 10px', borderRadius: 9999 }}>
                        {sk}
                        <button onClick={() => setSkills(skills.filter(s => s !== sk))} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.7)', padding: 0, display: 'flex', alignItems: 'center' }}>
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                          </svg>
                        </button>
                      </span>
                    ))}
                  </div>
                )}

                {/* Search box */}
                <div style={{ position: 'relative' }}>
                  <svg style={{ position: 'absolute', left: 13, top: '50%', transform: 'translateY(-50%)' }} width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
                  </svg>
                  <input type="text" value={skillSearch} onChange={e => setSkillSearch(e.target.value)} placeholder="Type a skill e.g. React, Sales, Welding"
                    style={{ width: '100%', padding: '11px 14px 11px 38px', border: '2px solid #e2e8f0', borderRadius: 12, fontSize: 13, color: '#0f172a', fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box' }} />
                </div>

                {/* Suggestions */}
                <div>
                  <p style={{ fontSize: 11, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 8 }}>
                    {skillSearch ? 'Search results' : 'Trending in your area'}
                  </p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7 }}>
                    {filteredSkills.slice(0, 12).map(sk => (
                      <button key={sk} onClick={() => { if (skills.length < 15) setSkills([...skills, sk]) }}
                        style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '5px 12px', border: '1.5px solid #e2e8f0', borderRadius: 9999, background: 'white', fontSize: 13, color: '#374151', fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.15s' }}>
                        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
                        </svg>
                        {sk}
                      </button>
                    ))}
                  </div>
                </div>

                <p style={{ fontSize: 12, color: skills.length >= 2 ? '#16a34a' : '#94a3b8', fontWeight: 600 }}>
                  {skills.length}/15 skills · {skills.length >= 2 ? 'Looking great!' : `Add ${2 - skills.length} more to unlock AI matching`}
                </p>
              </div>
            )}

            {/* STEP 2 — Experience */}
            {step === 2 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {EXP_LEVELS.map(level => (
                  <button key={level.value} onClick={() => setExpLevel(level.value)}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 14, padding: '14px 16px',
                      border: `2px solid ${expLevel === level.value ? '#2563eb' : '#e2e8f0'}`,
                      borderRadius: 12, background: expLevel === level.value ? '#eff6ff' : 'white',
                      cursor: 'pointer', textAlign: 'left', width: '100%', fontFamily: 'inherit',
                      transition: 'all 0.15s', position: 'relative',
                    }}>
                    <div style={{ width: 36, height: 36, borderRadius: 10, background: expLevel === level.value ? '#dbeafe' : '#f8fafc', border: `1px solid ${expLevel === level.value ? '#bfdbfe' : '#e2e8f0'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, color: expLevel === level.value ? '#2563eb' : '#64748b' }}>
                      {level.icon}
                    </div>
                    <div>
                      <p style={{ fontWeight: 700, color: '#0f172a', fontSize: 15 }}>{level.label}</p>
                      <p style={{ color: '#64748b', fontSize: 12, marginTop: 1 }}>{level.desc}</p>
                    </div>
                    {expLevel === level.value && (
                      <div style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', width: 22, height: 22, background: '#2563eb', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <CheckIcon />
                      </div>
                    )}
                  </button>
                ))}
              </div>
            )}

            {/* STEP 3 — Preferences */}
            {step === 3 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: '#374151', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 10 }}>Work Type</label>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                    {WORK_TYPES.map(wt => (
                      <button key={wt.value} onClick={() => setWorkType(wt.value)}
                        style={{
                          display: 'flex', alignItems: 'center', gap: 10, padding: '11px 14px',
                          border: `2px solid ${workType === wt.value ? '#2563eb' : '#e2e8f0'}`,
                          borderRadius: 10, background: workType === wt.value ? '#eff6ff' : 'white',
                          cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.15s',
                          color: workType === wt.value ? '#2563eb' : '#374151', fontWeight: 600, fontSize: 13,
                        }}>
                        <span style={{ color: workType === wt.value ? '#2563eb' : '#64748b' }}>{wt.icon}</span>
                        {wt.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: '#374151', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 10 }}>Employment Type</label>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                    {EMP_TYPES.map(et => (
                      <button key={et.value} onClick={() => setEmpType(et.value)}
                        style={{
                          display: 'flex', alignItems: 'center', gap: 10, padding: '11px 14px',
                          border: `2px solid ${empType === et.value ? '#2563eb' : '#e2e8f0'}`,
                          borderRadius: 10, background: empType === et.value ? '#eff6ff' : 'white',
                          cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.15s',
                          color: empType === et.value ? '#2563eb' : '#374151', fontWeight: 600, fontSize: 13,
                        }}>
                        <span style={{ color: empType === et.value ? '#2563eb' : '#64748b' }}>{et.icon}</span>
                        {et.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Card footer */}
          <div style={{ padding: '16px 28px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid #f1f5f9' }}>
            <button onClick={() => step > 0 ? setStep(step - 1) : router.push('/auth/role-select')}
              style={{ display: 'inline-flex', alignItems: 'center', gap: 7, background: 'none', border: 'none', color: '#64748b', fontWeight: 600, fontSize: 14, cursor: 'pointer', fontFamily: 'inherit', padding: '8px 4px' }}>
              <ArrowLeft /> Back
            </button>

            {step < steps.length - 1 ? (
              <button onClick={() => canContinue && setStep(step + 1)} disabled={!canContinue}
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 8, padding: '11px 24px', borderRadius: 12, border: 'none',
                  background: canContinue ? 'linear-gradient(135deg,#2563eb,#1d4ed8)' : '#e2e8f0',
                  color: canContinue ? 'white' : '#94a3b8', fontWeight: 700, fontSize: 14,
                  cursor: canContinue ? 'pointer' : 'not-allowed', fontFamily: 'inherit',
                  boxShadow: canContinue ? '0 4px 14px rgba(37,99,235,0.25)' : 'none',
                }}>
                Continue <ArrowRight />
              </button>
            ) : (
              <button onClick={handleFinish} disabled={!canContinue || saving}
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 8, padding: '11px 24px', borderRadius: 12, border: 'none',
                  background: canContinue ? 'linear-gradient(135deg,#16a34a,#15803d)' : '#e2e8f0',
                  color: canContinue ? 'white' : '#94a3b8', fontWeight: 700, fontSize: 14,
                  cursor: canContinue ? 'pointer' : 'not-allowed', fontFamily: 'inherit',
                  boxShadow: canContinue ? '0 4px 14px rgba(22,163,74,0.25)' : 'none',
                }}>
                {saving ? 'Saving...' : 'Finish Setup'}
                {!saving && <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
