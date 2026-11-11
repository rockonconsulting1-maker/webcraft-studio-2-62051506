// Production server entry. The publish pipeline compiles this file into
// server/index.mjs (the deployable artifact). It is intentionally minimal:
//   - No Express, no app.listen() — just Node's http module.
//   - No DDF proxy — DDF calls live in TanStack server functions
//     (lib/ddf.functions.ts) served by the framework runtime.
//   - Serves the built client bundle (dist/) with an SPA fallback so the
//     site renders after publish.
//
// In dev the harness runs Vite directly (TanStack Start plugin), so this
// file is only used for the production artifact.

import { createServer, type IncomingMessage, type ServerResponse } from 'node:http'
import { readFile, stat } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import { join, extname, normalize } from 'node:path'
import { fileURLToPath } from 'node:url'
import { dirname } from 'node:path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const DIST_DIR = join(__dirname, 'dist')
const PORT = Number(process.env.PORT) || 8080

const MIME: Record<string, string> = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
  '.txt': 'text/plain; charset=utf-8',
  '.map': 'application/json; charset=utf-8',
}

async function serveStatic(
  req: IncomingMessage,
  res: ServerResponse,
  filePath: string,
): Promise<boolean> {
  try {
    const s = await stat(filePath)
    if (!s.isFile()) return false
    const data = await readFile(filePath)
    res.writeHead(200, {
      'Content-Type': MIME[extname(filePath).toLowerCase()] || 'application/octet-stream',
      'Cache-Control': extname(filePath) === '.html' ? 'no-cache' : 'public, max-age=31536000, immutable',
    })
    res.end(data)
    return true
  } catch {
    return false
  }
}

async function handler(req: IncomingMessage, res: ServerResponse) {
  // Normalize and prevent path traversal outside dist/.
  const urlPath = decodeURIComponent((req.url || '/').split('?')[0])
  const safe = normalize(urlPath).replace(/^(\.\.[/\\])+/, '')
  const filePath = join(DIST_DIR, safe)

  // 1. Exact file match (assets, etc.)
  if (safe !== '/' && existsSync(filePath)) {
    if (await serveStatic(req, res, filePath)) return
  }

  // 2. SPA fallback to index.html for client-side routing.
  if (await serveStatic(req, res, join(DIST_DIR, 'index.html'))) return

  res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' })
  res.end('Not found')
}

const server = createServer((req, res) => {
  handler(req, res).catch((err) => {
    console.error('Server error:', err)
    if (!res.headersSent) {
      res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' })
      res.end('Internal server error')
    }
  })
})

server.listen(PORT, '0.0.0.0', () => {
  console.log(`Production server listening on http://0.0.0.0:${PORT}`)
})

export { server }
