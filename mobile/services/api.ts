import type { FoodEntry, TodayResponse, CreateEntryRequest, CreateEntryResponse, HealthResponse, NutritionEstimate } from '@/types'

// Configure API base URL - change for development/production
const API_BASE = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3001'

class ApiService {
  private baseUrl: string

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl
  }

  /**
   * Make an API request
   */
  private async request<T>(path: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.baseUrl}${path}`
    
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    })

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Unknown error' }))
      throw new Error(error.error || `HTTP ${response.status}`)
    }

    return response.json()
  }

  /**
   * Check API health
   */
  async health(): Promise<HealthResponse> {
    return this.request<HealthResponse>('/health')
  }

  /**
   * Get all entries with pagination
   */
  async getEntries(limit = 50, offset = 0): Promise<FoodEntry[]> {
    return this.request<FoodEntry[]>(`/entries?limit=${limit}&offset=${offset}`)
  }

  /**
   * Get a single entry
   */
  async getEntry(id: number): Promise<FoodEntry> {
    return this.request<FoodEntry>(`/entries/${id}`)
  }

  /**
   * Get today's entries with totals
   */
  async getToday(): Promise<TodayResponse> {
    return this.request<TodayResponse>('/entries/today')
  }

  /**
   * Get recent days summary
   */
  async getRecentStats(days = 7): Promise<{ date: string; entry_count: number; total_calories: number; total_protein: number; total_carbs: number; total_fat: number }[]> {
    return this.request(`/entries/stats/recent?days=${days}`)
  }

  /**
   * Create a new entry
   */
  async createEntry(data: CreateEntryRequest): Promise<CreateEntryResponse> {
    return this.request<CreateEntryResponse>('/entries', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  /**
   * Update an entry
   */
  async updateEntry(id: number, data: Partial<CreateEntryRequest>): Promise<FoodEntry> {
    return this.request<FoodEntry>(`/entries/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    })
  }

  /**
   * Delete an entry
   */
  async deleteEntry(id: number): Promise<{ success: boolean }> {
    return this.request(`/entries/${id}`, {
      method: 'DELETE',
    })
  }

  /**
   * Analyze a food photo without creating an entry
   */
  async analyzePhoto(photo: string, photoUrl?: string): Promise<{ estimate: NutritionEstimate }> {
    return this.request('/vision/analyze', {
      method: 'POST',
      body: JSON.stringify({ photo, photoUrl }),
    })
  }

  /**
   * Check vision service status
   */
  async getVisionStatus(): Promise<{ configured: boolean; model: string; provider: string }> {
    return this.request('/vision/status')
  }
}

export const api = new ApiService(API_BASE)