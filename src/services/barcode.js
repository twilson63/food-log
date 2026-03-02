/**
 * Barcode Service - Lookup nutrition info from barcodes
 * 
 * Uses Open Food Facts API (free, no API key required)
 * https://world.openfoodfacts.org/api/v2
 */

const OFF_API_URL = 'https://world.openfoodfacts.org/api/v2/product'

/**
 * Look up nutrition info by barcode
 * @param {string} barcode - UPC/EAN barcode number
 * @returns {Promise<Object>} Product info with nutrition
 */
export async function lookupBarcode(barcode) {
  if (!barcode) {
    return { error: 'No barcode provided', fallback: true }
  }

  try {
    const response = await fetch(`${OFF_API_URL}/${barcode}?fields=product_name,brands,nutriments,image_front_small_url,serving_size,quantity`, {
      headers: {
        'User-Agent': 'FoodLog App - https://github.com/foodlog/app'
      }
    })

    if (!response.ok) {
      console.error('Open Food Facts API error:', response.status)
      return { error: 'API error', fallback: true }
    }

    const data = await response.json()

    if (data.status !== 1 || !data.product) {
      return { 
        error: 'Product not found in database',
        barcode,
        fallback: true 
      }
    }

    const product = data.product
    const nutriments = product.nutriments || {}

    // Extract nutrition data per 100g
    const nutrition = {
      barcode,
      description: product.product_name || 'Unknown Product',
      brand: product.brands || '',
      imageUrl: product.image_front_small_url || '',
      servingSize: product.serving_size || product.quantity || '',
      calories: nutriments['energy-kcal_100g'] || nutriments['energy-kcal'] || 0,
      protein: nutriments.proteins_100g || nutriments.proteins || 0,
      carbs: nutriments.carbohydrates_100g || nutriments.carbohydrates || 0,
      fat: nutriments.fat_100g || nutriments.fat || 0,
      fiber: nutriments.fiber_100g || 0,
      sugar: nutriments.sugars_100g || 0,
      sodium: nutriments.sodium_100g || 0,
      confidence: 0.9, // High confidence for packaged food
      source: 'openfoodfacts'
    }

    return nutrition
  } catch (error) {
    console.error('Barcode lookup error:', error)
    return { 
      error: error.message || 'Lookup failed',
      barcode,
      fallback: true 
    }
  }
}

/**
 * Get barcode service status
 */
export function getStatus() {
  return {
    available: true,
    provider: 'Open Food Facts',
    api: 'https://world.openfoodfacts.org/api/v2'
  }
}

export const barcodeService = {
  lookupBarcode,
  getStatus
}