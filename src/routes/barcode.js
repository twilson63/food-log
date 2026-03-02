import { Hono } from 'hono'
import { lookupBarcode, getStatus } from '../services/barcode.js'

const barcode = new Hono()

/**
 * GET /barcode/status - Check barcode service status
 */
barcode.get('/status', (c) => {
  const status = getStatus()
  return c.json({ status: 'ok', ...status })
})

/**
 * POST /barcode/lookup - Look up nutrition from a barcode
 */
barcode.post('/lookup', async (c) => {
  const body = await c.req.json().catch(() => ({}))
  const { barcode: code } = body

  if (!code) {
    return c.json({ 
      error: 'Barcode required',
      fallback: true 
    }, 400)
  }

  const result = await lookupBarcode(code)
  
  if (result.error && !result.description) {
    return c.json(result, 404)
  }

  return c.json(result)
})

/**
 * GET /barcode/lookup/:code - Quick lookup by barcode in URL
 */
barcode.get('/lookup/:code', async (c) => {
  const code = c.req.param('code')
  
  if (!code) {
    return c.json({ 
      error: 'Barcode required',
      fallback: true 
    }, 400)
  }

  const result = await lookupBarcode(code)
  
  if (result.error && !result.description) {
    return c.json(result, 404)
  }

  return c.json(result)
})

export default barcode