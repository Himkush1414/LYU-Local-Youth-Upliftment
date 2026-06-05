'use client'

import { useState } from 'react'
import Link from 'next/link'

const skills = ['React', 'JavaScript', 'TypeScript', 'Node.js', 'CSS', 'Git']
const education = [{ degree: 'B.Tech Computer Science', institution: 'PEC Chandigarh', year: '2022', grade: '8.2 CGPA' }]
const experience = [{ role: 'Frontend Developer Intern', company: 'TechStartup', duration: 'Jan 2022 – Jun 2022', desc: 'Built React components and improved site performance by 40%.' }]
const completion = 62

export default function SeekerProfilePage() {
  const [openToWork, setOpenToWork] = useState(true)
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  const faqItems = [
    { title: 'How does profile completion affect my applications?', content: 'Employers see your completion score. Profiles above 80% get 3x more interview calls.' },
    { title: 'Can employers see my phone number?', content: 'No. Your phone number is only shared after an employer shortlists you and you accept the conversation.' },
    { title: 'How is my match score calculated?', content: 'Your match score is based on how many required skills you have, your experience level, and location proximity.' },
  ]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20, maxWidth: 720, fontFamily: 'Inter, system-ui, sans-serif' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
        <h1 style={{ fontSize: 22, fontWeight: 900, color: '#0f172a' }}>My Profile</h1>
        <Link href="/seeker/settings/account" style={{ display: 'inline-flex', alignItems: 'center', gap: 7, fontSize: 13, fontWeight: 600, color: '#374151', background: 'white', border: '1.5px solid #e2e8f0', padding: '8px 16px', borderRadius: 10, textDecoration: 'none' }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
          Edit Profile
        </Link>
      </div>

      {/* Header card */}
      <div style={{ background: 'white', borderRadius: 16, border: '1px solid #e2e8f0', overflow: 'hidden', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
        <div style={{ height: 80, background: 'linear-gradient(135deg,#2563eb,#4f46e5)' }} />
        <div style={{ padding: '0 24px 24px' }}>
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 14, marginTop: -28 }}>
            <div style={{ width: 64, height: 64, borderRadius: 16, background: 'linear-gradient(135deg,#2563eb,#4f46e5)', border: '4px solid white', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
              <span style={{ color: 'white', fontWeight: 900, fontSize: 22 }}>RS</span>
            </div>
            <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', marginBottom: 8 }}>
              <span style={{ fontSize: 13, fontWeight: 600, color: '#374151' }}>Open to Work</span>
              <div onClick={() => setOpenToWork(!openToWork)}
                style={{ width: 42, height: 24, borderRadius: 12, background: openToWork ? '#22c55e' : '#cbd5e1', position: 'relative', cursor: 'pointer', transition: 'background 0.2s' }}>
                <div style={{ position: 'absolute', top: 3, left: openToWork ? 20 : 3, width: 18, height: 18, background: 'white', borderRadius: '50%', boxShadow: '0 1px 4px rgba(0,0,0,0.15)', transition: 'left 0.2s' }} />
              </div>
            </label>
          </div>
          <h2 style={{ fontSize: 20, fontWeight: 900, color: '#0f172a' }}>Rahul Sharma</h2>
          <p style={{ color: '#64748b', fontSize: 14, marginTop: 2 }}>React Developer | 2 yrs exp</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 14, marginTop: 12 }}>
            {[
              { icon: <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>, text: 'Chandigarh, Punjab' },
              { icon: <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>, text: 'rahul@example.com' },
            ].map(item => (
              <span key={item.text} style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, color: '#64748b' }}>
                <span style={{ color: '#94a3b8' }}>{item.icon}</span> {item.text}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Completion */}
      <div style={{ background: 'white', borderRadius: 16, border: '1px solid #e2e8f0', padding: '18px 20px', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
          <div>
            <p style={{ fontWeight: 700, color: '#0f172a', fontSize: 14 }}>Profile Completion</p>
            <p style={{ fontSize: 12, color: '#94a3b8', marginTop: 2 }}>Add more details to attract employers</p>
          </div>
          <span style={{ fontSize: 22, fontWeight: 900, color: '#2563eb' }}>{completion}%</span>
        </div>
        <div style={{ height: 6, background: '#f1f5f9', borderRadius: 9999, overflow: 'hidden' }}>
          <div style={{ height: '100%', width: `${completion}%`, background: 'linear-gradient(90deg,#2563eb,#6366f1)', borderRadius: 9999, transition: 'width 0.5s' }} />
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7, marginTop: 12 }}>
          {['Add phone number', 'Upload resume', 'Add work experience'].map(task => (
            <Link key={task} href="/seeker/settings/account" style={{ fontSize: 11, fontWeight: 700, color: '#c2410c', background: '#fff7ed', border: '1px solid #fed7aa', padding: '4px 11px', borderRadius: 9999, textDecoration: 'none' }}>
              + {task}
            </Link>
          ))}
        </div>
      </div>

      {/* Skills */}
      <div style={{ background: 'white', borderRadius: 16, border: '1px solid #e2e8f0', padding: '18px 20px', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
          <h3 style={{ fontWeight: 800, color: '#0f172a', fontSize: 15, display: 'flex', alignItems: 'center', gap: 8 }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14M4.93 4.93a10 10 0 0 0 0 14.14"/></svg>
            Skills
          </h3>
          <button style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 12, fontWeight: 700, color: '#2563eb', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            Add Skill
          </button>
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7 }}>
          {skills.map(s => (
            <span key={s} style={{ fontSize: 12, fontWeight: 600, color: '#1d4ed8', background: '#eff6ff', border: '1px solid #bfdbfe', padding: '5px 12px', borderRadius: 9999 }}>{s}</span>
          ))}
        </div>
      </div>

      {/* Experience */}
      <div style={{ background: 'white', borderRadius: 16, border: '1px solid #e2e8f0', padding: '18px 20px', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
          <h3 style={{ fontWeight: 800, color: '#0f172a', fontSize: 15, display: 'flex', alignItems: 'center', gap: 8 }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#7c3aed" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>
            Experience
          </h3>
          <button style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 12, fontWeight: 700, color: '#2563eb', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            Add
          </button>
        </div>
        {experience.map(exp => (
          <div key={exp.company} style={{ borderLeft: '3px solid #dbeafe', paddingLeft: 14 }}>
            <p style={{ fontWeight: 700, color: '#0f172a', fontSize: 14 }}>{exp.role}</p>
            <p style={{ fontSize: 12, color: '#64748b', marginTop: 2 }}>{exp.company} · {exp.duration}</p>
            <p style={{ fontSize: 12, color: '#475569', marginTop: 6, lineHeight: 1.6 }}>{exp.desc}</p>
          </div>
        ))}
      </div>

      {/* Education */}
      <div style={{ background: 'white', borderRadius: 16, border: '1px solid #e2e8f0', padding: '18px 20px', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
          <h3 style={{ fontWeight: 800, color: '#0f172a', fontSize: 15, display: 'flex', alignItems: 'center', gap: 8 }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>
            Education
          </h3>
          <button style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 12, fontWeight: 700, color: '#2563eb', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            Add
          </button>
        </div>
        {education.map(edu => (
          <div key={edu.institution} style={{ borderLeft: '3px solid #bbf7d0', paddingLeft: 14 }}>
            <p style={{ fontWeight: 700, color: '#0f172a', fontSize: 14 }}>{edu.degree}</p>
            <p style={{ fontSize: 12, color: '#64748b', marginTop: 2 }}>{edu.institution} · {edu.year}</p>
            <p style={{ fontSize: 12, color: '#94a3b8', marginTop: 2 }}>{edu.grade}</p>
          </div>
        ))}
      </div>

      {/* FAQ */}
      <div>
        <h3 style={{ fontWeight: 800, color: '#0f172a', fontSize: 15, marginBottom: 12 }}>Profile FAQ</h3>
        <div style={{ borderRadius: 16, border: '1px solid #e2e8f0', background: 'white', overflow: 'hidden' }}>
          {faqItems.map((item, i) => (
            <div key={i} style={{ borderBottom: i < faqItems.length - 1 ? '1px solid #f1f5f9' : 'none' }}>
              <button onClick={() => setOpenFaq(openFaq === i ? null : i)}
                style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '15px 20px', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit', textAlign: 'left' }}>
                <span style={{ fontWeight: 600, color: '#0f172a', fontSize: 13 }}>{item.title}</span>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
                  style={{ flexShrink: 0, transform: openFaq === i ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}>
                  <polyline points="6 9 12 15 18 9"/>
                </svg>
              </button>
              {openFaq === i && (
                <div style={{ padding: '0 20px 14px', fontSize: 13, color: '#475569', lineHeight: 1.7 }}>{item.content}</div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
