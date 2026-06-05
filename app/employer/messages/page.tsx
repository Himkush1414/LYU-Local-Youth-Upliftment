'use client'

import { useState } from 'react'
import { Search, Send, Paperclip, MoreVertical, ArrowLeft, MessageSquare } from 'lucide-react'

const conversations = [
  { id: '1', name: 'Arjun Singh', role: 'Applied: React Developer', time: '2h ago', preview: 'Thank you for considering my application...', unread: 2, online: true },
  { id: '2', name: 'Priya Sharma', role: 'Applied: React Developer', time: '5h ago', preview: 'I have 3 years of experience with...', unread: 0, online: false },
  { id: '3', name: 'Rahul Kumar', role: 'Applied: Sales Executive', time: '1d ago', preview: 'Looking forward to hearing from you', unread: 0, online: true },
  { id: '4', name: 'Neha Patel', role: 'Applied: Data Entry', time: '2d ago', preview: 'I am available for an interview any time', unread: 1, online: false },
]

const messages = [
  { id: '1', from: 'them', text: 'Hello! Thank you for reviewing my application for the React Developer position.', time: '10:30 AM' },
  { id: '2', from: 'me', text: 'Hi Arjun! We reviewed your profile and are impressed with your skills. Are you available for a quick call?', time: '10:45 AM' },
  { id: '3', from: 'them', text: 'Absolutely! I am available tomorrow between 10 AM and 2 PM. Would that work for you?', time: '10:52 AM' },
  { id: '4', from: 'me', text: 'Perfect. Let us schedule a call at 11 AM tomorrow. I will send you a Google Meet link shortly.', time: '11:01 AM' },
  { id: '5', from: 'them', text: 'Sounds great! Looking forward to speaking with you.', time: '11:03 AM' },
]

export default function MessagesPage() {
  const [selected, setSelected] = useState<string | null>('1')
  const [input, setInput] = useState('')
  const [showList, setShowList] = useState(true)

  const selectedConv = conversations.find((c) => c.id === selected)

  return (
    <div className="pb-24 lg:pb-0 animate-fade-up">
      <div className="bg-white rounded-2xl border border-slate-100 card-shadow overflow-hidden" style={{ height: 'calc(100vh - 10rem)' }}>
        <div className="flex h-full">
          <div className={`${selected && !showList ? 'hidden' : 'flex'} lg:flex flex-col w-full lg:w-80 border-r border-slate-100`}>
            <div className="p-4 border-b border-slate-100">
              <h2 className="font-black text-slate-900 mb-3">Messages</h2>
              <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5">
                <Search className="w-4 h-4 text-slate-400 shrink-0" />
                <input type="text" placeholder="Search conversations..." className="bg-transparent text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none w-full" />
              </div>
            </div>
            <div className="flex-1 overflow-y-auto">
              {conversations.map((conv) => (
                <button key={conv.id} onClick={() => { setSelected(conv.id); setShowList(false) }}
                  className={`w-full flex items-start gap-3 p-4 hover:bg-slate-50 transition-colors text-left ${selected === conv.id ? 'bg-blue-50 border-r-2 border-blue-600' : ''}`}>
                  <div className="relative shrink-0">
                    <div className="w-11 h-11 rounded-full gradient-blue flex items-center justify-center text-white text-xs font-black">
                      {conv.name.split(' ').map((n) => n[0]).join('')}
                    </div>
                    {conv.online && <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-white rounded-full" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-baseline">
                      <p className="font-bold text-slate-900 text-sm truncate">{conv.name}</p>
                      <span className="text-xs text-slate-400 shrink-0 ml-2">{conv.time}</span>
                    </div>
                    <p className="text-xs text-blue-600 font-medium mb-0.5">{conv.role}</p>
                    <p className="text-xs text-slate-500 truncate">{conv.preview}</p>
                  </div>
                  {conv.unread > 0 && (
                    <span className="shrink-0 w-5 h-5 bg-blue-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center">{conv.unread}</span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {selected && selectedConv ? (
            <div className={`${showList ? 'hidden' : 'flex'} lg:flex flex-col flex-1`}>
              <div className="flex items-center gap-3 p-4 border-b border-slate-100 bg-white">
                <button onClick={() => setShowList(true)} className="lg:hidden mr-1 text-slate-500 hover:text-slate-800">
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <div className="relative">
                  <div className="w-10 h-10 rounded-full gradient-blue flex items-center justify-center text-white text-xs font-black">
                    {selectedConv.name.split(' ').map((n) => n[0]).join('')}
                  </div>
                  {selectedConv.online && <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-green-500 border-2 border-white rounded-full" />}
                </div>
                <div>
                  <p className="font-bold text-slate-900 text-sm">{selectedConv.name}</p>
                  <p className="text-xs text-slate-400">{selectedConv.online ? 'Online now' : 'Offline'}</p>
                </div>
                <button className="ml-auto text-slate-400 hover:text-slate-700 p-2 rounded-lg hover:bg-slate-100 transition-colors">
                  <MoreVertical className="w-4 h-4" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50/30">
                {messages.map((msg) => (
                  <div key={msg.id} className={`flex ${msg.from === 'me' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[75%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                      msg.from === 'me'
                        ? 'bg-blue-600 text-white rounded-br-sm'
                        : 'bg-white text-slate-800 border border-slate-100 rounded-bl-sm card-shadow'
                    }`}>
                      {msg.text}
                      <div className={`text-[10px] mt-1 ${msg.from === 'me' ? 'text-blue-200' : 'text-slate-400'}`}>{msg.time}</div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-4 border-t border-slate-100 bg-white">
                <div className="flex items-center gap-3">
                  <button className="text-slate-400 hover:text-slate-700 p-2 rounded-xl hover:bg-slate-100 transition-colors">
                    <Paperclip className="w-5 h-5" />
                  </button>
                  <div className="flex-1 bg-slate-50 border-2 border-slate-200 focus-within:border-blue-500 rounded-2xl px-4 py-3 transition-all">
                    <input
                      type="text"
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      placeholder="Type a message..."
                      className="w-full bg-transparent text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none"
                    />
                  </div>
                  <button className="w-11 h-11 gradient-blue rounded-xl flex items-center justify-center hover:opacity-90 transition-opacity shadow-md shadow-blue-200">
                    <Send className="w-4 h-4 text-white" />
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="hidden lg:flex flex-1 items-center justify-center bg-slate-50/30">
              <div className="text-center">
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MessageSquare className="w-8 h-8 text-slate-300" />
                </div>
                <p className="font-bold text-slate-900 mb-1">No conversation selected</p>
                <p className="text-sm text-slate-500">Choose a conversation from the list</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
