'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { motion, AnimatePresence } from 'framer-motion'

const supabase = createClientComponentClient()

// ── Icons ──────────────────────────────────────────────────────────────────
const IconBriefcase = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7">
    <rect x="2" y="7" width="20" height="14" rx="2" />
    <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
    <line x1="12" y1="12" x2="12" y2="12.01" />
  </svg>
)

const IconBuilding = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7">
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
    <polyline points="9 22 9 12 15 12 15 22" />
  </svg>
)

const IconCheck = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
    <polyline points="20 6 9 17 4 12" />
  </svg>
)

const IconX = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3 h-3">
    <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
  </svg>
)

const IconArrow = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
    <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
  </svg>
)

const IconSpark = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
    <path d="M12 2L9.5 9.5 2 12l7.5 2.5L12 22l2.5-7.5L22 12l-7.5-2.5L12 2z" />
  </svg>
)

const IconTarget = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
    <circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="6" /><circle cx="12" cy="12" r="2" />
  </svg>
)

const IconMapPin = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" />
  </svg>
)

const IconUsers = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
)

// ── Data ───────────────────────────────────────────────────────────────────
const STATUS_OPTIONS = [
  { value: 'actively_looking', label: 'Actively Looking', desc: 'Ready to start immediately' },
  { value: 'open_to_offers', label: 'Open to Offers', desc: 'Exploring opportunities' },
  { value: 'employed', label: 'Currently Employed', desc: 'Not actively searching' },
  { value: 'student', label: 'Student', desc: 'Learning & building skills' },
  { value: 'freelancer', label: 'Freelancer', desc: 'Working independently' },
]

const EXP_OPTIONS = [
  { value: 'fresher', label: 'Fresher', desc: '0 – 1 year' },
  { value: 'junior', label: 'Junior', desc: '1 – 3 years' },
  { value: 'mid', label: 'Mid-Level', desc: '3 – 6 years' },
  { value: 'senior', label: 'Senior', desc: '6 – 10 years' },
  { value: 'lead', label: 'Lead / Principal', desc: '10+ years' },
]

const EDU_OPTIONS = ['High School', '12th / Diploma', "Bachelor's Degree", "Master's Degree", 'PhD / Doctorate', 'Self-taught / Bootcamp']

const WORK_MODES = ['Remote', 'On-site', 'Hybrid', 'Flexible']

const INDUSTRIES = [
  'Technology', 'Finance & Banking', 'Healthcare', 'Education', 'E-commerce',
  'Manufacturing', 'Government / PSU', 'Media & Entertainment', 'Consulting',
  'Real Estate', 'Hospitality', 'Logistics', 'Agriculture', 'Energy', 'Other',
]

const COMPANY_SIZES = ['1–10', '11–50', '51–200', '201–500', '501–2000', '2000+']

const HIRING_VOLUMES = [
  '1–5 hires', '6–20 hires', '21–50 hires', '50+ hires', 'Ongoing / Always hiring',
]

// ── Tag Input Component ────────────────────────────────────────────────────
function TagInput({ tags, setTags, placeholder }: { tags: string[], setTags: (t: string[]) => void, placeholder: string }) {
  const [input, setInput] = useState('')

  const addTag = (val: string) => {
    const trimmed = val.trim()
    if (trimmed && !tags.includes(trimmed)) {
      setTags([...tags, trimmed])
    }
    setInput('')
  }

  const removeTag = (tag: string) => setTags(tags.filter(t => t !== tag))

  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => {
            if (e.key === 'Enter' || e.key === ',') { e.preventDefault(); addTag(input) }
            if (e.key === 'Backspace' && !input && tags.length) removeTag(tags[tags.length - 1])
          }}
          placeholder={placeholder}
          className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-violet-400/60 focus:bg-white/8 transition-all text-sm"
        />
        <button
          onClick={() => addTag(input)}
          className="px-4 py-3 bg-violet-600/30 hover:bg-violet-600/50 border border-violet-400/30 rounded-xl text-violet-300 text-sm font-medium transition-all"
        >
          Add
        </button>
      </div>
      {tags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {tags.map(tag => (
            <motion.span
              key={tag}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-violet-600/20 border border-violet-400/30 rounded-full text-violet-200 text-sm"
            >
              {tag}
              <button onClick={() => removeTag(tag)} className="text-violet-400 hover:text-white transition-colors">
                <IconX />
              </button>
            </motion.span>
          ))}
        </div>
      )}
      <p className="text-white/30 text-xs">Press Enter or comma to add · Backspace to remove last</p>
    </div>
  )
}

// ── Select Card ────────────────────────────────────────────────────────────
function SelectCard({ value, selected, onSelect, label, desc }: any) {
  return (
    <button
      onClick={() => onSelect(value)}
      className={`w-full text-left px-4 py-3.5 rounded-xl border transition-all duration-200 ${
        selected
          ? 'bg-violet-600/25 border-violet-400/60 shadow-lg shadow-violet-900/20'
          : 'bg-white/4 border-white/8 hover:bg-white/8 hover:border-white/20'
      }`}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className={`font-medium text-sm ${selected ? 'text-violet-200' : 'text-white/80'}`}>{label}</p>
          {desc && <p className="text-white/40 text-xs mt-0.5">{desc}</p>}
        </div>
        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all ${
          selected ? 'bg-violet-500 border-violet-400' : 'border-white/20'
        }`}>
          {selected && <IconCheck />}
        </div>
      </div>
    </button>
  )
}

// ── Multi Toggle ───────────────────────────────────────────────────────────
function MultiToggle({ options, selected, onToggle }: { options: string[], selected: string[], onToggle: (v: string) => void }) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map(opt => (
        <button
          key={opt}
          onClick={() => onToggle(opt)}
          className={`px-4 py-2 rounded-full border text-sm font-medium transition-all duration-200 ${
            selected.includes(opt)
              ? 'bg-violet-600/30 border-violet-400/50 text-violet-200'
              : 'bg-white/5 border-white/10 text-white/50 hover:text-white/80 hover:border-white/25'
          }`}
        >
          {opt}
        </button>
      ))}
    </div>
  )
}

// ── Main Component ─────────────────────────────────────────────────────────
export default function OnboardingPage() {
  const router = useRouter()
  const [role, setRole] = useState<'seeker' | 'employer' | null>(null)
  const [step, setStep] = useState(0)   // 0 = role select
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [userId, setUserId] = useState<string | null>(null)

  // Seeker state
  const [headline, setHeadline] = useState('')
  const [currentStatus, setCurrentStatus] = useState('')
  const [expLevel, setExpLevel] = useState('')
  const [education, setEducation] = useState('')
  const [location, setLocation] = useState('')
  const [skills, setSkills] = useState<string[]>([])
  const [preferredRoles, setPreferredRoles] = useState<string[]>([])
  const [workModes, setWorkModes] = useState<string[]>([])

  // Employer state
  const [companyName, setCompanyName] = useState('')
  const [industry, setIndustry] = useState('')
  const [companySize, setCompanySize] = useState('')
  const [companyLocation, setCompanyLocation] = useState('')
  const [hiringRoles, setHiringRoles] = useState<string[]>([])
  const [hiringVolume, setHiringVolume] = useState('')

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data?.user) setUserId(data.user.id)
      else router.push('/auth/login')
    })
  }, [])

  const toggleWorkMode = (v: string) =>
    setWorkModes(prev => prev.includes(v) ? prev.filter(x => x !== v) : [...prev, v])

  const totalSteps = role === 'seeker' ? 4 : 2
  const progress = role ? ((step - 1) / totalSteps) * 100 : 0

  const saveAndFinish = async () => {
    if (!userId) return
    setSaving(true)
    setError('')
    try {
      const payload = role === 'seeker'
        ? { id: userId, role: 'seeker', headline, current_status: currentStatus, experience_level: expLevel, education, location, skills, preferred_roles: preferredRoles, work_mode: workModes, onboarding_complete: true, updated_at: new Date().toISOString() }
        : { id: userId, role: 'employer', company_name: companyName, industry, company_size: companySize, company_location: companyLocation, hiring_roles: hiringRoles, hiring_volume: hiringVolume, onboarding_complete: true, updated_at: new Date().toISOString() }

      const { error: err } = await supabase.from('profiles').upsert(payload, { onConflict: 'id' })
      if (err) throw err
      router.push(role === 'seeker' ? '/seeker/dashboard' : '/employer/dashboard')
    } catch (e: any) {
      setError(e.message || 'Something went wrong. Please try again.')
      setSaving(false)
    }
  }

  const skipAndFinish = async () => {
    if (!userId || !role) return
    setSaving(true)
    try {
      await supabase.from('profiles').upsert(
        { id: userId, role, onboarding_complete: true, updated_at: new Date().toISOString() },
        { onConflict: 'id' }
      )
      router.push(role === 'seeker' ? '/seeker/dashboard' : '/employer/dashboard')
    } catch {
      router.push(role === 'seeker' ? '/seeker/dashboard' : '/employer/dashboard')
    }
  }

  // ── Role Select ────────────────────────────────────────────────────────
  const RoleSelect = () => (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -24 }}
      className="space-y-6"
    >
      <div className="text-center space-y-2 pb-2">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 15 }}
          className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-violet-500 to-purple-700 flex items-center justify-center shadow-xl shadow-violet-900/40 mb-5"
        >
          <IconSpark />
        </motion.div>
        <h1 className="text-2xl sm:text-3xl font-bold text-white">Welcome to LYU</h1>
        <p className="text-white/50 text-sm sm:text-base">Tell us what brings you here so we can personalise your experience</p>
      </div>

      <div className="grid gap-4">
        {[
          {
            id: 'seeker',
            title: 'I\'m a Job Seeker',
            desc: 'Looking for jobs, internships, or career opportunities',
            icon: <IconBriefcase />,
            gradient: 'from-violet-600/20 to-purple-700/20',
            border: 'border-violet-500/30',
            accent: 'text-violet-300',
          },
          {
            id: 'employer',
            title: 'I\'m an Employer',
            desc: 'Hiring talent for my company or organisation',
            icon: <IconBuilding />,
            gradient: 'from-emerald-600/20 to-teal-700/20',
            border: 'border-emerald-500/30',
            accent: 'text-emerald-300',
          },
        ].map(opt => (
          <motion.button
            key={opt.id}
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => { setRole(opt.id as any); setStep(1) }}
            className={`w-full text-left p-5 sm:p-6 rounded-2xl bg-gradient-to-br ${opt.gradient} border ${opt.border} hover:brightness-110 transition-all duration-200 shadow-lg`}
          >
            <div className="flex items-start gap-4">
              <div className={`${opt.accent} mt-0.5`}>{opt.icon}</div>
              <div>
                <h3 className="text-white font-semibold text-base sm:text-lg">{opt.title}</h3>
                <p className="text-white/50 text-sm mt-1">{opt.desc}</p>
              </div>
              <div className="ml-auto text-white/20 mt-1">
                <IconArrow />
              </div>
            </div>
          </motion.button>
        ))}
      </div>
    </motion.div>
  )

  // ── Seeker Steps ───────────────────────────────────────────────────────
  const SeekerStep1 = () => (
    <motion.div initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 }} className="space-y-5">
      <StepHeader icon={<IconSpark />} title="Your Professional Identity" subtitle="Help employers understand who you are at a glance" />

      <div className="space-y-2">
        <label className="text-white/60 text-xs font-medium uppercase tracking-wider">Professional Headline</label>
        <input
          value={headline}
          onChange={e => setHeadline(e.target.value)}
          placeholder="e.g. Full Stack Developer · 3 years experience"
          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-white placeholder-white/25 focus:outline-none focus:border-violet-400/60 focus:bg-white/8 transition-all text-sm"
        />
        <p className="text-white/30 text-xs">This appears at the top of your profile</p>
      </div>

      <div className="space-y-2">
        <label className="text-white/60 text-xs font-medium uppercase tracking-wider">Current Status</label>
        <div className="space-y-2">
          {STATUS_OPTIONS.map(opt => (
            <SelectCard key={opt.value} value={opt.value} selected={currentStatus === opt.value} onSelect={setCurrentStatus} label={opt.label} desc={opt.desc} />
          ))}
        </div>
      </div>
    </motion.div>
  )

  const SeekerStep2 = () => (
    <motion.div initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 }} className="space-y-5">
      <StepHeader icon={<IconTarget />} title="Experience & Background" subtitle="Share your level of expertise and educational background" />

      <div className="space-y-2">
        <label className="text-white/60 text-xs font-medium uppercase tracking-wider">Experience Level</label>
        <div className="space-y-2">
          {EXP_OPTIONS.map(opt => (
            <SelectCard key={opt.value} value={opt.value} selected={expLevel === opt.value} onSelect={setExpLevel} label={opt.label} desc={opt.desc} />
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-white/60 text-xs font-medium uppercase tracking-wider">Highest Education</label>
        <div className="flex flex-wrap gap-2">
          {EDU_OPTIONS.map(opt => (
            <button
              key={opt}
              onClick={() => setEducation(opt)}
              className={`px-3 py-2 rounded-xl border text-sm transition-all ${
                education === opt
                  ? 'bg-violet-600/25 border-violet-400/50 text-violet-200'
                  : 'bg-white/5 border-white/10 text-white/50 hover:border-white/25 hover:text-white/80'
              }`}
            >
              {opt}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-white/60 text-xs font-medium uppercase tracking-wider flex items-center gap-2">
          <IconMapPin /> Location
        </label>
        <input
          value={location}
          onChange={e => setLocation(e.target.value)}
          placeholder="e.g. Bangalore, Mumbai, Delhi NCR"
          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-white placeholder-white/25 focus:outline-none focus:border-violet-400/60 transition-all text-sm"
        />
      </div>
    </motion.div>
  )

  const SeekerStep3 = () => (
    <motion.div initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 }} className="space-y-5">
      <StepHeader icon={<IconSpark />} title="Your Skills" subtitle="Type any skill — technical, creative, or soft skills" />

      <div className="space-y-2">
        <label className="text-white/60 text-xs font-medium uppercase tracking-wider">Add Your Skills</label>
        <TagInput
          tags={skills}
          setTags={setSkills}
          placeholder="e.g. React, Excel, Public Speaking, Photoshop..."
        />
      </div>

      {skills.length === 0 && (
        <div className="p-4 rounded-xl bg-white/3 border border-white/8">
          <p className="text-white/40 text-sm">💡 You can add any skill — coding languages, tools, soft skills, languages, or domain knowledge. You can always update this later.</p>
        </div>
      )}
    </motion.div>
  )

  const SeekerStep4 = () => (
    <motion.div initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 }} className="space-y-5">
      <StepHeader icon={<IconTarget />} title="Job Preferences" subtitle="What kind of work are you looking for?" />

      <div className="space-y-2">
        <label className="text-white/60 text-xs font-medium uppercase tracking-wider">Preferred Job Roles / Titles</label>
        <TagInput
          tags={preferredRoles}
          setTags={setPreferredRoles}
          placeholder="e.g. Software Engineer, Data Analyst, UI Designer..."
        />
      </div>

      <div className="space-y-2">
        <label className="text-white/60 text-xs font-medium uppercase tracking-wider">Work Mode Preference</label>
        <MultiToggle options={WORK_MODES} selected={workModes} onToggle={toggleWorkMode} />
      </div>
    </motion.div>
  )

  // ── Employer Steps ─────────────────────────────────────────────────────
  const EmployerStep1 = () => (
    <motion.div initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 }} className="space-y-5">
      <StepHeader icon={<IconBuilding />} title="About Your Company" subtitle="Help candidates learn about where they'll be working" />

      <div className="space-y-2">
        <label className="text-white/60 text-xs font-medium uppercase tracking-wider">Company Name</label>
        <input
          value={companyName}
          onChange={e => setCompanyName(e.target.value)}
          placeholder="Your company or organisation name"
          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-white placeholder-white/25 focus:outline-none focus:border-violet-400/60 transition-all text-sm"
        />
      </div>

      <div className="space-y-2">
        <label className="text-white/60 text-xs font-medium uppercase tracking-wider">Industry</label>
        <div className="flex flex-wrap gap-2">
          {INDUSTRIES.map(opt => (
            <button
              key={opt}
              onClick={() => setIndustry(opt)}
              className={`px-3 py-2 rounded-xl border text-sm transition-all ${
                industry === opt
                  ? 'bg-emerald-600/25 border-emerald-400/50 text-emerald-200'
                  : 'bg-white/5 border-white/10 text-white/50 hover:border-white/25 hover:text-white/80'
              }`}
            >
              {opt}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-white/60 text-xs font-medium uppercase tracking-wider">Company Size</label>
        <div className="grid grid-cols-3 gap-2">
          {COMPANY_SIZES.map(opt => (
            <button
              key={opt}
              onClick={() => setCompanySize(opt)}
              className={`py-2.5 rounded-xl border text-sm transition-all ${
                companySize === opt
                  ? 'bg-emerald-600/25 border-emerald-400/50 text-emerald-200'
                  : 'bg-white/5 border-white/10 text-white/50 hover:border-white/25 hover:text-white/80'
              }`}
            >
              {opt}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-white/60 text-xs font-medium uppercase tracking-wider flex items-center gap-2">
          <IconMapPin /> Company Location
        </label>
        <input
          value={companyLocation}
          onChange={e => setCompanyLocation(e.target.value)}
          placeholder="e.g. Bangalore, Mumbai, Pan India"
          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-white placeholder-white/25 focus:outline-none focus:border-violet-400/60 transition-all text-sm"
        />
      </div>
    </motion.div>
  )

  const EmployerStep2 = () => (
    <motion.div initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 }} className="space-y-5">
      <StepHeader icon={<IconUsers />} title="Hiring Details" subtitle="What kind of talent are you looking for?" />

      <div className="space-y-2">
        <label className="text-white/60 text-xs font-medium uppercase tracking-wider">Roles You're Hiring For</label>
        <TagInput
          tags={hiringRoles}
          setTags={setHiringRoles}
          placeholder="e.g. Backend Developer, Sales Manager, Graphic Designer..."
        />
      </div>

      <div className="space-y-2">
        <label className="text-white/60 text-xs font-medium uppercase tracking-wider">Expected Hiring Volume</label>
        <div className="space-y-2">
          {HIRING_VOLUMES.map(opt => (
            <SelectCard key={opt} value={opt} selected={hiringVolume === opt} onSelect={setHiringVolume} label={opt} />
          ))}
        </div>
      </div>
    </motion.div>
  )

  // ── Step Header ────────────────────────────────────────────────────────
  const StepHeader = ({ icon, title, subtitle }: any) => (
    <div className="flex items-start gap-3 pb-1">
      <div className="w-10 h-10 rounded-xl bg-violet-600/20 border border-violet-400/20 flex items-center justify-center text-violet-300 flex-shrink-0">
        {icon}
      </div>
      <div>
        <h2 className="text-lg sm:text-xl font-semibold text-white">{title}</h2>
        <p className="text-white/40 text-sm mt-0.5">{subtitle}</p>
      </div>
    </div>
  )

  // ── Step Renderer ──────────────────────────────────────────────────────
  const renderStep = () => {
    if (step === 0) return <RoleSelect />
    if (role === 'seeker') {
      if (step === 1) return <SeekerStep1 />
      if (step === 2) return <SeekerStep2 />
      if (step === 3) return <SeekerStep3 />
      if (step === 4) return <SeekerStep4 />
    }
    if (role === 'employer') {
      if (step === 1) return <EmployerStep1 />
      if (step === 2) return <EmployerStep2 />
    }
  }

  const isLastStep = role === 'seeker' ? step === 4 : step === 2

  return (
    <div className="min-h-screen bg-[#0a0a0f] flex flex-col items-center justify-start px-4 py-8 sm:py-12">
      {/* Background glow */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-violet-600/8 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-purple-800/6 rounded-full blur-[100px]" />
      </div>

      <div className="relative w-full max-w-lg">
        {/* Logo */}
        <div className="flex items-center justify-between mb-6 sm:mb-8">
          <span className="text-white/90 font-bold text-xl tracking-tight">LYU</span>
          {step > 0 && (
            <button onClick={skipAndFinish} className="text-white/30 hover:text-white/60 text-sm transition-colors">
              Skip for now →
            </button>
          )}
        </div>

        {/* Progress bar */}
        {step > 0 && role && (
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-white/40 text-xs">Step {step} of {totalSteps}</span>
              <span className="text-white/40 text-xs">{Math.round(progress)}% complete</span>
            </div>
            <div className="h-1 bg-white/8 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-violet-500 to-purple-400 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.4, ease: 'easeOut' }}
              />
            </div>
          </div>
        )}

        {/* Card */}
        <div className="bg-white/[0.04] border border-white/[0.08] rounded-2xl p-5 sm:p-7 shadow-2xl backdrop-blur-sm">
          <AnimatePresence mode="wait">
            <div key={`${role}-${step}`}>
              {renderStep()}
            </div>
          </AnimatePresence>

          {/* Error */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-300 text-sm"
            >
              {error}
            </motion.div>
          )}

          {/* Navigation */}
          {step > 0 && (
            <div className="flex items-center justify-between mt-6 pt-5 border-t border-white/8">
              <button
                onClick={() => step === 1 ? (setStep(0), setRole(null)) : setStep(step - 1)}
                className="px-4 py-2.5 rounded-xl text-white/40 hover:text-white/70 text-sm transition-colors"
              >
                ← Back
              </button>

              <div className="flex gap-2">
                {!isLastStep ? (
                  <button
                    onClick={() => setStep(step + 1)}
                    className="px-5 py-2.5 bg-violet-600 hover:bg-violet-500 rounded-xl text-white font-medium text-sm transition-all flex items-center gap-2 shadow-lg shadow-violet-900/30"
                  >
                    Continue <IconArrow />
                  </button>
                ) : (
                  <button
                    onClick={saveAndFinish}
                    disabled={saving}
                    className="px-5 py-2.5 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 rounded-xl text-white font-medium text-sm transition-all flex items-center gap-2 shadow-lg shadow-violet-900/30 disabled:opacity-60"
                  >
                    {saving ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>Complete Setup ✓</>
                    )}
                  </button>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Step dots */}
        {step > 0 && role && (
          <div className="flex justify-center gap-2 mt-5">
            {Array.from({ length: totalSteps }).map((_, i) => (
              <div
                key={i}
                className={`rounded-full transition-all duration-300 ${
                  i + 1 === step ? 'w-6 h-1.5 bg-violet-400' : i + 1 < step ? 'w-1.5 h-1.5 bg-violet-600/60' : 'w-1.5 h-1.5 bg-white/15'
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
