import React from 'react'
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import type { FoodEntry } from '@/types'

interface EntryCardProps {
  entry: FoodEntry
  onPress?: (entry: FoodEntry) => void
}

export function EntryCard({ entry, onPress }: EntryCardProps) {
  const time = new Date(entry.timestamp).toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  })

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => onPress?.(entry)}
      activeOpacity={0.7}
    >
      <View style={styles.row}>
        <View style={styles.info}>
          <Text style={styles.description} numberOfLines={1}>
            {entry.description || 'Food entry'}
          </Text>
          <Text style={styles.time}>{time}</Text>
        </View>
        <View style={styles.nutrition}>
          <Text style={styles.calories}>
            {entry.calories ?? '—'}
            <Text style={styles.calUnit}> cal</Text>
          </Text>
        </View>
      </View>
      {(entry.protein || entry.carbs || entry.fat) && (
        <View style={styles.macros}>
          {entry.protein != null && (
            <Text style={styles.macro}>P: {Math.round(entry.protein)}g</Text>
          )}
          {entry.carbs != null && (
            <Text style={styles.macro}>C: {Math.round(entry.carbs)}g</Text>
          )}
          {entry.fat != null && (
            <Text style={styles.macro}>F: {Math.round(entry.fat)}g</Text>
          )}
          {entry.estimated && (
            <View style={styles.estimatedBadge}>
              <Text style={styles.estimatedText}>est.</Text>
            </View>
          )}
        </View>
      )}
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  info: {
    flex: 1,
  },
  description: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
  },
  time: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 2,
  },
  nutrition: {
    alignItems: 'flex-end',
  },
  calories: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2563eb',
  },
  calUnit: {
    fontSize: 12,
    fontWeight: 'normal',
    color: '#6b7280',
  },
  macros: {
    flexDirection: 'row',
    marginTop: 8,
    alignItems: 'center',
  },
  macro: {
    fontSize: 12,
    color: '#6b7280',
    marginRight: 12,
  },
  estimatedBadge: {
    backgroundColor: '#fef3c7',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    marginLeft: 'auto',
  },
  estimatedText: {
    fontSize: 10,
    color: '#d97706',
    fontWeight: '600',
  },
})