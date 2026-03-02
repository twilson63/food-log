import { useQuery, useQueryClient } from '@tanstack/react-query';
import { api, keys } from '../api.js';
import { goals } from '../lib/storage.js';
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Edit2, Trash2, Plus, Coffee, Apple, Utensils, Cookie, X } from 'lucide-react';

// Quick-add presets
const QUICK_FOODS = [
  { name: '☕ Coffee', calories: 5, protein: 0, carbs: 0, fat: 0 },
  { name: '🥚 Eggs (2)', calories: 140, protein: 12, carbs: 1, fat: 10 },
  { name: '🥣 Oatmeal', calories: 150, protein: 5, carbs: 27, fat: 3 },
  { name: '🍌 Banana', calories: 105, protein: 1, carbs: 27, fat: 0 },
  { name: '🥗 Salad', calories: 120, protein: 3, carbs: 10, fat: 8 },
  { name: '🍗 Chicken', calories: 165, protein: 31, carbs: 0, fat: 4 },
  { name: '🍚 Rice', calories: 200, protein: 4, carbs: 45, fat: 0 },
  { name: '🍕 Pizza Slice', calories: 285, protein: 12, carbs: 36, fat: 10 },
];

export default function Dashboard() {
  const navigate = useNavigate();
  const { sessionId } = useParams();
  const basePath = sessionId ? `/s/${sessionId}` : '';
  const queryClient = useQueryClient();
  const [dailyGoals, setDailyGoals] = useState({ calories: 2000, protein: 150, carbs: 200, fat: 65 });
  const [showQuickAdd, setShowQuickAdd] = useState(false);
  const [addingFood, setAddingFood] = useState(null);
  
  // Load goals from storage
  useEffect(() => {
    goals.get().then(setDailyGoals);
  }, []);

  // Fetch today's entries
  const { data, isLoading, error } = useQuery({
    queryKey: keys.today,
    queryFn: api.getToday,
    refetchOnWindowFocus: false,
  });

  const entries = data?.entries || [];
  const totals = data?.totals || { calories: 0, protein: 0, carbs: 0, fat: 0 };

  // Calculate percentages
  const caloriePercent = Math.min(100, Math.round((totals.calories / dailyGoals.calories) * 100));
  const proteinPercent = Math.min(100, Math.round((totals.protein / dailyGoals.protein) * 100));
  const carbsPercent = Math.min(100, Math.round((totals.carbs / dailyGoals.carbs) * 100));
  const fatPercent = Math.min(100, Math.round((totals.fat / dailyGoals.fat) * 100));

  // Quick add handler
  const handleQuickAdd = async (food) => {
    setAddingFood(food.name);
    try {
      await api.createEntry({
        description: food.name,
        calories: food.calories,
        protein: food.protein,
        carbs: food.carbs,
        fat: food.fat,
      });
      queryClient.invalidateQueries({ queryKey: keys.today });
    } catch (err) {
      alert('Failed to add entry');
    }
    setAddingFood(null);
    setShowQuickAdd(false);
  };

  // Delete entry
  const handleDelete = async (id) => {
    if (confirm('Delete this entry?')) {
      await api.deleteEntry(id);
      queryClient.invalidateQueries({ queryKey: keys.today });
    }
  };

  // Format time
  const formatTime = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-400">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 text-red-600 rounded-xl">
        Error loading entries. Please try again.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Today</h1>
        <p className="text-gray-500 dark:text-gray-400">
          {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
        </p>
      </div>

      {/* Calorie Display */}
      <div className="card p-6">
        <div className="text-center">
          <div className="text-5xl font-bold text-primary-600 dark:text-primary-400">{totals.calories}</div>
          <div className="text-gray-500 dark:text-gray-400 mt-1">/ {dailyGoals.calories} calories</div>
          <div className="mt-4">
            <div className="h-3 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-primary-500 to-primary-400 rounded-full transition-all duration-500"
                style={{ width: `${caloriePercent}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Macros Grid */}
      <div className="grid grid-cols-3 gap-3">
        <div className="card p-4 text-center">
          <div className="text-2xl font-bold text-primary-600 dark:text-primary-400">{totals.protein}g</div>
          <div className="text-xs text-gray-500 dark:text-gray-400">Protein</div>
          <div className="mt-2 h-1.5 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
            <div 
              className="h-full bg-primary-500 rounded-full transition-all duration-300"
              style={{ width: `${proteinPercent}%` }}
            />
          </div>
        </div>
        <div className="card p-4 text-center">
          <div className="text-2xl font-bold text-accent-600 dark:text-accent-400">{totals.carbs}g</div>
          <div className="text-xs text-gray-500 dark:text-gray-400">Carbs</div>
          <div className="mt-2 h-1.5 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
            <div 
              className="h-full bg-accent-500 rounded-full transition-all duration-300"
              style={{ width: `${carbsPercent}%` }}
            />
          </div>
        </div>
        <div className="card p-4 text-center">
          <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{totals.fat}g</div>
          <div className="text-xs text-gray-500 dark:text-gray-400">Fat</div>
          <div className="mt-2 h-1.5 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
            <div 
              className="h-full bg-blue-500 rounded-full transition-all duration-300"
              style={{ width: `${fatPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Quick Add Section */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Quick Add</h2>
          <button 
            onClick={() => navigate(`${basePath}/add`)}
            className="text-sm text-primary-600 dark:text-primary-400 font-medium"
          >
            + Custom
          </button>
        </div>
        
        <div className="grid grid-cols-4 gap-2">
          {QUICK_FOODS.slice(0, 4).map((food) => (
            <button
              key={food.name}
              onClick={() => handleQuickAdd(food)}
              disabled={addingFood === food.name}
              className="card p-3 text-center hover:shadow-md transition-all active:scale-95 disabled:opacity-50"
            >
              <div className="text-lg mb-1">{food.name.split(' ')[0]}</div>
              <div className="text-xs text-gray-500 dark:text-gray-400">{food.calories} cal</div>
            </button>
          ))}
        </div>
        
        <button
          onClick={() => setShowQuickAdd(!showQuickAdd)}
          className="w-full py-2 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
        >
          {showQuickAdd ? 'Show less' : 'Show more options'}
        </button>
        
        {showQuickAdd && (
          <div className="grid grid-cols-2 gap-2">
            {QUICK_FOODS.slice(4).map((food) => (
              <button
                key={food.name}
                onClick={() => handleQuickAdd(food)}
                disabled={addingFood === food.name}
                className="card p-3 flex items-center gap-3 hover:shadow-md transition-all active:scale-95 disabled:opacity-50 text-left"
              >
                <span className="text-xl">{food.name.split(' ')[0]}</span>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-gray-900 dark:text-white truncate">{food.name.split(' ').slice(1).join(' ')}</div>
                  <div className="text-xs text-gray-500">{food.calories} cal • {food.protein}p</div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Entries List */}
      <div className="space-y-3">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Today's Entries</h2>
        
        {entries.length === 0 ? (
          <div className="card p-8 text-center">
            <div className="text-4xl mb-3">🍽️</div>
            <p className="text-gray-500 dark:text-gray-400">No food logged yet today</p>
            <button 
              onClick={() => navigate(`${basePath}/add`)}
              className="mt-4 btn-primary px-6 py-2"
            >
              Add Your First Meal
            </button>
          </div>
        ) : (
          entries.map((entry) => (
            <div key={entry.id} className="card p-4 flex items-start gap-4">
              {entry.photo ? (
                <img 
                  src={entry.photo} 
                  alt={entry.description}
                  className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
                />
              ) : (
                <div className="w-16 h-16 rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-center flex-shrink-0">
                  <span className="text-2xl">🍽️</span>
                </div>
              )}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="font-medium text-gray-900 dark:text-white truncate">
                      {entry.description || 'Food entry'}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {entry.calories} cal • {entry.protein}p / {entry.carbs}c / {entry.fat}f
                    </div>
                    {entry.confidence && (
                      <div className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                        AI confidence: {Math.round(entry.confidence * 100)}%
                      </div>
                    )}
                  </div>
                  <div className="flex gap-1">
                    <button
                      onClick={() => navigate(`${basePath}/edit/${entry.id}`)}
                      className="p-1.5 text-gray-400 hover:text-primary-500 transition-colors"
                      title="Edit entry"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(entry.id)}
                      className="p-1.5 text-gray-400 hover:text-red-500 transition-colors"
                      title="Delete entry"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <div className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                  {formatTime(entry.createdAt)}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}