'use client'

import { useState, useRef, useCallback, useEffect } from 'react'
import {
  Download, FileText, Loader2, ChevronRight, Sparkles,
  RefreshCw, ChevronDown, Edit3, ArrowLeft
} from 'lucide-react'

// ─── TYPES ───────────────────────────────────────────────────────────────────

interface ExperienceItem {
  id: string; company: string; role: string; duration: string
  location: string; bullets: string[]
}
interface EducationItem {
  id: string; institution: string; degree: string; field: string; year: string; cgpa: string
}
interface SkillGroup { id: string; category: string; items: string[] }
interface ProjectItem {
  id: string; name: string; tech: string; description: string; link: string; bullets: string[]
}
interface ResumeData {
  name: string; title: string; email: string; phone: string; location: string
  linkedin: string; github: string; website: string; summary: string
  experience: ExperienceItem[]; education: EducationItem[]
  skills: SkillGroup[]; projects: ProjectItem[]
  certifications: string[]; languages: { language: string; level: string }[]
  documentType: 'resume' | 'cv'; targetRole: string; targetIndustry: string
}
interface Message { role: 'user' | 'ai'; text: string; timestamp: number }

// ─── TEMPLATES ───────────────────────────────────────────────────────────────

const TEMPLATES = [
  { id: 'executive', name: 'Executive', description: 'Senior & leadership roles', accent: '#0f2942', secondary: '#c9a84c', font: 'Georgia, "Times New Roman", serif', layout: 'single', preview: 'linear-gradient(135deg,#0f2942 0%,#1a4268 100%)' },
  { id: 'modern',   name: 'Modern',    description: 'Tech & design roles',       accent: '#1565c0', secondary: '#42a5f5', font: '"Helvetica Neue", Arial, sans-serif', layout: 'sidebar', preview: 'linear-gradient(135deg,#1565c0 0%,#1976d2 100%)' },
  { id: 'minimal',  name: 'Minimal',   description: 'Academic & research',        accent: '#1a1a1a', secondary: '#555',    font: '"Times New Roman", Georgia, serif', layout: 'single', preview: 'linear-gradient(135deg,#1a1a1a 0%,#444 100%)' },
  { id: 'creative', name: 'Creative',  description: 'Design & marketing',         accent: '#5b21b6', secondary: '#a78bfa', font: '"Arial", sans-serif', layout: 'accent-bar', preview: 'linear-gradient(135deg,#5b21b6 0%,#7c3aed 100%)' },
  { id: 'tech',     name: 'Tech',      description: 'Engineering & data',         accent: '#065f46', secondary: '#34d399', font: '"Courier New", monospace', layout: 'tech-header', preview: 'linear-gradient(135deg,#065f46 0%,#047857 100%)' },
  { id: 'finance',  name: 'Finance',   description: 'Banking, law & consulting',  accent: '#1c3a1e', secondary: '#4caf50', font: 'Garamond, Georgia, serif', layout: 'single', preview: 'linear-gradient(135deg,#1c3a1e 0%,#2e5731 100%)' },
]

const emptyResume = (): ResumeData => ({
  name: '', title: '', email: '', phone: '', location: '', linkedin: '', github: '', website: '', summary: '',
  experience: [], education: [], skills: [], projects: [], certifications: [], languages: [],
  documentType: 'resume', targetRole: '', targetIndustry: ''
})

// ─── AI ENGINE ───────────────────────────────────────────────────────────────

async function callAI(userMessage: string, history: Message[], collected: Partial<ResumeData>): Promise<{
  reply: string; collectedUpdate: Partial<ResumeData>; readyToGenerate: boolean; resumeData?: ResumeData
}> {
  const systemPrompt = `You are Aria, an elite professional resume writer and ATS expert at a top career consulting firm.

YOUR PERSONALITY: Warm, sharp, confident. You ask smart questions and give professional advice.

CONVERSATION RULES — CRITICAL:
1. Ask ONLY ONE question per message. Never two. Never three.
2. Keep questions under 20 words.
3. If the user says anything like "skip", "you choose", "fill it yourself", "auto-fill", "random", "decide for yourself", "generate based on role", "use your judgment" — IMMEDIATELY generate the full resume using intelligent defaults based on what you know. DO NOT ask more questions. Set readyToGenerate: true.
4. If user says "build", "create", "generate", "done", "make it", "go ahead", "ready" — same thing: generate immediately.
5. Never repeat a question you already asked.
6. Acknowledge what the user shared before asking the next thing.

WHAT TO COLLECT (in order, one question at a time):
- Full name
- Target job title / role
- Current/past job experience (company, role, achievements)
- Education (degree, institution)
- Skills (technical and soft)
- Projects (if any)
- Contact info (email, phone, location, LinkedIn)

WHEN GENERATING — make it EXCEPTIONAL:
- Write a powerful 3-sentence professional summary with impact and keywords
- Turn every bullet into an achievement with metrics (%, numbers, scale)
- Group skills intelligently: Languages, Frameworks, Tools, Cloud, Databases, etc.
- Make it ATS-optimized with industry keywords
- If user skipped sections, fill them with REALISTIC, PLAUSIBLE examples for their role
- Make experience bullets extremely specific: "Engineered real-time data pipeline processing 2M+ events/day using Apache Kafka and Spark, reducing latency by 68%"

COLLECTED SO FAR: ${JSON.stringify(collected)}
RECENT HISTORY: ${history.slice(-8).map(m => `${m.role}: ${m.text}`).join('\n')}

RESPOND IN VALID JSON ONLY (no markdown, no code fences):
{
  "reply": "your message to the user",
  "collectedUpdate": { ...any new fields extracted from user message },
  "readyToGenerate": false,
  "resumeData": null
}

When readyToGenerate is true, include full resumeData:
{
  "reply": "Your resume is ready! ✨ Here's your professional [role] resume.",
  "collectedUpdate": {},
  "readyToGenerate": true,
  "resumeData": {
    "name": "Full Name",
    "title": "Job Title",
    "email": "email@example.com",
    "phone": "+91 98765 43210",
    "location": "City, State",
    "linkedin": "linkedin.com/in/username",
    "github": "github.com/username",
    "website": "",
    "summary": "Results-driven [title] with X+ years of experience building [specific things]. Proven track record of [achievement]. Passionate about [relevant area] with expertise in [key technologies].",
    "experience": [
      {
        "id": "exp-1",
        "company": "Company Name",
        "role": "Job Title",
        "duration": "Jan 2022 – Present",
        "location": "City, India",
        "bullets": [
          "Engineered [specific thing] resulting in [X]% improvement in [metric]",
          "Led team of [N] engineers to deliver [project] [N] weeks ahead of schedule",
          "Architected [system] serving [N]M+ users with 99.9% uptime"
        ]
      }
    ],
    "education": [
      { "id": "edu-1", "institution": "University Name", "degree": "B.Tech / B.E.", "field": "Computer Science", "year": "2022", "cgpa": "8.6/10" }
    ],
    "skills": [
      { "id": "sk-1", "category": "Programming Languages", "items": ["JavaScript", "TypeScript", "Python"] },
      { "id": "sk-2", "category": "Frameworks & Libraries", "items": ["React", "Node.js", "Express", "Next.js"] },
      { "id": "sk-3", "category": "Databases", "items": ["PostgreSQL", "MongoDB", "Redis"] },
      { "id": "sk-4", "category": "Cloud & DevOps", "items": ["AWS", "Docker", "Kubernetes", "CI/CD"] },
      { "id": "sk-5", "category": "Tools", "items": ["Git", "Jira", "Figma", "Postman"] }
    ],
    "projects": [
      {
        "id": "pr-1",
        "name": "Project Name",
        "tech": "Next.js · Node.js · PostgreSQL · AWS",
        "description": "Full-stack platform with [specific features]",
        "link": "github.com/username/project",
        "bullets": [
          "Built [feature] reducing [metric] by [X]%",
          "Implemented [technical thing] to handle [scale]"
        ]
      }
    ],
    "certifications": ["AWS Certified Solutions Architect", "Google Cloud Professional"],
    "languages": [{"language": "English", "level": "Professional"}, {"language": "Hindi", "level": "Native"}],
    "documentType": "resume",
    "targetRole": "Software Engineer",
    "targetIndustry": "Technology"
  }
}`

  try {
    const res = await fetch('/api/v1/ai/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        messages: [
          ...history.slice(-8).map(m => ({ role: m.role === 'ai' ? 'assistant' : 'user', content: m.text })),
          { role: 'user', content: userMessage }
        ],
        systemOverride: systemPrompt,
      }),
    })
    const data = await res.json()
    let raw = (data.reply || '').trim().replace(/^```json\s*/i, '').replace(/^```\s*/i, '').replace(/```\s*$/i, '').trim()
    // Handle case where AI wraps in object with extra keys
    const parsed = JSON.parse(raw)
    return {
      reply: parsed.reply || "Tell me more about your background!",
      collectedUpdate: parsed.collectedUpdate || {},
      readyToGenerate: !!parsed.readyToGenerate,
      resumeData: parsed.resumeData || undefined
    }
  } catch {
    return { reply: "Let's keep going! What's your name and the role you're targeting?", collectedUpdate: {}, readyToGenerate: false }
  }
}

// ─── PDF HTML GENERATOR ───────────────────────────────────────────────────────

function buildPDFHTML(data: ResumeData, template: typeof TEMPLATES[0]): string {
  const { accent, secondary, font } = template
  const isSidebar = template.layout === 'sidebar'
  const isTechHeader = template.layout === 'tech-header'
  const isAccentBar = template.layout === 'accent-bar'

  const contacts = [
    data.email && `<span>✉&nbsp;${data.email}</span>`,
    data.phone && `<span>📱&nbsp;${data.phone}</span>`,
    data.location && `<span>📍&nbsp;${data.location}</span>`,
    data.linkedin && `<span>🔗&nbsp;${data.linkedin}</span>`,
    data.github && `<span>⌨&nbsp;${data.github}</span>`,
    data.website && `<span>🌐&nbsp;${data.website}</span>`,
  ].filter(Boolean).join('')

  const expHTML = data.experience.map(e => `
  <div class="item">
    <div class="item-head">
      <div><span class="item-title">${e.role}</span><span class="item-sub"> — ${e.company}${e.location ? ` · ${e.location}` : ''}</span></div>
      <span class="item-date">${e.duration}</span>
    </div>
    <ul>${e.bullets.map(b => `<li>${b}</li>`).join('')}</ul>
  </div>`).join('')

  const eduHTML = data.education.map(e => `
  <div class="edu-row">
    <div><div class="item-title">${e.degree}${e.field ? ` in ${e.field}` : ''}</div><div class="item-sub">${e.institution}</div></div>
    <div style="text-align:right"><div class="item-date">${e.year}</div>${e.cgpa ? `<div style="font-size:8.5pt;font-weight:700;color:${accent}">${e.cgpa}</div>` : ''}</div>
  </div>`).join('')

  const skillsHTML = data.skills.map(s => `
  <div class="skill-row"><span class="skill-cat">${s.category}:</span><span class="skill-val">${s.items.join(', ')}</span></div>`).join('')

  const projHTML = data.projects.map(p => `
  <div class="item">
    <div class="item-head">
      <div><span class="item-title">${p.name}</span><span class="item-sub"> · ${p.tech}</span></div>
      ${p.link ? `<span style="font-size:8pt;color:${accent}">${p.link}</span>` : ''}
    </div>
    ${p.description ? `<div class="proj-desc">${p.description}</div>` : ''}
    ${p.bullets?.length ? `<ul>${p.bullets.map(b => `<li>${b}</li>`).join('')}</ul>` : ''}
  </div>`).join('')

  const certsHTML = data.certifications.length ? `
  <div class="cert-wrap">${data.certifications.map(c => `<span class="cert-tag">✓ ${c}</span>`).join('')}</div>` : ''

  const sectionH = (t: string) => `<div class="sec-head"><span class="sec-title">${t}</span><div class="sec-line"></div></div>`

  if (isSidebar) {
    return `<!DOCTYPE html><html><head><meta charset="UTF-8"><title>${data.name}</title>
<style>
*{margin:0;padding:0;box-sizing:border-box}
body{font-family:${font};font-size:9.5pt;background:#fff;-webkit-print-color-adjust:exact;print-color-adjust:exact}
@page{size:A4;margin:0}
.wrap{display:flex;width:210mm;min-height:297mm}
.side{width:70mm;background:${accent};color:#fff;padding:30px 18px;flex-shrink:0}
.main{flex:1;padding:28px 22px}
.av{width:58px;height:58px;border-radius:50%;background:rgba(255,255,255,.15);display:flex;align-items:center;justify-content:center;font-size:22px;font-weight:900;margin:0 auto 12px;text-transform:uppercase}
.s-name{font-size:14.5pt;font-weight:800;text-align:center;line-height:1.2;margin-bottom:3px}
.s-title{font-size:8.5pt;text-align:center;opacity:.7;font-style:italic;margin-bottom:20px}
.s-label{font-size:6.5pt;font-weight:800;text-transform:uppercase;letter-spacing:2px;opacity:.45;border-bottom:1px solid rgba(255,255,255,.18);padding-bottom:3px;margin-bottom:8px}
.s-block{margin-bottom:16px}
.s-line{font-size:8pt;opacity:.78;margin-bottom:4px;line-height:1.45;word-break:break-word}
.s-skill-cat{font-size:7.5pt;font-weight:700;opacity:.88;margin-bottom:1px}
.s-skill-val{font-size:7pt;opacity:.62;margin-bottom:5px;line-height:1.4}
.s-cert{font-size:7.5pt;opacity:.72;margin-bottom:3px;padding-left:11px;position:relative}
.s-cert::before{content:"✓";position:absolute;left:0}
.m-sec{margin-bottom:15px}
.sec-head{display:flex;align-items:center;gap:9px;margin-bottom:9px}
.sec-title{font-size:7.5pt;font-weight:800;text-transform:uppercase;letter-spacing:1.8px;color:${accent};white-space:nowrap}
.sec-line{flex:1;height:1.5px;background:${accent};opacity:.25}
.summary{font-size:9pt;line-height:1.7;color:#444}
.item{margin-bottom:11px}
.item-head{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:2px;gap:8px}
.item-title{font-weight:700;font-size:9.5pt;color:#111}
.item-sub{font-size:8.5pt;color:${accent};font-style:italic}
.item-date{font-size:8pt;color:#888;white-space:nowrap;flex-shrink:0}
ul{padding-left:14px;margin-top:3px}
li{font-size:8.5pt;line-height:1.58;color:#444;margin-bottom:1.5px}
.edu-row{display:flex;justify-content:space-between;margin-bottom:8px;gap:8px}
.skill-row{display:flex;gap:9px;margin-bottom:3px;font-size:9pt}
.skill-cat{font-weight:700;width:130px;flex-shrink:0;color:#333}
.skill-val{color:#555}
.proj-desc{font-size:8.5pt;color:#555;margin:3px 0 2px;line-height:1.45}
.cert-wrap{display:flex;flex-wrap:wrap;gap:5px}
.cert-tag{font-size:8.5pt;border:1px solid ${accent}55;padding:2px 10px;border-radius:3px;color:${accent}}
</style></head><body><div class="wrap">
<div class="side">
  <div class="av">${data.name ? data.name[0] : 'R'}</div>
  <div class="s-name">${data.name || 'Full Name'}</div>
  <div class="s-title">${data.title || ''}</div>
  <div class="s-block">
    <div class="s-label">Contact</div>
    ${data.email ? `<div class="s-line">✉ ${data.email}</div>` : ''}
    ${data.phone ? `<div class="s-line">📱 ${data.phone}</div>` : ''}
    ${data.location ? `<div class="s-line">📍 ${data.location}</div>` : ''}
    ${data.linkedin ? `<div class="s-line">🔗 ${data.linkedin}</div>` : ''}
    ${data.github ? `<div class="s-line">⌨ ${data.github}</div>` : ''}
  </div>
  ${data.skills.length ? `<div class="s-block"><div class="s-label">Skills</div>${data.skills.map(s => `<div class="s-skill-cat">${s.category}</div><div class="s-skill-val">${s.items.join(' · ')}</div>`).join('')}</div>` : ''}
  ${data.languages.length ? `<div class="s-block"><div class="s-label">Languages</div>${data.languages.map(l => `<div class="s-line">${l.language} <span style="opacity:.5">(${l.level})</span></div>`).join('')}</div>` : ''}
  ${data.certifications.length ? `<div class="s-block"><div class="s-label">Certifications</div>${data.certifications.map(c => `<div class="s-cert">${c}</div>`).join('')}</div>` : ''}
</div>
<div class="main">
  ${data.summary ? `<div class="m-sec">${sectionH('Professional Profile')}<p class="summary">${data.summary}</p></div>` : ''}
  ${data.experience.length ? `<div class="m-sec">${sectionH('Work Experience')}${expHTML}</div>` : ''}
  ${data.education.length ? `<div class="m-sec">${sectionH('Education')}${eduHTML}</div>` : ''}
  ${data.projects.length ? `<div class="m-sec">${sectionH('Projects')}${projHTML}</div>` : ''}
</div>
</div></body></html>`
  }

  // Single-column base
  const headerCSS = isTechHeader
    ? `.header{background:${accent};color:#fff;padding:22px 22px 18px;margin:-18mm -20mm 18px}`
    : isAccentBar
    ? `.header{border-left:5px solid ${accent};padding:0 0 12px 16px;margin-bottom:16px}`
    : `.header{border-bottom:2.5px solid ${accent};padding-bottom:12px;margin-bottom:16px}`

  const nameColor = isTechHeader ? '#fff' : accent
  const subColor = isTechHeader ? 'rgba(255,255,255,.75)' : '#555'
  const contactColor = isTechHeader ? 'rgba(255,255,255,.65)' : '#666'

  return `<!DOCTYPE html><html><head><meta charset="UTF-8"><title>${data.name}</title>
<style>
*{margin:0;padding:0;box-sizing:border-box}
body{font-family:${font};font-size:9.5pt;color:#1a1a1a;background:#fff;-webkit-print-color-adjust:exact;print-color-adjust:exact;padding:18mm 20mm}
@page{size:A4;margin:0}
${headerCSS}
.name{font-size:22pt;font-weight:900;color:${nameColor};letter-spacing:-.5px;line-height:1.1}
.title-line{font-size:10.5pt;color:${subColor};margin:4px 0 7px}
.contacts{display:flex;flex-wrap:wrap;gap:3px 14px;font-size:8.5pt;color:${contactColor}}
.sec-head{display:flex;align-items:center;gap:9px;margin-bottom:9px}
.sec-title{font-size:7.5pt;font-weight:800;text-transform:uppercase;letter-spacing:1.8px;color:${accent};white-space:nowrap}
.sec-line{flex:1;height:1.5px;background:${accent};opacity:.28}
.section{margin-bottom:14px}
.summary{font-size:9pt;line-height:1.72;color:#444}
.item{margin-bottom:11px}
.item-head{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:2px;gap:8px}
.item-title{font-weight:700;font-size:9.5pt;color:#111}
.item-sub{font-size:8.5pt;color:${accent};font-style:italic}
.item-date{font-size:8pt;color:#888;white-space:nowrap;flex-shrink:0}
ul{padding-left:14px;margin-top:3px}
li{font-size:8.5pt;line-height:1.58;color:#444;margin-bottom:1.5px}
.edu-row{display:flex;justify-content:space-between;margin-bottom:8px;gap:8px}
.skill-row{display:flex;gap:9px;margin-bottom:4px;font-size:9pt}
.skill-cat{font-weight:700;width:130px;flex-shrink:0;color:#333}
.skill-val{color:#555;flex:1}
.proj-desc{font-size:8.5pt;color:#555;margin:3px 0 2px;line-height:1.45}
.cert-wrap{display:flex;flex-wrap:wrap;gap:5px}
.cert-tag{font-size:8.5pt;border:1px solid ${accent}55;padding:2px 10px;border-radius:3px;color:${accent}}
</style></head><body>
<div class="header">
  <div class="name">${data.name || 'Your Name'}</div>
  ${data.title ? `<div class="title-line">${data.title}</div>` : ''}
  <div class="contacts">${contacts}</div>
</div>
${data.summary ? `<div class="section">${sectionH('Professional Summary')}<p class="summary">${data.summary}</p></div>` : ''}
${data.experience.length ? `<div class="section">${sectionH('Work Experience')}${expHTML}</div>` : ''}
${data.education.length ? `<div class="section">${sectionH('Education')}${eduHTML}</div>` : ''}
${data.skills.length ? `<div class="section">${sectionH('Technical Skills')}${skillsHTML}</div>` : ''}
${data.projects.length ? `<div class="section">${sectionH('Projects')}${projHTML}</div>` : ''}
${data.certifications.length ? `<div class="section">${sectionH('Certifications')}${certsHTML}</div>` : ''}
${data.languages.length ? `<div class="section">${sectionH('Languages')}<div style="display:flex;gap:16px;flex-wrap:wrap">${data.languages.map(l => `<span style="font-size:9pt"><strong>${l.language}</strong> <span style="color:#888">(${l.level})</span></span>`).join('')}</div></div>` : ''}
</body></html>`
}

// ─── DOWNLOAD ─────────────────────────────────────────────────────────────────

function downloadPDF(data: ResumeData, template: typeof TEMPLATES[0]) {
  const html = buildPDFHTML(data, template)
  const fname = `${(data.name || 'resume').replace(/\s+/g, '_')}_${data.documentType}`

  const win = window.open('', '_blank')
  if (!win) {
    // popup blocked — fallback direct download
    const blob = new Blob([html], { type: 'text/html;charset=utf-8' })
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = `${fname}.html`
    a.click()
    return
  }

  win.document.write(`<!DOCTYPE html><html><head>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js"><\/script>
  </head><body style="margin:0">
  <div id="c"></div>
  <script>
    window.onload=function(){
      const c=document.getElementById('c');
      c.innerHTML=${JSON.stringify(html)};
      // extract inner body
      const p=new DOMParser();
      const d=p.parseFromString(${JSON.stringify(html)},'text/html');
      document.head.innerHTML=d.head.innerHTML;
      document.body.innerHTML=d.body.innerHTML;
      html2pdf().set({
        margin:0,filename:'${fname}.pdf',
        image:{type:'jpeg',quality:0.99},
        html2canvas:{scale:2,useCORS:true,letterRendering:true},
        jsPDF:{unit:'mm',format:'a4',orientation:'portrait'}
      }).from(document.body).save().then(()=>setTimeout(()=>window.close(),500));
    }
  <\/script>
  </body></html>`)
  win.document.close()
}

// ─── RESUME PREVIEW (React) ───────────────────────────────────────────────────

function ResumePreview({ data, template }: { data: ResumeData; template: typeof TEMPLATES[0] }) {
  const { accent, font } = template
  const isSidebar = template.layout === 'sidebar'
  const isTech = template.layout === 'tech-header'
  const isBar = template.layout === 'accent-bar'

  const SH = ({ title }: { title: string }) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8, marginTop: 2 }}>
      <span style={{ fontSize: 7, fontWeight: 800, textTransform: 'uppercase' as const, letterSpacing: '1.8px', color: accent, whiteSpace: 'nowrap' as const }}>{title}</span>
      <div style={{ flex: 1, height: 1.5, background: accent, opacity: 0.25 }} />
    </div>
  )

  const ExpItems = () => (
    <>{data.experience.map((e, i) => (
      <div key={i} style={{ marginBottom: 10 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8, marginBottom: 2 }}>
          <div>
            <span style={{ fontWeight: 700, fontSize: 9, color: '#111', display: 'block' }}>{e.role}</span>
            <span style={{ fontSize: 8, color: accent, fontStyle: 'italic' }}>{e.company}{e.location ? ` · ${e.location}` : ''}</span>
          </div>
          <span style={{ fontSize: 7.5, color: '#888', whiteSpace: 'nowrap' as const, flexShrink: 0 }}>{e.duration}</span>
        </div>
        <ul style={{ paddingLeft: 13, marginTop: 3 }}>
          {e.bullets.map((b, j) => <li key={j} style={{ fontSize: 8, color: '#444', lineHeight: 1.55, marginBottom: 1.5 }}>{b}</li>)}
        </ul>
      </div>
    ))}</>
  )

  const EduItems = () => (
    <>{data.education.map((e, i) => (
      <div key={i} style={{ display: 'flex', justifyContent: 'space-between', gap: 8, marginBottom: 7 }}>
        <div>
          <p style={{ fontWeight: 700, fontSize: 9, color: '#111' }}>{e.degree}{e.field ? ` in ${e.field}` : ''}</p>
          <p style={{ fontSize: 8, color: '#666', marginTop: 1 }}>{e.institution}</p>
        </div>
        <div style={{ textAlign: 'right' as const, flexShrink: 0 }}>
          <p style={{ fontSize: 8, color: '#888' }}>{e.year}</p>
          {e.cgpa && <p style={{ fontSize: 8, fontWeight: 700, color: accent }}>{e.cgpa}</p>}
        </div>
      </div>
    ))}</>
  )

  const SkillItems = () => (
    <>{data.skills.map((s, i) => (
      <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 3, fontSize: 8.5 }}>
        <span style={{ fontWeight: 700, width: 110, flexShrink: 0, color: '#333' }}>{s.category}:</span>
        <span style={{ color: '#555', flex: 1 }}>{s.items.join(', ')}</span>
      </div>
    ))}</>
  )

  const ProjItems = () => (
    <>{data.projects.map((p, i) => (
      <div key={i} style={{ marginBottom: 9 }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 5, marginBottom: 2, flexWrap: 'wrap' as const }}>
          <span style={{ fontWeight: 700, fontSize: 9, color: '#111' }}>{p.name}</span>
          <span style={{ fontSize: 7.5, color: '#888', fontStyle: 'italic' }}>· {p.tech}</span>
          {p.link && <span style={{ fontSize: 7.5, color: accent, marginLeft: 'auto' }}>{p.link}</span>}
        </div>
        {p.description && <p style={{ fontSize: 8, color: '#555', lineHeight: 1.45, marginBottom: 2 }}>{p.description}</p>}
        {p.bullets?.length > 0 && <ul style={{ paddingLeft: 13 }}>{p.bullets.map((b, j) => <li key={j} style={{ fontSize: 8, color: '#444', lineHeight: 1.5 }}>{b}</li>)}</ul>}
      </div>
    ))}</>
  )

  // SIDEBAR layout
  if (isSidebar) return (
    <div style={{ display: 'flex', background: 'white', fontFamily: font, fontSize: 9, boxShadow: '0 8px 40px rgba(0,0,0,0.14)', minHeight: 800 }}>
      <div style={{ width: '34%', background: accent, color: 'white', padding: '24px 15px', flexShrink: 0 }}>
        <div style={{ width: 52, height: 52, borderRadius: '50%', background: 'rgba(255,255,255,0.14)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, fontWeight: 900, margin: '0 auto 10px', textTransform: 'uppercase' as const }}>{data.name ? data.name[0] : 'R'}</div>
        <p style={{ fontSize: 12.5, fontWeight: 800, textAlign: 'center', marginBottom: 2 }}>{data.name || 'Full Name'}</p>
        <p style={{ fontSize: 8, textAlign: 'center', opacity: 0.68, marginBottom: 18, fontStyle: 'italic' }}>{data.title}</p>
        {/* Contact */}
        <div style={{ marginBottom: 14 }}>
          <p style={{ fontSize: 6.5, fontWeight: 800, textTransform: 'uppercase' as const, letterSpacing: '2px', opacity: 0.42, borderBottom: '1px solid rgba(255,255,255,0.18)', paddingBottom: 3, marginBottom: 7 }}>Contact</p>
          {data.email && <p style={{ fontSize: 7.5, opacity: 0.8, marginBottom: 3.5 }}>✉ {data.email}</p>}
          {data.phone && <p style={{ fontSize: 7.5, opacity: 0.8, marginBottom: 3.5 }}>📱 {data.phone}</p>}
          {data.location && <p style={{ fontSize: 7.5, opacity: 0.8, marginBottom: 3.5 }}>📍 {data.location}</p>}
          {data.linkedin && <p style={{ fontSize: 7.5, opacity: 0.76, marginBottom: 3.5, wordBreak: 'break-all' as const }}>🔗 {data.linkedin}</p>}
          {data.github && <p style={{ fontSize: 7.5, opacity: 0.76, marginBottom: 3.5 }}>⌨ {data.github}</p>}
        </div>
        {/* Skills */}
        {data.skills.length > 0 && <div style={{ marginBottom: 14 }}>
          <p style={{ fontSize: 6.5, fontWeight: 800, textTransform: 'uppercase' as const, letterSpacing: '2px', opacity: 0.42, borderBottom: '1px solid rgba(255,255,255,0.18)', paddingBottom: 3, marginBottom: 8 }}>Skills</p>
          {data.skills.map((s, i) => <div key={i} style={{ marginBottom: 6 }}>
            <p style={{ fontSize: 7.5, fontWeight: 700, opacity: 0.88, marginBottom: 1.5 }}>{s.category}</p>
            <p style={{ fontSize: 7, opacity: 0.6, lineHeight: 1.45 }}>{s.items.join(' · ')}</p>
          </div>)}
        </div>}
        {/* Certs */}
        {data.certifications.length > 0 && <div>
          <p style={{ fontSize: 6.5, fontWeight: 800, textTransform: 'uppercase' as const, letterSpacing: '2px', opacity: 0.42, borderBottom: '1px solid rgba(255,255,255,0.18)', paddingBottom: 3, marginBottom: 7 }}>Certifications</p>
          {data.certifications.map((c, i) => <p key={i} style={{ fontSize: 7.5, opacity: 0.72, marginBottom: 3.5 }}>✓ {c}</p>)}
        </div>}
      </div>
      {/* Main */}
      <div style={{ flex: 1, padding: '24px 18px' }}>
        {data.summary && <div style={{ marginBottom: 13 }}><SH title="Professional Profile" /><p style={{ fontSize: 8.5, color: '#444', lineHeight: 1.7 }}>{data.summary}</p></div>}
        {data.experience.length > 0 && <div style={{ marginBottom: 13 }}><SH title="Work Experience" /><ExpItems /></div>}
        {data.education.length > 0 && <div style={{ marginBottom: 13 }}><SH title="Education" /><EduItems /></div>}
        {data.projects.length > 0 && <div><SH title="Projects" /><ProjItems /></div>}
      </div>
    </div>
  )

  // Single-column variants
  const headerStyle: React.CSSProperties = isTech
    ? { background: accent, color: 'white', padding: '18px 22px', marginBottom: 16 }
    : isBar
    ? { borderLeft: `5px solid ${accent}`, paddingLeft: 15, paddingBottom: 11, marginBottom: 16 }
    : { borderBottom: `2.5px solid ${accent}`, paddingBottom: 11, marginBottom: 15 }

  return (
    <div style={{ background: 'white', fontFamily: font, fontSize: 9, padding: '22px 26px', boxShadow: '0 8px 40px rgba(0,0,0,0.14)', minHeight: 800 }}>
      <div style={headerStyle}>
        <p style={{ fontSize: 20, fontWeight: 900, color: isTech ? 'white' : accent, letterSpacing: '-0.5px', lineHeight: 1.1 }}>{data.name || 'Your Name'}</p>
        {data.title && <p style={{ fontSize: 10, color: isTech ? 'rgba(255,255,255,.75)' : '#555', margin: '4px 0 6px' }}>{data.title}</p>}
        <div style={{ display: 'flex', flexWrap: 'wrap' as const, gap: '2px 12px', fontSize: 8, color: isTech ? 'rgba(255,255,255,.65)' : '#666' }}>
          {data.email && <span>✉ {data.email}</span>}
          {data.phone && <span>📱 {data.phone}</span>}
          {data.location && <span>📍 {data.location}</span>}
          {data.linkedin && <span>🔗 {data.linkedin}</span>}
          {data.github && <span>⌨ {data.github}</span>}
        </div>
      </div>
      {data.summary && <div style={{ marginBottom: 13 }}><SH title="Professional Summary" /><p style={{ fontSize: 8.5, color: '#444', lineHeight: 1.72 }}>{data.summary}</p></div>}
      {data.experience.length > 0 && <div style={{ marginBottom: 13 }}><SH title="Work Experience" /><ExpItems /></div>}
      {data.education.length > 0 && <div style={{ marginBottom: 13 }}><SH title="Education" /><EduItems /></div>}
      {data.skills.length > 0 && <div style={{ marginBottom: 13 }}><SH title="Technical Skills" /><SkillItems /></div>}
      {data.projects.length > 0 && <div style={{ marginBottom: 13 }}><SH title="Projects" /><ProjItems /></div>}
      {data.certifications.length > 0 && <div style={{ marginBottom: 13 }}>
        <SH title="Certifications" />
        <div style={{ display: 'flex', flexWrap: 'wrap' as const, gap: 5 }}>
          {data.certifications.map((c, i) => <span key={i} style={{ fontSize: 8, border: `1px solid ${accent}55`, padding: '2px 10px', borderRadius: 3, color: accent }}>✓ {c}</span>)}
        </div>
      </div>}
      {data.languages.length > 0 && <div>
        <SH title="Languages" />
        <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' as const }}>
          {data.languages.map((l, i) => <span key={i} style={{ fontSize: 8.5 }}><strong>{l.language}</strong> <span style={{ color: '#888' }}>({l.level})</span></span>)}
        </div>
      </div>}
    </div>
  )
}

// ─── MAIN PAGE ────────────────────────────────────────────────────────────────

export default function ResumeStudioPage() {
  const [resumeData, setResumeData] = useState<ResumeData>(emptyResume())
  const [template, setTemplate] = useState(TEMPLATES[0])
  const [messages, setMessages] = useState<Message[]>([{
    role: 'ai',
    text: "Hi! I'm Aria, your resume expert. 👋\n\nI'll build you a professional, ATS-optimized resume through a quick conversation.\n\nAre you building a **Resume** or **CV**? And what role are you targeting?",
    timestamp: Date.now()
  }])
  const [collected, setCollected] = useState<Partial<ResumeData>>({})
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [hasResume, setHasResume] = useState(false)
  const [activeView, setActiveView] = useState<'chat' | 'preview'>('chat')
  const [showTemplates, setShowTemplates] = useState(false)
  const [isDownloading, setIsDownloading] = useState(false)
  const chatEndRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    setTimeout(() => chatEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 80)
  }, [messages, loading])

  const send = useCallback(async (text?: string) => {
    const msg = (text || input).trim()
    if (!msg || loading) return
    setInput('')
    if (textareaRef.current) textareaRef.current.style.height = 'auto'

    const newMsg: Message = { role: 'user', text: msg, timestamp: Date.now() }
    const newMsgs = [...messages, newMsg]
    setMessages(newMsgs)
    setLoading(true)

    try {
      const result = await callAI(msg, messages, collected)
      setCollected(prev => ({ ...prev, ...result.collectedUpdate }))
      const aiMsg: Message = { role: 'ai', text: result.reply, timestamp: Date.now() }
      setMessages([...newMsgs, aiMsg])

      if (result.readyToGenerate && result.resumeData) {
        const rd = result.resumeData
        // Normalize arrays
        rd.experience = (rd.experience || []).map((e, i) => ({ ...e, id: e.id || `exp-${i}` }))
        rd.education  = (rd.education  || []).map((e, i) => ({ ...e, id: e.id || `edu-${i}`, field: e.field || '' }))
        rd.skills     = (rd.skills     || []).map((s, i) => ({ ...s, id: s.id || `sk-${i}`, items: Array.isArray(s.items) ? s.items : String(s.items).split(',').map((x: string) => x.trim()) }))
        rd.projects   = (rd.projects   || []).map((p, i) => ({ ...p, id: p.id || `pr-${i}`, bullets: p.bullets || [] }))
        rd.certifications = rd.certifications || []
        rd.languages  = rd.languages || []
        setResumeData(rd)
        setHasResume(true)
        setTimeout(() => setActiveView('preview'), 500)
      }
    } catch {
      setMessages([...newMsgs, { role: 'ai', text: 'Something went wrong. Please try again.', timestamp: Date.now() }])
    } finally {
      setLoading(false)
    }
  }, [input, loading, messages, collected])

  const handleDownload = async () => {
    if (!hasResume || isDownloading) return
    setIsDownloading(true)
    downloadPDF(resumeData, template)
    setTimeout(() => setIsDownloading(false), 2500)
  }

  const reset = () => {
    setResumeData(emptyResume()); setHasResume(false); setCollected({})
    setMessages([{ role: 'ai', text: "Starting fresh! I'm Aria. Resume or CV — and what role are you targeting?", timestamp: Date.now() }])
    setActiveView('chat'); setInput('')
  }

  const quickPrompts = [
    "Resume for Software Engineer",
    "Resume for Data Scientist",
    "Resume for Product Manager",
    "CV for Research position",
    "I'm a fresher — help me build",
    "You choose everything, just generate"
  ]

  const questionCount = messages.filter(m => m.role === 'ai').length

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', background: '#eef1f5', fontFamily: '"Segoe UI", -apple-system, system-ui, sans-serif', overflow: 'hidden' }}>

      {/* ── TOPBAR ── */}
      <header style={{ background: 'white', borderBottom: '1px solid #e2e8f0', padding: '0 16px', height: 56, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0, boxShadow: '0 1px 4px rgba(0,0,0,0.06)', zIndex: 30 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 32, height: 32, borderRadius: 8, background: 'linear-gradient(135deg,#1d4ed8,#7c3aed)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 8px rgba(29,78,216,.3)' }}>
            <FileText size={16} color="white" />
          </div>
          <div>
            <p style={{ fontSize: 14, fontWeight: 800, color: '#0f172a', margin: 0, letterSpacing: '-0.3px', lineHeight: 1.2 }}>Resume Studio</p>
            <p style={{ fontSize: 10, color: '#94a3b8', margin: 0 }}>LYU · AI-powered · 6 Templates</p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          {/* View toggle */}
          <div style={{ display: 'flex', background: '#f1f5f9', borderRadius: 8, padding: 2, gap: 1 }}>
            {(['chat', 'preview'] as const).map(v => (
              <button key={v} onClick={() => setActiveView(v)}
                style={{ padding: '5px 12px', borderRadius: 6, border: 'none', fontWeight: 600, fontSize: 12, cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.15s', background: activeView === v ? 'white' : 'transparent', color: activeView === v ? '#1d4ed8' : '#64748b', boxShadow: activeView === v ? '0 1px 4px rgba(0,0,0,.1)' : 'none' }}>
                {v === 'chat' ? '💬 Chat' : '👁 Preview'}
              </button>
            ))}
          </div>

          {/* Template */}
          <div style={{ position: 'relative' }}>
            <button onClick={() => setShowTemplates(!showTemplates)}
              style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '6px 11px', border: '1px solid #e2e8f0', borderRadius: 8, background: 'white', cursor: 'pointer', fontSize: 12, fontWeight: 600, color: '#374151', fontFamily: 'inherit' }}>
              <div style={{ width: 11, height: 11, borderRadius: 3, background: template.accent }} />
              {template.name} <ChevronDown size={11} />
            </button>
            {showTemplates && (
              <div style={{ position: 'absolute', right: 0, top: 42, background: 'white', border: '1px solid #e2e8f0', borderRadius: 14, padding: 12, display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 8, boxShadow: '0 16px 48px rgba(0,0,0,.14)', zIndex: 100, width: 295 }}>
                {TEMPLATES.map(t => (
                  <button key={t.id} onClick={() => { setTemplate(t); setShowTemplates(false) }}
                    style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, padding: '8px 6px', borderRadius: 8, border: template.id === t.id ? `2px solid ${t.accent}` : '2px solid #f1f5f9', background: template.id === t.id ? `${t.accent}12` : '#fafafa', cursor: 'pointer' }}>
                    <div style={{ width: 42, height: 28, borderRadius: 5, background: t.preview }} />
                    <span style={{ fontSize: 10, fontWeight: 700, color: '#374151' }}>{t.name}</span>
                    <span style={{ fontSize: 8, color: '#94a3b8', textAlign: 'center', lineHeight: 1.3 }}>{t.description}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          <button onClick={reset}
            style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '6px 11px', border: '1px solid #e2e8f0', borderRadius: 8, background: 'white', cursor: 'pointer', fontSize: 12, fontWeight: 600, color: '#64748b', fontFamily: 'inherit' }}>
            <RefreshCw size={12} /> New
          </button>

          {hasResume && (
            <button onClick={handleDownload} disabled={isDownloading}
              style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '6px 16px', border: 'none', borderRadius: 8, background: 'linear-gradient(135deg,#1d4ed8,#7c3aed)', color: 'white', cursor: isDownloading ? 'wait' : 'pointer', fontSize: 12, fontWeight: 700, fontFamily: 'inherit', boxShadow: '0 2px 10px rgba(29,78,216,.35)' }}>
              {isDownloading ? <Loader2 size={13} className="spin" /> : <Download size={13} />}
              {isDownloading ? 'Generating…' : `Download ${resumeData.documentType === 'cv' ? 'CV' : 'PDF'}`}
            </button>
          )}
        </div>
      </header>

      {/* ── BODY ── */}
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>

        {/* CHAT */}
        <div style={{ width: activeView === 'preview' ? 0 : 400, flexShrink: 0, display: 'flex', flexDirection: 'column', background: 'white', borderRight: '1px solid #e8edf2', overflow: 'hidden', transition: 'width 0.2s' }}>

          {/* Messages */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '14px 14px 8px', display: 'flex', flexDirection: 'column', gap: 10, background: '#fafbfc' }}>
            {messages.map((m, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: m.role === 'user' ? 'flex-end' : 'flex-start', alignItems: 'flex-end', gap: 7 }}>
                {m.role === 'ai' && (
                  <div style={{ width: 27, height: 27, borderRadius: '50%', background: 'linear-gradient(135deg,#1d4ed8,#7c3aed)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Sparkles size={12} color="white" />
                  </div>
                )}
                <div style={{
                  maxWidth: '83%', padding: '10px 14px',
                  borderRadius: m.role === 'user' ? '16px 16px 4px 16px' : '4px 16px 16px 16px',
                  background: m.role === 'user' ? 'linear-gradient(135deg,#1d4ed8,#7c3aed)' : 'white',
                  color: m.role === 'user' ? 'white' : '#1e293b',
                  fontSize: 13, lineHeight: 1.6,
                  border: m.role === 'ai' ? '1px solid #e8edf2' : 'none',
                  boxShadow: m.role === 'ai' ? '0 1px 4px rgba(0,0,0,.05)' : '0 2px 10px rgba(29,78,216,.22)',
                  whiteSpace: 'pre-wrap'
                }}>{m.text}</div>
              </div>
            ))}
            {loading && (
              <div style={{ display: 'flex', alignItems: 'flex-end', gap: 7 }}>
                <div style={{ width: 27, height: 27, borderRadius: '50%', background: 'linear-gradient(135deg,#1d4ed8,#7c3aed)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Loader2 size={12} color="white" style={{ animation: 'spin 1s linear infinite' }} />
                </div>
                <div style={{ background: 'white', border: '1px solid #e8edf2', borderRadius: '4px 16px 16px 16px', padding: '12px 16px', display: 'flex', gap: 5, boxShadow: '0 1px 4px rgba(0,0,0,.05)' }}>
                  {[0,1,2].map(d => <div key={d} style={{ width: 7, height: 7, borderRadius: '50%', background: '#1d4ed8', animation: `bounce 1.2s ease-in-out ${d*0.2}s infinite` }} />)}
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Quick prompts — first message only */}
          {messages.length === 1 && !loading && (
            <div style={{ padding: '0 12px 10px', display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {quickPrompts.map((q, i) => (
                <button key={i} onClick={() => send(q)}
                  style={{ padding: '5px 12px', border: '1px solid #c7d2fe', borderRadius: 20, background: '#eef2ff', color: '#3730a3', fontSize: 11.5, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>
                  {q}
                </button>
              ))}
            </div>
          )}

          {/* Build hint */}
          {questionCount >= 3 && !hasResume && !loading && (
            <div style={{ padding: '7px 14px', background: '#f0fdf4', borderTop: '1px solid #bbf7d0' }}>
              <p style={{ fontSize: 11.5, color: '#15803d', fontWeight: 600, margin: 0 }}>
                💡 Say <strong>"build it"</strong> or <strong>"you choose everything"</strong> to generate now
              </p>
            </div>
          )}

          {/* Input */}
          <div style={{ padding: '10px 12px 12px', borderTop: '1px solid #f1f5f9', background: 'white' }}>
            <div style={{ display: 'flex', gap: 8, alignItems: 'flex-end', background: '#f8fafc', border: '1.5px solid #e2e8f0', borderRadius: 12, padding: '8px 8px 8px 14px' }}>
              <textarea
                ref={textareaRef}
                value={input}
                onChange={e => {
                  setInput(e.target.value)
                  e.target.style.height = 'auto'
                  e.target.style.height = Math.min(e.target.scrollHeight, 110) + 'px'
                }}
                onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send() } }}
                placeholder="Tell me about yourself…"
                rows={1}
                style={{ flex: 1, border: 'none', outline: 'none', background: 'transparent', fontSize: 13, color: '#0f172a', resize: 'none', fontFamily: 'inherit', lineHeight: 1.55, maxHeight: 110 }}
              />
              <button onClick={() => send()} disabled={!input.trim() || loading}
                style={{ width: 34, height: 34, borderRadius: 8, border: 'none', background: input.trim() && !loading ? 'linear-gradient(135deg,#1d4ed8,#7c3aed)' : '#e2e8f0', color: input.trim() && !loading ? 'white' : '#94a3b8', cursor: input.trim() && !loading ? 'pointer' : 'default', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, boxShadow: input.trim() && !loading ? '0 2px 8px rgba(29,78,216,.28)' : 'none', transition: 'all 0.15s' }}>
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* PREVIEW */}
        <div style={{ flex: 1, overflowY: 'auto', padding: 20, background: '#dde3ea' }}>
          {!hasResume ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', gap: 18, textAlign: 'center', padding: 32 }}>
              <div style={{ width: 68, height: 68, borderRadius: 20, background: 'rgba(29,78,216,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <FileText size={30} color="#1d4ed8" style={{ opacity: 0.45 }} />
              </div>
              <div>
                <p style={{ color: '#1e293b', fontSize: 17, fontWeight: 700, margin: '0 0 7px' }}>Resume preview will appear here</p>
                <p style={{ color: '#94a3b8', fontSize: 13, margin: 0 }}>Chat with Aria on the left, or click a quick-start below</p>
              </div>
              {/* Template preview tiles */}
              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', justifyContent: 'center' }}>
                {TEMPLATES.map(t => (
                  <button key={t.id} onClick={() => setTemplate(t)}
                    style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, background: 'none', border: template.id === t.id ? `2px solid #1d4ed8` : '2px solid transparent', borderRadius: 10, padding: 6, cursor: 'pointer' }}>
                    <div style={{ width: 54, height: 38, borderRadius: 7, background: t.preview }} />
                    <span style={{ fontSize: 10, color: '#64748b', fontWeight: 600 }}>{t.name}</span>
                  </button>
                ))}
              </div>
              <button onClick={() => setActiveView('chat')}
                style={{ background: 'linear-gradient(135deg,#1d4ed8,#7c3aed)', color: 'white', border: 'none', borderRadius: 10, padding: '10px 24px', fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', boxShadow: '0 4px 14px rgba(29,78,216,.3)' }}>
                Start chatting →
              </button>
            </div>
          ) : (
            <div style={{ maxWidth: 740, margin: '0 auto' }}>
              {/* Toolbar */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14, flexWrap: 'wrap', gap: 8 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  {/* ← BACK BUTTON */}
                  <button onClick={() => setActiveView('chat')}
                    style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '6px 12px', border: '1px solid #d1d5db', borderRadius: 8, background: 'white', cursor: 'pointer', fontSize: 12, fontWeight: 600, color: '#374151', fontFamily: 'inherit', boxShadow: '0 1px 3px rgba(0,0,0,.07)' }}>
                    <ArrowLeft size={13} /> Back to Chat
                  </button>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <div style={{ width: 9, height: 9, borderRadius: '50%', background: '#22c55e' }} />
                    <span style={{ fontSize: 12, color: '#374151', fontWeight: 600 }}>
                      {resumeData.documentType === 'cv' ? 'CV' : 'Resume'} ready · {template.name} template
                    </span>
                  </div>
                </div>
                <button onClick={handleDownload} disabled={isDownloading}
                  style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '7px 18px', border: 'none', borderRadius: 8, background: 'linear-gradient(135deg,#1d4ed8,#7c3aed)', color: 'white', cursor: isDownloading ? 'wait' : 'pointer', fontSize: 12, fontWeight: 700, fontFamily: 'inherit', boxShadow: '0 2px 10px rgba(29,78,216,.3)' }}>
                  {isDownloading ? <Loader2 size={13} style={{ animation: 'spin 1s linear infinite' }} /> : <Download size={13} />}
                  {isDownloading ? 'Generating PDF…' : 'Download PDF'}
                </button>
              </div>

              <ResumePreview data={resumeData} template={template} />

              <p style={{ textAlign: 'center', fontSize: 11, color: '#94a3b8', marginTop: 12 }}>
                PDF opens in new tab · Allow pop-ups if nothing happens
              </p>
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes bounce{0%,60%,100%{transform:translateY(0)}30%{transform:translateY(-5px)}}
        @keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
        .spin{animation:spin 1s linear infinite}
        ::-webkit-scrollbar{width:5px}
        ::-webkit-scrollbar-thumb{background:#cbd5e1;border-radius:5px}
        textarea{scrollbar-width:none}
        textarea::-webkit-scrollbar{display:none}
        button{transition:opacity .15s}
        button:hover{opacity:.88}
        @media(max-width:768px){
          header>div:last-child{gap:3px!important}
        }
      `}</style>
    </div>
  )
}
