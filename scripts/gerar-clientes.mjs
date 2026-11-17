// Uso: node scripts/gerar-clientes.mjs (depois de mudar a versão IA, rode de novo e confira os testes).
// Gera clientes/index.html a partir de ia/index.html trocando só os textos (spec §5.1 e §6.2).
// Cada troca precisa achar o trecho exato; se não achar, para com erro.
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';

let p = readFileSync('ia/index.html', 'utf8');
const trocas = [
  // cabeçalho da página
  ['<title>Matheus Braga · AI Builder</title>', '<title>Matheus Braga · Sistemas sob medida</title>'],
  ['content="AI Builder, Engenharia de Computação na UFG. Agentes de IA, automações e sistemas internos, do protótipo ao servidor."', 'content="Atendimento automático no WhatsApp, painéis, alertas e sistemas sob medida, feitos e mantidos no ar por Matheus Braga, de Goiânia."'],
  // endereço e compartilhamento
  ['https://ia.matheusbragadev.com/', 'https://matheusbragadev.com/', 'todas'],
  ['/assets/img/og-ia.png', '/assets/img/og-clientes.png'],
  ['<meta property="og:title" content="Matheus Braga · AI Builder">', '<meta property="og:title" content="Matheus Braga · Sistemas sob medida">'],
  ['<meta property="og:description" content="Agentes de IA, automações e sistemas internos em uso, do protótipo ao servidor.">', '<meta property="og:description" content="Atendimento automático no WhatsApp, painéis, alertas e sistemas sob medida, no ar.">'],
  // abertura
  ['<h1><span class="sr">Construo com IA e coloco no ar.</span><span aria-hidden="true" class="split">Construo com IA e coloco no ar.</span>', '<h1 class="longa"><span class="sr">Do problema ao sistema funcionando.</span><span aria-hidden="true" class="split">Do problema ao sistema funcionando.</span>'],
  ['<p>AI Builder · Engenharia de Computação na UFG. Agentes, automações e sistemas internos, do protótipo ao meu próprio servidor.</p><a class="cta" href="#viagem" data-hover>Ver os projetos ↓</a>', '<p>Atendimento automático no WhatsApp, painéis, alertas e sistemas sob medida, feitos e mantidos no ar por mim.</p><a class="cta" href="#viagem" data-hover>Ver o que eu já fiz ↓</a>'],
  // faixa abaixo da abertura: resultados no lugar das ferramentas (as duas cópias da faixa)
  ['<span>n8n</span><i>✦</i><span>OpenAI</span><i>✦</i><span>Claude Code</span><i>✦</i><span>Python</span><i>✦</i><span>FastAPI</span><i>✦</i><span>Postgres</span><i>✦</i><span>Docker</span><i>✦</i><span>Dokploy</span><i>✦</i><span>Cloudflare</span><i>✦</i>', '<span>Atendimento no WhatsApp</span><i>✦</i><span>Painéis</span><i>✦</i><span>Alertas</span><i>✦</i><span>Sistemas internos</span><i>✦</i><span>Automações</span><i>✦</i><span>Sites</span><i>✦</i><span>Integrações</span><i>✦</i><span>Mantido no ar</span><i>✦</i>', 'todas'],
  // caso 1: bot
  ['<p class="short">Três agentes de IA no WhatsApp para as garagens de ônibus pedirem peças ao laboratório.</p>', '<p class="short">Atendimento no WhatsApp que funciona sozinho.</p>'],
  ['<div><dt>Problema</dt><dd>Para pedir uma peça ou relatar um defeito, o funcionário tinha que ir pessoalmente até alguém do laboratório.</dd></div>', '<div><dt>Problema</dt><dd>Para pedir uma peça, o funcionário tinha que ir pessoalmente ao laboratório.</dd></div>'],
  ['<div><dt>Solução</dt><dd>Agentes Triagem, Pedido e Ocorrência (n8n, OpenAI, Evolution API), memória no Postgres e passagem para um humano.</dd></div>', '<div><dt>Solução</dt><dd>Um atendente no WhatsApp que entende o pedido, pede foto quando precisa, registra tudo e chama uma pessoa quando o assunto foge do combinado.</dd></div>'],
  ['<div><dt>Resultado</dt><dd>O pedido sai do celular, a qualquer hora, e fica registrado. Testado por agentes que simulam funcionários.</dd></div>', '<div><dt>Resultado</dt><dd>O pedido sai do celular, a qualquer hora, e nada se perde.</dd></div>'],
  // caso 2: FindBus
  ['<p>Mostra se o ônibus que está chegando tem ar-condicionado. Cache em 3 camadas (Redis, Cloudflare e navegador).</p>', '<p>Informação em tempo real para a cidade inteira: mostra se o ônibus que está chegando tem ar-condicionado, rápido mesmo com muita gente acessando.</p>'],
  // caso 3: Radar
  ['<p>Um coletor com navegador real sai por IP brasileiro, o servidor no Dokploy guarda o histórico e avisa no Telegram: na meta, na volta ao estoque e no menor preço em 30 dias. Nunca compra nada.</p>', '<p>Alertas automáticos de preço: acompanha várias lojas e avisa no Telegram quando bate a meta, quando volta ao estoque ou quando chega ao menor preço do mês. Nunca compra nada.</p>'],
  // caso 4: Hub Sim Racing
  ['<p>Volante, câmbio, pedais e telemetria dos jogos numa janela só, com o volante em 3D e o celular como painel. 9 versões e mais de 670 testes, feito com subagentes do Claude Code.</p>', '<p>Um aplicativo com cara de produto: volante, câmbio, pedais e telemetria numa janela só, com 3D e o celular como painel. 9 versões publicadas, gratuito.</p>'],
  // landing da vitrine
  ['<div class="win-faixa">Agentes de IA, automações e sistemas internos · do protótipo ao servidor</div>', '<div class="win-faixa">Sistemas sob medida · do primeiro esboço ao sistema no ar</div>', 'todas'],
  ['<a href="#lj-como" data-inner="lj-como">Como eu trabalho</a>', '<a href="#lj-como" data-inner="lj-como">Como funciona</a>'],
  ['<p class="lj-heroi-texto">Construo agentes de IA, automações e sistemas internos, e coloco tudo no ar no meu próprio servidor. Veja o que já está em uso ou me conte um problema novo.</p>', '<p class="lj-heroi-texto">Atendimento automático, painéis, alertas e sistemas feitos sob medida para o seu problema, e mantidos no ar por mim. Veja o que já está em uso ou me conte o seu caso.</p>'],
  ['aria-label="Ilustração: notebook com código, servidor e placa ESP32"', 'aria-label="Ilustração: notebook, servidor e uma placa eletrônica"'],
  ['<label>Área<span>IA, automação, hardware ▾</span></label><label>Feito com<span>Python, n8n, ESP32… ▾</span></label><label>Situação<span>No ar ou em uso ▾</span></label>', '<label>O que você precisa<span>Atendimento, painel, alerta ▾</span></label><label>Para quem<span>Equipe, clientes, uso próprio ▾</span></label><label>Situação<span>No ar ou em uso ▾</span></label>'],
  ['<div><i>▤</i><strong>Servidor próprio</strong><span>Hetzner, Dokploy e Cloudflare, mantidos por mim</span></div>', '<div><i>▤</i><strong>Feito sob medida</strong><span>Para o problema da sua rotina, não um pacote pronto</span></div>'],
  ['<div><i>✦</i><strong>IA em uso de verdade</strong><span>Agentes atendendo pessoas, não só demonstração</span></div>', '<div><i>✦</i><strong>Fica no ar com segurança</strong><span>Domínio próprio, HTTPS e eu cuido do servidor</span></div>'],
  ['<div><i>✓</i><strong>Testado antes de entregar</strong><span>Testes automáticos e agentes que simulam usuários</span></div>', '<div><i>✓</i><strong>Testado antes de entregar</strong><span>Simulado com casos reais antes de chegar em você</span></div>'],
  ['<div><i>⚙</i><strong>Do hardware à web</strong><span>ESP32, Arduino, impressão 3D e interfaces</span></div>', '<div><i>⚙</i><strong>Acompanho depois</strong><span>Ajustes conforme o uso de verdade</span></div>'],
  ['<h4 class="lj-tit">Áreas</h4><p class="lj-sub">Navegue pelo tipo de projeto.</p>', '<h4 class="lj-tit">Áreas</h4><p class="lj-sub">O que eu já resolvi, por tipo de problema.</p>'],
  ['<a href="#" data-win="1">Agentes de IA<span>bot no WhatsApp, skill do Claude</span></a><a href="#" data-win="1">Automações<span>coleta, alertas, extração de dados</span></a><a href="#" data-win="1">Hardware<span>ESP32, sensores, robô</span></a>', '<a href="#" data-win="1">Atendimento automático<span>WhatsApp que responde e registra</span></a><a href="#" data-win="1">Painéis e sistemas<span>informação organizada num lugar só</span></a><a href="#" data-win="1">Alertas e automações<span>aviso na hora certa</span></a>'],
  ['<small>Agente de IA · estágio</small><b>Bot do Laboratório 3D</b><em>3 agentes no WhatsApp, em uso</em>', '<small>Atendimento · estágio</small><b>Bot do Laboratório 3D</b><em>Atende pelo WhatsApp, em uso</em>'],
  ['<h4 class="lj-tit">Como eu trabalho</h4><p class="lj-sub">Do problema ao sistema em uso, com a IA como parte da equipe.</p>', '<h4 class="lj-tit">Como funciona</h4><p class="lj-sub">Do seu problema ao sistema funcionando.</p>'],
  ['<div><b>01</b><h5>Entendo o problema</h5><p>Converso com quem usa e escrevo o que precisa ser resolvido antes de escrever código.</p></div>', '<div><b>01</b><h5>Você me conta o problema</h5><p>O que acontece hoje e o que você queria que acontecesse.</p></div>'],
  ['<div><b>02</b><h5>Construo com IA</h5><p>Claude Code como equipe: plano primeiro, tarefas divididas entre subagentes e revisão a cada entrega.</p></div>', '<div><b>02</b><h5>Eu mostro a solução antes</h5><p>Você vê como vai ficar antes de eu construir.</p></div>'],
  ['<div><b>03</b><h5>Coloco no ar e acompanho</h5><p>Deploy no meu servidor com Docker e Dokploy, e ajustes depois do uso real.</p></div>', '<div><b>03</b><h5>Entrego no ar e acompanho</h5><p>Funcionando no seu endereço, com ajustes depois do uso real.</p></div>'],
  ['<details><summary>Com quais tecnologias você trabalha?</summary><p>Python, FastAPI, n8n, OpenAI e Claude, PostgreSQL, Docker e Dokploy. No frontend, HTML, CSS e JavaScript puros.</p></details>', '<details><summary>Que tipo de problema dá para resolver?</summary><p>Atendimento que se repete, informação espalhada em planilhas, avisos que dependem de alguém lembrar e sistemas internos que ainda não existem.</p></details>'],
  // catálogo: sem "Feito com"
  ['<em>Feito com Python e Tesseract</em>', '<em>9.820 faturas conferidas</em>'],
  ['<em>Feito com ESP32-S3 e câmera</em>', '<em>Em uso desde out/2026</em>'],
  ['<em>Feito com Python e Arduino</em>', '<em>Você joga contra a rede</em>'],
  ['<em>Feito com Python, ADB e scrcpy</em>', '<em>Bateria, rede e tela remota</em>'],
  ['<em>Feito como skill do Claude</em>', '<em>Divide por pessoa, com a taxa</em>'],
  // fichas: sem ferramentas
  ['<p>Extrai as faturas de água de órgãos públicos, com OCR para documentos digitalizados e validação cruzada entre os campos.</p>', '<p>Extrai as faturas de água de órgãos públicos, lendo até documentos escaneados, e confere os campos entre si.</p>'],
  ['<div><b>HC-SR04</b><span>sensores ultrassônicos</span></div>', '<div><b>Sensores</b><span>de distância, como num carro</span></div>'],
  ['<p>Um robô que desvia de obstáculos com sensores HC-SR04. Você joga, a sua rede joga, e vocês competem.</p>', '<p>Um robô que desvia de obstáculos com sensores de distância. Você joga, a sua rede joga, e vocês competem.</p>'],
  ['<p>Uma central no computador acompanha celulares Android que viraram servidores: bateria, temperatura, rede e tela remota, com aviso quando algo foge do normal.</p>', '<p>Uma central no computador acompanha celulares antigos que viraram servidores: bateria, temperatura, rede e tela remota, com aviso quando algo foge do normal.</p>'],
  ['<span class="win-tag">Automação · Python</span>', '<span class="win-tag">Automação · Pesquisa</span>'],
  ['<div><b>OCR</b><span>Python e Tesseract</span></div>', '<div><b>Digitalizadas</b><span>lê até fatura escaneada</span></div>'],
  ['<span class="win-tag">Hardware · ESP32-S3</span>', '<span class="win-tag">Hardware · Centro Acadêmico</span>'],
  ['<p>Câmera e sensores com ESP32-S3 registram cada retirada na geladeira do Centro Acadêmico, e um painel faz a auditoria.</p>', '<p>Câmera e sensores registram cada retirada na geladeira do Centro Acadêmico, e um painel faz a auditoria.</p>'],
  ['<div><b>ESP32-S3</b><span>com câmera</span></div>', '<div><b>Câmera</b><span>em cada retirada</span></div>'],
  ['<span class="win-cam"><small>Feito com</small><strong>Python e Arduino</strong></span>', '<span class="win-cam"><small>Como funciona</small><strong>A rede aprende jogando</strong></span>'],
  ['<span class="win-tag">Infra · Python</span>', '<span class="win-tag">Infra</span>'],
  ['<span class="win-cam prin"><small>Feito com</small><strong>Python, ADB e scrcpy</strong></span>', '<span class="win-cam prin"><small>Para quem</small><strong>Quem usa celular antigo como servidor</strong></span>'],
  ['<span>comanda · skill do claude</span>', '<span>comanda · uso pessoal</span>'],
  ['<span class="win-tag">IA · Skill do Claude</span>', '<span class="win-tag">Inteligência artificial</span>'],
  ['<span class="win-selo">IA · Skill do Claude</span>', '<span class="win-selo">Inteligência artificial</span>'],
  // bloco de serviços
  ['<div class="lbl" style="color:var(--yellow)">IA no dia a dia</div>\n  <h2 id="h-uso">Como eu uso IA</h2>', '<div class="lbl" style="color:var(--yellow)">Serviços</div>\n  <h2 id="h-uso">O que eu posso fazer por você</h2>'],
  ['<li><b>Claude Code como equipe</b><span>Especificação e plano primeiro, tarefas divididas entre subagentes e revisão a cada entrega.</span></li>', '<li><b>Atendimento automático no WhatsApp</b><span>Responde, entende o pedido, registra e chama uma pessoa quando precisa.</span></li>'],
  ['<li><b>Vários agentes, um projeto</b><span>No estágio, o desenvolvimento é dividido entre 3 frentes do Claude (sistema, WhatsApp e coleta de dados), que conversam por contratos de API.</span></li>', '<li><b>Painéis e sistemas internos</b><span>A informação da sua operação organizada num lugar só, com acesso protegido.</span></li>'],
  ['<li><b>Testes com agentes</b><span>O bot do laboratório é testado por agentes que simulam funcionários com perfis diferentes.</span></li>', '<li><b>Alertas e automações</b><span>Avisos na hora certa e tarefas repetitivas feitas sozinhas.</span></li>'],
  ['<li><b>IA fora do chat</b><span>Integrações via MCP, como a do Fusion 360, em que o Claude modelou uma peça aprovada na primeira impressão.</span></li>', '<li><b>Sites e aplicativos com cara de produto</b><span>Interfaces caprichadas, rápidas e no seu próprio endereço.</span></li>'],
  // O que eu faço (as quatro linhas grandes) com os nomes de serviço
  ['<ul><li><a href="#p1" data-hover>Agentes de IA <span>n8n · OpenAI · Claude</span></a></li><li><a href="#p3" data-hover>Automações <span>coleta · alertas · OCR</span></a></li><li><a href="#p4" data-hover>Interfaces <span>HTML · CSS · JS · 3D</span></a></li><li><a href="#infra" data-hover>Deploy e infra <span>Docker · Dokploy · Cloudflare</span></a></li></ul>',
   '<ul><li><a href="#p1" data-hover>Atendimento automático <span>WhatsApp</span></a></li><li><a href="#p2" data-hover>Painéis e sistemas <span>sob medida</span></a></li><li><a href="#p3" data-hover>Alertas e automações <span>na hora certa</span></a></li><li><a href="#p4" data-hover>Sites e aplicativos <span>com cara de produto</span></a></li></ul>'],
];
for (const [de, para, todas] of trocas) {
  if (!p.includes(de)) throw new Error('não achei: ' + de.slice(0, 90));
  p = todas ? p.split(de).join(para) : p.replace(de, para);
}
mkdirSync('clientes', { recursive: true });
writeFileSync('clientes/index.html', p);
console.log('clientes/index.html gerado com', trocas.length, 'trocas');
