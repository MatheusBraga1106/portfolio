# Portfólio: arquivos estáticos servidos pelo nginx. Só o site entra na imagem (nada de testes ou scripts).
FROM nginx:1.27-alpine

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY seguranca.conf /etc/nginx/seguranca.conf

COPY ia/ /usr/share/nginx/html/ia/
COPY clientes/ /usr/share/nginx/html/clientes/
COPY assets/ /usr/share/nginx/html/assets/
COPY favicon.svg robots-ia.txt robots-clientes.txt sitemap-ia.xml sitemap-clientes.xml /usr/share/nginx/html/

EXPOSE 80
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --start-interval=1s CMD wget -qO- http://127.0.0.1/healthz || exit 1
