'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { toast } from 'sonner'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Send, Download, Sparkles, User, Bot, ChevronRight,
  Briefcase, GraduationCap, Code2, Award, FolderGit2,
  MapPin, Mail, Phone, Globe, Github, Linkedin,
  RefreshCw, Palette, FileText, X, Check, Loader2,
  Star, Zap, Layout, Feather, Crown, Layers
} from 'lucide-react'

// ─── Types ────────────────────────────────────────────────────────────────────

interface ResumeData {
  name: string
  email: string
  phone: string
  location: string
  linkedin: string
  github: string
  portfolio: string
  headline: string
  summary: string
  experience: {
    company: string
    role: string
    duration: string
    location: string
    bullets: string[]
  }[]
  education: {
    degree: string
    institution: string
    year: string
    score: string
  }[]
  skills: {
    technical: string[]
    tools: string[]
    soft: string[]
    languages: string[]
  }
  projects: {
    name: string
    tech: string
    description: string
    url: string
    impact: string
  }[]
  certifications: {
    name: string
    issuer: string
    year: string
    url: string
  }[]
  achievements: string[]
}

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  ts: number
}

type TemplateId = 'classic' | 'modern' | 'minimal' | 'executive' | 'creative'
type ThemeColor = 'indigo' | 'emerald' | 'rose' | 'amber' | 'slate'

interface Theme {
  id: ThemeColor
  label: string
  primary: string
  accent: string
  bg: string
  sidebar: string
  text: string
}

// ─── Constants ────────────────────────────────────────────────────────────────

const THEMES: Theme[] = [
  { id: 'indigo', label: 'Navy', primary: '#1e3a5f', accent: '#3b82f6', bg: '#f0f4ff', sidebar: '#1e3a5f', text: '#1e293b' },
  { id: 'emerald', label: 'Forest', primary: '#064e3b', accent: '#10b981', bg: '#ecfdf5', sidebar: '#064e3b', text: '#1e293b' },
  { id: 'rose', label: 'Rose', primary: '#881337', accent: '#f43f5e', bg: '#fff1f2', sidebar: '#881337', text: '#1e293b' },
  { id: 'amber', label: 'Gold', primary: '#78350f', accent: '#f59e0b', bg: '#fffbeb', sidebar: '#78350f', text: '#1e293b' },
  { id: 'slate', label: 'Onyx', primary: '#0f172a', accent: '#64748b', bg: '#f8fafc', sidebar: '#0f172a', text: '#1e293b' },
]

const TEMPLATES = [
  { id: 'classic' as TemplateId, label: 'Classic', icon: FileText, desc: 'MNC & IT pros' },
  { id: 'modern' as TemplateId, label: 'Modern', icon: Layers, desc: 'Product & startups' },
  { id: 'minimal' as TemplateId, label: 'Minimal', icon: Feather, desc: 'Finance & consulting' },
  { id: 'executive' as TemplateId, label: 'Executive', icon: Crown, desc: 'Senior & MBA' },
  { id: 'creative' as TemplateId, label: 'Creative', icon: Zap, desc: 'Design & frontend' },
]

const EMPTY_RESUME: ResumeData = {
  name: '', email: '', phone: '', location: '', linkedin: '', github: '',
  portfolio: '', headline: '', summary: '',
  experience: [], education: [], skills: { technical: [], tools: [], soft: [], languages: [] },
  projects: [], certifications: [], achievements: []
}

const QUESTION_FLOW = [
  'greet',
  'name', 'role', 'experience', 'education',
  'skills', 'work', 'projects', 'location', 'contact',
  'confirm', 'done'
] as const

type FlowStep = typeof QUESTION_FLOW[number]

// ─── AI helpers ───────────────────────────────────────────────────────────────

async function callAI(prompt: string, systemOverride?: string): Promise<string> {
  const res = await fetch('/api/v1/ai/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      messages: [{ role: 'user', content: prompt }],
      systemOverride: systemOverride ?? 'You are a warm, concise career coach for Indian professionals. Reply in 1-2 sentences max. Be encouraging.'
    })
  })
  if (!res.ok) throw new Error('AI call failed')
  const data = await res.json()
  return data.reply as string
}

async function buildResumeJSON(userInfo: Record<string, string>): Promise<ResumeData> {
  const infoText = Object.entries(userInfo)
    .filter(([, v]) => v)
    .map(([k, v]) => `${k}: ${v}`)
    .join('\n')

  const prompt = `Build a complete, ATS-optimized resume for the Indian job market.

Candidate info:
${infoText}

Return ONLY a raw JSON object matching this exact TypeScript interface:
{
  name: string, email: string, phone: string, location: string,
  linkedin: string, github: string, portfolio: string,
  headline: string, summary: string,
  experience: [{ company: string, role: string, duration: string, location: string, bullets: string[] }],
  education: [{ degree: string, institution: string, year: string, score: string }],
  skills: { technical: string[], tools: string[], soft: string[], languages: string[] },
  projects: [{ name: string, tech: string, description: string, url: string, impact: string }],
  certifications: [{ name: string, issuer: string, year: string, url: string }],
  achievements: string[]
}

Rules:
- If fresher (0 years): create 2 realistic internship experiences + strong academic projects
- Use strong action verbs: Led, Built, Developed, Optimized, Reduced, Increased, Deployed, Architected
- Quantify everything: percentages, user counts, time saved, scale, LPA
- Use Indian context: TCS, Infosys, Swiggy, Zomato, Flipkart, Wipro, Bangalore, Mumbai, Hyderabad, Delhi
- Generate realistic LinkedIn/GitHub URLs from the name (e.g. linkedin.com/in/firstname-lastname)
- Summary: 2-3 sentences, powerful, tailored to the role
- 3-4 bullet points per experience, each with a number/metric
- Include 2-3 projects minimum with realistic tech stacks
- ATS keywords for the target role throughout
- Certifications: include 1-2 relevant ones (AWS, Google, Coursera etc.)
- If info is missing, intelligently fill in realistic details`

  const raw = await callAI(prompt, 'Return only raw valid JSON. No markdown. No backticks. No explanation. No text before or after the JSON object.')
  const cleaned = raw.replace(/```json|```/g, '').trim()
  return JSON.parse(cleaned) as ResumeData
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function TypingDots() {
  return (
    <div className="flex items-center gap-1 px-4 py-3">
      {[0, 1, 2].map(i => (
        <motion.div
          key={i}
          className="w-2 h-2 rounded-full bg-indigo-400"
          animate={{ y: [0, -6, 0] }}
          transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }}
        />
      ))}
    </div>
  )
}

// ─── Template Components ───────────────────────────────────────────────────────

function ClassicTemplate({ data, theme }: { data: ResumeData; theme: Theme }) {
  const t = theme
  return (
    <div id="resume-preview-content" style={{ fontFamily: 'Georgia, serif', background: '#fff', minHeight: '1122px', color: '#1a1a2e' }}>
      {/* Header */}
      <div style={{ background: t.primary, color: '#fff', padding: '32px 40px 24px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: 700, letterSpacing: '0.02em', marginBottom: '4px' }}>
          {data.name || 'Your Name'}
        </h1>
        <p style={{ fontSize: '14px', opacity: 0.85, marginBottom: '12px', fontStyle: 'italic' }}>
          {data.headline || 'Professional Headline'}
        </p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', fontSize: '12px', opacity: 0.9 }}>
          {data.email && <span>✉ {data.email}</span>}
          {data.phone && <span>📞 {data.phone}</span>}
          {data.location && <span>📍 {data.location}</span>}
          {data.linkedin && <span>in {data.linkedin}</span>}
          {data.github && <span>⌥ {data.github}</span>}
        </div>
      </div>

      <div style={{ padding: '28px 40px' }}>
        {/* Summary */}
        {data.summary && (
          <section style={{ marginBottom: '24px' }}>
            <h2 style={{ fontSize: '13px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', color: t.primary, borderBottom: `2px solid ${t.accent}`, paddingBottom: '6px', marginBottom: '10px' }}>
              Professional Summary
            </h2>
            <p style={{ fontSize: '13px', lineHeight: 1.7, color: '#374151' }}>{data.summary}</p>
          </section>
        )}

        {/* Experience */}
        {data.experience.length > 0 && (
          <section style={{ marginBottom: '24px' }}>
            <h2 style={{ fontSize: '13px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', color: t.primary, borderBottom: `2px solid ${t.accent}`, paddingBottom: '6px', marginBottom: '14px' }}>
              Work Experience
            </h2>
            {data.experience.map((exp, i) => (
              <div key={i} style={{ marginBottom: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <p style={{ fontWeight: 700, fontSize: '14px', color: '#111827' }}>{exp.role}</p>
                    <p style={{ fontSize: '13px', color: t.accent, fontWeight: 600 }}>{exp.company}</p>
                  </div>
                  <div style={{ textAlign: 'right', fontSize: '12px', color: '#6b7280' }}>
                    <p>{exp.duration}</p>
                    <p>{exp.location}</p>
                  </div>
                </div>
                <ul style={{ marginTop: '8px', paddingLeft: '18px' }}>
                  {exp.bullets.map((b, j) => (
                    <li key={j} style={{ fontSize: '12.5px', lineHeight: 1.7, color: '#374151', marginBottom: '3px' }}>{b}</li>
                  ))}
                </ul>
              </div>
            ))}
          </section>
        )}

        {/* Skills */}
        {(data.skills.technical.length > 0 || data.skills.tools.length > 0) && (
          <section style={{ marginBottom: '24px' }}>
            <h2 style={{ fontSize: '13px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', color: t.primary, borderBottom: `2px solid ${t.accent}`, paddingBottom: '6px', marginBottom: '12px' }}>
              Skills
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
              {data.skills.languages.length > 0 && <div><span style={{ fontWeight: 700, fontSize: '12px' }}>Languages: </span><span style={{ fontSize: '12px', color: '#374151' }}>{data.skills.languages.join(', ')}</span></div>}
              {data.skills.technical.length > 0 && <div><span style={{ fontWeight: 700, fontSize: '12px' }}>Technical: </span><span style={{ fontSize: '12px', color: '#374151' }}>{data.skills.technical.join(', ')}</span></div>}
              {data.skills.tools.length > 0 && <div><span style={{ fontWeight: 700, fontSize: '12px' }}>Tools: </span><span style={{ fontSize: '12px', color: '#374151' }}>{data.skills.tools.join(', ')}</span></div>}
              {data.skills.soft.length > 0 && <div><span style={{ fontWeight: 700, fontSize: '12px' }}>Soft Skills: </span><span style={{ fontSize: '12px', color: '#374151' }}>{data.skills.soft.join(', ')}</span></div>}
            </div>
          </section>
        )}

        {/* Education */}
        {data.education.length > 0 && (
          <section style={{ marginBottom: '24px' }}>
            <h2 style={{ fontSize: '13px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', color: t.primary, borderBottom: `2px solid ${t.accent}`, paddingBottom: '6px', marginBottom: '12px' }}>
              Education
            </h2>
            {data.education.map((edu, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                <div>
                  <p style={{ fontWeight: 700, fontSize: '13px' }}>{edu.degree}</p>
                  <p style={{ fontSize: '12.5px', color: t.accent }}>{edu.institution}</p>
                </div>
                <div style={{ textAlign: 'right', fontSize: '12px', color: '#6b7280' }}>
                  <p>{edu.year}</p>
                  {edu.score && <p>{edu.score}</p>}
                </div>
              </div>
            ))}
          </section>
        )}

        {/* Projects */}
        {data.projects.length > 0 && (
          <section style={{ marginBottom: '24px' }}>
            <h2 style={{ fontSize: '13px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', color: t.primary, borderBottom: `2px solid ${t.accent}`, paddingBottom: '6px', marginBottom: '12px' }}>
              Projects
            </h2>
            {data.projects.map((p, i) => (
              <div key={i} style={{ marginBottom: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <p style={{ fontWeight: 700, fontSize: '13px' }}>{p.name}</p>
                  {p.url && <p style={{ fontSize: '11px', color: t.accent }}>{p.url}</p>}
                </div>
                <p style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>Tech: {p.tech}</p>
                <p style={{ fontSize: '12.5px', color: '#374151' }}>{p.description}</p>
                {p.impact && <p style={{ fontSize: '12px', color: t.accent, fontStyle: 'italic', marginTop: '3px' }}>▲ {p.impact}</p>}
              </div>
            ))}
          </section>
        )}

        {/* Certifications */}
        {data.certifications.length > 0 && (
          <section style={{ marginBottom: '24px' }}>
            <h2 style={{ fontSize: '13px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', color: t.primary, borderBottom: `2px solid ${t.accent}`, paddingBottom: '6px', marginBottom: '12px' }}>
              Certifications
            </h2>
            {data.certifications.map((c, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                <span style={{ fontSize: '12.5px', fontWeight: 600 }}>{c.name} — <span style={{ color: t.accent }}>{c.issuer}</span></span>
                <span style={{ fontSize: '12px', color: '#6b7280' }}>{c.year}</span>
              </div>
            ))}
          </section>
        )}

        {/* Achievements */}
        {data.achievements.length > 0 && (
          <section>
            <h2 style={{ fontSize: '13px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', color: t.primary, borderBottom: `2px solid ${t.accent}`, paddingBottom: '6px', marginBottom: '10px' }}>
              Achievements
            </h2>
            <ul style={{ paddingLeft: '18px' }}>
              {data.achievements.map((a, i) => (
                <li key={i} style={{ fontSize: '12.5px', color: '#374151', marginBottom: '4px' }}>{a}</li>
              ))}
            </ul>
          </section>
        )}
      </div>
    </div>
  )
}

function ModernTemplate({ data, theme }: { data: ResumeData; theme: Theme }) {
  const t = theme
  return (
    <div id="resume-preview-content" style={{ fontFamily: "'Segoe UI', system-ui, sans-serif", background: '#fff', minHeight: '1122px', display: 'flex' }}>
      {/* Sidebar */}
      <div style={{ width: '32%', background: t.sidebar, color: '#fff', padding: '32px 20px', flexShrink: 0 }}>
        {/* Avatar placeholder */}
        <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'rgba(255,255,255,0.2)', margin: '0 auto 16px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '28px', fontWeight: 700, border: '3px solid rgba(255,255,255,0.3)' }}>
          {(data.name || 'U').charAt(0)}
        </div>
        <h1 style={{ fontSize: '18px', fontWeight: 700, textAlign: 'center', marginBottom: '4px' }}>{data.name || 'Your Name'}</h1>
        <p style={{ fontSize: '11px', textAlign: 'center', opacity: 0.8, marginBottom: '24px', fontStyle: 'italic' }}>{data.headline || 'Professional Title'}</p>

        {/* Contact */}
        <div style={{ marginBottom: '24px' }}>
          <h3 style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', opacity: 0.7, marginBottom: '10px', borderBottom: '1px solid rgba(255,255,255,0.2)', paddingBottom: '4px' }}>Contact</h3>
          {data.email && <p style={{ fontSize: '11px', marginBottom: '6px', opacity: 0.9 }}>✉ {data.email}</p>}
          {data.phone && <p style={{ fontSize: '11px', marginBottom: '6px', opacity: 0.9 }}>📞 {data.phone}</p>}
          {data.location && <p style={{ fontSize: '11px', marginBottom: '6px', opacity: 0.9 }}>📍 {data.location}</p>}
          {data.linkedin && <p style={{ fontSize: '10px', marginBottom: '4px', opacity: 0.8, wordBreak: 'break-all' }}>in {data.linkedin}</p>}
          {data.github && <p style={{ fontSize: '10px', opacity: 0.8, wordBreak: 'break-all' }}>⌥ {data.github}</p>}
        </div>

        {/* Skills */}
        {data.skills.languages.length > 0 && (
          <div style={{ marginBottom: '20px' }}>
            <h3 style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', opacity: 0.7, marginBottom: '8px', borderBottom: '1px solid rgba(255,255,255,0.2)', paddingBottom: '4px' }}>Languages</h3>
            {data.skills.languages.map((s, i) => (
              <div key={i} style={{ marginBottom: '4px' }}>
                <span style={{ fontSize: '11px', opacity: 0.9 }}>{s}</span>
              </div>
            ))}
          </div>
        )}

        {data.skills.tools.length > 0 && (
          <div style={{ marginBottom: '20px' }}>
            <h3 style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', opacity: 0.7, marginBottom: '8px', borderBottom: '1px solid rgba(255,255,255,0.2)', paddingBottom: '4px' }}>Tools</h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
              {data.skills.tools.map((s, i) => (
                <span key={i} style={{ background: 'rgba(255,255,255,0.15)', fontSize: '10px', padding: '2px 7px', borderRadius: '10px' }}>{s}</span>
              ))}
            </div>
          </div>
        )}

        {/* Education in sidebar */}
        {data.education.length > 0 && (
          <div>
            <h3 style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', opacity: 0.7, marginBottom: '8px', borderBottom: '1px solid rgba(255,255,255,0.2)', paddingBottom: '4px' }}>Education</h3>
            {data.education.map((edu, i) => (
              <div key={i} style={{ marginBottom: '10px' }}>
                <p style={{ fontSize: '11px', fontWeight: 600, opacity: 0.95 }}>{edu.degree}</p>
                <p style={{ fontSize: '10px', opacity: 0.75 }}>{edu.institution}</p>
                <p style={{ fontSize: '10px', opacity: 0.65 }}>{edu.year} {edu.score && `· ${edu.score}`}</p>
              </div>
            ))}
          </div>
        )}

        {/* Certifications in sidebar */}
        {data.certifications.length > 0 && (
          <div style={{ marginTop: '16px' }}>
            <h3 style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', opacity: 0.7, marginBottom: '8px', borderBottom: '1px solid rgba(255,255,255,0.2)', paddingBottom: '4px' }}>Certifications</h3>
            {data.certifications.map((c, i) => (
              <div key={i} style={{ marginBottom: '8px' }}>
                <p style={{ fontSize: '11px', fontWeight: 600, opacity: 0.9 }}>{c.name}</p>
                <p style={{ fontSize: '10px', opacity: 0.7 }}>{c.issuer} · {c.year}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, padding: '32px 28px', overflow: 'hidden' }}>
        {/* Summary */}
        {data.summary && (
          <section style={{ marginBottom: '22px' }}>
            <h2 style={{ fontSize: '14px', fontWeight: 700, color: t.primary, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ display: 'inline-block', width: '20px', height: '3px', background: t.accent, borderRadius: '2px' }} />
              About Me
            </h2>
            <p style={{ fontSize: '12.5px', lineHeight: 1.75, color: '#374151' }}>{data.summary}</p>
          </section>
        )}

        {/* Experience */}
        {data.experience.length > 0 && (
          <section style={{ marginBottom: '22px' }}>
            <h2 style={{ fontSize: '14px', fontWeight: 700, color: t.primary, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ display: 'inline-block', width: '20px', height: '3px', background: t.accent, borderRadius: '2px' }} />
              Experience
            </h2>
            {data.experience.map((exp, i) => (
              <div key={i} style={{ marginBottom: '16px', borderLeft: `3px solid ${t.accent}`, paddingLeft: '14px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <p style={{ fontWeight: 700, fontSize: '13.5px', color: '#111' }}>{exp.role}</p>
                    <p style={{ fontSize: '12.5px', color: t.accent, fontWeight: 600 }}>{exp.company} · {exp.location}</p>
                  </div>
                  <span style={{ fontSize: '11px', color: '#9ca3af', background: t.bg, padding: '2px 8px', borderRadius: '10px', whiteSpace: 'nowrap', flexShrink: 0, marginLeft: '8px' }}>{exp.duration}</span>
                </div>
                <ul style={{ marginTop: '6px', paddingLeft: '16px' }}>
                  {exp.bullets.map((b, j) => (
                    <li key={j} style={{ fontSize: '12px', lineHeight: 1.7, color: '#4b5563', marginBottom: '3px' }}>{b}</li>
                  ))}
                </ul>
              </div>
            ))}
          </section>
        )}

        {/* Technical Skills */}
        {data.skills.technical.length > 0 && (
          <section style={{ marginBottom: '22px' }}>
            <h2 style={{ fontSize: '14px', fontWeight: 700, color: t.primary, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ display: 'inline-block', width: '20px', height: '3px', background: t.accent, borderRadius: '2px' }} />
              Technical Skills
            </h2>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              {data.skills.technical.map((s, i) => (
                <span key={i} style={{ background: t.bg, color: t.primary, fontSize: '11.5px', padding: '4px 10px', borderRadius: '4px', fontWeight: 500, border: `1px solid ${t.accent}30` }}>{s}</span>
              ))}
            </div>
          </section>
        )}

        {/* Projects */}
        {data.projects.length > 0 && (
          <section style={{ marginBottom: '22px' }}>
            <h2 style={{ fontSize: '14px', fontWeight: 700, color: t.primary, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ display: 'inline-block', width: '20px', height: '3px', background: t.accent, borderRadius: '2px' }} />
              Projects
            </h2>
            {data.projects.map((p, i) => (
              <div key={i} style={{ marginBottom: '12px', padding: '12px', background: t.bg, borderRadius: '6px', borderLeft: `3px solid ${t.accent}` }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <p style={{ fontWeight: 700, fontSize: '13px' }}>{p.name}</p>
                  {p.url && <span style={{ fontSize: '10px', color: t.accent }}>{p.url}</span>}
                </div>
                <p style={{ fontSize: '11px', color: t.accent, marginBottom: '4px' }}>Tech: {p.tech}</p>
                <p style={{ fontSize: '12px', color: '#4b5563' }}>{p.description}</p>
                {p.impact && <p style={{ fontSize: '11.5px', fontWeight: 600, color: t.primary, marginTop: '4px' }}>📈 {p.impact}</p>}
              </div>
            ))}
          </section>
        )}

        {/* Achievements */}
        {data.achievements.length > 0 && (
          <section>
            <h2 style={{ fontSize: '14px', fontWeight: 700, color: t.primary, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ display: 'inline-block', width: '20px', height: '3px', background: t.accent, borderRadius: '2px' }} />
              Achievements
            </h2>
            <ul style={{ paddingLeft: '18px' }}>
              {data.achievements.map((a, i) => (
                <li key={i} style={{ fontSize: '12.5px', color: '#374151', marginBottom: '5px' }}>{a}</li>
              ))}
            </ul>
          </section>
        )}
      </div>
    </div>
  )
}

function MinimalTemplate({ data, theme }: { data: ResumeData; theme: Theme }) {
  const t = theme
  return (
    <div id="resume-preview-content" style={{ fontFamily: "'Georgia', serif", background: '#fff', minHeight: '1122px', padding: '48px 52px', color: '#1a1a1a' }}>
      {/* Name + headline */}
      <div style={{ borderBottom: `2px solid ${t.accent}`, paddingBottom: '18px', marginBottom: '28px' }}>
        <h1 style={{ fontSize: '32px', fontWeight: 400, letterSpacing: '-0.02em', color: '#0d0d0d', marginBottom: '6px' }}>
          {data.name || 'Your Name'}
        </h1>
        <p style={{ fontSize: '14px', color: '#666', fontStyle: 'italic', marginBottom: '10px' }}>{data.headline || 'Professional Headline'}</p>
        <div style={{ display: 'flex', gap: '20px', fontSize: '12px', color: '#555', flexWrap: 'wrap' }}>
          {data.email && <span>{data.email}</span>}
          {data.phone && <span>{data.phone}</span>}
          {data.location && <span>{data.location}</span>}
          {data.linkedin && <span>{data.linkedin}</span>}
        </div>
      </div>

      {/* Summary */}
      {data.summary && (
        <section style={{ marginBottom: '28px' }}>
          <p style={{ fontSize: '13.5px', lineHeight: 1.9, color: '#333', maxWidth: '680px' }}>{data.summary}</p>
        </section>
      )}

      {/* Experience */}
      {data.experience.length > 0 && (
        <section style={{ marginBottom: '28px' }}>
          <h2 style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.18em', color: '#999', marginBottom: '16px' }}>Experience</h2>
          {data.experience.map((exp, i) => (
            <div key={i} style={{ display: 'grid', gridTemplateColumns: '160px 1fr', gap: '16px', marginBottom: '20px' }}>
              <div>
                <p style={{ fontSize: '12px', color: '#666' }}>{exp.duration}</p>
                <p style={{ fontSize: '12px', color: '#999' }}>{exp.location}</p>
              </div>
              <div>
                <p style={{ fontWeight: 700, fontSize: '14px' }}>{exp.role}</p>
                <p style={{ fontSize: '13px', color: t.accent, marginBottom: '8px' }}>{exp.company}</p>
                <ul style={{ paddingLeft: '0', listStyle: 'none' }}>
                  {exp.bullets.map((b, j) => (
                    <li key={j} style={{ fontSize: '12.5px', lineHeight: 1.7, color: '#444', paddingLeft: '14px', position: 'relative', marginBottom: '4px' }}>
                      <span style={{ position: 'absolute', left: 0, color: t.accent }}>—</span>
                      {b}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </section>
      )}

      {/* Education */}
      {data.education.length > 0 && (
        <section style={{ marginBottom: '28px' }}>
          <h2 style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.18em', color: '#999', marginBottom: '16px' }}>Education</h2>
          {data.education.map((edu, i) => (
            <div key={i} style={{ display: 'grid', gridTemplateColumns: '160px 1fr', gap: '16px', marginBottom: '12px' }}>
              <p style={{ fontSize: '12px', color: '#666' }}>{edu.year}</p>
              <div>
                <p style={{ fontWeight: 700, fontSize: '14px' }}>{edu.degree}</p>
                <p style={{ fontSize: '12.5px', color: '#444' }}>{edu.institution} {edu.score && `· ${edu.score}`}</p>
              </div>
            </div>
          ))}
        </section>
      )}

      {/* Skills */}
      {(data.skills.technical.length > 0 || data.skills.languages.length > 0) && (
        <section style={{ marginBottom: '28px' }}>
          <h2 style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.18em', color: '#999', marginBottom: '14px' }}>Skills</h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
            {data.skills.languages.length > 0 && (
              <p style={{ fontSize: '12.5px', color: '#333' }}><strong>Languages:</strong> {data.skills.languages.join(', ')}</p>
            )}
            {data.skills.technical.length > 0 && (
              <p style={{ fontSize: '12.5px', color: '#333' }}><strong>Technical:</strong> {data.skills.technical.join(', ')}</p>
            )}
            {data.skills.tools.length > 0 && (
              <p style={{ fontSize: '12.5px', color: '#333' }}><strong>Tools:</strong> {data.skills.tools.join(', ')}</p>
            )}
            {data.skills.soft.length > 0 && (
              <p style={{ fontSize: '12.5px', color: '#333' }}><strong>Soft Skills:</strong> {data.skills.soft.join(', ')}</p>
            )}
          </div>
        </section>
      )}

      {/* Projects */}
      {data.projects.length > 0 && (
        <section style={{ marginBottom: '28px' }}>
          <h2 style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.18em', color: '#999', marginBottom: '16px' }}>Projects</h2>
          {data.projects.map((p, i) => (
            <div key={i} style={{ display: 'grid', gridTemplateColumns: '160px 1fr', gap: '16px', marginBottom: '14px' }}>
              <p style={{ fontSize: '12px', color: '#666', fontStyle: 'italic' }}>{p.tech}</p>
              <div>
                <p style={{ fontWeight: 700, fontSize: '13.5px' }}>{p.name}</p>
                <p style={{ fontSize: '12.5px', color: '#444', marginTop: '3px' }}>{p.description}</p>
                {p.impact && <p style={{ fontSize: '12px', color: t.accent, marginTop: '3px' }}>{p.impact}</p>}
              </div>
            </div>
          ))}
        </section>
      )}

      {/* Certifications */}
      {data.certifications.length > 0 && (
        <section>
          <h2 style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.18em', color: '#999', marginBottom: '14px' }}>Certifications</h2>
          {data.certifications.map((c, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
              <span style={{ fontSize: '12.5px' }}>{c.name} — {c.issuer}</span>
              <span style={{ fontSize: '12px', color: '#666' }}>{c.year}</span>
            </div>
          ))}
        </section>
      )}
    </div>
  )
}

function ExecutiveTemplate({ data, theme }: { data: ResumeData; theme: Theme }) {
  const t = theme
  return (
    <div id="resume-preview-content" style={{ fontFamily: "'Georgia', 'Times New Roman', serif", background: '#fff', minHeight: '1122px', color: '#1a1a1a' }}>
      {/* Executive Header */}
      <div style={{ background: t.primary, color: '#fff', padding: '32px 44px 24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <h1 style={{ fontSize: '30px', fontWeight: 700, letterSpacing: '-0.01em', marginBottom: '4px' }}>{data.name || 'Your Name'}</h1>
            <p style={{ fontSize: '14px', color: t.accent, fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase', fontSize: '12px' }}>{data.headline || 'Executive Title'}</p>
          </div>
          <div style={{ textAlign: 'right', fontSize: '12px', opacity: 0.9 }}>
            {data.email && <p style={{ marginBottom: '4px' }}>{data.email}</p>}
            {data.phone && <p style={{ marginBottom: '4px' }}>{data.phone}</p>}
            {data.location && <p style={{ marginBottom: '4px' }}>📍 {data.location}</p>}
            {data.linkedin && <p style={{ opacity: 0.8, fontSize: '11px' }}>{data.linkedin}</p>}
          </div>
        </div>
        {/* Key metrics bar */}
        {(data.experience.length > 0 || data.skills.technical.length > 0) && (
          <div style={{ display: 'flex', gap: '28px', marginTop: '18px', paddingTop: '14px', borderTop: `1px solid ${t.accent}60` }}>
            {data.experience.length > 0 && (
              <div style={{ textAlign: 'center' }}>
                <p style={{ fontSize: '20px', fontWeight: 700, color: t.accent }}>{data.experience.length}+</p>
                <p style={{ fontSize: '10px', opacity: 0.7, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Roles</p>
              </div>
            )}
            {data.skills.technical.length > 0 && (
              <div style={{ textAlign: 'center' }}>
                <p style={{ fontSize: '20px', fontWeight: 700, color: t.accent }}>{data.skills.technical.length + data.skills.languages.length}</p>
                <p style={{ fontSize: '10px', opacity: 0.7, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Tech Skills</p>
              </div>
            )}
            {data.projects.length > 0 && (
              <div style={{ textAlign: 'center' }}>
                <p style={{ fontSize: '20px', fontWeight: 700, color: t.accent }}>{data.projects.length}</p>
                <p style={{ fontSize: '10px', opacity: 0.7, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Projects</p>
              </div>
            )}
            {data.certifications.length > 0 && (
              <div style={{ textAlign: 'center' }}>
                <p style={{ fontSize: '20px', fontWeight: 700, color: t.accent }}>{data.certifications.length}</p>
                <p style={{ fontSize: '10px', opacity: 0.7, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Certs</p>
              </div>
            )}
          </div>
        )}
      </div>

      <div style={{ padding: '28px 44px' }}>
        {/* Summary */}
        {data.summary && (
          <section style={{ marginBottom: '24px', borderLeft: `4px solid ${t.accent}`, paddingLeft: '16px' }}>
            <p style={{ fontSize: '13.5px', lineHeight: 1.8, color: '#333', fontStyle: 'italic' }}>{data.summary}</p>
          </section>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '28px' }}>
          <div>
            {/* Experience */}
            {data.experience.length > 0 && (
              <section style={{ marginBottom: '24px' }}>
                <h2 style={{ fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.14em', color: t.accent, marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ display: 'inline-block', width: '24px', height: '1px', background: t.accent }} />
                  Career History
                </h2>
                {data.experience.map((exp, i) => (
                  <div key={i} style={{ marginBottom: '18px' }}>
                    <p style={{ fontWeight: 700, fontSize: '13.5px', color: '#111' }}>{exp.role}</p>
                    <p style={{ fontSize: '12.5px', color: t.accent, fontWeight: 600, marginBottom: '2px' }}>{exp.company}</p>
                    <p style={{ fontSize: '11px', color: '#888', marginBottom: '7px' }}>{exp.duration} · {exp.location}</p>
                    <ul style={{ paddingLeft: '16px' }}>
                      {exp.bullets.map((b, j) => (
                        <li key={j} style={{ fontSize: '12px', lineHeight: 1.65, color: '#444', marginBottom: '3px' }}>{b}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </section>
            )}

            {/* Achievements */}
            {data.achievements.length > 0 && (
              <section>
                <h2 style={{ fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.14em', color: t.accent, marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ display: 'inline-block', width: '24px', height: '1px', background: t.accent }} />
                  Achievements
                </h2>
                <ul style={{ paddingLeft: '16px' }}>
                  {data.achievements.map((a, i) => (
                    <li key={i} style={{ fontSize: '12.5px', color: '#333', marginBottom: '5px' }}>{a}</li>
                  ))}
                </ul>
              </section>
            )}
          </div>

          <div>
            {/* Education */}
            {data.education.length > 0 && (
              <section style={{ marginBottom: '24px' }}>
                <h2 style={{ fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.14em', color: t.accent, marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ display: 'inline-block', width: '24px', height: '1px', background: t.accent }} />
                  Education
                </h2>
                {data.education.map((edu, i) => (
                  <div key={i} style={{ marginBottom: '12px', padding: '10px', background: '#f9fafb', borderRadius: '4px' }}>
                    <p style={{ fontWeight: 700, fontSize: '13px' }}>{edu.degree}</p>
                    <p style={{ fontSize: '12px', color: t.accent }}>{edu.institution}</p>
                    <p style={{ fontSize: '11px', color: '#888' }}>{edu.year} {edu.score && `· ${edu.score}`}</p>
                  </div>
                ))}
              </section>
            )}

            {/* Skills */}
            <section style={{ marginBottom: '24px' }}>
              <h2 style={{ fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.14em', color: t.accent, marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ display: 'inline-block', width: '24px', height: '1px', background: t.accent }} />
                Core Competencies
              </h2>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
                {[...data.skills.languages, ...data.skills.technical, ...data.skills.tools].map((s, i) => (
                  <span key={i} style={{ fontSize: '11px', padding: '3px 9px', background: '#f1f5f9', borderRadius: '3px', color: '#334155' }}>{s}</span>
                ))}
              </div>
            </section>

            {/* Projects */}
            {data.projects.length > 0 && (
              <section style={{ marginBottom: '24px' }}>
                <h2 style={{ fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.14em', color: t.accent, marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ display: 'inline-block', width: '24px', height: '1px', background: t.accent }} />
                  Key Projects
                </h2>
                {data.projects.map((p, i) => (
                  <div key={i} style={{ marginBottom: '10px' }}>
                    <p style={{ fontWeight: 700, fontSize: '12.5px' }}>{p.name}</p>
                    <p style={{ fontSize: '11.5px', color: '#666' }}>{p.description}</p>
                    {p.impact && <p style={{ fontSize: '11.5px', color: t.accent, fontStyle: 'italic' }}>▲ {p.impact}</p>}
                  </div>
                ))}
              </section>
            )}

            {/* Certifications */}
            {data.certifications.length > 0 && (
              <section>
                <h2 style={{ fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.14em', color: t.accent, marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ display: 'inline-block', width: '24px', height: '1px', background: t.accent }} />
                  Certifications
                </h2>
                {data.certifications.map((c, i) => (
                  <div key={i} style={{ marginBottom: '7px' }}>
                    <p style={{ fontSize: '12.5px', fontWeight: 600 }}>{c.name}</p>
                    <p style={{ fontSize: '11px', color: '#888' }}>{c.issuer} · {c.year}</p>
                  </div>
                ))}
              </section>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function CreativeTemplate({ data, theme }: { data: ResumeData; theme: Theme }) {
  const t = theme
  const allSkills = [...data.skills.languages, ...data.skills.technical]
  const skillLevels = [90, 85, 88, 78, 92, 80, 75, 86]
  return (
    <div id="resume-preview-content" style={{ fontFamily: "'Segoe UI', system-ui, sans-serif", background: '#fff', minHeight: '1122px' }}>
      {/* Gradient Header */}
      <div style={{ background: `linear-gradient(135deg, ${t.primary} 0%, ${t.accent} 100%)`, color: '#fff', padding: '36px 44px 28px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '-20px', right: '-20px', width: '200px', height: '200px', borderRadius: '50%', background: 'rgba(255,255,255,0.07)' }} />
        <div style={{ position: 'absolute', bottom: '-40px', left: '30%', width: '140px', height: '140px', borderRadius: '50%', background: 'rgba(255,255,255,0.05)' }} />
        <div style={{ position: 'relative', zIndex: 1 }}>
          <h1 style={{ fontSize: '32px', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: '6px' }}>{data.name || 'Your Name'}</h1>
          <p style={{ fontSize: '15px', opacity: 0.9, marginBottom: '14px', fontWeight: 500 }}>{data.headline || 'Creative Professional'}</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '14px', fontSize: '12px', opacity: 0.85 }}>
            {data.email && <span style={{ background: 'rgba(255,255,255,0.15)', padding: '4px 10px', borderRadius: '20px' }}>✉ {data.email}</span>}
            {data.phone && <span style={{ background: 'rgba(255,255,255,0.15)', padding: '4px 10px', borderRadius: '20px' }}>📞 {data.phone}</span>}
            {data.location && <span style={{ background: 'rgba(255,255,255,0.15)', padding: '4px 10px', borderRadius: '20px' }}>📍 {data.location}</span>}
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '0', minHeight: 'calc(1122px - 140px)' }}>
        {/* Main */}
        <div style={{ padding: '28px 32px' }}>
          {data.summary && (
            <section style={{ marginBottom: '24px', padding: '16px', background: `${t.bg}`, borderRadius: '8px', borderLeft: `4px solid ${t.accent}` }}>
              <p style={{ fontSize: '13px', lineHeight: 1.8, color: '#333' }}>{data.summary}</p>
            </section>
          )}

          {data.experience.length > 0 && (
            <section style={{ marginBottom: '24px' }}>
              <h2 style={{ fontSize: '13px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.12em', color: t.primary, marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Briefcase size={14} style={{ color: t.accent }} /> Experience
              </h2>
              {data.experience.map((exp, i) => (
                <div key={i} style={{ marginBottom: '18px', position: 'relative', paddingLeft: '16px' }}>
                  <div style={{ position: 'absolute', left: 0, top: '6px', width: '6px', height: '6px', borderRadius: '50%', background: t.accent }} />
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <p style={{ fontWeight: 700, fontSize: '14px' }}>{exp.role}</p>
                      <p style={{ fontSize: '12.5px', color: t.accent, fontWeight: 600 }}>{exp.company}</p>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <span style={{ fontSize: '11px', color: '#888', background: '#f1f5f9', padding: '2px 8px', borderRadius: '10px' }}>{exp.duration}</span>
                    </div>
                  </div>
                  <ul style={{ marginTop: '7px', paddingLeft: '16px' }}>
                    {exp.bullets.map((b, j) => (
                      <li key={j} style={{ fontSize: '12px', lineHeight: 1.7, color: '#4b5563', marginBottom: '3px' }}>{b}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </section>
          )}

          {/* Project cards */}
          {data.projects.length > 0 && (
            <section style={{ marginBottom: '24px' }}>
              <h2 style={{ fontSize: '13px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.12em', color: t.primary, marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <FolderGit2 size={14} style={{ color: t.accent }} /> Projects
              </h2>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                {data.projects.map((p, i) => (
                  <div key={i} style={{ padding: '14px', border: `1px solid ${t.accent}30`, borderRadius: '8px', background: '#fafafa' }}>
                    <p style={{ fontWeight: 700, fontSize: '13px', color: t.primary, marginBottom: '4px' }}>{p.name}</p>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '3px', marginBottom: '7px' }}>
                      {p.tech.split(',').slice(0, 3).map((tech, j) => (
                        <span key={j} style={{ fontSize: '10px', background: `${t.accent}20`, color: t.primary, padding: '2px 6px', borderRadius: '4px' }}>{tech.trim()}</span>
                      ))}
                    </div>
                    <p style={{ fontSize: '11.5px', color: '#555' }}>{p.description}</p>
                    {p.impact && <p style={{ fontSize: '11px', color: t.accent, marginTop: '5px', fontWeight: 600 }}>📈 {p.impact}</p>}
                  </div>
                ))}
              </div>
            </section>
          )}

          {data.education.length > 0 && (
            <section>
              <h2 style={{ fontSize: '13px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.12em', color: t.primary, marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <GraduationCap size={14} style={{ color: t.accent }} /> Education
              </h2>
              {data.education.map((edu, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: i < data.education.length - 1 ? '1px dashed #e5e7eb' : 'none' }}>
                  <div>
                    <p style={{ fontWeight: 700, fontSize: '13.5px' }}>{edu.degree}</p>
                    <p style={{ fontSize: '12px', color: '#666' }}>{edu.institution}</p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <p style={{ fontSize: '12px', color: t.accent, fontWeight: 600 }}>{edu.year}</p>
                    {edu.score && <p style={{ fontSize: '11px', color: '#888' }}>{edu.score}</p>}
                  </div>
                </div>
              ))}
            </section>
          )}
        </div>

        {/* Right sidebar */}
        <div style={{ background: '#f8fafc', borderLeft: '1px solid #e5e7eb', padding: '28px 22px' }}>
          {/* Skill bars */}
          {allSkills.length > 0 && (
            <section style={{ marginBottom: '24px' }}>
              <h2 style={{ fontSize: '12px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.12em', color: t.primary, marginBottom: '14px' }}>Technical Skills</h2>
              {allSkills.slice(0, 8).map((s, i) => (
                <div key={i} style={{ marginBottom: '10px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <span style={{ fontSize: '11.5px', fontWeight: 600, color: '#334155' }}>{s}</span>
                    <span style={{ fontSize: '10px', color: t.accent }}>{skillLevels[i % skillLevels.length]}%</span>
                  </div>
                  <div style={{ height: '4px', background: '#e2e8f0', borderRadius: '2px' }}>
                    <div style={{ height: '100%', width: `${skillLevels[i % skillLevels.length]}%`, background: `linear-gradient(90deg, ${t.primary}, ${t.accent})`, borderRadius: '2px' }} />
                  </div>
                </div>
              ))}
            </section>
          )}

          {/* Tools */}
          {data.skills.tools.length > 0 && (
            <section style={{ marginBottom: '24px' }}>
              <h2 style={{ fontSize: '12px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.12em', color: t.primary, marginBottom: '12px' }}>Tools</h2>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
                {data.skills.tools.map((s, i) => (
                  <span key={i} style={{ fontSize: '11px', background: '#fff', border: `1px solid ${t.accent}40`, color: t.primary, padding: '3px 8px', borderRadius: '4px' }}>{s}</span>
                ))}
              </div>
            </section>
          )}

          {/* Soft skills */}
          {data.skills.soft.length > 0 && (
            <section style={{ marginBottom: '24px' }}>
              <h2 style={{ fontSize: '12px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.12em', color: t.primary, marginBottom: '10px' }}>Soft Skills</h2>
              {data.skills.soft.map((s, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
                  <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: t.accent, flexShrink: 0 }} />
                  <span style={{ fontSize: '12px', color: '#334155' }}>{s}</span>
                </div>
              ))}
            </section>
          )}

          {/* Certifications */}
          {data.certifications.length > 0 && (
            <section style={{ marginBottom: '24px' }}>
              <h2 style={{ fontSize: '12px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.12em', color: t.primary, marginBottom: '12px' }}>Certifications</h2>
              {data.certifications.map((c, i) => (
                <div key={i} style={{ marginBottom: '10px', padding: '8px', background: '#fff', borderRadius: '6px', border: `1px solid ${t.accent}30` }}>
                  <p style={{ fontSize: '11.5px', fontWeight: 700, color: t.primary }}>{c.name}</p>
                  <p style={{ fontSize: '11px', color: '#888' }}>{c.issuer} · {c.year}</p>
                </div>
              ))}
            </section>
          )}

          {/* Achievements */}
          {data.achievements.length > 0 && (
            <section>
              <h2 style={{ fontSize: '12px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.12em', color: t.primary, marginBottom: '12px' }}>Achievements</h2>
              {data.achievements.map((a, i) => (
                <div key={i} style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                  <Star size={12} style={{ color: t.accent, flexShrink: 0, marginTop: '3px' }} />
                  <p style={{ fontSize: '11.5px', color: '#374151' }}>{a}</p>
                </div>
              ))}
            </section>
          )}
        </div>
      </div>
    </div>
  )
}

// ─── Main Page ─────────────────────────────────────────────────────────────────

export default function ResumeBuilderPage() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [resumeData, setResumeData] = useState<ResumeData>(EMPTY_RESUME)
  const [hasResume, setHasResume] = useState(false)
  const [template, setTemplate] = useState<TemplateId>('classic')
  const [theme, setTheme] = useState<Theme>(THEMES[0])
  const [showThemes, setShowThemes] = useState(false)
  const [mobileTab, setMobileTab] = useState<'chat' | 'preview'>('chat')
  const [flowStep, setFlowStep] = useState<FlowStep>('greet')
  const [userInfo, setUserInfo] = useState<Record<string, string>>({})

  const chatEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  // ── Auto-scroll ──────────────────────────────────────────────────────────────
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isLoading])

  // ── Greet on mount ───────────────────────────────────────────────────────────
  useEffect(() => {
    const greet = async () => {
      try {
        // Try to load Supabase profile
        let profileName = ''
        try {
          const { createClient } = await import('@/lib/supabase/client')
          const supabase = createClient()
          const { data: { user } } = await supabase.auth.getUser()
          if (user) {
            const { data: profile } = await supabase
              .from('profiles')
              .select('full_name, email, phone, city, state')
              .eq('id', user.id)
              .single()
            if (profile) {
              profileName = profile.full_name || ''
              setUserInfo(prev => ({
                ...prev,
                name: profile.full_name || '',
                email: profile.email || user.email || '',
                phone: profile.phone || '',
                location: [profile.city, profile.state].filter(Boolean).join(', ')
              }))
            }
          }
        } catch {
          // Supabase not configured or user not logged in — continue without it
        }

        const greeting = profileName
          ? `Hey ${profileName.split(' ')[0]}! 👋 I'm your AI Resume Coach. Ready to build you a job-winning resume? What role are you targeting?`
          : `Hey there! 👋 I'm your AI Resume Coach — let's build you a resume that gets callbacks. What's your full name?`

        addAssistantMessage(greeting)
        setFlowStep(profileName ? 'role' : 'name')
      } catch {
        addAssistantMessage(`Hey there! 👋 I'm your AI Resume Coach. Let's build a resume that gets you hired. What's your full name?`)
        setFlowStep('name')
      }
    }
    greet()
  }, [])

  // ── Helpers ──────────────────────────────────────────────────────────────────
  const addAssistantMessage = useCallback((content: string) => {
    setMessages(prev => [...prev, {
      id: Math.random().toString(36).slice(2),
      role: 'assistant',
      content,
      ts: Date.now()
    }])
  }, [])

  const addUserMessage = useCallback((content: string) => {
    setMessages(prev => [...prev, {
      id: Math.random().toString(36).slice(2),
      role: 'user',
      content,
      ts: Date.now()
    }])
  }, [])

  // ── Build resume ─────────────────────────────────────────────────────────────
  const buildResume = useCallback(async (info: Record<string, string>) => {
    setIsLoading(true)
    addAssistantMessage('✨ Building your resume now — this takes about 10 seconds...')
    try {
      const result = await buildResumeJSON(info)
      setResumeData(result)
      setHasResume(true)
      setFlowStep('done')
      if (window.innerWidth >= 768) {
        // On desktop, stay on chat tab
      } else {
        setMobileTab('preview')
      }
      addAssistantMessage(`🎉 Your resume is ready, ${result.name.split(' ')[0] || 'there'}! Check it out on the right. You can tell me: "make summary stronger", "change theme to gold", "tailor for Google", or "add Docker to skills".`)
      toast.success('Resume built! Download it as PDF below.')
    } catch (err) {
      addAssistantMessage("Hmm, something went wrong building your resume. Let me try once more — just say 'rebuild' or 'build my resume'.")
      toast.error('Failed to generate resume. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }, [addAssistantMessage])

  // ── Question flow ────────────────────────────────────────────────────────────
  const handleFlowStep = useCallback(async (userText: string, step: FlowStep) => {
    const lower = userText.toLowerCase().trim()

    // Global shortcuts
    if (lower.includes('auto fill') || lower.includes('fill it yourself') || lower.includes('autofill')) {
      const info = { role: userInfo.role || userText.replace(/auto.?fill/i, '').trim() || 'Software Engineer', ...userInfo }
      await buildResume(info)
      return
    }
    if (lower.match(/^(just build|build resume|build it|build my resume|generate)/)) {
      const roleMatch = lower.match(/for (.+)$/)
      const info = { ...userInfo, role: roleMatch ? roleMatch[1] : (userInfo.role || 'Software Developer') }
      await buildResume(info)
      return
    }

    // Post-build commands
    if (step === 'done' && hasResume) {
      await handlePostBuildCommand(userText)
      return
    }

    // Flow steps
    switch (step) {
      case 'name':
        setUserInfo(prev => ({ ...prev, name: userText }))
        setFlowStep('role')
        addAssistantMessage(`Nice to meet you, ${userText.split(' ')[0]}! 🎯 What role are you targeting? (e.g. React Developer, Data Analyst, Product Manager)`)
        break

      case 'role':
        setUserInfo(prev => ({ ...prev, role: userText }))
        setFlowStep('experience')
        addAssistantMessage(`Great choice! How many years of experience do you have? (Type 0 if you're a fresher)`)
        break

      case 'experience':
        setUserInfo(prev => ({ ...prev, experience: userText }))
        setFlowStep('education')
        addAssistantMessage(`Got it. What's your highest education? (e.g. B.Tech Computer Science, NSIT, 2023, 8.4 CGPA)`)
        break

      case 'education':
        setUserInfo(prev => ({ ...prev, education: userText }))
        setFlowStep('skills')
        addAssistantMessage(`Perfect! List your top skills, comma-separated. (e.g. React, Node.js, Python, AWS)`)
        break

      case 'skills':
        setUserInfo(prev => ({ ...prev, skills: userText }))
        setFlowStep('work')
        addAssistantMessage(`Nice skills! Any work experience to mention? (e.g. TCS, Backend Dev, 2 years — or type "fresher" to skip)`)
        break

      case 'work':
        setUserInfo(prev => ({ ...prev, work: userText }))
        setFlowStep('projects')
        addAssistantMessage(`Any projects to highlight? (e.g. E-commerce site using React + Node, or type "skip")`)
        break

      case 'projects':
        setUserInfo(prev => ({ ...prev, projects: userText }))
        setFlowStep('location')
        addAssistantMessage(`Almost there! What's your current city and state? (e.g. Bangalore, Karnataka)`)
        break

      case 'location':
        setUserInfo(prev => ({ ...prev, location: userText }))
        setFlowStep('contact')
        addAssistantMessage(`Last thing — your email and phone number? (e.g. john@gmail.com, 9876543210)`)
        break

      case 'contact':
        setUserInfo(prev => ({ ...prev, contact: userText }))
        setFlowStep('confirm')
        addAssistantMessage(`All set! Ready to build your resume? Just say "yes" and I'll create it in seconds. 🚀`)
        break

      case 'confirm':
        if (lower.match(/yes|yep|sure|go|build|do it|ready|ok|okay|yeah|yup|create|make/)) {
          await buildResume({ ...userInfo, contact: userText !== lower ? userText : userInfo.contact })
        } else {
          addAssistantMessage(`Alright, just say "yes" when you're ready to build, or let me know what you'd like to change!`)
        }
        break

      default:
        // If no step matched, check if it's a build command
        if (lower.match(/build|create|generate|make|yes|go/)) {
          await buildResume(userInfo)
        } else {
          addAssistantMessage(`I'm not sure I caught that. You can continue answering the questions, or say "build my resume" to skip ahead!`)
        }
    }
  }, [userInfo, hasResume, buildResume, addAssistantMessage])

  // ── Post-build AI commands ───────────────────────────────────────────────────
  const handlePostBuildCommand = useCallback(async (userText: string) => {
    const lower = userText.toLowerCase()
    setIsLoading(true)

    try {
      // Theme change
      const themeMatch = lower.match(/change theme to (.+)|theme (.+)|use (.+) theme/)
      if (themeMatch) {
        const themeName = (themeMatch[1] || themeMatch[2] || themeMatch[3]).trim()
        const found = THEMES.find(t => t.label.toLowerCase().includes(themeName) || themeName.includes(t.id))
        if (found) {
          setTheme(found)
          addAssistantMessage(`Done! Switched to the ${found.label} theme. ✨`)
        } else {
          addAssistantMessage(`Available themes: Navy, Forest, Rose, Gold, Onyx. Which one?`)
        }
        setIsLoading(false)
        return
      }

      // Template change
      const templateMatch = lower.match(/switch to (.+) template|use (.+) template|change template to (.+)/)
      if (templateMatch) {
        const tName = (templateMatch[1] || templateMatch[2] || templateMatch[3]).trim().toLowerCase()
        const found = TEMPLATES.find(t => t.id.includes(tName) || tName.includes(t.id) || t.label.toLowerCase().includes(tName))
        if (found) {
          setTemplate(found.id)
          addAssistantMessage(`Switched to the ${found.label} template! 🎨`)
        } else {
          addAssistantMessage(`Available templates: Classic, Modern, Minimal, Executive, Creative. Which one?`)
        }
        setIsLoading(false)
        return
      }

      // AI-powered improvements
      let updatePrompt = ''
      let updateField = ''

      if (lower.includes('stronger summary') || lower.includes('improve summary') || lower.includes('make summary')) {
        updatePrompt = `Rewrite this professional summary to be more powerful, ATS-optimized, and tailored for a ${resumeData.headline} role. Current summary: "${resumeData.summary}". Return ONLY the new summary text, no quotes, no explanation.`
        updateField = 'summary'
      } else if (lower.includes('bullet points') || lower.includes('improve bullets') || lower.includes('rewrite bullets')) {
        updatePrompt = `Improve all these work experience bullet points to be stronger, more quantified, and use better action verbs. Current data: ${JSON.stringify(resumeData.experience)}. Return ONLY a JSON array of experience objects with the same structure but improved bullets. No markdown, no text before/after.`
        updateField = 'experience'
      } else if (lower.match(/add (.+) to skills/)) {
        const skill = lower.match(/add (.+) to skills/)![1]
        setResumeData(prev => ({
          ...prev,
          skills: {
            ...prev.skills,
            tools: [...prev.skills.tools, ...skill.split(',').map(s => s.trim())]
          }
        }))
        addAssistantMessage(`Added ${skill} to your skills! 💪`)
        setIsLoading(false)
        return
      } else if (lower.includes('tailor for') || lower.includes('optimize for')) {
        const company = lower.replace(/tailor for|optimize for/g, '').trim()
        updatePrompt = `Rewrite this resume to be tailored for a position at ${company}. Current data: ${JSON.stringify({ summary: resumeData.summary, experience: resumeData.experience, skills: resumeData.skills })}. Return ONLY a JSON with updated summary (string), experience (array), skills (object). Same structure. No markdown.`
        updateField = 'tailor'
      } else if (lower.includes('ats') || lower.includes('ats friendly') || lower.includes('optimize keywords')) {
        updatePrompt = `Make this resume more ATS-friendly by improving keywords for a ${resumeData.headline} role. Current: ${JSON.stringify({ summary: resumeData.summary, skills: resumeData.skills, experience: resumeData.experience })}. Return ONLY JSON with updated summary, skills, experience fields. No markdown.`
        updateField = 'tailor'
      } else if (lower.includes('add certification') || lower.includes('add cert')) {
        const certName = lower.replace(/add certification|add cert/g, '').trim()
        setResumeData(prev => ({
          ...prev,
          certifications: [...prev.certifications, { name: certName, issuer: 'Self-verified', year: '2024', url: '' }]
        }))
        addAssistantMessage(`Added ${certName} to your certifications! 🏆`)
        setIsLoading(false)
        return
      } else {
        // Generic AI instruction
        updatePrompt = `The user wants to update their resume with this instruction: "${userText}". Current resume data: ${JSON.stringify(resumeData)}. Apply the requested change and return the COMPLETE updated resume JSON with all fields. Return ONLY raw JSON, no markdown, no explanation.`
        updateField = 'full'
      }

      if (updatePrompt) {
        const response = await callAI(updatePrompt, 'Return only raw valid JSON or plain text as instructed. No markdown. No backticks. No explanation.')
        const cleaned = response.replace(/```json|```/g, '').trim()

        if (updateField === 'summary') {
          setResumeData(prev => ({ ...prev, summary: cleaned }))
          addAssistantMessage(`Done! Your summary is now more powerful and ATS-optimized. ✅`)
        } else if (updateField === 'experience') {
          const updated = JSON.parse(cleaned)
          setResumeData(prev => ({ ...prev, experience: Array.isArray(updated) ? updated : prev.experience }))
          addAssistantMessage(`Bullet points upgraded with stronger action verbs and metrics! 📈`)
        } else if (updateField === 'tailor') {
          const updated = JSON.parse(cleaned)
          setResumeData(prev => ({
            ...prev,
            summary: updated.summary || prev.summary,
            experience: updated.experience || prev.experience,
            skills: updated.skills || prev.skills
          }))
          addAssistantMessage(`Resume tailored and optimized! The keywords and framing are now aligned. 🎯`)
        } else if (updateField === 'full') {
          const updated = JSON.parse(cleaned)
          setResumeData(updated)
          addAssistantMessage(`Done! I've updated your resume as requested. Check the preview! 👀`)
        }
      }
    } catch {
      addAssistantMessage(`Hmm, something went wrong with that update. Try a more specific instruction like "make summary stronger" or "improve bullet points".`)
    } finally {
      setIsLoading(false)
    }
  }, [resumeData, addAssistantMessage])

  // ── Send message ─────────────────────────────────────────────────────────────
  const handleSend = useCallback(async () => {
    const text = input.trim()
    if (!text || isLoading) return

    setInput('')
    addUserMessage(text)

    await handleFlowStep(text, flowStep)
  }, [input, isLoading, flowStep, handleFlowStep, addUserMessage])

  // ── PDF download ─────────────────────────────────────────────────────────────
  const downloadPDF = useCallback(() => {
    const previewEl = document.getElementById('resume-preview-content')
    if (!previewEl) { toast.error('Build your resume first!'); return }

    const printWindow = window.open('', '_blank')
    if (!printWindow) { toast.error('Please allow popups to download PDF'); return }

    const styles = Array.from(document.styleSheets)
      .map(sheet => {
        try {
          return Array.from(sheet.cssRules).map(rule => rule.cssText).join('\n')
        } catch { return '' }
      }).join('\n')

    printWindow.document.write(`<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>${resumeData.name || 'Resume'} - Resume</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { background: white; }
    @page { size: A4; margin: 0; }
    @media print {
      body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
      * { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
    }
    ${styles}
  </style>
</head>
<body>
  ${previewEl.outerHTML}
  <script>
    window.addEventListener('load', function() {
      setTimeout(function() { window.print(); window.close(); }, 500);
    });
  <\/script>
</body>
</html>`)
    printWindow.document.close()
    toast.success('📄 PDF dialog opening — save as PDF!')
  }, [resumeData.name])

  // ── Current template renderer ────────────────────────────────────────────────
  const renderTemplate = () => {
    const props = { data: resumeData, theme }
    switch (template) {
      case 'classic': return <ClassicTemplate {...props} />
      case 'modern': return <ModernTemplate {...props} />
      case 'minimal': return <MinimalTemplate {...props} />
      case 'executive': return <ExecutiveTemplate {...props} />
      case 'creative': return <CreativeTemplate {...props} />
    }
  }

  // ─── Render ──────────────────────────────────────────────────────────────────
  return (
    <div className="flex flex-col h-screen bg-gray-950 text-gray-100 overflow-hidden">

      {/* ── Top Bar ── */}
      <header className="flex items-center justify-between px-4 md:px-6 py-3 bg-gray-900 border-b border-gray-800 shrink-0 z-10">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
            <Sparkles size={16} className="text-white" />
          </div>
          <div>
            <h1 className="font-bold text-sm text-white leading-tight">AI Resume Studio</h1>
            <p className="text-xs text-gray-400 hidden md:block">by LYU — Career Platform for India</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Theme picker */}
          <div className="relative">
            <button
              onClick={() => setShowThemes(!showThemes)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gray-800 hover:bg-gray-700 transition text-xs text-gray-300"
            >
              <Palette size={14} />
              <span className="hidden sm:inline">{theme.label}</span>
            </button>
            <AnimatePresence>
              {showThemes && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  className="absolute right-0 top-9 bg-gray-800 border border-gray-700 rounded-xl p-2 flex gap-2 shadow-2xl z-50"
                >
                  {THEMES.map(t => (
                    <button
                      key={t.id}
                      onClick={() => { setTheme(t); setShowThemes(false) }}
                      className="flex flex-col items-center gap-1 px-2 py-1 rounded-lg hover:bg-gray-700 transition"
                    >
                      <div className="w-6 h-6 rounded-full border-2 border-white/20" style={{ background: t.primary }} />
                      <span className="text-xs text-gray-300 whitespace-nowrap">{t.label}</span>
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Download button */}
          <button
            onClick={downloadPDF}
            className="flex items-center gap-2 px-4 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 transition text-white text-sm font-medium"
          >
            <Download size={14} />
            <span>PDF</span>
          </button>
        </div>
      </header>

      {/* ── Mobile Tab Switcher ── */}
      <div className="md:hidden flex border-b border-gray-800 bg-gray-900 shrink-0">
        <button
          onClick={() => setMobileTab('chat')}
          className={`flex-1 py-2.5 text-sm font-medium flex items-center justify-center gap-2 transition ${mobileTab === 'chat' ? 'text-indigo-400 border-b-2 border-indigo-500' : 'text-gray-500'}`}
        >
          <Bot size={16} /> Chat
        </button>
        <button
          onClick={() => setMobileTab('preview')}
          className={`flex-1 py-2.5 text-sm font-medium flex items-center justify-center gap-2 transition ${mobileTab === 'preview' ? 'text-indigo-400 border-b-2 border-indigo-500' : 'text-gray-500'}`}
        >
          <FileText size={16} /> Preview {hasResume && <span className="w-2 h-2 rounded-full bg-green-500" />}
        </button>
      </div>

      {/* ── Main Layout ── */}
      <div className="flex flex-1 min-h-0">

        {/* ── Left: Chat Panel ── */}
        <div className={`
          ${mobileTab === 'chat' ? 'flex' : 'hidden'} md:flex
          flex-col w-full md:w-[380px] md:min-w-[380px] md:max-w-[380px]
          border-r border-gray-800 bg-gray-900
        `}>
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3" style={{ scrollBehavior: 'smooth' }}>
            <AnimatePresence initial={false}>
              {messages.map(msg => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25 }}
                  className={`flex gap-2.5 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
                >
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 ${
                    msg.role === 'assistant'
                      ? 'bg-gradient-to-br from-indigo-500 to-purple-600'
                      : 'bg-gray-700'
                  }`}>
                    {msg.role === 'assistant' ? <Bot size={14} className="text-white" /> : <User size={14} className="text-gray-300" />}
                  </div>
                  <div className={`max-w-[82%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                    msg.role === 'assistant'
                      ? 'bg-gray-800 text-gray-100 rounded-tl-sm'
                      : 'bg-indigo-600 text-white rounded-tr-sm'
                  }`}>
                    {msg.content}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {/* Typing indicator */}
            {isLoading && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex gap-2.5"
              >
                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shrink-0">
                  <Bot size={14} className="text-white" />
                </div>
                <div className="bg-gray-800 rounded-2xl rounded-tl-sm px-4 py-3">
                  <TypingDots />
                </div>
              </motion.div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Quick hints */}
          {flowStep === 'done' && (
            <div className="px-3 pb-2 flex flex-wrap gap-1.5">
              {[
                'Make summary stronger',
                'Improve bullet points',
                'Make it ATS friendly',
                'Modern template',
              ].map(hint => (
                <button
                  key={hint}
                  onClick={() => {
                    setInput(hint)
                    inputRef.current?.focus()
                  }}
                  className="text-xs px-2.5 py-1 rounded-full bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-gray-200 transition border border-gray-700"
                >
                  {hint}
                </button>
              ))}
            </div>
          )}

          {/* Input area */}
          <div className="p-3 border-t border-gray-800">
            <div className="flex gap-2 items-end">
              <textarea
                ref={inputRef}
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault()
                    handleSend()
                  }
                }}
                placeholder={
                  flowStep === 'done'
                    ? 'Ask me to improve anything...'
                    : 'Type your answer...'
                }
                rows={1}
                className="flex-1 bg-gray-800 text-gray-100 placeholder-gray-500 rounded-xl px-4 py-2.5 text-sm resize-none border border-gray-700 focus:outline-none focus:border-indigo-500 transition"
                style={{ minHeight: '42px', maxHeight: '120px' }}
              />
              <button
                onClick={handleSend}
                disabled={isLoading || !input.trim()}
                className="w-10 h-10 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center transition shrink-0"
              >
                {isLoading ? <Loader2 size={16} className="text-white animate-spin" /> : <Send size={16} className="text-white" />}
              </button>
            </div>
            <p className="text-xs text-gray-600 mt-1.5 text-center">
              Tip: say <span className="text-indigo-400">"auto fill"</span> to skip questions
            </p>
          </div>
        </div>

        {/* ── Right: Preview Panel ── */}
        <div className={`
          ${mobileTab === 'preview' ? 'flex' : 'hidden'} md:flex
          flex-col flex-1 bg-gray-950 min-h-0
        `}>
          {/* Template switcher */}
          <div className="flex items-center gap-1 px-4 py-2 border-b border-gray-800 bg-gray-900 shrink-0 overflow-x-auto">
            <span className="text-xs text-gray-500 mr-1 whitespace-nowrap shrink-0">Template:</span>
            {TEMPLATES.map(t => {
              const Icon = t.icon
              return (
                <button
                  key={t.id}
                  onClick={() => setTemplate(t.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition whitespace-nowrap shrink-0 ${
                    template === t.id
                      ? 'bg-indigo-600 text-white'
                      : 'bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-gray-200'
                  }`}
                >
                  <Icon size={12} />
                  {t.label}
                </button>
              )
            })}
          </div>

          {/* Resume preview */}
          <div className="flex-1 overflow-auto p-4 md:p-6">
            {hasResume ? (
              <motion.div
                key={`${template}-${theme.id}`}
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                className="bg-white rounded-lg shadow-2xl overflow-hidden max-w-[794px] mx-auto"
              >
                {renderTemplate()}
              </motion.div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-center gap-6 py-16">
                <div className="w-20 h-20 rounded-2xl bg-gray-900 border border-gray-800 flex items-center justify-center">
                  <FileText size={36} className="text-gray-600" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-300 mb-2">Your Resume Preview</h2>
                  <p className="text-gray-500 text-sm max-w-xs">Answer the questions in the chat, or say <strong className="text-indigo-400">"auto fill"</strong> to let AI build everything for you instantly.</p>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-w-md">
                  {[
                    { icon: Zap, text: 'ATS Optimized', color: 'text-yellow-400' },
                    { icon: Award, text: 'Action Verbs', color: 'text-green-400' },
                    { icon: Star, text: '5 Templates', color: 'text-purple-400' },
                    { icon: Code2, text: 'Indian Context', color: 'text-blue-400' },
                    { icon: Download, text: 'PDF Export', color: 'text-red-400' },
                    { icon: RefreshCw, text: 'AI Edits', color: 'text-indigo-400' },
                  ].map(({ icon: Icon, text, color }) => (
                    <div key={text} className="flex items-center gap-2 p-3 bg-gray-900 border border-gray-800 rounded-xl text-sm text-gray-400">
                      <Icon size={16} className={color} />
                      {text}
                    </div>
                  ))}
                </div>

                {/* Template previews */}
                <div className="flex gap-2 flex-wrap justify-center mt-2">
                  {TEMPLATES.map(t => {
                    const Icon = t.icon
                    return (
                      <button
                        key={t.id}
                        onClick={() => setTemplate(t.id)}
                        className={`flex flex-col items-center gap-1 px-4 py-3 rounded-xl border transition ${
                          template === t.id
                            ? 'bg-indigo-600 border-indigo-500 text-white'
                            : 'bg-gray-900 border-gray-800 text-gray-400 hover:border-gray-600'
                        }`}
                      >
                        <Icon size={20} />
                        <span className="text-xs font-medium">{t.label}</span>
                        <span className="text-xs opacity-60">{t.desc}</span>
                      </button>
                    )
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Bottom action bar */}
          {hasResume && (
            <div className="border-t border-gray-800 bg-gray-900 px-4 py-3 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <span className="text-xs text-gray-400">Resume ready · {resumeData.experience.length} exp · {resumeData.skills.technical.length + resumeData.skills.languages.length} skills</span>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setResumeData(EMPTY_RESUME)
                    setHasResume(false)
                    setFlowStep('name')
                    setUserInfo({})
                    setMessages([])
                    addAssistantMessage(`Let's start fresh! 🔄 What's your full name?`)
                  }}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-400 text-xs transition"
                >
                  <RefreshCw size={12} />
                  Rebuild
                </button>
                <button
                  onClick={downloadPDF}
                  className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium transition"
                >
                  <Download size={14} />
                  Download PDF
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
