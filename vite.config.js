import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// VITE_BASE sets the public path, e.g. "/about-me/" when hosted on GitHub Pages.
export default defineConfig({
  base: process.env.VITE_BASE || '/',
  plugins: [react()],
})
