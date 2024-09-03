/// <reference types="vitest" />

import legacy from '@vitejs/plugin-legacy'
import vue from '@vitejs/plugin-vue'
import path from 'path'
import { defineConfig } from 'vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    legacy()
  ],
  build: {
    rollupOptions: {
    },
    // commonjsOptions: {
    //   include: ['/jspdf/', '/node_modules/']
    // }
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  optimizeDeps: {
    include: ['jspdf']
  },
  test: {
    globals: true,
    environment: 'jsdom'
  }
})
