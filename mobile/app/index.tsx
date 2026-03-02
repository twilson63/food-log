import React from 'react'
import { View, Text, StyleSheet, ScrollView, RefreshControl, ActivityIndicator, TouchableOpacity } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Link } from 'expo-router'
import { useToday } from '@/hooks/useApi'
import { MacroRing } from '@/components/StatCard'
import { EntryCard } from '@/components/EntryCard'

export default function HomeScreen() {
  const { data, loading, error, refresh } = useToday()

  const today = data?.date ?? new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  })

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={refresh} />
        }
      >
        {/* Header with Navigation */}
        <View style={styles.headerRow}>
          <View style={styles.headerText}>
            <Text style={styles.dateLabel}>{today}</Text>
            <Text style={styles.title}>FoodLog</Text>
          </View>
          <View style={styles.headerButtons}>
            <Link href="/history" asChild>
              <TouchableOpacity style={styles.headerButton}>
                <Text style={styles.headerButtonText}>📊 History</Text>
              </TouchableOpacity>
            </Link>
            <Link href="/settings" asChild>
              <TouchableOpacity style={styles.headerButton}>
                <Text style={styles.headerButtonText}>⚙️</Text>
              </TouchableOpacity>
            </Link>
          </View>
        </View>
        
        {error && (
          <View style={styles.errorBox}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

        {/* Today's Stats */}
        <View style={styles.statsCard}>
          <View style={styles.caloriesContainer}>
            <Text style={styles.caloriesValue}>
              {data?.totals?.calories ?? 0}
            </Text>
            <Text style={styles.caloriesLabel}>calories today</Text>
          </View>

          <View style={styles.macrosRow}>
            <MacroRing
              label="Protein"
              value={data?.totals?.protein ?? 0}
              color="#ef4444"
            />
            <MacroRing
              label="Carbs"
              value={data?.totals?.carbs ?? 0}
              color="#3b82f6"
            />
            <MacroRing
              label="Fat"
              value={data?.totals?.fat ?? 0}
              color="#f59e0b"
            />
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActions}>
          <Link href="/add" asChild>
            <TouchableOpacity style={styles.quickAddButton}>
              <Text style={styles.quickAddIcon}>📷</Text>
              <Text style={styles.quickAddText}>Add Food</Text>
            </TouchableOpacity>
          </Link>
        </View>

        {/* Today's Entries */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            Today's Entries ({data?.count ?? 0})
          </Text>

          {loading && !data ? (
            <ActivityIndicator size="large" color="#2563eb" />
          ) : !data?.entries?.length ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyIcon}>🍽️</Text>
              <Text style={styles.emptyText}>No entries yet today</Text>
              <Text style={styles.emptySubtext}>
                Tap the + button to add your first meal
              </Text>
            </View>
          ) : (
            data?.entries?.map((entry) => (
              <Link
                key={entry.id}
                href={`/entry/${entry.id}`}
                asChild
              >
                <EntryCard entry={entry} />
              </Link>
            ))
          )}
        </View>

        {/* Quick Stats */}
        {data && data.count > 0 && (
          <View style={styles.quickStats}>
            <Text style={styles.quickStatText}>
              📊 Average: {Math.round((data.totals?.calories ?? 0) / Math.max(1, data.count))} cal/entry
            </Text>
          </View>
        )}
      </ScrollView>

      {/* Floating Add Button */}
      <Link href="/add" style={styles.fab}>
        <Text style={styles.fabText}>+</Text>
      </Link>
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
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  headerText: {
    flex: 1,
  },
  dateLabel: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 2,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  headerButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  headerButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: '#e5e7eb',
  },
  headerButtonText: {
    fontSize: 14,
    color: '#374151',
    fontWeight: '500',
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
  statsCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginBottom: 16,
  },
  caloriesContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  caloriesValue: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  caloriesLabel: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 4,
  },
  macrosRow: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  quickActions: {
    marginBottom: 16,
  },
  quickAddButton: {
    backgroundColor: '#2563eb',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#2563eb',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  quickAddIcon: {
    fontSize: 20,
    marginRight: 8,
  },
  quickAddText: {
    color: '#fff',
    fontSize: 16,
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
  emptyState: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 32,
    alignItems: 'center',
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 12,
  },
  emptyText: {
    fontSize: 16,
    color: '#374151',
    fontWeight: '500',
    marginBottom: 4,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#6b7280',
  },
  quickStats: {
    marginTop: 16,
    padding: 12,
    backgroundColor: '#eff6ff',
    borderRadius: 8,
    alignItems: 'center',
  },
  quickStatText: {
    color: '#1e40af',
    fontSize: 14,
  },
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#2563eb',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  fabText: {
    fontSize: 32,
    color: '#fff',
    fontWeight: '300',
  },
})