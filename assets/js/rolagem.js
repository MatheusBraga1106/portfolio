// Rolagem por código: animação própria sobre a rolagem nativa (o Lenis acompanha os eventos de scroll).
// Não usar lenis.scrollTo: no mockup ele não se movia e guardava a altura antiga da página.

const reduzido = () => matchMedia('(prefers-reduced-motion: reduce)').matches;
let quadro = 0;

/** Para uma animação de rolagem em andamento. */
export function pararIrPara() {
  if (quadro) { cancelAnimationFrame(quadro); quadro = 0; }
}

['wheel', 'touchstart', 'keydown'].forEach((ev) => addEventListener(ev, pararIrPara, { passive: true }));

/** Rola até y (px do topo do documento). Instantâneo com movimento reduzido ou quando pedido. */
export function irPara(y, instantaneo = false) {
  pararIrPara();
  const max = document.documentElement.scrollHeight - innerHeight;
  const alvo = Math.max(0, Math.min(max, Math.round(y)));
  if (instantaneo || reduzido()) { scrollTo(0, alvo); return; }
  const de = scrollY, dy = alvo - de;
  const dur = Math.max(700, Math.min(1600, 600 + (Math.abs(dy) / innerHeight) * 120));
  const t0 = performance.now();
  const curva = (x) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2);
  const passo = (agora) => {
    const x = Math.min(1, (agora - t0) / dur);
    scrollTo(0, de + dy * curva(x));
    quadro = x < 1 ? requestAnimationFrame(passo) : 0;
  };
  quadro = requestAnimationFrame(passo);
}

/**
 * Chama fn uma vez, quando o elemento aparece na tela. O conteúdo fica visível por padrão:
 * a animação só começa quando já está na tela, então nada fica escondido esperando um gatilho.
 */
export function noVisivel(seletor, fn) {
  const el = document.querySelector(seletor);
  if (!el || reduzido() || !('IntersectionObserver' in window)) return;
  const io = new IntersectionObserver((es) => { if (es[0].isIntersecting) { io.disconnect(); fn(); } }, { threshold: 0.2 });
  io.observe(el);
}
