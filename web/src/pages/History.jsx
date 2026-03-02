import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import { api, keys } from '../api'
import { Calendar, TrendingDown, TrendingUp, Minus, Flame } from 'lucide-react'
import { format, parseISO, subDays } from 'date-fns'

// Simple bar chart component
function SimpleBarChart({ data, max, label }) {
  const bars = data.map((item, i) => {
    const height = max > 0 ? Math.max((item.value / max) * 100, 2) : 2
    const isToday = item.isToday
    
    return (
      <div key={i} className="flex flex-col items-center gap-1">
        <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
          {item.value > 0 ? item.value : '-'}
        </div>
        <div 
          className={`w-8 rounded-t transition-all duration-300 ${
            isToday 
              ? 'bg-primary-500' 
              : item.value > 0 
                ? 'bg-primary-300 dark:bg-primary-700' 
                : 'bg-gray-200 dark:bg-gray-700'
          }`}
          style={{ height: `${height}%`, minHeight: '4px' }}
        />
        <div className={`text-xs font-medium ${isToday ? 'text-primary-600 dark:text-primary-400' : 'text-gray-400 dark:text-gray-500'}`}>
          {item.label}
        </div>
      </div>
    )
  })

  return (
    <div className="card p-4">
      <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3">{label}</h3>
      <div className="flex items-end justify-between gap-1 h-32">
        {bars}
      </div>
    </div>
  )
}

// Day summary card
function DayCard({ day, isExpanded, onToggle }) {
  const trend = day.change
  const trendIcon = trend > 10 ? TrendingUp : trend < -10 ? TrendingDown : Minus
  const trendColor = trend > 10 ? 'text-red-500' : trend < -10 ? 'text-green-500' : 'text-gray-400'
  const TrendIcon = trendIcon

  return (
    <div className="card overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full p-4 flex items-center gap-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
      >
        <div className="flex-1 text-left">
          <div className="font-semibold text-gray-900 dark:text-gray-100">
            {day.displayDate}
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            {day.count} {day.count === 1 ? 'entry' : 'entries'}
          </div>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            {day.calories}
          </div>
          <div className={`text-xs flex items-center justify-end gap-1 ${trendColor}`}>
            <TrendIcon className="w-3 h-3" />
            {trend > 0 ? '+' : ''}{trend}% vs avg
          </div>
        </div>
      </button>
      
      {isExpanded && day.entries.length > 0 && (
        <div className="border-t border-gray-100 dark:border-gray-700 p-4 space-y-2 bg-gray-50 dark:bg-gray-800/50">
          {day.entries.map((entry) => (
            <div key={entry.id} className="flex justify-between items-center">
              <div>
                <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  {entry.description || 'Unknown food'}
                </span>
                <span className="text-xs text-gray-400 ml-2">
                  {entry.timestamp ? format(parseISO(entry.timestamp), 'h:mm a') : ''}
                </span>
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-300 flex items-center gap-2">
                <Flame className="w-4 h-4 text-accent-500" />
                {entry.calories || 0}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default function History() {
  const { data, isLoading, error } = useQuery({
    queryKey: keys.recentStats(7),
    queryFn: () => api.getRecentStats(7),
    refetchOnWindowFocus: false,
  })

  const { data: todayData } = useQuery({
    queryKey: keys.today,
    queryFn: api.getToday,
    refetchOnWindowFocus: false,
  })

  const [expandedDay, setExpandedDay] = useState(null)

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
        </div>
      </div>
    )
  }

  // Build chart data
  const chartDays = []
  const today = new Date()
  for (let i = 6; i >= 0; i--) {
    const date = subDays(today, i)
    const dateStr = format(date, 'yyyy-MM-dd')
    const dayData = data?.summary?.find(d => d.date === dateStr)
    chartDays.push({
      label: i === 0 ? 'Today' : format(date, 'EEE'),
      value: dayData?.calories || 0,
      isToday: i === 0,
    })
  }

  const maxCalories = Math.max(...chartDays.map(d => d.value), 2000)

  // Build expandable day cards
  const dayCards = data?.summary?.map((day) => ({
    date: day.date,
    displayDate: format(parseISO(day.date), 'EEEE, MMM d'),
    calories: day.calories || 0,
    count: day.count || 0,
    change: calculateChange(day.calories, data.summary),
    entries: day.entries || [],
  })) || []

  function calculateChange(calories, allDays) {
    const avg = allDays.reduce((sum, d) => sum + (d.calories || 0), 0) / allDays.length
    if (avg === 0) return 0
    return Math.round(((calories - avg) / avg) * 100)
  }

  // Calculate totals
  const totalCalories = chartDays.reduce((sum, d) => sum + d.value, 0)
  const avgCalories = Math.round(totalCalories / 7)
  const todayCalories = todayData?.totals?.calories || 0

  return (
    <div className="max-w-lg mx-auto">
      <header className="px-4 pt-6 pb-4">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">History</h1>
        <p className="text-gray-500 dark:text-gray-400">Last 7 days</p>
      </header>

      {/* Quick Stats */}
      <section className="px-4 mb-6">
        <div className="grid grid-cols-2 gap-3">
          <div className="card p-4 text-center">
            <div className="text-3xl font-bold text-primary-600 dark:text-primary-400">
              {todayCalories}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">Today</div>
          </div>
          <div className="card p-4 text-center">
            <div className="text-3xl font-bold text-gray-900 dark:text-gray-100">
              {avgCalories}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">Daily Avg</div>
          </div>
        </div>
      </section>

      {/* Chart */}
      <section className="px-4 mb-6">
        <SimpleBarChart 
          data={chartDays} 
          max={maxCalories} 
          label="Calories per Day"
        />
      </section>

      {/* Day List */}
      <section className="px-4 pb-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3 flex items-center gap-2">
          <Calendar className="w-5 h-5 text-primary-500" />
          Daily Breakdown
        </h2>
        
        <div className="space-y-3">
          {dayCards.map((day) => (
            <DayCard
              key={day.date}
              day={day}
              isExpanded={expandedDay === day.date}
              onToggle={() => setExpandedDay(expandedDay === day.date ? null : day.date)}
            />
          ))}
        </div>
      </section>
    </div>
  )
}