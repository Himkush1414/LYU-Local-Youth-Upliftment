'use client'

import { useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils/cn'

interface CarouselProps {
  items: React.ReactNode[]
  autoPlay?: boolean
  interval?: number
  showDots?: boolean
  className?: string
}

export function Carousel({ items, autoPlay = true, interval = 4000, showDots = true, className }: CarouselProps) {
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    if (!autoPlay) return
    const t = setInterval(() => setCurrent(c => (c + 1) % items.length), interval)
    return () => clearInterval(t)
  }, [autoPlay, interval, items.length])

  const prev = () => setCurrent(c => (c - 1 + items.length) % items.length)
  const next = () => setCurrent(c => (c + 1) % items.length)

  return (
    <div className={cn('relative overflow-hidden', className)}>
      <div
        className="flex transition-transform duration-500 ease-in-out"
        style={{ transform: `translateX(-${current * 100}%)` }}
      >
        {items.map((item, i) => (
          <div key={i} className="w-full shrink-0">{item}</div>
        ))}
      </div>

      <button onClick={prev} className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/90 rounded-full flex items-center justify-center shadow-md hover:bg-white transition-all">
        <ChevronLeft className="w-5 h-5 text-slate-700" />
      </button>
      <button onClick={next} className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/90 rounded-full flex items-center justify-center shadow-md hover:bg-white transition-all">
        <ChevronRight className="w-5 h-5 text-slate-700" />
      </button>

      {showDots && (
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
          {items.map((_, i) => (
            <button key={i} onClick={() => setCurrent(i)}
              className={cn('w-1.5 h-1.5 rounded-full transition-all', i === current ? 'bg-blue-600 w-4' : 'bg-slate-300')} />
          ))}
        </div>
      )}
    </div>
  )
}
