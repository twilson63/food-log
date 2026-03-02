import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Railway production build config
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    sourcemap: false,
  },
  // Use relative paths for assets
  base: './',
})