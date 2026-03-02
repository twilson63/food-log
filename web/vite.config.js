import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { viteSingleFile } from 'vite-plugin-singlefile'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    viteSingleFile()
  ],
  // Base path for GitHub Pages deployment
  // Set to repo name for gh-pages, or '/' for custom domain
  base: process.env.GITHUB_PAGES ? '/foodlog/' : '/',
  build: {
    outDir: 'dist',
    sourcemap: false,
    // Single file output - no chunking
    cssCodeSplit: false,
    assetsInlineLimit: 10000000, // Inline all assets
  },
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
})