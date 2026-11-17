// Página mais enxuta (análise de poluição de 17/11/2026): menos repetição, menos rótulos, rolagem mais curta.
import { test, expect } from '@playwright/test';
import { abrir } from './ajuda.mjs';

for (const caminho of ['/ia/?teste', '/clientes/?teste']) {
  test(`sem faixa rolante, sem "O que eu faço", sem dica na abertura e sem pílulas de agentes (${caminho})`, async ({ page }) => {
    await abrir(page, caminho);
    for (const sel of ['.marq', 'section.svc', '#hero .hint', '.agent']) await expect(page.locator(sel), sel).toHaveCount(0);
  });

  test(`landing da vitrine só com a abertura e os dois caminhos (${caminho})`, async ({ page }) => {
    await abrir(page, caminho);
    const loja = page.locator('.win-loja');
    for (const sel of ['.lj-wrap', '.lj-veiculo', '.lj-selos', '.loja-dest', '.lj-duvidas', '[data-inner]']) await expect(loja.locator(sel), sel).toHaveCount(0);
    await expect(loja.locator('.lj-caminho')).toHaveCount(2);
    await expect(loja.locator('.win-menu a')).toHaveText(['Catálogo', 'Falar comigo']);
  });

  test(`fichas sem faixa vermelha e sem categoria repetida, com o caminho de volta (${caminho})`, async ({ page }) => {
    await abrir(page, caminho);
    const fichas = page.locator('.win:not(.win-loja):not(.win-cat)');
    await expect(fichas).toHaveCount(5);
    await expect(fichas.locator('.win-faixa')).toHaveCount(0);
    await expect(fichas.locator('.win-tag')).toHaveCount(0);
    await expect(fichas.locator('.win-volta')).toHaveCount(5);
  });

  test(`página mais curta: até 21 telas no desktop (eram 24,3) e abertura presa por no máximo 1,6 tela (${caminho})`, async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await abrir(page, caminho);
    await page.waitForFunction(() => window.__site && window.__site.viagem);
    await page.waitForTimeout(800);
    const r = await page.evaluate(() => ({
      telas: document.documentElement.scrollHeight / innerHeight,
      abertura: document.getElementById('viagem').getBoundingClientRect().top / innerHeight,
    }));
    expect(r.telas).toBeLessThanOrEqual(21);
    expect(r.abertura).toBeLessThanOrEqual(1.6);
  });
}

for (const [w, h] of [[1440, 900], [1280, 800]]) {
  test(`a abertura escura da landing ocupa a janela toda, sem faixa vazia embaixo (${w}×${h})`, async ({ page }) => {
    await page.setViewportSize({ width: w, height: h });
    await abrir(page, '/clientes/?teste');
    await page.waitForFunction(() => window.__site && window.__site.vitrine);
    await page.evaluate(() => window.__site.vitrine.irParaJanela(0, true));
    await page.waitForTimeout(300);
    const sobra = await page.evaluate(() => {
      const w = document.querySelector('.win-loja');
      return w.querySelector('.win-vp').getBoundingClientRect().bottom - w.querySelector('.lj-heroi').getBoundingClientRect().bottom;
    });
    expect(Math.abs(sobra)).toBeLessThanOrEqual(1);
  });
}
