// Entrada do site: rolagem suave, cursor e links internos. Cada seção liga a sua parte aqui.
import { irPara } from './rolagem.js';
import { iniciarAbertura, prepararTitulo } from './abertura3d.js';
import { iniciarViagem } from './viagem.js';
import { iniciarVitrine } from './vitrine.js';
import { iniciarCaixa } from './caixa.js';
import { iniciarContato } from './contato.js';

const reduzido = matchMedia('(prefers-reduced-motion: reduce)').matches;
const toque = matchMedia('(pointer: coarse)').matches;

// GSAP, ScrollTrigger e Lenis só em tela grande com mouse: é lá que existem o pino da abertura 3D,
// a rolagem suave e o cursor. No celular a página funciona igual sem eles (e carrega bem mais rápido).
const telaGrande = matchMedia('(min-width: 861px)').matches && !toque;
const carregar = (src) => new Promise((ok, falhou) => { const s = document.createElement('script'); s.src = src; s.onload = ok; s.onerror = falhou; document.head.append(s); });
if (!reduzido && telaGrande) {
  try {
    await Promise.all([carregar('/assets/vendor/gsap.min.js'), carregar('/assets/vendor/lenis.min.js')]);
    await carregar('/assets/vendor/ScrollTrigger.min.js');
  } catch { /* sem as bibliotecas a página continua completa, só sem as animações */ }
}
const G = !!(window.gsap && window.ScrollTrigger);
if (reduzido) document.documentElement.classList.add('flat');
if (G) gsap.registerPlugin(ScrollTrigger);

// rolagem suave: só Lenis, ligado ao ScrollTrigger
let lenis = null;
if (!reduzido && window.Lenis && G) {
  lenis = new Lenis({ lerp: 0.1, smoothWheel: true });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((t) => lenis.raf(t * 1000));
  gsap.ticker.lagSmoothing(0);
}

// cursor próprio (só com mouse)
const cur = document.querySelector('.cur');
if (cur && !toque && G && !reduzido) {
  const qx = gsap.quickTo(cur, 'x', { duration: 0.35, ease: 'power3' });
  const qy = gsap.quickTo(cur, 'y', { duration: 0.35, ease: 'power3' });
  addEventListener('pointermove', (e) => { cur.style.opacity = 1; qx(e.clientX); qy(e.clientY); }, { passive: true });
  document.addEventListener('pointerover', (e) => { if (e.target.closest('[data-hover], a, button')) cur.classList.add('big'); });
  document.addEventListener('pointerout', (e) => { if (e.target.closest('[data-hover], a, button')) cur.classList.remove('big'); });
}

// topo: some ao rolar para baixo (para não ficar por cima do conteúdo) e volta ao rolar para cima.
// Só decide depois de um passo de 8 px, porque a rolagem suave avança de pouco em pouco.
const topo = document.querySelector('header.top');
if (topo) {
  let ultimo = scrollY;
  addEventListener('scroll', () => {
    const y = scrollY;
    if (y < innerHeight * 0.5) { topo.classList.remove('oculto'); ultimo = y; return; }
    if (Math.abs(y - ultimo) < 8) return;
    topo.classList.toggle('oculto', y > ultimo && !topo.contains(document.activeElement));
    ultimo = y;
  }, { passive: true });
  topo.addEventListener('focusin', () => topo.classList.remove('oculto'));
}

prepararTitulo();
iniciarAbertura();
const viagemSite = iniciarViagem(lenis);
const vitrineSite = iniciarVitrine(lenis);
iniciarCaixa();
iniciarContato();

// links internos (#secao): rolam até a seção. Links com data-go/data-win/data-inner e os #p1..#p4 têm tratamento próprio.
document.querySelectorAll('a[href^="#"]:not([href="#"]):not([data-go]):not([data-win]):not([data-inner])').forEach((a) => {
  if (/^#p\d$/.test(a.getAttribute('href'))) return;
  a.addEventListener('click', (e) => {
    const alvo = document.querySelector(a.getAttribute('href'));
    if (!alvo) return;
    e.preventDefault();
    irPara(alvo.getBoundingClientRect().top + scrollY);
  });
});

// Recarregar: a restauração automática do navegador erra, porque a página muda de altura depois de carregar
// (pino da abertura, margens das janelas). Guardamos a rolagem ao sair e devolvemos quando o layout assenta.
const CHAVE = 'portfolio-rolagem:' + location.pathname;
if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
addEventListener('pagehide', () => { try { sessionStorage.setItem(CHAVE, String(Math.round(scrollY))); } catch { /* sem armazenamento: começa do topo */ } });
function devolverRolagem() {
  let y = null;
  try { y = sessionStorage.getItem(CHAVE); } catch { /* sem armazenamento */ }
  // só ao recarregar ou voltar/avançar: uma visita nova começa pela abertura, do topo
  const nav = performance.getEntriesByType('navigation')[0];
  if (y === null || location.hash || !nav || !['reload', 'back_forward'].includes(nav.type)) return;
  if (vitrineSite) vitrineSite.refazer();
  irPara(Number(y), true);
  dispatchEvent(new Event('scroll'));
}
const assentar = () => requestAnimationFrame(() => requestAnimationFrame(devolverRolagem));
if (document.readyState === 'complete') assentar(); else addEventListener('load', assentar, { once: true });

const site = { lenis, irPara, viagem: viagemSite, vitrine: vitrineSite };
if (new URLSearchParams(location.search).has('teste')) window.__site = site;
export default site;
