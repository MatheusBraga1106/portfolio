// Viagem horizontal pelos quatro casos. Tudo na tela sai de viagem(sp, n), a partir da posição da rolagem.
import { viagem, DWELL, MOVE, span } from './viagem-estado.js';
import { irPara } from './rolagem.js';

const NOMES = ['Bot Lab 3D', 'FindBus', 'Radar', 'Sim Racing'];
const prender = (x) => (x < 0 ? 0 : x > 1 ? 1 : x);
const suave = (a, b, x) => { const t = prender((x - a) / (b - a)); return t * t * (3 - 2 * t); };
const brl = (v) => 'R$ ' + v.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

/** Parada 1: a conversa aparece com a rolagem e o agente da vez acende. */
function paradaBot() {
  const msgs = [...document.querySelectorAll('#msgs .m')];
  const agentes = {}; document.querySelectorAll('.agent').forEach((a) => { agentes[a.dataset.a] = a; });
  return (p) => {
    const n = Math.round(p * msgs.length); let aceso = null;
    msgs.forEach((m, j) => { const on = j < n; m.classList.toggle('off', !on); if (on && m.dataset.agent) aceso = m.dataset.agent; });
    Object.keys(agentes).forEach((k) => agentes[k].classList.toggle('on', k === aceso));
  };
}

/** Parada 2: contador de visitas e a réplica do painel do FindBus (só os cartões novos animam). */
function paradaFindBus(reduzido) {
  const cnt = document.getElementById('cnt'), arr = document.getElementById('fbArr'), idade = document.getElementById('fbAge');
  let age = 5, proximo = 50061, timer = null, ligado = false;
  const chegadas = [{ p: 50040, m: 9, ac: 1 }, { p: 50054, m: 21, ac: 1 }, { p: 50017, m: 39, ac: 0 }];
  const desenhar = () => {
    arr.innerHTML = chegadas.map((a) => {
      const quando = a.m <= 0 ? '<b class="fb-now">chegando</b>' : '<b>' + a.m + '</b> min';
      const cls = a.novo ? 'fb-card novo' : 'fb-card'; a.novo = false;
      return '<div class="' + cls + '"><span class="k">PREFIXO</span><b class="pref">' + a.p + '</b><span class="k">CHEGADA</span><span class="t">' + quando + '</span><span class="fb-ac ' + (a.ac ? 'sim' : 'nao') + '">' + (a.ac ? 'COM AR CONDICIONADO' : 'SEM AR CONDICIONADO') + '</span></div>';
    }).join('');
    idade.textContent = age;
  };
  const passo = () => {
    age = 0; chegadas.forEach((a) => { a.m -= 1; });
    if (chegadas[0].m < -1) { chegadas.shift(); chegadas.push({ p: proximo, m: 30 + Math.round(Math.random() * 15), ac: Math.random() > 0.3 ? 1 : 0, novo: true }); proximo += 7; }
    desenhar();
  };
  desenhar();
  const relogio = (v) => {
    if (reduzido || v === ligado) return; ligado = v; clearInterval(timer);
    if (v) timer = setInterval(() => { age += 1; if (age >= 3) passo(); else idade.textContent = age; }, 830);
  };
  return { quadro: (p) => { cnt.textContent = (12.6 * suave(0, 0.6, p)).toFixed(1).replace('.', ','); }, relogio };
}

/** Parada 3: o gráfico desenha e o preço cai até cruzar a meta (dados de exemplo da demonstração). */
function paradaRadar() {
  const P = [429, 429, 425, 425, 419, 419, 415, 412, 412, 409, 405, 405, 402, 399, 399, 397, 395, 394, 392, 392, 389, 388, 386, 385, 383, 382, 382, 381, 379, 374.9], META = 380;
  const X = (i) => 6 + i * (530 / (P.length - 1)), Y = (v) => 10 + ((432 - v) / 64) * 170;
  const svg = document.getElementById('spark');
  svg.innerHTML = '<line x1="6" x2="536" y1="' + Y(META) + '" y2="' + Y(META) + '" stroke="#1f9d57" stroke-width="2" stroke-dasharray="6 6"/><text x="544" y="' + (Y(META) + 4) + '" font-family="Geist Mono, monospace" font-size="12" fill="#1f9d57">meta</text><path id="pl" d="' + P.map((v, i) => (i ? 'L' : 'M') + X(i).toFixed(1) + ' ' + Y(v).toFixed(1)).join(' ') + '" fill="none" stroke="#17131d" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/><circle id="pd" r="7" fill="#17131d" stroke="#fff" stroke-width="3"/>';
  const pl = document.getElementById('pl'), pd = document.getElementById('pd'); let PL = 0; // medido no primeiro uso, fora da carga da página
  const preco = document.getElementById('price'), tag = document.getElementById('tag'), aviso = document.getElementById('toast');
  return (p) => {
    const f = p * (P.length - 1), i = Math.floor(f), k = f - i;
    const v = i >= P.length - 1 ? P[P.length - 1] : P[i] + (P[i + 1] - P[i]) * k;
    if (!PL) PL = pl.getTotalLength(); pl.style.strokeDasharray = PL; pl.style.strokeDashoffset = PL * (1 - p);
    pd.setAttribute('cx', (X(0) + (X(P.length - 1) - X(0)) * p).toFixed(1)); pd.setAttribute('cy', Y(v).toFixed(1));
    preco.textContent = brl(v);
    const bateu = v <= META;
    tag.classList.toggle('hit', bateu);
    tag.textContent = bateu ? '✓ ' + brl(META - v) + ' abaixo da meta' : 'falta ' + brl(v - META) + ' para a meta';
    aviso.classList.toggle('show', bateu);
  };
}

/** Parada 4: o volante gira com a rolagem; arrastar ou as setas somam. */
function paradaVolante(reduzido) {
  const vol = document.getElementById('wheel'), ang = document.getElementById('ang'), tq = document.getElementById('tq'), marcha = document.getElementById('gear');
  let daRolagem = 0, doUsuario = 0, arrastando = false, ux = 0;
  const desenhar = () => {
    const a = Math.round(Math.max(-450, Math.min(450, daRolagem + doUsuario)));
    vol.style.transform = 'rotate(' + a + 'deg)'; ang.textContent = a + '°';
    tq.textContent = Math.min(100, Math.round(Math.abs(a) / 4.5)) + '%';
    marcha.textContent = Math.abs(a) < 30 ? 'N' : String(Math.min(6, 1 + Math.floor(Math.abs(a) / 75)));
    vol.setAttribute('aria-valuenow', a); vol.setAttribute('aria-valuetext', a + ' graus');
  };
  vol.addEventListener('pointerdown', (e) => { arrastando = true; ux = e.clientX; vol.setPointerCapture(e.pointerId); });
  vol.addEventListener('pointermove', (e) => { if (!arrastando) return; doUsuario += (e.clientX - ux) * 0.9; ux = e.clientX; desenhar(); });
  ['pointerup', 'pointercancel'].forEach((t) => vol.addEventListener(t, () => {
    arrastando = false;
    if (window.gsap && !reduzido) { const o = { v: doUsuario }; gsap.to(o, { v: 0, duration: 0.9, ease: 'power3.out', onUpdate: () => { doUsuario = o.v; desenhar(); } }); }
  }));
  vol.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') { doUsuario -= 30; desenhar(); e.preventDefault(); }
    if (e.key === 'ArrowRight') { doUsuario += 30; desenhar(); e.preventDefault(); }
  });
  return (p) => { daRolagem = Math.sin(p * Math.PI * 2) * 160; desenhar(); };
}

/** Liga a viagem. Devolve rolarPara(k, instantaneo) para levar a uma parada. */
export function iniciarViagem(lenis) {
  const trilho = document.getElementById('viagem');
  if (!trilho) return null;
  const reduzido = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const N = 4, CICLO = DWELL + MOVE, SPAN = span(N);
  document.documentElement.style.setProperty('--span', SPAN);
  document.documentElement.style.setProperty('--n', N);
  const faixa = document.getElementById('strip');
  const cenas = [...document.querySelectorAll('.scene')], marcos = [...document.querySelectorAll('#stops a')];
  const camadas = cenas.map((s) => [...s.querySelectorAll('[data-depth]')]);
  const ponteiro = document.getElementById('ponteiro'), feito = document.getElementById('done'), onde = document.getElementById('onde');
  const topo = () => trilho.getBoundingClientRect().top + scrollY;
  const yDaParada = (k) => topo() + ((k * CICLO + DWELL * 0.8) / SPAN) * (trilho.offsetHeight - innerHeight);

  const fb = paradaFindBus(reduzido);
  const quadros = [paradaBot(), fb.quadro, paradaRadar(), paradaVolante(reduzido)];
  let mostrado = -1;

  const desenhar = () => {
    if (reduzido) { quadros.forEach((q) => q(1)); return; }
    // todas as leituras de layout primeiro; depois só escritas (ler depois de escrever força o navegador
    // a recalcular a página inteira a cada quadro)
    const r = trilho.getBoundingClientRect(), curso = trilho.offsetHeight - innerHeight;
    const t = viagem(curso > 0 ? prender(-r.top / curso) : 0, N), pos = t.i + t.fe;
    const naTela = r.top < innerHeight && r.bottom > 0;
    faixa.style.transform = 'translate3d(' + (-pos / N * 100).toFixed(4) + '%,0,0)';
    camadas.forEach((lista, k) => { const off = k - pos; lista.forEach((el) => { el.style.transform = 'translate3d(' + (off * parseFloat(el.dataset.depth) * 40).toFixed(2) + 'vw,0,0)'; }); });
    quadros.forEach((q, k) => q(k < t.i ? 1 : k === t.i ? t.dw : 0));
    const frac = pos / (N - 1);
    ponteiro.style.left = 'calc(14px + (100% - 28px) * ' + frac.toFixed(4) + ')';
    feito.style.width = 'calc((100% - 28px) * ' + frac.toFixed(4) + ')';
    cenas.forEach((s, k) => { const perto = Math.abs(k - pos) < 1; s.toggleAttribute('inert', !perto); s.style.visibility = perto ? 'visible' : 'hidden'; });
    fb.relogio(Math.abs(1 - pos) < 1 && naTela);
    if (t.atual !== mostrado) {
      mostrado = t.atual;
      marcos.forEach((a, k) => { if (k === t.atual) a.setAttribute('aria-current', 'step'); else a.removeAttribute('aria-current'); });
      onde.textContent = '0' + (t.atual + 1) + ' / 0' + N + ' · ' + NOMES[t.atual];
    }
  };

  const rolarPara = (k, instantaneo = false) => {
    irPara(reduzido ? cenas[k].getBoundingClientRect().top + scrollY : yDaParada(k), instantaneo);
    const vivo = document.getElementById('live'); if (vivo) vivo.textContent = 'Projeto ' + (k + 1) + ' de ' + N + ': ' + NOMES[k];
  };
  marcos.forEach((a) => a.addEventListener('click', (e) => { e.preventDefault(); rolarPara(+a.dataset.go); }));
  // links para #p1..#p4 (destaques da vitrine, "O que eu faço") levam à parada
  document.querySelectorAll('a[href^="#p"]').forEach((a) => {
    const m = /^#p(\d)$/.exec(a.getAttribute('href')); if (!m) return;
    a.addEventListener('click', (e) => { e.preventDefault(); e.stopImmediatePropagation(); rolarPara(+m[1] - 1); });
  });

  ['scroll', 'resize', 'pageshow', 'load'].forEach((ev) => addEventListener(ev, desenhar, { passive: true }));
  if (lenis) lenis.on('scroll', desenhar);
  // o pino da abertura e as janelas da vitrine mudam a altura da página depois do carregamento:
  // sempre que o ScrollTrigger recalcula, a viagem se redesenha a partir da rolagem atual
  if (window.ScrollTrigger) ScrollTrigger.addEventListener('refresh', desenhar);
  if (document.fonts) document.fonts.ready.then(desenhar);
  requestAnimationFrame(desenhar); // primeiro desenho no próximo quadro, fora da tarefa que carrega a página
  return { rolarPara, desenhar };
}
