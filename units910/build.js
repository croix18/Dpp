// DPP Units 9 and 10: builds the five PDFs from content.json (lessons, posters, item notes), the forms plan
// and the rendered form images. Math is set by Cadence's own converter (forms/ctex.js) with KaTeX, in Lexend.
//   python3 units910/verify.py && python3 -c "...dump content.json..." && node units910/build.js
const fs = require('fs');
const path = require('path');
const { chromium } = require('/home/claude/dpp/node_modules/playwright');
const katex = require('/home/claude/dpp/node_modules/katex');
const CTEX = require('/home/claude/dpp/forms/ctex.js');

const ROOT = '/home/claude/dpp/';
const HERE = ROOT + 'units910/';
const OUT = ROOT + 'DPP Units 9 and 10/';
const HTML = HERE + 'html/';
const C = JSON.parse(fs.readFileSync(HERE + 'content.json', 'utf8'));
const PLAN = JSON.parse(fs.readFileSync(ROOT + 'forms/plan_forms.json', 'utf8')).bench;
const SPEC = JSON.parse(fs.readFileSync(ROOT + 'forms/forms_spec.json', 'utf8'));
const MAN = JSON.parse(fs.readFileSync(ROOT + 'script_kit/DPP Forms script kit/DPP Forms kit/forms_manifest.json', 'utf8'));
const SCALES = JSON.parse(fs.readFileSync(ROOT + 'scales.json', 'utf8')).scales;
const PNG = ROOT + 'forms/png/';
fs.mkdirSync(OUT, { recursive: true });
fs.mkdirSync(HTML, { recursive: true });

const IDS = ['C-AR.1.1', 'C-AR.1.2', 'C-AR.2.2', 'C-AR.2.1'];          // teaching order (equations before inequalities)
const SETS = [['chk', 'Check'], ['re', 'Re-check'], ['cmp', 'Comparison']];
const TOPIC = { 'C-AR.1.1': 'Adding and subtracting expressions', 'C-AR.1.2': 'Equivalent expressions',
  'C-AR.2.1': 'One-step inequalities', 'C-AR.2.2': 'Two-step equations' };
const UNIT = { 9: 'Unit 9 · Algebraic Expressions', 10: 'Unit 10 · Equations and Inequalities' };
const LT = 'ABCDE';

const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
// CTEX reads Cadence's HTML-flavored text ("x < 8" stays an operator; tags pass through), so no escaping first
const M = (t, display) => CTEX.render(String(t), { katex, display: !!display });
const file = p => 'file://' + p.split('/').map(encodeURIComponent).join('/').replace(/%3A/g, ':');
const spec = (id, set) => SPEC.forms.find(f => f.id === id && f.set === set);
const man = (id, set) => MAN.forms.find(f => f.id === id && f.set === set);
const item = slot => { const [c, s, i] = slot.split('/'); return PLAN[c][s][+i]; };
const lessonOf = (bench, q) => C.L.find(l => l.bench === bench && l.q === q);
const anchor = l => 'L' + l.bench.slice(2).replace(/\./g, '') + '-' + l.q;

// prompts like "Simplify: (4 + …)" put the expression on its own line, set large; "Which …?   A · B · C · D"
// and "Which?   (a) …   (b) …" set the choices in a row, lettered
function prompt(t) {
  let m = t.match(/^(.*?\?)\s{2,}(.*)$/);
  if (m) {
    const parts = m[2].includes('·') ? m[2].split(/\s+·\s+/) : m[2].split(/\s{2,}/);
    if (parts.length >= 3) return `<div class="ins">${M(m[1])}</div><div class="choices">${parts.map((p, i) => {
      const c = p.match(/^\(([a-e])\)\s*(.*)$/);
      return `<span class="ch"><b>${c ? c[1] : 'abcde'[i]}</b>${M(c ? c[2] : p)}</span>`; }).join('')}</div>`;
    return `<div class="ins">${M(m[1])}</div><div class="expr">${M(m[2], true)}</div>`;
  }
  m = t.match(/^(Solve and graph|Rewrite without parentheses|Simplify|Solve):\s+(.*)$/);
  if (m) return `<div class="ins">${M(m[1] + ':')}</div><div class="expr">${M(m[2], true)}</div>`;
  if (!/[A-Za-z]{2,}/.test(t)) return `<div class="expr">${M(t, true)}</div>`;
  return `<div class="ins">${M(t)}</div>`;
}
// "(a) x + 2 ≤ 5" as an answer: keep the letter bold
const ans = t => { const c = String(t).match(/^\(([a-e])\)\s*(.*)$/); return c ? `<b>${c[1]}</b>&nbsp; ${M(c[2])}` : M(t); };
// a solve-and-graph answer ("x ≤ −4: …", "p < −4: open circle …"): its number line, for the answer page
function answerFig(p) {
  if (p.fig || !p.check || p.check[0] !== 'ineq' || !/circle|closed|open/.test(p.answer)) return null;
  const r = String(p.check[2]).replace(/−/g, '-').match(/^[a-z]\s*([<>≤≥])\s*(-?[\d.]+)$/);
  if (!r) return null;
  const at = Number(r[2]), lo = Math.floor(at) - 4, hi = lo + 8;
  return { lo, hi, at, closed: '≤≥'.includes(r[1]), dir: '<≤'.includes(r[1]) ? 'left' : 'right' };
}

// a number line: integer ticks, the point, and the shaded ray
function numberLine(f, w = 520, scaled = false) {
  const { lo, hi, at, closed, dir } = f, H = 66, y = 26, pad = 24;
  const X = v => pad + (v - lo) * (w - 2 * pad) / (hi - lo);
  const neg = v => (v < 0 ? '−' : '') + Math.abs(v);
  const size = scaled ? `style="width:calc(${w}px*var(--k,1));height:auto"` : `width="${w}" height="${H}"`;
  let s = `<svg class="nl" ${size} viewBox="0 0 ${w} ${H}" xmlns="http://www.w3.org/2000/svg">`;
  s += `<line x1="6" y1="${y}" x2="${w - 6}" y2="${y}" stroke="#1f2a44" stroke-width="1.6"/>`;
  s += `<polygon points="2,${y} 11,${y - 5} 11,${y + 5}" fill="#1f2a44"/><polygon points="${w - 2},${y} ${w - 11},${y - 5} ${w - 11},${y + 5}" fill="#1f2a44"/>`;
  for (let v = Math.ceil(lo); v <= hi; v++) {
    s += `<line x1="${X(v)}" y1="${y - 7}" x2="${X(v)}" y2="${y + 7}" stroke="#1f2a44" stroke-width="1.4"/>`;
    s += `<text x="${X(v)}" y="${y + 27}" text-anchor="middle" font-size="15" fill="#1f2a44">${neg(v)}</text>`;
  }
  const x0 = X(at), x1 = dir === 'right' ? w - 4 : 4;
  s += `<line x1="${x0}" y1="${y}" x2="${dir === 'right' ? x1 - 10 : x1 + 10}" y2="${y}" stroke="#c99a1e" stroke-width="7"/>`;
  s += dir === 'right' ? `<polygon points="${x1},${y} ${x1 - 14},${y - 9} ${x1 - 14},${y + 9}" fill="#c99a1e"/>` : `<polygon points="${x1},${y} ${x1 + 14},${y - 9} ${x1 + 14},${y + 9}" fill="#c99a1e"/>`;
  s += `<circle cx="${x0}" cy="${y}" r="7.5" fill="${closed ? '#1f2a44' : '#fff'}" stroke="#1f2a44" stroke-width="2.6"/>`;
  if (!Number.isInteger(at)) s += `<text x="${x0}" y="${y - 14}" text-anchor="middle" font-size="14" font-weight="600" fill="#1f2a44">${neg(at)}</text>`;
  return s + '</svg>';
}

const KCSS = fs.readFileSync(ROOT + 'node_modules/katex/dist/katex.min.css', 'utf8')
  .replace(/url\(fonts\//g, 'url(' + file(ROOT + 'node_modules/katex/dist/fonts') + '/');
const BASE = `
@font-face{font-family:Lexend;src:url('${file(ROOT + 'lexend0.ttf')}');font-weight:100 900}
${KCSS}
:root{--navy:#1f2a44;--gold:#c99a1e;--gold2:#f6edd3;--cream:#faf7f0;--ink:#16191f;--muted:#5f6470;--line:#d9d4c7;--ok:#1f7a4d}
*{box-sizing:border-box}
html,body{margin:0;background:#fff;color:var(--ink);font-family:Lexend,Arial,sans-serif}
b,strong{font-weight:600}
.katex{font-size:1.06em}
a{color:inherit;text-decoration:none}
`;

function page(css, body) {
  return `<!doctype html><html><head><meta charset="utf-8"><style>${BASE}${css}</style></head><body>${body}</body></html>`;
}

// ───────────────────────── 03 Reteach lessons (16:9, projected) ─────────────────────────
// Every size on a slide is a multiple of --k; at print time each slide starts at k = 1 and shrinks until it fits.
const K = n => `calc(${n}px*var(--k,1))`;
// choice letters in running text: "(a) x ≤ 3: matches." → a bold letter, then the math on its own
function Mc(t) {
  const parts = String(t).split(/(?:^|\s)\(([a-e])\)\s*/);
  if (parts.length === 1) return M(t);
  // each lettered piece stays on one line, so a letter never ends a line without its math
  let out = parts[0].trim() ? M(parts[0].trim()) + ' ' : '';
  for (let i = 1; i < parts.length; i += 2) out += `<span class="nb"><b class="cl">${parts[i]}</b>${M(parts[i + 1].trim())}</span> `;
  return out;
}
function reteachHTML() {
  const css = `
@page{size:13.333in 7.5in;margin:0}
.slide{--k:1;width:13.333in;height:7.5in;padding:.4in .55in .34in;position:relative;page-break-after:always;overflow:hidden;display:flex;flex-direction:column}
.slide:last-child{page-break-after:auto}
.kick{font-size:${K(17)};color:var(--muted);letter-spacing:.02em}
.kick b{color:var(--gold);font-weight:600}
.kick .chip{display:inline-block;font-size:${K(13)};font-weight:700;letter-spacing:.08em;text-transform:uppercase;background:var(--ok);color:#fff;border-radius:6px;padding:1px 8px;margin-left:8px;vertical-align:1px}
h1{font-size:${K(38)};line-height:1.12;margin:${K(4)} 0 ${K(10)};color:var(--navy);font-weight:650}
.idea{font-size:${K(23)};line-height:1.42;margin:0 0 ${K(14)};max-width:12in}
.cols{display:flex;gap:.3in;flex:1;min-height:0}
.colL{flex:1.08;display:flex;flex-direction:column;gap:${K(12)};min-width:0}
.colR{flex:1;display:flex;flex-direction:column;gap:${K(12)};min-width:0}
.card{background:var(--cream);border-radius:14px;padding:${K(14)} ${K(20)}}
.lab{font-size:${K(14)};font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:var(--gold);margin-bottom:${K(6)}}
.card .ins{font-size:${K(22)};line-height:1.4}
.card .expr{font-size:${K(25)};margin:${K(4)} 0}
.expr .katex-display{margin:2px 0;text-align:left}
.expr .katex-display>.katex{text-align:left}
ol.steps{margin:${K(8)} 0 0;padding-left:${K(26)};font-size:${K(21)};line-height:1.48}
ol.steps li{margin:${K(2)} 0}
.ansline{margin-top:${K(8)};font-size:${K(23)}}
.tag{display:inline-block;font-size:${K(13)};font-weight:700;letter-spacing:.08em;text-transform:uppercase;background:var(--navy);color:#fff;border-radius:6px;padding:2px 8px;margin-right:10px;vertical-align:middle}
.turn{border:2px solid var(--navy);background:#fff}
.prac{display:flex;flex-direction:column}
.p{display:flex;gap:${K(14)};align-items:flex-start;border-top:1px solid var(--line);padding:${K(8)} 0}
.p:first-child{border-top:0;padding-top:${K(2)}}
.pn{font-size:${K(22)};font-weight:700;color:var(--navy);min-width:${K(20)};line-height:1.3}
.pb{flex:1;min-width:0}
.pb .ins{font-size:${K(20)};line-height:1.38}
.pb .expr{font-size:${K(23)}}
.pb .expr .katex-display{margin:0}
.wf{display:flex;gap:${K(18)};align-items:center}
.wf .fig{margin:${K(2)} 0}
.nb{white-space:nowrap}
.chg{display:inline-block;margin-top:${K(4)};font-size:${K(15)};color:#7a5a00;background:var(--gold2);border-radius:20px;padding:1px ${K(11)}}
.got{margin-top:${K(4)};font-size:${K(21)};color:var(--ok);font-weight:600}
.got .katex{color:var(--ok)}
.turn .got{font-size:${K(23)};margin-top:${K(8)}}
.watch{border-left:5px solid var(--gold);padding:${K(4)} 0 ${K(4)} ${K(18)};font-size:${K(19)};line-height:1.42}
.watch b{display:block;font-size:${K(14)};font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:var(--gold);margin-bottom:${K(4)}}
.watch div{margin:${K(3)} 0}
.choices{display:flex;flex-wrap:wrap;gap:${K(8)} ${K(26)};margin:${K(8)} 0 ${K(4)};font-size:${K(22)}}
.pb .choices{font-size:${K(20)}}
.ch b,.cl{color:var(--gold);font-weight:700;margin-right:${K(7)}}
.cl{margin-left:${K(4)}}
.fig{margin:${K(6)} 0 ${K(2)}}
.fig svg text{font-family:Lexend,Arial,sans-serif}
.toc h1{font-size:${K(44)};margin-bottom:${K(8)}}
.toc .sub{font-size:${K(20)};color:var(--muted);margin-bottom:${K(20)};max-width:12in;line-height:1.45}
.toc .grid{display:grid;grid-template-columns:repeat(4,1fr);gap:${K(16)}}
.toc .b{background:var(--cream);border-radius:14px;padding:${K(16)} ${K(18)}}
.toc .b h2{font-size:${K(21)};margin:0 0 2px;color:var(--navy)}
.toc .b .u{font-size:${K(14)};color:var(--muted);margin-bottom:${K(8)}}
.toc .b a{display:block;font-size:${K(17)};line-height:1.35;padding:${K(8)} 0;border-top:1px solid var(--line)}
.toc .b a b{color:var(--gold)}
`;
  const lessonsBy = IDS.map(id => C.L.filter(l => l.bench === id));
  let body = `<section class="slide toc"><h1>Reteach lessons</h1>
    <div class="sub">One lesson for each question on the four weekly checks. Teach the lesson for the question the PLC picked (the item guide names it). Project the lesson page for the idea and the worked example; students do Your turn and the practice on whiteboards. The page after each lesson has the answers. About 8 to 10 minutes.</div>
    <div class="grid">${lessonsBy.map((ls, i) => `<div class="b"><h2>${esc(TOPIC[IDS[i]])}</h2><div class="u">${esc(UNIT[C.BENCH[IDS[i]].unit])}</div>
      ${ls.map(l => `<a href="#${anchor(l)}"><b>Q${l.q}</b> &nbsp;${esc(l.title)}</a>`).join('')}</div>`).join('')}</div></section>`;
  // a number line is part of the question when students read it (graph, match); when they draw it (ineq), it is
  // part of the answer: after the steps in the worked example, and only on the answer page for Your turn
  const figQ = (p, w) => p.fig && p.check[0] !== 'ineq' ? `<div class="fig">${numberLine(p.fig, w, true)}</div>` : '';
  const figA = (p, w) => { const f = p.fig && p.check[0] === 'ineq' ? p.fig : answerFig(p); return f ? `<div class="fig">${numberLine(f, w, true)}</div>` : ''; };
  const pBlock = (p, i, withAns) => {
    const under = withAns ? `<div class="got">${ans(p.answer)}</div>` : (p.change ? `<span class="chg">${esc(p.change)}</span>` : '');
    const fq = figQ(p, 400);
    // a graph to read: the prompt, then the graph with the change note beside it (lesson page) or the answer under it
    const inner = fq ? (withAns ? `${prompt(p.prompt)}${fq}${under}` : `${prompt(p.prompt)}<div class="wf">${fq}${under}</div>`)
      : `${prompt(p.prompt)}${under}${withAns ? figA(p, 360) : ''}`;
    return `<div class="p"><div class="pn">${i + 1}</div><div class="pb">${inner}</div></div>`;
  };
  for (const ls of lessonsBy) for (const l of ls) {
    const ex = l.example, tu = l.turn;
    const kick = a => `<div class="kick">${esc(TOPIC[l.bench])} · <b>Reteach for question ${l.q}</b>${a ? '<span class="chip">Answers</span>' : ''}</div>`;
    const head = a => `${kick(a)}<h1>${esc(l.title)}</h1>`;
    const exCard = `<div class="card"><div class="lab">Worked example</div>${prompt(ex.prompt)}${figQ(ex, 470)}
      <ol class="steps">${ex.steps.map(s => `<li>${Mc(s)}</li>`).join('')}</ol><div class="ansline"><span class="tag">Answer</span>${ans(ex.answer)}</div>${figA(ex, 470)}</div>`;
    const watch = `<div class="watch"><b>Watch for</b>${l.watch.map(w => `<div>${M(w)}</div>`).join('')}</div>`;
    const turnQ = `<div class="card turn"><div class="lab">Your turn</div>${prompt(tu.prompt)}${figQ(tu, 430)}</div>`;
    const turnA = `<div class="card turn"><div class="lab">Your turn</div>${prompt(tu.prompt)}${figQ(tu, 430)}
      <ol class="steps">${tu.steps.map(s => `<li>${Mc(s)}</li>`).join('')}</ol><div class="got">${ans(tu.answer)}</div>${figA(tu, 430)}</div>`;
    const prac = withAns => `<div class="card"><div class="lab">Practice${withAns ? '' : ' · one change each time'}</div><div class="prac">${l.practice.map((p, i) => pBlock(p, i, withAns)).join('')}</div></div>`;
    body += `<section class="slide" id="${anchor(l)}">${head(false)}<div class="idea">${M(l.why)}</div>
      <div class="cols"><div class="colL">${exCard}${watch}</div><div class="colR">${turnQ}${prac(false)}</div></div></section>`;
    body += `<section class="slide">${head(true)}
      <div class="cols"><div class="colL">${turnA}</div><div class="colR">${prac(true)}</div></div></section>`;
  }
  return page(css, body);
}

// ───────────────────────── 01 Scales to post (Letter landscape) ─────────────────────────
function postersHTML() {
  const css = `
@page{size:letter landscape;margin:0}
.poster{--k:1;width:11in;height:8.5in;padding:.5in .65in .45in;page-break-after:always;display:flex;flex-direction:column;overflow:hidden}
.poster:last-child{page-break-after:auto}
.unit{font-size:${K(17)};color:var(--muted);letter-spacing:.03em}
.goal{display:flex;align-items:baseline;gap:${K(16)};margin:${K(6)} 0 ${K(20)}}
.goal .lab{font-size:${K(15)};font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:#fff;background:var(--navy);border-radius:8px;padding:${K(5)} ${K(12)};flex:none;position:relative;top:${K(-7)}}
.goal .t{font-size:${K(44)};font-weight:650;color:var(--navy);line-height:1.12}
.rows{display:flex;flex-direction:column;gap:${K(12)};flex:1;min-height:0}
.row{display:flex;gap:${K(24)};align-items:center;border-radius:16px;padding:${K(12)} ${K(22)};background:var(--cream);flex:1}
.row.l1{background:#fff;border:2px dashed var(--line)}
.n{flex:none;width:${K(70)};height:${K(70)};border-radius:50%;background:var(--navy);color:#fff;font-size:${K(38)};font-weight:700;display:flex;align-items:center;justify-content:center}
.row.l3 .n{background:var(--gold)}
.txt{flex:1;min-width:0}
.can{font-size:${K(28)};font-weight:600;line-height:1.28}
.ex{margin-top:${K(6)};font-size:${K(22)};color:#333;line-height:1.42;display:flex;flex-wrap:wrap;align-items:center;column-gap:${K(22)}}
.ex .lk{font-size:${K(14)};font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:var(--gold);margin-right:${K(10)}}
.ex svg text{font-family:Lexend,Arial,sans-serif}
.mast{font-size:${K(16)};color:var(--muted);margin-top:${K(12)}}
`;
  let body = '';
  for (const id of IDS) {
    const P = C.POSTERS[id], u = C.BENCH[id].unit;
    body += `<section class="poster fit"><div class="unit">${esc(UNIT[u])}</div>
      <div class="goal"><span class="lab">Learning goal</span><span class="t">${esc(P.goal)}</span></div><div class="rows">`;
    for (const [lvl, can, ex] of P.levels) {
      const fig = P.figs && P.figs[lvl] ? numberLine(P.figs[lvl], 380, true) : '';
      const start = ex.match(/^Start here:\s*(.*)$/);
      body += `<div class="row l${lvl}"><div class="n">${lvl}</div><div class="txt"><div class="can">${esc(can)}</div>
        <div class="ex"><span><span class="lk">${start ? 'Start here' : 'Looks like'}</span>${M(start ? start[1] : ex)}</span>${fig}</div></div></div>`;
    }
    body += `</div><div class="mast">Level 3 is the goal for everyone: it means the benchmark is mastered.</div></section>`;
  }
  return page(css, body);
}

// ───────────────────────── question cards ─────────────────────────
// What students see on the form, set from the same item data and the same converter as the form images,
// but as live text, so it prints sharp at any size.
const figOnly = it => Array.isArray(it.opts) && it.opts.every(o => /^(Graph|Number line|Display) [A-D]$/.test(String(o)));
function qCard(Q, small, paper) {
  const it = item(Q.slot);
  // in the item guide's narrow column, number-line labels are set larger so they stay readable
  const fig = it.fig ? (small ? it.fig.replace(/font-size:9px/g, 'font-size:12.5px') : it.fig) : '';
  // on paper, short choices sit two to a row
  const grid = paper && it.opts && it.opts.every(o => String(o).length <= 24);
  const opts = !it.opts || figOnly(it) ? '' : (it.inst ? `<div class="inst">${it.inst}</div>` : '') +
    `<div class="opts${grid ? ' grid' : ''}">${it.opts.map((o, i) => `<div class="opt"><span class="ol">${LT[i]}.</span><span class="ot">${M(o)}</span></div>`).join('')}</div>`;
  const note = Q.type === 'Short answer' ? `<div class="note">${esc(paper ? Q.note.replace(/^Type /, 'Write ') : Q.note)}</div>` : '';
  return `<div class="qc"><div class="stem">${M(String(it.q).replace(/\n/g, '<br>'), true)}</div>${fig ? `<div class="figwrap">${fig}</div>` : ''}${opts}${note}</div>`;
}
const QCSS = `
.qc{line-height:1.5;--figf:Lexend}
.qc .katex-display{margin:.3em 0 .15em;text-align:left}
.qc .katex-display>.katex{text-align:left;padding-left:1.2em}
.qc .katex-display+br{display:none}
.qc .figwrap{margin:.5em 0 .2em}
.qc .figwrap svg{display:block;width:100%;max-width:58%;height:auto}
.qc .figwrap svg.wide{max-width:90%}
.qc .figwrap svg.quad{max-width:94%}
.qc .figwrap svg.nl4{max-width:84%}
.qc svg text{font-family:Lexend,Arial,sans-serif}
.qc svg text:not([stroke]){paint-order:stroke;stroke:#fff;stroke-width:2.4px;stroke-linejoin:round}
.qc .inst{margin:.55em 0 0;font-style:italic}
.qc .opts{margin:.45em 0 0}
.qc .opt{display:flex;gap:.6em;align-items:baseline;padding:.24em 0}
.qc .ol{font-weight:700;min-width:1.4em;flex:none}
.qc .opts.grid{display:grid;grid-template-columns:1fr 1fr;column-gap:2em;max-width:5.2in}
.qc .note{margin-top:.55em;padding-top:.35em;border-top:1px solid #ddd;color:#555;font-size:.9em}
`;
const keyLine = F => F.questions.map(Q => `${Q.n} ${Q.type === 'Short answer' ? Q.accept[0].replace(/^-/, '−') : Q.correct.join('+')}`).join(' &nbsp;·&nbsp; ');
const formMeta = F => `${F.questions.length} questions · ${F.calc === 'yes' ? 'calculator allowed · Locked mode off' : 'no calculator · Locked mode on'}`;

// ───────────────────────── 02 PLC item guide (Letter portrait) ─────────────────────────
function itemGuideHTML() {
  const css = `
@page{size:letter;margin:.5in .55in .55in}
${QCSS}
body{font-size:10.4px;line-height:1.42}
h1{font-size:22px;color:var(--navy);margin:0 0 3px}
.sub{color:var(--muted);font-size:11.5px;margin-bottom:10px}
.how{background:var(--cream);border-radius:10px;padding:10px 14px 10px 14px;margin:6px 0 16px;font-size:10.8px;line-height:1.5}
.how ol{margin:4px 0 0;padding-left:18px}.how li{margin:2px 0}
.how b{color:var(--navy)}
.bench{page-break-before:always}
.bench.first{page-break-before:auto}
.fh{border-bottom:2px solid var(--navy);padding-bottom:4px;margin:14px 0 2px;page-break-after:avoid}
.bench>.fh:first-child{margin-top:0}
.fh .row1{display:flex;justify-content:space-between;align-items:baseline;gap:12px}
.fh h2{font-size:14.5px;margin:0;color:var(--navy)}
.fh .m{font-size:10px;color:var(--muted);white-space:nowrap}
.fh .kl{font-size:10px;color:#333;margin-top:2px}
.fh .kl b{color:var(--navy)}
.keep{page-break-inside:avoid}
.q{display:flex;gap:16px;padding:9px 0 10px;border-bottom:1px solid var(--line);page-break-inside:avoid}
.q:last-child{border-bottom:0}
.qi{flex:none;width:3.3in}
.qi .qc{font-size:10.6px;background:#fcfbf8;border:1px solid #ebe7dc;border-radius:8px;padding:7px 10px}
.qi .qc .figwrap svg.wide,.qi .qc .figwrap svg.nl4{max-width:100%}
.qn{font-size:10.5px;font-weight:700;color:var(--navy);margin-bottom:4px}
.rig{font-weight:600;color:#7a5a00;background:var(--gold2);border-radius:10px;padding:0 7px;margin-left:6px;font-size:9.5px}
.qa{flex:1;min-width:0}
.key{font-size:12.5px;line-height:1.45}
.tag{display:inline-block;font-size:9px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;background:var(--ok);color:#fff;border-radius:5px;padding:1px 7px;margin-right:6px;vertical-align:2px}
.acc{font-size:9.8px;color:var(--muted);margin-top:2px}
.sol{color:#333;margin:6px 0 7px;font-size:10.2px}
.sol div{margin:1px 0}
.wl{font-size:9px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:var(--gold);margin:0 0 2px}
table.w{border-collapse:collapse;width:100%}
table.w td{padding:3px 6px;border-top:1px solid #eee;vertical-align:top}
table.w td.l{width:44px;font-weight:700;white-space:nowrap;color:var(--navy)}
.rt{margin-top:6px;font-size:10.2px}
.rt b{color:var(--gold)}
`;
  let body = `<h1>PLC item guide</h1><div class="sub">Units 9 and 10 · the answer to every question on the 12 forms, and what each wrong answer means</div>
    <div class="how"><b>At Thursday's PLC</b>
    <ol><li>Open your school copy of Wednesday's Check: <b>Responses → Summary</b>. Under each question, Forms shows how many got it right and how many picked each answer.</li>
    <li>Find the question with the fewest right. Then find the wrong answer most students picked.</li>
    <li>Look that answer up below: the table says what the mistake is, and the <b>Reteach</b> line names the lesson in <i>03 Reteach lessons</i>.</li></ol>
    Typed answers: Forms marks them; the table lists the wrong values students are most likely to type. Re-check and Review forms list the related lesson for reference.</div>`;
  IDS.forEach((id, bi) => {
    body += `<div class="bench${bi ? '' : ' first'}">`;
    for (const [set] of SETS) {
      const F = spec(id, set), Mf = man(id, set);
      // the header travels with its first question, so it never sits alone at the foot of a page
      const head = `<div class="fh"><div class="row1"><h2>${esc(Mf.title)}</h2><span class="m">${formMeta(F)}</span></div><div class="kl"><b>Key</b> &nbsp;${keyLine(F)}</div></div>`;
      body += `<div class="keep">${head}`;
      for (const Q of F.questions) {
        const it = item(Q.slot), N = C.NOTES[Q.slot];
        const sol = String(it.s).split('\n').slice(0, N.keep).map(x => `<div>${M(x)}</div>`).join('');
        let keyHtml, rows;
        if (Q.type === 'Short answer') {
          keyHtml = `<span class="tag">Answer</span>${M(it.a)}<div class="acc">The form accepts ${Q.accept.map(a => esc(a.replace(/^-/, '−'))).join(' or ')}</div>`;
          rows = N.typed.map(([a, m]) => `<tr><td class="l">${M(a)}</td><td>${M(m)}</td></tr>`).join('');
        } else {
          const one = Q.correct.length === 1 && it.opts && !figOnly(it);
          keyHtml = `<span class="tag">Answer</span><b>${Q.correct.join(' and ')}</b>${one ? '&nbsp; ' + M(it.opts[it.key]) : ''}${N.cb ? `<div class="acc">${esc(N.cb)}</div>` : ''}`;
          rows = Object.entries(N.why).map(([L, m]) => `<tr><td class="l">${L}</td><td>${M(m)}</td></tr>`).join('');
        }
        const les = lessonOf(id, N.lesson);
        const rt = set === 'chk' ? `<div class="rt"><b>Reteach:</b> lesson ${les.q}, ${esc(les.title)}</div>`
          : `<div class="rt">Related lesson: ${les.q}, ${esc(les.title)}</div>`;
        body += `<div class="q"><div class="qi"><div class="qn">Question ${Q.n}${Q.hr ? '<span class="rig">rigor</span>' : ''}</div>${qCard(Q, true)}</div>
          <div class="qa"><div class="key">${keyHtml}</div><div class="sol">${sol}</div>
          <div class="wl">${Q.type === 'Short answer' ? 'Wrong answers students type' : 'Wrong answers'}</div><table class="w">${rows}</table>${rt}</div></div>`;
        if (Q.n === 1) body += '</div>';
      }
    }
    body += '</div>';
  });
  return page(css, body);
}

// ───────────────────────── 04 Paper copies (Letter portrait) ─────────────────────────
function paperHTML() {
  const css = `
@page{size:letter;margin:.45in .55in .5in}
${QCSS}
body{font-size:12.4px}
.sheet{page-break-before:always}
.sheet.first{page-break-before:auto}
.top{display:flex;justify-content:space-between;align-items:flex-end;gap:16px;border-bottom:2px solid var(--navy);padding-bottom:7px;margin-bottom:7px}
.top h2{font-size:16px;margin:0;color:var(--navy);line-height:1.2}
.top .st{font-size:11.5px;color:var(--muted);margin-top:2px}
.who{font-size:11.5px;line-height:2.05;text-align:right;white-space:nowrap}
.desc{font-size:11px;color:#333;margin:0 0 9px;line-height:1.45}
.pq{display:flex;gap:10px;border:1px solid var(--line);border-radius:9px;padding:8px 12px 10px;margin-bottom:9px;page-break-inside:avoid}
.pq .n{font-weight:700;color:var(--navy);font-size:14px;min-width:16px;line-height:1.5}
.pq .pb{flex:1;min-width:0}
.pq .work{min-height:.5in}
.pq .qc .figwrap svg.nl4{max-width:66%}
.pq .aw{font-size:12px;color:#333;margin-top:4px}
.lvl{border:2px solid var(--navy);border-radius:9px;padding:9px 14px 11px;page-break-inside:avoid}
.lvl .h{font-weight:600;margin-bottom:6px}
.lvl table{border-collapse:collapse;width:100%;font-size:11.5px;margin:4px 0 8px}
.lvl td{border-top:1px solid #ddd;padding:4px 8px;vertical-align:top}
.lvl td.n{width:22px;font-weight:700;text-align:center;border-right:1px solid #ddd}
.lvl .goal{font-size:11.5px}
.lvl .goal span{display:inline-block;font-size:9px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;background:var(--navy);color:#fff;border-radius:5px;padding:1px 7px;margin-right:6px;vertical-align:1px}
.lvl .c{font-size:13px}
.lvl .c b{display:inline-block;margin-left:22px;font-weight:500}
`;
  let body = '', first = true;
  for (const id of IDS) for (const [set] of SETS) {
    const F = spec(id, set), Mf = man(id, set), [t1, t2] = Mf.title.split(' · ');
    const desc = Mf.description.replace('then choose or type your answer', 'then circle the letter or write your answer');
    body += `<div class="sheet${first ? ' first' : ''}"><div class="top"><div><h2>${esc(t1)}</h2><div class="st">${esc(t2)}</div></div>
      <div class="who">Name ____________________________ &nbsp; Period ______<br>Teacher (circle): &nbsp; Mr. C. Shaffer &nbsp; · &nbsp; Mr. J. Shaffer &nbsp;&nbsp;&nbsp; Score ______ / ${F.questions.length}</div></div>
      <div class="desc">${esc(desc)}</div>`;
    first = false;
    for (const Q of F.questions) {
      const aw = Q.type === 'Short answer' ? 'Answer: ________________________' : Q.type === 'Checkboxes' ? 'Circle every correct letter.' : 'Circle one letter.';
      body += `<div class="pq"><div class="n">${Q.n}</div><div class="pb">${qCard(Q, false, true)}<div class="work"></div><div class="aw">${aw}</div></div></div>`;
    }
    if (set === 'chk') {
      const sc = SCALES[C.BENCH[id].std];
      body += `<div class="lvl"><div class="h">Last question: look at the scale. Which level are you at right now?</div>
        <div class="goal"><span>Learning goal</span>${esc(sc.goal)}</div>
        <table><tr><td class="n">4</td><td>${esc(sc.l4)}</td></tr><tr><td class="n">3</td><td>${esc(sc.l3)}</td></tr><tr><td class="n">2</td><td>${esc(sc.l2)}</td></tr><tr><td class="n">1</td><td>I need help to start this.</td></tr></table>
        <div class="c">Circle one: <b>Level 1</b> <b>Level 2</b> <b>Level 3</b> <b>Level 4</b></div></div>`;
    }
    body += '</div>';
  }
  return page(css, body);
}

// ───────────────────────── 00 Start here (Letter portrait, log page landscape) ─────────────────────────
function guideHTML() {
  const css = `
@page{size:letter;margin:.5in .6in .55in}
@page log{size:letter landscape;margin:.5in .55in}
body{font-size:10.6px;line-height:1.45}
h1{font-size:24px;color:var(--navy);margin:0 0 2px}
.sub{color:var(--muted);font-size:11.5px;margin-bottom:12px}
h2{font-size:13.5px;color:var(--navy);margin:18px 0 6px;padding-bottom:3px;border-bottom:1.5px solid var(--navy);page-break-after:avoid}
h2:first-child{margin-top:0}
table{border-collapse:collapse;width:100%}
th{background:var(--cream);color:var(--navy);font-weight:700;text-align:left;padding:5px 7px;font-size:10px;border-bottom:1.5px solid var(--navy)}
td{padding:5px 7px;border-bottom:1px solid var(--line);vertical-align:top}
tr{page-break-inside:avoid}
td.k{font-weight:600;white-space:nowrap}
.box{background:var(--cream);border-radius:10px;padding:9px 13px;margin:9px 0;page-break-inside:avoid}
.box p{margin:3px 0}
.box b{color:var(--navy)}
ol{margin:4px 0;padding-left:18px}li{margin:4px 0}
.off td{color:var(--muted);background:#fbfaf6}
.pb{page-break-before:always}
.small{font-size:9.6px;color:var(--muted)}
code{font-family:'Courier New',monospace;font-size:10px;background:#fff;border:1px solid #ddd;border-radius:3px;padding:0 3px}
.cal td{font-size:10.2px}
.cal b{color:var(--navy)}
.cy{display:inline-block;font-size:9px;font-weight:700;letter-spacing:.05em;color:#fff;background:var(--gold);border-radius:4px;padding:0 5px;margin-right:3px;vertical-align:1px}
.logp{page:log;page-break-before:always}
.log td{height:.8in}
.log th{font-size:9.6px}
`;
  const formRows = IDS.map(id => SETS.map(([set]) => {
    const Mf = man(id, set), F = spec(id, set);
    const when = { chk: 'Wednesday of the week it is taught', re: 'The Tuesday after, following the reteach', cmp: 'With the next benchmark’s Re-check' }[set];
    return `<tr><td class="k">${esc(Mf.title.split(' · ')[0])}</td><td>${F.questions.length}</td><td>${F.calc === 'yes' ? 'Allowed' : 'No'}</td><td>${F.calc === 'yes' ? 'Off' : 'On'}</td><td>${when}</td></tr>`;
  }).join('')).join('');
  const cy = n => `<span class="cy">Cycle ${n}</span>`;
  const W = (wk, cls, teach, mt, wed, thu) => `<tr class="${cls}"><td class="k">${wk}</td><td>${teach}</td><td>${mt}</td><td>${wed}</td><td>${thu}</td></tr>`;
  const b = `<h1>DPP: Units 9 and 10</h1>
<div class="sub">Algebraic Expressions (AR.1.1, AR.1.2) and Equations and Inequalities (AR.2.2, AR.2.1) · October 26 to December 18</div>
<h2>In this folder</h2>
<table><tr><th style="width:27%">File</th><th>What it is</th></tr>
<tr><td class="k">00 Start here</td><td>This guide: the forms, the week, the calendar, which Review form goes with which Re-check, the Thursday PLC agenda, and a log page.</td></tr>
<tr><td class="k">01 Scales to post</td><td>One poster per benchmark: the learning goal, the four levels, and what each level looks like. Post it the week the benchmark is taught.</td></tr>
<tr><td class="k">02 PLC item guide</td><td>Every question on the 12 forms: the answer, the worked solution, what each wrong answer means, and the reteach lesson that fixes it.</td></tr>
<tr><td class="k">03 Reteach lessons</td><td>20 short lessons, one for each Check question: the idea, a worked example, Your turn and three practice problems, then an answer page. Made to project.</td></tr>
<tr><td class="k">04 Paper copies</td><td>All 12 forms on paper, with the scale question on each Check, for a day the Chromebooks or the network are down.</td></tr>
<tr><td class="k">DPP Forms script kit</td><td>The forms builder, updated. <code>ONLY: 'Unit 9, Unit 10'</code> builds just these 12 forms.</td></tr></table>

<h2>The 12 forms</h2>
<table><tr><th style="width:21%">Form</th><th style="width:10%">Questions</th><th style="width:11%">Calculator</th><th style="width:12%">Locked mode</th><th>When</th></tr>${formRows}</table>
<div class="small" style="margin-top:4px">The Comparison forms are titled “Review”, and that is the name students see. Only Checks end with the scale and the “Which level are you at?” question.</div>

<h2>The week</h2>
<ol>
<li><b>Monday:</b> post the week’s scale. Teach the reteach lesson the PLC picked last Thursday (8 to 10 minutes).</li>
<li><b>Tuesday:</b> the Re-check on the retaught benchmark, then the Review form (two short forms, about 8 minutes together).</li>
<li><b>Wednesday:</b> the Check on this week’s benchmark (about 10 minutes). Students answer five questions, rate their level on the last one, and see their score when they submit.</li>
<li><b>Thursday PLC:</b> 10 minutes on the results (page 3). Log the decision.</li>
</ol>
<div class="small">Each form needs a school copy first: links sheet → Copy link → Make a copy, Locked mode on for the Unit 9 forms, Publish to your school, post the link (page 3).</div>

<h2 class="pb">Calendar</h2>
<table class="cal"><tr><th style="width:12%">Week</th><th style="width:15%">Teaching</th><th style="width:27%">Monday and Tuesday</th><th style="width:21%">Wednesday</th><th>Thursday PLC</th></tr>
${W('Oct 26–30', '', 'Unit 9: AR.1.1', 'Teach as planned', '<b>Check C-AR.1.1</b>', 'Pick the AR.1.1 reteach. John previews C-AR.1.2.')}
${W('Nov 2–6', '', 'Unit 9: AR.1.2', 'Mon: reteach AR.1.1<br>Tue: <b>Re-check C-AR.1.1</b>. No Review form this first time.', '<b>Check C-AR.1.2</b>', `Pick the AR.1.2 reteach. ${cy(1)} complete: log it.`)}
${W('Nov 9–13', '', 'Unit 9 review and test', 'Mon: reteach AR.1.2<br>Tue: <b>Re-check C-AR.1.2</b> + <b>Review C-AR.1.1</b>', 'No school (Veterans Day). No new Check: short week, unit test.', `${cy(2)} complete: log it.`)}
${W('Nov 16–20', 'off', 'Unit 10 begins: AR.2.2', 'Teach as planned', 'No Check: the week before a break', 'John previews C-AR.2.2.')}
${W('Nov 23–27', 'off', 'Thanksgiving break', '', '', '')}
${W('Nov 30–Dec 4', '', 'Unit 10: AR.2.2', 'Teach as planned', '<b>Check C-AR.2.2</b>', 'Pick the AR.2.2 reteach. John previews C-AR.2.1.')}
${W('Dec 7–11', '', 'Unit 10: AR.2.1', 'Mon: reteach AR.2.2<br>Tue: <b>Re-check C-AR.2.2</b> + <b>Review C-AR.1.2</b>', '<b>Check C-AR.2.1</b>', `Pick the AR.2.1 reteach. ${cy(3)} complete: log it.`)}
${W('Dec 14–18', '', 'Unit 10 review and test', 'Mon: reteach AR.2.1<br>Tue: <b>Re-check C-AR.2.1</b> + <b>Review C-AR.2.2</b>', 'No new Check: the week before winter break', `${cy(4)} complete: log it. Q2 snapshot and reflection.`)}
</table>
<div class="box"><p><b>Built on:</b> Unit 9 from October 21 to November 13 and Unit 10 from November 16 to December 18, with two-step equations (AR.2.2) taught before one-step inequalities (AR.2.1). If your order or pacing differs, move the rows: each Check goes on the Wednesday of the week its benchmark is taught, and the rest of the routine follows it.</p>
<p><b>Lake County dates:</b> no school Wednesday, November 11 (Veterans Day) and November 23–27 (Thanksgiving); the second quarter ends December 18. Short weeks, unit-test weeks and weeks before a break are logged as “no check”, as the DPP says.</p>
<p><b>By winter break:</b> 4 Checks and 4 complete reteach cycles, 3 of them with a Review form.</p></div>

<h2>Which Review form goes with which Re-check</h2>
<table><tr><th style="width:21%">Re-check</th><th style="width:19%">Review form with it</th><th>Why that one</th></tr>
<tr><td class="k">C-AR.1.1 · Nov 3</td><td>none</td><td>The first cycle: no earlier benchmark has been re-checked yet.</td></tr>
<tr><td class="k">C-AR.1.2 · Nov 10</td><td>C-AR.1.1 Review</td><td rowspan="3">Always the benchmark from the cycle before. It was retaught and re-checked in the cycle before and not retaught since, so its change from that Re-check to this Review shows what happens without a reteach. The retaught benchmark’s gain (Check → Re-check) has to beat that change: that is impact measure 1.</td></tr>
<tr><td class="k">C-AR.2.2 · Dec 8</td><td>C-AR.1.2 Review</td></tr>
<tr><td class="k">C-AR.2.1 · Dec 15</td><td>C-AR.2.2 Review</td></tr></table>
<div class="small" style="margin-top:4px">If the PLC ever decides “no reteach” for a benchmark, it has no Re-check; its Check score is the starting point when it comes up as a Review.</div>

<h2 class="pb">Thursday PLC: 10 minutes</h2>
<ol>
<li><b>Open the results.</b> Your school copy of Wednesday’s Check → Responses → Summary. Each question shows how many got it right. Find the lowest.</li>
<li><b>Read the wrong answers.</b> On that question, find the answer most students picked. The PLC item guide says what it means and names the reteach lesson.</li>
<li><b>Decide and log.</b> The lowest question, the wrong answer behind it, the reteach lesson, and the day each of you teaches it. Use the log page.</li>
<li><b>Look at the self-ratings.</b> The last question on the Check: how many rated themselves at the level their score shows (5 right = level 4, 4 = level 3, 2–3 = level 2, 0–1 = level 1)? That is impact measure 3.</li>
<li><b>Preview next week’s Check.</b> John reviews its five questions for alignment and rigor (his action step). The paper copy is the quickest way.</li>
</ol>
<div class="box"><p><b>Two questions tied?</b> Pick the one whose wrong answers bunch on one choice: one clear mistake is the easiest to reteach.</p>
<p><b>80% or more at mastery?</b> The decision can be “no reteach”. Log it, and skip that Re-check.</p></div>

<h2>Building and giving the forms</h2>
<ol>
<li><b>Not built yet:</b> follow <i>00 Script setup</i> in the kit. To build these 12 first, set <code>ONLY: 'Unit 9, Unit 10'</code> and run buildForms (about 6 minutes); clear it later and run again for the rest.</li>
<li><b>Built with the earlier kit:</b> keep those forms; the questions and keys are the same. Paste the new Code.gs over the old one and run <b>updateMessages</b> once, so the page students see after submitting stops mentioning a progress strip.</li>
<li><b>Each week:</b> signed in to your school account, links sheet → <b>Copy link</b> → Make a copy → Locked mode on for Unit 9 forms → <b>Publish</b> to your school → post the link in your Classroom and send it to John for his.</li>
<li><b>Keep the results:</b> on each school copy, Responses → <b>Link to Sheets</b> → your one DPP responses spreadsheet. After the first Check, send Claude that tab’s header row (no student rows) and the tracker gets rebuilt to read the responses directly, names and all, inside your school account.</li>
<li><b>Paper day:</b> print from <i>04 Paper copies</i>, score with the key line in the item guide, and enter the scores by hand.</li>
</ol>

<h2>DPP evidence to save by December 18</h2>
<table><tr><th style="width:36%">What the DPP lists</th><th>From Units 9 and 10</th></tr>
<tr><td>Tracking sheet snapshot with a written reflection, end of Q2</td><td>Save a copy of the tracking sheet on December 17 or 18 and write the reflection: what the four cycles showed.</td></tr>
<tr><td>The PLC decision log</td><td>The log page that follows, filled in.</td></tr>
<tr><td>Sample checks with the scale and answer keys</td><td>Any Check from <i>04 Paper copies</i> with its page from the item guide.</td></tr>
<tr><td>One check’s results summary and three student progress records per quarter, names removed</td><td>Print the Summary page of one Check. Choose three students and copy their score and self-rated level for each week, without their names.</td></tr>
</table>

<div class="logp"><h2>PLC log · Units 9 and 10</h2>
<table class="log"><tr><th style="width:7%">Date</th><th style="width:12%">Results looked at</th><th style="width:12%">Lowest question (% right)</th><th style="width:19%">Most-picked wrong answer: what it means</th><th style="width:15%">Reteach lesson · day</th><th style="width:13%">Self-ratings matching</th><th>Notes · next Check previewed</th></tr>
${[['Oct 29', 'Check C-AR.1.1'], ['Nov 5', 'Check C-AR.1.2<br>Re-check C-AR.1.1'], ['Nov 12', 'Re-check C-AR.1.2<br>Review C-AR.1.1'], ['Nov 19', '(preview C-AR.2.2)'], ['Dec 3', 'Check C-AR.2.2'], ['Dec 10', 'Check C-AR.2.1<br>Re-check C-AR.2.2<br>Review C-AR.1.2'], ['Dec 17', 'Re-check C-AR.2.1<br>Review C-AR.2.2']]
    .map(([d, c]) => `<tr><td>${d}</td><td>${c}</td><td></td><td></td><td></td><td></td><td></td></tr>`).join('')}
</table>
<div class="small" style="margin-top:6px">This is the PLC decision log the DPP names as evidence. Keep it in the binder, or copy each row into the tracker’s log tab.</div></div>`;
  return page(css, b);
}

// ───────────────────────── print ─────────────────────────
(async () => {
  const docs = [
    ['00 Start here - Units 9 and 10.pdf', guideHTML()],
    ['01 Scales to post.pdf', postersHTML()],
    ['02 PLC item guide and answer keys.pdf', itemGuideHTML()],
    ['03 Reteach lessons.pdf', reteachHTML()],
    ['04 Paper copies of the forms.pdf', paperHTML()],
  ];
  const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
  const p = await b.newPage();
  for (const [name, html] of docs) {
    const hp = HTML + name.replace(/\.pdf$/, '.html');
    fs.writeFileSync(hp, html);
    await p.goto(file(hp));
    await p.waitForLoadState('load');
    await p.evaluate(() => document.fonts.ready);
    // as on the form images: figure labels drawn after (on top of) the lines beside them
    await p.evaluate(() => document.querySelectorAll('.qc svg text').forEach(t => t.parentNode.appendChild(t)));
    if (name.startsWith('03') || name.startsWith('01')) {
      // shrink each slide's --k until nothing spills past its bottom padding
      const ks = await p.evaluate(() => {
        const out = [];
        const fits = s => { const r = s.getBoundingClientRect(), pad = parseFloat(getComputedStyle(s).paddingBottom);
          let max = 0; s.querySelectorAll('*').forEach(e => { const b = e.getBoundingClientRect(); if (b.height) max = Math.max(max, b.bottom); });
          // a flex box that has squeezed below its content (the poster rows above the footer line) also counts
          const squeezed = [...s.querySelectorAll('.rows, .colL, .colR')].some(e => e.scrollHeight > e.clientHeight + 1);
          return max <= r.bottom - pad + 0.5 && !squeezed; };
        document.querySelectorAll('.slide, .poster').forEach((s, i) => { let k = s.classList.contains('poster') ? 1.3 : 1.16; s.style.setProperty('--k', k);
          while (!fits(s) && k > 0.7) { k = Math.round((k - 0.02) * 100) / 100; s.style.setProperty('--k', k); }
          out.push([i + 1, k, fits(s)]); });
        return out;
      });
      console.log('  slide sizes:', ks.map(([i, k, ok]) => `${i}:${k}${ok ? '' : ' OVERFLOW'}`).join(' '));
    }
    await p.pdf({ path: OUT + name, preferCSSPageSize: true, printBackground: true });
    console.log('pdf', name);
  }
  await b.close();
})();
