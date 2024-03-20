import path from 'node:path'
import { defineConfig } from 'vite'
import pugPlugin from 'vite-plugin-pug'

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        // need a better way to template
        main: path.resolve(__dirname, 'index.html'),
        page: path.resolve(__dirname, 'catalog.html'),
        page2: path.resolve(__dirname, 'catalog-page.html'),
        page3: path.resolve(__dirname, 'product-page.html'),
      },
      output: {
        // inlineDynamicImports: true,
        chunkFileNames: `assets/js/[name].[hash].js`,
        entryFileNames: `assets/js/[name].[hash].js`,
        assetFileNames: (assetInfo) => {
          let extType = assetInfo.name.split('.').pop()
          if (/png|jpe?g|svg|gif|tiff|bmp|ico/i.test(extType))
            extType = 'img'

          if (/eot|ttf|woff2?/i.test(extType))
            extType = 'font'

          return `assets/${extType}/[name].[hash][extname]`
        },
      },
    },
  },
  css: {
    preprocessorOptions: {
      sass: {
        // additionalData: `@import './src/assets/sass/main.sass'`,
      },
    },
  },
  plugins: [pugPlugin()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@assets': path.resolve(__dirname, './src/assets'),
      '@components': path.resolve(__dirname, './src/components'),
      '@models': path.resolve(__dirname, './src/models'),
      '@pages': path.resolve(__dirname, './src/pages'),
    },
  },
  server: {
    host: '0.0.0.0',
    port: 8084,
  },
})
