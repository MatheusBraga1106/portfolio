import { defineConfig } from '@playwright/test';

// Usa o Edge instalado na máquina (channel: 'msedge'), sem baixar navegador.
export default defineConfig({
  testDir: 'tests/e2e',
  timeout: 30_000,
  fullyParallel: false,
  workers: 1,
  reporter: [['list']],
  use: { baseURL: 'http://127.0.0.1:5320', channel: 'msedge' },
  webServer: { command: 'node scripts/servir.mjs . 5320', url: 'http://127.0.0.1:5320/', reuseExistingServer: true, timeout: 20_000 },
  projects: [
    { name: 'desktop', testIgnore: /estreito\.spec\.mjs/, use: { viewport: { width: 1280, height: 800 } } },
    {
      name: 'celular',
      testMatch: /(acessivel|revisao|estreito)\.spec\.mjs/,
      use: { viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true, deviceScaleFactor: 2 },
    },
    {
      name: 'reduzido',
      testMatch: /acessivel\.spec\.mjs/,
      use: { viewport: { width: 1280, height: 800 }, reducedMotion: 'reduce' },
    },
    {
      name: 'sem-webgl',
      testMatch: /abertura\.spec\.mjs/,
      use: { viewport: { width: 1280, height: 800 }, launchOptions: { args: ['--disable-webgl', '--disable-3d-apis'] } },
    },
  ],
});
