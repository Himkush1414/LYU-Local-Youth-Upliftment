'use client'

import { useState } from 'react'

interface AccordionItem {
  title: string
  content: React.ReactNode
}

export function Accordion({ items, defaultOpen }: { items: AccordionItem[]; defaultOpen?: number }) {
  const [openIdx, setOpenIdx] = useState<number | null>(defaultOpen ?? null)

  return (
    <div style={{ borderRadius: 16, border: '1px solid #e2e8f0', background: 'white', overflow: 'hidden' }}>
      {items.map((item, i) => (
        <div key={i} style={{ borderBottom: i < items.length - 1 ? '1px solid #f1f5f9' : 'none' }}>
          <button
            onClick={() => setOpenIdx(openIdx === i ? null : i)}
            style={{
              width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '16px 20px', background: 'none', border: 'none', cursor: 'pointer',
              fontFamily: 'inherit', textAlign: 'left',
            }}
          >
            <span style={{ fontWeight: 600, color: '#0f172a', fontSize: 14 }}>{item.title}</span>
            <svg
              width="16" height="16" viewBox="0 0 24 24" fill="none"
              stroke="#94a3b8" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
              style={{ flexShrink: 0, transform: openIdx === i ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}
            >
              <polyline points="6 9 12 15 18 9"/>
            </svg>
          </button>
          <div style={{
            maxHeight: openIdx === i ? 400 : 0, overflow: 'hidden',
            transition: 'max-height 0.3s ease',
          }}>
            <div style={{ padding: '0 20px 16px', fontSize: 13, color: '#475569', lineHeight: 1.7 }}>
              {item.content}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
