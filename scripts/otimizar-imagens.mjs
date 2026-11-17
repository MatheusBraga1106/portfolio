// Converte os prints reais dos projetos para WebP (até 1400 px de largura, qualidade 82).
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
  const saida = join(destino, name + '.webp');
  await sharp(join(origem, arquivo)).resize({ width: 1400, withoutEnlargement: true }).webp({ quality: 82 }).toFile(saida);
  console.log(saida, Math.round((await stat(saida)).size / 1024) + ' KB');
}
