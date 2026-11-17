// Converte os prints reais dos projetos para WebP (até 1400 px, qualidade 82) e uma versão de 700 px
// para a colagem da abertura no celular.
// Uso: node scripts/otimizar-imagens.mjs [pasta-de-origem]
import sharp from 'sharp';
import { readdir, stat } from 'node:fs/promises';
import { join, parse } from 'node:path';

const origem = process.argv[2] || 'D:/Claude/portfolio-matheus-braga/mockups/img';
const destino = 'assets/img';
const nomes = ['racing-volante', 'racing-painel', 'findbus-busca', 'findbus-mapa', 'radar-demo'];

for (const arquivo of await readdir(origem)) {
  const { name, ext } = parse(arquivo);
  if (ext !== '.png' || !nomes.includes(name)) continue;
  for (const [largura, sufixo] of [[1400, ''], [700, '-700']]) {
    const saida = join(destino, name + sufixo + '.webp');
    await sharp(join(origem, arquivo)).resize({ width: largura, withoutEnlargement: true }).webp({ quality: 82 }).toFile(saida);
    console.log(saida, Math.round((await stat(saida)).size / 1024) + ' KB');
  }
}
