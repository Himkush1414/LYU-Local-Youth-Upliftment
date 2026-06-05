'use client'

import { useState } from 'react'
import { MapPin, MessageSquare } from 'lucide-react'
import Link from 'next/link'

const columns = ['applied', 'viewed', 'shortlisted', 'rejected', 'hired']
const columnConfig: Record<string, { label: string; color: string; bg: string; border: string }> = {
  applied: { label: 'Applied', color: 'text-blue-700', bg: 'bg-blue-50', border: 'border-blue-200' },
  viewed: { label: 'Viewed', color: 'text-amber-700', bg: 'bg-amber-50', border: 'border-amber-200' },
  shortlisted: { label: 'Shortlisted', color: 'text-green-700', bg: 'bg-green-50', border: 'border-green-200' },
  rejected: { label: 'Rejected', color: 'text-red-600', bg: 'bg-red-50', border: 'border-red-200' },
  hired: { label: 'Hired', color: 'text-emerald-700', bg: 'bg-emerald-50', border: 'border-emerald-200' },
}

const initialApplicants = [
  { id: '1', name: 'Arjun Singh', role: 'React Developer', city: 'Chandigarh', match: 92, time: '2h ago', status: 'applied' },
  { id: '2', name: 'Priya Sharma', role: 'React Developer', city: 'Ludhiana', match: 85, time: '5h ago', status: 'shortlisted' },
  { id: '3', name: 'Rahul Kumar', role: 'Sales Executive', city: 'Amritsar', match: 70, time: '1d ago', status: 'viewed' },
  { id: '4', name: 'Neha Patel', role: 'Data Entry', city: 'Delhi', match: 78, time: '2d ago', status: 'applied' },
  { id: '5', name: 'Vikram Joshi', role: 'React Developer', city: 'Chandigarh', match: 60, time: '3d ago', status: 'rejected' },
  { id: '6', name: 'Sunita Rao', role: 'Sales Executive', city: 'Punjab', match: 88, time: '4d ago', status: 'hired' },
]

export default function ApplicantsPage() {
  const [applicants, setApplicants] = useState(initialApplicants)
  const [view, setView] = useState<'kanban' | 'list'>('list')

  const move = (id: string, newStatus: string) => {
    setApplicants((a) => a.map((ap) => (ap.id === id ? { ...ap, status: newStatus } : ap)))
  }

  return (
    <div className="space-y-6 pb-24 lg:pb-0 animate-fade-up">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-slate-900">All Applicants</h1>
          <p className="text-slate-500 mt-1">{applicants.length} total applicants across all jobs</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setView('list')} className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${view === 'list' ? 'bg-blue-600 text-white' : 'bg-white border border-slate-200 text-slate-600'}`}>List</button>
          <button onClick={() => setView('kanban')} className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${view === 'kanban' ? 'bg-blue-600 text-white' : 'bg-white border border-slate-200 text-slate-600'}`}>Kanban</button>
        </div>
      </div>

      {view === 'list' ? (
        <div className="bg-white rounded-2xl border border-slate-100 card-shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-50 text-xs font-bold text-slate-500 uppercase tracking-wider">
                  <th className="text-left px-5 py-4">Applicant</th>
                  <th className="text-left px-5 py-4 hidden sm:table-cell">Job Applied</th>
                  <th className="text-left px-5 py-4 hidden md:table-cell">Location</th>
                  <th className="text-left px-5 py-4">Match</th>
                  <th className="text-left px-5 py-4">Status</th>
                  <th className="text-left px-5 py-4">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {applicants.map((a) => {
                  const s = columnConfig[a.status]
                  return (
                    <tr key={a.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full gradient-blue flex items-center justify-center text-white text-xs font-black shrink-0">
                            {a.name.split(' ').map((n) => n[0]).join('')}
                          </div>
                          <div>
                            <p className="font-bold text-slate-900 text-sm">{a.name}</p>
                            <p className="text-xs text-slate-400">{a.time}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4 hidden sm:table-cell"><p className="text-sm text-slate-700 font-medium">{a.role}</p></td>
                      <td className="px-5 py-4 hidden md:table-cell"><span className="flex items-center gap-1 text-xs text-slate-500"><MapPin className="w-3 h-3" />{a.city}</span></td>
                      <td className="px-5 py-4">
                        <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${a.match >= 80 ? 'bg-green-50 text-green-700' : a.match >= 60 ? 'bg-amber-50 text-amber-700' : 'bg-red-50 text-red-600'}`}>{a.match}%</span>
                      </td>
                      <td className="px-5 py-4">
                        <select value={a.status} onChange={(e) => move(a.id, e.target.value)} className={`text-xs font-bold px-3 py-1.5 rounded-full border-0 cursor-pointer focus:outline-none ${s.bg} ${s.color}`}>
                          {columns.map((c) => <option key={c} value={c}>{columnConfig[c].label}</option>)}
                        </select>
                      </td>
                      <td className="px-5 py-4">
                        <Link href="/employer/messages" className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:underline">
                          <MessageSquare className="w-3.5 h-3.5" /> Message
                        </Link>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 overflow-x-auto">
          {columns.map((col) => {
            const cfg = columnConfig[col]
            const colApplicants = applicants.filter((a) => a.status === col)
            return (
              <div key={col} className={`bg-white rounded-2xl border-2 ${cfg.border} p-3`}>
                <div className="flex items-center justify-between mb-3 px-1">
                  <span className={`text-xs font-bold uppercase tracking-wide ${cfg.color}`}>{cfg.label}</span>
                  <span className={`w-5 h-5 rounded-full text-[10px] font-black flex items-center justify-center ${cfg.bg} ${cfg.color}`}>{colApplicants.length}</span>
                </div>
                <div className="space-y-2">
                  {colApplicants.map((a) => (
                    <div key={a.id} className="bg-slate-50 rounded-xl p-3 border border-slate-100">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-7 h-7 rounded-full gradient-blue flex items-center justify-center text-white text-[10px] font-black shrink-0">
                          {a.name.split(' ').map((n) => n[0]).join('')}
                        </div>
                        <p className="font-bold text-slate-900 text-xs truncate">{a.name}</p>
                      </div>
                      <p className="text-[10px] text-slate-500 mb-2">{a.role}</p>
                      <div className="flex items-center justify-between">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${a.match >= 80 ? 'bg-green-50 text-green-700' : 'bg-amber-50 text-amber-700'}`}>{a.match}%</span>
                        <select value={a.status} onChange={(e) => move(a.id, e.target.value)} className="text-[10px] bg-white border border-slate-200 rounded-lg px-1 py-0.5 focus:outline-none cursor-pointer">
                          {columns.map((c) => <option key={c} value={c}>{columnConfig[c].label}</option>)}
                        </select>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
