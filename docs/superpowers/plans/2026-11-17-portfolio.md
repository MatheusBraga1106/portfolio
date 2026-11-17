# Portfólio do Matheus Braga: plano de construção

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Transformar o mockup aprovado "Mistura" num site estático de verdade, em duas versões (IA em
`ia.matheusbragadev.com`, clientes em `matheusbragadev.com`), com testes e pronto para o Dokploy, no repositório
público `MatheusBraga1106/portfolio`.

**Architecture:** Duas páginas (`ia/index.html` e `clientes/index.html`) que dividem `assets/`, em HTML,
CSS e JS puros, sem etapa de build. O nginx escolhe a página pelo endereço. O CSS e o JS
são divididos por seção. As bibliotecas e as fontes ficam dentro do repositório. Um container `nginx`
serve os arquivos. Os testes rodam no Node: `node:test` para as funções puras e Playwright (com o Edge
instalado na máquina, sem baixar navegador) para a página.

**Tech Stack:** HTML/CSS/JS (ES modules), GSAP 3.12.5 + ScrollTrigger, Lenis 1.1.13, Three.js 0.160.0,
Matter.js 0.19.0, nginx (alpine), Docker Compose, Node 24 com `node:test` e `@playwright/test` (só para
desenvolvimento).

**Spec:** `D:\Claude\portfolio-matheus-braga\docs\superpowers\specs\2026-11-17-portfolio-design.md`
**Referência visual e de comportamento:** `D:\Claude\portfolio-matheus-braga\mockups\mistura.html`
(versão 9, aprovada). Cada tarefa porta uma parte desse arquivo. O texto, as cores, as medidas e o
comportamento vêm de lá, e o que este plano diz por cima dele vale mais.

## Global Constraints

- Pasta do projeto: `D:\Claude\portfolio` (nova). A pasta `portfolio-matheus-braga` não entra no repositório.
- Textos em português do Brasil. Fatos sobre ele e os projetos: só os da seção 6 da spec. Dados de exemplo sempre marcados como exemplo na tela.
- Proibido: contagem de commits, heatmap, "quantos projetos", tema de ônibus, códigos tipo MB-01, link para o repositório do FindBus, IPs, `.env` real e dados internos da empresa.
- Sem CDN: tudo carregado de `assets/vendor/` e `assets/fonts/`. As versões são as de cima, exatas.
- Serviço do compose: `portfolio-web`, com `expose: 80`, **sem `ports`**, na rede externa `dokploy-network`.
- Domínio: `matheusbragadev.com` (clientes, com `www`) e `ia.matheusbragadev.com` (IA). Os caminhos de arquivo nas páginas são absolutos (`/assets/...`), porque as duas páginas vivem em pastas diferentes.
- O que é igual nas duas versões (estrutura da abertura, `#caixa`, `#infra`, `#contato`, rodapé) tem que ser idêntico no HTML; um teste compara.
- Versão clientes: nenhum nome de ferramenta em `#viagem`, `#vitrine` e `#servicos` (lista do teste na Task 7).
- Conteúdo visível por padrão: nada começa com `opacity:0` esperando um gatilho de rolagem. Filtros animam só o movimento. Nada de `transition` de CSS na mesma propriedade que o GSAP anima.
- Navegação por clique: nunca `lenis.scrollTo`. Usar `irPara(y, instantaneo)` (animação própria sobre a rolagem nativa). Toda mudança de altura das janelas chama `lenis.resize()`.
- Com `prefers-reduced-motion: reduce`: sem Lenis, sem 3D, sem física. A viagem e as janelas viram seções normais.
- Criar o repositório no GitHub, dar push e trocar links no currículo e no perfil: **só com aprovação explícita do Matheus**, uma de cada vez.

## Review Focus

1. **Celular (≤ 860 px):** a página não pode rolar para o lado e nenhuma janela pode prender a rolagem. Tudo continua legível em 390 px de largura. Teste na Task 8.
2. **Movimento reduzido:** todo texto e todo cartão ficam visíveis, e os quatro casos e as sete janelas aparecem como seções normais. Teste na Task 8.
3. **Recarregar no meio da viagem:** a mesma parada aparece de novo (o estado vem da rolagem). Teste na Task 3.
4. **Redimensionar depois de carregar:** os cliques "Catálogo" e "Ver projeto" continuam caindo na janela certa depois de mudar de 1280 para 1000 px de largura. Teste na Task 5.
5. **Sem WebGL:** aparece a colagem estática no lugar do 3D, sem erro no console. Teste na Task 2.

---

## Estrutura de arquivos

```
D:\Claude\portfolio\
  ia/index.html                 versão IA: todas as seções, na ordem da spec §5, + "Como eu uso IA"
  clientes/index.html           versão clientes (spec §5.1 e §6.2), mesma estrutura
  index.html                    só para desenvolvimento: dois links (ia/ e clientes/); o nginx não o serve
  assets/css/base.css           tokens, tipografia, topo fixo, cursor, utilidades, movimento reduzido
  assets/css/abertura.css       abertura 3D e faixa de ferramentas
  assets/css/viagem.css         linha do tempo e as 4 paradas
  assets/css/vitrine.css        janelas, landing, catálogo, fichas
  assets/css/final.css          caixa de ferramentas, infraestrutura, o que eu faço, contato, rodapé
  assets/js/main.js             entrada (module): Lenis, cursor, irPara(), liga as seções
  assets/js/rolagem.js          irPara(y, instantaneo), pararIrPara(), noVisivel(seletor, fn)
  assets/js/viagem-estado.js    viagem(sp, n) PURA (sem DOM) — testável no Node
  assets/js/abertura3d.js       cena Three.js das telas (import de assets/vendor/three.module.js)
  assets/js/viagem.js           paradas: conversa, painel FindBus, gráfico Radar, volante
  assets/js/desenhos.js         desenho(nome) e peca(nome) → string SVG (PURAS) — testáveis no Node
  assets/js/vitrine.js          janelas (rolagem interna, empilhamento), navegação, catálogo
  assets/js/caixa.js            física das ferramentas (Matter)
  assets/js/contato.js          copiar e-mail e botão magnético
  assets/vendor/                gsap.min.js, ScrollTrigger.min.js, lenis.min.js, three.module.js, matter.min.js, LICENCAS.md
  assets/fonts/                 woff2 de Archivo, Big Shoulders Display, Geist, Geist Mono + fontes.css
  assets/img/                   telas reais em webp + og.png
  robots-ia.txt  robots-clientes.txt  sitemap-ia.xml  sitemap-clientes.xml  favicon.svg
  nginx.conf  Dockerfile  docker-compose.yml  .env.example  .dockerignore  .gitignore
  README.md  DEPLOY.md
  package.json  playwright.config.mjs
  scripts/servir.mjs  scripts/otimizar-imagens.mjs
  tests/unit/*.test.mjs        node:test
  tests/e2e/*.spec.mjs         Playwright (Edge)
```

---

### Task 1: Base do projeto e casca da página

**Files:**
- Create: `package.json`, `playwright.config.mjs`, `scripts/servir.mjs`, `.gitignore`, `index.html` (links de desenvolvimento), `ia/index.html`, `assets/css/base.css`, `assets/fonts/*`, `assets/vendor/*`, `assets/js/main.js`, `assets/js/rolagem.js`, `tests/e2e/ajuda.mjs`, `tests/e2e/casca.spec.mjs`
- As Tasks 2 a 6 constroem a **versão IA** (`/ia/`). A versão clientes nasce dela na Task 7.

**Interfaces:**
- Produces: `scripts/servir.mjs <pasta> <porta>`: servidor estático só em `127.0.0.1` (padrão: `.` e `5320`).
- Produces: `rolagem.js` exporta `irPara(y: number, instantaneo?: boolean): void`, `pararIrPara(): void` e `noVisivel(seletor: string, fn: () => void): void`. `irPara` limita `y` a `[0, scrollHeight - innerHeight]`, dura `clamp(700, 600 + |dy| / innerHeight * 120, 1600)` ms com cúbica in-out, e é cancelada por `wheel`, `touchstart` ou `keydown`. Com movimento reduzido ou `instantaneo`, faz `scrollTo` direto.
- Produces: `main.js` expõe `window.__site = { lenis, irPara, viagem, vitrine }` **só quando a URL tem `?teste`**, para os testes. `viagem` e `vitrine` são os objetos devolvidos por `iniciarViagem()` (Task 3) e `iniciarVitrine()` (Task 5); até essas tarefas existirem, ficam `null`.
- Ids que os testes usam (renomeados do mockup): `#onde` (era `#where`), `#price`, `#tag`, `#ctRes`, `#ctBusca`, `#mag`.

- [ ] **Step 1:** `git init` em `D:\Claude\portfolio` (sem remoto). O `package.json` (privado, `"type": "module"`) tem os scripts `"servir": "node scripts/servir.mjs . 5320"`, `"test": "node --test tests/unit"` e `"e2e": "playwright test"`, e só `@playwright/test` em `devDependencies`. Rodar `npm install` com `PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD=1`. O `.gitignore` tem `node_modules/`, `test-results/`, `playwright-report/` e `.env`.
- [ ] **Step 2:** `playwright.config.mjs`: `webServer` rodando `npm run servir`, `baseURL http://127.0.0.1:5320`, e o projeto `desktop` (1280×800, `channel: 'msedge'`).
- [ ] **Step 3: Escrever o teste que falha** `tests/e2e/casca.spec.mjs`:
  - `carrega sem erros`: abre `/ia/?teste`, junta os erros do console, espera `[]`, e confere `title` = `Matheus Braga · AI Builder`.
  - `sem dependência externa`: nenhuma requisição sai de `127.0.0.1`.
  - `topo`: o link "Trabalho" leva a `#viagem`, "Infra" a `#infra` e "Contato" a `#contato`.
- [ ] **Step 4:** Rodar `npx playwright test casca`. Esperado: FALHA (não há `index.html`).
- [ ] **Step 5:** Copiar os vendors nas versões exatas para `assets/vendor/` (baixados uma vez dos mesmos endereços que o mockup usa) e anotar a licença de cada um em `LICENCAS.md`. Baixar as fontes como woff2 e escrever `fontes.css` com `font-display: swap` e fallbacks.
- [ ] **Step 6:** Criar `ia/index.html` com `lang="pt-BR"`, o título, o topo fixo e as `<section>` vazias com os ids da spec (`#hero`, `#viagem`, `#vitrine`, `#caixa`, `#infra`, `#contato`). Os scripts de vendor ficam em `<script defer>`, e `main.js` como module. O `base.css` traz os tokens `:root` do mockup (cores, `--display`, `--sign`, `--text`, `--mono`, `--ease`), o topo, o cursor e o bloco de movimento reduzido. Escrever `rolagem.js` e `main.js` (Lenis ligado ao ScrollTrigger, cursor, `__site`).
- [ ] **Step 7:** Rodar `npx playwright test casca`. Esperado: PASSA.
- [ ] **Step 8:** Commit `"Base do portfólio: casca, vendors locais, fontes e testes"`.

### Task 2: Abertura 3D e faixa de ferramentas

**Files:**
- Create: `assets/css/abertura.css`, `assets/js/abertura3d.js`, `assets/img/*.webp`, `scripts/otimizar-imagens.mjs`, `tests/e2e/abertura.spec.mjs`
- Modify: `index.html` (`#hero` e a faixa), `assets/js/main.js`

**Interfaces:**
- Consumes: `noVisivel` (Task 1).
- Produces: `abertura3d.js` exporta `iniciarAbertura(): Promise<boolean>` (`true` se o WebGL subiu; `false` → colagem estática). Liga a classe `has-gl` no `<html>`.
- Produces: imagens `assets/img/{racing-volante,racing-painel,findbus-busca,findbus-mapa,radar-demo}.webp`.

- [ ] **Step 1:** `scripts/otimizar-imagens.mjs`: converter os PNG de `D:\Claude\portfolio-matheus-braga\mockups\img\` para WebP com largura máxima de 1400 px e qualidade 82 (`sharp` como devDependency). Rodar o script e conferir que cada arquivo ficou abaixo de 250 KB.
- [ ] **Step 2: Escrever o teste que falha** `abertura.spec.mjs`:
  - `título acessível`: `getByRole('heading', { level: 1 })` tem o nome `Construo com IA e coloco no ar.`.
  - `3D liga`: `html.has-gl` aparece em até 5 s.
  - `sem WebGL mostra a colagem`: projeto extra `sem-webgl` (args `--disable-webgl --disable-3d-apis`). `.poster` visível, `html` sem `has-gl`, sem erros no console.
- [ ] **Step 3:** Rodar o teste. Esperado: FALHA.
- [ ] **Step 4:** Portar do mockup o `#hero` (colagem, canvas, véu, `.copy` com o título dividido por palavra e o `.sr` com o texto inteiro, o botão "Ver os projetos ↓"), a faixa `.marq` e a cena Three.js. Mesmos parâmetros do mockup: as 7 telas, névoa 5–24, os 900 pontos, o pino `+=140%` com `refreshPriority: 1`, o DPR limitado a 1,75, a pausa fora da tela e a perda de contexto.
- [ ] **Step 5:** Rodar o teste. Esperado: PASSA.
- [ ] **Step 6:** Commit `"Abertura 3D com as telas reais e colagem sem WebGL"`.

### Task 3: A viagem pelos quatro casos

**Files:**
- Create: `assets/js/viagem-estado.js`, `assets/js/viagem.js`, `assets/css/viagem.css`, `tests/unit/viagem-estado.test.mjs`, `tests/e2e/viagem.spec.mjs`
- Modify: `index.html` (`#viagem`), `assets/js/main.js`

**Interfaces:**
- Produces: `viagem(sp: number, n: number) → { i, dw, f, fe, atual }` em `viagem-estado.js`, com `DWELL = 1.15`, `MOVE = 0.85` e `SPAN = n*DWELL + (n-1)*MOVE`. Mesma fórmula do mockup (`travel`), com `atual` trocando em `f < 0.39`.
- Produces: `viagem.js` exporta `iniciarViagem(): { rolarPara(k: number, instantaneo?: boolean): void }`.

- [ ] **Step 1: Escrever os testes que falham** `viagem-estado.test.mjs` (n = 4):
  - `viagem(0, 4)` → `{ i: 0, f: 0, atual: 0 }` e `dw` 0.
  - `viagem(1, 4)` → `i: 3`, `f: 0`, `atual: 3`.
  - Em `sp = (DWELL + MOVE * 0.38) / SPAN`, `atual` = 0; em `(DWELL + MOVE * 0.40) / SPAN`, `atual` = 1.
  - Determinismo: 50 valores de `sp` em ordem crescente e depois em ordem decrescente dão resultados iguais, valor a valor.
- [ ] **Step 2:** Rodar `npm test`. Esperado: FALHA.
- [ ] **Step 3:** Implementar `viagem()` em `viagem-estado.js`, pura e sem DOM.
- [ ] **Step 4:** Rodar `npm test`. Esperado: PASSA.
- [ ] **Step 5: Escrever o teste e2e que falha** `viagem.spec.mjs`:
  - `paradas`: para k = 0..3, `rolarPara(k, true)` → `#onde` mostra `0{k+1} / 04 · {nome}` e só a cena k fica com `visibility: visible`.
  - `recarregar no meio`: rolar até a parada 2, `page.reload()` → `#onde` mostra `03 / 04 · Radar`.
  - `painel do FindBus conta`: na parada 1, o primeiro "CHEGADA" cai 1 minuto em até 4 s.
  - `preço do Radar`: com a parada 2 completa (`dw = 1`), `#price` mostra `R$ 374,90` e `#tag` contém `abaixo da meta`.
- [ ] **Step 6:** Rodar o teste. Esperado: FALHA.
- [ ] **Step 7:** Portar do mockup a viagem inteira: o trilho sticky, a linha do tempo neutra (marcos 01–04 e o ponto, sem ônibus), as palavras gigantes, a profundidade, e as quatro cenas com os textos da spec §6. Inclui a conversa por rolagem com os agentes acendendo, a réplica do painel do FindBus (só os cartões novos animam), o gráfico do Radar com o aviso e o volante (rolagem + arrastar + setas).
- [ ] **Step 8:** Rodar o teste. Esperado: PASSA.
- [ ] **Step 9:** Commit `"Viagem horizontal pelos quatro casos"`.

### Task 4: Ilustrações

**Files:**
- Create: `assets/js/desenhos.js`, `tests/unit/desenhos.test.mjs`

**Interfaces:**
- Produces: `desenho(nome: 'oficina'|'faturas'|'geladeira'|'robo'|'celulares'|'comanda') → string` (o conteúdo de um `<svg viewBox="0 0 480 340">`), `peca(nome: 'bot') → string` (`viewBox 0 0 300 220`) e `NOMES_DESENHO: string[]`. Funções puras, portadas de `ILU` e `PECA` do mockup, com a mesma paleta e as mesmas primitivas (`box`, `r`, `c`, `l`, `spark`, `coin`, `check`, `lines`). A impressora e as quatro peças de ônibus **não entram** (a landing nova não usa).

- [ ] **Step 1: Escrever os testes que falham** `desenhos.test.mjs`:
  - Para cada nome de `NOMES_DESENHO`: o resultado tem `<polygon` e tem pelo menos uma `fill="#151515"` (a sombra dura).
  - `desenho('xyz')` lança `Error('desenho desconhecido: xyz')`.
  - Nenhum desenho tem `NaN` nem `undefined` no texto.
- [ ] **Step 2:** Rodar `npm test`. Esperado: FALHA.
- [ ] **Step 3:** Portar as funções para `desenhos.js`.
- [ ] **Step 4:** Rodar `npm test`. Esperado: PASSA.
- [ ] **Step 5:** Commit `"Ilustrações dos projetos como funções puras"`.

### Task 5: A vitrine (landing → catálogo → fichas)

**Files:**
- Create: `assets/css/vitrine.css`, `assets/js/vitrine.js`, `tests/e2e/vitrine.spec.mjs`
- Modify: `index.html` (`#vitrine`, sete `<article class="win">`), `assets/js/main.js`

**Interfaces:**
- Consumes: `desenho`, `peca` (Task 4); `irPara`, `noVisivel` (Task 1); `rolarPara` (Task 3, para os destaques que levam às paradas).
- Produces: `vitrine.js` exporta `iniciarVitrine(lenis): { irParaJanela(k: number, instantaneo?: boolean): void, refazer(): void }`. `refazer()` mede o transbordo de cada `.win-page`, aplica `margin-bottom = transbordo + 30vh` (na última, só o transbordo), chama `lenis.resize()` e `ScrollTrigger.refresh()`. Liga em `load`, `fonts.ready` e `resize` (com 150 ms de espera).

- [ ] **Step 1: Escrever o teste que falha** `vitrine.spec.mjs`:
  - `janelas`: há 7 `.win`, e a primeira tem o título `Do problema ao sistema no ar`.
  - `catálogo`: clicar em "Catálogo" no menu da primeira janela e, depois de 2 s, a janela 2 está com `top` ≈ 84 px (±2). Clicar "Ver projeto" do Monitor leva a janela 4 a `top` ≈ 112 (±2). "← Catálogo" volta para a 2.
  - `rolagem interna`: com `irParaJanela(0, true)` mais metade do transbordo da landing, a `.win-page` dela tem `translateY` ≈ −metade (±3 px).
  - `busca e filtro`: digitar `robo` → `#ctRes` = `1 projeto`. Limpar e clicar Hardware → `2 projetos`. "Todas" → `5 projetos`, com os 5 cartões de `opacity` 1.
  - `redimensionar`: mudar a janela de 1280 para 1000 px de largura, esperar 300 ms, clicar "Catálogo" → a janela 2 fica com `top` ≈ 84.
  - `destaque leva à parada`: o cartão "FindBus" da landing leva `#onde` para `02 / 04 · FindBus`.
- [ ] **Step 2:** Rodar o teste. Esperado: FALHA.
- [ ] **Step 3:** Portar do mockup as sete janelas (landing com os textos da versão 9, catálogo sem códigos, cinco fichas com "← Catálogo"), o CSS da vitrine e a lógica de janelas e navegação. As ilustrações entram por `data-desenho` e `data-peca`, preenchidas por `desenhos.js`. A busca ignora acentos.
- [ ] **Step 4:** Rodar o teste. Esperado: PASSA.
- [ ] **Step 5:** Commit `"Vitrine: landing, catálogo e fichas em janelas empilhadas"`.

### Task 6: "Como eu uso IA", caixa de ferramentas, infraestrutura, o que eu faço e contato

**Files:**
- Create: `assets/css/final.css`, `assets/js/caixa.js`, `assets/js/contato.js`, `tests/e2e/final.spec.mjs`
- Modify: `ia/index.html`, `assets/js/main.js`

O bloco **"Como eu uso IA"** (`<section id="servicos" class="ia-uso">`) entra logo depois da vitrine,
com os quatro itens da spec §5.1, no visual da seção de infraestrutura (fundo escuro, numeração
01–04 porque é uma lista, título grande e frase curta). Na versão clientes, o mesmo `#servicos` vira
"O que eu posso fazer por você" (Task 7).

**Interfaces:**
- Consumes: `noVisivel` (Task 1).
- Produces: `iniciarCaixa(): void` (a física começa quando 35% da caixa aparece, e não antes) e `iniciarContato(): void`.

- [ ] **Step 1: Escrever o teste que falha** `final.spec.mjs`:
  - `como eu uso IA`: `#servicos` tem 4 itens; os títulos contêm `Claude Code como equipe`, `Vários agentes, um projeto`, `Testes com agentes` e `IA fora do chat`.
  - `ferramentas visíveis antes da física`: as 16 `.chip` estão visíveis com a página no topo.
  - `física liga`: rolar até `#caixa` e, em até 3 s, `#caixa` tem a classe `phys` e os chips estão posicionados por `transform`.
  - `copiar e-mail`: com permissão de área de transferência, clicar `#mag` → o texto do botão contém `copiado`, e a área de transferência tem `mmatheusbragamed@gmail.com`.
  - `infra`: `.live` lista `este site`, `findbus.com.br`, `radar de preços`, `demonstração do radar` e `painéis internos`.
- [ ] **Step 2:** Rodar o teste. Esperado: FALHA.
- [ ] **Step 3:** Portar do mockup a caixa (Matter.js: chão, paredes, arrastar por `Constraint`, "Chacoalhar", pausa fora da tela), a infraestrutura com o ponto de luz, "O que eu faço" (entradas por `noVisivel`), o contato com o botão magnético e o rodapé.
- [ ] **Step 4:** Rodar o teste. Esperado: PASSA.
- [ ] **Step 5:** Commit `"Caixa de ferramentas, infraestrutura e contato"`.

### Task 7: Versão clientes

**Files:**
- Create: `clientes/index.html`, `tests/e2e/versoes.spec.mjs`
- Modify: `index.html` (link para a versão clientes)

**Interfaces:**
- Consumes: todos os módulos das Tasks 1–6, sem mudança. A versão clientes só troca textos e tira linhas no HTML; o JS funciona igual nas duas páginas, porque se apoia nos mesmos ids e classes.

- [ ] **Step 1: Escrever o teste que falha** `versoes.spec.mjs` (roda nas duas páginas):
  - `as duas carregam sem erros`: `/ia/?teste` e `/clientes/?teste`, com o console limpo.
  - `partes iguais`: o `outerHTML` de `#caixa`, `#infra`, `#contato` e `footer` é igual nas duas páginas.
  - `clientes sem ferramentas`: o texto visível de `#viagem`, `#vitrine` e `#servicos` em `/clientes/` não contém nenhuma destas palavras (sem diferenciar maiúsculas): `n8n`, `OpenAI`, `Evolution`, `Postgres`, `Claude`, `Python`, `FastAPI`, `Redis`, `Cloudflare`, `Dokploy`, `Docker`, `ESP32`, `Arduino`, `Tesseract`, `ADB`, `scrcpy`, `Node`, `Playwright`, `Feito com`.
  - `textos de cliente`: em `/clientes/`, o h1 tem o nome `Do problema ao sistema funcionando.`, e `#servicos` tem o título `O que eu posso fazer por você` com 4 itens.
  - `IA continua com as ferramentas`: em `/ia/`, `#viagem` contém `n8n` e `#servicos` tem o título `Como eu uso IA`.
- [ ] **Step 2:** Rodar `npx playwright test versoes`. Esperado: FALHA (não há `clientes/index.html`).
- [ ] **Step 3:** Criar `clientes/index.html` a partir de `ia/index.html`, trocando os textos pelos da spec §6.2: abertura, os 4 casos (as interações continuam), landing da vitrine (faixa, áreas, selos, "Como funciona"), catálogo e fichas sem "Feito com…", e `#servicos` como "O que eu posso fazer por você". Título da página: `Matheus Braga · Sistemas sob medida`.
- [ ] **Step 4:** Rodar `npx playwright test`. Esperado: PASSA (todas as specs, nas duas páginas).
- [ ] **Step 5:** Commit `"Versão clientes, com as partes comuns iguais às da versão IA"`.

### Task 8: Celular, movimento reduzido e metadados

**Files:**
- Create: `robots-ia.txt`, `robots-clientes.txt`, `sitemap-ia.xml`, `sitemap-clientes.xml`, `favicon.svg`, `assets/img/og-ia.png`, `assets/img/og-clientes.png`, `tests/e2e/acessivel.spec.mjs`
- Modify: `ia/index.html` e `clientes/index.html` (meta, canônica, Open Graph), `playwright.config.mjs` (projetos `celular` 390×844 e `reduzido` com `reducedMotion: 'reduce'`)

- [ ] **Step 1: Escrever os testes que falham** (rodam nas duas páginas):
  - `metadados`: `/ia/` tem a canônica `https://ia.matheusbragadev.com/` e `og:image` `https://ia.matheusbragadev.com/assets/img/og-ia.png`; `/clientes/` tem `https://matheusbragadev.com/` e `og-clientes.png`.
  - `acessivel.spec.mjs`, projeto `celular`: `document.documentElement.scrollWidth <= innerWidth` no topo, no meio da viagem e no meio da vitrine. Rolar a página inteira com `mouse.wheel` até o rodapé ficar visível.
  - Projeto `reduzido`: `html` com classe `flat`; os 4 `h2` das paradas e os 7 títulos das janelas visíveis, e nenhum elemento de conteúdo com `opacity` < 1.
  - Projeto `desktop`: navegação por Tab chega aos botões "Ver o catálogo", "Ver projeto" e "Copiar e-mail" com contorno visível.
- [ ] **Step 2:** Rodar `npx playwright test acessivel`. Esperado: FALHA.
- [ ] **Step 3:** Escrever as metas de cada página (descrição, `og:title`, `og:description`, `og:image`, canônica), os dois `robots-*.txt` (cada um com o `Sitemap:` do seu endereço), os dois `sitemap-*.xml` com uma URL cada, `favicon.svg` (o quadrado "MB") e os dois `og-*.png` de 1200×630, feitos a partir da abertura de cada versão (print do Edge headless). Tirar os ganchos de teste do mockup (`__box`, `__startBox`, `__dbg` e o selo "mockup"); o `__site` fica só com `?teste`.
- [ ] **Step 4:** Rodar tudo. Esperado: PASSA.
- [ ] **Step 5:** Rodar o Lighthouse no projeto `celular` (`npx lighthouse http://127.0.0.1:5320 --form-factor=mobile --only-categories=performance,accessibility --chrome-flags=--headless`, apontando `CHROME_PATH` para o Edge). Esperado: as duas categorias ≥ 90. Corrigir o que estiver abaixo antes de seguir.
- [ ] **Step 6:** Commit `"Celular, movimento reduzido e metadados das duas versões"`.

### Task 9: Container, compose e documentação

**Files:**
- Create: `nginx.conf`, `Dockerfile`, `.dockerignore`, `docker-compose.yml`, `.env.example`, `DEPLOY.md`, `README.md`, `tests/unit/deploy.test.mjs`

**Interfaces:**
- Produces: imagem `nginx:1.27-alpine` que serve o site em `/usr/share/nginx/html`, com o health check em `/healthz` (resposta `ok`). Um `map $host` escolhe a versão: host que começa com `ia.` → `/ia/index.html`, `/robots-ia.txt` e `/sitemap-ia.xml`; qualquer outro → as versões `clientes`. Os caminhos `/robots.txt` e `/sitemap.xml` são reescritos para o arquivo da versão. `/ia/` e `/clientes/` diretos respondem 404, para não haver dois endereços com a mesma página.

- [ ] **Step 1: Escrever o teste que falha** `deploy.test.mjs` (lê os arquivos como texto):
  - `docker-compose.yml` tem o serviço `portfolio-web`, `expose` com `80`, nenhuma chave `ports:` e `networks: dokploy-network` com `external: true`.
  - `.dockerignore` contém `node_modules`, `tests`, `.git` e `scripts`.
  - Nenhum arquivo do repositório (fora de `node_modules`) contém um IP no formato `\b\d{1,3}(\.\d{1,3}){3}\b`, com exceção de `127.0.0.1`.
- [ ] **Step 2:** Rodar `npm test`. Esperado: FALHA.
- [ ] **Step 3:** Escrever os arquivos. O `nginx.conf` tem gzip, `Cache-Control: public, max-age=31536000, immutable` em `/assets/`, `no-cache` em `index.html`, os cabeçalhos `X-Content-Type-Options: nosniff` e `Referrer-Policy: strict-origin-when-cross-origin`, e uma CSP só com `'self'` (sem `unsafe-inline` em script). O `Dockerfile` copia só os arquivos do site. O `.env.example` diz que nenhuma variável é necessária. O `DEPLOY.md` segue a spec §7, passo a passo: comprar `matheusbragadev.com`, criar os registros A de `@`, `www` e `ia` com proxy, cadastrar os três domínios no serviço `portfolio-web` e fazer outro Deploy depois disso. O `README.md` (público, em português) diz o que é o site, como rodar localmente, como testar e como fica no ar.
- [ ] **Step 4:** Rodar `npm test`. Esperado: PASSA.
- [ ] **Step 5:** Com o Docker: `docker build -t portfolio-teste .`, depois `docker run --rm -d -p 5399:80 --name pt portfolio-teste`. Esperado:
  - `curl -s 127.0.0.1:5399/healthz` responde `ok`;
  - `curl -s -H "Host: ia.matheusbragadev.com" 127.0.0.1:5399/` traz `<title>Matheus Braga · AI Builder</title>`;
  - `curl -s -H "Host: matheusbragadev.com" 127.0.0.1:5399/` e com `Host: www.matheusbragadev.com` trazem `Matheus Braga · Sistemas sob medida`;
  - `curl -s -H "Host: ia.matheusbragadev.com" 127.0.0.1:5399/robots.txt` contém `https://ia.matheusbragadev.com/sitemap.xml`;
  - `curl -s -o /dev/null -w "%{http_code}" 127.0.0.1:5399/ia/` responde `404`;
  - `curl -sI 127.0.0.1:5399/` traz a CSP.
  
  Depois `docker rm -f pt`. Se o Docker estiver desligado, registrar no relatório que este passo não rodou.
- [ ] **Step 6:** Rodar a suíte inteira (`npm test` e `npx playwright test`). Esperado: tudo passa.
- [ ] **Step 7:** Commit `"Container nginx, compose para o Dokploy e documentação"`.

### Task 10: Publicação (cada passo só com aprovação do Matheus)

Não é código. É uma lista de pedidos, um por vez, e cada um espera um "sim".

- [ ] **Step 1:** Pedir aprovação para criar o repositório **público** `MatheusBraga1106/portfolio` e dar push na `main`. Antes, rodar `git status` e mostrar a ele a lista de arquivos.
- [ ] **Step 2:** Ele compra `matheusbragadev.com` e faz o deploy seguindo o `DEPLOY.md` (os três endereços no mesmo serviço, e outro Deploy depois de cadastrar os domínios).
- [ ] **Step 3:** Conferir os três endereços no ar: HTTPS válido (sem 526), a versão certa em cada um, sem erros no console e Lighthouse no celular ≥ 90.
- [ ] **Step 4:** Pedir aprovação, separadamente, para cada troca de hubdev.app por `ia.matheusbragadev.com`:
  - `D:\Downloads\MedidorAR\curriculo\curriculo-ifood-ai-builder.html`, gerando o PDF de novo (Edge `--print-to-pdf`);
  - `curriculo\github-perfil\README.md`, com push no repositório `MatheusBraga1106/MatheusBraga1106`;
  - o campo website do perfil do GitHub.
