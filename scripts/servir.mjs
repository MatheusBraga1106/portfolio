// Servidor estático para desenvolvimento e testes. Só escuta em 127.0.0.1.
// Uso: node scripts/servir.mjs [pasta] [porta]
import http from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { extname, join, normalize, resolve } from 'node:path';
import { gzipSync } from 'node:zlib';

const raiz = resolve(process.argv[2] || '.');
const porta = Number(process.argv[3] || 5320);
const tipos = {
  '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8', '.json': 'application/json', '.svg': 'image/svg+xml',
  '.png': 'image/png', '.webp': 'image/webp', '.jpg': 'image/jpeg', '.woff2': 'font/woff2',
  '.txt': 'text/plain; charset=utf-8', '.xml': 'application/xml',
};

http.createServer(async (req, res) => {
  try {
    let caminho = normalize(decodeURIComponent(new URL(req.url, 'http://x').pathname));
    if (caminho.endsWith('/') || caminho.endsWith('\\')) caminho = join(caminho, 'index.html');
    const arquivo = join(raiz, caminho);
    if (!arquivo.startsWith(raiz)) { res.writeHead(403); return res.end(); }
    if (!(await stat(arquivo)).isFile()) throw new Error('não é arquivo');
    const tipo = tipos[extname(arquivo)] || 'application/octet-stream';
    let corpo = await readFile(arquivo);
    const cab = { 'content-type': tipo, 'cache-control': 'no-store' };
    // comprime texto como o nginx faz no ar, para as medições locais serem parecidas
    if (/text|javascript|json|svg|xml/.test(tipo) && /gzip/.test(req.headers['accept-encoding'] || '')) { corpo = gzipSync(corpo); cab['content-encoding'] = 'gzip'; }
    res.writeHead(200, cab);
    res.end(corpo);
  } catch {
    res.writeHead(404, { 'content-type': 'text/plain; charset=utf-8' });
    res.end('não encontrado');
  }
}).listen(porta, '127.0.0.1', () => console.log(`http://127.0.0.1:${porta}`));
