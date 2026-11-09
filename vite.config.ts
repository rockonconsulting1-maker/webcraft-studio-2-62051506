import path from 'path'
import { defineConfig } from 'vite'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import react from '@vitejs/plugin-react'

// TanStack Start app — the framework's plugin generates the server entry
// (the deployable artifact), the route tree, and serves server functions in
// dev. There is no long-lived Express server; the DDF proxy lives in server
// functions. react's vite plugin must come AFTER start's plugin.
export default defineConfig({
  server: {
    port: 8080,
    host: '0.0.0.0',
    allowedHosts: true,
  },
  plugins: [
    tanstackStart({
      // Path to the SSR server entry (valid option shape: start.entry).
      start: {
        entry: './src/entry-server.tsx',
      },
    }),
    react(),
  ],
  // Give the SSR environment a dedicated non-HTML entry so Vite does not
  // default the SSR build input to the root index.html.
  environments: {
    ssr: {
      build: {
        rollupOptions: {
          input: path.resolve(__dirname, 'src/entry-server.tsx'),
        },
      },
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '.'),
    },
  },
})