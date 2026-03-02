import React, { useState, useEffect, useCallback } from 'react'
import { View, Text, StyleSheet, ScrollView, RefreshControl, ActivityIndicator, TouchableOpacity } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Link } from 'expo-router'
import { useToday } from '@/hooks/useApi'
import { api } from '@/services/api'
import type { FoodEntry } from '@/types'

interface DaySummary {
  date: string
  displayDate: string
  calories: number
  count: number
  entries: FoodEntry[]
}

export default function HistoryScreen() {
  const { data: todayData, refresh: refreshToday } = useToday()
  const [history, setHistory] = useState<DaySummary[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [expandedDay, setExpandedDay] = useState<string | null>(null)

  const loadHistory = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await api.getRecentStats(7)
      
      const summaries: DaySummary[] = data.map((day: any) => ({
        date: day.date,
        displayDate: formatDate(day.date),
        calories: day.total_calories || 0,
        count: day.entry_count || 0,
        entries: day.entries || []
      }))
      
      setHistory(summaries)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load history')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadHistory()
  }, [loadHistory])

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    const today = new Date()
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)
    
    if (date.toDateString() === today.toDateString()) {
      return 'Today'
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday'
    } else {
      return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })
    }
  }

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    })
  }

  const getAverageCalories = () => {
    if (history.length === 0) return 0
    const total = history.reduce((sum, day) => sum + day.calories, 0)
    return Math.round(total / history.length)
  }

  const getHighestDay = () => {
    if (history.length === 0) return { calories: 0, date: '' }
    return history.reduce((max, day) => day.calories > max.calories ? day : max, history[0])
  }

  const todayCalories = todayData?.totals?.calories || 0
  const avgCalories = getAverageCalories()
  const highestDay = getHighestDay()

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={() => { loadHistory(); refreshToday(); }} />
        }
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>History</Text>
          <Text style={styles.subtitle}>Last 7 days</Text>
        </View>

        {error && (
          <View style={styles.errorBox}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

        {/* Stats Cards */}
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{todayCalories}</Text>
            <Text style={styles.statLabel}>Today</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{avgCalories}</Text>
            <Text style={styles.statLabel}>Daily Avg</Text>
          </View>
        </View>

        {/* Bar Chart */}
        <View style={styles.chartCard}>
          <Text style={styles.chartTitle}>Calories per Day</Text>
          <View style={styles.barChart}>
            {history.map((day, index) => {
              const maxCal = Math.max(...history.map(d => d.calories), 2000)
              const height = maxCal > 0 ? Math.max((day.calories / maxCal) * 100, 4) : 4
              const isToday = index === 0
              
              return (
                <View key={day.date} style={styles.barColumn}>
                  <Text style={styles.barValue}>
                    {day.calories > 0 ? day.calories : '-'}
                  </Text>
                  <View style={[
                    styles.bar,
                    { height: `${height}%` as any },
                    isToday && styles.barToday
                  ]} />
                  <Text style={[styles.barLabel, isToday && styles.barLabelToday]}>
                    {day.displayDate.slice(0, 3)}
                  </Text>
                </View>
              )
            })}
          </View>
        </View>

        {/* Daily Breakdown */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Daily Breakdown</Text>
          
          {history.map((day) => (
            <TouchableOpacity
              key={day.date}
              style={styles.dayCard}
              onPress={() => setExpandedDay(expandedDay === day.date ? null : day.date)}
              activeOpacity={0.7}
            >
              <View style={styles.dayHeader}>
                <View style={styles.dayInfo}>
                  <Text style={styles.dayName}>{day.displayDate}</Text>
                  <Text style={styles.dayCount}>
                    {day.count} {day.count === 1 ? 'entry' : 'entries'}
                  </Text>
                </View>
                <View style={styles.dayCalories}>
                  <Text style={styles.dayCaloriesValue}>{day.calories}</Text>
                  <Text style={styles.dayCaloriesLabel}>cal</Text>
                </View>
              </View>
              
              {expandedDay === day.date && day.entries.length > 0 && (
                <View style={styles.entriesList}>
                  {day.entries.map((entry) => (
                    <Link
                      key={entry.id}
                      href={`/entry/${entry.id}`}
                      asChild
                    >
                      <View style={styles.entryItem}>
                        <View style={styles.entryInfo}>
                          <Text style={styles.entryDesc}>
                            {entry.description || 'Food Entry'}
                          </Text>
                          <Text style={styles.entryTime}>{formatTime(entry.timestamp)}</Text>
                        </View>
                        <Text style={styles.entryCalories}>
                          {entry.calories || 0} cal
                        </Text>
                      </View>
                    </Link>
                  ))}
                </View>
              )}
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3f4f6',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 16,
    paddingBottom: 100,
  },
  header: {
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  subtitle: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 4,
  },
  errorBox: {
    backgroundColor: '#fee2e2',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  errorText: {
    color: '#dc2626',
    fontSize: 14,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  statValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#2563eb',
  },
  statLabel: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 4,
  },
  chartCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  chartTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6b7280',
    marginBottom: 12,
  },
  barChart: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    height: 100,
  },
  barColumn: {
    flex: 1,
    alignItems: 'center',
    height: '100%',
    justifyContent: 'flex-end',
  },
  barValue: {
    fontSize: 10,
    color: '#9ca3af',
    marginBottom: 4,
  },
  bar: {
    width: 20,
    backgroundColor: '#93c5fd',
    borderRadius: 4,
    minHeight: 4,
  },
  barToday: {
    backgroundColor: '#2563eb',
  },
  barLabel: {
    fontSize: 10,
    color: '#9ca3af',
    marginTop: 4,
  },
  barLabelToday: {
    color: '#2563eb',
    fontWeight: '600',
  },
  section: {
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 12,
  },
  dayCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
    overflow: 'hidden',
  },
  dayHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  dayInfo: {
    flex: 1,
  },
  dayName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
  },
  dayCount: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 2,
  },
  dayCalories: {
    alignItems: 'flex-end',
  },
  dayCaloriesValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  dayCaloriesLabel: {
    fontSize: 12,
    color: '#6b7280',
  },
  entriesList: {
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  entryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  entryInfo: {
    flex: 1,
  },
  entryDesc: {
    fontSize: 14,
    color: '#374151',
  },
  entryTime: {
    fontSize: 12,
    color: '#9ca3af',
    marginTop: 2,
  },
  entryCalories: {
    fontSize: 14,
    fontWeight: '500',
    color: '#2563eb',
  },
})