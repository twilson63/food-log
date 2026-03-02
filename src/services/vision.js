/**
 * Vision Service - Food Nutrition Estimation
 * 
 * Supports OpenAI API or OpenRouter for vision models.
 * Set OPENAI_API_KEY or OPENROUTER_API_KEY in environment.
 */

// Configuration
const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';
const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions';

// Detect which provider to use
function getProvider() {
  if (process.env.OPENROUTER_API_KEY) {
    return {
      type: 'openrouter',
      apiKey: process.env.OPENROUTER_API_KEY,
      apiUrl: OPENROUTER_API_URL,
      model: process.env.OPENROUTER_MODEL || 'openai/gpt-4o-mini'
    };
  }
  if (process.env.OPENAI_API_KEY) {
    return {
      type: 'openai',
      apiKey: process.env.OPENAI_API_KEY,
      apiUrl: OPENAI_API_URL,
      model: process.env.OPENAI_MODEL || 'gpt-4o-mini'
    };
  }
  return null;
}

// Nutrition estimation prompt
const NUTRITION_PROMPT = `You are a nutrition expert. Analyze this food image and estimate:

1. What food/drinks are shown (be specific with portions)
2. Estimated calories (total for everything visible)
3. Estimated protein in grams
4. Estimated carbs in grams
5. Estimated fat in grams
6. Your confidence level (0-1)

Respond as JSON:
{
  "description": "Grilled chicken breast (4oz) with steamed broccoli (1 cup) and brown rice (1/2 cup)",
  "calories": 450,
  "protein": 35,
  "carbs": 40,
  "fat": 15,
  "confidence": 0.85
}

If you can't identify the food or it's not food, still respond with your best estimate and lower confidence.`;

/**
 * Estimate nutrition from an image
 * @param {string} imageSource - Base64 data URL or URL to image
 * @returns {Promise<Object>} Nutrition estimate
 */
export async function estimateNutrition(imageSource) {
  const provider = getProvider();
  
  // If no API key, return mock estimate
  if (!provider) {
    return getMockEstimate();
  }

  try {
    // Determine image format for API
    let imageContent;
    if (imageSource.startsWith('data:')) {
      // Base64 data URL
      imageContent = {
        type: 'image_url',
        image_url: {
          url: imageSource
        }
      };
    } else if (imageSource.startsWith('http')) {
      // URL
      imageContent = {
        type: 'image_url',
        image_url: {
          url: imageSource
        }
      };
    } else {
      // Assume it's raw base64, wrap it
      imageContent = {
        type: 'image_url',
        image_url: {
          url: `data:image/jpeg;base64,${imageSource}`
        }
      };
    }

    const response = await fetch(provider.apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${provider.apiKey}`,
        ...(provider.type === 'openrouter' && {
          'HTTP-Referer': 'https://foodlog.app',
          'X-Title': 'FoodLog'
        })
      },
      body: JSON.stringify({
        model: provider.model,
        messages: [
          {
            role: 'user',
            content: [
              { type: 'text', text: NUTRITION_PROMPT },
              imageContent
            ]
          }
        ],
        max_tokens: 500,
        temperature: 0.3
      })
    });

    if (!response.ok) {
      console.error('Vision API error:', response.status, await response.text());
      return getMockEstimate();
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;
    
    if (!content) {
      return getMockEstimate();
    }

    // Parse JSON from response
    try {
      // Handle markdown code blocks
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      return JSON.parse(content);
    } catch {
      console.error('Failed to parse vision response:', content);
      return getMockEstimate();
    }
  } catch (error) {
    console.error('Vision estimation error:', error);
    return getMockEstimate();
  }
}

/**
 * Get mock nutrition estimate (for development/testing)
 */
function getMockEstimate() {
  const foods = [
    { description: 'Grilled chicken salad', calories: 350, protein: 35, carbs: 15, fat: 18, confidence: 0.7 },
    { description: 'Pasta with marinara sauce', calories: 420, protein: 14, carbs: 72, fat: 8, confidence: 0.65 },
    { description: 'Avocado toast with egg', calories: 380, protein: 16, carbs: 28, fat: 24, confidence: 0.75 },
    { description: 'Smoothie bowl', calories: 290, protein: 12, carbs: 52, fat: 8, confidence: 0.68 },
    { description: 'Burger with fries', calories: 850, protein: 42, carbs: 65, fat: 45, confidence: 0.72 }
  ];
  
  return foods[Math.floor(Math.random() * foods.length)];
}

/**
 * Get provider status
 */
export function getStatus() {
  const provider = getProvider();
  return {
    configured: !!provider,
    provider: provider?.type || 'none',
    model: provider?.model || 'mock'
  };
}

/**
 * Vision service object for convenient imports
 */
export const visionService = {
  estimateNutrition,
  getStatus
};