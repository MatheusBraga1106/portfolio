import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';

const ler = (f) => readFileSync(f, 'utf8');

test('compose: serviço portfolio-web, sem ports, na rede do Dokploy', () => {
  const c = ler('docker-compose.yml');
  assert.match(c, /^\s{2}portfolio-web:\s*$/m);
  assert.match(c, /expose:\s*\n\s*-\s*"?80"?/);
  assert.doesNotMatch(c, /^\s*ports:/m);
  assert.match(c, /dokploy-network:\s*\n\s*external:\s*true/);
  for (const generico of ['web', 'api', 'app', 'site']) assert.doesNotMatch(c, new RegExp(`^\\s{2}${generico}:\\s*$`, 'm'));
});

test('.dockerignore deixa de fora o que não é site', () => {
  const d = ler('.dockerignore');
  for (const item of ['node_modules', 'tests', '.git', 'scripts', '.superpowers', 'docs']) assert.match(d, new RegExp(`^${item.replace('.', '\\.')}`, 'm'));
});

test('nginx escolhe a versão pelo endereço', () => {
  // os cabeçalhos de segurança ficam em seguranca.conf, incluído em cada location
  const n = ler('nginx.conf') + '\n' + ler('seguranca.conf');
  assert.equal((ler('nginx.conf').match(/location /g) || []).length - 2, (ler('nginx.conf').match(/include \/etc\/nginx\/seguranca\.conf;/g) || []).length, 'toda location com conteúdo inclui os cabeçalhos');
  assert.match(n, /map \$host \$versao/);
  assert.match(n, /~\^ia\\\.\s+ia;/);
  assert.match(n, /default\s+clientes;/);
  assert.match(n, /location = \/healthz/);
  assert.match(n, /Content-Security-Policy/);
  assert.doesNotMatch(n, /unsafe-inline'[^;]*script|script-src[^;]*unsafe-inline/);
});

test('nenhum IP no repositório além de 127.0.0.1', () => {
  const fora = new Set(['node_modules', '.git', '.superpowers', 'test-results', 'playwright-report']);
  const achados = [];
  const andar = (dir) => {
    for (const nome of readdirSync(dir)) {
      if (fora.has(nome)) continue;
      const caminho = join(dir, nome);
      if (statSync(caminho).isDirectory()) { andar(caminho); continue; }
      if (!/\.(html|css|js|mjs|md|yml|yaml|conf|txt|xml|json|svg)$|Dockerfile/.test(nome)) continue;
      for (const ip of ler(caminho).match(/\b\d{1,3}(\.\d{1,3}){3}\b/g) || []) {
        if (ip !== '127.0.0.1' && !/^0\.\d+\.\d+\.\d+$/.test(ip)) achados.push(`${caminho}: ${ip}`);
      }
    }
  };
  andar('.');
  assert.deepEqual(achados, []);
});
