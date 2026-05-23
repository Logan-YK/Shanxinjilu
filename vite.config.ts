import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// GitHub Pages 项目站: VITE_BASE_PATH=/仓库名/  用户站: VITE_BASE_PATH=/
const base = process.env.VITE_BASE_PATH || '/'

function assetPath(file: string): string {
  const normalizedBase = base.endsWith('/') ? base : `${base}/`
  return `${normalizedBase}${file}`.replace(/\/{2,}/g, '/')
}

const pwaIcons = [
  { file: 'pwa-48.png', sizes: '48x48' },
  { file: 'pwa-72.png', sizes: '72x72' },
  { file: 'pwa-96.png', sizes: '96x96' },
  { file: 'pwa-144.png', sizes: '144x144' },
  { file: 'pwa-192.png', sizes: '192x192' },
  { file: 'pwa-512.png', sizes: '512x512' },
  { file: 'pwa-maskable-512.png', sizes: '512x512', purpose: 'maskable' as const },
]

export default defineConfig({
  base,
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: [
        'favicon.ico',
        'favicon.svg',
        'pwa-icon.svg',
        'pwa-48.png',
        'pwa-72.png',
        'pwa-96.png',
        'pwa-144.png',
        'pwa-192.png',
        'pwa-512.png',
        'pwa-maskable-512.png',
        'apple-touch-icon.png',
      ],
      manifest: {
        id: assetPath(''),
        name: '善心记录',
        short_name: '善心记录',
        description: '微信群红包善款分类记账',
        theme_color: '#7c4a2d',
        background_color: '#faf8f5',
        display: 'standalone',
        orientation: 'portrait',
        lang: 'zh-CN',
        start_url: base,
        scope: base,
        icons: pwaIcons.map(({ file, sizes, purpose }) => ({
          src: assetPath(file),
          sizes,
          type: 'image/png',
          purpose: purpose ?? 'any',
        })),
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,svg,png,woff2}'],
      },
    }),
  ],
})
