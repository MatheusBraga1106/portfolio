# Portfólio pessoal do Matheus Braga: design

Data: 17/11/2026. **Aprovado pelo Matheus em 17/11/2026.** Base visual aprovada: o mockup "Mistura"
(`D:\Claude\portfolio-matheus-braga\mockups\mistura.html`, publicado em
https://claude.ai/artifact/3eDonuS1143JKp9VPpmkV2). Os outros mockups da mesma pasta ficam
como referência (`LEIA-ME.md` explica cada um).

## 1. Intenção

O Matheus está se candidatando ao estágio GenAI do iFood, trilha **AI Builder**. Hoje o
currículo, o README do perfil do GitHub e o campo "site" do perfil apontam para o hubdev.app,
que **não é o portfólio dele**: é um hub de projetos de vários amigos. Ele precisa de um site só
dele.

O site tem duas funções:

1. **Ser a prova** de bom gosto em frontend. O próprio site é o argumento: visual, interativo e
   chamativo (palavras dele), com acabamento.
2. **Mostrar a parte de infraestrutura** que ele opera: Docker, Dokploy, VPS Hetzner e Cloudflare.
   O site roda nesse mesmo caminho, e diz isso.

Cada projeto aparece como **estudo de caso: problema → solução → resultado**, com acesso ao
projeto real quando ele existe.

## 2. Objetivos, não objetivos e anti-objetivos

**Objetivos**
- Site no ar em domínio próprio `.dev`, com HTTPS, servido pelo Dokploy do Matheus.
- Quatro casos principais, nesta ordem: Bot do Laboratório 3D, FindBus, Radar de Preços,
  Hub Sim Racing.
- Uma vitrine de "Outros projetos" (5 projetos menores).
- A URL nova substitui o hubdev.app no currículo, no README do perfil e no campo de site do
  perfil do GitHub (a troca em si é a última etapa, com aprovação dele).

**Não objetivos (fora desta versão)**
- Blog, CMS, painel de administração, formulário de contato com envio.
- Versão em inglês (decisão do autor: a vaga e o recrutador são brasileiros; dá para acrescentar
  depois).
- Backend. O status "ao vivo" dos serviços ficou para uma versão futura (ver seção 4).

**Anti-objetivos (se acontecer, falhou, mesmo funcionando)**
- Contagem de commits, heatmap, "quantos projetos fiz". Ele rejeitou isso explicitamente.
- Qualquer coisa com cara de "gerado por IA". Ele vetou a rota de ônibus animada do FindBus por
  isso, e pediu animações "mais próximas da realidade" do produto.
- Tema de ônibus no site inteiro. Ele achou que a linha do tempo com ônibus "nicha muito o site".
- Expor código, IPs ou dados da empresa (Grupo Odilon Santos), ou linkar o repositório do
  FindBus.
- Número ou afirmação que não esteja na seção 6.

## 3. Restrições

- **Stack que ele mantém sozinho:** HTML, CSS e JavaScript puros, sem React, sem etapa de build
  obrigatória. Python/FastAPI só se um dia houver backend.
- **Hospedagem:** Dokploy na VPS Hetzner dele, atrás da Cloudflare. O painel do Dokploy fica em
  `dokploy.hubdev.app`, atrás do Cloudflare Access; o IP da VPS não aceita conexão direta.
- **Nomes de serviço no compose sempre com prefixo do projeto** (regra dele, por causa da rede
  compartilhada `dokploy-network`): o serviço se chama `portfolio-web`, nunca `web`.
- **No Dokploy, todo domínio novo só vale depois de um novo deploy.** Sem isso a Cloudflare
  mostra erro 526 (aconteceu com a demo do Radar em 17/11/2026).
- Criar repositório, dar push, publicar ou trocar links no currículo e no perfil: **só com
  aprovação explícita dele**. O deploy no Dokploy é ele quem faz, com o passo a passo pronto.
- Tudo em português do Brasil, inclusive os textos do site.

## 4. Abordagens consideradas

| | Abordagem | Ganha | Perde |
|---|---|---|---|
| **A (escolhida)** | Site estático (HTML/CSS/JS) servido por nginx num container | Ele mantém sozinho; nada para cair; a Cloudflare põe tudo em cache | Nada é dinâmico |
| B | FastAPI + templates Jinja, conteúdo num JSON, status dos serviços ao vivo | Prova de infra viva, na stack dele | Um servidor rodando para um site quase todo estático |
| C | A agora, com um serviço pequeno `portfolio-status` depois | Caminho aberto sem custo agora | — |

**A escolha é a A, com o caminho C aberto.** O Matheus confirmou o site estático em 17/11/2026.
O botão "Medir a resposta dos sistemas" do mockup Interativo também fica para
depois, porque depende de liberar CORS nos outros serviços.

## 5. O site, seção por seção (o que ele decidiu)

A referência de comportamento e visual é o arquivo `mistura.html`. O site é **uma página só**.

1. **Topo fixo:** nome "MATHEUS BRAGA" à esquerda; links Trabalho, Infra e Contato à direita.
2. **Abertura 3D (Three.js):** as telas reais dos projetos flutuam no espaço, inclinam com o mouse
   e a rolagem atravessa as telas (a abertura fica presa enquanto isso). Título "Construo com IA e
   coloco no ar." entrando palavra por palavra. Botão "Ver os projetos ↓". Sem WebGL ou com
   movimento reduzido, aparece uma colagem estática das mesmas telas.
3. **Faixa de ferramentas** rolando (n8n, OpenAI, Claude Code...).
4. **Viagem pelos casos (rolagem horizontal):** a rolagem vertical move os casos para o lado. No
   topo, uma **linha do tempo neutra** (fio, marcos 01 a 04, ponto que acompanha a rolagem,
   **sem ônibus**). Estado derivado só da posição da rolagem (técnica da skill
   `horizontal-scroll-scenes`): voltar, pular e recarregar caem sempre no mesmo lugar. Cada caso
   tem cor própria, palavra gigante vazada ao fundo e uma interação:
   - **Bot do Lab 3D** (verde-sálvia): a conversa de WhatsApp aparece com a rolagem e o agente da
     vez acende (Triagem, Pedido, Ocorrência, Humano). Conversa marcada como exemplo.
   - **FindBus** (azul-noite): contador de visitas e uma **réplica do painel real do FindBus**
     (busca no ponto 5198, Linha 268, chegadas contando para baixo, selos de ar-condicionado),
     marcada como réplica com dados de exemplo. Botão para findbus.com.br.
   - **Radar de Preços** (lilás): o preço desenha o gráfico e cai até cruzar a meta; aparece o
     aviso do Telegram. Botão para a demonstração.
   - **Hub Sim Racing** (quase preto + âmbar): o volante (print real do app) gira com a rolagem e
     com arrastar ou setas; ângulo, torque e marcha mudam junto. Botões para o site e o GitHub.
   - Em telas pequenas os casos ficam empilhados dentro de cada tela (texto curto + interação).
     Com movimento reduzido, viram seções verticais normais.
5. **A vitrine do estágio, como janelas de navegador empilhadas**, logo depois do Hub Sim Racing.
   O fluxo imita o site de verdade: **landing → catálogo → ficha de cada projeto**. As janelas ficam
   presas dentro da seção. **Cada janela rola por dentro com a rolagem da página** até o fim do
   conteúdo dela; só então a próxima sobe por cima, e a de baixo encolhe um pouco e escurece. Tudo
   é derivado da posição da rolagem e nada fica escondido. **Clique leva ao mesmo lugar:** "Catálogo",
   "Ver o catálogo" e "Ver peças" vão para a janela do catálogo; "Ver projeto" vai para a ficha; "←
   Catálogo" volta; "Como funciona" e "Dúvidas" rolam dentro da landing.
   - **Janela 1: uma landing com a estrutura e o visual da vitrine pública do gos-pecas3d**
     (`frontend/templates/blocos/vitrine/*` e `static/css/publico.css`), **mas falando dele e
     vendendo os projetos** (ele achou confuso a landing falar de peças e o catálogo mostrar
     projetos). A barra da janela diz "no visual da vitrine que fiz no estágio". Blocos, na ordem do
     original: faixa vermelha ("Agentes de IA, automações e sistemas internos · do protótipo ao
     servidor"); topo preto "MB · Projetos do Matheus" com Catálogo, Como eu trabalho, Dúvidas e o
     botão verde "Falar comigo" (leva ao contato); abertura escura com o selo "Problema parado é tempo
     perdido", o título "Do problema ao sistema no ar", o texto e os caminhos "Ver o catálogo" e
     "Falar comigo", com ilustração (notebook com código, servidor e ESP32) no lugar da foto; o filtro
     sobreposto (Área, Feito com, Situação, "Ver projetos"), no lugar do seletor de veículo; quatro
     selos (Servidor próprio, IA em uso de verdade, Testado antes de entregar, Do hardware à web);
     Áreas (Agentes de IA, Automações, Hardware); **Projetos em destaque = os quatro casos
     principais**, com prints reais (o Bot com ilustração) e link para a parada correspondente da
     viagem; "Como eu trabalho" em 3 passos (entendo o problema; construo com IA, com o Claude Code
     como equipe; coloco no ar e acompanho); a faixa verde "Tem um problema que dá para automatizar?";
     e Dúvidas frequentes (projetos em uso, tecnologias, onde estuda e trabalha), só com fatos da
     seção 6.
   - **Janela 2: a aba Catálogo**, no visual sóbrio da lista real (lateral com busca e categorias,
     contador, grade de cartões brancos), **com os outros projetos no lugar das peças**. Busca e
     filtro funcionam de verdade. Cartão: ilustração, categoria, nome, "Serve para…", "Feito com…" e
     "Ver projeto". Sem etiqueta de código.
   - **Janelas 3 a 7, as fichas:** extrator de faturas, monitor do mercado de confiança, robô
     desviador, central de celulares e comanda, cada uma como página no visual da vitrine (selo,
     título condensado, dois caminhos, ilustração, três selos embaixo), com os textos da seção 6.
     **Sem códigos tipo MB-01** (ele não gostou).
   - **Ilustrações simples**, pedidas por ele: um objeto por projeto em vista oblíqua, contorno
     preto, faces brancas, lado vermelho ou laranja, sombra dura e pequenas estrelas (estilo
     derivado da skill `illustration-teal-spot`, com as cores da vitrine). São SVG gerados no
     próprio código.
   - Em telas pequenas as janelas viram blocos normais, com altura livre.
6. **Caixa de ferramentas (Matter.js):** quando a seção aparece, as ferramentas caem e podem ser
   arrastadas e jogadas; botão "Chacoalhar".
7. **Infraestrutura:** Você → Cloudflare → VPS Hetzner → Dokploy → Containers, com um ponto de luz
   percorrendo o caminho, e a lista do que roda lá: este site, findbus.com.br, radar de preços,
   demonstração do radar, painéis internos.
8. **O que eu faço:** quatro linhas em tipografia grande (Agentes de IA, Automações, Interfaces,
   Deploy e infra), cada uma levando ao caso correspondente.
9. **Contato** (vermelho): "Vamos conversar?", botão redondo atraído pelo mouse que copia o e-mail,
   e o e-mail visível.
10. **Rodapé:** nome, cidade, LinkedIn, GitHub.

Rolagem suave com Lenis (um motor só), animações com GSAP + ScrollTrigger, cursor próprio só em
mouse (não em toque).

## 6. Conteúdo e números (conferidos; não usar outros)

| Item | Texto ou número | Fonte |
|---|---|---|
| Apresentação | AI Builder · Engenharia de Computação na UFG, Goiânia | currículo |
| Bot: problema | O funcionário da garagem tinha que ir pessoalmente até alguém do laboratório para pedir peça ou relatar defeito | o Matheus, 17/11/2026 |
| Bot: solução | 3 agentes (Triagem, Pedido, Ocorrência) no n8n, OpenAI, Evolution API, memória no Postgres, passagem para humano fora do escopo | currículo/README |
| Bot: resultado | Pedido sai do celular, a qualquer hora, e fica registrado; testes com agentes que simulam funcionários (personas) | currículo/README |
| FindBus | 12,6 mil visitas por mês (Cloudflare, 30 dias até 17/11/2026); 630 visitas nos 3 primeiros dias; cache em 3 camadas (Redis, Cloudflare, navegador) | currículo |
| Radar | coletor com navegador real por IP brasileiro; servidor no Dokploy; alertas na meta, na volta ao estoque e no menor preço em 30 dias; nunca compra | README do radar |
| Radar demo | https://radar-demo.hubdev.app (no ar desde 17/11/2026) | — |
| Hub Sim Racing | 9 versões publicadas, mais de 670 testes; site https://matheusbraga1106.github.io/hub-sim-racing/ ; GitHub público | README do perfil |
| Extrator de faturas | suspeitas de erro 217 → 63 em 9.820 faturas; Python e Tesseract; botão "Ver no GitHub ↗" (repo público `extrator-faturas-agua`) + "Sistema da pesquisa: restrito à UFG e ao TJGO" | currículo; o Matheus |
| Monitor do mercado de confiança | ESP32-S3 com câmera, em uso no CA da UFG desde out/2026; privado | currículo |
| Robô desviador | neuroevolução, sensores HC-SR04, "você joga, sua rede joga, e vocês competem"; repo público | GitHub |
| Central de celulares | celulares Android antigos como servidores: bateria, temperatura, rede, tela remota; Python, ADB, scrcpy; privado | README local |
| Comanda | lê a foto da comanda e monta a página para dividir a conta; skill do Claude; "Uso pessoal" | skill |

**Outras afirmações do mockup, também conferidas** (podem ser usadas como estão no `mistura.html`):

| Afirmação | Fonte |
|---|---|
| FindBus mostra se o ônibus que está chegando tem ar-condicionado | README do perfil |
| Hub Sim Racing: volante, câmbio, pedais e telemetria numa janela, volante em 3D, celular como painel, para Windows, gratuito; feito com subagentes do Claude Code | site público do Hub Sim Racing; README do perfil |
| Monitor do mercado: câmera e sensores (ESP32-S3) e painel de auditoria | README do perfil |
| "Deploy a cada push" | autodeploy ligado nos projetos dele no Dokploy |
| "Agentes, automações e sistemas internos" | README do perfil |
| Nome do empregador "Grupo Odilon Santos" | já público no currículo e no README do perfil. O veto é sobre dados internos (código, IPs, números da operação), não sobre o nome |
| Gráfico do Radar: "SSD NVMe 1 TB (exemplo)", R$ 429 → R$ 374,90, meta R$ 380 | são os dados inventados da própria demonstração pública do Radar; sempre marcados como exemplo |
| Conversa do bot e painel do FindBus | dados de exemplo, sempre marcados como exemplo ou réplica |

A regra do anti-objetivo vale para **fatos sobre ele e os projetos**: nada além desta seção.
Dados de exemplo são permitidos desde que estejam marcados como exemplo na tela.

Ficaram **fora da vitrine** por decisão dele: Caçador de estágios, Caixa da impressora 3D e
3d-web-dev-skills.

**Imagens reais disponíveis** (já copiadas em `mockups/img/`): volante e painel de corrida do Hub
Sim Racing, busca e mapa do FindBus, demonstração do Radar. Origem:
`D:\Claude\simracing-hub\docs\prints\` e `OneDrive\Área de Trabalho\post-findbus\`. Não usar as
fotos de teste da geladeira (podem mostrar pessoas).

## 7. Domínio, hospedagem e deploy

- **Domínio:** um `.dev` com o nome dele, comprado na Cloudflare Registrar. **O nome ainda não está
  decidido** (ele vai conferir; `matheusbraga.dev` é o candidato). O código usa um nome provisório
  guardado num lugar só (por exemplo, uma constante no `sitemap.xml`, no `robots.txt` e nas tags
  canônica e Open Graph, trocada por um único buscar-e-substituir), e o nome final entra antes do
  deploy. A compra é dele.
- **DNS:** registro A do domínio (e `www`) apontando para a VPS, **com proxy da Cloudflare ligado**
  (o IP não pode aparecer). SSL/TLS da Cloudflare em "Full (strict)", como nos outros domínios.
- **Repositório novo e público** na conta MatheusBraga1106 (nome sugerido: `portfolio`; público
  confirmado por ele em 17/11/2026). O código também é vitrine: README caprichado em português
  (o que é, como rodar localmente, como fica no ar) e código limpo. Nada sensível entra: sem IPs,
  sem dados da empresa, sem `.env` real. Criar e dar push só com aprovação.
- **Pasta do código:** uma pasta nova e limpa, `D:\Claude\portfolio`, que vira o repositório.
  A pasta `D:\Claude\portfolio-matheus-braga` (anotações antigas, `index.html` de outra fase,
  mockups e este documento) **não** entra no repositório. Este documento e as imagens são copiados
  para a pasta nova quando o projeto começar (decisão do autor).
- **Container:** `nginx` (alpine) servindo os arquivos estáticos, com cabeçalhos de cache longo
  para `assets/` e curto para `index.html`, gzip, e cabeçalhos de segurança (CSP compatível com os
  scripts locais, `X-Content-Type-Options`, `Referrer-Policy`).
- **Compose:** um serviço `portfolio-web`, `expose: 80` (sem `ports`), rede externa
  `dokploy-network`. Nenhuma variável de ambiente é necessária, então o `.env` fica vazio (deixar
  um `.env.example` dizendo isso).
- **Dokploy:** projeto novo, serviço do tipo Compose apontando para o repositório, autodeploy
  ligado. Em Domains: o domínio → `portfolio-web`, porta 80, HTTPS, Let's Encrypt. **Depois de
  cadastrar o domínio, fazer outro Deploy.**
- **Entregável de deploy:** um `DEPLOY.md` no repositório com esse passo a passo, escrito para ele
  seguir sozinho.

## 8. O que fica para quem constrói

- Estrutura de pastas e divisão dos arquivos JS (uma página, sem build, ES modules ou scripts
  simples).
- **Bibliotecas copiadas para dentro do repositório** (`assets/vendor/`), nas versões já testadas
  no mockup: GSAP 3.12.5 + ScrollTrigger, Lenis 1.1.13, Three.js 0.160.0, Matter.js 0.19.0.
  Assim o site não depende de CDN de terceiros. Conferir a licença de cada uma.
- Fontes servidas localmente (Archivo, Big Shoulders Display, Geist, Geist Mono), com
  `font-display: swap`.
- Imagens convertidas para WebP ou AVIF, em tamanhos certos para cada uso, com `alt` descritivo.
  As texturas do 3D também otimizadas.
- Metadados: título, descrição, imagem de compartilhamento (Open Graph) feita a partir de uma tela
  real, favicon, `robots.txt` e `sitemap.xml` simples.
- **Qualidade:** testar em computador e celular de verdade, com teclado, com movimento reduzido e
  sem WebGL. A primeira tela tem que estar completa mesmo antes das animações. Meta: Lighthouse de
  desempenho e acessibilidade ≥ 90 no celular.
- **Navegação por clique sem `lenis.scrollTo`.** No mockup, o `scrollTo` do Lenis não se movia
  (nem com `immediate`) e o limite de rolagem dele ficava velho quando as janelas cresciam. A
  navegação usa uma animação própria sobre a rolagem nativa (o Lenis acompanha), cancelada por roda,
  toque ou tecla, e o layout das janelas chama `lenis.resize()` depois de mudar alturas.
- **Nenhum conteúdo pode começar invisível esperando um gatilho de rolagem.** No mockup, os cartões
  da vitrine ficaram sumidos porque a animação de entrada os escondia até um ScrollTrigger que nunca
  disparou (a abertura presa muda as posições). Regra: o conteúdo é visível por padrão; a animação
  só começa quando a seção já está na tela; filtro e trocas animam movimento, não transparência; e
  nada de `transition` de CSS na mesma propriedade que o GSAP anima.
- Tirar os ganchos de teste do mockup (`window.__box`, `window.__startBox`, selo "mockup").

## 9. Depois de no ar (com aprovação dele)

1. Trocar hubdev.app pela URL nova em
   `D:\Downloads\MedidorAR\curriculo\curriculo-ifood-ai-builder.html` e gerar o PDF de novo
   (Edge headless, `--print-to-pdf`).
2. Trocar no README do perfil (`D:\Downloads\MedidorAR\curriculo\github-perfil\README.md`) e
   publicar no repositório `MatheusBraga1106/MatheusBraga1106`.
3. Trocar o campo "website" do perfil do GitHub.
