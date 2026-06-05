'use client'

import { useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'

export function useRealtimeNotifications(userId: string | undefined, onNew: (n: Record<string, unknown>) => void) {
  useEffect(() => {
    if (!userId) return
    const supabase = createClient()

    const channel = supabase
      .channel(`notifications:${userId}`)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'notifications',
        filter: `user_id=eq.${userId}`,
      }, payload => {
        onNew(payload.new as Record<string, unknown>)
      })
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [userId, onNew])
}
