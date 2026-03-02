import { useState, useEffect, useCallback } from 'react'
import { api } from '@/services/api'
import type { TodayResponse, FoodEntry } from '@/types'

interface UseTodayResult {
  data: TodayResponse | null
  loading: boolean
  error: string | null
  refresh: () => Promise<void>
}

export function useToday(): UseTodayResult {
  const [data, setData] = useState<TodayResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const refresh = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const result = await api.getToday()
      setData(result)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    refresh()
  }, [refresh])

  return { data, loading, error, refresh }
}

interface UseEntriesResult {
  entries: FoodEntry[]
  loading: boolean
  error: string | null
  hasMore: boolean
  loadMore: () => Promise<void>
  refresh: () => Promise<void>
}

export function useEntries(limit = 20): UseEntriesResult {
  const [entries, setEntries] = useState<FoodEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [offset, setOffset] = useState(0)
  const [hasMore, setHasMore] = useState(true)

  const loadMore = useCallback(async () => {
    if (loading || !hasMore) return
    
    try {
      setLoading(true)
      setError(null)
      const newEntries = await api.getEntries(limit, offset)
      setEntries(prev => [...prev, ...newEntries])
      setOffset(prev => prev + limit)
      setHasMore(newEntries.length === limit)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load')
    } finally {
      setLoading(false)
    }
  }, [limit, offset, loading, hasMore])

  const refresh = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const newEntries = await api.getEntries(limit, 0)
      setEntries(newEntries)
      setOffset(limit)
      setHasMore(newEntries.length === limit)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load')
    } finally {
      setLoading(false)
    }
  }, [limit])

  useEffect(() => {
    loadMore()
  }, [])

  return { entries, loading, error, hasMore, loadMore, refresh }
}