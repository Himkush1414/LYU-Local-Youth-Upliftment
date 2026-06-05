'use client'

import { useState, useRef, useEffect } from 'react'
import { toast } from 'sonner'

interface ResumeData {
  name: string; email: string; phone: string; location: string
  linkedin: string; github: string; headline: string; summary: string
  experience: { company: string; role: string; duration: string; location: string; bullets: string[] }[]
  education: { degree: string; institution: string; year: string; score: string }[]
  skills: { technical: string[]; tools: string[]; soft: string[] }
  projects: { name: string; tech: string; description: string; url: string }[]
  certifications: { name: string; issuer: string; year: string }[]
}

const EMPTY: ResumeData = {
  name:'',email:'',phone:'',location:'',linkedin:'',github:'',headline:'',summary:'',
  experience:[],education:[],skills:{technical:[],tools:[],soft:[]},projects:[],certifications:[]
}

const THEMES = [
  { id:'classic', label:'Classic', accent:'#1e3a5f' },
  { id:'minimal', label:'Minimal', accent:'#111827' },
  { id:'teal',    label:'Teal',    accent:'#0f766e' },
  { id:'purple',  label:'Purple',  accent:'#6d28d9' },
  { id:'rose',    label:'Rose',    accent:'#be123c' },
]

const QUESTIONS = [
  'What\'s your full name?',
  'What role are you applying for? (e.g. React Developer, Data Analyst, MBA fresher)',
  'How many years of experience? (type 0 if fresher)',
  'Highest qualification + institution + year + score? (e.g. B.Tech CSE, VTU, 2023, 8.2 CGPA)',
  'Top skills, comma separated? (e.g. React, Node.js, Python)',
  'Any projects to include? Describe briefly, or type "skip"',
  'Your city and state? (e.g. Bengaluru, Karnataka)',
  'Email and phone? (e.g. rahul@gmail.com | +91-9876543210)',
]

const QKEYS = ['name','role','experience','education','skills','projects','location','contact']

interface Msg { role: 'ai'|'user'; text: string }

export default function ResumePage() {
  const [resume, setResume] = useState<ResumeData>(EMPTY)
  const [theme, setTheme] = useState(THEMES[0])
  const [msgs, setMsgs] = useState<Msg[]>([
    { role:'ai', text:'Hi! I\'m your AI Resume Builder 👋\nI\'ll ask you a few quick questions, then build your complete resume instantly.' },
    { role:'ai', text: QUESTIONS[0] }
  ])
  const [input, setInput] = useState('')
  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState<Record<string,string>>({})
  const [loading, setLoading] = useState(false)
  const [view, setView] = useState<'chat'|'preview'>('chat')
  const [built, setBuilt] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)
  const previewRef = useRef<HTMLDivElement>(null)

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior:'smooth' }) }, [msgs, loading])

  const addMsg = (role:'ai'|'user', text:string) => setMessages((m:Msg[]) => [...m, {role,text}])
  const setMessages = (fn: (m:Msg[]) => Msg[]) => setMsgs(fn)

  const send = async () => {
    const val = input.trim()
    if (!val || loading) return
    setInput('')
    setMsgs(m => [...m, { role:'user', text:val }])

    if (built) {
      handlePostBuild(val)
      return
    }

    const newAnswers = { ...answers, [QKEYS[step]]: val }
    setAnswers(newAnswers)

    if (step < QUESTIONS.length - 1) {
      const next = step + 1
      setStep(next)
      setTimeout(() => setMsgs(m => [...m, { role:'ai', text: QUESTIONS[next] }]), 350)
    } else {
      await buildResume(newAnswers)
    }
  }

  const buildResume = async (ans: Record<string,string>) => {
    setLoading(true)
    setMsgs(m => [...m, { role:'ai', text:'Building your resume... ✨' }])
    try {
      const res = await fetch('/api/v1/ai/chat', {
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body: JSON.stringify({
          messages:[{ role:'user', content:`Build a complete ATS-optimized resume for Indian job market.
Name: ${ans.name}
Role: ${ans.role}
Experience: ${ans.experience} years
Education: ${ans.education}
Skills: ${ans.skills}
Projects: ${ans.projects}
Location: ${ans.location}
Contact: ${ans.contact}

Return ONLY raw JSON (no markdown, no backticks):
{"name":"","email":"","phone":"","location":"","linkedin":"","github":"","headline":"","summary":"","experience":[{"company":"","role":"","duration":"","location":"","bullets":[]}],"education":[{"degree":"","institution":"","year":"","score":""}],"skills":{"technical":[],"tools":[],"soft":[]},"projects":[{"name":"","tech":"","description":"","url":""}],"certifications":[{"name":"","issuer":"","year":""}]}` }],
          systemOverride:'You are a resume builder. Return only raw valid JSON. No markdown. No explanation. No backticks.'
        })
      })
      const data = await res.json()
      let raw = (data.reply||'').trim().replace(/^```json/i,'').replace(/^```/,'').replace(/```$/,'').trim()
      const parsed = JSON.parse(raw)
      setResume(parsed)
      setBuilt(true)
      setView('preview')
      setMsgs(m => [...m, { role:'ai', text:`Done! Your resume is ready 🎉\n\nYou can now:\n• Switch to Preview tab to see it\n• Ask me to "improve the summary"\n• Say "change theme to teal/purple/rose"\n• Click Download PDF` }])
      toast.success('Resume built!')
    } catch {
      setMsgs(m => [...m, { role:'ai', text:'Something went wrong. Type "rebuild" to try again.' }])
    } finally {
      setLoading(false)
    }
  }

  const handlePostBuild = async (msg: string) => {
    const lower = msg.toLowerCase()
    const themeMatch = THEMES.find(t => lower.includes(t.label.toLowerCase()))
    if (themeMatch) { setTheme(themeMatch); setMsgs(m => [...m, { role:'ai', text:`Theme changed to ${themeMatch.label}! 🎨` }]); return }
    if (lower === 'rebuild') { setBuilt(false); setStep(0); setAnswers({}); setMsgs([{ role:'ai', text: QUESTIONS[0] }]); return }

    setLoading(true)
    try {
      const res = await fetch('/api/v1/ai/chat', {
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body: JSON.stringify({
          messages:[{ role:'user', content:`Current resume JSON: ${JSON.stringify(resume)}\n\nUser request: "${msg}"\n\nReturn the complete updated resume as raw JSON only. Same structure. No markdown.` }],
          systemOverride:'You are a resume editor. Return only raw valid JSON with same structure. No markdown. No backticks. No explanation.'
        })
      })
      const data = await res.json()
      let raw = (data.reply||'').trim().replace(/^```json/i,'').replace(/^```/,'').replace(/```$/,'').trim()
      const parsed = JSON.parse(raw)
      setResume(parsed)
      setMsgs(m => [...m, { role:'ai', text:'Updated! Check the preview 👀' }])
      toast.success('Resume updated!')
    } catch {
      setMsgs(m => [...m, { role:'ai', text:'Could not update. Try being more specific, e.g. "make summary stronger" or "add Docker to tools".' }])
    } finally {
      setLoading(false)
    }
  }

  const downloadPDF = () => {
    if (!previewRef.current) { toast.error('Build your resume first'); return }
    const content = previewRef.current.innerHTML
    const win = window.open('', '_blank', 'width=900,height=700')
    if (!win) { toast.error('Allow popups and try again'); return }
    win.document.write(`<!DOCTYPE html><html><head><meta charset="utf-8"><title>${resume.name} Resume</title>
    <style>
      *{margin:0;padding:0;box-sizing:border-box}
      body{font-family:Georgia,serif;background:white}
      @page{size:A4;margin:0}
      @media print{
        body{-webkit-print-color-adjust:exact;print-color-adjust:exact}
        button{display:none!important}
      }
    </style></head><body>${content}
    <script>window.onload=function(){window.print();setTimeout(()=>window.close(),1000)}<\/script>
    </body></html>`)
    win.document.close()
    toast.success('Save as PDF in the print dialog!')
  }

  const accent = theme.accent
  const hasResume = !!resume.name

  return (
    <div style={{display:'flex',flexDirection:'column',gap:14,fontFamily:'Inter,system-ui,sans-serif',paddingBottom:40}}>

      {/* Header */}
      <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',flexWrap:'wrap',gap:10}}>
        <div>
          <h1 style={{fontSize:20,fontWeight:900,color:'#0f172a',margin:0,letterSpacing:'-0.02em'}}>AI Resume Studio</h1>
          <p style={{fontSize:12,color:'#94a3b8',margin:'2px 0 0'}}>Conversational AI · Live Preview · PDF Export</p>
        </div>
        <div style={{display:'flex',alignItems:'center',gap:8,flexWrap:'wrap'}}>
          <div style={{display:'flex',gap:5,padding:'5px 7px',background:'#f8fafc',borderRadius:10,border:'1px solid #e2e8f0'}}>
            {THEMES.map(t=>(
              <button key={t.id} onClick={()=>setTheme(t)} title={t.label}
                style={{width:18,height:18,borderRadius:'50%',background:t.accent,border:theme.id===t.id?'3px solid #0f172a':'3px solid transparent',cursor:'pointer',padding:0}}/>
            ))}
          </div>
          <div style={{display:'flex',background:'#f1f5f9',borderRadius:10,padding:3,gap:2}}>
            {(['chat','preview'] as const).map(tab=>(
              <button key={tab} onClick={()=>setView(tab)}
                style={{padding:'5px 12px',fontSize:11,fontWeight:700,borderRadius:7,border:'none',cursor:'pointer',fontFamily:'inherit',background:view===tab?'white':'transparent',color:view===tab?'#0f172a':'#94a3b8',boxShadow:view===tab?'0 1px 3px rgba(0,0,0,0.1)':'none'}}>
                {tab==='chat'?'💬 AI Chat':'👁 Preview'}
              </button>
            ))}
          </div>
          {hasResume&&(
            <button onClick={downloadPDF}
              style={{display:'inline-flex',alignItems:'center',gap:6,fontSize:12,fontWeight:700,color:'white',background:accent,border:'none',padding:'8px 16px',borderRadius:10,cursor:'pointer',fontFamily:'inherit'}}>
              ⬇ Download PDF
            </button>
          )}
        </div>
      </div>

      {/* Layout */}
      <div style={{display:'grid',gridTemplateColumns:'360px 1fr',gap:16,alignItems:'start'}}>

        {/* AI Chat */}
        <div style={{display:'flex',flexDirection:'column',background:'white',borderRadius:16,border:'1px solid #e2e8f0',overflow:'hidden',height:620,position:'sticky',top:20}}>
          <div style={{padding:'12px 14px',background:'linear-gradient(135deg,#0f172a,#1e293b)',display:'flex',alignItems:'center',gap:10}}>
            <div style={{width:30,height:30,borderRadius:9,background:`linear-gradient(135deg,${accent},#7c3aed)`,display:'flex',alignItems:'center',justifyContent:'center',fontSize:14}}>✦</div>
            <div>
              <p style={{fontWeight:700,color:'white',fontSize:13,margin:0}}>Resume AI</p>
              <p style={{fontSize:10,color:'#94a3b8',margin:0}}>{built?'Ask to improve or change theme':'Answering questions to build your resume'}</p>
            </div>
            <div style={{marginLeft:'auto',width:7,height:7,borderRadius:'50%',background:'#4ade80',boxShadow:'0 0 5px #4ade80'}}/>
          </div>

          <div style={{flex:1,overflowY:'auto',padding:14,display:'flex',flexDirection:'column',gap:9}}>
            {msgs.map((msg,i)=>(
              <div key={i} style={{display:'flex',justifyContent:msg.role==='user'?'flex-end':'flex-start'}}>
                <div style={{
                  maxWidth:'84%',padding:'8px 13px',
                  borderRadius:msg.role==='user'?'14px 14px 3px 14px':'14px 14px 14px 3px',
                  background:msg.role==='user'?`linear-gradient(135deg,${accent},#1d4ed8)`:'#f8fafc',
                  border:msg.role==='ai'?'1px solid #e2e8f0':'none',
                  fontSize:13,color:msg.role==='user'?'white':'#1e293b',
                  lineHeight:1.55,whiteSpace:'pre-line'
                }}>{msg.text}</div>
              </div>
            ))}
            {loading&&(
              <div style={{display:'flex'}}>
                <div style={{padding:'9px 14px',borderRadius:'14px 14px 14px 3px',background:'#f8fafc',border:'1px solid #e2e8f0',display:'flex',gap:4,alignItems:'center'}}>
                  {[0,1,2].map(i=><div key={i} style={{width:5,height:5,borderRadius:'50%',background:'#94a3b8',animation:`bounce 1.2s ease-in-out ${i*0.2}s infinite`}}/>)}
                </div>
              </div>
            )}
            <div ref={bottomRef}/>
          </div>

          <div style={{padding:'10px 12px',borderTop:'1px solid #f1f5f9',display:'flex',gap:7}}>
            <input value={input} onChange={e=>setInput(e.target.value)}
              onKeyDown={e=>{if(e.key==='Enter')send()}}
              placeholder={built?'Improve summary, change theme...':'Type your answer...'}
              disabled={loading}
              style={{flex:1,padding:'9px 13px',border:'2px solid #e2e8f0',borderRadius:11,fontSize:13,fontFamily:'inherit',outline:'none',color:'#0f172a'}}/>
            <button onClick={send} disabled={loading||!input.trim()}
              style={{width:38,height:38,borderRadius:11,background:loading||!input.trim()?'#e2e8f0':accent,border:'none',cursor:loading||!input.trim()?'not-allowed':'pointer',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
            </button>
          </div>
        </div>

        {/* Preview */}
        <div style={{display:view==='chat'&&!hasResume?'none':'block'}}>
          {!hasResume?(
            <div style={{background:'white',borderRadius:16,border:'2px dashed #e2e8f0',minHeight:500,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',color:'#94a3b8',gap:8}}>
              <div style={{fontSize:44}}>📄</div>
              <p style={{fontWeight:700,color:'#475569',fontSize:14,margin:0}}>Resume preview</p>
              <p style={{fontSize:12,margin:0}}>Answer the AI questions to build your resume</p>
            </div>
          ):(
            <div ref={previewRef} style={{background:'white',borderRadius:12,overflow:'hidden',fontFamily:'Georgia,serif',boxShadow:'0 4px 20px rgba(0,0,0,0.08)'}}>
              <div style={{background:accent,padding:'24px 32px'}}>
                <h1 style={{fontSize:24,fontWeight:900,color:'white',margin:'0 0 3px',letterSpacing:'-0.01em'}}>{resume.name}</h1>
                {resume.headline&&<p style={{fontSize:12,color:'rgba(255,255,255,0.8)',margin:'0 0 10px',fontStyle:'italic'}}>{resume.headline}</p>}
                <div style={{display:'flex',flexWrap:'wrap',gap:'4px 16px',fontSize:11,color:'rgba(255,255,255,0.75)'}}>
                  {resume.email&&<span>✉ {resume.email}</span>}
                  {resume.phone&&<span>📱 {resume.phone}</span>}
                  {resume.location&&<span>📍 {resume.location}</span>}
                  {resume.linkedin&&<span>🔗 {resume.linkedin}</span>}
                  {resume.github&&<span>💻 {resume.github}</span>}
                </div>
              </div>
              <div style={{padding:'24px 32px',display:'flex',flexDirection:'column',gap:18}}>
                {resume.summary&&<RS title="Professional Summary" accent={accent}><p style={{fontSize:12,color:'#374151',lineHeight:1.75,margin:0}}>{resume.summary}</p></RS>}
                {resume.experience.length>0&&<RS title="Work Experience" accent={accent}>{resume.experience.map((e,i)=>(
                  <div key={i} style={{marginBottom:i<resume.experience.length-1?14:0}}>
                    <div style={{display:'flex',justifyContent:'space-between',flexWrap:'wrap',gap:3,marginBottom:2}}>
                      <div><span style={{fontWeight:800,color:'#0f172a',fontSize:13}}>{e.role}</span><span style={{color:accent,fontWeight:600,fontSize:12}}> · {e.company}</span></div>
                      <span style={{fontSize:11,color:'#64748b',background:'#f1f5f9',padding:'1px 7px',borderRadius:5}}>{e.duration}</span>
                    </div>
                    {e.location&&<p style={{fontSize:11,color:'#94a3b8',margin:'0 0 5px'}}>{e.location}</p>}
                    <ul style={{paddingLeft:14,margin:0,display:'flex',flexDirection:'column',gap:2}}>{e.bullets.map((b,j)=><li key={j} style={{fontSize:11.5,color:'#374151',lineHeight:1.6}}>{b}</li>)}</ul>
                  </div>
                ))}</RS>}
                {(resume.skills.technical.length>0||resume.skills.tools.length>0)&&<RS title="Skills" accent={accent}>
                  {resume.skills.technical.length>0&&<div style={{display:'flex',gap:6,marginBottom:5,alignItems:'flex-start'}}><span style={{fontSize:11,fontWeight:700,color:'#64748b',minWidth:80}}>Technical</span><div style={{display:'flex',flexWrap:'wrap',gap:3}}>{resume.skills.technical.map(s=><Chip key={s} s={s} accent={accent}/>)}</div></div>}
                  {resume.skills.tools.length>0&&<div style={{display:'flex',gap:6,alignItems:'flex-start'}}><span style={{fontSize:11,fontWeight:700,color:'#64748b',minWidth:80}}>Tools</span><div style={{display:'flex',flexWrap:'wrap',gap:3}}>{resume.skills.tools.map(s=><Chip key={s} s={s} accent={accent}/>)}</div></div>}
                </RS>}
                {resume.education.length>0&&<RS title="Education" accent={accent}>{resume.education.map((e,i)=>(
                  <div key={i} style={{display:'flex',justifyContent:'space-between',flexWrap:'wrap',gap:3}}>
                    <div><p style={{fontWeight:700,color:'#0f172a',fontSize:12.5,margin:0}}>{e.degree}</p><p style={{fontSize:11,color:'#64748b',margin:'1px 0 0'}}>{e.institution}</p></div>
                    <div style={{textAlign:'right'}}><p style={{fontSize:11,color:'#94a3b8',margin:0}}>{e.year}</p>{e.score&&<p style={{fontSize:11,fontWeight:700,color:accent,margin:'1px 0 0'}}>{e.score}</p>}</div>
                  </div>
                ))}</RS>}
                {resume.projects.length>0&&<RS title="Projects" accent={accent}>{resume.projects.map((p,i)=>(
                  <div key={i} style={{marginBottom:i<resume.projects.length-1?10:0}}>
                    <div style={{display:'flex',alignItems:'center',gap:7,marginBottom:2}}>
                      <span style={{fontWeight:800,color:'#0f172a',fontSize:12.5}}>{p.name}</span>
                      {p.tech&&<span style={{fontSize:10,color:accent,background:`${accent}15`,padding:'1px 7px',borderRadius:20,fontWeight:600}}>{p.tech}</span>}
                    </div>
                    <p style={{fontSize:11.5,color:'#374151',margin:0,lineHeight:1.6}}>{p.description}</p>
                  </div>
                ))}</RS>}
                {resume.certifications.length>0&&<RS title="Certifications" accent={accent}><div style={{display:'flex',flexDirection:'column',gap:3}}>{resume.certifications.map((c,i)=>(
                  <div key={i} style={{display:'flex',justifyContent:'space-between',fontSize:11.5}}>
                    <span style={{color:'#374151',fontWeight:600}}>{c.name}<span style={{color:'#94a3b8',fontWeight:400}}> · {c.issuer}</span></span>
                    <span style={{color:'#94a3b8'}}>{c.year}</span>
                  </div>
                ))}</div></RS>}
              </div>
            </div>
          )}
        </div>
      </div>
      <style>{`@keyframes bounce{0%,80%,100%{transform:translateY(0)}40%{transform:translateY(-5px)}}`}</style>
    </div>
  )
}

function RS({title,accent,children}:{title:string;accent:string;children:React.ReactNode}){
  return(
    <div>
      <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:9}}>
        <h3 style={{fontSize:9.5,fontWeight:800,color:accent,textTransform:'uppercase',letterSpacing:'0.1em',margin:0,whiteSpace:'nowrap'}}>{title}</h3>
        <div style={{flex:1,height:1,background:`${accent}25`}}/>
      </div>
      {children}
    </div>
  )
}

function Chip({s,accent}:{s:string;accent:string}){
  return <span style={{fontSize:10,padding:'2px 8px',background:`${accent}12`,color:accent,borderRadius:20,fontWeight:600}}>{s}</span>
}
