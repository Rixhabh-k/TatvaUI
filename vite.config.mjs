// vite.config.mjs
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'   // <-- match what's actually installed
import { esmExternalRequirePlugin } from 'rolldown/plugins'

export default defineConfig({
  build: {
    lib: {
      entry: './src/index.js',
      formats: ['es'],
    },
    rollupOptions: {
      external: ['react', 'react-dom', 'react/jsx-runtime', 'react-dom/client'],
      plugins: [
        esmExternalRequirePlugin({
          external: ['react', 'react-dom', 'react/jsx-runtime', 'react-dom/client'],
        }),
      ],
    },
  },
  plugins: [react()],
})