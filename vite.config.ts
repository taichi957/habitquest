import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',

      workbox: {
        maximumFileSizeToCacheInBytes: 5 * 1024 * 1024 // 5MB
      },

      manifest: {
        name: 'HabitQuest',
        short_name: 'HabitQuest',
        start_url: '/',
        display: 'standalone',
        background_color: '#020617',
        theme_color: '#1e293b',
        icons: [
          { src: '/vite.svg', sizes: '192x192', type: 'image/png' },
          { src: '/vite.svg', sizes: '512x512', type: 'image/png' }
        ]
      }
    })
  ]
})
