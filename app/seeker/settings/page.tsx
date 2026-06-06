'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Settings, Bell, Shield, Briefcase, Palette, AlertTriangle,
  Mail, Smartphone, MessageSquare, Lock,
  MapPin, Monitor, Trash2, ChevronDown, ChevronUp,
  CheckCircle, User, Globe, Laptop,
  Building2
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

function Toggle({ on, onChange }: { on: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      onClick={() => onChange(!on)}
      style={{
        width: '44px', height: '24px', borderRadius: '99px', border: 'none',
        background: on ? C.purple : C.border,
        cursor: 'pointer', position: 'relative',
        transition: 'background 0.25s', flexShrink: 0,
        padding: 0,
      }}
    >
      <motion.div
        animate={{ x: on ? 22 : 2 }}
        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        style={{
          position: 'absolute', top: '2px',
          width: '20px', height: '20px', borderRadius: '50%',
          background: '#fff',
          boxShadow: '0 1px 4px rgba(0,0,0,0.35)',
        }}
      />
    </button>
  )
}

function SectionCard({
  title, icon, iconColor, children, expanded, onToggle, isMobile,
}: {
  title: string; icon: React.ReactNode; iconColor: string
  children: React.ReactNode; expanded: boolean; onToggle: () => void; isMobile: boolean
}) {
  const [hov, setHov] = useState(false)
  return (
    <div
      style={{
        background: C.card, border: `1px solid ${hov ? C.borderHov : C.border}`,
        borderRadius: C.r, overflow: 'hidden', transition: 'border-color 0.2s',
      }}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
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
          width: '36px', height: '36px', borderRadius: '10px',
          background: `${iconColor}18`, border: `1px solid ${iconColor}35`,
          display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
        }}>
          {icon}
        </div>
        <span style={{ flex: 1, fontSize: '14px', fontWeight: 600, color: C.text }}>{title}</span>
        {expanded
          ? <ChevronUp size={16} color={C.muted} />
          : <ChevronDown size={16} color={C.muted} />
        }
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
            <div style={{
              borderTop: `1px solid ${C.border}`,
              padding: isMobile ? '16px 14px' : '20px',
            }}>
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function ToggleRow({
  label, sub, on, onChange,
}: { label: string; sub?: string; on: boolean; onChange: (v: boolean) => void }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      gap: '16px', padding: '10px 0',
    }}>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: '13px', fontWeight: 500, color: C.text }}>{label}</div>
        {sub && <div style={{ fontSize: '11px', color: C.muted, marginTop: '2px' }}>{sub}</div>}
      </div>
      <Toggle on={on} onChange={onChange} />
    </div>
  )
}

function Divider() {
  return <div style={{ height: '1px', background: C.border, margin: '2px 0' }} />
}

function SelectField({
  label, value, onChange, options,
}: { label: string; value: string; onChange: (v: string) => void; options: string[] }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
      <label style={{ fontSize: '11px', fontWeight: 600, color: C.sub, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
        {label}
      </label>
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        style={{
          background: C.bg, border: `1px solid ${C.border}`, borderRadius: C.rSm,
          padding: '9px 12px', color: C.text, fontSize: '13px', outline: 'none',
          fontFamily: 'inherit', cursor: 'pointer', appearance: 'none',
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23475569' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'no-repeat', backgroundPosition: 'right 12px center',
          paddingRight: '36px',
        }}
      >
        {options.map(o => <option key={o} value={o} style={{ background: C.card }}>{o}</option>)}
      </select>
    </div>
  )
}

function TagSelect({
  label, options, selected, onChange,
}: { label: string; options: string[]; selected: string[]; onChange: (v: string[]) => void }) {
  function toggle(o: string) {
    onChange(selected.includes(o) ? selected.filter(x => x !== o) : [...selected, o])
  }
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      <label style={{ fontSize: '11px', fontWeight: 600, color: C.sub, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
        {label}
      </label>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '7px' }}>
        {options.map(o => {
          const active = selected.includes(o)
          return (
            <button
              key={o}
              onClick={() => toggle(o)}
              style={{
                padding: '5px 12px', borderRadius: '20px', fontSize: '12px', cursor: 'pointer',
                background: active ? C.purpleDim : C.bg,
                border: `1px solid ${active ? C.purple : C.border}`,
                color: active ? C.purple : C.sub,
                fontWeight: active ? 600 : 400,
                transition: 'all 0.15s',
              }}
            >
              {o}
            </button>
          )
        })}
      </div>
    </div>
  )
}

function SalarySlider({
  value, onChange,
}: { value: [number, number]; onChange: (v: [number, number]) => void }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <label style={{ fontSize: '11px', fontWeight: 600, color: C.sub, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          Expected Salary Range
        </label>
        <span style={{ fontSize: '13px', fontWeight: 600, color: C.purple }}>
          ₹{value[0]}L – ₹{value[1]}L
        </span>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
        {(['Min', 'Max'] as const).map((label, i) => (
          <div key={label} style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <span style={{ fontSize: '11px', color: C.muted }}>{label} (LPA)</span>
            <input
              type="range" min={1} max={i === 0 ? value[1] - 1 : 100}
              value={value[i]}
              onChange={e => {
                const n = Number(e.target.value)
                onChange(i === 0 ? [n, value[1]] : [value[0], n])
              }}
              style={{ width: '100%', accentColor: C.purple, cursor: 'pointer' }}
            />
          </div>
        ))}
      </div>
    </div>
  )
}

function SubLabel({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: '6px',
      fontSize: '11px', fontWeight: 700, color: C.sub,
      textTransform: 'uppercase', letterSpacing: '0.06em',
      padding: '6px 0 2px',
    }}>
      {icon}{label}
    </div>
  )
}

function SaveBtn({ onClick }: { onClick: () => void }) {
  const [hov, setHov] = useState(false)
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        display: 'inline-flex', alignItems: 'center', gap: '6px',
        padding: '9px 20px', borderRadius: '9px', border: 'none',
        background: hov ? '#5a52e0' : C.purple,
        color: '#fff', fontSize: '13px', fontWeight: 600,
        cursor: 'pointer', transition: 'background 0.2s',
      }}
    >
      <CheckCircle size={14} /> Save
    </button>
  )
}

export default function SettingsPage() {
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

  const [open, setOpen] = useState<Record<string, boolean>>({
    account: true, notifications: false, privacy: false,
    preferences: false, appearance: false, danger: false,
  })
  function toggle(s: string) { setOpen(o => ({ ...o, [s]: !o[s] })) }

  const [email] = useState('arjun.sharma@gmail.com')
  const [hovPass, setHovPass] = useState(false)

  const [notifs, setNotifs] = useState({
    emailJobs: true, emailApplications: true, emailMessages: false,
    pushJobs: true, pushApplications: true, pushMessages: true,
    smsOtp: true, smsAlerts: false,
    weeklyDigest: true, marketingEmails: false,
  })
  function setNotif(k: keyof typeof notifs, v: boolean) {
    setNotifs(n => ({ ...n, [k]: v }))
  }

  const [privacy, setPrivacy] = useState({
    profilePublic: true, showEmail: false, showPhone: false,
    allowRecruiterContact: true, shareActivityData: false,
    showOnlineStatus: true,
  })
  function setPriv(k: keyof typeof privacy, v: boolean) {
    setPrivacy(p => ({ ...p, [k]: v }))
  }

  const [jobType, setJobType] = useState<string[]>(['Full-time'])
  const [workMode, setWorkMode] = useState<string[]>(['Remote', 'Hybrid'])
  const [locations, setLocations] = useState<string[]>(['Bangalore', 'Mumbai'])
  const [salaryRange, setSalaryRange] = useState<[number, number]>([8, 25])
  const [experience, setExperience] = useState('2-5 years')
  const [industry, setIndustry] = useState('Technology')
  const [noticePeriod, setNoticePeriod] = useState('Immediately')

  const [deleteHov, setDeleteHov] = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState(false)

  function save(section: string) {
    toast.success(`${section} settings saved!`)
  }

  function handleDeleteAccount() {
    if (!deleteConfirm) {
      setDeleteConfirm(true)
      toast.warning('Click "Delete Account" again to permanently delete your account.')
      setTimeout(() => setDeleteConfirm(false), 5000)
    } else {
      toast.error('Account deletion is disabled in demo mode.')
      setDeleteConfirm(false)
    }
  }

  return (
    <div style={{ minHeight: '100%', background: C.bg, padding: pad, fontFamily: 'system-ui, sans-serif' }}>

      {/* Header */}
      <div style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
          <div style={{
            width: '36px', height: '36px', borderRadius: '10px',
            background: C.purpleDim, border: `1px solid ${C.purple}40`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Settings size={17} color={C.purple} />
          </div>
          <div>
            <h1 style={{ margin: 0, fontSize: isMobile ? '18px' : '22px', fontWeight: 700, color: C.text }}>Settings</h1>
            <p style={{ margin: 0, fontSize: '12px', color: C.sub }}>Manage your account, notifications, and preferences</p>
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>

        {/* Account */}
        <SectionCard title="Account" icon={<User size={17} color={C.purple} />} iconColor={C.purple}
          expanded={open.account} onToggle={() => toggle('account')} isMobile={isMobile}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{
              background: C.bg, border: `1px solid ${C.border}`, borderRadius: C.rSm,
              padding: '12px 14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px',
            }}>
              <div>
                <div style={{ fontSize: '11px', color: C.muted, marginBottom: '3px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Email Address</div>
                <div style={{ fontSize: '14px', fontWeight: 500, color: C.text }}>{email}</div>
              </div>
              <div style={{
                display: 'flex', alignItems: 'center', gap: '5px',
                background: C.greenDim, border: `1px solid ${C.green}30`,
                borderRadius: '20px', padding: '3px 10px',
                fontSize: '11px', color: C.green, fontWeight: 600,
              }}>
                <CheckCircle size={11} fill={C.green} /> Verified
              </div>
            </div>

            <div style={{
              background: C.bg, border: `1px solid ${C.border}`, borderRadius: C.rSm, padding: '14px',
            }}>
              <div style={{ fontSize: '13px', fontWeight: 600, color: C.text, marginBottom: '4px' }}>Password</div>
              <div style={{ fontSize: '12px', color: C.muted, marginBottom: '12px' }}>
                Last changed 3 months ago. We recommend updating it regularly.
              </div>
              <button
                onMouseEnter={() => setHovPass(true)}
                onMouseLeave={() => setHovPass(false)}
                onClick={() => toast.info('Password reset link sent to your email!')}
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: '6px',
                  padding: '8px 16px', borderRadius: '8px',
                  background: hovPass ? C.purpleDim : C.bg,
                  border: `1px solid ${hovPass ? C.purple : C.border}`,
                  color: hovPass ? C.purple : C.sub,
                  fontSize: '13px', fontWeight: 500, cursor: 'pointer', transition: 'all 0.2s',
                }}
              >
                <Lock size={13} /> Change Password
              </button>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <SaveBtn onClick={() => save('Account')} />
            </div>
          </div>
        </SectionCard>

        {/* Notifications */}
        <SectionCard title="Notifications" icon={<Bell size={17} color={C.amber} />} iconColor={C.amber}
          expanded={open.notifications} onToggle={() => toggle('notifications')} isMobile={isMobile}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <SubLabel icon={<Mail size={12} color={C.purple} />} label="Email Notifications" />
            <ToggleRow label="New Job Recommendations" sub="Get jobs matching your profile" on={notifs.emailJobs} onChange={v => setNotif('emailJobs', v)} />
            <Divider />
            <ToggleRow label="Application Status Updates" sub="When your status changes" on={notifs.emailApplications} onChange={v => setNotif('emailApplications', v)} />
            <Divider />
            <ToggleRow label="New Messages from Recruiters" on={notifs.emailMessages} onChange={v => setNotif('emailMessages', v)} />
            <Divider />
            <ToggleRow label="Weekly Career Digest" sub="Job market insights every Monday" on={notifs.weeklyDigest} onChange={v => setNotif('weeklyDigest', v)} />
            <Divider />
            <ToggleRow label="Marketing & Offers" sub="Promotions, webinars, new features" on={notifs.marketingEmails} onChange={v => setNotif('marketingEmails', v)} />

            <div style={{ height: '12px' }} />
            <SubLabel icon={<Smartphone size={12} color={C.cyan} />} label="Push Notifications" />
            <ToggleRow label="Job Alerts" on={notifs.pushJobs} onChange={v => setNotif('pushJobs', v)} />
            <Divider />
            <ToggleRow label="Application Updates" on={notifs.pushApplications} onChange={v => setNotif('pushApplications', v)} />
            <Divider />
            <ToggleRow label="Chat Messages" on={notifs.pushMessages} onChange={v => setNotif('pushMessages', v)} />

            <div style={{ height: '12px' }} />
            <SubLabel icon={<MessageSquare size={12} color={C.green} />} label="SMS Notifications" />
            <ToggleRow label="OTP & Login Alerts" sub="Always enabled for security" on={notifs.smsOtp} onChange={() => toast.info('OTP alerts cannot be disabled.')} />
            <Divider />
            <ToggleRow label="Interview Reminders via SMS" on={notifs.smsAlerts} onChange={v => setNotif('smsAlerts', v)} />

            <div style={{ marginTop: '16px', display: 'flex', justifyContent: 'flex-end' }}>
              <SaveBtn onClick={() => save('Notification')} />
            </div>
          </div>
        </SectionCard>

        {/* Privacy */}
        <SectionCard title="Privacy" icon={<Shield size={17} color={C.green} />} iconColor={C.green}
          expanded={open.privacy} onToggle={() => toggle('privacy')} isMobile={isMobile}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <ToggleRow label="Public Profile" sub="Recruiters and companies can find you" on={privacy.profilePublic} onChange={v => setPriv('profilePublic', v)} />
            <Divider />
            <ToggleRow label="Show Email on Profile" sub="Visible to verified recruiters only" on={privacy.showEmail} onChange={v => setPriv('showEmail', v)} />
            <Divider />
            <ToggleRow label="Show Phone Number" on={privacy.showPhone} onChange={v => setPriv('showPhone', v)} />
            <Divider />
            <ToggleRow label="Allow Recruiter Direct Contact" sub="Recruiters can send you messages" on={privacy.allowRecruiterContact} onChange={v => setPriv('allowRecruiterContact', v)} />
            <Divider />
            <ToggleRow label="Show Online Status" sub="Let recruiters see when you are active" on={privacy.showOnlineStatus} onChange={v => setPriv('showOnlineStatus', v)} />
            <Divider />
            <ToggleRow label="Share Activity Data for Improvements" sub="Anonymous usage data to improve LYU" on={privacy.shareActivityData} onChange={v => setPriv('shareActivityData', v)} />
            <div style={{ marginTop: '16px', display: 'flex', justifyContent: 'flex-end' }}>
              <SaveBtn onClick={() => save('Privacy')} />
            </div>
          </div>
        </SectionCard>

        {/* Job Preferences */}
        <SectionCard title="Job Preferences" icon={<Briefcase size={17} color={C.cyan} />} iconColor={C.cyan}
          expanded={open.preferences} onToggle={() => toggle('preferences')} isMobile={isMobile}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            <TagSelect
              label="Job Type"
              options={['Full-time', 'Part-time', 'Contract', 'Internship', 'Freelance']}
              selected={jobType}
              onChange={setJobType}
            />
            <TagSelect
              label="Work Mode"
              options={['Remote', 'Hybrid', 'In-office', 'Flexible']}
              selected={workMode}
              onChange={setWorkMode}
            />
            <TagSelect
              label="Preferred Locations"
              options={['Bangalore', 'Mumbai', 'Delhi NCR', 'Hyderabad', 'Pune', 'Chennai', 'Kolkata', 'Pan India']}
              selected={locations}
              onChange={setLocations}
            />
            <SalarySlider value={salaryRange} onChange={setSalaryRange} />
            <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '14px' }}>
              <SelectField
                label="Experience Level"
                value={experience}
                onChange={setExperience}
                options={['Fresher (0-1 year)', '1-2 years', '2-5 years', '5-10 years', '10+ years']}
              />
              <SelectField
                label="Industry"
                value={industry}
                onChange={setIndustry}
                options={['Technology', 'Finance / Fintech', 'E-commerce', 'Healthcare', 'EdTech', 'Government / PSU', 'Consulting', 'Other']}
              />
            </div>
            <SelectField
              label="Notice Period / Availability"
              value={noticePeriod}
              onChange={setNoticePeriod}
              options={['Immediately', '15 days', '30 days', '60 days', '90 days', 'Currently employed']}
            />
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <SaveBtn onClick={() => save('Job Preferences')} />
            </div>
          </div>
        </SectionCard>

        {/* Appearance */}
        <SectionCard title="Appearance" icon={<Palette size={17} color={C.purple} />} iconColor={C.purple}
          expanded={open.appearance} onToggle={() => toggle('appearance')} isMobile={isMobile}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div>
              <label style={{ fontSize: '11px', fontWeight: 600, color: C.sub, textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: '10px' }}>
                Theme
              </label>
              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                {[
                  { label: 'Dark', icon: <Monitor size={16} />, active: true },
                  { label: 'Light', icon: <Monitor size={16} />, active: false },
                  { label: 'System', icon: <Laptop size={16} />, active: false },
                ].map(t => (
                  <button
                    key={t.label}
                    onClick={() => t.label !== 'Dark' && toast.info('Only Dark theme is available in this version.')}
                    style={{
                      display: 'flex', alignItems: 'center', gap: '8px',
                      padding: '10px 16px', borderRadius: '10px', cursor: 'pointer',
                      background: t.active ? C.purpleDim : C.bg,
                      border: `2px solid ${t.active ? C.purple : C.border}`,
                      color: t.active ? C.purple : C.sub,
                      fontSize: '13px', fontWeight: t.active ? 600 : 400,
                      transition: 'all 0.2s',
                    }}
                  >
                    {t.icon} {t.label}
                    {t.active && (
                      <span style={{
                        fontSize: '10px', background: C.purple, color: '#fff',
                        padding: '1px 6px', borderRadius: '99px', marginLeft: '2px',
                      }}>Active</span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            <div style={{
              background: C.bg, border: `1px solid ${C.border}`, borderRadius: C.rSm,
              padding: '14px', display: 'flex', alignItems: 'center', gap: '14px',
            }}>
              <div style={{
                width: '48px', height: '48px', borderRadius: '10px',
                background: C.purpleDim, border: `1px solid ${C.purple}40`,
                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
              }}>
                <Palette size={22} color={C.purple} />
              </div>
              <div>
                <div style={{ fontSize: '13px', fontWeight: 600, color: C.text, marginBottom: '2px' }}>
                  LYU Dark Theme
                </div>
                <div style={{ fontSize: '11px', color: C.muted }}>
                  Deep navy background · Purple & cyan accents · Optimized for late-night job hunting
                </div>
              </div>
            </div>
          </div>
        </SectionCard>

        {/* Danger Zone */}
        <SectionCard title="Danger Zone" icon={<AlertTriangle size={17} color={C.red} />} iconColor={C.red}
          expanded={open.danger} onToggle={() => toggle('danger')} isMobile={isMobile}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div style={{
              background: C.bg, border: `1px solid ${C.border}`, borderRadius: C.rSm,
              padding: '14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              flexWrap: 'wrap', gap: '12px',
            }}>
              <div>
                <div style={{ fontSize: '13px', fontWeight: 600, color: C.text, marginBottom: '3px' }}>Deactivate Account</div>
                <div style={{ fontSize: '12px', color: C.muted }}>
                  Temporarily hide your profile. You can reactivate anytime.
                </div>
              </div>
              <button
                onClick={() => toast.warning('Account deactivation is disabled in demo mode.')}
                style={{
                  padding: '8px 16px', borderRadius: '8px', border: `1px solid ${C.border}`,
                  background: C.bg, color: C.sub, fontSize: '12px', fontWeight: 500,
                  cursor: 'pointer', whiteSpace: 'nowrap',
                }}
              >
                Deactivate
              </button>
            </div>

            <div style={{
              background: C.bg, border: `1px solid ${C.border}`, borderRadius: C.rSm,
              padding: '14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              flexWrap: 'wrap', gap: '12px',
            }}>
              <div>
                <div style={{ fontSize: '13px', fontWeight: 600, color: C.text, marginBottom: '3px' }}>Download My Data</div>
                <div style={{ fontSize: '12px', color: C.muted }}>
                  Export all your profile, applications, and messages as a ZIP file.
                </div>
              </div>
              <button
                onClick={() => toast.info('Your data export has been queued. We will email you within 24 hours.')}
                style={{
                  padding: '8px 16px', borderRadius: '8px', border: `1px solid ${C.border}`,
                  background: C.bg, color: C.sub, fontSize: '12px', fontWeight: 500,
                  cursor: 'pointer', whiteSpace: 'nowrap',
                }}
              >
                Export Data
              </button>
            </div>

            <div style={{
              background: C.redDim, border: `1px solid ${C.red}35`, borderRadius: C.rSm,
              padding: '16px',
            }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', marginBottom: '12px' }}>
                <AlertTriangle size={16} color={C.red} style={{ flexShrink: 0, marginTop: '2px' }} />
                <div>
                  <div style={{ fontSize: '13px', fontWeight: 700, color: C.red, marginBottom: '4px' }}>
                    Delete Account Permanently
                  </div>
                  <div style={{ fontSize: '12px', color: C.sub, lineHeight: 1.6 }}>
                    This will permanently delete your account, profile, all applications, saved jobs, messages, and career AI history.{' '}
                    <strong style={{ color: C.text }}>This action cannot be undone.</strong>
                  </div>
                </div>
              </div>
              <motion.button
                onClick={handleDeleteAccount}
                onHoverStart={() => setDeleteHov(true)}
                onHoverEnd={() => setDeleteHov(false)}
                whileTap={{ scale: 0.97 }}
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: '7px',
                  padding: '10px 20px', borderRadius: '9px', border: 'none',
                  background: deleteConfirm ? C.red : (deleteHov ? '#dc2626' : '#b91c1c'),
                  color: '#fff', fontSize: '13px', fontWeight: 700,
                  cursor: 'pointer', transition: 'background 0.2s',
                  boxShadow: deleteHov ? `0 0 0 3px ${C.redDim}` : 'none',
                }}
              >
                <Trash2 size={14} />
                {deleteConfirm ? 'Confirm — Delete My Account' : 'Delete Account'}
              </motion.button>
              {deleteConfirm && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  style={{ margin: '8px 0 0', fontSize: '11px', color: C.red }}
                >
                  ⚠ Click again to confirm. This is irreversible.
                </motion.p>
              )}
            </div>
          </div>
        </SectionCard>

      </div>

      <style>{`
        select option { background: ${C.card}; color: ${C.text}; }
        ::-webkit-scrollbar { width: 5px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: ${C.border}; border-radius: 99px; }
      `}</style>
    </div>
  )
}
