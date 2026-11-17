// Gera as imagens de compartilhamento (1200×630) a partir da abertura de cada versão.
// Precisa do servidor de desenvolvimento rodando: npm run servir (em outro terminal).
import { chromium } from '@playwright/test';

const navegador = await chromium.launch({ channel: 'msedge' });
const pagina = await navegador.newPage({ viewport: { width: 1200, height: 630 } });
for (const v of ['ia', 'clientes']) {
  await pagina.goto(`http://127.0.0.1:5320/${v}/`);
  await pagina.waitForFunction(() => document.documentElement.classList.contains('has-gl'), null, { timeout: 8000 }).catch(() => {});
  await pagina.waitForTimeout(2500);
  await pagina.screenshot({ path: `assets/img/og-${v}.png` });
  console.log(`assets/img/og-${v}.png`);
}
await navegador.close();
