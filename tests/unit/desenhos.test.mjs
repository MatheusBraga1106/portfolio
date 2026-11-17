import { test } from 'node:test';
import assert from 'node:assert/strict';
import { desenho, peca, NOMES_DESENHO } from '../../assets/js/desenhos.js';

test('os seis desenhos existem', () => {
  assert.deepEqual([...NOMES_DESENHO].sort(), ['celulares', 'comanda', 'faturas', 'geladeira', 'oficina', 'robo']);
});

for (const nome of ['oficina', 'faturas', 'geladeira', 'robo', 'celulares', 'comanda']) {
  test(`desenho ${nome}: tem forma, sombra dura e nenhum número quebrado`, () => {
    const s = desenho(nome);
    assert.match(s, /<polygon/);
    assert.match(s, /fill="#151515"/);
    assert.doesNotMatch(s, /NaN|undefined/);
  });
}

test('peça do bot', () => {
  const s = peca('bot');
  assert.match(s, /<polygon/);
  assert.doesNotMatch(s, /NaN|undefined/);
});

test('nome desconhecido dá erro claro', () => {
  assert.throws(() => desenho('xyz'), { message: 'desenho desconhecido: xyz' });
  assert.throws(() => peca('xyz'), { message: 'peça desconhecida: xyz' });
});
