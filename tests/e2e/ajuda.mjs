// Utilidades dos testes de página.

/** Abre a página em modo de teste e devolve a lista (viva) de erros do console e da página. */
export async function abrir(page, caminho = '/ia/?teste') {
  const erros = [];
  page.on('console', (m) => { if (m.type() === 'error') erros.push(m.text()); });
  page.on('pageerror', (e) => erros.push(String(e)));
  await page.goto(caminho);
  return erros;
}
