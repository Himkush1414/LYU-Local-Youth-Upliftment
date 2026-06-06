'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Sparkles, Send, User, RotateCcw, Copy, ThumbsUp,
  ThumbsDown, BookOpen, Briefcase, TrendingUp, GraduationCap,
  ChevronRight, Shield, Award, Globe, Zap,
} from 'lucide-react'
import { toast } from 'sonner'

const C = {
  bg: '#0a0a0f', card: '#111118', cardHov: '#14141c',
  border: '#1e1e2e', borderHov: '#2d2d44',
  purple: '#6c63ff', purpleDim: 'rgba(108,99,255,0.12)',
  cyan: '#06b6d4', cyanDim: 'rgba(6,182,212,0.12)',
  green: '#10b981', greenDim: 'rgba(16,185,129,0.12)',
  amber: '#f59e0b', amberDim: 'rgba(245,158,11,0.12)',
  text: '#f8fafc', sub: '#94a3b8', muted: '#475569',
  r: '14px', rSm: '10px',
}

const SYSTEM_PROMPT = `You are CareerMentor AI — an expert career advisor built specifically for Indian job seekers. You are warm, direct, and deeply knowledgeable. You speak like a trusted senior mentor who genuinely wants the person to succeed.

Your expertise covers:
- Indian job market: IT sector (TCS, Infosys, Wipro, HCL, Accenture India, startups like Razorpay, Swiggy, CRED, Zepto, PhonePe, Groww, Meesho, Flipkart, Zomato, etc.)
- Government exams: UPSC Civil Services, SSC CGL/CHSL/MTS, Railway (RRB NTPC, Group D, ALP), Banking (IBPS PO/Clerk/SO, SBI PO/Clerk, RBI Grade B/Assistant), State PSCs, Defence (NDA, CDS, AFCAT), Teaching (TET, CTET, UGC NET), Insurance (LIC AAO, NICL)
- Certifications: AWS, Google Cloud, Azure, PMP, CISSP, CFA, CA, CS, CMA, GATE, NET, coding certifications
- Education paths: Engineering, MBA, Law, Medical, B.Com, BCA, MCA, B.Sc, Arts — and what careers each leads to
- Skills roadmaps: Full-stack development, Data Science, DevOps, Cybersecurity, Product Management, Digital Marketing, Finance, UI/UX
- Salary negotiation, resume building, interview preparation, LinkedIn optimization
- Study resources: NCERT books, standard books for each exam, YouTube channels, online platforms (Unacademy, Testbook, PW, Coursera, Udemy, BYJU's Exam Prep)
- Current exam dates, patterns, eligibility, cut-offs (use your knowledge up to your training cutoff, and acknowledge if something may have changed)

Rules:
1. Always be specific — give real exam names, real salary figures in LPA or per month, real book names, real platform names
2. When advising on government exams, always mention: eligibility age, qualification required, number of attempts, selection process stages
3. When advising on private sector, mention realistic salary ranges for different experience levels
4. Structure longer answers clearly with sections but keep it conversational — not robotic
5. If someone seems lost or stressed, acknowledge their feelings first before giving advice
6. Always end with a concrete next step or question to keep the conversation going
7. Use Indian context: mention Indian cities, Indian companies, Indian rupee amounts, Indian education system
8. Be honest — if something is very competitive (like UPSC), say so and give realistic expectations
9. For freshers, always mention both immediate opportunities and long-term paths
10. You have web search capability to find up-to-date information when needed`

type Message = {
  id: string
  role: 'user' | 'assistant'
  content: string
  time: string
}

const SUGGESTIONS = [
  { icon: TrendingUp,    text: 'What skills should I learn for a high-paying tech job in 2026?' },
  { icon: GraduationCap, text: 'I want to crack UPSC — where do I start and is it worth it?' },
  { icon: Briefcase,     text: 'I am a fresher with a B.Tech in CS — what are my best options?' },
  { icon: Award,         text: 'Which certifications give the best salary hike in India?' },
  { icon: Shield,        text: 'Tell me everything about SSC CGL — eligibility, syllabus and preparation strategy' },
  { icon: Globe,         text: 'I want to switch from IT to finance — is CFA or MBA better?' },
]

function formatContent(text: string) {
  const lines = text.split('\n')
  return lines.map((line, i) => {
    // Bold text
    const parts = line.split(/(\*\*[^*]+\*\*)/g)
    const formatted = parts.map((p, j) => {
      if (p.startsWith('**') && p.endsWith('**')) {
        return <strong key={j} style={{ color: C.text, fontWeight: 700 }}>{p.slice(2, -2)}</strong>
      }
      // Handle inline backtick code
      const codeParts = p.split(/(`[^`]+`)/g)
      return codeParts.map((cp, k) => {
        if (cp.startsWith('`') && cp.endsWith('`')) {
          return (
            <code key={k} style={{ background: 'rgba(108,99,255,0.15)', color: C.purple, padding: '1px 5px', borderRadius: '4px', fontSize: '12.5px', fontFamily: 'monospace' }}>
              {cp.slice(1, -1)}
            </code>
          )
        }
        return cp
      })
    })

    // Bullet points
    if (line.startsWith('• ') || line.startsWith('- ') || line.startsWith('* ')) {
      return (
        <div key={i} style={{ display: 'flex', gap: '8px', alignItems: 'flex-start', marginBottom: '4px' }}>
          <div style={{ width: '5px', height: '5px', borderRadius: '50%', background: C.purple, marginTop: '8px', flexShrink: 0 }} />
          <span>{formatted.slice(1)}</span>
        </div>
      )
    }

    // Numbered list
    const numMatch = line.match(/^(\d+)\. (.+)/)
    if (numMatch) {
      return (
        <div key={i} style={{ display: 'flex', gap: '8px', alignItems: 'flex-start', marginBottom: '4px' }}>
          <span style={{ color: C.purple, fontWeight: 700, fontSize: '12px', marginTop: '2px', flexShrink: 0, minWidth: '16px' }}>{numMatch[1]}.</span>
          <span>{formatted.slice(numMatch[1].length + 2)}</span>
        </div>
      )
    }

    // Heading lines (###)
    if (line.startsWith('### ')) {
      return <p key={i} style={{ fontSize: '13px', fontWeight: 700, color: C.purple, margin: '12px 0 6px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{line.slice(4)}</p>
    }
    if (line.startsWith('## ')) {
      return <p key={i} style={{ fontSize: '14px', fontWeight: 700, color: C.text, margin: '14px 0 6px' }}>{line.slice(3)}</p>
    }

    // Empty line
    if (line.trim() === '') return <div key={i} style={{ height: '6px' }} />

    return <p key={i} style={{ margin: '0 0 4px', lineHeight: 1.7 }}>{formatted}</p>
  })
}

export default function CareerAIPage() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [vw, setVw] = useState(1280)
  const bottomRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const abortRef = useRef<AbortController | null>(null)

  useEffect(() => {
    const upd = () => setVw(window.innerWidth)
    upd()
    window.addEventListener('resize', upd)
    return () => window.removeEventListener('resize', upd)
  }, [])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  const isMobile = vw < 640
  const showSuggestions = messages.length === 0

  async function send(text: string) {
    if (!text.trim() || loading) return

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: text.trim(),
      time: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
    }

    const newMessages = [...messages, userMsg]
    setMessages(newMessages)
    setInput('')
    setLoading(true)

    // Build message history for API
    const apiMessages = newMessages.map(m => ({
      role: m.role as 'user' | 'assistant',
      content: m.content,
    }))

    // Placeholder for streaming
    const aiId = (Date.now() + 1).toString()
    setMessages(prev => [...prev, {
      id: aiId,
      role: 'assistant',
      content: '',
      time: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
    }])

    try {
      abortRef.current = new AbortController()

      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: abortRef.current.signal,
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 1000,
          system: SYSTEM_PROMPT,
          messages: apiMessages,
          stream: true,
        }),
      })

      if (!response.ok) throw new Error('API error')

      const reader = response.body?.getReader()
      const decoder = new TextDecoder()
      let fullText = ''

      if (reader) {
        while (true) {
          const { done, value } = await reader.read()
          if (done) break

          const chunk = decoder.decode(value)
          const lines = chunk.split('\n')

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const data = line.slice(6)
              if (data === '[DONE]') continue
              try {
                const parsed = JSON.parse(data)
                if (parsed.type === 'content_block_delta' && parsed.delta?.text) {
                  fullText += parsed.delta.text
                  setMessages(prev => prev.map(m =>
                    m.id === aiId ? { ...m, content: fullText } : m
                  ))
                }
              } catch { /* skip malformed */ }
            }
          }
        }
      }
    } catch (err: unknown) {
      if (err instanceof Error && err.name === 'AbortError') return
      // Fallback: non-streaming
      try {
        const response = await fetch('https://api.anthropic.com/v1/messages', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            model: 'claude-sonnet-4-20250514',
            max_tokens: 1000,
            system: SYSTEM_PROMPT,
            messages: apiMessages,
          }),
        })
        const data = await response.json()
        const text = data.content?.map((c: { text?: string }) => c.text || '').join('') || 'Sorry, I could not process that. Please try again.'
        setMessages(prev => prev.map(m => m.id === aiId ? { ...m, content: text } : m))
      } catch {
        setMessages(prev => prev.map(m =>
          m.id === aiId ? { ...m, content: 'Something went wrong. Please check your connection and try again.' } : m
        ))
      }
    } finally {
      setLoading(false)
    }
  }

  function reset() {
    if (loading) { abortRef.current?.abort(); setLoading(false) }
    setMessages([])
    setInput('')
    toast.success('New conversation started')
  }

  function handleKey(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      send(input)
    }
  }

  const p = isMobile ? '0' : '22px 26px'

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', padding: p, background: C.bg, gap: isMobile ? '0' : '16px', overflow: 'hidden' }}>

      {/* Desktop header */}
      {!isMobile && (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
          <div>
            <h1 style={{ fontSize: '20px', fontWeight: 800, color: C.text, margin: '0 0 3px', letterSpacing: '-0.02em', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Sparkles size={18} color={C.purple} /> Career AI Mentor
            </h1>
            <p style={{ fontSize: '13px', color: C.sub, margin: 0 }}>
              Ask anything — exams, jobs, skills, salaries, roadmaps. Powered by Claude.
            </p>
          </div>
          <button
            onClick={reset}
            style={{ padding: '8px 14px', borderRadius: C.rSm, background: 'transparent', border: `1px solid ${C.border}`, color: C.sub, fontSize: '12px', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px' }}
          >
            <RotateCcw size={12} /> New Chat
          </button>
        </div>
      )}

      {/* Chat area */}
      <div style={{
        flex: 1, background: C.card, borderRadius: isMobile ? '0' : C.r,
        border: isMobile ? 'none' : `1px solid ${C.border}`,
        display: 'flex', flexDirection: 'column', overflow: 'hidden', minHeight: 0,
      }}>

        {/* Messages scroll area */}
        <div style={{ flex: 1, overflowY: 'auto', padding: isMobile ? '16px 14px' : '22px', display: 'flex', flexDirection: 'column', gap: '18px' }}>

          {/* Mobile header */}
          {isMobile && (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
              <span style={{ fontSize: '14px', fontWeight: 700, color: C.text, display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Sparkles size={14} color={C.purple} /> Career AI Mentor
              </span>
              <button onClick={reset} style={{ background: 'none', border: 'none', cursor: 'pointer', color: C.muted, display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11.5px' }}>
                <RotateCcw size={11} /> New
              </button>
            </div>
          )}

          {/* Welcome + suggestions */}
          {showSuggestions && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
              {/* Welcome card */}
              <div style={{ padding: '18px 20px', borderRadius: C.r, background: 'linear-gradient(135deg,rgba(108,99,255,0.14) 0%,rgba(6,182,212,0.07) 100%)', border: `1px solid rgba(108,99,255,0.22)`, marginBottom: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                  <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: C.purpleDim, border: `1px solid rgba(108,99,255,0.3)`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Sparkles size={16} color={C.purple} />
                  </div>
                  <div>
                    <p style={{ fontSize: '14px', fontWeight: 700, color: C.text, margin: 0 }}>CareerMentor AI</p>
                    <p style={{ fontSize: '11.5px', color: C.sub, margin: 0 }}>Powered by Claude · Always available</p>
                  </div>
                </div>
                <p style={{ fontSize: '13.5px', color: C.sub, margin: 0, lineHeight: 1.7 }}>
                  Hi! I'm your personal career mentor. I know the Indian job market inside out — from UPSC and SSC to Razorpay and Google. Ask me anything about <strong style={{ color: C.text }}>exams, jobs, skills, certifications, salaries,</strong> or career switches. I'll give you straight, honest advice.
                </p>
              </div>

              {/* Suggestion chips */}
              <p style={{ fontSize: '11.5px', fontWeight: 600, color: C.muted, margin: '0 0 10px', textTransform: 'uppercase', letterSpacing: '0.07em' }}>
                Try asking
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '7px' }}>
                {SUGGESTIONS.map(s => {
                  const Icon = s.icon
                  return (
                    <motion.button
                      key={s.text}
                      whileHover={{ x: 3 }}
                      onClick={() => send(s.text)}
                      style={{
                        display: 'flex', alignItems: 'center', gap: '10px',
                        padding: '11px 14px', borderRadius: C.rSm,
                        background: 'transparent', border: `1px solid ${C.border}`,
                        cursor: 'pointer', color: C.sub, fontSize: '13px', textAlign: 'left',
                        transition: 'border-color 0.15s, color 0.15s',
                      }}
                      onMouseEnter={e => {
                        const b = e.currentTarget as HTMLButtonElement
                        b.style.borderColor = C.purple
                        b.style.color = C.text
                      }}
                      onMouseLeave={e => {
                        const b = e.currentTarget as HTMLButtonElement
                        b.style.borderColor = C.border
                        b.style.color = C.sub
                      }}
                    >
                      <Icon size={13} color={C.purple} style={{ flexShrink: 0 }} />
                      <span style={{ flex: 1 }}>{s.text}</span>
                      <ChevronRight size={12} color={C.muted} style={{ flexShrink: 0 }} />
                    </motion.button>
                  )
                })}
              </div>
            </motion.div>
          )}

          {/* Messages */}
          <AnimatePresence initial={false}>
            {messages.map(msg => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
                style={{ display: 'flex', gap: '10px', justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start' }}
              >
                {/* AI avatar */}
                {msg.role === 'assistant' && (
                  <div style={{ width: '32px', height: '32px', borderRadius: '9px', background: C.purpleDim, border: `1px solid rgba(108,99,255,0.25)`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: '2px' }}>
                    <Sparkles size={13} color={C.purple} />
                  </div>
                )}

                <div style={{ maxWidth: isMobile ? '88%' : '80%' }}>
                  {/* Bubble */}
                  <div style={{
                    padding: msg.role === 'user' ? '10px 14px' : '14px 16px',
                    borderRadius: msg.role === 'user' ? '16px 16px 4px 16px' : '4px 16px 16px 16px',
                    background: msg.role === 'user' ? `linear-gradient(135deg, ${C.purple}, #5b52e8)` : '#16161f',
                    border: msg.role === 'assistant' ? `1px solid ${C.border}` : 'none',
                    fontSize: '13.5px', color: C.text, lineHeight: 1.7,
                  }}>
                    {msg.role === 'assistant' && msg.content === '' ? (
                      // Typing indicator
                      <div style={{ display: 'flex', alignItems: 'center', gap: '5px', padding: '2px 0' }}>
                        {[0, 1, 2].map(i => (
                          <motion.div
                            key={i}
                            animate={{ y: [0, -5, 0] }}
                            transition={{ duration: 0.55, repeat: Infinity, delay: i * 0.13 }}
                            style={{ width: '6px', height: '6px', borderRadius: '50%', background: C.purple }}
                          />
                        ))}
                      </div>
                    ) : (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                        {msg.role === 'assistant' ? formatContent(msg.content) : msg.content}
                      </div>
                    )}
                  </div>

                  {/* AI message actions */}
                  {msg.role === 'assistant' && msg.content !== '' && (
                    <div style={{ display: 'flex', gap: '6px', marginTop: '6px', paddingLeft: '2px' }}>
                      <button
                        onClick={() => { navigator.clipboard.writeText(msg.content); toast.success('Copied!') }}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', color: C.muted, display: 'flex', alignItems: 'center', gap: '3px', fontSize: '11px', padding: '2px 4px', borderRadius: '4px', transition: 'color 0.15s' }}
                        onMouseEnter={e => ((e.currentTarget as HTMLButtonElement).style.color = C.sub)}
                        onMouseLeave={e => ((e.currentTarget as HTMLButtonElement).style.color = C.muted)}
                      >
                        <Copy size={11} /> Copy
                      </button>
                      <button
                        onClick={() => toast.success('Thanks! Glad that helped 🙌')}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', color: C.muted, display: 'flex', alignItems: 'center', gap: '3px', fontSize: '11px', padding: '2px 4px', borderRadius: '4px', transition: 'color 0.15s' }}
                        onMouseEnter={e => ((e.currentTarget as HTMLButtonElement).style.color = C.green)}
                        onMouseLeave={e => ((e.currentTarget as HTMLButtonElement).style.color = C.muted)}
                      >
                        <ThumbsUp size={11} />
                      </button>
                      <button
                        onClick={() => toast.info('Got it — will improve!')}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', color: C.muted, display: 'flex', alignItems: 'center', gap: '3px', fontSize: '11px', padding: '2px 4px', borderRadius: '4px', transition: 'color 0.15s' }}
                        onMouseEnter={e => ((e.currentTarget as HTMLButtonElement).style.color = C.red)}
                        onMouseLeave={e => ((e.currentTarget as HTMLButtonElement).style.color = C.muted)}
                      >
                        <ThumbsDown size={11} />
                      </button>
                      <span style={{ fontSize: '10.5px', color: C.muted, marginLeft: '4px', lineHeight: '18px' }}>{msg.time}</span>
                    </div>
                  )}

                  {/* User message time */}
                  {msg.role === 'user' && (
                    <div style={{ textAlign: 'right', fontSize: '10.5px', color: C.muted, marginTop: '4px' }}>{msg.time}</div>
                  )}
                </div>

                {/* User avatar */}
                {msg.role === 'user' && (
                  <div style={{ width: '32px', height: '32px', borderRadius: '9px', background: 'linear-gradient(135deg,#6c63ff,#06b6d4)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: '2px' }}>
                    <User size={13} color="#fff" />
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>

          <div ref={bottomRef} />
        </div>

        {/* Input bar */}
        <div style={{ padding: isMobile ? '10px 12px' : '14px 18px', borderTop: `1px solid ${C.border}`, flexShrink: 0, background: C.card }}>
          <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-end' }}>
            <div style={{ flex: 1, position: 'relative' }}>
              <textarea
                ref={inputRef}
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={handleKey}
                placeholder="Ask about exams, jobs, skills, salaries, roadmaps..."
                disabled={loading}
                rows={1}
                style={{
                  width: '100%', background: '#16161f', border: `1px solid ${C.border}`,
                  borderRadius: '12px', padding: '10px 14px',
                  color: C.text, fontSize: '13.5px', outline: 'none',
                  resize: 'none', lineHeight: 1.5, boxSizing: 'border-box',
                  opacity: loading ? 0.6 : 1,
                  maxHeight: '120px', overflowY: 'auto',
                }}
                onFocus={e => (e.target.style.borderColor = C.purple)}
                onBlur={e => (e.target.style.borderColor = C.border)}
                onInput={e => {
                  const t = e.currentTarget
                  t.style.height = 'auto'
                  t.style.height = Math.min(t.scrollHeight, 120) + 'px'
                }}
              />
            </div>
            <button
              onClick={() => loading ? abortRef.current?.abort() : send(input)}
              style={{
                width: '42px', height: '42px', borderRadius: '12px', flexShrink: 0,
                background: loading ? C.redDim : input.trim() ? C.purple : C.border,
                border: loading ? `1px solid rgba(239,68,68,0.3)` : 'none',
                cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'all 0.15s',
              }}
            >
              {loading
                ? <div style={{ width: '14px', height: '14px', borderRadius: '50%', border: `2px solid ${C.red}`, borderTopColor: 'transparent', animation: 'spin 0.8s linear infinite' }} />
                : <Send size={15} color={input.trim() ? '#fff' : C.muted} />
              }
            </button>
          </div>
          <p style={{ fontSize: '11px', color: C.muted, margin: '8px 0 0', textAlign: 'center' }}>
            Press <kbd style={{ background: C.border, padding: '1px 5px', borderRadius: '4px', fontSize: '10px' }}>Enter</kbd> to send · <kbd style={{ background: C.border, padding: '1px 5px', borderRadius: '4px', fontSize: '10px' }}>Shift+Enter</kbd> for new line
          </p>
        </div>
      </div>

      <style>{`
        textarea::placeholder { color: #475569; }
        textarea::-webkit-scrollbar { width: 4px; }
        textarea::-webkit-scrollbar-thumb { background: #1e1e2e; border-radius: 10px; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  )
}
