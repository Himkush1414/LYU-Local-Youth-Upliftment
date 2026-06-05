'use client'

export function Skeleton({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <div
      className={className}
      style={{
        borderRadius: 10,
        background: 'linear-gradient(90deg,#f1f5f9 25%,#e8edf2 50%,#f1f5f9 75%)',
        backgroundSize: '200% 100%',
        animation: 'skshimmer 1.5s infinite',
        ...style,
      }}
    />
  )
}

export function JobCardSkeleton() {
  return (
    <div style={{ background: 'white', borderRadius: 16, border: '1px solid #f1f5f9', padding: 20, display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
        <div style={{ width: 44, height: 44, borderRadius: 12, background: 'linear-gradient(90deg,#f1f5f9 25%,#e8edf2 50%,#f1f5f9 75%)', backgroundSize: '200% 100%', animation: 'skshimmer 1.5s infinite', flexShrink: 0 }} />
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
          <div style={{ height: 14, borderRadius: 6, width: '70%', background: 'linear-gradient(90deg,#f1f5f9 25%,#e8edf2 50%,#f1f5f9 75%)', backgroundSize: '200% 100%', animation: 'skshimmer 1.5s infinite' }} />
          <div style={{ height: 10, borderRadius: 6, width: '45%', background: 'linear-gradient(90deg,#f1f5f9 25%,#e8edf2 50%,#f1f5f9 75%)', backgroundSize: '200% 100%', animation: 'skshimmer 1.5s infinite' }} />
          <div style={{ height: 10, borderRadius: 6, width: '90%', background: 'linear-gradient(90deg,#f1f5f9 25%,#e8edf2 50%,#f1f5f9 75%)', backgroundSize: '200% 100%', animation: 'skshimmer 1.5s infinite' }} />
        </div>
      </div>
      <div style={{ display: 'flex', gap: 8 }}>
        {[60, 80, 50].map(w => (
          <div key={w} style={{ height: 24, borderRadius: 9999, width: w, background: 'linear-gradient(90deg,#f1f5f9 25%,#e8edf2 50%,#f1f5f9 75%)', backgroundSize: '200% 100%', animation: 'skshimmer 1.5s infinite' }} />
        ))}
      </div>
    </div>
  )
}

export function StatCardSkeleton() {
  return (
    <div style={{ background: 'white', borderRadius: 16, border: '1px solid #f1f5f9', padding: 20, display: 'flex', flexDirection: 'column', gap: 10 }}>
      <div style={{ width: 40, height: 40, borderRadius: 10, background: 'linear-gradient(90deg,#f1f5f9 25%,#e8edf2 50%,#f1f5f9 75%)', backgroundSize: '200% 100%', animation: 'skshimmer 1.5s infinite' }} />
      <div style={{ height: 28, borderRadius: 6, width: '50%', background: 'linear-gradient(90deg,#f1f5f9 25%,#e8edf2 50%,#f1f5f9 75%)', backgroundSize: '200% 100%', animation: 'skshimmer 1.5s infinite' }} />
      <div style={{ height: 10, borderRadius: 6, width: '75%', background: 'linear-gradient(90deg,#f1f5f9 25%,#e8edf2 50%,#f1f5f9 75%)', backgroundSize: '200% 100%', animation: 'skshimmer 1.5s infinite' }} />
    </div>
  )
}
