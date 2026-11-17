// Parte final da página: o ponto de luz da infraestrutura, as entradas de "O que eu faço" e do contato,
// e o botão redondo que copia o e-mail (atraído pelo mouse).
import { noVisivel } from './rolagem.js';

export function iniciarContato() {
  const reduzido = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const toque = matchMedia('(pointer: coarse)').matches;
  const G = !!window.gsap;

  if (G && !reduzido && innerWidth > 760 && document.getElementById('pkt')) {
    gsap.fromTo('#pkt', { left: '10%' }, { left: '90%', duration: 2.4, ease: 'power1.inOut', repeat: -1, repeatDelay: 0.5 });
  }
  if (G) {
    noVisivel('.svc ul', () => gsap.fromTo('.svc li a', { yPercent: 100 }, { yPercent: 0, duration: 0.8, ease: 'power4.out', stagger: 0.07, clearProps: 'transform' }));
    noVisivel('.ct h2', () => gsap.fromTo('.ct h2', { yPercent: 30, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 1, ease: 'power4.out', clearProps: 'transform,opacity' }));
  }

  const botao = document.getElementById('mag'), email = document.getElementById('mail');
  if (!botao || !email) return;
  if (!toque && G && !reduzido) {
    const mx = gsap.quickTo(botao, 'x', { duration: 0.4, ease: 'power3' }), my = gsap.quickTo(botao, 'y', { duration: 0.4, ease: 'power3' });
    document.querySelector('.ct').addEventListener('pointermove', (e) => {
      const r = botao.getBoundingClientRect(), dx = e.clientX - (r.left + r.width / 2), dy = e.clientY - (r.top + r.height / 2);
      if (Math.hypot(dx, dy) < 240) { mx(dx * 0.35); my(dy * 0.35); } else { mx(0); my(0); }
    });
  }
  botao.addEventListener('click', () => {
    const selecionar = () => { const r = document.createRange(); r.selectNodeContents(email); const s = getSelection(); s.removeAllRanges(); s.addRange(r); botao.innerHTML = 'Selecionado<br>Ctrl+C'; };
    try { navigator.clipboard.writeText(email.textContent).then(() => { botao.innerHTML = 'E-mail<br>copiado'; }, selecionar); } catch { selecionar(); }
  });
}
