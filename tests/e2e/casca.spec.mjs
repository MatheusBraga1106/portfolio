import { test, expect } from '@playwright/test';
import { abrir } from './ajuda.mjs';

test('carrega sem erros', async ({ page }) => {
  const erros = await abrir(page);
  await page.waitForLoadState('networkidle');
  await expect(page).toHaveTitle('Matheus Braga · AI Builder');
  expect(erros).toEqual([]);
});

test('sem dependência externa', async ({ page }) => {
  const fora = [];
  page.on('request', (r) => { const u = new URL(r.url()); if (u.hostname !== '127.0.0.1') fora.push(r.url()); });
  await abrir(page);
  await page.waitForLoadState('networkidle');
  expect(fora).toEqual([]);
});

test('topo leva às seções', async ({ page }) => {
  await abrir(page);
  const topo = page.locator('header.top');
  await expect(topo.getByRole('link', { name: 'Trabalho' })).toHaveAttribute('href', '#viagem');
  await expect(topo.getByRole('link', { name: 'Infra' })).toHaveAttribute('href', '#infra');
  await expect(topo.getByRole('link', { name: 'Contato' })).toHaveAttribute('href', '#contato');
  for (const id of ['hero', 'viagem', 'vitrine', 'caixa', 'infra', 'contato']) await expect(page.locator('#' + id)).toHaveCount(1);
});

test('irPara chega ao ponto pedido', async ({ page }) => {
  await abrir(page);
  await page.waitForFunction(() => window.__site && window.__site.irPara);
  // a casca ainda é curta: o teste estica a página para haver onde rolar
  const y = await page.evaluate(() => { document.body.style.minHeight = '4000px'; window.__site.irPara(600, true); return scrollY; });
  expect(y).toBe(600);
});
