// Celular (projeto "celular" e telas mais estreitas): o que a revisão visual de 17/11/2026 achou.
import { test, expect } from '@playwright/test';
import sharp from 'sharp';
import { abrir } from './ajuda.mjs';

const sobrepoe = (a, b) => a.left < b.right && b.left < a.right && a.top < b.bottom && b.top < a.bottom;

for (const caminho of ['/ia/', '/clientes/']) {
  test(`caixa no celular: nada cobre o título e não há botão sem efeito (${caminho})`, async ({ page }) => {
    await abrir(page, caminho);
    await page.locator('#caixa').scrollIntoViewIfNeeded();
    await expect(page.locator('#shake')).toBeHidden();
    await expect(page.locator('#caixa .head p')).toBeHidden();
    const r = await page.evaluate(() => ({
      titulo: document.querySelector('#caixa h2').getBoundingClientRect().toJSON(),
      pecas: [...document.querySelectorAll('#caixa .chip')].map((c) => c.getBoundingClientRect().toJSON()),
    }));
    for (const p of r.pecas) expect(sobrepoe(p, r.titulo), `peça ${JSON.stringify(p)} cobre o título`).toBe(false);
  });

  for (const largura of [375, 320]) {
    test(`nada passa da tela em ${largura}px (${caminho})`, async ({ page }) => {
      await page.setViewportSize({ width: largura, height: 740 });
      await abrir(page, caminho);
      await page.evaluate(() => document.fonts.ready);
      const r = await page.evaluate(() => {
        const W = document.documentElement.clientWidth;
        const fora = [];
        for (const sel of ['#contato h2', '#contato .row', '#caixa h2', '#infra h2', '.hero h1 .split', '.hero .side']) {
          const el = document.querySelector(sel);
          const rg = document.createRange(); rg.selectNodeContents(el);
          const dir = Math.max(...[...rg.getClientRects()].map((q) => q.right), el.getBoundingClientRect().right);
          if (dir > W + 0.5) fora.push([sel, Math.round(dir)]);
        }
        return { W, rolagem: document.documentElement.scrollWidth, fora };
      });
      expect(r.fora, `largura ${r.W}`).toEqual([]);
      expect(r.rolagem).toBeLessThanOrEqual(r.W);
    });
  }

  test(`título da abertura tem contraste com as telas atrás (${caminho})`, async ({ page }) => {
    await abrir(page, caminho);
    await page.waitForFunction(() => [...document.querySelectorAll('.poster img')].every((i) => i.complete && i.naturalWidth > 0));
    await page.evaluate(() => document.fonts.ready);
    const caixa = await page.locator('.hero h1').boundingBox();
    // esconde o texto e mede só o fundo atrás dele
    await page.addStyleTag({ content: '.hero .copy{visibility:hidden}' });
    const png = await page.screenshot({ clip: caixa });
    const { data, info } = await sharp(png).removeAlpha().raw().toBuffer({ resolveWithObject: true });
    const lin = (v) => { v /= 255; return v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; };
    const lum = [];
    for (let i = 0; i < data.length; i += info.channels) lum.push(0.2126 * lin(data[i]) + 0.7152 * lin(data[i + 1]) + 0.0722 * lin(data[i + 2]));
    // texto #efede8 (luminância ~0,84): fundo até 0,15 dá contraste de 4,5:1 ou mais, mesmo no ponto mais claro
    expect(lum.reduce((m, v) => Math.max(m, v), 0), 'luminância do ponto mais claro atrás do título').toBeLessThanOrEqual(0.15);
  });
}

test('no celular o número do FindBus vem com a legenda', async ({ page }) => {
  await abrir(page, '/ia/?teste');
  await page.waitForFunction(() => window.__site && window.__site.viagem);
  await page.evaluate(() => window.__site.viagem.rolarPara(1, true));
  await expect(page.locator('#p2 .stat small')).toBeVisible();
  await expect(page.locator('#p2 .stat small')).toHaveText('usuários por dia útil');
});
