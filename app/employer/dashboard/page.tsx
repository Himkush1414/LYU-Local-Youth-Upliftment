import Link from 'next/link'
import { Briefcase, Users, Eye, TrendingUp, Plus, ArrowRight, Clock, MapPin, AlertCircle } from 'lucide-react'

const stats = [
  { label: 'Active Jobs', value: '4', change: '+1 this week', icon: Briefcase, color: 'text-blue-600', bg: 'bg-blue-50' },
  { label: 'Total Applicants', value: '47', change: '+12 today', icon: Users, color: 'text-violet-600', bg: 'bg-violet-50' },
  { label: 'Profile Views', value: '1.2K', change: 'Last 30 days', icon: Eye, color: 'text-green-600', bg: 'bg-green-50' },
  { label: 'Hired This Month', value: '3', change: '2 more shortlisted', icon: TrendingUp, color: 'text-orange-600', bg: 'bg-orange-50' },
]

const recentApplicants = [
  { name: 'Arjun Singh', role: 'React Developer', city: 'Chandigarh', match: 92, status: 'new', time: '2h ago' },
  { name: 'Priya Sharma', role: 'React Developer', city: 'Ludhiana', match: 85, status: 'shortlisted', time: '5h ago' },
  { name: 'Rahul Kumar', role: 'Sales Executive', city: 'Amritsar', match: 70, status: 'viewed', time: '1d ago' },
  { name: 'Neha Patel', role: 'Data Entry', city: 'Delhi', match: 78, status: 'new', time: '2d ago' },
]

const activeJobs = [
  { title: 'React Developer', applicants: 18, views: 234, status: 'active', posted: '3d ago' },
  { title: 'Sales Executive', applicants: 12, views: 189, status: 'active', posted: '5d ago' },
  { title: 'Data Entry Operator', applicants: 17, views: 312, status: 'active', posted: '1w ago' },
]

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    new: 'bg-blue-50 text-blue-700',
    shortlisted: 'bg-green-50 text-green-700',
    viewed: 'bg-amber-50 text-amber-700',
    rejected: 'bg-red-50 text-red-600',
  }
  return <span className={`text-xs font-semibold px-2.5 py-1 rounded-full capitalize ${map[status] || 'bg-slate-50 text-slate-600'}`}>{status}</span>
}

function MatchBadge({ score }: { score: number }) {
  const color = score >= 80 ? 'text-green-700 bg-green-50' : score >= 60 ? 'text-amber-700 bg-amber-50' : 'text-red-700 bg-red-50'
  return <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${color}`}>{score}% match</span>
}

export default function EmployerDashboard() {
  return (
    <div className="space-y-8 pb-24 lg:pb-0 animate-fade-up">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900">Good morning</h1>
          <p className="text-slate-500 mt-1">Here&apos;s what&apos;s happening with your jobs today</p>
        </div>
        <Link href="/employer/jobs/new" className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold px-5 py-3 rounded-xl transition-all hover:shadow-lg hover:shadow-blue-200">
          <Plus className="w-4 h-4" /> Post New Job
        </Link>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => (
          <div key={s.label} className="bg-white rounded-2xl border border-slate-100 p-5 card-shadow hover:card-shadow-hover transition-all">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 ${s.bg}`}>
              <s.icon className={`w-5 h-5 ${s.color}`} />
            </div>
            <div className="text-2xl font-black text-slate-900">{s.value}</div>
            <div className="text-xs text-slate-400 mt-0.5">{s.label}</div>
            <div className="text-xs text-slate-500 mt-1.5 font-medium">{s.change}</div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-100 card-shadow overflow-hidden">
          <div className="flex items-center justify-between p-5 border-b border-slate-50">
            <h2 className="font-black text-slate-900">Recent Applicants</h2>
            <Link href="/employer/applicants" className="text-sm text-blue-600 font-semibold hover:underline flex items-center gap-1">
              View all <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <div className="divide-y divide-slate-50">
            {recentApplicants.map((a) => (
              <div key={a.name} className="flex items-center justify-between p-4 sm:p-5 hover:bg-slate-50/50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full gradient-blue flex items-center justify-center text-white text-xs font-black shrink-0">
                    {a.name.split(' ').map((n) => n[0]).join('')}
                  </div>
                  <div>
                    <p className="font-bold text-slate-900 text-sm">{a.name}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-xs text-slate-400">{a.role}</span>
                      <span className="text-slate-200">.</span>
                      <span className="flex items-center gap-1 text-xs text-slate-400"><MapPin className="w-3 h-3" />{a.city}</span>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row items-end sm:items-center gap-2">
                  <MatchBadge score={a.match} />
                  <StatusBadge status={a.status} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-100 card-shadow overflow-hidden">
          <div className="flex items-center justify-between p-5 border-b border-slate-50">
            <h2 className="font-black text-slate-900">Active Jobs</h2>
            <Link href="/employer/jobs" className="text-sm text-blue-600 font-semibold hover:underline">View all</Link>
          </div>
          <div className="divide-y divide-slate-50">
            {activeJobs.map((job) => (
              <Link key={job.title} href="/employer/jobs" className="block p-4 hover:bg-slate-50/50 transition-colors">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <p className="font-bold text-slate-900 text-sm leading-tight">{job.title}</p>
                  <span className="text-[10px] bg-green-50 text-green-700 font-semibold px-2 py-1 rounded-full shrink-0">Live</span>
                </div>
                <div className="flex items-center gap-3 text-xs text-slate-400">
                  <span className="flex items-center gap-1"><Users className="w-3 h-3" />{job.applicants} applied</span>
                  <span className="flex items-center gap-1"><Eye className="w-3 h-3" />{job.views} views</span>
                </div>
                <div className="flex items-center gap-1 mt-2 text-xs text-slate-400">
                  <Clock className="w-3 h-3" />{job.posted}
                </div>
              </Link>
            ))}
          </div>
          <div className="p-4 border-t border-slate-50">
            <Link href="/employer/jobs/new" className="flex items-center justify-center gap-2 w-full py-2.5 border-2 border-dashed border-slate-200 hover:border-blue-300 rounded-xl text-sm font-semibold text-slate-500 hover:text-blue-600 transition-all">
              <Plus className="w-4 h-4" /> Post another job
            </Link>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-6 text-white">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 mt-0.5 shrink-0 text-blue-200" />
            <div>
              <p className="font-bold">Company profile is 70% complete</p>
              <p className="text-blue-100 text-sm mt-0.5">Add your company logo and description to get 2x more applicants</p>
            </div>
          </div>
          <Link href="/employer/settings" className="shrink-0 bg-white text-blue-600 text-sm font-bold px-4 py-2.5 rounded-xl hover:bg-blue-50 transition-colors">
            Complete Profile
          </Link>
        </div>
      </div>
    </div>
  )
}
