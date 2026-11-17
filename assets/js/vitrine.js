// Vitrine em janelas empilhadas: landing → catálogo → fichas. Cada janela rola por dentro com a rolagem da página
// até o fim do conteúdo dela; só então a próxima sobe por cima. Tudo derivado da posição da rolagem.
import { desenho, peca } from './desenhos.js';
import { irPara } from './rolagem.js';

const prender = (x) => (x < 0 ? 0 : x > 1 ? 1 : x);
const semAcento = (s) => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');

/** Preenche as ilustrações (data-desenho e data-peca). */
function desenhar() {
  document.querySelectorAll('[data-desenho]').forEach((el) => { el.innerHTML = '<svg viewBox="0 0 480 340" aria-hidden="true">' + desenho(el.dataset.desenho) + '</svg>'; });
  document.querySelectorAll('.loja-foto[data-peca]').forEach((el) => { el.innerHTML = '<svg viewBox="0 0 300 220" aria-hidden="true">' + peca(el.dataset.peca) + '</svg>'; });
}

/** Busca (sem acento) e categorias do catálogo. */
function ligarCatalogo() {
  const botoes = [...document.querySelectorAll('#ctCats button')], cartoes = [...document.querySelectorAll('.ct-card')];
  const res = document.getElementById('ctRes'), busca = document.getElementById('ctBusca');
  if (!busca) return;
  let filtro = 'todos';
  const aplicar = () => {
    const q = semAcento(busca.value || ''); let n = 0;
    cartoes.forEach((c) => {
      const ok = (filtro === 'todos' || c.dataset.cat.split(' ').includes(filtro)) && (!q || c.dataset.k.includes(q) || semAcento(c.textContent).includes(q));
      c.hidden = !ok; if (ok) n++;
    });
    res.textContent = n ? n + (n === 1 ? ' projeto' : ' projetos') : 'Nenhum projeto com esse nome';
  };
  botoes.forEach((b) => b.addEventListener('click', () => { filtro = b.dataset.f; botoes.forEach((x) => x.classList.toggle('atual', x === b)); aplicar(); }));
  busca.addEventListener('input', aplicar);
}

/** Liga a vitrine. Devolve irParaJanela(k, instantaneo) e refazer() (mede de novo as janelas). */
export function iniciarVitrine(lenis) {
  const janelas = [...document.querySelectorAll('.win')];
  if (!janelas.length) return null;
  const reduzido = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const celular = matchMedia('(max-width: 860px)');
  desenhar();
  ligarCatalogo();

  // um marcador antes de cada janela guarda a posição natural dela (a janela presa não serve para isso)
  const marcas = janelas.map((w) => { const m = document.createElement('div'); m.className = 'win-mark'; m.setAttribute('aria-hidden', 'true'); w.before(m); return m; });
  const topoPreso = (w) => parseFloat(getComputedStyle(w).top) || 0;
  const presaEm = (i) => marcas[i].getBoundingClientRect().top + scrollY - topoPreso(janelas[i]);
  const parado = () => reduzido || celular.matches;

  const efeitos = () => {
    if (parado()) { janelas.forEach((w) => { w.style.transform = ''; w.style.filter = ''; }); return; }
    // primeiro todas as leituras de layout, depois todas as escritas (evita recalcular a página a cada janela)
    const leituras = janelas.map((w, i) => {
      const prox = janelas[i + 1];
      const p = w._ov ? prender((scrollY - presaEm(i)) / w._ov) : 0;
      const cob = prox ? prender((innerHeight - prox.getBoundingClientRect().top) / Math.max(1, innerHeight - topoPreso(w) - 16)) : 0;
      return { p, cob };
    });
    janelas.forEach((w, i) => {
      const pg = w.querySelector('.win-page'), { p, cob } = leituras[i];
      if (pg && w._ov) pg.style.transform = 'translate3d(0,' + (-p * w._ov).toFixed(1) + 'px,0)';
      w.style.transform = cob ? 'scale(' + (1 - 0.05 * cob).toFixed(4) + ')' : '';
      w.style.filter = cob ? 'brightness(' + (1 - 0.38 * cob).toFixed(3) + ')' : '';
    });
  };

  const refazer = () => {
    janelas.forEach((w, i) => {
      const vp = w.querySelector('.win-vp'), pg = w.querySelector('.win-page');
      if (!vp || !pg || parado()) { w._ov = 0; w.style.marginBottom = ''; if (pg) pg.style.transform = ''; return; }
      w._ov = Math.max(0, pg.scrollHeight - vp.clientHeight);
      w.style.marginBottom = Math.round(w._ov + (i < janelas.length - 1 ? innerHeight * 0.3 : 0)) + 'px';
    });
    if (lenis && lenis.resize) lenis.resize(); // a rolagem suave precisa saber a altura nova da página
    if (window.ScrollTrigger) ScrollTrigger.refresh();
    efeitos();
  };

  const irParaJanela = (k, instantaneo = false) => {
    if (!janelas[k]) return;
    if (parado()) { irPara(janelas[k].getBoundingClientRect().top + scrollY - 70, instantaneo); return; }
    irPara(presaEm(k) + 2, instantaneo);
  };

  document.querySelectorAll('[data-win]').forEach((a) => a.addEventListener('click', (e) => { e.preventDefault(); irParaJanela(+a.dataset.win); }));
  // "Como funciona"/"Dúvidas": rolam até o bloco dentro da landing
  document.querySelectorAll('[data-inner]').forEach((a) => a.addEventListener('click', (e) => {
    e.preventDefault();
    const w = a.closest('.win'), i = janelas.indexOf(w), alvo = document.getElementById(a.dataset.inner), pg = w.querySelector('.win-page');
    if (parado() || !w._ov) { irPara(alvo.getBoundingClientRect().top + scrollY - 90); return; }
    const desloc = alvo.getBoundingClientRect().top - pg.getBoundingClientRect().top - 60;
    irPara(presaEm(i) + Math.min(w._ov, Math.max(0, desloc)) + 2);
  }));

  addEventListener('scroll', efeitos, { passive: true });
  if (lenis) lenis.on('scroll', efeitos);
  let espera; addEventListener('resize', () => { clearTimeout(espera); espera = setTimeout(refazer, 150); });
  addEventListener('load', refazer);
  if (document.fonts) document.fonts.ready.then(refazer);
  refazer();
  return { irParaJanela, refazer };
}
