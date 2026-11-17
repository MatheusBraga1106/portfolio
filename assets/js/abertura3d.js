// Abertura em 3D: as telas reais dos projetos flutuam; o mouse inclina a câmera e a rolagem atravessa as telas.
// Sem WebGL (ou com movimento reduzido) fica a colagem estática (.poster), e a página continua completa.

const TELAS = [
  ['/assets/img/racing-volante.webp', -2.6, 0.6, -1.5, 4.2],
  ['/assets/img/radar-demo.webp', 2.9, 0.9, -4.5, 4.0],
  ['/assets/img/findbus-busca.webp', -3.3, -1.2, -7.5, 2.6],
  ['/assets/img/racing-painel.webp', 2.2, -1.1, -10, 3.4],
  ['/assets/img/findbus-mapa.webp', -1.4, 1.2, -13, 3.2],
  ['/assets/img/radar-demo.webp', 3.2, 0.2, -16.5, 3.2],
  ['/assets/img/racing-volante.webp', -2.8, -0.3, -20, 3.6],
];

function webglDisponivel() {
  try { const c = document.createElement('canvas'); return !!(c.getContext('webgl2') || c.getContext('webgl')); } catch { return false; }
}

/** Liga a cena. Devolve true se o WebGL subiu (e marca html.has-gl); false deixa a colagem. */
export async function iniciarAbertura() {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches || !webglDisponivel()) return false;
  // no celular fica a colagem: o Three.js (655 KB) é o que mais pesa num aparelho mais lento
  if (matchMedia('(max-width: 860px), (pointer: coarse)').matches) return false;
  const canvas = document.getElementById('gl');
  if (!canvas) return false;
  try {
    const THREE = await import('/assets/vendor/three.module.min.js');
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: 'high-performance' });
    renderer.setPixelRatio(Math.min(devicePixelRatio, 1.75));
    renderer.setClearColor(0x0c0c0b, 1);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    const scene = new THREE.Scene();
    scene.fog = new THREE.Fog(0x0c0c0b, 5, 24);
    const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 60);
    camera.position.set(0, 0, 7);

    const loader = new THREE.TextureLoader();
    const linha = new THREE.LineBasicMaterial({ color: 0xffd400, transparent: true, opacity: 0.28 });
    const planos = [];
    await Promise.all(TELAS.map(([src, x, y, z, w], i) => new Promise((ok) => loader.load(src, (tex) => {
      tex.colorSpace = THREE.SRGBColorSpace;
      tex.anisotropy = Math.min(8, renderer.capabilities.getMaxAnisotropy());
      const geo = new THREE.PlaneGeometry(w, (w * tex.image.height) / tex.image.width);
      const mesh = new THREE.Mesh(geo, new THREE.MeshBasicMaterial({ map: tex, transparent: true, opacity: 0.96 }));
      mesh.position.set(x, y, z);
      mesh.rotation.y = x > 0 ? -0.22 : 0.22;
      mesh.add(new THREE.LineSegments(new THREE.EdgesGeometry(geo), linha));
      mesh.userData = { y0: y, fase: i * 1.3 };
      scene.add(mesh); planos.push(mesh); ok();
    }, undefined, ok))));

    // pontos ao fundo: dão profundidade à travessia
    const N = 900, pos = new Float32Array(N * 3);
    for (let i = 0; i < N; i++) { pos[i * 3] = (Math.random() - 0.5) * 26; pos[i * 3 + 1] = (Math.random() - 0.5) * 14; pos[i * 3 + 2] = -Math.random() * 30 + 4; }
    const pg = new THREE.BufferGeometry(); pg.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    scene.add(new THREE.Points(pg, new THREE.PointsMaterial({ color: 0xffd400, size: 0.035, transparent: true, opacity: 0.55 })));
    document.documentElement.classList.add('has-gl');

    let w = 0, h = 0;
    const medir = () => { const r = canvas.getBoundingClientRect(); if (r.width === w && r.height === h) return; w = r.width; h = r.height; renderer.setSize(w, h, false); camera.aspect = w / h; camera.updateProjectionMatrix(); };
    medir(); addEventListener('resize', medir);

    let px = 0, py = 0, tx = 0, ty = 0, prog = 0, alvoProg = 0;
    addEventListener('pointermove', (e) => { tx = e.clientX / innerWidth - 0.5; ty = e.clientY / innerHeight - 0.5; }, { passive: true });
    if (window.gsap && window.ScrollTrigger) {
      ScrollTrigger.create({ trigger: '#hero', start: 'top top', end: '+=45%', pin: true, scrub: true, refreshPriority: 1, onUpdate: (s) => { alvoProg = s.progress; } });
      gsap.to('#hero .copy', { opacity: 0, y: -60, ease: 'none', scrollTrigger: { trigger: '#hero', start: 'top top', end: '+=35%', scrub: true } });
      ScrollTrigger.sort(); ScrollTrigger.refresh();
    }

    let visivel = true, raf = 0;
    const relogio = new THREE.Clock();
    const quadro = () => {
      raf = 0;
      if (!visivel || document.hidden) return;
      const t = relogio.getElapsedTime();
      px += (tx - px) * 0.06; py += (ty - py) * 0.06; prog += (alvoProg - prog) * 0.12;
      camera.position.set(px * 1.6, -py, 7 - prog * 21);
      camera.lookAt(px * 0.6, -py * 0.4, camera.position.z - 8);
      for (const m of planos) m.position.y = m.userData.y0 + Math.sin(t * 0.6 + m.userData.fase) * 0.08;
      renderer.render(scene, camera);
      raf = requestAnimationFrame(quadro);
    };
    new IntersectionObserver((es) => { visivel = es[0].isIntersecting; if (visivel && !raf) raf = requestAnimationFrame(quadro); }).observe(document.getElementById('hero'));
    document.addEventListener('visibilitychange', () => { if (!document.hidden && visivel && !raf) raf = requestAnimationFrame(quadro); });
    canvas.addEventListener('webglcontextlost', (e) => { e.preventDefault(); document.documentElement.classList.remove('has-gl'); visivel = false; });
    raf = requestAnimationFrame(quadro);
    return true;
  } catch {
    document.documentElement.classList.remove('has-gl');
    return false;
  }
}

/** Divide o título em palavras para a entrada; o texto inteiro continua no .sr para leitores de tela. */
export function prepararTitulo() {
  const el = document.querySelector('#hero .split');
  if (!el) return;
  el.innerHTML = el.textContent.trim().split(' ').map((p) => '<span class="wd"><span>' + p + '</span></span>').join(' ');
  if (window.gsap && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
    gsap.from('#hero .split .wd > span', { yPercent: 110, duration: 0.9, ease: 'power4.out', stagger: 0.06, delay: 0.15 });
    gsap.from('#hero .side > *', { y: 18, opacity: 0, duration: 0.7, stagger: 0.08, delay: 0.55 });
  }
}
