import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api, keys } from '../api.js';
import { ArrowLeft, Trash2, Save } from 'lucide-react';

export default function EditEntry() {
  const navigate = useNavigate();
  const { sessionId, entryId } = useParams();
  const basePath = sessionId ? `/s/${sessionId}` : '';
  const queryClient = useQueryClient();
  
  const [formData, setFormData] = useState({
    description: '',
    calories: '',
    protein: '',
    carbs: '',
    fat: '',
  });

  // Fetch entry data
  const { data: entry, isLoading, error } = useQuery({
    queryKey: ['entry', entryId],
    queryFn: () => api.entries.get(entryId),
    enabled: !!entryId,
  });

  // Populate form when entry loads
  useEffect(() => {
    if (entry) {
      setFormData({
        description: entry.description || '',
        calories: entry.calories?.toString() || '',
        protein: entry.protein?.toString() || '',
        carbs: entry.carbs?.toString() || '',
        fat: entry.fat?.toString() || '',
      });
    }
  }, [entry]);

  // Update entry mutation
  const updateMutation = useMutation({
    mutationFn: (data) => api.updateEntry(entryId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: keys.today });
      navigate(`${basePath}/`);
    },
    onError: (err) => {
      alert('Failed to update entry: ' + err.message);
    },
  });

  // Delete entry
  const handleDelete = async () => {
    if (confirm('Delete this entry? This cannot be undone.')) {
      await api.deleteEntry(entryId);
      queryClient.invalidateQueries({ queryKey: keys.today });
      navigate(`${basePath}/`);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    updateMutation.mutate({
      description: formData.description,
      calories: parseInt(formData.calories) || 0,
      protein: parseFloat(formData.protein) || 0,
      carbs: parseFloat(formData.carbs) || 0,
      fat: parseFloat(formData.fat) || 0,
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-pulse text-gray-400">Loading entry...</div>
      </div>
    );
  }

  if (error || !entry) {
    return (
      <div className="p-4 text-center">
        <p className="text-red-500 mb-4">Entry not found</p>
        <button onClick={() => navigate(`${basePath}/`)} className="btn-secondary">
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate(`${basePath}/`)}
          className="p-2 -ml-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Edit Entry</h1>
      </div>

      {/* Photo Preview */}
      {entry.photo && (
        <img 
          src={entry.photo} 
          alt={entry.description}
          className="w-full rounded-xl max-h-64 object-cover"
        />
      )}

      {/* Edit Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm text-gray-500 dark:text-gray-400 mb-1">
            Description
          </label>
          <input
            type="text"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="What did you eat?"
            className="input w-full"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-gray-500 dark:text-gray-400 mb-1">
              Calories
            </label>
            <input
              type="number"
              value={formData.calories}
              onChange={(e) => setFormData({ ...formData, calories: e.target.value })}
              className="input w-full"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-500 dark:text-gray-400 mb-1">
              Protein (g)
            </label>
            <input
              type="number"
              step="0.1"
              value={formData.protein}
              onChange={(e) => setFormData({ ...formData, protein: e.target.value })}
              className="input w-full"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-500 dark:text-gray-400 mb-1">
              Carbs (g)
            </label>
            <input
              type="number"
              step="0.1"
              value={formData.carbs}
              onChange={(e) => setFormData({ ...formData, carbs: e.target.value })}
              className="input w-full"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-500 dark:text-gray-400 mb-1">
              Fat (g)
            </label>
            <input
              type="number"
              step="0.1"
              value={formData.fat}
              onChange={(e) => setFormData({ ...formData, fat: e.target.value })}
              className="input w-full"
            />
          </div>
        </div>

        {/* Time stamp */}
        <div className="text-sm text-gray-400 dark:text-gray-500">
          Logged at {new Date(entry.createdAt).toLocaleString()}
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-4">
          <button
            type="button"
            onClick={handleDelete}
            className="flex-1 btn bg-red-50 text-red-600 hover:bg-red-100 dark:bg-red-900/20 dark:text-red-400 dark:hover:bg-red-900/30"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Delete
          </button>
          <button
            type="submit"
            disabled={updateMutation.isPending}
            className="flex-1 btn-primary"
          >
            {updateMutation.isPending ? (
              'Saving...'
            ) : (
              <>
                <Save className="w-4 h-4 mr-2 inline" />
                Save Changes
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}