import { useState, useRef } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { api, keys } from '../api'
import { Camera, Upload, Loader2, Check, X, Edit2, RefreshCw, Utensils, FileText } from 'lucide-react'

export default function AddFood() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const fileInputRef = useRef(null)
  const cameraInputRef = useRef(null)

  const [mode, setMode] = useState('photo') // 'photo' or 'manual'
  const [step, setStep] = useState('select') // select, preview, edit, success
  const [photo, setPhoto] = useState(null)
  const [preview, setPreview] = useState(null)
  const [editData, setEditData] = useState({
    description: '',
    calories: '',
    protein: '',
    carbs: '',
    fat: '',
  })

  // Analyze photo mutation
  const analyzeMutation = useMutation({
    mutationFn: async (photoData) => {
      // Create entry with photo - backend will analyze
      const result = await api.createEntry({ photo: photoData })
      return result
    },
    onSuccess: (data) => {
      setEditData({
        description: data.visionEstimate?.description || data.entry.description || '',
        calories: data.entry.calories?.toString() || '',
        protein: data.entry.protein?.toString() || '',
        carbs: data.entry.carbs?.toString() || '',
        fat: data.entry.fat?.toString() || '',
      })
      setStep('edit')
    },
    onError: (err) => {
      alert('Failed to analyze photo: ' + err.message)
      setStep('select')
    },
  })

  // Create entry mutation
  const createMutation = useMutation({
    mutationFn: async (data) => {
      return api.createEntry(data)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: keys.today })
      setStep('success')
    },
    onError: (err) => {
      alert('Failed to create entry: ' + err.message)
    },
  })

  // Update entry mutation
  const updateMutation = useMutation({
    mutationFn: async ({ id, data }) => {
      return api.updateEntry(id, data)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: keys.today })
      setStep('success')
    },
  })

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Create preview
    const reader = new FileReader()
    reader.onload = (e) => {
      const dataUrl = e.target.result
      setPreview(dataUrl)

      // Get base64 without prefix
      const base64 = dataUrl.split(',')[1]
      setPhoto(base64)
      setStep('preview')
    }
    reader.readAsDataURL(file)
  }

  const handleAnalyze = () => {
    if (!photo) return
    analyzeMutation.mutate(photo)
  }

  const handleManualSave = () => {
    if (!editData.description.trim()) {
      alert('Please enter a description')
      return
    }
    createMutation.mutate({
      description: editData.description,
      calories: editData.calories ? parseInt(editData.calories) : null,
      protein: editData.protein ? parseFloat(editData.protein) : null,
      carbs: editData.carbs ? parseFloat(editData.carbs) : null,
      fat: editData.fat ? parseFloat(editData.fat) : null,
    })
  }

  const handleEditSave = () => {
    if (analyzeMutation.data?.entry?.id) {
      updateMutation.mutate({
        id: analyzeMutation.data.entry.id,
        data: {
          description: editData.description,
          calories: editData.calories ? parseInt(editData.calories) : null,
          protein: editData.protein ? parseFloat(editData.protein) : null,
          carbs: editData.carbs ? parseFloat(editData.carbs) : null,
          fat: editData.fat ? parseFloat(editData.fat) : null,
        },
      })
    }
  }

  const handleNewEntry = () => {
    setStep('select')
    setPhoto(null)
    setPreview(null)
    setEditData({ description: '', calories: '', protein: '', carbs: '', fat: '' })
    analyzeMutation.reset()
    updateMutation.reset()
    createMutation.reset()
  }

  const handleViewToday = () => {
    navigate('/')
  }

  const resetForm = () => {
    setStep('select')
    setPhoto(null)
    setPreview(null)
    setEditData({ description: '', calories: '', protein: '', carbs: '', fat: '' })
    analyzeMutation.reset()
    updateMutation.reset()
    createMutation.reset()
  }

  // Success screen
  if (step === 'success') {
    return (
      <div className="max-w-lg mx-auto px-4 pt-20">
        <div className="text-center">
          <div className="w-20 h-20 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
            <Check className="w-10 h-10 text-primary-500" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            Entry Saved!
          </h2>
          <p className="text-gray-500 dark:text-gray-400 mb-6">
            Your food has been logged successfully
          </p>
          <div className="flex gap-3 justify-center">
            <button onClick={handleNewEntry} className="btn-secondary px-6 py-3">
              <RefreshCw className="w-5 h-5 mr-2" />
              Add Another
            </button>
            <button onClick={handleViewToday} className="btn-primary px-6 py-3">
              View Today
            </button>
          </div>
        </div>
      </div>
    )
  }

  // Mode selector component
  const ModeSelector = () => (
    <div className="flex bg-gray-100 dark:bg-gray-700 rounded-xl p-1 mb-6">
      <button
        onClick={() => { setMode('photo'); resetForm(); }}
        className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg transition-all ${
          mode === 'photo' 
            ? 'bg-white dark:bg-gray-600 shadow-sm text-gray-900 dark:text-gray-100' 
            : 'text-gray-500 dark:text-gray-400'
        }`}
      >
        <Camera className="w-4 h-4" />
        <span className="text-sm font-medium">Photo</span>
      </button>
      <button
        onClick={() => { setMode('manual'); resetForm(); }}
        className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg transition-all ${
          mode === 'manual' 
            ? 'bg-white dark:bg-gray-600 shadow-sm text-gray-900 dark:text-gray-100' 
            : 'text-gray-500 dark:text-gray-400'
        }`}
      >
        <FileText className="w-4 h-4" />
        <span className="text-sm font-medium">Manual</span>
      </button>
    </div>
  )

  // Manual entry form
  if (mode === 'manual') {
    return (
      <div className="max-w-lg mx-auto px-4 pt-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
          Add Food
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mb-4">
          Enter your meal details manually
        </p>

        <ModeSelector />

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Description *
            </label>
            <input
              type="text"
              value={editData.description}
              onChange={(e) => setEditData({ ...editData, description: e.target.value })}
              className="input"
              placeholder="What did you eat?"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Calories
            </label>
            <input
              type="number"
              value={editData.calories}
              onChange={(e) => setEditData({ ...editData, calories: e.target.value })}
              className="input"
              placeholder="0"
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Protein (g)
              </label>
              <input
                type="number"
                step="0.1"
                value={editData.protein}
                onChange={(e) => setEditData({ ...editData, protein: e.target.value })}
                className="input"
                placeholder="0"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Carbs (g)
              </label>
              <input
                type="number"
                step="0.1"
                value={editData.carbs}
                onChange={(e) => setEditData({ ...editData, carbs: e.target.value })}
                className="input"
                placeholder="0"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Fat (g)
              </label>
              <input
                type="number"
                step="0.1"
                value={editData.fat}
                onChange={(e) => setEditData({ ...editData, fat: e.target.value })}
                className="input"
                placeholder="0"
              />
            </div>
          </div>

          <button
            onClick={handleManualSave}
            disabled={createMutation.isPending || !editData.description.trim()}
            className="btn-primary w-full py-4 text-lg"
          >
            {createMutation.isPending ? (
              <>
                <Loader2 className="w-6 h-6 animate-spin mr-2" />
                Saving...
              </>
            ) : (
              <>
                <Utensils className="w-5 h-5 mr-2" />
                Log Food
              </>
            )}
          </button>
        </div>
      </div>
    )
  }

  // Photo mode - Edit screen
  if (step === 'edit') {
    return (
      <div className="max-w-lg mx-auto px-4 pt-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
          Edit Entry
        </h1>

        <ModeSelector />

        {preview && (
          <div className="mb-4">
            <img
              src={preview}
              alt="Food"
              className="w-full h-48 object-cover rounded-2xl"
            />
          </div>
        )}

        {analyzeMutation.data?.visionEstimate && (
          <div className="card p-3 mb-4 bg-primary-50 dark:bg-primary-900/20 border-primary-200 dark:border-primary-800">
            <div className="flex items-center gap-2 text-primary-700 dark:text-primary-300 text-sm">
              <span className="font-medium">AI Confidence:</span>
              <span>{Math.round(analyzeMutation.data.visionEstimate.confidence * 100)}%</span>
              <span className="ml-auto text-xs text-primary-600 dark:text-primary-400">
                {analyzeMutation.data.visionEstimate.model}
              </span>
            </div>
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Description
            </label>
            <input
              type="text"
              value={editData.description}
              onChange={(e) => setEditData({ ...editData, description: e.target.value })}
              className="input"
              placeholder="What did you eat?"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Calories
              </label>
              <input
                type="number"
                value={editData.calories}
                onChange={(e) => setEditData({ ...editData, calories: e.target.value })}
                className="input"
                placeholder="0"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Protein (g)
              </label>
              <input
                type="number"
                step="0.1"
                value={editData.protein}
                onChange={(e) => setEditData({ ...editData, protein: e.target.value })}
                className="input"
                placeholder="0"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Carbs (g)
              </label>
              <input
                type="number"
                step="0.1"
                value={editData.carbs}
                onChange={(e) => setEditData({ ...editData, carbs: e.target.value })}
                className="input"
                placeholder="0"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Fat (g)
              </label>
              <input
                type="number"
                step="0.1"
                value={editData.fat}
                onChange={(e) => setEditData({ ...editData, fat: e.target.value })}
                className="input"
                placeholder="0"
              />
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              onClick={() => setStep('select')}
              className="btn-secondary flex-1 py-3"
            >
              Cancel
            </button>
            <button
              onClick={handleEditSave}
              disabled={updateMutation.isPending}
              className="btn-primary flex-1 py-3"
            >
              {updateMutation.isPending ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  <Check className="w-5 h-5 mr-2" />
                  Save Entry
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    )
  }

  // Photo mode - Preview screen
  if (step === 'preview') {
    return (
      <div className="max-w-lg mx-auto px-4 pt-6">
        <div className="relative">
          <img
            src={preview}
            alt="Food preview"
            className="w-full h-80 object-cover rounded-2xl shadow-lg"
          />
          <button
            onClick={() => setStep('select')}
            className="absolute top-4 right-4 p-2 bg-black/50 hover:bg-black/70 rounded-full text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mt-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            Ready to analyze with AI
          </p>
          <button
            onClick={handleAnalyze}
            disabled={analyzeMutation.isPending}
            className="btn-primary w-full py-4 text-lg"
          >
            {analyzeMutation.isPending ? (
              <>
                <Loader2 className="w-6 h-6 animate-spin mr-2" />
                Analyzing...
              </>
            ) : (
              <>
                <Edit2 className="w-5 h-5 mr-2" />
                Analyze & Edit
              </>
            )}
          </button>
        </div>
      </div>
    )
  }

  // Photo mode - Select screen (default)
  return (
    <div className="max-w-lg mx-auto px-4 pt-10">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2 text-center">
        Add Food
      </h1>
      <p className="text-gray-500 dark:text-gray-400 text-center mb-4">
        Take a photo or enter manually
      </p>

      <ModeSelector />

      <div className="space-y-4">
        {/* Camera Button */}
        <button
          onClick={() => cameraInputRef.current?.click()}
          className="w-full card p-6 text-center hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
        >
          <div className="w-14 h-14 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center mx-auto mb-3">
            <Camera className="w-7 h-7 text-primary-500" />
          </div>
          <span className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            Take a Photo
          </span>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Use your camera to capture a meal
          </p>
        </button>

        {/* Gallery Button */}
        <button
          onClick={() => fileInputRef.current?.click()}
          className="w-full card p-6 text-center hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
        >
          <div className="w-14 h-14 bg-accent-100 dark:bg-accent-900/30 rounded-full flex items-center justify-center mx-auto mb-3">
            <Upload className="w-7 h-7 text-accent-500" />
          </div>
          <span className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            Upload from Gallery
          </span>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Choose an existing photo
          </p>
        </button>

        {/* Hidden inputs */}
        <input
          ref={cameraInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          onChange={handleFileSelect}
          className="hidden"
        />
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
        />
      </div>
    </div>
  )
}