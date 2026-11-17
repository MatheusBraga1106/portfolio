import { test, expect } from '@playwright/test';
import { abrir } from './ajuda.mjs';

test('Como eu uso IA: quatro itens', async ({ page }) => {
  await abrir(page);
  const s = page.locator('#servicos');
  await expect(s.locator('h2')).toHaveText('Como eu uso IA');
  await expect(s.locator('li')).toHaveCount(4);
  for (const t of ['Claude Code como equipe', 'Vários agentes, um projeto', 'Testes com agentes', 'IA fora do chat']) await expect(s).toContainText(t);
});

test('ferramentas visíveis antes da física', async ({ page }) => {
  await abrir(page);
  await expect(page.locator('#caixa .chip')).toHaveCount(16);
  const vis = await page.$$eval('#caixa .chip', (cs) => cs.every((c) => { const r = c.getBoundingClientRect(); return r.width > 0 && getComputedStyle(c).opacity === '1'; }));
  expect(vis).toBe(true);
});

test('a física liga quando a caixa aparece', async ({ page }) => {
  await abrir(page);
  await page.waitForFunction(() => window.__site && window.__site.irPara);
  await page.evaluate(() => { const c = document.getElementById('caixa'); window.__site.irPara(c.getBoundingClientRect().top + scrollY, true); });
  await expect(page.locator('#caixa')).toHaveClass(/phys/, { timeout: 3000 });
  await expect(page.locator('#caixa .chip').first()).toHaveAttribute('style', /translate/);
});

test('copiar e-mail', async ({ page, context }) => {
  await context.grantPermissions(['clipboard-read', 'clipboard-write'], { origin: 'http://127.0.0.1:5320' });
  await abrir(page);
  await page.locator('#mag').click();
  await expect(page.locator('#mag')).toContainText('copiado');
  expect(await page.evaluate(() => navigator.clipboard.readText())).toBe('mmatheusbragamed@gmail.com');
});

test('infraestrutura lista o que está no ar', async ({ page }) => {
  await abrir(page);
  const live = page.locator('#infra .live');
  for (const t of ['este site', 'findbus.com.br', 'radar de preços', 'demonstração do radar', 'painéis internos']) await expect(live).toContainText(t);
});
