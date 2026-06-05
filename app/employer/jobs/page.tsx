import Link from 'next/link'
import { Plus, Eye, Users, Clock } from 'lucide-react'

const jobs = [
  { id: '1', title: 'React Developer', city: 'Chandigarh', type: 'Full Time', status: 'active', applicants: 18, views: 234, posted: '3 days ago', expires: '57 days left' },
  { id: '2', title: 'Sales Executive', city: 'Amritsar', type: 'Full Time', status: 'active', applicants: 12, views: 189, posted: '5 days ago', expires: '55 days left' },
  { id: '3', title: 'Data Entry Operator', city: 'Ludhiana', type: 'Part Time', status: 'active', applicants: 17, views: 312, posted: '1 week ago', expires: '53 days left' },
  { id: '4', title: 'Marketing Intern', city: 'Chandigarh', type: 'Internship', status: 'paused', applicants: 5, views: 67, posted: '2 weeks ago', expires: '46 days left' },
  { id: '5', title: 'Accountant', city: 'Delhi', type: 'Full Time', status: 'filled', applicants: 24, views: 445, posted: '1 month ago', expires: 'Filled' },
]

const statusMap: Record<string, { label: string; color: string; bg: string }> = {
  active: { label: 'Live', color: 'text-green-700', bg: 'bg-green-50' },
  paused: { label: 'Paused', color: 'text-amber-700', bg: 'bg-amber-50' },
  filled: { label: 'Filled', color: 'text-slate-600', bg: 'bg-slate-100' },
  under_review: { label: 'Under Review', color: 'text-blue-700', bg: 'bg-blue-50' },
}

export default function EmployerJobsPage() {
  return (
    <div className="space-y-6 pb-24 lg:pb-0 animate-fade-up">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-slate-900">My Jobs</h1>
          <p className="text-slate-500 mt-1">{jobs.filter((j) => j.status === 'active').length} active listings</p>
        </div>
        <Link href="/employer/jobs/new" className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold px-5 py-3 rounded-xl transition-all hover:shadow-lg hover:shadow-blue-200">
          <Plus className="w-4 h-4" /> Post New Job
        </Link>
      </div>

      <div className="space-y-3">
        {jobs.map((job) => {
          const s = statusMap[job.status]
          return (
            <div key={job.id} className="bg-white rounded-2xl border border-slate-100 p-5 card-shadow hover:card-shadow-hover transition-all">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="font-black text-slate-900">{job.title}</h3>
                    <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${s.bg} ${s.color}`}>{s.label}</span>
                  </div>
                  <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400">
                    <span>{job.city}</span>
                    <span>-</span>
                    <span>{job.type}</span>
                    <span>-</span>
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" />Posted {job.posted}</span>
                  </div>
                  <div className="flex items-center gap-6 mt-4">
                    <div className="flex items-center gap-2 text-sm">
                      <div className="w-8 h-8 bg-blue-50 rounded-xl flex items-center justify-center">
                        <Users className="w-4 h-4 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-bold text-slate-900">{job.applicants}</p>
                        <p className="text-xs text-slate-400">Applicants</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <div className="w-8 h-8 bg-violet-50 rounded-xl flex items-center justify-center">
                        <Eye className="w-4 h-4 text-violet-600" />
                      </div>
                      <div>
                        <p className="font-bold text-slate-900">{job.views}</p>
                        <p className="text-xs text-slate-400">Views</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-3 shrink-0">
                  <span className="text-xs text-slate-400">{job.expires}</span>
                  <div className="flex items-center gap-2">
                    <Link href={`/employer/jobs/${job.id}/applicants`} className="px-3 py-2 bg-slate-50 hover:bg-blue-50 hover:text-blue-600 border border-slate-200 rounded-xl text-xs font-semibold text-slate-600 transition-all">
                      View Applicants
                    </Link>
                    <Link href={`/employer/jobs/${job.id}`} className="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all">
                      Edit
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
