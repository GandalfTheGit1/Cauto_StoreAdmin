import path from "path";

import react from "@vitejs/plugin-react";
import { defineConfig, loadEnv } from "vite";
import dynamicImport from "vite-plugin-dynamic-import";
import { VitePWA } from "vite-plugin-pwa";
import { visualizer } from 'rollup-plugin-visualizer';
import { compression } from 'vite-plugin-compression2';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const isDemoMode = env.VITE_DEMO_MODE === 'true'
  const isProduction = mode === 'production'
  
  return {
  plugins: [
    // PWA Configuration optimized for demo
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'masked-icon.svg'],
      manifest: {
        name: 'Elstar Admin Dashboard Demo',
        short_name: 'Elstar Demo',
        description: 'Professional admin dashboard demo showcasing sales, inventory, CRM, and analytics',
        theme_color: '#3B82F6',
        background_color: '#ffffff',
        display: 'standalone',
        icons: [
          {
            src: 'logo192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'logo512.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      },
      workbox: {
        runtimeCaching: [
          // Demo-specific caching for mock API
          {
            urlPattern: /\/api\/.*$/,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'demo-api-cache',
              expiration: {
                maxEntries: 100,
                maxAgeSeconds: isDemoMode ? 60 * 60 : 24 * 60 * 60, // 1 hour for demo, 1 day for production
              },
            },
          },
          // Static assets caching
          {
            urlPattern: /\.(js|css|woff2?|ttf|eot)$/,
            handler: 'StaleWhileRevalidate',
            options: {
              cacheName: 'static-assets-cache',
              expiration: {
                maxEntries: 200,
                maxAgeSeconds: 30 * 24 * 60 * 60, // 30 days
              },
            },
          },
          // Images caching
          {
            urlPattern: /\.(png|jpg|jpeg|svg|gif|webp)$/,
            handler: 'CacheFirst',
            options: {
              cacheName: 'images-cache',
              expiration: {
                maxEntries: 100,
                maxAgeSeconds: 7 * 24 * 60 * 60, // 7 days
              },
            },
          },
          // Google Fonts
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: "StaleWhileRevalidate",
            options: {
              cacheName: "google-fonts-cache",
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365, // 365 days
              },
              cacheableResponse: {
                statuses: [0, 200],
              },
            },
          },
          {
            urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
            handler: "CacheFirst",
            options: {
              cacheName: "gstatic-fonts-cache",
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365, // 365 days
              },
              cacheableResponse: {
                statuses: [0, 200],
              },
            },
          },
        ],
        clientsClaim: true,
        skipWaiting: true,
        cleanupOutdatedCaches: true,
        globPatterns: ["**/*.{js,css,html,ico,png,svg,webp}"],
        maximumFileSizeToCacheInBytes: isDemoMode ? 5000000 : 3000000, // 5MB for demo, 3MB for production
      },
    }),
    
    // React plugin with optimizations
    react({
      babel: {
        plugins: ["babel-plugin-macros"],
      },
    }),
    
    // Dynamic imports for code splitting
    dynamicImport(),
    
    // Compression for production builds
    ...(isProduction ? [
      compression({
        algorithm: 'gzip',
        exclude: [/\.(br)$ /, /\.(gz)$/],
      }),
      compression({
        algorithm: 'brotliCompress',
        exclude: [/\.(br)$ /, /\.(gz)$/],
      })
    ] : []),
    
    // Bundle analyzer for optimization insights
    ...(env.ANALYZE === 'true' ? [
      visualizer({
        filename: 'dist/stats.html',
        open: true,
        gzipSize: true,
        brotliSize: true,
      })
    ] : []),
  ],
  assetsInclude: ["**/*.md"],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
  build: {
    outDir: "build",
    rollupOptions: {
      external: [],
      output: {
        // Optimized chunk splitting for better caching
        manualChunks: (id) => {
          // Core vendor libraries - split for better caching
          if (id.includes('node_modules')) {
            if (id.includes('react') || id.includes('react-dom')) {
              return 'react-vendor'
            }
            if (id.includes('@reduxjs/toolkit') || id.includes('react-redux') || id.includes('redux-persist')) {
              return 'redux-vendor'
            }
            if (id.includes('react-router-dom')) {
              return 'router-vendor'
            }
            if (id.includes('@radix-ui') || id.includes('framer-motion')) {
              return 'ui-vendor'
            }
            if (id.includes('apexcharts') || id.includes('d3')) {
              return 'charts-vendor'
            }
            if (id.includes('miragejs')) {
              return 'mock-vendor'
            }
            if (id.includes('i18next') || id.includes('react-i18next')) {
              return 'i18n-vendor'
            }
            // Group smaller vendors together
            return 'vendor'
          }
          
          // Demo-specific chunks
          if (id.includes('src/mock') || id.includes('demoDataSeeder') || id.includes('DemoTour')) {
            return 'demo'
          }
          
          // Module-specific chunks for lazy loading
          if (id.includes('src/views/sales')) {
            return 'sales-module'
          }
          if (id.includes('src/views/inventory')) {
            return 'inventory-module'
          }
          if (id.includes('src/views/crm')) {
            return 'crm-module'
          }
          if (id.includes('src/views/analytics')) {
            return 'analytics-module'
          }
          if (id.includes('src/views/auth')) {
            return 'auth-module'
          }
          
          // Utilities and services
          if (id.includes('src/utils') || id.includes('src/services')) {
            return 'utils'
          }
          
          // Components
          if (id.includes('src/components/ui')) {
            return 'ui-components'
          }
          if (id.includes('src/components/shared')) {
            return 'shared-components'
          }
        },
        
        // Optimize asset naming for caching
        chunkFileNames: (chunkInfo) => {
          const facadeModuleId = chunkInfo.facadeModuleId ? chunkInfo.facadeModuleId.split('/').pop() : 'chunk'
          return `assets/js/[name]-[hash].js`
        },
        entryFileNames: 'assets/js/[name]-[hash].js',
        assetFileNames: (assetInfo) => {
          const info = assetInfo.name!.split('.')
          const ext = info[info.length - 1]
          if (/\.(css)$/.test(assetInfo.name!)) {
            return `assets/css/[name]-[hash].${ext}`
          }
          if (/\.(png|jpe?g|svg|gif|tiff|bmp|ico)$/i.test(assetInfo.name!)) {
            return `assets/images/[name]-[hash].${ext}`
          }
          if (/\.(woff2?|eot|ttf|otf)$/i.test(assetInfo.name!)) {
            return `assets/fonts/[name]-[hash].${ext}`
          }
          return `assets/[name]-[hash].${ext}`
        },
      },
    },
    target: 'es2020',
    minify: isProduction ? 'terser' : false,
    terserOptions: isProduction ? {
      compress: {
        drop_console: !isDemoMode, // Keep console logs in demo mode for debugging
        drop_debugger: true,
        pure_funcs: ['console.log', 'console.info'],
      },
      mangle: {
        safari10: true,
      },
    } : undefined,
    sourcemap: env.VITE_ENABLE_SOURCE_MAPS === 'true',
    reportCompressedSize: false, // Disable for faster builds
    chunkSizeWarningLimit: parseInt(env.VITE_CHUNK_SIZE_WARNING_LIMIT || '1000'),
    
    // Optimize for demo deployment
    assetsInlineLimit: isDemoMode ? 8192 : 4096, // Inline smaller assets in demo mode
  },
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      '@reduxjs/toolkit',
      'react-redux',
      'react-router-dom',
      'miragejs',
      'apexcharts',
    ],
    exclude: isDemoMode ? [] : ['miragejs'], // Exclude mock server in production
  },
  
  define: {
    global: 'globalThis',
    __DEMO_MODE__: JSON.stringify(isDemoMode),
    __BUILD_TIME__: JSON.stringify(new Date().toISOString()),
  },
  
  // Performance optimizations
  server: {
    fs: {
      strict: false,
    },
  },
  
  // Preview server configuration for demo
  preview: {
    port: 3000,
    host: true,
    cors: true,
  },
}
})
