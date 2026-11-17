import { test } from 'node:test';
import assert from 'node:assert/strict';
import { viagem, DWELL, MOVE, span } from '../../assets/js/viagem-estado.js';

const N = 4;
const SPAN = span(N);

test('começo da viagem: parada 0, nada andou', () => {
  const v = viagem(0, N);
  assert.equal(v.i, 0); assert.equal(v.f, 0); assert.equal(v.dw, 0); assert.equal(v.atual, 0);
});

test('fim da viagem: última parada, sem travessia', () => {
  const v = viagem(1, N);
  assert.equal(v.i, 3); assert.equal(v.f, 0); assert.equal(v.atual, 3);
});

test('o índice troca em f = 0.39, não na metade', () => {
  assert.equal(viagem((DWELL + MOVE * 0.38) / SPAN, N).atual, 0);
  assert.equal(viagem((DWELL + MOVE * 0.40) / SPAN, N).atual, 1);
});

test('mesma posição, mesmo estado, indo ou voltando', () => {
  const pontos = Array.from({ length: 50 }, (_, k) => k / 49);
  const ida = pontos.map((sp) => viagem(sp, N));
  const volta = [...pontos].reverse().map((sp) => viagem(sp, N)).reverse();
  assert.deepEqual(volta, ida);
});

test('valores fora de 0..1 ficam presos nas pontas', () => {
  assert.deepEqual(viagem(-0.5, N), viagem(0, N));
  assert.deepEqual(viagem(1.5, N), viagem(1, N));
});
