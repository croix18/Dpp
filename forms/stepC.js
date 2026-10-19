// Forms edition, step C: render one question image and one answer image per item, plus one scale image
// per benchmark, with Cadence's own typesetting (fractions, figures, tables) in Lexend.
// Reads plan_forms.json, forms_spec.json, scales.json. Writes forms/png/*.png.
//   ONLY=MA.7.AR.4.3 node forms/stepC.js   renders one benchmark (for checking)
const { chromium } = require('playwright');
const fs = require('fs');
const ROOT = '/home/claude/dpp/';
const PLAN = JSON.parse(fs.readFileSync(ROOT + 'forms/plan_forms.json', 'utf8')).bench;
const SPEC = JSON.parse(fs.readFileSync(ROOT + 'forms/forms_spec.json', 'utf8'));
const S = JSON.parse(fs.readFileSync(ROOT + 'scales.json', 'utf8'));
const OUT = ROOT + 'forms/png/';
const ONLY = process.env.ONLY || '';
fs.mkdirSync(OUT, { recursive: true });

(async () => {
  const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
  const ctx = await b.newContext({ deviceScaleFactor: 2, viewport: { width: 900, height: 1200 } });
  const p = await ctx.newPage();
  p.on('console', m => { if (m.type() === 'error') console.log('ERR', m.text().slice(0, 200)); });
  await p.goto('file://' + ROOT + 'forms/cadence_render.html');   // cadence.html with one fix: accented names (Tomás) stay words
  await p.waitForTimeout(1500);

  const cards = await p.evaluate(({ PLAN, SPEC, S, ONLY }) => {
    const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;');
    const LT = 'ABCDEFGHI';
    const figOnlyChoice = q => Array.isArray(q.opts) && q.opts.every(o => /^(Graph|Number line|Display) [A-D]$/.test(String(o)));
    const optsBlock = (q, Q) => {
      if (!q.opts || Q.native || figOnlyChoice(q)) return '';
      const lead = q.inst ? `<div class="inst">${q.inst}</div>` : '';
      return lead + `<div class="opts">${q.opts.map((o, i) => `<div class="opt"><span class="ol">${LT[i]}.</span><span class="ot">${fmtFrac(String(o))}</span></div>`).join('')}</div>`;
    };
    const note = Q => Q.type === 'Short answer' ? `<div class="note">${esc(Q.note)}</div>` : Q.native ? `<div class="note">Check every box that is correct.</div>` : '';
    const out = [];
    let html = '';
    SPEC.forms.forEach(F => {
      if (ONLY && F.code !== ONLY) return;
      F.questions.forEach(Q => {
        const [code, sn, i] = Q.slot.split('/');
        const q = PLAN[code][sn][+i];
        const key = Q.slot.replace(/\//g, '_');
        const stem = String(q.q).replace(/\n\n(<table)/g, '$1').replace(/(<\/table>)\n\n/g, '$1').replace(/terms of π([.?])/g, '<span style="white-space:nowrap">terms of π$1</span>');
        html += `<div class="card" id="q_${key}"><div class="stem">${fmtQ(stem)}</div>${figHTML(q)}${optsBlock(q, Q)}${note(Q)}</div>`;
        let ans;
        const A = fmtFrac(String(q.a).replace(/\.;\s/g, '; '));   // not fmtAns: its mixed-number gloss breaks expressions
        if (Q.type === 'Short answer') ans = `<div class="ans"><span class="lab">Answer</span> ${A}</div><div class="acc">Forms answer key: ${Q.accept.map(esc).join(' &nbsp;·&nbsp; ')}</div>`;
        else if (Q.native) ans = `<div class="ans"><span class="lab">Answer</span> ${Q.correct.map(esc).join(', ')}</div><div class="acc">Forms answer key: check ${Q.correct.map(esc).join(', ')}</div>`;
        else ans = `<div class="ans"><span class="lab">Answer</span> ${A}</div>${Q.type === 'Checkboxes' ? `<div class="acc">Forms answer key: check ${Q.correct.join(', ')}. One point only for exactly those boxes.</div>` : ''}`;
        const sol = q.s ? `<div class="sol">${fmtFrac(String(q.s).replace(/\n/g, '<br>'))}</div>` : '';
        html += `<div class="card answer" id="a_${key}"><div class="aid">${esc(F.id)} · ${esc(F.label)} · Question ${Q.n}${Q.hr ? ' · <b>Rigor</b>' : ''}</div>${ans}${sol}</div>`;
        out.push({ key, sel: `[id="q_${key}"]`, kind: 'q' }, { key, sel: `[id="a_${key}"]`, kind: 'a' });
      });
    });
    S.order.forEach(([u, t, codes]) => codes.forEach(code => {
      if (ONLY && code !== ONLY) return;
      const sc = S.scales[code];
      html += `<div class="card scale" id="s_${code.replace(/\./g, '_')}"><div class="goal"><span class="lab">Learning goal</span> ${esc(sc.goal)}</div>
        <table><tr><td class="n">4</td><td>${esc(sc.l4)}</td></tr><tr><td class="n">3</td><td>${esc(sc.l3)}</td></tr><tr><td class="n">2</td><td>${esc(sc.l2)}</td></tr><tr><td class="n">1</td><td>I need help to start this.</td></tr></table></div>`;
      out.push({ key: code, sel: `[id="s_${code.replace(/\./g, '_')}"]`, kind: 's' });
    }));
    const css = `
      body > *:not(#fx){display:none !important}
      body{background:#fff;margin:0}
      #fx{display:block;padding:10px;background:#fff;font-family:Lexend,Arial,sans-serif;color:#111;--paper:Lexend;--figf:Lexend}
      #fx svg text{font-family:Lexend,Arial,sans-serif}
      .card{width:640px;box-sizing:border-box;padding:18px 22px 20px;margin:0 0 14px;background:#fff;font-size:17px;line-height:1.5}
      .card .stem{margin:0}
      .card .figwrap{margin:12px 0 4px}
      .card .figwrap svg{display:block;width:100%;max-width:360px;height:auto}
      .card .figwrap svg.wide{max-width:560px}
      .card .figwrap svg.quad{max-width:596px}
      .card .figwrap svg.nl4{max-width:520px}
      .card table.ftab{border-collapse:collapse;margin:10px 0;font-size:16px}
      .card table.ftab td,.card table.ftab th{border:1px solid #888;padding:3px 14px;text-align:center}
      .card table.ftab th{background:#f1f1f1;font-weight:600}
      .rep,.rad{text-decoration:overline}
      .inst{margin:12px 0 0;font-style:italic;font-size:15.5px}
      .opts{margin:10px 0 0}
      .opt{display:flex;gap:10px;align-items:baseline;padding:4px 0}
      .card .ol{font-weight:700;min-width:1.5em;flex:none;color:#111}
      .note{margin-top:14px;padding-top:9px;border-top:1px solid #ddd;font-size:14.5px;color:#444}
      .answer{font-size:15.5px}
      .aid{font-size:12.5px;color:#666;margin-bottom:6px;letter-spacing:.01em}
      .lab{display:inline-block;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:.06em;color:#fff;background:#1f2a44;border-radius:4px;padding:1px 7px;margin-right:6px;vertical-align:2px}
      .ans{font-weight:600;font-size:17px}
      .acc{margin-top:6px;font-size:14px;color:#333}
      .sol{margin-top:10px;color:#333;line-height:1.85}
      .scale{font-size:15.5px}
      .scale .goal{font-weight:600;margin-bottom:8px}
      .scale table{border-collapse:collapse;width:100%}
      .scale td{border-top:1px solid #ccc;padding:6px 8px;vertical-align:top;line-height:1.4}
      .scale td.n{width:26px;font-weight:700;text-align:center;border-right:1px solid #ccc;font-size:17px}
      .katex{font-size:1.02em}
      .card .katex .katex-strut{margin-top:.3em}
      #fx svg text:not([stroke]){paint-order:stroke;stroke:#fff;stroke-width:2.4px;stroke-linejoin:round}
    `;
    const st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);
    const d = document.createElement('div'); d.id = 'fx'; d.innerHTML = html; document.body.appendChild(d);
    document.body.classList.remove('inking');
    return out;
  }, { PLAN, SPEC, S, ONLY });

  // figure labels go on top of the lines drawn after them (same parent, so positions do not change)
  await p.evaluate(() => {
    document.querySelectorAll('#fx svg text').forEach(t => t.parentNode.appendChild(t));
    // a one-letter axis title reads better upright ("y", not a sideways y that looks like a symbol)
    document.querySelectorAll('#fx svg g[transform*="rotate(-90)"]').forEach(g => {
      const ts = g.querySelectorAll('text');
      if (ts.length === 1 && ts[0].textContent.trim().length === 1) g.setAttribute('transform', g.getAttribute('transform').replace(/\s*rotate\(-90\)/, ''));
    });
    // dashed guide lines drawn in the light grid color are too faint on screen
    document.querySelectorAll('#fx svg [stroke-dasharray]').forEach(e => {
      if ((e.getAttribute('stroke') || '').toLowerCase() === '#d8d5cd') { e.setAttribute('stroke', '#8a867d'); e.setAttribute('stroke-width', '1.5'); }
    });
  });
  await p.waitForTimeout(800);
  // layout checks: nothing may spill out of a card
  const spill = await p.evaluate(() => [...document.querySelectorAll('.card')].filter(c => c.scrollWidth > c.clientWidth + 1).map(c => c.id));
  if (spill.length) console.log('OVERFLOW', spill.join(' '));
  let n = 0;
  for (const c of cards) {
    const el = await p.$(c.sel);
    const name = c.kind === 's' ? `${c.key}-scale.png` : `${c.key}-${c.kind}.png`;
    await el.screenshot({ path: OUT + name });
    n++;
  }
  console.log('rendered', n, 'images');
  await b.close();
})();
