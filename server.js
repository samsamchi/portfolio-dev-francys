// Minimal static server for SPA built assets
// - Serves files from ./dist
// - Falls back to index.html for SPA routes

const http = require('http');
const fs = require('fs');
const path = require('path');

// Load .env for local/dev when present
try {
  require('dotenv').config();
} catch (e) {
  // dotenv optional
}

const PORT = process.env.PORT || 4200;
const DIST = path.join(__dirname, 'dist');

function contentType(file) {
  const ext = path.extname(file).toLowerCase();
  switch (ext) {
    case '.html': return 'text/html; charset=UTF-8';
    case '.js': return 'application/javascript; charset=UTF-8';
    case '.css': return 'text/css; charset=UTF-8';
    case '.json': return 'application/json';
    case '.svg': return 'image/svg+xml';
    case '.png': return 'image/png';
    case '.jpg':
    case '.jpeg': return 'image/jpeg';
    case '.webp': return 'image/webp';
    case '.wasm': return 'application/wasm';
    default: return 'application/octet-stream';
  }
}

const server = http.createServer((req, res) => {
  try {
    // Expose safe env via /api/env (only APP_NAME and PUBLIC_* keys)
    if (req.url === '/api/env') {
      const result = {};
      if (process.env.APP_NAME) result.APP_NAME = process.env.APP_NAME;
      Object.keys(process.env).forEach((k) => {
        if (k.startsWith('PUBLIC_')) result[k] = process.env[k];
      });
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(result));
      return;
    }

    // Normalize URL and map to file in /dist
    const urlPath = decodeURIComponent(new URL(req.url, `http://localhost:${PORT}`).pathname);
    // Remove leading slashes so path.join won't treat it as absolute
    const relativePath = urlPath.replace(/^\/+/, '');
    let filePath = path.join(DIST, relativePath);

    // If requesting a directory or root, serve index.html inside it
    if (urlPath === '/' || urlPath.endsWith('/')) {
      filePath = path.join(DIST, relativePath, 'index.html');
    }

    // Debug logging to help diagnose 404s
    console.log(`[server] req.url=${req.url} -> resolved filePath=${filePath}`);

  // If file exists, serve it
  if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
      const data = fs.readFileSync(filePath);
      res.writeHead(200, { 'Content-Type': contentType(filePath) });
      res.end(data);
      return;
    }

    // Fallback: serve root index.html (SPA support)
    const indexHtml = path.join(DIST, 'index.html');
    if (fs.existsSync(indexHtml)) {
      const data = fs.readFileSync(indexHtml);
      res.writeHead(200, { 'Content-Type': 'text/html; charset=UTF-8' });
      res.end(data);
      return;
    }

    // Not found
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Not Found');
  } catch (err) {
    console.error(err);
    res.writeHead(500, { 'Content-Type': 'text/plain' });
    res.end('Internal Server Error');
  }
});

server.listen(PORT, () => {
  console.log(`Static server running on port ${PORT}`);
});
