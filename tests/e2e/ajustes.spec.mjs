// Ajustes depois do site no ar (revisão visual de 17/11/2026), no desktop.
import { test, expect } from '@playwright/test';
import { abrir } from './ajuda.mjs';

const pronto = (page) => page.waitForFunction(() => window.__site && window.__site.irPara && window.__site.viagem);
const dentro = (a, b, folga = 0) => a.left >= b.left - folga && a.right <= b.right + folga && a.top >= b.top - folga && a.bottom <= b.bottom + folga;

test('nomes das paradas ficam dentro da barra escura em todas as paradas', async ({ page }) => {
  await abrir(page);
  await pronto(page);
  for (let k = 0; k < 4; k++) {
    await page.evaluate((k) => window.__site.viagem.rolarPara(k, true), k);
    await page.waitForTimeout(150);
    const r = await page.evaluate(() => {
      const caixa = document.querySelector('.line .in').getBoundingClientRect();
      return { caixa: caixa.toJSON(), selo: document.getElementById('onde').getBoundingClientRect().toJSON(), nomes: [...document.querySelectorAll('.stops a span')].map((s) => s.getBoundingClientRect().toJSON()) };
    });
    for (const n of r.nomes) {
      expect(dentro(n, r.caixa), `parada ${k}: ${JSON.stringify(n)} fora de ${JSON.stringify(r.caixa)}`).toBe(true);
      expect(n.right, `parada ${k}: nome por baixo do selo "${k + 1} / 04"`).toBeLessThanOrEqual(r.selo.left - 6);
    }
  }
});

test('botão de copiar mostra as duas palavras juntas, no centro', async ({ page }) => {
  await abrir(page);
  const r = await page.evaluate(() => {
    const [a, b] = [...document.querySelectorAll('#mag span')].map((s) => s.getBoundingClientRect());
    const bt = document.getElementById('mag').getBoundingClientRect();
    return { vao: b.top - a.bottom, meio: (a.top + b.bottom) / 2 - (bt.top + bt.height / 2) };
  });
  expect(r.vao).toBeLessThanOrEqual(6);
  expect(Math.abs(r.meio)).toBeLessThanOrEqual(4);
});

test('leitor de tela lê "Vamos conversar?" e "Copiar e-mail" com espaço', async ({ page }) => {
  await abrir(page);
  // o nome que o próprio navegador calcula (a árvore de acessibilidade do Chromium), não o do Playwright
  const cdp = await page.context().newCDPSession(page);
  const { nodes } = await cdp.send('Accessibility.getFullAXTree');
  const nomes = nodes.filter((n) => ['heading', 'button'].includes(n.role?.value)).map((n) => n.name?.value);
  expect(nomes).toContain('Vamos conversar?');
  expect(nomes).toContain('Copiar e-mail');
});

test('contato tem link para escrever o e-mail', async ({ page }) => {
  await abrir(page);
  const link = page.getByRole('link', { name: /Escrever e-mail/ });
  await expect(link).toHaveAttribute('href', 'mailto:mmatheusbragamed@gmail.com');
});

test('topo some ao rolar para baixo e volta ao rolar para cima ou ao focar', async ({ page }) => {
  await abrir(page);
  await pronto(page);
  const visivel = () => page.evaluate(() => document.querySelector('header.top').getBoundingClientRect().bottom > 10);
  await page.evaluate(() => window.__site.irPara(1500, true));
  await page.evaluate(() => window.__site.irPara(3000, true));
  await expect.poll(visivel).toBe(false);
  await page.evaluate(() => window.__site.irPara(2700, true));
  await expect.poll(visivel).toBe(true);
  await page.evaluate(() => window.__site.irPara(4500, true));
  await expect.poll(visivel).toBe(false);
  await page.locator('header.top a').first().focus();
  await expect.poll(visivel).toBe(true);
  await page.evaluate(() => window.__site.irPara(0, true));
  await expect.poll(visivel).toBe(true);
});

for (const caminho of ['/ia/?teste', '/clientes/?teste']) {
  for (const [w, h] of [[1440, 900], [1100, 800], [900, 760]]) {
    test(`título da abertura não encosta no texto ao lado (${caminho} ${w}px)`, async ({ page }) => {
      await page.setViewportSize({ width: w, height: h });
      await abrir(page, caminho);
      await page.evaluate(() => document.fonts.ready);
      const r = await page.evaluate(() => {
        const rg = document.createRange();
        rg.selectNodeContents(document.querySelector('.hero h1 .split'));
        return { linhas: [...rg.getClientRects()].map((q) => q.toJSON()), lado: document.querySelector('.hero .side').getBoundingClientRect().toJSON() };
      });
      const fim = Math.max(...r.linhas.map((q) => q.right));
      expect(fim, `título termina em ${fim}, texto ao lado começa em ${r.lado.left}`).toBeLessThanOrEqual(r.lado.left - 12);
    });
  }
}

test('versão clientes: a faixa abaixo da abertura fala de resultados, sem nomes de ferramenta', async ({ page }) => {
  await abrir(page, '/clientes/?teste');
  const faixa = (await page.locator('.marq').textContent()) || '';
  for (const f of ['n8n', 'OpenAI', 'Claude', 'Python', 'FastAPI', 'Postgres', 'Docker', 'Dokploy', 'Cloudflare']) expect(faixa).not.toContain(f);
  expect(faixa).toContain('WhatsApp');
});

test('versão IA: a faixa continua com as ferramentas', async ({ page }) => {
  await abrir(page);
  await expect(page.locator('.marq')).toContainText('Claude Code');
});

test.describe('caixa de ferramentas com física', () => {
  test.beforeEach(async ({ page }) => {
    await abrir(page);
    await pronto(page);
    await page.evaluate(() => { const c = document.getElementById('caixa'); window.__site.irPara(c.getBoundingClientRect().top + scrollY, true); });
    await expect(page.locator('#caixa')).toHaveClass(/phys/, { timeout: 8000 });
  });

  test('arrastar fora das peças não seleciona o texto da seção', async ({ page }) => {
    const c = await page.locator('#caixa').boundingBox();
    await page.mouse.move(c.x + c.width * 0.75, c.y + c.height * 0.45);
    await page.mouse.down();
    await page.mouse.move(c.x + 30, c.y + 60, { steps: 8 });
    await page.mouse.up();
    expect(await page.evaluate(() => getSelection().toString())).toBe('');
  });

  test('depois de chacoalhar, as peças param legíveis e dentro da caixa', async ({ page }) => {
    for (let i = 0; i < 3; i++) { await page.locator('#shake').click(); await page.waitForTimeout(250); }
    await page.waitForTimeout(4500);
    const r = await page.evaluate(() => {
      const caixa = document.getElementById('caixa');
      const cr = caixa.getBoundingClientRect();
      const area = { left: cr.left + caixa.clientLeft, top: cr.top + caixa.clientTop };
      area.right = area.left + caixa.clientWidth; area.bottom = area.top + caixa.clientHeight;
      return [...caixa.querySelectorAll('.chip')].map((el) => {
        const m = /translate\(([-\d.]+)px,\s*([-\d.]+)px\)\s*rotate\(([-\d.]+)rad\)/.exec(el.style.transform);
        const [x, y, a] = [Number(m[1]), Number(m[2]), Number(m[3])];
        const w = el.offsetWidth, h = el.offsetHeight;
        // a peça é uma pílula: metade da parte reta girada mais o raio
        const ex = Math.abs((w - h) / 2 * Math.cos(a)) + h / 2, ey = Math.abs((w - h) / 2 * Math.sin(a)) + h / 2;
        const cx = area.left + x + w / 2, cy = area.top + y + h / 2;
        const ang = Math.atan2(Math.sin(a), Math.cos(a));
        return { t: el.textContent, ang, esq: cx - ex - area.left, dir: area.right - (cx + ex), baixo: area.bottom - (cy + ey) };
      });
    });
    for (const p of r) {
      expect(Math.abs(p.ang), `${p.t} girada ${p.ang}`).toBeLessThanOrEqual(0.9);
      expect(Math.min(p.esq, p.dir, p.baixo), `${p.t} fora da caixa: ${JSON.stringify(p)}`).toBeGreaterThanOrEqual(-2);
    }
  });
});

for (const [w, h] of [[1280, 800], [1270, 823], [1440, 900]]) {
  test(`janelas da vitrine cabem inteiras na tela, até o fim da página de dentro (${w}×${h})`, async ({ page }) => {
    await page.setViewportSize({ width: w, height: h });
    await abrir(page, '/clientes/?teste');
    await page.waitForFunction(() => window.__site && window.__site.vitrine);
    const n = await page.locator('.win').count();
    for (let i = 0; i < n; i++) {
      // fim da rolagem de dentro da janela i: é quando ela mostra o que tem embaixo
      await page.evaluate((i) => {
        const win = document.querySelectorAll('.win')[i], marca = document.querySelectorAll('.win-mark')[i];
        const preso = marca.getBoundingClientRect().top + scrollY - (parseFloat(getComputedStyle(win).top) || 0);
        window.__site.irPara(preso + (win._ov || 0), true);
      }, i);
      await page.waitForTimeout(120);
      const r = await page.evaluate((i) => {
        const win = document.querySelectorAll('.win')[i], pg = win.querySelector('.win-page');
        return { janela: win.getBoundingClientRect().bottom, ultimo: pg.lastElementChild.getBoundingClientRect().bottom, tela: innerHeight };
      }, i);
      expect(r.janela, `janela ${i + 1} passa da tela`).toBeLessThanOrEqual(r.tela);
      expect(r.ultimo, `fim da janela ${i + 1} cortado`).toBeLessThanOrEqual(r.janela + 1);
    }
  });
}
