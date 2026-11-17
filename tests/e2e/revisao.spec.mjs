// Testes que reproduzem os achados da revisão final (cada um falhava antes da correção).
import { test, expect } from '@playwright/test';
import { abrir } from './ajuda.mjs';

const so = (info, ...nomes) => test.skip(!nomes.includes(info.project.name), 'só em ' + nomes.join('/'));

test('busca do catálogo esconde de verdade os cartões', async ({ page }, info) => {
  so(info, 'desktop');
  await abrir(page); await page.waitForFunction(() => window.__site && window.__site.vitrine);
  await page.locator('#ctBusca').fill('robo');
  await expect(page.locator('.ct-card:visible')).toHaveCount(1);
  await page.locator('#ctBusca').fill('');
  await page.locator('#ctCats [data-f="hw"]').click();
  await expect(page.locator('.ct-card:visible')).toHaveCount(2);
});

test('teclado não desalinha a janela da landing', async ({ page }, info) => {
  so(info, 'desktop');
  await abrir(page); await page.waitForFunction(() => window.__site && window.__site.vitrine);
  await page.evaluate(() => window.__site.vitrine.irParaJanela(0, true));
  await page.locator('.win').first().locator('.win-menu a').first().focus();
  for (let i = 0; i < 25; i++) await page.keyboard.press('Tab');
  await page.waitForTimeout(300);
  expect(await page.evaluate(() => document.querySelector('.win .win-vp').scrollTop)).toBe(0);
  // o elemento com foco fica dentro da área visível da janela
  const dentro = await page.evaluate(() => {
    const el = document.activeElement, vp = el.closest('.win-vp'); if (!vp) return true;
    const a = el.getBoundingClientRect(), b = vp.getBoundingClientRect();
    return a.top >= b.top - 2 && a.bottom <= b.bottom + 2;
  });
  expect(dentro).toBe(true);
});

test('visita nova na mesma aba começa do topo', async ({ page }, info) => {
  so(info, 'desktop');
  await abrir(page); await page.waitForFunction(() => window.__site && window.__site.irPara);
  await page.evaluate(() => window.__site.irPara(9000, true));
  await page.goto('about:blank');
  await page.goto('/ia/?teste');
  await page.waitForFunction(() => window.__site && window.__site.irPara);
  await page.waitForTimeout(500);
  expect(await page.evaluate(() => scrollY)).toBe(0);
});

for (const [w, h] of [[390, 664], [360, 640]]) {
  test(`celular ${w}×${h}: título e painel de cada caso aparecem inteiros`, async ({ page }, info) => {
    so(info, 'celular');
    await page.setViewportSize({ width: w, height: h });
    await abrir(page); await page.waitForFunction(() => window.__site && window.__site.viagem);
    for (let k = 0; k < 4; k++) {
      await page.evaluate((k) => { window.__site.viagem.rolarPara(k, true); dispatchEvent(new Event('scroll')); }, k);
      await page.waitForTimeout(120);
      const m = await page.evaluate((k) => {
        const cena = document.querySelectorAll('.scene')[k];
        const linha = document.querySelector('.line .in').getBoundingClientRect();
        const titulo = cena.querySelector('h2').getBoundingClientRect();
        const rotulo = cena.querySelector('.copy2 .lbl').getBoundingClientRect();
        const vis = cena.querySelector('.vis').getBoundingClientRect();
        return { linha: linha.bottom, titulo: titulo.top, rotulo: rotulo.top, visFim: vis.bottom, altura: innerHeight };
      }, k);
      expect(m.rotulo, `caso ${k + 1}: rótulo sob a linha do tempo`).toBeGreaterThanOrEqual(m.linha);
      expect(m.visFim, `caso ${k + 1}: interação cortada embaixo`).toBeLessThanOrEqual(m.altura);
    }
    await page.evaluate(() => { window.__site.viagem.rolarPara(1, true); dispatchEvent(new Event('scroll')); });
    await expect(page.locator('.fb-note')).toBeInViewport();
  });
}

test('celular: a caixa de ferramentas não prende o dedo', async ({ page }, info) => {
  so(info, 'celular');
  await abrir(page); await page.waitForFunction(() => window.__site && window.__site.irPara);
  await page.evaluate(() => { const c = document.getElementById('caixa'); window.__site.irPara(c.getBoundingClientRect().top + scrollY, true); });
  await page.waitForTimeout(1500);
  await expect(page.locator('#caixa')).not.toHaveClass(/phys/);
  expect(await page.locator('#caixa .chip').first().evaluate((el) => getComputedStyle(el).touchAction)).not.toBe('none');
});

test('Hub Sim Racing tem os botões do site e do GitHub', async ({ page }, info) => {
  so(info, 'desktop');
  await abrir(page);
  const cena = page.locator('#p4');
  await expect(cena.locator('a[href="https://matheusbraga1106.github.io/hub-sim-racing/"]')).toHaveCount(1);
  await expect(cena.locator('a[href="https://github.com/MatheusBraga1106/hub-sim-racing"]')).toHaveCount(1);
});
