// Uso: node scripts/gerar-clientes.mjs (depois de mudar a versão IA, rode de novo e confira os testes).
// Gera clientes/index.html a partir de ia/index.html trocando só os textos (spec §5.1 e §6.2).
// Cada troca precisa achar o trecho exato; se não achar, para com erro.
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';

let p = readFileSync('ia/index.html', 'utf8');
const trocas = [
  // cabeçalho da página
  ['<title>Matheus Braga · AI Engineer</title>', '<title>Matheus Braga · Sistemas sob medida</title>'],
  ['content="AI Engineer, Engenharia de Computação na UFG. Sistemas que integram LLMs a processos reais, em produção, com testes automatizados, Docker e deploy no próprio servidor."', 'content="Atendimento automático no WhatsApp, painéis, alertas e sistemas sob medida, feitos e mantidos no ar por Matheus Braga, de Goiânia."'],
  // endereço e compartilhamento
  ['https://ia.matheusbragadev.com/', 'https://matheusbragadev.com/', 'todas'],
  ['/assets/img/og-ia.png', '/assets/img/og-clientes.png'],
  ['<meta property="og:title" content="Matheus Braga · AI Engineer">', '<meta property="og:title" content="Matheus Braga · Sistemas sob medida">'],
  ['<meta property="og:description" content="Sistemas que integram LLMs a processos reais, em produção, com testes automatizados e deploy no próprio servidor.">', '<meta property="og:description" content="Atendimento automático no WhatsApp, painéis, alertas e sistemas sob medida, no ar.">'],
  // abertura
  ['<h1><span class="sr">Construo com IA e coloco no ar.</span><span aria-hidden="true" class="split">Construo com IA e coloco no ar.</span>', '<h1 class="longa"><span class="sr">Do problema ao sistema funcionando.</span><span aria-hidden="true" class="split">Do problema ao sistema funcionando.</span>'],
  ['<p>AI Engineer · Engenharia de Computação na UFG. Engenharia de software com foco em IA: construo sistemas que integram LLMs a processos reais e coloco em produção, com testes automatizados, Docker e deploy no meu próprio servidor.</p><a class="cta" href="#viagem" data-hover>Ver os projetos ↓</a>', '<p>Atendimento automático no WhatsApp, painéis, alertas e sistemas sob medida, feitos e mantidos no ar por mim.</p><a class="cta" href="#viagem" data-hover>Ver o que eu já fiz ↓</a>'],
  // caso 1: bot
  ['<p class="short">Três agentes de IA no WhatsApp para as garagens de ônibus pedirem peças ao laboratório, num sistema com mais de 2.300 testes automatizados.</p>', '<p class="short">Atendimento no WhatsApp que funciona sozinho.</p>'],
  ['<div><dt>Problema</dt><dd>Para pedir uma peça ou relatar um defeito, o funcionário tinha que ir pessoalmente até alguém do laboratório.</dd></div>', '<div><dt>Problema</dt><dd>Para pedir uma peça, o funcionário tinha que ir pessoalmente ao laboratório.</dd></div>'],
  ['<div><dt>Solução</dt><dd>Agentes Triagem, Pedido e Ocorrência (n8n, OpenAI, Evolution API), memória no Postgres e passagem para um humano.</dd></div>', '<div><dt>Solução</dt><dd>Um atendente no WhatsApp que entende o pedido, pede foto quando precisa, registra tudo e chama uma pessoa quando o assunto foge do combinado.</dd></div>'],
  ['<div><dt>Resultado</dt><dd>O pedido sai do celular, a qualquer hora, e fica registrado. Testado por agentes que simulam funcionários.</dd></div>', '<div><dt>Resultado</dt><dd>O pedido sai do celular, a qualquer hora, e nada se perde.</dd></div>'],
  // a linha da stack do estágio é só da versão IA
  ['\n            <div><dt>Sistema</dt><dd>Python, FastAPI, PostgreSQL e Docker, com mais de 2.300 testes automatizados.</dd></div>', ''],
  // caso 2: FindBus
  ['<p>Mostra se o ônibus que está chegando tem ar-condicionado. Cache em 3 camadas (Redis, Cloudflare e navegador).</p>', '<p>Informação em tempo real para a cidade inteira: mostra se o ônibus que está chegando tem ar-condicionado, rápido mesmo com muita gente acessando.</p>'],
  // caso 3: Radar
  ['<p>Um coletor com navegador real sai por IP brasileiro, o servidor no Dokploy guarda o histórico e avisa no Telegram: na meta, na volta ao estoque e no menor preço em 30 dias. Nunca compra nada.</p>', '<p>Alertas automáticos de preço: acompanha várias lojas e avisa no Telegram quando bate a meta, quando volta ao estoque ou quando chega ao menor preço do mês. Nunca compra nada.</p>'],
  // caso 4: Hub Sim Racing
  ['<p>Volante, câmbio, pedais e telemetria dos jogos numa janela só, com o volante em 3D e o celular como painel. 9 versões e mais de 670 testes, feito com subagentes do Claude Code.</p>', '<p>Um aplicativo com cara de produto: volante, câmbio, pedais e telemetria numa janela só, com 3D e o celular como painel. 9 versões publicadas, gratuito.</p>'],
  // landing da vitrine
  ['<div class="win-faixa">Agentes de IA, automações e sistemas internos · do protótipo ao servidor</div>', '<div class="win-faixa">Sistemas sob medida · do primeiro esboço ao sistema no ar</div>', 'todas'],
  ['<p class="lj-heroi-texto">Construo agentes de IA, automações e sistemas internos, e coloco tudo no ar no meu próprio servidor. Veja o que já está em uso ou me conte um problema novo.</p>', '<p class="lj-heroi-texto">Atendimento automático, painéis, alertas e sistemas feitos sob medida para o seu problema, e mantidos no ar por mim. Veja o que já está em uso ou me conte o seu caso.</p>'],
  ['aria-label="Ilustração: notebook com código, servidor e placa ESP32"', 'aria-label="Ilustração: notebook, servidor e uma placa eletrônica"'],
  // catálogo: sem "Feito com"
  ['<em>Feito com Python e Tesseract</em>', '<em>9.820 faturas conferidas</em>'],
  ['<em>Feito com ESP32-S3 e câmera</em>', '<em>Em uso desde out/2026</em>'],
  ['<em>Feito com Python e Arduino</em>', '<em>Você joga contra a rede</em>'],
  ['<em>Feito com Python, ADB e scrcpy</em>', '<em>Bateria, rede e tela remota</em>'],
  ['<em>Feito como skill do Claude</em>', '<em>Divide por pessoa, com a taxa</em>'],
  // bloco de serviços
  ['<div class="lbl" style="color:var(--yellow)">IA no dia a dia</div>\n  <h2 id="h-uso">Como eu uso IA</h2>', '<div class="lbl" style="color:var(--yellow)">Serviços</div>\n  <h2 id="h-uso">O que eu posso fazer por você</h2>'],
  ['<li><b>Claude Code como equipe</b><span>Especificação e plano primeiro, tarefas divididas entre subagentes e revisão a cada entrega.</span></li>', '<li><b>Atendimento automático no WhatsApp</b><span>Responde, entende o pedido, registra e chama uma pessoa quando precisa.</span></li>'],
  ['<li><b>Vários agentes, um projeto</b><span>No estágio, o desenvolvimento é dividido entre 3 frentes do Claude (sistema, WhatsApp e coleta de dados), que conversam por contratos de API.</span></li>', '<li><b>Painéis e sistemas internos</b><span>A informação da sua operação organizada num lugar só, com acesso protegido.</span></li>'],
  ['<li><b>Testes com agentes</b><span>O bot do laboratório é testado por agentes que simulam funcionários com perfis diferentes.</span></li>', '<li><b>Alertas e automações</b><span>Avisos na hora certa e tarefas repetitivas feitas sozinhas.</span></li>'],
  ['<li><b>IA fora do chat</b><span>Integrações via MCP, como a do Fusion 360, em que o Claude modelou uma peça aprovada na primeira impressão.</span></li>', '<li><b>Sites e aplicativos com cara de produto</b><span>Interfaces caprichadas, rápidas e no seu próprio endereço.</span></li>'],
];
for (const [de, para, todas] of trocas) {
  if (!p.includes(de)) throw new Error('não achei: ' + de.slice(0, 90));
  p = todas ? p.split(de).join(para) : p.replace(de, para);
}
mkdirSync('clientes', { recursive: true });
writeFileSync('clientes/index.html', p);
console.log('clientes/index.html gerado com', trocas.length, 'trocas');
