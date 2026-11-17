import { test, expect } from '@playwright/test';
import { abrir } from './ajuda.mjs';

test('título acessível', async ({ page }) => {
  await abrir(page);
  await expect(page.getByRole('heading', { level: 1 })).toHaveAccessibleName('Construo com IA e coloco no ar.');
});

test('3D liga', async ({ page }, info) => {
  test.skip(info.project.name === 'sem-webgl', 'este projeto roda sem WebGL');
  await abrir(page);
  await expect(page.locator('html')).toHaveClass(/has-gl/, { timeout: 5000 });
});

test('sem WebGL mostra a colagem', async ({ page }, info) => {
  test.skip(info.project.name !== 'sem-webgl', 'só no projeto sem WebGL');
  const erros = await abrir(page);
  await page.waitForLoadState('networkidle');
  await expect(page.locator('#hero .poster')).toBeVisible();
  await expect(page.locator('html')).not.toHaveClass(/has-gl/);
  expect(erros).toEqual([]);
});

