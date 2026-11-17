// Estado da viagem horizontal, derivado SÓ da posição da rolagem (nada é guardado).
// Por isso voltar, pular e recarregar caem sempre no mesmo lugar.

export const DWELL = 1.15; // telas de rolagem paradas em cada caso, enquanto a interação dele anda
export const MOVE = 0.85; // telas de rolagem para atravessar até o próximo caso

/** Comprimento da viagem, em telas, para n paradas. */
export const span = (n) => n * DWELL + (n - 1) * MOVE;

const prender = (x) => (x < 0 ? 0 : x > 1 ? 1 : x);
const suave = (x) => x * x * (3 - 2 * x);

/**
 * sp: progresso da rolagem dentro da viagem (0 a 1); n: número de paradas.
 * Devolve { i: parada atual, dw: relógio da parada (0-1), f: travessia (0-1), fe: travessia suavizada,
 * atual: parada mostrada no índice (troca em f = 0.39, quando o título novo já está chegando) }.
 */
export function viagem(sp, n) {
  const ciclo = DWELL + MOVE;
  const total = span(n);
  const u = Math.min(total - 1e-5, prender(sp) * total);
  const i = Math.min(n - 1, Math.floor(u / ciclo));
  const local = u - i * ciclo;
  const dw = Math.min(1, local / DWELL);
  const f = i >= n - 1 ? 0 : prender((local - DWELL) / MOVE);
  return { i, dw, f, fe: suave(f), atual: Math.min(n - 1, f < 0.39 ? i : i + 1) };
}
