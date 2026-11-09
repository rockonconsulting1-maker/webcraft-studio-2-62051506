import path from 'path'
import { defineConfig } from 'vite'
import { tanstackStart } from '@tanstack/start-plugin-core/vite'
import react from '@vitejs/plugin-react'

// TanStack Start app — the framework's plugin generates the server entry
// (the deployable artifact) and serves server functions in dev. There is no
// long-lived Express server; the DDF proxy lives in server functions.
export default defineConfig({
  server: {
    port: 8080,
    host: '0.0.0.0',
    allowedHosts: true,
  },
  plugins: [tanstackStart(), react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '.'),
    },
  },
})