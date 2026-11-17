import { test, expect } from '@playwright/test';
import { abrir } from './ajuda.mjs';

const FERRAMENTAS = ['n8n', 'OpenAI', 'Evolution', 'Postgres', 'Claude', 'Python', 'FastAPI', 'Redis', 'Cloudflare', 'Dokploy', 'Docker', 'ESP32', 'Arduino', 'Tesseract', 'ADB', 'scrcpy', 'Node', 'Playwright', 'Feito com'];
const PARTES_IGUAIS = ['#caixa', '#infra', '#contato', 'footer'];

test('as duas versões carregam sem erros', async ({ page }) => {
  for (const caminho of ['/ia/?teste', '/clientes/?teste']) {
    const erros = await abrir(page, caminho);
    await page.waitForLoadState('networkidle');
    expect(erros, caminho).toEqual([]);
  }
});

test('as partes comuns são idênticas nas duas', async ({ page }) => {
  const html = {};
  for (const v of ['ia', 'clientes']) {
    // lê o HTML como veio do servidor (antes de qualquer script mexer)
    const r = await page.request.get(`/${v}/`);
    const texto = await r.text();
    await page.setContent(texto);
    html[v] = await page.evaluate((sels) => sels.map((s) => document.querySelector(s)?.outerHTML ?? null), PARTES_IGUAIS);
  }
  expect(html.ia.every(Boolean)).toBe(true);
  expect(html.clientes).toEqual(html.ia);
});

test('a versão clientes não fala de ferramentas', async ({ page }) => {
  await abrir(page, '/clientes/?teste');
  for (const sel of ['#viagem', '#vitrine', '#servicos']) {
    const texto = (await page.locator(sel).textContent()).toLowerCase();
    for (const f of FERRAMENTAS) expect(texto, `${sel} contém "${f}"`).not.toContain(f.toLowerCase());
  }
});

test('textos da versão clientes', async ({ page }) => {
  await abrir(page, '/clientes/?teste');
  await expect(page).toHaveTitle('Matheus Braga · Sistemas sob medida');
  await expect(page.getByRole('heading', { level: 1 })).toHaveAccessibleName('Do problema ao sistema funcionando.');
  await expect(page.locator('#servicos h2')).toHaveText('O que eu posso fazer por você');
  await expect(page.locator('#servicos li')).toHaveCount(4);
});

test('a versão IA continua com as ferramentas', async ({ page }) => {
  await abrir(page, '/ia/?teste');
  await expect(page.locator('#viagem')).toContainText('n8n');
  await expect(page.locator('#servicos h2')).toHaveText('Como eu uso IA');
});
