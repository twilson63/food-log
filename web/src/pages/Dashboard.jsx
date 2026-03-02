import { useQuery } from '@tanstack/react-query'
import { api, keys } from '../api'
import { useGoals } from '../hooks/useGoals'
import { Utensils, Flame, Droplets, Wheat, Clock, Trash2 } from 'lucide-react'
import { format, parseISO } from 'date-fns'

// Circular progress component
function ProgressRing({ value, max, size = 120, strokeWidth = 10, color = 'primary' }) {
  const radius = (size - strokeWidth) / 2
  const circumference = radius * 2 * Math.PI
  const percentage = max > 0 ? Math.min((value / max) * 100, 100) : 0
  const strokeDashoffset = circumference - (percentage / 100) * circumference

  const colorClasses = {
    primary: 'stroke-primary-500',
    accent: 'stroke-accent-500',
    blue: 'stroke-blue-500',
    purple: 'stroke-purple-500',
  }

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="transform -rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
          className="stroke-gray-200 dark:stroke-gray-700"
          fill="none"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
          className={colorClasses[color]}
          fill="none"
          strokeLinecap="round"
          style={{
            strokeDasharray: circumference,
            strokeDashoffset,
            transition: 'stroke-dashoffset 0.5s ease-out',
          }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-2xl font-bold text-gray-900 dark:text-gray-100">{value}</span>
        <span className="text-xs text-gray-500 dark:text-gray-400">/ {max}</span>
      </div>
    </div>
  )
}

// Macro breakdown component
function MacroCard({ label, value, max, unit, color, icon: Icon }) {
  const percentage = max > 0 ? Math.min((value / max) * 100, 100) : 0
  
  const bgColors = {
    protein: 'bg-blue-100 dark:bg-blue-900/30',
    carbs: 'bg-amber-100 dark:bg-amber-900/30',
    fat: 'bg-rose-100 dark:bg-rose-900/30',
  }
  
  const textColors = {
    protein: 'text-blue-600 dark:text-blue-400',
    carbs: 'text-amber-600 dark:text-amber-400',
    fat: 'text-rose-600 dark:text-rose-400',
  }

  return (
    <div className={`card p-4 flex items-center gap-3 ${bgColors[color]}`}>
      <div className={`p-2 rounded-xl ${textColors[color]}`}>
        <Icon className="w-5 h-5" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-baseline justify-between mb-1">
          <span className="text-sm font-medium text-gray-600 dark:text-gray-300">{label}</span>
          <span className={`text-sm font-semibold ${textColors[color]}`}>
            {value}{unit} / {max}{unit}
          </span>
        </div>
        <div className="h-2 bg-white/50 dark:bg-gray-700 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ${
              color === 'protein' ? 'bg-blue-500' : color === 'carbs' ? 'bg-amber-500' : 'bg-rose-500'
            }`}
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>
    </div>
  )
}

// Entry card component
function EntryCard({ entry, onDelete }) {
  const time = entry.timestamp 
    ? format(parseISO(entry.timestamp), 'h:mm a')
    : format(new Date(), 'h:mm a')

  return (
    <div className="card-hover p-4 slide-up">
      <div className="flex gap-3">
        {entry.photoUrl && (
          <img
            src={entry.photoUrl}
            alt={entry.description || 'Food'}
            className="w-16 h-16 rounded-xl object-cover flex-shrink-0"
          />
        )}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <h3 className="font-semibold text-gray-900 dark:text-gray-100 truncate">
                {entry.description || 'Unknown food'}
              </h3>
              <div className="flex items-center gap-1 mt-0.5 text-gray-500 dark:text-gray-400">
                <Clock className="w-3 h-3" />
                <span className="text-xs">{time}</span>
                {entry.estimated && (
                  <span className="text-xs bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300 px-1.5 py-0.5 rounded-full ml-1">
                    AI
                  </span>
                )}
              </div>
            </div>
            <button
              onClick={() => onDelete(entry.id)}
              className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors flex-shrink-0"
              title="Delete"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
          <div className="flex gap-3 mt-2 text-sm">
            <span className="flex items-center gap-1 text-gray-600 dark:text-gray-300">
              <Flame className="w-4 h-4 text-accent-500" />
              <span className="font-medium">{entry.calories || 0}</span>
            </span>
            <span className="text-gray-400 dark:text-gray-500">
              P: {entry.protein || 0}g
            </span>
            <span className="text-gray-400 dark:text-gray-500">
              C: {entry.carbs || 0}g
            </span>
            <span className="text-gray-400 dark:text-gray-500">
              F: {entry.fat || 0}g
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function Dashboard() {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: keys.today,
    queryFn: api.getToday,
    refetchOnWindowFocus: false,
  })

  const { goals } = useGoals()

  const handleDelete = async (id) => {
    if (!confirm('Delete this entry?')) return
    try {
      await api.deleteEntry(id)
      refetch()
    } catch (err) {
      alert('Failed to delete entry: ' + err.message)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-pulse-soft text-gray-400">Loading...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-4">
        <div className="card p-6 text-center text-red-500">
          <p>Error: {error.message}</p>
          <button onClick={() => refetch()} className="btn-primary mt-4 px-4 py-2">
            Retry
          </button>
        </div>
      </div>
    )
  }

  const { entries, totals, date } = data
  const todayStr = format(new Date(), 'EEEE, MMMM d')

  // Goals from settings
  const { calories: calorieGoal, protein: proteinGoal, carbs: carbsGoal, fat: fatGoal } = goals

  return (
    <div className="max-w-lg mx-auto">
      {/* Header */}
      <header className="px-4 pt-6 pb-4">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Today</h1>
        <p className="text-gray-500 dark:text-gray-400">{todayStr}</p>
      </header>

      {/* Calorie Ring */}
      <section className="px-4 mb-6">
        <div className="card p-6 flex items-center justify-center flex-col">
          <ProgressRing
            value={totals.calories || 0}
            max={calorieGoal}
            size={160}
            strokeWidth={12}
            color="primary"
          />
          <p className="mt-2 text-gray-500 dark:text-gray-400 text-sm">Calories</p>
        </div>
      </section>

      {/* Macros Grid */}
      <section className="px-4 mb-6 space-y-3">
        <MacroCard
          label="Protein"
          value={totals.protein || 0}
          max={proteinGoal}
          unit="g"
          color="protein"
          icon={Droplets}
        />
        <MacroCard
          label="Carbs"
          value={totals.carbs || 0}
          max={carbsGoal}
          unit="g"
          color="carbs"
          icon={Wheat}
        />
        <MacroCard
          label="Fat"
          value={totals.fat || 0}
          max={fatGoal}
          unit="g"
          color="fat"
          icon={Droplets}
        />
      </section>

      {/* Entries List */}
      <section className="px-4 pb-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3 flex items-center gap-2">
          <Utensils className="w-5 h-5 text-primary-500" />
          Food Log
          <span className="text-sm font-normal text-gray-500">
            {entries.length} {entries.length === 1 ? 'entry' : 'entries'}
          </span>
        </h2>

        {entries.length === 0 ? (
          <div className="card p-8 text-center">
            <div className="text-6xl mb-4">🍽️</div>
            <p className="text-gray-500 dark:text-gray-400">No food logged today</p>
            <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
              Tap the + button to add your first meal
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {entries.map((entry) => (
              <EntryCard key={entry.id} entry={entry} onDelete={handleDelete} />
            ))}
          </div>
        )}
      </section>
    </div>
  )
}