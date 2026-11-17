import { defineConfig } from 'vite'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import react from '@vitejs/plugin-react'

// Canonical TanStack Start bootstrap. The plugin generates the route tree,
// the server entry artifact (server/index.mjs — a Cloudflare Workers fetch
// handler bundled from src/entry-server.tsx), and serves server functions in
// dev. Do NOT add an `environments.ssr` override or a custom SSR `input`:
// that suppresses the plugin's own server-artifact build, which is what
// produces server/index.mjs and makes the publish pipeline "ready".
//
// react's vite plugin must come AFTER start's plugin.
export default defineConfig({
  server: {
    port: 8080,
    host: '0.0.0.0',
    allowedHosts: true,
  },
  plugins: [
    tanstackStart({
      // Path to the SSR server entry. The plugin bundles this into the
      // deployable server artifact (server/index.mjs).
      start: { entry: './src/entry-server.tsx' },
    }),
    react(),
  ],
  resolve: {
    alias: {
      '@': new URL('.', import.meta.url).pathname,
    },
  },
})
