import { createReadStream, existsSync } from 'node:fs';
import { stat } from 'node:fs/promises';
import http from 'node:http';
import path from 'node:path';

const port = Number(process.env.PORT || 4317);
const root = path.resolve(import.meta.dirname, '..', 'dist');
const mimeTypes = new Map([
  ['.css', 'text/css; charset=utf-8'],
  ['.html', 'text/html; charset=utf-8'],
  ['.js', 'text/javascript; charset=utf-8'],
  ['.json', 'application/json; charset=utf-8'],
  ['.svg', 'image/svg+xml'],
  ['.stl', 'model/stl'],
]);

const server = http.createServer(async (request, response) => {
  const requestPath = new URL(request.url, `http://${request.headers.host}`).pathname;
  const relativePath = requestPath === '/' ? '/index.html' : requestPath;
  const resolvedPath = path.join(root, relativePath);
  const normalizedRoot = `${root}${path.sep}`;
  const normalizedPath = path.normalize(resolvedPath);

  if (!normalizedPath.startsWith(normalizedRoot) && normalizedPath !== root) {
    response.writeHead(403);
    response.end('Forbidden');
    return;
  }

  const filePath = existsSync(normalizedPath) ? normalizedPath : path.join(root, 'index.html');

  try {
    const fileStat = await stat(filePath);
    const extension = path.extname(filePath);
    response.writeHead(200, {
      'Content-Length': fileStat.size,
      'Content-Type': mimeTypes.get(extension) || 'application/octet-stream',
      'Cache-Control': extension === '.html' ? 'no-cache' : 'public, max-age=31536000, immutable',
    });
    createReadStream(filePath).pipe(response);
  } catch {
    response.writeHead(404);
    response.end('Not found');
  }
});

server.listen(port, '127.0.0.1', () => {
  console.log(`Brain3D dist server running at http://127.0.0.1:${port}`);
});

