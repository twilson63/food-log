import React, { useState } from 'react'
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Alert, ActivityIndicator } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { router } from 'expo-router'
import * as ImagePicker from 'expo-image-picker'
import { api } from '@/services/api'
import type { NutritionEstimate } from '@/types'

type InputMode = 'photo' | 'manual'

export default function AddEntryScreen() {
  const [mode, setMode] = useState<InputMode>('photo')
  const [description, setDescription] = useState('')
  const [calories, setCalories] = useState('')
  const [protein, setProtein] = useState('')
  const [carbs, setCarbs] = useState('')
  const [fat, setFat] = useState('')
  const [loading, setLoading] = useState(false)
  const [analyzing, setAnalyzing] = useState(false)
  const [visionEstimate, setVisionEstimate] = useState<NutritionEstimate | null>(null)
  const [photoUri, setPhotoUri] = useState<string | null>(null)

  const pickImage = async () => {
    try {
      const permission = await ImagePicker.requestCameraPermissionsAsync()
      if (!permission.granted) {
        Alert.alert('Permission needed', 'Please grant camera access to add food photos')
        return
      }

      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ['images'],
        quality: 0.7,
        base64: true,
      })

      if (!result.canceled && result.assets[0]) {
        const asset = result.assets[0]
        setPhotoUri(asset.uri)
        setAnalyzing(true)

        try {
          const { estimate } = await api.analyzePhoto(asset.base64!)
          setVisionEstimate(estimate)

          // Auto-fill from estimate
          setDescription(estimate.description)
          setCalories(String(estimate.calories))
          setProtein(String(estimate.protein))
          setCarbs(String(estimate.carbs))
          setFat(String(estimate.fat))
        } catch (err) {
          console.error('Vision analysis failed:', err)
          Alert.alert('Analysis failed', 'Could not analyze image. Please enter details manually.')
        } finally {
          setAnalyzing(false)
        }
      }
    } catch (err) {
      console.error('Camera error:', err)
      Alert.alert('Error', 'Failed to open camera')
    }
  }

  const handleSubmit = async () => {
    if (!description && !calories) {
      Alert.alert('Missing info', 'Please enter at least a description or calories')
      return
    }

    setLoading(true)
    try {
      const entryData = {
        description: description || undefined,
        calories: calories ? parseInt(calories, 10) : undefined,
        protein: protein ? parseFloat(protein) : undefined,
        carbs: carbs ? parseFloat(carbs) : undefined,
        fat: fat ? parseFloat(fat) : undefined,
        estimated: visionEstimate?.estimated ?? false,
      }

      await api.createEntry(entryData)
      router.back()
    } catch (err) {
      console.error('Create entry error:', err)
      Alert.alert('Error', 'Failed to create entry')
    } finally {
      setLoading(false)
    }
  }

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
        {/* Mode Toggle */}
        <View style={styles.modeToggle}>
          <TouchableOpacity
            style={[styles.modeButton, mode === 'photo' && styles.modeButtonActive]}
            onPress={() => { setMode('photo'); setVisionEstimate(null); }}
          >
            <Text style={[styles.modeText, mode === 'photo' && styles.modeTextActive]}>
              📷 Photo
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.modeButton, mode === 'manual' && styles.modeButtonActive]}
            onPress={() => setMode('manual')}
          >
            <Text style={[styles.modeText, mode === 'manual' && styles.modeTextActive]}>
              ✏️ Manual
            </Text>
          </TouchableOpacity>
        </View>

        {mode === 'photo' ? (
          <View style={styles.photoSection}>
            <TouchableOpacity style={styles.photoButton} onPress={pickImage}>
              <Text style={styles.photoButtonIcon}>📷</Text>
              <Text style={styles.photoButtonText}>Take a photo of your food</Text>
            </TouchableOpacity>

            {photoUri && (
              <View style={styles.photoPreview}>
                <Text style={styles.photoPreviewText}>Photo captured ✓</Text>
              </View>
            )}

            {analyzing && (
              <View style={styles.analyzingContainer}>
                <ActivityIndicator size="large" color="#2563eb" />
                <Text style={styles.analyzingText}>Analyzing your food...</Text>
              </View>
            )}

            {visionEstimate && !analyzing && (
              <View style={styles.estimateCard}>
                <Text style={styles.estimateTitle}>
                  {visionEstimate.fallback ? '⚠️ Fallback Estimate' : '✨ AI Estimate'}
                </Text>
                <Text style={styles.estimateModel}>
                  Model: {visionEstimate.model}
                </Text>
                <Text style={styles.estimateConfidence}>
                  Confidence: {Math.round(visionEstimate.confidence * 100)}%
                </Text>
                {visionEstimate.notes && (
                  <Text style={styles.estimateNotes}>{visionEstimate.notes}</Text>
                )}
              </View>
            )}
          </View>
        ) : null}

        {/* Manual Input Fields */}
        <View style={styles.form}>
          <View style={styles.field}>
            <Text style={styles.label}>Description</Text>
            <TextInput
              style={styles.input}
              value={description}
              onChangeText={setDescription}
              placeholder="What did you eat?"
              placeholderTextColor="#9ca3af"
            />
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>Calories *</Text>
            <TextInput
              style={styles.input}
              value={calories}
              onChangeText={setCalories}
              placeholder="Total calories"
              placeholderTextColor="#9ca3af"
              keyboardType="numeric"
            />
          </View>

          <View style={styles.macroRow}>
            <View style={[styles.field, styles.macroField]}>
              <Text style={styles.label}>Protein (g)</Text>
              <TextInput
                style={styles.input}
                value={protein}
                onChangeText={setProtein}
                placeholder="0"
                placeholderTextColor="#9ca3af"
                keyboardType="decimal-pad"
              />
            </View>
            <View style={[styles.field, styles.macroField]}>
              <Text style={styles.label}>Carbs (g)</Text>
              <TextInput
                style={styles.input}
                value={carbs}
                onChangeText={setCarbs}
                placeholder="0"
                placeholderTextColor="#9ca3af"
                keyboardType="decimal-pad"
              />
            </View>
            <View style={[styles.field, styles.macroField]}>
              <Text style={styles.label}>Fat (g)</Text>
              <TextInput
                style={styles.input}
                value={fat}
                onChangeText={setFat}
                placeholder="0"
                placeholderTextColor="#9ca3af"
                keyboardType="decimal-pad"
              />
            </View>
          </View>

          <TouchableOpacity
            style={[styles.submitButton, loading && styles.submitButtonDisabled]}
            onPress={handleSubmit}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.submitButtonText}>Save Entry</Text>
            )}
          </TouchableOpacity>
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
  },
  modeToggle: {
    flexDirection: 'row',
    backgroundColor: '#e5e7eb',
    borderRadius: 12,
    padding: 4,
    marginBottom: 20,
  },
  modeButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 8,
  },
  modeButtonActive: {
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  modeText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6b7280',
  },
  modeTextActive: {
    color: '#1f2937',
    fontWeight: '600',
  },
  photoSection: {
    marginBottom: 20,
  },
  photoButton: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 32,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#d1d5db',
    borderStyle: 'dashed',
  },
  photoButtonIcon: {
    fontSize: 48,
    marginBottom: 8,
  },
  photoButtonText: {
    fontSize: 16,
    color: '#4b5563',
  },
  photoPreview: {
    backgroundColor: '#dcfce7',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
    marginTop: 12,
  },
  photoPreviewText: {
    color: '#15803d',
    fontWeight: '500',
  },
  analyzingContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  analyzingText: {
    marginTop: 12,
    fontSize: 14,
    color: '#6b7280',
  },
  estimateCard: {
    backgroundColor: '#eff6ff',
    borderRadius: 12,
    padding: 16,
    marginTop: 16,
  },
  estimateTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e40af',
    marginBottom: 8,
  },
  estimateModel: {
    fontSize: 12,
    color: '#6b7280',
    marginBottom: 4,
  },
  estimateConfidence: {
    fontSize: 12,
    color: '#6b7280',
  },
  estimateNotes: {
    fontSize: 12,
    color: '#6b7280',
    fontStyle: 'italic',
    marginTop: 8,
  },
  form: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  field: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#4b5563',
    marginBottom: 6,
  },
  input: {
    backgroundColor: '#f9fafb',
    borderRadius: 8,
    padding: 14,
    fontSize: 16,
    color: '#1f2937',
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  macroRow: {
    flexDirection: 'row',
    marginHorizontal: -6,
  },
  macroField: {
    flex: 1,
    marginHorizontal: 6,
  },
  submitButton: {
    backgroundColor: '#2563eb',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  submitButtonDisabled: {
    backgroundColor: '#93c5fd',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
})