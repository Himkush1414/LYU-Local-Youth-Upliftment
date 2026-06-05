import { Suspense } from 'react'
import JobsContent from './jobs-content'

export default function BrowseJobsPage() {
  return (
    <Suspense fallback={<div style={{ padding: 40, textAlign: 'center', color: '#94a3b8' }}>Loading jobs...</div>}>
      <JobsContent />
    </Suspense>
  )
}
