// Caixa de ferramentas com física (Matter.js). As peças ficam visíveis paradas; o Matter.js só é baixado
// quando a caixa se aproxima, a física começa quando 35% dela aparece e para quando ela sai (ou a aba fica oculta).

let carregando = null;
/** Baixa o Matter.js uma vez só. */
function carregarMatter() {
  if (window.Matter) return Promise.resolve();
  if (!carregando) carregando = new Promise((ok, falhou) => {
    const s = document.createElement('script');
    s.src = '/assets/vendor/matter.min.js'; s.onload = ok; s.onerror = falhou;
    document.head.append(s);
  });
  return carregando;
}

export function iniciarCaixa() {
  const caixa = document.getElementById('caixa');
  if (!caixa || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  // no celular as peças ficam paradas: arrastar com o dedo brigaria com a rolagem da página
  if (matchMedia('(max-width: 860px), (pointer: coarse)').matches) return;
  new IntersectionObserver((es, io) => { if (es[0].isIntersecting) { io.disconnect(); carregarMatter().catch(() => {}); } }, { rootMargin: '800px 0px' }).observe(caixa);
  let comecou = false;
  new IntersectionObserver((es) => {
    if (!es[0].isIntersecting || comecou) return;
    comecou = true;
    carregarMatter().then(() => comecar(caixa)).catch(() => { /* sem física: as peças continuam paradas e visíveis */ });
  }, { threshold: 0.35 }).observe(caixa);
}

function comecar(caixa) {
  const { Engine, Bodies, Body, Composite, Constraint, Runner, Events } = Matter;
  const pecas = [...caixa.querySelectorAll('.chip')];
  const r0 = caixa.getBoundingClientRect(), W = r0.width, H = r0.height;
  // posição de partida = onde cada peça estava parada, um pouco acima (elas caem dali)
  const inicio = pecas.map((el) => { const r = el.getBoundingClientRect(); return { x: r.left - r0.left + r.width / 2, y: r.top - r0.top + r.height / 2, w: r.width, h: r.height }; });
  caixa.classList.add('phys');
  const motor = Engine.create({ gravity: { y: 1.1 } }), corredor = Runner.create();
  Composite.add(motor.world, [
    Bodies.rectangle(W / 2, H + 100, W * 3, 200, { isStatic: true }),
    Bodies.rectangle(-100, H / 2, 200, H * 4, { isStatic: true }),
    Bodies.rectangle(W + 100, H / 2, 200, H * 4, { isStatic: true }),
  ]);
  const itens = pecas.map((el, i) => {
    const s = inicio[i];
    const corpo = Bodies.rectangle(s.x, s.y - H * 0.55 - Math.random() * 120, s.w, s.h, { chamfer: { radius: s.h / 2 - 1 }, restitution: 0.5, friction: 0.4, angle: (Math.random() - 0.5) * 0.8 });
    Composite.add(motor.world, corpo);
    return { el, corpo, w: s.w, h: s.h };
  });
  const sincronizar = () => itens.forEach((it) => {
    const p = it.corpo.position;
    it.el.style.transform = 'translate(' + (p.x - it.w / 2).toFixed(1) + 'px,' + (p.y - it.h / 2).toFixed(1) + 'px) rotate(' + it.corpo.angle.toFixed(3) + 'rad)';
  });
  sincronizar();
  Runner.run(corredor, motor);
  Events.on(motor, 'afterUpdate', sincronizar);

  let naTela = true;
  new IntersectionObserver((es) => { naTela = es[0].isIntersecting; corredor.enabled = naTela && !document.hidden; }).observe(caixa);
  document.addEventListener('visibilitychange', () => { corredor.enabled = naTela && !document.hidden; });

  // arrastar e jogar: uma mola liga o ponteiro à peça
  let arrasto = null;
  const local = (e) => { const r = caixa.getBoundingClientRect(); return { x: e.clientX - r.left, y: e.clientY - r.top }; };
  itens.forEach((it) => {
    it.el.addEventListener('pointerdown', (e) => {
      e.preventDefault();
      const p = local(e), b = it.corpo, o = { x: p.x - b.position.x, y: p.y - b.position.y }, c = Math.cos(-b.angle), s = Math.sin(-b.angle);
      const mola = Constraint.create({ pointA: p, bodyB: b, pointB: { x: o.x * c - o.y * s, y: o.x * s + o.y * c }, stiffness: 0.2, damping: 0.1, length: 0 });
      Composite.add(motor.world, mola); arrasto = { it, mola }; it.el.classList.add('drag'); it.el.setPointerCapture(e.pointerId);
    });
    it.el.addEventListener('pointermove', (e) => { if (arrasto && arrasto.it === it) arrasto.mola.pointA = local(e); });
    const soltar = () => { if (arrasto && arrasto.it === it) { Composite.remove(motor.world, arrasto.mola); it.el.classList.remove('drag'); arrasto = null; } };
    it.el.addEventListener('pointerup', soltar); it.el.addEventListener('pointercancel', soltar);
  });
  document.getElementById('shake').addEventListener('click', () => itens.forEach((it) => {
    Body.setVelocity(it.corpo, { x: (Math.random() - 0.5) * 22, y: -12 - Math.random() * 14 });
    Body.setAngularVelocity(it.corpo, (Math.random() - 0.5) * 0.4);
  }));
}
