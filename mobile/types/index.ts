export interface FoodEntry {
  id: number
  photo?: string
  photoUrl?: string
  description?: string
  calories?: number
  protein?: number
  carbs?: number
  fat?: number
  timestamp: string
  estimated: boolean
  createdAt: string
  updatedAt: string
}

export interface NutritionEstimate {
  description: string
  calories: number
  protein: number
  carbs: number
  fat: number
  confidence: number
  portionSize?: string
  notes?: string
  estimated: boolean
  model: string
  error?: string
  fallback?: boolean
}

export interface DailyTotals {
  calories: number
  protein: number
  carbs: number
  fat: number
}

export interface TodayResponse {
  date: string
  entries: FoodEntry[]
  totals: DailyTotals
  count: number
}

export interface CreateEntryRequest {
  photo?: string // base64
  photoUrl?: string
  description?: string
  calories?: number
  protein?: number
  carbs?: number
  fat?: number
}

export interface CreateEntryResponse {
  entry: FoodEntry
  visionEstimate?: NutritionEstimate
}

export interface HealthResponse {
  status: string
  database: string
  vision: {
    configured: boolean
    model: string
    provider: string
  }
}