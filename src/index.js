import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { logger } from 'hono/logger'
import entriesRoutes from './routes/entries.js'
import barcodeRoutes from './routes/barcode.js'
import { visionService } from './services/vision.js'

const app = new Hono()

// Middleware
app.use('*', logger())
// CORS configuration - allow all origins in development, specific origins in production
const corsOrigins = process.env.CORS_ORIGINS 
  ? process.env.CORS_ORIGINS.split(',').map(o => o.trim())
  : ['*'] // Allow all in development

app.use('*', cors({
  origin: '*',
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization']
}))

// Health check
app.get('/', (c) => c.json({ 
  status: 'ok', 
  service: 'food-log-api',
  version: '1.0.0'
}))
app.get('/health', (c) => {
  const visionStatus = visionService.getStatus()
  return c.json({ 
    status: 'healthy',
    database: 'sqlite',
    vision: {
      configured: visionStatus.configured,
      model: visionStatus.model,
      provider: visionStatus.provider
    }
  })
})

// Vision endpoints
app.post('/vision/analyze', async (c) => {
  try {
    const body = await c.req.json()
    
    if (!body.photo && !body.photoUrl) {
      return c.json({ error: 'photo or photoUrl required' }, 400)
    }
    
    const result = await visionService.estimateNutrition({
      photo: body.photo,
      photoUrl: body.photoUrl
    })
    
    return c.json({ estimate: result })
  } catch (err) {
    console.error('Vision analysis error:', err)
    return c.json({ error: err.message }, 500)
  }
})

app.get('/vision/status', (c) => c.json(visionService.getStatus()))

// Routes
app.route('/entries', entriesRoutes)
app.route('/barcode', barcodeRoutes)

// 404 handler
app.notFound((c) => c.json({ error: 'Not found' }, 404))

// Error handler
app.onError((err, c) => {
  console.error('Server error:', err)
  return c.json({ error: 'Internal server error' }, 500)
})

const port = parseInt(process.env.PORT || '3001')
console.log(`🍳 FoodLog API running on http://localhost:${port}`)

serve({
  fetch: app.fetch,
  port
})