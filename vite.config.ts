import path from 'path';
import { defineConfig, Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import { buildSync } from 'esbuild';
import { ddfApiPlugin } from './vite-ddf-api-plugin';

function buildServerPlugin(): Plugin {
  return {
    name: 'build-server-plugin',
    closeBundle() {
      try {
        buildSync({
          entryPoints: [path.resolve(__dirname, 'server.ts')],
          outfile: path.resolve(__dirname, 'server/index.mjs'),
          bundle: true,
          platform: 'node',
          format: 'esm',
          target: 'node18',
          external: ['express', 'axios', 'cookie-parser', 'vite'],
          banner: {
            js: `import { createRequire } from "module"; const require = createRequire(import.meta.url);`
          }
        });
        console.log('[build-server-plugin] Successfully built server/index.mjs');
      } catch (err) {
        console.error('[build-server-plugin] Failed to build server:', err);
      }
    }
  };
}

export default defineConfig({
  server: {
    allowedHosts: true,
    port: 8080,
    host: '0.0.0.0',
  },
  plugins: [react(), buildServerPlugin(), ddfApiPlugin()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '.'),
    },
  },
});
