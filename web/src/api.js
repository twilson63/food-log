// Use local network IP for mobile testing
const API_BASE = import.meta.env.VITE_API_URL || 'http://192.168.86.36:3003'

export const api = {
  // Entries
  getToday: async () => {
    const res = await fetch(`${API_BASE}/entries/today`)
    if (!res.ok) throw new Error('Failed to fetch today\'s entries')
    return res.json()
  },

  getEntries: async (limit = 50, offset = 0) => {
    const res = await fetch(`${API_BASE}/entries?limit=${limit}&offset=${offset}`)
    if (!res.ok) throw new Error('Failed to fetch entries')
    return res.json()
  },

  getRecentStats: async (days = 7) => {
    const res = await fetch(`${API_BASE}/entries/stats/recent?days=${days}`)
    if (!res.ok) throw new Error('Failed to fetch stats')
    return res.json()
  },

  createEntry: async (data) => {
    const res = await fetch(`${API_BASE}/entries`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    if (!res.ok) throw new Error('Failed to create entry')
    return res.json()
  },

  updateEntry: async (id, data) => {
    const res = await fetch(`${API_BASE}/entries/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    if (!res.ok) throw new Error('Failed to update entry')
    return res.json()
  },

  deleteEntry: async (id) => {
    const res = await fetch(`${API_BASE}/entries/${id}`, { method: 'DELETE' })
    if (!res.ok) throw new Error('Failed to delete entry')
    return res.json()
  },

  // Vision
  analyzePhoto: async (photo) => {
    const res = await fetch(`${API_BASE}/vision/analyze`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ photo }),
    })
    if (!res.ok) throw new Error('Failed to analyze photo')
    return res.json()
  },

  // Health
  health: async () => {
    const res = await fetch(`${API_BASE}/health`)
    if (!res.ok) throw new Error('API unhealthy')
    return res.json()
  },
}

// React Query keys
export const keys = {
  today: ['today'],
  entries: (limit, offset) => ['entries', limit, offset],
  recentStats: (days) => ['stats', 'recent', days],
}