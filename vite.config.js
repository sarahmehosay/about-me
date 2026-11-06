import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// VITE_BASE sets the public path, e.g. "/about-me/" when hosted on GitHub Pages.
export default defineConfig({
  base: process.env.VITE_BASE || '/',
  plugins: [react()],
  // Unit tests: `npm test` (run once) or `npm run test:watch`.
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.js'],
    include: ['src/**/*.test.{js,jsx}'],
    css: false,
    coverage: {
      provider: 'v8',
      include: ['src/**/*.{js,jsx}'],
      exclude: ['src/test/**', 'src/main.jsx'],
      reporter: ['text'],
    },
  },
})
