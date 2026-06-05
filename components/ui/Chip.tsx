'use client'

interface ChipProps {
  label: string
  onRemove?: () => void
  onClick?: () => void
  selected?: boolean
  color?: 'blue' | 'green' | 'amber' | 'red' | 'violet' | 'slate'
  size?: 'sm' | 'md'
}

const colorMap = {
  blue:   { base: { background: '#eff6ff', color: '#1d4ed8', border: '1px solid #bfdbfe' }, selected: { background: '#2563eb', color: 'white', border: '1px solid #2563eb' } },
  green:  { base: { background: '#f0fdf4', color: '#15803d', border: '1px solid #bbf7d0' }, selected: { background: '#16a34a', color: 'white', border: '1px solid #16a34a' } },
  amber:  { base: { background: '#fffbeb', color: '#b45309', border: '1px solid #fde68a' }, selected: { background: '#d97706', color: 'white', border: '1px solid #d97706' } },
  red:    { base: { background: '#fef2f2', color: '#b91c1c', border: '1px solid #fecaca' }, selected: { background: '#dc2626', color: 'white', border: '1px solid #dc2626' } },
  violet: { base: { background: '#f5f3ff', color: '#6d28d9', border: '1px solid #ddd6fe' }, selected: { background: '#7c3aed', color: 'white', border: '1px solid #7c3aed' } },
  slate:  { base: { background: '#f8fafc', color: '#475569', border: '1px solid #e2e8f0' }, selected: { background: '#475569', color: 'white', border: '1px solid #475569' } },
}

export function Chip({ label, onRemove, onClick, selected, color = 'blue', size = 'md' }: ChipProps) {
  const styles = selected ? colorMap[color].selected : colorMap[color].base
  const padding = size === 'sm' ? '3px 10px' : '5px 12px'
  const fontSize = size === 'sm' ? 11 : 13

  return (
    <span
      onClick={onClick}
      style={{
        display: 'inline-flex', alignItems: 'center', gap: 5,
        borderRadius: 9999, fontWeight: 600, fontSize, padding,
        cursor: onClick ? 'pointer' : 'default', transition: 'all 0.15s',
        fontFamily: 'Inter, system-ui, sans-serif',
        ...styles,
      }}
    >
      {label}
      {onRemove && (
        <button
          type="button"
          onClick={e => { e.stopPropagation(); onRemove() }}
          style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center', opacity: 0.7 }}
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>
      )}
    </span>
  )
}

export function SkillSelector({ available, selected, onChange, max = 20 }: {
  available: string[]; selected: string[]; onChange: (skills: string[]) => void; max?: number
}) {
  const toggle = (skill: string) => {
    if (selected.includes(skill)) onChange(selected.filter(s => s !== skill))
    else if (selected.length < max) onChange([...selected, skill])
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      {selected.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
          {selected.map(s => <Chip key={s} label={s} selected onRemove={() => toggle(s)} color="blue" />)}
        </div>
      )}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
        {available.filter(s => !selected.includes(s)).map(s => (
          <Chip key={s} label={s} onClick={() => toggle(s)} color="slate" />
        ))}
      </div>
      <p style={{ fontSize: 11, color: '#94a3b8' }}>{selected.length}/{max} selected</p>
    </div>
  )
}
