import { useState, useEffect } from 'react'
import { Moon, Sun, Server, CheckCircle, XCircle, Loader2, Edit2, Save, X, RefreshCw } from 'lucide-react'
import { api } from '../api'
import { useGoals } from '../hooks/useGoals'

// Setting row component
function SettingRow({ label, description, children }) {
  return (
    <div className="flex items-center justify-between gap-4 py-4">
      <div className="flex-1 min-w-0">
        <div className="font-medium text-gray-900 dark:text-gray-100">{label}</div>
        {description && (
          <div className="text-sm text-gray-500 dark:text-gray-400">{description}</div>
        )}
      </div>
      {children}
    </div>
  )
}

// Toggle switch component
function Toggle({ enabled, onChange }) {
  return (
    <button
      onClick={() => onChange(!enabled)}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
        enabled ? 'bg-primary-500' : 'bg-gray-300 dark:bg-gray-600'
      }`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${
          enabled ? 'translate-x-6' : 'translate-x-1'
        }`}
      />
    </button>
  )
}

// Editable goal input
function GoalInput({ label, value, unit, onChange }) {
  return (
    <div className="flex items-center justify-between gap-4 py-3">
      <span className="text-gray-700 dark:text-gray-300">{label}</span>
      <div className="flex items-center gap-2">
        <input
          type="number"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-20 text-right rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-1.5 text-gray-900 dark:text-gray-100 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
        />
        <span className="text-gray-500 dark:text-gray-400 text-sm w-8">{unit}</span>
      </div>
    </div>
  )
}

export default function Settings() {
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode')
    if (saved !== null) return JSON.parse(saved)
    return window.matchMedia('(prefers-color-scheme: dark)').matches
  })

  const [apiStatus, setApiStatus] = useState('checking') // checking, ok, error
  const [apiDetails, setApiDetails] = useState(null)
  
  const { goals, setGoals, resetGoals, defaults } = useGoals()
  const [editingGoals, setEditingGoals] = useState(false)
  const [tempGoals, setTempGoals] = useState(goals)

  // Dark mode effect
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
    localStorage.setItem('darkMode', JSON.stringify(darkMode))
  }, [darkMode])

  // Check API health
  useEffect(() => {
    const checkHealth = async () => {
      try {
        const result = await api.health()
        setApiStatus('ok')
        setApiDetails(result)
      } catch (err) {
        setApiStatus('error')
        setApiDetails(null)
      }
    }
    checkHealth()
  }, [])

  const startEditingGoals = () => {
    setTempGoals({ ...goals })
    setEditingGoals(true)
  }

  const cancelEditingGoals = () => {
    setTempGoals({ ...goals })
    setEditingGoals(false)
  }

  const saveGoals = () => {
    setGoals({
      calories: parseInt(tempGoals.calories) || defaults.calories,
      protein: parseInt(tempGoals.protein) || defaults.protein,
      carbs: parseInt(tempGoals.carbs) || defaults.carbs,
      fat: parseInt(tempGoals.fat) || defaults.fat,
    })
    setEditingGoals(false)
  }

  const handleResetGoals = () => {
    if (confirm('Reset all goals to defaults?')) {
      resetGoals()
      setTempGoals(defaults)
    }
  }

  return (
    <div className="max-w-lg mx-auto">
      <header className="px-4 pt-6 pb-4">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Settings</h1>
        <p className="text-gray-500 dark:text-gray-400">Customize your experience</p>
      </header>

      <div className="px-4 space-y-4">
        {/* Appearance Section */}
        <section className="card">
          <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700">
            <h2 className="font-semibold text-gray-900 dark:text-gray-100">Appearance</h2>
          </div>
          <div className="px-4">
            <SettingRow
              label="Dark Mode"
              description="Use dark theme"
            >
              <Toggle enabled={darkMode} onChange={setDarkMode} />
            </SettingRow>
          </div>
        </section>

        {/* Goals Section */}
        <section className="card">
          <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between">
            <h2 className="font-semibold text-gray-900 dark:text-gray-100">Daily Goals</h2>
            {!editingGoals ? (
              <button
                onClick={startEditingGoals}
                className="flex items-center gap-1 text-sm text-primary-600 dark:text-primary-400 hover:text-primary-700"
              >
                <Edit2 className="w-4 h-4" />
                Edit
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={handleResetGoals}
                  className="flex items-center gap-1 text-xs text-gray-500 hover:text-gray-700"
                >
                  <RefreshCw className="w-3 h-3" />
                  Reset
                </button>
              </div>
            )}
          </div>
          
          {editingGoals ? (
            <div className="px-4 py-2">
              <GoalInput
                label="Calories"
                value={tempGoals.calories}
                unit="kcal"
                onChange={(v) => setTempGoals({ ...tempGoals, calories: v })}
              />
              <div className="border-t border-gray-100 dark:border-gray-700" />
              <GoalInput
                label="Protein"
                value={tempGoals.protein}
                unit="g"
                onChange={(v) => setTempGoals({ ...tempGoals, protein: v })}
              />
              <div className="border-t border-gray-100 dark:border-gray-700" />
              <GoalInput
                label="Carbs"
                value={tempGoals.carbs}
                unit="g"
                onChange={(v) => setTempGoals({ ...tempGoals, carbs: v })}
              />
              <div className="border-t border-gray-100 dark:border-gray-700" />
              <GoalInput
                label="Fat"
                value={tempGoals.fat}
                unit="g"
                onChange={(v) => setTempGoals({ ...tempGoals, fat: v })}
              />
              <div className="flex gap-3 pt-4 pb-2">
                <button
                  onClick={cancelEditingGoals}
                  className="flex-1 btn-secondary py-2"
                >
                  <X className="w-4 h-4 mr-1" />
                  Cancel
                </button>
                <button
                  onClick={saveGoals}
                  className="flex-1 btn-primary py-2"
                >
                  <Save className="w-4 h-4 mr-1" />
                  Save
                </button>
              </div>
            </div>
          ) : (
            <div className="px-4">
              <SettingRow
                label="Calorie Goal"
                description="Target calories per day"
              >
                <span className="text-lg font-semibold text-gray-900 dark:text-gray-100">{goals.calories}</span>
              </SettingRow>
              <div className="border-t border-gray-100 dark:border-gray-700" />
              <SettingRow
                label="Protein Goal"
                description="Target protein in grams"
              >
                <span className="text-lg font-semibold text-gray-900 dark:text-gray-100">{goals.protein}g</span>
              </SettingRow>
              <div className="border-t border-gray-100 dark:border-gray-700" />
              <SettingRow
                label="Carbs Goal"
                description="Target carbs in grams"
              >
                <span className="text-lg font-semibold text-gray-900 dark:text-gray-100">{goals.carbs}g</span>
              </SettingRow>
              <div className="border-t border-gray-100 dark:border-gray-700" />
              <SettingRow
                label="Fat Goal"
                description="Target fat in grams"
              >
                <span className="text-lg font-semibold text-gray-900 dark:text-gray-100">{goals.fat}g</span>
              </SettingRow>
            </div>
          )}
        </section>

        {/* API Status Section */}
        <section className="card">
          <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700">
            <h2 className="font-semibold text-gray-900 dark:text-gray-100">API Status</h2>
          </div>
          <div className="px-4 py-4">
            <div className="flex items-center gap-3">
              {apiStatus === 'checking' && (
                <>
                  <Loader2 className="w-5 h-5 text-gray-400 animate-spin" />
                  <span className="text-gray-500 dark:text-gray-400">Checking connection...</span>
                </>
              )}
              {apiStatus === 'ok' && (
                <>
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <div>
                    <div className="text-green-600 dark:text-green-400 font-medium">Connected</div>
                    {apiDetails && (
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        Database: {apiDetails.database} • Vision: {apiDetails.vision?.configured ? 'Active' : 'Inactive'}
                      </div>
                    )}
                  </div>
                </>
              )}
              {apiStatus === 'error' && (
                <>
                  <XCircle className="w-5 h-5 text-red-500" />
                  <div>
                    <div className="text-red-600 dark:text-red-400 font-medium">Not Connected</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      Make sure the API is running on port 3001
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </section>

        {/* About Section */}
        <section className="card">
          <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700">
            <h2 className="font-semibold text-gray-900 dark:text-gray-100">About</h2>
          </div>
          <div className="px-4 py-4 text-sm text-gray-500 dark:text-gray-400">
            <p className="mb-2">
              <strong className="text-gray-900 dark:text-gray-100">FoodLog</strong> — Track your meals with AI-powered nutrition analysis
            </p>
            <p>
              Take a photo of your food and let the AI estimate calories, protein, carbs, and fat. View your history and track progress over time.
            </p>
          </div>
        </section>

        {/* Version */}
        <div className="text-center text-xs text-gray-400 py-4">
          FoodLog v1.0.0 • Built with ❤️
        </div>
      </div>
    </div>
  )
}