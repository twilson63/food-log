import { useState, useEffect } from 'react'

const DEFAULT_GOALS = {
  calories: 2000,
  protein: 150,
  carbs: 200,
  fat: 65,
}

const STORAGE_KEY = 'foodlog_goals'

export function useGoals() {
  const [goals, setGoalsState] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) {
        return { ...DEFAULT_GOALS, ...JSON.parse(saved) }
      }
    } catch (e) {
      console.error('Failed to load goals:', e)
    }
    return DEFAULT_GOALS
  })

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(goals))
  }, [goals])

  const setGoals = (newGoals) => {
    setGoalsState(prev => ({ ...prev, ...newGoals }))
  }

  const resetGoals = () => {
    setGoalsState(DEFAULT_GOALS)
  }

  return { goals, setGoals, resetGoals, defaults: DEFAULT_GOALS }
}

export function useLocalStorage(key, defaultValue) {
  const [value, setValue] = useState(() => {
    try {
      const saved = localStorage.getItem(key)
      if (saved !== null) {
        return JSON.parse(saved)
      }
    } catch (e) {
      console.error('Failed to load from localStorage:', e)
    }
    return defaultValue
  })

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value))
  }, [key, value])

  return [value, setValue]
}