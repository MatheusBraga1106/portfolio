import { test, expect } from '@playwright/test';
import { abrir } from './ajuda.mjs';

const VERSOES = [
  { caminho: '/ia/?teste', canonica: 'https://ia.matheusbragadev.com/', og: 'https://ia.matheusbragadev.com/assets/img/og-ia.png' },
  { caminho: '/clientes/?teste', canonica: 'https://matheusbragadev.com/', og: 'https://matheusbragadev.com/assets/img/og-clientes.png' },
];
const so = (info, nome) => test.skip(info.project.name !== nome, 'só no projeto ' + nome);

for (const v of VERSOES) {
  test(`metadados ${v.caminho}`, async ({ page }, info) => {
    so(info, 'desktop');
    await abrir(page, v.caminho);
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', v.canonica);
    await expect(page.locator('meta[property="og:image"]')).toHaveAttribute('content', v.og);
    await expect(page.locator('meta[property="og:title"]')).toHaveAttribute('content', /Matheus Braga/);
    const r = await page.request.get(new URL(v.og).pathname);
    expect(r.status()).toBe(200);
  });

  test(`celular sem rolagem para o lado ${v.caminho}`, async ({ page }, info) => {
    so(info, 'celular');
    await abrir(page, v.caminho);
    await page.waitForFunction(() => window.__site && window.__site.vitrine);
    const larga = () => page.evaluate(() => document.documentElement.scrollWidth - innerWidth);
    expect(await larga()).toBeLessThanOrEqual(0);
    await page.evaluate(() => window.__site.viagem.rolarPara(1, true));
    expect(await larga()).toBeLessThanOrEqual(0);
    await page.evaluate(() => window.__site.vitrine.irParaJanela(2, true));
    expect(await larga()).toBeLessThanOrEqual(0);
    // rolar a página inteira até o rodapé, como um dedo faria
    await page.evaluate(() => scrollTo(0, 0));
    for (let i = 0; i < 400; i++) {
      await page.mouse.wheel(0, 900);
      if (await page.evaluate(() => innerHeight + scrollY >= document.documentElement.scrollHeight - 2)) break;
    }
    await expect(page.locator('footer')).toBeInViewport();
  });

  test(`movimento reduzido mostra tudo ${v.caminho}`, async ({ page }, info) => {
    so(info, 'reduzido');
    await abrir(page, v.caminho);
    await page.waitForLoadState('networkidle');
    await expect(page.locator('html')).toHaveClass(/flat/);
    for (const h of await page.locator('.scene h2').all()) await expect(h).toBeVisible();
    await expect(page.locator('.scene h2')).toHaveCount(4);
    await expect(page.locator('.win h3')).toHaveCount(7);
    for (const h of await page.locator('.win h3').all()) { await h.scrollIntoViewIfNeeded(); await expect(h).toBeVisible(); }
    // nenhum texto ou cartão com opacidade efetiva menor que 1
    const apagados = await page.evaluate(() => {
      const efetiva = (el) => { let o = 1; for (let e = el; e && e.nodeType === 1; e = e.parentElement) o *= parseFloat(getComputedStyle(e).opacity); return o; };
      return [...document.querySelectorAll('main h1, main h2, main h3, main h4, main h5, main p, main li, .ct-card, .loja-card, .chip, #msgs .m')]
        .filter((el) => el.closest('[aria-hidden="true"]') === null && efetiva(el) < 0.99)
        .map((el) => el.tagName + '.' + el.className + ': ' + (el.textContent || '').trim().slice(0, 30));
    });
    expect(apagados).toEqual([]);
  });

  test(`teclado chega aos botões principais ${v.caminho}`, async ({ page }, info) => {
    so(info, 'desktop');
    await abrir(page, v.caminho);
    await page.keyboard.press('Tab');
    for (const alvo of [page.locator('.lj-caminho.prin'), page.locator('.ct-card a[data-win]').first(), page.locator('#mag')]) {
      await alvo.focus();
      const contorno = await alvo.evaluate((el) => getComputedStyle(el).outlineStyle);
      expect(contorno).not.toBe('none');
    }
  });
}
