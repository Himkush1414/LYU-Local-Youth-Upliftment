'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Send, ArrowLeft, Search, MoreVertical, Phone, Video,
  Paperclip, Smile, CheckCheck, Check, Circle, Star,
  Briefcase, MapPin, Clock, ChevronRight
} from 'lucide-react'

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

interface Message {
  id: string
  content: string
  sender: 'me' | 'them'
  time: string
  status: 'sent' | 'delivered' | 'read'
}

interface Conversation {
  id: string
  recruiterName: string
  recruiterTitle: string
  company: string
  companyColor: string
  companyInitials: string
  role: string
  location: string
  lastMessage: string
  lastTime: string
  unread: number
  online: boolean
  starred: boolean
  messages: Message[]
}

const CONVERSATIONS: Conversation[] = [
  {
    id: 'c1',
    recruiterName: 'Priya Sharma',
    recruiterTitle: 'Senior Talent Acquisition',
    company: 'Razorpay',
    companyColor: '#3395FF',
    companyInitials: 'RZ',
    role: 'Frontend Engineer — React',
    location: 'Bangalore (Hybrid)',
    lastMessage: 'Looking forward to your interview tomorrow at 11 AM! Please join the Google Meet link I shared.',
    lastTime: '10:42 AM',
    unread: 2,
    online: true,
    starred: true,
    messages: [
      { id: 'm1', content: 'Hi! I came across your profile on LYU and I think you would be a great fit for our Frontend Engineer role at Razorpay. Are you open to a quick chat?', sender: 'them', time: 'Mon, 2 Jun', status: 'read' },
      { id: 'm2', content: 'Hi Priya! Yes, absolutely. I am very interested in Razorpay — huge fan of what you are building in the payments space. Would love to know more about the role.', sender: 'me', time: 'Mon, 2 Jun', status: 'read' },
      { id: 'm3', content: 'Great! The role is for our checkout team — you would be working on improving the payment experience for millions of users. We use React, TypeScript, and have a strong focus on performance. Your background looks like a great match!', sender: 'them', time: 'Mon, 2 Jun', status: 'read' },
      { id: 'm4', content: 'That sounds exactly like the kind of work I have been looking for. What does the interview process look like?', sender: 'me', time: 'Tue, 3 Jun', status: 'read' },
      { id: 'm5', content: 'It is 3 rounds — a DSA round, a frontend system design round, and a culture fit round with the engineering manager. Usually takes about 2 weeks total. Your React and TypeScript skills are strong so I am sure you will clear it!', sender: 'them', time: 'Tue, 3 Jun', status: 'read' },
      { id: 'm6', content: 'Perfect. I am ready. When can we schedule the first round?', sender: 'me', time: 'Tue, 3 Jun', status: 'read' },
      { id: 'm7', content: 'I have scheduled you for tomorrow at 11 AM. Please find the Google Meet link in your email. All the best! 🎉', sender: 'them', time: '10:40 AM', status: 'read' },
      { id: 'm8', content: 'Looking forward to your interview tomorrow at 11 AM! Please join the Google Meet link I shared.', sender: 'them', time: '10:42 AM', status: 'delivered' },
    ],
  },
  {
    id: 'c2',
    recruiterName: 'Ankit Gupta',
    recruiterTitle: 'Tech Recruiter',
    company: 'Swiggy',
    companyColor: '#FC8019',
    companyInitials: 'SW',
    role: 'Software Engineer II — Backend',
    location: 'Bangalore (In-office)',
    lastMessage: 'Could you share your updated resume? We would like to move forward.',
    lastTime: 'Yesterday',
    unread: 1,
    online: false,
    starred: false,
    messages: [
      { id: 'm1', content: 'Hello! We are hiring for a Backend Engineer role on our Delivery Intelligence team. Noticed your profile and thought you might be interested.', sender: 'them', time: 'Sun, 1 Jun', status: 'read' },
      { id: 'm2', content: 'Hi Ankit! Yes, I would be interested. What tech stack does the team use?', sender: 'me', time: 'Sun, 1 Jun', status: 'read' },
      { id: 'm3', content: 'Primarily Go and Python for backend services, Kafka for event streaming, and PostgreSQL + Redis for data. The team works on real-time order tracking and routing algorithms.', sender: 'them', time: 'Sun, 1 Jun', status: 'read' },
      { id: 'm4', content: 'That is a great stack. I have worked with Python microservices and Kafka in my previous role. Very relevant experience.', sender: 'me', time: 'Mon, 2 Jun', status: 'read' },
      { id: 'm5', content: 'Could you share your updated resume? We would like to move forward.', sender: 'them', time: 'Yesterday', status: 'delivered' },
    ],
  },
  {
    id: 'c3',
    recruiterName: 'Deepa Nair',
    recruiterTitle: 'HR Business Partner',
    company: 'TCS',
    companyColor: '#0052A5',
    companyInitials: 'TC',
    role: 'Systems Engineer — Digital',
    location: 'Mumbai / Chennai / Pune',
    lastMessage: 'Your application for the Systems Engineer role has been shortlisted. Congratulations!',
    lastTime: 'Tue',
    unread: 0,
    online: false,
    starred: false,
    messages: [
      { id: 'm1', content: 'Dear Candidate, your application for the Systems Engineer — Digital role has been shortlisted. Congratulations!', sender: 'them', time: 'Tue', status: 'read' },
      { id: 'm2', content: 'Thank you so much! I am really excited about this opportunity. What are the next steps?', sender: 'me', time: 'Tue', status: 'read' },
      { id: 'm3', content: 'You will receive a TCS NQT test link on your registered email within 48 hours. The test covers verbal ability, reasoning, and coding. Duration is 3 hours.', sender: 'them', time: 'Tue', status: 'read' },
      { id: 'm4', content: 'Understood. I will keep an eye on my email. Is there any preparation material you recommend?', sender: 'me', time: 'Tue', status: 'read' },
      { id: 'm5', content: 'Practice on PrepInsta and TCS iON portals. Focus on the coding section as it is the differentiator. Best of luck!', sender: 'them', time: 'Tue', status: 'read' },
    ],
  },
  {
    id: 'c4',
    recruiterName: 'Rohan Mehta',
    recruiterTitle: 'Campus Recruiter',
    company: 'Infosys',
    companyColor: '#007CC3',
    companyInitials: 'IN',
    role: 'Associate — Power Programmer Track',
    location: 'Pan India',
    lastMessage: 'Great speaking with you! The offer letter will be sent by Friday.',
    lastTime: 'Mon',
    unread: 0,
    online: true,
    starred: true,
    messages: [
      { id: 'm1', content: 'Hi! Rohan from Infosys Talent Acquisition. We are impressed with your InfyTQ score and would like to talk about our Power Programmer track. Do you have 15 minutes this week?', sender: 'them', time: 'Fri, 30 May', status: 'read' },
      { id: 'm2', content: 'Hi Rohan! Absolutely. I am available any evening this week.', sender: 'me', time: 'Fri, 30 May', status: 'read' },
      { id: 'm3', content: 'Let us do Monday 6 PM. I will call you on this number.', sender: 'them', time: 'Fri, 30 May', status: 'read' },
      { id: 'm4', content: 'That works for me. Talk soon!', sender: 'me', time: 'Fri, 30 May', status: 'read' },
      { id: 'm5', content: 'Great speaking with you! The offer letter will be sent by Friday.', sender: 'them', time: 'Mon', status: 'read' },
    ],
  },
  {
    id: 'c5',
    recruiterName: 'Kavya Reddy',
    recruiterTitle: 'Product Recruiter',
    company: 'Zepto',
    companyColor: '#8B5CF6',
    companyInitials: 'ZP',
    role: 'Product Manager — Growth',
    location: 'Mumbai (In-office)',
    lastMessage: 'Let me know if Tuesday 3 PM works for a product case study walkthrough.',
    lastTime: '3 days ago',
    unread: 3,
    online: false,
    starred: false,
    messages: [
      { id: 'm1', content: 'Hey! Kavya from Zepto. We are building our PM team for the Growth vertical and your background in consumer tech is really interesting to us.', sender: 'them', time: 'Wed, 28 May', status: 'read' },
      { id: 'm2', content: 'Hi Kavya! Zepto is doing amazing things in quick commerce. Would love to learn more.', sender: 'me', time: 'Wed, 28 May', status: 'read' },
      { id: 'm3', content: 'The role involves owning the user acquisition and retention funnel. You would be working directly with the founders. It is a 0-to-1 kind of role.', sender: 'them', time: 'Wed, 28 May', status: 'read' },
      { id: 'm4', content: 'That sounds amazing. What is the interview process like for PM roles?', sender: 'me', time: 'Thu, 29 May', status: 'read' },
      { id: 'm5', content: 'We do a product case study first, followed by a metric deep dive and a leadership round. Usually done in 3 sessions.', sender: 'them', time: 'Thu, 29 May', status: 'read' },
      { id: 'm6', content: 'Let me know if Tuesday 3 PM works for a product case study walkthrough.', sender: 'them', time: '3 days ago', status: 'delivered' },
    ],
  },
  {
    id: 'c6',
    recruiterName: 'Siddharth Jain',
    recruiterTitle: 'Engineering Recruiter',
    company: 'CRED',
    companyColor: '#1A1A2E',
    companyInitials: 'CR',
    role: 'Senior Android Engineer',
    location: 'Bangalore (Hybrid)',
    lastMessage: 'We have decided to move forward. Expect a call from our TA team shortly.',
    lastTime: '4 days ago',
    unread: 0,
    online: false,
    starred: false,
    messages: [
      { id: 'm1', content: 'Hi! This is Siddharth from CRED. We have a Senior Android Engineer opening and your profile on LYU was highly recommended by our AI matching.', sender: 'them', time: 'Mon, 26 May', status: 'read' },
      { id: 'm2', content: 'Thanks Siddharth! I have been a CRED user for a while — big fan of the product quality. Very interested.', sender: 'me', time: 'Mon, 26 May', status: 'read' },
      { id: 'm3', content: 'That is great to hear! We value people who truly understand our product. The role is on the payments team — Kotlin, Jetpack Compose, and clean architecture.', sender: 'them', time: 'Mon, 26 May', status: 'read' },
      { id: 'm4', content: 'We have decided to move forward. Expect a call from our TA team shortly.', sender: 'them', time: '4 days ago', status: 'read' },
    ],
  },
]

function timeAgo(t: string) { return t }

function Avatar({ initials, color, size = 40, online = false }: { initials: string; color: string; size?: number; online?: boolean }) {
  return (
    <div style={{ position: 'relative', flexShrink: 0 }}>
      <div style={{
        width: size, height: size, borderRadius: '50%',
        background: `${color}30`, border: `2px solid ${color}50`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: size * 0.32, fontWeight: 700, color,
      }}>
        {initials}
      </div>
      {online && (
        <div style={{
          position: 'absolute', bottom: 1, right: 1,
          width: size * 0.27, height: size * 0.27, borderRadius: '50%',
          background: C.green, border: `2px solid ${C.bg}`,
        }} />
      )}
    </div>
  )
}

export default function MessagesPage() {
  const [vw, setVw] = useState(1280)
  useEffect(() => {
    const update = () => setVw(window.innerWidth)
    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [])
  const isMobile = vw < 640
  const isTablet = vw >= 640 && vw < 1100
  const isNarrow = vw < 960

  const pad = isMobile ? '0' : isTablet ? '0' : '0'

  const [selected, setSelected] = useState<string | null>(isMobile ? null : 'c1')
  const [conversations, setConversations] = useState(CONVERSATIONS)
  const [input, setInput] = useState('')
  const [search, setSearch] = useState('')
  const [hoveredConv, setHoveredConv] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const activeConv = conversations.find(c => c.id === selected) || null

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [selected, activeConv?.messages.length])

  function selectConv(id: string) {
    setSelected(id)
    setConversations(prev => prev.map(c => c.id === id ? { ...c, unread: 0 } : c))
  }

  function sendMessage() {
    if (!input.trim() || !selected) return
    const newMsg: Message = {
      id: `m-${Date.now()}`,
      content: input.trim(),
      sender: 'me',
      time: 'Now',
      status: 'sent',
    }
    setConversations(prev => prev.map(c =>
      c.id === selected
        ? { ...c, messages: [...c.messages, newMsg], lastMessage: input.trim(), lastTime: 'Now' }
        : c
    ))
    setInput('')
  }

  const filtered = conversations.filter(c =>
    c.company.toLowerCase().includes(search.toLowerCase()) ||
    c.recruiterName.toLowerCase().includes(search.toLowerCase()) ||
    c.role.toLowerCase().includes(search.toLowerCase())
  )

  const outerHeight = isMobile ? 'calc(100vh - 72px)' : 'calc(100vh - 64px)'

  // On mobile: show list or chat
  const showList = isMobile ? selected === null : true
  const showChat = isMobile ? selected !== null : true

  return (
    <div style={{
      minHeight: '100%', background: C.bg,
      display: 'flex', flexDirection: 'column',
      height: outerHeight, overflow: 'hidden',
    }}>
      <div style={{
        flex: 1, display: 'flex', overflow: 'hidden',
        border: `1px solid ${C.border}`,
        borderRadius: isNarrow ? '0' : C.r,
        margin: isNarrow ? '0' : '16px',
      }}>

        {/* LEFT PANEL — Conversation List */}
        {showList && (
          <div style={{
            width: isNarrow ? '100%' : '320px',
            minWidth: isNarrow ? '100%' : '280px',
            maxWidth: isNarrow ? '100%' : '340px',
            borderRight: isNarrow ? 'none' : `1px solid ${C.border}`,
            display: 'flex', flexDirection: 'column',
            background: C.card, overflow: 'hidden',
          }}>
            {/* List Header */}
            <div style={{
              padding: '16px 16px 12px',
              borderBottom: `1px solid ${C.border}`,
              flexShrink: 0,
            }}>
              <h2 style={{ margin: '0 0 12px', fontSize: '16px', fontWeight: 700, color: C.text }}>Messages</h2>
              <div style={{ position: 'relative' }}>
                <Search size={14} color={C.muted} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Search conversations..."
                  style={{
                    width: '100%', background: C.bg, border: `1px solid ${C.border}`,
                    borderRadius: '8px', padding: '8px 10px 8px 32px',
                    color: C.text, fontSize: '12px', outline: 'none', boxSizing: 'border-box',
                  }}
                />
              </div>
            </div>

            {/* Conversation List */}
            <div style={{ flex: 1, overflowY: 'auto' }}>
              {filtered.length === 0 ? (
                <div style={{ padding: '40px 20px', textAlign: 'center', color: C.muted, fontSize: '13px' }}>
                  No conversations found
                </div>
              ) : (
                filtered.map(conv => {
                  const isActive = selected === conv.id
                  const isHov = hoveredConv === conv.id

                  return (
                    <motion.div
                      key={conv.id}
                      onClick={() => selectConv(conv.id)}
                      onHoverStart={() => setHoveredConv(conv.id)}
                      onHoverEnd={() => setHoveredConv(null)}
                      style={{
                        padding: '12px 14px',
                        background: isActive ? C.purpleDim : isHov ? C.cardHov : 'transparent',
                        borderLeft: isActive ? `3px solid ${C.purple}` : '3px solid transparent',
                        cursor: 'pointer', transition: 'all 0.15s',
                        borderBottom: `1px solid ${C.border}`,
                      }}
                    >
                      <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                        <Avatar
                          initials={conv.companyInitials}
                          color={conv.companyColor}
                          size={44}
                          online={conv.online}
                        />
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2px' }}>
                            <div style={{ minWidth: 0 }}>
                              <span style={{ fontSize: '13px', fontWeight: 600, color: C.text, display: 'block' }}>
                                {conv.recruiterName}
                                {conv.starred && <Star size={10} color={C.amber} fill={C.amber} style={{ marginLeft: '4px', verticalAlign: 'middle' }} />}
                              </span>
                              <span style={{ fontSize: '11px', color: C.purple }}>{conv.company}</span>
                            </div>
                            <div style={{ flexShrink: 0, display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '4px' }}>
                              <span style={{ fontSize: '10px', color: C.muted, whiteSpace: 'nowrap' }}>{conv.lastTime}</span>
                              {conv.unread > 0 && (
                                <span style={{
                                  background: C.purple, color: '#fff',
                                  fontSize: '10px', fontWeight: 700,
                                  width: '18px', height: '18px', borderRadius: '50%',
                                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                                }}>
                                  {conv.unread}
                                </span>
                              )}
                            </div>
                          </div>
                          <p style={{
                            margin: '4px 0 0', fontSize: '11px',
                            color: conv.unread > 0 ? C.sub : C.muted,
                            fontWeight: conv.unread > 0 ? 500 : 400,
                            overflow: 'hidden', textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                          }}>
                            {conv.lastMessage}
                          </p>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '4px' }}>
                            <Briefcase size={10} color={C.muted} />
                            <span style={{ fontSize: '10px', color: C.muted, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                              {conv.role}
                            </span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )
                })
              )}
            </div>
          </div>
        )}

        {/* RIGHT PANEL — Chat Thread */}
        {showChat && (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: C.bg, overflow: 'hidden' }}>
            {activeConv ? (
              <>
                {/* Chat Header */}
                <div style={{
                  padding: '12px 16px', borderBottom: `1px solid ${C.border}`,
                  display: 'flex', alignItems: 'center', gap: '12px',
                  background: C.card, flexShrink: 0,
                }}>
                  {isMobile && (
                    <button
                      onClick={() => setSelected(null)}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px', color: C.sub }}
                    >
                      <ArrowLeft size={18} />
                    </button>
                  )}
                  <Avatar
                    initials={activeConv.companyInitials}
                    color={activeConv.companyColor}
                    size={40}
                    online={activeConv.online}
                  />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{ fontSize: '14px', fontWeight: 700, color: C.text }}>{activeConv.recruiterName}</span>
                      {activeConv.online && (
                        <span style={{ fontSize: '10px', color: C.green }}>● Online</span>
                      )}
                    </div>
                    <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                      <span style={{ fontSize: '11px', color: C.purple }}>{activeConv.company}</span>
                      <span style={{ fontSize: '11px', color: C.muted }}>·</span>
                      <span style={{ fontSize: '11px', color: C.muted }}>{activeConv.recruiterTitle}</span>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button style={{
                      background: 'none', border: `1px solid ${C.border}`, borderRadius: '8px',
                      padding: '7px', cursor: 'pointer', color: C.sub, display: 'flex', alignItems: 'center',
                    }}>
                      <Phone size={14} />
                    </button>
                    <button style={{
                      background: 'none', border: `1px solid ${C.border}`, borderRadius: '8px',
                      padding: '7px', cursor: 'pointer', color: C.sub, display: 'flex', alignItems: 'center',
                    }}>
                      <Video size={14} />
                    </button>
                    <button style={{
                      background: 'none', border: `1px solid ${C.border}`, borderRadius: '8px',
                      padding: '7px', cursor: 'pointer', color: C.sub, display: 'flex', alignItems: 'center',
                    }}>
                      <MoreVertical size={14} />
                    </button>
                  </div>
                </div>

                {/* Role Info Banner */}
                <div style={{
                  padding: '8px 16px',
                  background: C.card,
                  borderBottom: `1px solid ${C.border}`,
                  display: 'flex', alignItems: 'center', gap: '14px',
                  flexShrink: 0,
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '11px', color: C.sub }}>
                    <Briefcase size={11} color={C.purple} />
                    <span style={{ color: C.text, fontWeight: 500 }}>{activeConv.role}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px', color: C.muted }}>
                    <MapPin size={10} />
                    {activeConv.location}
                  </div>
                </div>

                {/* Messages */}
                <div style={{
                  flex: 1, overflowY: 'auto', padding: '16px',
                  display: 'flex', flexDirection: 'column', gap: '8px',
                }}>
                  {activeConv.messages.map((msg, idx) => {
                    const isMe = msg.sender === 'me'
                    const showTime = idx === 0 || activeConv.messages[idx - 1]?.time !== msg.time

                    return (
                      <div key={msg.id}>
                        {showTime && (
                          <div style={{ textAlign: 'center', margin: '8px 0 12px' }}>
                            <span style={{
                              fontSize: '10px', color: C.muted,
                              background: C.card, padding: '3px 10px',
                              borderRadius: '20px', border: `1px solid ${C.border}`,
                            }}>
                              {msg.time}
                            </span>
                          </div>
                        )}
                        <motion.div
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.2 }}
                          style={{
                            display: 'flex',
                            justifyContent: isMe ? 'flex-end' : 'flex-start',
                            marginBottom: '4px',
                          }}
                        >
                          {!isMe && (
                            <div style={{ marginRight: '8px', flexShrink: 0, alignSelf: 'flex-end' }}>
                              <Avatar initials={activeConv.companyInitials} color={activeConv.companyColor} size={28} />
                            </div>
                          )}
                          <div style={{
                            maxWidth: isMobile ? '82%' : '65%',
                            padding: '10px 14px',
                            borderRadius: isMe ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                            background: isMe ? C.purple : C.card,
                            border: isMe ? 'none' : `1px solid ${C.border}`,
                            fontSize: '13px', color: C.text, lineHeight: 1.6,
                          }}>
                            {msg.content}
                            <div style={{
                              display: 'flex', justifyContent: 'flex-end',
                              alignItems: 'center', gap: '3px', marginTop: '4px',
                            }}>
                              <span style={{ fontSize: '10px', color: isMe ? 'rgba(255,255,255,0.55)' : C.muted }}>
                                {msg.time === 'Now' ? 'Just now' : ''}
                              </span>
                              {isMe && (
                                msg.status === 'read'
                                  ? <CheckCheck size={12} color="rgba(255,255,255,0.6)" />
                                  : msg.status === 'delivered'
                                  ? <CheckCheck size={12} color="rgba(255,255,255,0.4)" />
                                  : <Check size={12} color="rgba(255,255,255,0.4)" />
                              )}
                            </div>
                          </div>
                        </motion.div>
                      </div>
                    )
                  })}
                  <div ref={messagesEndRef} />
                </div>

                {/* Input Bar */}
                <div style={{
                  padding: '12px 14px',
                  borderTop: `1px solid ${C.border}`,
                  background: C.card, flexShrink: 0,
                }}>
                  <div style={{
                    display: 'flex', alignItems: 'center', gap: '8px',
                    background: C.bg, border: `1px solid ${C.border}`,
                    borderRadius: '12px', padding: '8px 12px',
                    transition: 'border-color 0.2s',
                  }}>
                    <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: C.muted, padding: '0 2px', display: 'flex', alignItems: 'center' }}>
                      <Paperclip size={16} />
                    </button>
                    <input
                      value={input}
                      onChange={e => setInput(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && !e.shiftKey && sendMessage()}
                      placeholder="Type a message..."
                      style={{
                        flex: 1, background: 'none', border: 'none', outline: 'none',
                        color: C.text, fontSize: '13px', fontFamily: 'inherit',
                      }}
                    />
                    <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: C.muted, padding: '0 2px', display: 'flex', alignItems: 'center' }}>
                      <Smile size={16} />
                    </button>
                    <button
                      onClick={sendMessage}
                      disabled={!input.trim()}
                      style={{
                        width: '32px', height: '32px', borderRadius: '8px',
                        background: input.trim() ? C.purple : C.border,
                        border: 'none', cursor: input.trim() ? 'pointer' : 'default',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        transition: 'background 0.2s', flexShrink: 0,
                      }}
                    >
                      <Send size={14} color={input.trim() ? '#fff' : C.muted} />
                    </button>
                  </div>
                  <p style={{ margin: '6px 0 0', fontSize: '10px', color: C.muted, textAlign: 'center' }}>
                    Enter to send · Messages are end-to-end encrypted
                  </p>
                </div>
              </>
            ) : (
              /* Empty state for desktop when nothing selected */
              <div style={{
                flex: 1, display: 'flex', flexDirection: 'column',
                alignItems: 'center', justifyContent: 'center',
                padding: '40px', textAlign: 'center',
              }}>
                <div style={{
                  width: '64px', height: '64px', borderRadius: '16px',
                  background: C.purpleDim, border: `1px solid ${C.purple}30`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  margin: '0 auto 16px',
                }}>
                  <Send size={26} color={C.purple} />
                </div>
                <h3 style={{ margin: '0 0 8px', fontSize: '16px', fontWeight: 700, color: C.text }}>
                  Select a conversation
                </h3>
                <p style={{ margin: 0, fontSize: '13px', color: C.sub, maxWidth: '260px', lineHeight: 1.6 }}>
                  Choose a conversation from the list to read and reply to messages from recruiters.
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      <style>{`
        input::placeholder { color: ${C.muted}; }
        input:focus { border-color: ${C.purple} !important; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: ${C.border}; border-radius: 99px; }
      `}</style>
    </div>
  )
}
