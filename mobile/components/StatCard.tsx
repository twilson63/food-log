import React from 'react'
import { View, Text, StyleSheet } from 'react-native'

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
  },
  value: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  unit: {
    fontSize: 10,
    color: '#666',
  },
  label: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
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