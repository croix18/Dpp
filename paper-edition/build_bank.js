// Builds the DPP check bank inside Cadence's own page so items render with Cadence's typesetting.
const { chromium } = require('playwright');
const fs = require('fs');
const S = JSON.parse(fs.readFileSync('scales.json', 'utf8'));
const BACKSTOPS = [
  ['Q2', 'Units 2-5', ['MA.7.DP.2.2', 'MA.7.NSO.2.2', 'MA.7.NSO.2.3', 'MA.7.GR.1.2', 'MA.7.GR.1.3']],
  ['Q3', 'Units 2-9', ['MA.7.NSO.2.2', 'MA.7.GR.1.5', 'MA.7.AR.3.2', 'MA.7.AR.3.1', 'MA.7.AR.1.1']],
  ['Q4', 'Units 2-12', ['MA.7.NSO.2.3', 'MA.7.AR.3.1', 'MA.7.AR.2.2', 'MA.7.AR.4.2', 'MA.7.GR.2.3']],
];

(async () => {
  const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
  const p = await b.newPage();
  p.on('console', m => { if (m.type() === 'error' || /NULL draw/.test(m.text())) console.log('ERR', m.text().slice(0, 200)); });
  await p.addInitScript(() => { let a = 20261026 >>> 0; Math.random = () => { a = (a + 0x6D2B79F5) >>> 0; let t = a; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; });
  await p.goto('file:///home/claude/dpp/cadence.html');
  await p.waitForTimeout(1500);

  const PAGES = fs.existsSync('pages.json') ? JSON.parse(fs.readFileSync('pages.json','utf8')) : {};
  const html = await p.evaluate(({ S, BACKSTOPS, PAGES }) => {
    window.__ITEMS = []; window.__PLAN = { bench: {}, back: {} };
    const used = new Set();
    const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;');
    let setGens = new Set(), benchAns = new Set();
    const mk = (code, hr) => {
      const bankN = getBank(code, hr).length; let q = null;
      // a set should not repeat a shape or a stem template: key = shape word if any, else the stem with numbers stripped
      const keyOf = c => { const t = plain(String(c.q)).toLowerCase(); const m = t.match(/trapezoid|parallelogram|rhombus|rectangle|triangle|circle|cylinder|semicircle|square/); return m ? 'shape:' + m[0] : 'stem:' + t.replace(/[\d.,\u2212\-\/]+/g, '#').slice(0, 48); };
      const tmplOf = c => 'tmpl:' + plain(String(c.q)).replace(/\b[A-Z][a-z]+\b/g, 'NAME').toLowerCase().replace(/[\d.,\u2212\-\/]+/g, '#').slice(0, 60);
      const ansOf = c => { const a = plain(String(c.a)).toLowerCase().replace(/\s+/g, ' ').trim(); return /^[a-e]\.?$/.test(a) ? 'ans:' + Math.random() : 'ans:' + a; };
      const genKey = c => hr + ':' + c._genIdx;
      let best = null, bestScore = -Infinity;
      for (let t = 0; t < 14; t++) {
        let c = null; for (let r = 0; r < 6 && !c; r++) c = buildProblem(code, hr, used, 14); if (!c && hr) for (let r = 0; r < 6 && !c; r++) c = buildProblem(code, false, used, 14); if (!c) break;
        const score = (setGens.has(keyOf(c)) ? 0 : 2) + (setGens.has(genKey(c)) ? 0 : 1) + (setGens.has(tmplOf(c)) || benchAns.has(ansOf(c)) ? -3 : 0);
        if (score > bestScore) { best = c; bestScore = score; }
        if (score === 3 || (bankN <= 1 && score >= 2)) break;
      }
      q = best; if (!q) throw new Error('no item ' + code); window.__ITEMS.push({ code, hr, gen: q._genIdx, rt: q.rt || '', q: plain(String(q.q)), a: plain(String(q.a || '')), opts: q.opts ? q.opts.map(o => plain(String(o))) : null, ft: q.ft || '' }); setGens.add(keyOf(q)); setGens.add(genKey(q)); setGens.add(tmplOf(q)); benchAns.add(ansOf(q)); return q;
    };
    const LT = 'ABCDEFGH';
    const opts = q => q.rt === 'ms' && Array.isArray(q.opts) ? `${q.inst ? `<div class="rt-inst">${q.inst}</div>` : ''}<div class="opts">${q.opts.map((o, i) => `<div class="opt"><span class="ol">&#9744; ${LT[i]}.</span><span class="ot">${fmtFrac(String(o))}</span></div>`).join('')}</div>` : optsHTML(q);
    const item = (q, i) => `<div class="it"><div class="qt"><b>${i + 1}.</b> ${fmtQ(q.q)}</div>${figHTML(q)}${opts(q)}</div>`;
    const keyItem = (q, i) => `<div class="ki"><div><b>${i + 1}.</b> <span class="tag">${q._hr ? 'Rigor' : 'Regular'}</span> <span class="an">${fmtAns(q.a)}</span></div>${q.s ? `<div class="st">${fmtFrac(String(q.s).replace(/\n/g, '<br>'))}</div>` : ''}</div>`;

    const scaleBlock = (code) => {
      const sc = S.scales[code];
      return `<div class="scale"><div class="goal"><b>Learning goal:</b> ${esc(sc.goal)} <span class="dim">(circle your level after scoring)</span></div>
      <table class="sc"><tr><td class="n">4</td><td>${esc(sc.l4)}</td></tr><tr><td class="n">3</td><td>${esc(sc.l3)}</td></tr><tr><td class="n">2</td><td>${esc(sc.l2)}</td></tr><tr><td class="n">1</td><td>I need help to start this benchmark.</td></tr></table></div>`;
    };
    const sheet = (id, code, label, meta, items, withScale, calc) => {
      const hd = (cont) => `<div class="hd"><span class="t">7th Grade Math &middot; ${label}${cont ? ' (continued)' : ''}</span><span class="id">${esc(id)}</span></div>
      <div class="meta"><span>${meta}</span><span>${cont ? 'Student code: ________' : 'Student code: ________ &nbsp; Calculator: ' + calc}</span></div>`;
      const front = items, back = [];
      return `<div class="page sheet front" data-sheet="${esc(id)}">${hd(false)}${withScale ? scaleBlock(code) : ''}<div class="items fill">${front.map(item).join('')}</div><div class="turn">Turn over &rarr;</div></div>
      <div class="page sheet back" data-sheet="${esc(id)}">${hd(true)}<div class="items fill">${back.map((q, i) => item(q, i + 3)).join('')}</div>
      <div class="ft">Score: ____ / ${items.length} &nbsp;&nbsp;&nbsp; My level: &nbsp;1 &nbsp; 2 &nbsp; 3 &nbsp; 4 &nbsp;&nbsp;&nbsp; &rarr; copy both to your progress strip</div></div>`;
    };
    const half = (id, code, label, items, withScale, calc) => `<div class="half">
      <div class="hd"><span class="t">7th Grade Math &middot; ${label}</span><span class="id">${esc(id)}</span></div>
      <div class="meta"><span>Benchmark: <b>${esc(code)}</b> &middot; ${esc(STD[code].l)}</span><span>Student code: ________ &nbsp; Calculator: ${calc}</span></div>
      ${withScale ? scaleBlock(code) : ''}
      <div class="items">${items.map(item).join('')}</div>
      <div class="ft">Score: ____ / ${items.length} ${withScale ? '&nbsp;&nbsp;&nbsp; My level: &nbsp;1 &nbsp; 2 &nbsp; 3 &nbsp; 4 &nbsp;&nbsp;&nbsp; &rarr; copy both to your progress strip' : '&nbsp;&nbsp;&nbsp; &rarr; copy to your progress strip'}</div></div>`;
    const quarter = (id, code, label, items) => `<div class="quarter">
      <div class="hd"><span class="t">${label}</span><span class="id">${esc(id)}</span></div>
      <div class="meta"><span>${esc(code)}</span><span>Code: ______</span></div>
      <div class="items small">${items.map(item).join('')}</div>
      <div class="ft">Score: ____ / ${items.length}</div></div>`;

    let out = '';
    // cover + index
    out += `<div class="page cover"><h1>DPP 2026-27 &mdash; 7th Grade Math Weekly Checks</h1>
      <p><b>Read this page first.</b> Everything for the year is in this one file. Nothing here needs to be written before it is copied; the only blanks are the ones students or teachers fill in by hand during the week.</p>
      <h3>What is in this file</h3>
      <table class="idx"><tr><th>Part</th><th>What it is</th><th>Who writes on it</th><th>Where</th></tr>
      <tr><td><b>Index</b></td><td>Every benchmark in unit order with its check ID and page number</td><td>Nobody</td><td>Next page</td></tr>
      <tr><td><b>Scale library</b></td><td>All 34 learning goals and 4-level scales, for the board</td><td>Nobody</td><td>After the index</td></tr>
      <tr><td><b>Weekly check</b> (one per benchmark)</td><td>One sheet per student, front and back: learning goal, scale, 5 items, score box on the back. Always starts on an odd page, so copy two pages two-sided.</td><td>Students, on Thursday</td><td>See index</td></tr>
      <tr><td><b>Answer key</b></td><td>Answers and worked solutions for the check, re-check and comparison items</td><td>Nobody. Read it aloud for peer scoring</td><td>Page after each check</td></tr>
      <tr><td><b>Reteach plan</b></td><td>One-page planner for Tuesday's reteach; fill in Monday</td><td>Croix (copy for John)</td><td>Page after each key</td></tr>
      <tr><td><b>Re-check half</b> (-R)</td><td>3 items on the benchmark that was retaught; two copies per page</td><td>Students, on Wednesday</td><td>After each key</td></tr>
      <tr><td><b>Comparison half</b> (-X)</td><td>2 items on a benchmark that was taught but not retaught; two copies per page</td><td>Students, on Wednesday, with the -R half</td><td>After each -R page</td></tr>
      <tr><td><b>Backstop checks</b> (Q2, Q3, Q4)</td><td>Mixed review check for a week when no new check is ready</td><td>Students</td><td>Back of the file, before the forms</td></tr>
      <tr><td><b>Tally sheet</b></td><td>One per teacher per week: 25 scores, trouble item, reteach decision</td><td>Croix and John</td><td>Last 3 pages</td></tr>
      <tr><td><b>Progress strip</b></td><td>One per student per quarter: their scores and levels, kept in the notebook</td><td>Students</td><td>Last 3 pages</td></tr>
      <tr><td><b>Check calendar</b></td><td>Week-by-week list to mark which weeks have a check</td><td>Croix, once</td><td>Last page</td></tr></table>
      <h3>One week, start to finish</h3>
      <ol>
      <li><b>Before Thursday (Croix, ~5 min):</b> look up this week's benchmark in the index. Copy its two check pages two-sided, one per student, for both sections. Copy the key once. Put the key in the binder.</li>
      <li><b>Thursday, last 8 minutes (both):</b> students take the check. They swap papers, you read the key aloud, they score it, circle their level, and copy score and level onto their progress strip. Collect the checks.</li>
      <li><b>Thursday or Friday (both, ~5 min):</b> copy the 25 scores onto a tally sheet. Write the item that gave the most trouble. Put the sheet in the binder.</li>
      <li><b>Monday (Croix, ~5 min):</b> look at both tally sheets, decide what to reteach, write it on the decision line of both sheets. Photograph them and type the numbers into the tracking sheet.</li>
      <li><b>Monday (Croix, ~5 min):</b> copy the -R half for the retaught benchmark and the -X half for the most recent benchmark that was not retaught. One of each per student, both sections.</li>
      <li><b>Tuesday bellwork (both):</b> reteach the trouble item type, 8-10 minutes.</li>
      <li><b>Wednesday bellwork (both):</b> students take the -R and -X halves, peer-score, write the two numbers on their strip. Copy the numbers onto the tally sheet.</li>
      </ol>
      <p>Weeks with a unit test, a break, or only three days: no check. Mark them on the calendar now.</p></div>
      <div class="page"><h1>Index</h1><p>Unit order follows Math Nation Grade 7. The check ID is the benchmark, so it does not matter which week a unit lands.</p>
      <table class="idx"><tr><th>Unit</th><th>Benchmark</th><th>Check ID</th><th>What it covers</th><th>Page</th></tr>`;
    S.order.forEach(([u, t, codes]) => codes.forEach((c, i) => {
      out += `<tr>${i === 0 ? `<td rowspan="${codes.length}"><b>${u}</b> ${esc(t)}</td>` : ''}<td>${c}</td><td>${c.replace('MA.7.', 'C-')}</td><td>${esc(STD[c].l)}</td><td>${PAGES[c.replace('MA.7.', 'C-')] || ''}</td></tr>`;
    }));
    out += `</table></div>`;
    // scale library
    out += `<div class="page"><h1>Scale library &mdash; learning goals and performance scales</h1><p>Student language, one per benchmark. Level 3 is the benchmark; level 2 is the foundational skill; level 4 is application. Printed on every check; also usable on the board.</p><table class="lib"><tr><th>Benchmark</th><th>Learning goal</th><th>Level 2</th><th>Level 3</th><th>Level 4</th></tr>`;
    S.order.forEach(([u, t, codes]) => codes.forEach(c => { const s = S.scales[c]; out += `<tr><td><b>${c}</b><br><span class="dim">Unit ${u}</span></td><td>${esc(s.goal)}</td><td>${esc(s.l2)}</td><td>${esc(s.l3)}</td><td>${esc(s.l4)}</td></tr>`; }));
    out += `</table></div>`;

    out += `<div class="page cover"><h1>Thursday routine &mdash; peer scoring in 3 minutes</h1>
      <p>Same words every week so it runs itself by November.</p>
      <ol>
      <li><b>"Pencils down. Pass your paper to your scoring partner."</b> Partners are fixed (seat neighbor). Scorer writes their own code small in the top corner.</li>
      <li><b>Read the key aloud, item by item.</b> "Number 1, B." For a short-answer item read the answer and the one thing that must be present ("18&pi; centimeters; the &pi; has to be there"). Scorer marks a check or an X next to each item. No partial credit.</li>
      <li><b>"Write the score out of 5 in the box. Pass it back."</b></li>
      <li><b>Owner circles their level on the scale</b> and copies score and level onto their progress strip. (Level is theirs to judge; it is not a grade.)</li>
      <li><b>Collect.</b> Checks go in the period folder. Copy the 25 numbers onto the tally sheet when you have five minutes; write the item that gave the most trouble.</li>
      </ol>
      <h3>Rules that keep the data clean</h3>
      <ul style="font-size:9.5px;line-height:1.5"><li>Spot-check five papers a week against the key. If a class can't be trusted to score, score that section yourself for a month.</li>
      <li>Absent = A on the tally sheet, never 0.</li><li>The score is never a grade. Classwork points are for doing the check and filling in the strip.</li>
      <li>Wednesday's re-check runs the same way, with the -R and -X halves scored as two numbers (/3 and /2).</li></ul>
      <h3>Reteach plan page</h3><p>After each answer key there is a one-page reteach planner. Fill it in on Monday when the decision is made; it is the plan for both rooms on Tuesday, and three of them per quarter go in the DPP folder as evidence of the reteach step.</p></div>`;
    const replan = (id, code) => `<div class="page cover replan"><h1>Reteach plan &mdash; ${esc(id)}</h1><p class="dim">${esc(code)} &middot; ${esc(STD[code].l)}</p>
      <div class="rbox" style="height:0.6in"><b>Item that gave the most trouble (from both tally sheets):</b></div>
      <div class="rbox" style="height:0.8in"><b>What the mistake looks like:</b></div>
      <div class="rbox" style="height:2.6in"><b>Worked example for Tuesday (8&ndash;10 min):</b></div>
      <div class="rbox" style="height:2.2in"><b>Three practice items (one change at a time):</b></div>
      <div class="rbox" style="height:0.9in"><b>Decision line:</b> Reteach on ______ &nbsp;&nbsp; Huddle: in person / paper &nbsp;&nbsp; Date: ______ &nbsp;&nbsp; Re-check given on ______</div></div>`;
    // per benchmark
    S.order.forEach(([u, t, codes]) => codes.forEach(code => {
      const id = code.replace('MA.7.', 'C-');
      const calc = /NSO\.2\.2|NSO\.2\.1|NSO\.1\.1|NSO\.1\.2|AR\.1\./.test(code) ? 'no' : 'yes';
      benchAns = new Set(); setGens = new Set(); const chk = [mk(code, false), mk(code, false), mk(code, false), mk(code, false), mk(code, true)];
      setGens = new Set(); const re = [mk(code, false), mk(code, false), mk(code, false)];
      setGens = new Set(); const cmp = [mk(code, false), mk(code, false)];
      window.__PLAN.bench[code] = JSON.parse(JSON.stringify({ chk, re, cmp }));
      const label = `Weekly Check &middot; Unit ${u}`;
      out += sheet(id, code, label, `Benchmark: <b>${esc(code)}</b> &middot; ${esc(STD[code].l)}`, chk, true, calc);
      out += `<div class="page key"><h2>Answer key &mdash; ${id} &middot; ${esc(code)} &middot; ${esc(STD[code].l)}</h2><div class="dim">Unit ${u}: ${esc(t)}. Regular = on-benchmark item; Rigor = the item that needs the benchmark's reasoning. Mastery on the weekly check = 4 of 5.</div>
        <h3>Weekly check (5 items)</h3>${chk.map(keyItem).join('')}
        <h3>Re-check strip (3 items, ${id}-R)</h3>${re.map(keyItem).join('')}
        <h3>Comparison strip (2 items, ${id}-X) &mdash; used on a later week's re-check when this benchmark was <i>not</i> retaught</h3>${cmp.map(keyItem).join('')}</div>`;
      out += replan(id, code);
      out += `<div class="page two">${half(id + '-R', code, 'Re-check (3 items)', re, false, calc)}<div class="cut"></div>${half(id + '-R', code, 'Re-check (3 items)', re, false, calc)}</div>`;
      out += `<div class="page two">${half(id + '-X', code, 'Comparison items (2)', cmp, false, calc)}<div class="cut"></div>${half(id + '-X', code, 'Comparison items (2)', cmp, false, calc)}</div>`;
    }));
    // backstops
    BACKSTOPS.forEach(([q, span, codes]) => {
      const id = `BACKSTOP-${q}`;
      benchAns = new Set(); setGens = new Set(); const items = codes.map(c => mk(c, false));
      window.__PLAN.back[q] = JSON.parse(JSON.stringify(items));
      out += sheet(id, null, `Cumulative Check (${esc(span)})`, 'Mixed benchmarks from earlier units', items, false, 'yes');
      
      out += `<div class="page key"><h2>Answer key &mdash; ${id}</h2><div class="dim">Given when no new check is ready by Thursday. Logged as a real check (Backstop = y in CHECKS).</div>${items.map((it, i) => keyItem(it, i).replace('</b>', `</b> <span class="tag">${it.standard}</span>`)).join('')}</div>`;
      out += `<div class="page cover"><p class="dim">(blank: keeps the next check on a front page for two-sided copying)</p></div>`;
    });
    return out;
  }, { S, BACKSTOPS, PAGES });

  const css = `
  body > *:not(#dpp){display:none !important}
  #dpp{display:block;width:7.8in;margin:0;font-size:12.5px;font-family:Lexend,Arial,Helvetica,sans-serif;color:#111;background:#fff;--paper:Lexend;--figf:Lexend}
  #dpp svg text{font-family:Lexend,Arial,sans-serif}
  #dpp .opt,#dpp .ot,#dpp .ol,#dpp .rt-inst,#dpp .ftab,#dpp .mtab{font-size:1em}#dpp .opt .katex{font-size:1.04em}
  .page.two.single{height:auto;min-height:10.2in;overflow:visible;display:block}.page.two.single .half{flex:none;height:auto;overflow:visible}.page.two.single .it{min-height:1.3in}
  @page{size:letter;margin:0.35in}
  .page{page-break-after:always;box-sizing:border-box;height:10.3in;overflow:hidden;position:relative}
  .page:last-child{page-break-after:auto}
  .page.two{display:flex;flex-direction:column}
  .half{flex:1 1 0;box-sizing:border-box;padding:0 2px 4px 2px;overflow:hidden;display:flex;flex-direction:column;min-height:0}
  .page.sheet{display:flex;flex-direction:column;height:10.2in;overflow:hidden}
  .page.sheet .items.fill{flex:1 1 0;display:flex;flex-direction:column;min-height:0}
  .page.sheet .items.fill .it{flex:1 1 auto;min-height:0;overflow:hidden}
  .page.sheet .figwrap{width:var(--figw,3.4in);max-width:100%}.page.sheet .it svg{max-height:none;max-width:100%}
  .page.sheet .ft{margin-top:8px;font-size:10.5px}
  .page.sheet .turn{text-align:right;font-size:9px;color:#666;margin-top:6px}
  .page.one .half{flex:none}
  .page.one{height:auto;min-height:10.3in;overflow:visible}
  .page.one .it svg{max-height:2.3in;max-width:3.2in;width:auto;height:auto}
  .page.one .it{page-break-inside:avoid}
  .page.one .ft{margin-top:8px;font-size:10px}
  .cut{border-top:1px dashed #888;margin:6px 0}
  .half > *{flex:none}
  .hd{display:flex;justify-content:space-between;align-items:baseline;border-bottom:1.5px solid #222;padding-bottom:2px}
  .hd .t{font-weight:700;font-size:1.25em}.hd .id{font-weight:700;font-size:1.15em;letter-spacing:.04em}
  .meta{display:flex;justify-content:space-between;font-size:.86em;margin:4px 0 6px;line-height:1.4}
  .scale{border:1px solid #333;padding:5px 7px;margin-bottom:8px;font-size:.86em}
  .page.one .scale{font-size:.9em}
  .scale .goal{margin-bottom:2px}.dim{color:#666}
  table.sc{border-collapse:collapse;width:100%;margin-top:3px}table.sc td{border-top:1px solid #ccc;padding:2px 6px;line-height:1.3}
  table.sc td.n{width:16px;font-weight:700;text-align:center;border-right:1px solid #ccc}
  .items{display:block}
  .it{border:1px solid #333;margin-top:-1px;padding:6px 8px 8px;font-size:1em;line-height:1.45}
  .page.one .it{min-height:1.35in}.page.two .it{min-height:1.1in}.page.one .items.small .it{min-height:0}
  .items.small .it{font-size:.9em}
  .it .qt b{margin-right:4px}.it .opts{display:grid;grid-template-columns:1fr 1fr;gap:3px 14px;margin:6px 0 0 18px}.it .opt{display:flex;gap:4px}
  .it table.ftab{font-size:.9em;margin:3px 0}
  .it svg{max-height:1.05in;max-width:2.6in}
  .ft{font-size:.9em;font-weight:700;margin-top:6px}
  .page.four{display:grid;grid-template-columns:1fr 1fr;grid-template-rows:1fr 1fr;gap:10px}
  .quarter{border:1px dashed #999;padding:4px 6px;display:flex;flex-direction:column;min-height:0;overflow:hidden}
  .page.key h2{font-size:14px;margin:0 0 2px}.page.key h3{font-size:11px;margin:10px 0 3px;border-bottom:1px solid #999}
  .page.key .ki{font-size:.95em;padding:4px 0;border-bottom:1px dotted #ccc;line-height:1.4}
  .page.key .an{font-weight:700;color:#111 !important}.page.key .an *{color:#111 !important}.page.key .st{color:#444;font-size:.86em;margin-left:18px}
  .tag{font-size:8px;border:1px solid #999;padding:0 3px;margin-right:4px;color:#444}
  .page.cover h1,.page h1{font-size:18px;margin:0 0 6px}.page.cover p{font-size:10px;line-height:1.5}.rbox{border:1px solid #333;padding:5px 8px;margin-bottom:8px;font-size:10px}.page.cover ul{padding-left:18px}.page.cover h3{font-size:12px;margin:12px 0 4px}.page.cover ol{font-size:9.5px;line-height:1.5;padding-left:18px;margin:0}.page.cover li{margin-bottom:3px}
  table.idx,table.lib{border-collapse:collapse;width:100%;font-size:.68em;line-height:1.35}
  table.idx td,table.idx th,table.lib td,table.lib th{border:1px solid #999;padding:2px 5px;vertical-align:top;text-align:left}
  table.idx th,table.lib th{background:#222;color:#fff}
  table.lib td{font-size:.88em;line-height:1.3}
  .katex{font-size:1em}
  `;
  await p.evaluate(({ html, css }) => {
    const st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);
    const d = document.createElement('div'); d.id = 'dpp'; d.innerHTML = html; document.body.appendChild(d);
    document.body.classList.remove('inking');
  }, { html, css });
  fs.writeFileSync('plan_drawn.json', JSON.stringify(await p.evaluate(() => window.__PLAN)));
  fs.writeFileSync('items_dump.json', JSON.stringify(await p.evaluate(() => window.__ITEMS), null, 1));
  await p.emulateMedia({ media: 'print' });
  await p.waitForTimeout(500);
  await p.evaluate(() => {
    // Split each check across its two pages so the two pages are as even as possible; if the pair still
    // does not fit, shrink both pages together (font and figure width) until it does.
    document.querySelectorAll('.page.sheet.front').forEach(front => {
      const back = front.nextElementSibling;
      const fi = front.querySelector('.items'), bi = back.querySelector('.items');
      const all = [...fi.children, ...bi.children];
      const natural = () => { fi.classList.remove('fill'); bi.classList.remove('fill'); all.forEach(e => { e.style.minHeight = '0'; }); };
      const fill = () => { fi.classList.add('fill'); bi.classList.add('fill'); all.forEach(e => { e.style.minHeight = ''; }); };
      const fixedF = () => [...front.children].filter(e => !e.classList.contains('items')).reduce((a, e) => a + e.offsetHeight, 0);
      const fixedB = () => [...back.children].filter(e => !e.classList.contains('items')).reduce((a, e) => a + e.offsetHeight, 0);
      const avail = front.clientHeight;
      for (let step = 0; step < 8; step++) {
        natural();
        all.forEach(e => fi.appendChild(e));            // everything on the front to measure
        const h = all.map(e => e.offsetHeight);
        const fF = fixedF(), fB = fixedB();
        let bestK = 1, bestMax = Infinity;
        for (let k = 1; k < all.length; k++) {
          const f = fF + h.slice(0, k).reduce((a, x) => a + x, 0), bb = fB + h.slice(k).reduce((a, x) => a + x, 0);
          const m = Math.max(f, bb); if (m < bestMax) { bestMax = m; bestK = k; }
        }
        all.slice(bestK).forEach(e => bi.appendChild(e));
        if (bestMax <= avail - 4) break;
        // figures shrink first (3.4in down to 1.9in), then the type (never below 76%)
        const figw = [3.0, 2.6, 2.2, 1.9, 1.9, 1.9, 1.9, 1.9][step], font = [100, 100, 100, 100, 92, 84, 76, 76][step];
        [front, back].forEach(pg => { pg.style.fontSize = font + '%'; pg.style.setProperty('--figw', figw + 'in'); });
      }
      fill();
    });
  });
  const dbg = await p.evaluate(() => { const bad=[]; const over=pg=>pg.scrollHeight>pg.clientHeight+2||[...pg.querySelectorAll('.it,.half')].some(e=>e.scrollHeight>e.clientHeight+2); document.querySelectorAll('.page:not(.one)').forEach((pg,i)=>{ let tries=0; while(over(pg) && tries<6){ if(pg.classList.contains('two') && tries>=2){ pg.classList.add('single'); const hs=pg.querySelectorAll('.half'); if(hs.length>1) hs[1].remove(); const c=pg.querySelector('.cut'); if(c) c.remove(); pg.style.fontSize=''; pg.querySelectorAll('.it').forEach(e=>e.style.minHeight=''); break; } pg.style.fontSize=(100-8*(tries+1))+'%'; pg.querySelectorAll('.it').forEach(e=>e.style.minHeight='0'); if(!pg.classList.contains('sheet')) pg.querySelectorAll('.it svg').forEach(e=>{e.style.maxHeight=(1.05-0.15*(tries+1))+'in';e.style.maxWidth=(2.6-0.3*(tries+1))+'in'}); else pg.querySelectorAll('.it svg').forEach(e=>{e.style.maxHeight=Math.max(1.9,2.6-0.2*(tries+1))+'in';e.style.maxWidth=Math.max(2.6,3.4-0.2*(tries+1))+'in'}); tries++; } if(over(pg)) bad.push([i, pg.querySelector('.id')?pg.querySelector('.id').textContent:pg.querySelector('h1,h2')?.textContent, pg.scrollHeight, pg.clientHeight]); }); return bad; });
  console.log(JSON.stringify(dbg));
  const dbg3 = await p.evaluate(() => { const f=document.querySelector('.page.sheet.front[data-sheet="C-AR.4.3"]'), b=f.nextElementSibling; const h=e=>[...e.querySelectorAll('.it')].map(x=>[x.offsetHeight, x.scrollHeight, (x.querySelector('svg')||{}).offsetHeight||0, (x.querySelector('svg')||{}).offsetWidth||0]); return {front:[f.scrollHeight,f.clientHeight,h(f)], back:[b.scrollHeight,b.clientHeight,h(b)], scale: f.querySelector('.scale').offsetHeight, hd: f.querySelector('.hd').offsetHeight}; }); console.log('AR43', JSON.stringify(dbg3));
  const dbg2 = await p.evaluate(() => { const pg=[...document.querySelectorAll('.page.two')].find(x=>/C-AR\.4\.4-R/.test(x.textContent)); const h=pg.querySelector('.half'); const it=h.querySelector('.items'); const ft=h.querySelector('.ft'); return {pg:[pg.scrollHeight,pg.clientHeight], half:[h.scrollHeight,h.clientHeight], items:[it.scrollHeight,it.clientHeight], ft:[ft.offsetTop, ft.offsetHeight, h.offsetHeight], font:pg.style.fontSize, cls:pg.className}; });
  console.log('AR41', JSON.stringify(dbg2));
  await p.pdf({ path: 'DPP_Check_Bank_v1.pdf', format: 'Letter', printBackground: true, displayHeaderFooter: true, headerTemplate: '<span></span>', footerTemplate: '<div style="width:100%;text-align:right;font-size:7px;font-family:Arial;color:#777;padding-right:0.35in">DPP Check Bank &middot; p. <span class="pageNumber"></span></div>', margin: { top: '0.35in', bottom: '0.45in', left: '0.35in', right: '0.35in' } });
  await b.close();
  console.log('done');
})();
