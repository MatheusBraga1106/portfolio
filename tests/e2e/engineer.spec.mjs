// Versão IA alinhada à candidatura AI Engineer (17/11/2026); a versão clientes não muda.
import { test, expect } from '@playwright/test';
import { abrir } from './ajuda.mjs';

const FRASE = 'Engenharia de software com foco em IA: construo sistemas que integram LLMs a processos reais e coloco em produção, com testes automatizados, Docker e deploy no meu próprio servidor.';

test('versão IA se apresenta como AI Engineer, sem sobra de AI Builder', async ({ page }) => {
  await abrir(page);
  expect(await page.content()).not.toContain('AI Builder');
  await expect(page).toHaveTitle('Matheus Braga · AI Engineer');
  await expect(page.locator('meta[name="description"]')).toHaveAttribute('content', /^AI Engineer/);
  await expect(page.locator('meta[property="og:title"]')).toHaveAttribute('content', 'Matheus Braga · AI Engineer');
  await expect(page.locator('.hero .side p')).toContainText('AI Engineer');
  await expect(page.locator('.hero .side p')).toContainText(FRASE);
});

test('caso do estágio mostra a stack e os 2.300+ testes', async ({ page }) => {
  await abrir(page);
  const caso = page.locator('#p1');
  await expect(caso.locator('.pr')).toContainText('Python, FastAPI, PostgreSQL e Docker');
  await expect(caso.locator('.pr')).toContainText('2.300');
  await expect(caso.locator('.short')).toContainText('2.300');
});

test('caso do estágio cabe na tela de 1280×800', async ({ page }) => {
  await abrir(page);
  await page.waitForFunction(() => window.__site && window.__site.viagem);
  await page.evaluate(() => window.__site.viagem.rolarPara(0, true));
  await page.waitForTimeout(300);
  const fim = await page.evaluate(() => document.querySelector('#p1 .copy2').getBoundingClientRect().bottom);
  expect(fim).toBeLessThanOrEqual(800);
});

test('versão clientes continua sem AI Engineer nem a contagem de testes', async ({ page }) => {
  await abrir(page, '/clientes/?teste');
  const html = await page.content();
  for (const t of ['AI Engineer', 'AI Builder', '2.300', 'LLMs']) expect(html).not.toContain(t);
  await expect(page).toHaveTitle('Matheus Braga · Sistemas sob medida');
});
