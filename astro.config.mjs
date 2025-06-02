// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';

// Helper to determine asset category based on extension
const getAssetCategory = (/** @type {string} */ fileName) => {
  if (typeof fileName !== 'string') return null;
  const ext = fileName.split('.').pop()?.toLowerCase();
  if (!ext) return null;

  const imageExtensions = /^(png|jpe?g|svg|gif|tiff|bmp|ico)$/;
  const fontExtensions = /^(woff2?|eot|ttf|otf)$/;

  if (imageExtensions.test(ext)) {
    return 'images';
  }
  if (fontExtensions.test(ext)) {
    return 'fonts';
  }
  return null;
};

// https://astro.build/config
export default defineConfig({
  site: process.env.ASTRO_SITE || 'https://behera.dev',
  base: '/',
  output: 'static',
  vite: {
    plugins: [tailwindcss()],
    build: {
      // Enable minification
      minify: 'terser',
      terserOptions: {
        compress: {
          drop_console: true,
          drop_debugger: true,
          pure_funcs: ['console.log', 'console.info', 'console.debug'],
          passes: 2
        },
        mangle: true,
        format: {
          comments: false
        }
      },
      // Asset optimization
      assetsInlineLimit: 4096,
      cssCodeSplit: true,
      rollupOptions: {
        output: {
          // Chunk splitting for better caching
          manualChunks: {
            vendor: ['react', 'react-dom'],
            // icons: ['react-icons/fa', 'react-icons/hi'] // Consolidate or remove if not heavily used from specific subpaths
          },
          // Organize assets by type
          assetFileNames: (assetInfo) => {
            // Use assetInfo.names (array) or fallback to assetInfo.originalFileNames (array)
            const fileNames = assetInfo.names || assetInfo.originalFileNames;

            if (assetInfo.type === 'asset' && Array.isArray(fileNames)) {
              for (const fileName of fileNames) {
                const category = getAssetCategory(fileName); // Call helper
                if (category === 'images') {
                  return `assets/images/[name]-[hash][extname]`;
                }
                if (category === 'fonts') {
                  return `assets/fonts/[name]-[hash][extname]`;
                }
              }
            }
            // Default for other assets or if no match
            return `assets/[name]-[hash][extname]`;
          },
          chunkFileNames: 'assets/js/[name]-[hash].js',
          entryFileNames: 'assets/js/[name]-[hash].js'
        }
      }
    }
  },
  integrations: [
    react(),
    sitemap({
      changefreq: 'weekly',
      priority: 0.7,
      lastmod: new Date() // This will use the build date
    })
  ],
  compressHTML: true,
  build: {
    inlineStylesheets: 'auto'
  }
});