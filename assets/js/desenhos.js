// Ilustrações dos projetos: objetos em vista oblíqua, contorno preto, faces brancas, lado vermelho ou laranja,
// sombra dura e pequenas estrelas (estilo derivado da skill illustration-teal-spot, nas cores da vitrine).
// Funções puras: devolvem o conteúdo de um <svg>. Portado do mockup Mistura v9.

var INK = '#151515', RED = '#d6301f', ORG = '#ff6a2b', PALE = '#f6dcd6', GRAY = '#d9d9d9', W = '#ffffff', GRN = '#1f9d57', BG = '#f2f2f2';
var S = ' stroke="' + INK + '" stroke-width="1.6" stroke-linejoin="round"';
function pts(a){ return a.map(function(p){ return p[0].toFixed(1) + ',' + p[1].toFixed(1); }).join(' '); }
function box(x, y, w, h, d, o){
  o = o || {}; var ox = d * .55, oy = -d * .42, sh = o.shadow === false ? '' : '<polygon points="' + pts([[x + 9, y + 8], [x + ox + 9, y + oy + 8], [x + w + ox + 9, y + oy + 8], [x + w + ox + 9, y + h + oy + 8], [x + w + 9, y + h + 8], [x + 9, y + h + 8]]) + '" fill="' + INK + '"/>';
  return sh +
    '<polygon points="' + pts([[x + w, y], [x + w + ox, y + oy], [x + w + ox, y + h + oy], [x + w, y + h]]) + '" fill="' + (o.side || RED) + '"' + S + '/>' +
    '<polygon points="' + pts([[x, y], [x + ox, y + oy], [x + w + ox, y + oy], [x + w, y]]) + '" fill="' + (o.top || W) + '"' + S + '/>' +
    '<rect x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '" fill="' + (o.front || W) + '"' + S + '/>';
}
function r(x, y, w, h, f, rx){ return '<rect x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '" rx="' + (rx || 2) + '" fill="' + f + '"/>'; }
function c(cx, cy, rr, f, st){ return '<circle cx="' + cx + '" cy="' + cy + '" r="' + rr + '" fill="' + f + '"' + (st ? S : '') + '/>'; }
function l(x1, y1, x2, y2, col, wd){ return '<line x1="' + x1 + '" y1="' + y1 + '" x2="' + x2 + '" y2="' + y2 + '" stroke="' + (col || INK) + '" stroke-width="' + (wd || 1.6) + '" stroke-linecap="round"/>'; }
function spark(x, y, s){ return '<path d="M' + x + ' ' + (y - s) + ' Q' + x + ' ' + y + ' ' + (x + s) + ' ' + y + ' Q' + x + ' ' + y + ' ' + x + ' ' + (y + s) + ' Q' + x + ' ' + y + ' ' + (x - s) + ' ' + y + ' Q' + x + ' ' + y + ' ' + x + ' ' + (y - s) + 'Z" fill="' + INK + '"/>'; }
function coin(cx, cy, rr, top, glyph){ return '<ellipse cx="' + (cx + 7) + '" cy="' + (cy + 9) + '" rx="' + rr + '" ry="' + rr * .62 + '" fill="' + INK + '"/><ellipse cx="' + cx + '" cy="' + (cy + 6) + '" rx="' + rr + '" ry="' + rr * .62 + '" fill="' + RED + '"' + S + '/><ellipse cx="' + cx + '" cy="' + cy + '" rx="' + rr + '" ry="' + rr * .62 + '" fill="' + top + '"' + S + '/>' + (glyph || ''); }
function check(cx, cy){ return c(cx, cy, 8, GRN) + '<path d="M' + (cx - 4) + ' ' + cy + ' l3 3 l5 -6" fill="none" stroke="#fff" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>'; }
function lines(x, y, w, n, gap, col){ var s = ''; for (var i = 0; i < n; i++) s += r(x, y + i * gap, w * (i % 3 === 2 ? .6 : i % 2 ? .8 : 1), 5, col || GRAY, 2.5); return s; }


const ILU = {
  faturas: function(){
    var s = '';
    [[34, 128], [50, 112], [66, 96]].forEach(function(p, i){ s += box(p[0], p[1], 118, 150, 7, { side: GRAY }) + lines(p[0] + 14, p[1] + 22, 80, 6, 15) + r(p[0] + 12, p[1] + 112, 40, 20, RED, 3) + '<text x="' + (p[0] + 32) + '" y="' + (p[1] + 126) + '" text-anchor="middle" font-family="Geist Mono, monospace" font-size="11" font-weight="600" fill="#fff">PDF</text>'; });
    s += '<path d="M212 190 H262" stroke="' + INK + '" stroke-width="7" stroke-linecap="round"/><path d="M254 176 L272 190 L254 204" fill="none" stroke="' + INK + '" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/>';
    s += box(290, 118, 150, 136, 26, { side: RED });
    s += r(290.8, 118.8, 148.4, 22, PALE, 0);
    for (var i = 0; i < 4; i++) { s += lines(302, 154 + i * 24, 70, 1, 0) + (i === 2 ? c(420, 156 + i * 24, 8, ORG) + l(420, 152 + i * 24, 420, 158 + i * 24, '#fff', 2.2) + c(420, 162.5 + i * 24, 1.3, '#fff') : check(420, 156 + i * 24)); }
    s += l(390, 141, 390, 254, GRAY, 1.2);
    return s + spark(276, 78, 7) + spark(290, 92, 4) + spark(452, 288, 5);
  },
  geladeira: function(){
    var s = box(64, 196, 64, 40, 12, { front: INK, top: '#3a3a3a', side: '#000' });
    for (var i = 0; i < 6; i++) s += l(70 + i * 10, 236, 70 + i * 10, 246, INK, 2);
    s += c(80, 210, 3, ORG) + r(92, 206, 26, 6, '#555', 2);
    s += box(170, 104, 124, 196, 62, { side: RED });
    s += l(170, 168, 294, 168) + r(276, 120, 6, 36, INK, 3) + r(276, 182, 6, 60, INK, 3);
    s += box(206, 66, 50, 22, 20, { side: ORG }) + c(231, 77, 7, INK) + c(231, 77, 2.6, '#fff');
    s += '<path d="M231 92 L196 160 M231 92 L266 160" stroke="' + ORG + '" stroke-width="1.6" stroke-dasharray="4 5" fill="none"/>';
    s += box(334, 122, 112, 76, 10, { side: PALE }) + r(346, 134, 60, 6, INK, 3) + lines(346, 150, 84, 3, 13) + r(346, 186, 84, 6, RED, 3);
    return s + spark(150, 64, 7) + spark(164, 78, 4) + spark(452, 236, 5);
  },
  robo: function(){
    var s = box(150, 54, 180, 84, 10, { side: PALE });
    var L1 = [[180, 76], [180, 100], [180, 124]], L2 = [[240, 70], [240, 96], [240, 122]], L3 = [[300, 84], [300, 112]];
    L1.forEach(function(a){ L2.forEach(function(b){ s += l(a[0], a[1], b[0], b[1], GRAY, 1.2); }); });
    L2.forEach(function(a){ L3.forEach(function(b){ s += l(a[0], a[1], b[0], b[1], GRAY, 1.2); }); });
    L1.concat(L2).concat(L3).forEach(function(p, i){ s += c(p[0], p[1], 7, i === 4 || i === 6 ? RED : W, true); });
    s += box(40, 232, 46, 58, 34, { side: ORG }) + box(392, 222, 42, 68, 32, { side: ORG });
    s += box(170, 206, 130, 72, 58, { side: RED });
    s += c(208, 240, 16, W, true) + c(208, 240, 9, GRAY) + c(262, 240, 16, W, true) + c(262, 240, 9, GRAY);
    s += c(192, 284, 13, INK) + c(282, 284, 13, INK) + c(192, 284, 4, '#777') + c(282, 284, 4, '#777');
    s += '<path d="M150 236 q-12 6 0 12 M140 230 q-22 12 0 24" fill="none" stroke="' + ORG + '" stroke-width="2.2" stroke-linecap="round"/>';
    s += '<path d="M320 236 q12 6 0 12 M330 230 q22 12 0 24" fill="none" stroke="' + ORG + '" stroke-width="2.2" stroke-linecap="round"/>';
    return s + spark(352, 60, 7) + spark(366, 74, 4) + spark(110, 180, 5);
  },
  celulares: function(){
    var s = box(232, 66, 196, 124, 14, { side: GRAY });
    s += r(242, 76, 176, 104, INK, 3);
    [['#5fd38d', .8], ['#ffb347', .45], ['#ff6b5b', .18]].forEach(function(b, i){ s += r(256, 92 + i * 28, 64, 6, '#444', 3) + r(330, 90 + i * 28, 74, 10, '#333', 3) + r(330, 90 + i * 28, 74 * b[1], 10, b[0], 3); });
    s += r(318, 200, 22, 24, GRAY, 0) + '<rect x="292" y="222" width="76" height="10" rx="3" fill="' + GRAY + '"' + S + '/>';
    [[46, 160, '#5fd38d', .8], [118, 150, '#ffb347', .45], [190, 160, '#ff6b5b', .18]].forEach(function(p){
      s += box(p[0], p[1], 56, 108, 9, { side: RED }) + r(p[0] + 6, p[1] + 8, 44, 82, INK, 4) + r(p[0] + 13, p[1] + 20, 30, 12, '#333', 3) + r(p[0] + 13, p[1] + 20, 30 * p[3], 12, p[2], 3) + lines(p[0] + 13, p[1] + 42, 30, 3, 11, '#555') + c(p[0] + 28, p[1] + 99, 3.4, INK);
      s += '<path d="M' + (p[0] + 28) + ' ' + (p[1] + 108) + ' C ' + (p[0] + 28) + ' 300, 300 300, 330 236" fill="none" stroke="' + INK + '" stroke-width="2.2"/>';
    });
    return s + spark(212, 60, 7) + spark(226, 74, 4) + spark(452, 270, 5);
  },
  comanda: function(){
    var s = box(126, 52, 156, 236, 9, { side: GRAY });
    var zig = 'M126 288'; for (var i = 0; i < 13; i++) zig += ' l6 10 l6 -10'; zig += ' V300 H126Z';
    s += '<path d="' + zig + '" fill="' + BG + '"/>';
    s += r(142, 68, 70, 8, INK, 3) + l(142, 88, 266, 88, GRAY, 1.2);
    for (var k = 0; k < 6; k++) s += r(142, 100 + k * 22, 80 - (k % 3) * 14, 6, GRAY, 3) + r(236, 100 + k * 22, 30, 6, k % 2 ? RED : '#999', 3);
    s += l(142, 238, 266, 238, INK, 1.4) + r(142, 248, 50, 9, INK, 3) + r(220, 247, 46, 11, RED, 3);
    [[370, 92], [394, 176], [362, 258]].forEach(function(p, i){
      s += '<path d="M282 ' + (150 + i * 30) + ' C 320 ' + (150 + i * 30) + ', ' + (p[0] - 60) + ' ' + p[1] + ', ' + (p[0] - 34) + ' ' + p[1] + '" fill="none" stroke="' + INK + '" stroke-width="1.6" stroke-dasharray="4 5"/>';
      s += coin(p[0], p[1], 26, i === 1 ? ORG : W, '<text x="' + p[0] + '" y="' + (p[1] + 5) + '" text-anchor="middle" font-family="Archivo, sans-serif" font-weight="800" font-size="15" fill="' + INK + '">R$</text>');
    });
    return s + spark(98, 74, 7) + spark(112, 88, 4) + spark(450, 300, 5);
  }
};

ILU.oficina = function(){
  var s = '<rect x="0" y="0" width="480" height="340" rx="10" fill="#ececec"/>';
  s += box(250, 96, 150, 170, 60, { side: RED });
  for (var i = 0; i < 4; i++) s += r(266, 116 + i * 36, 96, 20, '#2a2a2a', 3) + c(376, 126 + i * 36, 4, i === 2 ? ORG : '#5fd38d');
  s += box(70, 120, 180, 112, 10, { side: GRAY }) + r(80, 130, 160, 92, INK, 4);
  [[92, 146, 60, ORG], [104, 162, 90, GRAY], [104, 178, 70, GRAY], [92, 194, 40, '#5fd38d'], [104, 210, 84, GRAY]].forEach(function(q){ s += r(q[0], q[1], q[2], 6, q[3], 3); });
  s += '<polygon points="50,240 270,240 286,256 66,256" fill="' + W + '" stroke="' + INK + '" stroke-width="1.6" stroke-linejoin="round"/><polygon points="58,247 68,253 270,253 262,247" fill="' + GRAY + '"/>';
  s += box(330, 268, 80, 34, 12, { front: INK, top: '#3a3a3a', side: '#000' }) + c(346, 285, 3, ORG) + r(358, 281, 40, 6, '#555', 2);
  s += '<path d="M370 268 C 370 240, 420 250, 400 210" fill="none" stroke="' + INK + '" stroke-width="2.2"/>';
  return s + spark(52, 70, 7) + spark(66, 84, 4) + spark(440, 60, 5);
};

const PECA = {
  bot: function(){ var s = box(96, 28, 92, 168, 10, { side: RED }) + r(104, 38, 76, 148, '#e9efe4', 5); s += r(112, 52, 46, 16, W, 6) + r(124, 76, 48, 16, '#cfe3c1', 6) + r(112, 100, 52, 16, W, 6) + r(128, 124, 44, 16, '#cfe3c1', 6) + r(112, 148, 40, 14, ORG, 7); return s + spark(222, 54, 6) + spark(60, 150, 4); }
};

/** Nomes dos desenhos grandes (480×340). */
export const NOMES_DESENHO = Object.keys(ILU);

/** Conteúdo SVG do desenho (viewBox 0 0 480 340). */
export function desenho(nome) {
  if (!Object.hasOwn(ILU, nome)) throw new Error('desenho desconhecido: ' + nome);
  return ILU[nome]();
}

/** Conteúdo SVG de uma peça pequena (viewBox 0 0 300 220). */
export function peca(nome) {
  if (!Object.hasOwn(PECA, nome)) throw new Error('peça desconhecida: ' + nome);
  return PECA[nome]();
}
