# Como colocar o portfólio no ar

Um container só serve as duas versões: `ia.matheusbrg.com` (vagas) e `matheusbrg.com` com `www.` (clientes).
Nenhuma variável de ambiente é necessária.

## 1. Comprar o domínio

1. No painel da Cloudflare, abra **Domain Registration → Register Domains**.
2. Procure `matheusbrg.com` e compre (cerca de US$ 10 por ano).

O domínio já fica com o DNS na Cloudflare.

## 2. DNS na Cloudflare

Em **matheusbrg.com → DNS → Records**, crie três registros do tipo **A**, todos apontando para o IP da sua VPS
e **com a nuvem laranja ligada (Proxied)**, para o IP não aparecer:

| Tipo | Nome | Conteúdo | Proxy |
|---|---|---|---|
| A | `@` | IP da VPS | Proxied |
| A | `www` | IP da VPS | Proxied |
| A | `ia` | IP da VPS | Proxied |

Em **SSL/TLS → Overview**, deixe o modo em **Full (strict)**, como nos outros domínios.

## 3. Projeto no Dokploy

1. Crie um projeto novo (por exemplo, **Portfolio**).
2. Adicione um serviço do tipo **Compose**:
   - **Provider:** GitHub, repositório `MatheusBraga1106/portfolio`, branch `main`;
   - **Compose path:** `docker-compose.yml`;
   - **Autodeploy:** ligado.
3. A aba **Environment** pode ficar vazia.
4. Clique em **Deploy** e espere terminar.

## 4. Domínios no Dokploy

Na aba **Domains** do serviço, adicione os três endereços. Todos vão para o mesmo serviço:

| Host | Service | Port | HTTPS | Certificate |
|---|---|---|---|---|
| `matheusbrg.com` | `portfolio-web` | 80 | ligado | Let's Encrypt |
| `www.matheusbrg.com` | `portfolio-web` | 80 | ligado | Let's Encrypt |
| `ia.matheusbrg.com` | `portfolio-web` | 80 | ligado | Let's Encrypt |

**Depois de cadastrar os domínios, clique em Deploy de novo.** Domínio novo só passa a valer no deploy
seguinte. Sem isso, a Cloudflare mostra o erro 526 (aconteceu com a demonstração do Radar).

## 5. Conferir

- `https://matheusbrg.com` abre a versão **clientes** ("Do problema ao sistema funcionando.").
- `https://www.matheusbrg.com` abre a mesma versão.
- `https://ia.matheusbrg.com` abre a versão **IA** ("Construo com IA e coloco no ar.").
- `https://ia.matheusbrg.com/robots.txt` aponta para `https://ia.matheusbrg.com/sitemap.xml`.

Se aparecer o erro 526, confira se os três domínios estão com **Let's Encrypt** e faça outro Deploy.

## Atualizar depois

Com o autodeploy ligado, cada push na `main` publica sozinho. Depois de mudar a versão IA, rode
`node scripts/gerar-clientes.mjs` e os testes antes do push.
