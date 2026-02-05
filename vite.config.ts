import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',

      workbox: {
    globIgnores: [
      '**/*.png',
      '**/*.jpg',
      '**/*.jpeg',
      '**/*.webp'
    ]
  },

      manifest: {
        name: 'HabitQuest',
        short_name: 'HabitQuest',
        start_url: '/',
        display: 'standalone',
        background_color: '#020617',
        theme_color: '#1e293b',
        icons: [
          {
            src: '/icon-192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: '/icon-512.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      }
    })
  ]
})
