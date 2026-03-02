import React from 'react'
import { View, Text, StyleSheet } from 'react-native'

interface ProgressRingProps {
  label: string
  value: number
  goal: number
  unit?: string
  color: string
}

export function ProgressRing({ label, value, goal, unit = 'g', color }: ProgressRingProps) {
  const progress = Math.min(100, (value / goal) * 100)
  const isComplete = value >= goal
  
  return (
    <View style={styles.container}>
      <View style={[styles.ring, { borderColor: isComplete ? '#22c55e' : `${color}30` }]}>
        <View style={[styles.progressOverlay, { 
          borderTopColor: isComplete ? '#22c55e' : color, 
          borderRightColor: isComplete ? '#22c55e' : color,
          transform: [{ rotate: `${(progress / 100) * 360 - 135}deg` }]
        }]} />
        <View style={styles.innerCircle}>
          <Text style={[styles.value, { color: isComplete ? '#22c55e' : color }]}>
            {Math.round(value)}
          </Text>
          <Text style={styles.unit}>{unit}</Text>
        </View>
      </View>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.goalText}>{Math.round(goal)}{unit}</Text>
    </View>
  )
}

interface MacroRingProps {
  label: string
  value: number
  unit?: string
  color: string
}

export function MacroRing({ label, value, unit = 'g', color }: MacroRingProps) {
  return (
    <View style={styles.container}>
      <View style={[styles.ring, { borderColor: color }]}>
        <Text style={[styles.value, { color }]}>{Math.round(value)}</Text>
        <Text style={styles.unit}>{unit}</Text>
      </View>
      <Text style={styles.label}>{label}</Text>
    </View>
  )
}

function StatCard({ label, value, unit = '' }: { label: string; value: number; unit?: string }) {
  return (
    <View style={styles.card}>
      <Text style={styles.cardValue}>
        {value.toLocaleString()}
        <Text style={styles.cardUnit}>{unit}</Text>
      </Text>
      <Text style={styles.cardLabel}>{label}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginHorizontal: 8,
  },
  ring: {
    width: 70,
    height: 70,
    borderRadius: 35,
    borderWidth: 4,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    position: 'relative',
  },
  progressOverlay: {
    position: 'absolute',
    width: 70,
    height: 70,
    borderRadius: 35,
    borderWidth: 4,
    borderLeftColor: 'transparent',
    borderBottomColor: 'transparent',
  },
  innerCircle: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  value: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  unit: {
    fontSize: 9,
    color: '#666',
  },
  label: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  goalText: {
    fontSize: 10,
    color: '#9ca3af',
    marginTop: 1,
  },
  card: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    minWidth: 80,
  },
  cardValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  cardUnit: {
    fontSize: 12,
    fontWeight: 'normal',
    color: '#6b7280',
  },
  cardLabel: {
    fontSize: 11,
    color: '#6b7280',
    marginTop: 2,
  },
})