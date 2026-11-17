# Portfólio · Matheus Braga

Site pessoal em duas versões, servidas pelo mesmo container:

| Endereço | Versão | Para quem |
|---|---|---|
| [ia.matheusbragadev.com](https://ia.matheusbragadev.com) | IA | vagas e processos seletivos: como eu uso IA para construir |
| [matheusbragadev.com](https://matheusbragadev.com) | clientes | quem precisa de um sistema: o que eu faço e como fica |

As duas mostram os mesmos projetos reais (bot de WhatsApp com agentes de IA, FindBus, Radar de Preços,
Hub Sim Racing e outros), com uma abertura em 3D, uma viagem horizontal pelos casos e uma vitrine em
janelas empilhadas.

## Como é feito

- **HTML, CSS e JavaScript puros**, sem etapa de build. Cada seção tem o seu CSS e o seu módulo em `assets/`.
- **Bibliotecas e fontes dentro do repositório** (`assets/vendor/`, `assets/fonts/`), sem CDN. Licenças em `assets/vendor/LICENCAS.md`.
- **Movimento:** GSAP + ScrollTrigger, rolagem suave com Lenis, Three.js na abertura e Matter.js na caixa de ferramentas. No celular e com "reduzir movimento" a página fica completa sem eles.
- **Estado derivado da rolagem:** a viagem e as janelas da vitrine calculam tudo a partir da posição da rolagem, então voltar, pular e recarregar caem sempre no mesmo lugar.
- **No ar:** Cloudflare → VPS Linux → Dokploy → este container nginx, que escolhe a versão pelo endereço.

## Rodar localmente

Requer Node 24 e o Microsoft Edge (os testes usam o Edge instalado, sem baixar navegador).

```bash
npm install
```

```bash
npm run servir
```

Abra http://127.0.0.1:5320 e escolha a versão.

## Testes

```bash
npm test
```

```bash
npx playwright test
```

`npm test` cobre as partes puras (estado da viagem, ilustrações, arquivos de deploy). O Playwright abre as
duas versões no Edge e confere navegação, celular, movimento reduzido, metadados e se as partes comuns
continuam idênticas nas duas páginas.

## Mudar textos

A versão IA é `ia/index.html`. A versão clientes é gerada a partir dela, trocando só os textos:

```bash
node scripts/gerar-clientes.mjs
```

Se um texto de origem mudar, o script para e diz qual trecho não encontrou.

## Publicar

Passo a passo em [DEPLOY.md](DEPLOY.md).
