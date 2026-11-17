import { test, expect } from '@playwright/test';
import { abrir } from './ajuda.mjs';

async function pronto(page) {
  await page.waitForFunction(() => window.__site && window.__site.vitrine);
  await page.waitForTimeout(300);
}
/** Topo (px) de cada janela na tela. */
const topos = (page) => page.$$eval('.win', (ws) => ws.map((w) => Math.round(w.getBoundingClientRect().top)));
/** Clica e espera a animação de rolagem terminar. */
async function clicarEEsperar(page, locator) {
  await locator.click();
  await page.waitForTimeout(1900);
  await page.evaluate(() => dispatchEvent(new Event('scroll')));
}

test('sete janelas, a primeira é a landing', async ({ page }) => {
  await abrir(page); await pronto(page);
  await expect(page.locator('.win')).toHaveCount(7);
  await expect(page.locator('.win').first().locator('h3')).toHaveText('Do problema ao sistema no ar');
});

test('Catálogo, Ver projeto e voltar levam à janela certa', async ({ page }) => {
  await abrir(page); await pronto(page);
  await page.evaluate(() => window.__site.vitrine.irParaJanela(0, true));
  await clicarEEsperar(page, page.locator('.win').first().locator('.win-menu a[data-win="1"]'));
  expect(Math.abs((await topos(page))[1] - 84)).toBeLessThanOrEqual(2);
  await clicarEEsperar(page, page.locator('.ct-card[data-cat="hw"] a[data-win="3"]'));
  expect(Math.abs((await topos(page))[3] - 112)).toBeLessThanOrEqual(2);
  await clicarEEsperar(page, page.locator('.win').nth(3).locator('.win-volta'));
  expect(Math.abs((await topos(page))[1] - 84)).toBeLessThanOrEqual(2);
});

test('a landing rola por dentro junto com a página', async ({ page }) => {
  await abrir(page); await pronto(page);
  const meio = await page.evaluate(() => {
    const w = document.querySelector('.win');
    window.__site.vitrine.irParaJanela(0, true);
    scrollBy(0, Math.round(w._ov / 2));
    dispatchEvent(new Event('scroll'));
    return Math.round(w._ov / 2);
  });
  expect(meio).toBeGreaterThan(100);
  const ty = await page.evaluate(() => new DOMMatrix(getComputedStyle(document.querySelector('.win .win-page')).transform).m42);
  expect(Math.abs(ty + meio)).toBeLessThanOrEqual(3);
});

test('busca e filtro do catálogo', async ({ page }) => {
  await abrir(page); await pronto(page);
  const busca = page.locator('#ctBusca');
  await busca.fill('robo');
  await expect(page.locator('#ctRes')).toHaveText('1 projeto');
  await busca.fill('');
  await page.locator('#ctCats [data-f="hw"]').click();
  await expect(page.locator('#ctRes')).toHaveText('2 projetos');
  await page.locator('#ctCats [data-f="todos"]').click();
  await expect(page.locator('#ctRes')).toHaveText('5 projetos');
  const opac = await page.$$eval('.ct-card', (cs) => cs.map((c) => getComputedStyle(c).opacity));
  expect(opac).toEqual(['1', '1', '1', '1', '1']);
});

test('depois de redimensionar, Catálogo ainda cai no lugar', async ({ page }) => {
  await abrir(page); await pronto(page);
  await page.setViewportSize({ width: 1000, height: 800 });
  await page.waitForTimeout(400);
  await page.evaluate(() => window.__site.vitrine.irParaJanela(0, true));
  await clicarEEsperar(page, page.locator('.win').first().locator('.win-menu a[data-win="1"]'));
  expect(Math.abs((await topos(page))[1] - 84)).toBeLessThanOrEqual(2);
});

test('destaque da landing leva à parada da viagem', async ({ page }) => {
  await abrir(page); await pronto(page);
  await page.evaluate(() => window.__site.vitrine.irParaJanela(0, true));
  await page.evaluate(() => { const w = document.querySelector('.win'); scrollBy(0, w._ov); dispatchEvent(new Event('scroll')); });
  await page.locator('.loja-card[href="#p2"]').click();
  await page.waitForTimeout(2000);
  await page.evaluate(() => dispatchEvent(new Event('scroll')));
  await expect(page.locator('#onde')).toHaveText('02 / 04 · FindBus');
});

test('ilustrações desenhadas', async ({ page }) => {
  await abrir(page); await pronto(page);
  await expect(page.locator('[data-desenho] svg')).toHaveCount(11);
  await expect(page.locator('.loja-foto[data-peca] svg')).toHaveCount(1);
});
