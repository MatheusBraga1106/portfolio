import { test, expect } from '@playwright/test';
import { abrir } from './ajuda.mjs';

const NOMES = ['Bot Lab 3D', 'FindBus', 'Radar', 'Sim Racing'];

async function pronto(page) {
  await page.waitForFunction(() => window.__site && window.__site.viagem);
}
async function irParaParada(page, k) {
  await page.evaluate((k) => { window.__site.viagem.rolarPara(k, true); dispatchEvent(new Event('scroll')); }, k);
  await page.waitForTimeout(150);
}

test('cada parada aparece sozinha, com o índice certo', async ({ page }) => {
  await abrir(page); await pronto(page);
  for (let k = 0; k < 4; k++) {
    await irParaParada(page, k);
    await expect(page.locator('#onde')).toHaveText(`0${k + 1} / 04 · ${NOMES[k]}`);
    const vis = await page.$$eval('.scene', (ss) => ss.map((s) => getComputedStyle(s).visibility));
    expect(vis.filter((v) => v === 'visible')).toHaveLength(1);
    expect(vis[k]).toBe('visible');
  }
});

test('recarregar no meio da viagem volta para a mesma parada', async ({ page }) => {
  await abrir(page); await pronto(page);
  await irParaParada(page, 2);
  await page.reload(); await pronto(page);
  await page.waitForTimeout(400);
  await expect(page.locator('#onde')).toHaveText('03 / 04 · Radar');
});

test('painel do FindBus conta os minutos', async ({ page }) => {
  await abrir(page); await pronto(page);
  await irParaParada(page, 1);
  const primeiro = page.locator('#fbArr .fb-card').first().locator('.t b');
  const antes = await primeiro.textContent();
  await expect(primeiro).not.toHaveText(antes, { timeout: 4000 });
});

test('o preço do Radar termina abaixo da meta', async ({ page }) => {
  await abrir(page); await pronto(page);
  await irParaParada(page, 3);
  await expect(page.locator('#price')).toHaveText('R$ 374,90');
  await expect(page.locator('#tag')).toContainText('abaixo da meta');
});

test('a conversa do bot aparece com a rolagem', async ({ page }) => {
  await abrir(page); await pronto(page);
  await irParaParada(page, 1);
  await expect(page.locator('#msgs .m.off')).toHaveCount(0);
  await expect(page.locator('.agent.on')).toHaveText('Humano');
});
