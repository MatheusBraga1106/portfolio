// Entrada do site: rolagem suave, cursor e links internos. Cada seção liga a sua parte aqui.
import { irPara } from './rolagem.js';

const reduzido = matchMedia('(prefers-reduced-motion: reduce)').matches;
const toque = matchMedia('(pointer: coarse)').matches;
const G = !!window.gsap;
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

// links internos (#secao): rolam até a seção. Links com data-go/data-win/data-inner têm tratamento próprio.
document.querySelectorAll('a[href^="#"]:not([href="#"]):not([data-go]):not([data-win]):not([data-inner])').forEach((a) => {
  a.addEventListener('click', (e) => {
    const alvo = document.querySelector(a.getAttribute('href'));
    if (!alvo) return;
    e.preventDefault();
    irPara(alvo.getBoundingClientRect().top + scrollY);
  });
});

const site = { lenis, irPara, viagem: null, vitrine: null };
if (new URLSearchParams(location.search).has('teste')) window.__site = site;
export default site;
