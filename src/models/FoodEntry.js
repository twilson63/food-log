/**
 * FoodEntry model representing a single food log entry
 */
export class FoodEntry {
  constructor(data) {
    this.id = data.id
    this.photo = data.photo || null
    this.photoUrl = data.photoUrl || null
    this.description = data.description || null
    this.calories = data.calories ?? null
    this.protein = data.protein ?? null
    this.carbs = data.carbs ?? null
    this.fat = data.fat ?? null
    this.timestamp = data.timestamp || new Date()
    this.estimated = data.estimated || false
    this.createdAt = new Date()
    this.updatedAt = new Date()
  }

  toJSON() {
    return {
      id: this.id,
      photo: this.photo,
      photoUrl: this.photoUrl,
      description: this.description,
      calories: this.calories,
      protein: this.protein,
      carbs: this.carbs,
      fat: this.fat,
      timestamp: this.timestamp.toISOString(),
      estimated: this.estimated,
      createdAt: this.createdAt.toISOString(),
      updatedAt: this.updatedAt.toISOString()
    }
  }

  /**
   * Calculate macros percentage
   */
  getMacroPercentages() {
    if (!this.calories) return null

    // 4 cal per gram protein/carbs, 9 cal per gram fat
    const proteinCal = (this.protein || 0) * 4
    const carbsCal = (this.carbs || 0) * 4
    const fatCal = (this.fat || 0) * 9

    const macrosCal = proteinCal + carbsCal + fatCal
    
    if (macrosCal === 0) return null

    return {
      protein: Math.round((proteinCal / macrosCal) * 100),
      carbs: Math.round((carbsCal / macrosCal) * 100),
      fat: Math.round((fatCal / macrosCal) * 100)
    }
  }

  /**
   * Update entry with new data
   */
  update(data) {
    if (data.description !== undefined) this.description = data.description
    if (data.calories !== undefined) this.calories = data.calories
    if (data.protein !== undefined) this.protein = data.protein
    if (data.carbs !== undefined) this.carbs = data.carbs
    if (data.fat !== undefined) this.fat = data.fat
    this.updatedAt = new Date()
    return this
  }
}