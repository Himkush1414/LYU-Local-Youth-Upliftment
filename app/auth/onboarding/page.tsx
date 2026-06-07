'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

type Role = 'seeker' | 'recruiter' | null;

// ─── Step types ───────────────────────────────────────────────────────────────
interface SeekerData {
  headline: string;
  currentStatus: string;
  experience: string;
  skills: string[];
  education: string;
  preferredRoles: string[];
  workMode: string[];
  location: string;
  expectedSalary: string;
  openToOpportunities: string;
}

interface RecruiterData {
  company: string;
  industry: string;
  companySize: string;
  hiringFor: string[];
  hiringVolume: string;
  location: string;
}

const SKILLS_OPTIONS = [
  'JavaScript', 'TypeScript', 'React', 'Next.js', 'Node.js', 'Python', 'Java',
  'SQL', 'AWS', 'Docker', 'Figma', 'UI/UX Design', 'Data Science', 'Machine Learning',
  'Product Management', 'Digital Marketing', 'Content Writing', 'Sales', 'Finance',
  'Accounting', 'HR', 'Operations', 'Business Development', 'Android', 'iOS', 'Flutter',
];

const ROLE_OPTIONS = [
  'Software Engineer', 'Frontend Developer', 'Backend Developer', 'Full Stack Developer',
  'Data Analyst', 'Data Scientist', 'Product Manager', 'UI/UX Designer',
  'DevOps Engineer', 'Business Analyst', 'Marketing Manager', 'Sales Executive',
  'HR Manager', 'Financial Analyst', 'Content Writer', 'Graphic Designer',
];

const INDUSTRY_OPTIONS = [
  'Technology / IT', 'Fintech / Banking', 'E-commerce', 'EdTech', 'Healthcare',
  'Manufacturing', 'Consulting', 'Media & Entertainment', 'Government / PSU',
  'Startup', 'FMCG / Retail', 'Real Estate', 'Logistics', 'Other',
];

// ─── Pill Tag component ───────────────────────────────────────────────────────
function PillSelect({
  options, selected, onChange, max,
}: { options: string[]; selected: string[]; onChange: (v: string[]) => void; max?: number }) {
  function toggle(o: string) {
    if (selected.includes(o)) {
      onChange(selected.filter(x => x !== o));
    } else {
      if (max && selected.length >= max) return;
      onChange([...selected, o]);
    }
  }
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
      {options.map(o => {
        const active = selected.includes(o);
        const disabled = !active && max !== undefined && selected.length >= max;
        return (
          <button key={o} onClick={() => toggle(o)} disabled={disabled} style={{
            padding: '7px 14px', borderRadius: 20, fontSize: 13, cursor: disabled ? 'not-allowed' : 'pointer',
            background: active ? 'rgba(108,99,255,0.15)' : 'rgba(255,255,255,0.04)',
            border: `1px solid ${active ? '#6c63ff' : 'rgba(255,255,255,0.1)'}`,
            color: active ? '#a5b4fc' : 'rgba(241,245,249,0.5)',
            fontWeight: active ? 600 : 400,
            opacity: disabled ? 0.4 : 1,
            transition: 'all 0.15s',
          }}>{o}</button>
        );
      })}
    </div>
  );
}

// ─── Input field ─────────────────────────────────────────────────────────────
function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <label style={{ fontSize: 13, fontWeight: 600, color: 'rgba(241,245,249,0.7)', letterSpacing: '0.01em' }}>
        {label}
        {hint && <span style={{ fontWeight: 400, color: 'rgba(241,245,249,0.35)', marginLeft: 6 }}>{hint}</span>}
      </label>
      {children}
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  width: '100%', background: 'rgba(255,255,255,0.04)',
  border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10,
  padding: '11px 14px', color: '#f1f5f9',
  fontFamily: 'system-ui, sans-serif', fontSize: 14, outline: 'none',
};

const selectStyle: React.CSSProperties = {
  ...inputStyle,
  appearance: 'none',
  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23475569' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E")`,
  backgroundRepeat: 'no-repeat', backgroundPosition: 'right 12px center', paddingRight: 36,
  cursor: 'pointer',
};

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function OnboardingPage() {
  const router = useRouter();
  const [role, setRole] = useState<Role>(null);
  const [step, setStep] = useState(0); // 0=role select, 1..N = questions
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [userName, setUserName] = useState('');
  const [vw, setVw] = useState(1280);

  useEffect(() => {
    const update = () => setVw(window.innerWidth);
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  const isMobile = vw < 640;

  const supabase = createClient();

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) { router.replace('/auth/login'); return; }
      setUserName(user.user_metadata?.full_name?.split(' ')[0] || user.email?.split('@')[0] || 'there');
    });
  }, []);

  // ── Seeker data ──
  const [seeker, setSeeker] = useState<SeekerData>({
    headline: '', currentStatus: '', experience: '',
    skills: [], education: '', preferredRoles: [],
    workMode: [], location: '', expectedSalary: '', openToOpportunities: '',
  });

  // ── Recruiter data ──
  const [recruiter, setRecruiter] = useState<RecruiterData>({
    company: '', industry: '', companySize: '',
    hiringFor: [], hiringVolume: '', location: '',
  });

  // ── Seeker steps ──
  const seekerSteps = [
    {
      title: 'Your professional headline',
      subtitle: 'This appears on your profile and helps recruiters find you.',
      content: (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          <Field label="Current or desired job title">
            <input style={inputStyle} placeholder="e.g. Full Stack Developer, Data Analyst, MBA Graduate" value={seeker.headline} onChange={e => setSeeker(s => ({ ...s, headline: e.target.value }))} />
          </Field>
          <Field label="What's your current status?">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {[
                { val: 'actively_looking', label: '🔍 Actively looking for a job', sub: 'Open to all opportunities right now' },
                { val: 'open', label: '👀 Open to opportunities', sub: 'Not urgent, but would consider the right role' },
                { val: 'employed', label: '💼 Currently employed', sub: 'Happy where I am, not looking' },
                { val: 'student', label: '🎓 Student / Fresher', sub: 'About to graduate or just entered the market' },
              ].map(opt => (
                <div key={opt.val} onClick={() => setSeeker(s => ({ ...s, currentStatus: opt.val }))} style={{
                  padding: '12px 14px', borderRadius: 10, cursor: 'pointer',
                  border: `1px solid ${seeker.currentStatus === opt.val ? '#6c63ff' : 'rgba(255,255,255,0.08)'}`,
                  background: seeker.currentStatus === opt.val ? 'rgba(108,99,255,0.1)' : 'rgba(255,255,255,0.02)',
                  transition: 'all 0.15s',
                }}>
                  <div style={{ fontSize: 14, fontWeight: 600, color: '#f1f5f9' }}>{opt.label}</div>
                  <div style={{ fontSize: 12, color: 'rgba(241,245,249,0.4)', marginTop: 2 }}>{opt.sub}</div>
                </div>
              ))}
            </div>
          </Field>
        </div>
      ),
      valid: () => seeker.headline.trim().length > 2 && seeker.currentStatus !== '',
    },
    {
      title: 'Experience & Education',
      subtitle: 'Help us match you with the right opportunities.',
      content: (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          <Field label="Years of experience">
            <select style={selectStyle} value={seeker.experience} onChange={e => setSeeker(s => ({ ...s, experience: e.target.value }))}>
              <option value="">Select experience level</option>
              <option value="fresher">Fresher (0–1 year)</option>
              <option value="1-2">1–2 years</option>
              <option value="2-5">2–5 years</option>
              <option value="5-10">5–10 years</option>
              <option value="10+">10+ years</option>
            </select>
          </Field>
          <Field label="Highest education">
            <select style={selectStyle} value={seeker.education} onChange={e => setSeeker(s => ({ ...s, education: e.target.value }))}>
              <option value="">Select education level</option>
              <option value="10th">10th / SSC</option>
              <option value="12th">12th / HSC / Diploma</option>
              <option value="bachelors">Bachelor's Degree (B.Tech / B.Sc / BCA / BA / BBA)</option>
              <option value="masters">Master's Degree (M.Tech / MBA / MCA / M.Sc)</option>
              <option value="phd">PhD / Doctorate</option>
            </select>
          </Field>
          <Field label="Current location">
            <input style={inputStyle} placeholder="e.g. Bangalore, Mumbai, Delhi NCR, Pune" value={seeker.location} onChange={e => setSeeker(s => ({ ...s, location: e.target.value }))} />
          </Field>
        </div>
      ),
      valid: () => seeker.experience !== '' && seeker.education !== '' && seeker.location.trim().length > 1,
    },
    {
      title: 'Your skills',
      subtitle: 'Select up to 10 skills that best represent your expertise.',
      content: (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ fontSize: 12, color: 'rgba(241,245,249,0.35)' }}>
            {seeker.skills.length}/10 selected
          </div>
          <PillSelect options={SKILLS_OPTIONS} selected={seeker.skills} onChange={v => setSeeker(s => ({ ...s, skills: v }))} max={10} />
        </div>
      ),
      valid: () => seeker.skills.length >= 1,
    },
    {
      title: 'Job preferences',
      subtitle: 'Tell us what kind of roles and work setup you\'re looking for.',
      content: (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          <Field label="Preferred roles" hint="(pick up to 5)">
            <PillSelect options={ROLE_OPTIONS} selected={seeker.preferredRoles} onChange={v => setSeeker(s => ({ ...s, preferredRoles: v }))} max={5} />
          </Field>
          <Field label="Work mode preference">
            <PillSelect options={['Remote', 'Hybrid', 'In-office', 'Flexible']} selected={seeker.workMode} onChange={v => setSeeker(s => ({ ...s, workMode: v }))} />
          </Field>
          <Field label="Expected salary (LPA)">
            <select style={selectStyle} value={seeker.expectedSalary} onChange={e => setSeeker(s => ({ ...s, expectedSalary: e.target.value }))}>
              <option value="">Select range</option>
              <option value="0-3">₹0 – ₹3 LPA (Fresher / Internship)</option>
              <option value="3-6">₹3 – ₹6 LPA</option>
              <option value="6-10">₹6 – ₹10 LPA</option>
              <option value="10-15">₹10 – ₹15 LPA</option>
              <option value="15-25">₹15 – ₹25 LPA</option>
              <option value="25-50">₹25 – ₹50 LPA</option>
              <option value="50+">₹50+ LPA</option>
            </select>
          </Field>
        </div>
      ),
      valid: () => seeker.preferredRoles.length >= 1 && seeker.workMode.length >= 1 && seeker.expectedSalary !== '',
    },
  ];

  // ── Recruiter steps ──
  const recruiterSteps = [
    {
      title: 'About your company',
      subtitle: 'Tell candidates where they\'ll be working.',
      content: (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          <Field label="Company name">
            <input style={inputStyle} placeholder="e.g. Razorpay, Infosys, Your Startup Name" value={recruiter.company} onChange={e => setRecruiter(r => ({ ...r, company: e.target.value }))} />
          </Field>
          <Field label="Industry">
            <select style={selectStyle} value={recruiter.industry} onChange={e => setRecruiter(r => ({ ...r, industry: e.target.value }))}>
              <option value="">Select industry</option>
              {INDUSTRY_OPTIONS.map(i => <option key={i} value={i}>{i}</option>)}
            </select>
          </Field>
          <Field label="Company size">
            <select style={selectStyle} value={recruiter.companySize} onChange={e => setRecruiter(r => ({ ...r, companySize: e.target.value }))}>
              <option value="">Select size</option>
              <option value="1-10">1–10 employees (Early startup)</option>
              <option value="11-50">11–50 employees (Startup)</option>
              <option value="51-200">51–200 employees (Growth stage)</option>
              <option value="201-1000">201–1,000 employees (Mid-size)</option>
              <option value="1000+">1,000+ employees (Enterprise / MNC)</option>
            </select>
          </Field>
          <Field label="Company location / HQ">
            <input style={inputStyle} placeholder="e.g. Bangalore, Mumbai, Pan India" value={recruiter.location} onChange={e => setRecruiter(r => ({ ...r, location: e.target.value }))} />
          </Field>
        </div>
      ),
      valid: () => recruiter.company.trim().length > 1 && recruiter.industry !== '' && recruiter.companySize !== '',
    },
    {
      title: 'Your hiring needs',
      subtitle: 'Help us surface the right candidates for you.',
      content: (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          <Field label="What roles are you hiring for?" hint="(pick up to 6)">
            <PillSelect options={ROLE_OPTIONS} selected={recruiter.hiringFor} onChange={v => setRecruiter(r => ({ ...r, hiringFor: v }))} max={6} />
          </Field>
          <Field label="Hiring volume in next 3 months">
            <select style={selectStyle} value={recruiter.hiringVolume} onChange={e => setRecruiter(r => ({ ...r, hiringVolume: e.target.value }))}>
              <option value="">Select volume</option>
              <option value="1-5">1–5 hires</option>
              <option value="6-20">6–20 hires</option>
              <option value="21-50">21–50 hires</option>
              <option value="50+">50+ hires</option>
            </select>
          </Field>
        </div>
      ),
      valid: () => recruiter.hiringFor.length >= 1 && recruiter.hiringVolume !== '',
    },
  ];

  const steps = role === 'seeker' ? seekerSteps : recruiterSteps;
  const totalSteps = steps.length;
  const currentStep = steps[step - 1];
  const isLastStep = step === totalSteps;

  // ── Submit ──
  const handleSubmit = async () => {
    setLoading(true);
    setError('');
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.replace('/auth/login'); return; }

      const profileData = role === 'seeker'
        ? {
            id: user.id,
            role: 'seeker',
            email: user.email,
            full_name: user.user_metadata?.full_name || '',
            headline: seeker.headline,
            current_status: seeker.currentStatus,
            experience: seeker.experience,
            education: seeker.education,
            location: seeker.location,
            skills: seeker.skills,
            preferred_roles: seeker.preferredRoles,
            work_mode: seeker.workMode,
            expected_salary: seeker.expectedSalary,
            updated_at: new Date().toISOString(),
          }
        : {
            id: user.id,
            role: 'recruiter',
            email: user.email,
            full_name: user.user_metadata?.full_name || '',
            company: recruiter.company,
            industry: recruiter.industry,
            company_size: recruiter.companySize,
            hiring_for: recruiter.hiringFor,
            hiring_volume: recruiter.hiringVolume,
            location: recruiter.location,
            updated_at: new Date().toISOString(),
          };

      const { error: upsertError } = await supabase.from('profiles').upsert(profileData);
      if (upsertError) {
        setError(upsertError.message);
        setLoading(false);
        return;
      }
      router.replace(role === 'seeker' ? '/seeker/dashboard' : '/employer/dashboard');
    } catch (e) {
      setError('Something went wrong. Please try again.');
      setLoading(false);
    }
  };

  const handleNext = () => {
    if (isLastStep) { handleSubmit(); return; }
    setStep(s => s + 1);
  };

  // ── Progress ──
  const progress = step === 0 ? 0 : Math.round((step / totalSteps) * 100);

  return (
    <>
      <style>{`
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: system-ui, -apple-system, 'Segoe UI', sans-serif; -webkit-font-smoothing: antialiased; }
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        select option { background: #111118; color: #f1f5f9; }
        input:focus, select:focus { border-color: #6c63ff !important; box-shadow: 0 0 0 3px rgba(108,99,255,0.14); }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 99px; }
      `}</style>

      <div style={{ minHeight: '100vh', background: '#0a0a0f', display: 'flex', flexDirection: 'column', fontFamily: 'system-ui, sans-serif' }}>

        {/* Top bar with progress */}
        <div style={{ position: 'sticky', top: 0, zIndex: 50, background: 'rgba(10,10,15,0.9)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(255,255,255,0.06)', padding: '14px 24px' }}>
          <div style={{ maxWidth: 600, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ width: 28, height: 28, background: '#6c63ff', borderRadius: 7, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 13, color: '#fff' }}>L</div>
              <span style={{ fontWeight: 700, fontSize: 16, color: '#f1f5f9', letterSpacing: '-0.02em' }}>LYU</span>
            </div>
            {step > 0 && (
              <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ flex: 1, height: 4, background: 'rgba(255,255,255,0.08)', borderRadius: 99, overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${progress}%`, background: '#6c63ff', borderRadius: 99, transition: 'width 0.4s ease' }} />
                </div>
                <span style={{ fontSize: 12, color: 'rgba(241,245,249,0.4)', whiteSpace: 'nowrap', fontWeight: 500 }}>
                  {step}/{totalSteps}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Content */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: step === 0 ? 'center' : 'flex-start', padding: isMobile ? '32px 16px 100px' : '48px 24px 100px' }}>
          <div style={{ width: '100%', maxWidth: 560, animation: 'fadeUp 0.5s cubic-bezier(0.16,1,0.3,1) both' }}>

            {/* ── STEP 0: Role selection ── */}
            {step === 0 && (
              <div>
                <div style={{ marginBottom: 40, textAlign: 'center' }}>
                  <p style={{ fontSize: 13, fontWeight: 700, letterSpacing: '0.1em', color: '#6c63ff', textTransform: 'uppercase', marginBottom: 12 }}>Welcome to LYU{userName ? `, ${userName}` : ''}! 👋</p>
                  <h1 style={{ fontWeight: 800, fontSize: isMobile ? 28 : 36, color: '#f1f5f9', letterSpacing: '-0.03em', marginBottom: 10, lineHeight: 1.15 }}>
                    What brings you here?
                  </h1>
                  <p style={{ fontSize: 15, color: 'rgba(241,245,249,0.45)', lineHeight: 1.6 }}>
                    Choose your role and we'll personalize your entire experience.
                  </p>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                  {/* Job Seeker card */}
                  {[
                    {
                      id: 'seeker' as Role,
                      emoji: '🎯',
                      label: 'Job Seeker',
                      sub: 'I\'m looking for a job or internship',
                      bullets: ['AI Career Mentor', 'Personalized Learning Path', 'Resume Studio', 'Job Opportunities Feed', 'Application Tracker'],
                      color: '#6c63ff',
                    },
                    {
                      id: 'recruiter' as Role,
                      emoji: '🏢',
                      label: 'Recruiter / Employer',
                      sub: 'I\'m hiring for my company or team',
                      bullets: ['Smart Candidate Matching', 'Post Jobs in Minutes', 'AI-Screened Applicants', 'Talent Pool Access', 'Analytics Dashboard'],
                      color: '#06b6d4',
                    },
                  ].map(card => (
                    <div key={card.id} onClick={() => setRole(card.id)} style={{
                      padding: '22px 24px', borderRadius: 16, cursor: 'pointer',
                      border: `2px solid ${role === card.id ? card.color : 'rgba(255,255,255,0.08)'}`,
                      background: role === card.id ? `${card.color}0f` : 'rgba(255,255,255,0.02)',
                      transition: 'all 0.2s',
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 14 }}>
                        <div style={{ fontSize: 28 }}>{card.emoji}</div>
                        <div>
                          <div style={{ fontWeight: 700, fontSize: 17, color: '#f1f5f9' }}>{card.label}</div>
                          <div style={{ fontSize: 13, color: 'rgba(241,245,249,0.45)', marginTop: 2 }}>{card.sub}</div>
                        </div>
                        <div style={{ marginLeft: 'auto', width: 20, height: 20, borderRadius: '50%', border: `2px solid ${role === card.id ? card.color : 'rgba(255,255,255,0.2)'}`, background: role === card.id ? card.color : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.15s', flexShrink: 0 }}>
                          {role === card.id && <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>}
                        </div>
                      </div>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                        {card.bullets.map(b => (
                          <span key={b} style={{ fontSize: 11.5, padding: '3px 10px', borderRadius: 20, background: role === card.id ? `${card.color}18` : 'rgba(255,255,255,0.04)', border: `1px solid ${role === card.id ? card.color + '30' : 'rgba(255,255,255,0.08)'}`, color: role === card.id ? card.color : 'rgba(241,245,249,0.35)', fontWeight: 500 }}>{b}</span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                <button onClick={() => { if (role) setStep(1); }} disabled={!role} style={{
                  width: '100%', marginTop: 24, padding: '14px', borderRadius: 12, border: 'none',
                  background: role ? '#6c63ff' : 'rgba(255,255,255,0.06)',
                  color: role ? '#fff' : 'rgba(241,245,249,0.3)',
                  fontSize: 15, fontWeight: 600, cursor: role ? 'pointer' : 'not-allowed',
                  transition: 'all 0.2s',
                }}>
                  Continue as {role === 'seeker' ? 'Job Seeker' : role === 'recruiter' ? 'Recruiter' : '...'}
                  {role && ' →'}
                </button>
              </div>
            )}

            {/* ── STEPS 1+: Questions ── */}
            {step > 0 && currentStep && (
              <div key={step} style={{ animation: 'fadeUp 0.4s cubic-bezier(0.16,1,0.3,1) both' }}>
                <div style={{ marginBottom: 28 }}>
                  <p style={{ fontSize: 11.5, fontWeight: 700, letterSpacing: '0.1em', color: '#6c63ff', textTransform: 'uppercase', marginBottom: 10 }}>
                    Step {step} of {totalSteps}
                  </p>
                  <h2 style={{ fontWeight: 800, fontSize: isMobile ? 22 : 28, color: '#f1f5f9', letterSpacing: '-0.025em', marginBottom: 8, lineHeight: 1.2 }}>
                    {currentStep.title}
                  </h2>
                  <p style={{ fontSize: 14, color: 'rgba(241,245,249,0.42)', lineHeight: 1.6 }}>{currentStep.subtitle}</p>
                </div>

                <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, padding: isMobile ? '20px 16px' : '24px', marginBottom: 24 }}>
                  {currentStep.content}
                </div>

                {error && (
                  <div style={{ background: 'rgba(239,68,68,0.09)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 10, padding: '11px 14px', fontSize: 13, color: '#fca5a5', marginBottom: 16 }}>
                    {error}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Sticky bottom nav (for steps 1+) */}
        {step > 0 && (
          <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, background: 'rgba(10,10,15,0.95)', backdropFilter: 'blur(20px)', borderTop: '1px solid rgba(255,255,255,0.07)', padding: '16px 24px' }}>
            <div style={{ maxWidth: 560, margin: '0 auto', display: 'flex', gap: 12 }}>
              <button onClick={() => setStep(s => s - 1)} style={{ padding: '12px 20px', borderRadius: 10, border: '1px solid rgba(255,255,255,0.1)', background: 'transparent', color: 'rgba(241,245,249,0.6)', fontSize: 14, fontWeight: 500, cursor: 'pointer' }}>
                ← Back
              </button>
              <button
                onClick={handleNext}
                disabled={!currentStep?.valid() || loading}
                style={{
                  flex: 1, padding: '12px', borderRadius: 10, border: 'none',
                  background: currentStep?.valid() ? '#6c63ff' : 'rgba(255,255,255,0.06)',
                  color: currentStep?.valid() ? '#fff' : 'rgba(241,245,249,0.3)',
                  fontSize: 15, fontWeight: 600, cursor: currentStep?.valid() ? 'pointer' : 'not-allowed',
                  transition: 'all 0.2s', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                }}
              >
                {loading ? (
                  <><div style={{ width: 16, height: 16, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} /> Setting up...</>
                ) : isLastStep ? '🚀 Complete Setup' : 'Continue →'}
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
