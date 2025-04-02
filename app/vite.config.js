import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'

// https://vite.dev/config/
export default defineConfig({
  plugins: [svelte()],
  test: {
    global: true,
    environment: 'jsdom',
    setupFiles: ['./src/setupTests.js'],
  }
})
