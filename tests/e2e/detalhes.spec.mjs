// "Ver mais" no catálogo: abre uma tela escondida com os detalhes do projeto (e o GitHub, quando é aberto).
import { test, expect } from '@playwright/test';
import { abrir } from './ajuda.mjs';

const cartao = (page, nome) => page.locator('.ct-card', { hasText: nome });

for (const caminho of ['/ia/?teste', '/clientes/?teste']) {
  test(`cada cartão tem "Ver mais" e nada começa aberto (${caminho})`, async ({ page }) => {
    await abrir(page, caminho);
    await expect(page.locator('.ct-card button', { hasText: 'Ver mais' })).toHaveCount(5);
    await expect(page.locator('.ct-card a')).toHaveCount(0);
    await expect(page.locator('dialog.ct-detalhe')).toHaveCount(5);
    await expect(page.locator('dialog[open]')).toHaveCount(0);
  });

  test(`"Ver mais" do robô abre os detalhes com o GitHub; Esc fecha e devolve o foco (${caminho})`, async ({ page }) => {
    await abrir(page, caminho);
    const botao = cartao(page, 'Robô desviador').getByRole('button', { name: 'Ver mais' });
    await botao.click();
    const d = page.getByRole('dialog', { name: 'Você contra a sua própria rede neural' });
    await expect(d).toBeVisible();
    const gh = d.getByRole('link', { name: /Ver no GitHub/ });
    await expect(gh).toHaveAttribute('href', 'https://github.com/MatheusBraga1106/robo-desviador');
    await expect(gh).toHaveAttribute('target', '_blank');
    await expect(d.locator('[data-desenho] svg')).toHaveCount(1);
    await page.keyboard.press('Escape');
    await expect(d).toBeHidden();
    await expect(botao).toBeFocused();
  });

  test(`detalhes do monitor dizem que o código é privado, sem link (${caminho})`, async ({ page }) => {
    await abrir(page, caminho);
    await cartao(page, 'Monitor do mercado').getByRole('button', { name: 'Ver mais' }).click();
    const d = page.locator('dialog[open]');
    await expect(d).toContainText('Projeto privado');
    await expect(d.locator('a')).toHaveCount(0);
  });

  test(`o X e o clique fora fecham; a página não rola por trás (${caminho})`, async ({ page }) => {
    await abrir(page, caminho);
    const botao = cartao(page, 'Extrator').getByRole('button', { name: 'Ver mais' });
    await botao.click();
    const d = page.locator('dialog[open]');
    await expect(d).toBeVisible();
    const antes = await page.evaluate(() => scrollY);
    await page.mouse.move(640, 400);
    await page.mouse.wheel(0, 900);
    await page.waitForTimeout(500);
    expect(await page.evaluate(() => scrollY)).toBe(antes);
    await d.getByRole('button', { name: 'Fechar' }).click();
    await expect(page.locator('dialog[open]')).toHaveCount(0);
    await botao.click();
    await page.mouse.click(8, 8); // fora do diálogo, no fundo escuro
    await expect(page.locator('dialog[open]')).toHaveCount(0);
  });
}

test('versão clientes: detalhes sem nomes de ferramenta', async ({ page }) => {
  await abrir(page, '/clientes/?teste');
  const texto = (await page.locator('dialog.ct-detalhe').allTextContents()).join(' ');
  for (const f of ['Python', 'ESP32', 'HC-SR04', 'Tesseract', 'ADB', 'scrcpy', 'Arduino', 'Claude']) expect(texto, f).not.toContain(f);
});
