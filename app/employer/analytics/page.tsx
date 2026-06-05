'use client'

import { TrendingUp, Users, Eye, Briefcase, ArrowUp, ArrowDown } from 'lucide-react'

const funnelData = [
  { label: 'Views', value: 1240, percent: 100, color: 'bg-blue-500' },
  { label: 'Applied', value: 186, percent: 15, color: 'bg-violet-500' },
  { label: 'Reviewed', value: 94, percent: 7.5, color: 'bg-amber-500' },
  { label: 'Shortlisted', value: 31, percent: 2.5, color: 'bg-orange-500' },
  { label: 'Hired', value: 8, percent: 0.6, color: 'bg-green-500' },
]

const topJobs = [
  { title: 'React Developer', views: 423, applicants: 67, hired: 3 },
  { title: 'Sales Executive', views: 389, applicants: 45, hired: 2 },
  { title: 'Data Entry', views: 428, applicants: 74, hired: 3 },
]

const locationData = [
  { state: 'Punjab', count: 89, percent: 48 },
  { state: 'Haryana', count: 54, percent: 29 },
  { state: 'Delhi', count: 28, percent: 15 },
  { state: 'Himachal Pradesh', count: 15, percent: 8 },
]

export default function AnalyticsPage() {
  return (
    <div className="space-y-8 pb-24 lg:pb-0 animate-fade-up">
      <div>
        <h1 className="text-2xl font-black text-slate-900">Analytics</h1>
        <p className="text-slate-500 mt-1">Track your hiring performance</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Views', value: '1,240', change: '+18%', up: true, icon: Eye, color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: 'Applications', value: '186', change: '+24%', up: true, icon: Users, color: 'text-violet-600', bg: 'bg-violet-50' },
          { label: 'Shortlisted', value: '31', change: '+5%', up: true, icon: Briefcase, color: 'text-orange-600', bg: 'bg-orange-50' },
          { label: 'Hired', value: '8', change: '-2%', up: false, icon: TrendingUp, color: 'text-green-600', bg: 'bg-green-50' },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-2xl border border-slate-100 p-5 card-shadow">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 ${s.bg}`}>
              <s.icon className={`w-5 h-5 ${s.color}`} />
            </div>
            <div className="text-2xl font-black text-slate-900">{s.value}</div>
            <div className="text-xs text-slate-400 mt-0.5">{s.label}</div>
            <div className={`flex items-center gap-1 mt-1.5 text-xs font-semibold ${s.up ? 'text-green-600' : 'text-red-500'}`}>
              {s.up ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />}
              {s.change} vs last month
            </div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl border border-slate-100 p-6 card-shadow">
          <h2 className="font-black text-slate-900 mb-6">Hiring Funnel</h2>
          <div className="space-y-4">
            {funnelData.map((f) => (
              <div key={f.label}>
                <div className="flex justify-between text-sm mb-1.5">
                  <span className="font-medium text-slate-700">{f.label}</span>
                  <span className="font-bold text-slate-900">{f.value.toLocaleString()}</span>
                </div>
                <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
                  <div className={`h-full rounded-full ${f.color} transition-all duration-700`} style={{ width: `${f.percent}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-100 p-6 card-shadow">
          <h2 className="font-black text-slate-900 mb-6">Applicant Locations</h2>
          <div className="space-y-4">
            {locationData.map((l) => (
              <div key={l.state}>
                <div className="flex justify-between text-sm mb-1.5">
                  <span className="font-medium text-slate-700">{l.state}</span>
                  <span className="font-bold text-slate-900">{l.count} applicants - {l.percent}%</span>
                </div>
                <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-500 rounded-full transition-all duration-700" style={{ width: `${l.percent}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 card-shadow overflow-hidden">
        <div className="p-5 border-b border-slate-50">
          <h2 className="font-black text-slate-900">Top Performing Jobs</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50 text-xs font-bold text-slate-500 uppercase tracking-wider">
                <th className="text-left px-5 py-3.5">Job Title</th>
                <th className="text-right px-5 py-3.5">Views</th>
                <th className="text-right px-5 py-3.5">Applicants</th>
                <th className="text-right px-5 py-3.5">Hired</th>
                <th className="text-right px-5 py-3.5">Conv. Rate</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {topJobs.map((job) => (
                <tr key={job.title} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-5 py-4 font-semibold text-slate-900 text-sm">{job.title}</td>
                  <td className="px-5 py-4 text-right text-sm text-slate-600">{job.views}</td>
                  <td className="px-5 py-4 text-right text-sm text-slate-600">{job.applicants}</td>
                  <td className="px-5 py-4 text-right">
                    <span className="text-sm font-bold text-green-700 bg-green-50 px-2.5 py-1 rounded-full">{job.hired}</span>
                  </td>
                  <td className="px-5 py-4 text-right text-sm font-semibold text-slate-700">{((job.hired / job.applicants) * 100).toFixed(1)}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
